import React from 'react';

interface CertifAILogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export const CertifAILogo: React.FC<CertifAILogoProps> = ({ className = '', showSubtitle = true }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-900 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0 ring-1 ring-white/15">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          {/* Neural cloud nodes and connection links */}
          <path
            d="M12 4L4 18H20L12 4Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="url(#nodeGlow)"
          />
          <circle cx="12" cy="5" r="2.2" fill="#93c5fd" />
          <circle cx="5" cy="17.5" r="2.2" fill="#60a5fa" />
          <circle cx="19" cy="17.5" r="2.2" fill="#38bdf8" />
          <circle cx="12" cy="13" r="1.6" fill="#ffffff" />
          <path d="M12 5L12 13M5 17.5L12 13M19 17.5L12 13" stroke="white" strokeWidth="1.5" strokeOpacity="0.8" />
          <defs>
            <linearGradient id="nodeGlow" x1="4" y1="4" x2="20" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93c5fd" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1 font-headline">
          Certif<span className="text-blue-400">AI</span>
        </span>
        {showSubtitle && (
          <span className="text-[9px] font-mono tracking-wider uppercase text-blue-300/60 font-semibold">
            Enterprise Engine
          </span>
        )}
      </div>
    </div>
  );
};
