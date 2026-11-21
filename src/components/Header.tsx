import React, { useState } from 'react';
import { Menu, User, X } from 'lucide-react';
import { NAV_ITEMS } from '../data/portfolio';

interface HeaderProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  onOpenIdentityModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  onOpenIdentityModal,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    onSelectSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 pointer-events-none">
      <div className="h-16 max-w-[1320px] mx-auto px-[6vw] flex items-center justify-between">
        <div className="w-8 md:flex hidden" />

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="pointer-events-auto md:hidden w-9 h-9 rounded-full bg-[#fcf9f8]/90 backdrop-blur-xl shadow-sm flex items-center justify-center text-[#111111] focus-visible:outline-2 focus-visible:outline-[#1B4D3E]"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Desktop floating navigation pill matching screen mockup */}
        <nav
          aria-label="Primary navigation"
          className="pointer-events-auto hidden md:flex items-center gap-1 px-4 py-1 rounded-full bg-[#fcf9f8]/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
        >
          {NAV_ITEMS.map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <React.Fragment key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  data-cursor="pointer"
                  data-cursor-label="NAV"
                  className={`px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.14em] uppercase whitespace-nowrap shrink-0 rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#1B4D3E] ${
                    isActive
                      ? 'bg-[#1B4D3E] text-white ring-2 ring-[#111111]/20'
                      : 'bg-[#133926] text-white hover:bg-[#1B4D3E]'
                  }`}
                >
                  {item.label}
                </a>
                {idx < NAV_ITEMS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="text-[#5A5A5A] font-mono text-[11px] font-bold px-0.5 select-none"
                  >
                    ·
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Right circular profile button */}
        <button
          type="button"
          onClick={onOpenIdentityModal}
          aria-label="Open Abednego Sinaga quick identity card"
          title="Quick Identity & Contact"
          data-cursor="pointer"
          data-cursor-label="ID // 01"
          className="pointer-events-auto w-8 h-8 rounded-full bg-[#133926] hover:bg-[#1B4D3E] text-white flex items-center justify-center transition-transform duration-150 hover:scale-105 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#111111]"
        >
          <User size={16} strokeWidth={2.2} />
        </button>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="pointer-events-auto md:hidden mx-[6vw] mt-2 rounded-xl bg-[#fcf9f8]/95 backdrop-blur-xl shadow-lg p-3 flex flex-wrap gap-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.id)}
              className="px-3.5 py-2 rounded-full bg-[#133926] text-white font-mono text-[11px] font-bold tracking-[0.12em] uppercase"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
