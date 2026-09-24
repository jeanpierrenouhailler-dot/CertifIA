import { Flashcard } from '../types';
import { domain1Flashcards } from './flashcards/domain1_plan_manage';
import { domain2Flashcards } from './flashcards/domain2_computer_vision';
import { domain3Flashcards } from './flashcards/domain3_nlp_speech';
import { domain4Flashcards } from './flashcards/domain4_genai_rag';
import { domain5Flashcards } from './flashcards/domain5_responsible_security';

import { ai900Domain1Flashcards } from './flashcards/ai900_domain1_ai_workloads';
import { ai900Domain2Flashcards } from './flashcards/ai900_domain2_ml_fundamentals';
import { ai900Domain3Flashcards } from './flashcards/ai900_domain3_computer_vision';
import { ai900Domain4Flashcards } from './flashcards/ai900_domain4_nlp_speech';
import { ai900Domain5Flashcards } from './flashcards/ai900_domain5_generative_ai';

import { mlsc01Domain1Flashcards } from './flashcards/mlsc01_domain1_data_engineering';
import { mlsc01Domain2Flashcards } from './flashcards/mlsc01_domain2_eda_prep';
import { mlsc01Domain3Flashcards } from './flashcards/mlsc01_domain3_modeling';
import { mlsc01Domain4Flashcards } from './flashcards/mlsc01_domain4_mlops_deployment';

import { aifc01Domain1Flashcards } from './flashcards/aifc01_domain1_ai_ml_fundamentals';
import { aifc01Domain2Flashcards } from './flashcards/aifc01_domain2_genai_fundamentals';
import { aifc01Domain3Flashcards } from './flashcards/aifc01_domain3_foundation_models_bedrock';
import { aifc01Domain4Flashcards } from './flashcards/aifc01_domain4_responsible_ai';
import { aifc01Domain5Flashcards } from './flashcards/aifc01_domain5_security_compliance';

import { gcpmleDomain1Flashcards } from './flashcards/gcpmle_domain1_architecting_solutions';
import { gcpmleDomain2Flashcards } from './flashcards/gcpmle_domain2_data_pipelines';
import { gcpmleDomain3Flashcards } from './flashcards/gcpmle_domain3_model_development';
import { gcpmleDomain4Flashcards } from './flashcards/gcpmle_domain4_mlops_orchestration';
import { gcpmleDomain5Flashcards } from './flashcards/gcpmle_domain5_monitoring_optimization';

import { c1000177Domain1Flashcards } from './flashcards/c1000177_domain1_studio_prompt';
import { c1000177Domain2Flashcards } from './flashcards/c1000177_domain2_data_lakehouse';
import { c1000177Domain3Flashcards } from './flashcards/c1000177_domain3_governance_compliance';
import { c1000177Domain4Flashcards } from './flashcards/c1000177_domain4_api_openshift';

export {
  domain1Flashcards,
  domain2Flashcards,
  domain3Flashcards,
  domain4Flashcards,
  domain5Flashcards,
  ai900Domain1Flashcards,
  ai900Domain2Flashcards,
  ai900Domain3Flashcards,
  ai900Domain4Flashcards,
  ai900Domain5Flashcards,
  mlsc01Domain1Flashcards,
  mlsc01Domain2Flashcards,
  mlsc01Domain3Flashcards,
  mlsc01Domain4Flashcards,
  aifc01Domain1Flashcards,
  aifc01Domain2Flashcards,
  aifc01Domain3Flashcards,
  aifc01Domain4Flashcards,
  aifc01Domain5Flashcards,
  gcpmleDomain1Flashcards,
  gcpmleDomain2Flashcards,
  gcpmleDomain3Flashcards,
  gcpmleDomain4Flashcards,
  gcpmleDomain5Flashcards,
  c1000177Domain1Flashcards,
  c1000177Domain2Flashcards,
  c1000177Domain3Flashcards,
  c1000177Domain4Flashcards,
};

export interface ExamDomainMeta {
  id: string;
  name: string;
  shortName: string;
  weight: string;
  count: number;
  color: string;
  description: string;
}

