import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  Languages,
  PlayCircle,
  RotateCcw,
  Sparkles,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { ValidationBadge } from './AuditSharedBadges';
import { detectProblematicAbsolutes } from '../../services/audit/hashAndDiffService';

interface AuditQuizLabTabProps {
  onInspectContent: (contentId: string) => void;
  onGoToValidation: (contentId: string) => void;
  onNotify: (msg: string, tone?: 'success' | 'error' | 'info') => void;
}

export const AuditQuizLabTab: React.FC<AuditQuizLabTabProps> = ({
  onInspectContent,
  onGoToValidation,
  onNotify,
}) => {
  const { inventory, runAuditScope } = useAudit();

  const quizItems = useMemo(
    () =>
      inventory.filter(
        (i) => (i.contentType === 'quiz_question' || i.contentType === 'exam_question') && !i.archived
      ),
    [inventory]
  );

  const [activeId, setActiveId] = useState<string>(() => quizItems[0]?.id || '');
  const [previewLang, setPreviewLang] = useState<'fr' | 'en'>('fr');
  const [simulatedKey, setSimulatedKey] = useState<string | null>(null);
  const [simulatedRevealed, setSimulatedRevealed] = useState(false);
  const [auditing, setAuditing] = useState(false);

  const selected = quizItems.find((q) => q.id === activeId) || quizItems[0] || null;
  const activePayload =
    previewLang === 'en' && selected?.payloadEn ? selected.payloadEn : selected?.payloadFr;

  const options = Array.isArray(activePayload?.options)
    ? (activePayload.options as Array<{ key: string; text: string; subtext?: string }>)
    : [];
  const correctKey = String(activePayload?.correctKey || '');
  const explanation = activePayload?.explanation as
    | {
        mainReason?: string;
        traps?: Array<{ key: string; reason: string }>;
        officialDocUrl?: string;
        officialDocTitle?: string;
      }
    | undefined;

  const absolutes = selected ? detectProblematicAbsolutes(JSON.stringify(selected.payloadFr)) : [];

  const handleSelectQuestion = (id: string) => {
    setActiveId(id);
    setSimulatedKey(null);
    setSimulatedRevealed(false);
  };

  const handleAuditQuestion = async (includeAi: boolean) => {
    if (!selected) return;
    setAuditing(true);
    try {
      await runAuditScope({
        scopeType: 'single',
        scopeLabel: `Audit QCM : ${selected.id}`,
        targetIds: [selected.id],
        includeAi,
        locale: 'fr',
      });
      onNotify(`Audit ${includeAi ? 'IA + règles' : 'déterministe'} exécuté sur ${selected.id}.`, 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur audit QCM', 'error');
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left list of MCQs & Exam Questions */}
      <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-[#242b3d]">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Questions & QCM ({quizItems.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Vérification des distracteurs, justifications, termes absolus et simulation en conditions apprenant sans altérer les scores.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#1e2436] max-h-[600px] overflow-y-auto">
          {quizItems.map((q) => {
            const isSelected = selected?.id === q.id;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => handleSelectQuestion(q.id)}
                className={`w-full text-left p-3.5 transition-colors ${
                  isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-950/30 border-l-4 border-blue-600'
                    : 'hover:bg-slate-50 dark:hover:bg-[#181e2f]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {q.id} • {q.certificationCode}
                  </span>
                  <span className="text-slate-400">
                    {q.openFindingsCount > 0 ? `${q.openFindingsCount} anomalie(s)` : '0 anomalie'}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1 line-clamp-2">
                  {q.title}
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <ValidationBadge item={q} />
                  <span className="text-[10px] font-mono text-slate-400">
                    {q.localeCoverage === 'fr_en' ? 'FR+EN' : 'FR seul'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Interactive Preview + Audit Workbench */}
      <div className="lg:col-span-7 space-y-4">
        {selected && activePayload ? (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-[#242b3d] pb-3">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Prévisualisation interactive apprenant (Sandbox isolée)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewLang((l) => (l === 'fr' ? 'en' : 'fr'));
                    setSimulatedKey(null);
                    setSimulatedRevealed(false);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#2a3146] text-xs font-mono inline-flex items-center gap-1"
                >
                  <Languages className="w-3.5 h-3.5" />
                  {previewLang.toUpperCase()}
                </button>
                <button
                  type="button"
                  disabled={auditing}
                  onClick={() => handleAuditQuestion(true)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Auditer IA
                </button>
                <button
                  type="button"
                  onClick={() => onInspectContent(selected.id)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#2a3146] text-xs inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Éditer
                </button>
                <button
                  type="button"
                  onClick={() => onGoToValidation(selected.id)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                >
                  Valider
                </button>
              </div>
            </div>

            {absolutes.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Termes absolus détectés :</strong>{' '}
                  {absolutes.map((a) => `« ${a.term} »`).join(', ')} — à relire pour éviter les sur-généralisations.
                </div>
              </div>
            )}

            {/* Simulated Scenario & Question */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#242b3d] space-y-3">
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {String(activePayload.scenario || '')}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {String(activePayload.question || '')}
              </div>

              <div className="space-y-2 pt-1">
                {options.map((opt) => {
                  const isPicked = simulatedKey === opt.key;
                  const isCorrect = opt.key === correctKey;
                  let style =
                    'border-slate-200 dark:border-[#283044] bg-white dark:bg-[#141824] hover:border-blue-500';
                  if (simulatedRevealed) {
                    if (isCorrect) {
                      style = 'border-emerald-500 bg-emerald-500/10';
                    } else if (isPicked) {
                      style = 'border-rose-500 bg-rose-500/10';
                    }
                  } else if (isPicked) {
                    style = 'border-blue-500 bg-blue-500/10';
                  }

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={simulatedRevealed}
                      onClick={() => setSimulatedKey(opt.key)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${style}`}
                    >
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1e2436]">
                        {opt.key}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {opt.text}
                        </div>
                        {simulatedRevealed && opt.subtext && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{opt.subtext}</div>
                        )}
                      </div>
                      {simulatedRevealed && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      {simulatedRevealed && isPicked && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedKey(null);
                    setSimulatedRevealed(false);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Réinitialiser le test
                </button>
                <button
                  type="button"
                  disabled={!simulatedKey || simulatedRevealed}
                  onClick={() => setSimulatedRevealed(true)}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 disabled:opacity-40 text-white text-xs font-semibold"
                >
                  Tester la réponse (aucun score modifié)
                </button>
              </div>
            </div>

            {simulatedRevealed && (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-2">
                <div className="font-bold text-emerald-700 dark:text-emerald-300">
                  Correction officielle (Réponse {correctKey})
                </div>
                {explanation?.mainReason ? (
                  <p className="text-slate-700 dark:text-slate-200">{explanation.mainReason}</p>
                ) : (
                  <p className="text-amber-600 dark:text-amber-300">
                    Aucune justification structurée disponible pour cet élément (à enrichir).
                  </p>
                )}
              </div>
            )}

            {/* Side-by-side FR/EN comparator */}
            {selected.payloadEn && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-[#242b3d] text-[11px]">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f131d]">
                  <div className="font-mono font-bold text-slate-400 mb-1">FR — Question</div>
                  <div className="text-slate-800 dark:text-slate-200">
                    {String(selected.payloadFr.question || '')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f131d]">
                  <div className="font-mono font-bold text-slate-400 mb-1">EN — Question</div>
                  <div className="text-slate-800 dark:text-slate-200">
                    {String(selected.payloadEn.question || '')}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
