import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { ProjectItem } from '../data/portfolio';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onOpenSandbox: (project: ProjectItem) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onOpenSandbox,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tilt, setTilt] = useState<Record<string, { rx: number; ry: number }>>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt((prev) => ({
      ...prev,
      [id]: { rx: -py * 4, ry: px * 4 },
    }));
  };

  const handleMouseLeave = (id: string) => {
    setHoveredId(null);
    setTilt((prev) => ({ ...prev, [id]: { rx: 0, ry: 0 } }));
  };

  return (
    <section id="projects" className="snap-start scroll-mt-16 py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#1B4D3E]">
            02 / WORKS
          </span>
          <h2 className="font-display text-[36px] md:text-[64px] font-extrabold uppercase text-[#111111] leading-[1.02] tracking-[-0.03em]">
            SELECTED PROJECTS
          </h2>
        </div>

        <a
          href="https://github.com/abeddnegoo1122-creator/Portofolio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#111111] text-[#E6E6E6] px-6 py-3 rounded font-mono text-[12px] font-bold tracking-[0.14em] uppercase hover:bg-[#133926] hover:text-white transition-all duration-200 hover:-translate-y-0.5 self-start md:self-auto whitespace-nowrap shrink-0"
        >
          GITHUB REPOSITORY ↗
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
        {projects.map((project) => {
          const isDark = project.theme === 'dark';
          const cardTilt = tilt[project.id] || { rx: 0, ry: 0 };
          const isHovered = hoveredId === project.id;

          return (
            <article
              key={project.id}
              data-cursor-surface={isDark ? 'dark' : undefined}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseMove={(e) => handleMouseMove(e, project.id)}
              onMouseLeave={() => handleMouseLeave(project.id)}
              style={{
                transform: isHovered
                  ? `perspective(900px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg) translateY(-2px)`
                  : 'perspective(900px) rotateX(0deg) rotateY(0deg)',
              }}
              className={`rounded-xl p-8 shadow-md flex flex-col justify-between gap-6 transition-transform duration-200 ${
                isDark ? 'bg-[#141414] text-white' : 'bg-white text-[#111111]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#5A5A5A]">
                  {project.meta}
                </span>
                <span className="font-display text-[22px] font-bold text-[#1B4D3E]">✦</span>
              </div>

              <div className="flex flex-col gap-2">
                <h3
                  className={`font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] uppercase ${
                    isDark ? 'text-white' : 'text-[#111111]'
                  }`}
                >
                  {project.title}
                </h3>
                <p className="font-sans text-[15px] leading-[1.65] text-[#5A5A5A]">
                  {project.description}
                </p>
              </div>

              {/* Terminal Preview */}
              <div
                data-cursor-surface="dark"
                className={`rounded-xl p-5 font-mono text-[11px] font-bold leading-relaxed overflow-x-auto ${
                  isDark ? 'bg-[#1A1A1A] text-white' : 'bg-[#141414] text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3 text-[#5A5A5A]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#133926]" />
                    <span>{project.command}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenSandbox(project)}
                    data-cursor="code"
                    data-cursor-label={project.demoMode === 'none' ? 'VIEW' : 'EXEC'}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#133926] text-white hover:bg-[#1B4D3E] text-[10px] tracking-[0.12em] uppercase transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Play size={10} fill="currentColor" />
                    {project.demoMode === 'none' ? 'INSPECT' : 'RUN'}
                  </button>
                </div>
                <pre className={isDark ? 'text-[#ffb4aa]' : 'text-[#6ed5e7]'}>
                  <code>{project.code}</code>
                </pre>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded font-mono text-[11px] font-bold tracking-[0.14em] uppercase ${
                        isDark
                          ? 'bg-[#1A1A1A] text-white'
                          : 'bg-[#F2F2F2] text-[#111111]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-[#1B4D3E] hover:underline whitespace-nowrap shrink-0"
                  >
                    VIEW SOURCE CODE ↗
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
