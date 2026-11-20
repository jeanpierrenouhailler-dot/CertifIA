import test from 'node:test';
import assert from 'node:assert/strict';

import {
  certificationsData,
  CERTIFICATIONS_COUNT,
  getCertificationById,
  normalizeCertId,
} from '../src/data/certificationsData';
import {
  getFlashcardsForCert,
  TOTAL_FLASHCARDS_COUNT,
} from '../src/data/flashcardsData';
import {
  calculateNextSRSState,
  computeDailyReviewQueue,
  formatLocalDateKey,
  getCardSRSMetrics,
  parseLocalDateMs,
} from '../src/lib/srsAlgorithm';
import {
  computeCertMetrics,
  computeGlobalMetrics,
  computeQuizMetrics,
  computeStreakDays,
  diffLocalDays,
} from '../src/lib/metricsEngine';
import type { ExamAttemptRecord, FlashcardReviewRecord, QuizAttemptRecord, QuizQuestion } from '../src/types';

test('Canonical catalog & deck constants match actual data', () => {
  assert.equal(CERTIFICATIONS_COUNT, 6);
  assert.equal(certificationsData.length, 6);
  assert.equal(TOTAL_FLASHCARDS_COUNT, 2800);

  // IBM canonical normalization
  assert.equal(normalizeCertId('watsonx'), 'c1000177');
  assert.equal(normalizeCertId('C1000-177'), 'c1000177');
  assert.equal(normalizeCertId('c1000177'), 'c1000177');
  assert.equal(normalizeCertId('AI-102'), 'ai102');
  assert.equal(getCertificationById('watsonx').id, 'c1000177');

  // Every certification starts with zeroed static progress/mastery
  for (const cert of certificationsData) {
    assert.equal(cert.userProgress, 0);
    for (const dom of cert.domains) {
      assert.equal(dom.mastery, 0);
    }
  }
});

test('Local date helpers format and diff deterministically without UTC shift', () => {
  const ref = new Date(2026, 10, 16, 23, 45, 0); // 2026-11-16 23:45 local
  const key = formatLocalDateKey(ref);
  assert.equal(key, '2026-11-16');

  const ms1 = parseLocalDateMs('2026-11-16');
  const ms2 = parseLocalDateMs('2026-11-19');
  assert.equal(Math.round((ms2 - ms1) / (1000 * 60 * 60 * 24)), 3);
  assert.equal(diffLocalDays('2026-11-19', ref), 3);
  assert.equal(diffLocalDays('2026-11-14', ref), -2);
});

test('SM-2 / FSRS state transitions calculate intervals and Ease Factor bounds accurately', () => {
  const ref = new Date(2026, 10, 16, 10, 0, 0);
  const initial = getCardSRSMetrics('c1', undefined, ref);
  assert.equal(initial.repetitions, 0);
  assert.equal(initial.easeFactor, 2.5);
  assert.equal(initial.totalReviews, 0);

  // First "facile" rating -> 3 days, EF increases within [1.3, 3.2]
  const step1 = calculateNextSRSState(initial, 'facile', ref);
  assert.equal(step1.repetitions, 1);
  assert.equal(step1.intervalDays, 3);
  assert.equal(step1.nextReviewDate, '2026-11-19');
  assert.equal(step1.totalReviews, 1);
  assert.equal(step1.successReviews, 1);
  assert.ok(step1.easeFactor >= 2.5 && step1.easeFactor <= 3.2);

  // Simulate lapse with "revoir" -> resets repetitions to 0 and interval to 1
  const metricsAfterStep1 = getCardSRSMetrics(
    'c1',
    {
      id: 'rev-1',
      userId: 'test-user',
      cardId: 'c1',
      certCode: 'ai102',
      rating: 'facile',
      intervalDays: step1.intervalDays,
      reviewedAt: ref.toISOString(),
      repetitions: step1.repetitions,
      easeFactor: step1.easeFactor,
      difficulty: step1.difficulty,
      totalReviews: step1.totalReviews,
      successReviews: step1.successReviews,
      nextReviewDate: step1.nextReviewDate,
    },
    ref
  );

  const step2 = calculateNextSRSState(metricsAfterStep1, 'revoir', ref);
  assert.equal(step2.repetitions, 0);
  assert.equal(step2.intervalDays, 1);
  assert.equal(step2.nextReviewDate, '2026-11-17');
  assert.equal(step2.totalReviews, 2);
  assert.equal(step2.successReviews, 1);
  assert.ok(step2.easeFactor >= 1.3);
});

