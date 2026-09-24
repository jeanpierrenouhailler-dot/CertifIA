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
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  activeProviderFilter?: CloudProvider;
  onSelectProvider?: (provider: CloudProvider) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenBlueprint?: (examId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  onSelectProvider,
  isOpenMobile = false,
  onCloseMobile,
  onOpenBlueprint,
}) => {
  const { user, userProfile } = useAuth();

  const navItems = [
    {
      id: 'catalogue' as AppScreen,
      label: 'Catalogue',
      icon: Compass,
      badge: '18',
    },
    {
      id: 'quiz' as AppScreen,
      label: 'Entraînement',
      icon: Target,
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
    { id: 'aws', name: 'AWS', color: 'hover:border-amber-500/40 hover:text-amber-300' },
    { id: 'azure', name: 'Azure', color: 'hover:border-blue-500/40 hover:text-blue-300' },
    { id: 'gcp', name: 'GCP', color: 'hover:border-emerald-500/40 hover:text-emerald-300' },
    { id: 'ibm', name: 'IBM', color: 'hover:border-indigo-500/40 hover:text-indigo-300' },
    { id: 'nvidia', name: 'NVIDIA', color: 'hover:border-green-500/40 hover:text-green-300' },
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0e18]/95 backdrop-blur-xl border-r border-[#1c1f2a] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Section */}
        <div className="p-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                onNavigate('catalogue');
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-left focus:outline-none"
            >
              <CertifAILogo />
            </button>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Active Target Banner */}
          <div 
            onClick={() => onNavigate('profile')}
            className="group relative p-3.5 rounded-xl bg-gradient-to-br from-[#171b26] to-[#1c1f2a] border border-[#262a35] hover:border-indigo-500/40 transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Sparkles className="w-2.5 h-2.5" />
                Cible Active
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono font-medium text-amber-400">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                {userProfile?.streakDays ?? 12}j
              </span>
            </div>

            <div className="font-semibold text-xs text-white group-hover:text-indigo-200 transition-colors flex items-center justify-between">
              <span className="truncate pr-1">{userProfile?.targetExamTitle || 'Azure AI-102 • Architecte'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>

            <div className="mt-2.5">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Préparation globale</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {userProfile?.readinessIndex ?? 78}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${userProfile?.readinessIndex ?? 78}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5" aria-label="Navigation principale">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#171b26]/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                        item.highlightBadge
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          : isActive
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-[#1c1f2a] text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Cloud Ecosystems Section */}
        <div className="p-5 border-t border-[#1c1f2a]/80 bg-[#0a0e18]/50">
          <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
            Fournisseurs Cloud
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cloudProviders.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProviderClick(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#171b26] text-slate-300 border border-[#262a35] transition-all ${p.color}`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1c1f2a] flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-mono">CertifAI v3.4</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              API Synced
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
