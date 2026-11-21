import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type {
  FlashcardReviewRecord,
  ExamAttemptRecord,
  QuizAttemptRecord,
  CertificationProgress,
  UserProfile,
} from '../types';
import {
  calculateNextSRSState,
  getCardSRSMetrics,
  SRSGrade,
} from '../lib/srsAlgorithm';
import {
  certificationsData,
  getCertificationById,
  normalizeCertId,
} from '../data/certificationsData';
import {
  computeCertMetrics,
  computeGlobalMetrics,
  type ComputedCertMetrics,
  type GlobalUserMetrics,
} from '../lib/metricsEngine';

interface CertStats {
  maitriseCount: number;
  revoirCount: number;
  moyenCount: number;
  totalReviewed: number;
}

export interface GoalSettings {
  targetDate: string;
  weeklyTarget: number;
}

interface ProgressContextType {
  reviews: Record<string, FlashcardReviewRecord>;
  bookmarkedCardIds: Set<string>;
  certProgress: Record<string, CertificationProgress>;
  examAttempts: ExamAttemptRecord[];
  quizAttempts: Record<string, QuizAttemptRecord>;
  lastCardIndices: Record<string, number>;
  activeCertId: string;
  goalSettings: GoalSettings;
  globalMetrics: GlobalUserMetrics;
  setActiveCertId: (certId: string) => void;
  rateFlashcard: (
    cardId: string,
    certCode: string,
    rating: 'revoir' | 'difficile' | 'moyen' | 'maitrise' | 'facile',
    intervalDays?: number
  ) => Promise<void>;
  toggleBookmarkCard: (cardId: string, certCode: string) => Promise<void>;
  saveLastCardIndex: (certId: string, index: number) => void;
  recordQuizAttempt: (
    attempt: Omit<QuizAttemptRecord, 'answeredAt'>
  ) => QuizAttemptRecord;
  recordExamAttempt: (
    attempt: Omit<ExamAttemptRecord, 'id' | 'userId' | 'createdAt' | 'attemptNumber'>
  ) => Promise<ExamAttemptRecord>;
  updateGoalTarget: (
    targetExam: string,
    targetExamTitle: string,
    targetDate?: string,
    weeklyTarget?: number
  ) => Promise<void>;
  resetAllProgress: () => Promise<void>;
  getCardReview: (cardId: string) => FlashcardReviewRecord | undefined;
  getCertProgress: (certId: string) => CertificationProgress | undefined;
  getCertMetrics: (certId: string) => ComputedCertMetrics;
  getCertStats: (certId: string) => CertStats;
  isSyncing: boolean;
}

const LOCAL_STORAGE_REVIEWS_KEY = 'certifai_flashcard_reviews_v1';
const LOCAL_STORAGE_BOOKMARKS_KEY = 'certifai_flashcard_bookmarks_v1';
const LOCAL_STORAGE_INDICES_KEY = 'certifai_card_indices_v1';
const LOCAL_STORAGE_ATTEMPTS_KEY = 'certifai_exam_attempts_v1';
const LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY = 'certifai_quiz_attempts_v1';
const LOCAL_STORAGE_PROGRESS_KEY = 'certifai_cert_progress_v1';
const LOCAL_STORAGE_ACTIVE_CERT_KEY = 'certifai_active_cert_v1';
const LOCAL_STORAGE_GOAL_KEY = 'certifai_goal_settings_v1';
const LOCAL_STORAGE_GLOSSARY_BOOKMARKS_KEY = 'certifia_glossary_bookmarks';
const LOCAL_STORAGE_RECOMMENDATION_PROFILE_KEY = 'certifai_recommendation_profile_v1';

const defaultCertCodes: Record<string, string> = {
  c1000177: 'C1000-177',
  gcpmle: 'GCP-PMLE',
  aifc01: 'AIF-C01',
  mlsc01: 'MLS-C01',
  ai900: 'AI-900',
  ai102: 'AI-102',
};

