import React, { useState, useMemo } from 'react';
import { 
  Target, 
  Brain, 
  AlertTriangle, 
  HelpCircle, 
  Play, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  RotateCw, 
  Flame, 
  Calendar, 
  Sparkles, 
  Clock, 
  Award, 
  Check, 
  ChevronRight, 
  X, 
  Zap,
  TrendingUp,
  Bookmark,
  BookOpen,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { AppScreen, Flashcard, QuizQuestion } from '../types';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { certificationsData } from '../data/certificationsData';
import { quizQuestionsData } from '../data/quizData';
import { getLocalizedQuizQuestions } from '../data/localizedQuizData';
import { 
  ai102FlashcardsData, 
  c1000177FlashcardsData, 
  aifc01FlashcardsData,
  gcpmleFlashcardsData,
  mlsc01FlashcardsData,
  ai900FlashcardsData
} from '../data/flashcardsData';
import { 
  computeDailyReviewQueue, 
  getCardSRSMetrics, 
  predictNextIntervals, 
  formatSRSDisplay,
  getTodayDateString 
} from '../lib/srsAlgorithm';
import { InfoTooltip } from './InfoTooltip';
import { useTranslation, getCurrentLanguage, formatLocalizedNumber, formatLocalizedDate } from '../i18n';

interface TodayViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (certId: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ onNavigate, onOpenBlueprint }) => {
  const { t, i18n } = useTranslation(['dashboard', 'progress', 'common', 'flashcards', 'certifications']);
  const currentLang = (i18n.language === 'en' ? 'en' : 'fr');
  const { user, userProfile } = useAuth();
  const { 
    activeCertId, 
    setActiveCertId, 
    certProgress, 
    reviews, 
    rateFlashcard,
    bookmarkedCardIds,
    toggleBookmarkCard,
  } = useProgress();

  // Active Target Exam (default to AI-102 or persisted targetExam)
  const currentTargetCode = activeCertId || userProfile?.targetExam || 'ai102';

  // Load active certification metadata
  const currentCert = useMemo(() => {
    return (
      certificationsData.find((c) => c.id === currentTargetCode) ||
      certificationsData.find((c) => c.id === 'ai102') ||
      certificationsData[0]
    );
  }, [currentTargetCode]);

  // Load dataset according to active certification
  const activeDeck = useMemo(() => {
    if (currentTargetCode === 'c1000177') return c1000177FlashcardsData;
    if (currentTargetCode === 'aifc01') return aifc01FlashcardsData;
    if (currentTargetCode === 'gcpmle') return gcpmleFlashcardsData;
    if (currentTargetCode === 'mlsc01') return mlsc01FlashcardsData;
    if (currentTargetCode === 'ai900') return ai900FlashcardsData;
    return ai102FlashcardsData;
  }, [currentTargetCode]);

  // 1. Compute the 17 SRS Due Cards for today
  const dailyReviewQueue = useMemo(() => {
    return computeDailyReviewQueue(activeDeck, reviews, 17);
  }, [activeDeck, reviews]);

  const dueCards17 = useMemo(() => {
    return dailyReviewQueue.dueCards.slice(0, 17);
  }, [dailyReviewQueue]);

  // 2. Identify 8 Notions Fragiles (difficulty >= 4, or rating === 'difficile'/'revoir', or lowest success rate)
  const fragileNotions8 = useMemo(() => {
    const fragileCandidates = activeDeck.filter((c) => {
      const rev = reviews[c.id];
      const m = getCardSRSMetrics(c.id, rev);
      return m.difficulty >= 4 || rev?.rating === 'difficile' || rev?.rating === 'revoir';
    });

    if (fragileCandidates.length >= 8) {
      return fragileCandidates.slice(0, 8);
    }

    // Fill up to 8 with high-priority official topics if needed
    const remaining = activeDeck.filter((c) => !fragileCandidates.some((fc) => fc.id === c.id));
    return [...fragileCandidates, ...remaining.slice(0, Math.max(0, 8 - fragileCandidates.length))];
  }, [activeDeck, reviews]);

