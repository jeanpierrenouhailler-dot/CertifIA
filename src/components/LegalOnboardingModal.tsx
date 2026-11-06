import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Scale, 
  HelpCircle, 
  Sparkles, 
  Brain, 
  Compass, 
  Clock, 
  ArrowRight, 
  Check, 
  FileText,
  AlertTriangle,
  X
} from 'lucide-react';
import { useGuide } from '../context/GuideContext';
import { useTranslation } from '../i18n';

interface LegalOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  isMandatoryFirstTime?: boolean;
}

export const LegalOnboardingModal: React.FC<LegalOnboardingModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  isMandatoryFirstTime = false,
}) => {
  const { isGuideModeActive, setGuideMode } = useGuide();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'legal' | 'guide'>('legal');
  const [enableGuide, setEnableGuide] = useState(isGuideModeActive);
  const { t, i18n } = useTranslation(['settings', 'common']);
  const isEn = i18n.language === 'en';

  if (!isOpen) return null;

  const handleFinish = () => {
    if (!hasAgreed && isMandatoryFirstTime) return;
    setGuideMode(enableGuide);
    onAccept();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#151a26] text-slate-800 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-blue-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-[#262a35] flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#0f131d]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {t('settings:legal.badge', 'Cadre Légal & Pédagogique')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  {isEn ? 'Important' : 'Important'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-headline text-slate-900 dark:text-white mt-0.5">
                {t('settings:legal.title', 'Cadre Légal & Pédagogique CertifIA')}
              </h2>
            </div>
          </div>

          {!isMandatoryFirstTime && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#262a35] transition-colors"
              aria-label={t('common:actions.close')}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-100 dark:border-[#262a35] px-6 bg-slate-50/50 dark:bg-[#0f131d]/30 text-xs font-mono">
          <button
            onClick={() => setActiveTab('legal')}
            className={`py-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'legal'
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t('settings:legal.tabLegal', 'Mentions Légales & Décharge')}</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('settings:legal.tabGuide', 'Guide Pédagogique Novice')}</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'legal' ? (
            <div className="space-y-4 text-xs">
              {/* Prominent Disclaimer Box Requested by User */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold font-headline text-sm text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{isEn ? 'Strict Disclaimer Notice (Liability Exemption)' : 'Exonération de Responsabilité (Avertissement Strict)'}</span>
                </div>
                <p className="leading-relaxed text-[11px] sm:text-xs">
                  {t('settings:legal.disclaimerText')}
                </p>
              </div>

              <div className="space-y-3 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    {isEn ? '1. Purely Educational Nature & Independence' : '1. Nature purement pédagogique & Indépendance'}
                  </h4>
                  <p>
                    {isEn 
                      ? 'CertifIA is an independent cognitive training platform. CertifIA is in no way affiliated, sponsored, certified, or endorsed by Microsoft®, Amazon Web Services®, Google Cloud®, IBM®, NVIDIA® or any other official certification body. All trademarks mentioned remain the exclusive property of their respective holders.'
                      : 'CertifIA est un outil technologique d\'entraînement cognitif indépendant. CertifIA n\'est en aucun cas affilié, sponsorisé, certifié ni validé par Microsoft®, Amazon Web Services®, Google Cloud®, IBM®, NVIDIA® ou tout autre organisme officiel d\'accréditation. Les marques citées demeurent la propriété exclusive de leurs détenteurs respectifs.'
                    }
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    {isEn ? '2. No Exam Guarantee' : '2. Absence de garantie d\'examen'}
                  </h4>
                  <p>
                    {isEn
                      ? 'Simulated scores, readiness indicators, and spaced repetition curves (SM-2 / FSRS) are purely indicative and do not guarantee success on real certification exams. Learners should always cross-reference official vendor documentation.'
                      : 'Les scores, taux de réussite simulés, indices de préparation et prédictions de courbes d\'oubli (algorithmes SM-2 / FSRS) sont purement indicatifs et ne constituent en aucun cas une garantie de réussite aux examens réels. L\'utilisateur est invité à toujours confronter ses connaissances aux documentations officielles des fournisseurs de cloud.'
                    }
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    {isEn ? '3. Personal Data & Privacy' : '3. Données personnelles & Confidentialité'}
                  </h4>
                  <p>
                    {isEn
                      ? 'Your learning progress is stored locally in your browser and synced securely via Firebase when logged in. No personal data is commercialized or transferred to third parties.'
                      : 'Votre progression (cartes révisées, scores) est stockée localement sur votre terminal et synchronisée de manière sécurisée si vous activez un compte Firebase. Aucune donnée personnelle n\'est commercialisée.'
                    }
                  </p>
                </div>
              </div>

              {/* Mandatory acceptance checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasAgreed}
                  onChange={(e) => setHasAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
                />
                <span className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                  <strong>{isEn ? 'I have read, understood, and accept' : 'J\'ai lu, compris et j\'accepte'}</strong> {isEn ? 'the legal notices, disclaimer, and educational terms of use of CertifIA.' : 'les mentions légales, la clause d\'exonération de responsabilité et les conditions d\'utilisation pédagogique de CertifIA.'}
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {isEn 
                  ? 'CertifIA is designed to guide every learner, from complete beginners to senior engineers, across 4 learning pillars:'
                  : 'CertifIA a été conçu pour guider tout utilisateur, qu\'il soit débutant complet ou ingénieur confirmé, à travers 4 piliers d\'apprentissage :'
                }
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-1">
                  <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>1. {t('dashboard:dailySessionTitle', 'Session du Jour')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn 
                      ? 'CertifIA automatically selects your 17 due SRS cards, 8 weak topics, and 12 targeted exam questions according to the forgetting curve.'
                      : 'CertifIA sélectionne automatiquement vos 17 cartes à réviser, 8 notions fragiles et 12 questions cibles selon la courbe d\'oubli.'
                    }
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-1">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>2. {isEn ? '4-Level AI Pathways' : 'Parcours IA en 4 Niveaux'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn 
                      ? 'Tailored orientation based on role, budget, and time from Level 1 (Fundamentals) to Level 4 (MLOps).'
                      : 'Orientation sur-mesure selon votre métier, budget et temps disponible, du Niveau 1 (Fondations) au Niveau 4 (MLOps).'
                    }
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-1">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Brain className="w-4 h-4" />
                    <span>3. {isEn ? 'SM-2 SRS Flashcards' : 'Fiches Mémo SRS (SM-2)'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn 
                      ? 'Intelligent spaced repetition: rate each card (Again, Hard, Good, Easy) to schedule its next optimal review date.'
                      : 'Répétition espacée intelligente : évaluez chaque carte (À revoir, Difficile, Bien, Facile) pour programmer sa prochaine date.'
                    }
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-1">
                  <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>4. {t('examinations:title', 'Examens Blancs')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn 
                      ? 'Real timed examination conditions with 700/1000 passing threshold and domain mastery debriefing.'
                      : 'Conditions officielles chronométrées avec seuil éliminatoire (700/1000 pts) et débriefing par domaine.'
                    }
                  </p>
                </div>
              </div>

              {/* Novice mode toggle */}
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 dark:bg-[#1a2030] border border-slate-200 dark:border-blue-500/20 cursor-pointer select-none">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {t('settings:guideSection.title', 'Activer le Mode Guide Novice & Infobulles')}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {t('settings:guideSection.description')}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableGuide}
                  onChange={(e) => setEnableGuide(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-[#262a35] bg-slate-50 dark:bg-[#0f131d]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {hasAgreed ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" /> {isEn ? 'Terms accepted' : 'Mentions acceptées'}
              </span>
            ) : (
              <span>{isEn ? 'Please accept the disclaimer to continue' : 'Veuillez accepter les mentions pour continuer'}</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab === 'legal' ? (
              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#262a35] hover:bg-slate-100 dark:hover:bg-[#1c2233] text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
              >
                {isEn ? 'View Quick Guide →' : 'Voir le Guide Rapide →'}
              </button>
            ) : null}

            <button
              type="button"
              disabled={isMandatoryFirstTime && !hasAgreed}
              onClick={handleFinish}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>{isMandatoryFirstTime ? t('settings:legal.continue', 'Accéder à CertifIA') : t('common:actions.confirm', 'Valider & Fermer')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
