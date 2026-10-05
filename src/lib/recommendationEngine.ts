/**
 * Recommendation Engine for CertifAI
 * Analyzes user profile (level, role, goal, budget, time, language, career objective)
 * and builds tailored 4-level AI certification pathways:
 * 
 * Niveau 1 : AI Fundamentals
 *       ↓
 * Niveau 2 : Generative AI
 *       ↓
 * Niveau 3 : Cloud AI
 *       ↓
 * Niveau 4 : Machine Learning / MLOps
 */

import { 
  UserRecommendationProfile, 
  PathwayPlan, 
  PathwayLevel, 
  UserLevel, 
  UserRole, 
  UserPrimaryGoal, 
  UserBudget, 
  UserWeeklyTime, 
  UserLanguage, 
  UserCareerGoal 
} from '../types';

export const LEVEL_OPTIONS: { id: UserLevel; label: string; desc: string; icon: string }[] = [
  {
    id: 'debutant',
    label: 'Débutant',
    desc: "Découverte de l'IA, pas ou peu d'expérience préalable en code ou cloud",
    icon: '🌱',
  },
  {
    id: 'intermediaire',
    label: 'Intermédiaire',
    desc: "Bases en développement, manipulation d'APIs ou pratique cloud initiale",
    icon: '⚡',
  },
  {
    id: 'avance',
    label: 'Avancé',
    desc: "Expérience confirmée en code, data science ou architectures cloud en production",
    icon: '🚀',
  },
];

export const ROLE_OPTIONS: { id: UserRole; label: string; desc: string; icon: string }[] = [
  {
    id: 'developpeur',
    label: 'Développeur',
    desc: 'Intégration d’APIs d’IA, SDK Python/C#, applications web & RAG',
    icon: '💻',
  },
  {
    id: 'data_scientist',
    label: 'Data Scientist',
    desc: 'Modélisation statistique, fine-tuning, Python, PyTorch & scikit-learn',
    icon: '🔬',
  },
  {
    id: 'architecte',
    label: 'Architecte',
    desc: 'Solutions d’entreprise, dimensionnement cloud, sécurité & haute disponibilité',
    icon: '🏛️',
  },
  {
    id: 'chef_de_projet',
    label: 'Chef de projet',
    desc: 'Cadrage des cas d’usage, rentabilité ROI, coordination des équipes IA',
    icon: '📊',
  },
  {
    id: 'consultant',
    label: 'Consultant',
    desc: 'Conseil stratégique, accompagnement client, conformité AI Act & gouvernance',
    icon: '💼',
  },
  {
    id: 'autre',
    label: 'Autre métier',
    desc: 'DevOps, RSSI, Product Manager, étudiant ou profil en reconversion',
    icon: '🧭',
  },
];

export const PRIMARY_GOAL_OPTIONS: { id: UserPrimaryGoal; label: string; desc: string; icon: string }[] = [
  {
    id: 'comprendre_ia',
    label: "Comprendre l'IA",
    desc: 'Acquérir le socle conceptuel, les limites, les opportunités et la terminologie',
    icon: '💡',
  },
  {
    id: 'ia_generative',
    label: 'IA générative',
    desc: 'LLMs, Prompt Engineering, architectures RAG, embeddings et agents autonomes',
    icon: '✨',
  },
  {
    id: 'cloud_ai',
    label: 'Cloud AI',
    desc: 'Maîtriser les services managés d’IA (Azure OpenAI, AWS Bedrock, Vertex AI)',
    icon: '☁️',
  },
  {
    id: 'machine_learning',
    label: 'Machine Learning',
    desc: 'Apprentissage supervisé, classification, vision par ordinateur et NLP avancé',
    icon: '🧠',
  },
  {
    id: 'mlops',
    label: 'MLOps',
    desc: 'CI/CD de modèles, pipelines automatisés, feature stores et surveillance du drift',
    icon: '🔄',
  },
];

