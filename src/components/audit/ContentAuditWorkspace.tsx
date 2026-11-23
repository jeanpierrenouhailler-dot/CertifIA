import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileCheck2,
  Globe,
  History,
  Layers,
  LayoutDashboard,
  Lock,
  RefreshCw,
  Settings,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import type { AppScreen } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useAudit } from '../../context/AuditContext';
import { useTranslation } from '../../i18n';
import { AuditDashboardTab } from './AuditDashboardTab';
import { AuditInventoryTab } from './AuditInventoryTab';
import { AuditCertificationsTab } from './AuditCertificationsTab';
import { AuditQuizLabTab } from './AuditQuizLabTab';
import { AuditFlashcardsTab } from './AuditFlashcardsTab';
import { AuditGlossaryTab } from './AuditGlossaryTab';
import { AuditSourcesTab } from './AuditSourcesTab';
import { AuditEngineAndFindingsTab } from './AuditEngineAndFindingsTab';
import { AuditValidationTab } from './AuditValidationTab';
import { AuditHistoryAndSettingsTab } from './AuditHistoryAndSettingsTab';
import { ContentDetailDrawer } from './ContentDetailDrawer';

interface ContentAuditWorkspaceProps {
  onNavigate: (screen: AppScreen) => void;
}

type AuditTabId =
  | 'dashboard'
  | 'inventory'
  | 'certifications'
  | 'quizzes'
  | 'flashcards'
  | 'glossary'
  | 'sources'
  | 'findings'
  | 'validations'
  | 'history'
  | 'settings';

