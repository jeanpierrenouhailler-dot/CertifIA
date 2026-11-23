import React, { useState } from 'react';
import {
  Compass,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AppScreen } from '../types';
import { useGuide } from '../context/GuideContext';
import { useOnboardingTour } from '../context/OnboardingTourContext';
import { useTranslation } from '../i18n';

interface ScreenGuideBannerProps {
  screenKey: Exclude<AppScreen, 'landing'>;
  tourStepIndex?: number;
  className?: string;
}

const DEFAULT_TOUR_STEP_BY_SCREEN: Record<Exclude<AppScreen, 'landing'>, number> = {
  today: 0,
  catalogue: 3,
  recommendation: 4,
  quiz: 5,
  flashcards: 6,
  exam: 7,
  assistant: 8,
  analytics: 9,
  glossary: 0,
  profile: 0,
  audit: 0,
};

export const ScreenGuideBanner: React.FC<ScreenGuideBannerProps> = ({
  screenKey,
  tourStepIndex,
  className = '',
}) => {
  const { isGuideModeActive, toggleGuideMode } = useGuide();
  const { startTour } = useOnboardingTour();
  const { t, i18n } = useTranslation(['navigation', 'common']);
  const isEn = i18n.language?.startsWith('en');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const stepIndex = tourStepIndex ?? DEFAULT_TOUR_STEP_BY_SCREEN[screenKey] ?? 0;

  const title = t(`navigation:screenGuides.${screenKey}.title`);
  const summary = t(`navigation:screenGuides.${screenKey}.summary`);
  const steps = [
    t(`navigation:screenGuides.${screenKey}.step1`),
    t(`navigation:screenGuides.${screenKey}.step2`),
    t(`navigation:screenGuides.${screenKey}.step3`),
  ];

  if (!isGuideModeActive) {
    return (
      <div
        data-screen-guide={screenKey}
        className={`flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-[#131826]/80 border border-slate-200 dark:border-[#262a35] text-xs ${className}`}
      >
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 min-w-0">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="truncate">
            {isEn
              ? `Contextual onboarding disabled for "${title}".`
              : `Onboarding contextuel masqué sur « ${title} ».`}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleGuideMode}
          className="px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-mono text-[11px] font-semibold shrink-0 transition-colors"
        >
          {isEn ? 'Enable guide' : 'Activer le guide'}
        </button>
      </div>
    );
  }

  return (
    <section
      data-screen-guide={screenKey}
      aria-label={title}
      className={`rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-white dark:from-[#121a2d] dark:via-[#141a2b] dark:to-[#111623] border border-blue-200 dark:border-blue-500/30 shadow-sm overflow-hidden transition-colors ${className}`}
    >
      {/* Top Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600/15 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                {isEn ? 'Contextual Guide' : 'Onboarding Contextuel'}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate font-headline">
                {title}
              </h2>
            </div>
            {isCollapsed && (
              <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
                {summary}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => startTour(stepIndex)}
            className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-[11px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEn ? 'Guided Tour' : 'Visite guidée'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-[#1a2234] hover:bg-slate-100 dark:hover:bg-[#232c42] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#2a3347] font-mono text-[11px] font-medium transition-colors flex items-center gap-1"
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isEn ? 'How it works' : 'Comment ça marche'}</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isEn ? 'Collapse' : 'Réduire'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleGuideMode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#232c42] transition-colors"
            title={isEn ? 'Hide contextual onboarding & tooltips' : 'Masquer les guides et infobulles'}
            aria-label={isEn ? 'Hide contextual onboarding' : 'Masquer le guide contextuel'}
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {!isCollapsed && (
        <div className="px-4 pb-3.5 pt-1 border-t border-blue-200/60 dark:border-blue-500/20 space-y-2.5">
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {summary}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {steps.map((stepText, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-white/90 dark:bg-[#0e1422]/80 border border-slate-200/80 dark:border-[#252e42] text-[11px] text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{stepText}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
