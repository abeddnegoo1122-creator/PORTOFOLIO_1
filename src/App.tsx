import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { AboutSection } from './components/AboutSection';
import { AchievementsSection } from './components/AchievementsSection';
import { CmsDrawer } from './components/CmsDrawer';
import { ContactSection } from './components/ContactSection';
import { CustomCursor } from './components/CustomCursor';
import { ExperienceSection } from './components/ExperienceSection';
import { Header } from './components/Header';
import { HeroDeck } from './components/HeroDeck';
import { IdentityModal } from './components/IdentityModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ProjectInteractiveModal } from './components/ProjectInteractiveModal';
import { ProjectsSection } from './components/ProjectsSection';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { SkillsSection } from './components/SkillsSection';
import {
  AchievementItem,
  ContactLinkItem,
  DeckCard,
  DEFAULT_PORTFOLIO_BUNDLE,
  EducationItem,
  ExperienceItem,
  NAV_ITEMS,
  PortfolioDataBundle,
  PortfolioProfileData,
  ProjectItem,
  SECTION_SEQUENCE,
} from './data/portfolio';
import { ADMIN_EMAIL, auth } from './lib/firebase';
import { subscribePortfolioData } from './services/cmsService';

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [sandboxProject, setSandboxProject] = useState<ProjectItem | null>(null);
  const [identityOpen, setIdentityOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);

  // Firebase Auth + Real-Time Firestore CMS State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [hasCloudData, setHasCloudData] = useState(false);
  const [cloudProfile, setCloudProfile] = useState<PortfolioProfileData | null>(null);
  const [cloudDeckCards, setCloudDeckCards] = useState<DeckCard[]>([]);
  const [cloudEducation, setCloudEducation] = useState<EducationItem[]>([]);
  const [cloudProjects, setCloudProjects] = useState<ProjectItem[]>([]);
  const [cloudExperiences, setCloudExperiences] = useState<ExperienceItem[]>([]);
  const [cloudAchievements, setCloudAchievements] = useState<AchievementItem[]>([]);
  const [cloudContactLinks, setCloudContactLinks] = useState<ContactLinkItem[]>([]);

  const isVerifiedAdmin = Boolean(
    user && user.email === ADMIN_EMAIL && user.emailVerified
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = subscribePortfolioData(isVerifiedAdmin, {
      onProfile: setCloudProfile,
      onProjects: setCloudProjects,
      onEducation: setCloudEducation,
      onExperiences: setCloudExperiences,
      onAchievements: setCloudAchievements,
      onDeckCards: setCloudDeckCards,
      onContactLinks: setCloudContactLinks,
      onCloudStatus: setHasCloudData,
    });
    return () => unsub();
  }, [isVerifiedAdmin]);

  // Live bundle passed to CMS Studio (includes drafts if cloud is seeded)
  const cmsDataBundle: PortfolioDataBundle = useMemo(() => {
    if (!hasCloudData) {
      return {
        profile: cloudProfile ?? DEFAULT_PORTFOLIO_BUNDLE.profile,
        deckCards:
          cloudDeckCards.length > 0 ? cloudDeckCards : DEFAULT_PORTFOLIO_BUNDLE.deckCards,
        education:
          cloudEducation.length > 0 ? cloudEducation : DEFAULT_PORTFOLIO_BUNDLE.education,
        projects: cloudProjects.length > 0 ? cloudProjects : DEFAULT_PORTFOLIO_BUNDLE.projects,
        experiences:
          cloudExperiences.length > 0
            ? cloudExperiences
            : DEFAULT_PORTFOLIO_BUNDLE.experiences,
        achievements:
          cloudAchievements.length > 0
            ? cloudAchievements
            : DEFAULT_PORTFOLIO_BUNDLE.achievements,
        contactLinks:
          cloudContactLinks.length > 0
            ? cloudContactLinks
            : DEFAULT_PORTFOLIO_BUNDLE.contactLinks,
      };
    }

    return {
      profile: cloudProfile ?? DEFAULT_PORTFOLIO_BUNDLE.profile,
      deckCards: cloudDeckCards,
      education: cloudEducation,
      projects: cloudProjects,
      experiences: cloudExperiences,
      achievements: cloudAchievements,
      contactLinks: cloudContactLinks,
    };
  }, [
    cloudAchievements,
    cloudContactLinks,
    cloudDeckCards,
    cloudEducation,
    cloudExperiences,
    cloudProfile,
    cloudProjects,
    hasCloudData,
  ]);

  // Published bundle rendered on the public portfolio surface
  const livePortfolio = useMemo(() => {
    const useCloudCollections = hasCloudData;
    return {
      profile: cloudProfile ?? DEFAULT_PORTFOLIO_BUNDLE.profile,
      deckCards: useCloudCollections
        ? cloudDeckCards.filter((c) => c.published)
        : DEFAULT_PORTFOLIO_BUNDLE.deckCards,
      education: useCloudCollections
        ? cloudEducation.filter((e) => e.published)
        : DEFAULT_PORTFOLIO_BUNDLE.education,
      projects: useCloudCollections
        ? cloudProjects.filter((p) => p.published)
        : DEFAULT_PORTFOLIO_BUNDLE.projects,
      experiences: useCloudCollections
        ? cloudExperiences.filter((e) => e.published)
        : DEFAULT_PORTFOLIO_BUNDLE.experiences,
      achievements: useCloudCollections
        ? cloudAchievements.filter((a) => a.published)
        : DEFAULT_PORTFOLIO_BUNDLE.achievements,
      contactLinks: useCloudCollections
        ? cloudContactLinks.filter((l) => l.published)
        : DEFAULT_PORTFOLIO_BUNDLE.contactLinks,
    };
  }, [
    cloudAchievements,
    cloudContactLinks,
    cloudDeckCards,
    cloudEducation,
    cloudExperiences,
    cloudProfile,
    cloudProjects,
    hasCloudData,
  ]);

  const scrollToSection = useCallback((id: string) => {
    const container = mainRef.current;
    if (id === 'hero') {
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (NAV_ITEMS.some((item) => item.id === id)) {
        setActiveSection(id);
      }
    }
  }, []);

  useEffect(() => {
    const rootEl = mainRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { root: rootEl, rootMargin: '-35% 0px -50% 0px', threshold: 0.05 }
    );

    for (const item of NAV_ITEMS) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const getCurrentSectionIndex = (): number => {
      const container = mainRef.current;
      if (!container) return 0;

      const scrollTop = container.scrollTop;
      const anchor = scrollTop + container.clientHeight * 0.32;

      let currentIdx = 0;
      for (let i = 0; i < SECTION_SEQUENCE.length; i++) {
        const el = document.getElementById(SECTION_SEQUENCE[i].id);
        if (el && el.offsetTop <= anchor) {
          currentIdx = i;
        }
      }
      return currentIdx;
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === '?') {
        if (!sandboxProject && !identityOpen && !cmsOpen) {
          e.preventDefault();
          setShortcutsOpen((prev) => !prev);
        }
        return;
      }

      // Pause global section navigation while any modal/drawer is open
      if (sandboxProject !== null || identityOpen || shortcutsOpen || cmsOpen) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key.toLowerCase() === 'j') {
        e.preventDefault();
        const currentIdx = getCurrentSectionIndex();
        const nextIdx = Math.min(SECTION_SEQUENCE.length - 1, currentIdx + 1);
        scrollToSection(SECTION_SEQUENCE[nextIdx].id);
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const currentIdx = getCurrentSectionIndex();
        const prevIdx = Math.max(0, currentIdx - 1);
        scrollToSection(SECTION_SEQUENCE[prevIdx].id);
        return;
      }

      if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection('hero');
        return;
      }

      if (e.key === 'End') {
        e.preventDefault();
        scrollToSection('contact');
        return;
      }

      const matched = SECTION_SEQUENCE.find((sec) => sec.shortcut === e.key);
      if (matched) {
        e.preventDefault();
        scrollToSection(matched.id);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [cmsOpen, identityOpen, sandboxProject, scrollToSection, shortcutsOpen]);

  return (
    <div className="bg-[#E6E6E6] font-sans text-[15px] leading-[1.65] text-[#111111] relative h-screen overflow-hidden">
      <ScrollProgressBar scrollContainerRef={mainRef} />
      <CustomCursor />
      {/* Global Swiss registration dot grid + matte poster grain */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none swiss-grid-bg z-0" />
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none matte-grain z-50" />

      <Header
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onOpenIdentityModal={() => setIdentityOpen(true)}
      />

      <main
        ref={mainRef}
        className="relative z-10 w-full h-screen overflow-y-auto scroll-smooth snap-y snap-proximity scroll-pt-16 overscroll-contain"
      >
        <div className="w-full max-w-[1320px] mx-auto px-[6vw] pt-16 flex flex-col">
          <HeroDeck profile={livePortfolio.profile} cards={livePortfolio.deckCards} />
          <AboutSection
            profile={livePortfolio.profile}
            education={livePortfolio.education}
          />
          <ProjectsSection
            projects={livePortfolio.projects}
            onOpenSandbox={setSandboxProject}
          />
          <SkillsSection profile={livePortfolio.profile} />
          <ExperienceSection experiences={livePortfolio.experiences} />
          <AchievementsSection achievements={livePortfolio.achievements} />
          <ContactSection
            profile={livePortfolio.profile}
            contactLinks={livePortfolio.contactLinks}
            onScrollToTop={() => scrollToSection('hero')}
          />
        </div>

        <footer className="snap-end relative z-10 w-full bg-[#F2F2F2]/80 backdrop-blur-xl py-9 mt-9">
          <div className="max-w-[1320px] mx-auto px-[6vw] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
              © 2025 {livePortfolio.profile.shortName}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setCmsOpen(true)}
                data-cursor="pointer"
                data-cursor-label="CMS"
                className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#133926] hover:underline cursor-pointer"
              >
                CMS STUDIO
              </button>
              <span aria-hidden="true" className="text-[#5A5A5A] font-mono text-[11px]">
                ·
              </span>
              <button
                type="button"
                onClick={() => setShortcutsOpen(true)}
                data-cursor="pointer"
                data-cursor-label="KEYS"
                className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#1B4D3E] hover:underline cursor-pointer"
              >
                SHORTCUTS [?]
              </button>
              <span aria-hidden="true" className="text-[#5A5A5A] font-mono text-[11px]">
                ·
              </span>
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
                SWISS NEO-BRUTALIST PORTFOLIO
              </span>
            </div>
          </div>
        </footer>
      </main>

      <ProjectInteractiveModal
        project={sandboxProject}
        onClose={() => setSandboxProject(null)}
      />
      <IdentityModal
        isOpen={identityOpen}
        onClose={() => setIdentityOpen(false)}
        profile={livePortfolio.profile}
        contactLinks={livePortfolio.contactLinks}
        onOpenCms={() => setCmsOpen(true)}
      />
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        onJumpToSection={scrollToSection}
      />
      <CmsDrawer
        isOpen={cmsOpen}
        onClose={() => setCmsOpen(false)}
        user={user}
        hasCloudData={hasCloudData}
        data={cmsDataBundle}
      />
    </div>
  );
}
