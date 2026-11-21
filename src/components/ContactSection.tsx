import React from 'react';
import { ContactLinkItem, PortfolioProfileData } from '../data/portfolio';

interface ContactSectionProps {
  profile: PortfolioProfileData;
  contactLinks: ContactLinkItem[];
  onScrollToTop?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  contactLinks,
  onScrollToTop,
}) => {
  const scrollToTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="contact"
      className="snap-start scroll-mt-16 py-24 md:py-32 flex flex-col items-center text-center gap-10 relative"
    >
      <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
        06 / GET IN TOUCH · {profile.location.toUpperCase()}
      </span>

      <div className="relative flex items-center justify-center py-6">
        <div
          aria-hidden="true"
          className="absolute w-20 md:w-28 h-40 md:h-52 bg-[#133926] z-[1]"
        />
        <h2 className="relative z-[2] font-display text-[44px] md:text-[96px] font-extrabold uppercase text-[#111111] leading-[0.95] tracking-[-0.03em] max-w-4xl">
          {profile.contactHeadline}
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 z-[2]">
        {contactLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            className="bg-[#111111] text-[#E6E6E6] px-6 py-3 rounded font-mono text-[12px] font-bold tracking-[0.14em] uppercase hover:bg-[#133926] hover:text-white transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-12">
        <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
          © 2026 {profile.shortName}
        </span>

        <button
          type="button"
          onClick={scrollToTop}
          title="Back to top"
          aria-label="Scroll back to top of portfolio"
          data-cursor="pointer"
          data-cursor-label="TOP ↑"
          className="w-20 h-20 rounded-full bg-[#F2F2F2] hover:bg-white flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer"
        >
          <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#111111] text-center leading-tight">
            PORTFOLIO
            <br />• ME
          </span>
        </button>

        <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
          {profile.academicStatus.toUpperCase()}
        </span>
      </div>
    </section>
  );
};
