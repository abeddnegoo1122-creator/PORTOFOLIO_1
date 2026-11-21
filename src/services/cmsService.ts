import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  AchievementItem,
  ContactLinkItem,
  DeckCard,
  DEFAULT_PORTFOLIO_BUNDLE,
  EducationItem,
  ExperienceItem,
  PortfolioProfileData,
  ProjectItem,
} from '../data/portfolio';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export type CmsCollectionName =
  | 'projects'
  | 'education'
  | 'experiences'
  | 'achievements'
  | 'deck_cards'
  | 'contact_links';

const clampStr = (val: string, max: number): string => val.trim().slice(0, max);

const clampList = (items: string[], maxItems: number, maxLen: number): string[] =>
  items
    .map((item) => item.trim().slice(0, maxLen))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);

export const sanitizeId = (raw: string): string => {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return cleaned || `item-${Date.now()}`;
};

export interface PortfolioSnapshotCallbacks {
  onProfile: (profile: PortfolioProfileData | null) => void;
  onProjects: (items: ProjectItem[]) => void;
  onEducation: (items: EducationItem[]) => void;
  onExperiences: (items: ExperienceItem[]) => void;
  onAchievements: (items: AchievementItem[]) => void;
  onDeckCards: (items: DeckCard[]) => void;
  onContactLinks: (items: ContactLinkItem[]) => void;
  onCloudStatus?: (hasCloudDocs: boolean) => void;
}

export function subscribePortfolioData(
  isAdminMode: boolean,
  callbacks: PortfolioSnapshotCallbacks
): () => void {
  const unsubscribers: (() => void)[] = [];

  // 1. Public profile document
  const profilePath = 'portfolio_profile/public';
  unsubscribers.push(
    onSnapshot(
      doc(db, 'portfolio_profile', 'public'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          callbacks.onProfile({
            displayName: String(d.displayName || ''),
            shortName: String(d.shortName || ''),
            roleSummary: String(d.roleSummary || ''),
            location: String(d.location || ''),
            academicStatus: String(d.academicStatus || ''),
            publicEmail: String(d.publicEmail || ''),
            bio: String(d.bio || ''),
            cardId: String(d.cardId || ''),
            statusLabel: String(d.statusLabel || ''),
            heroHeadline: String(d.heroHeadline || ''),
            contactHeadline: String(d.contactHeadline || ''),
            portraitUrl: String(d.portraitUrl || ''),
            technicalStack: Array.isArray(d.technicalStack) ? d.technicalStack.map(String) : [],
            humanSkills: Array.isArray(d.humanSkills) ? d.humanSkills.map(String) : [],
            careerFocus: Array.isArray(d.careerFocus) ? d.careerFocus.map(String) : [],
          });
          callbacks.onCloudStatus?.(true);
        } else {
          callbacks.onProfile(null);
          callbacks.onCloudStatus?.(false);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, profilePath)
    )
  );

  const subscribeCollection = <T extends { order: number }>(
    colName: CmsCollectionName,
    mapper: (id: string, data: Record<string, unknown>) => T,
    setter: (items: T[]) => void
  ) => {
    const q = isAdminMode
      ? collection(db, colName)
      : query(collection(db, colName), where('published', '==', true));

    unsubscribers.push(
      onSnapshot(
        q,
        (snap) => {
          const items = snap.docs
            .map((d) => mapper(d.id, d.data() as Record<string, unknown>))
            .sort((a, b) => a.order - b.order);
          setter(items);
        },
        (err) => handleFirestoreError(err, OperationType.LIST, colName)
      )
    );
  };

  subscribeCollection<ProjectItem>(
    'projects',
    (id, d) => ({
      id,
      meta: String(d.meta || ''),
      title: String(d.title || ''),
      description: String(d.description || ''),
      command: String(d.command || ''),
      code: String(d.code || ''),
      tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
      repoUrl: String(d.repoUrl || ''),
      theme: d.theme === 'dark' ? 'dark' : 'light',
      demoMode:
        d.demoMode === 'date-time' || d.demoMode === 'menu-pilihan' ? d.demoMode : 'none',
      order: Number(d.order ?? 0),
      published: Boolean(d.published),
    }),
    callbacks.onProjects
  );

  subscribeCollection<EducationItem>(
    'education',
    (id, d) => ({
      id,
      period: String(d.period || ''),
      rightBadge: String(d.rightBadge || ''),
      degree: String(d.degree || ''),
      institution: String(d.institution || ''),
      isSchoolIcon: Boolean(d.isSchoolIcon),
      order: Number(d.order ?? 0),
      published: Boolean(d.published),
    }),
    callbacks.onEducation
  );

  subscribeCollection<ExperienceItem>(
    'experiences',
    (id, d) => ({
      id,
      period: String(d.period || ''),
      role: String(d.role || ''),
      organization: String(d.organization || ''),
      order: Number(d.order ?? 0),
      published: Boolean(d.published),
    }),
    callbacks.onExperiences
  );

  subscribeCollection<AchievementItem>(
    'achievements',
    (id, d) => ({
      id,
      number: String(d.number || ''),
      title: String(d.title || ''),
      description: String(d.description || ''),
      order: Number(d.order ?? 0),
      published: Boolean(d.published),
    }),
    callbacks.onAchievements
  );

  subscribeCollection<DeckCard>(
    'deck_cards',
    (id, d) => ({
      id,
      indexLabel: String(d.indexLabel || ''),
      topRightLabel: String(d.topRightLabel || ''),
      title: String(d.title || ''),
      tagline: String(d.tagline || ''),
      variant:
        d.variant === 'dark-neural' ||
        d.variant === 'forest-emblem' ||
        d.variant === 'portrait' ||
        d.variant === 'light-grid' ||
        d.variant === 'dark-lens'
          ? d.variant
          : 'light-grid',
      sectionTarget: String(d.sectionTarget || '#about'),
      order: Number(d.order ?? 0),
      published: Boolean(d.published),
    }),
    callbacks.onDeckCards
  );

  subscribeCollection<ContactLinkItem>(
    'contact_links',
    (id, d) => ({
      id,
      label: String(d.label || ''),
      href: String(d.href || ''),
      external: Boolean(d.external),
      order: Number(d.order ?? 0),
      published: Boolean(d.published),
    }),
    callbacks.onContactLinks
  );

  return () => {
    for (const unsub of unsubscribers) {
      unsub();
    }
  };
}

