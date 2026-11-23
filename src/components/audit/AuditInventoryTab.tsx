import React, { useMemo, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  Eye,
  Filter,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { ContentItem, ContentType, EditorialStatus, ValidationStatus } from '../../types/audit';
import { useAudit } from '../../context/AuditContext';
import {
  CONTENT_TYPE_LABELS,
  EDITORIAL_STATUS_LABELS,
  FreshnessBadge,
  ValidationBadge,
} from './AuditSharedBadges';

interface AuditInventoryTabProps {
  onInspectContent: (contentId: string) => void;
  onGoToValidation: (contentId: string) => void;
  onNotify: (msg: string, tone?: 'success' | 'error' | 'info') => void;
}

const PAGE_SIZE = 25;

export const AuditInventoryTab: React.FC<AuditInventoryTabProps> = ({
  onInspectContent,
  onGoToValidation,
  onNotify,
}) => {
  const { inventory, runAuditScope, setContentArchiveState, settings } = useAudit();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [certFilter, setCertFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [editorialFilter, setEditorialFilter] = useState<EditorialStatus | 'all'>('all');
  const [validationFilter, setValidationFilter] = useState<ValidationStatus | 'all'>('all');
  const [onlyOpenAnomalies, setOnlyOpenAnomalies] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'anomalies' | 'updated' | 'version'>('default');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [runningBatch, setRunningBatch] = useState(false);

  const uniqueCertCodes = useMemo(
    () => Array.from(new Set(inventory.map((i) => i.certificationCode))).sort(),
    [inventory]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return inventory
      .filter((item) => {
        if (!showArchived && item.archived) return false;
        if (typeFilter !== 'all' && item.contentType !== typeFilter) return false;
        if (certFilter !== 'all' && item.certificationCode !== certFilter) return false;
        if (providerFilter !== 'all' && item.provider !== providerFilter) return false;
        if (editorialFilter !== 'all' && item.editorialStatus !== editorialFilter) return false;
        if (validationFilter !== 'all' && item.validationStatus !== validationFilter) return false;
        if (onlyOpenAnomalies && item.openFindingsCount === 0) return false;
        if (q) {
          return (
            item.id.toLowerCase().includes(q) ||
            item.title.toLowerCase().includes(q) ||
            item.summary.toLowerCase().includes(q) ||
            item.certificationCode.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'anomalies') return b.openFindingsCount - a.openFindingsCount;
        if (sortBy === 'version') return b.activeVersion - a.activeVersion;
        if (sortBy === 'updated') return b.updatedAt.localeCompare(a.updatedAt);
        return 0;
      });
  }, [
    inventory,
    searchQuery,
    typeFilter,
    certFilter,
    providerFilter,
    editorialFilter,
    validationFilter,
    onlyOpenAnomalies,
    showArchived,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkAudit = async (includeAi: boolean) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      onNotify('Sélectionnez au moins un élément dans le tableau.', 'info');
      return;
    }
    setRunningBatch(true);
    try {
      const run = await runAuditScope({
        scopeType: 'selection',
        scopeLabel: `Sélection manuelle (${ids.length} éléments)`,
        targetIds: ids,
        includeAi,
        locale: 'fr',
      });
      onNotify(`Audit terminé : ${run.completedCount} analysés, ${run.findingsCount} anomalie(s).`, 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur audit sélection', 'error');
    } finally {
      setRunningBatch(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Multi-Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="relative md:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher ID, titre, mot-clé..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as ContentType | 'all');
              setPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value="all">Tous types ({inventory.length})</option>
            {Object.entries(CONTENT_TYPE_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={certFilter}
            onChange={(e) => {
              setCertFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value="all">Toutes certifications</option>
            {uniqueCertCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>

          <select
            value={providerFilter}
            onChange={(e) => {
              setProviderFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value="all">Tous fournisseurs</option>
            <option value="azure">Microsoft Azure</option>
            <option value="aws">AWS</option>
            <option value="gcp">Google Cloud</option>
            <option value="ibm">IBM watsonx</option>
            <option value="nvidia">NVIDIA</option>
            <option value="general">Transverse</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value="default">Tri standard</option>
            <option value="anomalies">Anomalies décroissantes</option>
            <option value="version">Version active</option>
            <option value="updated">Dernière mise à jour</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <select
              value={editorialFilter}
              onChange={(e) => setEditorialFilter(e.target.value as EditorialStatus | 'all')}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
            >
              <option value="all">Statut éditorial : Tous</option>
              {Object.entries(EDITORIAL_STATUS_LABELS).map(([k, lbl]) => (
                <option key={k} value={k}>
                  {lbl}
                </option>
              ))}
            </select>

            <select
              value={validationFilter}
              onChange={(e) => setValidationFilter(e.target.value as ValidationStatus | 'all')}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
            >
              <option value="all">Validation : Toutes</option>
              <option value="pending_human">En attente humaine</option>
              <option value="validated">Validé</option>
              <option value="validated_with_reserves">Validé sous réserve</option>
              <option value="invalidated_by_edit">Invalidé après modif</option>
              <option value="rejected">Rejeté</option>
            </select>

            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={onlyOpenAnomalies}
                onChange={(e) => setOnlyOpenAnomalies(e.target.checked)}
              />
              <span>Anomalies ouvertes uniquement</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
              />
              <span>Inclure archivés</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-500">
              {filtered.length.toLocaleString('fr-FR')} résultat(s)
              {selectedIds.size > 0 ? ` • ${selectedIds.size} sélectionné(s)` : ''}
            </span>
            {selectedIds.size > 0 && (
              <>
                <button
                  type="button"
                  disabled={runningBatch}
                  onClick={() => handleBulkAudit(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs font-semibold"
                >
                  Scan déterministe ({selectedIds.size})
                </button>
                <button
                  type="button"
                  disabled={runningBatch}
                  onClick={() => handleBulkAudit(true)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Audit IA (max {settings.maxBatchSize})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#242b3d] bg-slate-50 dark:bg-[#10141f] text-[11px] font-mono text-slate-500 uppercase">
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    aria-label="Tout sélectionner sur cette page"
                    checked={
                      pageItems.length > 0 && pageItems.every((i) => selectedIds.has(i.id))
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          pageItems.forEach((i) => next.add(i.id));
                          return next;
                        });
                      } else {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          pageItems.forEach((i) => next.delete(i.id));
                          return next;
                        });
                      }
                    }}
                  />
                </th>
                <th className="p-3">ID & Type</th>
                <th className="p-3">Titre / Intitulé</th>
                <th className="p-3">Certif</th>
                <th className="p-3">Statut / Validation</th>
                <th className="p-3">Fraîcheur</th>
                <th className="p-3">Langues</th>
                <th className="p-3 text-center">Anomalies</th>
                <th className="p-3 text-center">Version</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1e2436]">
              {pageItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#181d2c] transition-colors"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-mono font-semibold text-slate-900 dark:text-white">
                      {item.id}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {CONTENT_TYPE_LABELS[item.contentType]}
                    </div>
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{item.summary}</div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {item.certificationCode}
                    </span>
                    <div className="text-[10px] uppercase text-slate-400">{item.provider}</div>
                  </td>
                  <td className="p-3 whitespace-nowrap space-y-1">
                    <div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300">
                        {EDITORIAL_STATUS_LABELS[item.editorialStatus]}
                      </span>
                    </div>
                    <ValidationBadge item={item} />
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <FreshnessBadge status={item.freshnessStatus} />
                  </td>
                  <td className="p-3 whitespace-nowrap font-mono text-[11px]">
                    {item.localeCoverage === 'fr_en' ? 'FR + EN' : item.localeCoverage === 'fr_only' ? 'FR seul' : 'EN seul'}
                  </td>
                  <td className="p-3 text-center">
                    {item.openFindingsCount > 0 ? (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.criticalFindingsCount > 0
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {item.openFindingsCount}
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="p-3 text-center font-mono">v{item.activeVersion}</td>
                  <td className="p-3 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onInspectContent(item.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-[#242c40] text-slate-600 dark:text-slate-300"
                        title="Consulter / Éditer / Sources"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onGoToValidation(item.id)}
                        className="p-1.5 rounded-lg hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        title="Ouvrir dans Validations"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setContentArchiveState(item.id, !item.archived)}
                        className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-[#242c40] text-slate-500"
                        title={item.archived ? 'Restaurer' : 'Archiver'}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    <Filter className="w-5 h-5 mx-auto mb-1 opacity-50" />
                    Aucun contenu ne correspond à ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-[#242b3d] flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            Page {safePage} / {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#2a3146] disabled:opacity-40 inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Précédent
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#2a3146] disabled:opacity-40 inline-flex items-center gap-1"
            >
              Suivant
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
