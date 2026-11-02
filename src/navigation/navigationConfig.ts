import { 
  Home, 
  Compass, 
  GraduationCap, 
  BarChart3, 
  Bot, 
  CheckSquare, 
  Layers, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Scale, 
  Target,
  FileText
} from 'lucide-react';
import { AppScreen } from '../types';

export interface NavSubItem {
  id: string;
  screen: AppScreen;
  label: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  actionKey?: string;
}

export interface NavMainSection {
  id: 'accueil' | 'certifications' | 'apprentissage' | 'progression' | 'assistant';
  label: string;
  primaryScreen: AppScreen;
  icon: typeof Home;
  description: string;
  badge?: string;
  subItems: NavSubItem[];
}

export const MAIN_NAVIGATION: NavMainSection[] = [
  {
    id: 'accueil',
    label: 'Accueil',
    primaryScreen: 'today',
    icon: Home,
    description: 'Votre tableau de bord du jour et reprise rapide',
    badge: 'SRS',
    subItems: [
      {
        id: 'today-overview',
        screen: 'today',
        label: 'Ma session du jour',
        description: '17 cartes SM-2, 8 notions fragiles, 12 questions ciblées',
        badge: '17 dues',
      },
      {
        id: 'quick-resume',
        screen: 'today',
        label: 'Reprendre mon apprentissage',
        description: 'Poursuivre immédiatement la session en cours en 1 clic',
      },
    ],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    primaryScreen: 'catalogue',
    icon: Compass,
    description: 'Explorer, filtrer et comparer 18 certifications officielles',
    badge: '18',
    subItems: [
      {
        id: 'cert-catalog',
        screen: 'catalogue',
        label: 'Catalogue & Blueprints',
        description: 'Azure, AWS, GCP, IBM, NVIDIA avec filtres et pondérations',
      },
      {
        id: 'cert-comparator',
        screen: 'catalogue',
        label: 'Comparateur d’examens',
        description: 'Comparer les prérequis, prix, domaines et niveaux côte à côte',
        actionKey: 'open-comparator',
      },
      {
        id: 'cert-recommendation',
        screen: 'recommendation',
        label: 'Parcours recommandés',
        description: 'Moteur d’orientation sur-mesure du Niveau 1 au Niveau 4',
        badge: 'Sur-mesure',
      },
    ],
  },
  {
    id: 'apprentissage',
    label: 'Apprentissage',
    primaryScreen: 'quiz',
    icon: GraduationCap,
    description: 'Entraînements ciblés, révisions espacées et examens blancs',
    subItems: [
      {
        id: 'learning-quiz',
        screen: 'quiz',
        label: 'Quiz & Entraînements',
        description: 'Questions scénarisées, schémas d’architecture et pièges officiels',
        badge: 'QCM',
      },
      {
        id: 'learning-flashcards',
        screen: 'flashcards',
        label: 'Fiches Mémo (SRS)',
        description: '2 800 cartes mémo réparties par certification et répétition espacée',
        badge: '2 800',
      },
      {
        id: 'learning-exam',
        screen: 'exam',
        label: 'Examens Blancs',
        description: 'Simulations chronométrées en conditions réelles d’examen',
        badge: 'Chrono',
      },
      {
        id: 'learning-paths',
        screen: 'recommendation',
        label: 'Mes Parcours IA',
        description: 'Trajectoire d’acquisition par étapes de compétences',
      },
    ],
  },
  {
    id: 'progression',
    label: 'Progression',
    primaryScreen: 'analytics',
    icon: BarChart3,
    description: 'Indicateurs clés, compétences acquises et points faibles',
    badge: 'Stats',
    subItems: [
      {
        id: 'prog-dashboard',
        screen: 'analytics',
        label: 'Tableau de bord & Score',
        description: 'Niveau de préparation estimé et cadence hebdomadaire',
      },
      {
        id: 'prog-weak-points',
        screen: 'analytics',
        label: 'Compétences à renforcer',
        description: 'Identification des lacunes pour concentrer l’effort',
      },
      {
        id: 'prog-history',
        screen: 'analytics',
        label: 'Historique des examens',
        description: 'Rapports détaillés de chaque session et examen blanc',
      },
    ],
  },
  {
    id: 'assistant',
    label: 'Assistant IA',
    primaryScreen: 'assistant',
    icon: Bot,
    description: 'Accompagnement pédagogique et explications contextuelles',
    badge: 'Tuteur',
    subItems: [
      {
        id: 'assistant-pedagogique',
        screen: 'assistant',
        label: 'Tuteur Pédagogique IA',
        description: 'Clarifier une notion, obtenir des mnémotechniques et astuces',
      },
    ],
  },
];
