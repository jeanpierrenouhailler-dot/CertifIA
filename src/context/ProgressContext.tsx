import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type { 
  FlashcardReviewRecord, 
  ExamAttemptRecord, 
  CertificationProgress, 
  UserProfile 
} from '../types';
import { 
  calculateNextSRSState, 
  getCardSRSMetrics, 
  generateDefaultSeedReviews, 
  SRSGrade 
} from '../lib/srsAlgorithm';

interface CertStats {
  maitriseCount: number;
  revoirCount: number;
  moyenCount: number;
  totalReviewed: number;
}

interface ProgressContextType {
  reviews: Record<string, FlashcardReviewRecord>;
  bookmarkedCardIds: Set<string>;
  certProgress: Record<string, CertificationProgress>;
  examAttempts: ExamAttemptRecord[];
  lastCardIndices: Record<string, number>;
  activeCertId: string;
  setActiveCertId: (certId: string) => void;
  rateFlashcard: (
    cardId: string, 
    certCode: string, 
    rating: 'revoir' | 'difficile' | 'moyen' | 'maitrise' | 'facile', 
    intervalDays?: number
  ) => Promise<void>;
  toggleBookmarkCard: (cardId: string, certCode: string) => Promise<void>;
  saveLastCardIndex: (certId: string, index: number) => void;
  recordExamAttempt: (
    attempt: Omit<ExamAttemptRecord, 'id' | 'userId' | 'createdAt' | 'attemptNumber'>
  ) => Promise<ExamAttemptRecord>;
  updateGoalTarget: (
    targetExam: string, 
    targetExamTitle: string, 
    targetDate?: string, 
    weeklyTarget?: number
  ) => Promise<void>;
  getCardReview: (cardId: string) => FlashcardReviewRecord | undefined;
  getCertProgress: (certId: string) => CertificationProgress | undefined;
  getCertStats: (certId: string) => CertStats;
  isSyncing: boolean;
}

const LOCAL_STORAGE_REVIEWS_KEY = 'certifai_flashcard_reviews_v1';
const LOCAL_STORAGE_BOOKMARKS_KEY = 'certifai_flashcard_bookmarks_v1';
const LOCAL_STORAGE_INDICES_KEY = 'certifai_card_indices_v1';
const LOCAL_STORAGE_ATTEMPTS_KEY = 'certifai_exam_attempts_v1';
const LOCAL_STORAGE_PROGRESS_KEY = 'certifai_cert_progress_v1';
const LOCAL_STORAGE_ACTIVE_CERT_KEY = 'certifai_active_cert_v1';

