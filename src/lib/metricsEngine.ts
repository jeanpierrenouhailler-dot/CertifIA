/**
 * Centralized Metrics Engine for CertifIA
 * Single Source of Truth for all progression, readiness, SRS retention, domain mastery,
 * streak calculation, and recent user activity across all screens.
 *
 * Formulas:
 * - Empty state guarantee: when reviews, quizAttempts, and examAttempts are empty,
 *   all counts, percentages, scores, streaks, and readiness indices strictly equal 0.
 * - Flashcard retentionRate: sum(successReviews) / sum(totalReviews) * 100
 * - Flashcard dueCount: reviewed cards whose nextReviewDate <= todayLocalDateKey
 * - Quiz accuracyPct: correctQuizCount / solvedQuizCount * 100
 * - Exam averagePct: mean of (attempt.score / attempt.maxScore * 100)
 * - Cert readinessIndex: weighted average of active signals (Exams 45%, Quizzes 25%, SRS retention 30%),
 *   normalized strictly by weights of signals that actually have activity (> 0 items).
 * - Cert progress: deck coverage weighted with mastery/exam completion:
 *   reviewedCount === 0 && quizSolved === 0 && examAttempts === 0 ? 0 :
 *   min(100, max(1, round((masteredCount * 1 + learningCount * 0.5) / deckSize * 100)))
 *   (with bonus contribution from passed exams or solved quizzes if deck has 0 reviews yet).
 */

import type {
  Certification,
  ExamAttemptRecord,
  Flashcard,
  FlashcardReviewRecord,
  QuizAttemptRecord,
  QuizQuestion,
} from '../types';
import { normalizeCertId } from '../data/certificationsData';
import { getFlashcardsForCert } from '../data/flashcardsData';
import { formatLocalDateKey, getCardSRSMetrics, parseLocalDateMs } from './srsAlgorithm';

export interface FlashcardDeckMetrics {
  certId: string;
  deckSize: number;
  reviewedCount: number;
  unreviewedCount: number;
  dueCount: number;
  overdueCount: number;
  fragileCount: number;
  masteredCount: number;
  learningCount: number;
  retentionRate: number;
  deckCoveragePct: number;
  masteryCoveragePct: number;
}

export interface QuizPoolMetrics {
  totalAvailable: number;
  solvedCount: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPct: number;
  incorrectQuestionIds: string[];
  unansweredQuestionIds: string[];
}

export interface ExamCertMetrics {
  attemptCount: number;
  passedCount: number;
  latestAttempt: ExamAttemptRecord | null;
  latestPct: number;
  bestPct: number;
  averagePct: number;
}

export interface ComputedDomainMetric {
  name: string;
  weight: string;
  percentage: number;
  description: string;
  color: string;
  totalCards: number;
  reviewedCards: number;
  masteredCards: number;
  fragileCards: number;
  mastery: number;
}

export interface ComputedCertMetrics {
  certId: string;
  certCode: string;
  hasActivity: boolean;
  progress: number;
  score: number;
  readinessIndex: number;
  flashcards: FlashcardDeckMetrics;
  exams: ExamCertMetrics;
  domains: ComputedDomainMetric[];
}

export interface RecentActivityItem {
  id: string;
  kind: 'flashcard' | 'quiz' | 'exam';
  timestamp: string;
  certCode: string;
  titleFr: string;
  titleEn: string;
  detailFr: string;
  detailEn: string;
  statusColor: 'blue' | 'emerald' | 'amber' | 'rose';
}

export interface GlobalUserMetrics {
  streakDays: number;
  cardsReviewedTotal: number;
  questionsSolved: number;
  quizSolvedCount: number;
  examAttemptsCount: number;
  averageScore: number;
  readinessIndex: number;
  recentActivities: RecentActivityItem[];
}

/**
 * Computes consecutive active study days ending today or yesterday.
 * Returns 0 when there is no recorded activity.
 */
