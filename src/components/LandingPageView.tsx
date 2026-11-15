import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  Clock,
  Compass,
  Bot,
  Award,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Zap,
  Brain,
  Database,
  BarChart3,
  Sun,
  Moon,
  ExternalLink,
  Target,
  Globe,
  Smartphone,
  HelpCircle,
  AlertTriangle,
  ArrowUp,
  Menu,
  X,
} from 'lucide-react';
import { AppScreen } from '../types';
import { CertifAILogo } from './CertifAILogo';
import { LanguageSelector } from './LanguageSelector';
import { useTheme } from '../context/ThemeContext';

interface LandingPageViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (certId: string) => void;
  onOpenAIAssistant?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onNavigate,
  onOpenBlueprint,
  onOpenAIAssistant,
}) => {
  const { t, i18n } = useTranslation(['navigation', 'common', 'certifications', 'dashboard']);
  const { theme, toggleTheme } = useTheme();
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'fr';

  // Navigation & Scroll states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Interactive section states
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activePillar, setActivePillar] = useState<number>(0);
  const [activeMethodStep, setActiveMethodStep] = useState<number>(0);
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'azure' | 'aws' | 'gcp' | 'ibm' | 'nvidia'>('all');
  const [activeScreenshotTab, setActiveScreenshotTab] = useState<string>('today');
  const [retentionMode, setRetentionMode] = useState<'sm2' | 'ebbinghaus'>('sm2');

  // Socratic AI dialogue demo state
  const [socraticStep, setSocraticStep] = useState<number>(0);

  // Demo simulator interactive states (Flashcard & Quiz)
  const [demoTab, setDemoTab] = useState<'flashcard' | 'quiz'>('flashcard');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // Accessibility Refs for Mobile/Tablet Drawer
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);
  const drawerCloseBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll listener for header elevation & back-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 16);
      setShowScrollTop(y > 420);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = useCallback((restoreFocus = false) => {
    setIsMobileMenuOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => {
        hamburgerBtnRef.current?.focus();
      });
    }
  }, []);

  // Body scroll lock, Escape handling, and Focus management when drawer is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button inside drawer on open
    requestAnimationFrame(() => {
      drawerCloseBtnRef.current?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMobileMenu(true);
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  const scrollToSection = (sectionId: string) => {
    closeMobileMenu(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const handleResetCard = () => {
    setIsCardFlipped(false);
    setSelectedRating(null);
  };

  const handleResetQuiz = () => {
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
  };

  // Primary 4 navigation links per UX/UI architecture specification
  const primaryNavLinks = [
    {
      id: 'piliers',
      label: t('navigation:landingNav.features'),
      icon: Layers,
    },
    {
      id: 'certifications',
      label: t('navigation:landingNav.certifications'),
      icon: Award,
    },
    {
      id: 'methode',
      label: t('navigation:landingNav.method'),
      icon: Compass,
    },
    {
      id: 'faq',
      label: t('navigation:landingNav.faq'),
      icon: HelpCircle,
    },
  ];

  // Real verified screenshot catalog
  const screenshotsList = [
    {
      id: 'today',
      titleFr: 'Cockpit du Jour & Algorithme CertifIA',
      titleEn: 'Daily Cockpit & CertifIA Algorithm',
      badge: '01. Cockpit',
      descFr:
        'Session matinale calibrée (~22 min) : 17 fiches prioritaires au seuil d’oubli SM-2, 8 notions fragiles identifiées, 12 QCM ciblés et progression vers les 700 / 1 000 points.',
      descEn:
        'Calibrated morning session (~22 min): 17 priority cards at SM-2 decay threshold, 8 fragile concepts, 12 targeted MCQs, and telemetry toward 700 / 1,000 pts.',
      src: 'assets/screenshots/certifia-cockpit-today.png',
      screen: 'today' as AppScreen,
    },
    {
      id: 'pathway',
      titleFr: 'Moteur d’Orientation & Parcours 4 Niveaux',
      titleEn: 'Orientation Engine & 4-Level Pathways',
      badge: '02. Parcours',
      descFr:
        'Diagnostic modélisé selon votre rôle (Développeur, Data Scientist, Architecte), votre budget et vos disponibilités hebdomadaires.',
      descEn:
        'Structured diagnostic tailored to your role (Developer, Data Scientist, Architect), budget, and weekly study availability.',
      src: 'assets/screenshots/certifia-orientation-pathway.png',
      screen: 'recommendation' as AppScreen,
    },
    {
      id: 'activity',
      titleFr: 'Objectifs d’Examen & Activités Récentes',
      titleEn: 'Target Exam & Recent Activity Log',
      badge: '03. Activité',
      descFr:
        'Suivi de l’examen cible (AI-102), date cible, objectif hebdomadaire et prochaines étapes priorisées.',
      descEn:
        'Target exam tracking (AI-102), target exam date, weekly revision pace, and prioritized next steps.',
      src: 'assets/screenshots/certifia-details-activity.png',
      screen: 'today' as AppScreen,
    },
    {
      id: 'catalogue',
      titleFr: 'Catalogue des 18 Certifications Cloud & IA',
      titleEn: 'Official 18 Cloud AI Certifications Catalog',
      badge: '04. Catalogue',
      descFr:
        'Référentiel bilingue Microsoft Azure, AWS, Google Cloud, IBM watsonx et NVIDIA avec blueprints détaillés et comparateur.',
      descEn:
        'Bilingual catalog covering Microsoft Azure, AWS, Google Cloud, IBM watsonx, and NVIDIA with detailed blueprints.',
      src: 'assets/screenshots/certifia-catalogue-view.svg',
      screen: 'catalogue' as AppScreen,
    },
    {
      id: 'quiz',
      titleFr: 'Moteur QCM & Analyse des Pièges',
      titleEn: 'Scenario MCQs & Pitfall Breakdown',
      badge: '05. QCM',
      descFr:
        'Mises en situation d’architecture d’entreprise avec décryptage minutieux de chaque distracteur et schémas de flux.',
      descEn:
        'Enterprise architecture scenarios with thorough distractor analysis and cloud architecture flowcharts.',
      src: 'assets/screenshots/certifia-quiz-engine.svg',
      screen: 'quiz' as AppScreen,
    },
    {
      id: 'flashcards',
      titleFr: 'Fiches Mémo & Répétition Espacée SM-2',
      titleEn: 'Flashcards & SM-2 Spaced Repetition',
      badge: '06. Fiches SRS',
      descFr:
        '2 800 fiches mémo classées par domaine avec échelle de rappel à 4 boutons (1j, 3j, 7j, 14j).',
      descEn:
        '2,800 flashcards sorted by exam domains with a 4-button recall grading scale (1d, 3d, 7d, 14d).',
      src: 'assets/screenshots/certifia-flashcards-srs.svg',
      screen: 'flashcards' as AppScreen,
    },
    {
      id: 'exam',
      titleFr: 'Examens Blancs Chronométrés',
      titleEn: 'Timed Mock Examinations',
      badge: '07. Examen Blanc',
      descFr:
        'Simulation en conditions réelles (90 à 120 min), seuil officiel de 700 / 1 000 pts et débriefing par domaine.',
      descEn:
        'Full test-center simulation (90 to 120 min), official 700-point cutoff, and post-exam domain debrief.',
      src: 'assets/screenshots/certifia-mock-exam.svg',
      screen: 'exam' as AppScreen,
    },
    {
      id: 'assistant',
      titleFr: 'Tuteur Pédagogique IA Socratique',
      titleEn: 'Socratic AI Pedagogical Tutor',
      badge: '08. Tuteur IA',
      descFr:
        'Dialogue socratique contextualisé expliquant les compromis d’architecture sans divulgâcher la réponse.',
      descEn:
        'Contextual Socratic tutor guiding architectural trade-offs without spoiling answers.',
      src: 'assets/screenshots/certifia-ai-tutor.svg',
      screen: 'assistant' as AppScreen,
    },
    {
      id: 'analytics',
      titleFr: 'Télémétrie Cognitive & Préparation',
      titleEn: 'Cognitive Analytics & Readiness',
      badge: '09. Analytics',
      descFr:
        'Indice de préparation globale, courbe de rétention Ebbinghaus vs SM-2 et radar de maîtrise par domaine.',
      descEn:
        'Overall readiness index, Ebbinghaus vs SM-2 retention curves, and domain mastery tracking.',
      src: 'assets/screenshots/certifia-analytics-dashboard.svg',
      screen: 'analytics' as AppScreen,
    },
    {
      id: 'tour',
      titleFr: 'Visite Guidée Automatique',
      titleEn: 'Automated Onboarding Tour',
      badge: '10. Visite Guidée',
      descFr:
        'Découverte progressive de la plateforme avec spotlight visuel et commandes Pause / Précédent / Continuer / Quitter.',
      descEn:
        'Progressive platform walkthrough with visual spotlight rings and Pause / Previous / Resume / Exit controls.',
      src: 'assets/screenshots/certifia-onboarding-tour.svg',
      screen: 'today' as AppScreen,
    },
  ];

  const extendedCatalog = [
    {
      id: 'ai102',
      code: 'AI-102',
      provider: 'azure',
      providerName: 'Microsoft Azure',
      title: 'Azure AI Engineer Associate',
      level: 'Associate',
      descFr: 'Solutions d’IA générative Azure OpenAI, Azure AI Search, RAG hybride, Vision et Speech.',
      descEn: 'Enterprise generative AI with Azure OpenAI, Azure AI Search, Hybrid RAG, Vision, and Speech.',
      duration: 100,
      passScore: 700,
    },
    {
      id: 'ai900',
      code: 'AI-900',
      provider: 'azure',
      providerName: 'Microsoft Azure',
      title: 'Azure AI Fundamentals',
      level: 'Fondamental',
      descFr: 'Principes fondamentaux du machine learning, computer vision, NLP et IA responsable.',
      descEn: 'Foundational concepts of machine learning, computer vision, NLP, and responsible AI.',
      duration: 65,
      passScore: 700,
    },
    {
      id: 'dp100',
      code: 'DP-100',
      provider: 'azure',
      providerName: 'Microsoft Azure',
      title: 'Azure Data Scientist Associate',
      level: 'Associate',
      descFr: 'Entraînement de modèles ML, AutoML, MLflow et déploiement d’endpoints d’inférence.',
      descEn: 'Training ML models, AutoML, MLflow, compute targets, and real-time inference endpoints.',
      duration: 120,
      passScore: 700,
    },
    {
      id: 'aifc01',
      code: 'AIF-C01',
      provider: 'aws',
      providerName: 'Amazon Web Services',
      title: 'AWS Certified AI Practitioner',
      level: 'Fondamental',
      descFr: 'IA générative, Amazon Bedrock, SageMaker JumpStart, sécurité IAM et gouvernance.',
      descEn: 'Generative AI fundamentals, Amazon Bedrock, SageMaker JumpStart, IAM security, and governance.',
      duration: 85,
      passScore: 700,
    },
    {
      id: 'mlsc01',
      code: 'MLS-C01',
      provider: 'aws',
      providerName: 'Amazon Web Services',
      title: 'AWS Machine Learning Specialty',
      level: 'Spécialiste',
      descFr: 'Ingénierie des données S3/Glue, algorithmes SageMaker, tuning et MLOps.',
      descEn: 'Data engineering on S3/Glue, SageMaker modeling, hyperparameter tuning, and MLOps.',
      duration: 180,
      passScore: 750,
    },
    {
      id: 'aws-bedrock',
      code: 'AWS-BEDROCK',
      provider: 'aws',
      providerName: 'Amazon Web Services',
      title: 'Amazon Bedrock Specialist',
      level: 'Associate',
      descFr: 'Agents autonomes Bedrock, Knowledge Bases OpenSearch, Guardrails et LoRA.',
      descEn: 'Bedrock autonomous agents, OpenSearch Knowledge Bases, Guardrails, and LoRA tuning.',
      duration: 100,
      passScore: 720,
    },
    {
      id: 'gcpmle',
      code: 'GCP-PMLE',
      provider: 'gcp',
      providerName: 'Google Cloud',
      title: 'Professional ML Engineer',
      level: 'Spécialiste',
      descFr: 'Architecture Vertex AI, Kubeflow Pipelines, GPU/TPU, BigQuery ML et drift monitoring.',
      descEn: 'Vertex AI architecture, Kubeflow Pipelines, GPU/TPU accelerators, BigQuery ML, and drift checks.',
      duration: 120,
      passScore: 750,
    },
    {
      id: 'gcp-cdl',
      code: 'GCP-CDL-AI',
      provider: 'gcp',
      providerName: 'Google Cloud',
      title: 'Cloud Digital Leader & GenAI',
      level: 'Fondamental',
      descFr: 'Transformation cloud, cas d’usage Vertex AI Studio, Gemini d’entreprise et IAM.',
      descEn: 'Enterprise cloud transformation, Vertex AI Studio, Gemini enterprise models, and IAM.',
      duration: 90,
      passScore: 700,
    },
    {
      id: 'watsonx',
      code: 'C1000-177',
      provider: 'ibm',
      providerName: 'IBM watsonx',
      title: 'IBM watsonx.ai Specialist',
      level: 'Spécialiste',
      descFr: 'Prompt Lab, modèles Granite, watsonx.data Iceberg et conformité EU AI Act.',
      descEn: 'Prompt Lab, Granite models, watsonx.data Iceberg lakehouse, and EU AI Act readiness.',
      duration: 90,
      passScore: 620,
    },
    {
      id: 'ibm-wgov',
      code: 'IBM-WGOV',
      provider: 'ibm',
      providerName: 'IBM watsonx',
      title: 'IBM watsonx.governance Specialist',
      level: 'Spécialiste',
      descFr: 'Factsheets automatisées, détection de biais, Disparate Impact et conformité ISO.',
      descEn: 'Automated Factsheets, bias mitigation, Disparate Impact tracking, and ISO compliance.',
      duration: 90,
      passScore: 650,
    },
    {
      id: 'nv-genai',
      code: 'NV-GENAI',
      provider: 'nvidia',
      providerName: 'NVIDIA DLI',
      title: 'Generative AI LLMs Associate',
      level: 'Associate',
      descFr: 'Transformers, quantization AWQ/FP8, TensorRT-LLM, NeMo et NeMo Guardrails.',
      descEn: 'Transformers, AWQ/FP8 quantization, TensorRT-LLM, NeMo framework, and NeMo Guardrails.',
      duration: 90,
      passScore: 700,
    },
    {
      id: 'nv-triton',
      code: 'NV-TRITON',
      provider: 'nvidia',
      providerName: 'NVIDIA DLI',
      title: 'Triton & TensorRT Architect',
      level: 'Spécialiste',
      descFr: 'Dynamic batching, model pipelining et inférence GPU basse latence Hopper/Blackwell.',
      descEn: 'Dynamic batching, model pipelining, and ultra-low-latency Hopper/Blackwell GPU serving.',
      duration: 90,
      passScore: 700,
    },
  ];

  const filteredCerts = extendedCatalog.filter((c) => {
    if (selectedProvider === 'all') return true;
    return c.provider === selectedProvider;
  });

  const socraticDialogue = [
    {
      speaker: 'candidate',
      labelFr: 'Candidat (Préparation AI-102)',
      labelEn: 'Candidate (AI-102 Prep)',
      textFr:
        'Pour améliorer la précision d’un système RAG sur des documents juridiques, faut-il fine-tuner GPT-4o ou activer le Semantic Ranker d’Azure AI Search ?',
      textEn:
        'To improve RAG precision on legal documents, should I fine-tune GPT-4o or enable Semantic Ranker in Azure AI Search?',
    },
    {
      speaker: 'tutor',
      labelFr: 'Tuteur Pédagogique CertifIA',
      labelEn: 'CertifIA AI Tutor',
      textFr:
        'Excellente question d’architecture. Demandons-nous d’abord : le fine-tuning injecte-t-il des faits vérifiables et actualisés, ou adapte-t-il principalement le style et le format de sortie ?',
      textEn:
        'Great architectural question. First ask yourself: does fine-tuning inject fresh, verifiable facts, or does it primarily adapt tone and output structure?',
    },
    {
      speaker: 'candidate',
      labelFr: 'Candidat',
      labelEn: 'Candidate',
      textFr:
        'Le fine-tuning modifie le style, mais risque d’halluciner sur des clauses précises. Les connaissances dynamiques doivent être récupérées au moment de la requête.',
      textEn:
        'Fine-tuning adapts style and formatting, but risks hallucinating specific clauses. Dynamic knowledge must be retrieved at query time.',
    },
    {
      speaker: 'tutor',
      labelFr: 'Tuteur Pédagogique CertifIA',
      labelEn: 'CertifIA AI Tutor',
      textFr:
        'Exactement. Règle clé : utilisez une recherche hybride (BM25 + Vecteurs) suivie du Semantic Ranker L2, qui réordonne les 50 meilleurs extraits par cross-encoders Transformer sans ré-entraîner le LLM.',
      textEn:
        'Spot on. Key rule: pair hybrid search (BM25 + Vectors) with L2 Semantic Ranker, which reranks the top-50 chunks via Transformer cross-encoders without retraining the LLM.',
    },
  ];

  const faqData = [
    {
      qFr: 'Qu’est-ce que CertifIA exactement ?',
      qEn: 'What exactly is CertifIA?',
      aFr: 'CertifIA est un environnement intelligent dédié à la préparation des certifications Cloud Computing et Intelligence Artificielle (Microsoft Azure, AWS, Google Cloud, IBM watsonx et NVIDIA). Il réunit un cockpit quotidien avec répétition espacée SM-2, 2 800 fiches mémo, des QCM scénarisés, des examens blancs chronométrés et un tuteur socratique.',
      aEn: 'CertifIA is an intelligent platform dedicated to Cloud Computing and AI certification preparation (Microsoft Azure, AWS, Google Cloud, IBM watsonx, and NVIDIA). It combines a daily SM-2 spaced repetition cockpit, 2,800 flashcards, scenario MCQs, timed mock exams, and a Socratic AI tutor.',
    },
    {
      qFr: 'À qui s’adresse la plateforme ?',
      qEn: 'Who is the platform designed for?',
      aFr: 'Aux développeurs, architectes solutions, data scientists, ingénieurs MLOps, consultants et étudiants qui souhaitent structurer et accélérer leur préparation certifiante, du niveau fondamental (Niveau 1) au niveau expert (Niveau 4).',
      aEn: 'Software developers, solution architects, data scientists, MLOps engineers, consultants, and learners seeking structured certification preparation from Foundational (Level 1) to Specialist (Level 4).',
    },
    {
      qFr: 'Quelles certifications sont disponibles dans le catalogue ?',
      qEn: 'Which certifications are available in the catalog?',
      aFr: 'Le catalogue couvre 18 certifications Cloud & IA majeures réparties entre Microsoft Azure (AI-102, AI-900, DP-100), AWS (AIF-C01, MLS-C01, Bedrock), Google Cloud (PMLE, Cloud Digital Leader AI), IBM watsonx (C1000-177, watsonx.governance) et NVIDIA (GenAI LLMs, Triton Inference Server).',
      aEn: 'The catalog covers 18 major Cloud & AI certifications across Microsoft Azure (AI-102, AI-900, DP-100), AWS (AIF-C01, MLS-C01, Bedrock), Google Cloud (PMLE, Cloud Digital Leader AI), IBM watsonx (C1000-177, watsonx.governance), and NVIDIA (GenAI LLMs, Triton Inference Server).',
    },
    {
      qFr: 'Comment fonctionne la répétition espacée SM-2 ?',
      qEn: 'How does SM-2 spaced repetition work?',
      aFr: 'L’algorithme SuperMemo-2 modélise la courbe d’oubli d’Ebbinghaus. Chaque carte mémo reçoit un intervalle calculé (1, 3, 7, 14 ou 30 jours) selon votre qualité de rappel afin de réviser uniquement au moment critique précédant l’oubli.',
      aEn: 'The SuperMemo-2 algorithm models the Ebbinghaus forgetting curve. Each flashcard receives a dynamically computed interval (1, 3, 7, 14, or 30 days) based on your recall confidence so you review right before memory decay occurs.',
    },
    {
      qFr: 'Peut-on passer des examens blancs en conditions réelles ?',
      qEn: 'Can I take timed mock exams under realistic conditions?',
      aFr: 'Oui. Le mode Examen Blanc simule le chronomètre officiel (85 à 180 minutes), le marquage des questions à revoir et la notation au seuil officiel (700 ou 750 / 1 000 pts) avec débriefing détaillé par domaine.',
      aEn: 'Yes. Mock Exam mode simulates official countdown timers (85 to 180 minutes), question flagging for review, and strict grading against official passing thresholds (700 or 750 / 1,000 pts) with domain debriefing.',
    },
    {
      qFr: 'Comment fonctionne le tuteur pédagogique IA ?',
      qEn: 'How does the pedagogical AI tutor work?',
      aFr: 'Le tuteur emploie une approche socratique : au lieu de donner la réponse brute, il guide votre raisonnement sur les compromis d’architecture (coût, latence, précision, sécurité) avec des références aux documentations officielles.',
      aEn: 'The tutor follows a Socratic approach: instead of giving away raw answers, it guides your reasoning around architectural trade-offs (cost, latency, accuracy, security) with references to official vendor documentation.',
    },
    {
      qFr: 'CertifIA est-il disponible en anglais ?',
      qEn: 'Is CertifIA available in English?',
      aFr: 'Oui, CertifIA est intégralement bilingue français et anglais grâce à 13 namespaces i18next synchronisés en parité stricte 1:1. Le changement de langue est instantané sans rechargement de page.',
      aEn: 'Yes, CertifIA is fully bilingual in French and English across 13 i18next namespaces with strict 1:1 parity. Language switching is instantaneous without reloading the page.',
    },
    {
      qFr: 'Peut-on utiliser CertifIA sur mobile et tablette ?',
      qEn: 'Can CertifIA be used on mobile and tablet devices?',
      aFr: 'Oui, l’interface est responsive de 320 px à 1920 px avec des contrôles tactiles ergonomiques et une barre de navigation mobile dédiée.',
      aEn: 'Yes, the interface is responsive from 320px to 1920px with ergonomic touch targets and dedicated mobile navigation.',
    },
    {
      qFr: 'L’application fonctionne-t-elle hors ligne ?',
      qEn: 'Does the application work offline?',
      aFr: 'CertifIA est une Progressive Web App (PWA) installable. Les ressources mises en cache via le Service Worker (interface, 2 800 fiches mémo, algorithme SM-2 et progression locale) restent utilisables hors ligne. Les requêtes dynamiques au tuteur IA nécessitent une connexion Internet.',
      aEn: 'CertifIA is an installable Progressive Web App (PWA). Service Worker cached assets (UI, 2,800 flashcards, SM-2 scheduler, and local progress) remain functional offline. Real-time AI tutor requests require an active connection.',
    },
    {
      qFr: 'CertifIA est-il affilié à Microsoft, AWS, Google, IBM ou NVIDIA ?',
      qEn: 'Is CertifIA affiliated with Microsoft, AWS, Google, IBM, or NVIDIA?',
      aFr: 'Non. CertifIA est un projet indépendant d’entraînement cognitif et n’est affilié, sponsorisé ni certifié par aucun organisme certificateur officiel. Toutes les marques citées appartiennent à leurs détenteurs respectifs.',
      aEn: 'No. CertifIA is an independent cognitive preparation project and is neither affiliated with, sponsored by, nor endorsed by any official certification vendor. All trademarks belong to their respective owners.',
    },
    {
      qFr: 'Les questions sont-elles des questions officielles d’examen ?',
      qEn: 'Are the questions official confidential exam dumps?',
      aFr: 'Non. CertifIA respecte strictement les accords de non-divulgation (NDA) des éditeurs. Tous les scénarios, QCM et fiches sont des créations pédagogiques originales conçues pour développer une compréhension authentique.',
      aEn: 'No. CertifIA strictly respects vendor non-disclosure agreements (NDAs). All scenarios, MCQs, and flashcards are original pedagogical reconstructions created to build genuine technical mastery.',
    },
    {
      qFr: 'Comment accéder à l’application ?',
      qEn: 'How can I access the application?',
      aFr: 'Cliquez sur « Accéder à CertifIA » depuis n’importe quel bouton de cette page. Vous entrez immédiatement dans le cockpit quotidien en mode invité, sans carte bancaire ni barrière d’inscription.',
      aEn: 'Click "Access CertifIA" from any call to action on this page. You enter the daily learning cockpit immediately in guest mode with no credit card or registration barrier.',
    },
  ];

  const currentScreenshot =
    screenshotsList.find((s) => s.id === activeScreenshotTab) || screenshotsList[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0e17] dark:text-[#dfe2f1] selection:bg-blue-500/20 selection:text-blue-600 transition-colors duration-200">
      {/* =========================================================================
          SECTION 1 — HEADER & NAVIGATION (3 Zones strictes, 0 débordement)
          - Desktop >= 1280px : Identité | 4 liens | FR/EN + Thème + CTA
          - Tablette 768-1279px : Identité | FR/EN + Thème + CTA + Hamburger
          - Mobile < 768px : Identité compacte | Hamburger (options dans drawer)
          ========================================================================= */}
      <header
        className={`sticky top-0 z-50 w-full transition-colors duration-200 border-b ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#0b0e17]/95 backdrop-blur-md border-slate-200 dark:border-[#1c2130] shadow-sm'
            : 'bg-white/85 dark:bg-[#0b0e17]/85 backdrop-blur-md border-slate-200/70 dark:border-[#1c2130]/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] sm:h-[72px] flex items-center justify-between gap-4 min-w-0">
          {/* Zone 1 : Identité (Logo + CertifIA + sous-titre discret) */}
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2.5 min-w-0 text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 py-1"
            aria-label={t('navigation:landingNav.homeAria')}
          >
            <CertifAILogo iconOnly className="shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap font-headline">
                Certif<span className="text-blue-600 dark:text-blue-400">IA</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide leading-tight mt-0.5 truncate">
                {t('navigation:landingNav.subtitle')}
              </span>
            </div>
          </button>

          {/* Zone 2 : Navigation centrale desktop (>= 1280px uniquement : 4 rubriques) */}
          <nav
            aria-label={t('navigation:landingNav.navAria')}
            className="hidden xl:flex items-center gap-7 min-w-0 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            {primaryNavLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
                className="py-2 px-1 whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3 : Commandes à droite */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Tablet (768-1279px) & Desktop (>=1280px) Controls */}
            <div className="hidden md:flex items-center gap-2.5">
              <LanguageSelector variant="compact" />

              <button
                type="button"
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-[#262c3e] bg-white dark:bg-[#141824] text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1b2030] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                title={theme === 'dark' ? t('common:theme.lightMode') : t('common:theme.darkMode')}
                aria-label={t('common:theme.toggle')}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('today')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-sm shadow-blue-500/20 transition-colors inline-flex items-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b0e17]"
              >
                <span>{t('navigation:landingNav.accessApp')}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Hamburger Menu Button (< 1280px: Mobile & Tablet) */}
            <button
              ref={hamburgerBtnRef}
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex xl:hidden items-center justify-center w-11 h-11 rounded-xl border border-slate-200 dark:border-[#262c3e] bg-white dark:bg-[#141824] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1b2030] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="landing-mobile-drawer"
              aria-label={
                isMobileMenuOpen
                  ? t('navigation:landingNav.closeMenuAria')
                  : t('navigation:landingNav.openMenuAria')
              }
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          PANNEAU DE NAVIGATION MOBILE & TABLETTE (< 1280px)
          Accessible au clavier, Escape, Trap Focus, Scroll Lock
          ========================================================================= */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t('navigation:landingNav.mobileMenuAria')}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => closeMobileMenu(true)}
            aria-hidden="true"
          />

          {/* Slide-over / Top Drawer Panel */}
          <div
            id="landing-mobile-drawer"
            ref={drawerRef}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-[#0e121c] border-l border-slate-200 dark:border-[#1e2436] shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            <div className="p-5 space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1c2130]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CertifAILogo iconOnly className="shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none font-headline">
                      Certif<span className="text-blue-600 dark:text-blue-400">IA</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {t('navigation:landingNav.subtitle')}
                    </span>
                  </div>
                </div>

                <button
                  ref={drawerCloseBtnRef}
                  type="button"
                  onClick={() => closeMobileMenu(true)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center border border-slate-200 dark:border-[#262c3e] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label={t('navigation:landingNav.closeMenuAria')}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* 4 Main Navigation Links with discrete icons & tactile >= 48px targets */}
              <nav aria-label={t('navigation:landingNav.navAria')} className="space-y-2">
                {primaryNavLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.id);
                      }}
                      className="min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-[#141824] hover:bg-blue-50 dark:hover:bg-[#1a2236] hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/70 dark:border-[#22283a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                        <span>{link.label}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    </a>
                  );
                })}
              </nav>

              {/* Language & Theme Preferences */}
              <div className="pt-4 border-t border-slate-200 dark:border-[#1c2130] space-y-4">
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('navigation:landingNav.preferences')}
                </div>

                <LanguageSelector variant="expanded" />

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-200 dark:border-[#262a35] bg-slate-50 dark:bg-[#141824] text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 flex items-center justify-between text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label={t('common:theme.toggle')}
                >
                  <span className="flex items-center gap-2.5">
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    ) : (
                      <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
                    )}
                    <span>{t('navigation:landingNav.themeLabel')}</span>
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {theme === 'dark' ? t('common:theme.dark') : t('common:theme.light')}
                  </span>
                </button>
              </div>
            </div>

            {/* Distinct Primary CTA inside Drawer */}
            <div className="p-5 border-t border-slate-200 dark:border-[#1c2130] bg-slate-50 dark:bg-[#0b0e17]">
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu(false);
                  onNavigate('today');
                }}
                className="w-full min-h-[48px] py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>{t('navigation:landingNav.accessApp')}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN CONTENT LANDMARK
          ========================================================================= */}
      <main>
        {/* =====================================================================
            SECTION 2 — HERO : PROPOSITION DE VALEUR
            ===================================================================== */}
        <section id="hero" className="relative pt-10 pb-16 sm:pt-16 sm:pb-24">
          {/* Contained ambient gradient preventing any horizontal document expansion */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="mx-auto max-w-6xl h-80 bg-gradient-to-b from-blue-500/8 via-indigo-500/4 to-transparent blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <p className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4">
                {currentLang === 'en'
                  ? 'Intelligent Certification Preparation · Cognitive Telemetry'
                  : 'Préparation certifiante intelligente · Télémétrie cognitive'}
              </p>

              <h1 className="text-[1.75rem] min-[390px]:text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance font-headline">
                {currentLang === 'en' ? (
                  <>
                    Prepare for Cloud & AI certifications,{' '}
                    <span className="text-blue-600 dark:text-blue-400">intelligently.</span>
                  </>
                ) : (
                  <>
                    Préparez vos certifications Cloud & IA{' '}
                    <span className="text-blue-600 dark:text-blue-400">intelligemment.</span>
                  </>
                )}
              </h1>

              <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {currentLang === 'en'
                  ? 'Learn, practice, and measure your progress with an intelligent platform that adapts your preparation to your goals.'
                  : 'Apprenez, entraînez-vous et mesurez votre progression avec une plateforme intelligente qui adapte votre préparation à vos objectifs.'}
              </p>

              {/* Spacious Hero CTAs */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onNavigate('today')}
                  className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-colors motion-reduce:transition-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span>{currentLang === 'en' ? 'Start Learning' : 'Commencer à apprendre'}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <a
                  href="#pourquoi"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('pourquoi');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-white dark:bg-[#141824] hover:bg-slate-100 dark:hover:bg-[#1c2233] border border-slate-200 dark:border-[#262c3e] text-slate-800 dark:text-slate-200 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors motion-reduce:transition-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span>{currentLang === 'en' ? 'Discover CertifIA' : 'Découvrir CertifIA'}</span>
                </a>
              </div>
            </div>

            {/* Real Application Cockpit Preview */}
            <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-[#222738] bg-white dark:bg-[#121622] shadow-xl">
                {/* Clean Window Chrome */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-[#1e2333] bg-slate-50 dark:bg-[#0e121c] flex items-center justify-between gap-3 text-xs min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 shrink-0" aria-hidden="true" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 shrink-0" aria-hidden="true" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 shrink-0" aria-hidden="true" />
                    <span className="ml-1.5 font-mono text-slate-500 dark:text-slate-400 text-[11px] truncate">
                      certifia.swinux.ch · {currentLang === 'en' ? 'Daily Cockpit' : 'Cockpit Quotidien'}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                    <span>AI-102 Azure AI Engineer</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {currentLang === 'en' ? '17 SRS due' : '17 fiches SRS'}
                    </span>
                  </div>
                </div>

                {/* Screenshot Frame */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <img
                    src="assets/screenshots/certifia-cockpit-today.png"
                    alt={
                      currentLang === 'en'
                        ? 'CertifIA Daily Cockpit Application Interface'
                        : 'Interface réelle du Cockpit Quotidien CertifIA'
                    }
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />

                  {/* Desktop/Tablet Overlay Callout (>= sm only so mobile image stays clean) */}
                  <div className="hidden sm:block sm:absolute sm:left-6 sm:bottom-6 p-4 rounded-xl bg-slate-900/92 backdrop-blur-md border border-slate-700/70 text-white max-w-sm shadow-xl">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-blue-400 mb-1">
                      <Target className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-hidden="true" />
                      <span>
                        {currentLang === 'en' ? 'RECOMMENDED DAILY SESSION' : 'SESSION QUOTIDIENNE RECOMMANDÉE'}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-white">
                      {currentLang === 'en'
                        ? '17 SRS Cards · 8 Weak Concepts · 12 MCQs'
                        : '17 Fiches SRS · 8 Notions Fragiles · 12 QCM'}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {currentLang === 'en'
                        ? 'Spaced intervals computed at the critical forgetting threshold.'
                        : 'Rappels calculés au seuil critique d’oubli pour une mémorisation durable.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate('today')}
                      className="mt-3 w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>{currentLang === 'en' ? 'Open Today Session' : 'Ouvrir la session du jour'}</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Mobile Callout Strip (< sm only, cleanly stacked below image) */}
                <div className="sm:hidden p-4 bg-slate-900 text-white border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-blue-400">
                    <Target className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      {currentLang === 'en' ? 'DAILY SESSION' : 'SESSION DU JOUR'}
                    </span>
                  </div>
                  <div className="text-sm font-bold">
                    {currentLang === 'en'
                      ? '17 SRS Cards · 8 Weak Concepts · 12 MCQs'
                      : '17 Fiches SRS · 8 Notions Fragiles · 12 QCM'}
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('today')}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center justify-center gap-1.5"
                  >
                    <span>{currentLang === 'en' ? 'Open Today Session' : 'Ouvrir la session du jour'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 3 — LES CHIFFRES CLÉS (Synchronisés avec le dépôt)
            ===================================================================== */}
        <section className="py-12 bg-white dark:bg-[#0e121c] border-y border-slate-200 dark:border-[#1a1f2e] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="min-w-0">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                  18
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {currentLang === 'en' ? 'Cloud & AI Certifications' : 'Certifications Cloud & IA'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Aligned with Azure, AWS, Google Cloud, IBM watsonx, and NVIDIA syllabi.'
                    : 'Alignées sur les syllabi officiels Azure, AWS, GCP, IBM et NVIDIA.'}
                </p>
              </div>

              <div className="min-w-0">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                  {currentLang === 'en' ? '2,800' : '2 800'}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {currentLang === 'en' ? 'SM-2 Flashcards' : 'Fiches Mémo SM-2'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Algorithmic spaced repetition scheduled right before memory decay.'
                    : 'Répétition espacée algorithmique calculée au seuil critique d’oubli.'}
                </p>
              </div>

              <div className="min-w-0">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  13
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {currentLang === 'en' ? 'Bilingual Namespaces' : 'Namespaces Bilingues'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Strict 1:1 FR / EN key parity for instantaneous switching.'
                    : 'Parité stricte 1:1 FR / EN pour une bascule instantanée sans texte résiduel.'}
                </p>
              </div>

              <div className="min-w-0">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                  5
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {currentLang === 'en' ? 'Learning Pillars' : 'Piliers d’Apprentissage'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Cockpit, Catalog, Practice MCQs, Flashcards, and Socratic AI Tutor.'
                    : 'Cockpit, Catalogue, QCM scénarisés, Flashcards SM-2 et Tuteur IA.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 4 — POURQUOI CERTIFIA ?
            ===================================================================== */}
        <section id="pourquoi" className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentLang === 'en' ? 'The Cognitive Challenge' : 'Pourquoi CertifIA ?'}
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en'
                  ? 'Why Passive Exam Cramming Breaks Down'
                  : 'Pourquoi le Bachotage Traditionnel Échoue'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentLang === 'en'
                  ? 'Passive video watching and memorizing static question banks create an illusion of readiness.'
                  : 'Lire passivement des documentations dispersées crée une illusion de maîtrise qui cède le jour de l’examen.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch mb-12">
              {/* 5 Obstacles */}
              <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm mb-5">
                    <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>
                      {currentLang === 'en'
                        ? 'Obstacles Faced by Candidates'
                        : 'Les 5 Obstacles Rencontrés par les Candidats'}
                    </span>
                  </div>

                  <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {[
                      {
                        tFr: 'Difficulté à organiser sa préparation :',
                        dFr: 'Absence de plan structuré, révisions irrégulières et découragement.',
                        tEn: 'Disorganized preparation:',
                        dEn: 'No structured schedule, erratic study sessions, and fatigue.',
                      },
                      {
                        tFr: 'Documentation technique dispersée :',
                        dFr: 'Des centaines de pages officielles sans hiérarchie claire des priorités.',
                        tEn: 'Scattered technical documentation:',
                        dEn: 'Hundreds of vendor documentation pages without clear study hierarchy.',
                      },
                      {
                        tFr: 'Mémorisation fragile des concepts complexes :',
                        dFr: 'Jusqu’à 85 % des notions lues passivement s’effacent en 7 jours.',
                        tEn: 'Fragile retention of complex concepts:',
                        dEn: 'Up to 85% of passively read material fades within 7 days.',
                      },
                      {
                        tFr: 'Manque d’entraînement en conditions réelles :',
                        dFr: 'Stress face au chronomètre et aux seuils éliminatoires de 700 points.',
                        tEn: 'Lack of realistic timed practice:',
                        dEn: 'Time pressure and strict 700-point cutoff thresholds on exam day.',
                      },
                      {
                        tFr: 'Difficulté à identifier ses lacunes :',
                        dFr: 'Répétition des sujets déjà acquis sans cibler les vrais angles morts.',
                        tEn: 'Hard to spot real blind spots:',
                        dEn: 'Reviewing already-known topics without isolating weak domains.',
                      },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <strong className="text-slate-900 dark:text-white font-semibold">
                            {currentLang === 'en' ? item.tEn : item.tFr}
                          </strong>{' '}
                          <span>{currentLang === 'en' ? item.dEn : item.dFr}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CertifIA Response */}
              <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#121622] border border-blue-200 dark:border-blue-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{currentLang === 'en' ? 'The CertifIA Answer' : 'La Réponse Apportée par CertifIA'}</span>
                  </div>

                  <blockquote className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug mb-5">
                    {currentLang === 'en'
                      ? '“A structured method to learn, memorize, practice, and progress.”'
                      : '« Une méthode structurée pour apprendre, mémoriser, s’entraîner et progresser. »'}
                  </blockquote>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {currentLang === 'en'
                      ? 'CertifIA replaces passive cramming with a calibrated cognitive routine: each session prioritizes the exact flashcards nearing decay and scenario MCQs targeting your weak domains.'
                      : 'CertifIA remplace le bachotage passif par une routine cognitive calibrée : chaque session priorise les fiches proches de l’oubli et les QCM d’architecture ciblant vos domaines fragiles.'}
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-200 dark:border-[#1e2436]">
                  <button
                    type="button"
                    onClick={() => onNavigate('today')}
                    className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>{currentLang === 'en' ? 'Try the Daily Cockpit' : 'Tester le cockpit quotidien'}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Core Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[
                {
                  icon: Compass,
                  color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
                  titleFr: 'Préparation personnalisée',
                  titleEn: 'Personalized preparation',
                  descFr: 'Parcours structuré en 4 niveaux selon votre métier, budget et rythme hebdomadaire.',
                  descEn: '4-level roadmap calibrated to your role, budget, and weekly availability.',
                },
                {
                  icon: Brain,
                  color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
                  titleFr: 'Mémorisation durable',
                  titleEn: 'Durable memorization',
                  descFr: 'Répétition espacée SM-2 pour ancrer durablement chaque notion complexe.',
                  descEn: 'SM-2 spaced repetition to anchor complex concepts in long-term memory.',
                },
                {
                  icon: Zap,
                  color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
                  titleFr: 'Entraînement intelligent',
                  titleEn: 'Intelligent practice',
                  descFr: 'QCM scénarisés avec analyse détaillée des distracteurs et pièges d’examen.',
                  descEn: 'Scenario-based MCQs with clear distractor analysis and exam trap breakdowns.',
                },
                {
                  icon: BarChart3,
                  color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10',
                  titleFr: 'Mesure de la progression',
                  titleEn: 'Progress measurement',
                  descFr: 'Indice de préparation globale et maîtrise par domaine officiel en temps réel.',
                  descEn: 'Overall readiness index and domain mastery telemetry in real time.',
                },
              ].map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738]"
                  >
                    <div className={`w-10 h-10 rounded-xl ${b.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {currentLang === 'en' ? b.titleEn : b.titleFr}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {currentLang === 'en' ? b.descEn : b.descFr}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 5 — LES CINQ PILIERS DE CERTIFIA
            ===================================================================== */}
        <section
          id="piliers"
          className="py-16 sm:py-20 bg-slate-100/70 dark:bg-[#0e121c] border-y border-slate-200 dark:border-[#1a1f2e] transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentLang === 'en' ? 'Core Features' : 'Les 5 Piliers de CertifIA'}
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en'
                  ? 'An Integrated Certification Ecosystem'
                  : 'Un Écosystème Complet de Préparation'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentLang === 'en'
                  ? 'Five complementary modules working together from diagnostic to exam readiness.'
                  : 'Cinq modules complémentaires travaillant en synergie, du diagnostic jusqu’au passage de l’examen.'}
              </p>
            </div>

            {/* Responsive wrapping tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {[
                { id: 0, titleFr: '1. Tableau de bord', titleEn: '1. Smart Dashboard', icon: Target },
                { id: 1, titleFr: '2. Catalogue', titleEn: '2. Catalog', icon: Database },
                { id: 2, titleFr: '3. QCM & Glossaire', titleEn: '3. MCQs & Glossary', icon: Zap },
                { id: 3, titleFr: '4. Flashcards SM-2', titleEn: '4. SM-2 Flashcards', icon: Layers },
                { id: 4, titleFr: '5. Assistant IA', titleEn: '5. AI Assistant', icon: Bot },
              ].map((p) => {
                const Icon = p.icon;
                const isActive = activePillar === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePillar(p.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-2 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-[#141824] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1a2030] border border-slate-200 dark:border-[#222838]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{currentLang === 'en' ? p.titleEn : p.titleFr}</span>
                  </button>
                );
              })}
            </div>

            {(() => {
              const pillarConfigs = [
                {
                  num: '01',
                  titleFr: 'Tableau de bord intelligent',
                  titleEn: 'Intelligent Readiness Dashboard',
                  subtitleFr: 'Cockpit quotidien, objectifs de préparation, révisions prioritaires et suivi d’activité.',
                  subtitleEn: 'Daily cockpit, target exam goals, priority reviews, and live activity tracking.',
                  featuresFr: [
                    'Cockpit quotidien composé automatiquement selon votre échéance d’examen',
                    'Révisions prioritaires SM-2 ciblant les notions proches du seuil d’oubli',
                    'Suivi de trajectoire en temps réel vers la note de passage (700 / 1 000 pts)',
                    'Historique des 24 dernières heures et accès rapide aux modules d’étude',
                  ],
                  featuresEn: [
                    'Daily cockpit tailored to your upcoming certification target date',
                    'Priority SM-2 reviews highlighting concepts nearing the decay point',
                    'Real-time score trajectory toward the official 700 / 1,000 passing mark',
                    '24-hour activity log and direct launchpad into practice modules',
                  ],
                  img: 'assets/screenshots/certifia-cockpit-today.png',
                  screen: 'today' as AppScreen,
                  ctaFr: 'Ouvrir le tableau de bord',
                  ctaEn: 'Open dashboard',
                },
                {
                  num: '02',
                  titleFr: 'Catalogue des certifications',
                  titleEn: 'Certifications Catalog',
                  subtitleFr: 'Microsoft Azure, AWS, Google Cloud, IBM watsonx et NVIDIA avec filtres et comparateur.',
                  subtitleEn: 'Microsoft Azure, AWS, Google Cloud, IBM watsonx, and NVIDIA with filters and comparator.',
                  featuresFr: [
                    '18 certifications Cloud & IA structurées par niveau et fournisseur',
                    'Blueprints détaillés avec pondérations officielles par domaine',
                    'Comparateur côte à côte : durée, prérequis, score minimal et modules',
                    'Filtres rapides par fournisseur, domaine technologique et difficulté',
                  ],
                  featuresEn: [
                    '18 Cloud & AI certifications organized by vendor and difficulty tier',
                    'Detailed blueprints detailing official skill domain weights',
                    'Side-by-side exam comparator for duration, passing score, and topics',
                    'Instant filtering by provider, specialization domain, and level',
                  ],
                  img: 'assets/screenshots/certifia-catalogue-view.svg',
                  screen: 'catalogue' as AppScreen,
                  ctaFr: 'Explorer le catalogue',
                  ctaEn: 'Explore catalog',
                },
                {
                  num: '03',
                  titleFr: 'Apprentissage et entraînement',
                  titleEn: 'Learning & Scenario Practice',
                  subtitleFr: 'QCM scénarisés, questions techniques, analyse des distracteurs et encyclopédie IA.',
                  subtitleEn: 'Scenario MCQs, technical questions, distractor breakdown, and AI glossary.',
                  featuresFr: [
                    'Mises en situation réalistes d’architecture Cloud et IA générative',
                    'Explications détaillées expliquant pourquoi chaque mauvaise option piège le candidat',
                    'Schémas de flux techniques et règles d’or à mémoriser',
                    'Glossaire et encyclopédie IA A-Z avec équivalences multi-cloud',
                  ],
                  featuresEn: [
                    'Realistic enterprise Cloud and Generative AI architecture scenarios',
                    'Detailed rationales dissecting why each wrong option is a distractor trap',
                    'Technical architecture pipelines and concise golden memory rules',
                    'Built-in A-Z AI glossary comparing cross-cloud service equivalents',
                  ],
                  img: 'assets/screenshots/certifia-quiz-engine.svg',
                  screen: 'quiz' as AppScreen,
                  ctaFr: 'Lancer un entraînement QCM',
                  ctaEn: 'Start MCQ practice',
                },
                {
                  num: '04',
                  titleFr: 'Flashcards et mémorisation SM-2',
                  titleEn: 'Flashcards & SM-2 Spaced Repetition',
                  subtitleFr: '2 800 cartes recto-verso, évaluation de rappel à 4 niveaux et planification adaptative.',
                  subtitleEn: '2,800 front/back cards, 4-level recall grading, and adaptive scheduling.',
                  featuresFr: [
                    '2 800 fiches mémo techniques classées par certification et domaine',
                    'Cartes recto-verso manipulables au clavier (Espace) ou au toucher',
                    'Évaluation cognitive à 4 niveaux : À revoir (1j), Difficile (3j), Bien (7j), Facile (14j)',
                    'Calcul adaptatif du facteur d’aisance et planification automatique',
                  ],
                  featuresEn: [
                    '2,800 technical flashcards organized by certification and skill domain',
                    'Interactive front/back cards operable via keyboard (Space) or touch',
                    '4-button cognitive rating: Again (1d), Hard (3d), Good (7d), Easy (14d)',
                    'Adaptive ease-factor recalculation and automated review scheduling',
                  ],
                  img: 'assets/screenshots/certifia-flashcards-srs.svg',
                  screen: 'flashcards' as AppScreen,
                  ctaFr: 'Réviser avec les flashcards',
                  ctaEn: 'Review flashcards',
                },
                {
                  num: '05',
                  titleFr: 'Assistant pédagogique IA',
                  titleEn: 'Pedagogical AI Assistant',
                  subtitleFr: 'Dialogue socratique contextualisé pour comprendre les architectures et compromis.',
                  subtitleEn: 'Contextual Socratic dialogue clarifying cloud architectures and trade-offs.',
                  featuresFr: [
                    'Approche socratique guidée : stimule le raisonnement avant la réponse',
                    'Analyse des arbitrages entre coût, latence, précision et sécurité',
                    'Accessible en vue dédiée ou en tiroir latéral directement depuis un QCM',
                    'Références pédagogiques alignées sur les documentations constructeurs',
                  ],
                  featuresEn: [
                    'Guided Socratic method that builds reasoning instead of spoiling answers',
                    'Clear analysis of cost, latency, accuracy, and security trade-offs',
                    'Available as a full workspace or slide-over drawer from any MCQ',
                    'Pedagogical guidance calibrated on official cloud documentation',
                  ],
                  img: 'assets/screenshots/certifia-ai-tutor.svg',
                  screen: 'assistant' as AppScreen,
                  ctaFr: 'Consulter le tuteur IA',
                  ctaEn: 'Open AI tutor',
                },
              ];

              const currentPillar = pillarConfigs[activePillar];

              return (
                <div className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] p-6 sm:p-10 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-6 space-y-4 min-w-0">
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {currentPillar.num} · {currentLang === 'en' ? 'Platform Pillar' : 'Pilier CertifIA'}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight font-headline">
                        {currentLang === 'en' ? currentPillar.titleEn : currentPillar.titleFr}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {currentLang === 'en' ? currentPillar.subtitleEn : currentPillar.subtitleFr}
                      </p>

                      <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        {(currentLang === 'en' ? currentPillar.featuresEn : currentPillar.featuresFr).map(
                          (feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                              <span>{feat}</span>
                            </li>
                          )
                        )}
                      </ul>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => onNavigate(currentPillar.screen)}
                          className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors"
                        >
                          <span>{currentLang === 'en' ? currentPillar.ctaEn : currentPillar.ctaFr}</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-6 min-w-0">
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#22283a] bg-slate-950 aspect-video flex items-center justify-center">
                        <img
                          src={currentPillar.img}
                          alt={currentLang === 'en' ? currentPillar.titleEn : currentPillar.titleFr}
                          className="w-full h-full object-contain object-top"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* =====================================================================
            DÉMONSTRATEUR INTERACTIF (Flashcard SM-2 + QCM Scénarisé)
            Non-régression complète
            ===================================================================== */}
        <section id="simulateur" className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentLang === 'en' ? 'Interactive Preview' : 'Démonstrateur Interactif'}
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en'
                  ? 'Try a Live Flashcard & Scenario MCQ'
                  : 'Testez une Flashcard SM-2 et un QCM Scénarisé'}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {currentLang === 'en'
                  ? 'Experiment with our active learning loop directly on this page.'
                  : 'Manipulez directement ci-dessous nos deux formats principaux d’entraînement actif.'}
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] overflow-hidden shadow-sm">
              {/* Simulator Top Bar */}
              <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-[#1c2130] bg-slate-50 dark:bg-[#0e121c] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoTab('flashcard')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-2 ${
                      demoTab === 'flashcard'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{currentLang === 'en' ? 'SM-2 Flashcard' : 'Flashcard SM-2'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoTab('quiz')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-2 ${
                      demoTab === 'quiz'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{currentLang === 'en' ? 'Scenario MCQ' : 'QCM Scénarisé'}</span>
                  </button>
                </div>

                <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                  AI-102 · Azure AI Engineer
                </span>
              </div>

              {/* Tab 1: SM-2 Flashcard */}
              {demoTab === 'flashcard' && (
                <div className="p-6 sm:p-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className={`w-full max-w-xl min-h-[210px] rounded-2xl p-6 text-left transition-colors border flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isCardFlipped
                        ? 'bg-blue-50/70 dark:bg-[#141b2e] border-blue-400/50'
                        : 'bg-slate-50 dark:bg-[#171c2b] border-slate-200 dark:border-[#262c3e] hover:border-blue-400/40'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono uppercase font-bold text-blue-600 dark:text-blue-400">
                        {isCardFlipped
                          ? currentLang === 'en'
                            ? 'Answer & Rationale'
                            : 'Réponse & Explication'
                          : currentLang === 'en'
                          ? 'Concept Question'
                          : 'Question / Concept'}
                      </span>
                      <span className="text-[11px] font-mono">
                        {currentLang === 'en' ? 'Click to flip' : 'Cliquer pour retourner'}
                      </span>
                    </div>

                    <div className="py-4">
                      {!isCardFlipped ? (
                        <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                          {currentLang === 'en'
                            ? 'What is the architectural difference between Semantic Ranker in Azure AI Search and traditional BM25 keyword search?'
                            : 'Quelle est la différence architecturale majeure entre le Semantic Ranker d’Azure AI Search et la recherche par mots-clés BM25 ?'}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm sm:text-base font-semibold text-blue-950 dark:text-blue-200 leading-relaxed">
                            {currentLang === 'en'
                              ? 'BM25 matches exact lexical terms (TF-IDF), whereas Semantic Ranker runs deep Transformer cross-encoders on the top-50 results to capture user intent and semantic meaning.'
                              : 'BM25 compare les termes lexicaux exacts (TF-IDF), tandis que le Semantic Ranker applique des cross-encoders Transformer sur les 50 meilleurs résultats pour comprendre l’intention sémantique.'}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono pt-2 border-t border-blue-200/50 dark:border-blue-500/20">
                            {currentLang === 'en'
                              ? 'Key takeaway: Semantic Ranker performs L2 reranking without retraining your index.'
                              : 'À retenir : le Semantic Ranker effectue un reclassement L2 sans ré-entraîner l’index.'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{currentLang === 'en' ? 'Domain: RAG & Search' : 'Domaine : RAG & Search'}</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {isCardFlipped
                          ? currentLang === 'en'
                            ? 'Rate recall below'
                            : 'Évaluez ci-dessous'
                          : currentLang === 'en'
                          ? 'Reveal answer →'
                          : 'Voir la réponse →'}
                      </span>
                    </div>
                  </button>

                  {/* 4-button rating scale */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 w-full max-w-xl">
                    {[
                      {
                        id: 'again',
                        fr: 'À revoir (1j)',
                        en: 'Again (1d)',
                        active: 'bg-rose-600 text-white border-rose-600',
                        idle: 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/40',
                      },
                      {
                        id: 'hard',
                        fr: 'Difficile (3j)',
                        en: 'Hard (3d)',
                        active: 'bg-amber-600 text-white border-amber-600',
                        idle: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/40',
                      },
                      {
                        id: 'good',
                        fr: 'Bien (7j)',
                        en: 'Good (7d)',
                        active: 'bg-emerald-600 text-white border-emerald-600',
                        idle: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40',
                      },
                      {
                        id: 'easy',
                        fr: 'Facile (14j)',
                        en: 'Easy (14d)',
                        active: 'bg-blue-600 text-white border-blue-600',
                        idle: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/40',
                      },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => {
                          setSelectedRating(btn.id);
                          setIsCardFlipped(true);
                        }}
                        className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl border text-xs font-semibold transition-colors ${
                          selectedRating === btn.id ? btn.active : btn.idle
                        }`}
                      >
                        {currentLang === 'en' ? btn.en : btn.fr}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={handleResetCard}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-[#262c3e] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title={currentLang === 'en' ? 'Reset card' : 'Réinitialiser la carte'}
                      aria-label={currentLang === 'en' ? 'Reset card' : 'Réinitialiser la carte'}
                    >
                      <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  {selectedRating && (
                    <p className="mt-4 text-xs font-mono text-emerald-600 dark:text-emerald-400 text-center">
                      {currentLang === 'en'
                        ? 'SM-2 interval updated: next review scheduled at optimal retention threshold.'
                        : 'Intervalle SM-2 mis à jour : prochaine révision planifiée au seuil d’oubli optimal.'}
                    </p>
                  )}
                </div>
              )}

              {/* Tab 2: Scenario MCQ */}
              {demoTab === 'quiz' && (
                <div className="p-6 sm:p-10 max-w-2xl mx-auto space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {currentLang === 'en' ? 'SCENARIO QUESTION' : 'QUESTION SCÉNARISÉE'}
                    </span>
                    <span>{currentLang === 'en' ? 'Passing threshold: 70%' : 'Seuil de validation : 70 %'}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {currentLang === 'en'
                      ? 'You are designing an enterprise RAG application on Azure. You need to prevent prompt injection and filter harmful content before responses reach users. Which service is recommended?'
                      : 'Vous concevez une application RAG d’entreprise sur Azure. Vous devez bloquer les injections de prompt et filtrer les contenus dangereux avant la réponse utilisateur. Quelle solution choisir ?'}
                  </h3>

                  <div className="space-y-2.5 pt-2" role="radiogroup" aria-label="Options QCM">
                    {[
                      {
                        id: 0,
                        text:
                          currentLang === 'en'
                            ? 'Configure Azure AI Content Safety with Prompt Shields enabled'
                            : 'Configurer Azure AI Content Safety avec Prompt Shields activé',
                        correct: true,
                      },
                      {
                        id: 1,
                        text:
                          currentLang === 'en'
                            ? 'Add instructions in the system prompt asking the model to ignore attacks'
                            : 'Ajouter dans le system prompt de ne jamais obéir aux attaques',
                        correct: false,
                      },
                      {
                        id: 2,
                        text:
                          currentLang === 'en'
                            ? 'Fine-tune GPT-4o on negative examples to eliminate harmful outputs'
                            : 'Fine-tuner GPT-4o sur des exemples négatifs pour bloquer les contenus',
                        correct: false,
                      },
                      {
                        id: 3,
                        text:
                          currentLang === 'en'
                            ? 'Filter requests with static regex rules in Azure API Management'
                            : 'Filtrer les requêtes via des expressions régulières dans API Management',
                        correct: false,
                      },
                    ].map((option) => {
                      const isSelected = selectedQuizOption === option.id;
                      let optionClasses =
                        'w-full p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-colors flex items-start gap-3 ';

                      if (!isQuizSubmitted) {
                        optionClasses += isSelected
                          ? 'bg-blue-500/10 border-blue-500 text-blue-900 dark:text-blue-200 font-medium'
                          : 'bg-slate-50 dark:bg-[#161b29] border-slate-200 dark:border-[#222738] hover:border-slate-300 dark:hover:border-[#30364d] text-slate-800 dark:text-slate-200';
                      } else if (option.correct) {
                        optionClasses +=
                          'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                      } else if (isSelected) {
                        optionClasses += 'bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-200';
                      } else {
                        optionClasses +=
                          'opacity-60 bg-slate-50 dark:bg-[#161b29] border-slate-200 dark:border-[#222738]';
                      }

                      return (
                        <button
                          key={option.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          disabled={isQuizSubmitted}
                          onClick={() => setSelectedQuizOption(option.id)}
                          className={optionClasses}
                        >
                          <span className="w-6 h-6 rounded-full flex items-center justify-center border border-current font-mono text-[11px] shrink-0 mt-0.5">
                            {String.fromCharCode(65 + option.id)}
                          </span>
                          <span className="flex-1">{option.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-3">
                    {!isQuizSubmitted ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedQuizOption !== null) setIsQuizSubmitted(true);
                        }}
                        disabled={selectedQuizOption === null}
                        className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition-colors"
                      >
                        {currentLang === 'en' ? 'Validate Answer' : 'Valider la réponse'}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                          <div className="font-bold mb-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                            <span>
                              {currentLang === 'en'
                                ? 'Official Architectural Rationale:'
                                : 'Explication Architecturale :'}
                            </span>
                          </div>
                          <p className="leading-relaxed">
                            {currentLang === 'en'
                              ? 'Azure AI Content Safety provides dedicated Prompt Shields against jailbreak attacks and multi-category severity filters on both inputs and outputs.'
                              : 'Azure AI Content Safety propose des détecteurs dédiés Prompt Shields contre les injections et un filtrage multi-catégories en entrée comme en sortie.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetQuiz}
                          className="py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1a2030] dark:hover:bg-[#232a3d] text-xs font-semibold text-slate-700 dark:text-slate-200"
                        >
                          {currentLang === 'en' ? 'Try Again' : 'Rejouer la question'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Bar */}
              <div className="px-4 sm:px-6 py-4 bg-slate-50 dark:bg-[#0c0f18] border-t border-slate-200 dark:border-[#1c2130] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {currentLang === 'en'
                    ? 'Ready to train across all 18 Cloud & AI certifications?'
                    : 'Prêt à vous entraîner sur les 18 certifications Cloud & IA ?'}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('today')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>{t('navigation:landingNav.accessApp')}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            GALERIE DES CAPTURES RÉELLES DE L'APPLICATION
            Non-régression complète
            ===================================================================== */}
        <section
          id="captures"
          className="py-16 sm:py-20 bg-slate-100/70 dark:bg-[#0e121c] border-y border-slate-200 dark:border-[#1a1f2e] transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentLang === 'en' ? 'Authentic Application Views' : 'Transparence Produit'}
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en'
                  ? 'Explore Real Screens from CertifIA'
                  : 'Captures Réelles de l’Application CertifIA'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                {currentLang === 'en'
                  ? 'Inspect every module directly before entering the workspace.'
                  : 'Parcourez chaque module réel avant d’ouvrir votre session d’entraînement.'}
              </p>
            </div>

            {/* Clean wrapping selector */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {screenshotsList.map((item) => {
                const isActive = activeScreenshotTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveScreenshotTab(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-[#141824] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1c2233] border border-slate-200 dark:border-[#222838]'
                    }`}
                  >
                    {item.badge}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-[#222738] bg-white dark:bg-[#121622] shadow-sm">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-[#1e2333] bg-slate-50 dark:bg-[#0e121c] flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px] truncate">
                  {currentLang === 'en' ? currentScreenshot.titleEn : currentScreenshot.titleFr}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate(currentScreenshot.screen)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <span>{currentLang === 'en' ? 'Open in App' : 'Ouvrir dans l’app'}</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src={currentScreenshot.src}
                  alt={currentLang === 'en' ? currentScreenshot.titleEn : currentScreenshot.titleFr}
                  className="w-full h-full object-contain object-top"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0f131d] border-t border-slate-200 dark:border-[#1e2333] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentLang === 'en' ? currentScreenshot.titleEn : currentScreenshot.titleFr}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                    {currentLang === 'en' ? currentScreenshot.descEn : currentScreenshot.descFr}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate(currentScreenshot.screen)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors self-start sm:self-auto"
                >
                  <span>{currentLang === 'en' ? 'Try This Module' : 'Tester ce module'}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 6 — MÉTHODE D'APPRENTISSAGE EN 8 ÉTAPES
            ===================================================================== */}
        <section id="methode" className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentLang === 'en' ? 'Methodology' : 'Méthode Cognitive'}
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en'
                  ? 'The 8-Step Preparation Cycle'
                  : 'Une Méthode Structurée en 8 Étapes'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentLang === 'en'
                  ? 'A clear progression from initial level assessment to spaced retention and exam validation.'
                  : 'Un parcours balisé de l’évaluation initiale jusqu’à la consolidation mémorielle et l’examen blanc.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
              {[
                {
                  step: 1,
                  titleFr: 'Évaluer son niveau',
                  titleEn: 'Assess your level',
                  descFr: 'Positionnement initial sur vos acquis Cloud et IA.',
                  descEn: 'Benchmark your existing Cloud and AI foundation.',
                },
                {
                  step: 2,
                  titleFr: 'Définir son objectif',
                  titleEn: 'Define your goal',
                  descFr: 'Choix de la certification cible et échéance visée.',
                  descEn: 'Choose target certification and exam target date.',
                },
                {
                  step: 3,
                  titleFr: 'Construire son parcours',
                  titleEn: 'Build your pathway',
                  descFr: 'Feuille de route personnalisée du Niveau 1 au Niveau 4.',
                  descEn: 'Custom roadmap tailored from Level 1 to Level 4.',
                },
                {
                  step: 4,
                  titleFr: 'Apprendre les notions',
                  titleEn: 'Learn core concepts',
                  descFr: 'Blueprints officiels et encyclopédie technique A-Z.',
                  descEn: 'Official exam blueprints and A-Z technical glossary.',
                },
                {
                  step: 5,
                  titleFr: 'Réviser avec les flashcards',
                  titleEn: 'Review flashcards',
                  descFr: 'Répétition espacée SM-2 au seuil critique d’oubli.',
                  descEn: 'SM-2 spaced repetition right before memory decay.',
                },
                {
                  step: 6,
                  titleFr: 'S’entraîner avec les QCM',
                  titleEn: 'Practice with MCQs',
                  descFr: 'Scénarios d’architecture et décryptage des pièges.',
                  descEn: 'Architecture scenarios and distractor pitfall analysis.',
                },
                {
                  step: 7,
                  titleFr: 'Simuler l’examen',
                  titleEn: 'Simulate the exam',
                  descFr: 'Épreuves chronométrées avec seuil de 700 / 1 000 pts.',
                  descEn: 'Timed practice tests scored at the 700 / 1,000 cutoff.',
                },
                {
                  step: 8,
                  titleFr: 'Analyser et progresser',
                  titleEn: 'Analyze & improve',
                  descFr: 'Télémétrie par domaine pour combler les derniers écarts.',
                  descEn: 'Domain telemetry to eliminate remaining blind spots.',
                },
              ].map((s) => {
                const isSelected = activeMethodStep === s.step - 1;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setActiveMethodStep(s.step - 1)}
                    className={`p-5 rounded-2xl border text-left transition-colors flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-[#141b2e] border-blue-500'
                        : 'bg-white dark:bg-[#121622] border-slate-200 dark:border-[#222738] hover:border-blue-400/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-[#1b2030] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {s.step}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">0{s.step}/08</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {currentLang === 'en' ? s.titleEn : s.titleFr}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {currentLang === 'en' ? s.descEn : s.descFr}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Orientation Banner */}
            <div className="rounded-2xl bg-slate-900 dark:bg-[#141a2b] border border-slate-800 dark:border-blue-900/40 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
              <div className="space-y-1.5 min-w-0">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                  {currentLang === 'en' ? 'Personalized Orientation Engine' : 'Moteur d’Orientation IA'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold">
                  {currentLang === 'en'
                    ? 'Build your personalized 4-level roadmap'
                    : 'Construisez votre feuille de route certifiante sur-mesure'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  {currentLang === 'en'
                    ? 'Set your job role, budget, and weekly study hours to prioritize the optimal certifications.'
                    : 'Renseignez votre métier, budget et temps disponible pour générer un plan d’action priorisé.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('recommendation')}
                className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shrink-0 inline-flex items-center justify-center gap-2 transition-colors self-start md:self-auto"
              >
                <Compass className="w-4 h-4" aria-hidden="true" />
                <span>{currentLang === 'en' ? 'Diagnose My Profile' : 'Diagnostiquer mon profil'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 7 — LES CERTIFICATIONS PRISES EN CHARGE
            ===================================================================== */}
        <section
          id="certifications"
          className="py-16 sm:py-20 bg-slate-100/70 dark:bg-[#0e121c] border-y border-slate-200 dark:border-[#1a1f2e] transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div className="min-w-0">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {currentLang === 'en' ? 'Supported Providers' : 'Catalogue Officiel'}
                </span>
                <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                  {currentLang === 'en'
                    ? 'Supported Cloud & AI Certifications'
                    : 'Les Certifications Prises en Charge'}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {currentLang === 'en'
                    ? 'Microsoft Azure, Amazon Web Services, Google Cloud, IBM watsonx, and NVIDIA.'
                    : 'Microsoft Azure, Amazon Web Services, Google Cloud, IBM watsonx et NVIDIA.'}
                </p>
              </div>

              {/* Clean wrapping provider filter */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] rounded-xl self-start lg:self-auto">
                {[
                  { id: 'all', label: currentLang === 'en' ? 'All (18)' : 'Toutes (18)' },
                  { id: 'azure', label: 'Azure' },
                  { id: 'aws', label: 'AWS' },
                  { id: 'gcp', label: 'Google Cloud' },
                  { id: 'ibm', label: 'IBM watsonx' },
                  { id: 'nvidia', label: 'NVIDIA' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={selectedProvider === p.id}
                    onClick={() => setSelectedProvider(p.id as typeof selectedProvider)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      selectedProvider === p.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simplified, readable certification cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredCerts.map((cert) => (
                <div
                  key={cert.code}
                  className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] p-6 flex flex-col justify-between hover:border-blue-500/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{cert.code}</span>
                      <span className="truncate">
                        {cert.providerName} · {cert.level}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{cert.title}</h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {currentLang === 'en' ? cert.descEn : cert.descFr}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1c2130] flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      {cert.duration} min · {cert.passScore} pts
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenBlueprint && ['ai102', 'ai900', 'aifc01', 'mlsc01', 'gcpmle', 'watsonx'].includes(cert.id)
                          ? onOpenBlueprint(cert.id)
                          : onNavigate('catalogue')
                      }
                      className="py-2 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors shrink-0"
                    >
                      <span>{currentLang === 'en' ? 'View Sheet' : 'Voir la fiche'}</span>
                      <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => onNavigate('catalogue')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] text-sm font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-colors"
              >
                <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>
                  {currentLang === 'en'
                    ? 'Open Full 18-Certification Catalog'
                    : 'Consulter le catalogue complet des 18 certifications'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 8 — LE TUTEUR PÉDAGOGIQUE IA
            ===================================================================== */}
        <section id="tuteur-ia" className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {currentLang === 'en' ? 'Socratic AI Tutor' : 'Tuteur Pédagogique IA'}
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en'
                  ? 'Don’t just memorize. Understand.'
                  : 'Ne vous contentez pas de mémoriser. Comprenez.'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentLang === 'en'
                  ? 'Guided Socratic reasoning on cloud architecture trade-offs: cost, latency, performance, and precision.'
                  : 'Dialogue socratique progressif pour maîtriser les arbitrages d’architecture entre coût, latence, performance et précision.'}
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] overflow-hidden shadow-sm">
              <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-[#1c2130] bg-slate-50 dark:bg-[#0e121c] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {currentLang === 'en'
                      ? 'Fictional Pedagogical Demonstration'
                      : 'Démonstration Pédagogique Fictive'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {currentLang === 'en' ? 'RAG & Azure AI Search' : 'RAG & Azure AI Search'}
                </span>
              </div>

              <div className="p-5 sm:p-8 space-y-4 max-w-3xl mx-auto">
                {socraticDialogue.slice(0, socraticStep + 2).map((item, idx) => {
                  const isTutor = item.speaker === 'tutor';
                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 ${isTutor ? 'items-start' : 'items-start flex-row-reverse'}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isTutor ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'
                        }`}
                      >
                        {isTutor ? <Bot className="w-4 h-4" aria-hidden="true" /> : 'C'}
                      </div>

                      <div
                        className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed ${
                          isTutor
                            ? 'bg-slate-50 dark:bg-[#161c2d] border border-slate-200 dark:border-[#232b40] text-slate-800 dark:text-slate-200'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <div
                          className={`text-[10px] font-mono font-bold uppercase mb-1 ${
                            isTutor ? 'text-indigo-600 dark:text-indigo-400' : 'text-blue-100'
                          }`}
                        >
                          {currentLang === 'en' ? item.labelEn : item.labelFr}
                        </div>
                        <p>{currentLang === 'en' ? item.textEn : item.textFr}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-4 sm:px-6 py-4 bg-slate-50 dark:bg-[#0c0f18] border-t border-slate-200 dark:border-[#1c2130] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  {currentLang === 'en'
                    ? 'Illustrative dialogue demonstrating Socratic guidance.'
                    : 'Illustration de démonstration du raisonnement socratique.'}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {socraticStep < 2 ? (
                    <button
                      type="button"
                      onClick={() => setSocraticStep((prev) => prev + 1)}
                      className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{currentLang === 'en' ? 'Next Step' : 'Poursuivre'}</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSocraticStep(0)}
                      className="py-2 px-3.5 rounded-xl bg-slate-200 dark:bg-[#1a2030] text-slate-700 dark:text-slate-200 font-semibold inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{currentLang === 'en' ? 'Replay' : 'Rejouer'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onOpenAIAssistant || (() => onNavigate('assistant'))}
                    className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{currentLang === 'en' ? 'Open AI Tutor' : 'Ouvrir le tuteur IA'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 9 — MESUREZ VOTRE PROGRESSION
            ===================================================================== */}
        <section
          id="progression"
          className="py-16 sm:py-20 bg-slate-100/70 dark:bg-[#0e121c] border-y border-slate-200 dark:border-[#1a1f2e] transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentLang === 'en' ? 'Progress Telemetry' : 'Suivi de Progression'}
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en'
                  ? 'Measure Every Step Toward Exam Readiness'
                  : 'Mesurez Votre Progression Vers la Certification'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                {currentLang === 'en'
                  ? 'Illustrative telemetry model comparing spaced repetition against passive cramming.'
                  : 'Graphique modélisé (données de démonstration) comparant la rétention espacée SM-2 à l’oubli passif.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] p-6 sm:p-8 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {currentLang === 'en'
                        ? 'Ebbinghaus Forgetting Curve vs SM-2 Retention'
                        : 'Courbe d’Oubli d’Ebbinghaus vs Rétention SM-2'}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {currentLang === 'en'
                        ? 'Demonstration curve (30-day illustrative model)'
                        : 'Données de démonstration sur 30 jours'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#181d2c] rounded-xl self-start sm:self-auto text-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => setRetentionMode('sm2')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                        retentionMode === 'sm2' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      SM-2 (+84 %)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRetentionMode('ebbinghaus')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                        retentionMode === 'ebbinghaus'
                          ? 'bg-rose-600 text-white'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {currentLang === 'en' ? 'Passive (15%)' : 'Passif (15 %)'}
                    </button>
                  </div>
                </div>

                <div className="h-56 w-full bg-slate-50 dark:bg-[#0c0f18] rounded-xl p-4 border border-slate-200 dark:border-[#1e2333] flex flex-col justify-between overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none" aria-hidden="true">
                    <line
                      x1="0"
                      y1="50"
                      x2="500"
                      y2="50"
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1="0"
                      y1="100"
                      x2="500"
                      y2="100"
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1="0"
                      y1="150"
                      x2="500"
                      y2="150"
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                      strokeDasharray="4 4"
                    />

                    <path
                      d="M 10 20 Q 80 140 250 170 T 490 185"
                      fill="none"
                      stroke="#e11d48"
                      strokeWidth={retentionMode === 'ebbinghaus' ? '4' : '2'}
                      strokeDasharray={retentionMode === 'ebbinghaus' ? 'none' : '4 4'}
                    />

                    <path
                      d="M 10 20 Q 50 60 80 80 L 80 30 Q 140 65 180 75 L 180 30 Q 280 60 340 65 L 340 30 Q 420 45 490 50"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth={retentionMode === 'sm2' ? '4' : '2'}
                    />
                  </svg>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-[#1c2130]">
                    <span>J+0</span>
                    <span>J+3</span>
                    <span>J+7</span>
                    <span>J+14</span>
                    <span>J+30</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Illustrative Telemetry Metrics */}
              <div className="lg:col-span-5 space-y-4 min-w-0">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {currentLang === 'en' ? 'DEMO READINESS INDEX' : 'INDICE DE PRÉPARATION (DÉMO)'}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">74 %</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#1e2436] overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 w-[74%]" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {currentLang === 'en' ? 'DEMO MOCK EXAM SCORE' : 'SCORE EXAMEN BLANC (DÉMO)'}
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                      765 / 1000
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#1e2436] overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600 w-[76.5%]" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">
                      {currentLang === 'en' ? 'MCQ ACCURACY' : 'PRÉCISION QCM'}
                    </span>
                    <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                      78.4 %
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">
                      {currentLang === 'en' ? 'CONSISTENCY' : 'RÉGULARITÉ'}
                    </span>
                    <span className="text-xl font-extrabold font-mono text-amber-500 tabular-nums">
                      {currentLang === 'en' ? '14 days' : '14 jours'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('analytics')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-[#1a2030] dark:hover:bg-[#232a3d] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-blue-400" aria-hidden="true" />
                  <span>
                    {currentLang === 'en'
                      ? 'Open Analytics Dashboard'
                      : 'Consulter le tableau de bord analytique'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 10 — UNE PLATEFORME BILINGUE
            ===================================================================== */}
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentLang === 'en' ? 'Bilingual Architecture' : 'Plateforme Bilingue'}
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en'
                  ? 'Learn in the language that suits you.'
                  : 'Apprenez dans la langue qui vous convient.'}
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentLang === 'en'
                  ? 'Switch between French and English seamlessly across all 13 namespaces without page reload.'
                  : 'Basculez instantanément entre le français et l’anglais sur l’ensemble des 13 namespaces sans rechargement.'}
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#1c2130]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                    <Globe className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {currentLang === 'en' ? 'Instant Language Switcher' : 'Bascule Linguistique Instantanée'}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      i18next · 13 namespaces · 1:1 FR/EN parity
                    </span>
                  </div>
                </div>

                <LanguageSelector variant="compact" className="self-start sm:self-auto" />
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {[
                  {
                    labelFr: 'Format Date',
                    labelEn: 'Date Format',
                    valFr: '15 mars 2026',
                    valEn: 'March 15, 2026',
                  },
                  {
                    labelFr: 'Nombres',
                    labelEn: 'Numbers',
                    valFr: '1 250 000',
                    valEn: '1,250,000',
                  },
                  {
                    labelFr: 'Pourcentage',
                    labelEn: 'Percent',
                    valFr: '85 %',
                    valEn: '85%',
                  },
                  {
                    labelFr: 'Devise',
                    labelEn: 'Currency',
                    valFr: '165,00 $US',
                    valEn: '$165.00',
                  },
                ].map((fmt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c0f18] border border-slate-200/70 dark:border-[#1e2333]"
                  >
                    <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-1">
                      {currentLang === 'en' ? fmt.labelEn : fmt.labelFr}
                    </span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white tabular-nums">
                      {currentLang === 'en' ? fmt.valEn : fmt.valFr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 11 — ACCESSIBLE PARTOUT (PWA & OFFLINE)
            ===================================================================== */}
        <section className="py-16 sm:py-20 bg-slate-100/70 dark:bg-[#0e121c] border-y border-slate-200 dark:border-[#1a1f2e] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4 min-w-0">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {currentLang === 'en' ? 'Cross-Platform PWA' : 'Accessible Partout'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                  {currentLang === 'en'
                    ? 'Desktop, Tablet & Mobile Ready'
                    : 'Une Expérience Adaptée à Tous Vos Écrans'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Install CertifIA as a Progressive Web App (PWA). Interface assets and flashcards cached by the Service Worker remain usable offline, while remote AI tutor calls require an active connection.'
                    : 'Installez CertifIA sur ordinateur ou mobile en tant que Progressive Web App (PWA). Les ressources mises en cache par le Service Worker restent disponibles hors ligne ; seul le tuteur IA dynamique requiert une connexion.'}
                </p>

                <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      {currentLang === 'en'
                        ? 'Installable standalone window via manifest.webmanifest'
                        : 'Installation autonome sur ordinateur et mobile via manifest.webmanifest'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      {currentLang === 'en'
                        ? 'Offline caching of static UI & SM-2 flashcards via Service Worker'
                        : 'Fonctionnement hors ligne des ressources mises en cache via Service Worker'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      {currentLang === 'en'
                        ? 'Responsive layout engineered cleanly from 320px to 1920px'
                        : 'Interface responsive testée de 320 px à 1920 px sans débordement'}
                    </span>
                  </li>
                </ul>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('today')}
                    className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors"
                  >
                    <Smartphone className="w-4 h-4" aria-hidden="true" />
                    <span>{currentLang === 'en' ? 'Open App Cockpit' : 'Ouvrir l’application'}</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 min-w-0">
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-[#22283a] bg-slate-950 aspect-video flex items-center justify-center">
                  <img
                    src="assets/screenshots/certifia-onboarding-tour.svg"
                    alt={
                      currentLang === 'en'
                        ? 'CertifIA Automated Guided Onboarding Tour'
                        : 'Visite guidée automatique de CertifIA'
                    }
                    className="w-full h-full object-contain object-top"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 12 — FAQ (12 Questions avec accordéons accessibles)
            ===================================================================== */}
        <section id="faq" className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                FAQ
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en' ? 'Frequently Asked Questions' : 'Questions Fréquentes'}
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {currentLang === 'en'
                  ? 'Clear answers regarding our pedagogical method, catalog, and project independence.'
                  : 'Réponses transparentes sur la méthode pédagogique, les certifications et notre indépendance.'}
              </p>
            </div>

            <div className="space-y-3">
              {faqData.map((item, idx) => {
                const isOpen = activeFaq === idx;
                const panelId = `faq-panel-${idx}`;
                const btnId = `faq-btn-${idx}`;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] overflow-hidden"
                  >
                    <button
                      id={btnId}
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="min-w-0">{currentLang === 'en' ? item.qEn : item.qFr}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 motion-reduce:transition-none shrink-0 ${
                          isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-100 dark:border-[#1c2130] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13 sm:pl-14"
                      >
                        {currentLang === 'en' ? item.aEn : item.aFr}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 13 — CALL TO ACTION FINAL
            ===================================================================== */}
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 text-white shadow-xl">
              <div className="max-w-2xl">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-200">
                  {currentLang === 'en' ? 'Start Your Preparation' : 'Accès Immédiat'}
                </span>

                <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-headline">
                  {currentLang === 'en'
                    ? 'Your next certification starts here.'
                    : 'Votre prochaine certification commence ici.'}
                </h2>

                <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Organize your learning, master essential concepts, and prepare with method.'
                    : 'Organisez votre apprentissage, maîtrisez les concepts essentiels et préparez-vous avec méthode.'}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('today')}
                    className="px-7 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <span>{currentLang === 'en' ? 'Discover CertifIA' : 'Découvrir CertifIA'}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <a
                    href="https://github.com/jeanpierrenouhailler-dot/CertifIA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    <span>{currentLang === 'en' ? 'Explore on GitHub' : 'Explorer le projet sur GitHub'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          SECTION 14 — FOOTER SIMPLIFIÉ & HIÉRARCHISÉ
          ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-[#1a1f2e] bg-white dark:bg-[#090c14] py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Brand + Language */}
            <div className="space-y-3 min-w-0">
              <div className="flex items-center gap-2.5">
                <CertifAILogo iconOnly className="shrink-0" />
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white font-headline">
                  Certif<span className="text-blue-600 dark:text-blue-400">IA</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                {currentLang === 'en'
                  ? 'Intelligent preparation platform for Cloud and Artificial Intelligence certifications.'
                  : 'Plateforme intelligente de préparation aux certifications Cloud et Intelligence Artificielle.'}
              </p>
              <div className="pt-1">
                <LanguageSelector variant="compact" />
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                {currentLang === 'en' ? 'Navigation' : 'Navigation'}
              </h3>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#piliers" onClick={(e) => { e.preventDefault(); scrollToSection('piliers'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {t('navigation:landingNav.features')}
                  </a>
                </li>
                <li>
                  <a href="#certifications" onClick={(e) => { e.preventDefault(); scrollToSection('certifications'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {t('navigation:landingNav.certifications')}
                  </a>
                </li>
                <li>
                  <a href="#methode" onClick={(e) => { e.preventDefault(); scrollToSection('methode'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {t('navigation:landingNav.method')}
                  </a>
                </li>
                <li>
                  <a href="#pourquoi" onClick={(e) => { e.preventDefault(); scrollToSection('pourquoi'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {currentLang === 'en' ? 'Why CertifIA' : 'Pourquoi CertifIA'}
                  </a>
                </li>
                <li>
                  <a href="#tuteur-ia" onClick={(e) => { e.preventDefault(); scrollToSection('tuteur-ia'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {currentLang === 'en' ? 'AI Tutor' : 'Tuteur IA'}
                  </a>
                </li>
                <li>
                  <a href="#progression" onClick={(e) => { e.preventDefault(); scrollToSection('progression'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {currentLang === 'en' ? 'Telemetry' : 'Progression'}
                  </a>
                </li>
                <li>
                  <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {t('navigation:landingNav.faq')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Application & GitHub */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                {currentLang === 'en' ? 'Application & Source' : 'Application & Code Source'}
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('today')}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>{t('navigation:landingNav.accessApp')}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </li>
                <li>
                  <a
                    href="https://certifia.swinux.ch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>https://certifia.swinux.ch</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/jeanpierrenouhailler-dot/CertifIA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>GitHub · jeanpierrenouhailler-dot/CertifIA</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-[#1a1f2e] text-center space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              {currentLang === 'en'
                ? 'CertifIA is an independent preparation project for Cloud and Artificial Intelligence certifications. It is not affiliated with any certification body.'
                : 'CertifIA est un projet indépendant de préparation aux certifications Cloud et Intelligence Artificielle. Il n’est affilié à aucun organisme certificateur.'}
            </p>
            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} CertifIA · {currentLang === 'en' ? 'All rights reserved' : 'Tous droits réservés'}
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg flex items-center justify-center transition-colors z-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title={currentLang === 'en' ? 'Back to top' : 'Retour en haut'}
          aria-label={currentLang === 'en' ? 'Back to top' : 'Retour en haut'}
        >
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
