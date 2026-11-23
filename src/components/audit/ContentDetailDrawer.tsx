import React, { useEffect, useState } from 'react';
import {
  X,
  ExternalLink,
  History,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  Archive,
  Save,
  Plus,
} from 'lucide-react';
import type { ContentItem } from '../../types/audit';
import { useAudit } from '../../context/AuditContext';
import { useAuth } from '../../context/AuthContext';
import { useAccessibleModal } from '../../hooks/useAccessibleModal';
import {
  CONTENT_TYPE_LABELS,
  EDITORIAL_STATUS_LABELS,
  FreshnessBadge,
  SeverityBadge,
  ValidationBadge,
} from './AuditSharedBadges';
import { computeStructuredDiff } from '../../services/audit/hashAndDiffService';

interface ContentDetailDrawerProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToValidation: (contentId: string) => void;
  onNotify: (msg: string, tone?: 'success' | 'error' | 'info') => void;
}

export const ContentDetailDrawer: React.FC<ContentDetailDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onGoToValidation,
  onNotify,
}) => {
  const { user } = useAuth();
  const {
    sources,
    evidence,
    findings,
    revisions,
    runAuditScope,
    saveContentRevision,
    addEvidence,
    setContentArchiveState,
  } = useAudit();

  const drawerRef = useAccessibleModal<HTMLDivElement>({ isOpen, onClose });

  const [isEditingJson, setIsEditingJson] = useState(false);
  const [editedFrText, setEditedFrText] = useState('');
  const [changeNote, setChangeNote] = useState('');
  const [claimSummary, setClaimSummary] = useState('');
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [excerptText, setExcerptText] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (item) {
      setEditedFrText(JSON.stringify(item.payloadFr, null, 2));
      setChangeNote('');
      setIsEditingJson(false);
      setClaimSummary('');
      setExcerptText('');
      setSelectedSourceId(item.attachedSourceIds[0] || sources[0]?.id || '');
    }
  }, [item, sources]);

  if (!isOpen || !item) return null;

  const itemFindings = findings.filter((f) => f.contentId === item.id);
  const itemEvidence = evidence.filter((e) => e.contentId === item.id);
  const itemRevisions = revisions.filter((r) => r.contentId === item.id);
  const itemSources = sources.filter(
    (s) =>
      item.attachedSourceIds.includes(s.id) ||
      (item.officialDocUrl && s.url === item.officialDocUrl)
  );

  const handleRunAiAudit = async () => {
    setBusy(true);
    try {
      await runAuditScope({
        scopeType: 'single',
        scopeLabel: `Audit unitaire : ${item.id}`,
        targetIds: [item.id],
        includeAi: true,
        locale: 'fr',
      });
      onNotify(`Audit IA terminé sur ${item.id}.`, 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur audit IA', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveNewRevision = async () => {
    setBusy(true);
    try {
      const parsed = JSON.parse(editedFrText) as Record<string, unknown>;
      if (!changeNote.trim()) {
        onNotify('Veuillez saisir un motif de modification pour tracer la révision.', 'error');
        setBusy(false);
        return;
      }
      await saveContentRevision({
        contentId: item.id,
        updatedPayloadFr: parsed,
        changeNote: changeNote.trim(),
      });
      setIsEditingJson(false);
      onNotify('Nouvelle révision enregistrée. Validation humaine requise avant publication.', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'JSON invalide ou erreur de sauvegarde.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleAttachEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    const src = sources.find((s) => s.id === selectedSourceId);
    if (!src || !claimSummary.trim() || !excerptText.trim()) {
      onNotify('Source, affirmation et extrait documentaire sont requis.', 'error');
      return;
    }
    setBusy(true);
    try {
      await addEvidence({
        id: `ev-${Date.now()}`,
        contentId: item.id,
        claimSummary: claimSummary.trim(),
        sourceId: src.id,
        sourceUrl: src.url,
        excerpt: excerptText.trim(),
        supportsClaim: true,
        verifiedAt: new Date().toISOString(),
        verifiedBy: user?.email || 'admin',
      });
      setClaimSummary('');
      setExcerptText('');
      onNotify('Preuve documentaire rattachée avec succès.', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur rattachement preuve', 'error');
    } finally {
      setBusy(false);
    }
  };

  const latestDiffs =
    itemRevisions.length >= 1
      ? computeStructuredDiff(
          (() => {
            try {
              return JSON.parse(itemRevisions[0].snapshotJson)?.payloadFr || null;
            } catch {
              return null;
            }
          })(),
          item.payloadFr
        )
      : [];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Fiche détaillée ${item.id}`}
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white dark:bg-[#111520] h-full overflow-y-auto border-l border-slate-200 dark:border-[#22283a] shadow-2xl flex flex-col"
      >
        <div className="sticky top-0 z-10 px-6 py-4 bg-white/95 dark:bg-[#111520]/95 backdrop-blur border-b border-slate-200 dark:border-[#22283a] flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1a2030] font-semibold">
                {item.id}
              </span>
              <span>{CONTENT_TYPE_LABELS[item.contentType]}</span>
              <span>• {item.certificationCode}</span>
              <span>• v{item.activeVersion}</span>
              <span>• {item.contentHash}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
              {item.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e2436]"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status bar & primary actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#161b28] border border-slate-200 dark:border-[#242b3d]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 font-medium">
                {EDITORIAL_STATUS_LABELS[item.editorialStatus]}
              </span>
              <ValidationBadge item={item} />
              <FreshnessBadge status={item.freshnessStatus} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={handleRunAiAudit}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auditer avec IA
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToValidation(item.id);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                Valider
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setContentArchiveState(item.id, !item.archived)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-[#2c3449] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e2536] inline-flex items-center gap-1.5"
              >
                <Archive className="w-3.5 h-3.5" />
                {item.archived ? 'Désarchiver' : 'Archiver'}
              </button>
            </div>
          </div>

          {/* 1. Structured Content & Editor */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Contenu structuré (FR {item.payloadEn ? '+ EN disponible' : 'uniquement'})
              </h4>
              <button
                type="button"
                onClick={() => setIsEditingJson((prev) => !prev)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {isEditingJson ? 'Annuler l’édition' : 'Modifier et créer une révision'}
              </button>
            </div>

            {isEditingJson ? (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#151a27] border border-blue-500/30">
                <textarea
                  value={editedFrText}
                  onChange={(e) => setEditedFrText(e.target.value)}
                  rows={12}
                  className="w-full font-mono text-xs p-3 rounded-xl bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-[#283044] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={changeNote}
                  onChange={(e) => setChangeNote(e.target.value)}
                  placeholder="Motif obligatoire de la modification (ex: Mise à jour documentation Azure 2026)..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-[#283044]"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-amber-600 dark:text-amber-400">
                    Attention : toute modification crée une nouvelle version et invalide la validation humaine précédente.
                  </span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleSaveNewRevision}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Enregistrer v{item.activeVersion + 1}
                  </button>
                </div>
              </div>
            ) : (
              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-72 border border-slate-800">
                {JSON.stringify(item.payloadFr, null, 2)}
              </pre>
            )}
          </section>

          {/* 2. Official Sources & Documented Claims */}
          <section className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Sources officielles rattachées & extraits de preuve ({itemSources.length} source(s),{' '}
              {itemEvidence.length} preuve(s))
            </h4>

            {itemSources.length === 0 && !item.officialDocUrl ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                Aucune source officielle rattachée pour le moment.
              </div>
            ) : (
              <div className="space-y-2">
                {item.officialDocUrl && itemSources.length === 0 && (
                  <a
                    href={item.officialDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-[#242b3d] hover:bg-slate-50 dark:hover:bg-[#171d2c] text-xs"
                  >
                    <span className="font-mono text-blue-600 dark:text-blue-400 truncate">
                      {item.officialDocUrl}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                  </a>
                )}
                {itemSources.map((src) => (
                  <div
                    key={src.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-[#242b3d] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        [P{src.priorityLevel}] {src.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 truncate">{src.url}</div>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1d2334] text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 shrink-0"
                    >
                      Ouvrir
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {itemEvidence.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1"
              >
                <div className="font-semibold text-emerald-700 dark:text-emerald-300">
                  Affirmation vérifiée : {ev.claimSummary}
                </div>
                <blockquote className="text-slate-700 dark:text-slate-300 italic border-l-2 border-emerald-500/40 pl-2.5">
                  « {ev.excerpt} »
                </blockquote>
                <div className="text-[11px] text-slate-500 font-mono">
                  {ev.sourceUrl} • vérifié par {ev.verifiedBy}
                </div>
              </div>
            ))}

            <form
              onSubmit={handleAttachEvidence}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151a27] border border-slate-200 dark:border-[#242b3d] space-y-2.5"
            >
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Rattacher un extrait de preuve documentaire
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-[#283044]"
                >
                  {sources.map((s) => (
                    <option key={s.id} value={s.id}>
                      [P{s.priorityLevel}] {s.vendor.toUpperCase()} — {s.title.slice(0, 45)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={claimSummary}
                  onChange={(e) => setClaimSummary(e.target.value)}
                  placeholder="Affirmation vérifiée..."
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-[#283044]"
                />
              </div>
              <textarea
                rows={2}
                value={excerptText}
                onChange={(e) => setExcerptText(e.target.value)}
                placeholder="Extrait textuel exact relevé dans la documentation officielle..."
                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-[#283044]"
              />
              <button
                type="submit"
                disabled={busy}
                className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Enregistrer la preuve
              </button>
            </form>
          </section>

          {/* 3. Anomalies & Findings */}
          <section className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Anomalies détectées ({itemFindings.length})
            </h4>
            {itemFindings.length === 0 ? (
              <p className="text-xs text-slate-500">Aucune anomalie enregistrée pour cet élément.</p>
            ) : (
              <div className="space-y-2">
                {itemFindings.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-[#242b3d] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{f.title}</span>
                      <SeverityBadge severity={f.severity} />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{f.rationale}</p>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Statut : {f.status} • Origine : {f.origin} • v{f.contentVersion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 4. Revision history */}
          <section className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-blue-500" />
              Historique des versions ({itemRevisions.length})
            </h4>
            {latestDiffs.length > 0 && (
              <div className="text-[11px] text-slate-500 font-mono">
                Dernier diff détecté sur {latestDiffs.length} champ(s).
              </div>
            )}
            {itemRevisions.length === 0 ? (
              <p className="text-xs text-slate-500">Version initiale v1 (baseline du dépôt).</p>
            ) : (
              <div className="space-y-2">
                {itemRevisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#151a27] border border-slate-200 dark:border-[#242b3d] text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                      <span>
                        v{rev.versionNumber} • {rev.authorEmail}
                      </span>
                      <span>{new Date(rev.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white mt-1">
                      {rev.changeNote}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{rev.diffSummary}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
