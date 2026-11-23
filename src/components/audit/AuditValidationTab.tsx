import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Eye,
  FileCheck2,
  ShieldAlert,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import type { ContentItem, HumanReview } from '../../types/audit';
import { evaluateHumanApprovalEligibility } from '../../services/audit/humanValidationService';
import {
  CONTENT_TYPE_LABELS,
  FINDING_STATUS_LABELS,
  FreshnessBadge,
  SeverityBadge,
  ValidationBadge,
} from './AuditSharedBadges';

interface AuditValidationTabProps {
  selectedContentId: string | null;
  onSelectContentId: (id: string) => void;
  onInspectContent: (contentId: string) => void;
  onNotify: (msg: string, tone?: 'success' | 'error' | 'info') => void;
}

export const AuditValidationTab: React.FC<AuditValidationTabProps> = ({
  selectedContentId,
  onSelectContentId,
  onInspectContent,
  onNotify,
}) => {
  const {
    inventory,
    certifications,
    sources,
    evidence,
    findings,
    settings,
    latestAiSuggestions,
    saveContentRevision,
    dismissAiSuggestion,
    submitHumanValidation,
  } = useAudit();

  const candidateItems = useMemo(() => {
    const priority = (i: ContentItem) => {
      if (latestAiSuggestions[i.id]) return 0;
      if (i.criticalFindingsCount > 0) return 1;
      if (i.validationStatus === 'invalidated_by_edit') return 2;
      if (i.openFindingsCount > 0) return 3;
      if (i.validationStatus === 'pending_human') return 4;
      return 5;
    };
    return inventory
      .filter((i) => !i.archived)
      .slice()
      .sort((a, b) => priority(a) - priority(b));
  }, [inventory, latestAiSuggestions]);

  const activeItem =
    inventory.find((i) => i.id === selectedContentId) || candidateItems[0] || null;

  const [justification, setJustification] = useState('');
  const [conditionalReserves, setConditionalReserves] = useState('');
  const [publishLive, setPublishLive] = useState(true);
  const [attachedSourceIds, setAttachedSourceIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeItem) {
      setAttachedSourceIds(activeItem.attachedSourceIds);
      setJustification('');
      setConditionalReserves('');
    }
  }, [activeItem?.id]);

  if (!activeItem) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] text-center text-xs text-slate-500">
        Aucun élément actif disponible pour validation.
      </div>
    );
  }

  const aiSuggestion = latestAiSuggestions[activeItem.id];
  const itemFindings = findings.filter((f) => f.contentId === activeItem.id);
  const itemSources = sources.filter(
    (s) =>
      attachedSourceIds.includes(s.id) ||
      activeItem.attachedSourceIds.includes(s.id) ||
      (activeItem.officialDocUrl && s.url === activeItem.officialDocUrl)
  );
  const itemEvidence = evidence.filter((e) => e.contentId === activeItem.id);

  const eligibility = evaluateHumanApprovalEligibility({
    item: activeItem,
    findings,
    sources,
    evidence,
    certifications,
    settings,
    hasPendingAiSuggestion: Boolean(aiSuggestion),
  });

  const handleApplyAiSuggestion = async () => {
    if (!aiSuggestion) return;
    setSubmitting(true);
    try {
      const nextFr = { ...activeItem.payloadFr };
      const prop = aiSuggestion.result.proposedRevision;
      if (prop.suggestedTitle) {
        if ('title' in nextFr) nextFr.title = prop.suggestedTitle;
        else if ('term' in nextFr) nextFr.term = prop.suggestedTitle;
      }
      if (prop.suggestedSummary) {
        if ('summary' in nextFr) nextFr.summary = prop.suggestedSummary;
        else if ('shortDefinition' in nextFr) nextFr.shortDefinition = prop.suggestedSummary;
        else if ('question' in nextFr) nextFr.question = prop.suggestedSummary;
      }
      if (prop.suggestedExplanation) {
        if (nextFr.explanation && typeof nextFr.explanation === 'object') {
          nextFr.explanation = {
            ...(nextFr.explanation as Record<string, unknown>),
            mainReason: prop.suggestedExplanation,
          };
        } else if ('detailedExplanation' in nextFr) {
          nextFr.detailedExplanation = prop.suggestedExplanation;
        } else if ('back' in nextFr) {
          nextFr.back = prop.suggestedExplanation;
        }
      }
      await saveContentRevision({
        contentId: activeItem.id,
        updatedPayloadFr: nextFr,
        changeNote: prop.changeNote || 'Application proposition assistée par IA (avant validation humaine)',
      });
      dismissAiSuggestion(activeItem.id);
      onNotify(
        `Suggestion IA appliquée comme nouvelle révision v${activeItem.activeVersion + 1}. Validation humaine maintenant requise.`,
        'info'
      );
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur application suggestion', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecision = async (decision: HumanReview['decision']) => {
    if (!justification.trim()) {
      onNotify('Une justification humaine écrite est obligatoire pour tracer la décision.', 'error');
      return;
    }
    if (decision === 'approved_with_reserves' && !conditionalReserves.trim()) {
      onNotify('Veuillez préciser les réserves documentées pour une validation sous réserve.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await submitHumanValidation({
        contentId: activeItem.id,
        decision,
        justification,
        conditionalReserves,
        attachedSourceIds,
        publishLive: publishLive && (decision === 'approved' || decision === 'approved_with_reserves'),
      });
      onNotify(`Décision « ${decision} » enregistrée sur ${activeItem.id} v${activeItem.activeVersion}.`, 'success');
      setJustification('');
      setConditionalReserves('');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Validation bloquée', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[260px]">
          <label className="block text-[11px] font-mono font-bold uppercase text-slate-500 mb-1">
            Élément sélectionné pour arbitrage humain
          </label>
          <select
            value={activeItem.id}
            onChange={(e) => onSelectContentId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            {candidateItems.slice(0, 120).map((item) => (
              <option key={item.id} value={item.id}>
                [{CONTENT_TYPE_LABELS[item.contentType]}] {item.id} (v{item.activeVersion}) —{' '}
                {item.title.slice(0, 55)} {latestAiSuggestions[item.id] ? '★ IA' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ValidationBadge item={activeItem} />
          <FreshnessBadge status={activeItem.freshnessStatus} />
          <button
            type="button"
            onClick={() => onInspectContent(activeItem.id)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2a3146] text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Éditer / Preuves
          </button>
        </div>
      </div>

      {/* Pending AI Suggestion Box (Never Auto-Published) */}
      {aiSuggestion && (
        <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/30 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Bot className="w-4 h-4" />
              Suggestion IA en attente d’arbitrage ({aiSuggestion.modelIdentifier} • confiance{' '}
              {aiSuggestion.result.confidenceScore}% • verdict : {aiSuggestion.result.overallVerdict})
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {new Date(aiSuggestion.analyzedAt).toLocaleString()}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300">{aiSuggestion.result.summary}</p>

          {aiSuggestion.result.limitations.length > 0 && (
            <div className="text-[11px] text-amber-700 dark:text-amber-300">
              Limites déclarées par le modèle : {aiSuggestion.result.limitations.join(' | ')}
            </div>
          )}

          <div className="p-3 rounded-xl bg-white dark:bg-[#0f131d] border border-slate-200 dark:border-[#242b3d] text-xs space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white">
              Révision proposée ({aiSuggestion.result.proposedRevision.changeNote})
            </div>
            {aiSuggestion.result.proposedRevision.suggestedTitle && (
              <div>Titre : {aiSuggestion.result.proposedRevision.suggestedTitle}</div>
            )}
            {aiSuggestion.result.proposedRevision.suggestedSummary && (
              <div>Résumé : {aiSuggestion.result.proposedRevision.suggestedSummary}</div>
            )}
            {aiSuggestion.result.proposedRevision.suggestedExplanation && (
              <div>Explication : {aiSuggestion.result.proposedRevision.suggestedExplanation}</div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={handleApplyAiSuggestion}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Appliquer la suggestion (créer révision v{activeItem.activeVersion + 1})
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                dismissAiSuggestion(activeItem.id);
                onNotify('Suggestion IA écartée sans modification du contenu.', 'info');
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#2e364c] text-xs font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              Écarter la proposition
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison: Payload FR vs EN + Sources/Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-500">
            Payload Actuel (FR) — Version v{activeItem.activeVersion} ({activeItem.contentHash})
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-72">
            {JSON.stringify(activeItem.payloadFr, null, 2)}
          </pre>

          <div className="text-xs font-mono font-bold uppercase text-slate-500 pt-2">
            Contrepartie EN ({activeItem.localeCoverage})
          </div>
          {activeItem.payloadEn ? (
            <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-300 text-[11px] font-mono overflow-x-auto max-h-56">
              {JSON.stringify(activeItem.payloadEn, null, 2)}
            </pre>
          ) : (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
              Aucune contrepartie EN structurée présente.
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Blocking & Eligibility Panel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Contrôles bloquants de validation
            </h3>

            {eligibility.blockingReasons.length === 0 && eligibility.warnings.length === 0 ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Tous les prérequis structurels, documentaires et d’audit sont satisfaits pour une approbation complète.
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {eligibility.blockingReasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300"
                  >
                    Bloquant : {reason}
                  </div>
                ))}
                {eligibility.warnings.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs text-slate-600 dark:text-slate-400">
              Sources rattachées : <strong>{itemSources.length}</strong> • Preuves textuelles :{' '}
              <strong>{itemEvidence.length}</strong> • Anomalies liées : <strong>{itemFindings.length}</strong>
            </div>
            {itemFindings.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {itemFindings.map((f) => (
                  <div
                    key={f.id}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#242b3d] flex items-center justify-between gap-2 text-[11px]"
                  >
                    <span className="truncate">{f.title}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-slate-500">{FINDING_STATUS_LABELS[f.status]}</span>
                      <SeverityBadge severity={f.severity} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Decision Form */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-500" />
              Décision humaine traçable (v{activeItem.activeVersion})
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Justification obligatoire du relecteur
              </label>
              <textarea
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Ex : Vérifié contre la documentation Microsoft Learn AI-102 (section Azure AI Search), distracteurs conformes."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Réserves documentées (obligatoire si « Valider sous réserve »)
              </label>
              <textarea
                rows={2}
                value={conditionalReserves}
                onChange={(e) => setConditionalReserves(e.target.value)}
                placeholder="Ex : Contrepartie EN à harmoniser lors du prochain cycle."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={publishLive}
                onChange={(e) => setPublishLive(e.target.checked)}
              />
              <span>Publier immédiatement la version validée côté apprenant (PublishedContent)</span>
            </label>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                disabled={submitting || !eligibility.canApprove}
                onClick={() => handleDecision('approved')}
                className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold"
              >
                Approuver (Valide)
              </button>
              <button
                type="button"
                disabled={submitting || !eligibility.canApproveWithReserves}
                onClick={() => handleDecision('approved_with_reserves')}
                className="px-3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-semibold"
              >
                Approuver sous réserve
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleDecision('needs_source')}
                className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#2e364c] text-slate-700 dark:text-slate-200 font-semibold"
              >
                Exiger une source (À vérifier)
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleDecision('rejected')}
                className="px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold"
              >
                Rejeter (À corriger)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
