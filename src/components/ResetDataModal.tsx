import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Loader2,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import { useAccessibleModal } from '../hooks/useAccessibleModal';

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAfterReset?: () => void;
}

export const ResetDataModal: React.FC<ResetDataModalProps> = ({
  isOpen,
  onClose,
  onAfterReset,
}) => {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const isEn = i18n.language?.startsWith('en');
  const { user } = useAuth();
  const { globalMetrics, resetAllProgress } = useProgress();

  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const modalRef = useAccessibleModal({ isOpen, onClose });

  useEffect(() => {
    if (isOpen) {
      setIsResetting(false);
      setResetSuccess(false);
      setResetError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirmReset = async () => {
    setIsResetting(true);
    setResetError(null);
    try {
      await resetAllProgress();
      setResetSuccess(true);
      onAfterReset?.();
    } catch (err) {
      setResetError(
        err instanceof Error
          ? err.message
          : isEn
          ? 'Unable to reset remote data. Please check your connection and try again.'
          : 'Impossible de réinitialiser les données distantes. Vérifiez votre connexion et réessayez.'
      );
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        id="reset-data-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-data-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-[#151a26] text-slate-800 dark:text-slate-100 rounded-3xl border border-rose-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 dark:border-[#262a35] flex items-center justify-between gap-4 bg-rose-50/70 dark:bg-rose-950/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                {t('settings:resetData.badge', 'Zone de réinitialisation')}
              </span>
              <h2
                id="reset-data-modal-title"
                className="text-base sm:text-lg font-bold font-headline text-slate-900 dark:text-white truncate"
              >
                {t('settings:resetData.title', 'Remettre à zéro toutes les données')}
              </h2>
            </div>
          </div>

          <button
            id="reset-modal-close-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#262a35] transition-colors shrink-0"
            aria-label={t('common:actions.close', 'Fermer')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {resetSuccess ? (
            <div
              id="reset-modal-success-banner"
              className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('settings:resetData.successTitle', 'Remise à zéro effectuée')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t(
                  'settings:resetData.successDesc',
                  'Toutes vos données d’apprentissage locales et synchronisées ont été remises à 0. Vous repartez sur un environnement vierge.'
                )}
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  {t(
                    'settings:resetData.warning',
                    'Cette action est définitive : elle supprime l’ensemble de votre historique d’étude enregistré sur cet appareil et sur votre compte Cloud Firestore.'
                  )}
                </p>
              </div>

              {/* Current live inventory before wipe */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="font-bold uppercase tracking-wider">
                    {t('settings:resetData.currentDataTitle', 'Données actuellement stockées')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-blue-500">
                    <Database className="w-3.5 h-3.5" />
                    {user
                      ? isEn
                        ? 'Local + Firestore'
                        : 'Local + Firestore'
                      : isEn
                      ? 'Browser LocalStorage'
                      : 'Stockage local'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35]">
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      {globalMetrics.cardsReviewedTotal}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {t('settings:resetData.cardsLabel', 'Fiches SM-2')}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35]">
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      {globalMetrics.quizSolvedCount}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {t('settings:resetData.quizzesLabel', 'QCM validés')}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35]">
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      {globalMetrics.examAttemptsCount}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {t('settings:resetData.examsLabel', 'Examens blancs')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact scope */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="font-bold text-slate-900 dark:text-white">
                  {t('settings:resetData.scopeTitle', 'Éléments remis à zéro :')}
                </div>
                <ul className="space-y-1.5 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>
                      {t(
                        'settings:resetData.scope1',
                        'Toutes les révisions de flashcards SM-2, notions fragiles, favoris et positions de cartes.'
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>
                      {t(
                        'settings:resetData.scope2',
                        'Tous les QCM validés et l’historique complet des examens blancs.'
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>
                      {t(
                        'settings:resetData.scope3',
                        'Compteurs globaux (série, score moyen, indice de préparation), favoris du glossaire et profil d’orientation.'
                      )}
                    </span>
                  </li>
                </ul>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  {t(
                    'settings:resetData.preservedNote',
                    'Votre langue, votre thème visuel et votre connexion restent inchangés.'
                  )}
                </p>
              </div>

              {resetError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
                  {resetError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-[#262a35] bg-slate-50 dark:bg-[#0f131d]/60 flex items-center justify-end gap-2.5">
          {resetSuccess ? (
            <button
              id="reset-modal-done-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-colors"
            >
              {t('common:actions.close', 'Fermer')}
            </button>
          ) : (
            <>
              <button
                id="reset-modal-cancel-btn"
                type="button"
                disabled={isResetting}
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-[#1c2233] dark:hover:bg-[#252d42] text-slate-800 dark:text-slate-200 font-mono text-xs font-bold transition-colors disabled:opacity-50"
              >
                {t('common:actions.cancel', 'Annuler')}
              </button>
              <button
                id="reset-modal-confirm-btn"
                type="button"
                disabled={isResetting}
                onClick={handleConfirmReset}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white font-mono text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shadow-rose-600/25"
              >
                {isResetting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>
                  {isResetting
                    ? t('settings:resetData.resetting', 'Remise à zéro...')
                    : t('settings:resetData.confirmBtn', 'Confirmer la remise à zéro')}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