// IBM watsonx C1000-177 Meta (400 cards, 100 per domain)
export const c1000177DomainsMeta: ExamDomainMeta[] = [
  {
    id: 'all',
    name: 'Tous les Domaines IBM watsonx (C1000-177)',
    shortName: 'Tous (400)',
    weight: '100%',
    count: 400,
    color: '#0f62fe',
    description: "Ensemble complet des 400 fiches officielles d'expertise pour la certification IBM Certified Specialist - watsonx.ai v1.0 (C1000-177)."
  },
  {
    id: 'domain1',
    name: "1. watsonx.ai Studio & Prompt Engineering",
    shortName: 'D1: Studio & Prompts (100)',
    weight: '30%',
    count: 100,
    color: '#0f62fe',
    description: "Prompt Lab (Freeform, Structured, Chat), modèles IBM Granite avec indemnisation IP, décodage Greedy vs Sampling, Tuning Studio (Soft Prompts) et Synthetic Data Generator."
  },
  {
    id: 'domain2',
    name: "2. watsonx.data & Gestion des données hybrides",
    shortName: 'D2: Lakehouse & Iceberg (100)',
    weight: '25%',
    count: 100,
    color: '#0043ce',
    description: "Architecture Lakehouse ouverte, format Apache Iceberg (ACID, Time Travel, Schema Evolution), moteurs Presto et Spark, base vectorielle Milvus et masquage dynamique."
  },
  {
    id: 'domain3',
    name: "3. watsonx.governance & Conformité AI Act",
    shortName: 'D3: Gouvernance & AI Act (100)',
    weight: '30%',
    count: 100,
    color: '#8a3ffc',
    description: "AI Factsheets automatisées, équité et Disparate Impact (règle des 80%), dérives de données et précision, métriques ROUGE/BLEU, Groundedness et conformité EU AI Act."
  },
  {
    id: 'domain4',
    name: "4. Intégration d'API et Déploiement Cloud Pak",
    shortName: 'D4: API & OpenShift (100)',
    weight: '15%',
    count: 100,
    color: '#002d9c',
    description: "SDK Python ibm-watsonx-ai, streaming generate_text_stream, endpoints REST, espaces de déploiement (Spaces), conteneurs Red Hat OpenShift et environnements Air-gapped."
  },
];

// Google Cloud GCP-PMLE Meta (500 cards, 100 per domain)
export const gcpmleDomainsMeta: ExamDomainMeta[] = [
  {
    id: 'all',
    name: 'Tous les Domaines GCP-PMLE',
    shortName: 'Tous (500)',
    weight: '100%',
    count: 500,
    color: '#4285f4',
    description: 'Ensemble complet des 500 fiches d\'expertise officielle pour la certification Google Cloud Professional Machine Learning Engineer (GCP-PMLE).'
  },
  {
    id: 'domain1',
    name: "1. Architecturer des solutions de ML sur Google Cloud",
    shortName: 'D1: Architecture & Choix (100)',
    weight: '20%',
    count: 100,
    color: '#4285f4',
    description: 'Arbre de décision (APIs pré-entraînées vs AutoML vs Custom Training), dimensionnement accélérateurs GPU NVIDIA (T4, A100) vs Google TPU, DWS Flex Start, Spot VMs, VPC-SC et CMEK KMS.'
  },
  {
    id: 'domain2',
    name: "2. Préparer et concevoir les pipelines de données",
    shortName: 'D2: Data Pipelines & Features (100)',
    weight: '20%',
    count: 100,
    color: '#0f9d58',
    description: 'Suppression du Training-Serving Skew avec tf.Transform, Vertex AI Feature Store (Bigtable < 10 ms), validation TFDV, Pub/Sub + Dataflow Beam, format TFRecord binaire et anonymisation DLP.'
  },
  {
    id: 'domain3',
    name: "3. Développer et entraîner des modèles de ML",
    shortName: 'D3: Entraînement & Scaling (100)',
    weight: '25%',
    count: 100,
    color: '#8b5cf6',
    description: 'Conteneurs pré-construits vs custom sur Artifact Registry, entraînement distribué MultiWorkerMirroredStrategy (TF_CONFIG), tuning bayésien Vizier, PEFT/LoRA, Experiments et export SavedModel.'
  },
  {
    id: 'domain4',
    name: "4. Automatiser et orchestrer les flux de travail ML (MLOps)",
    shortName: 'D4: MLOps & Déploiement (100)',
    weight: '20%',
    count: 100,
    color: '#ea4335',
    description: 'Vertex AI Pipelines serverless (KFP v2 & TFX), Vertex ML Metadata (MLMD lineage), Model Registry avec alias @champion, Online vs Batch, Traffic Splitting canary, CI/CD Cloud Build et TensorRT.'
  },
  {
    id: 'domain5',
    name: "5. Monitorer et optimiser les solutions en production",
    shortName: 'D5: Monitoring & Explainable (100)',
    weight: '15%',
    count: 100,
    color: '#34a853',
    description: 'Vertex AI Model Monitoring sans code, détection de Skew et Drift (Wasserstein / L-Infinity), boucle de ré-entraînement continu (Continuous Training), Explainable AI (Shapley, XRAI) et TFLite edge.'
  },
];

