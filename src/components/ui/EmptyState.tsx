import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div className={`p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] flex items-center justify-center text-slate-500 dark:text-slate-400 mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-headline mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-sm">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              {actionLabel}
            </button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#202533] dark:hover:bg-[#2a3040] text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm border border-slate-200 dark:border-[#262a35] transition-all"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
