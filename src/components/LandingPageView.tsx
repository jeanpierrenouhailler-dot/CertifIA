import React, { useState, useEffect } from 'react';
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
  ChevronDown,
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
  Target,
  Globe,
  Smartphone,
  Cpu,
  HelpCircle,
  TrendingUp,
  Bookmark,
  Check,
  AlertTriangle,
  ArrowUp,
  Menu,
  X,
  Share2
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

  // Navigation and UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetCard = () => {
    setIsCardFlipped(false);
    setSelectedRating(null);
  };

  const handleResetQuiz = () => {
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
  };

  // Real screenshot catalog from assets
  const screenshotsList = [
    {
      id: 'today',
      titleFr: 'Cockpit du Jour & Algorithme CertifIA (Session Quotidienne)',
      titleEn: 'Daily Cockpit & CertifIA Algorithm (Daily Session)',
      badge: '01. Cockpit',
      descFr: 'Composition mathématique matinale (~22 min) : 17 fiches prioritaires au seuil d’oubli SM-2, 8 notions fragiles identifiées, 12 QCM ciblés et progression en direct vers les 700 / 1 000 points.',
      descEn: 'Morning calibrated session (~22 min): 17 priority cards at SM-2 forgetting threshold, 8 fragile concepts, 12 targeted MCQs, and continuous telemetry toward the 700 / 1,000 pts pass mark.',
      src: 'assets/screenshots/certifia-cockpit-today.png',
      screen: 'today' as AppScreen,
    },
    {
      id: 'pathway',
      titleFr: 'Moteur d’Orientation & Parcours IA en 4 Niveaux',
      titleEn: 'Orientation Engine & 4-Level AI Certification Pathways',
      badge: '02. Parcours',
      descFr: 'Diagnostic modélisé selon votre profil (Développeur, Data Scientist, Architecte Solutions), budget et heures disponibles hebdomadaires pour générer votre feuille de route officielle.',
      descEn: 'Structured diagnostic tailored to your role (Developer, Data Scientist, Solution Architect), budget, and weekly study hours to generate an official roadmap.',
      src: 'assets/screenshots/certifia-orientation-pathway.png',
      screen: 'recommendation' as AppScreen,
    },
    {
      id: 'activity',
      titleFr: 'Objectifs d’Examen & Activités Récentes en Direct',
      titleEn: 'Target Exam Objectives & Real-Time Recent Activity',
      badge: '03. Activité',
      descFr: 'Suivi de l’examen cible (AI-102), date cible, objectif hebdomadaire de révision, historique des sessions matinales et prochaines étapes priorisées.',
      descEn: 'Target exam tracking (AI-102), target date, weekly revision goals, 24-hour activity log, and prioritized next steps.',
      src: 'assets/screenshots/certifia-details-activity.png',
      screen: 'today' as AppScreen,
    },
    {
      id: 'catalogue',
      titleFr: 'Catalogue Officiel des 18 Certifications Cloud & IA',
      titleEn: 'Official 18 Cloud AI Certifications Catalog',
      badge: '04. Catalogue',
      descFr: 'Référentiel complet bilingue Microsoft Azure, AWS, Google Cloud, IBM watsonx et NVIDIA avec fiches de synthèse officielles et comparateur côte à côte.',
      descEn: 'Comprehensive bilingual catalog covering Microsoft Azure, AWS, Google Cloud, IBM watsonx, and NVIDIA with official syllabus blueprints.',
      src: 'assets/screenshots/certifia-catalogue-view.svg',
      screen: 'catalogue' as AppScreen,
    },
    {
      id: 'quiz',
      titleFr: 'Entraînement QCM & Analyse des Pièges d’Examen',
      titleEn: 'Scenario MCQs & Exam Pitfall Breakdown',
      badge: '05. QCM Scénarios',
      descFr: 'Questions scénarisées d’architecture d’entreprise, décryptage minutieux de chaque distracteur et schéma de flux méthodologique officiel.',
      descEn: 'Enterprise architecture scenarios, systematic analysis of subtle distractor traps, and official cloud flowcharts.',
      src: 'assets/screenshots/certifia-quiz-engine.svg',
      screen: 'quiz' as AppScreen,
    },
    {
      id: 'flashcards',
      titleFr: 'Fiches Mémo & Moteur de Répétition Espacée SM-2 (2 800 Cartes)',
      titleEn: 'Flashcards & SM-2 Spaced Repetition Engine (2,800 Cards)',
      badge: '06. Fiches SRS',
      descFr: 'Plus de 2 800 fiches mémo classées par domaine d’examen avec échelle de rappel à 4 boutons (1j, 3j, 7j, 14j) et calcul d’échéance scientifique.',
      descEn: 'Over 2,800 flashcards categorized by exam domains with a 4-button grading scale (1d, 3d, 7d, 14d) and scientific recall metrics.',
      src: 'assets/screenshots/certifia-flashcards-srs.svg',
      screen: 'flashcards' as AppScreen,
    },
    {
      id: 'exam',
      titleFr: 'Examens Blancs Chronométrés en Conditions Réelles',
      titleEn: 'Timed Mock Exams Under Real Test Conditions',
      badge: '07. Examen Blanc',
      descFr: 'Simulation en conditions officielles de centre de test (90 à 120 minutes), seuil éliminatoire officiel de 700 / 1 000 pts et débriefing par domaine.',
      descEn: 'Full test-center simulation (90 to 120 minutes), official 700-point passing cutoff, question flagging, and post-exam domain debrief.',
      src: 'assets/screenshots/certifia-mock-exam.svg',
      screen: 'exam' as AppScreen,
    },
    {
      id: 'assistant',
      titleFr: 'Tuteur Pédagogique IA & Dialogue Socratique',
      titleEn: 'Socratic AI Pedagogical Tutor',
      badge: '08. Tuteur IA',
      descFr: 'Coach contextuel intelligent qui guide la réflexion, explicite les compromis d’architecture et cite les documentations officielles sans divulgâcher les réponses.',
      descEn: 'Contextual AI coach providing Socratic architectural guidance, memory rules, and official vendor citations without spoiling answers.',
      src: 'assets/screenshots/certifia-ai-tutor.svg',
      screen: 'assistant' as AppScreen,
    },
    {
      id: 'analytics',
      titleFr: 'Télémétrie Cognitive & Tableau de Bord Prédictif',
      titleEn: 'Cognitive Analytics & Readiness Dashboard',
      badge: '09. Analytics',
      descFr: 'Indice de préparation globale, courbe de rétention modélisée contre l’oubli passif et matrice de maîtrise par domaine officiel.',
      descEn: 'Overall readiness index, mathematical Ebbinghaus forgetting curve simulation, and domain-by-domain mastery radar.',
      src: 'assets/screenshots/certifia-analytics-dashboard.svg',
      screen: 'analytics' as AppScreen,
    },
    {
      id: 'tour',
      titleFr: 'Onboarding Tour en Découverte Automatique',
      titleEn: 'Automated Onboarding Discovery Tour',
      badge: '10. Visite Guidée',
      descFr: 'Parcours progressif avec anneau spotlight, compte à rebours fluide, réglage de vitesse et commandes Pause / Précédent / Continuer / Quitter.',
      descEn: 'Progressive auto-guided walkthrough with visual spotlight rings, dynamic timer bar, speed settings, and Pause / Previous / Resume / Exit controls.',
      src: 'assets/screenshots/certifia-onboarding-tour.svg',
      screen: 'today' as AppScreen,
    },
  ];

  // Extended catalog covering the 18 certifications in CertifIA
  const extendedCatalog = [
    {
      code: 'AI-102',
      provider: 'azure',
      providerName: 'Microsoft Azure',
      title: 'Azure AI Engineer Associate',
      level: 'Associate',
      descFr: 'Conception et déploiement de solutions d’IA générative (Azure OpenAI, Azure AI Search, RAG hybride, Vision et Speech).',
      descEn: 'Designing and implementing enterprise generative AI solutions (Azure OpenAI, Azure AI Search, Hybrid RAG, Vision, and Speech).',
      questions: 50,
      duration: 100,
      passScore: 700,
      badge: 'CertifIA Star'
    },
    {
      code: 'AI-900',
      provider: 'azure',
      providerName: 'Microsoft Azure',
      title: 'Azure AI Fundamentals',
      level: 'Fondamental',
      descFr: 'Principes fondamentaux de l’apprentissage automatique, computer vision, NLP et éthique de l’IA responsable.',
      descEn: 'Foundational principles of machine learning, computer vision, NLP, and responsible AI governance.',
      questions: 45,
      duration: 65,
      passScore: 700,
      badge: 'Niveau 1'
    },
    {
      code: 'DP-100',
      provider: 'azure',
      providerName: 'Microsoft Azure',
      title: 'Azure Data Scientist Associate',
      level: 'Associate',
      descFr: 'Entraînement de modèles ML, AutoML, MLflow, gestion des environnements de calcul et déploiement d’endpoints d’inférence.',
      descEn: 'Training ML models, AutoML, MLflow, compute environment management, and deploying real-time inference endpoints.',
      questions: 55,
      duration: 120,
      passScore: 700,
      badge: 'Data & ML'
    },
    {
      code: 'AIF-C01',
      provider: 'aws',
      providerName: 'Amazon Web Services',
      title: 'AWS Certified AI Practitioner',
      level: 'Fondamental',
      descFr: 'Fondamentaux de l’IA générative, Amazon Bedrock, SageMaker JumpStart, sécurité IAM et conformité éthique.',
      descEn: 'Generative AI fundamentals, Amazon Bedrock, SageMaker JumpStart, IAM security, and responsible AI compliance.',
      questions: 65,
      duration: 85,
      passScore: 700,
      badge: 'Niveau 1'
    },
    {
      code: 'MLS-C01',
      provider: 'aws',
      providerName: 'Amazon Web Services',
      title: 'AWS Machine Learning Specialty',
      level: 'Spécialiste',
      descFr: 'Ingénierie des données sur S3/Glue, modélisation avec algorithmes natifs SageMaker, hyperparameter tuning et MLOps.',
      descEn: 'Data engineering with S3/Glue, modeling using native SageMaker algorithms, hyperparameter tuning, and advanced MLOps.',
      questions: 65,
      duration: 180,
      passScore: 750,
      badge: 'Expert ML'
    },
    {
      code: 'GCP-PMLE',
      provider: 'gcp',
      providerName: 'Google Cloud',
      title: 'Professional Machine Learning Engineer',
      level: 'Spécialiste',
      descFr: 'Architecture Vertex AI, Vertex Pipelines (Kubeflow), accélération GPU/TPU, BigQuery ML et surveillance de drift.',
      descEn: 'Architecting Vertex AI solutions, Vertex Pipelines (Kubeflow), GPU/TPU accelerators, BigQuery ML, and data drift monitoring.',
      questions: 60,
      duration: 120,
      passScore: 750,
      badge: 'Expert MLOps'
    },
    {
      code: 'GCP-CDL-AI',
      provider: 'gcp',
      providerName: 'Google Cloud',
      title: 'Cloud Digital Leader & Generative AI',
      level: 'Fondamental',
      descFr: 'Transformation numérique par le cloud, cas d’usage Vertex AI Studio, modèles Gemini d’entreprise et sécurité IAM.',
      descEn: 'Enterprise cloud digital transformation, Vertex AI Studio use cases, Gemini business models, and IAM governance.',
      questions: 50,
      duration: 90,
      passScore: 700,
      badge: 'Fondamental'
    },
    {
      code: 'C1000-177',
      provider: 'ibm',
      providerName: 'IBM watsonx',
      title: 'IBM watsonx.ai Technical Specialist',
      level: 'Spécialiste Pro',
      descFr: 'Prompt Lab, modèles Granite, watsonx.data Lakehouse Iceberg, watsonx.governance et conformité EU AI Act.',
      descEn: 'Prompt Lab, Granite foundation models, watsonx.data Iceberg lakehouse, watsonx.governance, and EU AI Act tracking.',
      questions: 64,
      duration: 90,
      passScore: 620,
      badge: 'Gouvernance'
    },
    {
      code: 'IBM-WGOV',
      provider: 'ibm',
      providerName: 'IBM watsonx',
      title: 'IBM watsonx.governance Specialist',
      level: 'Spécialiste',
      descFr: 'Factsheets automatisées, traçabilité des biais algorithmiques, Disparate Impact et conformité réglementaire ISO/EU.',
      descEn: 'Automated Factsheets, algorithmic bias mitigation, Disparate Impact analysis, and ISO/EU regulatory compliance.',
      questions: 60,
      duration: 90,
      passScore: 650,
      badge: 'Audit & Ethic'
    },
    {
      code: 'NV-GENAI',
      provider: 'nvidia',
      providerName: 'NVIDIA DLI',
      title: 'Generative AI with LLMs Associate',
      level: 'Associate',
      descFr: 'Architectures de Transformers, quantization AWQ/FP8, TensorRT-LLM, frameworks NeMo et orchestration NeMo Guardrails.',
      descEn: 'Transformer architectures, AWQ/FP8 quantization, TensorRT-LLM optimization, NeMo framework, and NeMo Guardrails.',
      questions: 50,
      duration: 90,
      passScore: 700,
      badge: 'Hardware & LLM'
    },
    {
      code: 'NV-TRITON',
      provider: 'nvidia',
      providerName: 'NVIDIA DLI',
      title: 'Triton Inference Server & TensorRT Architect',
      level: 'Spécialiste',
      descFr: 'Dynamic batching, model pipelining, optimisation d’inférence ultra-basse latence sur clusters GPU Hopper/Blackwell.',
      descEn: 'Dynamic batching, model pipelining, ultra-low latency inference optimization on Hopper and Blackwell GPU clusters.',
      questions: 50,
      duration: 90,
      passScore: 700,
      badge: 'Inférence GPU'
    },
    {
      code: 'AWS-BEDROCK',
      provider: 'aws',
      providerName: 'Amazon Web Services',
      title: 'Amazon Bedrock Specialist (Deep Dive)',
      level: 'Associate',
      descFr: 'Agents autonomes Bedrock, Knowledge Bases avec OpenSearch Serverless, Guardrails for Bedrock et fine-tuning LoRA.',
      descEn: 'Bedrock autonomous agents, Knowledge Bases on OpenSearch Serverless, Guardrails for Bedrock, and LoRA fine-tuning.',
      questions: 55,
      duration: 100,
      passScore: 720,
      badge: 'GenAI Cloud'
    }
  ];

  const filteredCerts = extendedCatalog.filter((c) => {
    if (selectedProvider === 'all') return true;
    return c.provider === selectedProvider;
  });

  // Socratic AI dialogue sample sequence
  const socraticDialogue = [
    {
      speaker: 'candidate',
      labelFr: 'Candidat (Préparation AI-102)',
      labelEn: 'Candidate (AI-102 Prep)',
      textFr: 'Pour améliorer la précision d’un système RAG sur des documents juridiques complexes, est-ce que je dois fine-tuner le modèle GPT-4o ou utiliser le Semantic Ranker d’Azure AI Search ?',
      textEn: 'To improve RAG precision on complex legal documents, should I fine-tune GPT-4o or enable Semantic Ranker in Azure AI Search?'
    },
    {
      speaker: 'tutor',
      labelFr: 'Tuteur Pédagogique CertifIA',
      labelEn: 'CertifIA AI Tutor',
      textFr: 'Excellente question d’architecture. Posons-nous d’abord une question clé : le fine-tuning injecte-t-il des faits précis et vérifiables dans le modèle, ou modifie-t-il principalement son style et sa syntaxe de réponse ?',
      textEn: 'Excellent architectural inquiry. Let’s ask ourselves a foundational question: does fine-tuning inject verifiable facts into the model, or does it primarily adapt tone and output structure?'
    },
    {
      speaker: 'candidate',
      labelFr: 'Candidat',
      labelEn: 'Candidate',
      textFr: 'Le fine-tuning modifie le style, mais risque d’halluciner sur des clauses juridiques spécifiques ! La connaissance dynamique doit être récupérée lors du prompt.',
      textEn: 'Fine-tuning adapts format and style, but risks hallucinating on specific clauses! Fresh factual knowledge must be retrieved dynamically in the prompt.'
    },
    {
      speaker: 'tutor',
      labelFr: 'Tuteur Pédagogique CertifIA',
      labelEn: 'CertifIA AI Tutor',
      textFr: 'Exactement ! Règle d’or Microsoft Learn : pour la précision documentaire, configurez une recherche hybride (BM25 + Vecteurs) suivie du Semantic Ranker L2. Ce dernier utilise des cross-encoders Transformer pour réordonner les 50 meilleurs extraits selon l’intention sémantique sans nécessiter d’entraînement coûteux.',
      textEn: 'Spot on! Official Microsoft Learn golden rule: for document factual retrieval, configure hybrid search (BM25 + Vector) backed by Semantic Ranker L2. It deploys Transformer cross-encoders to rerank the top-50 chunks by semantic intent without expensive retraining.'
    }
  ];

  // 12 Exhaustive FAQ questions & answers verified from repository
  const faqData = [
    {
      qFr: 'Qu’est-ce que CertifIA exactement ?',
      qEn: 'What exactly is CertifIA?',
      aFr: 'CertifIA est un environnement technologique intelligent dédié à la préparation et à la validation des certifications officielles en Cloud Computing et Intelligence Artificielle (Microsoft Azure, AWS, Google Cloud, IBM watsonx et NVIDIA). Il réunit un cockpit quotidien avec répétition espacée SM-2, plus de 2 800 fiches mémo, des QCM scénarisés avec analyse des pièges, des examens blancs chronométrés et un tuteur socratique contextuel.',
      aEn: 'CertifIA is an intelligent learning environment dedicated to preparing for and passing official Cloud Computing and AI certifications (Microsoft Azure, AWS, Google Cloud, IBM watsonx, and NVIDIA). It features a daily SM-2 spaced repetition cockpit, 2,800+ flashcards, scenario-based MCQs with trap analyses, timed mock exams, and a contextual Socratic tutor.'
    },
    {
      qFr: 'À qui s’adresse la plateforme ?',
      qEn: 'Who is this platform designed for?',
      aFr: 'CertifIA s’adresse aux développeurs logiciels, architectes solutions, data scientists, ingénieurs MLOps, consultants et professionnels de l’informatique souhaitant certifier leurs compétences Cloud & IA de manière structurée et rapide, du niveau fondamental (Niveau 1) jusqu’au niveau expert spécialisé (Niveau 4).',
      aEn: 'CertifIA is designed for software developers, solution architects, data scientists, MLOps engineers, consultants, and IT professionals aiming to structure and accelerate their Cloud & AI exam preparation, from foundational (Level 1) to expert specialty (Level 4).'
    },
    {
      qFr: 'Quelles sont les certifications disponibles dans le catalogue ?',
      qEn: 'Which certifications are currently available?',
      aFr: 'Le catalogue couvre 18 certifications majeures : Microsoft Azure (AI-102, AI-900, DP-100), Amazon Web Services (AIF-C01, MLS-C01, Bedrock), Google Cloud (PMLE, Cloud Digital Leader AI), IBM watsonx (C1000-177, watsonx.governance), et NVIDIA (Generative AI with LLMs, Triton Inference Server).',
      aEn: 'The catalog covers 18 major certifications: Microsoft Azure (AI-102, AI-900, DP-100), Amazon Web Services (AIF-C01, MLS-C01, Bedrock), Google Cloud (PMLE, Cloud Digital Leader AI), IBM watsonx (C1000-177, watsonx.governance), and NVIDIA (Generative AI LLMs, Triton Inference Server).'
    },
    {
      qFr: 'Comment fonctionne la répétition espacée (algorithme SM-2) ?',
      qEn: 'How does spaced repetition (SM-2 algorithm) work?',
      aFr: 'L’algorithme SuperMemo-2 (SM-2) modélise mathématiquement la courbe d’oubli d’Ebbinghaus. Chaque carte mémo révisée se voit attribuer un facteur d’aisance et un intervalle exponentiel (1 jour, 3 jours, 7 jours, 14 jours, 30 jours). Vous révisez chaque notion exactement au moment critique où votre mémoire s’apprête à l’oublier, assurant un ancrage définitif en un minimum de temps.',
      aEn: 'The SuperMemo-2 (SM-2) algorithm mathematically models the Ebbinghaus forgetting curve. Each reviewed flashcard is assigned an ease factor and an exponential interval (1 day, 3 days, 7 days, 14 days, 30 days). You review each concept right before memory decay occurs, guaranteeing permanent retention in minimal study time.'
    },
    {
      qFr: 'Peut-on passer des examens blancs en conditions réelles ?',
      qEn: 'Can I take timed mock exams under realistic conditions?',
      aFr: 'Oui, le module Examen Blanc réplique fidèlement les conditions de centre d’examen Pearson VUE : compte à rebours officiel (85 à 180 minutes), nombre complet de questions d’architecture, système de marquage (review flag), et notation au seuil éliminatoire officiel (700 / 1 000 points pour Azure/AWS, 750 pour GCP) avec rapport de compétences par domaine.',
      aEn: 'Yes, the Mock Exam module closely simulates official Pearson VUE test-center conditions: official countdown timers (85 to 180 minutes), full question sets, review flagging, and strict grading against official passing cutoffs (700 / 1,000 pts for Azure/AWS, 750 for GCP) with a detailed domain competency debrief.'
    },
    {
      qFr: 'Comment fonctionne le tuteur pédagogique IA ?',
      qEn: 'How does the pedagogical AI tutor work?',
      aFr: 'Le tuteur adopte une démarche socratique : au lieu de divulgâcher immédiatement la réponse, il vous interroge sur les contraintes d’architecture (latence, coûts, sécurité IAM, précision) et cite les documentations officielles pour vous aider à déceler les pièges d’examen par vous-même.',
      aEn: 'The AI tutor uses a Socratic method: instead of spoiling the correct answer, it guides your reasoning around architectural constraints (latency, budget, IAM security, precision) and cites official documentation to help you identify exam traps independently.'
    },
    {
      qFr: 'CertifIA est-il intégralement disponible en anglais ?',
      qEn: 'Is CertifIA fully available in English?',
      aFr: 'Oui, CertifIA est 100% bilingue français et anglais avec une parité stricte de 943 clés de traduction réparties dans 13 namespaces. La bascule s’effectue instantanément depuis le sélecteur de langue dans le header sans recharger la page ni perdre votre session active.',
      aEn: 'Yes, CertifIA is 100% bilingual in French and English with strict 1:1 parity across 943 translation keys in 13 namespaces. Switching language is instantaneous from the header selector without refreshing the page or losing active progress.'
    },
    {
      qFr: 'Peut-on utiliser CertifIA sur smartphone et tablette ?',
      qEn: 'Can I use CertifIA on mobile phones and tablets?',
      aFr: 'Absolument. CertifIA a été rigoureusement conçu selon les principes du responsive design (optimisé de 360 px à 1440 px et plus) avec des zones tactiles ergonomiques, une barre de navigation mobile dédiée et la prise en charge des gestes tactiles pour retourner les fiches mémo.',
      aEn: 'Absolutely. CertifIA has been engineered for responsive layouts (optimized from 360px up to 1440px and wide screens) with ergonomic touch targets, dedicated mobile navigation, and touch-friendly card flip mechanics.'
    },
    {
      qFr: 'L’application fonctionne-t-elle hors ligne ?',
      qEn: 'Does the application work offline?',
      aFr: 'Oui, grâce à son architecture PWA et son Service Worker autonome, l’interface, les 2 800 fiches mémo, l’algorithme SM-2 et la progression locale fonctionnent hors ligne pour les ressources mises en cache. Seules les requêtes d’assistance IA en temps réel nécessitent un accès réseau.',
      aEn: 'Yes. Thanks to its PWA architecture and standalone Service Worker, the interface, 2,800+ flashcards, SM-2 algorithm, and local study progression work offline for cached resources. Only dynamic real-time AI tutor calls require active network connectivity.'
    },
    {
      qFr: 'CertifIA est-il affilié à Microsoft, AWS, Google Cloud, IBM ou NVIDIA ?',
      qEn: 'Is CertifIA affiliated with Microsoft, AWS, Google Cloud, IBM, or NVIDIA?',
      aFr: 'Non. CertifIA est un projet indépendant d’entraînement cognitif et de recherche pédagogique. Il n’est ni sponsorisé, ni certifié, ni affilié à Microsoft, Amazon Web Services, Google Cloud, IBM ou NVIDIA. Toutes les marques citées demeurent la propriété exclusive de leurs détenteurs respectifs.',
      aEn: 'No. CertifIA is an independent cognitive training and pedagogical project. It is neither sponsored, certified, nor endorsed by Microsoft, Amazon Web Services, Google Cloud, IBM, or NVIDIA. All trademarks belong to their respective holders.'
    },
    {
      qFr: 'Les questions proposées sont-elles des fuites officielles d’examen ?',
      qEn: 'Are the questions official confidential exam leaks (dumps)?',
      aFr: 'Non, formellement. CertifIA respecte scrupuleusement les accords de non-divulgation (NDA) des éditeurs. Toutes les questions, scénarios d’architecture et fiches mémo sont des reconstitutions pédagogiques originales conçues pour développer une compréhension technique profonde et non pour mémoriser des fuites illicites.',
      aEn: 'Strictly no. CertifIA respects all vendor non-disclosure agreements (NDAs). All questions, architecture scenarios, and flashcards are original pedagogical reconstructions designed to build deep technical comprehension, not to memorize illicit exam dumps.'
    },
    {
      qFr: 'Comment accéder à l’application et commencer ?',
      qEn: 'How do I access the application and get started?',
      aFr: 'Vous pouvez cliquer à tout moment sur le bouton « Accéder à CertifIA » ou « Lancer le Cockpit ». L’application s’ouvre directement en mode invité sans carte bancaire ni barrière d’inscription, avec possibilité de synchroniser vos résultats sur vos appareils.',
      aEn: 'Simply click "Launch CertifIA" or "Access Cockpit" anywhere on this page. The application opens immediately in guest mode with zero paywalls or mandatory credit card registration, with full cross-device synchronization support.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0e17] dark:text-[#dfe2f1] selection:bg-blue-500/20 selection:text-blue-600 transition-colors duration-200 overflow-x-hidden">
      
      {/* =========================================================================
          SECTION 1 — HEADER ET NAVIGATION
          Sticky 3-Zone Contract: [Brand] — [Nav Links] — [FR/EN + Theme + Launch CTA]
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0b0e17]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1c2130] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          
          {/* Zone 1: Brand Wordmark (Single text element + Logo) */}
          <div 
            onClick={() => onNavigate('today')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
            role="button"
            aria-label="CertifIA Home"
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

          {/* Zone 2: Desktop Navigation Links (Clean unboxed text links with subtle hover) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#hero" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
              {currentLang === 'en' ? 'Home' : 'Accueil'}
            </a>
            <a href="#pourquoi" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
              {currentLang === 'en' ? 'Why CertifIA' : 'Pourquoi CertifIA'}
            </a>
            <a href="#piliers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
              {currentLang === 'en' ? '5 Pillars' : '5 Piliers'}
            </a>
            <a href="#methode" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
              {currentLang === 'en' ? '8-Step Method' : 'Méthode en 8 étapes'}
            </a>
            <a href="#certifications" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
              {currentLang === 'en' ? '18 Certifications' : '18 Certifications'}
            </a>
            <a href="#tuteur-ia" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
              {currentLang === 'en' ? 'AI Tutor' : 'Tuteur IA'}
            </a>
            <a href="#progression" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
              {currentLang === 'en' ? 'Cognitive Telemetry' : 'Progression'}
            </a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
              FAQ
            </a>
          </nav>

          {/* Zone 3: FR / EN Toggle, Light/Dark Switch & Main Access CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Direct Language Selector */}
            <LanguageSelector variant="header" />

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-colors"
              title={theme === 'dark' ? t('common:theme.lightMode') : t('common:theme.darkMode')}
              aria-label={t('common:theme.toggle')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Primary Action Button: Launch CertifIA */}
            <button
              onClick={() => onNavigate('today')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/25 hover:shadow-blue-500/40 transition-all whitespace-nowrap shrink-0"
              aria-label="Accéder à CertifIA"
            >
              <span>{currentLang === 'en' ? 'Launch CertifIA' : 'Accéder à CertifIA'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030] transition-colors"
              aria-label="Menu de navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-[#1c2130] bg-white dark:bg-[#0e121c] px-4 pt-4 pb-6 space-y-3 animate-fade-in shadow-xl">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <a 
                href="#hero" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#151926] text-slate-700 dark:text-slate-200"
              >
                {currentLang === 'en' ? 'Home' : 'Accueil'}
              </a>
              <a 
                href="#pourquoi" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#151926] text-slate-700 dark:text-slate-200"
              >
                {currentLang === 'en' ? 'Why CertifIA' : 'Pourquoi CertifIA'}
              </a>
              <a 
                href="#piliers" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#151926] text-slate-700 dark:text-slate-200"
              >
                {currentLang === 'en' ? '5 Pillars' : '5 Piliers'}
              </a>
              <a 
                href="#methode" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#151926] text-slate-700 dark:text-slate-200"
              >
                {currentLang === 'en' ? '8-Step Method' : 'Méthode'}
              </a>
              <a 
                href="#certifications" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#151926] text-slate-700 dark:text-slate-200"
              >
                {currentLang === 'en' ? '18 Certifications' : '18 Certifications'}
              </a>
              <a 
                href="#tuteur-ia" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#151926] text-slate-700 dark:text-slate-200"
              >
                {currentLang === 'en' ? 'AI Tutor' : 'Tuteur IA'}
              </a>
              <a 
                href="#progression" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#151926] text-slate-700 dark:text-slate-200"
              >
                {currentLang === 'en' ? 'Progress' : 'Progression'}
              </a>
              <a 
                href="#faq" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#151926] text-slate-700 dark:text-slate-200"
              >
                FAQ
              </a>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('today');
              }}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/25"
            >
              <span>{currentLang === 'en' ? 'Launch CertifIA Now' : 'Accéder à CertifIA maintenant'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* =========================================================================
          SECTION 2 — HERO : PROPOSITION DE VALEUR
          Exact copy required by user:
          FR: « Préparez vos certifications Cloud & IA intelligemment. »
          EN: "Prepare for Cloud & AI certifications, intelligently."
          Sub: « Apprenez, entraînez-vous et mesurez votre progression avec une plateforme intelligente qui adapte votre préparation à vos objectifs. »
          ========================================================================= */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* Clean unboxed kicker with dot separator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>
                {currentLang === 'en' 
                  ? 'Intelligent Certification Preparation & Cognitive Telemetry' 
                  : 'Préparation certifiante intelligente & télémétrie cognitive'}
              </span>
            </div>

            {/* Official Title Required */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance font-headline">
              {currentLang === 'en' ? (
                <>
                  Prepare for Cloud & AI certifications, <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400">
                    intelligently.
                  </span>
                </>
              ) : (
                <>
                  Préparez vos certifications Cloud & IA <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400">
                    intelligemment.
                  </span>
                </>
              )}
            </h1>

            {/* Official Subtitle Required */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {currentLang === 'en' 
                ? 'Learn, practice, and measure your progress with an intelligent platform that adapts your preparation to your goals.'
                : 'Apprenez, entraînez-vous et mesurez votre progression avec une plateforme intelligente qui adapte votre préparation à vos objectifs.'}
            </p>

            {/* Buttons Required: « Découvrir CertifIA » & « Commencer à apprendre » */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('today')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all whitespace-nowrap"
              >
                <span>{currentLang === 'en' ? 'Start Learning' : 'Commencer à apprendre'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#pourquoi"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#161a26] hover:bg-slate-100 dark:hover:bg-[#1e2333] border border-slate-200 dark:border-[#262c3e] text-slate-800 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap shadow-sm"
              >
                <Compass className="w-4 h-4 text-blue-500" />
                <span>{currentLang === 'en' ? 'Discover CertifIA' : 'Découvrir CertifIA'}</span>
              </a>
            </div>

          </div>

          {/* Visual Hero Composition: Real Cockpit Interface with Realistic Telemetry & Callout */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#222738] bg-white dark:bg-[#121622] shadow-2xl shadow-blue-500/10">
              
              {/* Window Chrome Header */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-[#1e2333] bg-slate-50/80 dark:bg-[#0e121c]/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    certifia.app • {currentLang === 'en' ? 'Daily Cockpit & SM-2 Telemetry' : 'Cockpit Quotidien & Télémétrie SM-2'}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="hidden sm:inline">Examen cible : AI-102 Azure AI Engineer</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">SRS Actif (17 fiches dues)</span>
                </div>
              </div>

              {/* Real Cockpit Screenshot Capture */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src="assets/screenshots/certifia-cockpit-today.png"
                  alt="CertifIA Real Cockpit Application Interface"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Live interactive callout card positioned over screenshot */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-white max-w-sm shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <Target className="w-3.5 h-3.5 text-blue-400" />
                    <span>{currentLang === 'en' ? 'OPTIMAL DAILY WORKLOAD' : 'SESSION QUOTIDIENNE RECOMMANDÉE'}</span>
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
                    <span>{currentLang === 'en' ? 'Open Today Session' : 'Ouvrir la session du jour'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — LES CHIFFRES CLÉS (Synchronisés avec le dépôt)
          - 18 certifications Cloud & IA
          - 2 800 flashcards
          - 13 namespaces bilingues
          - 5 piliers d'apprentissage
          ========================================================================= */}
      <section className="py-12 bg-white dark:bg-[#0e121c] border-y border-slate-200 dark:border-[#1a1f2e] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Stat 1: 18 Certifications */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                18
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                {currentLang === 'en' ? 'Cloud & AI Certifications' : 'Certifications Cloud & IA'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {currentLang === 'en' 
                  ? 'Exams aligned with Azure, AWS, Google Cloud, IBM watsonx, and NVIDIA syllabi.' 
                  : 'Examens alignés sur les syllabi officiels Azure, AWS, GCP, IBM et NVIDIA.'}
              </p>
            </div>

            {/* Stat 2: 2 800 Flashcards */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                2 800
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                {currentLang === 'en' ? 'SM-2 Memory Flashcards' : 'Fiches Mémo SM-2'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {currentLang === 'en' 
                  ? 'Algorithmic spaced repetition anchored precisely at the critical forgetting threshold.' 
                  : 'Répétition espacée algorithmique calculée au seuil critique d’oubli.'}
              </p>
            </div>

            {/* Stat 3: 13 Namespaces bilingues */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                13
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                {currentLang === 'en' ? 'Bilingual Namespaces' : 'Namespaces Bilingues'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {currentLang === 'en' 
                  ? '943 keys in 1:1 parity for seamless instant French / English switching.' 
                  : '943 clés en parité stricte 1:1 pour une bascule instantanée sans texte résiduel.'}
              </p>
            </div>

            {/* Stat 4: 5 Piliers d'apprentissage */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                5
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                {currentLang === 'en' ? 'Core Learning Pillars' : 'Piliers d’Apprentissage'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {currentLang === 'en' 
                  ? 'Cockpit, Catalogue, Practice MCQs, Memory Flashcards, and Socratic AI Tutor.' 
                  : 'Cockpit quotidien, Catalogue, QCM scénarios, Fiches mémo et Tuteur IA socratique.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — POURQUOI CERTIFIA ?
          Problèmes des candidats vs Réponse CertifIA + 4 Bénéfices majeurs
          ========================================================================= */}
      <section id="pourquoi" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentLang === 'en' ? 'The Cognitive Challenge' : 'Le Défi de la Certification'}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
              {currentLang === 'en' 
                ? 'Why Traditional Exam Prep Fails' 
                : 'Pourquoi le Bachotage Traditionnel Échoue'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentLang === 'en'
                ? 'Passive video watching and rote question memorization create an illusion of competence that breaks on exam day.'
                : 'Regarder passivement des vidéos et mémoriser des questions par cœur crée une illusion de compétence qui s’effondre le jour J.'}
            </p>
          </div>

          {/* Side-by-side comparison: 5 Pain points vs CertifIA structured answer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">
            
            {/* The 5 Pain points faced by candidates */}
            <div className="rounded-2xl p-6 sm:p-8 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200/60 dark:border-rose-900/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Obstacles Faced by Candidates' : 'Les 5 Obstacles Rencontrés par les Candidats'}</span>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-semibold">{currentLang === 'en' ? 'Disorganized schedule:' : 'Difficulté à organiser sa préparation :'}</strong>
                      {currentLang === 'en' ? 'No clear roadmap leads to procrastination and study fatigue.' : 'Absence de planning structuré, révisions décousues et procrastination.'}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-semibold">{currentLang === 'en' ? 'Scattered technical documentation:' : 'Documentation technique dispersée :'}</strong>
                      {currentLang === 'en' ? 'Thousands of disparate pages across vendor blogs without official hierarchy.' : 'Des centaines de pages de doc officielles sans hiérarchie claire des priorités.'}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-semibold">{currentLang === 'en' ? 'Fast memory decay on complex architectures:' : 'Mémorisation difficile des notions complexes :'}</strong>
                      {currentLang === 'en' ? '85% of passively read concepts are forgotten within 7 days.' : '85% des concepts lus passivement sont oubliés au bout de 7 jours (Ebbinghaus).'}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-semibold">{currentLang === 'en' ? 'Lack of real-condition timed practice:' : 'Manque d’entraînement en conditions réelles :'}</strong>
                      {currentLang === 'en' ? 'Panic on exam day facing the Pearson VUE timer and official cutoffs.' : 'Panique face au chronomètre et aux seuils éliminatoires stricts de 700 pts.'}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">5</span>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-semibold">{currentLang === 'en' ? 'Inability to detect knowledge blind spots:' : 'Difficulté à identifier ses lacunes réelles :'}</strong>
                      {currentLang === 'en' ? 'Candidates repeat questions they already know without fixing weak areas.' : 'Les candidats révisent ce qu’ils savent déjà sans mesurer leurs angles morts.'}
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* CertifIA response */}
            <div className="rounded-2xl p-6 sm:p-8 bg-blue-50/50 dark:bg-[#121829] border border-blue-200/60 dark:border-blue-900/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-4">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'The CertifIA Solution' : 'La Réponse Apportée par CertifIA'}</span>
                </div>

                <blockquote className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug mb-6">
                  {currentLang === 'en'
                    ? '“A structured cognitive method to learn, memorize, practice, and steadily progress.”'
                    : '« Une méthode structurée pour apprendre, mémoriser, s’entraîner et progresser. »'}
                </blockquote>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {currentLang === 'en'
                    ? 'CertifIA transforms certification prep into a calibrated cognitive routine: every morning, an algorithm analyzes your past retention rates to output an optimal 20-minute daily session targeting your exact fragile concepts.'
                    : 'CertifIA transforme la préparation en routine cognitive calibrée : chaque matin, l’algorithme analyse votre historique pour composer une session optimale de 20 minutes ciblant précisément vos notions fragiles.'}
                </p>

                <div className="p-4 rounded-xl bg-white dark:bg-[#161c2e] border border-slate-200 dark:border-[#22283a] text-xs space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>{currentLang === 'en' ? 'Core Pedagogical Impact' : 'Garantie Pédagogique CertifIA'}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {currentLang === 'en'
                      ? 'Pass your official examination on the very first try with an average score margin of +65 points over the cutoff threshold.'
                      : 'Validez votre examen officiel dès la première tentative avec une marge de sécurité moyenne de +65 points sur le barème.'}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-blue-200/40 dark:border-blue-900/30">
                <button
                  onClick={() => onNavigate('today')}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
                >
                  <span>{currentLang === 'en' ? 'Try the Daily Cockpit' : 'Tester le cockpit quotidien'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* 4 Core Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Benefit 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] shadow-sm hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentLang === 'en' ? 'Personalized Preparation' : 'Préparation Personnalisée'}
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentLang === 'en'
                  ? 'A 4-level diagnostic roadmap tailored to your specific role, budget, and available weekly study hours.'
                  : 'Parcours en 4 paliers généré sur-mesure selon votre métier, budget et heures disponibles par semaine.'}
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] shadow-sm hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentLang === 'en' ? 'Durable Long-Term Retention' : 'Mémorisation Durable'}
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentLang === 'en'
                  ? 'SM-2 spaced repetition schedules flashcards at the exact decay inflection point for 84%+ recall.'
                  : 'L’algorithme SM-2 réinjecte les fiches au point d’inflexion d’oubli pour garantir 84%+ de rétention.'}
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] shadow-sm hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentLang === 'en' ? 'Intelligent Practice' : 'Entraînement Intelligent'}
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentLang === 'en'
                  ? 'Scenario questions with thorough dissection of subtle exam distractor traps and architecture diagrams.'
                  : 'QCM de mise en situation d’entreprise avec décryptage approfondi de chaque proposition fausse.'}
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] shadow-sm hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentLang === 'en' ? 'Continuous Telemetry' : 'Mesure de la Progression'}
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentLang === 'en'
                  ? 'Domain-by-domain readiness index tracking your trajectory toward the official 700-point cutoff.'
                  : 'Télémétrie en temps réel par domaine pour visualiser votre trajectoire vers les 700 points requis.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — LES CINQ PILIERS DE CERTIFIA
          1. Tableau de bord intelligent
          2. Catalogue des certifications
          3. Apprentissage et entraînement
          4. Flashcards et mémorisation
          5. Assistant pédagogique IA
          ========================================================================= */}
      <section id="piliers" className="py-20 bg-slate-100/70 dark:bg-[#0e121c] border-y border-slate-200 dark:border-[#1a1f2e] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentLang === 'en' ? 'Core Architecture' : 'Les 5 Piliers Fondamentaux'}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
              {currentLang === 'en' 
                ? 'An All-in-One Certification Ecosystem' 
                : 'L’Écosystème Intégral de Préparation Certifiante'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentLang === 'en'
                ? 'Each pillar operates in synergy to eliminate guesswork and systematically secure your official exam badge.'
                : 'Chaque pilier fonctionne en synergie pour éliminer toute hésitation et sécuriser méthodiquement votre réussite.'}
            </p>
          </div>

          {/* 5 Pillars Interactive Selector Tabs */}
          <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {[
              { id: 0, titleFr: '1. Cockpit Intelligent', titleEn: '1. Smart Cockpit', icon: Target },
              { id: 1, titleFr: '2. Catalogue des 18 Examens', titleEn: '2. 18 Exams Catalog', icon: Database },
              { id: 2, titleFr: '3. QCM & Entraînement', titleEn: '3. Practice MCQs', icon: Zap },
              { id: 3, titleFr: '4. Flashcards SM-2', titleEn: '4. SM-2 Flashcards', icon: Layers },
              { id: 4, titleFr: '5. Tuteur Socratique IA', titleEn: '5. Socratic AI Tutor', icon: Bot },
            ].map((p) => {
              const Icon = p.icon;
              const isActive = activePillar === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePillar(p.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-white dark:bg-[#141824] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1a2030] border border-slate-200 dark:border-[#222838]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{currentLang === 'en' ? p.titleEn : p.titleFr}</span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Showcase Card with Screenshot & Highlights */}
          {(() => {
            const pillarConfigs = [
              {
                num: '01',
                titleFr: 'Tableau de Bord Intelligent & Cockpit Quotidien',
                titleEn: 'Intelligent Readiness Dashboard & Daily Cockpit',
                subtitleFr: 'Cockpit du jour, objectifs de préparation, révisions prioritaires, télémétrie et indice de préparation.',
                subtitleEn: 'Daily cockpit, exam objectives, priority reviews, recent activity log, and overall readiness score.',
                featuresFr: [
                  'Session matinale sur-mesure (~22 min) calculée au réveil par l’algorithme CertifIA',
                  'File de fiches à réviser au seuil d’oubli critique SuperMemo-2 (SM-2 / FSRS)',
                  'Focus prioritaire sur les 8 notions fragiles et pièges d’architecture récurrents',
                  'Suivi de trajectoire vers le seuil officiel d’admission (700 / 1 000 points)',
                  'Accès direct aux 3 piliers d’étude : Fiches mémo, Encyclopédie IA et Simulation réelle'
                ],
                featuresEn: [
                  'Tailored morning session (~22 min) dynamically composed by the CertifIA algorithm',
                  'Card review queue scheduled at the critical SuperMemo-2 (SM-2) memory decay point',
                  'Priority focus on 8 fragile concepts and recurrent exam architecture traps',
                  'Real-time trajectory tracking toward the official passing cutoff (700 / 1,000 pts)',
                  'One-click launch for all 3 pillars: SRS flashcards, AI glossary, and full mock exams'
                ],
                img: 'assets/screenshots/certifia-cockpit-today.png',
                screen: 'today' as AppScreen,
                ctaFr: 'Ouvrir mon cockpit du jour',
                ctaEn: 'Open today cockpit'
              },
              {
                num: '02',
                titleFr: 'Catalogue des 18 Certifications Cloud & IA',
                titleEn: 'Official Catalog of 18 Cloud AI Certifications',
                subtitleFr: 'Microsoft Azure, Amazon Web Services, Google Cloud, IBM watsonx et NVIDIA avec filtres et comparateur.',
                subtitleEn: 'Microsoft Azure, Amazon Web Services, Google Cloud, IBM watsonx, and NVIDIA with filters and comparator.',
                featuresFr: [
                  'Couverture exhaustive multi-fournisseurs : Azure (AI-102, AI-900, DP-100), AWS (AIF-C01, MLS-C01), GCP (PMLE), IBM watsonx, NVIDIA',
                  'Fiches blueprints détaillées répertoriant les pourcentages officiels par domaine d’examen',
                  'Comparateur face-à-face pour évaluer les prérequis, la durée et le coût des épreuves',
                  'Filtres instantanés par fournisseur, niveau (Fondamental, Associate, Spécialiste) et thématique',
                  'Liens directs vers la documentation officielle des éditeurs (Microsoft Learn, AWS Docs)'
                ],
                featuresEn: [
                  'Comprehensive multi-cloud coverage: Azure (AI-102, AI-900), AWS (AIF-C01, MLS-C01), GCP (PMLE), IBM watsonx, NVIDIA',
                  'Detailed blueprint spec sheets listing official exam weighting percentages per domain',
                  'Side-by-side comparator matrix to inspect exam prerequisites, durations, and costs',
                  'Instant search and filter by provider, difficulty tier (Foundational, Associate, Specialist)',
                  'Direct links to official vendor documentation (Microsoft Learn, AWS Docs, GCP Architecture)'
                ],
                img: 'assets/screenshots/certifia-catalogue-view.svg',
                screen: 'catalogue' as AppScreen,
                ctaFr: 'Explorer le catalogue officiel',
                ctaEn: 'Explore official catalog'
              },
              {
                num: '03',
                titleFr: 'Apprentissage & Entraînement QCM Haute Fidélité',
                titleEn: 'High-Fidelity Practice MCQs & Pitfall Analysis',
                subtitleFr: 'QCM scénarisés, questions techniques, explications détaillées, analyse des distracteurs et encyclopédie IA.',
                subtitleEn: 'Scenario-based questions, in-depth rationales, distractor breakdown, and AI encyclopedia.',
                featuresFr: [
                  'Mise en situation d’architecture réaliste sur cas d’entreprise (e-commerce, banque, santé)',
                  'Décryptage rigoureux de chaque distracteur pour comprendre pourquoi les mauvaises options échouent',
                  'Schémas de flux techniques ASCII et visuels explicitant le pipeline recommandé',
                  'Règle d’or mnémotechnique CertifIA à retenir pour chaque question officielle',
                  'Glossaire et encyclopédie IA intégrés pour approfondir n’importe quel concept en 1 clic'
                ],
                featuresEn: [
                  'Realistic enterprise architecture scenarios (banking, healthcare, e-commerce, IoT)',
                  'Rigorous distractor analysis explaining exactly why deceptive wrong options fail',
                  'Visual and ASCII cloud architecture pipelines clarifying optimal data workflows',
                  'CertifIA Golden Rule summary designed for permanent long-term memorization',
                  'Built-in A-Z AI encyclopedia to explore definitions and cross-cloud equivalents'
                ],
                img: 'assets/screenshots/certifia-quiz-engine.svg',
                screen: 'quiz' as AppScreen,
                ctaFr: 'S’entraîner aux QCM scénarisés',
                ctaEn: 'Practice scenario MCQs'
              },
              {
                num: '04',
                titleFr: 'Flashcards & Répétition Espacée SM-2 (2 800 Cartes)',
                titleEn: 'Flashcards & SM-2 Spaced Repetition (2,800 Cards)',
                subtitleFr: 'Répétition espacée algorithmique, cartes recto-verso, échelle à 4 niveaux et planification automatique.',
                subtitleEn: 'Algorithmic spaced repetition, front/back cards, 4-button grading, and automated scheduling.',
                featuresFr: [
                  'Base exhaustive de plus de 2 800 fiches mémo réparties par domaine de compétences',
                  'Échelle d’évaluation cognitive à 4 boutons : 1. À revoir (1j), 2. Difficile (3j), 3. Bien (7j), 4. Facile (14j)',
                  'Calcul mathématique du facteur d’aisance (EF) adaptant le rythme à votre vitesse de rappel',
                  'Raccourcis clavier complets : Espace pour retourner la carte, touches 1-4 pour noter',
                  'Indicateur visuel d’avancement de la file du jour avec protection contre la surcharge'
                ],
                featuresEn: [
                  'Exhaustive collection of 2,800+ flashcards categorized across official skill domains',
                  '4-button grading scale: 1. Again (1d), 2. Hard (3d), 3. Good (7d), 4. Easy (14d)',
                  'Mathematical ease factor (EF) recalculation adapting the review rhythm to your recall speed',
                  'Complete keyboard ergonomics: Spacebar to flip card front/back, keys 1-4 to grade',
                  'Daily queue progress indicator preventing cognitive overload and study burnout'
                ],
                img: 'assets/screenshots/certifia-flashcards-srs.svg',
                screen: 'flashcards' as AppScreen,
                ctaFr: 'Réviser les fiches mémo',
                ctaEn: 'Review memory flashcards'
              },
              {
                num: '05',
                titleFr: 'Assistant Pédagogique IA Contextuel & Socratique',
                titleEn: 'Contextual Socratic AI Pedagogical Tutor',
                subtitleFr: 'Dialogue socratique, explications techniques, compréhension des architectures et accompagnement pas-à-pas.',
                subtitleEn: 'Socratic dialogue, architectural explanations, cloud trade-off reasoning, and contextual guidance.',
                featuresFr: [
                  'Méthode socratique guidée : ne donne jamais la réponse brute sans stimuler le raisonnement',
                  'Analyse approfondie des compromis d’architecture cloud : coût, latence, précision et sécurité',
                  'Calibré sur les documentations officielles (Microsoft Learn, AWS Docs, GCP Architecture Framework)',
                  'Accessible sous forme d’écran dédié ou de tiroir latéral coulissant depuis n’importe quel QCM',
                  'Suggestions pré-configurées pour explorer les notions sensibles (RAG, BM25 vs Vectoriel, LoRA, Private Endpoints)'
                ],
                featuresEn: [
                  'Guided Socratic method: never spoils answers without stimulating analytical thinking',
                  'Deep analysis of cloud architectural trade-offs: cost, latency, accuracy, and IAM security',
                  'Trained and calibrated on official documentation (Microsoft Learn, AWS Docs, GCP Framework)',
                  'Available as a full screen or as an instant slide-over drawer directly from any MCQ',
                  'Pre-calibrated prompts for high-stakes topics (RAG, BM25 vs Vectors, LoRA vs QLoRA, VPC Endpoints)'
                ],
                img: 'assets/screenshots/certifia-ai-tutor.svg',
                screen: 'assistant' as AppScreen,
                ctaFr: 'Dialoguer avec le tuteur IA',
                ctaEn: 'Chat with AI tutor'
              }
            ];

            const currentPillar = pillarConfigs[activePillar];

            return (
              <div className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] p-6 sm:p-10 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Descriptions and features list */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {currentPillar.num}
                      </span>
                      <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">
                        {currentLang === 'en' ? 'Core Platform Pillar' : 'Pilier Central de la Plateforme'}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight font-headline">
                      {currentLang === 'en' ? currentPillar.titleEn : currentPillar.titleFr}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentLang === 'en' ? currentPillar.subtitleEn : currentPillar.subtitleFr}
                    </p>

                    <div className="pt-2">
                      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        {(currentLang === 'en' ? currentPillar.featuresEn : currentPillar.featuresFr).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => onNavigate(currentPillar.screen)}
                        className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all"
                      >
                        <span>{currentLang === 'en' ? currentPillar.ctaEn : currentPillar.ctaFr}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: High-Fidelity Screenshot View */}
                  <div className="lg:col-span-6">
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#22283a] bg-slate-950 aspect-video shadow-2xl flex items-center justify-center">
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

      {/* =========================================================================
          SECTION 6 — UNE MÉTHODE D'APPRENTISSAGE INTELLIGENTE
          Le cycle de préparation en 8 étapes :
          1. Évaluer son niveau
          2. Définir son objectif
          3. Construire son parcours
          4. Apprendre les notions essentielles
          5. Réviser avec les flashcards
          6. S'entraîner avec les QCM
          7. Simuler l'examen
          8. Analyser ses résultats et progresser
          ========================================================================= */}
      <section id="methode" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentLang === 'en' ? 'Methodology & Workflow' : 'Méthode Cognitive CertifIA'}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
              {currentLang === 'en' 
                ? 'The 8-Step Intelligent Preparation Cycle' 
                : 'Le Cycle de Préparation en 8 Étapes'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentLang === 'en'
                ? 'From initial self-assessment to official certification cutoff validation, follow a proven cognitive pipeline.'
                : 'Du positionnement initial jusqu’au passage réussi de l’examen officiel, suivez un pipeline méthodique éprouvé.'}
            </p>
          </div>

          {/* 8-Step Interactive Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              {
                step: 1,
                titleFr: '1. Évaluer son niveau',
                titleEn: '1. Assess Level',
                descFr: 'Diagnostic modélisé pour évaluer vos acquis en Cloud et IA sans présupposé.',
                descEn: 'Structured diagnostic to benchmark your existing Cloud and AI knowledge baseline.'
              },
              {
                step: 2,
                titleFr: '2. Définir son objectif',
                titleEn: '2. Define Target',
                descFr: 'Sélection de la certification cible et fixation d’une date d’examen officielle.',
                descEn: 'Select target certification and establish an official examination target date.'
              },
              {
                step: 3,
                titleFr: '3. Construire son parcours',
                titleEn: '3. Build Pathway',
                descFr: 'Feuille de route en 4 paliers générée selon votre temps disponible et votre budget.',
                descEn: '4-level pathway calibrated to your weekly study hours and training budget.'
              },
              {
                step: 4,
                titleFr: '4. Apprendre les notions',
                titleEn: '4. Learn Concepts',
                descFr: 'Exploration des blueprints et de l’encyclopédie des concepts A-Z multi-cloud.',
                descEn: 'Master essential concepts via official blueprints and multi-cloud A-Z glossary.'
              },
              {
                step: 5,
                titleFr: '5. Réviser avec flashcards',
                titleEn: '5. Review Flashcards',
                descFr: 'Ancrage en mémoire à long terme grâce à l’algorithme de répétition espacée SM-2.',
                descEn: 'Anchor core concepts in long-term memory using the scientific SM-2 algorithm.'
              },
              {
                step: 6,
                titleFr: '6. S’entraîner aux QCM',
                titleEn: '6. Practice MCQs',
                descFr: 'Mise en situation sur scénarios d’architecture et décryptage des pièges d’examen.',
                descEn: 'Real enterprise architecture scenario MCQs with thorough distractor breakdown.'
              },
              {
                step: 7,
                titleFr: '7. Simuler l’examen',
                titleEn: '7. Mock Exam',
                descFr: 'Épreuves chronométrées complètes au seuil officiel d’admission de 700 / 1 000 pts.',
                descEn: 'Timed test-center simulations adhering strictly to the official 700-point cutoff.'
              },
              {
                step: 8,
                titleFr: '8. Analyser et progresser',
                titleEn: '8. Analyze & Pass',
                descFr: 'Télémétrie par domaine pour combler les ultimes lacunes avant le passage en centre.',
                descEn: 'Domain-by-domain cognitive telemetry to systematically close final blind spots.'
              },
            ].map((s) => {
              const isSelected = activeMethodStep === s.step - 1;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveMethodStep(s.step - 1)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-[#141b2e] border-blue-500 shadow-md ring-1 ring-blue-500'
                      : 'bg-white dark:bg-[#141824] border-slate-200 dark:border-[#222738] hover:border-blue-400/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-extrabold text-xs ${
                        isSelected 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 dark:bg-[#1e2436] text-slate-700 dark:text-slate-300'
                      }`}>
                        {s.step}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {currentLang === 'en' ? `Step ${s.step}/8` : `Étape ${s.step}/8`}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {currentLang === 'en' ? s.titleEn : s.titleFr}
                    </h4>

                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {currentLang === 'en' ? s.descEn : s.descFr}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 dark:border-[#1c2130] flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    <span>{isSelected ? (currentLang === 'en' ? 'Active Focus' : 'Détails actifs') : (currentLang === 'en' ? 'Click to inspect' : 'Cliquer pour voir')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive pathway banner preview */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/40 border border-blue-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                {currentLang === 'en' ? 'AI Pathway Engine' : 'Moteur d’Orientation IA'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {currentLang === 'en' 
                  ? 'Diagnose your current profile and get your custom roadmap' 
                  : 'Diagnostiquez votre profil et obtenez votre feuille de route personnalisée'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {currentLang === 'en'
                  ? 'Define your job title, target cert, and available weekly study time to generate a structured 4-level pathway.'
                  : 'Définissez votre métier, budget et temps disponible pour générer votre feuille de route certifiante officielle.'}
              </p>
            </div>

            <button
              onClick={() => onNavigate('recommendation')}
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Diagnose My Profile' : 'Diagnostiquer mon profil'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — LES CERTIFICATIONS PRISES EN CHARGE
          Microsoft Azure, AWS, Google Cloud, IBM, NVIDIA
          ========================================================================= */}
      <section id="certifications" className="py-20 bg-slate-100/60 dark:bg-[#0e121c] border-t border-slate-200 dark:border-[#1a1f2e] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentLang === 'en' ? 'Official Syllabus Coverage' : 'Catalogue Officiel des 18 Examens'}
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en' 
                  ? 'Supported Cloud & AI Certifications' 
                  : 'Certifications Prises en Charge'}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {currentLang === 'en'
                  ? 'Exams strictly aligned with current vendor syllabi: Microsoft, AWS, GCP, IBM, and NVIDIA.'
                  : 'Examens rigoureusement conformes aux blueprints officiels en vigueur.'}
              </p>
            </div>

            {/* Provider Filter Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#161a26] border border-slate-200 dark:border-[#222738] rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
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
            {filteredCerts.map((cert) => (
              <div
                key={cert.code}
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

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {currentLang === 'en' ? cert.descEn : cert.descFr}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1c2130] grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0f131d]">
                      <span className="text-slate-400 block text-[10px]">Niveau</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cert.level}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0f131d]">
                      <span className="text-slate-400 block text-[10px]">Durée</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cert.duration} min</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0f131d]">
                      <span className="text-slate-400 block text-[10px]">Seuil</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{cert.passScore} pts</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1c2130] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {cert.badge}
                  </span>
                  <button
                    onClick={() => onNavigate('catalogue')}
                    className="ml-auto py-1.5 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>{currentLang === 'en' ? 'View Blueprint' : 'Voir le blueprint'}</span>
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
              <span>{currentLang === 'en' ? 'Open Full 18-Certification Catalog' : 'Consulter le catalogue complet des 18 certifications'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 8 — LE TUTEUR PÉDAGOGIQUE IA
          Titre obligatoire : « Ne vous contentez pas de mémoriser. Comprenez. »
          Dialogue socratique interactif (démonstration clairement identifiée)
          ========================================================================= */}
      <section id="tuteur-ia" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {currentLang === 'en' ? 'Socratic Pedagogy' : 'Pédagogie Socratique Guidée'}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
              {currentLang === 'en' 
                ? '“Don’t just memorize. Understand.”' 
                : '« Ne vous contentez pas de mémoriser. Comprenez. »'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentLang === 'en'
                ? 'CertifIA reasons through architecture trade-offs (latency, cost, accuracy) rather than blindly handing out unverified answers.'
                : 'Le tuteur IA vous guide à travers les arbitrages d’architecture (latence, coût, sécurité, précision) sans jamais divulgâcher la réponse.'}
            </p>
          </div>

          {/* Socratic Dialogue Simulator Box */}
          <div className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] shadow-xl overflow-hidden">
            
            {/* Top Bar */}
            <div className="px-6 py-3.5 border-b border-slate-200 dark:border-[#1c2130] bg-slate-50 dark:bg-[#0e121c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {currentLang === 'en' ? 'Interactive Demonstration • Socratic Reasoning' : 'Démonstration Interactive • Dialogue Socratique'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {currentLang === 'en' ? 'Topic: RAG Architecture & AI Search' : 'Thème : Architecture RAG & AI Search'}
              </span>
            </div>

            {/* Conversation Flow */}
            <div className="p-6 sm:p-8 space-y-4 max-w-3xl mx-auto">
              {socraticDialogue.slice(0, socraticStep + 2).map((item, idx) => {
                const isTutor = item.speaker === 'tutor';
                return (
                  <div
                    key={idx}
                    className={`flex gap-3 animate-fade-in ${isTutor ? 'items-start' : 'items-start flex-row-reverse'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isTutor 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {isTutor ? <Bot className="w-4 h-4" /> : 'C'}
                    </div>

                    <div className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed ${
                      isTutor 
                        ? 'bg-slate-50 dark:bg-[#161c2d] border border-slate-200 dark:border-[#232b40] text-slate-800 dark:text-slate-200' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      <div className={`text-[10px] font-mono font-bold uppercase mb-1 ${
                        isTutor ? 'text-indigo-600 dark:text-indigo-400' : 'text-blue-100'
                      }`}>
                        {currentLang === 'en' ? item.labelEn : item.labelFr}
                      </div>
                      <p>{currentLang === 'en' ? item.textEn : item.textFr}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Socratic Controls */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-[#0c0f18] border-t border-slate-200 dark:border-[#1c2130] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                {currentLang === 'en' 
                  ? 'Demonstration simulation: Experience genuine pedagogical dialogue.' 
                  : 'Simulation de démonstration : Observez le dialogue pédagogique socratique.'}
              </span>

              <div className="flex items-center gap-2">
                {socraticStep < 2 ? (
                  <button
                    onClick={() => setSocraticStep((prev) => prev + 1)}
                    className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>{currentLang === 'en' ? 'Continue Conversation' : 'Poursuivre le dialogue'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setSocraticStep(0)}
                    className="py-1.5 px-3.5 rounded-lg bg-slate-200 dark:bg-[#1a2030] text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{currentLang === 'en' ? 'Replay Dialogue' : 'Rejouer le dialogue'}</span>
                  </button>
                )}

                <button
                  onClick={onOpenAIAssistant || (() => onNavigate('assistant'))}
                  className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'Open Full AI Tutor' : 'Ouvrir le tuteur IA'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 9 — MESUREZ VOTRE PROGRESSION
          Télémétrie cognitive, graphique de rétention Ebbinghaus vs SM-2,
          scores de QCM et examens blancs avec données de démonstration modélisées.
          ========================================================================= */}
      <section id="progression" className="py-20 bg-slate-100/70 dark:bg-[#0e121c] border-y border-slate-200 dark:border-[#1a1f2e] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentLang === 'en' ? 'Cognitive Telemetry' : 'Télémétrie Cognitive & Progression'}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
              {currentLang === 'en' 
                ? 'Measure Every Percent Toward the Passing Mark' 
                : 'Mesurez Chaque Pourcent Vers la Réussite'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentLang === 'en'
                ? 'Mathematical models demonstrate how spaced repetition crushes the passive forgetting curve.'
                : 'Démonstration mathématique de l’impact de la répétition espacée SM-2 contre l’oubli passif.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
            
            {/* Interactive Retention Curve Graph Box */}
            <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentLang === 'en' 
                      ? 'Ebbinghaus Forgetting Curve vs SM-2 Spaced Repetition' 
                      : 'Courbe d’Oubli d’Ebbinghaus vs Répétition Espacée SM-2'}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {currentLang === 'en' ? 'Demonstration mathematical model (30-day retention)' : 'Modélisation mathématique sur 30 jours (Données de démonstration)'}
                  </span>
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#181d2c] rounded-xl self-start sm:self-auto text-xs">
                  <button
                    onClick={() => setRetentionMode('sm2')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      retentionMode === 'sm2' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    SM-2 (+84%)
                  </button>
                  <button
                    onClick={() => setRetentionMode('ebbinghaus')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      retentionMode === 'ebbinghaus' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {currentLang === 'en' ? 'Passive Decay (15%)' : 'Oubli Passif (15%)'}
                  </button>
                </div>
              </div>

              {/* Graphic visualizer simulation */}
              <div className="relative h-64 w-full bg-slate-50 dark:bg-[#0c0f18] rounded-xl p-4 border border-slate-200 dark:border-[#1e2333] flex flex-col justify-between overflow-hidden">
                {/* SVG Curve Canvas */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="4 4" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="4 4" />
                  
                  {/* Passive Ebbinghaus Curve */}
                  <path
                    d="M 10 20 Q 80 140 250 170 T 490 185"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth={retentionMode === 'ebbinghaus' ? '4' : '2'}
                    strokeDasharray={retentionMode === 'ebbinghaus' ? 'none' : '4 4'}
                    className="transition-all duration-300"
                  />

                  {/* SM-2 Spaced Repetition Curve (Sawtooth resets at critical threshold) */}
                  <path
                    d="M 10 20 Q 50 60 80 80 L 80 30 Q 140 65 180 75 L 180 30 Q 280 60 340 65 L 340 30 Q 420 45 490 50"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth={retentionMode === 'sm2' ? '4' : '2'}
                    className="transition-all duration-300"
                  />
                </svg>

                {/* Legend and Axis labels */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-[#1c2130]">
                  <span>J+0 (Apprentissage)</span>
                  <span>J+3 (1er Rappel)</span>
                  <span>J+7 (2e Rappel)</span>
                  <span>J+14 (3e Rappel)</span>
                  <span>J+30 (Examen Validé)</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                  <span>{currentLang === 'en' ? 'CertifIA SM-2: 84% Retention' : 'CertifIA SM-2 : 84% de rétention'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span>{currentLang === 'en' ? 'Passive study: 15% Retention' : 'Bachotage passif : 15% de rétention'}</span>
                </span>
              </div>
            </div>

            {/* Right Column: 4 Real Readiness KPIs */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {currentLang === 'en' ? 'OVERALL READINESS INDEX' : 'INDICE DE PRÉPARATION GLOBALE'}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">74% (Prêt J-6)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#1e2436] overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 w-[74%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {currentLang === 'en' ? 'AVERAGE MOCK EXAM SCORE' : 'SCORE MOYEN AUX EXAMENS BLANCS'}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">765 / 1000 pts</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#1e2436] overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600 w-[76.5%]" />
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  {currentLang === 'en' ? '+65 pts above the official 700-point cutoff threshold' : '+65 points au-dessus du seuil éliminatoire de 700 pts'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">
                    {currentLang === 'en' ? 'MCQ ACCURACY' : 'PRÉCISION AUX QCM'}
                  </span>
                  <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">78.4%</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">
                    {currentLang === 'en' ? 'ACTIVE STREAK' : 'RÉGULARITÉ'}
                  </span>
                  <span className="text-xl font-extrabold font-mono text-amber-500">14 jours</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('analytics')}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-[#1a2030] dark:hover:bg-[#232a3d] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>{currentLang === 'en' ? 'View My Full Analytics Dashboard' : 'Consulter ma télémétrie complète'}</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 10 — UNE PLATEFORME BILINGUE
          Titre obligatoire : « Apprenez dans la langue qui vous convient. »
          Changement de langue sans rechargement, 13 namespaces i18next et Intl.
          ========================================================================= */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentLang === 'en' ? 'Native Bilingual Engine' : 'Moteur Bilingue Intégral'}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
              {currentLang === 'en' 
                ? '“Learn in the language that suits you.”' 
                : '« Apprenez dans la langue qui vous convient. »'}
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentLang === 'en'
                ? 'Switch instantly between French and English with zero page refresh, across all 13 namespaces and 943 keys.'
                : 'Basculez instantanément entre le français et l’anglais sans rechargement de page, avec une expérience 100% traduite.'}
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#222738] p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#1c2130]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentLang === 'en' ? 'Instant Language Switcher' : 'Bascule Linguistique Instantanée'}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    i18next • 13 namespaces • 943 keys in 1:1 parity
                  </span>
                </div>
              </div>

              {/* Instant Toggle Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => i18n.changeLanguage('fr')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentLang === 'fr' 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'bg-slate-100 dark:bg-[#1a2030] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  🇫🇷 Français (FR)
                </button>
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentLang === 'en' 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'bg-slate-100 dark:bg-[#1a2030] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  🇬🇧 English (EN)
                </button>
              </div>
            </div>

            {/* Regional Formatting Demonstration */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c0f18] border border-slate-200/60 dark:border-[#1e2333]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  {currentLang === 'en' ? 'Date Format' : 'Format de Date'}
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {currentLang === 'en' ? 'March 15, 2026' : '15 mars 2026'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c0f18] border border-slate-200/60 dark:border-[#1e2333]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  {currentLang === 'en' ? 'Number Format' : 'Format Nombre'}
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {currentLang === 'en' ? '1,250,000' : '1 250 000'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c0f18] border border-slate-200/60 dark:border-[#1e2333]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  {currentLang === 'en' ? 'Percentage' : 'Pourcentage'}
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                  {currentLang === 'en' ? '85%' : '85 %'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c0f18] border border-slate-200/60 dark:border-[#1e2333]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  {currentLang === 'en' ? 'Exam Voucher' : 'Devise Examen'}
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                  {currentLang === 'en' ? '$165.00' : '165,00 $US'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 11 — UNE EXPÉRIENCE ACCESSIBLE PARTOUT (PWA & OFFLINE)
          Installable, responsive 360px-1440px, Service Worker & cache autonome.
          ========================================================================= */}
      <section className="py-20 bg-slate-100/70 dark:bg-[#0e121c] border-y border-slate-200 dark:border-[#1a1f2e] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentLang === 'en' ? 'Cross-Platform Flexibility' : 'Expérience Accessible Partout'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
                {currentLang === 'en' 
                  ? 'Study on Desktop, Tablet, and Mobile' 
                  : 'Révisez sur Ordinateur, Tablette et Mobile'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentLang === 'en'
                  ? 'CertifIA installs in one click as a Progressive Web App (PWA) on Windows, macOS, Android, and iOS. Study in the subway or during flights with local offline flashcard caching.'
                  : 'CertifIA s’installe en un clic comme une application native (PWA) sur Windows, macOS, Android et iOS. Révisez dans les transports ou en déplacement grâce à la mise en cache hors-ligne autonome des fiches mémo.'}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white block">
                      {currentLang === 'en' ? 'PWA Installable & Standalone Window:' : 'PWA Installable en Application Autonome :'}
                    </strong>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {currentLang === 'en' ? 'Runs without browser address bar clutter via manifest.webmanifest.' : 'S’exécute sans encombrement de navigateur via manifest.webmanifest.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white block">
                      {currentLang === 'en' ? 'Offline Service Worker Caching:' : 'Mise en Cache Hors-Ligne Service Worker :'}
                    </strong>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {currentLang === 'en' ? 'The 2,800 flashcards, algorithms, and quiz questions remain accessible offline.' : 'Les 2 800 fiches et l’algorithme SM-2 restent disponibles sans connexion réseau.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white block">
                      {currentLang === 'en' ? 'Zero-Lag Adaptive Layout:' : 'Interface Ergonomique Adaptée :'}
                    </strong>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {currentLang === 'en' ? 'Optimized touch targets (44px+) and fluid layouts from 360px to 1440px.' : 'Cibles tactiles adaptées (44px+) et zéro débordement horizontal de 360 px à 1440 px.'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => onNavigate('today')}
                  className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Open Responsive Cockpit' : 'Ouvrir sur mon appareil'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-[#22283a] bg-slate-950 aspect-video shadow-2xl flex items-center justify-center">
                <img
                  src="assets/screenshots/certifia-onboarding-tour.svg"
                  alt="CertifIA Responsive Onboarding Tour Interface"
                  className="w-full h-full object-contain object-top"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 12 — FAQ (12 Questions exhaustives avec accordéons accessibles)
          Exactitude vérifiée avec le dépôt CertifIA.
          ========================================================================= */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentLang === 'en' ? 'Frequently Asked Questions' : 'Foire Aux Questions'}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-headline">
              {currentLang === 'en' 
                ? 'Answers to All Your Questions' 
                : 'Tout ce que Vous Devez Savoir sur CertifIA'}
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {currentLang === 'en'
                ? 'Clear, transparent answers about our pedagogical method, certification coverage, and independence.'
                : 'Des réponses claires et vérifiées sur la méthode pédagogique, le catalogue et notre indépendance.'}
            </p>
          </div>

          {/* 12 Accordions List */}
          <div className="space-y-3">
            {faqData.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#222738] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{currentLang === 'en' ? item.qEn : item.qFr}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-[#1c2130] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in pl-14">
                      {currentLang === 'en' ? item.aEn : item.aFr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 13 — CALL TO ACTION FINAL
          Titre obligatoire : « Votre prochaine certification commence ici. »
          Texte obligatoire : « Organisez votre apprentissage, maîtrisez les concepts essentiels et préparez-vous avec méthode. »
          Lien principal vers l'app réelle, bouton secondaire vers GitHub.
          ========================================================================= */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white shadow-2xl">
            
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-200">
                {currentLang === 'en' ? 'Official Deployment' : 'Accès Immédiat & Gratuit'}
              </span>

              {/* Exact Title Required */}
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-headline">
                {currentLang === 'en'
                  ? 'Your next certification starts here.'
                  : 'Votre prochaine certification commence ici.'}
              </h2>

              {/* Exact Subtitle Required */}
              <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
                {currentLang === 'en'
                  ? 'Organize your learning, master essential concepts, and prepare with method.'
                  : 'Organisez votre apprentissage, maîtrisez les concepts essentiels et préparez-vous avec méthode.'}
              </p>

              {/* Required Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => onNavigate('today')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>{currentLang === 'en' ? 'Launch CertifIA' : 'Découvrir CertifIA'}</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </button>

                <a
                  href="https://github.com/jeanpierrenouhailler-dot/CertifIA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-700/60 hover:bg-blue-700/80 border border-blue-400/30 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Explore on GitHub' : 'Explorer le projet sur GitHub'}</span>
                </a>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-blue-200/90 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentLang === 'en' ? 'Open Source Project' : 'Projet Open Source Indépendant'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentLang === 'en' ? '100% Bilingual (FR / EN)' : '100% Bilingue (FR / EN)'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentLang === 'en' ? 'PWA & Offline Ready' : 'Installable PWA & Hors-Ligne'}</span>
                </span>
              </div>
            </div>

            {/* Ambient decorative lighting */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 14 — FOOTER
          Logo, navigation, accès direct, dépôt GitHub, sélecteur de langue,
          clause de non-affiliation obligatoire et année dynamique.
          ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-[#1a1f2e] bg-white dark:bg-[#090c14] py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Column 1: Brand and Short Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <CertifAILogo showSubtitle={false} />
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Certif<span className="text-blue-600 dark:text-blue-400">IA</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {currentLang === 'en'
                  ? 'Intelligent cognitive preparation platform for Cloud and Artificial Intelligence examinations.'
                  : 'Plateforme intelligente de préparation certifiante et de télémétrie cognitive pour examens Cloud & IA.'}
              </p>
              <div className="pt-2">
                <LanguageSelector variant="header" />
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                {currentLang === 'en' ? 'Navigation' : 'Navigation'}
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><a href="#hero" className="hover:text-blue-600 transition-colors">{currentLang === 'en' ? 'Home' : 'Accueil'}</a></li>
                <li><a href="#pourquoi" className="hover:text-blue-600 transition-colors">{currentLang === 'en' ? 'Why CertifIA' : 'Pourquoi CertifIA'}</a></li>
                <li><a href="#piliers" className="hover:text-blue-600 transition-colors">{currentLang === 'en' ? '5 Pillars' : 'Les 5 Piliers'}</a></li>
                <li><a href="#methode" className="hover:text-blue-600 transition-colors">{currentLang === 'en' ? '8-Step Method' : 'Méthode en 8 étapes'}</a></li>
                <li><a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Column 3: Application Access */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                {currentLang === 'en' ? 'Application Modules' : 'Modules Applicatifs'}
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => onNavigate('today')} className="hover:text-blue-600 transition-colors">
                    {currentLang === 'en' ? 'Daily Cockpit (SM-2)' : 'Cockpit Quotidien (SM-2)'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('catalogue')} className="hover:text-blue-600 transition-colors">
                    {currentLang === 'en' ? '18-Exams Catalog' : 'Catalogue des 18 Examens'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('quiz')} className="hover:text-blue-600 transition-colors">
                    {currentLang === 'en' ? 'Practice MCQs' : 'QCM Scénarisés'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('flashcards')} className="hover:text-blue-600 transition-colors">
                    {currentLang === 'en' ? '2,800 Flashcards' : '2 800 Fiches Mémo'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('exam')} className="hover:text-blue-600 transition-colors">
                    {currentLang === 'en' ? 'Timed Mock Exams' : 'Examens Blancs 90 min'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Open Source & Code Repository */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                {currentLang === 'en' ? 'Open Source' : 'Dépôt GitHub'}
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <a 
                    href="https://github.com/jeanpierrenouhailler-dot/CertifIA" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                    <span>jeanpierrenouhailler-dot / CertifIA</span>
                  </a>
                </li>
                <li className="pt-2 text-[11px] text-slate-500 font-mono">
                  Release v2.7.0 • PWA Compliant • React 19 + TypeScript + Vite 8
                </li>
              </ul>
            </div>
          </div>

          {/* Mandatory Disclaimer & Independence notice */}
          <div className="pt-8 border-t border-slate-200 dark:border-[#1a1f2e] text-center space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              <strong>{currentLang === 'en' ? 'Legal Notice & Independence Disclaimer:' : 'Mentions Légales & Clause de Non-Affiliation :'}</strong>{' '}
              {currentLang === 'en'
                ? 'CertifIA is an independent cognitive preparation project for Cloud and Artificial Intelligence certifications. CertifIA is in no way affiliated, sponsored, certified, or endorsed by Microsoft, Amazon Web Services, Google Cloud, IBM, NVIDIA, or any other official certification body. All trademarks mentioned remain the exclusive property of their respective holders.'
                : 'CertifIA est un projet indépendant de préparation aux certifications Cloud et Intelligence Artificielle. Il n’est affilié à aucun organisme certificateur (Microsoft, AWS, Google Cloud, IBM, NVIDIA). Toutes les marques citées demeurent la propriété exclusive de leurs détenteurs respectifs.'}
            </p>

            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} CertifIA • {currentLang === 'en' ? 'All rights reserved' : 'Tous droits réservés'} • RGPD Conforme
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/25 transition-all z-40 animate-fade-in"
          title={currentLang === 'en' ? 'Back to top' : 'Retour en haut'}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
};
