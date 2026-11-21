import React, { useEffect, useState } from 'react';
import { signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import {
  Check,
  CloudUpload,
  Download,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import {
  AchievementItem,
  ContactLinkItem,
  DeckCard,
  EducationItem,
  ExperienceItem,
  PortfolioDataBundle,
  PortfolioProfileData,
  ProjectItem,
} from '../data/portfolio';
import { ADMIN_EMAIL, auth, googleProvider } from '../lib/firebase';
import {
  CmsCollectionName,
  deleteCmsItem,
  sanitizeId,
  saveAchievementItem,
  saveContactLinkItem,
  saveDeckCardItem,
  saveEducationItem,
  saveExperienceItem,
  saveProfileConfig,
  saveProjectItem,
  seedDefaultPortfolioToFirestore,
} from '../services/cmsService';

type CmsTab =
  | 'profile'
  | 'deck'
  | 'projects'
  | 'education'
  | 'experience'
  | 'achievements'
  | 'contact';

interface CmsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: FirebaseUser | null;
  hasCloudData: boolean;
  data: PortfolioDataBundle;
}

export const CmsDrawer: React.FC<CmsDrawerProps> = ({
  isOpen,
  onClose,
  user,
  hasCloudData,
  data,
}) => {
  const [activeTab, setActiveTab] = useState<CmsTab>('profile');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState<PortfolioProfileData>(data.profile);
  const [newTechSkill, setNewTechSkill] = useState('');
  const [newHumanSkill, setNewHumanSkill] = useState('');
  const [newCareerFocus, setNewCareerFocus] = useState('');

  // Item editor states
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectTagsText, setProjectTagsText] = useState('');
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<AchievementItem | null>(null);
  const [editingDeckCard, setEditingDeckCard] = useState<DeckCard | null>(null);
  const [editingContact, setEditingContact] = useState<ContactLinkItem | null>(null);

  useEffect(() => {
    setProfileForm(data.profile);
  }, [data.profile]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isVerifiedAdmin = Boolean(
    user && user.email === ADMIN_EMAIL && user.emailVerified
  );
  const adminUid = user?.uid ?? '';

  const notify = (type: 'ok' | 'err', text: string) => {
    setFeedback({ type, text });
    if (type === 'ok') {
      window.setTimeout(() => setFeedback(null), 2800);
    }
  };

  const handleGoogleSignIn = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      await signInWithPopup(auth, googleProvider);
      notify('ok', 'Signed in with Google.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    notify('ok', 'Signed out.');
  };

  const handleSeedDefaults = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await seedDefaultPortfolioToFirestore(user.uid);
      notify('ok', 'Default portfolio synced to Cloud Firestore.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to seed data.');
    } finally {
      setBusy(false);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('ok', 'Exported CMS JSON backup.');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      await saveProfileConfig(profileForm, user.uid);
      notify('ok', 'Profile & Skills saved to Firestore.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (colName: CmsCollectionName, id: string) => {
    const key = `${colName}:${id}`;
    if (confirmDeleteKey !== key) {
      setConfirmDeleteKey(key);
      return;
    }
    setBusy(true);
    try {
      await deleteCmsItem(colName, id);
      setConfirmDeleteKey(null);
      notify('ok', 'Entry deleted.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setBusy(false);
    }
  };

  const tabList: { id: CmsTab; label: string }[] = [
    { id: 'profile', label: 'PROFILE & SKILLS' },
    { id: 'deck', label: 'HERO DECK' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'education', label: 'EDUCATION' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'achievements', label: 'ACHIEVEMENTS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cms-drawer-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        data-cursor-surface="dark"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl h-full bg-[#141414] text-white border-l border-[#2E2E2E] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Studio Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1A1A] border-b border-[#2E2E2E] shrink-0">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#6ed5e7]">
              FIRESTORE CMS // {hasCloudData ? 'CLOUD SYNCED' : 'LOCAL DEFAULTS'}
            </span>
            <h2
              id="cms-drawer-title"
              className="font-display text-xl font-extrabold uppercase tracking-tight"
            >
              PORTFOLIO CMS STUDIO
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              title="Export CMS Backup JSON"
              className="px-3 py-1.5 rounded bg-[#141414] hover:bg-[#2E2E2E] border border-[#2E2E2E] font-mono text-[10px] font-bold tracking-[0.12em] uppercase inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={12} />
              EXPORT
            </button>
            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded bg-[#141414] hover:bg-[#2E2E2E] border border-[#2E2E2E] font-mono text-[10px] font-bold tracking-[0.12em] uppercase inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut size={12} />
                SIGN OUT
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close CMS Studio"
              className="w-8 h-8 rounded bg-[#141414] hover:bg-[#133926] border border-[#2E2E2E] flex items-center justify-center cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Auth Gate or CMS Workspace */}
        {!isVerifiedAdmin ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center gap-6">
            <div className="max-w-md bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-8 flex flex-col items-center gap-4">
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#6ed5e7]">
                AUTHENTICATION REQUIRED
              </span>
              <h3 className="font-display text-2xl font-bold uppercase">
                ADMIN ACCESS ONLY
              </h3>
              <p className="font-sans text-sm text-[#E6E6E6]/75 leading-relaxed">
                Sign in with the verified portfolio owner Google account ({ADMIN_EMAIL}) to create, edit, publish, or delete content in Cloud Firestore.
              </p>

              {user && user.email !== ADMIN_EMAIL && (
                <div className="w-full p-3 rounded bg-[#2E1A1A] border border-[#ffb4aa]/30 font-mono text-xs text-[#ffb4aa]">
                  Signed in as {user.email}. Only {ADMIN_EMAIL} has write permissions.
                </div>
              )}

              <button
                type="button"
                disabled={busy}
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-5 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-xs font-bold tracking-[0.14em] uppercase inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <LogIn size={15} />
                SIGN IN WITH GOOGLE
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cloud Seed Banner if Firestore empty */}
            {!hasCloudData && (
              <div className="px-6 py-3 bg-[#133926] border-b border-[#2E2E2E] flex flex-wrap items-center justify-between gap-3 shrink-0">
                <span className="font-mono text-[11px] font-bold tracking-[0.1em] uppercase text-white">
                  CLOUD DATABASE IS EMPTY — SYNC DEFAULT CONTENT TO EDIT EXISTING ITEMS
                </span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleSeedDefaults}
                  className="px-3.5 py-1.5 rounded bg-[#111111] hover:bg-black text-white font-mono text-[10px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CloudUpload size={13} />
                  SYNC DEFAULTS TO CLOUD
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-1.5 px-6 py-3 bg-[#1A1A1A] border-b border-[#2E2E2E] overflow-x-auto shrink-0">
              {tabList.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setConfirmDeleteKey(null);
                  }}
                  className={`px-3 py-1.5 rounded font-mono text-[10px] font-bold tracking-[0.12em] uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#133926] text-white'
                      : 'bg-[#141414] text-[#E6E6E6]/70 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Feedback Banner */}
            {feedback && (
              <div
                className={`px-6 py-2.5 font-mono text-[11px] font-bold tracking-[0.12em] uppercase flex items-center justify-between shrink-0 ${
                  feedback.type === 'ok'
                    ? 'bg-[#133926]/80 text-[#6ed5e7]'
                    : 'bg-[#410001] text-[#ffb4aa]'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {feedback.type === 'ok' && <Check size={13} />}
                  {feedback.text}
                </span>
                <button
                  type="button"
                  onClick={() => setFeedback(null)}
                  className="text-white/70 hover:text-white cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            {/* Main Scrollable Studio Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldInput
                      label="DISPLAY NAME"
                      value={profileForm.displayName}
                      onChange={(v) => setProfileForm({ ...profileForm, displayName: v })}
                    />
                    <FieldInput
                      label="HERO SHORT NAME"
                      value={profileForm.shortName}
                      onChange={(v) => setProfileForm({ ...profileForm, shortName: v })}
                    />
                    <FieldInput
                      label="ROLE SUMMARY"
                      value={profileForm.roleSummary}
                      onChange={(v) => setProfileForm({ ...profileForm, roleSummary: v })}
                    />
                    <FieldInput
                      label="BASE / LOCATION"
                      value={profileForm.location}
                      onChange={(v) => setProfileForm({ ...profileForm, location: v })}
                    />
                    <FieldInput
                      label="ACADEMIC STATUS"
                      value={profileForm.academicStatus}
                      onChange={(v) => setProfileForm({ ...profileForm, academicStatus: v })}
                    />
                    <FieldInput
                      label="PUBLIC EMAIL"
                      value={profileForm.publicEmail}
                      onChange={(v) => setProfileForm({ ...profileForm, publicEmail: v })}
                    />
                    <FieldInput
                      label="HERO HEADLINE"
                      value={profileForm.heroHeadline}
                      onChange={(v) => setProfileForm({ ...profileForm, heroHeadline: v })}
                    />
                    <FieldInput
                      label="CONTACT HEADLINE"
                      value={profileForm.contactHeadline}
                      onChange={(v) => setProfileForm({ ...profileForm, contactHeadline: v })}
                    />
                    <FieldInput
                      label="CARD ID"
                      value={profileForm.cardId}
                      onChange={(v) => setProfileForm({ ...profileForm, cardId: v })}
                    />
                    <FieldInput
                      label="STATUS LABEL"
                      value={profileForm.statusLabel}
                      onChange={(v) => setProfileForm({ ...profileForm, statusLabel: v })}
                    />
                  </div>

                  <FieldInput
                    label="PORTRAIT IMAGE URL"
                    value={profileForm.portraitUrl}
                    onChange={(v) => setProfileForm({ ...profileForm, portraitUrl: v })}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#6ed5e7]">
                      BIOGRAPHY
                    </label>
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded bg-[#1A1A1A] border border-[#2E2E2E] text-white font-sans text-sm focus:outline-none focus:border-[#1B4D3E]"
                    />
                  </div>

                  {/* Skill List Editors */}
                  <ListChipEditor
                    label="01 // TECHNICAL STACK"
                    items={profileForm.technicalStack}
                    draft={newTechSkill}
                    onDraftChange={setNewTechSkill}
                    onAdd={() => {
                      if (!newTechSkill.trim()) return;
                      setProfileForm({
                        ...profileForm,
                        technicalStack: [...profileForm.technicalStack, newTechSkill.trim()],
                      });
                      setNewTechSkill('');
                    }}
                    onRemove={(idx) =>
                      setProfileForm({
                        ...profileForm,
                        technicalStack: profileForm.technicalStack.filter((_, i) => i !== idx),
                      })
                    }
                  />

                  <ListChipEditor
                    label="02 // HUMAN & COLLABORATION"
                    items={profileForm.humanSkills}
                    draft={newHumanSkill}
                    onDraftChange={setNewHumanSkill}
                    onAdd={() => {
                      if (!newHumanSkill.trim()) return;
                      setProfileForm({
                        ...profileForm,
                        humanSkills: [...profileForm.humanSkills, newHumanSkill.trim()],
                      });
                      setNewHumanSkill('');
                    }}
                    onRemove={(idx) =>
                      setProfileForm({
                        ...profileForm,
                        humanSkills: profileForm.humanSkills.filter((_, i) => i !== idx),
                      })
                    }
                  />

                  <ListChipEditor
                    label="03 // CAREER FOCUS"
                    items={profileForm.careerFocus}
                    draft={newCareerFocus}
                    onDraftChange={setNewCareerFocus}
                    onAdd={() => {
                      if (!newCareerFocus.trim()) return;
                      setProfileForm({
                        ...profileForm,
                        careerFocus: [...profileForm.careerFocus, newCareerFocus.trim()],
                      });
                      setNewCareerFocus('');
                    }}
                    onRemove={(idx) =>
                      setProfileForm({
                        ...profileForm,
                        careerFocus: profileForm.careerFocus.filter((_, i) => i !== idx),
                      })
                    }
                  />

                  <button
                    type="submit"
                    disabled={busy}
                    className="self-start px-6 py-3 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-xs font-bold tracking-[0.14em] uppercase inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save size={14} />
                    SAVE PROFILE &amp; SKILLS
                  </button>
                </form>
              )}

              {activeTab === 'projects' && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-[#E6E6E6]/70">
                      {data.projects.length} PROJECTS
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject({
                          id: `project-${Date.now()}`,
                          meta: '2026 · PROJECT',
                          title: '',
                          description: '',
                          command: './run',
                          code: '',
                          tags: ['TypeScript'],
                          repoUrl: '',
                          theme: 'light',
                          demoMode: 'none',
                          order: data.projects.length,
                          published: true,
                        });
                        setProjectTagsText('TypeScript');
                      }}
                      className="px-3.5 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> NEW PROJECT
                    </button>
                  </div>

                  {editingProject && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setBusy(true);
                        try {
                          const tags = projectTagsText
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean);
                          await saveProjectItem({ ...editingProject, tags }, adminUid);
                          setEditingProject(null);
                          notify('ok', 'Project saved.');
                        } catch (err) {
                          notify('err', err instanceof Error ? err.message : 'Save failed.');
                        } finally {
                          setBusy(false);
                        }
                      }}
                      className="bg-[#1A1A1A] border border-[#1B4D3E] rounded-xl p-5 flex flex-col gap-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FieldInput
                          label="TITLE"
                          value={editingProject.title}
                          onChange={(v) => setEditingProject({ ...editingProject, title: v })}
                        />
                        <FieldInput
                          label="META KICKER"
                          value={editingProject.meta}
                          onChange={(v) => setEditingProject({ ...editingProject, meta: v })}
                        />
                        <FieldInput
                          label="TERMINAL COMMAND"
                          value={editingProject.command}
                          onChange={(v) => setEditingProject({ ...editingProject, command: v })}
                        />
                        <FieldInput
                          label="REPOSITORY URL"
                          value={editingProject.repoUrl}
                          onChange={(v) => setEditingProject({ ...editingProject, repoUrl: v })}
                        />
                        <FieldInput
                          label="TAGS (COMMA SEPARATED)"
                          value={projectTagsText}
                          onChange={setProjectTagsText}
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <SelectField
                            label="THEME"
                            value={editingProject.theme}
                            options={[
                              { value: 'light', label: 'LIGHT' },
                              { value: 'dark', label: 'DARK' },
                            ]}
                            onChange={(v) =>
                              setEditingProject({
                                ...editingProject,
                                theme: v as 'light' | 'dark',
                              })
                            }
                          />
                          <SelectField
                            label="DEMO"
                            value={editingProject.demoMode}
                            options={[
                              { value: 'none', label: 'CODE' },
                              { value: 'date-time', label: 'DATE' },
                              { value: 'menu-pilihan', label: 'MENU' },
                            ]}
                            onChange={(v) =>
                              setEditingProject({
                                ...editingProject,
                                demoMode: v as ProjectItem['demoMode'],
                              })
                            }
                          />
                          <FieldInput
                            label="ORDER"
                            type="number"
                            value={String(editingProject.order)}
                            onChange={(v) =>
                              setEditingProject({ ...editingProject, order: Number(v) || 0 })
                            }
                          />
                        </div>
                      </div>
                      <FieldInput
                        label="DESCRIPTION"
                        value={editingProject.description}
                        onChange={(v) => setEditingProject({ ...editingProject, description: v })}
                      />
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#6ed5e7]">
                          CODE SNIPPET
                        </label>
                        <textarea
                          rows={4}
                          value={editingProject.code}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, code: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded bg-[#141414] border border-[#2E2E2E] text-[#6ed5e7] font-mono text-xs focus:outline-none focus:border-[#1B4D3E]"
                        />
                      </div>
                      <label className="inline-flex items-center gap-2 font-mono text-xs uppercase cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.published}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, published: e.target.checked })
                          }
                        />
                        PUBLISHED ON LIVE PORTFOLIO
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={busy}
                          className="px-4 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          SAVE PROJECT
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 rounded bg-[#141414] hover:bg-[#2E2E2E] font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="flex flex-col gap-2.5">
                    {data.projects.map((item) => (
                      <CmsRowCard
                        key={item.id}
                        title={item.title}
                        subtitle={`${item.meta} · ${item.theme.toUpperCase()}`}
                        published={item.published}
                        confirmingDelete={confirmDeleteKey === `projects:${item.id}`}
                        onEdit={() => {
                          setEditingProject(item);
                          setProjectTagsText(item.tags.join(', '));
                        }}
                        onTogglePublish={async () => {
                          await saveProjectItem({ ...item, published: !item.published }, adminUid);
                        }}
                        onDelete={() => handleDelete('projects', item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'deck' && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-[#E6E6E6]/70">
                      {data.deckCards.length} DECK CARDS
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingDeckCard({
                          id: `card-${Date.now()}`,
                          indexLabel: '06',
                          topRightLabel: '✦',
                          title: 'NEW CARD',
                          tagline: 'INDEX // 06 · NEW PORTFOLIO FOCUS',
                          variant: 'dark-neural',
                          sectionTarget: '#projects',
                          order: data.deckCards.length,
                          published: true,
                        })
                      }
                      className="px-3.5 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> NEW CARD
                    </button>
                  </div>

                  {editingDeckCard && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setBusy(true);
                        try {
                          await saveDeckCardItem(editingDeckCard, adminUid);
                          setEditingDeckCard(null);
                          notify('ok', 'Deck card saved.');
                        } catch (err) {
                          notify('err', err instanceof Error ? err.message : 'Save failed.');
                        } finally {
                          setBusy(false);
                        }
                      }}
                      className="bg-[#1A1A1A] border border-[#1B4D3E] rounded-xl p-5 flex flex-col gap-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FieldInput
                          label="TITLE"
                          value={editingDeckCard.title}
                          onChange={(v) => setEditingDeckCard({ ...editingDeckCard, title: v })}
                        />
                        <FieldInput
                          label="INDEX LABEL"
                          value={editingDeckCard.indexLabel}
                          onChange={(v) =>
                            setEditingDeckCard({ ...editingDeckCard, indexLabel: v })
                          }
                        />
                        <FieldInput
                          label="TOP RIGHT LABEL"
                          value={editingDeckCard.topRightLabel}
                          onChange={(v) =>
                            setEditingDeckCard({ ...editingDeckCard, topRightLabel: v })
                          }
                        />
                        <FieldInput
                          label="TARGET SECTION (#about, #projects...)"
                          value={editingDeckCard.sectionTarget}
                          onChange={(v) =>
                            setEditingDeckCard({ ...editingDeckCard, sectionTarget: v })
                          }
                        />
                        <SelectField
                          label="CARD ART VARIANT"
                          value={editingDeckCard.variant}
                          options={[
                            { value: 'dark-neural', label: 'DARK NEURAL' },
                            { value: 'forest-emblem', label: 'FOREST EMBLEM' },
                            { value: 'portrait', label: 'PORTRAIT PHOTO' },
                            { value: 'light-grid', label: 'LIGHT GRID' },
                            { value: 'dark-lens', label: 'DARK LENS' },
                          ]}
                          onChange={(v) =>
                            setEditingDeckCard({
                              ...editingDeckCard,
                              variant: v as DeckCard['variant'],
                            })
                          }
                        />
                        <FieldInput
                          label="ORDER"
                          type="number"
                          value={String(editingDeckCard.order)}
                          onChange={(v) =>
                            setEditingDeckCard({ ...editingDeckCard, order: Number(v) || 0 })
                          }
                        />
                      </div>
                      <FieldInput
                        label="FLOATING TAGLINE PILL"
                        value={editingDeckCard.tagline}
                        onChange={(v) => setEditingDeckCard({ ...editingDeckCard, tagline: v })}
                      />
                      <label className="inline-flex items-center gap-2 font-mono text-xs uppercase cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingDeckCard.published}
                          onChange={(e) =>
                            setEditingDeckCard({ ...editingDeckCard, published: e.target.checked })
                          }
                        />
                        PUBLISHED
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={busy}
                          className="px-4 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          SAVE CARD
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingDeckCard(null)}
                          className="px-4 py-2 rounded bg-[#141414] hover:bg-[#2E2E2E] font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="flex flex-col gap-2.5">
                    {data.deckCards.map((card) => (
                      <CmsRowCard
                        key={card.id}
                        title={`${card.indexLabel} · ${card.title}`}
                        subtitle={`${card.variant} → ${card.sectionTarget}`}
                        published={card.published}
                        confirmingDelete={confirmDeleteKey === `deck_cards:${card.id}`}
                        onEdit={() => setEditingDeckCard(card)}
                        onTogglePublish={async () => {
                          await saveDeckCardItem(
                            { ...card, published: !card.published },
                            adminUid
                          );
                        }}
                        onDelete={() => handleDelete('deck_cards', card.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-[#E6E6E6]/70">
                      {data.education.length} EDUCATION ENTRIES
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingEducation({
                          id: `edu-${Date.now()}`,
                          period: '2026',
                          degree: '',
                          institution: '',
                          rightBadge: '',
                          isSchoolIcon: false,
                          order: data.education.length,
                          published: true,
                        })
                      }
                      className="px-3.5 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> NEW EDUCATION
                    </button>
                  </div>

                  {editingEducation && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setBusy(true);
                        try {
                          await saveEducationItem(editingEducation, adminUid);
                          setEditingEducation(null);
                          notify('ok', 'Education saved.');
                        } catch (err) {
                          notify('err', err instanceof Error ? err.message : 'Save failed.');
                        } finally {
                          setBusy(false);
                        }
                      }}
                      className="bg-[#1A1A1A] border border-[#1B4D3E] rounded-xl p-5 flex flex-col gap-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FieldInput
                          label="DEGREE / TRACK"
                          value={editingEducation.degree}
                          onChange={(v) => setEditingEducation({ ...editingEducation, degree: v })}
                        />
                        <FieldInput
                          label="INSTITUTION"
                          value={editingEducation.institution}
                          onChange={(v) =>
                            setEditingEducation({ ...editingEducation, institution: v })
                          }
                        />
                        <FieldInput
                          label="PERIOD"
                          value={editingEducation.period}
                          onChange={(v) => setEditingEducation({ ...editingEducation, period: v })}
                        />
                        <FieldInput
                          label="SCORE / BADGE (OPTIONAL)"
                          value={editingEducation.rightBadge}
                          onChange={(v) =>
                            setEditingEducation({ ...editingEducation, rightBadge: v })
                          }
                        />
                        <FieldInput
                          label="ORDER"
                          type="number"
                          value={String(editingEducation.order)}
                          onChange={(v) =>
                            setEditingEducation({ ...editingEducation, order: Number(v) || 0 })
                          }
                        />
                      </div>
                      <div className="flex flex-wrap gap-5">
                        <label className="inline-flex items-center gap-2 font-mono text-xs uppercase cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingEducation.isSchoolIcon}
                            onChange={(e) =>
                              setEditingEducation({
                                ...editingEducation,
                                isSchoolIcon: e.target.checked,
                              })
                            }
                          />
                          SHOW GRADUATION ICON
                        </label>
                        <label className="inline-flex items-center gap-2 font-mono text-xs uppercase cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingEducation.published}
                            onChange={(e) =>
                              setEditingEducation({
                                ...editingEducation,
                                published: e.target.checked,
                              })
                            }
                          />
                          PUBLISHED
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={busy}
                          className="px-4 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          SAVE EDUCATION
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingEducation(null)}
                          className="px-4 py-2 rounded bg-[#141414] hover:bg-[#2E2E2E] font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="flex flex-col gap-2.5">
                    {data.education.map((item) => (
                      <CmsRowCard
                        key={item.id}
                        title={item.degree}
                        subtitle={`${item.period} · ${item.institution}`}
                        published={item.published}
                        confirmingDelete={confirmDeleteKey === `education:${item.id}`}
                        onEdit={() => setEditingEducation(item)}
                        onTogglePublish={async () => {
                          await saveEducationItem(
                            { ...item, published: !item.published },
                            adminUid
                          );
                        }}
                        onDelete={() => handleDelete('education', item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-[#E6E6E6]/70">
                      {data.experiences.length} EXPERIENCES
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingExperience({
                          id: `exp-${Date.now()}`,
                          period: '2026',
                          role: '',
                          organization: '',
                          order: data.experiences.length,
                          published: true,
                        })
                      }
                      className="px-3.5 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> NEW EXPERIENCE
                    </button>
                  </div>

                  {editingExperience && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setBusy(true);
                        try {
                          await saveExperienceItem(editingExperience, adminUid);
                          setEditingExperience(null);
                          notify('ok', 'Experience saved.');
                        } catch (err) {
                          notify('err', err instanceof Error ? err.message : 'Save failed.');
                        } finally {
                          setBusy(false);
                        }
                      }}
                      className="bg-[#1A1A1A] border border-[#1B4D3E] rounded-xl p-5 flex flex-col gap-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FieldInput
                          label="ROLE TITLE"
                          value={editingExperience.role}
                          onChange={(v) => setEditingExperience({ ...editingExperience, role: v })}
                        />
                        <FieldInput
                          label="ORGANIZATION"
                          value={editingExperience.organization}
                          onChange={(v) =>
                            setEditingExperience({ ...editingExperience, organization: v })
                          }
                        />
                        <FieldInput
                          label="PERIOD"
                          value={editingExperience.period}
                          onChange={(v) =>
                            setEditingExperience({ ...editingExperience, period: v })
                          }
                        />
                        <FieldInput
                          label="ORDER"
                          type="number"
                          value={String(editingExperience.order)}
                          onChange={(v) =>
                            setEditingExperience({ ...editingExperience, order: Number(v) || 0 })
                          }
                        />
                      </div>
                      <label className="inline-flex items-center gap-2 font-mono text-xs uppercase cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingExperience.published}
                          onChange={(e) =>
                            setEditingExperience({
                              ...editingExperience,
                              published: e.target.checked,
                            })
                          }
                        />
                        PUBLISHED
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={busy}
                          className="px-4 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          SAVE EXPERIENCE
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingExperience(null)}
                          className="px-4 py-2 rounded bg-[#141414] hover:bg-[#2E2E2E] font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="flex flex-col gap-2.5">
                    {data.experiences.map((item) => (
                      <CmsRowCard
                        key={item.id}
                        title={item.role}
                        subtitle={`${item.period} · ${item.organization}`}
                        published={item.published}
                        confirmingDelete={confirmDeleteKey === `experiences:${item.id}`}
                        onEdit={() => setEditingExperience(item)}
                        onTogglePublish={async () => {
                          await saveExperienceItem(
                            { ...item, published: !item.published },
                            adminUid
                          );
                        }}
                        onDelete={() => handleDelete('experiences', item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-[#E6E6E6]/70">
                      {data.achievements.length} ACHIEVEMENTS
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingAchievement({
                          id: `ach-${Date.now()}`,
                          number: String(data.achievements.length + 1).padStart(2, '0'),
                          title: '',
                          description: '',
                          order: data.achievements.length,
                          published: true,
                        })
                      }
                      className="px-3.5 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> NEW ACHIEVEMENT
                    </button>
                  </div>

                  {editingAchievement && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setBusy(true);
                        try {
                          await saveAchievementItem(editingAchievement, adminUid);
                          setEditingAchievement(null);
                          notify('ok', 'Achievement saved.');
                        } catch (err) {
                          notify('err', err instanceof Error ? err.message : 'Save failed.');
                        } finally {
                          setBusy(false);
                        }
                      }}
                      className="bg-[#1A1A1A] border border-[#1B4D3E] rounded-xl p-5 flex flex-col gap-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <FieldInput
                          label="NUMBER"
                          value={editingAchievement.number}
                          onChange={(v) =>
                            setEditingAchievement({ ...editingAchievement, number: v })
                          }
                        />
                        <FieldInput
                          label="TITLE"
                          value={editingAchievement.title}
                          onChange={(v) =>
                            setEditingAchievement({ ...editingAchievement, title: v })
                          }
                        />
                        <FieldInput
                          label="ORDER"
                          type="number"
                          value={String(editingAchievement.order)}
                          onChange={(v) =>
                            setEditingAchievement({
                              ...editingAchievement,
                              order: Number(v) || 0,
                            })
                          }
                        />
                      </div>
                      <FieldInput
                        label="DESCRIPTION"
                        value={editingAchievement.description}
                        onChange={(v) =>
                          setEditingAchievement({ ...editingAchievement, description: v })
                        }
                      />
                      <label className="inline-flex items-center gap-2 font-mono text-xs uppercase cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingAchievement.published}
                          onChange={(e) =>
                            setEditingAchievement({
                              ...editingAchievement,
                              published: e.target.checked,
                            })
                          }
                        />
                        PUBLISHED
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={busy}
                          className="px-4 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          SAVE ACHIEVEMENT
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAchievement(null)}
                          className="px-4 py-2 rounded bg-[#141414] hover:bg-[#2E2E2E] font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="flex flex-col gap-2.5">
                    {data.achievements.map((item) => (
                      <CmsRowCard
                        key={item.id}
                        title={`${item.number} · ${item.title}`}
                        subtitle={item.description}
                        published={item.published}
                        confirmingDelete={confirmDeleteKey === `achievements:${item.id}`}
                        onEdit={() => setEditingAchievement(item)}
                        onTogglePublish={async () => {
                          await saveAchievementItem(
                            { ...item, published: !item.published },
                            adminUid
                          );
                        }}
                        onDelete={() => handleDelete('achievements', item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-[#E6E6E6]/70">
                      {data.contactLinks.length} CONTACT LINKS
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingContact({
                          id: sanitizeId(`link-${Date.now()}`),
                          label: 'WEBSITE ↗',
                          href: 'https://',
                          external: true,
                          order: data.contactLinks.length,
                          published: true,
                        })
                      }
                      className="px-3.5 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> NEW LINK
                    </button>
                  </div>

                  {editingContact && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setBusy(true);
                        try {
                          await saveContactLinkItem(editingContact, adminUid);
                          setEditingContact(null);
                          notify('ok', 'Contact link saved.');
                        } catch (err) {
                          notify('err', err instanceof Error ? err.message : 'Save failed.');
                        } finally {
                          setBusy(false);
                        }
                      }}
                      className="bg-[#1A1A1A] border border-[#1B4D3E] rounded-xl p-5 flex flex-col gap-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <FieldInput
                          label="BUTTON LABEL"
                          value={editingContact.label}
                          onChange={(v) => setEditingContact({ ...editingContact, label: v })}
                        />
                        <FieldInput
                          label="URL / MAILTO"
                          value={editingContact.href}
                          onChange={(v) => setEditingContact({ ...editingContact, href: v })}
                        />
                        <FieldInput
                          label="ORDER"
                          type="number"
                          value={String(editingContact.order)}
                          onChange={(v) =>
                            setEditingContact({ ...editingContact, order: Number(v) || 0 })
                          }
                        />
                      </div>
                      <div className="flex flex-wrap gap-5">
                        <label className="inline-flex items-center gap-2 font-mono text-xs uppercase cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingContact.external}
                            onChange={(e) =>
                              setEditingContact({ ...editingContact, external: e.target.checked })
                            }
                          />
                          OPEN IN NEW TAB
                        </label>
                        <label className="inline-flex items-center gap-2 font-mono text-xs uppercase cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingContact.published}
                            onChange={(e) =>
                              setEditingContact({ ...editingContact, published: e.target.checked })
                            }
                          />
                          PUBLISHED
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={busy}
                          className="px-4 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          SAVE LINK
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingContact(null)}
                          className="px-4 py-2 rounded bg-[#141414] hover:bg-[#2E2E2E] font-mono text-[11px] font-bold uppercase cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="flex flex-col gap-2.5">
                    {data.contactLinks.map((link) => (
                      <CmsRowCard
                        key={link.id}
                        title={link.label}
                        subtitle={link.href}
                        published={link.published}
                        confirmingDelete={confirmDeleteKey === `contact_links:${link.id}`}
                        onEdit={() => setEditingContact(link)}
                        onTogglePublish={async () => {
                          await saveContactLinkItem(
                            { ...link, published: !link.published },
                            adminUid
                          );
                        }}
                        onDelete={() => handleDelete('contact_links', link.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface FieldInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

const FieldInput: React.FC<FieldInputProps> = ({ label, value, onChange, type = 'text' }) => (
  <div className="flex flex-col gap-1">
    <label className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#6ed5e7]">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-2 rounded bg-[#1A1A1A] border border-[#2E2E2E] text-white font-sans text-sm focus:outline-none focus:border-[#1B4D3E]"
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#6ed5e7]">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded bg-[#141414] border border-[#2E2E2E] text-white font-mono text-xs focus:outline-none focus:border-[#1B4D3E]"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

interface ListChipEditorProps {
  label: string;
  items: string[];
  draft: string;
  onDraftChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}

const ListChipEditor: React.FC<ListChipEditorProps> = ({
  label,
  items,
  draft,
  onDraftChange,
  onAdd,
  onRemove,
}) => (
  <div className="flex flex-col gap-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-4">
    <span className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#6ed5e7]">
      {label}
    </span>
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <span
          key={`${item}-${idx}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141414] border border-[#2E2E2E] font-mono text-[11px] uppercase"
        >
          {item}
          <button
            type="button"
            onClick={() => onRemove(idx)}
            aria-label={`Remove ${item}`}
            className="text-[#ffb4aa] hover:text-white cursor-pointer"
          >
            ×
          </button>
        </span>
      ))}
    </div>
    <div className="flex gap-2 mt-1">
      <input
        type="text"
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onAdd();
          }
        }}
        placeholder="Add item..."
        className="flex-1 px-3 py-1.5 rounded bg-[#141414] border border-[#2E2E2E] text-white font-mono text-xs focus:outline-none focus:border-[#1B4D3E]"
      />
      <button
        type="button"
        onClick={onAdd}
        className="px-3.5 py-1.5 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[10px] font-bold uppercase cursor-pointer"
      >
        ADD
      </button>
    </div>
  </div>
);

interface CmsRowCardProps {
  title: string;
  subtitle: string;
  published: boolean;
  confirmingDelete: boolean;
  onEdit: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
}

const CmsRowCard: React.FC<CmsRowCardProps> = ({
  title,
  subtitle,
  published,
  confirmingDelete,
  onEdit,
  onTogglePublish,
  onDelete,
}) => (
  <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div className="min-w-0 flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <span className="font-display text-base font-bold uppercase truncate">{title}</span>
        <span
          className={`font-mono text-[9px] font-bold tracking-[0.12em] uppercase px-1.5 py-0.5 rounded ${
            published ? 'bg-[#133926] text-[#6ed5e7]' : 'bg-[#2E2E2E] text-[#ffb4aa]'
          }`}
        >
          {published ? 'LIVE' : 'DRAFT'}
        </span>
      </div>
      <span className="font-sans text-xs text-[#E6E6E6]/65 truncate">{subtitle}</span>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={onTogglePublish}
        title={published ? 'Unpublish (move to Draft)' : 'Publish live'}
        className="px-2.5 py-1.5 rounded bg-[#141414] hover:bg-[#2E2E2E] border border-[#2E2E2E] font-mono text-[10px] font-bold uppercase inline-flex items-center gap-1 cursor-pointer"
      >
        {published ? <EyeOff size={12} /> : <Eye size={12} />}
        {published ? 'HIDE' : 'SHOW'}
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="px-3 py-1.5 rounded bg-[#141414] hover:bg-[#133926] border border-[#2E2E2E] font-mono text-[10px] font-bold uppercase cursor-pointer"
      >
        EDIT
      </button>
      <button
        type="button"
        onClick={onDelete}
        className={`px-2.5 py-1.5 rounded border font-mono text-[10px] font-bold uppercase inline-flex items-center gap-1 cursor-pointer ${
          confirmingDelete
            ? 'bg-[#b2221c] border-[#b2221c] text-white'
            : 'bg-[#141414] hover:bg-[#410001] border-[#2E2E2E] text-[#ffb4aa]'
        }`}
      >
        <Trash2 size={12} />
        {confirmingDelete ? 'CONFIRM?' : 'DEL'}
      </button>
    </div>
  </div>
);
