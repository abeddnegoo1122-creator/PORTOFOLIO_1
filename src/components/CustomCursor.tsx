import React, { useEffect, useMemo, useRef, useState } from 'react';

type CursorVariant = 'default' | 'pointer' | 'card' | 'code' | 'text';
type CursorSurface = 'light' | 'dark';

interface CursorState {
  variant: CursorVariant;
  label: string;
  surface: CursorSurface;
}

const DEFAULT_STATE: CursorState = {
  variant: 'default',
  label: '',
  surface: 'light',
};

/**
 * 26x26 pixel-art Ace of Spades card faithfully matching the tilted pixel cursor reference.
 * K = dark pixel outline, W = white card face, G = cool grey bevel, S = spade / corner pip.
 */
const PIXEL_CARD_MAP = [
  '..........................',
  '...........KKK............',
  '..........KWWWKK..........',
  '.........KWWWWWWKKK.......',
  '.........KWWSWWWWWWKK.....',
  '........KWWSSWWWWWWWWK....',
  '........KWWWWWWWWWWWWGK...',
  '.......KWWWWWWWWWWWWWGK...',
  '.......KWWWWWWSSWWWWWGK...',
  '......KWWWWWWSSSSWWWWK....',
  '......KWWWWWSSSSSSWWGK....',
  '.....KWWWWWSSSSSSSSWGK....',
  '.....KWWWWSSSSSSSSSWGK....',
  '....KWWWWSSSSSSSSSWGK.....',
  '....KWWWWSSSSSSSSWGK......',
  '...KWWWWWSSSWSSSWWGK......',
  '...KWWWWWWWSWSSWWGK.......',
  '..KWWWWWWWWSSSWWGK........',
  '..KWWGWWWWWWWWWGK.........',
  '..KKWGGWWWSWWWGK..........',
  '...KKWGGWWSSWGK...........',
  '.....KKGGWWWGK............',
  '.......KKGGGGK............',
  '.........KKKK.............',
  '..........................',
  '..........................',
];

interface PixelRun {
  x: number;
  y: number;
  width: number;
  type: 'K' | 'W' | 'G' | 'S';
}

