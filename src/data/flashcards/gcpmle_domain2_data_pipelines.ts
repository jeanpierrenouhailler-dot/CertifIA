import { Flashcard } from '../../types';

// Google Cloud GCP-PMLE - Domaine 2 : Préparer et concevoir les pipelines de données (100 Flashcards)
// Poids officiel de l'examen Professional Machine Learning Engineer : 20%
export const gcpmleDomain2Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `GCP-D2-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Élimination du Training-Serving Skew avec TensorFlow Transform (tf.Transform)",
      lead: "Comment s'assurer mathématiquement qu'une normalisation (ex: moyenne et écart-type) calculée à l'entraînement soit appliquée de façon strictement identique lors de l'inférence en production ?",
      heading: "Prévention du Décalage Algorithmique entre Entraînement et Inférence",
      body: "Le Training-Serving Skew survient quand le code de prétraitement des données (ex: en Python/Pandas) diffère subtilement du code exécuté lors de l'inférence en production (ex: en C++ ou Java), provoquant des erreurs silencieuses graves. Solution standard Google Cloud : TensorFlow Transform (`tf.Transform` / TFT). TFT s'exécute dans un pipeline Cloud Dataflow pour calculer les métadonnées globales (moyennes, vocabulaires, quantiles) et exporte un sous-graphe TensorFlow de prétraitement qui est soudé directement dans le SavedModel final : le modèle prend les données brutes en entrée et exécute lui-même les transformations exactes.",
      m1: { label: "Cause Skew", value: "Code de Prep Non Identique", desc: "Deux implémentations distinctes du preprocessing entre train et serve." },
      m2: { label: "Solution TFT", value: "Sous-Graphe TF Exporté", desc: "Le calcul de normalisation est embarqué dans le modèle déployé." },
      m3: { label: "Exécution Dataflow", value: "Scaling Massif Beam", desc: "Calcul distribué des statistiques sur des téraoctets de données d'entraînement." },
      rules: [
        "1. Pour éliminer de manière absolue le Training-Serving Skew dans l'écosystème TensorFlow/GCP : utiliser tf.Transform.",
        "2. Grâce à tf.Transform, le client d'inférence envoie les données brutes (raw data) sans avoir à reproduire les règles de calcul."
      ],
      tag: "TRAINING-SERVING SKEW & TFT"
    },
    {
      title: "Vertex AI Feature Store : Registre Centralisé et Inférence à Faible Latence",
      lead: "Comment éviter que 5 équipes de Data Scientists ne recalculent en double les mêmes caractéristiques clients tout en assurant une inférence en ligne sous les 10 ms ?",
      heading: "Gestion Unifiée des Caractéristiques en Ligne et Hors Ligne",
      body: "Vertex AI Feature Store agit comme le référentiel centralisé de l'entreprise pour stocker, partager et versionner les caractéristiques (features) : 1. Online Serving (Faible Latence) : les valeurs les plus récentes sont synchronisées dans une base clé-valeur distribuée ultra-rapide (Google Cloud Bigtable) garantissant des temps de lecture < 10 ms pour les prédictions en ligne ; 2. Offline Serving (Batch & Training) : permet d'extraire des snapshots de caractéristiques avec cohérence temporelle (Point-in-Time Join) vers BigQuery ou Cloud Storage pour entraîner les modèles sans fuite de données futures.",
      m1: { label: "Online Serving", value: "Bigtable < 10 ms", desc: "Sert les caractéristiques en temps réel pour l'inférence immédiate d'un endpoint." },
      m2: { label: "Offline Serving", value: "BigQuery / GCS Batch", desc: "Génération de jeux d'entraînement massifs pour l'apprentissage distribué." },
      m3: { label: "Point-in-Time Join", value: "Anti-Data Leakage", desc: "Extrait la valeur exacte de la caractéristique à l'instant T de chaque transaction passée." },
      rules: [
        "1. Pour servir des caractéristiques en production avec une latence inférieure à 10 millisecondes : Vertex AI Feature Store Online Serving.",
        "2. Le Point-in-Time lookup (recherche temporelle) empêche de regarder dans le futur lors de la constitution du jeu d'entraînement."
      ],
      tag: "VERTEX AI FEATURE STORE"
    },
    {
      title: "Validation des Données et Détection d'Anomalies avec TensorFlow Data Validation (TFDV)",
      lead: "Comment détecter automatiquement qu'un pipeline d'ingestion reçoit une nouvelle modalité catégorielle non répertoriée ou 15% de valeurs nulles anormales ?",
      heading: "Inspection Statistique et Validation de Schéma de Données",
      body: "TensorFlow Data Validation (TFDV) est le composant de TFX dédié à la qualité des données : 1. Calcul de statistiques descriptives (`tfdv.generate_statistics_from_dataframe`) et visualisation interactive Facets ; 2. Inférence de schéma (`tfdv.infer_schema`) définissant les types attendus, les plages de valeurs et les présences obligatoires ; 3. Détection d'anomalies (`tfdv.validate_statistics`) : compare les nouvelles données au schéma de référence et lève une alerte en cas de déviation (valeurs hors borne, colonnes manquantes, drift catégoriel).",
      m1: { label: "Schema Validation", value: "Contrat de Données Strict", desc: "Définit les valeurs autorisées, la cardinalité et les types de chaque champ." },
      m2: { label: "Anomalies Detection", value: "Alerte Automatisée", desc: "Identifie les zéros inattendus, strings dans des champs numériques ou drifts." },
      m3: { label: "TFX Pipeline Component", value: "ExampleValidator", desc: "Composant TFX standard bloquant le pipeline avant que l'entraînement ne démarre." },
      rules: [
        "1. Pour valider automatiquement la conformité d'un nouveau dataset par rapport à un schéma de référence : TFDV (TensorFlow Data Validation).",
        "2. TFDV s'exécute sur Cloud Dataflow pour analyser des milliards de lignes en parallèle sans saturer la mémoire du nœud maître."
      ],
      tag: "TFDV VALIDATION DONNÉES"
    },
    {
      title: "Pipeline de Streaming Haute Cadence : Cloud Pub/Sub + Cloud Dataflow (Apache Beam)",
      lead: "Comment ingérer et transformer en temps réel 100 000 événements IoT par seconde pour alimenter un modèle de détection de panne immédiate ?",
      heading: "Architecture d'Ingestion Réactive avec Fenêtrage Temporel",
      body: "Cette architecture découplée associe deux services managés Google Cloud : 1. Cloud Pub/Sub : système de messagerie 'publish-subscribe' ingérant des millions d'événements par seconde avec latence milliseconde, assurant un tampon élastique sans perte de messages ; 2. Cloud Dataflow (moteur managé pour Apache Beam) : consomme les flux Pub/Sub en streaming, applique le fenêtrage temporel (Tumbling windows fixes, Sliding fenêtres glissantes, Session windows d'inactivité) et gère les arrivées de données tardives grâce aux Watermarks (filigrane temporel) et Triggers d'accumulation.",
      m1: { label: "Cloud Pub/Sub", value: "Tampon Élastique Ingestion", desc: "Absorption des pics de charge massifs sans goulot d'étranglement." },
      m2: { label: "Cloud Dataflow", value: "Streaming Pipeline Serverless", desc: "Autoscaling automatique des nœuds de calcul selon le backlog de messages." },
      m3: { label: "Watermark (Beam)", value: "Gestion des Données Tardives", desc: "Définit l'heure d'évaluation au-delà de laquelle les événements en retard sont ignorés." },
      rules: [
        "1. Pour ingérer des flux de streaming avec fenêtres d'agrégation temporelles sur GCP : le duo officiel est Pub/Sub + Dataflow.",
        "2. Dataflow utilise le même code Apache Beam unifié pour le traitement Batch et le traitement Streaming."
      ],
      tag: "STREAMING PUB/SUB DATAFLOW"
    },
    {
      title: "Optimisation du Format de Données : TFRecord & Protobuf pour Saturation GPU/TPU",
      lead: "Pourquoi l'entraînement d'un réseau de neurones profond est-il souvent ralenti par les entrées/sorties disque et comment le format TFRecord résout-il ce goulot ?",
      heading: "Format Binaire Séquentiel Haut Débit pour TensorFlow",
      body: "Lire des millions de petits fichiers individuels (images JPEG, fichiers CSV) depuis Cloud Storage sature le réseau et sous-utilise les GPU/TPU (le GPU attend les données : goulot d'étranglement I/O). Google préconise le format TFRecord : 1. Structure binaire séquentielle stockant des messages `tf.train.Example` (protocol buffers sérialisés) ; 2. Les fichiers sont regroupés (Sharded) en blocs de 100 Mo à 200 Mo ; 3. `tf.data.TFRecordDataset` combiné avec `prefetch(tf.data.AUTOTUNE)` permet de charger et décompresser les données en mémoire en tâche de fond pendant que le GPU calcule l'époque en cours.",
      m1: { label: "Format TFRecord", value: "Protobuf Binaire Continu", desc: "Lecture séquentielle rapide sans surcharge d'ouverture de millions de fichiers." },
      m2: { label: "Taille de Shard Idéale", value: "100 Mo à 200 Mo", desc: "Taille optimale pour le débit de streaming depuis Google Cloud Storage." },
      m3: { label: "tf.data.AUTOTUNE", value: "Pipeline I/O Parallèle", desc: "Précharge le batch suivant dans la VRAM pendant le calcul du gradient actuel." },
      rules: [
        "1. Pour saturer la bande passante des TPU Pods ou clusters multi-GPU : convertir impérativement les données au format TFRecord.",
        "2. Toujours chaîner `.interleave()`, `.batch()` et `.prefetch(tf.data.AUTOTUNE)` dans l'API tf.data pour éliminer l'attente I/O."
      ],
      tag: "FORMAT TFRECORD & TF.DATA"
    },
    {
      title: "Stratégies de Partitionnement et Découpage des Données (Prévention de Data Leakage)",
      lead: "Comment partitionner un jeu de données de prévision des ventes ou de détection de churn pour éviter absolument toute fuite temporelle ?",
      heading: "Découpage Chronologique vs Stratifié vs Groupé (GroupKFold)",
      body: "Le Data Leakage (fuite d'information) fausse complètement les évaluations : 1. Données temporelles (Time Series) : NE JAMAIS utiliser un découpage aléatoire (Random Split) car le modèle utiliserait des informations du futur pour prédire le passé ; utiliser un Time-based Split (Train = Janvier à Septembre, Validation = Octobre, Test = Novembre) ; 2. Données multi-enregistrements par utilisateur : utiliser un GroupKFold ou Group Split sur l'ID client pour s'assurer que toutes les transactions d'un même client soient exclusivement dans le Train OU dans le Test (évite que le modèle ne reconnaisse le profil) ; 3. Classes rares : découpage stratifié (Stratified Split) pour maintenir la même proportion de classe positive.",
      m1: { label: "Séries Temporelles", value: "Time-based Split Strict", desc: "Les données de validation et de test doivent être chronologiquement postérieures." },
      m2: { label: "GroupKFold", value: "Isolation des Entités/Utilisateurs", desc: "Empêche qu'une entité apparaisse simultanément dans le train et le test." },
      m3: { label: "Stratified Split", value: "Préservation des Ratios de Classe", desc: "Garantit que les fraudes à 0.1% soient réparties équitablement." },
      rules: [
        "1. Règle d'examen : Sur des séries temporelles, tout découpage aléatoire (random shuffle) est une erreur grave de conception (Data Leakage).",
        "2. Effectuer impérativement le feature scaling (fit) UNIQUEMENT sur le jeu d'entraînement, puis appliquer (transform) sur test/validation."
      ],
      tag: "SPLIT DONNÉES & DATA LEAKAGE"
    },
    {
      title: "Nettoyage et Caviardage des Données Sensibles avec Sensitive Data Protection (Cloud DLP)",
      lead: "Comment anonymiser automatiquement des téraoctets de données d'avis clients contenant des numéros de carte de crédit avant d'entraîner un modèle de NLP ?",
      heading: "Détection et Masquage Automatisé des PII à Grande Échelle",
      body: "Sensitive Data Protection (anciennement Cloud Data Loss Prevention - Cloud DLP) permet de sécuriser les flux de données ML : 1. Détection automatique de plus de 150 types d'informations personnelles identifiables (PII : numéros de sécurité sociale, cartes bancaires, téléphones, adresses email, noms) ; 2. Techniques d'anonymisation configurables : masquage partiel (ex: `****-****-****-1234`), tokenisation déterministe avec clé cryptographique (pseudonymisation réversible), chiffrement préservant le format (FPE) ou caviardage complet ; 3. Intégration native avec BigQuery, Cloud Storage et les pipelines Cloud Dataflow.",
      m1: { label: "Inspection DLP", value: "+150 InfoTypes Prédéfinis", desc: "Reconnaît les formats réglementés mondiaux (RGPD, HIPAA, PCI-DSS)." },
      m2: { label: "Crypto Tokenization", value: "Pseudonymisation Cohérente", desc: "Permet de joindre des tables sans jamais dévoiler la véritable identité du client." },
      m3: { label: "Dataflow DLP Transform", value: "Nettoyage en Vol du Stream", desc: "Désinfecte les flux de données avant leur écriture dans le lac de données." },
      rules: [
        "1. Pour inspecter et caviarder les données confidentielles (PII) avant l'entraînement d'un modèle : utiliser Cloud DLP.",
        "2. Pour préserver les capacités de jointure entre datasets anonymisés : utiliser la tokenisation avec chiffrement préservant le format."
      ],
      tag: "CLOUD DLP & ANONYMISATION"
    },
    {
      title: "Optimisation SQL et Stockage dans BigQuery : Partitionnement et Clustering",
      lead: "Comment réduire de 90% les coûts de requête et le temps de scan lors de l'extraction de données d'entraînement quotidiennes dans une table BigQuery de 50 To ?",
      heading: "Organisation Physique des Données pour Requêtes ML Performantes",
      body: "Pour optimiser l'extraction des données ML dans BigQuery : 1. Partitionnement par date (`PARTITION BY DATE(timestamp)`) : segmente physiquement les données par jour ou mois ; une requête filtrant sur `WHERE date BETWEEN '2024-01-01' AND '2024-01-31'` ne lira QUE la partition de janvier, ignorant 95% des données de la table ; 2. Clustering par colonnes fréquemment filtrées (ex: `CLUSTER BY customer_country, product_category`) : trie les données au sein de chaque partition pour élaguer drastiquement les blocs de stockage non pertinents lors des jointures et filtres.",
      m1: { label: "Partitionnement", value: "Élagage de Partitions (Pruning)", desc: "Limite le scan aux tranches temporelles cibles, divisant le coût par dix." },
      m2: { label: "Clustering", value: "Colocalisation des Données Triées", desc: "Idéal pour les colonnes à haute cardinalité fréquemment utilisées en clause WHERE." },
      m3: { label: "BigQuery Storage API", value: "Lecture Parallèle Haute Vitesse", desc: "Téléchargement direct en mémoire via gRPC/Arrow pour les frameworks ML." },
      rules: [
        "1. Toujours combiner partitionnement (sur la date) et clustering (sur les IDs ou catégories) sur les tables volumineuses BigQuery.",
        "2. Utiliser la BigQuery Storage Read API (Arrow) plutôt que l'API REST standard pour alimenter TensorFlow ou PyTorch."
      ],
      tag: "BIGQUERY PARTITION & CLUSTER"
    },
    {
      title: "Annotation de Données avec Vertex AI Data Labeling Service",
      lead: "Comment organiser l'annotation de 50 000 images médicales avec des boîtes englobantes (bounding boxes) tout en garantissant un contrôle qualité strict ?",
      heading: "Campagnes d'Étiquetage Managées par Spécialistes Qualifiés",
      body: "Vertex AI Data Labeling Service permet de déléguer l'annotation de données brutes à des équipes humaines spécialisées : 1. Tâches supportées : classification d'images, détection d'objets (bounding boxes, polygones), segmentation sémantique, classification de textes, reconnaissance d'entités (NER), annotation vidéo ; 2. Spécification des consignes (Labeling Instructions PDF) avec exemples positifs et contre-exemples ; 3. Contrôle qualité par consensus : plusieurs annotateurs indépendants étiquettent le même échantillon et l'accord inter-annotateurs est mesuré pour valider la fiabilité.",
      m1: { label: "Types de Données", value: "Images, Textes, Vidéos", desc: "Supporte les tâches de vision fine et d'extraction linguistique complexes." },
      m2: { label: "Instructions Claires", value: "Guide d'Annotation Standardisé", desc: "Définit les règles d'inclusion/exclusion pour éliminer les ambiguïtés humaines." },
      m3: { label: "Consensus Scoring", value: "Validation Croisée d'Experts", desc: "Garantit un taux d'exactitude élevé sur les labels servant de vérité terrain." },
      rules: [
        "1. Pour créer un dataset d'entraînement certifié sans mobiliser ses propres ingénieurs : Vertex AI Data Labeling Service.",
        "2. La qualité du modèle dépend d'abord de la clarté du guide d'instructions fourni aux annotateurs humains."
      ],
      tag: "DATA LABELING SERVICE"
    },
    {
      title: "Gestion des Données Déséquilibrées : Sous-Échantillonnage, Sur-Échantillonnage & Poids de Classes",
      lead: "Comment entraîner un modèle robuste de détection de cyberattaque lorsque les attaques représentent seulement 0.05% du trafic réseau ?",
      heading: "Stratégies d'Équilibrage et Fonction de Perte Pondérée",
      body: "Sur des données hautement asymétriques (fraude, pannes, attaques) : 1. Ne jamais modifier les données de test (elles doivent refléter la réalité de production) ; 2. Ré-échantillonnage sur le Train Set : sous-échantillonnage aléatoire (Random Undersampling) de la classe majoritaire pour accélérer le calcul, ou sur-échantillonnage (SMOTE / Synthetic Minority Over-sampling Technique) créant des voisins synthétiques pour la classe minoritaire ; 3. Approche algorithmique recommandée : appliquer des poids de classe (Class Weights / `pos_weight`) dans la fonction de perte pour pénaliser lourdement les erreurs commises sur la classe minoritaire sans dupliquer artificiellement les données.",
      m1: { label: "Class Weights", value: "Pénalisation dans la Loss", desc: "Solution la plus propre mathématiquement ; n'augmente pas la taille du dataset." },
      m2: { label: "SMOTE", value: "Interpolation Synthétique", desc: "Génère des points minoritaires par interpolation dans l'espace des caractéristiques." },
      m3: { label: "Métrique Obligatoire", value: "PR-AUC / Recall au lieu d'Accuracy", desc: "L'Exactitude (Accuracy) est inutile sur des données à 99.95% négatives." },
      rules: [
        "1. Toujours tester d'abord la pondération des classes (`class_weight='balanced'`) avant de manipuler physiquement les échantillons.",
        "2. Le ré-échantillonnage (SMOTE ou undersampling) ne doit JAMAIS être appliqué sur le jeu de validation ou de test."
      ],
      tag: "CLASSES DÉSÉQUILIBRÉES & SMOTE"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'TRAINING-SERVING SKEW & TF TRANSFORM',
    'VERTEX FEATURE STORE BIGTABLE ONLINE',
    'TFDV SCHEMA VALIDATION & ANOMALIES',
    'STREAMING PUB/SUB DATAFLOW WATERMARKS',
    'TFRECORD & TF.DATA IO OPTIMIZATION',
    'DATA SPLIT & LEAKAGE GROUPKFOLD',
    'CLOUD DLP PRIVACY & PII TOKENIZATION',
    'BIGQUERY PARTITIONING & CLUSTERING',
    'DATA LABELING SERVICE CONSENSUS',
    'CLASSES DÉSÉQUILIBRÉES WEIGHTS SMOTE'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-gcpmle-d2-${String(num).padStart(3, '0')}`,
    category: `GCP-PMLE • DOMAINE 2 • ${subCategory}`,
    categoryBadgeColor: '#0f9d58',
    levelTag: `GCP-PMLE • D2 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 20%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[GCP-PMLE D2-#${num}] ${baseTopic.title} (Question Data Pipeline #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Compétence centrale du Domaine 2 (Préparer et concevoir les pipelines de données) de l'examen GCP-PMLE.`,
    solutionHeading: `${baseTopic.heading} - Standard Google Cloud Data Engineering for ML`,
    solutionBody: `${baseTopic.body} Le Domaine 2 (20% de l'examen) évalue la maîtrise des pipelines d'ingestion (Pub/Sub, Dataflow), du stockage optimisé (TFRecord, BigQuery partitionné), du Feature Store (< 10 ms), de la validation TFDV et de la prévention du Training-Serving Skew avec tf.Transform.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé GCP-PMLE D2 : Dans tout pipeline ML de production sur GCP, le code de transformation doit être encapsulé pour garantir que les mêmes règles s'appliquent en entraînement et en inférence sans intervention humaine.`
    ],
    deckName: "Google Cloud GCP-PMLE : Domaine 2 - Pipelines de données et Feature Store",
    domainId: 'domain2',
    domainName: "2. Préparer et concevoir les pipelines de données",
    certCode: 'GCP-PMLE',
  };
});
