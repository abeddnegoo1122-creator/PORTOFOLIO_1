import React from 'react';
import { AchievementItem } from '../data/portfolio';

interface AchievementsSectionProps {
  achievements: AchievementItem[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  return (
    <section id="achievements" className="snap-start scroll-mt-16 py-16 md:py-24">
      <div className="flex flex-col gap-2 mb-12">
        <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#1B4D3E]">
          05 / MILESTONES
        </span>
        <h2 className="font-display text-[36px] md:text-[64px] font-extrabold uppercase text-[#111111] leading-[1.02] tracking-[-0.03em]">
          ACHIEVEMENTS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="bg-[#F2F2F2] rounded-xl p-7 shadow-sm flex flex-col gap-3"
          >
            <span className="font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1B4D3E] tabular-nums">
              {item.number}
            </span>
            <h3 className="font-display text-[22px] font-bold leading-[1.2] tracking-[-0.01em] uppercase text-[#111111]">
              {item.title}
            </h3>
            <p className="font-sans text-[15px] leading-[1.65] text-[#5A5A5A]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
