import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { EducationItem, PortfolioProfileData } from '../data/portfolio';
import { EyeEmblem } from './EyeEmblem';

interface AboutSectionProps {
  profile: PortfolioProfileData;
  education: EducationItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, education }) => {
  const eyeWrapperRef = useRef<HTMLDivElement>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeWrapperRef.current) return;
      const rect = eyeWrapperRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-5, Math.min(5, (e.clientX - cx) / 40));
      const dy = Math.max(-3, Math.min(3, (e.clientY - cy) / 40));
      setPupilOffset({ x: dx, y: dy });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="about" className="snap-start scroll-mt-16 py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Identity Card */}
        <div className="lg:col-span-4 bg-[#F2F2F2] rounded-xl p-7 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#111111]">
              {profile.cardId}
            </span>
            <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#1B4D3E]">
              {profile.statusLabel}
            </span>
          </div>

          <div ref={eyeWrapperRef} className="w-16 h-16 flex items-center justify-center my-2 text-[#1B4D3E]">
            <EyeEmblem pupilOffset={pupilOffset} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
                NAME
              </span>
              <span className="font-sans text-[15px] leading-[1.65] text-[#111111] font-medium">
                {profile.displayName}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
                BASE
              </span>
              <span className="font-sans text-[15px] leading-[1.65] text-[#111111] font-medium">
                {profile.location}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
                STATUS
              </span>
              <span className="font-sans text-[15px] leading-[1.65] text-[#111111] font-medium">
                {profile.academicStatus}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
                EMAIL
              </span>
              <a
                href={`mailto:${profile.publicEmail}`}
                className="font-sans text-[14px] leading-[1.55] text-[#1B4D3E] hover:underline truncate"
              >
                {profile.publicEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Right Editorial Bio + Education Grid */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#1B4D3E]">
              01 / PROFILE
            </span>
            <h2 className="font-display text-[36px] md:text-[64px] font-extrabold uppercase text-[#111111] leading-[1.02] tracking-[-0.03em]">
              ABOUT ME
            </h2>
          </div>

          <p className="font-sans text-[19px] md:text-[22px] font-medium leading-[1.35] tracking-[-0.01em] text-[#111111]">
            {profile.bio}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="bg-[#F2F2F2] rounded-xl p-6 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[11px] font-bold tracking-[0.14em] uppercase ${
                      edu.isSchoolIcon ? 'text-[#1B4D3E]' : 'text-[#5A5A5A]'
                    }`}
                  >
                    {edu.period}
                  </span>
                  {edu.isSchoolIcon ? (
                    <GraduationCap size={20} className="text-[#111111]" aria-hidden="true" />
                  ) : (
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#111111] font-bold tabular-nums">
                      {edu.rightBadge}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-[22px] font-bold leading-[1.2] tracking-[-0.01em] text-[#111111]">
                    {edu.degree}
                  </h3>
                  <span className="font-sans text-[14px] leading-[1.55] text-[#5A5A5A]">
                    {edu.institution}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
