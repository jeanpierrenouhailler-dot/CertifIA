import React, { useState } from 'react';
import { 
  Home, 
  Compass, 
  GraduationCap, 
  BarChart3, 
  MoreHorizontal,
  Bot,
  User,
  Settings,
  HelpCircle,
  FileText,
  Download,
  X,
  PieChart,
  BookOpen,
  Sparkles,
  Scale,
  Clock,
  Layers,
  ChevronRight,
  Globe
} from 'lucide-react';
import { AppScreen } from '../types';
import { useAuth } from '../context/AuthContext';
import { useGuide } from '../context/GuideContext';
import { usePwa } from '../context/PwaContext';
import { useSystemUpdate } from '../context/SystemUpdateContext';
import { LanguageSelector } from './LanguageSelector';

interface MobileBottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenAIAssistant: () => void;
  onOpenSystemSettings?: () => void;
  onOpenFlashcardsDistribution?: () => void;
  onOpenComparator?: () => void;
  onOpenMenu?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenAIAssistant,
  onOpenSystemSettings,
  onOpenFlashcardsDistribution,
  onOpenComparator,
  onOpenMenu,
}) => {
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const { user } = useAuth();
  const { isGuideModeActive, toggleGuideMode, openLegalModal } = useGuide();
  const { isInstalled, promptInstall } = usePwa();
  const { versionInfo } = useSystemUpdate();

  // Primary active states
  const isAccueilActive = currentScreen === 'today';
  const isCertificationsActive = currentScreen === 'catalogue' || currentScreen === 'recommendation';
  const isApprentissageActive = ['quiz', 'flashcards', 'exam', 'glossary'].includes(currentScreen);
  const isProgressionActive = currentScreen === 'analytics';
  const isMoreActive = isMoreSheetOpen || currentScreen === 'profile' || currentScreen === 'assistant';

  const handleSelectNav = (screen: AppScreen) => {
    onNavigate(screen);
    setIsMoreSheetOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar: Exactly 5 main accessible touch targets (min 48px height) */}
      <nav 
        id="mobile-bottom-nav"
        aria-label="Navigation principale mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0f131d]/95 backdrop-blur-xl border-t border-slate-200 dark:border-[#1c1f2a] px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl flex items-center justify-around transition-colors duration-200"
      >
        {/* 1. ACCUEIL */}
        <button
          onClick={() => handleSelectNav('today')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            isAccueilActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-current={isAccueilActive ? 'page' : undefined}
          aria-label="Accueil CertifIA"
        >
          <Home className={`w-5 h-5 mb-0.5 transition-transform ${isAccueilActive ? 'scale-110 text-blue-600 dark:text-blue-400' : ''}`} />
          <span className="text-[11px] tracking-tight">Accueil</span>
          {isAccueilActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />}
        </button>

        {/* 2. CERTIFICATIONS */}
        <button
          onClick={() => handleSelectNav('catalogue')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            isCertificationsActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-current={isCertificationsActive ? 'page' : undefined}
          aria-label="Certifications officielles"
        >
          <Compass className={`w-5 h-5 mb-0.5 transition-transform ${isCertificationsActive ? 'scale-110 text-blue-600 dark:text-blue-400' : ''}`} />
          <span className="text-[11px] tracking-tight">Certifs</span>
          {isCertificationsActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />}
        </button>

        {/* 3. APPRENTISSAGE */}
        <button
          onClick={() => handleSelectNav('quiz')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            isApprentissageActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-current={isApprentissageActive ? 'page' : undefined}
          aria-label="Apprentissage et entraînement"
        >
          <GraduationCap className={`w-5 h-5 mb-0.5 transition-transform ${isApprentissageActive ? 'scale-110 text-blue-600 dark:text-blue-400' : ''}`} />
          <span className="text-[11px] tracking-tight">Apprendre</span>
          {isApprentissageActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />}
        </button>

        {/* 4. PROGRESSION */}
        <button
          onClick={() => handleSelectNav('analytics')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            isProgressionActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-current={isProgressionActive ? 'page' : undefined}
          aria-label="Tableau de bord et progression"
        >
          <BarChart3 className={`w-5 h-5 mb-0.5 transition-transform ${isProgressionActive ? 'scale-110 text-blue-600 dark:text-blue-400' : ''}`} />
          <span className="text-[11px] tracking-tight">Progrès</span>
          {isProgressionActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />}
        </button>

        {/* 5. PLUS (Slide-up Bottom Sheet containing Assistant IA + Profile + Settings + Utils) */}
        <button
          onClick={() => setIsMoreSheetOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            isMoreActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-label="Plus d’options et rubriques secondaires"
          aria-expanded={isMoreSheetOpen}
        >
          <div className="relative">
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <span className="text-[11px] tracking-tight">Plus</span>
          {isMoreActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />}
        </button>
      </nav>

      {/* Plus Bottom Sheet Modal for Mobile */}
      {isMoreSheetOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setIsMoreSheetOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Menu complémentaire CertifIA"
        >
          <div 
            className="w-full bg-white dark:bg-[#121622] border-t border-slate-200 dark:border-[#22283a] rounded-t-3xl max-h-[85vh] overflow-y-auto p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2232]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                  +
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Rubriques & Utilitaires</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Assistant IA, Profil, Paramètres et Outils</p>
                </div>
              </div>
              <button
                onClick={() => setIsMoreSheetOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2030]"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Featured Assistant IA Card */}
            <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    Assistant Pédagogique IA
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/20 text-blue-600 dark:text-blue-300">Tuteur</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Explications, astuces & mnémotechniques</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  onOpenAIAssistant();
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-500"
              >
                Ouvrir
              </button>
            </div>

            {/* Grid of Secondary & Deep-Learning Links */}
            <div className="mt-4 space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Apprentissage avancé</span>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <button
                    onClick={() => handleSelectNav('flashcards')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#171c2b] dark:hover:bg-[#20273c] border border-slate-200/80 dark:border-[#22283a] text-left flex items-center gap-2.5"
                  >
                    <Layers className="w-4 h-4 text-purple-500 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Fiches Mémo</div>
                      <div className="text-[10px] text-slate-400">2 800 cartes SRS</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreSheetOpen(false);
                      onOpenFlashcardsDistribution?.();
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#171c2b] dark:hover:bg-[#20273c] border border-slate-200/80 dark:border-[#22283a] text-left flex items-center gap-2.5"
                  >
                    <PieChart className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Répartition</div>
                      <div className="text-[10px] text-slate-400">Inventaire fiches</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectNav('exam')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#171c2b] dark:hover:bg-[#20273c] border border-slate-200/80 dark:border-[#22283a] text-left flex items-center gap-2.5"
                  >
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Examens blancs</div>
                      <div className="text-[10px] text-slate-400">Chronométré</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectNav('glossary')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#171c2b] dark:hover:bg-[#20273c] border border-slate-200/80 dark:border-[#22283a] text-left flex items-center gap-2.5"
                  >
                    <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Glossaire IA</div>
                      <div className="text-[10px] text-slate-400">Concepts & acronymes</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Certifications & Parcours</span>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <button
                    onClick={() => handleSelectNav('recommendation')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#171c2b] dark:hover:bg-[#20273c] border border-slate-200/80 dark:border-[#22283a] text-left flex items-center gap-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Parcours IA</div>
                      <div className="text-[10px] text-slate-400">Du Niv. 1 au Niv. 4</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreSheetOpen(false);
                      onOpenComparator?.();
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#171c2b] dark:hover:bg-[#20273c] border border-slate-200/80 dark:border-[#22283a] text-left flex items-center gap-2.5"
                  >
                    <Scale className="w-4 h-4 text-cyan-500 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Comparateur</div>
                      <div className="text-[10px] text-slate-400">Examens face à face</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Système & Compte</span>
                <div className="space-y-1.5 mt-1.5">
                  <button
                    onClick={() => handleSelectNav('profile')}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#171c2b] dark:hover:bg-[#20273c] border border-slate-200/80 dark:border-[#22283a] flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Profil & Objectifs d'apprentissage</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreSheetOpen(false);
                      onOpenSystemSettings?.();
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#171c2b] dark:hover:bg-[#20273c] border border-slate-200/80 dark:border-[#22283a] flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Settings className="w-4 h-4 text-slate-500" />
                      <div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Paramètres système</span>
                        <span className="ml-2 text-[10px] font-mono text-slate-400">{versionInfo.version}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <div className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#171c2b] border border-slate-200/80 dark:border-[#22283a] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Langue / Language</span>
                    </div>
                    <LanguageSelector variant="compact" />
                  </div>

                  <button
                    onClick={() => {
                      setIsMoreSheetOpen(false);
                      toggleGuideMode();
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#171c2b] dark:hover:bg-[#20273c] border border-slate-200/80 dark:border-[#22283a] flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Mode Guide & Infobulles</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isGuideModeActive ? 'bg-emerald-500/20 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                      {isGuideModeActive ? 'ACTIF' : 'INACTIF'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreSheetOpen(false);
                      openLegalModal();
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#171c2b] dark:hover:bg-[#20273c] border border-slate-200/80 dark:border-[#22283a] flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Mentions légales & Avertissement</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {!isInstalled && (
                    <button
                      onClick={() => {
                        setIsMoreSheetOpen(false);
                        promptInstall();
                      }}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between text-left shadow-md"
                    >
                      <div className="flex items-center gap-2.5">
                        <Download className="w-4 h-4 text-white" />
                        <span className="text-xs font-bold">Installer l’application sur l’écran d’accueil</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/80" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
