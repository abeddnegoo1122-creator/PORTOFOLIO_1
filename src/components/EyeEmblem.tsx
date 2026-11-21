import React from 'react';

interface EyeEmblemProps {
  className?: string;
  pupilRef?: React.RefObject<SVGCircleElement | null>;
  pupilOffset?: { x: number; y: number };
}

export const EyeEmblem: React.FC<EyeEmblemProps> = ({
  className = 'w-full h-full',
  pupilRef,
  pupilOffset,
}) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path d="M24 6C29.5 6 33.5 9.8 34.5 14.5C39.2 15.5 43 19.5 43 24C43 28.5 39.2 32.5 34.5 33.5C33.5 38.2 29.5 42 24 42C18.5 42 14.5 38.2 13.5 33.5C8.8 32.5 5 28.5 5 24C5 19.5 8.8 15.5 13.5 14.5C14.5 9.8 18.5 6 24 6Z" />
      <path d="M13 24C16.5 19 20 17.5 24 17.5C28 17.5 31.5 19 35 24C31.5 29 28 30.5 24 30.5C20 30.5 16.5 29 13 24Z" />
      <circle
        ref={pupilRef}
        cx="24"
        cy="24"
        r="3.5"
        fill="currentColor"
        className="transition-transform duration-75 ease-out"
        style={
          pupilOffset
            ? { transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }
            : undefined
        }
      />
    </svg>
  );
};
