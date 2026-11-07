import React, { useState } from 'react';
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
  Award, 
  Calendar, 
  FileText, 
  ChevronRight, 
  Zap, 
  Layers, 
  X, 
  Sliders, 
  Share2,
  Database,
  BookOpen,
  Check,
  Bot
} from 'lucide-react';
import { AppScreen, ExamSessionHistory, ExamAttemptRecord } from '../types';
import { examHistoryData } from '../data/analyticsData';
import { certificationsData } from '../data/certificationsData';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from './ui/PageHeader';
import { useTranslation, getCurrentLanguage, formatLocalizedDate } from '../i18n';

interface AnalyticsViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (certId: string) => void;
  onOpenAIAssistant?: (context?: any) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onNavigate, onOpenBlueprint, onOpenAIAssistant }) => {
  const { t } = useTranslation(['progress', 'common']);
  const lang = getCurrentLanguage();
  const { 
    certProgress, 
    examAttempts, 
    getCertStats, 
    activeCertId, 
    setActiveCertId, 
    updateGoalTarget,
    isSyncing 
  } = useProgress();
  const { userProfile, user } = useAuth();

  const [selectedTargetExam, setSelectedTargetExam] = useState<string>(activeCertId || 'ai102');
  const [selectedReport, setSelectedReport] = useState<ExamSessionHistory | null>(null);
  const [isCopilotTestGenerated, setIsCopilotTestGenerated] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'certifications' | 'examens' | 'flashcards' | 'objectifs'>('certifications');

  const activeCert = certificationsData.find((c) => c.id === selectedTargetExam) || certificationsData[0];
  const activeProg = certProgress[selectedTargetExam] || {
    id: selectedTargetExam,
    userId: 'user',
    certCode: activeCert.code,
    progress: activeCert.userProgress || 50,
    score: 765,
    readinessIndex: 74,
    lastCardIndex: 0,
    reviewedCardsCount: 52,
    updatedAt: new Date().toISOString(),
  };

  const activeStats = getCertStats(selectedTargetExam);

  const handleTargetChange = (newTarget: string) => {
    setSelectedTargetExam(newTarget);
    const found = certificationsData.find(c => c.id === newTarget);
    if (found) {
      updateGoalTarget(newTarget, found.title);
    }
  };

  const handleOpenAttemptReport = (attempt: ExamAttemptRecord) => {
    let domainScores: { name: string; score: number }[] = [];
    if (attempt.domainScoresSummary) {
      try {
        const parsed = JSON.parse(attempt.domainScoresSummary);
        domainScores = Object.entries(parsed).map(([k, v]) => ({ name: k, score: Number(v) }));
      } catch {
        domainScores = [{ name: 'Score Global', score: Math.round((attempt.score / attempt.maxScore) * 100) }];
      }
    } else {
      domainScores = [
        { name: 'Architecture & Modèles', score: 82 },
        { name: 'Ingénierie & Pipelines', score: 74 },
        { name: 'Sécurité & Gouvernance', score: 68 },
      ];
    }

    const report: ExamSessionHistory = {
      id: `${lang === 'en' ? 'Attempt' : 'Tentative'} #${attempt.attemptNumber} (${attempt.examCode})`,
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
        ? (lang === 'en'
            ? 'Exam successfully validated! Concentrate your revisions on the identified weak points to secure a solid buffer.'
            : 'Examen validé avec succès ! Concentrez vos révisions sur les concepts identifiés comme point faible pour garantir une marge de sécurité maximale.')
        : (lang === 'en'
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
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              {isSyncing ? "Sync..." : "Firestore Connecté"}
            </span>
          </div>
        }
      />

      {/* Rigueur Méthodologique / Pas de fausse garantie */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t('progress:disclaimer')}
        </p>
      </div>

        {/* Target Selector Bar */}
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-[#171b26] border border-[#262a35]">
          <div className="text-xs text-slate-400 pl-2 font-mono">{t('progress:analytics.selectCert')}</div>
          <select
            value={selectedTargetExam}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="bg-[#0f131d] border border-[#262a35] text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="c1000177">IBM watsonx C1000-177 ({certProgress['c1000177']?.progress ?? 42}%)</option>
            <option value="gcpmle">Google Cloud PMLE ({certProgress['gcpmle']?.progress ?? 25}%)</option>
            <option value="aifc01">AWS AIF-C01 ({certProgress['aifc01']?.progress ?? 45}%)</option>
            <option value="mlsc01">AWS MLS-C01 ({certProgress['mlsc01']?.progress ?? 30}%)</option>
            <option value="ai900">Azure AI-900 ({certProgress['ai900']?.progress ?? 85}%)</option>
            <option value="ai102">Azure AI-102 ({certProgress['ai102']?.progress ?? 74}%)</option>
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
              {certificationsData.map((c) => {
                const prog = certProgress[c.id] || { progress: c.userProgress, score: c.passScore, readinessIndex: 70 };
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
                        <span className="text-slate-400">Score moyen :</span>
                        <div className="font-bold text-white mt-0.5">{prog.score || 750} pts</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Domaines :</span>
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
              <span>Tentatives officielles d'examens enregistrées :</span>
              <button
                onClick={() => onNavigate('exam')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Lancer une nouvelle tentative</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {examAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  onClick={() => handleOpenAttemptReport(attempt)}
                  className="p-4 rounded-xl bg-[#0f131d] border border-[#262a35] hover:border-blue-500/50 cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                      Tentative #{attempt.attemptNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        attempt.passed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {attempt.passed ? 'Validé ✓' : 'Non validé'}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-slate-400">{attempt.examCode}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{attempt.examTitle}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#171b26] flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Score final :</span>
                    <span className="text-base font-bold text-emerald-400">{attempt.score} / {attempt.maxScore}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Durée : {attempt.duration}</span>
                    <span>{new Date(attempt.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              ))}
            </div>
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
              <span className="text-slate-400 font-mono">Certification Prioritaire</span>
              <div className="text-sm font-bold text-white">{activeCert.title}</div>
              <div className="text-[11px] font-mono text-blue-400">Code : {activeCert.code}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0f131d] border border-[#262a35] space-y-2">
              <span className="text-slate-400 font-mono">Série & Constance</span>
              <div className="text-2xl font-bold font-mono text-amber-400 flex items-center gap-1.5">
                <span>{userProfile?.streakDays ?? 14} jours</span>
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
              <div className="text-[11px] text-slate-400">Rythme soutenu sans interruption</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0f131d] border border-[#262a35] space-y-2">
              <span className="text-slate-400 font-mono">Volume de validation</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {userProfile?.questionsSolved ?? 482} qcm
              </div>
              <div className="text-[11px] text-slate-400">Toutes certifications confondues</div>
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
              Indice Préparation
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">74%</div>
            <div className="text-xs font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
              <span>Prêt J-6</span>
              <span className="text-[10px] text-slate-400 font-mono font-normal">(+8% s/sem.)</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-2">Seuil de certification (70%) dépassé</div>
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
                strokeDashoffset={163.36 * (1 - 0.74)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white">
              74%
            </span>
          </div>
        </div>

        {/* KPI 2: Score Moyen Examens */}
        <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <span>Score Moyen</span>
              <span className="text-emerald-400 font-bold">PASS ✓</span>
            </div>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
              765 <span className="text-sm font-normal text-slate-400">/ 1000</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-[#0a0e18] rounded-full overflow-hidden relative">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '76.5%' }} />
              {/* Cutoff 700 marker */}
              <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-emerald-400" title="Seuil 700 pts" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5">
              <span>Cutoff 700 pts</span>
              <span className="text-emerald-400 font-semibold">+65 pts marge</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Volume Traité & Vélocité */}
        <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Volume Traité
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              482 <span className="text-xs font-normal text-slate-400">questions</span>
            </div>
            <div className="text-xs text-blue-300 font-mono mt-0.5">Précision globale : 78.4%</div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            104 erreurs décortiquées & révisées
          </div>
        </div>

        {/* KPI 4: Discipline & Mémorisation */}
        <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Discipline & Rétention
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1 flex items-center gap-2">
              14 jours <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-0.5">89% rétention active</div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            138 fiches consolidées en mémoire longue
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Domain Mapping & Critical Weak Points (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Domain Breakdown Card */}
          <div className="p-6 rounded-2xl bg-[#171b26] border border-[#262a35] shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-headline">
                  Cartographie des Domaines & Diagnostic des Lacunes
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Analyse granulaire par section du blueprint officiel {activeCert.code}
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                5 Domaines Évalués
              </span>
            </div>

            {/* Domains List */}
            <div className="space-y-4">
              {activeCert.domains.map((dom, idx) => {
                const isCriticalWeak = dom.mastery < 60;
                const isWarning = dom.mastery >= 60 && dom.mastery < 70;

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
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-headline">
                          {dom.name}
                        </span>
                        {isCriticalWeak && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                            Point Faible Critique
                          </span>
                        )}
                        {isWarning && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                            À Renforcer
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {dom.mastery}% / {dom.weight}
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
                              : '#ffb4ab',
                        }}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <p className="text-slate-400 text-[11px] leading-relaxed max-w-xl">
                        {dom.description}
                      </p>

                      {/* Targeted CTA */}
                      {isCriticalWeak && (
                        <button
                          onClick={() => onNavigate('quiz')}
                          className="px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 text-[11px] font-semibold whitespace-nowrap transition-colors"
                        >
                          Entraînement ciblé Vision
                        </button>
                      )}
                      {isWarning && (
                        <button
                          onClick={() => onNavigate('flashcards')}
                          className="px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-300 hover:bg-amber-600 hover:text-white border border-amber-500/30 text-[11px] font-semibold whitespace-nowrap transition-colors"
                        >
                          Réviser fiches Gouvernance
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3 Secondary Telemetry Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35]">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Vitesse Moyenne</div>
              <div className="text-lg font-bold font-mono text-white mt-1">1m 18s / q</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Cadence nominale : 1m 30s</div>
            </div>
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35]">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Questions Flagged</div>
              <div className="text-lg font-bold font-mono text-amber-400 mt-1">23 questions</div>
              <div 
                onClick={() => onNavigate('quiz')}
                className="text-[10px] text-blue-400 hover:underline cursor-pointer font-mono mt-0.5"
              >
                Ouvrir la pile de révision →
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35]">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Indice Prédictibilité</div>
              <div className="text-lg font-bold font-mono text-blue-400 mt-1">Tier Architecte</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">91.2% corrélation score réel</div>
            </div>
          </div>
        </div>

        {/* Right Column: CertifAI AI Orchestrator Action Plan (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1c2438] to-[#171b26] border border-blue-500/30 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
                <h3 className="text-sm font-bold text-white font-headline">
                  Orchestrateur CertifAI
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">
                Plan J-6
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Pour franchir 800 pts avant votre passage officiel, voici vos 3 actions prioritaires ordonnées par gain de points attendu :
            </p>

            {/* Action Items List */}
            <div className="space-y-3">
              {/* Item 1 */}
              <div className="p-3.5 rounded-xl bg-[#0f131d] border border-[#262a35] hover:border-blue-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white">Priorité Immédiate #1</span>
                  <span className="font-mono text-emerald-400 text-[11px] font-bold">+35 pts</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Calibration Custom Vision (seuils IoU et probabilité).
                </div>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="mt-2.5 w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm"
                >
                  Démarrer série QCM ciblée
                </button>
              </div>

              {/* Item 2 */}
              <div className="p-3.5 rounded-xl bg-[#0f131d] border border-[#262a35] hover:border-blue-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white">Échéance SRS #2</span>
                  <span className="font-mono text-blue-400 text-[11px] font-bold">+20 pts</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  5 fiches mémo de gouvernance arrivent à échéance SM-2 aujourd'hui.
                </div>
                <button
                  onClick={() => onNavigate('flashcards')}
                  className="mt-2.5 w-full py-1.5 rounded-lg bg-[#171b26] hover:bg-[#262a35] border border-[#262a35] text-slate-200 hover:text-white text-xs font-semibold transition-all"
                >
                  Lancer les 5 fiches dues
                </button>
              </div>

              {/* Item 3 */}
              <div className="p-3.5 rounded-xl bg-[#0f131d] border border-[#262a35] hover:border-blue-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white">Simulation Finale #3</span>
                  <span className="font-mono text-amber-400 text-[11px] font-bold">+45 pts</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Examen blanc en conditions réelles (100 min, 50 questions chronométrées).
                </div>
                <button
                  onClick={() => onNavigate('exam')}
                  className="mt-2.5 w-full py-1.5 rounded-lg bg-[#171b26] hover:bg-[#262a35] border border-[#262a35] text-slate-200 hover:text-white text-xs font-semibold transition-all"
                >
                  Démarrer la simulation
                </button>
              </div>
            </div>

            {/* AI Generator Tool */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs">
              <div className="font-semibold text-blue-300 mb-1 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-blue-400" />
                Générateur Diagnostic Sur-Mesure
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
                  }, 800);
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

        {/* Progression Curve (Interactive SVG Chart) */}
        <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35]">
          <svg viewBox="0 0 600 180" className="w-full h-auto">
            <defs>
              <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="40" y1="30" x2="560" y2="30" stroke="#1c1f2a" strokeWidth="1" strokeDasharray="3 3" />
            <text x="30" y="34" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">900</text>

            {/* PASS Threshold Line at 700 pts (y = 75) */}
            <line x1="40" y1="75" x2="560" y2="75" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="30" y="78" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="monospace">700</text>
            <text x="565" y="78" fill="#10b981" fontSize="8" textAnchor="start" fontFamily="monospace">PASS</text>

            <line x1="40" y1="120" x2="560" y2="120" stroke="#1c1f2a" strokeWidth="1" strokeDasharray="3 3" />
            <text x="30" y="124" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">500</text>

            {/* Area under curve */}
            {/* Points: SIM1=(100, 105 [610pts]), SIM2=(230, 88 [660pts]), SIM3=(370, 64 [735pts]), SIM4=(500, 56 [765pts]) */}
            <path
              d="M100,105 L230,88 L370,64 L500,56 L500,160 L100,160 Z"
              fill="url(#scoreArea)"
            />

            {/* Main Score Line */}
            <path
              d="M100,105 L230,88 L370,64 L500,56"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Points */}
            {/* P1: 610 */}
            <circle cx="100" cy="105" r="5" fill="#171b26" stroke="#f43f5e" strokeWidth="2.5" />
            <text x="100" y="95" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">610 pts</text>
            <text x="100" y="172" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">SIM-01 (J-14)</text>

            {/* P2: 660 */}
            <circle cx="230" cy="88" r="5" fill="#171b26" stroke="#f43f5e" strokeWidth="2.5" />
            <text x="230" y="78" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">660 pts</text>
            <text x="230" y="172" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">SIM-02 (J-9)</text>

            {/* P3: 735 */}
            <circle cx="370" cy="64" r="5" fill="#171b26" stroke="#10b981" strokeWidth="2.5" />
            <text x="370" y="54" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">735 pts</text>
            <text x="370" y="172" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">SIM-03 (J-4)</text>

            {/* P4: 765 */}
            <circle cx="500" cy="56" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2.5" />
            <text x="500" y="44" fill="#60a5fa" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">765 pts</text>
            <text x="500" y="172" fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SIM-04 (Hier)</text>
          </svg>
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
              {examAttempts.map((item) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Session Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-[#171b26] border border-[#262a35] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#262a35]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-headline">
                    {t('progress:analytics.sessionReportTitle', { id: selectedReport.id })}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {t('progress:analytics.sessionReportSub', { date: selectedReport.date, duration: selectedReport.duration })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
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
