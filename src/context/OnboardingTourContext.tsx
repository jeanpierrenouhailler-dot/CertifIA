import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AppScreen } from '../types';

export interface TourStep {
  id: string;
  screen: AppScreen;
  targetSelector: string;
  badgeFr: string;
  badgeEn: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  tipFr: string;
  tipEn: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'today-session',
    screen: 'today',
    targetSelector: '[data-tour="today-session"]',
    badgeFr: '01/10 • Cockpit Quotidien',
    badgeEn: '01/10 • Daily Cockpit',
    titleFr: 'Cockpit du Jour & Algorithme CertifIA',
    titleEn: 'Daily Cockpit & CertifIA Algorithm',
    descriptionFr: 'Chaque matin, l’algorithme CertifIA analyse vos révisions passées et compose une session quotidienne calibrée : fiches SRS prioritaires, notions fragiles identifiées et QCM ciblés pour sécuriser votre score sans surcharge.',
    descriptionEn: 'Each morning, the CertifIA algorithm analyzes your past reviews and generates a calibrated session: priority SRS flashcards, fragile concepts, and targeted MCQs to secure your score without cognitive overload.',
    tipFr: 'Complétez votre session quotidienne (environ 20 min) pour entretenir votre série et ancrer les concepts au seuil d’oubli optimal.',
    tipEn: 'Complete your daily session (~20 min) to maintain your streak and anchor concepts at the optimal retention threshold.',
    placement: 'bottom',
  },
  {
    id: 'today-target',
    screen: 'today',
    targetSelector: '[data-tour="today-target-progress"]',
    badgeFr: '02/10 • Trajectoire Examen',
    badgeEn: '02/10 • Exam Trajectory',
    titleFr: 'Objectif Examen & Progression 700 pts',
    titleEn: 'Target Exam Goal & 700 pts Progress',
    descriptionFr: 'Suivez votre trajectoire d’assimilation vers le seuil officiel de validation de 700 / 1 000 points. Vous pouvez consulter le blueprint officiel ou changer d’examen cible en un clic.',
    descriptionEn: 'Track your progress towards the official 700 / 1000 passing threshold. You can inspect the official blueprint or switch your target exam in one click.',
    tipFr: 'Le score prévisionnel s’ajuste dynamiquement après chaque QCM et série de cartes mémo.',
    tipEn: 'Your projected score adjusts dynamically after every MCQ and flashcard session.',
    placement: 'bottom',
  },
  {
    id: 'target-cert',
    screen: 'today',
    targetSelector: '[data-tour="target-cert"]',
    badgeFr: '03/10 • Référentiel',
    badgeEn: '03/10 • Blueprint Switcher',
    titleFr: 'Sélecteur de Certification & Blueprints',
    titleEn: 'Active Certification & Blueprints',
    descriptionFr: 'Ce sélecteur rapide vous permet de basculer instantanément entre vos examens en préparation (AI-102, AIF-C01, GCP PMLE, IBM watsonx) et d’ouvrir le volet du syllabus officiel.',
    descriptionEn: 'This quick selector lets you switch between prepared exams (AI-102, AIF-C01, GCP PMLE, IBM watsonx) and open the official syllabus drawer.',
    tipFr: 'Cliquez sur le badge de certification dans l’en-tête pour afficher la ventilation détaillée des domaines.',
    tipEn: 'Click the certification badge in the top bar to inspect the detailed domain skills breakdown.',
    placement: 'bottom',
  },
  {
    id: 'catalogue',
    screen: 'catalogue',
    targetSelector: '[data-tour="catalogue-filters"]',
    badgeFr: '04/10 • Catalogue',
    badgeEn: '04/10 • Catalog',
    titleFr: 'Catalogue des 18 Certifications Cloud IA',
    titleEn: 'Official 18 Cloud AI Certifications Catalog',
    descriptionFr: 'Explorez 18 certifications officielles réparties entre Microsoft Azure, AWS, Google Cloud, IBM et NVIDIA. Filtrez par niveau (Fondamental, Associate, Expert) ou comparez-les face-à-face.',
    descriptionEn: 'Explore 18 official certifications across Microsoft Azure, AWS, Google Cloud, IBM, and NVIDIA. Filter by level (Foundational, Associate, Expert) or compare them side-by-side.',
    tipFr: 'Utilisez le Comparateur pour identifier les compétences transférables entre Azure, AWS et Google Cloud.',
    tipEn: 'Use the Comparator to identify transferable skills between Azure, AWS, and Google Cloud.',
    placement: 'bottom',
  },
  {
    id: 'recommendation',
    screen: 'recommendation',
    targetSelector: '[data-tour="recommendation-pathway"]',
    badgeFr: '05/10 • Parcours',
    badgeEn: '05/10 • Pathways',
    titleFr: 'Moteur de Recommandation & Parcours',
    titleEn: 'Recommendation Engine & Pathways',
    descriptionFr: 'Générez votre feuille de route certifiante personnalisée (Niveaux 1 à 4) selon votre métier (Développeur, Data Scientist, Architecte), votre budget et votre rythme hebdomadaire.',
    descriptionEn: 'Generate your personalized certification roadmap (Levels 1 to 4) tailored to your role (Developer, Data Scientist, Architect), budget, and weekly study time.',
    tipFr: 'Le diagnostic prend moins de 2 minutes et propose une trajectoire progressive sans prérequis superflus.',
    tipEn: 'The diagnostic takes under 2 minutes and provides a step-by-step pathway without redundant prerequisites.',
    placement: 'bottom',
  },
  {
    id: 'quiz',
    screen: 'quiz',
    targetSelector: '[data-tour="quiz-container"]',
    badgeFr: '06/10 • QCM & Pièges',
    badgeEn: '06/10 • MCQs & Traps',
    titleFr: 'Entraînement QCM & Décryptage des Pièges',
    titleEn: 'Scenario MCQs & Pitfall Analysis',
    descriptionFr: 'Entraînez-vous sur des questions scénarisées fidèles aux vrais examens. Chaque option fausse est décortiquée pour vous apprendre à repérer les distracteurs subtils des éditeurs.',
    descriptionEn: 'Practice scenario-based questions faithful to real exams. Every incorrect option is thoroughly dissected to teach you how to detect subtle exam traps.',
    tipFr: 'Consultez le schéma de flux interactif et la règle d’or pédagogique sous chaque question validée.',
    tipEn: 'Inspect the interactive flow diagram and golden pedagogical rule beneath every validated answer.',
    placement: 'bottom',
  },
  {
    id: 'flashcards',
    screen: 'flashcards',
    targetSelector: '[data-tour="flashcards-engine"]',
    badgeFr: '07/10 • Mémorisation',
    badgeEn: '07/10 • Spaced Memorization',
    titleFr: 'Fiches Mémo & Répétition Espacée SM-2',
    titleEn: 'Flashcards & SM-2 Spaced Repetition',
    descriptionFr: 'Plus de 2 800 fiches mémo classées par domaines d’examen. L’algorithme SM-2 calcule l’intervalle idéal de rappel (J+1, J+3, J+7, J+14) pour garantir l’ancrage mnésique à long terme.',
    descriptionEn: 'Over 2,800 flashcards categorized by exam domains. The SM-2 algorithm calculates the ideal review interval (Day 1, 3, 7, 14) for guaranteed long-term retention.',
    tipFr: 'Évaluez sincèrement votre facilité de rappel : l’algorithme ajuste la difficulté pour vous éviter tout bachotage superflu.',
    tipEn: 'Rate your recall honestly: the algorithm adjusts difficulty to eliminate unnecessary cramming.',
    placement: 'bottom',
  },
  {
    id: 'exam',
    screen: 'exam',
    targetSelector: '[data-tour="exam-banner"]',
    badgeFr: '08/10 • Examens Blancs',
    badgeEn: '08/10 • Timed Mock Exams',
    titleFr: 'Examens Blancs en Conditions Réelles',
    titleEn: 'Timed Mock Exams Under Real Conditions',
    descriptionFr: 'Simulez le passage en centre d’examen avec un chronomètre officiel (90 à 120 minutes), le barème exact de 700 / 1 000 points et un rapport final détaillé par sous-compétence.',
    descriptionEn: 'Simulate test center conditions with official exam timers (90 to 120 min), the exact 700 / 1000 passing scale, and a detailed post-exam competency report.',
    tipFr: 'Passez un examen blanc complet chaque quinzaine pour mesurer votre résistance au stress et votre gestion du temps.',
    tipEn: 'Take a full mock exam bi-weekly to train your time management and stamina under test conditions.',
    placement: 'bottom',
  },
  {
    id: 'assistant',
    screen: 'assistant',
    targetSelector: '[data-tour="assistant-view"]',
    badgeFr: '09/10 • Tuteur IA',
    badgeEn: '09/10 • AI Tutor',
    titleFr: 'Tuteur Pédagogique IA Contextuel',
    titleEn: 'Contextual Pedagogical AI Tutor',
    descriptionFr: 'Votre coach IA contextuel accessible partout dans l’application. Il utilise une approche socratique pour expliquer les architectures cloud (RAG, Vector Search, MLOps) sans jamais tricher.',
    descriptionEn: 'Your contextual AI coach accessible anywhere across the app. It uses a Socratic method to explain cloud architectures (RAG, Vector Search, MLOps) without cheating.',
    tipFr: 'Vous pouvez ouvrir le tuteur IA depuis n’importe quel QCM pour clarifier une notion sans quitter votre test.',
    tipEn: 'You can trigger the AI tutor from any MCQ to clarify a concept without interrupting your test.',
    placement: 'bottom',
  },
  {
    id: 'analytics',
    screen: 'analytics',
    targetSelector: '[data-tour="analytics-score"]',
    badgeFr: '10/10 • Analytics',
    badgeEn: '10/10 • Cognitive Analytics',
    titleFr: 'Tableau de Bord & Analytics Cognitives',
    titleEn: 'Dashboard & Cognitive Analytics',
    descriptionFr: 'Visualisez votre score de préparation globale, la courbe de progression temporelle et la matrice de maîtrise par domaine pour cibler précisément vos ultimes révisions.',
    descriptionEn: 'Visualize your overall exam readiness score, your progress trajectory, and your skill domain matrix to pinpoint your final review sessions.',
    tipFr: 'Un score de préparation supérieur à 85% garantit statistiquement une réussite au premier passage.',
    tipEn: 'A readiness score above 85% statistically correlates with passing on your very first attempt.',
    placement: 'bottom',
  },
];

