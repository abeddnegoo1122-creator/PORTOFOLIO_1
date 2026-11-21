import React, { useEffect, useState } from 'react';
import { Check, Copy, Database, X } from 'lucide-react';
import { ContactLinkItem, PortfolioProfileData } from '../data/portfolio';
import { EyeEmblem } from './EyeEmblem';

interface IdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PortfolioProfileData;
  contactLinks: ContactLinkItem[];
  onOpenCms: () => void;
}

export const IdentityModal: React.FC<IdentityModalProps> = ({
  isOpen,
  onClose,
  profile,
  contactLinks,
  onOpenCms,
}) => {
  const [copied, setCopied] = useState(false);

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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.publicEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="identity-modal-title"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#F2F2F2] text-[#111111] rounded-xl border-[1.5px] border-[#111111] shadow-2xl p-7 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 text-[#1B4D3E]">
              <EyeEmblem />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#1B4D3E]">
                {profile.cardId} · {profile.statusLabel}
              </span>
              <h3
                id="identity-modal-title"
                className="font-display text-[20px] font-bold uppercase text-[#111111]"
              >
                {profile.displayName}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close identity card"
            className="w-8 h-8 rounded bg-[#111111] text-white hover:bg-[#133926] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-y border-[#111111]/15 py-4">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
              ACADEMIC STATUS
            </span>
            <span className="font-sans text-[14px] font-medium text-[#111111]">
              {profile.academicStatus}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
              LOCATION
            </span>
            <span className="font-sans text-[14px] font-medium text-[#111111]">
              {profile.location}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
                DIRECT EMAIL
              </span>
              <span className="font-mono text-[12px] text-[#1B4D3E] truncate">
                {profile.publicEmail}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3 py-1.5 rounded bg-[#111111] text-white hover:bg-[#133926] font-mono text-[10px] font-bold tracking-[0.12em] uppercase inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {contactLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="px-3.5 py-2.5 rounded bg-white border border-[#111111]/15 hover:bg-[#133926] hover:text-white font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-center transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenCms();
          }}
          data-cursor="pointer"
          data-cursor-label="CMS"
          className="w-full py-2.5 px-4 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Database size={14} />
          OPEN PORTFOLIO CMS STUDIO
        </button>
      </div>
    </div>
  );
};
