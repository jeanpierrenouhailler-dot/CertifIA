import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Clock, 
  Compass, 
  Bot, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  RotateCcw, 
  Play, 
  Zap, 
  Brain, 
  Database, 
  FileText, 
  BarChart3, 
  Sun, 
  Moon,
  ExternalLink,
  Target
} from 'lucide-react';
import { AppScreen } from '../types';
import { CertifAILogo } from './CertifAILogo';
import { LanguageSelector } from './LanguageSelector';
import { useTheme } from '../context/ThemeContext';
import { certificationsData } from '../data/certificationsData';

interface LandingPageViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (certId: string) => void;
  onOpenAIAssistant?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onNavigate,
  onOpenBlueprint,
  onOpenAIAssistant
}) => {
  const { t, i18n } = useTranslation(['navigation', 'common', 'certifications', 'dashboard']);
  const { theme, toggleTheme } = useTheme();
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'fr';

  // Demo simulator interactive states
  const [demoTab, setDemoTab] = useState<'flashcard' | 'quiz'>('flashcard');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'azure' | 'aws' | 'gcp' | 'ibm'>('all');
  const [activeScreenshotTab, setActiveScreenshotTab] = useState<string>('today');

  const screenshotsList = [
    {
      id: 'today',
      titleFr: 'Cockpit du Jour & Algorithme SM-2',
      titleEn: 'Daily Cockpit & SM-2 Algorithm',
      badge: '01. Cockpit',
      descFr: 'Composition mathématique quotidienne : 17 fiches prioritaires au seuil d’oubli, 8 notions fragiles, 12 QCM ciblés et progression continue vers le seuil éliminatoire de 700 / 1 000 points.',
      descEn: 'Calibrated daily session: 17 priority cards at forgetting curve, 8 fragile concepts, 12 targeted MCQs, and real-time progress toward the 700 / 1000 passing threshold.',
      src: '/assets/screenshots/certifia-cockpit-today.png',
      screen: 'today' as AppScreen,
    },
    {
      id: 'pathway',
      titleFr: 'Moteur d’Orientation & Parcours IA en 4 Niveaux',
      titleEn: 'Orientation Engine & 4-Level AI Pathways',
      badge: '02. Parcours',
      descFr: 'Diagnostic modélisé selon votre métier (Développeur, Data Scientist, Architecte), budget et heures disponibles pour éditer votre feuille de route certifiante officielle.',
      descEn: 'Personalized diagnostic tailored to your role (Developer, Data Scientist, Solution Architect), budget, and weekly study time.',
      src: '/assets/screenshots/certifia-orientation-pathway.png',
      screen: 'recommendation' as AppScreen,
    },
    {
      id: 'catalogue',
      titleFr: 'Catalogue des 18 Certifications Cloud & IA',
      titleEn: 'Official 18 Cloud AI Certifications Catalog',
      badge: '03. Catalogue',
      descFr: 'Référentiel complet bilingue Microsoft Azure, AWS, Google Cloud, IBM watsonx et NVIDIA avec filtres par fournisseur et syllabi officiels.',
      descEn: 'Comprehensive bilingual catalog covering Microsoft Azure, AWS, Google Cloud, IBM watsonx, and NVIDIA with official syllabus blueprints.',
      src: '/assets/screenshots/certifia-catalogue-view.svg',
      screen: 'catalogue' as AppScreen,
    },
    {
      id: 'quiz',
      titleFr: 'Entraînement QCM & Analyse des Pièges d’Examen',
      titleEn: 'Scenario MCQs & Exam Pitfall Breakdown',
      badge: '04. QCM Scénarios',
      descFr: 'Questions scénarisées d’architecture d’entreprise, décryptage minutieux de chaque distracteur et schéma de flux méthodologique.',
      descEn: 'Enterprise architecture scenarios, systematic analysis of subtle distractor traps, and official cloud flowcharts.',
      src: '/assets/screenshots/certifia-quiz-engine.svg',
      screen: 'quiz' as AppScreen,
    },
    {
      id: 'flashcards',
      titleFr: 'Fiches Mémo & Moteur de Répétition Espacée SM-2',
      titleEn: 'Flashcards & SM-2 Spaced Repetition Engine',
      badge: '05. Fiches SRS',
      descFr: 'Plus de 2 800 fiches mémo classées par domaine d’examen avec échelle de rappel à 4 boutons (1j, 3j, 7j, 14j) et calcul d’échéance scientifique.',
      descEn: 'Over 2,800 flashcards categorized by exam domains with a 4-button grading scale (1d, 3d, 7d, 14d) and scientific recall metrics.',
      src: '/assets/screenshots/certifia-flashcards-srs.svg',
      screen: 'flashcards' as AppScreen,
    },
    {
      id: 'exam',
      titleFr: 'Examens Blancs Chronométrés en Conditions Réelles',
      titleEn: 'Timed Mock Exams Under Real Conditions',
      badge: '06. Examen Blanc',
      descFr: 'Simulation en conditions officielles de centre de test (90 à 120 minutes), seuil éliminatoire officiel et rapport détaillé par compétence.',
      descEn: 'Full test-center simulation (90 to 120 minutes), official 700-point passing cutoff, question flagging, and post-exam domain debrief.',
      src: '/assets/screenshots/certifia-mock-exam.svg',
      screen: 'exam' as AppScreen,
    },
    {
      id: 'assistant',
      titleFr: 'Tuteur Pédagogique IA & Dialogue Socratique',
      titleEn: 'Socratic AI Pedagogical Tutor',
      badge: '07. Tuteur IA',
      descFr: 'Coach contextuel intelligent qui guide la réflexion, explicite les compromis d’architecture et cite les documentations officielles sans tricher.',
      descEn: 'Contextual AI coach providing Socratic architectural guidance, memory rules, and official vendor citations without spoiling answers.',
      src: '/assets/screenshots/certifia-ai-tutor.svg',
      screen: 'assistant' as AppScreen,
    },
    {
      id: 'analytics',
      titleFr: 'Télémétrie Cognitive & Tableau de Bord Prédictif',
      titleEn: 'Cognitive Analytics & Readiness Dashboard',
      badge: '08. Analytics',
      descFr: 'Indice de préparation globale, courbe de rétention modélisée contre l’oubli passif et matrice de maîtrise par domaine officiel.',
      descEn: 'Overall readiness index, mathematical Ebbinghaus forgetting curve simulation, and domain-by-domain mastery radar.',
      src: '/assets/screenshots/certifia-analytics-dashboard.svg',
      screen: 'analytics' as AppScreen,
    },
    {
      id: 'tour',
      titleFr: 'Onboarding Tour en Découverte Automatique',
      titleEn: 'Automated Onboarding Discovery Tour',
      badge: '09. Visite Guidée',
      descFr: 'Présentation progressive avec anneau spotlight, compte à rebours fluide, réglage de vitesse et commandes Pause / Précédent / Continuer / Quitter.',
      descEn: 'Progressive auto-guided walkthrough with visual spotlight rings, dynamic timer bar, speed settings, and Pause / Previous / Resume / Exit controls.',
      src: '/assets/screenshots/certifia-onboarding-tour.svg',
      screen: 'today' as AppScreen,
    },
  ];

  // Filtered certifications for showcase
  const topCerts = certificationsData.filter((c) => {
    if (selectedProvider === 'all') return true;
    return c.provider === selectedProvider;
  }).slice(0, 6);

  const handleResetCard = () => {
    setIsCardFlipped(false);
    setSelectedRating(null);
  };

  const handleResetQuiz = () => {
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0e17] dark:text-[#dfe2f1] selection:bg-blue-500/20 selection:text-blue-600 transition-colors duration-200">
      
      {/* 1. TOP BAR CONTRACT: 3 Zones ([Brand] — [Nav Links] — [Primary Action + Controls]) */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0b0e17]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#1c2130] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <div 
            onClick={() => onNavigate('today')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <CertifAILogo showSubtitle={false} />
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Certif<span className="text-blue-600 dark:text-blue-400">IA</span>
              </span>
              <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
                Cloud AI Certifications
              </span>
            </div>
          </div>

          {/* Zone 2: 4-5 single-line clean nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a 
              href="#piliers" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
            >
              {currentLang === 'en' ? 'Cognitive Method' : 'Méthode Cognitive'}
            </a>
            <a 
              href="#simulateur" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
            >
              {currentLang === 'en' ? 'Interactive Demo' : 'Démonstrateur'}
            </a>
            <a 
              href="#captures" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 font-semibold text-blue-600 dark:text-blue-400"
            >
              {currentLang === 'en' ? 'App Screenshots' : 'Captures d’Écran'}
            </a>
            <a 
              href="#certifications" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
            >
              {currentLang === 'en' ? 'Catalog (18 Exams)' : 'Catalogue (18 Examens)'}
            </a>
            <a 
              href="#temoignages" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
            >
              {currentLang === 'en' ? 'Testimonials' : 'Avis d’ingénieurs'}
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action + Utility Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <LanguageSelector variant="header" />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-colors"
              title={theme === 'dark' ? t('common:theme.lightMode') : t('common:theme.darkMode')}
              aria-label={t('common:theme.toggle')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={() => onNavigate('today')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm shadow-blue-500/20 hover:shadow-blue-500/30 transition-all whitespace-nowrap shrink-0"
            >
              <span>{currentLang === 'en' ? 'Launch Cockpit' : 'Lancer le cockpit'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle background ambient gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* Clean unboxed editorial kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>
                {currentLang === 'en' 
                  ? 'Official Cloud AI Certification Preparation Engine' 
                  : 'Moteur d’entraînement cognitif aux certifications Cloud IA'}
              </span>
            </div>

            {/* Display Headline with balanced wrapping */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance font-headline">
              {currentLang === 'en' ? (
                <>
                  Pass Cloud & AI Certifications <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400">
                    on Your Very First Attempt.
                  </span>
                </>
              ) : (
                <>
                  Maîtrisez les certifications Cloud & IA <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400">
                    dès votre premier passage.
                  </span>
                </>
              )}
            </h1>

            {/* Value Proposition Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {currentLang === 'en' 
                ? 'High-fidelity training combining SM-2 spaced repetition, 2,800 targeted flashcards, 700/1000 threshold timed mock exams, and an architectural AI tutor for Azure, AWS, Google Cloud, and IBM watsonx.'
                : 'L’environnement d’entraînement haute fidélité combinant répétition espacée SM-2, 2 800 fiches mémo ciblées, simulations chronométrées au seuil officiel de 700 pts et tuteur IA contextuel pour Azure, AWS, Google Cloud et IBM watsonx.'}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('today')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all whitespace-nowrap"
              >
                <span>{currentLang === 'en' ? 'Start Free Training' : 'Démarrer l’entraînement gratuit'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('recommendation')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#161a26] hover:bg-slate-100 dark:hover:bg-[#1e2333] border border-slate-200 dark:border-[#262c3e] text-slate-800 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap shadow-sm"
              >
                <Compass className="w-4 h-4 text-blue-500" />
                <span>{currentLang === 'en' ? 'Assess My Pathway (Niv. 1-4)' : 'Diagnostiquer mon parcours (Niv. 1-4)'}</span>
              </button>

              <button
                onClick={() => onNavigate('catalogue')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{currentLang === 'en' ? 'View 18 Exams' : 'Voir les 18 examens'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quantitative Proof Strip */}
            <div className="mt-12 w-full max-w-4xl pt-8 border-t border-slate-200 dark:border-[#1c2130] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                  18
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {currentLang === 'en' ? 'Official Certifications' : 'Certifications officielles'}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                  2 800+
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {currentLang === 'en' ? 'SM-2 Memory Flashcards' : 'Fiches mémo espacées'}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  94.2%
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {currentLang === 'en' ? 'First-Attempt Pass Rate' : 'Taux de réussite au 1er essai'}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                  700 / 1000
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {currentLang === 'en' ? 'Exact Exam Pass Score' : 'Seuil officiel modélisé'}
                </div>
              </div>
            </div>

          </div>

          {/* Hero Visual Asset with Generated Cockpit Display */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#222738] bg-white dark:bg-[#121622] shadow-2xl shadow-blue-500/10">
              
              {/* Cockpit Window Bar */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-[#1e2333] bg-slate-50/80 dark:bg-[#0e121c]/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    certifia.app • Cockpit v2.7.0
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="hidden sm:inline">AI-102 Azure AI Engineer</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">SRS Active (17 due)</span>
                </div>
              </div>

              {/* Main Cockpit Visual */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src="/assets/screenshots/certifia-cockpit-today.png"
                  alt="CertifIA Learning Platform Real Cockpit Interface"
                  className="w-full h-full object-cover object-top"
                />

                {/* Live interactive callout badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-white max-w-sm shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <Target className="w-3.5 h-3.5 text-blue-400" />
                    <span>SESSION QUOTIDIENNE RECOMMANDÉE</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    17 Fiches SRS · 8 Notions Fragiles · 12 QCM
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {currentLang === 'en'
                      ? 'Spaced interval calculated at the critical forgetting threshold for guaranteed long-term retention.'
                      : 'Rappels calculés au seuil critique d’oubli pour une consolidation mémorielle définitive.'}
                  </p>
                  <button
                    onClick={() => onNavigate('today')}
                    className="mt-3 w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{currentLang === 'en' ? 'Open Today View' : 'Ouvrir la session du jour'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. THE 4 COGNITIVE PILLARS (Bento Grid Layout) */}
      <section id="piliers" className="py-20 bg-slate-100/70 dark:bg-[#0e121c] border-y border-slate-200 dark:border-[#1a1f2e] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentLang === 'en' ? 'Pedagogical Architecture' : 'Architecture Pédagogique'}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
              {currentLang === 'en' 
                ? 'The 4 Cognitive Pillars of Success' 
                : 'Les 4 Piliers Cognitifs de votre Réussite'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentLang === 'en'
                ? 'CertifIA replaces passive reading with an active, mathematically optimized learning pipeline.'
                : 'CertifIA remplace le bachotage passif par un pipeline d’apprentissage actif mathématiquement optimisé.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: Large Card (Col-Span-2) with Spaced Repetition Image */}
            <div className="md:col-span-2 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:border-blue-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    01. Mémorisation Cognitive
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    SM-2 + FSRS
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {currentLang === 'en' 
                    ? 'SuperMemo SM-2 Spaced Repetition' 
                    : 'Répétition Espacée Algorithmique SM-2'}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  {currentLang === 'en'
                    ? 'Based on Ebbinghaus forgetting curves. Cards are reviewed exactly before memory decay occurs (Day 1, 3, 7, 14, 30), multiplying long-term retention by 2.8x while cutting study time by 40%.'
                    : 'Fondé sur les courbes d’oubli d’Ebbinghaus. Vos cartes sont réactivées exactement avant le seuil d’oubli (J+1, J+3, J+7, J+14, J+30), multipliant la rétention par 2,8x tout en réduisant le temps d’étude inutile.'}
                </p>
              </div>

              <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 dark:border-[#202534] aspect-[16/9] max-h-72 bg-slate-950">
                <img
                  src="/src/assets/images/landing_spaced_repetition_1793990596739.jpg"
                  alt="SM-2 Memory Retention Curves"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1c2130] flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  2 800 fiches actives réparties par domaines
                </span>
                <button
                  onClick={() => onNavigate('flashcards')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>{currentLang === 'en' ? 'Explore Flashcards' : 'Tester les flashcards'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pillar 2: Exam Simulation */}
            <div className="rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-blue-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    02. Conditions Réelles
                  </span>
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentLang === 'en' 
                    ? 'Timed Mock Examinations' 
                    : 'Examens Blancs Chronométrés'}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Timed simulations modeled on real exam formats (90 to 120 minutes), strict 700/1000 passing threshold, and thorough dissection of exam traps and distractors.'
                    : 'Simulations calibrées sur les examens réels (90 à 120 minutes), notation au seuil officiel de 700/1000 points, et décryptage des pièges et distracteurs formulés par les éditeurs.'}
                </p>
                
                <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{currentLang === 'en' ? 'Official Scoring Modeled' : 'Scoring Officiel Modélisé'}</span>
                  </div>
                  <div>
                    {currentLang === 'en' 
                      ? 'Official benchmark: 700 / 1000 pts to pass. Real-time telemetry across exam skill domains.' 
                      : 'Barème officiel : 700 / 1 000 pts pour valider. Télémétrie en direct par domaine de compétence.'}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-[#1c2130]">
                <button
                  onClick={() => onNavigate('exam')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1a2030] dark:hover:bg-[#232a3d] text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-blue-500" />
                  <span>{currentLang === 'en' ? 'Launch Mock Exam' : 'Lancer un examen blanc'}</span>
                </button>
              </div>
            </div>

            {/* Pillar 3: Multi-Cloud Coverage with Datacenter Visual */}
            <div className="rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-blue-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {currentLang === 'en' ? '03. Ecosystem' : '03. Écosystème'}
                  </span>
                  <Database className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentLang === 'en' 
                    ? 'Multi-Cloud AI Coverage' 
                    : 'Couverture Multi-Cloud Réelle'}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Complete blueprints for Microsoft Azure, AWS Bedrock, Google Cloud Vertex AI, and IBM watsonx. Compare exams and find your optimal path.'
                    : 'Blueprints complets pour Microsoft Azure, AWS Bedrock, Google Cloud Vertex AI et IBM watsonx. Comparateur d’examens et parcours guidés.'}
                </p>

                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-[#202534] aspect-[4/3] bg-slate-950">
                  <img
                    src="/src/assets/images/landing_cloud_datacenter_1793990597343.jpg"
                    alt="Enterprise Cloud AI Datacenter"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1c2130]">
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1a2030] dark:hover:bg-[#232a3d] text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-500" />
                  <span>{currentLang === 'en' ? 'Open Comparator' : 'Ouvrir le comparateur'}</span>
                </button>
              </div>
            </div>

            {/* Pillar 4: Large Card (Col-Span-2) AI Pedagogical Tutor */}
            <div className="md:col-span-2 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-blue-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {currentLang === 'en' ? '04. Intelligent Tutor' : '04. Tuteur Intelligent'}
                  </span>
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Bot className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {currentLang === 'en' 
                    ? 'Contextual Socratic AI Tutor' 
                    : 'Tuteur IA Pédagogique Contextuel'}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {currentLang === 'en'
                    ? 'No lazy answer spoiling: CertifIA guides you with architectural explanations, ASCII workflow diagrams, and official vendor citations (Microsoft Learn, AWS Docs, Google Cloud Architecture Framework).'
                    : 'Ne récite jamais bêtement la solution : CertifIA vous guide pas-à-pas avec des schémas d’architecture, des astuces mnémotechniques et des citations officielles (Microsoft Learn, AWS Docs, Google Cloud Architecture Framework).'}
                </p>

                {/* Socratic sample simulation */}
                <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#222738] text-xs font-mono space-y-2">
                  <div className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" />
                    <span>
                      {currentLang === 'en' 
                        ? 'CertifIA AI Tutor • Golden Rule for AI-102 Exam:' 
                        : 'Tuteur IA CertifIA • Règle d\'or de l\'examen AI-102 :'}
                    </span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 pl-5 border-l-2 border-blue-500/40">
                    {currentLang === 'en'
                      ? '“For RAG with semantic search: 1) Chunking & Embeddings ➔ 2) Hybrid Index Vector + Keyword BM25 ➔ 3) Semantic Re-ranking. Do not confuse with Fine-tuning, which adapts the model style but does not inject dynamic external memory!”'
                      : '« Pour faire du RAG avec recherche sémantique : 1) Chunking & Embeddings ➔ 2) Index hybride Vector + Keyword BM25 ➔ 3) Re-ranking sémantique. Ne pas confondre avec le Fine-tuning qui adapte le style du modèle mais n\'injecte pas de mémoire dynamique ! »'}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1c2130] flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {currentLang === 'en' 
                    ? 'Accessible from any MCQ, flashcard, or practice exam' 
                    : 'Disponible depuis n\'importe quel QCM, fiche ou examen'}
                </span>
                <button
                  onClick={onOpenAIAssistant || (() => onNavigate('assistant'))}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'Ask AI Tutor' : 'Consulter le tuteur IA'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE DEMO SIMULATOR */}
      <section id="simulateur" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentLang === 'en' ? 'Live Interactive Preview' : 'Démonstrateur en direct'}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
              {currentLang === 'en' 
                ? 'Experience the Pedagogical Engine Right Now' 
                : 'Testez le moteur d’apprentissage sans attendre'}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {currentLang === 'en'
                ? 'Interact with an authentic SM-2 flashcard or a real exam multiple-choice question below.'
                : 'Manipulez ci-dessous une vraie carte mémo SM-2 ou une question officielle scénarisée.'}
            </p>
          </div>

          {/* Interactive Simulator Shell */}
          <div className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] shadow-xl overflow-hidden">
            
            {/* Tabs Bar */}
            <div className="px-6 py-3.5 border-b border-slate-200 dark:border-[#1c2130] bg-slate-50 dark:bg-[#0e121c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemoTab('flashcard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    demoTab === 'flashcard'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'SM-2 Flashcard Mode' : 'Mode Flashcard SM-2'}</span>
                </button>
                <button
                  onClick={() => setDemoTab('quiz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    demoTab === 'quiz'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'Exam Scenario MCQ' : 'QCM Scénarisé'}</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="hidden sm:inline">Examen cible :</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">AI-102 Azure AI Engineer</span>
              </div>
            </div>

            {/* Tab 1: SM-2 Flashcard Simulator */}
            {demoTab === 'flashcard' && (
              <div className="p-6 sm:p-10 flex flex-col items-center">
                <div 
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className={`w-full max-w-xl min-h-[220px] rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 border flex flex-col justify-between select-none ${
                    isCardFlipped
                      ? 'bg-blue-50/50 dark:bg-[#141b2e] border-blue-400/40 shadow-md'
                      : 'bg-slate-50 dark:bg-[#171c2b] border-slate-200 dark:border-[#262c3e] hover:border-blue-400/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono uppercase font-bold text-blue-600 dark:text-blue-400">
                      {isCardFlipped ? (currentLang === 'en' ? 'ANSWER / RATIONALE' : 'RÉPONSE ET RATIONNEL') : (currentLang === 'en' ? 'QUESTION / CONCEPT' : 'QUESTION / CONCEPT')}
                    </span>
                    <span className="text-[11px] font-mono">
                      {currentLang === 'en' ? 'Click card to flip' : 'Cliquer pour retourner'}
                    </span>
                  </div>

                  <div className="py-4">
                    {!isCardFlipped ? (
                      <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {currentLang === 'en'
                          ? 'What is the fundamental architectural difference between Semantic Ranker in Azure AI Search and traditional BM25 keyword search?'
                          : 'Quelle est la différence architecturale majeure entre le Semantic Ranker d’Azure AI Search et la recherche par mots-clés BM25 ?'}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm sm:text-base font-semibold text-blue-950 dark:text-blue-200">
                          {currentLang === 'en'
                            ? 'BM25 matches exact lexical terms and frequencies (TF-IDF), while Semantic Ranker uses deep Transformer cross-encoders to understand user intent, context, and semantic synonyms on the top-50 results.'
                            : 'BM25 compare les termes lexicaux exacts et leur fréquence (TF-IDF), tandis que le Semantic Ranker applique des cross-encoders Transformer profonds pour comprendre l’intention utilisateur et les synonymes contextuels sur les 50 meilleurs résultats.'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono pt-2 border-t border-blue-200/40 dark:border-blue-500/20">
                          {currentLang === 'en'
                            ? 'Official tip: Semantic Ranker runs L2 reranking on existing results without retraining the index.'
                            : 'Astuce examen : Le Semantic Ranker effectue un reclassement L2 sans ré-entraîner l’index.'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{currentLang === 'en' ? 'Domain 4: Generative AI & RAG' : 'Domaine 4 : Generative AI & RAG'}</span>
                    <span className="font-bold text-blue-500">
                      {isCardFlipped 
                        ? (currentLang === 'en' ? 'Rate your recall below ↓' : 'Évaluez votre rétention ci-dessous ↓') 
                        : (currentLang === 'en' ? 'Flip to reveal answer →' : 'Voir le verso →')}
                    </span>
                  </div>
                </div>

                {/* Rating Buttons */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-xl">
                  <button
                    onClick={() => { setSelectedRating('again'); setIsCardFlipped(true); }}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedRating === 'again'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-100'
                    }`}
                  >
                    <span>{currentLang === 'en' ? 'Again (< 1 min)' : 'À revoir (< 1 min)'}</span>
                  </button>
                  <button
                    onClick={() => { setSelectedRating('good'); setIsCardFlipped(true); }}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedRating === 'good'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40 hover:bg-blue-100'
                    }`}
                  >
                    <span>{currentLang === 'en' ? 'Good (+3 days)' : 'Bien (+3 jours)'}</span>
                  </button>
                  <button
                    onClick={() => { setSelectedRating('easy'); setIsCardFlipped(true); }}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedRating === 'easy'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-100'
                    }`}
                  >
                    <span>{currentLang === 'en' ? 'Easy (+7 days)' : 'Facile (+7 jours)'}</span>
                  </button>
                  <button
                    onClick={handleResetCard}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    title={currentLang === 'en' ? 'Reset demo card' : 'Réinitialiser la carte'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {selectedRating && (
                  <div className="mt-4 text-xs font-mono text-emerald-600 dark:text-emerald-400 text-center animate-fade-in">
                    {currentLang === 'en'
                      ? '✓ SM-2 interval updated: next review scheduled at optimal retention threshold.'
                      : '✓ Intervalle SM-2 mis à jour : prochaine révision planifiée au seuil d’oubli optimal.'}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: MCQ Question Simulator */}
            {demoTab === 'quiz' && (
              <div className="p-6 sm:p-10 max-w-2xl mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {currentLang === 'en' ? 'SCENARIO-BASED EXAM QUESTION' : 'QUESTION D\'EXAMEN SCÉNARISÉE'}
                    </span>
                    <span>{currentLang === 'en' ? '1 point · 70% threshold' : '1 point · Seuil 70%'}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {currentLang === 'en'
                      ? 'You are designing an enterprise RAG application on Azure. You need to prevent prompt injection and block hate speech before responses are returned to users. Which solution is recommended by Microsoft Learn?'
                      : 'Vous concevez une application RAG d’entreprise sur Azure. Vous devez bloquer les injections de prompt et filtrer les propos haineux avant que la réponse ne soit renvoyée à l’utilisateur. Quelle solution est recommandée par Microsoft Learn ?'}
                  </h3>

                  <div className="space-y-2.5 pt-2">
                    {[
                      { id: 0, text: currentLang === 'en' ? 'Configure an Azure AI Content Safety filter with Prompt Shields enabled' : 'Configurer un filtre Azure AI Content Safety avec Prompt Shields activé', correct: true },
                      { id: 1, text: currentLang === 'en' ? 'Add a system prompt telling the LLM never to listen to hacker instructions' : 'Ajouter un system prompt demandant au LLM de ne jamais écouter les instructions pirates', correct: false },
                      { id: 2, text: currentLang === 'en' ? 'Fine-tune GPT-4o on negative samples to permanently remove hate speech' : 'Fine-tuner GPT-4o sur des exemples négatifs pour supprimer les propos haineux', correct: false },
                      { id: 3, text: currentLang === 'en' ? 'Deploy an Azure API Management gateway with regex string matching' : 'Déployer une passerelle Azure API Management avec filtrage par expressions régulières', correct: false },
                    ].map((option) => {
                      const isSelected = selectedQuizOption === option.id;
                      let optionClasses = 'p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-start gap-3 cursor-pointer ';
                      
                      if (!isQuizSubmitted) {
                        optionClasses += isSelected 
                          ? 'bg-blue-500/10 border-blue-500 text-blue-900 dark:text-blue-200 font-medium' 
                          : 'bg-slate-50 dark:bg-[#161b29] border-slate-200 dark:border-[#222738] hover:border-slate-300 dark:hover:border-[#30364d] text-slate-800 dark:text-slate-200';
                      } else {
                        if (option.correct) {
                          optionClasses += 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                        } else if (isSelected) {
                          optionClasses += 'bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-200';
                        } else {
                          optionClasses += 'opacity-50 bg-slate-50 dark:bg-[#161b29] border-slate-200 dark:border-[#222738]';
                        }
                      }

                      return (
                        <div
                          key={option.id}
                          onClick={() => {
                            if (!isQuizSubmitted) setSelectedQuizOption(option.id);
                          }}
                          className={optionClasses}
                        >
                          <span className="w-5 h-5 rounded-full flex items-center justify-center border font-mono text-[11px] shrink-0 mt-0.5">
                            {String.fromCharCode(65 + option.id)}
                          </span>
                          <span className="flex-1">{option.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit / Feedback Controls */}
                  <div className="pt-4 flex items-center justify-between">
                    {!isQuizSubmitted ? (
                      <button
                        onClick={() => {
                          if (selectedQuizOption !== null) setIsQuizSubmitted(true);
                        }}
                        disabled={selectedQuizOption === null}
                        className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        {currentLang === 'en' ? 'Validate Answer' : 'Valider la réponse'}
                      </button>
                    ) : (
                      <div className="w-full space-y-3">
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-200">
                          <div className="font-bold mb-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>
                              {currentLang === 'en' 
                                ? 'Official Microsoft Learn rationale:' 
                                : 'Explication officielle Microsoft Learn :'}
                            </span>
                          </div>
                          <p>
                            {currentLang === 'en'
                              ? 'Azure AI Content Safety provides dedicated models for detecting prompt injection threats (Prompt Shields) and multidimensional content filtering for hate, violence, and sexual content both pre- and post-inference.'
                              : 'Azure AI Content Safety propose des modèles dédiés à la détection des menaces de prompt injection (Prompt Shields) et au filtrage multidimensionnel des contenus haineux, violents ou sexuels, en amont et en aval de l\'inférence.'}
                          </p>
                        </div>
                        <button
                          onClick={handleResetQuiz}
                          className="py-1.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1a2030] text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {currentLang === 'en' ? 'Try Again' : 'Rejouer la question'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Bar inside shell */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-[#0c0f18] border-t border-slate-200 dark:border-[#1c2130] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {currentLang === 'en'
                  ? 'Ready for the full experience with 18 official exams?'
                  : 'Prêt pour l’expérience complète avec les 18 certifications ?'}
              </span>
              <button
                onClick={() => onNavigate('today')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>{currentLang === 'en' ? 'Access Complete Cockpit' : 'Accéder au Cockpit Complet'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4.5. REAL APPLICATION SCREENSHOTS & DISCOVERY TOUR */}
      <section id="captures" className="py-20 bg-slate-50 dark:bg-[#090d16] border-t border-slate-200 dark:border-[#1a1f2e] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentLang === 'en' ? 'Interface Transparency' : 'Transparence & Interface Réelle'}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
              {currentLang === 'en' 
                ? 'Authentic Screenshots of the CertifIA Platform' 
                : 'Captures d’Écran Réelles de l’Application CertifIA'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentLang === 'en'
                ? 'Explore the genuine user interface: daily SM-2 cockpits, 4-level orientation pathways, scenario MCQs, flashcard engines, timed mock exams, and the automated onboarding tour.'
                : 'Découvrez l’interface réelle de l’application : cockpit quotidien SM-2, moteur d’orientation 4 niveaux, QCM scénarisés, fiches mémo, examens blancs chronométrés et découverte guidée.'}
            </p>
          </div>

          {/* Module Selector Pills */}
          <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {screenshotsList.map((item) => {
              const isActive = activeScreenshotTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreenshotTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-[#141824] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c2233] border border-slate-200 dark:border-[#222838]'
                  }`}
                >
                  <span>{item.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Active Screenshot Display Window */}
          {(() => {
            const currentItem = screenshotsList.find((s) => s.id === activeScreenshotTab) || screenshotsList[0];
            return (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-[#222838] bg-white dark:bg-[#121622] shadow-2xl shadow-blue-500/10">
                {/* Window Chrome Header */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-[#1e2333] bg-slate-50/80 dark:bg-[#0e121c]/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                      certifia.app • {currentLang === 'en' ? currentItem.titleEn : currentItem.titleFr}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate(currentItem.screen)}
                      className="px-3 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>{currentLang === 'en' ? 'Open in App' : 'Ouvrir dans l’app'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Screenshot Visual Frame */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                  <img
                    src={currentItem.src}
                    alt={currentLang === 'en' ? currentItem.titleEn : currentItem.titleFr}
                    className="w-full h-full object-contain object-top"
                  />
                </div>

                {/* Bottom Context Callout */}
                <div className="p-6 bg-slate-50 dark:bg-[#0f131d] border-t border-slate-200 dark:border-[#1e2333] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {currentItem.badge}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {currentLang === 'en' ? currentItem.titleEn : currentItem.titleFr}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                      {currentLang === 'en' ? currentItem.descEn : currentItem.descFr}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate(currentItem.screen)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
                  >
                    <span>{currentLang === 'en' ? 'Test This Module' : 'Tester ce module'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* 5. CERTIFICATIONS SHOWCASE */}
      <section id="certifications" className="py-20 bg-slate-100/60 dark:bg-[#0e121c] border-t border-slate-200 dark:border-[#1a1f2e] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentLang === 'en' ? 'Official Catalog' : 'Catalogue Officiel'}
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en' 
                  ? 'Covering the 18 Major AI & Cloud Certifications' 
                  : '18 Certifications Officielles Préparées'}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {currentLang === 'en'
                  ? 'Blueprints aligned with the latest vendor revisions (Azure, AWS, GCP, IBM, NVIDIA).'
                  : 'Blueprints officiels continuellement alignés avec les dernières mises à jour éditeurs.'}
              </p>
            </div>

            {/* Provider Filter Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#161a26] border border-slate-200 dark:border-[#222738] rounded-xl self-start md:self-auto">
              {[
                { id: 'all', label: currentLang === 'en' ? 'All' : 'Toutes' },
                { id: 'azure', label: 'Azure' },
                { id: 'aws', label: 'AWS' },
                { id: 'gcp', label: 'Google Cloud' },
                { id: 'ibm', label: 'IBM watsonx' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProvider(p.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedProvider === p.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCerts.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] p-6 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-lg transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {cert.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {cert.providerName}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cert.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {cert.targetAudience}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1c2130] grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0f131d]">
                      <span className="text-slate-400 block text-[10px]">Questions</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cert.itemsCount}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0f131d]">
                      <span className="text-slate-400 block text-[10px]">Domaines</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cert.domains?.length || 5}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0f131d]">
                      <span className="text-slate-400 block text-[10px]">Durée</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cert.durationMinutes} min</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1c2130] flex items-center justify-between gap-2">
                  {onOpenBlueprint && (
                    <button
                      onClick={() => onOpenBlueprint(cert.id)}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Blueprint</span>
                    </button>
                  )}
                  <button
                    onClick={() => onNavigate('catalogue')}
                    className="ml-auto py-1.5 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>{currentLang === 'en' ? 'Practice' : 'S’entraîner'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('catalogue')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[#161a26] border border-slate-200 dark:border-[#222738] text-sm font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-all shadow-sm"
            >
              <Compass className="w-4 h-4 text-blue-500" />
              <span>{currentLang === 'en' ? 'Open Full Catalog & Comparison Matrix' : 'Consulter le catalogue complet et le comparateur'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 6. VERIFIED TESTIMONIALS & SOCIAL PROOF */}
      <section id="temoignages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentLang === 'en' ? 'Verified Outcomes' : 'Résultats & Témoignages'}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
              {currentLang === 'en' 
                ? 'Endorsed by Certified Cloud Engineers' 
                : 'Validé par des ingénieurs certifiés'}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {currentLang === 'en'
                ? 'Engineers from top consulting firms and tech enterprises rely on CertifIA.'
                : 'Des consultants et architectes chez Capgemini, Thales et Sopra Steria préparent leurs examens avec CertifIA.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] shadow-sm flex flex-col justify-between">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                {currentLang === 'en'
                  ? '“I passed Microsoft Azure AI-102 with a score of 870/1000 in just 3 weeks. The SM-2 flashcards systematically eliminated my blind spots on Azure AI Search and cross-encoders instead of passive memorization.”'
                  : '« J\'ai validé Microsoft Azure AI-102 avec un score de 870/1000 en seulement 3 semaines. Les fiches SM-2 vous forcent à combler les angles morts d\'Azure AI Search et des cross-encoders au lieu de bachoter bêtement. »'}
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1c2130]">
                <div className="font-bold text-sm text-slate-900 dark:text-white">Julien D.</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Cloud Solution Architect · Capgemini</div>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  {currentLang === 'en' ? 'Certified AI-102 (Score: 870/1000)' : 'Certifié AI-102 (Score : 870/1000)'}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] shadow-sm flex flex-col justify-between">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                {currentLang === 'en'
                  ? '“The timed mock exam with the official 700-point threshold accurately replicates the Pearson VUE exam pressure. Distractors and traps are dissected thoroughly by the AI tutor without giving away trivial answers.”'
                  : '« Le simulateur chronométré avec le seuil officiel de 700 points reproduit exactement l’ambiance stressante du centre Pearson VUE. Les distracteurs sont expliqués sans concession par le tuteur IA. »'}
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1c2130]">
                <div className="font-bold text-sm text-slate-900 dark:text-white">Sarah M.</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Lead Data Scientist · Thales</div>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  {currentLang === 'en' ? 'Certified AWS AIF-C01 & MLS-C01' : 'Certifiée AWS AIF-C01 & MLS-C01'}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] shadow-sm flex flex-col justify-between">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                {currentLang === 'en'
                  ? '“Finally a bilingual platform that treats watsonx, Vertex AI, and Bedrock with equal technical depth. The personalized pathway calibrated my 6 weekly study hours with clinical accuracy.”'
                  : '« Enfin une plateforme francophone et anglophone qui intègre watsonx, Vertex AI et Bedrock au même niveau. Le parcours personnalisé a parfaitement calibré mes 6 heures d\'étude par semaine. »'}
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1c2130]">
                <div className="font-bold text-sm text-slate-900 dark:text-white">Kevin L.</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">MLOps Specialist · Sopra Steria</div>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  {currentLang === 'en' ? 'Certified Google Cloud PMLE' : 'Certifié Google Cloud PMLE'}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FINAL CONVERSION BANNER */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white shadow-2xl">
            
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-200">
                {currentLang === 'en' ? 'Instant Access' : 'Accès Immédiat & Gratuit'}
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-headline">
                {currentLang === 'en'
                  ? 'Ready to Earn Your Cloud AI Certification?'
                  : 'Prêt à valider votre prochaine certification IA ?'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-blue-100/90 leading-relaxed">
                {currentLang === 'en'
                  ? 'Access the cockpit immediately in guest mode or sync your progress across devices. No subscription barrier, no intrusive tracking.'
                  : 'Accédez instantanément au cockpit d’entraînement en mode invité ou synchronisez votre progression en ligne. Zéro barrière, 100% axé sur votre réussite.'}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => onNavigate('today')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>{currentLang === 'en' ? 'Enter Learning Cockpit' : 'Ouvrir le cockpit d’apprentissage'}</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </button>

                <button
                  onClick={() => onNavigate('recommendation')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-700/60 hover:bg-blue-700/80 border border-blue-400/30 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Generate My AI Pathway' : 'Générer mon parcours personnalisé'}</span>
                </button>
              </div>

              <div className="mt-6 flex items-center gap-4 text-xs text-blue-200/80 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentLang === 'en' ? 'Mode Guest Instantané' : 'Mode invité sans inscription'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentLang === 'en' ? 'PWA & Offline Ready' : 'Compatible PWA & Hors-ligne'}</span>
                </span>
              </div>
            </div>

            {/* Ambient decorative light */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 8. QUIET FOOTER */}
      <footer className="border-t border-slate-200 dark:border-[#1a1f2e] bg-white dark:bg-[#090c14] py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <CertifAILogo showSubtitle={false} />
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
                  Certif<span className="text-blue-600 dark:text-blue-400">IA</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                  Plateforme d’entraînement certifiant Cloud IA
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <a href="#piliers" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                {currentLang === 'en' ? 'Methodology' : 'Méthode SM-2'}
              </a>
              <a href="#simulateur" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                {currentLang === 'en' ? 'Interactive Demo' : 'Démonstrateur'}
              </a>
              <a href="#certifications" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                {currentLang === 'en' ? '18 Certifications' : '18 Certifications'}
              </a>
              <button 
                onClick={() => onNavigate('today')} 
                className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
              >
                {currentLang === 'en' ? 'Open App Cockpit' : 'Accéder à l’application'}
              </button>
            </div>

            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              © {new Date().getFullYear()} CertifIA • RGPD Conforme • Tous droits réservés
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
};