test('Clean empty state guarantees strict zero metrics across global and per-cert computations', () => {
  const ref = new Date(2026, 10, 16, 10, 0, 0);
  const globalEmpty = computeGlobalMetrics({
    certifications: certificationsData,
    activeCertId: 'ai102',
    reviews: {},
    quizAttempts: {},
    examAttempts: [],
    referenceDate: ref,
  });

  assert.equal(globalEmpty.streakDays, 0);
  assert.equal(globalEmpty.cardsReviewedTotal, 0);
  assert.equal(globalEmpty.questionsSolved, 0);
  assert.equal(globalEmpty.quizSolvedCount, 0);
  assert.equal(globalEmpty.examAttemptsCount, 0);
  assert.equal(globalEmpty.averageScore, 0);
  assert.equal(globalEmpty.readinessIndex, 0);
  assert.equal(globalEmpty.recentActivities.length, 0);

  for (const cert of certificationsData) {
    const cm = computeCertMetrics({
      cert,
      reviews: {},
      quizAttempts: {},
      examAttempts: [],
      referenceDate: ref,
    });
    assert.equal(cm.hasActivity, false);
    assert.equal(cm.progress, 0);
    assert.equal(cm.score, 0);
    assert.equal(cm.readinessIndex, 0);
    assert.equal(cm.flashcards.reviewedCount, 0);
    assert.equal(cm.flashcards.dueCount, 0);
    assert.equal(cm.flashcards.masteredCount, 0);
    assert.equal(cm.flashcards.fragileCount, 0);
    assert.equal(cm.exams.attemptCount, 0);
  }
});

test('Daily review queue separates due, fragile, and unreviewed discovery cards accurately', () => {
  const ref = new Date(2026, 10, 16, 12, 0, 0);
  const cards = getFlashcardsForCert('ai102').slice(0, 10);

  // Brand-new deck: 0 due, 0 fragile, 10 newCards
  const emptyQueue = computeDailyReviewQueue(cards, {}, 5, ref);
  assert.equal(emptyQueue.totalDue, 0);
  assert.equal(emptyQueue.dueCards.length, 0);
  assert.equal(emptyQueue.fragileCards.length, 0);
  assert.equal(emptyQueue.newCards.length, 10);
  assert.equal(emptyQueue.sessionCards.length, 5);

  // Add one overdue card + one fragile card scheduled for future
  const reviews: Record<string, FlashcardReviewRecord> = {
    [cards[0].id]: {
      id: `rev-${cards[0].id}`,
      userId: 'test-user',
      cardId: cards[0].id,
      certCode: 'ai102',
      rating: 'moyen',
      intervalDays: 3,
      reviewedAt: new Date(2026, 10, 10, 10, 0, 0).toISOString(),
      nextReviewDate: '2026-11-15', // overdue
      repetitions: 2,
      easeFactor: 2.5,
      difficulty: 3,
      totalReviews: 2,
      successReviews: 2,
    },
    [cards[1].id]: {
      id: `rev-${cards[1].id}`,
      userId: 'test-user',
      cardId: cards[1].id,
      certCode: 'ai102',
      rating: 'revoir',
      intervalDays: 1,
      reviewedAt: new Date(2026, 10, 16, 9, 0, 0).toISOString(),
      nextReviewDate: '2026-11-17', // tomorrow -> not due today, but fragile
      repetitions: 0,
      easeFactor: 2.1,
      difficulty: 4,
      totalReviews: 2,
      successReviews: 0,
    },
  };

  const activeQueue = computeDailyReviewQueue(cards, reviews, 5, ref);
  assert.equal(activeQueue.totalDue, 1);
  assert.equal(activeQueue.overdueCards.length, 1);
  assert.equal(activeQueue.fragileCards.length, 1);
  assert.equal(activeQueue.sessionCards[0].id, cards[0].id);
  assert.equal(activeQueue.sessionCards[1].id, cards[1].id);
});

