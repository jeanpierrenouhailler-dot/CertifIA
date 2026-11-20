/**
 * SM-2 / FSRS (Spaced Repetition System) Engine for CertifIA
 *
 * Implements SuperMemo SM-2 with FSRS-inspired retrievability & difficulty modeling:
 * - Dynamic interval calculations based on recall quality
 * - Adaptive Ease Factor (EF)
 * - Difficulty scaling (1 to 5)
 * - Success rate tracking (% based on recall history)
 * - Deterministic daily queue scheduling (separates genuinely due SRS cards from discovery cards)
 */

import type { Flashcard, FlashcardReviewRecord } from '../types';
import { getCurrentLanguage } from '../i18n';

export type SRSGrade = 'revoir' | 'difficile' | 'moyen' | 'facile';

export interface CardSRSMetrics {
  cardId: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  difficulty: number; // 1 to 5
  totalReviews: number;
  successReviews: number;
  successRate: number; // 0 to 100
  lastReviewedAt: string | null;
  nextReviewDate: string | null; // YYYY-MM-DD (local time)
  isDueToday: boolean;
  isOverdue: boolean;
  daysUntilDue: number;
}

export interface NextIntervalPredictions {
  revoir: { days: number; label: string; efChange: number };
  difficile: { days: number; label: string; efChange: number };
  moyen: { days: number; label: string; efChange: number };
  facile: { days: number; label: string; efChange: number };
}

/**
 * Formats a Date object as YYYY-MM-DD in local time.
 */