// AWS AIF-C01 Meta (500 cards, 100 per domain)
export const aifc01DomainsMeta: ExamDomainMeta[] = [
  {
    id: 'all',
    name: 'Tous les Domaines AIF-C01',
    shortName: 'Tous (500)',
    weight: '100%',
    count: 500,
    color: '#ff9900',
    description: 'Ensemble complet des 500 fiches officielles de révision pour la certification AWS Certified AI Practitioner (AIF-C01).'
  },
  {
    id: 'domain1',
    name: "1. Principes fondamentaux de l'IA et du Machine Learning",
    shortName: 'D1: Fondamentaux IA & ML (100)',
    weight: '20%',
    count: 100,
    color: '#0284c7',
    description: 'Paradigmes supervisé, non supervisé et renforcement, métriques (Precision, Recall, F1), overfitting et services cognitifs pré-entraînés (Rekognition, Textract, Comprehend, Transcribe, Polly, Lex).'
  },
  {
    id: 'domain2',
    name: "2. Principes fondamentaux de l'IA générative",
    shortName: 'D2: Principes GenAI (100)',
    weight: '24%',
    count: 100,
    color: '#8b5cf6',
    description: 'Modèles de fondation, transformeurs, auto-attention, modèles de diffusion, cycle de vie (pré-entraînement, RLHF, PEFT/LoRA), prompt engineering (System prompt, Few-shot, CoT) et hyperparamètres.'
  },
  {
    id: 'domain3',
    name: "3. Déploiement et applications des solutions d'IA AWS",
    shortName: 'D3: Bedrock & Applications (100)',
    weight: '28%',
    count: 100,
    color: '#059669',
    description: 'Amazon Bedrock (Claude, Llama, Titan), Knowledge Bases (RAG managé, chunking, embeddings), Agents autonomes (Action Groups, Lambda), Amazon Q Business/Developer et SageMaker JumpStart.'
  },
  {
    id: 'domain4',
    name: "4. Directives d'IA responsable et gouvernance de données",
    shortName: 'D4: IA Responsable (100)',
    weight: '14%',
    count: 100,
    color: '#f59e0b',
    description: 'Les 6 piliers éthiques AWS, détection des biais pré/post-entraînement avec SageMaker Clarify, explicabilité SHAP, AWS AI Service Cards, supervision humaine Amazon A2I et filigrane C2PA Titan.'
  },
  {
    id: 'domain5',
    name: "5. Sécurité, conformité et gouvernance des systèmes d'IA",
    shortName: 'D5: Sécurité & Gouvernance (100)',
    weight: '14%',
    count: 100,
    color: '#0ea5e9',
    description: 'Engagement de confidentialité Bedrock, politiques IAM de moindre privilège, chiffrement KMS CMK, isolation VPC PrivateLink, CloudTrail, Model Invocation Logging, AWS Artifact et conformité EU AI Act.'
  },
];

