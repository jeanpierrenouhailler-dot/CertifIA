import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Command, 
  Menu, 
  X, 
  ArrowUpRight, 
  CheckCircle2, 
  LogIn, 
  User, 
  Sun, 
  Moon, 
  Settings, 
  Download, 
  HelpCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { AppScreen } from '../types';
import { certificationsData } from '../data/certificationsData';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useGuide } from '../context/GuideContext';
import { usePwa } from '../context/PwaContext';
import { useSystemUpdate } from '../context/SystemUpdateContext';

interface HeaderProps {
  onOpenHamburgerMenu: () => void;
  onOpenSystemSettings: () => void;
  onOpenShortcuts: () => void;
  onOpenMobileMenu: () => void;
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (examId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHamburgerMenu,
  onOpenSystemSettings,
  onOpenShortcuts,
  onOpenMobileMenu,
  onNavigate,
  onOpenBlueprint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isGuideModeActive, toggleGuideMode } = useGuide();
  const { promptInstall, isInstalled } = usePwa();
  const { isChecking } = useSystemUpdate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCerts = searchQuery.trim()
    ? certificationsData.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.modules.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
          c.providerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#0f131d]/90 backdrop-blur-xl border-b border-slate-200 dark:border-[#1c1f2a] px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 transition-colors duration-200"
    >
      {/* Left: Hamburger Menu Button & Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
        {/* Prominent Hamburger Button (Desktop & Mobile) */}
        <button
          id="btn-hamburger-menu"
          onClick={onOpenHamburgerMenu}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171b26] dark:hover:bg-[#262a35] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#262a35] transition-all flex items-center gap-2 shrink-0 shadow-sm"
          aria-label="Ouvrir le menu catégorisé"
          title="Menu des fonctionnalités catégorisées"
        >
          <Menu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="hidden md:inline font-mono text-xs font-bold">Menu</span>
        </button>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Rechercher des compétences, blueprints, services cloud..."
              className="w-full pl-10 pr-12 sm:pr-24 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-[#171b26]/90 border border-slate-200 dark:border-[#262a35] rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-all font-sans"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-10 sm:right-12 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
            <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded border border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#0a0e18] text-[10px] font-mono text-slate-400 dark:text-slate-300">
              <Command className="w-3 h-3" /> K
            </kbd>
          </div>

          {/* Search Dropdown Modal */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] rounded-2xl shadow-2xl overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800 dark:text-slate-200">
              <div className="p-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 flex justify-between border-b border-slate-100 dark:border-slate-800">
                <span>Résultats Blueprint &amp; Modules</span>
                <span>{filteredCerts.length} trouvé(s)</span>
              </div>

              {filteredCerts.length > 0 ? (
                <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pt-1">
                  {filteredCerts.map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => {
                        if (onOpenBlueprint) onOpenBlueprint(cert.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#262a35] cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 font-semibold">
                          {cert.code}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white">
                            {cert.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <span>{cert.providerName}</span>
                            <span>•</span>
                            <span>{cert.modules.slice(0, 3).join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  Aucun résultat pour "{searchQuery}". Essayez "RAG", "Azure", "Bedrock" ou "Vision".
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        
        {/* 1. Installer l'application Button Requested by User */}
        <button
          id="header-btn-install-app"
          onClick={promptInstall}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-600/15 dark:hover:bg-blue-600/25 border border-blue-300 dark:border-blue-500/30 transition-all shadow-sm"
          title="Installer l'application sur votre écran d'accueil (Mobile ou Ordinateur)"
        >
          <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{isInstalled ? 'Installée' : 'Installer l\'app'}</span>
        </button>

        {/* 2. Theme Toggle (Clair / Sombre) Requested by User */}
        <button
          id="header-btn-theme-toggle"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171b26] dark:hover:bg-[#262a35] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#262a35] transition-all shadow-sm"
          aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
          title={theme === 'dark' ? 'Passer en thème Clair' : 'Passer en thème Sombre'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600" />
          )}
        </button>

        {/* 3. Mode Guide Novice Toggle Requested by User */}
        <button
          id="header-btn-guide-toggle"
          onClick={toggleGuideMode}
          className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
            isGuideModeActive
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
              : 'bg-slate-100 dark:bg-[#171b26] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-[#262a35]'
          }`}
          title="Activer ou désactiver les infobulles explicatives pour utilisateurs novices"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{isGuideModeActive ? 'Guide Novice' : 'Guide Off'}</span>
        </button>

        {/* 4. Paramètres Système Gear Button Requested by User */}
        <button
          id="header-btn-system-settings"
          onClick={onOpenSystemSettings}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171b26] dark:hover:bg-[#262a35] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#262a35] transition-all shadow-sm relative"
          title="Paramètres Système & Mises à Jour (v2.4.0)"
        >
          <Settings className={`w-4 h-4 text-slate-600 dark:text-slate-300 ${isChecking ? 'animate-spin text-blue-500' : ''}`} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
        </button>

        {/* 5. Shortcuts Button (Desktop) */}
        <button
          id="btn-shortcuts-header"
          onClick={onOpenShortcuts}
          className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] hover:bg-slate-200 dark:hover:bg-[#262a35] transition-all shadow-sm"
        >
          <Command className="w-3.5 h-3.5 text-blue-500" />
          <span>Raccourcis</span>
        </button>

        {/* User Profile / Firebase Status */}
        {user ? (
          <div 
            id="header-user-profile-btn"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-[#1c1f2a] cursor-pointer group"
            title="Gérer mon profil Firebase"
          >
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Utilisateur'}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500/40 group-hover:ring-blue-400 transition-all"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-1 ring-blue-500/40 flex items-center justify-center font-bold text-xs">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0f131d]" />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white flex items-center gap-1">
                {userProfile?.displayName || user.displayName || 'Architecte'}
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                Connecté
              </span>
            </div>
          </div>
        ) : (
          <button
            id="header-signin-btn"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-sm shadow-blue-600/20"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Connexion</span>
          </button>
        )}
      </div>
    </header>
  );
};
