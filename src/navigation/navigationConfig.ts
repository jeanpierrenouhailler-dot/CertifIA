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
  FileText,
  User,
  Settings,
  HelpCircle,
  Download,
  PieChart,
  History,
  TrendingUp,
  LucideIcon
} from 'lucide-react';
import { AppScreen } from '../types';

export type NavCategoryId = 
  | 'accueil' 
  | 'certifications' 
  | 'apprentissage' 
  | 'progression' 
  | 'assistant' 
  | 'plus';

export interface NavItemConfig {
  id: string;
  label: string;
  shortLabel?: string;
  category: NavCategoryId;
  screen: AppScreen;
  icon: LucideIcon;
  description: string;
  shortcut?: string;
  badge?: string;
  badgeColor?: string;
  actionKey?: string;
  visibility: {
    desktop: boolean;
    mobileBar: boolean;
    mobileMore: boolean;
    search: boolean;
  };
}

export interface NavCategoryConfig {
  id: NavCategoryId;
  label: string;
  title: string;
  description: string;
  primaryScreen: AppScreen;
  icon: LucideIcon;
  badge?: string;
}

export const NAV_CATEGORIES: Record<NavCategoryId, NavCategoryConfig> = {
  accueil: {
    id: 'accueil',
    label: 'Accueil',
    title: '1. Accueil',
    description: 'Votre cockpit quotidien et reprise immédiate',
    primaryScreen: 'today',
    icon: Home,
    badge: 'SRS',
  },
  certifications: {
    id: 'certifications',
    label: 'Certifications',
    title: '2. Certifications',
    description: 'Catalogue officiel, comparateur et blueprints',
    primaryScreen: 'catalogue',
    icon: Compass,
    badge: '18',
  },
  apprentissage: {
    id: 'apprentissage',
    label: 'Apprentissage',
    title: '3. Apprentissage',
    description: 'Quiz, fiches mémo espacées, examens blancs et glossaire',
    primaryScreen: 'quiz',
    icon: GraduationCap,
    badge: 'Pédago',
  },
  progression: {
    id: 'progression',
    label: 'Progression',
    title: '4. Progression',
    description: 'Tableau de bord, analytics et historique',
    primaryScreen: 'analytics',
    icon: BarChart3,
    badge: 'Stats',
  },
  assistant: {
    id: 'assistant',
    label: 'Assistant IA',
    title: '5. Assistant IA',
    description: 'Tuteur pédagogique interactif et contextuel',
    primaryScreen: 'assistant',
    icon: Bot,
    badge: 'Tuteur',
  },
  plus: {
    id: 'plus',
    label: 'Plus',
    title: '6. Plus',
    description: 'Profil, paramètres, guide et utilitaires',
    primaryScreen: 'profile',
    icon: Settings,
  },
};

