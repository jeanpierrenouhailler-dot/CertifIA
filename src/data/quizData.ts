import { QuizQuestion } from '../types';

export const quizQuestionsData: QuizQuestion[] = [
  {
    id: 'q1',
    code: 'Q-7102',
    type: 'Choix Unique (SCQ)',
    points: 30,
    scenario: "Votre organisation souhaite déployer un modèle de fondation via Azure OpenAI pour une application interne hautement sécurisée. Les données d'entreprise ne doivent en aucun cas transiter sur le réseau Internet public et l'accès doit être restreint au réseau virtuel (VNet) de l'entreprise.",
    question: "Quelle configuration réseau et sécurité répond strictement à cette exigence avec un minimum de surcharge de maintenance ?",
    architectureBadge: {
      title: "Architecture Réseau",
      subtitle: "VNet Privé -> Private Endpoint -> Azure OpenAI",
    },
    options: [
      {
        key: 'A',
        text: "Créer un Azure Private Endpoint (Liaison Privée) pour la ressource Azure OpenAI et désactiver l'accès réseau public.",
        subtext: "Recommandé pour isolation stricte RFC 1918 sans transit internet public."
      },
      {
        key: 'B',
        text: "Déployer une passerelle Azure Application Gateway avec règles de pare-feu WAF en mode détection uniquement.",
        subtext: "Laisse l'endpoint Azure OpenAI joignable via son FQDN public."
      },
      {
        key: 'C',
        text: "Utiliser des balises de service (Service Tags) dans le groupe de sécurité réseau (NSG) sans désactiver l'adresse IP publique de la ressource.",
        subtext: "N'offre pas d'adresse IP privée dédiée dans le sous-réseau local."
      },
      {
        key: 'D',
        text: "Exécuter un tunnel SSH inverse sur une machine virtuelle Linux servant de reverse-proxy non managé.",
        subtext: "Introduit un point de défaillance unique (SPOF) et une charge d'exploitation lourde."
      }
    ],
    correctKey: 'A',
    explanation: {
      mainReason: "L'utilisation d'Azure Private Endpoint projette la ressource Azure OpenAI directement dans le sous-réseau VNet du client avec une IP privée dédiée. En désactivant l'accès public ('Public network access: Disabled'), tout le trafic reste confiné au backbone privé Microsoft.",
      highlights: [
        {
          title: "Sécurité Réseau Zero-Trust",
          desc: "Empêche toute exfiltration de données et bloque l'accès non autorisé depuis l'extérieur du réseau privé.",
          icon: "security"
        },
        {
          title: "Intégration DNS Privé",
          desc: "La zone DNS privée 'privatelink.openai.azure.com' résout automatiquement le nom d'hôte canonique vers l'IP interne.",
          icon: "dns"
        }
      ],
      traps: [
        { key: 'B', reason: "App Gateway en mode détection ne bloque rien et n'isole pas l'API cible du réseau public." },
        { key: 'C', reason: "Les Service Tags filtrent le trafic mais la ressource continue d'exposer une IP publique reachable." },
        { key: 'D', reason: "Anti-pattern d'architecture cloud : complexité opérationnelle, absence de haute disponibilité managée." }
      ],
      officialDocTitle: "Sécuriser les ressources Azure OpenAI avec Private Link",
      officialDocSubtitle: "Microsoft Learn • Sécurité du réseau virtuel Azure AI",
      officialDocUrl: "https://learn.microsoft.com/fr-fr/azure/ai-services/cognitive-services-virtual-networks"
    }
  },
  {
    id: 'q7',
    code: 'Q-7294',
    type: 'Choix Unique (SCQ)',
    points: 40,
    scenario: "Vous concevez une solution de Retrieval-Augmented Generation (RAG) sur Azure pour une base de connaissances juridique de 450 000 contrats. La solution doit gérer à la fois des termes juridiques exacts (numéros d'articles, sigles latins stricts) et des requêtes conceptuelles en langage naturel flou. Vous devez maximiser le rappel (recall) et la précision du classement tout en maintenant une latence d'inférence sous les 350 ms.",
    question: "Quelle stratégie de stockage et de recherche devez-vous recommander dans le respect du blueprint officiel Azure AI-102 ?",
    architectureBadge: {
      title: "Architecture Validée",
      subtitle: "Azure Blob -> Indexation Hybride (BM25 + text-embedding-3-large) -> Semantic Ranker -> Azure OpenAI",
    },
    options: [
      {
        key: 'A',
        text: "Utiliser Azure AI Search avec indexation hybride (BM25 + vecteurs denses text-embedding-3-large) couplé au reranking sémantique (Semantic Ranker).",
        subtext: "Fusion RRF (Reciprocal Rank Fusion) combinant précision lexicale exacte et compréhension contextuelle vectorielle."
      },
      {
        key: 'B',
        text: "Configurer une base Azure Cosmos DB for PostgreSQL avec l'extension pgvector seule et exécuter une recherche exacte brute par force brute k-NN sans index HNSW.",
        subtext: "Latence prohibitive sur 450k documents (>1200ms) et incapacité à capturer les termes exacts peu fréquents."
      },
      {
        key: 'C',
        text: "Déployer une instance Qdrant auto-hébergée sur une machine virtuelle Azure IaaS avec stockage éphémère et synchronisation manuelle par script CRON.",
        subtext: "Violation des principes PaaS Azure AI-102, risque de perte de données et maintenance infrastructure non managée."
      },
      {
        key: 'D',
        text: "Stocker l'ensemble des documents bruts en texte clair directement dans le System Prompt de chaque appel API Azure OpenAI gpt-4o.",
        subtext: "Dépassement catastrophique de la fenêtre de contexte (128k tokens), coût prohibitif et latence inacceptable."
      }
    ],
    correctKey: 'A',
    explanation: {
      mainReason: "L'indexation hybride sur Azure AI Search combine la recherche de mots-clés traditionnelle (algorithme BM25) pour les correspondances textuelles exactes (sigles, codes d'articles) et la recherche vectorielle basée sur les embeddings denses pour la similarité sémantique. Les résultats sont fusionnés via l'algorithme RRF (Reciprocal Rank Fusion), puis réordonnés par le Semantic Ranker pour placer les chunks les plus pertinents en tête de prompt.",
      highlights: [
        {
          title: "Reciprocal Rank Fusion (RRF)",
          desc: "Fusion mathématique des scores lexicaux et denses, évitant les compromis de normalisation arbitraire entre BM25 et distance cosinus.",
          icon: "reorder"
        },
        {
          title: "Semantic Ranker (Turing L2)",
          desc: "Modèle de reranking profond basé sur les modèles Turing de Microsoft réévaluant le top-50 des chunks en quelques millisecondes.",
          icon: "psychology"
        },
        {
          title: "Security Trimming Native",
          desc: "Filtrage automatique au niveau document basé sur les listes de contrôle d'accès (ACLs) Microsoft Entra ID lors de la requête.",
          icon: "verified_user"
        }
      ],
      traps: [
        { key: 'B', reason: "La force brute k-NN sur 450 000 vecteurs provoque une explosion de latence sans index approximatif (HNSW) et ignore la recherche par mot-clé exact." },
        { key: 'C', reason: "L'examen AI-102 évalue les services PaaS managés d'Azure AI Services. Déployer une VM non managée viole la recommandation architecturale." },
        { key: 'D', reason: "450 000 contrats dépassent largement la fenêtre de contexte maximale et violerait les quotas de jetons par minute (TPM)." }
      ],
      officialDocTitle: "Recherche hybride à l'aide de vecteurs et de texte dans Azure AI Search",
      officialDocSubtitle: "Microsoft Learn • Guide d'implémentation de la génération augmentée de récupération (RAG)",
      officialDocUrl: "https://learn.microsoft.com/fr-fr/azure/search/hybrid-search-overview"
    }
  },
  {
    id: 'q8',
    code: 'Q-7315',
    type: 'Choix Unique (SCQ)',
    points: 35,
    scenario: "Vous développez un modèle de Computer Vision avec Azure Custom Vision pour détecter des micro-fissures sur des composants aéronautiques en ligne de production. Lors de vos premiers tests, le modèle détecte 98% des fissures réelles, mais produit 40% de faux positifs (composants intacts signalés comme défectueux).",
    question: "Quelle action devez-vous entreprendre dans l'interface de Custom Vision pour équilibrer la précision sans perdre le contrôle de la qualité ?",
    architectureBadge: {
      title: "Optimisation de Modèle",
      subtitle: "Custom Vision Object Detection -> Seuil de Probabilité & Recall/Precision Curve",
    },
    options: [
      {
        key: 'A',
        text: "Augmenter le curseur de seuil de probabilité (Probability Threshold) de 50% à 75% tout en surveillant la métrique de rappel (Recall).",
        subtext: "Élimine les détections incertaines et réduit directement le volume de faux positifs."
      },
      {
        key: 'B',
        text: "Abaisser le seuil d'Overlap Threshold (Intersection over Union - IoU) à 10%.",
        subtext: "Augmenterait au contraire le nombre de boîtes englobantes redondantes et erronées."
      },
      {
        key: 'C',
        text: "Supprimer 50% des images d'entraînement positives pour équilibrer le ratio de classes.",
        subtext: "Dégrade drastiquement la capacité de généralisation du réseau neuronal convolutif."
      },
      {
        key: 'D',
        text: "Changer le domaine du projet en 'General [compact]' pour accélérer l'inférence.",
        subtext: "Les modèles compacts sacrifient la précision fine pour l'exécution embarquée sur microcontrôleurs."
      }
    ],
    correctKey: 'A',
    explanation: {
      mainReason: "Le seuil de probabilité (Probability Threshold) filtre les prédictions dont l'indice de confiance est insuffisant. Lorsque le modèle produit trop de faux positifs (précision faible), augmenter ce seuil exige un degré de certitude supérieur, réduisant ainsi les fausses alertes.",
      highlights: [
        {
          title: "Compromis Précision / Rappel",
          desc: "Dans le contrôle qualité aéronautique, le rappel doit rester élevé, mais un seuil trop bas sature les équipes de validation manuelle.",
          icon: "balance"
        },
        {
          title: "Images Négatives Indispensables",
          desc: "L'ajout d'images négatives (composants impeccables sans tag) est également la méthode officielle recommandée par Azure pour calibrer la détection.",
          icon: "photo_library"
        }
      ],
      traps: [
        { key: 'B', reason: "L'IoU mesure le chevauchement avec la vérité terrain. Réduire l'IoU tolère des boîtes très mal alignées." },
        { key: 'C', reason: "Supprimer des données d'entraînement nuit aux performances globales du modèle." },
        { key: 'D', reason: "Le domaine compact est destiné aux exports ONNX/TensorFlow Lite pour IoT, avec une perte de précision notable." }
      ],
      officialDocTitle: "Évaluer et tester les modèles Custom Vision",
      officialDocSubtitle: "Microsoft Learn • Azure AI Vision Object Detection",
      officialDocUrl: "https://learn.microsoft.com/fr-fr/azure/ai-services/custom-vision-service/test-your-model"
    }
  },
  {
    id: 'q9',
    code: 'Q-7342',
    type: 'Choix Unique (SCQ)',
    points: 35,
    scenario: "Une banque internationale doit déployer Azure OpenAI Service pour automatiser la génération de résumés de crédits. Pour respecter les exigences de conformité PCI-DSS et RGPD, aucun employé ou ingénieur de Microsoft ne doit pouvoir accéder aux prompts ou complétions enregistrés à des fins d'amélioration de modèle ou de surveillance des abus.",
    question: "Quelle procédure officielle Azure devez-vous soumettre pour désactiver la journalisation des requêtes par les équipes de sécurité Microsoft ?",
    architectureBadge: {
      title: "Gouvernance & Conformité",
      subtitle: "Azure AI Studio -> Demande d'exemption de surveillance des abus (Abuse Monitoring Exemption)",
    },
    options: [
      {
        key: 'A',
        text: "Soumettre le formulaire officiel d'exemption de vérification humaine et de surveillance des abus (Abuse Monitoring / Content Logging Exemption) via le portail Azure.",
        subtext: "Processus formel accordé aux entreprises régulées répondant aux critères stricts de conformité légale."
      },
      {
        key: 'B',
        text: "Définir la variable d'environnement 'LOGGING_ENABLED=false' dans le client Python SDK.",
        subtext: "N'a aucun impact sur les serveurs d'inférence managés d'Azure OpenAI."
      },
      {
        key: 'C',
        text: "Créer une règle de pare-feu DNS bloquant le domaine de télémétrie de Microsoft.",
        subtext: "Bloquerait les endpoints de résolution nécessaires au fonctionnement du service."
      },
      {
        key: 'D',
        text: "Utiliser un modèle Open Source déployé sur Azure Container Instances sans clé API.",
        subtext: "Ne permet pas d'utiliser les modèles propriétaires GPT-4o certifiés requis par le cahier des charges."
      }
    ],
    correctKey: 'A',
    explanation: {
      mainReason: "Par défaut, Azure OpenAI stocke les invites et les complétions pendant 30 jours pour surveiller les abus et le contenu préjudiciable. Les clients régulés peuvent demander une exemption formelle de journalisation de contenu (Modified Content Filtering & Logging Exemption) soumise à approbation par Microsoft.",
      highlights: [
        {
          title: "Zéro Rétention des Données",
          desc: "Une fois l'exemption accordée, aucune donnée de prompt ou de complétion n'est écrite sur les disques de journalisation de Microsoft.",
          icon: "shield"
        },
        {
          title: "Respect des Régulations Financières",
          desc: "Obligatoire pour les institutions bancaires soumises au secret bancaire strict et au RGPD article 9.",
          icon: "gavel"
        }
      ],
      traps: [
        { key: 'B', reason: "Les paramètres du SDK client ne contrôlent pas la télémétrie de conformité côté serveur hébergé." },
        { key: 'C', reason: "Le filtrage DNS ne modifie pas les règles internes de traitement des données dans les datacenters Azure." },
        { key: 'D', reason: "Ne répond pas au besoin d'exploiter les capacités de pointe de GPT-4o d'Azure OpenAI." }
      ],
      officialDocTitle: "Gestion des données et confidentialité pour Azure OpenAI Service",
      officialDocSubtitle: "Microsoft Learn • Processus d'exemption de filtrage de contenu",
      officialDocUrl: "https://learn.microsoft.com/fr-fr/legal/cognitive-services/openai/data-privacy"
    }
  }
];

// Complete 20 questions status matrix for the Entraînement grid navigation
export const quizMatrixItems = [
  { num: 1, status: 'correct', score: 30 },
  { num: 2, status: 'correct', score: 35 },
  { num: 3, status: 'correct', score: 35 },
  { num: 4, status: 'incorrect', score: 0 },
  { num: 5, status: 'correct', score: 40 },
  { num: 6, status: 'correct', score: 30 },
  { num: 7, status: 'active', score: null }, // Current active item
  { num: 8, status: 'unanswered', score: null },
  { num: 9, status: 'unanswered', score: null },
  { num: 10, status: 'unanswered', score: null },
  { num: 11, status: 'unanswered', score: null },
  { num: 12, status: 'unanswered', score: null },
  { num: 13, status: 'unanswered', score: null },
  { num: 14, status: 'unanswered', score: null },
  { num: 15, status: 'unanswered', score: null },
  { num: 16, status: 'unanswered', score: null },
  { num: 17, status: 'unanswered', score: null },
  { num: 18, status: 'unanswered', score: null },
  { num: 19, status: 'unanswered', score: null },
  { num: 20, status: 'unanswered', score: null },
];
