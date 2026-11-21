import React, { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { SECTION_SEQUENCE } from '../data/portfolio';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToSection: (id: string) => void;
}

const SHORTCUT_GROUPS = [
  { keys: ['↑', 'K'], action: 'Previous section' },
  { keys: ['↓', 'J'], action: 'Next section' },
  { keys: ['HOME', '0'], action: 'Jump to top (Hero)' },
  { keys: ['END'], action: 'Jump to Contact' },
  { keys: ['1 – 6'], action: 'Jump directly to section 01–06' },
  { keys: ['←', '→'], action: 'Cycle Hero Card Deck (when focused)' },
  { keys: ['?'], action: 'Toggle this shortcuts panel' },
  { keys: ['ESC'], action: 'Close active overlay' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onJumpToSection,
}) => {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        data-cursor-surface="dark"
        className="w-full max-w-lg bg-[#141414] text-white rounded-xl border border-[#2E2E2E] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2E2E2E] bg-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <Keyboard size={16} className="text-[#6ed5e7]" />
            <h3
              id="shortcuts-modal-title"
              className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase"
            >
              KEYBOARD NAVIGATION
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            className="w-8 h-8 rounded bg-[#141414] hover:bg-[#133926] flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            {SHORTCUT_GROUPS.map((item) => (
              <div
                key={item.action}
                className="flex items-center justify-between gap-4 py-1.5 border-b border-[#2E2E2E]/70 last:border-b-0"
              >
                <span className="font-sans text-[13px] text-[#E6E6E6]">{item.action}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.keys.map((k) => (
                    <kbd
                      key={k}
                      className="px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#2E2E2E] font-mono text-[10px] font-bold tracking-[0.1em] text-[#6ed5e7]"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-[#2E2E2E]">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
              QUICK JUMP
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SECTION_SEQUENCE.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onJumpToSection(sec.id);
                  }}
                  data-cursor="pointer"
                  data-cursor-label="JUMP"
                  className="flex items-center justify-between px-3 py-2 rounded bg-[#1A1A1A] hover:bg-[#133926] border border-[#2E2E2E] text-left transition-colors cursor-pointer"
                >
                  <span className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase text-white truncate">
                    {sec.label}
                  </span>
                  <kbd className="font-mono text-[10px] font-bold text-[#6ed5e7] ml-2">
                    {sec.shortcut}
                  </kbd>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
