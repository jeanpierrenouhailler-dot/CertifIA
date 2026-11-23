import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Eye,
  FileCheck2,
  Filter,
  Play,
  ShieldAlert,
  Square,
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import type {
  AuditFinding,
  AuditProvider,
  AuditScopeType,
  FindingCategory,
  FindingSeverity,
  FindingStatus,
} from '../../types/audit';
import {
  CONTENT_TYPE_LABELS,
  FINDING_STATUS_LABELS,
  SEVERITY_LABELS,
  SeverityBadge,
} from './AuditSharedBadges';

interface AuditEngineAndFindingsTabProps {
  selectedContentIds: string[];
  onInspectContent: (contentId: string) => void;
  onGoToValidation: (contentId: string) => void;
  onNotify: (msg: string, tone?: 'success' | 'error' | 'info') => void;
}

const CATEGORY_LABELS: Record<FindingCategory, string> = {
  exactitude_technique: 'Exactitude technique',
  obsolescence_certification: 'Obsolescence certification',
  incoherence_pedagogique: 'Cohérence pédagogique',
  probleme_traduction_fr_en: 'Traduction FR / EN',
  ambiguite_question_distracteurs: 'Ambiguïté QCM / distracteurs',
  justification_insuffisante: 'Justification insuffisante',
  source_absente_ou_non_officielle: 'Source absente / non officielle',
  duplication_redondance: 'Duplication / redondance',
  erreur_metadonnee: 'Erreur métadonnée',
  risque_hallucination_editorial: 'Risque d’hallucination / absolus',
};