const defaultCertCodes: Record<string, string> = {
  c1000177: 'C1000-177',
  gcpmle: 'GCP-PMLE',
  aifc01: 'AIF-C01',
  mlsc01: 'MLS-C01',
  ai900: 'AI-900',
  ai102: 'AI-102',
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Active certification
  const [activeCertId, setActiveCertIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_ACTIVE_CERT_KEY) || 'c1000177';
    } catch {
      return 'c1000177';
    }
  });

  const setActiveCertId = useCallback((id: string) => {
    setActiveCertIdState(id);
    try {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_CERT_KEY, id);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Flashcards state
  const [reviews, setReviews] = useState<Record<string, FlashcardReviewRecord>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Object.keys(parsed).length > 0) {
          // If Card #127 or base seeds are missing, merge them
          const seeds = generateDefaultSeedReviews();
          return { ...seeds, ...parsed };
        }
      }
      return generateDefaultSeedReviews();
    } catch {
      return generateDefaultSeedReviews();
    }
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
      return stored ? JSON.parse(stored) : { c1000177: 0, gcpmle: 0, aifc01: 0, mlsc01: 0, ai900: 0, ai102: 0 };
    } catch {
      return { c1000177: 0, gcpmle: 0, aifc01: 0, mlsc01: 0, ai900: 0, ai102: 0 };
    }
  });

  // Exam attempts
  const [examAttempts, setExamAttempts] = useState<ExamAttemptRecord[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ATTEMPTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    // Seed default baseline attempts so the UI looks alive even initially
    return [
      {
        id: 'attempt-init-1',
        userId: 'guest',
        examCode: 'AI-102',
        examTitle: 'Azure AI Engineer Associate',
        attemptNumber: 1,
        score: 742,
        maxScore: 1000,
        passed: true,
        duration: '1h 24m',
        weakPoint: 'Azure OpenAI & Prompt Engineering',
        domainScoresSummary: '{"Gouvernance": 88, "Vision": 74, "NLP": 68, "Azure OpenAI": 62, "Sécurité": 82}',
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
      {
        id: 'attempt-init-2',
        userId: 'guest',
        examCode: 'AIF-C01',
        examTitle: 'AWS Certified AI Practitioner',
        attemptNumber: 1,
        score: 680,
        maxScore: 1000,
        passed: false,
        duration: '1h 10m',
        weakPoint: 'Amazon Bedrock Knowledge Bases & Guardrails',
        domainScoresSummary: '{"Fondamentaux": 75, "GenAI": 72, "Bedrock": 60, "IA Responsable": 70, "Sécurité": 65}',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'attempt-init-3',
        userId: 'guest',
        examCode: 'C1000-177',
        examTitle: 'IBM watsonx.ai Specialist v1.0',
        attemptNumber: 1,
        score: 790,
        maxScore: 1000,
        passed: true,
        duration: '52m 14s',
        weakPoint: 'watsonx.governance Disparate Impact & AI Act',
        domainScoresSummary: '{"Studio": 85, "Lakehouse": 80, "Governance": 70, "SDK": 75}',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      }
    ];
  });

  // Cert progress
  const [certProgress, setCertProgress] = useState<Record<string, CertificationProgress>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROGRESS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return {
      c1000177: {
        id: 'c1000177',
        userId: 'local',
        certCode: 'C1000-177',
        progress: 42,
        score: 79,
        readinessIndex: 78,
        lastCardIndex: 0,
        reviewedCardsCount: 54,
        updatedAt: new Date().toISOString(),
      },
      ai102: {
        id: 'ai102',
        userId: 'local',
        certCode: 'AI-102',
        progress: 74,
        score: 84,
        readinessIndex: 82,
        lastCardIndex: 0,
        reviewedCardsCount: 88,
        updatedAt: new Date().toISOString(),
      },
      aifc01: {
        id: 'aifc01',
        userId: 'local',
        certCode: 'AIF-C01',
        progress: 45,
        score: 68,
        readinessIndex: 65,
        lastCardIndex: 0,
        reviewedCardsCount: 36,
        updatedAt: new Date().toISOString(),
      },
      gcpmle: {
        id: 'gcpmle',
        userId: 'local',
        certCode: 'GCP-PMLE',
        progress: 25,
        score: 71,
        readinessIndex: 60,
        lastCardIndex: 0,
        reviewedCardsCount: 22,
        updatedAt: new Date().toISOString(),
      },
      mlsc01: {
        id: 'mlsc01',
        userId: 'local',
        certCode: 'MLS-C01',
        progress: 30,
        score: 70,
        readinessIndex: 62,
        lastCardIndex: 0,
        reviewedCardsCount: 20,
        updatedAt: new Date().toISOString(),
      },
      ai900: {
        id: 'ai900',
        userId: 'local',
        certCode: 'AI-900',
        progress: 85,
        score: 92,
        readinessIndex: 90,
        lastCardIndex: 0,
        reviewedCardsCount: 95,
        updatedAt: new Date().toISOString(),
      },
    };
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
      localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(Array.from(bookmarkedCardIds)));
      localStorage.setItem(LOCAL_STORAGE_INDICES_KEY, JSON.stringify(lastCardIndices));
      localStorage.setItem(LOCAL_STORAGE_ATTEMPTS_KEY, JSON.stringify(examAttempts));
      localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(certProgress));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [reviews, bookmarkedCardIds, lastCardIndices, examAttempts, certProgress]);

  // Real-time Firestore sync when user is authenticated
  useEffect(() => {
    if (!user) return;

    setIsSyncing(true);

    // 1. Listen to /users/{userId}/reviews
    const reviewsColRef = collection(db, 'users', user.uid, 'reviews');
    const unsubReviews = onSnapshot(
      reviewsColRef,
      (snapshot) => {
        const remoteReviews: Record<string, FlashcardReviewRecord> = {};
        const remoteBookmarks = new Set<string>();

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as FlashcardReviewRecord;
          remoteReviews[data.cardId || docSnap.id] = data;
          if (data.isBookmarked) {
            remoteBookmarks.add(data.cardId || docSnap.id);
          }
        });

        // Merge with existing state (remote takes precedence, keeping any local cards not yet synced)
        setReviews((prev) => ({ ...prev, ...remoteReviews }));
        setBookmarkedCardIds((prev) => {
          const next = new Set(prev);
          remoteBookmarks.forEach((id) => next.add(id));
          return next;
        });
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

    // 2. Listen to /users/{userId}/attempts
    const attemptsColRef = collection(db, 'users', user.uid, 'attempts');
    const unsubAttempts = onSnapshot(
      attemptsColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteAttempts: ExamAttemptRecord[] = [];
          snapshot.forEach((docSnap) => {
            remoteAttempts.push(docSnap.data() as ExamAttemptRecord);
          });
          // Sort newest first
          remoteAttempts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setExamAttempts(remoteAttempts);
        }
      },
      (error) => {
        if (error instanceof Error && (error.message.includes('unavailable') || error.message.includes('offline'))) {
          console.warn('[ProgressContext] Attempts snapshot offline:', error.message);
          return;
        }
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/attempts`);
      }
    );

    // 3. Listen to /users/{userId}/certifications
    const certsColRef = collection(db, 'users', user.uid, 'certifications');
    const unsubCerts = onSnapshot(
      certsColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteProgress: Record<string, CertificationProgress> = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as CertificationProgress;
            remoteProgress[docSnap.id] = data;
            if (data.lastCardIndex !== undefined) {
              setLastCardIndices((prev) => ({ ...prev, [docSnap.id]: data.lastCardIndex }));
            }
          });
          setCertProgress((prev) => ({ ...prev, ...remoteProgress }));
        }
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
  const rateFlashcard = useCallback(async (
    cardId: string, 
    certCode: string, 
    rating: 'revoir' | 'difficile' | 'moyen' | 'maitrise' | 'facile', 
    intervalDays?: number
  ) => {
    const now = new Date().toISOString();
    const isBookmarked = bookmarkedCardIds.has(cardId);
    
    // Compute updated SM-2 / FSRS metrics
    const currentMetrics = getCardSRSMetrics(cardId, reviews[cardId]);
    const srsGrade: SRSGrade = (rating === 'maitrise' ? 'facile' : rating) as SRSGrade;
    const nextSRS = calculateNextSRSState(currentMetrics, srsGrade);
    const finalInterval = intervalDays ?? nextSRS.intervalDays;

    const record: FlashcardReviewRecord = {
      id: cardId,
      userId: user?.uid || 'guest-user',
      cardId,
      certCode,
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

    // Immediate optimistic local update
    setReviews((prev) => ({
      ...prev,
      [cardId]: record,
    }));

    // Update cert progression metrics
    setCertProgress((prev) => {
      const current = prev[certCode] || {
        id: certCode,
        userId: user?.uid || 'guest-user',
        certCode: defaultCertCodes[certCode] || certCode.toUpperCase(),
        progress: 10,
        score: 75,
        readinessIndex: 70,
        lastCardIndex: 0,
        reviewedCardsCount: 0,
        updatedAt: now,
      };

      const newReviewedCount = (current.reviewedCardsCount || 0) + 1;
      const calculatedProgress = Math.min(100, Math.round((newReviewedCount / 100) * 100));

      return {
        ...prev,
        [certCode]: {
          ...current,
          reviewedCardsCount: newReviewedCount,
          progress: calculatedProgress,
          updatedAt: now,
        },
      };
    });

    // Write to Firestore if signed in
    if (user) {
      try {
        const reviewRef = doc(db, 'users', user.uid, 'reviews', cardId);
        await setDoc(reviewRef, record, { merge: true });

        // Update cert subcollection doc
        const certDocRef = doc(db, 'users', user.uid, 'certifications', certCode);
        await setDoc(certDocRef, {
          id: certCode,
          userId: user.uid,
          certCode: defaultCertCodes[certCode] || certCode.toUpperCase(),
          updatedAt: now,
          reviewedCardsCount: (certProgress[certCode]?.reviewedCardsCount || 0) + 1,
        }, { merge: true });
      } catch (err) {
        if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
          console.warn('[ProgressContext] Offline review write queued locally:', err.message);
        } else {
          handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/reviews/${cardId}`);
        }
      }
    }
  }, [bookmarkedCardIds, user, certProgress]);

  // Toggle bookmark for a card
  const toggleBookmarkCard = useCallback(async (cardId: string, certCode: string) => {
    let nextIsBookmarked = false;
    setBookmarkedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
        nextIsBookmarked = false;
      } else {
        next.add(cardId);
        nextIsBookmarked = true;
      }
      return next;
    });

    // Update reviews record
    const existing = reviews[cardId];
    const now = new Date().toISOString();
    const updatedReview: FlashcardReviewRecord = {
      id: cardId,
      userId: user?.uid || 'guest-user',
      cardId,
      certCode,
      rating: existing?.rating || 'revoir',
      intervalDays: existing?.intervalDays ?? 1,
      isBookmarked: nextIsBookmarked,
      reviewedAt: existing?.reviewedAt || now,
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
  }, [reviews, user]);

  // Save last visited card index for a certification
  const saveLastCardIndex = useCallback((certId: string, index: number) => {
    setLastCardIndices((prev) => ({
      ...prev,
      [certId]: index,
    }));

    if (user) {
      const certDocRef = doc(db, 'users', user.uid, 'certifications', certId);
      setDoc(certDocRef, {
        id: certId,
        userId: user.uid,
        certCode: defaultCertCodes[certId] || certId.toUpperCase(),
        lastCardIndex: index,
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch((err) => {
        if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
          console.warn('[ProgressContext] Offline index queued locally:', err.message);
        } else {
          handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/certifications/${certId}`);
        }
      });
    }
  }, [user]);

  // Record an exam simulation attempt (Tentative 1, 2, 3...)
  const recordExamAttempt = useCallback(async (
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

    // Update local state
    setExamAttempts((prev) => [newRecord, ...prev]);

    // Update cert score and readiness
    const targetCertId = activeCertId;
    const pctScore = Math.round((attemptData.score / attemptData.maxScore) * 100);

    setCertProgress((prev) => {
      const existing = prev[targetCertId] || {
        id: targetCertId,
        userId: user?.uid || 'guest-user',
        certCode: attemptData.examCode,
        progress: 50,
        score: pctScore,
        readinessIndex: pctScore,
        lastCardIndex: 0,
        reviewedCardsCount: 0,
        updatedAt: now,
      };

      return {
        ...prev,
        [targetCertId]: {
          ...existing,
          score: Math.round(((existing.score || pctScore) + pctScore) / 2),
          readinessIndex: Math.min(100, Math.round(pctScore * 0.9 + 10)),
          updatedAt: now,
        },
      };
    });

    // Write to Firestore if signed in
    if (user) {
      try {
        const attemptRef = doc(db, 'users', user.uid, 'attempts', attemptId);
        await setDoc(attemptRef, newRecord);

        // Update overall user profile questions solved & score
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          questionsSolved: 482 + 65,
          averageScore: pctScore,
          readinessIndex: Math.min(100, pctScore + 5),
          updatedAt: now,
        }, { merge: true });
      } catch (err) {
        if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
          console.warn('[ProgressContext] Offline exam attempt queued locally:', err.message);
        } else {
          handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/attempts/${attemptId}`);
        }
      }
    }

    return newRecord;
  }, [examAttempts, user, activeCertId]);

  // Update study goals
  const updateGoalTarget = useCallback(async (
    targetExam: string, 
    targetExamTitle: string, 
    targetDate?: string, 
    weeklyTarget?: number
  ) => {
    setActiveCertId(targetExam);
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const payload: Partial<UserProfile> = {
          targetExam,
          targetExamTitle,
          updatedAt: new Date().toISOString(),
        };
        if (targetDate) payload.targetDate = targetDate;
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
  }, [user, setActiveCertId]);

  const getCardReview = useCallback((cardId: string) => {
    return reviews[cardId];
  }, [reviews]);

  const getCertProgress = useCallback((certId: string) => {
    return certProgress[certId];
  }, [certProgress]);

  const getCertStats = useCallback((certId: string): CertStats => {
    let maitriseCount = 0;
    let revoirCount = 0;
    let moyenCount = 0;
    let totalReviewed = 0;

    Object.values(reviews).forEach((r) => {
      if (!r.certCode || r.certCode === certId) {
        totalReviewed++;
        if (r.intervalDays >= 7 || r.rating === 'maitrise' || r.rating === 'facile') {
          maitriseCount++;
        } else if (r.intervalDays === 1 || r.rating === 'revoir') {
          revoirCount++;
        } else if (r.intervalDays === 3 || r.rating === 'moyen') {
          moyenCount++;
        }
      }
    });

    return { maitriseCount, revoirCount, moyenCount, totalReviewed };
  }, [reviews]);

  return (
    <ProgressContext.Provider
      value={{
        reviews,
        bookmarkedCardIds,
        certProgress,
        examAttempts,
        lastCardIndices,
        activeCertId,
        setActiveCertId,
        rateFlashcard,
        toggleBookmarkCard,
        saveLastCardIndex,
        recordExamAttempt,
        updateGoalTarget,
        getCardReview,
        getCertProgress,
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