// AWS MLS-C01 Meta (400 cards, 100 per domain)
export const mlsc01DomainsMeta: ExamDomainMeta[] = [
  {
    id: 'all',
    name: 'Tous les Domaines MLS-C01',
    shortName: 'Tous (400)',
    weight: '100%',
    count: 400,
    color: '#ff9900',
    description: 'Ensemble complet des 400 fiches officielles de révision pour la certification AWS Certified Machine Learning - Specialty (MLS-C01).'
  },
  {
    id: 'domain1',
    name: "1. Ingénierie des données (Data Engineering)",
    shortName: 'D1: Data Engineering (100)',
    weight: '20%',
    count: 100,
    color: '#2563eb',
    description: 'Stockage S3 haute performance (Parquet, RecordIO), Kinesis Data Streams vs Firehose, Glue ETL & Catalog, Athena SQL, SageMaker Pipe Mode et EMR Spark.'
  },
  {
    id: 'domain2',
    name: "2. Analyse exploratoire des données (EDA)",
    shortName: 'D2: EDA & Préparation (100)',
    weight: '24%',
    count: 100,
    color: '#059669',
    description: 'Imputation robuste (médiane vs moyenne), détection d\'outliers (IQR, z-score), encodage catégoriel (One-Hot vs Ordinal), normalisation, PCA et SageMaker Clarify.'
  },
  {
    id: 'domain3',
    name: "3. Modélisation (Modeling)",
    shortName: 'D3: Modélisation (100)',
    weight: '36%',
    count: 100,
    color: '#7c3aed',
    description: 'Algorithmes intégrés SageMaker (XGBoost, DeepAR, Linear Learner, RCF, Factorization Machines, BlazingText, SSD), régularisation L1/L2, métriques PR-AUC et tuning bayésien.'
  },
  {
    id: 'domain4',
    name: "4. Déploiement et opérations de ML (MLOps)",
    shortName: 'D4: Déploiement & MLOps (100)',
    weight: '20%',
    count: 100,
    color: '#e11d48',
    description: 'Endpoints temps réel, serverless, asynchrones, Batch Transform, Multi-Model Endpoints (MME), tests A/B, surveillance Model Monitor, SageMaker Pipelines et Neo.'
  },
];

// AI-900 Meta (500 cards, 100 per domain)
export const ai900DomainsMeta: ExamDomainMeta[] = [
  {
    id: 'all',
    name: 'Tous les Domaines AI-900',
    shortName: 'Tous (500)',
    weight: '100%',
    count: 500,
    color: '#0284c7',
    description: 'Ensemble complet des 500 fiches officielles de révision pour la certification Azure AI Fundamentals (AI-900).'
  },
  {
    id: 'domain1',
    name: "1. Décrire les charges de travail d'IA et leurs considérations",
    shortName: 'D1: Workloads & Éthique (100)',
    weight: '20-25%',
    count: 100,
    color: '#0284c7',
    description: 'Les 6 principes d\'IA responsable de Microsoft (Équité, Fiabilité, Confidentialité, Inclusion, Transparence, Responsabilité) et typologie des charges de travail.'
  },
  {
    id: 'domain2',
    name: "2. Décrire les principes fondamentaux de l'apprentissage automatique sur Azure",
    shortName: 'D2: Machine Learning (100)',
    weight: '25-30%',
    count: 100,
    color: '#059669',
    description: 'Régression, classification binaire/multiclasse, clustering K-Means, Automated ML, Azure ML Designer visuel et métriques (MAE, RMSE, R2, Accuracy, Recall).'
  },
  {
    id: 'domain3',
    name: "3. Décrire les fonctionnalités des charges de travail de vision par ordinateur sur Azure",
    shortName: 'D3: Computer Vision (100)',
    weight: '15-20%',
    count: 100,
    color: '#d97706',
    description: 'Classification d\'images, détection d\'objets avec bounding boxes, OCR Read API, Azure AI Custom Vision sans code, Document Intelligence et Face API.'
  },
  {
    id: 'domain4',
    name: "4. Décrire les charges de travail de traitement du langage naturel (NLP)",
    shortName: 'D4: NLP & Parole (100)',
    weight: '15-20%',
    count: 100,
    color: '#7c3aed',
    description: 'Analyse de sentiments, extraction de phrases clés, détection de langue ISO, NER, caviardage PII RGPD, Question Answering, CLU et Azure AI Speech.'
  },
  {
    id: 'domain5',
    name: "5. Décrire les fonctionnalités des charges de travail d'IA générative sur Azure",
    shortName: 'D5: IA Générative (100)',
    weight: '15-20%',
    count: 100,
    color: '#0ea5e9',
    description: 'Modèles de fondation, Azure OpenAI Service (GPT-4o, DALL-E 3), Prompt Engineering (System Message, Few-shot), RAG On Your Data et Azure AI Content Safety.'
  },
];