  // 3. Compose 12 Questions Non Maîtrisées
  const unmasteredQuestions12 = useMemo(() => {
    // Generate or select 12 target questions based on localized quiz database
    const pool = getLocalizedQuizQuestions(currentLang);
    const questions: QuizQuestion[] = [];
    for (let i = 0; i < 12; i++) {
      const base = pool[i % pool.length];
      questions.push({
        ...base,
        id: `today-q-${i + 1}-${base.id}`,
        points: 25,
      });
    }
    return questions;
  }, [currentLang]);

  // Progression percentage for the active certification
  const currentProgressPct = useMemo(() => {
    const p = certProgress[currentTargetCode];
    if (p && p.progress !== undefined && p.progress > 0) {
      return p.progress;
    }
    return 78; // baseline progression as requested
  }, [certProgress, currentTargetCode]);

  // Session Runner State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isQuizValidated, setIsQuizValidated] = useState(false);
  const [ratedInterval, setRatedInterval] = useState<string | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Total session items: 17 flashcards + 8 fragile notions + 12 questions = 37 items
  const totalSessionSteps = dueCards17.length + fragileNotions8.length + unmasteredQuestions12.length;

  // Determine current active item in session
  const currentSessionItem = useMemo(() => {
    if (!isSessionActive) return null;

    if (currentStepIndex < dueCards17.length) {
      return {
        type: 'flashcard' as const,
        phaseName: t('dashboard:phases.phase1'),
        phaseIndex: 1,
        stepNumber: currentStepIndex + 1,
        totalInPhase: dueCards17.length,
        item: dueCards17[currentStepIndex],
      };
    }

    const fragileIndex = currentStepIndex - dueCards17.length;
    if (fragileIndex < fragileNotions8.length) {
      return {
        type: 'fragile' as const,
        phaseName: t('dashboard:phases.phase2'),
        phaseIndex: 2,
        stepNumber: fragileIndex + 1,
        totalInPhase: fragileNotions8.length,
        item: fragileNotions8[fragileIndex],
      };
    }

    const questionIndex = currentStepIndex - dueCards17.length - fragileNotions8.length;
    return {
      type: 'question' as const,
      phaseName: t('dashboard:phases.phase3'),
      phaseIndex: 3,
      stepNumber: questionIndex + 1,
      totalInPhase: unmasteredQuestions12.length,
      item: unmasteredQuestions12[questionIndex],
    };
  }, [isSessionActive, currentStepIndex, dueCards17, fragileNotions8, unmasteredQuestions12, t]);

  // Display name formatting
  const learnerName = useMemo(() => {
    if (user?.displayName) return user.displayName;
    if (userProfile?.displayName) return userProfile.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Jean-Pierre';
  }, [user, userProfile]);

