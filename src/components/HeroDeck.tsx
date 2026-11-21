import React, { useEffect, useRef, useState } from 'react';
import { DeckCard, PortfolioProfileData } from '../data/portfolio';
import { EyeEmblem } from './EyeEmblem';

interface HeroDeckProps {
  profile: PortfolioProfileData;
  cards: DeckCard[];
}

export const HeroDeck: React.FC<HeroDeckProps> = ({ profile, cards }) => {
  const heroRef = useRef<HTMLElement>(null);
  const [titleOffset, setTitleOffset] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState<number>(Math.min(2, Math.max(0, cards.length - 1)));
  const [pillVisible, setPillVisible] = useState(true);
  const [displayedTagline, setDisplayedTagline] = useState(
    cards[Math.min(2, Math.max(0, cards.length - 1))]?.tagline ||
      'ID // 03 · ABEDNEGO SINAGA — INFORMATICS & AI ENTHUSIAST'
  );
  const [isMobile, setIsMobile] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (cards.length === 0) return;
    const clampedIdx = Math.min(activeIndex, cards.length - 1);
    if (clampedIdx !== activeIndex) {
      setActiveIndex(clampedIdx);
    }
    const currentCard = cards[clampedIdx];
    if (currentCard) {
      setDisplayedTagline(currentCard.tagline);
    }
  }, [activeIndex, cards]);

  useEffect(() => {
    setPortraitFailed(false);
  }, [profile.portraitUrl]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setTitleOffset({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setTitleOffset({ x: 0, y: 0 });
  };

  const focusCard = (idx: number, card: DeckCard) => {
    if (idx === activeIndex) {
      const targetEl = document.querySelector(card.sectionTarget);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    setActiveIndex(idx);
    setPillVisible(false);
    window.setTimeout(() => {
      setDisplayedTagline(card.tagline);
      setPillVisible(true);
    }, 150);
  };

  const handleDeckKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (cards.length === 0) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = Math.max(0, activeIndex - 1);
      focusCard(next, cards[next]);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(cards.length - 1, activeIndex + 1);
      focusCard(next, cards[next]);
    }
  };

  const scrollToAbout = () => {
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderCardArt = (card: DeckCard) => {
    switch (card.variant) {
      case 'dark-neural':
        return (
          <div className="w-24 h-24 mx-auto my-auto flex items-center justify-center">
            <svg
              className="w-full h-full text-[#6ed5e7]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle className="opacity-50" cx="50" cy="50" r="34" strokeDasharray="4 4" />
              <circle className="opacity-80" cx="50" cy="50" r="22" />
              <circle cx="50" cy="50" fill="currentColor" r="10" />
              <path d="M50 10V22M50 78V90M10 50H22M78 50H90" />
            </svg>
          </div>
        );
      case 'forest-emblem':
        return (
          <div className="w-24 h-24 mx-auto my-auto flex items-center justify-center">
            <svg
              className="w-full h-full text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path d="M24 6C29.5 6 33.5 9.8 34.5 14.5C39.2 15.5 43 19.5 43 24C43 28.5 39.2 32.5 34.5 33.5C33.5 38.2 29.5 42 24 42C18.5 42 14.5 38.2 13.5 33.5C8.8 32.5 5 28.5 5 24C5 19.5 8.8 15.5 13.5 14.5C14.5 9.8 18.5 6 24 6Z" />
              <path d="M13 24C16.5 19 20 17.5 24 17.5C28 17.5 31.5 19 35 24C31.5 29 28 30.5 24 30.5C20 30.5 16.5 29 13 24Z" />
              <circle cx="24" cy="24" fill="currentColor" r="3.5" />
            </svg>
          </div>
        );
      case 'portrait':
        return (
          <div className="w-full h-40 md:h-52 rounded-lg overflow-hidden bg-[#F2F2F2] my-2 flex items-center justify-center">
            {!portraitFailed && profile.portraitUrl ? (
              <img
                src={profile.portraitUrl}
                alt={`${profile.displayName} portrait`}
                referrerPolicy="no-referrer"
                onError={() => setPortraitFailed(true)}
                className="w-full h-full object-cover grayscale contrast-125"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#141414] to-[#133926] flex flex-col items-center justify-center text-white p-4">
                <span className="font-display text-3xl font-extrabold tracking-tight">AS</span>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase mt-1 opacity-75">
                  IT-PLN JAKARTA
                </span>
              </div>
            )}
          </div>
        );
      case 'light-grid':
        return (
          <div className="w-24 h-24 mx-auto my-auto flex items-center justify-center">
            <svg
              className="w-full h-full text-[#111111]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 80 80"
              aria-hidden="true"
            >
              <rect height="56" rx="4" width="56" x="12" y="12" />
              <line x1="12" x2="68" y1="40" y2="40" />
              <line x1="40" x2="40" y1="12" y2="68" />
              <circle className="text-[#1B4D3E]" cx="40" cy="40" r="14" stroke="currentColor" />
            </svg>
          </div>
        );
      case 'dark-lens':
        return (
          <div className="w-24 h-24 mx-auto my-auto flex items-center justify-center">
            <svg
              className="w-full h-full text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 80 80"
              aria-hidden="true"
            >
              <circle cx="40" cy="40" r="28" strokeDasharray="3 3" />
              <circle cx="40" cy="40" r="16" />
              <circle cx="40" cy="40" fill="currentColor" r="4" />
            </svg>
          </div>
        );
    }
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className="snap-start scroll-mt-0 relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden pb-12 pt-6"
    >
      {/* Top kicker row */}
      <div className="flex items-start justify-between w-full relative z-10">
        <div className="flex flex-col">
          <span className="font-display text-[22px] font-bold uppercase tracking-[-0.01em] text-[#111111] leading-none">
            WELCOME
          </span>
          <span className="font-display text-[22px] font-bold uppercase tracking-[-0.01em] text-[#111111] leading-none">
            TO MY
          </span>
        </div>
        <div className="w-11 h-11 flex items-center justify-center text-[#111111]">
          <EyeEmblem />
        </div>
      </div>

      {/* Kinetic center typography + vertical forest pillar */}
      <div className="relative w-full flex flex-col items-center justify-center my-8 md:my-12">
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 md:w-36 h-64 md:h-80 bg-[#133926] z-[1]"
        />

        <div
          aria-hidden="true"
          className="w-full flex items-center justify-between relative z-[2] pointer-events-none"
        >
          <span className="font-mono text-[12px] font-bold tracking-[0.14em] text-[#111111]">►</span>
          <span className="font-mono text-[12px] font-bold tracking-[0.14em] text-[#111111]">◄</span>
        </div>

        <div
          id="kinetic-title"
          className="relative z-[2] flex flex-col items-center justify-center select-none my-2 transition-transform duration-150 ease-out"
          style={{
            transform: `translate(${titleOffset.x}px, ${titleOffset.y}px)`,
          }}
        >
          <h1 className="font-display text-[clamp(44px,9.2vw,96px)] font-extrabold uppercase text-[#111111] tracking-[-0.03em] leading-[0.95] -rotate-2 relative">
            {profile.heroHeadline}
            <span
              aria-hidden="true"
              className="absolute left-2 top-1 font-display text-[clamp(44px,9.2vw,96px)] font-extrabold uppercase hollow-stroke opacity-40 pointer-events-none"
            >
              {profile.heroHeadline}
            </span>
          </h1>
        </div>

        <div className="w-full flex items-center justify-between relative z-[2] mt-10 md:mt-14 px-2">
          <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#111111]">
            {profile.shortName}
          </span>
          <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
            {profile.roleSummary}
          </span>
        </div>
      </div>

      {/* Interactive Card Fan + Floating Tagline Pill + Circular Dial */}
      <div className="relative w-full flex flex-col items-center justify-end mt-4">
        <div className="relative z-[32] mb-3 flex items-center justify-center pointer-events-none">
          <div
            className={`inline-flex items-center gap-2.5 px-4 md:px-5 py-2 rounded-full bg-[#111111] text-white border border-white/15 shadow-[0_10px_25px_rgba(0,0,0,0.18)] select-none transition-all duration-300 ${
              pillVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-1 scale-[0.98]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#1B4D3E] shadow-[0_0_8px_#1B4D3E] shrink-0" />
            <span className="font-sans text-[11px] md:text-[12px] font-semibold tracking-[0.12em] uppercase whitespace-nowrap">
              {displayedTagline}
            </span>
          </div>
        </div>

        <div
          id="card-fan"
          role="listbox"
          aria-label="Interactive portfolio focus deck"
          tabIndex={0}
          onKeyDown={handleDeckKeyDown}
          className="relative w-full max-w-[920px] h-[290px] md:h-[340px] flex items-end justify-center select-none focus:outline-none"
        >
          {cards.map((card, idx) => {
            const diff = idx - activeIndex;
            const isFocused = diff === 0;
            const xSpacing = isMobile ? 65 : 95;
            const tx = isFocused ? 0 : diff * xSpacing;
            const ty = isFocused ? -24 : Math.abs(diff) * (isMobile ? 14 : 18);
            const rot = isFocused ? 0 : diff * 11;
            const scale = isFocused ? (isMobile ? 1.05 : 1.08) : 0.96;
            const zIndex = isFocused ? 25 : Math.max(1, 10 - Math.abs(diff) * 2);

            const surfaceClass =
              card.variant === 'dark-neural'
                ? 'bg-[#141414] text-white p-5'
                : card.variant === 'forest-emblem'
                  ? 'bg-[#133926] text-white p-5'
                  : card.variant === 'portrait'
                    ? 'bg-white text-[#111111] p-3'
                    : card.variant === 'light-grid'
                      ? 'bg-white text-[#111111] p-5'
                      : 'bg-[#1A1A1A] text-white p-5';

            return (
              <button
                key={card.id}
                type="button"
                role="option"
                aria-selected={isFocused}
                onClick={() => focusCard(idx, card)}
                style={{
                  transformOrigin: '50% 120%',
                  zIndex,
                  transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`,
                }}
                data-cursor="card"
                data-cursor-label={isFocused ? 'JUMP' : 'FOCUS'}
                data-cursor-surface={
                  card.variant === 'dark-neural' ||
                  card.variant === 'dark-lens' ||
                  card.variant === 'forest-emblem'
                    ? 'dark'
                    : undefined
                }
                className={`fan-card absolute bottom-4 w-44 md:w-56 aspect-[3/4.1] rounded-xl shadow-xl cursor-pointer flex flex-col justify-between overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-[#1B4D3E] ${surfaceClass} ${
                  isFocused ? 'is-focused' : ''
                }`}
              >
                <div className={`flex items-center justify-between w-full ${card.variant === 'portrait' ? 'px-1' : ''}`}>
                  <span
                    className={`font-mono text-[11px] font-bold tracking-[0.14em] uppercase ${
                      card.variant === 'dark-neural'
                        ? 'text-[#6ed5e7]'
                        : card.variant === 'light-grid' || card.variant === 'dark-lens'
                          ? 'text-[#5A5A5A]'
                          : ''
                    }`}
                  >
                    {card.indexLabel}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-bold tracking-[0.14em] uppercase ${
                      card.variant === 'dark-neural'
                        ? 'text-[#5A5A5A]'
                        : card.variant === 'forest-emblem'
                          ? 'text-white'
                          : 'text-[#1B4D3E]'
                    }`}
                  >
                    {card.topRightLabel}
                  </span>
                </div>

                {renderCardArt(card)}

                <div className={`flex items-center justify-between w-full ${card.variant === 'portrait' ? 'px-1' : ''}`}>
                  <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
                    {card.title}
                  </span>
                  {card.variant === 'portrait' && (
                    <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
                      03
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Circular Rotating Dial */}
        <button
          type="button"
          onClick={scrollToAbout}
          aria-label="Scroll to About section"
          data-cursor="pointer"
          data-cursor-label="SCROLL ↓"
          className="relative w-[170px] h-[170px] -mt-12 z-[30] flex items-center justify-center cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#1B4D3E] rounded-full"
        >
          <svg
            className="w-full h-full text-[#111111] transition-transform duration-500 group-hover:rotate-12"
            viewBox="0 0 170 170"
            aria-hidden="true"
          >
            <defs>
              <path
                d="M 85, 85 m -64, 0 a 64,64 0 1,1 128,0 a 64,64 0 1,1 -128,0"
                id="dialCircle"
              />
            </defs>
            <circle
              className="opacity-40"
              cx="85"
              cy="85"
              fill="none"
              r="76"
              stroke="currentColor"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <text className="font-mono text-[11px] font-bold fill-current uppercase tracking-[0.22em]">
              <textPath href="#dialCircle" startOffset="6%">
                PORTFOLIO • PORTFOLIO •
              </textPath>
            </text>
          </svg>
          <div className="absolute top-3 flex flex-col items-center">
            <span className="font-mono text-[11px] font-bold text-[#111111] leading-none">▲</span>
            <span className="font-mono text-[12px] text-[#111111] font-bold tracking-[0.14em]">ME</span>
          </div>
        </button>
      </div>
    </section>
  );
};
