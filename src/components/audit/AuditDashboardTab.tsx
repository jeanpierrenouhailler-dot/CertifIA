import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileWarning,
  Layers,
  Link2Off,
  Play,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { SeverityBadge } from './AuditSharedBadges';

interface AuditDashboardTabProps {
  onSelectTab: (tab: string) => void;
  onInspectContent: (contentId: string) => void;
  onNotify: (msg: string, tone?: 'success' | 'error' | 'info') => void;
}

export const AuditDashboardTab: React.FC<AuditDashboardTabProps> = ({
  onSelectTab,
  onInspectContent,
  onNotify,
}) => {
  const { inventory, counters, qualityMetrics, priorityAlerts, runAuditScope } = useAudit();
  const [runningQuickScan, setRunningQuickScan] = useState(false);

  const handleRunDeterministicCatalogScan = async () => {
    setRunningQuickScan(true);
    try {
      const targetIds = inventory.filter((i) => !i.archived).map((i) => i.id);
      const run = await runAuditScope({
        scopeType: 'all_catalog',
        scopeLabel: 'Scan déterministe intégral du catalogue',
        targetIds,
        includeAi: false,
        locale: 'fr',
      });
      onNotify(
        `Scan déterministe terminé (${run.completedCount} éléments, ${run.findingsCount} anomalie(s) ajoutée(s)).`,
        'success'
      );
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur lors du scan', 'error');
    } finally {
      setRunningQuickScan(false);
    }
  };

  const kpiCards = [
    { label: 'Contenus inventoriés', value: counters.totalItems, icon: Database, tone: 'text-blue-500' },
    { label: 'Certifications', value: counters.byType.certification, icon: Award, tone: 'text-indigo-500' },
    { label: 'Domaines', value: counters.byType.domain, icon: Layers, tone: 'text-cyan-500' },
    { label: 'QCM & Examens blancs', value: counters.byType.quiz_question + counters.byType.exam_question, icon: ClipboardCheck, tone: 'text-violet-500' },
    { label: 'Flashcards', value: counters.byType.flashcard, icon: Sparkles, tone: 'text-emerald-500' },
    { label: 'Glossaire', value: counters.byType.glossary, icon: BookOpen, tone: 'text-teal-500' },
    { label: 'Contenus audités', value: counters.auditedItems, icon: Play, tone: 'text-sky-500' },
    { label: 'Validés humainement', value: counters.humanValidatedItems, icon: CheckCircle2, tone: 'text-emerald-500' },
    { label: 'En attente de validation', value: counters.pendingHumanValidationItems, icon: FileWarning, tone: 'text-amber-500' },
    { label: 'Anomalies critiques', value: counters.criticalFindings, icon: ShieldAlert, tone: 'text-rose-500' },
    { label: 'Anomalies élevées', value: counters.highFindings, icon: AlertTriangle, tone: 'text-orange-500' },
    { label: 'Sources cassées / non vérif.', value: counters.brokenOrUncheckedSources, icon: Link2Off, tone: 'text-rose-400' },
  ];

  const gauges = [
    {
      label: 'Taux de conformité technique structurelle',
      value: qualityMetrics.technicalComplianceRate,
      desc: 'Part des éléments actifs sans anomalie critique ou élevée ouverte.',
    },
    {
      label: 'Taux de contenu sourcé officiellement',
      value: qualityMetrics.sourcedContentRate,
      desc: 'Part des éléments reliés à une documentation éditeur ou preuve rattachée.',
    },
    {
      label: 'Taux de cohérence bilingue FR / EN',
      value: qualityMetrics.translationCoherenceRate,
      desc: 'Part des éléments disposant d’une contrepartie anglaise structurée.',
    },
    {
      label: 'Taux de validation humaine sur version active',
      value: qualityMetrics.humanValidationRate,
      desc: 'Part des éléments approuvés humainement sur leur hash de version actuel.',
    },
    {
      label: 'Taux d’obsolescence ou fraîcheur expirée',
      value: qualityMetrics.staleOrDeprecatedRate,
      desc: 'Part des éléments périmés ou rattachés à une certification retirée/suspendue.',
      inverse: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d]">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Synthèse dynamique du patrimoine pédagogique
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {qualityMetrics.methodologyNote}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={runningQuickScan}
            onClick={handleRunDeterministicCatalogScan}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            {runningQuickScan ? 'Scan en cours...' : 'Lancer scan déterministe global'}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('findings')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#2a3146] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1a2030]"
          >
            Lancer audit IA ciblé
          </button>
        </div>
      </div>

      {/* 12 Dynamic KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${card.tone}`} />
                <span className="text-lg font-extrabold font-mono text-slate-900 dark:text-white">
                  {card.value.toLocaleString('fr-FR')}
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                {card.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quality Gauges + Priority Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Indicateurs de qualité mesurés
          </h3>
          <div className="space-y-3.5">
            {gauges.map((g) => {
              const barColor = g.inverse
                ? g.value > 15
                  ? 'bg-rose-500'
                  : 'bg-emerald-500'
                : g.value >= 80
                ? 'bg-emerald-500'
                : g.value >= 50
                ? 'bg-amber-500'
                : 'bg-rose-500';

              return (
                <div key={g.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {g.label}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {g.value} %
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-[#1e2436] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${Math.min(100, Math.max(0, g.value))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{g.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Alertes prioritaires triées ({priorityAlerts.length})
            </h3>
            <button
              type="button"
              onClick={() => onSelectTab('findings')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Voir toutes les anomalies
            </button>
          </div>

          {priorityAlerts.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#111520] text-center text-xs text-slate-500">
              Aucune alerte prioritaire enregistrée. Lancez un scan déterministe ou un audit IA pour évaluer le catalogue.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {priorityAlerts.map((al) => (
                <button
                  key={al.id}
                  type="button"
                  onClick={() => {
                    if (al.contentId) {
                      onInspectContent(al.contentId);
                    } else {
                      onSelectTab(al.targetTab);
                    }
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-[#242b3d] hover:bg-slate-50 dark:hover:bg-[#181e2f] transition-colors flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {al.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{al.detail}</div>
                  </div>
                  <SeverityBadge severity={al.severity} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
