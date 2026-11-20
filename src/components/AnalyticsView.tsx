import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Flame, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  Brain, 
  FileText, 
  Zap, 
  X, 
  Database
} from 'lucide-react';
import { AppScreen, ExamSessionHistory, ExamAttemptRecord } from '../types';
import { CERTIFICATIONS_COUNT, normalizeCertId } from '../data/certificationsData';
import { getLocalizedCertifications } from '../data/localizedCertifications';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { useAccessibleModal } from '../hooks/useAccessibleModal';
import { PageHeader } from './ui/PageHeader';
import { InfoTooltip } from './InfoTooltip';
import { ScreenGuideBanner } from './ScreenGuideBanner';
import { useTranslation, getCurrentLanguage, formatLocalizedDate } from '../i18n';

interface AnalyticsViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (certId: string) => void;
  onOpenAIAssistant?: (context?: any) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onNavigate, onOpenBlueprint }) => {
  const { t } = useTranslation(['progress', 'common', 'navigation']);
  const lang = getCurrentLanguage();
  const isEn = lang === 'en';
  const { 
    certProgress, 
    examAttempts, 
    quizAttempts,
    globalMetrics,
    getCertMetrics,
    getCertStats, 
    activeCertId, 
    updateGoalTarget,
    isSyncing 
  } = useProgress();
  const { user, isFirebaseConnected } = useAuth();

  const localizedCerts = useMemo(() => getLocalizedCertifications(lang), [lang]);
  const [selectedTargetExam, setSelectedTargetExam] = useState<string>(() => normalizeCertId(activeCertId));
  const [selectedReport, setSelectedReport] = useState<ExamSessionHistory | null>(null);
  const [isCopilotTestGenerated, setIsCopilotTestGenerated] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'certifications' | 'examens' | 'flashcards' | 'objectifs'>('certifications');

  useEffect(() => {
    setSelectedTargetExam(normalizeCertId(activeCertId));
  }, [activeCertId]);

  const reportModalRef = useAccessibleModal<HTMLDivElement>({
    isOpen: Boolean(selectedReport),
    onClose: () => setSelectedReport(null),
  });

  const activeCert = localizedCerts.find((c) => c.id === selectedTargetExam) || localizedCerts[0];
  const certMetrics = getCertMetrics(selectedTargetExam);
  const activeStats = getCertStats(selectedTargetExam);

  const avgScaledScore = certMetrics.exams.attemptCount > 0
    ? Math.round((certMetrics.exams.averagePct / 100) * activeCert.maxScore)
    : 0;
  const passThresholdPct = activeCert.maxScore > 0
    ? Math.round((activeCert.passScore / activeCert.maxScore) * 100)
    : 70;
  const scoreMargin = certMetrics.exams.attemptCount > 0 ? avgScaledScore - activeCert.passScore : 0;

  const wrongQuizCountForCert = useMemo(() => {
    return Object.values(quizAttempts).filter(
      (q) => normalizeCertId(q.certId || q.certCode) === selectedTargetExam && !q.isCorrect
    ).length;
  }, [quizAttempts, selectedTargetExam]);

  const weakestEvaluatedDomain = useMemo(() => {
    const evaluated = certMetrics.domains.filter((d) => d.reviewedCards > 0);
    if (evaluated.length === 0) return null;
    return [...evaluated].sort((a, b) => a.mastery - b.mastery)[0];
  }, [certMetrics.domains]);

  // Chronological attempts (oldest -> newest) for trajectory SVG
  const trajectoryAttempts = useMemo(() => {
    return [...examAttempts]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(-6);
  }, [examAttempts]);

  const handleTargetChange = (newTarget: string) => {
    const canonical = normalizeCertId(newTarget);
    setSelectedTargetExam(canonical);
    const found = localizedCerts.find((c) => c.id === canonical);
    if (found) {
      updateGoalTarget(canonical, found.title);
    }
  };

  const handleOpenAttemptReport = (attempt: ExamAttemptRecord) => {
    let domainScores: { name: string; score: number }[] = [];
    if (attempt.domainScoresSummary) {
      try {
        const parsed = JSON.parse(attempt.domainScoresSummary);
        domainScores = Object.entries(parsed).map(([k, v]) => ({ name: k, score: Number(v) }));
      } catch {
        domainScores = [{
          name: attempt.examCode,
          score: attempt.maxScore > 0 ? Math.round((attempt.score / attempt.maxScore) * 100) : 0,
        }];
      }
    } else {
      domainScores = [{
        name: attempt.examCode,
        score: attempt.maxScore > 0 ? Math.round((attempt.score / attempt.maxScore) * 100) : 0,
      }];
    }

    const report: ExamSessionHistory = {
      id: `${isEn ? 'Attempt' : 'Tentative'} #${attempt.attemptNumber} (${attempt.examCode})`,
      date: formatLocalizedDate(new Date(attempt.createdAt), {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }, lang),
      duration: attempt.duration,
      weakPoint: attempt.weakPoint,
      weakPointSeverity: attempt.passed ? 'medium' : 'high',
      score: attempt.score,
      maxScore: attempt.maxScore,
      passed: attempt.passed,
      domainScores,
      recommendation: attempt.passed
        ? (isEn
            ? 'Exam successfully validated! Concentrate your revisions on the identified weak points to secure a solid buffer.'
            : 'Examen validé avec succès ! Concentrez vos révisions sur les concepts identifiés comme point faible pour garantir une marge de sécurité maximale.')
        : (isEn
            ? 'Score below the required passing threshold (700/1000). Review flashcards in your weak category before starting another trial.'
            : 'Score en deçà du seuil d\'admission (700/1000). Révisez les flashcards de la catégorie faible avant de tenter une nouvelle simulation.'),
    };

    setSelectedReport(report);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Standard Page Header */}
      <PageHeader
        title={t('progress:title')}
        subtitle={t('progress:subtitle')}
        badge={t('progress:analytics.breadcrumb')}
        breadcrumbs={[
          { label: t('navigation:items.today.label'), onClick: () => onNavigate('today') },
          { label: t('navigation:categories.progression.label'), active: true },
          { label: t('progress:analytics.breadcrumb'), active: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border ${
              user && isFirebaseConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-slate-800/60 text-slate-300 border-slate-700'
            }`}>
              <Database className={`w-3.5 h-3.5 ${user && isFirebaseConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
              {isSyncing
                ? 'Sync...'
                : user && isFirebaseConnected
                ? (isEn ? 'Firestore Connected' : 'Firestore Connecté')
                : (isEn ? 'Local mode (Guest / Offline)' : 'Mode local (Invité / Hors ligne)')}
            </span>
          </div>
        }
      />

      <ScreenGuideBanner screenKey="analytics" />

      {/* Rigueur Méthodologique / Pas de fausse garantie */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t('progress:disclaimer')}
        </p>
      </div>

        {/* Target Selector Bar */}
        <div className="flex flex-wrap items-center gap-3 p-2 rounded-2xl bg-[#171b26] border border-[#262a35]">
          <div className="text-xs text-slate-400 pl-2 font-mono inline-flex items-center gap-1.5">
            {t('progress:analytics.selectCert')}
            <InfoTooltip
              title={isEn ? 'Certification Analytics Filter' : 'Sélecteur d’Analytics par Certification'}
              content={isEn
                ? 'Switch certification to inspect its readiness index, SM-2 card retention buckets, and mock exam reports.'
                : 'Changez de certification pour analyser son indice de préparation, la rétention SM-2 et vos rapports d’examens blancs.'}
            />
          </div>
          <select
            value={selectedTargetExam}
            onChange={(e) => handleTargetChange(e.target.value)}
            aria-label={t('progress:analytics.selectCert')}
            className="bg-[#0f131d] border border-[#262a35] text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-mono"
          >
            {localizedCerts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} • {c.title} ({certProgress[c.id]?.progress ?? 0}%)
              </option>
            ))}
          </select>
          <button
            onClick={() => onOpenBlueprint && onOpenBlueprint(selectedTargetExam)}
            className="px-3 py-2 rounded-xl bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-colors"
          >
            Blueprint
          </button>
        </div>

      {/* Structured Progress Tree Overview (Requested Architecture) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#171b26] via-[#121622] to-[#0f131d] border border-[#262a35] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-base font-bold text-white font-headline">
                {lang === 'en' ? 'Progress Architecture & User Persistence' : 'Architecture de Progression & Persistance Utilisateur'}
              </h2>
              <InfoTooltip
                title={lang === 'en' ? 'Readiness & SM-2 Buckets' : 'Préparation & Rétention SM-2'}
                content={lang === 'en'
                  ? 'Combines your mock exam scores, MCQ accuracy, and SM-2 card intervals (Mastered ≥ 7 days vs Review = 1 day) into an indicative readiness score.'
                  : 'Agrège vos examens blancs, scores QCM et échéances SM-2 (Maîtrisées ≥ 7j vs À revoir = 1j) pour calculer un indice indicatif de préparation.'}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Structure de données Firestore temps réel : /users/{user?.uid ? user.uid.substring(0, 10) + '...' : 'invité'}
            </p>
          </div>

          {/* Navigation Segments */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#0a0e18] border border-[#262a35] text-xs font-mono">
            <button
              onClick={() => setActiveTabSection('certifications')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabSection === 'certifications'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('progress:analytics.tabCerts')}
            </button>
            <button
              onClick={() => setActiveTabSection('examens')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabSection === 'examens'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('progress:analytics.tabExams')} ({examAttempts.length})
            </button>
            <button
              onClick={() => setActiveTabSection('flashcards')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabSection === 'flashcards'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('progress:analytics.tabFlashcards')}
            </button>
            <button
              onClick={() => setActiveTabSection('objectifs')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabSection === 'objectifs'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('progress:analytics.tabGoals')}
            </button>
          </div>
        </div>

        {/* Tab 1: Certifications Matrix */}
        {activeTabSection === 'certifications' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-xs text-slate-300 font-mono flex items-center justify-between">
              <span>{t('progress:analytics.certMatrixPrompt')}</span>
              <span className="text-blue-400">{t('progress:analytics.certMatrixSubprompt')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localizedCerts.map((c) => {
                const prog = certProgress[c.id] || { progress: 0, score: 0, readinessIndex: 0 };
                const isCurrent = selectedTargetExam === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => handleTargetChange(c.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-950/50 ring-1 ring-blue-500/40'
                        : 'bg-[#171b26]/70 border-[#262a35] hover:border-[#3b4354]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                        {c.code}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        {t('progress:analytics.completedPct', { pct: prog.progress })}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white line-clamp-1">
                      {c.title}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden mt-3">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${prog.progress}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#262a35] text-[11px] font-mono">
                      <div>
                        <span className="text-slate-400">{isEn ? 'Avg accuracy:' : 'Score moyen :'}</span>
                        <div className="font-bold text-white mt-0.5">{prog.score > 0 ? `${prog.score}%` : '—'}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">{isEn ? 'Domains:' : 'Domaines :'}</span>
                        <div className="font-bold text-blue-300 mt-0.5">{c.domains.length} modules</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Exam Simulations History */}
        {activeTabSection === 'examens' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>{isEn ? 'Recorded mock exam attempts:' : 'Tentatives d’examens blancs enregistrées :'}</span>
              <button
                onClick={() => onNavigate('exam')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>{isEn ? 'Start a new attempt' : 'Lancer une nouvelle tentative'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {examAttempts.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#0f131d] border border-dashed border-[#262a35] text-center space-y-3">
                <p className="text-xs text-slate-400">
                  {isEn
                    ? 'No mock exam attempt has been completed yet. Complete a timed simulation to populate your official score history.'
                    : 'Aucune simulation d’examen blanc n’a encore été terminée. Complétez une simulation chronométrée pour alimenter votre historique réel.'}
                </p>
                <button
                  onClick={() => onNavigate('exam')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <span>{isEn ? 'Launch mock exam' : 'Démarrer un examen blanc'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {examAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    onClick={() => handleOpenAttemptReport(attempt)}
                    className="p-4 rounded-xl bg-[#0f131d] border border-[#262a35] hover:border-blue-500/50 cursor-pointer transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                        {t('progress:attemptNumber', { number: attempt.attemptNumber })}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          attempt.passed
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {attempt.passed ? t('progress:analytics.passedStatus') : t('progress:analytics.failedStatus')}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-slate-400">{attempt.examCode}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{attempt.examTitle}</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#171b26] flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{isEn ? 'Final score:' : 'Score final :'}</span>
                      <span className="text-base font-bold text-emerald-400">{attempt.score} / {attempt.maxScore}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                      <span>{isEn ? 'Duration:' : 'Durée :'} {attempt.duration}</span>
                      <span>{formatLocalizedDate(attempt.createdAt, { day: '2-digit', month: 'short', year: 'numeric' }, lang)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Flashcards Retention SRS */}
        {activeTabSection === 'flashcards' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>Répartition de rétention mémoire SM-2 pour {activeCert.code} :</span>
              <button
                onClick={() => onNavigate('flashcards')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Accéder aux fiches mémo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Maîtrisées */}
              <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                    1. Maîtrisées
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-white">
                  {activeStats.maitriseCount} <span className="text-xs font-normal text-slate-400">cartes</span>
                </div>
                <p className="text-xs text-slate-300">
                  Intervalle d'échéance SRS ≥ 7 jours. Concepts ancrés en mémoire profonde.
                </p>
              </div>

              {/* À revoir */}
              <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-rose-400 font-bold">
                    2. À revoir
                  </span>
                  <Clock className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-white">
                  {activeStats.revoirCount} <span className="text-xs font-normal text-slate-400">cartes</span>
                </div>
                <p className="text-xs text-slate-300">
                  Intervalle d'échéance 1 jour. À re-tester sous 24h pour contrer l'oubli.
                </p>
              </div>

              {/* Difficiles */}
              <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                    3. Difficiles
                  </span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-white">
                  {activeStats.moyenCount} <span className="text-xs font-normal text-slate-400">cartes</span>
                </div>
                <p className="text-xs text-slate-300">
                  Intervalle 3 jours. Concepts nécessitant une consolidation active.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Study Goals */}
        {activeTabSection === 'objectifs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200 text-xs">
            <div className="p-4 rounded-xl bg-[#0f131d] border border-[#262a35] space-y-2">
              <span className="text-slate-400 font-mono">{isEn ? 'Priority Certification' : 'Certification Prioritaire'}</span>
              <div className="text-sm font-bold text-white">{activeCert.title}</div>
              <div className="text-[11px] font-mono text-blue-400">Code : {activeCert.code} · {CERTIFICATIONS_COUNT} certifs</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0f131d] border border-[#262a35] space-y-2">
              <span className="text-slate-400 font-mono">{isEn ? 'Study Streak' : 'Série & Constance'}</span>
              <div className="text-2xl font-bold font-mono text-amber-400 flex items-center gap-1.5">
                <span>{globalMetrics.streakDays} {isEn ? 'days' : 'jours'}</span>
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
              <div className="text-[11px] text-slate-400">
                {globalMetrics.streakDays === 0
                  ? (isEn ? 'Start a session today to launch your streak' : 'Complétez une activité aujourd’hui pour démarrer votre série')
                  : (isEn ? 'Computed from real activity timestamps' : 'Calculé depuis vos jours actifs réels')}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0f131d] border border-[#262a35] space-y-2">
              <span className="text-slate-400 font-mono">{isEn ? 'Validated Volume' : 'Volume de validation'}</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {globalMetrics.questionsSolved} {isEn ? 'items' : 'qcm'}
              </div>
              <div className="text-[11px] text-slate-400">
                {globalMetrics.cardsReviewedTotal} {isEn ? 'flashcards reviewed across catalog' : 'flashcards révisées toutes certifs'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Cardinal KPI Cards */}
      <div data-tour="analytics-score" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Indice Préparation Globale */}
        <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {isEn ? 'Readiness Index' : 'Indice Préparation'}
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">{certMetrics.readinessIndex}%</div>
            <div className={`text-xs font-semibold mt-0.5 flex items-center gap-1 ${
              certMetrics.readinessIndex >= 70 ? 'text-emerald-400' : certMetrics.readinessIndex > 0 ? 'text-blue-400' : 'text-slate-400'
            }`}>
              <span>
                {certMetrics.readinessIndex === 0
                  ? (isEn ? 'No data yet' : 'Aucune activité')
                  : certMetrics.readinessIndex >= 70
                  ? (isEn ? 'Target reached' : 'Seuil atteint')
                  : (isEn ? 'In progress' : 'En progression')}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2">
              {certMetrics.readinessIndex >= 70
                ? (isEn ? 'Indicative threshold (70%) reached' : 'Seuil indicatif (70%) atteint')
                : (isEn ? 'Weighted across exams, MCQs & SRS' : 'Pondéré examens, QCM et rétention SRS')}
            </div>
          </div>
          {/* Circular progress ring */}
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" stroke="#0a0e18" strokeWidth="6" fill="none" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#4edea3"
                strokeWidth="6"
                strokeDasharray="163.36"
                strokeDashoffset={163.36 * (1 - certMetrics.readinessIndex / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white">
              {certMetrics.readinessIndex}%
            </span>
          </div>
        </div>

        {/* KPI 2: Score Moyen Examens */}
        <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <span>{isEn ? 'Avg Exam Score' : 'Score Moyen'}</span>
              {certMetrics.exams.attemptCount > 0 ? (
                <span className={`font-bold ${avgScaledScore >= activeCert.passScore ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {avgScaledScore >= activeCert.passScore ? 'PASS ✓' : `${certMetrics.exams.attemptCount} ${isEn ? 'try' : 'essai(s)'}`}
                </span>
              ) : (
                <span className="text-slate-500 font-mono">—</span>
              )}
            </div>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
              {avgScaledScore} <span className="text-sm font-normal text-slate-400">/ {activeCert.maxScore}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-[#0a0e18] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${certMetrics.exams.attemptCount > 0 ? certMetrics.exams.averagePct : 0}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-400"
                style={{ left: `${passThresholdPct}%` }}
                title={`${isEn ? 'Threshold' : 'Seuil'} ${activeCert.passScore} pts`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5">
              <span>Cutoff {activeCert.passScore} pts</span>
              <span className={scoreMargin >= 0 && certMetrics.exams.attemptCount > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                {certMetrics.exams.attemptCount === 0
                  ? (isEn ? 'No attempt yet' : 'Aucune tentative')
                  : `${scoreMargin >= 0 ? '+' : ''}${scoreMargin} pts ${isEn ? 'margin' : 'marge'}`}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Volume Traité & Précision */}
        <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {isEn ? 'Solved Questions' : 'Volume Traité'}
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {globalMetrics.questionsSolved} <span className="text-xs font-normal text-slate-400">questions</span>
            </div>
            <div className="text-xs text-blue-300 font-mono mt-0.5">
              {isEn ? 'Global accuracy:' : 'Précision globale :'} {globalMetrics.questionsSolved > 0 ? `${globalMetrics.averageScore}%` : '—'}
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            {certMetrics.flashcards.reviewedCount} / {certMetrics.flashcards.deckSize} {isEn ? 'cards reviewed' : 'fiches révisées'} ({activeCert.code})
          </div>
        </div>

        {/* KPI 4: Discipline & Mémorisation */}
        <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {isEn ? 'Streak & Retention' : 'Discipline & Rétention'}
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1 flex items-center gap-2">
              {globalMetrics.streakDays} {isEn ? 'days' : 'jours'} <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-0.5">
              {certMetrics.flashcards.retentionRate}% {isEn ? 'SRS retention' : 'rétention active'}
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            {certMetrics.flashcards.masteredCount} {isEn ? 'mastered cards (≥ 7d)' : 'fiches consolidées (≥ 7j)'}
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Domain Mapping & Critical Weak Points (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Domain Breakdown Card */}
          <div className="p-6 rounded-2xl bg-[#171b26] border border-[#262a35] shadow-xl space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-base font-bold text-white font-headline">
                  {isEn ? 'Domain Breakdown & Gap Diagnostics' : 'Cartographie des Domaines & Diagnostic des Lacunes'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEn ? 'Real SRS mastery across blueprint sections for' : 'Analyse réelle par section du blueprint officiel'} {activeCert.code}
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {certMetrics.domains.length} {isEn ? 'Blueprint Domains' : 'Domaines Évalués'}
              </span>
            </div>

            {/* Domains List */}
            <div className="space-y-4">
              {certMetrics.domains.map((dom, idx) => {
                const isEvaluated = dom.reviewedCards > 0;
                const isCriticalWeak = isEvaluated && dom.mastery < 60;
                const isWarning = isEvaluated && dom.mastery >= 60 && dom.mastery < 70;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isCriticalWeak
                        ? 'bg-rose-950/15 border-rose-500/30'
                        : isWarning
                        ? 'bg-amber-950/10 border-amber-500/20'
                        : 'bg-[#0f131d]/60 border-[#262a35]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white font-headline">
                          {dom.name}
                        </span>
                        {!isEvaluated && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            {isEn ? 'Not started' : 'Non évalué'}
                          </span>
                        )}
                        {isCriticalWeak && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                            {isEn ? 'Weak Point' : 'Point Faible'}
                          </span>
                        )}
                        {isWarning && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                            {isEn ? 'Needs Review' : 'À Renforcer'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {dom.mastery}% · {dom.reviewedCards}/{dom.totalCards} {isEn ? 'cards' : 'fiches'} ({dom.weight})
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#171b26] rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${dom.mastery}%`,
                          backgroundColor:
                            dom.mastery >= 75
                              ? '#4edea3'
                              : dom.mastery >= 60
                              ? '#adc6ff'
                              : dom.mastery > 0
                              ? '#ffb4ab'
                              : '#334155',
                        }}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <p className="text-slate-400 text-[11px] leading-relaxed max-w-xl">
                        {dom.description}
                      </p>

                      {(isCriticalWeak || isWarning) && (
                        <button
                          onClick={() => onNavigate('flashcards')}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold whitespace-nowrap transition-colors ${
                            isCriticalWeak
                              ? 'bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border-rose-500/30'
                              : 'bg-amber-600/20 text-amber-300 hover:bg-amber-600 hover:text-white border-amber-500/30'
                          }`}
                        >
                          {isEn ? 'Practice this domain' : 'Réviser ce domaine'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3 Secondary Telemetry Blocks (100% real data) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35]">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                {isEn ? 'Fragile Flashcards' : 'Fiches à renforcer'}
              </div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {certMetrics.flashcards.fragileCount} {isEn ? 'cards' : 'fiches'}
              </div>
              <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                {certMetrics.flashcards.dueCount} {isEn ? 'SRS due today' : 'dues SM-2 aujourd’hui'}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35]">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                {isEn ? 'Incorrect MCQs' : 'QCM à retravailler'}
              </div>
              <div className="text-lg font-bold font-mono text-amber-400 mt-1">
                {wrongQuizCountForCert} {isEn ? 'questions' : 'questions'}
              </div>
              <div 
                onClick={() => onNavigate('quiz')}
                className="text-[10px] text-blue-400 hover:underline cursor-pointer font-mono mt-0.5"
              >
                {isEn ? 'Open MCQ practice →' : 'Ouvrir l’entraînement QCM →'}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35]">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                {isEn ? 'Deck Coverage' : 'Couverture du deck'}
              </div>
              <div className="text-lg font-bold font-mono text-blue-400 mt-1">
                {certMetrics.flashcards.deckCoveragePct}%
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {certMetrics.flashcards.reviewedCount} / {certMetrics.flashcards.deckSize} {activeCert.code}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic CertifIA Action Plan (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1c2438] to-[#171b26] border border-blue-500/30 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <h3 className="text-sm font-bold text-white font-headline">
                  {isEn ? 'CertifIA Study Plan' : 'Plan d’action CertifIA'}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">
                {activeCert.code}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isEn
                ? `Prioritized next actions calculated from your live ${activeCert.code} telemetry:`
                : `Prochaines actions priorisées à partir de vos résultats réels sur ${activeCert.code} :`}
            </p>

            {/* Action Items List */}
            <div className="space-y-3">
              {/* Item 1 */}
              <div className="p-3.5 rounded-xl bg-[#0f131d] border border-[#262a35] hover:border-blue-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white">{isEn ? 'Priority #1 · Weakest Domain' : 'Priorité #1 · Domaine ciblé'}</span>
                  <span className="font-mono text-blue-400 text-[11px] font-bold">
                    {weakestEvaluatedDomain ? `${weakestEvaluatedDomain.mastery}%` : '0%'}
                  </span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {weakestEvaluatedDomain
                    ? `${weakestEvaluatedDomain.name} (${weakestEvaluatedDomain.fragileCards} ${isEn ? 'fragile cards' : 'fiches fragiles'})`
                    : (isEn
                        ? `Start exploring ${activeCert.domains[0]?.name || activeCert.code} scenario questions.`
                        : `Démarrez l’entraînement QCM sur ${activeCert.domains[0]?.name || activeCert.code}.`)}
                </div>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="mt-2.5 w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm"
                >
                  {isEn ? 'Practice targeted MCQs' : 'Démarrer série QCM'}
                </button>
              </div>

              {/* Item 2 */}
              <div className="p-3.5 rounded-xl bg-[#0f131d] border border-[#262a35] hover:border-blue-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white">{isEn ? 'SRS Queue #2' : 'Échéance SRS #2'}</span>
                  <span className="font-mono text-amber-400 text-[11px] font-bold">
                    {certMetrics.flashcards.dueCount} {isEn ? 'due' : 'dues'}
                  </span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {certMetrics.flashcards.dueCount > 0
                    ? (isEn
                        ? `${certMetrics.flashcards.dueCount} reviewed card(s) have reached their SM-2 review interval today.`
                        : `${certMetrics.flashcards.dueCount} fiche(s) révisée(s) arrivent à échéance SM-2 aujourd’hui.`)
                    : (isEn
                        ? `${certMetrics.flashcards.unreviewedCount} new cards available in ${activeCert.code} deck (${certMetrics.flashcards.deckSize} total).`
                        : `${certMetrics.flashcards.unreviewedCount} nouvelles fiches disponibles sur ${activeCert.code} (${certMetrics.flashcards.deckSize} au total).`)}
                </div>
                <button
                  onClick={() => onNavigate('flashcards')}
                  className="mt-2.5 w-full py-1.5 rounded-lg bg-[#171b26] hover:bg-[#262a35] border border-[#262a35] text-slate-200 hover:text-white text-xs font-semibold transition-all"
                >
                  {certMetrics.flashcards.dueCount > 0
                    ? (isEn ? `Review ${certMetrics.flashcards.dueCount} due cards` : `Réviser les ${certMetrics.flashcards.dueCount} fiches dues`)
                    : (isEn ? 'Open Flashcards deck' : 'Ouvrir le deck Flashcards')}
                </button>
              </div>

              {/* Item 3 */}
              <div className="p-3.5 rounded-xl bg-[#0f131d] border border-[#262a35] hover:border-blue-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white">{isEn ? 'Mock Exam #3' : 'Simulation #3'}</span>
                  <span className="font-mono text-emerald-400 text-[11px] font-bold">
                    {certMetrics.exams.attemptCount} {isEn ? 'runs' : 'essai(s)'}
                  </span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {isEn
                    ? `Timed exam simulation calibrated for ${activeCert.code} (official blueprint: ${activeCert.durationMinutes} min, ${activeCert.itemsCount} items).`
                    : `Simulation chronométrée sur ${activeCert.code} (référentiel officiel : ${activeCert.durationMinutes} min, ${activeCert.itemsCount} questions).`}
                </div>
                <button
                  onClick={() => onNavigate('exam')}
                  className="mt-2.5 w-full py-1.5 rounded-lg bg-[#171b26] hover:bg-[#262a35] border border-[#262a35] text-slate-200 hover:text-white text-xs font-semibold transition-all"
                >
                  {isEn ? 'Start simulation' : 'Démarrer la simulation'}
                </button>
              </div>
            </div>

            {/* Diagnostic Generator Shortcut */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs">
              <div className="font-semibold text-blue-300 mb-1 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-blue-400" />
                {isEn ? 'Targeted Practice Session' : 'Session QCM Ciblée'}
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                {t('progress:analytics.copilotDesc')}
              </p>
              <button
                onClick={() => {
                  setIsCopilotTestGenerated(true);
                  setTimeout(() => {
                    setIsCopilotTestGenerated(false);
                    onNavigate('quiz');
                  }, 300);
                }}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                {isCopilotTestGenerated ? (
                  <span>{t('progress:analytics.generatingTest')}</span>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>{t('progress:analytics.generateCustomTest')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Trajectory Curve & Exam History */}
      <div className="p-6 rounded-2xl bg-[#171b26] border border-[#262a35] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262a35]">
          <div>
            <h3 className="text-base font-bold text-white font-headline">
              {t('progress:analytics.examTrajectory')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('progress:analytics.examTrajectoryDesc')}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-0.5 bg-emerald-400" />
              {t('progress:analytics.passThreshold')}
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              {t('progress:analytics.yourScores')}
            </span>
          </div>
        </div>

        {/* Dynamic Progression Curve (plotted strictly from persisted examAttempts) */}
        <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35]">
          {trajectoryAttempts.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <TrendingUp className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {isEn
                  ? 'Your score progression curve will appear automatically after your first completed mock exam simulation.'
                  : 'Votre courbe d’évolution des scores s’affichera automatiquement dès votre première simulation d’examen blanc terminée.'}
              </p>
              <button
                onClick={() => onNavigate('exam')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <span>{isEn ? 'Take first mock exam' : 'Lancer un premier examen blanc'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <svg viewBox="0 0 600 180" className="w-full h-auto" role="img" aria-label={t('progress:analytics.examTrajectory')}>
              <defs>
                <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="45" y1="25" x2="560" y2="25" stroke="#1c1f2a" strokeWidth="1" strokeDasharray="3 3" />
              <text x="38" y="29" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">100%</text>

              <line x1="45" y1="64" x2="560" y2="64" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="38" y="67" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="monospace">70%</text>
              <text x="565" y="67" fill="#10b981" fontSize="8" textAnchor="start" fontFamily="monospace">PASS</text>

              <line x1="45" y1="115" x2="560" y2="115" stroke="#1c1f2a" strokeWidth="1" strokeDasharray="3 3" />
              <text x="38" y="119" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">30%</text>

              {(() => {
                const count = trajectoryAttempts.length;
                const points = trajectoryAttempts.map((att, idx) => {
                  const pct = att.maxScore > 0 ? Math.min(100, Math.max(0, (att.score / att.maxScore) * 100)) : 0;
                  const x = count === 1 ? 300 : 85 + (idx * (450 / (count - 1)));
                  const y = 155 - (pct / 100) * 130;
                  return { x, y, pct: Math.round(pct), att };
                });

                const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
                const areaPath = count > 1
                  ? `${linePath} L${points[points.length - 1].x.toFixed(1)},155 L${points[0].x.toFixed(1)},155 Z`
                  : '';

                return (
                  <>
                    {areaPath && <path d={areaPath} fill="url(#scoreArea)" />}
                    {count > 1 && (
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    {points.map((p) => (
                      <g key={p.att.id}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="5"
                          fill="#171b26"
                          stroke={p.att.passed ? '#10b981' : '#f43f5e'}
                          strokeWidth="2.5"
                        />
                        <text
                          x={p.x}
                          y={Math.max(14, p.y - 10)}
                          fill={p.att.passed ? '#10b981' : '#f43f5e'}
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {p.att.score} ({p.pct}%)
                        </text>
                        <text
                          x={p.x}
                          y="172"
                          fill="#94a3b8"
                          fontSize="8"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          #{p.att.attemptNumber} · {p.att.examCode}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          )}
        </div>

        {/* Detailed Session History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#262a35] text-slate-400 font-mono text-[10px] uppercase">
                <th className="pb-3 font-semibold">{t('progress:analytics.colId')}</th>
                <th className="pb-3 font-semibold">{t('progress:analytics.colDateTime')}</th>
                <th className="pb-3 font-semibold">{t('progress:analytics.colDuration')}</th>
                <th className="pb-3 font-semibold">{t('progress:analytics.colWeakPoint')}</th>
                <th className="pb-3 font-semibold text-right">{t('progress:analytics.colScore')}</th>
                <th className="pb-3 font-semibold text-center">{t('progress:analytics.colStatus')}</th>
                <th className="pb-3 font-semibold text-right">{t('progress:analytics.colAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a35]/60 font-sans">
              {examAttempts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-xs text-slate-500 font-mono">
                    {isEn ? 'No mock exam recorded yet.' : 'Aucun examen blanc enregistré pour le moment.'}
                  </td>
                </tr>
              ) : (
                examAttempts.map((item) => (
                  <tr key={item.id} className="hover:bg-[#0f131d]/50 transition-colors">
                    <td className="py-3 font-mono font-bold text-white">
                      <span className="text-blue-400 font-bold">{t('progress:attemptNumber', { number: item.attemptNumber })}</span>
                      <span className="ml-2 text-[10px] text-slate-400 font-mono">({item.examCode})</span>
                    </td>
                    <td className="py-3 text-slate-300 font-mono text-[11px]">
                      {formatLocalizedDate(item.createdAt, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }, lang)}
                    </td>
                    <td className="py-3 font-mono text-slate-400">
                      {item.duration}
                    </td>
                    <td className="py-3 text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className={`w-3.5 h-3.5 ${item.passed ? 'text-amber-400' : 'text-rose-400'}`} />
                        <span className="line-clamp-1">{item.weakPoint}</span>
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      {item.score} / {item.maxScore}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          item.passed
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {item.passed ? t('progress:analytics.passedStatus') : t('progress:analytics.failedStatus')}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleOpenAttemptReport(item)}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {t('progress:analytics.detailedReport')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Session Report Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedReport(null)}
        >
          <div
            ref={reportModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="analytics-report-title"
            className="w-full max-w-lg bg-[#171b26] border border-[#262a35] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#262a35]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 id="analytics-report-title" className="text-lg font-bold text-white font-headline">
                    {t('progress:analytics.sessionReportTitle', { id: selectedReport.id })}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {t('progress:analytics.sessionReportSub', { date: selectedReport.date, duration: selectedReport.duration })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                aria-label={t('common:close', 'Fermer')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score pill */}
            <div className="p-4 rounded-2xl bg-[#0f131d] border border-[#262a35] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">{t('progress:analytics.scoreObtained')}</span>
                <div className="text-2xl font-bold font-mono text-blue-400 mt-0.5">
                  {selectedReport.score} / {selectedReport.maxScore} pts
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase ${
                  selectedReport.passed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {selectedReport.passed ? t('progress:analytics.certValidated') : t('progress:analytics.belowThreshold')}
              </span>
            </div>

            {/* Domain breakdown */}
            <div>
              <div className="text-xs font-mono font-semibold uppercase text-slate-400 mb-3">
                {t('progress:analytics.sectionBreakdown')}
              </div>
              <div className="space-y-2">
                {selectedReport.domainScores.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#0f131d]/60">
                    <span className="text-slate-300">{d.name}</span>
                    <span className="font-mono font-semibold text-white">{d.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pedagogical recommendation */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
              <div className="text-xs font-semibold text-blue-300">
                {t('progress:analytics.telemetryAdvice')}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedReport.recommendation}
              </p>
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20"
            >
              {t('progress:analytics.closeReport')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