export type TourSpeed = 'fast' | 'normal' | 'slow';

export const TOUR_SPEED_INTERVALS: Record<TourSpeed, number> = {
  fast: 5000,
  normal: 8000,
  slow: 12000,
};

interface OnboardingTourContextType {
  isTourActive: boolean;
  isPaused: boolean;
  currentStepIndex: number;
  currentStep: TourStep;
  totalSteps: number;
  progressPercent: number;
  timeRemainingSeconds: number;
  tourSpeed: TourSpeed;
  setTourSpeed: (speed: TourSpeed) => void;
  startTour: (startingStepIndex?: number) => void;
  pauseTour: () => void;
  resumeTour: () => void;
  togglePauseTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  stopTour: () => void;
}

const LOCAL_STORAGE_TOUR_COMPLETED = 'certifai_tour_completed_v1';

const OnboardingTourContext = createContext<OnboardingTourContextType | undefined>(undefined);

export const OnboardingTourProvider: React.FC<{
  children: React.ReactNode;
  onScreenChange?: (screen: AppScreen) => void;
  currentScreen?: AppScreen;
}> = ({ children, onScreenChange, currentScreen }) => {
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [tourSpeed, setTourSpeedState] = useState<TourSpeed>('normal');
  const [timeElapsedMs, setTimeElapsedMs] = useState<number>(0);

  const initialScreenRef = useRef<AppScreen>('today');
  const timerRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

  const currentStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];
  const stepInterval = TOUR_SPEED_INTERVALS[tourSpeed];

  // Progress percentage (0 to 100) within the current step
  const progressPercent = Math.min(100, Math.max(0, (timeElapsedMs / stepInterval) * 100));
  const timeRemainingSeconds = Math.max(0, Math.ceil((stepInterval - timeElapsedMs) / 1000));

  // Change screen automatically when step changes
  useEffect(() => {
    if (isTourActive && onScreenChange) {
      const targetScreen = currentStep.screen;
      if (currentScreen !== targetScreen) {
        onScreenChange(targetScreen);
      }
    }
  }, [isTourActive, currentStepIndex, currentStep.screen, onScreenChange, currentScreen]);

  // Main timer tick loop
  useEffect(() => {
    if (!isTourActive || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    lastTickTimeRef.current = Date.now();
    const TICK_INTERVAL = 50;

    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      setTimeElapsedMs((prev) => {
        const next = prev + delta;
        if (next >= stepInterval) {
          // Advance to next step
          if (currentStepIndex < TOUR_STEPS.length - 1) {
            setCurrentStepIndex((idx) => idx + 1);
            return 0;
          } else {
            // Tour finished
            setIsTourActive(false);
            try {
              localStorage.setItem(LOCAL_STORAGE_TOUR_COMPLETED, 'true');
            } catch {}
            return 0;
          }
        }
        return next;
      });
    }, TICK_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTourActive, isPaused, currentStepIndex, stepInterval]);

  const startTour = useCallback((startingStepIndex = 0) => {
    if (currentScreen) {
      initialScreenRef.current = currentScreen;
    }
    setCurrentStepIndex(Math.max(0, Math.min(startingStepIndex, TOUR_STEPS.length - 1)));
    setTimeElapsedMs(0);
    setIsPaused(false);
    setIsTourActive(true);
  }, [currentScreen]);

  const pauseTour = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTour = useCallback(() => {
    lastTickTimeRef.current = Date.now();
    setIsPaused(false);
  }, []);

  const togglePauseTour = useCallback(() => {
    setIsPaused((prev) => {
      if (prev) {
        lastTickTimeRef.current = Date.now();
      }
      return !prev;
    });
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setTimeElapsedMs(0);
    } else {
      setIsTourActive(false);
      try {
        localStorage.setItem(LOCAL_STORAGE_TOUR_COMPLETED, 'true');
      } catch {}
    }
  }, [currentStepIndex]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setTimeElapsedMs(0);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < TOUR_STEPS.length) {
      setCurrentStepIndex(index);
      setTimeElapsedMs(0);
    }
  }, []);

  const stopTour = useCallback(() => {
    setIsTourActive(false);
    setIsPaused(false);
    setTimeElapsedMs(0);
    try {
      localStorage.setItem(LOCAL_STORAGE_TOUR_COMPLETED, 'true');
    } catch {}
  }, []);

  const setTourSpeed = useCallback((speed: TourSpeed) => {
    setTourSpeedState(speed);
    setTimeElapsedMs(0);
  }, []);

  return (
    <OnboardingTourContext.Provider
      value={{
        isTourActive,
        isPaused,
        currentStepIndex,
        currentStep,
        totalSteps: TOUR_STEPS.length,
        progressPercent,
        timeRemainingSeconds,
        tourSpeed,
        setTourSpeed,
        startTour,
        pauseTour,
        resumeTour,
        togglePauseTour,
        nextStep,
        prevStep,
        goToStep,
        stopTour,
      }}
    >
      {children}
    </OnboardingTourContext.Provider>
  );
};

export const useOnboardingTour = () => {
  const context = useContext(OnboardingTourContext);
  if (!context) {
    throw new Error('useOnboardingTour must be used within an OnboardingTourProvider');
  }
  return context;
};