export function formatLocalDateKey(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD (or ISO string) into local midnight epoch ms to avoid UTC off-by-one shifts.
 */
export function parseLocalDateMs(dateStr: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    return new Date(year, month, day).getTime();
  }
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayDateString(referenceDate: Date = new Date()): string {
  return formatLocalDateKey(referenceDate);
}

/**
 * Extract or compute SRS metrics for a given card review record
 */
export function getCardSRSMetrics(
  cardId: string,
  review?: FlashcardReviewRecord,
  referenceDate: Date = new Date()
): CardSRSMetrics {
  const todayStr = getTodayDateString(referenceDate);
  const todayMs = parseLocalDateMs(todayStr);

  if (!review) {
    return {
      cardId,
      repetitions: 0,
      intervalDays: 0,
      easeFactor: 2.5,
      difficulty: 3,
      totalReviews: 0,
      successReviews: 0,
      successRate: 0,
      lastReviewedAt: null,
      nextReviewDate: null,
      isDueToday: false,
      isOverdue: false,
      daysUntilDue: 0,
    };
  }

  const repetitions = review.repetitions ?? (review.rating === 'revoir' ? 0 : review.intervalDays >= 7 ? 3 : 1);
  const intervalDays = review.intervalDays || 1;
  const easeFactor = review.easeFactor ?? 2.5;
  const difficulty = review.difficulty ?? (
    review.rating === 'revoir' ? 4 :
    review.rating === 'difficile' ? 4 :
    review.rating === 'moyen' ? 3 : 2
  );
  const totalReviews = review.totalReviews ?? (repetitions > 0 ? repetitions + 1 : 1);
  const successReviews = review.successReviews ?? (review.rating === 'revoir' ? Math.max(0, totalReviews - 1) : totalReviews);
  const successRate = totalReviews > 0 ? Math.round((successReviews / totalReviews) * 100) : 0;

  let nextReviewDate = review.nextReviewDate;
  if (!nextReviewDate && review.reviewedAt) {
    const revDate = new Date(review.reviewedAt);
    revDate.setDate(revDate.getDate() + intervalDays);
    nextReviewDate = formatLocalDateKey(revDate);
  }

  let isDueToday = false;
  let isOverdue = false;
  let daysUntilDue = 0;

  if (nextReviewDate) {
    const targetMs = parseLocalDateMs(nextReviewDate);
    const diffDays = Math.round((targetMs - todayMs) / (1000 * 60 * 60 * 24));
    daysUntilDue = diffDays;
    isDueToday = diffDays <= 0;
    isOverdue = diffDays < 0;
  }

  return {
    cardId,
    repetitions,
    intervalDays,
    easeFactor,
    difficulty,
    totalReviews,
    successReviews,
    successRate,
    lastReviewedAt: review.reviewedAt || null,
    nextReviewDate: nextReviewDate || null,
    isDueToday,
    isOverdue,
    daysUntilDue,
  };
}

/**
 * Predict next intervals for the 4 grading buttons based on SM-2 / FSRS algorithm
 */
export function predictNextIntervals(metrics: CardSRSMetrics): NextIntervalPredictions {
  const { repetitions, intervalDays, easeFactor } = metrics;

  const revoirDays = 1;

  let diffDays: number;
  if (repetitions === 0) {
    diffDays = 1;
  } else if (repetitions === 1) {
    diffDays = 2;
  } else {
    diffDays = Math.max(2, Math.round(intervalDays * 1.2));
  }

  let moyenDays: number;
  if (repetitions === 0) {
    moyenDays = 1;
  } else if (repetitions === 1) {
    moyenDays = 3;
  } else {
    moyenDays = Math.max(3, Math.round(intervalDays * easeFactor));
  }

  let facileDays: number;
  if (repetitions === 0) {
    facileDays = 3;
  } else if (repetitions === 1) {
    facileDays = 6;
  } else {
    facileDays = Math.max(7, Math.round(intervalDays * easeFactor * 1.35));
  }

  return {
    revoir: { days: revoirDays, label: `${revoirDays}j`, efChange: -0.2 },
    difficile: { days: diffDays, label: `${diffDays}j`, efChange: -0.15 },
    moyen: { days: moyenDays, label: `${moyenDays}j`, efChange: 0 },
    facile: { days: facileDays, label: `${facileDays}j`, efChange: +0.15 },
  };
}

/**
 * Calculates updated card state following SM-2 / FSRS algorithm
 */
export function calculateNextSRSState(
  currentMetrics: CardSRSMetrics,
  rating: SRSGrade,
  referenceDate: Date = new Date()
): {
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
  difficulty: number;
  totalReviews: number;
  successReviews: number;
  nextReviewDate: string;
} {
  const isSuccess = rating !== 'revoir';
  const newTotalReviews = currentMetrics.totalReviews + 1;
  const newSuccessReviews = currentMetrics.successReviews + (isSuccess ? 1 : 0);

  const quality = rating === 'revoir' ? 1 : rating === 'difficile' ? 3 : rating === 'moyen' ? 4 : 5;

  let ef = currentMetrics.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  ef = Math.max(1.3, Math.min(3.2, ef));
  ef = Math.round(ef * 100) / 100;

  let repetitions = currentMetrics.repetitions;
  let intervalDays = 1;

  if (rating === 'revoir') {
    repetitions = 0;
    intervalDays = 1;
  } else if (rating === 'difficile') {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 2;
    else intervalDays = Math.max(2, Math.round(currentMetrics.intervalDays * 1.2));
  } else if (rating === 'moyen') {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 3;
    else intervalDays = Math.max(3, Math.round(currentMetrics.intervalDays * ef));
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 3;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.max(7, Math.round(currentMetrics.intervalDays * ef * 1.35));
  }

  let difficulty = currentMetrics.difficulty;
  if (rating === 'revoir') {
    difficulty = Math.min(5, difficulty + 1);
  } else if (rating === 'difficile') {
    difficulty = Math.min(5, Math.max(1, difficulty + 0.5));
  } else if (rating === 'moyen') {
    if (difficulty > 3) difficulty = Math.max(3, difficulty - 0.2);
    else if (difficulty < 3) difficulty = Math.min(3, difficulty + 0.2);
  } else if (rating === 'facile') {
    difficulty = Math.max(1, difficulty - 1);
  }
  difficulty = Math.round(difficulty * 10) / 10;

  const nextDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() + intervalDays);
  const nextReviewDate = formatLocalDateKey(nextDate);

  return {
    intervalDays,
    repetitions,
    easeFactor: ef,
    difficulty,
    totalReviews: newTotalReviews,
    successReviews: newSuccessReviews,
    nextReviewDate,
  };
}

/**
 * Human readable formatting for flashcard card header
 */
