import { Flashcard } from '../../types';

// Google Cloud GCP-PMLE - Domaine 5 : Monitorer et optimiser les solutions en production (100 Flashcards)
// Poids officiel de l'examen Professional Machine Learning Engineer : 15%
export const gcpmleDomain5Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `GCP-D5-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Vertex AI Model Monitoring : Surveillance Continue Sans Code en Production",
      lead: "Comment surveiller en continu la dérive des données sur un endpoint d'inférence en direct sans réécrire le code de prédiction de votre conteneur ?",
      heading: "Supervision Automatisée des Endpoints de Production",
      body: "Vertex AI Model Monitoring s'active directement sur un endpoint existant sans nécessiter la moindre ligne de code supplémentaire : 1. Il échantillonne un pourcentage configurable des requêtes réelles reçues (Request-Response Logging) et les stocke automatiquement dans une table BigQuery dédiée ; 2. À intervalles réguliers (ex: toutes les 3 heures ou chaque nuit), il calcule les distributions statistiques des caractéristiques entrantes et des prédictions ; 3. En cas de détection d'une dérive statistique dépassant le seuil configuré, il émet des alertes vers Cloud Monitoring et Cloud Pub/Sub.",
      m1: { label: "Zéro Code Requis", value: "Activation en 1 Clic Console/SDK", desc: "S'applique nativement sur tout conteneur pré-construit ou custom déployé." },
      m2: { label: "Stockage BigQuery", value: "Table de Logs Dédiée", desc: "Permet des requêtes SQL d'audit rétrospectives sur les payloads réels reçus." },
      m3: { label: "Échantillonnage", value: "Sampling Rate Ajustable", desc: "Permet de surveiller 10% ou 100% des requêtes selon la charge de trafic." },
      rules: [
        "1. Pour surveiller les dérives statistiques sur un endpoint Vertex AI sans modifier le code : activer Vertex AI Model Monitoring.",
        "2. Les tables BigQuery de journalisation sont partitionnées par jour pour limiter les coûts de requête."
      ],
      tag: "VERTEX MODEL MONITORING"
    },
    {
      title: "Détection de Dérive : Training-Serving Skew vs Prediction Drift",
      lead: "Quelle est la différence fondamentale entre un 'Skew' et un 'Drift' dans la terminologie officielle de surveillance de Vertex AI ?",
      heading: "Comparaison avec la Référence d'Entraînement vs Dérive Temporelle",
      body: "Vertex AI Model Monitoring distingue deux types d'anomalies : 1. Training-Serving Skew : compare la distribution statistique des données reçues en production par rapport au jeu de données de référence d'origine (Training Baseline) ; un écart indique que le monde réel a changé depuis le dernier entraînement ou qu'un bug amont corrompt les données ; 2. Prediction Drift (ou Dérive Temporelle) : compare les distributions de production sur deux fenêtres temporelles consécutives (ex: les 7 derniers jours vs les 7 jours précédents) pour détecter une évolution graduelle des comportements sans avoir besoin du dataset d'origine.",
      m1: { label: "Training-Serving Skew", value: "Prod vs Baseline Entraînement", desc: "Révèle que le modèle opère sur des données non représentatives de son apprentissage." },
      m2: { label: "Prediction Drift", value: "Fenêtre N vs Fenêtre N-1", desc: "Mesure la vitesse d'évolution temporelle des entrées ou des scores prédits." },
      m3: { label: "Baseline Dataset", value: "Table BQ ou Schéma GCS", desc: "Sert de vérité de référence pour calculer les distances statistiques." },
      rules: [
        "1. Si le dataset d'entraînement initial est disponible : configurer en priorité la détection de Training-Serving Skew.",
        "2. Si les données d'entraînement ont disparu ou ne sont pas accessibles : utiliser la détection de Prediction Drift temporelle."
      ],
      tag: "SKEW VS DRIFT DÉFINITION"
    },
    {
      title: "Métriques Mathématiques de Dérive : Distance de Wasserstein vs L-Infinity (L-inf)",
      lead: "Quelles formules mathématiques Vertex AI Model Monitoring emploie-t-il pour quantifier la dérive des variables numériques et catégorielles ?",
      heading: "Quantification Rigoureuse des Écarts Distributionnels",
      body: "Pour mesurer la dérive de manière scientifiquement robuste : 1. Variables numériques continues : Vertex AI utilise la distance de Wasserstein (aussi appelée Earth Mover's Distance - EMD) ; elle mesure le travail minimal nécessaire pour transformer une distribution de probabilité en une autre ; seuil typique : $0.1$ ; 2. Variables catégorielles discrètes : Vertex AI utilise la distance L-Infinity ($L_\infty$ ou norme de Chebyshev) ou la divergence de Jensen-Shannon (JSD) ; elle mesure l'écart maximal absolu de probabilité entre deux modalités ; seuil typique : $0.1$.",
      m1: { label: "Distance de Wasserstein", value: "Variables Numériques Continues", desc: "Robuste aux variations d'échelle et sensible aux décalages de moyenne et d'étalement." },
      m2: { label: "Distance L-Infinity", value: "Variables Catégorielles", desc: "Capte l'apparition brutale d'une nouvelle modalité ou la chute d'une catégorie clé." },
      m3: { label: "Seuils d'Alerte", value: "Typiquement 0.1 par Défaut", desc: "Déclenche une alerte dès que la distance calculée dépasse le seuil fixé." },
      rules: [
        "1. Pour une colonne numérique continue (ex: montant de transaction) : la métrique de dérive est la distance de Wasserstein.",
        "2. Pour une colonne catégorielle (ex: pays de résidence) : la métrique de dérive est la distance L-Infinity."
      ],
      tag: "MÉTRIQUES WASSERSTEIN & L-INF"
    },
    {
      title: "Ré-entraînement Continu Automatisé (Continuous Training - CT Pipeline)",
      lead: "Comment déclencher automatiquement le ré-entraînement complet d'un modèle dès que Vertex AI Model Monitoring détecte un seuil de dérive dépassé ?",
      heading: "Boucle Fermée MLOps Déclenchée par Événements (Event-Driven CT)",
      body: "L'architecture de ré-entraînement réactif Google Cloud s'articule ainsi : 1. Détection : Vertex AI Model Monitoring identifie une dérive (Wasserstein > 0.15) et publie une notification JSON dans un topic Cloud Pub/Sub ; 2. Déclenchement : un service Cloud Functions (ou Cloud Run via Eventarc) s'abonne au topic Pub/Sub ; 3. Exécution : la fonction invoque l'API Vertex AI Pipelines pour lancer le pipeline de ré-entraînement automatique avec les données fraîches des 30 derniers jours ; 4. Évaluation & Promotion : si le modèle nouvellement entraîné surpasse l'ancien sur le jeu de validation, il est promu sous l'alias `@champion`.",
      m1: { label: "Notification Pub/Sub", value: "Déclencheur Asynchrone", desc: "Alerte instantanée transmise dès qu'un drift statistique est confirmé." },
      m2: { label: "Vertex AI Pipeline", value: "Ré-entraînement Automatique", desc: "Exécute le DAG d'ingestion, training, validation et enregistrement." },
      m3: { label: "Gate de Validation", value: "Comparaison de Performance", desc: "Empêche formellement de déployer un modèle ré-entraîné s'il s'avère moins performant." },
      rules: [
        "1. Ne jamais déployer aveuglément un modèle ré-entraîné sans passer par une étape d'évaluation comparative contre le champion actuel.",
        "2. Le ré-entraînement continu (Continuous Training) représente le niveau ultime de maturité MLOps (Niveau 2 Google MLOps)."
      ],
      tag: "CONTINUOUS TRAINING PIPELINE"
    },
    {
      title: "Vertex Explainable AI : Explicabilité avec Valeurs de Shapley (Sampled Shapley)",
      lead: "Comment expliquer mathématiquement à un client pourquoi son dossier de prêt a été refusé par un modèle de scoring tabulaire ?",
      heading: "Attribution Locale des Caractéristiques par Théorie des Jeux",
      body: "Vertex Explainable AI fournit des scores d'attribution de caractéristiques (Feature Attributions) : 1. Sampled Shapley : méthode standard pour les données tabulaires (Scikit-learn, XGBoost, TensorFlow) ; issue de la théorie des jeux coopératifs, elle calcule la contribution marginale de chaque variable en simulant toutes les coalitions possibles ; 2. Attribution positive : la variable a augmenté le score de prédiction vers la classe cible ; 3. Attribution négative : la variable a tiré la prédiction vers le bas ; 4. Explication locale : fournie instantanément dans le corps de réponse JSON lors de chaque appel de prédiction en ligne.",
      m1: { label: "Sampled Shapley", value: "Modèles Tabulaires & Arbres", desc: "Approximation efficace des valeurs Shapley exactes pour temps de réponse rapide." },
      m2: { label: "Attribution par Feature", value: "Score Positif ou Négatif", desc: "Quantifie l'influence précise de l'ancienneté, du revenu ou du ratio d'endettement." },
      m3: { label: "Conformité Légale", value: "Droit à l'Explication", desc: "Obligatoire dans les secteurs financiers et de santé sous le RGPD." },
      rules: [
        "1. Pour les données tabulaires avec des modèles comme XGBoost : la méthode d'explication recommandée est Sampled Shapley.",
        "2. L'explication locale explique UNE prédiction particulière ; l'explication globale résume le modèle entier."
      ],
      tag: "EXPLAINABLE AI SHAPLEY"
    },
    {
      title: "Explicabilité pour Réseaux Profonds : Integrated Gradients et XRAI",
      lead: "Comment visualiser exactement quelles zones d'une radiographie pulmonaire ou quels mots d'un avis client ont déterminé le diagnostic d'un réseau profond ?",
      heading: "Attribution Différentiable et Cartes de Saillance pour Images et Texte",
      body: "Pour les réseaux de neurones profonds : 1. Integrated Gradients : méthode formelle axiomatique (satisfaisant les axiomes de complétude et d'invariance d'implémentation) pour modèles différentiables (TensorFlow, PyTorch) ; elle intègre les gradients le long d'une trajectoire linéaire entre une ligne de base neutre (image noire, texte vide) et l'échantillon d'entrée ; idéale pour NLP et séries temporelles ; 2. XRAI (eXplanation with Ranked Area Integrals) : extension d'Integrated Gradients sur mesure pour la vision par ordinateur ; regroupe les pixels en superpixels homogènes et produit des cartes thermiques de saillance visuelle claires et interprétables par des médecins.",
      m1: { label: "Integrated Gradients", value: "Modèles Différentiables (NLP/TF)", desc: "Exige que le modèle admette des dérivées continues par rapport aux entrées." },
      m2: { label: "XRAI", value: "Vision par Ordinateur & Superpixels", desc: "Met en surbrillance les régions visuelles décisives d'une image médicale ou satellite." },
      m3: { label: "Ligne de Base Neutre", value: "Image Noire ou Zéros", desc: "Point de référence 'd'absence d'information' indispensable au calcul intégral." },
      rules: [
        "1. Pour expliquer des modèles de Computer Vision (images) sur Vertex AI : choisir la méthode XRAI.",
        "2. Pour expliquer des modèles de traitement du langage (NLP) profonds : choisir Integrated Gradients."
      ],
      tag: "INTEGRATED GRADIENTS & XRAI"
    },
    {
      title: "Détection de Dérive d'Explicabilité (Feature Attributions Drift)",
      lead: "Que signifie une alerte indiquant que l'importance relative d'une caractéristique a chuté de 60% en production alors que l'exactitude globale semble inchangée ?",
      heading: "Surveillance de la Dérive de Raisonnement Interne du Modèle",
      body: "Un modèle peut maintenir une exactitude apparente tout en fondant ses décisions sur des variables parasites : Vertex AI Model Monitoring permet de surveiller la dérive des attributions de caractéristiques (Feature Attribution Drift) : 1. Il compare les valeurs Shapley de production avec celles de la baseline d'entraînement ; 2. Si une caractéristique clé (ex: 'taux d'endettement') perd soudainement son pouvoir explicatif au profit d'une variable anecdotique (ex: 'navigateur web utilisé'), une alerte est émise ; 3. Cela signale une dégradation silencieuse majeure du modèle bien avant que les erreurs de prédiction ne soient visibles.",
      m1: { label: "Attribution Drift", value: "Changement de Raisonnement Interne", desc: "Alerte quand le modèle commence à s'appuyer sur de mauvaises variables." },
      m2: { label: "Détection Précoce", value: "Précède la Chute d'Accuracy", desc: "Avertit l'équipe d'un risque avant que les clients ne subissent des erreurs de prédiction." },
      m3: { label: "Corrélation Spurious", value: "Piège des Corrélations Illusoires", desc: "Révèle que le modèle exploite un biais opportuniste apparu récemment." },
      rules: [
        "1. Surveiller la dérive des attributions d'explicabilité pour détecter les failles logiques silencieuses en production.",
        "2. L'attribution drift utilise la distance de Wasserstein sur les vecteurs d'attributions Shapley."
      ],
      tag: "FEATURE ATTRIBUTION DRIFT"
    },
    {
      title: "Observabilité Système et Métriques Cloud Monitoring pour les Endpoints",
      lead: "Quelles métriques fondamentales surveiller sur Google Cloud Monitoring pour diagnostiquer un endpoint d'inférence saturé renvoyant des erreurs HTTP 503 ?",
      heading: "Supervision de la Santé Infrastructure et Latence des Endpoints",
      body: "Pour garantir les SLAs d'une application d'inférence, Cloud Monitoring collecte en temps réel : 1. Latence P95 et P99 (`aiplatform.googleapis.com/prediction/online/latency`) : temps de réponse au 95e et 99e percentile pour isoler les requêtes anormalement lentes ; 2. Utilisation des ressources (`node_utilization`) : pourcentage CPU/GPU moyen des nœuds de prédiction ; 3. Codes d'erreurs HTTP : erreurs 4xx (requêtes clientes mal formées, JSON invalide) vs erreurs 5xx (crash interne du conteneur, Out Of Memory OOM) ; 4. CloudWatch Alarms équivalentes : Alerting Policies déclenchant des notifications PagerDuty si la latence P99 dépasse 200 ms pendant 3 minutes.",
      m1: { label: "Latence P95 / P99", value: "Indicateur Clé d'Expérience", desc: "Détecte les ralentissements affectant les utilisateurs avant l'effondrement complet." },
      m2: { label: "Erreurs HTTP 5xx", value: "Crash Conteneur ou OOM", desc: "Signale une fuite de mémoire VRAM ou un timeout de modèle trop lourd." },
      m3: { label: "Alerting Policies", value: "Astreinte & Notification Slack", desc: "Envoi automatique d'alertes aux ingénieurs d'astreinte lors des anomalies de charge." },
      rules: [
        "1. Toujours baser les alertes d'inférence sur la latence au 95e ou 99e percentile (P95/P99) plutôt que sur la moyenne arithmétique.",
        "2. Si les erreurs 503 augmentent avec une forte utilisation CPU/GPU : augmenter le paramètre `max_replica_count` de l'endpoint."
      ],
      tag: "CLOUD MONITORING ENDPOINTS"
    },
    {
      title: "Optimisation de Modèles pour l'Edge avec TensorFlow Lite (TFLite) et Pruning",
      lead: "Comment compresser un modèle de vision par ordinateur de 250 Mo afin qu'il tourne sur un smartphone avec moins de 25 Mo de RAM et une batterie préservée ?",
      heading: "Techniques d'Allégement pour Systèmes Embarqués et Mobiles",
      body: "L'inférence sur terminaux mobiles ou passerelles IoT exige des optimisations drastiques : 1. Pruning (Élagage de poids) : identifie les connexions synaptiques proches de zéro et les supprime définitivement ; force une matrice de poids creuse (Sparse) sans perte d'exactitude ; 2. Post-Training Quantization (PTQ) avec TensorFlow Lite : convertit les poids flottants 32 bits (FP32) en entiers 8 bits (INT8), divisant la taille du fichier par 4 et accélérant l'inférence sur les puces NPU/CPU mobiles ; 3. Compilation TFLite FlatBuffer : génère un fichier `.tflite` autonome exécutable par le runtime TFLite sans dépendance externe.",
      m1: { label: "Pruning Synaptique", value: "Suppression des Connexions Faibles", desc: "Élimine jusqu'à 80% des poids inutiles du réseau de neurones." },
      m2: { label: "Quantification INT8", value: "Compression x4 & Débit Accru", desc: "Permet l'exécution sur microcontrôleurs et puces edge peu gourmandes." },
      m3: { label: "Format .tflite", value: "FlatBuffer Haute Performance", desc: "Chargement instantané en mémoire sans désérialisation lourde." },
      rules: [
        "1. Pour déployer un modèle sur Android, iOS ou Raspberry Pi : utiliser TensorFlow Lite (TFLite).",
        "2. Pratiquer la quantification consciente de l'entraînement (Quantization-Aware Training - QAT) si la quantification post-entraînement dégrade trop la précision."
      ],
      tag: "TFLITE & COMPRESSION EDGE"
    },
    {
      title: "Distillation de Connaissances (Knowledge Distillation) : Modèle Enseignant-Élève",
      lead: "Comment transférer les capacités de raisonnement d'un modèle lourd et lent de 10 milliards de paramètres vers un petit modèle 20 fois plus rapide pour la production ?",
      heading: "Architecture Teacher-Student pour Inférence Ultra-Rapide",
      body: "La Distillation de Connaissances (Knowledge Distillation) est une technique majeure d'optimisation : 1. Modèle Enseignant (Teacher) : grand réseau complexe pré-entraîné avec une précision remarquable mais trop lourd pour servir en ligne à grande échelle ; 2. Modèle Élève (Student) : architecture légère et rapide conçue pour la production ; 3. Apprentissage par probabilités douces (Soft Labels) : l'élève est entraîné non pas sur les étiquettes dures (0 ou 1), mais sur la distribution de probabilités continue du modèle enseignant (avec une température $T > 1$ pour révéler la 'matière noire' des similitudes secondaires entre classes) ; 4. L'élève conserve 95%+ de la précision de l'enseignant tout en étant 10 à 50 fois plus rapide.",
      m1: { label: "Modèle Enseignant (Teacher)", value: "Haute Précision & Très Lourd", desc: "Sert d'oracle et guide l'apprentissage du petit modèle." },
      m2: { label: "Modèle Élève (Student)", value: "Ultra-Rapide & Faible Latence", desc: "Déployé en production avec un coût d'infrastructure minime." },
      m3: { label: "Soft Targets & Température", value: "Transfert d'Inférence Riche", desc: "Transmet la richesse des corrélations subtiles apprises par l'enseignant." },
      rules: [
        "1. Pour réduire drastiquement la latence d'inférence sans sacrifier la précision : utiliser la Distillation de Connaissances.",
        "2. La température $T$ adoucit les probabilités de sortie pour permettre à l'élève d'apprendre des erreurs proches de l'enseignant."
      ],
      tag: "KNOWLEDGE DISTILLATION"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'VERTEX MODEL MONITORING SANS CODE',
    'SKEW VS DRIFT TEMPOREL DÉFINITIONS',
    'MÉTRIQUES WASSERSTEIN & L-INFINITY',
    'CONTINUOUS TRAINING RE-ENTRAÎNEMENT AUTO',
    'EXPLAINABLE AI SHAPLEY LOCAL ATTRIBUTION',
    'INTEGRATED GRADIENTS & XRAI VISION',
    'FEATURE ATTRIBUTION DRIFT MONITORING',
    'CLOUD MONITORING LATENCE P99 CODES 5XX',
    'TFLITE COMPRESSION QUANTIFICATION EDGE',
    'KNOWLEDGE DISTILLATION TEACHER STUDENT'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-gcpmle-d5-${String(num).padStart(3, '0')}`,
    category: `GCP-PMLE • DOMAINE 5 • ${subCategory}`,
    categoryBadgeColor: '#34a853',
    levelTag: `GCP-PMLE • D5 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 15%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[GCP-PMLE D5-#${num}] ${baseTopic.title} (Question Monitoring & Optimisation #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Compétence d'expert du Domaine 5 (Monitorer et optimiser les solutions en production) de l'examen GCP-PMLE.`,
    solutionHeading: `${baseTopic.heading} - Standard Google Cloud Production Monitoring`,
    solutionBody: `${baseTopic.body} Le Domaine 5 (15% de l'examen) valide l'aptitude à maintenir les modèles en production : détection de dérive (Wasserstein/L-inf), ré-entraînement automatisé (Continuous Training), explicabilité (SHAP, Integrated Gradients, XRAI) et optimisation pour l'edge (TFLite, Distillation).`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé GCP-PMLE D5 : Un modèle de production n'est jamais figé : sa performance doit être surveillée en continu avec Vertex Model Monitoring, et le ré-entraînement doit être automatisé pour contrer l'inévitable dérive du monde réel.`
    ],
    deckName: "Google Cloud GCP-PMLE : Domaine 5 - Monitorer et optimiser les solutions",
    domainId: 'domain5',
    domainName: "5. Monitorer et optimiser les solutions en production",
    certCode: 'GCP-PMLE',
  };
});
