import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info, X } from 'lucide-react';
import { useGuide } from '../context/GuideContext';

interface InfoTooltipProps {
  title?: string;
  content: string;
  example?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  badgeText?: string;
  size?: 'sm' | 'md';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  content,
  example,
  position = 'top',
  className = '',
  badgeText,
  size = 'sm',
}) => {
  const { isGuideModeActive } = useGuide();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div className={`relative inline-flex items-center align-middle ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`inline-flex items-center justify-center rounded-full transition-all focus:outline-none ${
          size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
        } ${
          isGuideModeActive
            ? 'text-blue-500 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20 ring-1 ring-blue-500/30 hover:bg-blue-500/30 hover:scale-110'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
        }`}
        aria-label={title || 'Aide contextuelle novice'}
        title={title || 'Astuce novice'}
      >
        {badgeText ? (
          <span className="text-[9px] font-mono font-bold leading-none">{badgeText}</span>
        ) : size === 'sm' ? (
          <HelpCircle className="w-3 h-3" />
        ) : (
          <Info className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="tooltip"
          className={`absolute z-50 w-64 sm:w-72 p-3.5 rounded-2xl bg-white dark:bg-[#1a2030] text-slate-800 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-blue-500/30 text-xs text-left animate-in fade-in zoom-in-95 duration-150 ${getPositionClasses()}`}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold font-headline text-xs">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{title || 'Guide Novice'}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {content}
          </p>

          {example && (
            <div className="mt-2 p-2 rounded-xl bg-slate-50 dark:bg-[#0a0e18] border border-slate-100 dark:border-[#262a35] text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span className="text-blue-600 dark:text-blue-300 font-semibold">Exemple : </span>
              {example}
            </div>
          )}

          {/* Pointer tail */}
          <div
            className={`absolute w-2 h-2 bg-white dark:bg-[#1a2030] border-slate-200 dark:border-blue-500/30 transform rotate-45 ${
              position === 'bottom'
                ? '-top-1 left-1/2 -translate-x-1/2 border-t border-l'
                : position === 'left'
                ? '-right-1 top-1/2 -translate-y-1/2 border-t border-r'
                : position === 'right'
                ? '-left-1 top-1/2 -translate-y-1/2 border-b border-l'
                : '-bottom-1 left-1/2 -translate-x-1/2 border-b border-r'
            }`}
          />
        </div>
      )}
    </div>
  );
};