export const BUDGET_OPTIONS: { id: UserBudget; label: string; desc: string; priceTag: string }[] = [
  {
    id: 'gratuit_eco',
    label: 'Économique / Voucher',
    desc: 'Privilégier les certifications d’entrée gratuites ou vouchers étudiants / Microsoft Challenge',
    priceTag: '0 € – 100 €',
  },
  {
    id: 'standard',
    label: 'Standard individuel',
    desc: 'Investissement personnel ciblé pour 1 à 2 certifications professionnelles',
    priceTag: '150 € – 350 €',
  },
  {
    id: 'illimite',
    label: 'Prise en charge entreprise / Pro',
    desc: 'Financement par votre employeur, plan de formation annuel ou OPCO',
    priceTag: 'Multi-examens (500 €+)',
  },
];

export const WEEKLY_TIME_OPTIONS: { id: UserWeeklyTime; label: string; hoursDesc: string; pacing: string }[] = [
  {
    id: 'express',
    label: 'Rythme Souple',
    hoursDesc: '2 à 4 heures / semaine',
    pacing: '~15-20 minutes par jour (idéal sessions courtes SRS)',
  },
  {
    id: 'standard',
    label: 'Rythme Régulier (Recommandé)',
    hoursDesc: '5 à 8 heures / semaine',
    pacing: '~45 minutes par jour + révision le weekend',
  },
  {
    id: 'intensif',
    label: 'Bootcamp / Sprint',
    hoursDesc: '10 à 15+ heures / semaine',
    pacing: '~2h par jour pour valider une certification en 3-4 semaines',
  },
];

export const LANGUAGE_OPTIONS: { id: UserLanguage; label: string; flag: string; desc: string }[] = [
  {
    id: 'fr',
    label: 'Français',
    flag: '🇫🇷',
    desc: 'Formation et examens traduits en français (disponibles pour Azure et AWS)',
  },
  {
    id: 'en',
    label: 'Anglais (Global)',
    flag: '🇬🇧',
    desc: 'Recommandé pour la terminologie internationale et l’ensemble des spécialités cloud',
  },
  {
    id: 'mixte',
    label: 'Mixte FR / EN',
    flag: '🌐',
    desc: 'Apprentissage francophone avec maîtrise des mots-clés d’architecture anglophones',
  },
];

export const CAREER_GOAL_OPTIONS: { id: UserCareerGoal; label: string; desc: string; icon: string }[] = [
  {
    id: 'montee_competence',
    label: 'Montée en compétences interne',
    desc: 'Prendre le lead sur les projets IA de mon entreprise actuelle',
    icon: '📈',
  },
  {
    id: 'reconversion_job',
    label: 'Reconversion ou nouveau poste',
    desc: 'Booster mon CV & profil LinkedIn pour décrocher un poste d’ingénieur / architecte IA',
    icon: '🎯',
  },
  {
    id: 'appel_offre_partenaire',
    label: 'Partenariat Cloud & Appels d’offres',
    desc: 'Valider les quotas de certifications requis pour les statuts Microsoft/AWS/Google Partner',
    icon: '🤝',
  },
  {
    id: 'certif_express_60j',
    label: 'Objectif express 60 jours',
    desc: 'Valider une certification clé dans les deux mois pour un jalon contractuel ou d’évaluation',
    icon: '⏱️',
  },
];

export const DEFAULT_USER_PROFILE: UserRecommendationProfile = {
  level: 'intermediaire',
  role: 'developpeur',
  primaryGoal: 'cloud_ai',
  budget: 'standard',
  weeklyTime: 'standard',
  language: 'fr',
  careerGoal: 'montee_competence',
};

/**
 * Multiplier for study time calculation based on weekly commitment
 */
const TIME_MULTIPLIERS: Record<UserWeeklyTime, number> = {
  express: 1.5,
  standard: 1.0,
  intensif: 0.6,
};

/**
 * Calculates tailored AI certification pathways
 */