export function computeStreakDays(
  timestamps: Array<string | undefined | null>,
  referenceDate: Date = new Date()
): number {
  const activeDayKeys = new Set<string>();

  timestamps.forEach((ts) => {
    if (!ts) return;
    const d = new Date(ts);
    if (!Number.isNaN(d.getTime())) {
      activeDayKeys.add(formatLocalDateKey(d));
    }
  });

  if (activeDayKeys.size === 0) return 0;

  const todayKey = formatLocalDateKey(referenceDate);
  const yesterdayDate = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate() - 1
  );
  const yesterdayKey = formatLocalDateKey(yesterdayDate);

  let cursorDate: Date | null = null;
  if (activeDayKeys.has(todayKey)) {
    cursorDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  } else if (activeDayKeys.has(yesterdayKey)) {
    cursorDate = yesterdayDate;
  } else {
    return 0;
  }

  let streak = 0;
  while (cursorDate) {
    const key = formatLocalDateKey(cursorDate);
    if (!activeDayKeys.has(key)) break;
    streak += 1;
    cursorDate = new Date(cursorDate.getFullYear(), cursorDate.getMonth(), cursorDate.getDate() - 1);
  }

  return streak;
}

/**
 * Computes SRS & flashcard metrics for a single certification deck.
 */
export function computeFlashcardMetrics(
  certId: string,
  cards: Flashcard[],
  reviews: Record<string, FlashcardReviewRecord>,
  referenceDate: Date = new Date()
): FlashcardDeckMetrics {
  const canonicalId = normalizeCertId(certId);
  let reviewedCount = 0;
  let dueCount = 0;
  let overdueCount = 0;
  let fragileCount = 0;
  let masteredCount = 0;
  let totalReviewEvents = 0;
  let successReviewEvents = 0;

  cards.forEach((card) => {
    const rev = reviews[card.id];
    if (!rev) return;
    reviewedCount += 1;

    const srs = getCardSRSMetrics(card.id, rev, referenceDate);
    if (srs.isDueToday) dueCount += 1;
    if (srs.isOverdue) overdueCount += 1;

    totalReviewEvents += srs.totalReviews;
    successReviewEvents += srs.successReviews;

    const isFragile =
      rev.rating === 'revoir' ||
      rev.rating === 'difficile' ||
      srs.difficulty >= 4 ||
      (srs.totalReviews > 0 && srs.successRate < 70);

    const isMastered =
      !isFragile && (rev.intervalDays >= 7 || rev.rating === 'maitrise' || rev.rating === 'facile');

    if (isMastered) {
      masteredCount += 1;
    } else if (isFragile) {
      fragileCount += 1;
    }
  });

  const learningCount = Math.max(0, reviewedCount - masteredCount - fragileCount);
  const deckSize = cards.length;
  const unreviewedCount = Math.max(0, deckSize - reviewedCount);
  const retentionRate =
    totalReviewEvents > 0 ? Math.round((successReviewEvents / totalReviewEvents) * 100) : 0;
  const deckCoveragePct =
    deckSize > 0 ? Math.min(100, Math.round((reviewedCount / deckSize) * 100)) : 0;
  const masteryCoveragePct =
    deckSize > 0
      ? Math.min(100, Math.round(((masteredCount + learningCount * 0.5) / deckSize) * 100))
      : 0;

  return {
    certId: canonicalId,
    deckSize,
    reviewedCount,
    unreviewedCount,
    dueCount,
    overdueCount,
    fragileCount,
    masteredCount,
    learningCount,
    retentionRate,
    deckCoveragePct,
    masteryCoveragePct,
  };
}

/**
 * Computes quiz metrics from persisted QuizAttemptRecord entries.
 */
export function computeQuizMetrics(
  questions: QuizQuestion[],
  quizAttempts: Record<string, QuizAttemptRecord>
): QuizPoolMetrics {
  const questionIds = new Set(questions.map((q) => q.id));
  const incorrectQuestionIds: string[] = [];
  const unansweredQuestionIds: string[] = [];

  let solvedCount = 0;
  let correctCount = 0;

  questions.forEach((q) => {
    const attempt = quizAttempts[q.id];
    if (!attempt) {
      unansweredQuestionIds.push(q.id);
      return;
    }
    solvedCount += 1;
    if (attempt.isCorrect) {
      correctCount += 1;
    } else {
      incorrectQuestionIds.push(q.id);
    }
  });

  // Include any persisted attempts even if pool expands later
  Object.values(quizAttempts).forEach((attempt) => {
    if (!questionIds.has(attempt.questionId)) {
      solvedCount += 1;
      if (attempt.isCorrect) correctCount += 1;
      else incorrectQuestionIds.push(attempt.questionId);
    }
  });

  const incorrectCount = incorrectQuestionIds.length;
  const accuracyPct = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;

  return {
    totalAvailable: questions.length,
    solvedCount,
    correctCount,
    incorrectCount,
    accuracyPct,
    incorrectQuestionIds,
    unansweredQuestionIds,
  };
}

