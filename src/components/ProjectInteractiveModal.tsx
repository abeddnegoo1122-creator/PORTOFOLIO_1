import React, { useEffect, useState } from 'react';
import { X, Terminal, RotateCcw } from 'lucide-react';
import { ProjectItem } from '../data/portfolio';

interface ProjectInteractiveModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectInteractiveModal: React.FC<ProjectInteractiveModalProps> = ({
  project,
  onClose,
}) => {
  const [dobInput, setDobInput] = useState('2008-04-15');
  const [menuChoice, setMenuChoice] = useState<string>('');
  const [menuLog, setMenuLog] = useState<string[]>([
    '=== MENU PILIHAN (C++ CONSOLE) ===',
    '[1] Run Calculation (Arithmetic & Factorial)',
    '[2] Display Summary (Student Profile)',
    '[3] Clear Console',
    'Enter choice (1-3):',
  ]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  if (!project) return null;

  const computeDateDelta = () => {
    const parsed = new Date(`${dobInput}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return { valid: false, days: 0, years: 0, months: 0, remainingDays: 0, nextBirthdayDays: 0 };
    }
    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffMs = todayMid.getTime() - parsed.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let years = todayMid.getFullYear() - parsed.getFullYear();
    let months = todayMid.getMonth() - parsed.getMonth();
    let remainingDays = todayMid.getDate() - parsed.getDate();

    if (remainingDays < 0) {
      months -= 1;
      const prevMonthDays = new Date(todayMid.getFullYear(), todayMid.getMonth(), 0).getDate();
      remainingDays += prevMonthDays;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const nextBday = new Date(todayMid.getFullYear(), parsed.getMonth(), parsed.getDate());
    if (nextBday < todayMid) {
      nextBday.setFullYear(todayMid.getFullYear() + 1);
    }
    const nextBirthdayDays = Math.round(
      (nextBday.getTime() - todayMid.getTime()) / (1000 * 60 * 60 * 24)
    );

    return { valid: true, days, years, months, remainingDays, nextBirthdayDays };
  };

  const handleMenuExecute = (rawChoice: string) => {
    const trimmed = rawChoice.trim();
    if (!trimmed) return;

    if (trimmed === '1') {
      setMenuLog((prev) => [
        ...prev,
        `> ${trimmed}`,
        'case 1 -> runCalculation(): 5! = 120 | Sum(1..10) = 55',
      ]);
    } else if (trimmed === '2') {
      setMenuLog((prev) => [
        ...prev,
        `> ${trimmed}`,
        'case 2 -> displaySummary(): Abednego Sinaga | IT-PLN Jakarta | Python & C++',
      ]);
    } else if (trimmed === '3') {
      setMenuLog([
        '=== MENU PILIHAN (C++ CONSOLE) ===',
        '[1] Run Calculation (Arithmetic & Factorial)',
        '[2] Display Summary (Student Profile)',
        '[3] Clear Console',
        'Console cleared. Enter choice (1-3):',
      ]);
    } else {
      setMenuLog((prev) => [
        ...prev,
        `> ${trimmed}`,
        'default -> Error: "Invalid" — expected integer 1, 2, or 3.',
      ]);
    }
    setMenuChoice('');
  };

  const dateStats = computeDateDelta();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sandbox-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        data-cursor-surface="dark"
        className="w-full max-w-xl bg-[#141414] text-white rounded-xl border border-[#2E2E2E] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2E2E2E] bg-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <Terminal size={16} className="text-[#6ed5e7]" />
            <h3
              id="sandbox-modal-title"
              className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase"
            >
              {project.command} — INTERACTIVE DEMO
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close interactive demo"
            className="w-8 h-8 rounded bg-[#141414] hover:bg-[#133926] flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {project.demoMode === 'date-time' ? (
            <>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="dob-picker"
                  className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#6ed5e7]"
                >
                  INPUT BIRTH DATE (YYYY-MM-DD)
                </label>
                <input
                  id="dob-picker"
                  type="date"
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-[#1A1A1A] border border-[#2E2E2E] text-white font-mono text-sm focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>

              <div className="rounded-lg bg-[#0d0d0d] border border-[#2E2E2E] p-4 font-mono text-xs leading-relaxed">
                {dateStats.valid && dateStats.days >= 0 ? (
                  <div className="flex flex-col gap-1.5 text-[#6ed5e7] tabular-nums">
                    <div>{`>>> dob = date.fromisoformat("${dobInput}")`}</div>
                    <div>{`>>> delta = date.today() - dob`}</div>
                    <div className="text-white font-bold mt-1">
                      {`Days lived: ${dateStats.days.toLocaleString()}`}
                    </div>
                    <div className="text-[#E6E6E6]/80">
                      {`Exact age: ${dateStats.years} years, ${dateStats.months} months, ${dateStats.remainingDays} days`}
                    </div>
                    <div className="text-[#E6E6E6]/80">
                      {`Days until next birthday: ${dateStats.nextBirthdayDays}`}
                    </div>
                  </div>
                ) : (
                  <div className="text-[#ffb4aa]">
                    Please enter a valid date on or before today.
                  </div>
                )}
              </div>
            </>
          ) : project.demoMode === 'menu-pilihan' ? (
            <>
              <div className="rounded-lg bg-[#0d0d0d] border border-[#2E2E2E] p-4 font-mono text-xs leading-relaxed max-h-56 overflow-y-auto flex flex-col gap-1">
                {menuLog.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith('default ->')
                        ? 'text-[#ffb4aa]'
                        : line.startsWith('case ')
                          ? 'text-[#6ed5e7]'
                          : line.startsWith('>')
                            ? 'text-white font-bold'
                            : 'text-[#E6E6E6]/80'
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {['1', '2', '9', '3'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleMenuExecute(val)}
                    className="px-3 py-1.5 rounded bg-[#1A1A1A] hover:bg-[#133926] border border-[#2E2E2E] font-mono text-[11px] font-bold tracking-[0.1em] uppercase transition-colors cursor-pointer"
                  >
                    {val === '3' ? (
                      <span className="inline-flex items-center gap-1">
                        <RotateCcw size={11} /> Clear (3)
                      </span>
                    ) : val === '9' ? (
                      'Test Invalid (9)'
                    ) : (
                      `Choice ${val}`
                    )}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleMenuExecute(menuChoice);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={menuChoice}
                  onChange={(e) => setMenuChoice(e.target.value)}
                  placeholder="Type choice (1, 2, 3, or any key)..."
                  className="flex-1 px-3.5 py-2 rounded bg-[#1A1A1A] border border-[#2E2E2E] text-white font-mono text-xs focus:outline-none focus:border-[#1B4D3E]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#133926] hover:bg-[#1B4D3E] text-white font-mono text-[11px] font-bold tracking-[0.14em] uppercase cursor-pointer"
                >
                  ENTER
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="font-sans text-sm text-[#E6E6E6]/90">{project.description}</p>
              <pre className="rounded-lg bg-[#0d0d0d] border border-[#2E2E2E] p-4 font-mono text-xs text-[#6ed5e7] overflow-x-auto leading-relaxed">
                <code>{project.code}</code>
              </pre>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[#2E2E2E]">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#6ed5e7] hover:underline"
            >
              OPEN FULL REPOSITORY ON GITHUB ↗
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#1A1A1A] hover:bg-[#2E2E2E] font-mono text-[11px] font-bold tracking-[0.14em] uppercase cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
