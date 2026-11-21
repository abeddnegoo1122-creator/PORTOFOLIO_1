import React from 'react';
import { PortfolioProfileData } from '../data/portfolio';

interface SkillsSectionProps {
  profile: PortfolioProfileData;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ profile }) => {
  return (
    <section
      id="skills"
      data-cursor-surface="dark"
      className="snap-start scroll-mt-20 bg-[#141414] text-white rounded-xl p-8 md:p-14 my-8 relative overflow-hidden"
    >
      <div className="flex flex-col gap-2 mb-12">
        <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#1B4D3E]">
          03 / CAPABILITIES
        </span>
        <h2 className="font-display text-[36px] md:text-[64px] font-extrabold uppercase text-white leading-[1.02] tracking-[-0.03em]">
          SKILLS &amp; TOOLKIT
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* 01 Technical Stack */}
        <div className="bg-[#1A1A1A] rounded-xl p-7 flex flex-col gap-6">
          <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
            01 // TECHNICAL STACK
          </span>
          <div className="flex flex-wrap gap-2.5">
            {profile.technicalStack.map((item) => (
              <span
                key={item}
                className="px-3.5 py-2 rounded bg-[#141414] font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-white"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 02 Human & Collaboration */}
        <div className="bg-[#1A1A1A] rounded-xl p-7 flex flex-col gap-6">
          <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
            02 // HUMAN &amp; COLLABORATION
          </span>
          <div className="flex flex-wrap gap-2.5">
            {profile.humanSkills.map((item) => (
              <span
                key={item}
                className="px-3.5 py-2 rounded-full bg-[#141414] font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-white hover:bg-[#133926] transition-colors cursor-default"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 03 Career Focus */}
        <div className="bg-[#133926] text-white rounded-xl p-7 flex flex-col justify-between gap-6">
          <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#6ed5e7]">
            03 // CAREER FOCUS
          </span>
          <div className="flex flex-col gap-3">
            {profile.careerFocus.map((item) => (
              <span
                key={item}
                className="font-display text-[22px] font-bold leading-[1.2] tracking-[-0.01em] uppercase"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
