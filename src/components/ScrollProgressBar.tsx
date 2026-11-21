import React, { useEffect, useRef, useState } from 'react';

interface ScrollProgressBarProps {
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ scrollContainerRef }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    const container = scrollContainerRef?.current ?? null;

    const updateProgress = () => {
      rafId = null;
      const scrollTop = container
        ? container.scrollTop
        : window.scrollY || document.documentElement.scrollTop;
      const maxScroll = container
        ? container.scrollHeight - container.clientHeight
        : document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${ratio})`;
      }
      setPercent(Math.round(ratio * 100));
    };

    const handleScrollOrResize = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    const scrollTarget: EventTarget = container ?? window;
    scrollTarget.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      scrollTarget.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [scrollContainerRef]);

  return (
    <div
      role="progressbar"
      aria-label="Portfolio scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[#111111]/10 pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-[#133926] will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};