const compilePixelRuns = (): PixelRun[] => {
  const runs: PixelRun[] = [];
  for (let y = 0; y < PIXEL_CARD_MAP.length; y++) {
    const row = PIXEL_CARD_MAP[y];
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === 'K' || ch === 'W' || ch === 'G' || ch === 'S') {
        let end = x + 1;
        while (end < row.length && row[end] === ch) {
          end++;
        }
        runs.push({ x, y, width: end - x, type: ch });
        x = end;
      } else {
        x++;
      }
    }
  }
  return runs;
};

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>(DEFAULT_STATE);
  const [clickBurst, setClickBurst] = useState<{ id: number; x: number; y: number } | null>(null);

  const leaderRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const followerPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(false);

  const pixelRuns = useMemo(() => compilePixelRuns(), []);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateAvailability = () => {
      const canUse = finePointer.matches;
      setEnabled(canUse);
      if (canUse) {
        document.documentElement.classList.add('custom-cursor-active');
      } else {
        document.documentElement.classList.remove('custom-cursor-active');
      }
    };

    updateAvailability();
    finePointer.addEventListener('change', updateAvailability);

    const resolveTargetState = (target: EventTarget | null): CursorState => {
      if (!(target instanceof Element)) return DEFAULT_STATE;

      const darkSurfaceEl = target.closest('[data-cursor-surface="dark"]');
      const surface: CursorSurface = darkSurfaceEl ? 'dark' : 'light';

      const customEl = target.closest('[data-cursor]');
      if (customEl) {
        const variant = (customEl.getAttribute('data-cursor') as CursorVariant) || 'pointer';
        const label = customEl.getAttribute('data-cursor-label') || '';
        return { variant, label, surface };
      }

      const linkOrBtn = target.closest('a, button, [role="button"], [role="option"], summary');
      if (linkOrBtn) {
        const label =
          linkOrBtn.getAttribute('data-cursor-label') ||
          (linkOrBtn.tagName === 'A' ? 'OPEN ↗' : 'SELECT');
        return { variant: 'pointer', label, surface };
      }

      const inputEl = target.closest('input, textarea, select');
      if (inputEl) {
        return { variant: 'text', label: 'INPUT', surface };
      }

      if (target.closest('pre, code')) {
        return { variant: 'code', label: 'CODE', surface };
      }

      return { variant: 'default', label: '', surface };
    };

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      if (!visibleRef.current) {
        visibleRef.current = true;
        followerPosRef.current.x = e.clientX;
        followerPosRef.current.y = e.clientY;
        setVisible(true);
      }

      if (leaderRef.current) {
        leaderRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      if (reducedMotion.matches && followerRef.current) {
        followerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      const nextState = resolveTargetState(e.target);
      setCursorState((prev) =>
        prev.variant === nextState.variant &&
        prev.label === nextState.label &&
        prev.surface === nextState.surface
          ? prev
          : nextState
      );
    };

    const handleMouseDown = (e: MouseEvent) => {
      setPressed(true);
      setClickBurst({ id: Date.now(), x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setPressed(false);
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const animateFollower = () => {
      if (!reducedMotion.matches && followerRef.current) {
        const ease = 0.18;
        followerPosRef.current.x += (posRef.current.x - followerPosRef.current.x) * ease;
        followerPosRef.current.y += (posRef.current.y - followerPosRef.current.y) * ease;
        followerRef.current.style.transform = `translate3d(${followerPosRef.current.x}px, ${followerPosRef.current.y}px, 0)`;
      }
      rafRef.current = window.requestAnimationFrame(animateFollower);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = window.requestAnimationFrame(animateFollower);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      finePointer.removeEventListener('change', updateAvailability);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (!enabled) return null;

  const isHoveringInteractive = cursorState.variant !== 'default';
  const isDark = cursorState.surface === 'dark';

  const spadeFill =
    cursorState.variant === 'code'
      ? '#006672'
      : cursorState.variant === 'card' || cursorState.variant === 'pointer'
        ? '#133926'
        : '#231B26';

  const outlineFill =
    cursorState.variant === 'code' && isDark
      ? '#6ed5e7'
      : '#161118';

  return (
    <>
      {/* Click shockwave burst */}
      {clickBurst && (
        <div
          key={clickBurst.id}
          aria-hidden="true"
          onAnimationEnd={() => setClickBurst(null)}
          style={{
            left: clickBurst.x,
            top: clickBurst.y,
          }}
          className="fixed z-[9997] pointer-events-none -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-[#1B4D3E] animate-[cursorBurst_0.42s_cubic-bezier(0.16,1,0.3,1)_forwards]"
        />
      )}

      {/* Trailing Swiss Neo-Brutalist Registration Reticle */}
      <div
        ref={followerRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 z-[9998] pointer-events-none transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 relative flex items-center justify-center transition-all duration-200 ease-out ${
            cursorState.variant === 'card'
              ? 'w-16 h-16'
              : cursorState.variant === 'pointer' || cursorState.variant === 'code'
                ? 'w-14 h-14'
                : cursorState.variant === 'text'
                  ? 'w-9 h-9'
                  : 'w-8 h-8'
          } ${pressed ? 'scale-75' : 'scale-100'}`}
        >
          <svg
            viewBox="0 0 64 64"
            className={`w-full h-full transition-transform duration-300 ${
              isHoveringInteractive ? 'rotate-45' : 'rotate-0'
            } ${
              isDark
                ? cursorState.variant === 'code'
                  ? 'text-[#6ed5e7]'
                  : 'text-white'
                : cursorState.variant === 'pointer' || cursorState.variant === 'card'
                  ? 'text-[#133926]'
                  : 'text-[#111111]'
            }`}
            fill="none"
          >
            {cursorState.variant === 'default' ? (
              <>
                <circle
                  cx="32"
                  cy="32"
                  r="18"
                  stroke="currentColor"
                  strokeOpacity="0.32"
                  strokeWidth="1.25"
                  strokeDasharray="3 4"
                />
                <path
                  d="M32 6V12M32 52V58M6 32H12M52 32H58"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="1.25"
                />
              </>
            ) : (
              <>
                <path
                  d="M10 20V10H20M44 10H54V20M54 44V54H44M20 54H10V44"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="square"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="22"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              </>
            )}
          </svg>

          {cursorState.label && (
            <span
              className={`absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2 py-0.5 rounded font-mono text-[9px] font-bold tracking-[0.14em] uppercase whitespace-nowrap shadow-md border transition-all duration-150 ${
                isDark
                  ? 'bg-[#1A1A1A] text-[#6ed5e7] border-[#2E2E2E]'
                  : 'bg-[#111111] text-white border-[#111111]'
              }`}
            >
              {cursorState.label}
            </span>
          )}
        </div>
      </div>

      {/* Primary Pixel Ace of Spades Playing-Card Cursor */}
      <div
        ref={leaderRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 z-[9999] pointer-events-none transition-opacity duration-150 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`transition-transform duration-150 ease-out ${
            pressed ? 'scale-[0.84]' : 'scale-100'
          } ${
            cursorState.variant === 'default'
              ? '-translate-x-[15px] -translate-y-[3px]'
              : '-translate-x-1/2 -translate-y-1/2'
          }`}
        >
          {cursorState.variant === 'text' ? (
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
              <path
                d="M7 3H17M7 25H17M12 3V25M9 14H15"
                stroke={isDark ? '#FFFFFF' : '#111111'}
                strokeWidth="2.2"
                strokeLinecap="square"
              />
            </svg>
          ) : (
            <svg
              width="36"
              height="36"
              viewBox="0 0 26 26"
              shapeRendering="crispEdges"
              className={`drop-shadow-[0_4px_10px_rgba(0,0,0,0.28)] transition-transform duration-200 ease-out ${
                cursorState.variant === 'card'
                  ? 'rotate-[18deg] scale-[1.15]'
                  : cursorState.variant === 'code'
                    ? 'rotate-[12deg] scale-110'
                    : cursorState.variant === 'pointer'
                      ? 'rotate-[14deg] scale-110'
                      : 'rotate-0 scale-100'
              }`}
            >
              {pixelRuns.map((run, idx) => (
                <rect
                  key={idx}
                  x={run.x}
                  y={run.y}
                  width={run.width}
                  height={1}
                  fill={
                    run.type === 'K'
                      ? outlineFill
                      : run.type === 'W'
                        ? '#FFFFFF'
                        : run.type === 'G'
                          ? '#B8BCC6'
                          : spadeFill
                  }
                />
              ))}
            </svg>
          )}
        </div>
      </div>
    </>
  );
};
