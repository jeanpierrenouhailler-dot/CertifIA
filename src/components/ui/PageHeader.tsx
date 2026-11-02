import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20',
  breadcrumbs,
  actions,
  className = '',
}) => {
  return (
    <div className={`pb-6 border-b border-slate-200 dark:border-[#1c1f2a] flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}>
      <div className="space-y-1.5">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 flex-wrap">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {crumb.onClick && !isLast ? (
                    <button
                      onClick={crumb.onClick}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-2 hover:underline"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className={isLast ? 'text-slate-800 dark:text-slate-200 font-semibold' : ''}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-headline tracking-tight">
            {title}
          </h1>
          {badge && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
          {actions}
        </div>
      )}
    </div>
  );
};