// AI-102 Meta (500 cards, 100 per domain)
export const ai102DomainsMeta: ExamDomainMeta[] = [
  {
    id: 'all',
    name: 'Tous les Domaines AI-102',
    shortName: 'Tous (500)',
    weight: '100%',
    count: 500,
    color: '#3b82f6',
    description: 'Ensemble complet des 500 fiches de révision pour la certification Azure AI Engineer Associate.'
  },
  {
    id: 'domain1',
    name: '1. Planifier et gérer une solution Azure AI',
    shortName: 'D1: Plan & Manage (100)',
    weight: '15-20%',
    count: 100,
    color: '#38bdf8',
    description: 'Déploiement multi-services, authentification Entra ID, Managed Identities, Private Link, Key Vault CMK, quotas et monitoring.'
  },
  {
    id: 'domain2',
    name: '2. Mettre en œuvre des solutions de Vision par ordinateur',
    shortName: 'D2: Computer Vision (100)',
    weight: '20-25%',
    count: 100,
    color: '#f43f5e',
    description: 'Image Analysis 4.0, Custom Vision (Classification, Bounding Boxes, IoU), Document Intelligence, Face API et Spatial Analysis.'
  },
  {
    id: 'domain3',
    name: '3. Traitement du Langage Naturel & Solutions Speech',
    shortName: 'D3: NLP & Speech (100)',
    weight: '20-25%',
    count: 100,
    color: '#10b981',
    description: 'Azure AI Language, PII Redaction, CLU (Intents/Entities), Question Answering, Speech SDK streaming, Custom Speech et SSML.'
  },
  {
    id: 'domain4',
    name: "4. Solutions d'IA Générative, RAG & Azure OpenAI",
    shortName: 'D4: GenAI & RAG (100)',
    weight: '15-20%',
    count: 100,
    color: '#8b5cf6',
    description: 'Déploiements GPT-4o, paramètres d\'inférence, recherche hybride BM25+HNSW, Semantic Ranker, Prompt Flow et métriques Groundedness.'
  },
  {
    id: 'domain5',
    name: '5. IA Responsable & Gouvernance de la Sécurité',
    shortName: 'D5: Sécurité & Éthique (100)',
    weight: '10-15%',
    count: 100,
    color: '#0ea5e9',
    description: 'Piliers éthiques Microsoft, Content Safety (seuils 0-6), Blocklists, détection de Jailbreak, filigrane C2PA et conformité EU AI Act.'
  },
];

// Flashcards IBM watsonx C1000-177 (400)
export const c1000177FlashcardsData: Flashcard[] = [
  ...c1000177Domain1Flashcards,
  ...c1000177Domain2Flashcards,
  ...c1000177Domain3Flashcards,
  ...c1000177Domain4Flashcards,
];

// Flashcards Google Cloud GCP-PMLE (500)
export const gcpmleFlashcardsData: Flashcard[] = [
  ...gcpmleDomain1Flashcards,
  ...gcpmleDomain2Flashcards,
  ...gcpmleDomain3Flashcards,
  ...gcpmleDomain4Flashcards,
  ...gcpmleDomain5Flashcards,
];

// Flashcards AWS AIF-C01 (500)
export const aifc01FlashcardsData: Flashcard[] = [
  ...aifc01Domain1Flashcards,
  ...aifc01Domain2Flashcards,
  ...aifc01Domain3Flashcards,
  ...aifc01Domain4Flashcards,
  ...aifc01Domain5Flashcards,
];

// Flashcards AWS MLS-C01 (400)
export const mlsc01FlashcardsData: Flashcard[] = [
  ...mlsc01Domain1Flashcards,
  ...mlsc01Domain2Flashcards,
  ...mlsc01Domain3Flashcards,
  ...mlsc01Domain4Flashcards,
];

// Flashcards AI-900 (500)
export const ai900FlashcardsData: Flashcard[] = [
  ...ai900Domain1Flashcards,
  ...ai900Domain2Flashcards,
  ...ai900Domain3Flashcards,
  ...ai900Domain4Flashcards,
  ...ai900Domain5Flashcards,
];

// Flashcards AI-102 (500)
export const ai102FlashcardsData: Flashcard[] = [
  ...domain1Flashcards,
  ...domain2Flashcards,
  ...domain3Flashcards,
  ...domain4Flashcards,
  ...domain5Flashcards,
];

// Export par défaut
export const flashcardsData: Flashcard[] = c1000177FlashcardsData;