export const NAV_ITEMS: NavItemConfig[] = [
  // 1. ACCUEIL
  {
    id: 'nav-today',
    label: 'Aujourd’hui',
    shortLabel: 'Aujourd’hui',
    category: 'accueil',
    screen: 'today',
    icon: Home,
    description: 'Cockpit du jour : 17 cartes SM-2, 8 notions fragiles, 12 QCM ciblés',
    shortcut: 'H',
    badge: 'Prioritaire',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    visibility: { desktop: true, mobileBar: true, mobileMore: true, search: true },
  },
  {
    id: 'nav-quick-resume',
    label: 'Reprendre mon apprentissage',
    shortLabel: 'Reprendre',
    category: 'accueil',
    screen: 'today',
    icon: Target,
    description: 'Reprendre immédiatement votre session en cours en 1 clic',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },

  // 2. CERTIFICATIONS
  {
    id: 'nav-catalogue',
    label: 'Catalogue des certifications',
    shortLabel: 'Catalogue',
    category: 'certifications',
    screen: 'catalogue',
    icon: Compass,
    description: 'Explorer, filtrer et préparer 18 certifications officielles Cloud AI',
    shortcut: 'C',
    badge: '18 Examens',
    visibility: { desktop: true, mobileBar: true, mobileMore: true, search: true },
  },
  {
    id: 'nav-comparator',
    label: 'Comparateur de certifications',
    shortLabel: 'Comparateur',
    category: 'certifications',
    screen: 'catalogue',
    icon: Scale,
    description: 'Comparer les compétences, prérequis, prix et niveaux côte à côte',
    actionKey: 'open-comparator',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },
  {
    id: 'nav-recommendations',
    label: 'Parcours recommandés',
    shortLabel: 'Parcours',
    category: 'certifications',
    screen: 'recommendation',
    icon: Sparkles,
    description: 'Moteur d’orientation sur-mesure du Niveau 1 au Niveau 4 selon votre profil',
    badge: 'Sur-mesure',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },

  // 3. APPRENTISSAGE
  {
    id: 'nav-quiz',
    label: 'Quiz et entraînements',
    shortLabel: 'Quiz',
    category: 'apprentissage',
    screen: 'quiz',
    icon: CheckSquare,
    description: 'Questions scénarisées, justifications officielles et pièges typiques',
    shortcut: 'Q',
    badge: 'Entraînement',
    visibility: { desktop: true, mobileBar: true, mobileMore: true, search: true },
  },
  {
    id: 'nav-flashcards',
    label: 'Flashcards et SRS',
    shortLabel: 'Flashcards',
    category: 'apprentissage',
    screen: 'flashcards',
    icon: Layers,
    description: '2 800 fiches mémo pilotées par l’algorithme SM-2 de répétition espacée',
    shortcut: 'F',
    badge: '2 800',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },
  {
    id: 'nav-flashcards-distribution',
    label: 'Répartition des flashcards',
    shortLabel: 'Répartition',
    category: 'apprentissage',
    screen: 'flashcards',
    icon: PieChart,
    description: 'Inventaire officiel et ventilation des cartes par certification et domaine',
    actionKey: 'open-distribution',
    badge: 'Inventaire',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },
  {
    id: 'nav-exam',
    label: 'Examens blancs',
    shortLabel: 'Examens',
    category: 'apprentissage',
    screen: 'exam',
    icon: Clock,
    description: 'Simulations chronométrées en conditions réelles d’examen avec barème officiel',
    shortcut: 'E',
    badge: 'Chrono',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },
  {
    id: 'nav-glossary',
    label: 'Glossaire & Encyclopédie',
    shortLabel: 'Glossaire',
    category: 'apprentissage',
    screen: 'glossary',
    icon: BookOpen,
    description: 'Encyclopédie des termes et acronymes IA présents dans toutes les certifications',
    shortcut: 'G',
    badge: 'Encyclo',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },

  // 4. PROGRESSION
  {
    id: 'nav-analytics-dashboard',
    label: 'Tableau de bord',
    shortLabel: 'Progression',
    category: 'progression',
    screen: 'analytics',
    icon: BarChart3,
    description: 'Score de préparation global, taux de réussite et cadence hebdomadaire',
    shortcut: 'P',
    visibility: { desktop: true, mobileBar: true, mobileMore: true, search: true },
  },
  {
    id: 'nav-analytics-detail',
    label: 'Analytics & Compétences',
    shortLabel: 'Analytics',
    category: 'progression',
    screen: 'analytics',
    icon: TrendingUp,
    description: 'Décomposition par domaine de certification et identification des lacunes',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },
  {
    id: 'nav-history',
    label: 'Historique des examens',
    shortLabel: 'Historique',
    category: 'progression',
    screen: 'analytics',
    icon: History,
    description: 'Rapports détaillés de toutes les sessions d’examen et quiz passés',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },

  // 5. ASSISTANT IA
  {
    id: 'nav-assistant',
    label: 'Assistant pédagogique',
    shortLabel: 'Tuteur IA',
    category: 'assistant',
    screen: 'assistant',
    icon: Bot,
    description: 'Tuteur IA dédié : explications, mnémotechniques et astuces d’examen',
    shortcut: 'Ctrl+I',
    badge: 'Tuteur',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },

  // 6. PLUS (Secondaires)
  {
    id: 'nav-profile',
    label: 'Profil utilisateur',
    shortLabel: 'Profil',
    category: 'plus',
    screen: 'profile',
    icon: User,
    description: 'Gestion du compte, certifications cibles et synchronisation',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },
  {
    id: 'nav-settings',
    label: 'Paramètres système',
    shortLabel: 'Paramètres',
    category: 'plus',
    screen: 'today',
    icon: Settings,
    description: 'Version, vérification des mises à jour automatiques et diagnostic',
    actionKey: 'open-settings',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },
  {
    id: 'nav-guide',
    label: 'Guide & Aide contextuelle',
    shortLabel: 'Guide',
    category: 'plus',
    screen: 'today',
    icon: HelpCircle,
    description: 'Activer le mode guide novice et infobulles explicatives',
    actionKey: 'open-guide',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },
  {
    id: 'nav-legal',
    label: 'Mentions légales & Avertissement',
    shortLabel: 'Légal',
    category: 'plus',
    screen: 'today',
    icon: FileText,
    description: 'Cadre d’utilisation, sources officielles et non-responsabilité des données',
    actionKey: 'open-legal',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },
  {
    id: 'nav-pwa',
    label: 'Installer l’application',
    shortLabel: 'Installer',
    category: 'plus',
    screen: 'today',
    icon: Download,
    description: 'Ajouter CertifIA à votre écran d’accueil mobile ou bureau',
    actionKey: 'open-pwa',
    visibility: { desktop: true, mobileBar: false, mobileMore: true, search: true },
  },
];

export interface BreadcrumbInfo {
  categoryLabel: string;
  itemLabel: string;
  categoryIcon: LucideIcon;
  screen: AppScreen;
}

export function getBreadcrumbForScreen(screen: AppScreen, actionKey?: string): BreadcrumbInfo {
  // If action key is provided, search item by actionKey
  if (actionKey) {
    const itemByAction = NAV_ITEMS.find((item) => item.actionKey === actionKey);
    if (itemByAction) {
      const cat = NAV_CATEGORIES[itemByAction.category];
      return {
        categoryLabel: cat.label,
        itemLabel: itemByAction.label,
        categoryIcon: itemByAction.icon,
        screen: itemByAction.screen,
      };
    }
  }

  // Find primary item matching screen
  const matchedItem = NAV_ITEMS.find((item) => item.screen === screen && !item.actionKey) 
    || NAV_ITEMS.find((item) => item.screen === screen)
    || NAV_ITEMS[0];

  const cat = NAV_CATEGORIES[matchedItem.category];
  return {
    categoryLabel: cat.label,
    itemLabel: matchedItem.label,
    categoryIcon: matchedItem.icon,
    screen: matchedItem.screen,
  };
}

export function getItemsByCategory(category: NavCategoryId): NavItemConfig[] {
  return NAV_ITEMS.filter((item) => item.category === category);
}

export function getActiveCategoryForScreen(screen: AppScreen): NavCategoryId {
  const match = NAV_ITEMS.find((item) => item.screen === screen && !item.actionKey);
  return match ? match.category : 'accueil';
}

export function getSearchableNavItems(): NavItemConfig[] {
  return NAV_ITEMS.filter((item) => item.visibility.search);
}