/**
 * Computes exam metrics for a specific certification code/id.
 */
export function computeExamMetrics(
  certIdOrCode: string,
  examAttempts: ExamAttemptRecord[]
): ExamCertMetrics {
  const canonical = normalizeCertId(certIdOrCode);
  const matching = examAttempts.filter(
    (a) => normalizeCertId(a.examCode) === canonical || a.examCode.toLowerCase() === certIdOrCode.toLowerCase()
  );

  if (matching.length === 0) {
    return {
      attemptCount: 0,
      passedCount: 0,
      latestAttempt: null,
      latestPct: 0,
      bestPct: 0,
      averagePct: 0,
    };
  }

  const sorted = [...matching].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const pcts = sorted.map((a) => (a.maxScore > 0 ? Math.round((a.score / a.maxScore) * 100) : 0));
  const passedCount = sorted.filter((a) => a.passed).length;

  return {
    attemptCount: sorted.length,
    passedCount,
    latestAttempt: sorted[0],
    latestPct: pcts[0],
    bestPct: Math.max(...pcts),
    averagePct: Math.round(pcts.reduce((sum, p) => sum + p, 0) / pcts.length),
  };
}

/**
 * Computes per-domain mastery dynamically from actual flashcard reviews + exam/quiz performance.
 */
export function computeDomainMetrics(
  cert: Certification,
  cards: Flashcard[],
  reviews: Record<string, FlashcardReviewRecord>
): ComputedDomainMetric[] {
  return cert.domains.map((dom, index) => {
    const domainKey = `domain${index + 1}`;
    const domainCards = cards.filter((c) => {
      if (c.domainId) return c.domainId.toLowerCase() === domainKey;
      const prefix = c.promptNumber?.trim().toUpperCase();
      return prefix?.startsWith(`D${index + 1}`);
    });

    let reviewedCards = 0;
    let masteredCards = 0;
    let fragileCards = 0;
    let totalEv = 0;
    let successEv = 0;

    domainCards.forEach((card) => {
      const rev = reviews[card.id];
      if (!rev) return;
      reviewedCards += 1;
      const srs = getCardSRSMetrics(card.id, rev);
      totalEv += srs.totalReviews;
      successEv += srs.successReviews;

      const isFragile =
        rev.rating === 'revoir' ||
        rev.rating === 'difficile' ||
        srs.difficulty >= 4 ||
        (srs.totalReviews > 0 && srs.successRate < 70);

      if (isFragile) {
        fragileCards += 1;
      } else if (rev.intervalDays >= 7 || rev.rating === 'maitrise' || rev.rating === 'facile') {
        masteredCards += 1;
      }
    });

    let mastery = 0;
    if (reviewedCards > 0) {
      const domainRetention = totalEv > 0 ? (successEv / totalEv) * 100 : 0;
      const domainCoverage =
        domainCards.length > 0 ? Math.min(100, (reviewedCards / Math.max(1, Math.min(domainCards.length, 25))) * 100) : 0;
      mastery = Math.max(1, Math.min(100, Math.round(domainRetention * 0.7 + domainCoverage * 0.3)));
    }

    return {
      name: dom.name,
      weight: dom.weight,
      percentage: dom.percentage,
      description: dom.description,
      color: dom.color,
      totalCards: domainCards.length,
      reviewedCards,
      masteredCards,
      fragileCards,
      mastery,
    };
  });
}

/**
 * Computes full telemetry for a single certification.
 */
