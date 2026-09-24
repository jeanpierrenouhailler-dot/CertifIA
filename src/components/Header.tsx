import React, { useState, useRef, useEffect } from 'react';
import { Search, Command, Menu, X, ArrowUpRight, CheckCircle2, LogIn, User } from 'lucide-react';
import { AppScreen } from '../types';
import { certificationsData } from '../data/certificationsData';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenShortcuts: () => void;
  onOpenMobileMenu: () => void;
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (examId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenShortcuts,
  onOpenMobileMenu,
  onNavigate,
  onOpenBlueprint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, userProfile } = useAuth();

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
      className="sticky top-0 z-30 h-16 bg-[#0f131d]/90 backdrop-blur-xl border-b border-[#1c1f2a] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#171b26] text-slate-400 hover:text-white border border-[#262a35]"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
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
              className="w-full pl-10 pr-24 py-2 text-xs sm:text-sm bg-[#171b26]/90 border border-[#262a35] rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-all font-sans"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-12 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
            <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded border border-[#262a35] bg-[#0a0e18] text-[10px] font-mono text-slate-300">
              <Command className="w-3 h-3" /> K
            </kbd>
          </div>

          {/* Search Dropdown Modal */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#171b26] border border-[#262a35] rounded-2xl shadow-2xl overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-300 flex justify-between">
                <span>Résultats Blueprint & Modules</span>
                <span>{filteredCerts.length} trouvé(s)</span>
              </div>

              {filteredCerts.length > 0 ? (
                <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
                  {filteredCerts.map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => {
                        if (onOpenBlueprint) onOpenBlueprint(cert.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#262a35] cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
                          {cert.code}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                            {cert.title}
                          </div>
                          <div className="text-xs text-slate-300 flex items-center gap-2">
                            <span>{cert.providerName}</span>
                            <span>•</span>
                            <span>{cert.modules.slice(0, 3).join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  Aucun résultat pour "{searchQuery}". Essayez "RAG", "Azure", "Bedrock" ou "Vision".
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Shortcuts Button */}
        <button
          id="btn-shortcuts-header"
          onClick={onOpenShortcuts}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-[#171b26] border border-[#262a35] hover:bg-[#262a35] hover:text-white transition-all shadow-sm"
        >
          <Command className="w-3.5 h-3.5 text-blue-400" />
          <span>Raccourcis Examen</span>
        </button>

        {/* User Profile / Firebase Status */}
        {user ? (
          <div 
            id="header-user-profile-btn"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-[#1c1f2a] cursor-pointer group"
            title="Gérer mon profil Firebase"
          >
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Utilisateur'}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 sm:w-9 sm:w-9 rounded-full object-cover ring-1 ring-indigo-500/40 group-hover:ring-indigo-400 transition-all"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white ring-1 ring-indigo-500/40 flex items-center justify-center font-bold text-xs">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0f131d]" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white flex items-center gap-1">
                {userProfile?.displayName || user.displayName || 'Architecte Cloud'}
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </span>
              <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Firebase Connecté
              </span>
            </div>
          </div>
        ) : (
          <button
            id="header-signin-btn"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-indigo-600/90 hover:bg-indigo-600 border border-indigo-500/40 transition-all shadow-sm shadow-indigo-600/20"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Connexion Profil</span>
          </button>
        )}
      </div>
    </header>
  );
};
