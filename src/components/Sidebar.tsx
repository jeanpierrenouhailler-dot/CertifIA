import React from 'react';
import { AppScreen, CloudProvider } from '../types';
import { CertifAILogo } from './CertifAILogo';
import { 
  Compass, 
  Target, 
  Layers, 
  Clock, 
  BarChart3, 
  ChevronRight, 
  Sparkles,
  Flame,
  X,
  User,
  CheckSquare,
  Menu,
  Settings,
  Download,
  Scale,
  PieChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePwa } from '../context/PwaContext';
import { useSystemUpdate } from '../context/SystemUpdateContext';

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
}) => {
  const { user, userProfile } = useAuth();
  const { promptInstall, isInstalled } = usePwa();
  const { versionInfo } = useSystemUpdate();

  const navItems = [
    {
      id: 'today' as AppScreen,
      label: "Aujourd'hui",
      icon: Target,
      badge: '🎯 17',
      highlightBadge: true,
    },
    {
      id: 'recommendation' as AppScreen,
      label: 'Parcours IA',
      icon: Sparkles,
      badge: 'Sur-mesure',
      highlightBadge: true,
    },
    {
      id: 'catalogue' as AppScreen,
      label: 'Catalogue',
      icon: Compass,
      badge: '18',
    },
    {
      id: 'quiz' as AppScreen,
      label: 'Entraînement',
      icon: CheckSquare,
      badge: 'QCM',
    },
    {
      id: 'flashcards' as AppScreen,
      label: 'Fiches Mémo',
      icon: Layers,
      badge: 'SRS',
    },
    {
      id: 'exam' as AppScreen,
      label: 'Examen Blanc',
      icon: Clock,
      badge: 'Live',
      highlightBadge: true,
    },
    {
      id: 'analytics' as AppScreen,
      label: 'Analytics',
      icon: BarChart3,
      badge: '74%',
    },
    {
      id: 'profile' as AppScreen,
      label: 'Mon Profil',
      icon: User,
      badge: user ? 'Sync' : 'Connexion',
      highlightBadge: !user,
    },
  ];

  const cloudProviders: { id: CloudProvider; name: string; color: string }[] = [
    { id: 'aws', name: 'AWS', color: 'hover:border-amber-500/40 hover:text-amber-500 dark:hover:text-amber-300' },
    { id: 'azure', name: 'Azure', color: 'hover:border-blue-500/40 hover:text-blue-500 dark:hover:text-blue-300' },
    { id: 'gcp', name: 'GCP', color: 'hover:border-emerald-500/40 hover:text-emerald-500 dark:hover:text-emerald-300' },
    { id: 'ibm', name: 'IBM', color: 'hover:border-indigo-500/40 hover:text-indigo-500 dark:hover:text-indigo-300' },
    { id: 'nvidia', name: 'NVIDIA', color: 'hover:border-green-500/40 hover:text-green-500 dark:hover:text-green-300' },
  ];

  const handleProviderClick = (provider: CloudProvider) => {
    if (onSelectProvider) {
      onSelectProvider(provider);
    }
    onNavigate('catalogue');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/95 dark:bg-[#0a0e18]/95 backdrop-blur-xl border-r border-slate-200 dark:border-[#1c1f2a] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Section */}
        <div className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                onNavigate('today');
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-left focus:outline-none"
            >
              <CertifAILogo />
            </button>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Categorized Hamburger Menu Trigger in Sidebar */}
          {onOpenHamburgerMenu && (
            <button
              id="sidebar-btn-hamburger"
              onClick={() => {
                onOpenHamburgerMenu();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full p-2.5 rounded-xl bg-blue-50 dark:bg-blue-600/10 hover:bg-blue-100 dark:hover:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 transition-all flex items-center justify-between text-xs font-mono font-bold shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Menu Catégorisé</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Active Target Banner */}
          <div 
            onClick={() => {
              onNavigate('profile');
              if (onCloseMobile) onCloseMobile();
            }}
            className="group relative p-3 rounded-xl bg-slate-50 dark:bg-gradient-to-br dark:from-[#171b26] dark:to-[#1c1f2a] border border-slate-200 dark:border-[#262a35] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                <Sparkles className="w-2.5 h-2.5" />
                Cible Active
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono font-medium text-amber-500 dark:text-amber-400">
                <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                {userProfile?.streakDays ?? 14}j
              </span>
            </div>

            <div className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-indigo-200 transition-colors flex items-center justify-between">
              <span className="truncate pr-1">{userProfile?.targetExamTitle || 'Azure AI-102 • Architecte'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>

            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                <span>Préparation globale</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {userProfile?.readinessIndex ?? 78}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-[#0a0e18] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${userProfile?.readinessIndex ?? 78}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1" aria-label="Navigation principale">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#171b26]/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
                        item.highlightBadge
                          ? isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-[#1c1f2a] text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            {onOpenFlashcardsDistribution && (
              <button
                onClick={() => {
                  onOpenFlashcardsDistribution();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="mt-1 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-[#171b26]/70 transition-all border border-dashed border-slate-200 dark:border-[#262a35] group"
                title="Consulter l'inventaire officiel des 2 800 flashcards par certification"
              >
                <div className="flex items-center gap-2">
                  <PieChart className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span>Répartition (2 800)</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  Inventaire
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Bottom Cloud Ecosystems & Actions Section */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1c1f2a]/80 bg-slate-50/50 dark:bg-[#0a0e18]/50 space-y-3">
          <div>
            <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Fournisseurs Cloud
            </div>
            <div className="flex flex-wrap gap-1">
              {cloudProviders.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProviderClick(p.id)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-white dark:bg-[#171b26] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#262a35] transition-all ${p.color}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Buttons: Install PWA + System Settings + Legal */}
          <div className="pt-2 border-t border-slate-200 dark:border-[#1c1f2a] grid grid-cols-3 gap-1 text-[10px] font-mono">
            <button
              onClick={promptInstall}
              className="p-1.5 rounded-lg bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 hover:text-blue-500 flex flex-col items-center justify-center gap-0.5 transition-colors"
              title="Installer l'application"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>{isInstalled ? 'Installé' : 'Installer'}</span>
            </button>

            <button
              onClick={onOpenSystemSettings}
              className="p-1.5 rounded-lg bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 hover:text-blue-500 flex flex-col items-center justify-center gap-0.5 transition-colors"
              title="Paramètres Système & Mises à Jour"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Système</span>
            </button>

            <button
              onClick={onOpenLegalModal}
              className="p-1.5 rounded-lg bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 hover:text-blue-500 flex flex-col items-center justify-center gap-0.5 transition-colors"
              title="Mentions Légales & Non-responsabilité"
            >
              <Scale className="w-3.5 h-3.5 text-amber-500" />
              <span>Légal</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            <span>CertifIA {versionInfo.version}</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Auto-Sync ON
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
