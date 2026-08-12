import React from 'react';

interface LoaderProps {
  text?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ 
  text = "Loading St. Joseph Database...",
  fullScreen = true
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      <style>{`
        .erp-spinner {
          position: relative;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .erp-spinner div {
          position: absolute;
          width: 4px;
          height: 14px;
          background: #f59e0b;
          border-radius: 2px;
          transform: rotate(calc(var(--rotation) * 1deg)) translate(0, -18px);
          animation: spinner-fzua35 1s calc(var(--delay) * 1s) infinite ease-in-out;
        }

        .erp-spinner div:nth-child(1) { --delay: 0.1; --rotation: 36; }
        .erp-spinner div:nth-child(2) { --delay: 0.2; --rotation: 72; }
        .erp-spinner div:nth-child(3) { --delay: 0.3; --rotation: 108; }
        .erp-spinner div:nth-child(4) { --delay: 0.4; --rotation: 144; }
        .erp-spinner div:nth-child(5) { --delay: 0.5; --rotation: 180; }
        .erp-spinner div:nth-child(6) { --delay: 0.6; --rotation: 216; }
        .erp-spinner div:nth-child(7) { --delay: 0.7; --rotation: 252; }
        .erp-spinner div:nth-child(8) { --delay: 0.8; --rotation: 288; }
        .erp-spinner div:nth-child(9) { --delay: 0.9; --rotation: 324; }
        .erp-spinner div:nth-child(10) { --delay: 1.0; --rotation: 360; }

        @keyframes spinner-fzua35 {
          0%, 100% {
            opacity: 0.25;
            transform: rotate(calc(var(--rotation) * 1deg)) translate(0, -18px) scale(0.85);
          }
          50% {
            opacity: 1;
            transform: rotate(calc(var(--rotation) * 1deg)) translate(0, -22px) scale(1.15);
            background: #fbbf24;
            box-shadow: 0 0 14px rgba(245, 158, 11, 0.85);
          }
        }
      `}</style>
      
      <div className="erp-spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>

      {text && (
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-amber-400 font-extrabold text-sm tracking-wide animate-pulse">
            {text}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            St. Joseph Senior Secondary School, Dholpur
          </p>
        </div>
      )}
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center">
      {content}
    </div>
  );
};

export default Loader;
