import React from 'react';
import { ExperienceItem } from '../data/portfolio';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <section id="experience" className="snap-start scroll-mt-16 py-24 md:py-28">
      <div className="flex flex-col gap-2 mb-12">
        <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#1B4D3E]">
          04 / TRACK RECORD
        </span>
        <h2 className="font-display text-[36px] md:text-[64px] font-extrabold uppercase text-[#111111] leading-[1.02] tracking-[-0.03em]">
          EXPERIENCE &amp; LEADERSHIP
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {experiences.map((item) => (
          <div
            key={item.id}
            className="group relative bg-[#F2F2F2] rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white transition-colors shadow-sm overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#133926] opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#1B4D3E] tabular-nums">
              {item.period}
            </span>
            <h3 className="font-display text-[22px] font-bold leading-[1.2] tracking-[-0.01em] uppercase text-[#111111]">
              {item.role}
            </h3>
            <span className="font-sans text-[15px] leading-[1.65] text-[#5A5A5A]">
              {item.organization}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