test('Metrics engine reflects persisted flashcards, quiz attempts, exam attempts, and streak accurately', () => {
  const ref = new Date(2026, 10, 16, 14, 0, 0);
  const ai102 = getCertificationById('ai102');
  const ai102Cards = getFlashcardsForCert('ai102');

  const reviews: Record<string, FlashcardReviewRecord> = {
    [ai102Cards[0].id]: {
      id: `rev-${ai102Cards[0].id}`,
      userId: 'test-user',
      cardId: ai102Cards[0].id,
      certCode: 'ai102',
      rating: 'facile',
      intervalDays: 14,
      reviewedAt: new Date(2026, 10, 16, 9, 0, 0).toISOString(),
      nextReviewDate: '2026-11-30',
      repetitions: 3,
      easeFactor: 2.7,
      difficulty: 1.5,
      totalReviews: 3,
      successReviews: 3,
    },
  };

  const quizAttempts: Record<string, QuizAttemptRecord> = {
    q1: {
      questionId: 'q1',
      certId: 'ai102',
      certCode: 'AI-102',
      domain: 'RAG & Search',
      selectedKey: 'B',
      correctKey: 'B',
      isCorrect: true,
      answeredAt: new Date(2026, 10, 15, 18, 0, 0).toISOString(),
    },
    q2: {
      questionId: 'q2',
      certId: 'ai102',
      certCode: 'AI-102',
      domain: 'Vision',
      selectedKey: 'A',
      correctKey: 'C',
      isCorrect: false,
      answeredAt: new Date(2026, 10, 14, 18, 0, 0).toISOString(),
    },
  };

  const examAttempts: ExamAttemptRecord[] = [
    {
      id: 'exam-1',
      userId: 'test-user',
      examCode: 'AI-102',
      examTitle: 'Azure AI Engineer Associate',
      attemptNumber: 1,
      score: 800,
      maxScore: 1000,
      passed: true,
      duration: '45 min',
      weakPoint: 'Computer Vision',
      createdAt: new Date(2026, 10, 16, 11, 0, 0).toISOString(),
      questionsAnswered: 50,
      correctCount: 40,
      questionsTotal: 50,
    },
  ];

  // 3 consecutive days: Nov 14, Nov 15, Nov 16
  const streak = computeStreakDays(
    [reviews[ai102Cards[0].id].reviewedAt, quizAttempts.q1.answeredAt, quizAttempts.q2.answeredAt],
    ref
  );
  assert.equal(streak, 3);

  const certMetrics = computeCertMetrics({
    cert: ai102,
    reviews,
    quizAttempts,
    examAttempts,
    referenceDate: ref,
  });

  assert.equal(certMetrics.hasActivity, true);
  assert.equal(certMetrics.flashcards.reviewedCount, 1);
  assert.equal(certMetrics.flashcards.masteredCount, 1);
  assert.equal(certMetrics.exams.attemptCount, 1);
  assert.equal(certMetrics.exams.passedCount, 1);
  assert.equal(certMetrics.exams.averagePct, 80);
  // Weighted: 80 * 0.45 + 50 * 0.25 + 100 * 0.30 = 36 + 12.5 + 30 = 78.5 -> 79
  assert.equal(certMetrics.readinessIndex, 79);

  const globalMetrics = computeGlobalMetrics({
    certifications: certificationsData,
    activeCertId: 'ai102',
    reviews,
    quizAttempts,
    examAttempts,
    referenceDate: ref,
  });

  assert.equal(globalMetrics.streakDays, 3);
  assert.equal(globalMetrics.cardsReviewedTotal, 1);
  assert.equal(globalMetrics.quizSolvedCount, 2);
  assert.equal(globalMetrics.examAttemptsCount, 1);
  assert.equal(globalMetrics.questionsSolved, 52);
  assert.equal(globalMetrics.readinessIndex, 79);
  assert.equal(globalMetrics.recentActivities.length, 4);

  // Quiz pool computation
  const fakePool = [
    { id: 'q1' } as QuizQuestion,
    { id: 'q2' } as QuizQuestion,
    { id: 'q3' } as QuizQuestion,
  ];
  const quizMetrics = computeQuizMetrics(fakePool, quizAttempts);
  assert.equal(quizMetrics.solvedCount, 2);
  assert.equal(quizMetrics.correctCount, 1);
  assert.equal(quizMetrics.incorrectCount, 1);
  assert.equal(quizMetrics.accuracyPct, 50);
  assert.deepEqual(quizMetrics.incorrectQuestionIds, ['q2']);
  assert.deepEqual(quizMetrics.unansweredQuestionIds, ['q3']);
});
