export interface DeckCard {
  id: string;
  indexLabel: string;
  topRightLabel: string;
  title: string;
  tagline: string;
  variant: 'dark-neural' | 'forest-emblem' | 'portrait' | 'light-grid' | 'dark-lens';
  sectionTarget: string;
  order: number;
  published: boolean;
}

export interface EducationItem {
  id: string;
  period: string;
  rightBadge: string;
  degree: string;
  institution: string;
  isSchoolIcon: boolean;
  order: number;
  published: boolean;
}

export interface ProjectItem {
  id: string;
  meta: string;
  title: string;
  description: string;
  command: string;
  code: string;
  tags: string[];
  repoUrl: string;
  theme: 'light' | 'dark';
  demoMode: 'none' | 'date-time' | 'menu-pilihan';
  order: number;
  published: boolean;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  order: number;
  published: boolean;
}

export interface AchievementItem {
  id: string;
  number: string;
  title: string;
  description: string;
  order: number;
  published: boolean;
}

export interface ContactLinkItem {
  id: string;
  label: string;
  href: string;
  external: boolean;
  order: number;
  published: boolean;
}

export interface PortfolioProfileData {
  displayName: string;
  shortName: string;
  roleSummary: string;
  location: string;
  academicStatus: string;
  publicEmail: string;
  bio: string;
  cardId: string;
  statusLabel: string;
  heroHeadline: string;
  contactHeadline: string;
  portraitUrl: string;
  technicalStack: string[];
  humanSkills: string[];
  careerFocus: string[];
}

export interface PortfolioDataBundle {
  profile: PortfolioProfileData;
  deckCards: DeckCard[];
  education: EducationItem[];
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  achievements: AchievementItem[];
  contactLinks: ContactLinkItem[];
}

export const PORTRAIT_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDHb7lVk7xsyfn2R_h1iYUKaNABt7u6tqdxaUz96eQHL77GsvnvJJGbP969fZfV_FBeIQ375b1f98lF3b3-kIfuAygZTLhcVxt7e_QCBJuSksnyC6unhom5r4xygwyCG15NOiuYH-mcmJPF_bWmvJjEFl0X1kQO58DUE9RBQrL4i1EnZdJA9h7EDySZlNc4nBxBCYY_M9ctA8L5d01HgjaZK1abMYjR030l6UukxOZZgkZEC6V_SYYy';

export const NAV_ITEMS = [
  { label: 'ABOUT', href: '#about', id: 'about' },
  { label: 'PROJECTS', href: '#projects', id: 'projects' },
  { label: 'SKILLS', href: '#skills', id: 'skills' },
  { label: 'EXPERIENCE', href: '#experience', id: 'experience' },
  { label: 'CONTACT', href: '#contact', id: 'contact' },
] as const;

export const SECTION_SEQUENCE = [
  { id: 'hero', label: 'Intro & Card Deck', shortcut: '0' },
  { id: 'about', label: '01 / About Me', shortcut: '1' },
  { id: 'projects', label: '02 / Selected Projects', shortcut: '2' },
  { id: 'skills', label: '03 / Skills & Toolkit', shortcut: '3' },
  { id: 'experience', label: '04 / Experience', shortcut: '4' },
  { id: 'achievements', label: '05 / Achievements', shortcut: '5' },
  { id: 'contact', label: '06 / Contact', shortcut: '6' },
] as const;

export const DEFAULT_PROFILE: PortfolioProfileData = {
  displayName: 'Abednego Sinaga (Abed)',
  shortName: 'ABEDNEGO SINAGA',
  roleSummary: 'SOFTWARE ENG · DATA · AI',
  location: 'Cengkareng, West Jakarta, Indonesia',
  academicStatus: 'Informatics Engineering Student (IT-PLN)',
  publicEmail: 'abeddnegoo1122@gmail.com',
  bio: 'Graduated from F.Tandean High School in Tebing Tinggi with a strong foundation in Natural Sciences, now pursuing S1 Informatics Engineering at Institut Teknologi PLN. Passionate about back-end logic, structured problem solving, data analytics, and artificial intelligence.',
  cardId: 'ID // 01',
  statusLabel: 'ACTIVE',
  heroHeadline: 'PORTFOLIO',
  contactHeadline: "LET'S WORK TOGETHER",
  portraitUrl: PORTRAIT_IMAGE_URL,
  technicalStack: ['Python', 'C++', 'GitHub', 'Microsoft Word', 'Canva', 'Photography'],
  humanSkills: [
    'Communication & Teamwork',
    'High Adaptability',
    'Problem Solving',
    'Critical Thinking',
  ],
  careerFocus: [
    '→ SOFTWARE ENGINEERING',
    '→ DATA SCIENCE & ANALYTICS',
    '→ ARTIFICIAL INTELLIGENCE',
  ],
};

