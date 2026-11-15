import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Command,
  Menu,
  User,
  Sun,
  Moon,
  Settings,
  HelpCircle,
  Bot,
  Target,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Compass,
  Globe,
  LayoutGrid,
} from 'lucide-react';
import { AppScreen } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useGuide } from '../context/GuideContext';
import { useSystemUpdate } from '../context/SystemUpdateContext';
import { useProgress } from '../context/ProgressContext';
import { useOnboardingTour } from '../context/OnboardingTourContext';
import { certificationsData } from '../data/certificationsData';
import { getBreadcrumbForScreen } from '../navigation/navigationConfig';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../i18n';

interface HeaderProps {
  currentScreen: AppScreen;
  onOpenHamburgerMenu: () => void;
  onOpenSystemSettings: () => void;
  onOpenCommandPalette: () => void;
  onOpenMobileMenu: () => void;
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (examId: string) => void;
  onOpenAIAssistant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onOpenHamburgerMenu,
  onOpenSystemSettings,
  onOpenCommandPalette,
  onOpenMobileMenu,
  onNavigate,
  onOpenBlueprint,
  onOpenAIAssistant,
}) => {
  const { t } = useTranslation(['common', 'navigation', 'dashboard']);
  const { user, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isGuideModeActive, toggleGuideMode } = useGuide();
  const { activeCertId } = useProgress();
  const { versionInfo, isChecking } = useSystemUpdate();
  const { startTour } = useOnboardingTour();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Active target certification
  const currentCert =
    certificationsData.find((c) => c.id === (activeCertId || 'ai102')) || certificationsData[0];

  // Dynamic breadcrumb from centralized navigation config
  const breadcrumb = getBreadcrumbForScreen(currentScreen);
  const BreadcrumbIcon = breadcrumb.categoryIcon;

  const userName =
    user?.displayName || userProfile?.displayName || t('common:user.learnerName', 'Apprenant IA');
  const userInitial = userName.charAt(0).toUpperCase();

  // Close workspace dropdown on outside click or Escape
  useEffect(() => {
    if (!isWorkspaceMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setIsWorkspaceMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsWorkspaceMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWorkspaceMenuOpen]);

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#0f131d]/95 backdrop-blur-xl border-b border-slate-200 dark:border-[#1c1f2a] px-3 sm:px-6 flex items-center justify-between gap-3 sm:gap-5 transition-colors duration-200"
    >
      {/* Zone 1 (Gauche) : Menu mobile (< lg uniquement, la Sidebar est déjà visible sur desktop) + Fil d'Ariane */}
      <div className="flex items-center gap-2.5 min-w-0 shrink-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171b26] dark:hover:bg-[#262a35] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#262a35] transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={t('navigation:hamburger.aria', 'Menu')}
          title={t('navigation:hamburger.aria', 'Menu')}
        >
          <Menu className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        </button>

        {/* Clean contextual breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 min-w-0"
        >
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
            <BreadcrumbIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" aria-hidden="true" />
            <span>
              {t(`navigation:categories.${breadcrumb.categoryKey || 'accueil'}`, breadcrumb.categoryLabel)}
            </span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" aria-hidden="true" />
          <span
            className="text-slate-900 dark:text-white font-semibold truncate max-w-[140px] md:max-w-[200px]"
            aria-current="page"
          >
            {t(`navigation:items.${breadcrumb.itemKey || 'today'}.label`, breadcrumb.itemLabel)}
          </span>
        </nav>
      </div>

      {/* Zone 2 (Centre) : Recherche rapide globale (⌘K) */}
      <div className="flex-1 max-w-md min-w-0">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full h-9 pl-3 pr-2.5 text-xs sm:text-sm bg-slate-100/90 hover:bg-slate-200/80 dark:bg-[#171b26] dark:hover:bg-[#1e2331] border border-slate-200 dark:border-[#262a35] rounded-xl text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2 transition-colors min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title={t('navigation:search.commandKey', 'Ctrl+K')}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {t('navigation:search.placeholder', 'Rechercher une notion, QCM, certif...')}
            </span>
          </span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#2a2f3d] bg-white dark:bg-[#0b0e17] text-[10px] font-mono text-slate-400 dark:text-slate-400 shrink-0">
            <Command className="w-2.5 h-2.5" aria-hidden="true" />K
          </kbd>
        </button>
      </div>

      {/* Zone 3 (Droite) : 4 contrôles clairs et bien hiérarchisés */}
      <div className="flex items-center gap-2 shrink-0">
        {/* 1. Active Target Certification (Blueprint) */}
        <button
          type="button"
          data-tour="target-cert"
          onClick={() => (onOpenBlueprint ? onOpenBlueprint(currentCert.id) : onNavigate('catalogue'))}
          className="hidden md:inline-flex items-center gap-1.5 h-9 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-[#171b26] dark:hover:bg-[#1e2331] border border-slate-200 dark:border-[#262a35] text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title={`${t('dashboard:targetCert', 'Certification cible')}: ${currentCert.title}`}
        >
          <Target className="w-3.5 h-3.5 text-blue-500 shrink-0" aria-hidden="true" />
          <span>{currentCert.code}</span>
        </button>

        {/* 2. Primary Action: AI Pedagogical Tutor */}
        <button
          type="button"
          onClick={onOpenAIAssistant || (() => onNavigate('assistant'))}
          className="h-9 px-2.5 sm:px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-600/20 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title={t('navigation:items.assistant.label', 'Assistant IA')}
          aria-label={t('navigation:items.assistant.label', 'Assistant IA')}
        >
          <Bot className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">{t('navigation:items.assistant.shortLabel', 'Tuteur IA')}</span>
        </button>

        {/* 3. Theme Toggle (1-click Light / Dark) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#171b26] hover:bg-slate-100 dark:hover:bg-[#1e2331] text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title={theme === 'dark' ? t('common:theme.lightMode') : t('common:theme.darkMode')}
          aria-label={t('common:theme.toggle')}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
          )}
        </button>

        {/* 4. Unified Account, Preferences & Tools Dropdown */}
        <div className="relative" ref={menuContainerRef}>
          <button
            type="button"
            onClick={() => setIsWorkspaceMenuOpen((prev) => !prev)}
            className={`h-9 pl-1.5 pr-2 rounded-xl border transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isWorkspaceMenuOpen
                ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30'
                : 'border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#171b26] hover:bg-slate-100 dark:hover:bg-[#1e2331]'
            }`}
            aria-haspopup="menu"
            aria-expanded={isWorkspaceMenuOpen}
            aria-label={t('navigation:headerMenu.aria', 'Menu compte, préférences et outils')}
            title={t('navigation:headerMenu.aria', 'Menu compte, préférences et outils')}
          >
            <div className="w-6 h-6 rounded-lg bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.displayName || userProfile?.displayName ? (
                userInitial
              ) : (
                <User className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                isWorkspaceMenuOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
            {isChecking && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" aria-hidden="true" />
            )}
          </button>

          {isWorkspaceMenuOpen && (
            <div
              role="menu"
              aria-label={t('navigation:headerMenu.aria', 'Menu compte, préférences et outils')}
              className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#262a35] shadow-2xl overflow-hidden z-50"
            >
              {/* Identity Header -> Profile */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsWorkspaceMenuOpen(false);
                  onNavigate('profile');
                }}
                className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-[#111520] hover:bg-slate-100 dark:hover:bg-[#1a2030] border-b border-slate-200 dark:border-[#1f2433] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {userName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user
                        ? t('common:user.syncedAccount', 'Compte synchronisé')
                        : t('common:user.guestMode', 'Mode invité')}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              </button>

              {/* Section 1: Preferences (Language + Guide Mode) */}
              <div className="p-3 border-b border-slate-100 dark:border-[#1f2433] space-y-2.5">
                <div className="px-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  {t('navigation:headerMenu.preferencesSection', 'Préférences')}
                </div>

                <div className="flex items-center justify-between gap-2 px-1">
                  <span className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" aria-hidden="true" />
                    <span>{t('navigation:headerMenu.languageLabel', 'Langue')}</span>
                  </span>
                  <LanguageSelector variant="compact" />
                </div>

                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={isGuideModeActive}
                  onClick={toggleGuideMode}
                  className="w-full px-2 py-2 rounded-xl flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>{t('navigation:items.guide.shortLabel', 'Guide novice')}</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isGuideModeActive
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200/80 dark:bg-[#22283a] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isGuideModeActive ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>

              {/* Section 2: Discover & Navigation */}
              <div className="p-2 border-b border-slate-100 dark:border-[#1f2433] space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  {t('navigation:headerMenu.discoverSection', 'Découverte & Aide')}
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsWorkspaceMenuOpen(false);
                    startTour(0);
                  }}
                  className="w-full px-2.5 py-2 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-colors"
                >
                  <Compass className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />
                  <span className="truncate">{t('navigation:items.tour.label', 'Visite guidée automatique')}</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsWorkspaceMenuOpen(false);
                    onNavigate('landing');
                  }}
                  className="w-full px-2.5 py-2 rounded-xl flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" aria-hidden="true" />
                  <span className="truncate">{t('navigation:items.landing.label', 'Page de présentation')}</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsWorkspaceMenuOpen(false);
                    onOpenHamburgerMenu();
                  }}
                  className="w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-colors"
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <LayoutGrid className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span className="truncate">{t('navigation:headerMenu.quickMenu', 'Navigation rapide')}</span>
                  </span>
                  <kbd className="text-[10px] font-mono text-slate-400">Ctrl+M</kbd>
                </button>
              </div>

              {/* Section 3: System */}
              <div className="p-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsWorkspaceMenuOpen(false);
                    onOpenSystemSettings();
                  }}
                  className="w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-colors"
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Settings className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span className="truncate">{t('navigation:items.settings.label', 'Paramètres système')}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{versionInfo.version}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
