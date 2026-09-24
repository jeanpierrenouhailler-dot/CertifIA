import { ExamSessionHistory } from '../types';

export const examHistoryData: ExamSessionHistory[] = [
  {
    id: 'SIM-AI102-04',
    date: 'Hier, 18:30',
    duration: '94 min',
    weakPoint: 'Custom Vision (IoU / Probability Tuning)',
    weakPointSeverity: 'high',
    score: 765,
    maxScore: 1000,
    passed: true,
    domainScores: [
      { name: "Planification et gestion", score: 90 },
      { name: "Vision par ordinateur", score: 56 },
      { name: "Langage & Speech", score: 75 },
      { name: "GenAI & Azure OpenAI", score: 85 },
      { name: "IA Responsable", score: 65 },
    ],
    recommendation: "Excellent niveau global. Focalisez la dernière semaine sur la calibration du seuil de détection d'objets Custom Vision et la gestion des filtres de contenu Azure AI Studio."
  },
  {
    id: 'SIM-AI102-03',
    date: 'Il y a 4 jours',
    duration: '98 min',
    weakPoint: 'Filtres de contenu & Modération OpenAI',
    weakPointSeverity: 'medium',
    score: 735,
    maxScore: 1000,
    passed: true,
    domainScores: [
      { name: "Planification et gestion", score: 85 },
      { name: "Vision par ordinateur", score: 52 },
      { name: "Langage & Speech", score: 70 },
      { name: "GenAI & Azure OpenAI", score: 82 },
      { name: "IA Responsable", score: 60 },
    ],
    recommendation: "Premier passage au-dessus de la barre d'admission (700 pts). Progression marquée sur l'indexation hybride dans Azure AI Search."
  },
  {
    id: 'SIM-AI102-02',
    date: 'Il y a 9 jours',
    duration: '102 min',
    weakPoint: 'Recherche Vectorielle & RRF Ranker',
    weakPointSeverity: 'high',
    score: 660,
    maxScore: 1000,
    passed: false,
    domainScores: [
      { name: "Planification et gestion", score: 80 },
      { name: "Vision par ordinateur", score: 48 },
      { name: "Langage & Speech", score: 64 },
      { name: "GenAI & Azure OpenAI", score: 70 },
      { name: "IA Responsable", score: 55 },
    ],
    recommendation: "Score insuffisant sur les questions RAG complexes. Revoir le calcul de Reciprocal Rank Fusion et les dimensions d'embedding."
  },
  {
    id: 'SIM-AI102-01',
    date: 'Il y a 14 jours',
    duration: '105 min',
    weakPoint: 'Gestion des clés d’API & Authentification Entra ID',
    weakPointSeverity: 'medium',
    score: 610,
    maxScore: 1000,
    passed: false,
    domainScores: [
      { name: "Planification et gestion", score: 72 },
      { name: "Vision par ordinateur", score: 45 },
      { name: "Langage & Speech", score: 60 },
      { name: "GenAI & Azure OpenAI", score: 62 },
      { name: "IA Responsable", score: 50 },
    ],
    recommendation: "Évaluation initiale de niveau. Bonnes bases sur les services managés, travail substantiel requis sur Vision et IA Responsable."
  }
];