export const DECK_CARDS: DeckCard[] = [
  {
    id: 'neural-core',
    indexLabel: '01',
    topRightLabel: 'AI & DATA',
    title: 'NEURAL CORE',
    tagline: 'INDEX // 01 · ARTIFICIAL INTELLIGENCE & DATA SCIENCE',
    variant: 'dark-neural',
    sectionTarget: '#skills',
    order: 0,
    published: true,
  },
  {
    id: 'system-logic',
    indexLabel: '02',
    topRightLabel: '▼',
    title: 'SYSTEM LOGIC',
    tagline: 'INDEX // 02 · SYSTEM LOGIC & ALGORITHMIC ARCHITECTURE',
    variant: 'forest-emblem',
    sectionTarget: '#projects',
    order: 1,
    published: true,
  },
  {
    id: 'abednego-portrait',
    indexLabel: 'IT-PLN / 26',
    topRightLabel: '✦',
    title: 'ABEDNEGO',
    tagline: 'ID // 03 · ABEDNEGO SINAGA — INFORMATICS & AI ENTHUSIAST',
    variant: 'portrait',
    sectionTarget: '#about',
    order: 2,
    published: true,
  },
  {
    id: 'python-cpp',
    indexLabel: '04',
    topRightLabel: '1:1',
    title: 'PYTHON / C++',
    tagline: 'INDEX // 04 · PYTHON & C++ SOFTWARE ENGINEERING',
    variant: 'light-grid',
    sectionTarget: '#projects',
    order: 3,
    published: true,
  },
  {
    id: 'photography',
    indexLabel: '05',
    topRightLabel: '●',
    title: 'PHOTOGRAPHY',
    tagline: 'INDEX // 05 · VISUAL COMPOSITION & PHOTOGRAPHY',
    variant: 'dark-lens',
    sectionTarget: '#achievements',
    order: 4,
    published: true,
  },
];

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    id: 'it-pln',
    period: '2026 – PRESENT',
    rightBadge: '',
    degree: 'S1 Informatics Engineering',
    institution: 'Institut Teknologi PLN, Jakarta',
    isSchoolIcon: true,
    order: 0,
    published: true,
  },
  {
    id: 'sma-ftandean',
    period: 'JULY 2023 – MAY 2026',
    rightBadge: '88.61 / 100',
    degree: 'Natural Sciences (IPA)',
    institution: 'SMA F.Tandean Tebing Tinggi',
    isSchoolIcon: false,
    order: 1,
    published: true,
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'date-time',
    meta: '2026 · BACK-END PROGRAM',
    title: 'DATE & TIME',
    description:
      'Python back-end utility for calculating birth date, exact age breakdown, and calendar time-delta logic.',
    command: 'python3 birth_calc.py',
    code: `from datetime import date
dob = date(2008, 4, 15)
delta = date.today() - dob
print(f"Days lived: {delta.days}")`,
    tags: ['Python', 'Back-End', 'Date/Time Logic'],
    repoUrl: 'https://github.com/abeddnegoo1122-creator/Portofolio',
    theme: 'light',
    demoMode: 'date-time',
    order: 0,
    published: true,
  },
  {
    id: 'menu-pilihan',
    meta: '2026 · BACK-END PROGRAM',
    title: 'MENU PILIHAN',
    description:
      'C++ console application implementing structured control flow, switch-case routing, and input validation.',
    command: './menu_pilihan',
    code: `switch(choice) {
  case 1: runCalculation(); break;
  case 2: displaySummary(); break;
  default: cout << "Invalid";
}`,
    tags: ['C++', 'Back-End', 'Control Flow'],
    repoUrl: 'https://github.com/abeddnegoo1122-creator/Portofolio',
    theme: 'dark',
    demoMode: 'menu-pilihan',
    order: 1,
    published: true,
  },
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'recontre-medan',
    period: '2026',
    role: 'MEMBER OF THE MUSIC SECTION',
    organization: 'Recontre Archdiocese of Medan',
    order: 0,
    published: true,
  },
  {
    id: 'sma-christian-section',
    period: 'MAY 2023 – MAY 2026',
    role: 'HEAD OF CHRISTIAN RELIGIOUS SECTION',
    organization: 'SMA F.Tandean',
    order: 1,
    published: true,
  },
  {
    id: 'st-augustine-parish',
    period: 'MAY 2023 – JUNE 2024',
    role: 'COORDINATOR FOR INTERESTS AND TALENTS',
    organization: 'St. Augustine Parish Church, Sei Rampah',
    order: 2,
    published: true,
  },
];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'academic-excellence',
    number: '01',
    title: 'Academic Excellence',
    description:
      'Graduated from SMA F.Tandean Tebing Tinggi (Natural Sciences) with a final score of 88.61/100.',
    order: 0,
    published: true,
  },
  {
    id: 'student-leadership',
    number: '02',
    title: 'Student Leadership',
    description:
      'Led the Christian Religious Section at SMA F.Tandean for 3 consecutive years (2023–2026).',
    order: 1,
    published: true,
  },
  {
    id: 'youth-talent',
    number: '03',
    title: 'Youth Talent Coordinator',
    description:
      'Directed youth interest and talent programs at St. Augustine Parish Church, Sei Rampah.',
    order: 2,
    published: true,
  },
  {
    id: 'regional-musician',
    number: '04',
    title: 'Regional Event Musician',
    description:
      'Selected member of the Music Section for Recontre Archdiocese of Medan (2026).',
    order: 3,
    published: true,
  },
];

export const CONTACT_LINKS: ContactLinkItem[] = [
  {
    id: 'email',
    label: 'EMAIL ↗',
    href: 'mailto:abeddnegoo1122@gmail.com',
    external: false,
    order: 0,
    published: true,
  },
  {
    id: 'whatsapp',
    label: 'WHATSAPP ↗',
    href: 'https://wa.me/6282164837016',
    external: true,
    order: 1,
    published: true,
  },
  {
    id: 'linkedin',
    label: 'LINKEDIN ↗',
    href: 'https://www.linkedin.com/abed-nego',
    external: true,
    order: 2,
    published: true,
  },
  {
    id: 'github',
    label: 'GITHUB ↗',
    href: 'https://github.com/abeddnegoo1122-creator/Portofolio',
    external: true,
    order: 3,
    published: true,
  },
];

export const DEFAULT_PORTFOLIO_BUNDLE: PortfolioDataBundle = {
  profile: DEFAULT_PROFILE,
  deckCards: DECK_CARDS,
  education: EDUCATION_ITEMS,
  projects: PROJECTS,
  experiences: EXPERIENCE_ITEMS,
  achievements: ACHIEVEMENTS,
  contactLinks: CONTACT_LINKS,
};