export const AuditEngineAndFindingsTab: React.FC<AuditEngineAndFindingsTabProps> = ({
  selectedContentIds,
  onInspectContent,
  onGoToValidation,
  onNotify,
}) => {
  const {
    inventory,
    certifications,
    runs,
    findings,
    settings,
    activeBatchProgress,
    runAuditScope,
    cancelActiveRun,
    updateFindingStatus,
  } = useAudit();

  // Audit Launcher state
  const [scopeType, setScopeType] = useState<AuditScopeType>('certification');
  const [singleContentId, setSingleContentId] = useState<string>(inventory[0]?.id || '');
  const [targetCertId, setTargetCertId] = useState<string>(certifications[0]?.id || 'c1000177');
  const [targetProvider, setTargetProvider] = useState<AuditProvider>('azure');
  const [targetDomainName, setTargetDomainName] = useState<string>(
    inventory.find((i) => i.contentType === 'domain')?.title || ''
  );
  const [includeAi, setIncludeAi] = useState<boolean>(false);
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');
  const [launching, setLaunching] = useState(false);

  // Findings Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | FindingSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<'open' | 'all' | FindingStatus>('open');
  const [categoryFilter, setCategoryFilter] = useState<'all' | FindingCategory>('all');
  const [originFilter, setOriginFilter] = useState<'all' | AuditFinding['origin']>('all');
  const [includeHistory, setIncludeHistory] = useState(false);

  // Per-finding transition draft
  const [commentByFinding, setCommentByFinding] = useState<Record<string, string>>({});
  const [busyFindingId, setBusyFindingId] = useState<string | null>(null);

  const uniqueDomainTitles = useMemo(() => {
    const names = new Set<string>();
    for (const item of inventory) {
      if (item.domainName) names.add(item.domainName);
      if (item.contentType === 'domain') names.add(item.title);
    }
    return Array.from(names).sort();
  }, [inventory]);

  const computedTargets = useMemo(() => {
    const active = inventory.filter((i) => !i.archived);
    if (scopeType === 'single') {
      return active.filter((i) => i.id === singleContentId);
    }
    if (scopeType === 'selection') {
      return active.filter((i) => selectedContentIds.includes(i.id));
    }
    if (scopeType === 'certification') {
      return active.filter((i) => i.certificationId === targetCertId);
    }
    if (scopeType === 'provider') {
      return active.filter((i) => i.provider === targetProvider);
    }
    if (scopeType === 'domain') {
      return active.filter(
        (i) => i.domainName === targetDomainName || (i.contentType === 'domain' && i.title === targetDomainName)
      );
    }
    return active;
  }, [inventory, scopeType, singleContentId, selectedContentIds, targetCertId, targetProvider, targetDomainName]);

  const handleLaunchAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (computedTargets.length === 0) {
      onNotify('Aucun élément actif ne correspond à ce périmètre.', 'error');
      return;
    }
    setLaunching(true);
    try {
      const scopeLabels: Record<AuditScopeType, string> = {
        single: `Contenu unique : ${singleContentId}`,
        selection: `Sélection multiple (${computedTargets.length} éléments)`,
        certification: `Certification ${targetCertId.toUpperCase()}`,
        domain: `Domaine : ${targetDomainName}`,
        provider: `Fournisseur ${targetProvider.toUpperCase()}`,
        all_catalog: 'Catalogue intégral actif',
      };
      const run = await runAuditScope({
        scopeType,
        scopeLabel: scopeLabels[scopeType],
        targetIds: computedTargets.map((t) => t.id),
        includeAi,
        locale,
      });
      onNotify(
        `Exécution ${run.id} terminée (${run.completedCount}/${run.targetCount}, ${run.findingsCount} nouvelle(s) anomalie(s)).`,
        'success'
      );
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur lors de l’exécution de l’audit.', 'error');
    } finally {
      setLaunching(false);
    }
  };

  const handleStatusChange = async (findingId: string, nextStatus: FindingStatus) => {
    setBusyFindingId(findingId);
    try {
      await updateFindingStatus(findingId, nextStatus, commentByFinding[findingId]);
      onNotify(`Anomalie passée au statut « ${FINDING_STATUS_LABELS[nextStatus]} ».`, 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Transition refusée', 'error');
    } finally {
      setBusyFindingId(null);
    }
  };

  const filteredFindings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return findings.filter((f) => {
      const isOpen = f.status !== 'resolved' && f.status !== 'dismissed';
      if (statusFilter === 'open' && !includeHistory && !isOpen) return false;
      if (statusFilter !== 'open' && statusFilter !== 'all' && f.status !== statusFilter) return false;
      if (severityFilter !== 'all' && f.severity !== severityFilter) return false;
      if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
      if (originFilter !== 'all' && f.origin !== originFilter) return false;
      if (q) {
        const hay = `${f.id} ${f.contentId} ${f.title} ${f.rationale} ${f.sourceBasis}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [findings, searchQuery, severityFilter, statusFilter, categoryFilter, originFilter, includeHistory]);

  return (
    <div className="space-y-6">
      {/* Audit Launcher */}
      <form
        onSubmit={handleLaunchAudit}
        className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-500" />
              Moteur d’audit (Déterministe & IA assistée {settings.activeAiModel})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sélectionnez un périmètre exact parmi les 6 modes. Les lots IA sont plafonnés à {settings.maxBatchSize}{' '}
              éléments et {settings.dailyAiCallCap} appels/jour pour maîtriser les coûts.
            </p>
          </div>
          {activeBatchProgress && (
            <button
              type="button"
              onClick={cancelActiveRun}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5" />
              Interrompre ({activeBatchProgress.completed}/{activeBatchProgress.total})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Périmètre (6 modes)</label>
            <select
              value={scopeType}
              onChange={(e) => setScopeType(e.target.value as AuditScopeType)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
            >
              <option value="single">1. Contenu unique</option>
              <option value="selection">2. Sélection multiple ({selectedContentIds.length} coché(s))</option>
              <option value="certification">3. Par certification</option>
              <option value="domain">4. Par domaine</option>
              <option value="provider">5. Par fournisseur Cloud</option>
              <option value="all_catalog">6. Catalogue complet</option>
            </select>
          </div>

          {scopeType === 'single' && (
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Élément cible</label>
              <select
                value={singleContentId}
                onChange={(e) => setSingleContentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
              >
                {inventory
                  .filter((i) => !i.archived && i.contentType !== 'flashcard')
                  .slice(0, 120)
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      [{CONTENT_TYPE_LABELS[i.contentType]}] {i.id} — {i.title.slice(0, 50)}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {scopeType === 'certification' && (
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Certification</label>
              <select
                value={targetCertId}
                onChange={(e) => setTargetCertId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
              >
                {certifications.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {scopeType === 'domain' && (
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Domaine</label>
              <select
                value={targetDomainName}
                onChange={(e) => setTargetDomainName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
              >
                {uniqueDomainTitles.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {scopeType === 'provider' && (
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Fournisseur</label>
              <select
                value={targetProvider}
                onChange={(e) => setTargetProvider(e.target.value as AuditProvider)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
              >
                <option value="azure">Microsoft Azure</option>
                <option value="aws">Amazon Web Services (AWS)</option>
                <option value="gcp">Google Cloud (GCP)</option>
                <option value="ibm">IBM watsonx</option>
                <option value="general">Général / Multi-cloud</option>
              </select>
            </div>
          )}

          {(scopeType === 'selection' || scopeType === 'all_catalog') && (
            <div className="md:col-span-2 flex items-end">
              <div className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044] text-slate-600 dark:text-slate-300">
                {computedTargets.length} élément(s) ciblé(s)
                {includeAi && computedTargets.length > settings.maxBatchSize
                  ? ` (lot IA plafonné aux ${settings.maxBatchSize} premiers)`
                  : ''}
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Langue d’audit & Mode</label>
            <div className="flex items-center gap-2">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as 'fr' | 'en')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
              <label className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044] cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={includeAi}
                  onChange={(e) => setIncludeAi(e.target.checked)}
                />
                <span className="font-semibold">+ Analyse IA</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="text-[11px] text-slate-500">
            Cibles résolues : <strong>{computedTargets.length}</strong> élément(s) • Aucun résultat IA n’est publié sans
            validation humaine.
          </div>
          <button
            type="submit"
            disabled={launching || computedTargets.length === 0}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            {launching ? 'Audit en cours...' : includeAi ? 'Lancer Audit Déterministe + IA' : 'Lancer Contrôle Déterministe'}
          </button>
        </div>
      </form>

      {/* Recent Runs History */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Journal des exécutions d’audit ({runs.length})
        </h3>
        {runs.length === 0 ? (
          <p className="text-xs text-slate-500">Aucune campagne enregistrée pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#242b3d] text-[11px] font-mono text-slate-500">
                  <th className="py-2 pr-3">Exécution</th>
                  <th className="py-2 pr-3">Périmètre</th>
                  <th className="py-2 pr-3">Moteur / Prompt</th>
                  <th className="py-2 pr-3">Progression</th>
                  <th className="py-2 pr-3">Anomalies</th>
                  <th className="py-2 pr-3">Statut</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2536]">
                {runs.slice(0, 12).map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 pr-3 font-mono text-[11px]">{r.id}</td>
                    <td className="py-2 pr-3 font-medium text-slate-900 dark:text-white">{r.scopeLabel}</td>
                    <td className="py-2 pr-3 font-mono text-[11px] text-slate-500">
                      {r.modelIdentifier} ({r.promptVersion})
                    </td>
                    <td className="py-2 pr-3 font-mono">
                      {r.completedCount}/{r.targetCount}
                    </td>
                    <td className="py-2 pr-3 font-mono font-semibold">{r.findingsCount}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          r.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                            : r.status === 'failed'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-300'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2 text-[11px] text-slate-500">
                      {new Date(r.startedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Central Findings Queue */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            File centrale des anomalies ({filteredFindings.length} / {findings.length})
          </h3>
          <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeHistory}
              onChange={(e) => setIncludeHistory(e.target.checked)}
            />
            Conserver et afficher l’historique résolu / rejeté
          </label>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher ID, titre, extrait, source..."
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as 'all' | FindingSeverity)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value="all">Toutes sévérités</option>
            {(['critical', 'high', 'medium', 'low'] as FindingSeverity[]).map((sev) => (
              <option key={sev} value={sev}>
                {SEVERITY_LABELS[sev]}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'open' | 'all' | FindingStatus)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value="open">Ouvertes uniquement</option>
            <option value="all">Tous statuts</option>
            {(Object.keys(FINDING_STATUS_LABELS) as FindingStatus[]).map((st) => (
              <option key={st} value={st}>
                {FINDING_STATUS_LABELS[st]}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'all' | FindingCategory)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value="all">Toutes catégories</option>
            {(Object.keys(CATEGORY_LABELS) as FindingCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
          <select
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value as 'all' | AuditFinding['origin'])}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value="all">Toutes origines</option>
            <option value="deterministic">Déterministe</option>
            <option value="ai_assisted">Assistée par IA</option>
            <option value="human">Humaine</option>
          </select>
        </div>

        {filteredFindings.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-50 dark:bg-[#10141f] text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <span>Aucune anomalie ne correspond aux filtres sélectionnés.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFindings.slice(0, 60).map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-[#242b3d] bg-slate-50/60 dark:bg-[#111520] space-y-2.5 text-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <SeverityBadge severity={f.severity} />
                      <span className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-[#1d2436] font-mono text-[11px]">
                        {f.contentId} (v{f.contentVersion})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 text-[11px]">
                        {CATEGORY_LABELS[f.category]}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-300 text-[11px] font-mono">
                        {f.origin}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{f.title}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onInspectContent(f.contentId)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#2b3246] hover:bg-white dark:hover:bg-[#1a2030] inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Fiche
                    </button>
                    <button
                      type="button"
                      onClick={() => onGoToValidation(f.contentId)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold inline-flex items-center gap-1"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      Valider
                    </button>
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.rationale}</p>

                {f.problematicExcerpt && (
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#0c1018] border border-slate-200 dark:border-[#22293c] font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    Extrait : {f.problematicExcerpt}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>
                    <strong className="text-slate-700 dark:text-slate-300">Action recommandée :</strong>{' '}
                    {f.recommendedAction}
                  </div>
                  <div>
                    <strong className="text-slate-700 dark:text-slate-300">Base documentaire :</strong>{' '}
                    {f.sourceBasis || 'Non rattachée'}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/70 dark:border-[#22283a]">
                  <span className="font-mono text-[11px] text-slate-500">
                    Statut actuel : <strong>{FINDING_STATUS_LABELS[f.status]}</strong>
                  </span>
                  <input
                    type="text"
                    value={commentByFinding[f.id] ?? f.resolutionComment ?? ''}
                    onChange={(e) =>
                      setCommentByFinding((prev) => ({ ...prev, [f.id]: e.target.value }))
                    }
                    placeholder="Commentaire de décision / résolution..."
                    className="flex-1 min-w-[200px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-[#283044]"
                  />
                  <select
                    disabled={busyFindingId === f.id}
                    value={f.status}
                    onChange={(e) => handleStatusChange(f.id, e.target.value as FindingStatus)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-[#283044] font-semibold"
                  >
                    {(Object.keys(FINDING_STATUS_LABELS) as FindingStatus[]).map((st) => (
                      <option key={st} value={st}>
                        → {FINDING_STATUS_LABELS[st]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
