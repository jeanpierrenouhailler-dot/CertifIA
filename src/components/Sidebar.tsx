import React, { useState } from 'react';
import { AppScreen, CloudProvider } from '../types';
import { CertifAILogo } from './CertifAILogo';
import { 
  Home,
  Compass, 
  GraduationCap, 
  BarChart3, 
  Bot, 
  CheckSquare, 
  Layers, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Scale, 
  Settings, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  X,
  Target,
  Flame,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePwa } from '../context/PwaContext';
import { useSystemUpdate } from '../context/SystemUpdateContext';
import { useProgress } from '../context/ProgressContext';

interface SidebarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  activeProviderFilter?: CloudProvider;
  onSelectProvider?: (provider: CloudProvider) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenBlueprint?: (examId: string) => void;
  onOpenHamburgerMenu?: () => void;
  onOpenSystemSettings?: () => void;
  onOpenLegalModal?: () => void;
  onOpenFlashcardsDistribution?: () => void;
  onOpenComparator?: () => void;
  onOpenAIAssistant?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  onSelectProvider,
  isOpenMobile = false,
  onCloseMobile,
  onOpenBlueprint,
  onOpenHamburgerMenu,
  onOpenSystemSettings,
  onOpenLegalModal,
  onOpenFlashcardsDistribution,
  onOpenComparator,
  onOpenAIAssistant,
  isCollapsed: controlledCollapsed,
  onToggleCollapse: controlledToggleCollapse,
}) => {
  const { user, userProfile } = useAuth();
  const { isInstalled, promptInstall } = usePwa();
  const { versionInfo } = useSystemUpdate();
  const { certProgress } = useProgress();

  const [localCollapsed, setLocalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : localCollapsed;
  const toggleCollapse = controlledToggleCollapse || (() => setLocalCollapsed(!localCollapsed));

  // Expanded submenus accordion
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    certifications: true,
    apprentissage: true,
    progression: false,
  });

  const toggleSubmenu = (sectionKey: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleNav = (screen: AppScreen) => {
    onNavigate(screen);
    if (onCloseMobile) onCloseMobile();
  };

  // Cloud providers quick filters
  const cloudProviders: { id: CloudProvider; name: string }[] = [
    { id: 'azure', name: 'Azure' },
    { id: 'aws', name: 'AWS' },
    { id: 'gcp', name: 'GCP' },
    { id: 'ibm', name: 'IBM' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="app-sidebar"
        aria-label="Navigation principale"
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#121622] border-r border-slate-200 dark:border-[#1c202d] flex flex-col justify-between transition-all duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Top Header / Branding */}
        <div className="p-4 border-b border-slate-200 dark:border-[#1c202d] flex items-center justify-between">
          <div 
            onClick={() => handleNav('today')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden select-none"
          >
            <CertifAILogo showSubtitle={false} />
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-base font-extrabold text-slate-900 dark:text-white font-headline tracking-tight leading-none">
                  Certif<span className="text-blue-600 dark:text-blue-400">IA</span>
                </span>
                <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                  Cloud AI Certification Prep
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1c202d] transition-colors"
            title={isCollapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'}
            aria-label={isCollapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1c202d]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* SECTION 1: ACCUEIL */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Accueil
              </div>
            )}
            <button
              onClick={() => handleNav('today')}
              title={isCollapsed ? "Accueil - Session du jour" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentScreen === 'today'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
              }`}
            >
              <Home className={`w-4 h-4 shrink-0 ${currentScreen === 'today' ? 'text-white' : 'text-blue-500'}`} />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full truncate">
                  <span className="truncate">Accueil</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    currentScreen === 'today' ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}>
                    SRS 17
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* SECTION 2: CERTIFICATIONS */}
          <div className="space-y-1">
            {!isCollapsed ? (
              <div 
                onClick={() => toggleSubmenu('certifications')}
                className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center justify-between cursor-pointer select-none"
              >
                <span>Certifications</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSubmenus.certifications ? 'rotate-180' : ''}`} />
              </div>
            ) : null}

            {/* Catalogue */}
            <button
              onClick={() => handleNav('catalogue')}
              title={isCollapsed ? "Catalogue des certifications" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentScreen === 'catalogue'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
              }`}
            >
              <Compass className={`w-4 h-4 shrink-0 ${currentScreen === 'catalogue' ? 'text-white' : 'text-blue-500'}`} />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full truncate">
                  <span className="truncate">Catalogue</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    currentScreen === 'catalogue' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-[#202533] text-slate-500 dark:text-slate-400'
                  }`}>
                    18
                  </span>
                </div>
              )}
            </button>

            {/* Comparateur */}
            {(!isCollapsed ? openSubmenus.certifications : true) && (
              <button
                onClick={() => {
                  if (onOpenComparator) onOpenComparator();
                  if (onCloseMobile) onCloseMobile();
                }}
                title={isCollapsed ? "Comparateur de certifications" : undefined}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-all"
              >
                <Scale className="w-4 h-4 shrink-0 text-amber-500" />
                {!isCollapsed && <span className="truncate">Comparateur</span>}
              </button>
            )}

            {/* Parcours recommandés */}
            {(!isCollapsed ? openSubmenus.certifications : true) && (
              <button
                onClick={() => handleNav('recommendation')}
                title={isCollapsed ? "Parcours recommandés" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  currentScreen === 'recommendation'
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
                }`}
              >
                <Sparkles className={`w-4 h-4 shrink-0 ${currentScreen === 'recommendation' ? 'text-white' : 'text-indigo-400'}`} />
                {!isCollapsed && <span className="truncate">Parcours IA</span>}
              </button>
            )}
          </div>

          {/* SECTION 3: APPRENTISSAGE */}
          <div className="space-y-1">
            {!isCollapsed ? (
              <div 
                onClick={() => toggleSubmenu('apprentissage')}
                className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center justify-between cursor-pointer select-none"
              >
                <span>Apprentissage</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSubmenus.apprentissage ? 'rotate-180' : ''}`} />
              </div>
            ) : null}

            {/* Quiz & Entraînements */}
            <button
              onClick={() => handleNav('quiz')}
              title={isCollapsed ? "Quiz & Entraînements" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentScreen === 'quiz'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
              }`}
            >
              <CheckSquare className={`w-4 h-4 shrink-0 ${currentScreen === 'quiz' ? 'text-white' : 'text-emerald-500'}`} />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full truncate">
                  <span className="truncate">Quiz & Entraînement</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    QCM
                  </span>
                </div>
              )}
            </button>

            {/* Flashcards SRS */}
            {(!isCollapsed ? openSubmenus.apprentissage : true) && (
              <button
                onClick={() => handleNav('flashcards')}
                title={isCollapsed ? "Fiches Mémo & Répétition Espacée" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  currentScreen === 'flashcards'
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
                }`}
              >
                <Layers className={`w-4 h-4 shrink-0 ${currentScreen === 'flashcards' ? 'text-white' : 'text-blue-500'}`} />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full truncate">
                    <span className="truncate">Fiches Mémo (SRS)</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      2 800
                    </span>
                  </div>
                )}
              </button>
            )}

            {/* Examens Blancs */}
            {(!isCollapsed ? openSubmenus.apprentissage : true) && (
              <button
                onClick={() => handleNav('exam')}
                title={isCollapsed ? "Examens Blancs" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  currentScreen === 'exam'
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
                }`}
              >
                <Clock className={`w-4 h-4 shrink-0 ${currentScreen === 'exam' ? 'text-white' : 'text-amber-500'}`} />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full truncate">
                    <span className="truncate">Examens Blancs</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                      Chrono
                    </span>
                  </div>
                )}
              </button>
            )}
          </div>

          {/* SECTION 4: PROGRESSION */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Progression
              </div>
            )}
            <button
              onClick={() => handleNav('analytics')}
              title={isCollapsed ? "Tableau de bord & Progression" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentScreen === 'analytics'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
              }`}
            >
              <BarChart3 className={`w-4 h-4 shrink-0 ${currentScreen === 'analytics' ? 'text-white' : 'text-emerald-500'}`} />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full truncate">
                  <span className="truncate">Tableau de bord</span>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">
                    74%
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* SECTION 5: ASSISTANT IA */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Assistance
              </div>
            )}
            <button
              onClick={() => {
                if (onOpenAIAssistant) {
                  onOpenAIAssistant();
                } else {
                  handleNav('assistant');
                }
              }}
              title={isCollapsed ? "Assistant Pédagogique IA" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentScreen === 'assistant'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
              }`}
            >
              <Bot className={`w-4 h-4 shrink-0 ${currentScreen === 'assistant' ? 'text-white' : 'text-blue-500'}`} />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full truncate">
                  <span className="truncate">Assistant IA</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                    Tuteur
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Secondary: Glossaire */}
          <div className="pt-2 border-t border-slate-100 dark:border-[#1c202d]">
            <button
              onClick={() => handleNav('glossary')}
              title={isCollapsed ? "Glossaire & Encyclopédie IA" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentScreen === 'glossary'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
              }`}
            >
              <BookOpen className={`w-4 h-4 shrink-0 ${currentScreen === 'glossary' ? 'text-white' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">Glossaire & Encyclopédie</span>}
            </button>
          </div>
        </div>

        {/* Bottom Section: Profile & Settings */}
        <div className="p-3 border-t border-slate-200 dark:border-[#1c202d] space-y-1">
          {/* Settings button */}
          <button
            onClick={onOpenSystemSettings}
            title={isCollapsed ? "Paramètres système & Mises à jour" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2030] hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <Settings className="w-4 h-4 shrink-0 text-slate-400" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full truncate">
                <span className="truncate">Paramètres</span>
                <span className="text-[10px] font-mono text-slate-400">{versionInfo.version}</span>
              </div>
            )}
          </button>

          {/* User profile button */}
          <button
            onClick={() => handleNav('profile')}
            title={isCollapsed ? (user ? user.email || 'Mon Profil' : 'Connexion') : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              currentScreen === 'profile'
                ? 'bg-slate-200 dark:bg-[#1a2030] text-slate-900 dark:text-white font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
            }`}
          >
            <User className="w-4 h-4 shrink-0 text-blue-500" />
            {!isCollapsed && (
              <div className="flex flex-col text-left truncate">
                <span className="truncate font-semibold text-slate-900 dark:text-white">
                  {user?.displayName || userProfile?.displayName || 'Apprenant IA'}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {user ? 'Compte synchronisé' : 'Mode invité'}
                </span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