export function computeCertMetrics(params: {
  cert: Certification;
  reviews: Record<string, FlashcardReviewRecord>;
  quizAttempts: Record<string, QuizAttemptRecord>;
  examAttempts: ExamAttemptRecord[];
  referenceDate?: Date;
}): ComputedCertMetrics {
  const { cert, reviews, quizAttempts, examAttempts, referenceDate = new Date() } = params;
  const canonicalId = normalizeCertId(cert.id);
  const cards = getFlashcardsForCert(canonicalId);
  const flashcards = computeFlashcardMetrics(canonicalId, cards, reviews, referenceDate);
  const exams = computeExamMetrics(canonicalId, examAttempts);
  const domains = computeDomainMetrics(cert, cards, reviews);

  // Filter quiz attempts matching this cert
  const certQuizAttempts = Object.values(quizAttempts).filter(
    (q) => normalizeCertId(q.certId || q.certCode) === canonicalId
  );
  const quizSolved = certQuizAttempts.length;
  const quizCorrect = certQuizAttempts.filter((q) => q.isCorrect).length;
  const quizAccuracy = quizSolved > 0 ? Math.round((quizCorrect / quizSolved) * 100) : 0;

  const hasActivity = flashcards.reviewedCount > 0 || quizSolved > 0 || exams.attemptCount > 0;

  if (!hasActivity) {
    return {
      certId: canonicalId,
      certCode: cert.code,
      hasActivity: false,
      progress: 0,
      score: 0,
      readinessIndex: 0,
      flashcards,
      exams,
      domains,
    };
  }

  // Transparent deterministic readiness formula: weighted across active channels
  let weightedSum = 0;
  let activeWeights = 0;
  if (exams.attemptCount > 0) {
    weightedSum += exams.averagePct * 0.45;
    activeWeights += 0.45;
  }
  if (quizSolved > 0) {
    weightedSum += quizAccuracy * 0.25;
    activeWeights += 0.25;
  }
  if (flashcards.reviewedCount > 0) {
    weightedSum += flashcards.retentionRate * 0.3;
    activeWeights += 0.3;
  }
  const readinessIndex = activeWeights > 0 ? Math.min(100, Math.round(weightedSum / activeWeights)) : 0;

  // Score prioritizes official simulation average, then quiz accuracy, then flashcard retention
  const score =
    exams.attemptCount > 0
      ? exams.averagePct
      : quizSolved > 0
      ? quizAccuracy
      : flashcards.retentionRate;

  // Progress combines flashcard mastery coverage, quiz completion, and passed exam contribution
  const rawProgress =
    (flashcards.deckSize > 0
      ? ((flashcards.masteredCount + flashcards.learningCount * 0.65 + flashcards.fragileCount * 0.25) /
          flashcards.deckSize) *
        75
      : 0) +
    (exams.passedCount > 0 ? 25 : exams.attemptCount > 0 ? 10 : 0) +
    (quizSolved > 0 ? Math.min(15, quizSolved * 3) : 0);

  const progress = Math.min(100, Math.max(1, Math.round(rawProgress)));

  return {
    certId: canonicalId,
    certCode: cert.code,
    hasActivity: true,
    progress,
    score,
    readinessIndex,
    flashcards,
    exams,
    domains,
  };
}

/**
 * Computes global cross-certification metrics for Profile, Header, Today, GDPR Export, and Analytics.
 */