export async function saveProfileConfig(
  profile: PortfolioProfileData,
  ownerId: string
): Promise<void> {
  const docRef = doc(db, 'portfolio_profile', 'public');
  const payload = {
    displayName: clampStr(profile.displayName, 100) || 'Abednego Sinaga',
    shortName: clampStr(profile.shortName, 50) || 'ABEDNEGO SINAGA',
    roleSummary: clampStr(profile.roleSummary, 120) || 'SOFTWARE ENG · DATA · AI',
    location: clampStr(profile.location, 120) || 'Jakarta, Indonesia',
    academicStatus: clampStr(profile.academicStatus, 140) || 'Informatics Engineering',
    publicEmail: clampStr(profile.publicEmail, 120) || 'abeddnegoo1122@gmail.com',
    bio: clampStr(profile.bio, 1000) || 'Portfolio biography.',
    cardId: clampStr(profile.cardId, 32) || 'ID // 01',
    statusLabel: clampStr(profile.statusLabel, 32) || 'ACTIVE',
    heroHeadline: clampStr(profile.heroHeadline, 40) || 'PORTFOLIO',
    contactHeadline: clampStr(profile.contactHeadline, 80) || "LET'S WORK TOGETHER",
    portraitUrl: clampStr(profile.portraitUrl, 600),
    technicalStack: clampList(profile.technicalStack, 20, 60),
    humanSkills: clampList(profile.humanSkills, 20, 80),
    careerFocus: clampList(profile.careerFocus, 10, 80),
    updatedAt: serverTimestamp(),
  };

  try {
    const existingSnap = await getDoc(docRef);
    if (existingSnap.exists()) {
      await updateDoc(docRef, payload);
    } else {
      await setDoc(docRef, {
        ownerId: clampStr(ownerId, 128),
        ...payload,
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'portfolio_profile/public');
  }
}

async function upsertCollectionDoc(
  colName: CmsCollectionName,
  id: string,
  ownerId: string,
  fields: Record<string, unknown>
): Promise<void> {
  const safeId = sanitizeId(id);
  const path = `${colName}/${safeId}`;
  const ref = doc(db, colName, safeId);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, {
        ...fields,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        ownerId: clampStr(ownerId, 128),
        ...fields,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteCmsItem(colName: CmsCollectionName, id: string): Promise<void> {
  const path = `${colName}/${id}`;
  try {
    await deleteDoc(doc(db, colName, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function saveProjectItem(item: ProjectItem, ownerId: string): Promise<void> {
  await upsertCollectionDoc('projects', item.id, ownerId, {
    title: clampStr(item.title, 100) || 'UNTITLED PROJECT',
    meta: clampStr(item.meta, 100) || '2026 · PROJECT',
    description: clampStr(item.description, 500) || 'Project description.',
    command: clampStr(item.command, 100) || './run',
    code: item.code.slice(0, 2000) || '// code',
    tags: clampList(item.tags, 8, 40),
    repoUrl: clampStr(item.repoUrl, 300),
    theme: item.theme === 'dark' ? 'dark' : 'light',
    demoMode: item.demoMode,
    order: Math.max(0, Math.min(9999, Math.round(item.order))),
    published: Boolean(item.published),
  });
}

export async function saveEducationItem(item: EducationItem, ownerId: string): Promise<void> {
  await upsertCollectionDoc('education', item.id, ownerId, {
    period: clampStr(item.period, 60) || '2026',
    degree: clampStr(item.degree, 120) || 'Degree',
    institution: clampStr(item.institution, 140) || 'Institution',
    rightBadge: clampStr(item.rightBadge, 40),
    isSchoolIcon: Boolean(item.isSchoolIcon),
    order: Math.max(0, Math.min(9999, Math.round(item.order))),
    published: Boolean(item.published),
  });
}

export async function saveExperienceItem(item: ExperienceItem, ownerId: string): Promise<void> {
  await upsertCollectionDoc('experiences', item.id, ownerId, {
    period: clampStr(item.period, 60) || '2026',
    role: clampStr(item.role, 120) || 'ROLE',
    organization: clampStr(item.organization, 140) || 'Organization',
    order: Math.max(0, Math.min(9999, Math.round(item.order))),
    published: Boolean(item.published),
  });
}

export async function saveAchievementItem(item: AchievementItem, ownerId: string): Promise<void> {
  await upsertCollectionDoc('achievements', item.id, ownerId, {
    number: clampStr(item.number, 12) || '01',
    title: clampStr(item.title, 100) || 'Achievement',
    description: clampStr(item.description, 360) || 'Achievement details.',
    order: Math.max(0, Math.min(9999, Math.round(item.order))),
    published: Boolean(item.published),
  });
}

export async function saveDeckCardItem(item: DeckCard, ownerId: string): Promise<void> {
  await upsertCollectionDoc('deck_cards', item.id, ownerId, {
    indexLabel: clampStr(item.indexLabel, 24) || '01',
    topRightLabel: clampStr(item.topRightLabel, 24) || '✦',
    title: clampStr(item.title, 40) || 'CARD',
    tagline: clampStr(item.tagline, 140) || 'INDEX // CARD',
    variant: item.variant,
    sectionTarget: clampStr(item.sectionTarget, 40) || '#about',
    order: Math.max(0, Math.min(9999, Math.round(item.order))),
    published: Boolean(item.published),
  });
}

export async function saveContactLinkItem(item: ContactLinkItem, ownerId: string): Promise<void> {
  await upsertCollectionDoc('contact_links', item.id, ownerId, {
    label: clampStr(item.label, 40) || 'LINK ↗',
    href: clampStr(item.href, 300) || 'https://',
    external: Boolean(item.external),
    order: Math.max(0, Math.min(9999, Math.round(item.order))),
    published: Boolean(item.published),
  });
}

export async function seedDefaultPortfolioToFirestore(ownerId: string): Promise<void> {
  const batch = writeBatch(db);
  const now = serverTimestamp() as unknown as Timestamp;
  const uid = clampStr(ownerId, 128);

  batch.set(doc(db, 'portfolio_profile', 'public'), {
    ownerId: uid,
    ...DEFAULT_PORTFOLIO_BUNDLE.profile,
    updatedAt: now,
  });

  for (const p of DEFAULT_PORTFOLIO_BUNDLE.projects) {
    batch.set(doc(db, 'projects', p.id), {
      ownerId: uid,
      title: p.title,
      meta: p.meta,
      description: p.description,
      command: p.command,
      code: p.code,
      tags: p.tags,
      repoUrl: p.repoUrl,
      theme: p.theme,
      demoMode: p.demoMode,
      order: p.order,
      published: p.published,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const edu of DEFAULT_PORTFOLIO_BUNDLE.education) {
    batch.set(doc(db, 'education', edu.id), {
      ownerId: uid,
      period: edu.period,
      degree: edu.degree,
      institution: edu.institution,
      rightBadge: edu.rightBadge,
      isSchoolIcon: edu.isSchoolIcon,
      order: edu.order,
      published: edu.published,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const exp of DEFAULT_PORTFOLIO_BUNDLE.experiences) {
    batch.set(doc(db, 'experiences', exp.id), {
      ownerId: uid,
      period: exp.period,
      role: exp.role,
      organization: exp.organization,
      order: exp.order,
      published: exp.published,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const ach of DEFAULT_PORTFOLIO_BUNDLE.achievements) {
    batch.set(doc(db, 'achievements', ach.id), {
      ownerId: uid,
      number: ach.number,
      title: ach.title,
      description: ach.description,
      order: ach.order,
      published: ach.published,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const card of DEFAULT_PORTFOLIO_BUNDLE.deckCards) {
    batch.set(doc(db, 'deck_cards', card.id), {
      ownerId: uid,
      indexLabel: card.indexLabel,
      topRightLabel: card.topRightLabel,
      title: card.title,
      tagline: card.tagline,
      variant: card.variant,
      sectionTarget: card.sectionTarget,
      order: card.order,
      published: card.published,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const link of DEFAULT_PORTFOLIO_BUNDLE.contactLinks) {
    batch.set(doc(db, 'contact_links', link.id), {
      ownerId: uid,
      label: link.label,
      href: link.href,
      external: link.external,
      order: link.order,
      published: link.published,
      createdAt: now,
      updatedAt: now,
    });
  }

  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'batch_seed_portfolio');
  }
}