const EMPTY_INDICES: Record<string, number> = {
  c1000177: 0,
  gcpmle: 0,
  aifc01: 0,
  mlsc01: 0,
  ai900: 0,
  ai102: 0,
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();

  // Active certification (canonicalized so legacy 'watsonx' becomes 'c1000177')
  const [activeCertId, setActiveCertIdState] = useState<string>(() => {
    try {
      return normalizeCertId(localStorage.getItem(LOCAL_STORAGE_ACTIVE_CERT_KEY));
    } catch {
      return 'c1000177';
    }
  });

  const setActiveCertId = useCallback((id: string) => {
    const canonical = normalizeCertId(id);
    setActiveCertIdState(canonical);
    try {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_CERT_KEY, canonical);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Persisted goal settings (targetDate / weeklyTarget) for both guest and signed-in users
  const [goalSettings, setGoalSettings] = useState<GoalSettings>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_GOAL_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          targetDate: typeof parsed.targetDate === 'string' ? parsed.targetDate : '',
          weeklyTarget: typeof parsed.weeklyTarget === 'number' && parsed.weeklyTarget > 0 ? parsed.weeklyTarget : 50,
        };
      }
    } catch {
      // ignore
    }
    return { targetDate: '', weeklyTarget: 50 };
  });

  // Flashcards reviews: starts genuinely empty ({})
  const [reviews, setReviews] = useState<Record<string, FlashcardReviewRecord>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return {};
  });

  const [bookmarkedCardIds, setBookmarkedCardIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [lastCardIndices, setLastCardIndices] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_INDICES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalized: Record<string, number> = { ...EMPTY_INDICES };
        Object.entries(parsed).forEach(([k, v]) => {
          if (typeof v === 'number') {
            normalized[normalizeCertId(k)] = v;
          }
        });
        return normalized;
      }
    } catch {
      // ignore
    }
    return { ...EMPTY_INDICES };
  });

  // Exam attempts: starts genuinely empty ([])
  const [examAttempts, setExamAttempts] = useState<ExamAttemptRecord[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ATTEMPTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return [];
  });

  // Quiz MCQ attempts: starts genuinely empty ({})
  const [quizAttempts, setQuizAttempts] = useState<Record<string, QuizAttemptRecord>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return {};
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync Firestore userProfile goals if authenticated
  useEffect(() => {
    if (!userProfile) return;
    if (userProfile.targetExam) {
      const canonical = normalizeCertId(userProfile.targetExam);
      setActiveCertIdState(canonical);
    }
    setGoalSettings((prev) => ({
      targetDate: userProfile.targetDate ?? prev.targetDate,
      weeklyTarget: userProfile.weeklyTarget ?? prev.weeklyTarget,
    }));
  }, [userProfile]);

  // Derived deterministic per-certification metrics & CertificationProgress dictionary
  const certMetricsMap = useMemo<Record<string, ComputedCertMetrics>>(() => {
    const result: Record<string, ComputedCertMetrics> = {};
    certificationsData.forEach((cert) => {
      result[cert.id] = computeCertMetrics({
        cert,
        reviews,
        quizAttempts,
        examAttempts,
      });
    });
    return result;
  }, [reviews, quizAttempts, examAttempts]);

  const certProgress = useMemo<Record<string, CertificationProgress>>(() => {
    const now = new Date().toISOString();
    const map: Record<string, CertificationProgress> = {};
    certificationsData.forEach((cert) => {
      const computed = certMetricsMap[cert.id];
      map[cert.id] = {
        id: cert.id,
        userId: user?.uid || 'guest-user',
        certCode: cert.code,
        progress: computed?.progress ?? 0,
        score: computed?.score ?? 0,
        readinessIndex: computed?.readinessIndex ?? 0,
        lastCardIndex: lastCardIndices[cert.id] ?? 0,
        reviewedCardsCount: computed?.flashcards.reviewedCount ?? 0,
        updatedAt: now,
      };
    });
    return map;
  }, [certMetricsMap, lastCardIndices, user]);

  const globalMetrics = useMemo<GlobalUserMetrics>(() => {
    return computeGlobalMetrics({
      certifications: certificationsData,
      activeCertId,
      reviews,
      quizAttempts,
      examAttempts,
    });
  }, [activeCertId, reviews, quizAttempts, examAttempts]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
      localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(Array.from(bookmarkedCardIds)));
      localStorage.setItem(LOCAL_STORAGE_INDICES_KEY, JSON.stringify(lastCardIndices));
      localStorage.setItem(LOCAL_STORAGE_ATTEMPTS_KEY, JSON.stringify(examAttempts));
      localStorage.setItem(LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY, JSON.stringify(quizAttempts));
      localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(certProgress));
      localStorage.setItem(LOCAL_STORAGE_GOAL_KEY, JSON.stringify(goalSettings));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [reviews, bookmarkedCardIds, lastCardIndices, examAttempts, quizAttempts, certProgress, goalSettings]);

  // Real-time Firestore sync when user is authenticated
  useEffect(() => {
    if (!user) return;

    setIsSyncing(true);

    const reviewsColRef = collection(db, 'users', user.uid, 'reviews');
    const unsubReviews = onSnapshot(
      reviewsColRef,
      (snapshot) => {
        const remoteReviews: Record<string, FlashcardReviewRecord> = {};
        const remoteBookmarks = new Set<string>();

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as FlashcardReviewRecord;
          const cardId = data.cardId || docSnap.id;
          remoteReviews[cardId] = {
            ...data,
            certCode: normalizeCertId(data.certCode),
          };
          if (data.isBookmarked) {
            remoteBookmarks.add(cardId);
          }
        });

        setReviews(remoteReviews);
        setBookmarkedCardIds(remoteBookmarks);
        setIsSyncing(false);
      },
      (error) => {
        if (error instanceof Error && (error.message.includes('unavailable') || error.message.includes('offline'))) {
          console.warn('[ProgressContext] Reviews snapshot offline:', error.message);
          setIsSyncing(false);
          return;
        }
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/reviews`);
        setIsSyncing(false);
      }
    );

    const attemptsColRef = collection(db, 'users', user.uid, 'attempts');
    const unsubAttempts = onSnapshot(
      attemptsColRef,
      (snapshot) => {
        const remoteAttempts: ExamAttemptRecord[] = [];
        snapshot.forEach((docSnap) => {
          remoteAttempts.push(docSnap.data() as ExamAttemptRecord);
        });
        remoteAttempts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setExamAttempts(remoteAttempts);
      },
      (error) => {
        if (error instanceof Error && (error.message.includes('unavailable') || error.message.includes('offline'))) {
          console.warn('[ProgressContext] Attempts snapshot offline:', error.message);
          return;
        }
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/attempts`);
      }
    );

    const certsColRef = collection(db, 'users', user.uid, 'certifications');
    const unsubCerts = onSnapshot(
      certsColRef,
      (snapshot) => {
        const nextIndices: Record<string, number> = { ...EMPTY_INDICES };
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as CertificationProgress;
          const canonicalId = normalizeCertId(docSnap.id);
          if (typeof data.lastCardIndex === 'number') {
            nextIndices[canonicalId] = data.lastCardIndex;
          }
        });
        setLastCardIndices(nextIndices);
      },
      (error) => {
        if (error instanceof Error && (error.message.includes('unavailable') || error.message.includes('offline'))) {
          console.warn('[ProgressContext] Certifications snapshot offline:', error.message);
          return;
        }
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/certifications`);
      }
    );

    return () => {
      unsubReviews();
      unsubAttempts();
      unsubCerts();
    };
  }, [user]);

  // Rate a flashcard using SM-2 / FSRS algorithm
  const rateFlashcard = useCallback(
    async (
      cardId: string,
      certCode: string,
      rating: 'revoir' | 'difficile' | 'moyen' | 'maitrise' | 'facile',
      intervalDays?: number
    ) => {
      const canonicalCertId = normalizeCertId(certCode);
      const now = new Date().toISOString();
      const isBookmarked = bookmarkedCardIds.has(cardId);

      const currentMetrics = getCardSRSMetrics(cardId, reviews[cardId]);
      const srsGrade: SRSGrade = (rating === 'maitrise' ? 'facile' : rating) as SRSGrade;
      const nextSRS = calculateNextSRSState(currentMetrics, srsGrade);
      const finalInterval = intervalDays ?? nextSRS.intervalDays;

      const record: FlashcardReviewRecord = {
        id: cardId,
        userId: user?.uid || 'guest-user',
        cardId,
        certCode: canonicalCertId,
        rating,
        intervalDays: finalInterval,
        repetitions: nextSRS.repetitions,
        easeFactor: nextSRS.easeFactor,
        difficulty: nextSRS.difficulty,
        totalReviews: nextSRS.totalReviews,
        successReviews: nextSRS.successReviews,
        nextReviewDate: nextSRS.nextReviewDate,
        isBookmarked,
        reviewedAt: now,
      };

      const nextReviews = {
        ...reviews,
        [cardId]: record,
      };
      setReviews(nextReviews);

      if (user) {
        try {
          const reviewRef = doc(db, 'users', user.uid, 'reviews', cardId);
          await setDoc(reviewRef, record, { merge: true });

          const certObj = getCertificationById(canonicalCertId);
          const updatedCertMetrics = computeCertMetrics({
            cert: certObj,
            reviews: nextReviews,
            quizAttempts,
            examAttempts,
          });
          const updatedGlobal = computeGlobalMetrics({
            certifications: certificationsData,
            activeCertId,
            reviews: nextReviews,
            quizAttempts,
            examAttempts,
          });

          const certDocRef = doc(db, 'users', user.uid, 'certifications', canonicalCertId);
          await setDoc(
            certDocRef,
            {
              id: canonicalCertId,
              userId: user.uid,
              certCode: defaultCertCodes[canonicalCertId] || canonicalCertId.toUpperCase(),
              progress: updatedCertMetrics.progress,
              score: updatedCertMetrics.score,
              readinessIndex: updatedCertMetrics.readinessIndex,
              reviewedCardsCount: updatedCertMetrics.flashcards.reviewedCount,
              updatedAt: now,
            },
            { merge: true }
          );

          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(
            userDocRef,
            {
              streakDays: updatedGlobal.streakDays,
              questionsSolved: updatedGlobal.questionsSolved,
              averageScore: updatedGlobal.averageScore,
              readinessIndex: updatedGlobal.readinessIndex,
              updatedAt: now,
            },
            { merge: true }
          );
        } catch (err) {
          if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
            console.warn('[ProgressContext] Offline review write queued locally:', err.message);
          } else {
            handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/reviews/${cardId}`);
          }
        }
      }
    },
    [bookmarkedCardIds, reviews, user, quizAttempts, examAttempts, activeCertId]
  );

  // Toggle bookmark for a card
  const toggleBookmarkCard = useCallback(
    async (cardId: string, certCode: string) => {
      const canonicalCertId = normalizeCertId(certCode);
      const currentlyBookmarked = bookmarkedCardIds.has(cardId);
      const nextIsBookmarked = !currentlyBookmarked;

      setBookmarkedCardIds((prev) => {
        const next = new Set(prev);
        if (nextIsBookmarked) next.add(cardId);
        else next.delete(cardId);
        return next;
      });

      const existing = reviews[cardId];
      if (!existing && !nextIsBookmarked) return;

      const now = new Date().toISOString();
      if (existing) {
        const updatedReview: FlashcardReviewRecord = {
          ...existing,
          certCode: canonicalCertId,
          isBookmarked: nextIsBookmarked,
        };
        setReviews((prev) => ({
          ...prev,
          [cardId]: updatedReview,
        }));
        if (user) {
          try {
            const reviewRef = doc(db, 'users', user.uid, 'reviews', cardId);
            await setDoc(reviewRef, updatedReview, { merge: true });
          } catch (err) {
            if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
              console.warn('[ProgressContext] Offline bookmark queued locally:', err.message);
            } else {
              handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/reviews/${cardId}`);
            }
          }
        }
      } else if (user) {
        // Persist bookmark without polluting review stats if card wasn't rated yet
        try {
          const reviewRef = doc(db, 'users', user.uid, 'reviews', cardId);
          await setDoc(
            reviewRef,
            {
              id: cardId,
              userId: user.uid,
              cardId,
              certCode: canonicalCertId,
              rating: 'moyen',
              intervalDays: 0,
              totalReviews: 0,
              successReviews: 0,
              isBookmarked: nextIsBookmarked,
              reviewedAt: now,
            },
            { merge: true }
          );
        } catch (err) {
          if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
            console.warn('[ProgressContext] Offline bookmark queued locally:', err.message);
          }
        }
      }
    },
    [bookmarkedCardIds, reviews, user]
  );

  // Save last visited card index for a certification
  const saveLastCardIndex = useCallback(
    (certId: string, index: number) => {
      const canonical = normalizeCertId(certId);
      setLastCardIndices((prev) => ({
        ...prev,
        [canonical]: index,
      }));

      if (user) {
        const certDocRef = doc(db, 'users', user.uid, 'certifications', canonical);
        setDoc(
          certDocRef,
          {
            id: canonical,
            userId: user.uid,
            certCode: defaultCertCodes[canonical] || canonical.toUpperCase(),
            lastCardIndex: index,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch((err) => {
          if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
            console.warn('[ProgressContext] Offline index queued locally:', err.message);
          } else {
            handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/certifications/${canonical}`);
          }
        });
      }
    },
    [user]
  );

  // Record a Quiz MCQ answer cleanly
  const recordQuizAttempt = useCallback(
    (attempt: Omit<QuizAttemptRecord, 'answeredAt'>): QuizAttemptRecord => {
      const record: QuizAttemptRecord = {
        ...attempt,
        certId: normalizeCertId(attempt.certId),
        answeredAt: new Date().toISOString(),
      };

      const nextQuizAttempts = {
        ...quizAttempts,
        [record.questionId]: record,
      };
      setQuizAttempts(nextQuizAttempts);

      if (user) {
        const now = record.answeredAt;
        const updatedGlobal = computeGlobalMetrics({
          certifications: certificationsData,
          activeCertId,
          reviews,
          quizAttempts: nextQuizAttempts,
          examAttempts,
        });
        setDoc(
          doc(db, 'users', user.uid),
          {
            streakDays: updatedGlobal.streakDays,
            questionsSolved: updatedGlobal.questionsSolved,
            averageScore: updatedGlobal.averageScore,
            readinessIndex: updatedGlobal.readinessIndex,
            updatedAt: now,
          },
          { merge: true }
        ).catch((err) => {
          console.warn('[ProgressContext] Quiz telemetry sync deferred:', err);
        });
      }

      return record;
    },
    [quizAttempts, user, activeCertId, reviews, examAttempts]
  );

  // Record an exam simulation attempt (Tentative 1, 2, 3...)
  const recordExamAttempt = useCallback(
    async (
      attemptData: Omit<ExamAttemptRecord, 'id' | 'userId' | 'createdAt' | 'attemptNumber'>
    ): Promise<ExamAttemptRecord> => {
      const certAttempts = examAttempts.filter((a) => a.examCode === attemptData.examCode);
      const attemptNumber = certAttempts.length + 1;
      const now = new Date().toISOString();
      const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const newRecord: ExamAttemptRecord = {
        ...attemptData,
        id: attemptId,
        userId: user?.uid || 'guest-user',
        attemptNumber,
        createdAt: now,
      };

      const nextAttempts = [newRecord, ...examAttempts];
      setExamAttempts(nextAttempts);

      if (user) {
        try {
          const attemptRef = doc(db, 'users', user.uid, 'attempts', attemptId);
          await setDoc(attemptRef, newRecord);

          const targetCertId = normalizeCertId(attemptData.examCode || activeCertId);
          const certObj = getCertificationById(targetCertId);
          const updatedCert = computeCertMetrics({
            cert: certObj,
            reviews,
            quizAttempts,
            examAttempts: nextAttempts,
          });
          const updatedGlobal = computeGlobalMetrics({
            certifications: certificationsData,
            activeCertId,
            reviews,
            quizAttempts,
            examAttempts: nextAttempts,
          });

          await setDoc(
            doc(db, 'users', user.uid, 'certifications', targetCertId),
            {
              id: targetCertId,
              userId: user.uid,
              certCode: certObj.code,
              progress: updatedCert.progress,
              score: updatedCert.score,
              readinessIndex: updatedCert.readinessIndex,
              updatedAt: now,
            },
            { merge: true }
          );

          await setDoc(
            doc(db, 'users', user.uid),
            {
              streakDays: updatedGlobal.streakDays,
              questionsSolved: updatedGlobal.questionsSolved,
              averageScore: updatedGlobal.averageScore,
              readinessIndex: updatedGlobal.readinessIndex,
              updatedAt: now,
            },
            { merge: true }
          );
        } catch (err) {
          if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
            console.warn('[ProgressContext] Offline exam attempt queued locally:', err.message);
          } else {
            handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/attempts/${attemptId}`);
          }
        }
      }

      return newRecord;
    },
    [examAttempts, user, activeCertId, reviews, quizAttempts]
  );

  // Update study goals (works for both guests and signed-in users)
  const updateGoalTarget = useCallback(
    async (
      targetExam: string,
      targetExamTitle: string,
      targetDate?: string,
      weeklyTarget?: number
    ) => {
      const canonical = normalizeCertId(targetExam);
      setActiveCertId(canonical);

      setGoalSettings((prev) => ({
        targetDate: targetDate !== undefined ? targetDate : prev.targetDate,
        weeklyTarget: weeklyTarget !== undefined ? weeklyTarget : prev.weeklyTarget,
      }));

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const payload: Partial<UserProfile> = {
            targetExam: canonical,
            targetExamTitle,
            updatedAt: new Date().toISOString(),
          };
          if (targetDate !== undefined) payload.targetDate = targetDate;
          if (weeklyTarget !== undefined) payload.weeklyTarget = weeklyTarget;

          await setDoc(userDocRef, payload, { merge: true });
        } catch (err) {
          if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
            console.warn('[ProgressContext] Offline goal update queued locally:', err.message);
          } else {
            handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
          }
        }
      }
    },
    [user, setActiveCertId]
  );

  // Full reset (all localStorage learning/preference data + all authenticated Firestore collections)
  const resetAllProgress = useCallback(async () => {
    setActiveCertIdState('c1000177');
    setReviews({});
    setBookmarkedCardIds(new Set());
    setLastCardIndices({ ...EMPTY_INDICES });
    setExamAttempts([]);
    setQuizAttempts({});
    setGoalSettings({ targetDate: '', weeklyTarget: 50 });

    try {
      localStorage.removeItem(LOCAL_STORAGE_REVIEWS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_BOOKMARKS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_INDICES_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ATTEMPTS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_PROGRESS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ACTIVE_CERT_KEY);
      localStorage.removeItem(LOCAL_STORAGE_GOAL_KEY);
      localStorage.removeItem(LOCAL_STORAGE_GLOSSARY_BOOKMARKS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_RECOMMENDATION_PROFILE_KEY);
    } catch (e) {
      console.warn('LocalStorage clear error:', e);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('certifia:data-reset'));
    }

    if (user) {
      try {
        const [reviewsSnap, attemptsSnap, certsSnap] = await Promise.all([
          getDocs(collection(db, 'users', user.uid, 'reviews')),
          getDocs(collection(db, 'users', user.uid, 'attempts')),
          getDocs(collection(db, 'users', user.uid, 'certifications')),
        ]);

        await Promise.all([
          ...reviewsSnap.docs.map((d) => deleteDoc(d.ref)),
          ...attemptsSnap.docs.map((d) => deleteDoc(d.ref)),
          ...certsSnap.docs.map((d) => deleteDoc(d.ref)),
        ]);

        await setDoc(
          doc(db, 'users', user.uid),
          {
            targetExam: 'c1000177',
            targetExamTitle: 'IBM watsonx.ai Specialist (C1000-177)',
            targetDate: '',
            weeklyTarget: 50,
            streakDays: 0,
            questionsSolved: 0,
            averageScore: 0,
            readinessIndex: 0,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
          console.warn('[ProgressContext] Remote reset offline, local state cleared:', err.message);
        } else {
          handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}`);
        }
      }
    }
  }, [user]);

  const getCardReview = useCallback(
    (cardId: string) => {
      return reviews[cardId];
    },
    [reviews]
  );

  const getCertProgress = useCallback(
    (certId: string) => {
      return certProgress[normalizeCertId(certId)];
    },
    [certProgress]
  );

  const getCertMetrics = useCallback(
    (certId: string): ComputedCertMetrics => {
      const canonical = normalizeCertId(certId);
      if (certMetricsMap[canonical]) return certMetricsMap[canonical];
      const certObj = getCertificationById(canonical);
      return computeCertMetrics({
        cert: certObj,
        reviews,
        quizAttempts,
        examAttempts,
      });
    },
    [certMetricsMap, reviews, quizAttempts, examAttempts]
  );

  const getCertStats = useCallback(
    (certId: string): CertStats => {
      const m = getCertMetrics(certId).flashcards;
      return {
        maitriseCount: m.masteredCount,
        revoirCount: m.fragileCount,
        moyenCount: m.learningCount,
        totalReviewed: m.reviewedCount,
      };
    },
    [getCertMetrics]
  );

  return (
    <ProgressContext.Provider
      value={{
        reviews,
        bookmarkedCardIds,
        certProgress,
        examAttempts,
        quizAttempts,
        lastCardIndices,
        activeCertId,
        goalSettings,
        globalMetrics,
        setActiveCertId,
        rateFlashcard,
        toggleBookmarkCard,
        saveLastCardIndex,
        recordQuizAttempt,
        recordExamAttempt,
        updateGoalTarget,
        resetAllProgress,
        getCardReview,
        getCertProgress,
        getCertMetrics,
        getCertStats,
        isSyncing,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
