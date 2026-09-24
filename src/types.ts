export type AppScreen = 'catalogue' | 'quiz' | 'flashcards' | 'exam' | 'analytics' | 'profile';

export type CloudProvider = 'Tous' | 'azure' | 'aws' | 'gcp' | 'ibm' | 'nvidia';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  targetExam: string;
  targetExamTitle?: string;
  streakDays?: number;
  questionsSolved?: number;
  averageScore?: number;
  readinessIndex?: number;
  createdAt?: string;
  updatedAt?: string;
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
