import React, { useState } from 'react';
import { 
  Settings, 
  RotateCw, 
  RefreshCw, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  AlertTriangle, 
  X, 
  Download, 
  Sparkles, 
  Terminal,
  Zap,
  Info
} from 'lucide-react';
import { useSystemUpdate } from '../context/SystemUpdateContext';
import { useGuide } from '../context/GuideContext';
import { usePwa } from '../context/PwaContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation, formatLocalizedDate } from '../i18n';

interface SystemSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemSettingsModal: React.FC<SystemSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    versionInfo, 
    lastCheckDate, 
    isChecking, 
    isUpdating, 
    isAutoUpdateEnabled,
    updateStatusMessage, 
    toggleAutoUpdate, 
    checkForUpdates, 
    forceUpdate 
  } = useSystemUpdate();

  const { isGuideModeActive, toggleGuideMode, openLegalModal } = useGuide();
  const { theme, toggleTheme } = useTheme();
  const { isInstalled, promptInstall } = usePwa();
  const { t } = useTranslation(['settings', 'common']);
  const [activeTab, setActiveTab] = useState<'system' | 'changelog' | 'cache'>('system');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#151a26] text-slate-800 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-blue-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-[#262a35] flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#0f131d]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {t('settings:systemSection.adminBadge')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  {versionInfo.version}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-headline text-slate-900 dark:text-white mt-0.5">
                {t('settings:systemSection.modalTitle')}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#262a35] transition-colors"
            aria-label={t('common:actions.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-100 dark:border-[#262a35] px-6 bg-slate-50/50 dark:bg-[#0f131d]/30 text-xs font-mono">
          <button
            onClick={() => setActiveTab('system')}
            className={`py-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'system'
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{t('settings:systemSection.tabSystem')}</span>
          </button>

          <button
            onClick={() => setActiveTab('changelog')}
            className={`py-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'changelog'
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{t('settings:systemSection.tabChangelog', { version: versionInfo.version })}</span>
          </button>

          <button
            onClick={() => setActiveTab('cache')}
            className={`py-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'cache'
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('settings:systemSection.tabCache')}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'system' && (
            <div className="space-y-6">
              
              {/* Release Metadata Grid Requested by User */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Date de sortie */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      {t('settings:systemSection.releaseDate')}
                    </div>
                    <div className="text-sm font-bold font-headline text-slate-900 dark:text-white mt-0.5">
                      {versionInfo.releaseDate}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('settings:systemSection.officialVersion', { version: versionInfo.version, channel: versionInfo.channel })}
                    </div>
                  </div>
                </div>

                {/* 2. Date de la dernière vérification */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      {t('settings:systemSection.lastCheckDate')}
                    </div>
                    <div className="text-sm font-bold font-headline text-slate-900 dark:text-white mt-0.5">
                      {lastCheckDate}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t('settings:systemSection.syncedWithServers')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Message Notification if any */}
              {updateStatusMessage && (
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-200 text-xs font-mono font-medium flex items-center gap-2.5 animate-in fade-in">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{updateStatusMessage}</span>
                </div>
              )}

              {/* Action Buttons: « Vérifier les mises à jour » & « Forcer la mise à jour » */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white font-headline text-sm flex items-center gap-2">
                      <RotateCw className="w-4 h-4 text-blue-500" />
                      <span>{t('settings:systemSection.versionControl')}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('settings:systemSection.versionControlDesc')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Bouton 1: Vérifier les mises à jour */}
                  <button
                    id="btn-system-check-update"
                    disabled={isChecking || isUpdating}
                    onClick={() => checkForUpdates(true)}
                    className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    <RotateCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                    <span>{isChecking ? t('settings:systemSection.checkingUpdates') : t('settings:systemSection.checkNow')}</span>
                  </button>

                  {/* Bouton 2: Forcer la mise à jour */}
                  <button
                    id="btn-system-force-update"
                    disabled={isUpdating || isChecking}
                    onClick={forceUpdate}
                    className="p-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-[#1a2030] dark:hover:bg-[#252d42] border border-slate-300 dark:border-[#262a35] text-slate-800 dark:text-slate-200 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
                    title={t('settings:systemSection.versionControlDesc')}
                  >
                    <RefreshCw className={`w-4 h-4 text-amber-500 ${isUpdating ? 'animate-spin' : ''}`} />
                    <span>{isUpdating ? t('settings:systemSection.updating') : t('settings:systemSection.forceUpdate')}</span>
                  </button>
                </div>
              </div>

              {/* Background Auto-Update System Toggle Requested by User */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span>{t('settings:systemSection.autoUpdates')}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                      {t('settings:systemSection.autoActive')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t('settings:systemSection.autoUpdatesDesc')}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isAutoUpdateEnabled}
                    onChange={toggleAutoUpdate}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Install PWA Prompt Shortcut */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {isInstalled ? t('settings:systemSection.appInstalled') : t('settings:systemSection.installOnScreen')}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {t('settings:systemSection.pwaDesc')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={promptInstall}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md shrink-0"
                >
                  {isInstalled ? t('settings:systemSection.seeOptions') : t('settings:systemSection.installApp')}
                </button>
              </div>

            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#262a35]">
                <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                  {t('settings:systemSection.officialNotes', { version: versionInfo.version })}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {versionInfo.releaseDate}
                </span>
              </div>

              <div className="space-y-2.5">
                {versionInfo.highlights.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-200 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#0a0e18] border border-slate-200 dark:border-[#262a35] space-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <div>Architecture : React 19 + TypeScript + Vite 8 + Tailwind CSS v4</div>
                <div>Moteur Cognitif : SuperMemo-2 / FSRS + Moteur de Recommandation 4 Niveaux</div>
                <div>Persistance : Stockage local haute fidélité + Synchronisation Cloud Firestore</div>
              </div>
            </div>
          )}

          {activeTab === 'cache' && (
            <div className="space-y-4">
              {/* Language Selection Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {t('languageSection.title', 'Langue de l\'application (Internationalisation)')}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('languageSection.description', 'Choisissez la langue d\'affichage de l\'interface et du contenu pédagogique.')}
                    </p>
                  </div>
                </div>
                <LanguageSelector variant="expanded" />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  {t('settings:systemSection.themeTitle')}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300 text-xs">
                    {t('settings:systemSection.currentMode')} <strong>{theme === 'dark' ? t('settings:systemSection.themeDark') : t('settings:systemSection.themeLight')}</strong>
                  </span>
                  <button
                    onClick={toggleTheme}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-[#1c2233] border border-slate-300 dark:border-[#262a35] font-mono text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    {t('settings:systemSection.switchTo', { theme: theme === 'dark' ? t('themeSection.light') : t('themeSection.dark') })}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  {t('settings:systemSection.guideTitle')}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300 text-xs">
                    {t('settings:systemSection.guideStatus')} <strong>{isGuideModeActive ? t('settings:systemSection.guideActive') : t('settings:systemSection.guideInactive')}</strong>
                  </span>
                  <button
                    onClick={toggleGuideMode}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-[#1c2233] border border-slate-300 dark:border-[#262a35] font-mono text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    {isGuideModeActive ? t('settings:systemSection.hideTooltips') : t('settings:systemSection.showTooltips')}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  {t('settings:systemSection.legalTitle')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('settings:systemSection.legalDesc')}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    openLegalModal();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-300 border border-blue-500/30 font-mono text-xs font-bold hover:bg-blue-600/20 transition-colors"
                >
                  {t('settings:systemSection.openLegal')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-[#262a35] bg-slate-50 dark:bg-[#0f131d]/60 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Système CertifIA v2.4.0 • Build {versionInfo.buildNumber}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-[#1c2233] dark:hover:bg-[#252d42] text-slate-800 dark:text-slate-200 font-mono text-xs font-bold transition-colors"
          >
            {t('settings:systemSection.close')}
          </button>
        </div>

      </div>
    </div>
  );
};
