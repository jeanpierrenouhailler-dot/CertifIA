export type AppScreen = 'today' | 'recommendation' | 'catalogue' | 'quiz' | 'flashcards' | 'exam' | 'analytics' | 'profile' | 'glossary' | 'assistant';

export type UserLevel = 'debutant' | 'intermediaire' | 'avance';

export type UserRole = 
  | 'developpeur' 
  | 'data_scientist' 
  | 'architecte' 
  | 'chef_de_projet' 
  | 'consultant' 
  | 'autre';

export type UserPrimaryGoal = 
  | 'comprendre_ia' 
  | 'ia_generative' 
  | 'cloud_ai' 
  | 'machine_learning' 
  | 'mlops';

export type UserBudget = 'gratuit_eco' | 'standard' | 'illimite';

export type UserWeeklyTime = 'express' | 'standard' | 'intensif'; // 2-4h, 5-8h, 10-15h+

export type UserLanguage = 'fr' | 'en' | 'mixte';

export type UserCareerGoal = 
  | 'montee_competence' 
  | 'reconversion_job' 
  | 'appel_offre_partenaire' 
  | 'certif_express_60j';

export interface UserRecommendationProfile {
  level: UserLevel;
  role: UserRole;
  customRole?: string;
  primaryGoal: UserPrimaryGoal;
  budget: UserBudget;
  weeklyTime: UserWeeklyTime;
  language: UserLanguage;
  careerGoal: UserCareerGoal;
  completedAt?: string;
}

export interface PathwayLevel {
  levelNumber: 1 | 2 | 3 | 4;
  levelTitle: string; // e.g. "Niveau 1 : AI Fundamentals", "Niveau 2 : Generative AI"
  stageCategory: 'fundamentals' | 'genai' | 'cloud_ai' | 'ml_mlops';
  subtitle: string;
  certId: string; // e.g. 'ai900', 'aifc01', 'ai102', 'gcpmle', 'watsonx', 'mlsc01'
  certCode: string;
  certTitle: string;
  provider: 'azure' | 'aws' | 'gcp' | 'ibm' | 'nvidia';
  providerName: string;
  skills: string[];
  estimatedWeeks: number;
  estimatedHours: number;
  difficulty: 'Accessible' | 'Intermédiaire' | 'Avancé' | 'Expert' | 'Foundational' | 'Intermediate' | 'Advanced';
  status: 'completed' | 'in_progress' | 'next' | 'locked';
  cardsCount: number;
  questionsCount: number;
  examPassScore: string;
  rationale: string;
  recommendedOrder: number;
}

export interface PathwayPlan {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  isPrimary: boolean;
  matchScore: number; // 0-100%
  description: string;
  totalWeeks: number;
  totalHours: number;
  totalCerts: number;
  estimatedCost: string;
  highlights: string[];
  levels: PathwayLevel[];
}

export type CloudProvider = 'Tous' | 'azure' | 'aws' | 'gcp' | 'ibm' | 'nvidia';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  targetExam: string;
  targetExamTitle?: string;
  targetDate?: string;
  weeklyTarget?: number;
  streakDays?: number;
  questionsSolved?: number;
  averageScore?: number;
  readinessIndex?: number;
  preferredLanguage?: 'fr' | 'en';
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificationProgress {
  id: string; // cert key e.g. ai102, aifc01, c1000177
  userId: string;
  certCode: string;
  progress: number;
  score: number;
  readinessIndex: number;
  lastCardIndex: number;
  reviewedCardsCount: number;
  updatedAt: string;
}

export interface FlashcardReviewRecord {
  id: string;
  userId: string;
  cardId: string;
  certCode: string;
  rating: 'revoir' | 'difficile' | 'moyen' | 'maitrise' | 'facile';
  intervalDays: number;
  repetitions?: number;
  easeFactor?: number; // SM-2 ease factor (default 2.5)
  difficulty?: number; // 1 to 5 (e.g. 3/5)
  totalReviews?: number;
  successReviews?: number;
  nextReviewDate?: string; // YYYY-MM-DD
  isBookmarked?: boolean;
  reviewedAt: string;
}

export interface ExamAttemptRecord {
  id: string;
  userId: string;
  examCode: string;
  examTitle: string;
  attemptNumber: number;
  score: number;
  maxScore: number;
  passed: boolean;
  duration: string;
  weakPoint: string;
  domainScoresSummary?: string;
  createdAt: string;
}

export type CertificationLevel = 'all' | 'fondamental' | 'associate' | 'expert';

export interface Certification {
  id: string;
  code: string;
  title: string;
  provider: 'azure' | 'aws' | 'gcp' | 'ibm' | 'nvidia';
  providerName: string;
  level: 'fondamental' | 'associate' | 'expert';
  levelLabel: string;
  targetAudience: string;
  userProgress: number; // 0-100
  progressLabel: string;
  passScore: number;
  maxScore: number;
  durationMinutes: number;
  itemsCount: number;
  avgPassRate: number;
  modules: string[];
  docUrl: string;
  isActiveTarget?: boolean;
  domains: {
    name: string;
    weight: string;
    percentage: number;
    mastery: number;
    description: string;
    color: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  code: string;
  type: string;
  points: number;
  scenario: string;
  question: string;
  architectureBadge?: {
    title: string;
    subtitle: string;
  };
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
    subtext?: string;
  }[];
  correctKey: 'A' | 'B' | 'C' | 'D';
  explanation: {
    mainReason: string;
    highlights: {
      title: string;
      desc: string;
      icon: string;
    }[];
    traps: {
      key: 'A' | 'B' | 'C' | 'D';
      reason: string;
    }[];
    officialDocTitle: string;
    officialDocSubtitle: string;
    officialDocUrl: string;
  };
}

export interface Flashcard {
  id: string;
  category: string;
  categoryBadgeColor?: string;
  levelTag: string;
  promptNumber: string;
  intervalDays: number;
  questionTitle: string;
  questionLead: string;
  solutionHeading: string;
  solutionBody: string;
  metrics: {
    label: string;
    value: string;
    desc: string;
  }[];
  goldenRules: string[];
  deckName: string;
  domainId?: string;
  domainName?: string;
  certCode?: string;
}

export interface ExamQuestionItem {
  number: number;
  status: 'answered' | 'flagged' | 'unvisited';
  selectedOption?: string;
}

export interface ExamSessionHistory {
  id: string;
  date: string;
  duration: string;
  weakPoint: string;
  weakPointSeverity: 'high' | 'medium' | 'low';
  score: number;
  maxScore: number;
  passed: boolean;
  domainScores: { name: string; score: number }[];
  recommendation: string;
}
