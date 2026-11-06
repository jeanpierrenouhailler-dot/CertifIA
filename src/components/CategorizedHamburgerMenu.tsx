import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Home,
  Target, 
  Compass, 
  Sparkles, 
  Scale,
  CheckSquare, 
  Layers, 
  Clock, 
  BarChart3, 
  TrendingUp,
  History,
  Bot, 
  BookOpen, 
  PieChart,
  User, 
  Settings, 
  Download, 
  Moon, 
  Sun, 
  HelpCircle, 
  FileText, 
  ChevronRight, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { AppScreen } from '../types';
import { CertifAILogo } from './CertifAILogo';
import { useTheme } from '../context/ThemeContext';
import { useGuide } from '../context/GuideContext';
import { usePwa } from '../context/PwaContext';
import { useSystemUpdate } from '../context/SystemUpdateContext';
import { NAV_CATEGORIES, NAV_ITEMS, NavCategoryId, NavItemConfig } from '../navigation/navigationConfig';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../i18n';

interface CategorizedHamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenSystemSettings: () => void;
  onOpenBlueprint?: (certId: string) => void;
  onOpenFlashcardsDistribution?: () => void;
  onOpenComparator?: () => void;
  onOpenAIAssistant?: () => void;
  onSelectCertFlashcards?: (certId: 'c1000177' | 'gcpmle' | 'aifc01' | 'mlsc01' | 'ai900' | 'ai102') => void;
}

export const CategorizedHamburgerMenu: React.FC<CategorizedHamburgerMenuProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onNavigate,
  onOpenSystemSettings,
  onOpenBlueprint,
  onOpenFlashcardsDistribution,
  onOpenComparator,
  onOpenAIAssistant,
  onSelectCertFlashcards,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const { t } = useTranslation(['navigation', 'common']);
  const { theme, toggleTheme } = useTheme();
  const { isGuideModeActive, toggleGuideMode, openLegalModal } = useGuide();
  const { isInstalled, promptInstall } = usePwa();
  const { versionInfo } = useSystemUpdate();

  if (!isOpen) return null;

  const handleAction = (item: NavItemConfig) => {
    if (item.actionKey === 'open-settings') {
      onOpenSystemSettings();
    } else if (item.actionKey === 'open-distribution' && onOpenFlashcardsDistribution) {
      onOpenFlashcardsDistribution();
    } else if (item.actionKey === 'open-comparator' && onOpenComparator) {
      onOpenComparator();
    } else if (item.actionKey === 'open-guide') {
      toggleGuideMode();
    } else if (item.actionKey === 'open-legal') {
      openLegalModal();
    } else if (item.actionKey === 'open-pwa') {
      promptInstall();
    } else if (item.category === 'assistant' && onOpenAIAssistant) {
      onOpenAIAssistant();
    } else {
      onNavigate(item.screen);
    }
    onClose();
  };

  const categoriesOrder: NavCategoryId[] = [
    'accueil',
    'certifications',
    'apprentissage',
    'progression',
    'assistant',
    'plus'
  ];

  const q = filterQuery.trim().toLowerCase();

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-start animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('navigation:hamburger.aria', 'Menu principal catégorisé')}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-[#111520] h-full shadow-2xl flex flex-col border-r border-slate-200 dark:border-[#22283a] overflow-hidden animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[#22283a] flex items-center justify-between bg-slate-50/70 dark:bg-[#141824]/70">
          <div className="flex items-center gap-3">
            <CertifAILogo showSubtitle={false} />
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white text-base">
                Certif<span className="text-blue-600 dark:text-blue-400">IA</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {t('navigation:unifiedArchitecture', 'Architecture de navigation unifiée')}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#20273c] transition-all"
            aria-label={t('common:actions.close', 'Fermer')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search filter input inside menu */}
        <div className="p-3 border-b border-slate-200 dark:border-[#22283a] bg-slate-100/50 dark:bg-[#0e121c]/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={t('navigation:search.placeholderFilter', 'Filtrer une rubrique, examen, outil...')}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-[#171c2b] border border-slate-200 dark:border-[#2a3044] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
                aria-label={t('common:actions.reset')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Categories and Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {categoriesOrder.map((catId, catIdx) => {
            const cat = NAV_CATEGORIES[catId];
            const localizedCatName = t(`navigation:categories.${catId}`, cat.label);
            const items = NAV_ITEMS.filter((item) => {
              if (item.category !== catId) return false;
              if (!q) return true;
              const itemKey = item.id.replace('nav-', '');
              const itemLabel = t(`navigation:items.${itemKey}.label`, item.label).toLowerCase();
              const itemDesc = t(`navigation:items.${itemKey}.description`, item.description).toLowerCase();
              return (
                itemLabel.includes(q) ||
                itemDesc.includes(q) ||
                localizedCatName.toLowerCase().includes(q)
              );
            });

            if (items.length === 0) return null;

            return (
              <div key={catId} className="space-y-1.5">
                {/* Category Header */}
                <div className="flex items-center justify-between px-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {catIdx + 1}. {localizedCatName}
                    </span>
                    {cat.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items in Category */}
                <div className="space-y-1">
                  {items.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = currentScreen === item.screen && !item.actionKey;
                    const itemKey = item.id.replace('nav-', '');
                    const localizedLabel = t(`navigation:items.${itemKey}.label`, item.label);
                    const localizedDesc = t(`navigation:items.${itemKey}.description`, item.description);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleAction(item)}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all group ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-sm'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-[#1f2538] text-slate-500 dark:text-slate-400 group-hover:text-blue-500'
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs truncate flex items-center gap-2">
                              <span>{localizedLabel}</span>
                              {item.badge && (
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                                  isActive
                                    ? 'bg-white/25 text-white'
                                    : item.badgeColor || 'bg-slate-200 dark:bg-[#28314a] text-slate-600 dark:text-slate-300'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className={`text-[10px] truncate ${
                              isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-400'
                            }`}>
                              {localizedDesc}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive ? 'text-white translate-x-0.5' : 'text-slate-400 group-hover:translate-x-0.5'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer with Quick Theme Toggle and System Status */}
        <div className="p-3 border-t border-slate-200 dark:border-[#22283a] bg-slate-50/90 dark:bg-[#0f131d]/90 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-[#1a2030] border border-slate-200 dark:border-[#2a3146] text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1.5 font-medium"
              aria-label={t('common:theme.toggle')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
              <span className="text-[11px]">{theme === 'dark' ? t('common:theme.light') : t('common:theme.dark')}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenSystemSettings();
              }}
              className="p-2 rounded-xl bg-white dark:bg-[#1a2030] border border-slate-200 dark:border-[#2a3146] text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1.5 font-medium"
              title={t('navigation:items.settings.label')}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="text-[11px] font-mono">{versionInfo.version}</span>
            </button>

            <LanguageSelector variant="compact" />
          </div>

          {!isInstalled && (
            <button
              onClick={() => {
                onClose();
                promptInstall();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-[11px] flex items-center gap-1 shadow hover:bg-blue-500"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('common:actions.installPwa')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
