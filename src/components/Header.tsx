import React from 'react';
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
  Sparkles,
  Layers,
  Award,
  Compass
} from 'lucide-react';
import { AppScreen } from '../types';
import { CertifAILogo } from './CertifAILogo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useGuide } from '../context/GuideContext';
import { usePwa } from '../context/PwaContext';
import { useSystemUpdate } from '../context/SystemUpdateContext';
import { useProgress } from '../context/ProgressContext';
import { useOnboardingTour } from '../context/OnboardingTourContext';
import { certificationsData } from '../data/certificationsData';
import { getBreadcrumbForScreen } from '../navigation/navigationConfig';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation, getCurrentLanguage } from '../i18n';

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
  const { t } = useTranslation(['common', 'navigation']);
  const { user, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isGuideModeActive, toggleGuideMode } = useGuide();
  const { activeCertId } = useProgress();
  const { versionInfo, isChecking } = useSystemUpdate();
  const { startTour } = useOnboardingTour();
  const isEn = getCurrentLanguage() === 'en';

  // Active target certification
  const currentCert = certificationsData.find((c) => c.id === (activeCertId || 'ai102')) || certificationsData[0];

  // Dynamic breadcrumb from centralized navigation config
  const breadcrumb = getBreadcrumbForScreen(currentScreen);
  const BreadcrumbIcon = breadcrumb.categoryIcon;

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#0f131d]/90 backdrop-blur-xl border-b border-slate-200 dark:border-[#1c1f2a] px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-colors duration-200"
    >
      {/* Left: Mobile Drawer Trigger + Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onOpenHamburgerMenu}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171b26] dark:hover:bg-[#262a35] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#262a35] transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={t('navigation:categories.plus', 'Menu')}
          title="Menu"
        >
          <Menu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="hidden xl:inline font-mono text-xs font-semibold">Menu</span>
        </button>

        {/* Dynamic Breadcrumb with WCAG AA semantic markup */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <BreadcrumbIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>{t(`navigation:categories.${breadcrumb.categoryKey || 'accueil'}`, breadcrumb.categoryLabel)}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-[140px] md:max-w-xs" aria-current="page">
            {t(`navigation:items.${breadcrumb.itemKey || 'today'}.label`, breadcrumb.itemLabel)}
          </span>
        </nav>
      </div>

      {/* Middle: Global Quick Search Button (Command Palette) */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4">
        <button
          onClick={onOpenCommandPalette}
          className="w-full pl-3.5 pr-3 py-2 text-xs sm:text-sm bg-slate-100 hover:bg-slate-200/80 dark:bg-[#171b26]/90 dark:hover:bg-[#202533] border border-slate-200 dark:border-[#262a35] rounded-xl text-slate-500 dark:text-slate-400 flex items-center justify-between transition-all"
          title={t('navigation:search.commandKey', 'Ctrl+K')}
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{t('navigation:search.placeholder', 'Rechercher une notion, QCM, certif...')}</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded border border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#0a0e18] text-[10px] font-mono text-slate-400 dark:text-slate-300 shrink-0">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right: Active Target Cert Badge + Assistant IA + Language Selector + Theme + Settings & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Active Target Cert Pill */}
        <button
          data-tour="target-cert"
          onClick={() => onOpenBlueprint ? onOpenBlueprint(currentCert.id) : onNavigate('catalogue')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/25 text-xs font-mono font-semibold text-blue-600 dark:text-blue-300 transition-colors"
          title={`${t('dashboard:targetCert')}: ${currentCert.title}`}
        >
          <Target className="w-3.5 h-3.5 text-blue-500" />
          <span>{currentCert.code}</span>
        </button>

        {/* AI Pedagogical Assistant Quick Action */}
        <button
          onClick={onOpenAIAssistant || (() => onNavigate('assistant'))}
          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          title={t('navigation:items.assistant.label', 'Assistant IA')}
          aria-label={t('navigation:items.assistant.label', 'Assistant IA')}
        >
          <Bot className="w-4 h-4 text-blue-500" />
          <span className="hidden lg:inline">{t('navigation:items.assistant.shortLabel', 'Assistant IA')}</span>
        </button>

        {/* Landing Page Quick Link */}
        <button
          onClick={() => onNavigate('landing')}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-colors border border-transparent hover:border-slate-200 dark:hover:border-[#262a35]"
          title={t('navigation:items.landing.label', 'Page de présentation')}
          aria-label={t('navigation:items.landing.label', 'Page de présentation')}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>{t('navigation:items.landing.shortLabel', 'Présentation')}</span>
        </button>

        {/* Guided Tour Trigger Button */}
        <button
          onClick={() => startTour(0)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all shadow-sm"
          title={isEn ? 'Launch Automated Guided Tour' : 'Lancer la visite guidée automatique'}
          aria-label="Discovery Tour"
        >
          <Compass className="w-3.5 h-3.5 text-blue-500 animate-spin-slow" />
          <span className="hidden sm:inline font-medium">{isEn ? 'Tour' : 'Visite'}</span>
        </button>

        {/* Language Selector (Bilingual French / English) */}
        <LanguageSelector variant="header" />

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-colors"
          title={theme === 'dark' ? t('common:theme.lightMode') : t('common:theme.darkMode')}
          aria-label={t('common:theme.toggle')}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Guide mode toggle */}
        <button
          onClick={toggleGuideMode}
          className={`p-2 rounded-xl transition-colors ${
            isGuideModeActive
              ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2030]'
          }`}
          title={isGuideModeActive ? t('common:guide.disable') : t('common:guide.enable')}
          aria-label={t('common:guide.enable')}
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* System Settings & Updates button */}
        <button
          onClick={onOpenSystemSettings}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-colors relative"
          title={t('navigation:items.settings.label')}
          aria-label={t('navigation:items.settings.label')}
        >
          <Settings className="w-4 h-4" />
          {isChecking && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          )}
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => onNavigate('profile')}
          className="p-1.5 rounded-xl border border-slate-200 dark:border-[#262a35] hover:border-blue-500 transition-all flex items-center gap-1.5 text-xs"
          title={t('navigation:items.profile.label')}
          aria-label={t('navigation:items.profile.label')}
        >
          <div className="w-7 h-7 rounded-lg bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
        </button>
      </div>
    </header>
  );
};
