import { Flashcard } from '../../types';

// AWS MLS-C01 - Domaine 4 : Déploiement et opérations de ML (MLOps) (100 Flashcards)
// Poids officiel de l'examen AWS Certified Machine Learning - Specialty : 20%
export const mlsc01Domain4Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `MLS-D4-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Options d'Inférence SageMaker : Temps Réel vs Serverless vs Asynchrone vs Batch Transform",
      lead: "Quelle option d'hébergement SageMaker choisir pour traiter des vidéos de 500 Mo durant 15 minutes avec mise en file d'attente automatique ?",
      heading: "Matrice de Sélection des Endpoints SageMaker",
      body: "SageMaker propose 4 modes d'inférence distincts : 1. Real-time Endpoint : pour des requêtes synchrones interactives à faible latence (< 20 ms) avec trafic continu ; 2. Serverless Inference : pour un trafic imprévisible ou sporadique, mise à l'échelle automatique jusqu'à zéro (scale-to-zero) pour réduire les coûts ; 3. Asynchronous Inference : pour les requêtes lourdes (payload jusqu'à 1 Go, durée de calcul jusqu'à 1 heure), avec gestion automatique d'une file d'attente Amazon SQS et notifications SNS ; 4. Batch Transform : pour l'inférence par lots hors ligne sur de gros fichiers S3 sans endpoint permanent.",
      m1: { label: "Real-Time", value: "Latence < 20ms", desc: "Instances dédiées permanentes avec auto-scaling." },
      m2: { label: "Serverless", value: "Scale-to-Zero", desc: "Facturation à la milliseconde sans instance permanente." },
      m3: { label: "Asynchronous", value: "Payloads 1 Go / 1h", desc: "File SQS intégrée pour traitements longs (vidéos, audio, NLP lourd)." },
      rules: [
        "1. Si la charge utile dépasse 6 Mo ou si l'inférence prend plus de 60 secondes : choisir Asynchronous Inference.",
        "2. Si les prédictions doivent être calculées chaque nuit sur un dataset S3 : choisir Batch Transform."
      ],
      tag: "INFÉRENCE SAGEMAKER"
    },
    {
      title: "Multi-Model Endpoints (MME) vs Multi-Container Endpoints (MCE)",
      lead: "Comment héberger 5 000 modèles personnalisés par client sur un endpoint partagé pour diviser la facture par 10 ?",
      heading: "Consolidation d'Endpoints et Réduction de Coûts",
      body: "Les Multi-Model Endpoints (MME) permettent d'héberger des milliers de modèles sur une flotte commune d'instances. Les artefacts de modèles sont stockés dans un bucket S3 unique et SageMaker charge dynamiquement le modèle requis en mémoire RAM/GPU lors de l'appel d'inférence avec l'en-tête 'TargetModel'. Les Multi-Container Endpoints (MCE) permettent de chaîner jusqu'à 15 conteneurs différents en pipeline (ex: Prétraitement -> Modèle ML -> Post-traitement) sur une même instance.",
      m1: { label: "Multi-Model (MME)", value: "Jusqu'à 10 000 Modèles", desc: "Partage la mémoire d'une flotte d'instances ; charge depuis S3 à la demande." },
      m2: { label: "Multi-Container (MCE)", value: "Pipeline de 15 Conteneurs", desc: "Chaînage série ou direct pour combiner preprocessing et inférence." },
      m3: { label: "Économie de Coût", value: "Division par 10 à 50", desc: "Évite de payer une instance dédiée pour chaque modèle client." },
      rules: [
        "1. Pour héberger des centaines de modèles similaires avec du trafic peu fréquent par modèle : choisir Multi-Model Endpoints (MME).",
        "2. Les conteneurs d'inférence d'un MME doivent tous utiliser le même framework supporté (ex: XGBoost, Scikit-Learn, PyTorch, Triton)."
      ],
      tag: "MME & MCE CONSOLIDATION"
    },
    {
      title: "Tests A/B et Production Variants dans SageMaker",
      lead: "Comment router 10% du trafic réel vers un nouveau modèle candidat sans interrompre les utilisateurs ?",
      heading: "Déploiement Canary et Tests A/B Sans Downtime",
      body: "Dans SageMaker, un Endpoint peut héberger plusieurs 'Production Variants'. Chaque variante pointe vers un modèle différent avec une pondération de trafic (InitialVariantWeight). Pour un test A/B : on assigne un poids de 90 au modèle en production (Modèle A) et un poids de 10 au nouveau modèle (Modèle B). CloudWatch enregistre les métriques de latence et d'invocations séparément pour chaque variante. Dès que le modèle B est validé, on met à jour les poids pour basculer 100% du trafic.",
      m1: { label: "InitialVariantWeight", value: "Pondération 0 à 100", desc: "Définit la proportion de requêtes acheminées vers chaque modèle." },
      m2: { label: "Zéro Downtime", value: "Endpoint URL Unique", desc: "Les clients appellent la même URL d'API sans modifier leur code." },
      m3: { label: "Shadow Testing", value: "Traffic Mirroring", desc: "Duplique le trafic réel vers le modèle candidat sans renvoyer sa réponse aux utilisateurs." },
      rules: [
        "1. Pour comparer deux modèles en conditions réelles de production : configurer deux Production Variants sur un seul endpoint.",
        "2. Utiliser le 'Shadow Testing' pour tester un modèle en silence avec le vrai trafic sans risque métier."
      ],
      tag: "A/B TESTING & DÉPLOIEMENT"
    },
    {
      title: "Amazon SageMaker Model Monitor : Surveillance du Data Drift et Concept Drift",
      lead: "Comment être alerté automatiquement lorsque la distribution des données des utilisateurs en production s'écarte des données d'entraînement ?",
      heading: "Détection Automatique de la Dérive Statistique",
      body: "SageMaker Model Monitor surveille en continu la qualité des modèles déployés : 1. Data Quality Drift (Data Drift) : compare les statistiques des features des requêtes réelles avec la ligne de base (Baseline générée par Deequ) et alerte en cas de déviation statistique ; 2. Model Quality Drift (Concept Drift) : compare les prédictions avec les vrais résultats réels collectés a posteriori (ground truth) ; 3. Model Bias Drift : surveille l'apparition de biais de discrimination ; 4. Feature Attribution Drift : surveille l'évolution de l'importance des variables (SHAP).",
      m1: { label: "Data Drift", value: "Dérive des Entrées", desc: "Les caractéristiques utilisateurs changent (ex: changement démographique)." },
      m2: { label: "Concept Drift", value: "Dérive de la Relation", desc: "La relation entre features et cible change (ex: crise économique soudaine)." },
      m3: { label: "Capture de Données", value: "DataCaptureConfig", desc: "Échantillonne et enregistre les requêtes et réponses d'inférence dans S3." },
      rules: [
        "1. Pour détecter si la performance d'un modèle baisse au fil du temps en production : configurer SageMaker Model Monitor.",
        "2. Model Monitor nécessite d'activer préalablement 'DataCaptureConfig' sur l'endpoint pour enregistrer le trafic dans S3."
      ],
      tag: "MODEL MONITOR & DRIFT"
    },
    {
      title: "Auto-Scaling des Endpoints SageMaker et Politiques de Montée en Charge",
      lead: "Quelle métrique CloudWatch utiliser pour ajuster automatiquement le nombre d'instances d'un endpoint selon l'affluence ?",
      heading: "Dimensionnement Élastique Automatisé",
      body: "SageMaker utilise Application Auto Scaling avec des politiques de suivi de cible (Target Tracking Scaling Policy). La métrique standard recommandée par AWS est `SageMakerVariantInvocationsPerInstance`. Si le nombre d'appels par instance dépasse le seuil défini (ex: 750 requêtes/minute), SageMaker démarre automatiquement de nouvelles instances ; quand le trafic retombe, il réduit le cluster jusqu'au nombre minimum d'instances (min_capacity).",
      m1: { label: "Métrique Recommandée", value: "SageMakerVariantInvocationsPerInstance", desc: "Métrique native CloudWatch reflétant directement la charge de requêtes." },
      m2: { label: "Politique", value: "Target Tracking", desc: "Maintient la métrique proche de la valeur cible en ajoutant/retirant des instances." },
      m3: { label: "Cooldown Periods", value: "Scale-in / Scale-out Cooldown", desc: "Délai de temporisation pour éviter les oscillations rapides (thrashing)." },
      rules: [
        "1. Pour adapter la capacité d'un endpoint à des pics de trafic imprévus : utiliser une Target Tracking Scaling Policy sur InvocationsPerInstance.",
        "2. Configurer toujours au moins 2 instances (min_capacity=2) réparties sur plusieurs zones de disponibilité (Multi-AZ) pour la haute disponibilité."
      ],
      tag: "AUTO-SCALING ENDPOINTS"
    },
    {
      title: "Amazon SageMaker Pipelines : CI/CD et Orchestration MLOps",
      lead: "Comment automatiser de bout en bout l'extraction, l'entraînement, l'évaluation et l'enregistrement de modèles avec validation humaine ?",
      heading: "Orchestration Native de Workflows Machine Learning",
      body: "SageMaker Pipelines est le premier service d'intégration et déploiement continus (CI/CD) conçu spécialement pour le ML. Il définit un graphe orienté acyclique (DAG) composé d'étapes : ProcessingStep (préparation des données), TrainingStep (entraînement), TuningStep, EvaluationStep, ConditionStep (vérifie par exemple si AUC > 0.85) et RegisterModel (ajoute le modèle au SageMaker Model Registry). Les étapes précédentes sont mises en cache pour ne recalculer que ce qui a changé.",
      m1: { label: "Structure", value: "DAG d'Étapes ML", desc: "Enchaînement Processing -> Training -> Evaluation -> Condition -> Register." },
      m2: { label: "Mise en Cache", value: "Step Caching", desc: "Évite de ré-exécuter des étapes coûteuses si le code et les données n'ont pas changé." },
      m3: { label: "ConditionStep", value: "Contrôle Qualité Automatique", desc: "N'enregistre le modèle que s'il dépasse les seuils de précision requis." },
      rules: [
        "1. Pour orchestrer un pipeline MLOps automatisé et répétable sur AWS : utiliser SageMaker Pipelines.",
        "2. Intégrer une 'ConditionStep' pour garantir qu'aucun modèle régressif ne soit promu au registre de modèles."
      ],
      tag: "SAGEMAKER PIPELINES"
    },
    {
      title: "Amazon SageMaker Model Registry : Gestion du Cycle de Vie et Approbations",
      lead: "Comment versionner les modèles validés et déclencher automatiquement leur déploiement après accord d'un lead data scientist ?",
      heading: "Catalogue et Gouvernance des Modèles d'Entreprise",
      body: "SageMaker Model Registry catalogue les modèles entraînés par paquets de versions (Model Package Groups). Chaque version conserve ses métadonnées, artefacts S3, métriques de performance et rapport de biais. Le statut de validation peut être 'PendingManualApproval', 'Approved' ou 'Rejected'. Passer un modèle à 'Approved' émet un événement Amazon EventBridge qui peut déclencher automatiquement un pipeline de déploiement CI/CD (AWS CodePipeline ou GitHub Actions).",
      m1: { label: "Statuts", value: "PendingApproval / Approved / Rejected", desc: "Gouvernance formelle avant promotion en préproduction ou production." },
      m2: { label: "Déclencheur", value: "Amazon EventBridge", desc: "Automatise le déploiement dès la validation humaine sans action manuelle sur l'infra." },
      m3: { label: "Traçabilité", value: "Audit & Lignée Complète", desc: "Lien direct vers les données d'entraînement et les hyperparamètres utilisés." },
      rules: [
        "1. Pour empêcher le déploiement non contrôlé de modèles en production : imposer l'approbation manuelle dans le Model Registry.",
        "2. Le Model Registry centralise les artefacts et rapports d'évaluation pour la conformité et les audits."
      ],
      tag: "MODEL REGISTRY"
    },
    {
      title: "Sécurité Réseau des Endpoints : AWS PrivateLink et VPC sans Accès Internet",
      lead: "Comment appeler un endpoint SageMaker depuis une application d'entreprise sans qu'aucun paquet ne transite par l'Internet public ?",
      heading: "Isolation Réseau Complète avec VPC Endpoints",
      body: "Pour sécuriser l'inférence SageMaker : 1. Créer un VPC Interface Endpoint (alimenté par AWS PrivateLink) pour le service `sagemaker.runtime` dans votre VPC d'application ; 2. Les applications clientes envoient leurs requêtes d'inférence à l'adresse IP privée de l'interface réseau Elastic (ENI) ; 3. Les Security Groups et Network ACLs restreignent les flux aux seuls sous-réseaux applicatifs autorisés ; 4. Configurer des politiques de points de terminaison VPC pour autoriser uniquement certains comptes AWS.",
      m1: { label: "AWS PrivateLink", value: "Interface VPC Endpoint", desc: "Communication 100% interne sur le réseau dorsal AWS sans passerelle Internet (IGW)." },
      m2: { label: "Sécurité Réseau", value: "Security Groups & NACLs", desc: "Filtrage strict des adresses IP sources autorisées à invoquer le modèle." },
      m3: { label: "Endpoint Policy", value: "Contrôle d'Accès IAM", desc: "Restreint les opérations autorisées sur le point de terminaison VPC." },
      rules: [
        "1. Si la question exige une communication strictement privée et sécurisée avec SageMaker : utiliser AWS PrivateLink.",
        "2. Ne jamais exposer directement un endpoint SageMaker sur l'Internet public ; toujours passer par une API Gateway ou PrivateLink."
      ],
      tag: "SÉCURITÉ RÉSEAU PRIVATELINK"
    },
    {
      title: "Amazon SageMaker Inference Recommender : Choix Optimal de l'Instance Matérielle",
      lead: "Comment déterminer scientifiquement le type d'instance EC2 (c5 vs m5 vs g4dn) offrant le meilleur rapport prix/latence pour un modèle ?",
      heading: "Benchmarking Automatisé de Débit et de Coût d'Inférence",
      body: "SageMaker Inference Recommender automatise les tests de charge sur différentes familles d'instances matérielles (CPU vs GPU, optimisées mémoire vs calcul) : 1. Recommandation par défaut : analyse l'architecture du modèle et suggère les instances adaptées ; 2. Benchmark avancé : simule une montée en charge réelle avec votre payload pour mesurer la latence P95, le débit maximal de transactions par seconde (TPS) et le coût par million d'inférences, vous permettant de choisir l'instance optimale selon vos SLAs.",
      m1: { label: "Tests de Charge", value: "Simulation Multi-Instances", desc: "Compare automatiquement les performances de plusieurs familles EC2." },
      m2: { label: "Métriques Produites", value: "TPS Max & Latence P95", desc: "Fournit le coût exact par inférence pour respecter les budgets." },
      m3: { label: "Gain Économique", value: "Jusqu'à 50% d'Économie", desc: "Évite le surdimensionnement inutile avec des GPU coûteux." },
      rules: [
        "1. Pour choisir le type d'instance d'inférence le plus rentable avant la mise en production : utiliser Inference Recommender.",
        "2. Inference Recommender aide à décider s'il faut compiler le modèle avec SageMaker Neo."
      ],
      tag: "INFERENCE RECOMMENDER"
    },
    {
      title: "Optimisation Edge et Compilation avec Amazon SageMaker Neo",
      lead: "Comment exécuter un modèle TensorFlow ou PyTorch sur un appareil IoT embarqué (Raspberry Pi, caméra Nvidia Jetson) avec une latence divisée par 2 ?",
      heading: "Compilation Matérielle Spécifique pour l'Inférence Edge",
      body: "SageMaker Neo est un compilateur de modèles de Machine Learning qui convertit les modèles entraînés (TensorFlow, PyTorch, MXNet, XGBoost) en un binaire hautement optimisé pour une plateforme matérielle cible (ARM, Intel, Nvidia, Qualcomm). Il réduit l'empreinte mémoire jusqu'à 10x et accélère l'inférence jusqu'à 2x sans aucune perte de précision. Le runtime Neo léger (TFLite / DLR) s'exécute directement sur l'appareil connecté ou dans AWS IoT Greengrass.",
      m1: { label: "Compilateur Neo", value: "Binaire Matériel Dédié", desc: "Optimise les graphes de calcul pour CPU/GPU/NPU cibles." },
      m2: { label: "Empreinte Mémoire", value: "Réduction jusqu'à 10x", desc: "Permet d'exécuter des modèles sophistiqués sur des processeurs contraints." },
      m3: { label: "IoT Greengrass", value: "Déploiement Edge Flotte", desc: "Distribution over-the-air des modèles compilés vers des milliers d'appareils." },
      rules: [
        "1. Dès qu'une question parle de déployer un modèle sur des appareils embarqués, caméras ou IoT : choisir SageMaker Neo.",
        "2. Neo sépare la phase d'entraînement (dans le cloud) de la phase d'exécution optimisée (au plus près des capteurs)."
      ],
      tag: "SAGEMAKER NEO & EDGE"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'ENDPOINTS REAL-TIME VS SERVERLESS',
    'MULTI-MODEL ENDPOINTS (MME)',
    'TESTS A/B & SHADOW TESTING',
    'MODEL MONITOR DATA/CONCEPT DRIFT',
    'AUTO-SCALING & INVOCATION TARGET',
    'SAGEMAKER PIPELINES MLOPS',
    'MODEL REGISTRY & APPROBATIONS',
    'SÉCURITÉ PRIVATELINK & VPC',
    'INFERENCE RECOMMENDER BENCHMARK',
    'SAGEMAKER NEO & EMBARQUÉ EDGE'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-mlsc01-d4-${String(num).padStart(3, '0')}`,
    category: `MLS-C01 • DOMAINE 4 • ${subCategory}`,
    categoryBadgeColor: '#e11d48',
    levelTag: `MLS-C01 • D4 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 20%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[MLS-C01 D4-#${num}] ${baseTopic.title} (Cas Pratique MLOps #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Objectif clé du Domaine 4 (Déploiement et Opérations MLOps) de l'examen AWS MLS-C01.`,
    solutionHeading: `${baseTopic.heading} - Standard AWS MLOps & Déploiement`,
    solutionBody: `${baseTopic.body} Le Domaine 4 (20% de l'examen) teste les compétences indispensables d'ingénierie ML en production : choix du mode d'inférence, surveillance de drift, pipelines CI/CD et isolation réseau.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé MLS-C01 D4 : En cas de dérive de modèle détectée par Model Monitor (drift), déclencher automatiquement un ré-entraînement via Amazon EventBridge et SageMaker Pipelines.`
    ],
    deckName: "AWS MLS-C01 : Domaine 4 - Déploiement et opérations de ML",
    domainId: 'domain4',
    domainName: "4. Déploiement et opérations de ML (MLOps)",
    certCode: 'MLS-C01',
  };
});
