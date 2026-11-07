import React, { useEffect, useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles, 
  Lightbulb, 
  Clock, 
  Compass, 
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { useOnboardingTour, TOUR_STEPS, TourSpeed } from '../context/OnboardingTourContext';
import { useTranslation } from '../i18n';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const OnboardingTourModal: React.FC = () => {
  const {
    isTourActive,
    isPaused,
    currentStepIndex,
    currentStep,
    totalSteps,
    progressPercent,
    timeRemainingSeconds,
    tourSpeed,
    setTourSpeed,
    pauseTour,
    resumeTour,
    togglePauseTour,
    nextStep,
    prevStep,
    goToStep,
    stopTour,
  } = useOnboardingTour();

  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'fr';

  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const tourCardRef = useRef<HTMLDivElement>(null);

  // Measure and track target element bounding box
  useEffect(() => {
    if (!isTourActive) {
      setTargetRect(null);
      return;
    }

    const updateTargetPosition = () => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Check if visible
        if (rect.width > 0 && rect.height > 0) {
          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });
          // Scroll target smoothly into view if offscreen
          const isOffscreen = rect.top < 60 || rect.bottom > window.innerHeight - 80;
          if (isOffscreen) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }
      }
      setTargetRect(null);
    };

    // Immediate check + delayed check after screen transition settles
    updateTargetPosition();
    const timer1 = setTimeout(updateTargetPosition, 150);
    const timer2 = setTimeout(updateTargetPosition, 400);

    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition, true);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition, true);
    };
  }, [isTourActive, currentStepIndex, currentStep.targetSelector, currentStep.screen]);

  // Global Keyboard Navigation (Space = Pause/Play, Left = Prev, Right = Next, Escape = Quit)
  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in form inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        stopTour();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePauseTour();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourActive, stopTour, togglePauseTour, nextStep, prevStep]);

  if (!isTourActive) return null;

  const isLastStep = currentStepIndex === totalSteps - 1;
  const title = currentLang === 'en' ? currentStep.titleEn : currentStep.titleFr;
  const badge = currentLang === 'en' ? currentStep.badgeEn : currentStep.badgeFr;
  const description = currentLang === 'en' ? currentStep.descriptionEn : currentStep.descriptionFr;
  const tip = currentLang === 'en' ? currentStep.tipEn : currentStep.tipFr;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto select-none font-sans">
      
      {/* 1. Backdrop overlay with cutout / shadow spotlight */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={pauseTour}
      />

      {/* 2. Visual Spotlight Highlight Ring around target element if found */}
      {targetRect && (
        <div
          style={{
            top: Math.max(8, targetRect.top - 8),
            left: Math.max(8, targetRect.left - 8),
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
          className="fixed pointer-events-none rounded-2xl border-2 border-blue-400 dark:border-blue-400 shadow-[0_0_0_9999px_rgba(2,6,23,0.75),0_0_35px_rgba(59,130,246,0.6)] transition-all duration-300 z-[101]"
        >
          {/* Subtle animated locator tag */}
          <div className="absolute -top-3.5 left-4 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Sparkles className="w-2.5 h-2.5 text-blue-200" />
            <span>{currentLang === 'en' ? 'Active Focus' : 'Élément ciblé'}</span>
          </div>
        </div>
      )}

      {/* 3. Floating Contextual Tour Card Container */}
      <div className="fixed inset-x-0 bottom-4 sm:bottom-8 z-[102] flex justify-center px-3 sm:px-4 pointer-events-none">
        <div
          ref={tourCardRef}
          className="w-full max-w-2xl bg-white dark:bg-[#121624] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-blue-500/30 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-200 flex flex-col"
        >
          {/* Auto-Play Top Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden relative">
            <div
              style={{ width: `${progressPercent}%` }}
              className={`h-full transition-all duration-100 ease-linear ${
                isPaused 
                  ? 'bg-amber-500' 
                  : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400'
              }`}
            />
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            
            {/* Header: Step Counter, Status Badge, Speed & Close Button */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-[#202538] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {badge}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {isPaused ? (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                      <Pause className="w-3 h-3" />
                      <span>{currentLang === 'en' ? 'Paused' : 'En pause'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>
                        {currentLang === 'en'
                          ? `Auto-advance in ${timeRemainingSeconds}s`
                          : `Passage auto dans ${timeRemainingSeconds}s`}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Top Action Icons: Speed & Close */}
              <div className="flex items-center gap-1.5">
                {/* Speed Dropdown Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2032] text-xs font-mono flex items-center gap-1 transition-colors"
                    title={currentLang === 'en' ? 'Adjust tour speed' : 'Régler la vitesse automatique'}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden sm:inline">
                      {tourSpeed === 'fast' ? '5s' : tourSpeed === 'normal' ? '8s' : '12s'}
                    </span>
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-32 p-1.5 rounded-xl bg-white dark:bg-[#161c2d] border border-slate-200 dark:border-[#2b334a] shadow-xl z-20 space-y-1 text-xs">
                      {[
                        { id: 'fast', labelFr: 'Rapide (5s)', labelEn: 'Fast (5s)' },
                        { id: 'normal', labelFr: 'Normal (8s)', labelEn: 'Normal (8s)' },
                        { id: 'slow', labelFr: 'Détaillé (12s)', labelEn: 'Slow (12s)' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setTourSpeed(s.id as TourSpeed);
                            setShowSpeedMenu(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                            tourSpeed === s.id
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#20273c]'
                          }`}
                        >
                          {currentLang === 'en' ? s.labelEn : s.labelFr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Exit button */}
                <button
                  onClick={stopTour}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2032] transition-colors"
                  title={currentLang === 'en' ? 'Exit Tour (Escape)' : 'Quitter la visite guidée (Échap)'}
                  aria-label="Quitter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Detailed Explanation */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-headline leading-tight">
                {title}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Practical CertifIA Tip Box */}
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-500/20 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
              <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold mr-1">
                  {currentLang === 'en' ? 'CertifIA Tip:' : 'Astuce CertifIA :'}
                </span>
                <span>{tip}</span>
              </div>
            </div>

            {/* Quick Step Mini-map Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {TOUR_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'w-6 bg-blue-600 dark:bg-blue-400'
                      : idx < currentStepIndex
                      ? 'w-1.5 bg-blue-300 dark:bg-blue-900 hover:bg-blue-400'
                      : 'w-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                  }`}
                  title={`${idx + 1}. ${currentLang === 'en' ? step.titleEn : step.titleFr}`}
                />
              ))}
            </div>

            {/* Main Interactive Controls: Précédent, Pause/Continuer, Suivant, Quitter */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#202538] flex flex-wrap items-center justify-between gap-2.5">
              
              {/* Left group: Previous button */}
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-[#2b334a] bg-slate-50 dark:bg-[#161c2d] hover:bg-slate-100 dark:hover:bg-[#20273c] disabled:opacity-40 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                title={currentLang === 'en' ? 'Previous step (Left Arrow)' : 'Étape précédente (Flèche gauche)'}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLang === 'en' ? 'Previous' : 'Précédent'}</span>
              </button>

              {/* Center group: Pause / Continuer (Play) */}
              <button
                onClick={togglePauseTour}
                className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                  isPaused
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                }`}
                title={currentLang === 'en' ? 'Toggle pause (Space)' : 'Mettre en pause ou continuer (Espace)'}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{currentLang === 'en' ? 'Resume Tour' : 'Continuer'}</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>{currentLang === 'en' ? 'Pause' : 'Pause'}</span>
                  </>
                )}
              </button>

              {/* Right group: Next step & Exit button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={stopTour}
                  className="py-2 px-3 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2032] transition-colors"
                  title={currentLang === 'en' ? 'Exit Tour (Escape)' : 'Quitter la visite (Échap)'}
                >
                  <span>{currentLang === 'en' ? 'Exit' : 'Quitter'}</span>
                </button>

                <button
                  onClick={nextStep}
                  className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
                  title={currentLang === 'en' ? 'Next step (Right Arrow)' : 'Étape suivante (Flèche droite)'}
                >
                  <span>
                    {isLastStep 
                      ? (currentLang === 'en' ? 'Finish Tour' : 'Terminer la visite') 
                      : (currentLang === 'en' ? 'Next' : 'Suivant')}
                  </span>
                  {!isLastStep && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>

            </div>

            {/* Keyboard shortcut hint */}
            <div className="hidden sm:flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-1">
              <span>{currentLang === 'en' ? 'Keyboard: Space = Pause/Resume' : 'Raccourcis : Espace = Pause/Continuer'}</span>
              <span>{currentLang === 'en' ? '← / → = Navigate • Esc = Exit' : '← / → = Naviguer • Échap = Quitter'}</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