  // Today formatted date (localized)
  const todayDateFormatted = useMemo(() => {
    try {
      const now = new Date();
      return formatLocalizedDate(now, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }, currentLang);
    } catch {
      return currentLang === 'en' ? 'Today' : 'Aujourd\'hui';
    }
  }, [currentLang]);

  // Handle Starting Session
  const handleStartSession = () => {
    setIsSessionActive(true);
    setCurrentStepIndex(0);
    setIsCardFlipped(false);
    setSelectedQuizOption(null);
    setIsQuizValidated(false);
    setSessionCompleted(false);
  };

  // Session Navigation
  const handleNextStep = () => {
    if (currentStepIndex + 1 >= totalSessionSteps) {
      setSessionCompleted(true);
      return;
    }
    setCurrentStepIndex((prev) => prev + 1);
    setIsCardFlipped(false);
    setSelectedQuizOption(null);
    setIsQuizValidated(false);
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setIsCardFlipped(false);
      setSelectedQuizOption(null);
      setIsQuizValidated(false);
    }
  };

  // Grade flashcard in session
  const handleRateSessionCard = (ratingKey: 'revoir' | 'difficile' | 'moyen' | 'facile', days: number, label: string) => {
    if (!currentSessionItem || (currentSessionItem.type !== 'flashcard' && currentSessionItem.type !== 'fragile')) return;
    const cardItem = currentSessionItem.item as Flashcard;
    setRatedInterval(label);
    rateFlashcard(cardItem.id, currentTargetCode, ratingKey, days);
    setTimeout(() => {
      setRatedInterval(null);
      handleNextStep();
    }, 350);
  };

  return (
    <div id="today-main-container" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Greeting & Date */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1c1f2a]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Calendar className="w-3.5 h-3.5" />
            <span className="capitalize">{todayDateFormatted}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-headline tracking-tight">
            {t('dashboard:greeting', { name: learnerName, defaultValue: `Bonjour, ${learnerName}` })}
          </h1>

          <p className="text-sm text-slate-300 mt-1.5 max-w-2xl">
            {t('dashboard:subtitle', 'CertifIA a analysé votre courbe d’oubli SM-2 et votre historique pour composer votre session d’entraînement optimale.')}
          </p>
        </div>

        {/* Global Streak & Readiness Pill Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#171b26] border border-[#262a35] text-xs font-mono">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-slate-300">{t('progress:currentStreak')} :</span>
            <span className="font-bold text-amber-400">{userProfile?.streakDays ?? 14} {t('progress:days')}</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#171b26] border border-[#262a35] text-xs font-mono">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">{t('dashboard:progress')} :</span>
            <span className="font-bold text-emerald-400">{currentProgressPct}%</span>
          </div>
        </div>
      </div>

      {/* 2. Target Certification Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#171b26] border border-[#262a35]">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            {t('dashboard:targetCert')} :
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {certificationsData.slice(0, 5).map((cert) => {
            const isSelected = cert.id === currentTargetCode;
            return (
              <button
                key={cert.id}
                onClick={() => setActiveCertId(cert.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/50'
                    : 'bg-[#0f131d] text-slate-400 hover:text-white border border-[#262a35]'
                }`}
              >
                <span>{cert.code}</span>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. The Core "Votre session du jour" Hero Container (Matching User's Exact Specification) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Hero Card (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#172033] via-[#171b26] to-[#0f131d] border border-blue-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden group">
            {/* Background cyber accent glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Header Box */}
              <div className="flex items-center justify-between pb-4 border-b border-[#262a35]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-400">
                      {t('dashboard:algorithmTag', 'Algorithme CertifIA • Session Sur-Mesure')}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">
                      {t('dashboard:dailySessionTitle', 'Votre session du jour')}
                    </h2>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  ~22 min
                </span>
              </div>

              {/* The 3 Core Ingredients */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* 1. 17 Cartes à réviser */}
                <div 
                  onClick={() => onNavigate('flashcards')}
                  className="p-4 rounded-2xl bg-[#0a0e18]/80 border border-[#262a35] hover:border-blue-500/40 transition-all cursor-pointer group/card flex flex-col justify-between relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🧠</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                        SM-2
                      </span>
                      <InfoTooltip
                        title={t('dashboard:tooltips.sm2Cards', 'Cartes SRS à réviser (SM-2)')}
                        content={t('dashboard:tooltips.sm2CardsDesc', "Ces 17 cartes ont atteint leur seuil d'oubli critique calculé par l'algorithme SuperMemo-2 / FSRS. Les revoir aujourd'hui maximise votre rétention sans surcharger votre mémoire.")}
                        example={currentLang === 'en' ? 'Card #127 scheduled for today with a 3-day interval.' : 'Carte #127 programmée pour aujourd\'hui avec intervalle de 3 jours.'}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-extrabold text-white font-mono">17</div>
                    <div className="text-xs font-semibold text-slate-200 mt-0.5">
                      {t('dashboard:cardsToReview', 'cartes à réviser')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {t('dashboard:cardsToReviewDesc', "Au seuil d'oubli calculé")}
                    </div>
                  </div>
                </div>

                {/* 2. 8 Notions fragiles */}
                <div 
                  onClick={() => onNavigate('flashcards')}
                  className="p-4 rounded-2xl bg-[#0a0e18]/80 border border-[#262a35] hover:border-amber-500/40 transition-all cursor-pointer group/card flex flex-col justify-between relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                        {t('dashboard:priorityBadge', 'Priorité 4-5/5')}
                      </span>
                      <InfoTooltip
                        title={t('dashboard:tooltips.fragileConcepts', 'Notions Fragiles & Pièges')}
                        content={t('dashboard:tooltips.fragileConceptsDesc', "Concepts à fort coefficient d'examen où vos réponses précédentes ont montré des hésitations, des erreurs répétées ou une difficulté supérieure à 3/5.")}
                        example={currentLang === 'en' ? 'Difference between BM25 Hybrid Index and pure Vector Search.' : 'Différence entre Index Hybride BM25 et Recherche Vectorielle pure.'}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-extrabold text-amber-400 font-mono">8</div>
                    <div className="text-xs font-semibold text-slate-200 mt-0.5">
                      {t('dashboard:fragileConcepts', 'notions fragiles')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {t('dashboard:fragileConceptsDesc', "Hésitations & pièges d'examen")}
                    </div>
                  </div>
                </div>

                {/* 3. 12 Questions non maîtrisées */}
                <div 
                  onClick={() => onNavigate('quiz')}
                  className="p-4 rounded-2xl bg-[#0a0e18]/80 border border-[#262a35] hover:border-rose-500/40 transition-all cursor-pointer group/card flex flex-col justify-between relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">❓</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                        {t('dashboard:qcmBadge', 'QCM')}
                      </span>
                      <InfoTooltip
                        title={t('dashboard:tooltips.targetedMcq', 'QCM d\'Architecture Ciblés')}
                        content={t('dashboard:tooltips.targetedMcqDesc', "12 questions d'examen représentatives sélectionnées pour tester votre capacité à appliquer vos connaissances théoriques dans des cas réels d'entreprise.")}
                        example={currentLang === 'en' ? 'Choosing between SageMaker JumpStart and Amazon Bedrock based on latency constraints.' : 'Choix entre SageMaker JumpStart et Amazon Bedrock selon les contraintes de latence.'}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-extrabold text-rose-400 font-mono">12</div>
                    <div className="text-xs font-semibold text-slate-200 mt-0.5">
                      {t('dashboard:unmasteredQuestions', 'questions non maîtrisées')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {t('dashboard:unmasteredQuestionsDesc', "Cas pratiques d'architecture")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Target & Progression Bar Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0f131d]/90 border border-[#262a35] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎯</span>
                    <span className="text-sm font-bold text-white font-headline">
                      {currentCert.code} — {currentCert.title}
                    </span>
                    <InfoTooltip
                      title={t('dashboard:tooltips.activeCert', 'Certification Active')}
                      content={t('dashboard:tooltips.activeCertDesc', "L'examen officiel ciblé par vos sessions quotidiennes. Vous pouvez changer d'examen cible en un clic via la barre supérieure.")}
                    />
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {t('dashboard:progress', 'Progression')} : {currentProgressPct} %
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-[#0a0e18] rounded-full overflow-hidden border border-[#262a35]">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${currentProgressPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>{t('dashboard:examPassThreshold', 'Seuil de validation examen')} : 700 / 1000 pts ({currentCert.passScore || 70}%)</span>
                  <span className="text-blue-300 font-bold">{t('dashboard:projectedGain', '+3% projeté après cette session')}</span>
                </div>
              </div>

              {/* [ Reprendre mon apprentissage ] Main Action Button */}
              <button
                id="btn-start-today-session"
                onClick={handleStartSession}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold font-headline text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 border border-blue-400/40 transition-all flex items-center justify-center gap-3 group/btn"
              >
                <Play className="w-5 h-5 fill-white text-white group-hover/btn:scale-110 transition-transform" />
                <span>{t('dashboard:resumeLearning', 'Reprendre mon apprentissage')}</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick Access into Single Modes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              onClick={() => onNavigate('flashcards')}
              className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] hover:border-blue-500/40 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  {t('dashboard:quickAccess.srsTitle', 'Mémorisation SRS')}
                </div>
                <div className="text-sm font-bold text-white">
                  {t('dashboard:quickAccess.srsSub', 'Fiches mémo')}
                </div>
                <div className="text-[11px] text-slate-400">
                  {t('dashboard:quickAccess.srsDesc', '2 800 cartes avec SM-2')}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div 
              onClick={() => onNavigate('glossary')}
              className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] hover:border-indigo-500/40 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {t('dashboard:quickAccess.glossaryTitle', 'Encyclopédie IA')}
                </div>
                <div className="text-sm font-bold text-white">
                  {t('dashboard:quickAccess.glossarySub', 'Glossaire & Fiches')}
                </div>
                <div className="text-[11px] text-slate-400">
                  {t('dashboard:quickAccess.glossaryDesc', 'Concepts, pièges & architectures')}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div 
              onClick={() => onNavigate('exam')}
              className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {t('dashboard:quickAccess.examTitle', 'Simulation Réelle')}
                </div>
                <div className="text-sm font-bold text-white">
                  {t('dashboard:quickAccess.examSub', 'Examen blanc')}
                </div>
                <div className="text-[11px] text-slate-400">
                  {t('dashboard:quickAccess.examDesc', '90 min • Conditions réelles')}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Moteur de Recommandation Banner */}
          <div 
            onClick={() => onNavigate('recommendation')}
            className="p-5 rounded-3xl bg-gradient-to-r from-blue-900/40 via-[#172033] to-indigo-950/40 border border-blue-500/40 hover:border-blue-400 transition-all cursor-pointer shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                    {t('dashboard:pathwayBanner.badge', 'Nouveau • Moteur d\'Orientation')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {t('dashboard:pathwayBanner.level', 'Niveau 1 → 4')}
                  </span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                  {t('dashboard:pathwayBanner.title', 'Construire votre parcours IA personnalisé')}
                </div>
                <div className="text-xs text-slate-300">
                  {t('dashboard:pathwayBanner.desc', 'Définissez votre métier, budget et temps disponible pour générer votre feuille de route certifiante officielle.')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0 self-start sm:self-auto">
              <span>{t('dashboard:pathwayBanner.action', 'Diagnostiquer mon profil')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Right Aside: Strategy & Breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Detailed Algorithm Composition Card */}
          <div className="p-6 rounded-3xl bg-[#171b26] border border-[#262a35] space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-[#262a35]">
              <span className="font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                {t('dashboard:sessionDetails.title', 'Détail de la Session')}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {t('dashboard:sessionDetails.totalSteps', 'Total {{count}} étapes', { count: totalSessionSteps })}
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white font-mono">
                    {t('dashboard:sessionDetails.step1Title', '17 Fiches SRS')}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {t('dashboard:sessionDetails.step1Desc', 'Rappels espacés calculés aujourd\'hui ({{overdue}} en retard, {{due}} à échéance).', {
                      overdue: dailyReviewQueue.overdueCards.length,
                      due: dailyReviewQueue.dueTodayCards.length
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white font-mono">
                    {t('dashboard:sessionDetails.step2Title', '8 Notions Fragiles')}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {t('dashboard:sessionDetails.step2Desc', 'Pièges d\'examen à haute pondération identifiés par CertifIA.')}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white font-mono">
                    {t('dashboard:sessionDetails.step3Title', '12 Questions QCM')}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {t('dashboard:sessionDetails.step3Desc', 'Mise en situation d\'architecture avec explications officielles Microsoft / AWS / IBM.')}
                  </div>
                </div>
              </div>
            </div>

            {/* Coach Tip Callout */}
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1">
              <div className="font-bold text-blue-300 font-mono flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                {t('dashboard:coachTip.title', 'Conseil du Jour CertifIA')}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {t('dashboard:coachTip.body', '15 à 20 minutes d\'entraînement espacé au seuil d\'oubli valent 3 heures de bachotage inefficace. Termine ta session quotidienne pour sécuriser ta série !')}
              </p>
            </div>
          </div>

          {/* Goal & Exam Target Details */}
          <div className="p-6 rounded-3xl bg-[#171b26] border border-[#262a35] space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              {t('dashboard:targetGoal.title', 'Objectif Examen Cible')}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono">{t('dashboard:targetGoal.examLabel', 'Examen visé :')}</span>
                <span className="font-bold text-white font-mono">{currentCert.code}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono">{t('dashboard:targetGoal.dateLabel', 'Date cible :')}</span>
                <span className="font-bold text-indigo-300 font-mono">
                  {userProfile?.targetDate || t('dashboard:targetGoal.defaultDate', '24 Novembre 2026')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono">{t('dashboard:targetGoal.weeklyLabel', 'Objectif hebdo :')}</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {t('dashboard:targetGoal.reviewedCount', '{{done}} / {{total}} révisées', {
                    done: userProfile?.weeklyTarget || 85,
                    total: 100
                  })}
                </span>
              </div>
            </div>

            {onOpenBlueprint && (
              <button
                onClick={() => onOpenBlueprint(currentCert.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0f131d] hover:bg-[#262a35] text-slate-300 hover:text-white border border-[#262a35] text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>{t('certifications:actions.viewBlueprint', 'Consulter le Blueprint officiel')}</span>
              </button>
            )}
          </div>

          {/* Activités Récentes */}
          <div className="p-6 rounded-3xl bg-[#171b26] border border-[#262a35] space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-[#262a35]">
              <span className="font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {t('dashboard:recentActivities.title', 'Activités Récentes')}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {t('dashboard:recentActivities.last24h', 'Dernières 24h')}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between p-2.5 rounded-xl bg-[#0f131d] border border-[#262a35]">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">
                    {t('dashboard:recentActivities.item1Title', 'Session SRS Matinale')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {t('dashboard:recentActivities.item1Desc', '14 fiches révisées avec succès')}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  +100%
                </span>
              </div>

              <div className="flex items-start justify-between p-2.5 rounded-xl bg-[#0f131d] border border-[#262a35]">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">QCM RAG & Vector Search</div>
                  <div className="text-[11px] text-slate-400">
                    {t('dashboard:recentActivities.item2Desc', '6/7 bonnes réponses obtenues')}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  85.7%
                </span>
              </div>
            </div>
          </div>

          {/* Prochaines Étapes Recommandées */}
          <div className="p-6 rounded-3xl bg-[#171b26] border border-[#262a35] space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-[#262a35]">
              <span className="font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                {t('dashboard:nextSteps.title', 'Prochaines Étapes')}
              </span>
              <span className="text-[10px] font-mono text-indigo-400">
                {t('dashboard:nextSteps.guided', 'Guidé')}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div 
                onClick={handleStartSession}
                className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 hover:border-blue-500/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-blue-300">
                    {t('dashboard:nextSteps.step1Title', '1. Terminer la session du jour')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {t('dashboard:nextSteps.step1Desc', '17 cartes pour sécuriser le seuil SM-2')}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-400 shrink-0" />
              </div>

              <div 
                onClick={() => onNavigate('quiz')}
                className="p-3 rounded-xl bg-[#0f131d] border border-[#262a35] hover:border-slate-500 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-200">
                    {t('dashboard:nextSteps.step2Title', '2. Renforcer les pièges RAG')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {t('dashboard:nextSteps.step2Desc', 'Vérifier les filtres Custom Blocklists')}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              <div 
                onClick={() => onNavigate('exam')}
                className="p-3 rounded-xl bg-[#0f131d] border border-[#262a35] hover:border-slate-500 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-200">
                    {t('dashboard:nextSteps.step3Title', '3. Examen blanc complet')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {t('dashboard:nextSteps.step3Desc', 'Valider 700/1000 en 90 minutes')}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Full-Screen / Modal Session Runner */}
      {isSessionActive && currentSessionItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#171b26] border border-[#262a35] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[95vh] overflow-y-auto flex flex-col justify-between">
            {/* Session Top Bar */}
            <div className="flex items-center justify-between border-b border-[#262a35] pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {currentSessionItem.phaseName}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {t('dashboard:runner.step', 'Étape {{current}} sur {{total}}', {
                    current: currentStepIndex + 1,
                    total: totalSessionSteps
                  })}
                </span>
              </div>

              <button
                onClick={() => setIsSessionActive(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-[#0f131d] border border-[#262a35] transition-colors"
                title={t('common:pauseAndExit', 'Mettre en pause et quitter')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Session Step Progress Bar */}
            <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${Math.round(((currentStepIndex + 1) / totalSessionSteps) * 100)}%` }}
              />
            </div>

            {/* PHASE 1 & 2: Flashcards & Fragile Notions */}
            {(currentSessionItem.type === 'flashcard' || currentSessionItem.type === 'fragile') && (
              <div className="space-y-6 my-2">
                {(() => {
                  const fc = currentSessionItem.item as Flashcard;
                  const metrics = getCardSRSMetrics(fc.id, reviews[fc.id], currentStepIndex);
                  const display = formatSRSDisplay(metrics, fc.promptNumber || `#${currentStepIndex + 1}`);
                  const predicted = predictNextIntervals(metrics);

                  return (
                    <div className="space-y-4">
                      {/* Telemetry Header */}
                      <div className="p-3 rounded-2xl bg-[#0a0e18] border border-[#262a35] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">{t('flashcards:telemetry.cardId')}</div>
                          <div className="text-sm font-bold text-blue-400">{display.cardNumber}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">{t('flashcards:telemetry.difficulty')}</div>
                          <div className="text-sm font-bold text-amber-400">{display.diffLabel}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">{t('flashcards:telemetry.nextReview')}</div>
                          <div className="text-sm font-bold text-emerald-400">{display.nextReviewLabel}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">{t('flashcards:telemetry.repetitionsAndRate')}</div>
                          <div className="text-sm font-bold text-purple-400">{display.repCount} • {display.successLabel}</div>
                        </div>
                      </div>

                      {/* Interactive Card Stage */}
                      <div 
                        onClick={() => setIsCardFlipped(!isCardFlipped)}
                        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c2438] via-[#171b26] to-[#0f131d] border border-blue-500/30 hover:border-blue-400/50 transition-all cursor-pointer min-h-[260px] flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white bg-blue-600">
                            {fc.category}
                          </span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                            {isCardFlipped ? t('flashcards:telemetry.front') : t('dashboard:runner.flipPrompt')}
                          </span>
                        </div>

                        <div className="my-auto py-4">
                          {!isCardFlipped ? (
                            <div className="space-y-3">
                              <h3 className="text-lg sm:text-xl font-bold text-white font-headline">
                                {fc.questionTitle}
                              </h3>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                {fc.questionLead}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                                Solution &amp; Standards Officiels :
                              </span>
                              <h4 className="text-base sm:text-lg font-bold text-white">
                                {fc.solutionHeading}
                              </h4>
                              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                                {fc.solutionBody}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="text-[11px] font-mono text-blue-300 text-center">
                          {isCardFlipped ? 'Évaluez votre rétention ci-dessous pour continuer' : 'Appuyez pour révéler la réponse officielle'}
                        </div>
                      </div>

                      {/* SM-2 Rating Buttons */}
                      {isCardFlipped ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                          <button
                            onClick={() => handleRateSessionCard('revoir', predicted.revoir.days, `${predicted.revoir.days}j (À revoir)`)}
                            className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold text-center transition-all"
                          >
                            <div className="font-bold text-rose-400">À revoir</div>
                            <div className="text-[10px] font-mono text-rose-300/80 mt-0.5">{predicted.revoir.label}</div>
                          </button>

                          <button
                            onClick={() => handleRateSessionCard('difficile', predicted.difficile.days, `${predicted.difficile.days}j (Difficile)`)}
                            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold text-center transition-all"
                          >
                            <div className="font-bold text-amber-400">Difficile</div>
                            <div className="text-[10px] font-mono text-amber-300/80 mt-0.5">{predicted.difficile.label}</div>
                          </button>

                          <button
                            onClick={() => handleRateSessionCard('moyen', predicted.moyen.days, `${predicted.moyen.days}j (Bien)`)}
                            className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold text-center transition-all"
                          >
                            <div className="font-bold text-blue-400">Bien</div>
                            <div className="text-[10px] font-mono text-blue-300/80 mt-0.5">{predicted.moyen.label}</div>
                          </button>

                          <button
                            onClick={() => handleRateSessionCard('facile', predicted.facile.days, `${predicted.facile.days}j (Facile)`)}
                            className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold text-center transition-all"
                          >
                            <div className="font-bold text-emerald-400">Facile</div>
                            <div className="text-[10px] font-mono text-emerald-300/80 mt-0.5">{predicted.facile.label}</div>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsCardFlipped(true)}
                          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Révéler la réponse</span>
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* PHASE 3: Multiple-Choice Questions */}
            {currentSessionItem.type === 'question' && (
              <div className="space-y-6 my-2">
                {(() => {
                  const q = currentSessionItem.item as QuizQuestion;
                  const isCorrect = selectedQuizOption === q.correctKey;

                  return (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                          {q.code} • {q.points} points
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white font-headline leading-snug">
                          {q.question}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {q.scenario}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="space-y-2.5">
                        {q.options.map((opt) => {
                          const isSelected = selectedQuizOption === opt.key;
                          let btnStyle = 'bg-[#0f131d] border-[#262a35] text-slate-300 hover:border-blue-500/40';

                          if (isQuizValidated) {
                            if (opt.key === q.correctKey) {
                              btnStyle = 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-500/20';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                            } else {
                              btnStyle = 'bg-[#0f131d]/60 border-[#262a35] text-slate-500 opacity-60';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-blue-600/20 border-blue-500 text-white';
                          }

                          return (
                            <button
                              key={opt.key}
                              disabled={isQuizValidated}
                              onClick={() => setSelectedQuizOption(opt.key)}
                              className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                            >
                              <span className="w-5 h-5 rounded-md bg-[#171b26] border border-[#262a35] font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                                {opt.key}
                              </span>
                              <div className="space-y-0.5">
                                <div className="font-semibold">{opt.text}</div>
                                {opt.subtext && <div className="text-[10px] text-slate-400">{opt.subtext}</div>}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Callout */}
                      {isQuizValidated && (
                        <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                          isCorrect ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                        }`}>
                          <div className="font-bold font-headline flex items-center gap-2">
                            {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                            <span>{isCorrect ? 'Excellente réponse !' : `Incorrect. La bonne réponse était l'option ${q.correctKey}.`}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-200">
                            {q.explanation.mainReason}
                          </p>
                        </div>
                      )}

                      {/* Validation & Next Buttons */}
                      <div className="pt-2 flex justify-end gap-3">
                        {!isQuizValidated ? (
                          <button
                            disabled={!selectedQuizOption}
                            onClick={() => setIsQuizValidated(true)}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-mono text-xs font-bold transition-all"
                          >
                            Valider la réponse
                          </button>
                        ) : (
                          <button
                            onClick={handleNextStep}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2"
                          >
                            <span>Question suivante</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#262a35] text-xs">
              <button
                disabled={currentStepIndex === 0}
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-xl bg-[#0f131d] text-slate-400 hover:text-white border border-[#262a35] disabled:opacity-40 font-mono flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('common:actions.previous')}</span>
              </button>

              <button
                onClick={() => setIsSessionActive(false)}
                className="text-slate-400 hover:text-white text-xs font-mono transition-colors"
              >
                {t('examinations:controls.pause')}
              </button>

              <button
                onClick={handleNextStep}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono flex items-center gap-1.5 transition-colors"
              >
                <span>{t('common:actions.next')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Session Completed Celebration Modal */}
      {sessionCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#171b26] border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                {t('dashboard:runner.sessionCompletedTitle')}
              </span>
              <h3 className="text-2xl font-extrabold text-white font-headline">
                {t('dashboard:runner.sessionCompletedTitle')}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                {t('dashboard:runner.sessionCompletedDesc')}
              </p>
            </div>

            {/* Rewards */}
            <div className="p-4 rounded-2xl bg-[#0f131d] border border-[#262a35] grid grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <div className="text-[10px] text-slate-400">{t('dashboard:progress')}</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">81 % (+3%)</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">{t('progress:currentStreak')}</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">15 {t('progress:days')} 🔥</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">XP CertifIA</div>
                <div className="text-base font-bold text-blue-400 mt-0.5">+350 XP</div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSessionCompleted(false);
                  setIsSessionActive(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-colors"
              >
                {t('dashboard:runner.backToDashboard')}
              </button>
              <button
                onClick={() => {
                  setSessionCompleted(false);
                  setIsSessionActive(false);
                  onNavigate('analytics');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0f131d] hover:bg-slate-800 text-slate-300 border border-[#262a35] font-mono text-xs font-bold transition-colors"
              >
                {t('navigation:items.analytics.shortLabel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