export function computeGlobalMetrics(params: {
  certifications: Certification[];
  activeCertId: string;
  reviews: Record<string, FlashcardReviewRecord>;
  quizAttempts: Record<string, QuizAttemptRecord>;
  examAttempts: ExamAttemptRecord[];
  referenceDate?: Date;
}): GlobalUserMetrics {
  const { certifications, activeCertId, reviews, quizAttempts, examAttempts, referenceDate = new Date() } = params;

  const reviewValues = Object.values(reviews);
  const quizValues = Object.values(quizAttempts);

  const timestamps: Array<string | undefined> = [
    ...reviewValues.map((r) => r.reviewedAt),
    ...quizValues.map((q) => q.answeredAt),
    ...examAttempts.map((e) => e.createdAt),
  ];

  const streakDays = computeStreakDays(timestamps, referenceDate);
  const cardsReviewedTotal = reviewValues.length;
  const quizSolvedCount = quizValues.length;
  const examQuestionsTotal = examAttempts.reduce(
    (sum, a) => sum + (a.questionsAnswered ?? a.questionsTotal ?? 0),
    0
  );
  const questionsSolved = quizSolvedCount + examQuestionsTotal;

  // Average score across exam attempts + quiz attempts (or flashcard retention if only flashcards exist)
  const scoreSamples: number[] = [
    ...examAttempts.map((e) => (e.maxScore > 0 ? (e.score / e.maxScore) * 100 : 0)),
    ...quizValues.map((q) => (q.isCorrect ? 100 : 0)),
  ];

  let averageScore = 0;
  if (scoreSamples.length > 0) {
    averageScore = Math.round(scoreSamples.reduce((s, v) => s + v, 0) / scoreSamples.length);
  } else if (reviewValues.length > 0) {
    let totalEv = 0;
    let successEv = 0;
    reviewValues.forEach((r) => {
      const m = getCardSRSMetrics(r.cardId, r, referenceDate);
      totalEv += m.totalReviews;
      successEv += m.successReviews;
    });
    averageScore = totalEv > 0 ? Math.round((successEv / totalEv) * 100) : 0;
  }

  const activeCert =
    certifications.find((c) => normalizeCertId(c.id) === normalizeCertId(activeCertId)) ||
    certifications[0];

  const activeCertMetrics = activeCert
    ? computeCertMetrics({
        cert: activeCert,
        reviews,
        quizAttempts,
        examAttempts,
        referenceDate,
      })
    : null;

  const readinessIndex = activeCertMetrics?.readinessIndex ?? 0;

  // Build real chronological recent activity feed (empty array when user has done nothing)
  const activities: RecentActivityItem[] = [];

  examAttempts.forEach((att) => {
    const pct = att.maxScore > 0 ? Math.round((att.score / att.maxScore) * 100) : 0;
    activities.push({
      id: `exam-${att.id}`,
      kind: 'exam',
      timestamp: att.createdAt,
      certCode: att.examCode,
      titleFr: `Examen blanc ${att.examCode} (${att.score}/${att.maxScore})`,
      titleEn: `Mock exam ${att.examCode} (${att.score}/${att.maxScore})`,
      detailFr: att.passed ? `Réussi (${pct}%)` : `À renforcer (${pct}%)`,
      detailEn: att.passed ? `Passed (${pct}%)` : `Needs review (${pct}%)`,
      statusColor: att.passed ? 'emerald' : 'amber',
    });
  });

  quizValues.forEach((q) => {
    activities.push({
      id: `quiz-${q.questionId}-${q.answeredAt}`,
      kind: 'quiz',
      timestamp: q.answeredAt,
      certCode: q.certCode,
      titleFr: `QCM ${q.questionId.toUpperCase()} · ${q.domain}`,
      titleEn: `MCQ ${q.questionId.toUpperCase()} · ${q.domain}`,
      detailFr: q.isCorrect ? `Correct (${q.selectedKey})` : `Erreur (${q.selectedKey} ≠ ${q.correctKey})`,
      detailEn: q.isCorrect ? `Correct (${q.selectedKey})` : `Incorrect (${q.selectedKey} ≠ ${q.correctKey})`,
      statusColor: q.isCorrect ? 'emerald' : 'rose',
    });
  });

  reviewValues.forEach((r) => {
    const code = normalizeCertId(r.certCode).toUpperCase();
    activities.push({
      id: `fc-${r.cardId}-${r.reviewedAt}`,
      kind: 'flashcard',
      timestamp: r.reviewedAt,
      certCode: code,
      titleFr: `Flashcard ${r.cardId}`,
      titleEn: `Flashcard ${r.cardId}`,
      detailFr: `Évaluation : ${r.rating} (${r.intervalDays}j)`,
      detailEn: `Rating: ${r.rating} (${r.intervalDays}d)`,
      statusColor: r.rating === 'revoir' || r.rating === 'difficile' ? 'amber' : 'blue',
    });
  });

  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    streakDays,
    cardsReviewedTotal,
    questionsSolved,
    quizSolvedCount,
    examAttemptsCount: examAttempts.length,
    averageScore,
    readinessIndex,
    recentActivities: activities.slice(0, 8),
  };
}

/**
 * Computes date-difference in days between two YYYY-MM-DD local strings.
 */
export function diffLocalDays(targetDateKey: string, referenceDate: Date = new Date()): number {
  const targetMs = parseLocalDateMs(targetDateKey);
  const todayMs = parseLocalDateMs(formatLocalDateKey(referenceDate));
  return Math.round((targetMs - todayMs) / (1000 * 60 * 60 * 24));
}