export function formatSRSDisplay(metrics: CardSRSMetrics, promptNumberFallback: string, langOverride?: 'fr' | 'en') {
  const lang = langOverride || getCurrentLanguage();
  const isEn = lang === 'en';
  const cardNum = promptNumberFallback.replace(/[^0-9]/g, '') || '1';

  let lastReviewLabel = isEn ? 'Never reviewed' : 'Jamais révisée';
  if (metrics.lastReviewedAt) {
    const revDateKey = formatLocalDateKey(new Date(metrics.lastReviewedAt));
    const todayKey = getTodayDateString();
    const diffDays = Math.round((parseLocalDateMs(todayKey) - parseLocalDateMs(revDateKey)) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      lastReviewLabel = isEn ? 'today' : "aujourd'hui";
    } else if (diffDays === 1) {
      lastReviewLabel = isEn ? 'yesterday' : 'hier';
    } else {
      lastReviewLabel = isEn ? `${diffDays} days ago` : `il y a ${diffDays} jours`;
    }
  }

  const diffScore = Math.max(1, Math.min(5, Math.round(metrics.difficulty)));
  const diffLabel = `${diffScore}/5`;

  let nextReviewLabel = isEn ? 'Not scheduled' : 'Non planifiée';
  if (metrics.nextReviewDate) {
    if (metrics.daysUntilDue <= 0) {
      if (metrics.daysUntilDue < 0) {
        nextReviewLabel = isEn
          ? `today (${Math.abs(metrics.daysUntilDue)}d overdue)`
          : `aujourd'hui (retard ${Math.abs(metrics.daysUntilDue)}j)`;
      } else {
        nextReviewLabel = isEn ? 'today' : "aujourd'hui";
      }
    } else if (metrics.daysUntilDue === 1) {
      nextReviewLabel = isEn ? 'in 1 day' : 'dans 1 jour';
    } else {
      nextReviewLabel = isEn ? `in ${metrics.daysUntilDue} days` : `dans ${metrics.daysUntilDue} jours`;
    }
  }

  const repLabel = isEn
    ? (metrics.repetitions === 1 ? '1 repetition' : `${metrics.repetitions} repetitions`)
    : (metrics.repetitions === 1 ? '1 répétition' : `${metrics.repetitions} répétitions`);

  const successLabel = metrics.totalReviews > 0 ? `${metrics.successRate} %` : '—';

  return {
    cardNumber: isEn ? `Card #${cardNum}` : `Carte #${cardNum}`,
    lastReviewLabel,
    diffScore,
    diffLabel,
    nextReviewLabel,
    repCount: metrics.repetitions,
    repLabel,
    successRate: metrics.successRate,
    successLabel,
    isDueToday: metrics.isDueToday,
  };
}

/**
 * Truthful Daily Queue Generator:
 * - dueCards: strictly cards already reviewed whose nextReviewDate <= today (0 for a brand-new user)
 * - fragileCards: reviewed cards rated hard/revoir or low success rate
 * - discoveryCards: unreviewed cards up to targetQuota for starting/expanding study
 * - sessionCards: prioritized list combining due -> fragile -> discovery up to targetQuota
 */
export function computeDailyReviewQueue(
  cards: Flashcard[],
  reviews: Record<string, FlashcardReviewRecord>,
  targetQuota: number = 17,
  referenceDate: Date = new Date()
): {
  dueCards: Flashcard[];
  overdueCards: Flashcard[];
  dueTodayCards: Flashcard[];
  fragileCards: Flashcard[];
  newCards: Flashcard[];
  discoveryCards: Flashcard[];
  sessionCards: Flashcard[];
  totalDue: number;
} {
  const overdueCards: Flashcard[] = [];
  const dueTodayCards: Flashcard[] = [];
  const newCards: Flashcard[] = [];
  const fragileCards: Flashcard[] = [];

  cards.forEach((card) => {
    const rev = reviews[card.id];
    if (!rev) {
      newCards.push(card);
      return;
    }

    const metrics = getCardSRSMetrics(card.id, rev, referenceDate);
    if (metrics.isOverdue) {
      overdueCards.push(card);
    } else if (metrics.isDueToday) {
      dueTodayCards.push(card);
    }

    if (
      rev.rating === 'revoir' ||
      rev.rating === 'difficile' ||
      metrics.difficulty >= 4 ||
      (metrics.totalReviews > 0 && metrics.successRate < 70)
    ) {
      fragileCards.push(card);
    }
  });

  overdueCards.sort((a, b) => {
    const ma = getCardSRSMetrics(a.id, reviews[a.id], referenceDate);
    const mb = getCardSRSMetrics(b.id, reviews[b.id], referenceDate);
    return ma.daysUntilDue - mb.daysUntilDue;
  });

  const dueCards: Flashcard[] = [...overdueCards, ...dueTodayCards];
  const discoveryCards = newCards.slice(0, Math.min(targetQuota, newCards.length));

  const sessionCards: Flashcard[] = [...dueCards];
  for (const fc of fragileCards) {
    if (sessionCards.length >= targetQuota) break;
    if (!sessionCards.some((c) => c.id === fc.id)) {
      sessionCards.push(fc);
    }
  }
  for (const nc of discoveryCards) {
    if (sessionCards.length >= targetQuota) break;
    if (!sessionCards.some((c) => c.id === nc.id)) {
      sessionCards.push(nc);
    }
  }

  return {
    dueCards,
    overdueCards,
    dueTodayCards,
    fragileCards,
    newCards,
    discoveryCards,
    sessionCards,
    totalDue: dueCards.length,
  };
}