export function generatePathways(
  profile: UserRecommendationProfile = DEFAULT_USER_PROFILE,
  activeCertId: string = 'ai102',
  userCompletedCerts: string[] = ['ai900']
): PathwayPlan[] {
  const timeMult = TIME_MULTIPLIERS[profile.weeklyTime] || 1.0;

  // -------------------------------------------------------------
  // PATHWAY 1: Le Parcours Principal Recommandé (Sur-Mesure)
  // -------------------------------------------------------------
  let p1Title = "Parcours Recommandé • Développeur Cloud AI & RAG";
  let p1Tagline = "De l'acculturation IA jusqu'à l'architecture d'applications génératives en entreprise";
  let p1Description = "Conçu spécifiquement pour votre profil, ce parcours structure votre montée en puissance sans rupture cognitive, depuis les concepts clés jusqu'aux architectures d'IA managées.";
  
  if (profile.role === 'architecte') {
    p1Title = "Parcours Recommandé • Architecte Solutions Cloud AI";
    p1Tagline = "Conception de systèmes d'IA d'entreprise, sécurité, scalabilité & conformité";
  } else if (profile.role === 'data_scientist') {
    p1Title = "Parcours Recommandé • Data Science & ML Engineering";
    p1Tagline = "Du modèle de fondation au pipeline distribué de production";
  } else if (profile.role === 'chef_de_projet' || profile.role === 'consultant') {
    p1Title = "Parcours Recommandé • Stratégie, Gouvernance & Déploiement IA";
    p1Tagline = "Cadrage, conformité AI Act, RAG et pilotage de la transformation";
  }

  // Level 1: AI Fundamentals
  let lvl1CertId = 'ai900';
  let lvl1CertCode = 'AI-900';
  let lvl1CertTitle = 'Azure AI Fundamentals';
  let lvl1Provider: 'azure' | 'aws' | 'gcp' | 'ibm' = 'azure';
  let lvl1ProviderName = 'Microsoft Azure';
  let lvl1Skills = ['Vision & NLP de base', 'Principes d’IA responsable', 'Azure OpenAI Overview', 'Automated ML'];
  let lvl1Weeks = Math.max(2, Math.round(3 * timeMult));

  if (profile.role === 'chef_de_projet' || profile.primaryGoal === 'ia_generative') {
    lvl1CertId = 'aifc01';
    lvl1CertCode = 'AIF-C01';
    lvl1CertTitle = 'AWS Certified AI Practitioner';
    lvl1Provider = 'aws';
    lvl1ProviderName = 'Amazon Web Services';
    lvl1Skills = ['Fondamentaux GenAI', 'Amazon Bedrock', 'Éthique & Sécurité AWS', 'Cas d’usage Métier'];
    lvl1Weeks = Math.max(3, Math.round(4 * timeMult));
  }

  // Level 2: Generative AI
  let lvl2CertId = 'aifc01';
  let lvl2CertCode = 'AIF-C01';
  let lvl2CertTitle = 'AWS Certified AI Practitioner';
  let lvl2Provider: 'azure' | 'aws' | 'gcp' | 'ibm' = 'aws';
  let lvl2ProviderName = 'Amazon Web Services';
  let lvl2Skills = ['Prompt Engineering avancé', 'Modèles de fondation (Claude, Llama)', 'RAG & Vector Storage', 'Sécurité des Prompts'];
  let lvl2Weeks = Math.max(3, Math.round(4 * timeMult));

  if (lvl1CertId === 'aifc01' || profile.role === 'consultant') {
    lvl2CertId = 'watsonx';
    lvl2CertCode = 'C1000-177';
    lvl2CertTitle = 'IBM watsonx.ai Specialist';
    lvl2Provider = 'ibm';
    lvl2ProviderName = 'IBM watsonx';
    lvl2Skills = ['watsonx Studio Prompt Lab', 'Granite Models', 'Gouvernance AI Act', 'Factsheets & Audit'];
    lvl2Weeks = Math.max(3, Math.round(5 * timeMult));
  }

  // Level 3: Cloud AI
  const lvl3CertId = 'ai102';
  const lvl3CertCode = 'AI-102';
  const lvl3CertTitle = 'Azure AI Engineer Associate';
  const lvl3Provider: 'azure' | 'aws' | 'gcp' | 'ibm' = 'azure';
  const lvl3ProviderName = 'Microsoft Azure';
  const lvl3Skills = ['Azure AI Search Hybride (BM25 + Vecteur)', 'Azure OpenAI Service (GPT-4o)', 'Computer Vision & OCR', 'Filtres de contenu & Jailbreak'];
  const lvl3Weeks = Math.max(5, Math.round(6 * timeMult));

  // Level 4: Machine Learning / MLOps
  let lvl4CertId = 'gcpmle';
  let lvl4CertCode = 'GCP-PMLE';
  let lvl4CertTitle = 'Professional Machine Learning Engineer';
  let lvl4Provider: 'azure' | 'aws' | 'gcp' | 'ibm' = 'gcp';
  let lvl4ProviderName = 'Google Cloud';
  let lvl4Skills = ['Vertex AI Studio', 'Kubeflow Pipelines MLOps', 'Fine-tuning LoRA', 'Surveillance de Drift & CI/CD'];
  let lvl4Weeks = Math.max(6, Math.round(8 * timeMult));

  if (profile.role === 'data_scientist' || profile.primaryGoal === 'machine_learning') {
    lvl4CertId = 'mlsc01';
    lvl4CertCode = 'MLS-C01';
    lvl4CertTitle = 'AWS Machine Learning Specialty';
    lvl4Provider = 'aws';
    lvl4ProviderName = 'Amazon Web Services';
    lvl4Skills = ['SageMaker Distributed Training', 'Feature Store MLOps', 'Algorithmes Intégrés', 'Déploiement Endpoints A/B'];
    lvl4Weeks = Math.max(6, Math.round(8 * timeMult));
  } else if (profile.role === 'consultant' || profile.role === 'chef_de_projet') {
    lvl4CertId = 'watsonx';
    lvl4CertCode = 'C1000-177';
    lvl4CertTitle = 'IBM watsonx.ai Specialist';
    lvl4Provider = 'ibm';
    lvl4ProviderName = 'IBM watsonx';
    lvl4Skills = ['watsonx.governance', 'Conformité Européenne AI Act', 'Métriques d’équité & Disparate Impact', 'Déploiement Hybride'];
    lvl4Weeks = Math.max(4, Math.round(5 * timeMult));
  }

  // Determine status for Level 1-4 based on userCompletedCerts & activeCertId
  const getStatus = (certId: string, levelNum: number): 'completed' | 'in_progress' | 'next' | 'locked' => {
    if (userCompletedCerts.includes(certId)) return 'completed';
    if (activeCertId === certId) return 'in_progress';
    if (levelNum === 1 || levelNum === 2) return 'next';
    return 'locked';
  };

  const p1Levels: PathwayLevel[] = [
    {
      levelNumber: 1,
      levelTitle: 'Niveau 1 : AI Fundamentals',
      stageCategory: 'fundamentals',
      subtitle: 'Compréhension globale, vocabulaire & éthique responsable',
      certId: lvl1CertId,
      certCode: lvl1CertCode,
      certTitle: lvl1CertTitle,
      provider: lvl1Provider,
      providerName: lvl1ProviderName,
      skills: lvl1Skills,
      estimatedWeeks: lvl1Weeks,
      estimatedHours: lvl1Weeks * (profile.weeklyTime === 'express' ? 3 : profile.weeklyTime === 'intensif' ? 12 : 6),
      difficulty: 'Accessible',
      status: getStatus(lvl1CertId, 1),
      cardsCount: 500,
      questionsCount: 45,
      examPassScore: '700 / 1000 pts',
      rationale: profile.level === 'debutant' 
        ? "Point de départ essentiel pour poser des bases solides sans jargon excessif."
        : "Socle rapide à valider pour sécuriser la terminologie officielle.",
      recommendedOrder: 1,
    },
    {
      levelNumber: 2,
      levelTitle: 'Niveau 2 : Generative AI',
      stageCategory: 'genai',
      subtitle: 'Modèles de fondation, architectures RAG & ingénierie de prompt',
      certId: lvl2CertId,
      certCode: lvl2CertCode,
      certTitle: lvl2CertTitle,
      provider: lvl2Provider,
      providerName: lvl2ProviderName,
      skills: lvl2Skills,
      estimatedWeeks: lvl2Weeks,
      estimatedHours: lvl2Weeks * (profile.weeklyTime === 'express' ? 3 : profile.weeklyTime === 'intensif' ? 12 : 6),
      difficulty: 'Intermédiaire',
      status: getStatus(lvl2CertId, 2),
      cardsCount: 500,
      questionsCount: 65,
      examPassScore: '700 / 1000 pts',
      rationale: "Le domaine le plus demandé par les entreprises : concevoir des applications assistées par LLM.",
      recommendedOrder: 2,
    },
    {
      levelNumber: 3,
      levelTitle: 'Niveau 3 : Cloud AI',
      stageCategory: 'cloud_ai',
      subtitle: 'Industrialisation de services cognitifs & architectures sécurisées',
      certId: lvl3CertId,
      certCode: lvl3CertCode,
      certTitle: lvl3CertTitle,
      provider: lvl3Provider,
      providerName: lvl3ProviderName,
      skills: lvl3Skills,
      estimatedWeeks: lvl3Weeks,
      estimatedHours: lvl3Weeks * (profile.weeklyTime === 'express' ? 3 : profile.weeklyTime === 'intensif' ? 12 : 6),
      difficulty: 'Avancé',
      status: getStatus(lvl3CertId, 3),
      cardsCount: 500,
      questionsCount: 50,
      examPassScore: '700 / 1000 pts (Actuel: 78%)',
      rationale: "La certification de référence du marché pour les développeurs et architectes IA en environnement cloud.",
      recommendedOrder: 3,
    },
    {
      levelNumber: 4,
      levelTitle: 'Niveau 4 : Machine Learning & MLOps',
      stageCategory: 'ml_mlops',
      subtitle: 'Entraînement distribué, pipelines continus & gouvernance',
      certId: lvl4CertId,
      certCode: lvl4CertCode,
      certTitle: lvl4CertTitle,
      provider: lvl4Provider,
      providerName: lvl4ProviderName,
      skills: lvl4Skills,
      estimatedWeeks: lvl4Weeks,
      estimatedHours: lvl4Weeks * (profile.weeklyTime === 'express' ? 3 : profile.weeklyTime === 'intensif' ? 12 : 6),
      difficulty: 'Expert',
      status: getStatus(lvl4CertId, 4),
      cardsCount: lvl4CertId === 'gcpmle' ? 500 : lvl4CertId === 'watsonx' ? 400 : 400,
      questionsCount: 65,
      examPassScore: '750 / 1000 pts',
      rationale: "Le palier d'excellence pour maîtriser le cycle de vie complet de l'IA en production à grande échelle.",
      recommendedOrder: 4,
    },
  ];

  const p1TotalWeeks = p1Levels.reduce((acc, l) => acc + l.estimatedWeeks, 0);
  const p1TotalHours = p1Levels.reduce((acc, l) => acc + l.estimatedHours, 0);

  const pathway1: PathwayPlan = {
    id: 'primary-recommended',
    title: p1Title,
    tagline: p1Tagline,
    badge: '100% Match Profil',
    isPrimary: true,
    matchScore: 98,
    description: p1Description,
    totalWeeks: p1TotalWeeks,
    totalHours: p1TotalHours,
    totalCerts: 4,
    estimatedCost: profile.budget === 'gratuit_eco' 
      ? '0 € – 165 € (Eligible vouchers)' 
      : profile.budget === 'illimite' 
      ? 'Prise en charge entreprise (360 €+)' 
      : '165 € – 330 € (Examens officiels)',
    highlights: [
      'Progression pédagogique sans rupture cognitive',
      'Couvre les 3 géants mondiaux : Azure, AWS et Google Cloud / IBM',
      'Accès immédiat aux 1900+ fiches mémo et 250+ QCM CertifIA',
      'Validation du score de passage moyen de 72%',
    ],
    levels: p1Levels,
  };

  // -------------------------------------------------------------
  // PATHWAY 2: Alternative Accélérée (Fast-Track GenAI & Cloud)
  // -------------------------------------------------------------
  const p2Levels: PathwayLevel[] = [
    {
      levelNumber: 1,
      levelTitle: 'Niveau 1 : Fast-Track GenAI Practitioner',
      stageCategory: 'fundamentals',
      subtitle: 'Passage direct aux concepts génératifs opérationnels',
      certId: 'aifc01',
      certCode: 'AIF-C01',
      certTitle: 'AWS Certified AI Practitioner',
      provider: 'aws',
      providerName: 'Amazon Web Services',
      skills: ['Concepts LLM', 'Amazon Bedrock', 'Sécurité & IAM', 'Gouvernance de données'],
      estimatedWeeks: Math.max(2, Math.round(3 * timeMult)),
      estimatedHours: 24,
      difficulty: 'Accessible',
      status: getStatus('aifc01', 1),
      cardsCount: 500,
      questionsCount: 65,
      examPassScore: '700 / 1000 pts',
      rationale: "Permet de sauter les généralités pour attaquer directement les modèles de fondation.",
      recommendedOrder: 1,
    },
    {
      levelNumber: 2,
      levelTitle: 'Niveau 2 : Cloud AI & OpenAI Engineering',
      stageCategory: 'cloud_ai',
      subtitle: 'Intégration d’Azure OpenAI, Vector Search et RAG en production',
      certId: 'ai102',
      certCode: 'AI-102',
      certTitle: 'Azure AI Engineer Associate',
      provider: 'azure',
      providerName: 'Microsoft Azure',
      skills: ['Azure OpenAI API', 'AI Search BM25 + Vector', 'Content Safety Filters', 'Computer Vision'],
      estimatedWeeks: Math.max(4, Math.round(5 * timeMult)),
      estimatedHours: 40,
      difficulty: 'Avancé',
      status: getStatus('ai102', 2),
      cardsCount: 500,
      questionsCount: 50,
      examPassScore: '700 / 1000 pts',
      rationale: "Le standard de l'industrie pour déployer des applications d'IA générative connectées aux données métiers.",
      recommendedOrder: 2,
    },
    {
      levelNumber: 3,
      levelTitle: 'Niveau 3 : Enterprise AI Governance & Studio',
      stageCategory: 'genai',
      subtitle: 'Conformité AI Act européen, auditabilité et prompt tuning',
      certId: 'watsonx',
      certCode: 'C1000-177',
      certTitle: 'IBM watsonx.ai Specialist',
      provider: 'ibm',
      providerName: 'IBM watsonx',
      skills: ['watsonx.governance', 'Modèles Granite', 'AI Act Factsheets', 'Data Lakehouse Iceberg'],
      estimatedWeeks: Math.max(3, Math.round(4 * timeMult)),
      estimatedHours: 32,
      difficulty: 'Intermédiaire',
      status: getStatus('watsonx', 3),
      cardsCount: 400,
      questionsCount: 64,
      examPassScore: '620 / 1000 pts',
      rationale: "Indispensable pour les projets bancaires, assurances et grandes organisations soumises aux régulations strictes.",
      recommendedOrder: 3,
    },
    {
      levelNumber: 4,
      levelTitle: 'Niveau 4 : MLOps & Production Scaling',
      stageCategory: 'ml_mlops',
      subtitle: 'Orchestration Kubeflow & Vertex AI pour les architectures complexes',
      certId: 'gcpmle',
      certCode: 'GCP-PMLE',
      certTitle: 'Professional Machine Learning Engineer',
      provider: 'gcp',
      providerName: 'Google Cloud',
      skills: ['Vertex AI Pipelines', 'Model Monitoring', 'LoRA Fine-tuning', 'Feature Store'],
      estimatedWeeks: Math.max(5, Math.round(7 * timeMult)),
      estimatedHours: 56,
      difficulty: 'Expert',
      status: getStatus('gcpmle', 4),
      cardsCount: 500,
      questionsCount: 60,
      examPassScore: '750 / 1000 pts',
      rationale: "Consolide votre profil comme spécialiste multi-cloud capable de passer de l'expérimentation au cluster de production.",
      recommendedOrder: 4,
    },
  ];

  const p2TotalWeeks = p2Levels.reduce((acc, l) => acc + l.estimatedWeeks, 0);
  const p2TotalHours = p2Levels.reduce((acc, l) => acc + l.estimatedHours, 0);

  const pathway2: PathwayPlan = {
    id: 'fast-track-genai',
    title: 'Parcours Accéléré • Fast-Track GenAI & Cloud',
    tagline: 'Focalisé sur la rentabilité immédiate et les compétences les plus recherchées',
    badge: 'Fast-Track ⚡',
    isPrimary: false,
    matchScore: 89,
    description: "Une trajectoire optimisée qui élimine les modules préliminaires pour concentrer vos efforts sur l'IA générative appliquée, le RAG et les architectures cloud managées.",
    totalWeeks: p2TotalWeeks,
    totalHours: p2TotalHours,
    totalCerts: 4,
    estimatedCost: '220 € – 390 € (Examens cibles)',
    highlights: [
      'Gain estimé de 4 à 6 semaines par rapport au cursus académique',
      'Concentration maximale sur les cas d’usage GenAI & RAG',
      'Équilibre équitable entre Microsoft Azure et Amazon Web Services',
    ],
    levels: p2Levels,
  };

  // -------------------------------------------------------------
  // PATHWAY 3: Alternative Spécialiste MLOps & Data Science
  // -------------------------------------------------------------
  const p3Levels: PathwayLevel[] = [
    {
      levelNumber: 1,
      levelTitle: 'Niveau 1 : Fondamentaux Machine Learning',
      stageCategory: 'fundamentals',
      subtitle: 'Mathématiques, classification, régression & Automated ML',
      certId: 'ai900',
      certCode: 'AI-900',
      certTitle: 'Azure AI Fundamentals',
      provider: 'azure',
      providerName: 'Microsoft Azure',
      skills: ['Algorithmes de ML supervisé', 'Évaluation de métriques (Recall, F1)', 'IA Responsable', 'Vision & NLP'],
      estimatedWeeks: Math.max(2, Math.round(3 * timeMult)),
      estimatedHours: 20,
      difficulty: 'Accessible',
      status: getStatus('ai900', 1),
      cardsCount: 500,
      questionsCount: 45,
      examPassScore: '700 / 1000 pts',
      rationale: "Valide les fondations théoriques du Machine Learning avant d'aborder les frameworks de pointe.",
      recommendedOrder: 1,
    },
    {
      levelNumber: 2,
      levelTitle: 'Niveau 2 : Cloud AI & Services Cognitifs',
      stageCategory: 'cloud_ai',
      subtitle: 'Composants managés d’IA pour enrichir les pipelines data',
      certId: 'ai102',
      certCode: 'AI-102',
      certTitle: 'Azure AI Engineer Associate',
      provider: 'azure',
      providerName: 'Microsoft Azure',
      skills: ['Azure AI Search', 'Custom Vision', 'Document Intelligence', 'OpenAI SDK'],
      estimatedWeeks: Math.max(4, Math.round(5 * timeMult)),
      estimatedHours: 40,
      difficulty: 'Avancé',
      status: getStatus('ai102', 2),
      cardsCount: 500,
      questionsCount: 50,
      examPassScore: '700 / 1000 pts',
      rationale: "Permet de combiner des modèles personnalisés avec des services cognitifs pré-entraînés haute performance.",
      recommendedOrder: 2,
    },
    {
      levelNumber: 3,
      levelTitle: 'Niveau 3 : AWS Machine Learning Specialty',
      stageCategory: 'ml_mlops',
      subtitle: 'Ingénierie de données, modélisation avancée et SageMaker',
      certId: 'mlsc01',
      certCode: 'MLS-C01',
      certTitle: 'AWS Machine Learning Specialty',
      provider: 'aws',
      providerName: 'Amazon Web Services',
      skills: ['SageMaker Studio', 'Feature Store', 'Hyperparameter Tuning', 'Algorithmes Intégrés XGBoost'],
      estimatedWeeks: Math.max(5, Math.round(7 * timeMult)),
      estimatedHours: 56,
      difficulty: 'Expert',
      status: getStatus('mlsc01', 3),
      cardsCount: 400,
      questionsCount: 65,
      examPassScore: '750 / 1000 pts',
      rationale: "La certification la plus réputée auprès des cabinets de conseil et des équipes Data Science pour la modélisation cloud.",
      recommendedOrder: 3,
    },
    {
      levelNumber: 4,
      levelTitle: 'Niveau 4 : Google Cloud Professional ML Engineer',
      stageCategory: 'ml_mlops',
      subtitle: 'Orchestration Kubeflow, Vertex AI Pipelines & Continuous Training',
      certId: 'gcpmle',
      certCode: 'GCP-PMLE',
      certTitle: 'Professional Machine Learning Engineer',
      provider: 'gcp',
      providerName: 'Google Cloud',
      skills: ['Kubeflow Pipelines CI/CD', 'Vertex AI Experiments', 'Model Monitoring & Drift', 'Serving PyTorch & TF'],
      estimatedWeeks: Math.max(5, Math.round(7 * timeMult)),
      estimatedHours: 56,
      difficulty: 'Expert',
      status: getStatus('gcpmle', 4),
      cardsCount: 500,
      questionsCount: 60,
      examPassScore: '750 / 1000 pts',
      rationale: "Le sommet de l'ingénierie MLOps pour automatiser le cycle de vie complet du modèle à grande échelle.",
      recommendedOrder: 4,
    },
  ];

  const p3TotalWeeks = p3Levels.reduce((acc, l) => acc + l.estimatedWeeks, 0);
  const p3TotalHours = p3Levels.reduce((acc, l) => acc + l.estimatedHours, 0);

  const pathway3: PathwayPlan = {
    id: 'deep-mlops-specialist',
    title: 'Parcours Spécialiste • MLOps & Data Science Pro',
    tagline: 'De la modélisation mathématique jusqu’au déploiement continu automatisé',
    badge: 'Spécialiste Expert 🔬',
    isPrimary: false,
    matchScore: 82,
    description: "Conçu pour les ingénieurs qui souhaitent maîtriser la chaîne complète de fabrication du modèle : feature engineering, entraînement distribué et chaînes d'intégration continue CI/CD MLOps.",
    totalWeeks: p3TotalWeeks,
    totalHours: p3TotalHours,
    totalCerts: 4,
    estimatedCost: '300 € – 450 € (Spécialités AWS + Google Cloud)',
    highlights: [
      'Double certification de spécialité cloud (AWS MLS-C01 + GCP PMLE)',
      'Couvre les architectures modernes de feature store et continuous training',
      'Idéal pour prétendre aux postes de Lead MLOps ou Staff Data Scientist',
    ],
    levels: p3Levels,
  };

  return [pathway1, pathway2, pathway3];
}