export const ContentAuditWorkspace: React.FC<ContentAuditWorkspaceProps> = ({ onNavigate }) => {
  const { user, loading: authLoading, isAdmin, adminChecking, loginWithGoogle } = useAuth();
  const { t } = useTranslation(['audit', 'common']);
  const {
    inventory,
    loading,
    error,
    activeBatchProgress,
    refreshAdminData,
  } = useAudit();

  const [activeTab, setActiveTab] = useState<AuditTabId>('dashboard');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerContentId, setDrawerContentId] = useState<string | null>(null);
  const [validationContentId, setValidationContentId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; tone: 'success' | 'error' | 'info' } | null>(
    null
  );

  const notify = (msg: string, tone: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, tone });
    setTimeout(() => {
      setToast((prev) => (prev?.msg === msg ? null : prev));
    }, 6000);
  };

  const drawerItem = useMemo(
    () => inventory.find((i) => i.id === drawerContentId) || null,
    [inventory, drawerContentId]
  );

  // STRICT SECURITY GATE: Never mount or reveal admin workspaces before verified authentication + admin check
  if (authLoading || adminChecking) {
    return (
      <div
        id="audit-admin-gate-loading"
        className="max-w-xl mx-auto my-16 p-8 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] text-center space-y-3"
      >
        <ShieldCheck className="w-8 h-8 text-blue-500 mx-auto animate-pulse" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Vérification des droits d’administration...
        </h2>
        <p className="text-xs text-slate-500">Contrôle du jeton Firebase et des privilèges en cours.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        id="audit-admin-gate-signin"
        className="max-w-xl mx-auto my-16 p-8 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] text-center space-y-4 shadow-sm"
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
          {t('audit:gate.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {t('audit:gate.signInPrompt')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            {t('audit:gate.signInButton')}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('today')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2a3146] text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {t('audit:gate.backToApp')}
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        id="audit-admin-gate-denied"
        className="max-w-xl mx-auto my-16 p-8 rounded-2xl bg-white dark:bg-[#141824] border border-rose-500/30 text-center space-y-4 shadow-sm"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
          {t('audit:gate.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {t('audit:gate.deniedPrompt', { email: user.email || user.uid })}
        </p>
        <button
          type="button"
          onClick={() => onNavigate('today')}
          className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold"
        >
          {t('audit:gate.backToApp')}
        </button>
      </div>
    );
  }

  const tabs: Array<{ id: AuditTabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: t('audit:tabs.dashboard'), icon: LayoutDashboard },
    { id: 'inventory', label: t('audit:tabs.inventory'), icon: Database },
    { id: 'certifications', label: t('audit:tabs.certifications'), icon: Award },
    { id: 'quizzes', label: t('audit:tabs.quizzes'), icon: ClipboardCheck },
    { id: 'flashcards', label: t('audit:tabs.flashcards'), icon: Layers },
    { id: 'glossary', label: t('audit:tabs.glossary'), icon: BookOpen },
    { id: 'sources', label: t('audit:tabs.sources'), icon: Globe },
    { id: 'findings', label: t('audit:tabs.findings'), icon: AlertTriangle },
    { id: 'validations', label: t('audit:tabs.validations'), icon: FileCheck2 },
    { id: 'history', label: t('audit:tabs.history'), icon: History },
    { id: 'settings', label: t('audit:tabs.settings'), icon: Settings },
  ];

  return (
    <div id="audit-workspace-root" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20 text-[11px] font-mono font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administration • {user.email}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            {t('audit:title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('audit:subtitle')}
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => refreshAdminData()}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#2a3146] bg-white dark:bg-[#141824] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-[#1a2030]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Synchroniser Firestore
        </button>
      </div>

      {/* Permanent Human-in-the-Loop Governance Notice */}
      <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
        <span>{t('audit:advisoryBanner')}</span>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300">
          Erreur de synchronisation Firestore : {error}
        </div>
      )}

      {activeBatchProgress && (
        <div className="px-4 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-700 dark:text-blue-200 flex items-center justify-between gap-3">
          <span>
            Exécution en cours : <strong>{activeBatchProgress.label}</strong> ({activeBatchProgress.completed} /{' '}
            {activeBatchProgress.total})
          </span>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className={`px-4 py-3 rounded-2xl border text-xs flex items-center gap-2 ${
            toast.tone === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-200'
              : toast.tone === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-200'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* 11 Admin Navigation Tabs */}
      <nav aria-label="Sous-navigation Audit du contenu" className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-200 dark:border-[#242b3d]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#141824] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#242b3d] hover:bg-slate-50 dark:hover:bg-[#1b2132]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Active Tab View */}
      {activeTab === 'dashboard' && (
        <AuditDashboardTab
          onSelectTab={(tId) => setActiveTab(tId as AuditTabId)}
          onInspectContent={(id) => setDrawerContentId(id)}
          onNotify={notify}
        />
      )}

      {activeTab === 'inventory' && (
        <AuditInventoryTab
          onInspectContent={(id) => setDrawerContentId(id)}
          onGoToValidation={(id) => {
            setValidationContentId(id);
            setActiveTab('validations');
          }}
          onNotify={notify}
        />
      )}

      {activeTab === 'certifications' && (
        <AuditCertificationsTab
          onInspectContent={(id) => setDrawerContentId(id)}
          onNotify={notify}
        />
      )}

      {activeTab === 'quizzes' && (
        <AuditQuizLabTab
          onInspectContent={(id) => setDrawerContentId(id)}
          onGoToValidation={(id) => {
            setValidationContentId(id);
            setActiveTab('validations');
          }}
          onNotify={notify}
        />
      )}

      {activeTab === 'flashcards' && (
        <AuditFlashcardsTab
          onInspectContent={(id) => setDrawerContentId(id)}
          onNotify={notify}
        />
      )}

      {activeTab === 'glossary' && (
        <AuditGlossaryTab
          onInspectContent={(id) => setDrawerContentId(id)}
          onNotify={notify}
        />
      )}

      {activeTab === 'sources' && <AuditSourcesTab onNotify={notify} />}

      {activeTab === 'findings' && (
        <AuditEngineAndFindingsTab
          selectedContentIds={selectedIds}
          onInspectContent={(id) => setDrawerContentId(id)}
          onGoToValidation={(id) => {
            setValidationContentId(id);
            setActiveTab('validations');
          }}
          onNotify={notify}
        />
      )}

      {activeTab === 'validations' && (
        <AuditValidationTab
          selectedContentId={validationContentId}
          onSelectContentId={setValidationContentId}
          onInspectContent={(id) => setDrawerContentId(id)}
          onNotify={notify}
        />
      )}

      {(activeTab === 'history' || activeTab === 'settings') && (
        <AuditHistoryAndSettingsTab
          mode={activeTab}
          onInspectContent={(id) => setDrawerContentId(id)}
          onNotify={notify}
        />
      )}

      {/* Content Detail Slide-over Drawer */}
      <ContentDetailDrawer
        item={drawerItem}
        isOpen={Boolean(drawerItem)}
        onClose={() => setDrawerContentId(null)}
        onGoToValidation={(id) => {
          setValidationContentId(id);
          setActiveTab('validations');
        }}
        onNotify={notify}
      />
    </div>
  );
};
