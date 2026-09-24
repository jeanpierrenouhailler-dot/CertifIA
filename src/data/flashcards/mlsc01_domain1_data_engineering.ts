import { Flashcard } from '../../types';

// AWS MLS-C01 - Domaine 1 : Ingénierie des données (Data Engineering) (100 Flashcards)
// Poids officiel de l'examen AWS Certified Machine Learning - Specialty : 20%
export const mlsc01Domain1Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `MLS-D1-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Amazon S3 : Classes de Stockage et Formats Optimisés pour le ML",
      lead: "Quel format de fichier et quelle classe de stockage S3 minimisent les coûts de requête et maximisent le débit d'entraînement ?",
      heading: "Optimisation du Stockage S3 pour SageMaker",
      body: "Pour l'entraînement dans SageMaker, les formats colonnaires compressés (Apache Parquet et Apache ORC) réduisent le volume de données transféré et accélèrent les lectures I/O. Les classes S3 Standard offrent la plus faible latence pour les données d'entraînement actives. Pour les jeux de données massifs archivés, S3 Glacier Instant Retrieval permet un accès en millisecondes pour un coût de stockage minime.",
      m1: { label: "Formats Recommandés", value: "Parquet & RecordIO-Protobuf", desc: "Lecture colonnaire et streaming binaire optimisé pour SageMaker." },
      m2: { label: "Compression", value: "Snappy / GZIP", desc: "Compromis idéal entre vitesse de décompression CPU et gain de stockage." },
      m3: { label: "Sécurité", value: "SSE-KMS & Bucket Policy", desc: "Chiffrement au repos avec clé client gérée et contrôle d'accès strict." },
      rules: [
        "1. Toujours privilégier Parquet ou RecordIO plutôt que du CSV non compressé pour les volumétries supérieures à 10 Go.",
        "2. Partitionner les clés S3 par date (year=YYYY/month=MM/day=DD) pour optimiser les requêtes SQL avec Athena."
      ],
      tag: "S3 & STOCKAGE"
    },
    {
      title: "Kinesis Data Streams vs Kinesis Data Firehose pour l'Ingestion ML",
      lead: "Quand faut-il choisir Kinesis Data Streams plutôt que Kinesis Data Firehose pour alimenter un modèle de détection d'anomalies en temps réel ?",
      heading: "Ingestion Temps Réel vs Ingestion Gérée vers Stockage",
      body: "Kinesis Data Streams (KDS) permet un traitement en continu avec une latence inférieure à 200 ms (jusqu'à 70 ms avec Enhanced Fan-Out) et supporte plusieurs consommateurs concurrents (Lambda, KCL, Apache Flink). Kinesis Data Firehose est un service entièrement géré qui charge automatiquement les flux dans S3, Redshift ou OpenSearch, avec une latence de buffering minimale de 60 secondes (ou 1 Mo de buffer).",
      m1: { label: "Kinesis Data Streams", value: "Latence < 200ms", desc: "Requis pour l'inférence temps réel et la détection d'intrusion immédiate." },
      m2: { label: "Kinesis Firehose", value: "Buffer 60s / 1 Mo", desc: "Idéal pour déverser automatiquement des logs bruts dans S3 sans coder." },
      m3: { label: "Transformation Inline", value: "AWS Lambda", desc: "Firehose peut exécuter une fonction Lambda pour nettoyer les données à la volée." },
      rules: [
        "1. Si la question exige une réaction en moins de 5 secondes, Kinesis Firehose est éliminé d'office (buffer minimum de 60s).",
        "2. Utiliser Kinesis Data Streams avec Kinesis Client Library (KCL) pour un traitement distribué avec checkpoints."
      ],
      tag: "KINESIS & STREAMING"
    },
    {
      title: "AWS Glue ETL, DynamicFrames et AWS Glue Data Catalog",
      lead: "Comment automatiser l'inférence de schéma et le nettoyage de téraoctets de données non structurées sur S3 ?",
      heading: "ETL Serverless et Catalogue de Métadonnées",
      body: "AWS Glue est un service d'ETL serverless basé sur Apache Spark. Les Glue Crawlers analysent les données stockées dans S3 et peuplent automatiquement le Glue Data Catalog avec les schémas et tables déduits. Les scripts Glue utilisent des 'DynamicFrames', une extension des DataFrames Spark gérant nativement les schémas changeants et les types imbriqués sans perte de données.",
      m1: { label: "Moteur de Calcul", value: "Apache Spark Serverless", desc: "Mise à l'échelle automatique des DPU (Data Processing Units)." },
      m2: { label: "DynamicFrame", value: "Schémas Évolutifs", desc: "Méthode 'ResolveChoice' pour traiter les colonnes aux types mixtes." },
      m3: { label: "Intégration", value: "Athena & SageMaker", desc: "Le catalogue Glue est directement requêtable par Athena et SageMaker." },
      rules: [
        "1. Pour cataloguer automatiquement des fichiers JSON/CSV périodiques sur S3, planifier un Crawler AWS Glue.",
        "2. Utiliser Glue Job Bookmarks pour ne traiter que les nouvelles données arrivées depuis le dernier job ETL."
      ],
      tag: "GLUE & DATA CATALOG"
    },
    {
      title: "Amazon Athena : Requêtage SQL Serverless et Optimisation de Coût",
      lead: "Comment requêter des pétaoctets de logs sur S3 au coût le plus bas sans gérer de base de données ?",
      heading: "Analyse SQL Directe sur Data Lake S3",
      body: "Amazon Athena est un service de requêtage interactif serverless basé sur Presto. On ne paie que pour le volume de données analysé par requête (environ 5 $ par To scanné). Pour réduire drastiquement les coûts et la latence : 1. Convertir les données en format colonnaire Parquet ou ORC (réduction de 30x à 90x du volume scanné) ; 2. Partitionner les tables (ex: par date ou pays) ; 3. Utiliser des requêtes avec clauses WHERE ciblant les partitions.",
      m1: { label: "Facturation", value: "5 $ / To analysé", desc: "Réduit drastiquement grâce au format colonnaire Parquet." },
      m2: { label: "Partitioning", value: "Élagage de Fichiers", desc: "Athena ne lit que les sous-dossiers S3 pertinents." },
      m3: { label: "CTAS (Create Table As)", value: "Transformation SQL", desc: "Permet de convertir des tables CSV en Parquet directement dans S3." },
      rules: [
        "1. Toujours recommander Parquet + Partitioning pour minimiser le coût d'utilisation d'Athena dans l'examen MLS-C01.",
        "2. Éviter d'utiliser 'SELECT *' sur des tables non partitionnées volumineuses."
      ],
      tag: "ATHENA & SQL DATA LAKE"
    },
    {
      title: "Modes d'Ingestion SageMaker : File Mode vs FastFile Mode vs Pipe Mode",
      lead: "Quel mode de transfert de données S3 vers l'instance d'entraînement SageMaker offre le temps de démarrage le plus rapide ?",
      heading: "Transfert de Données vers les Conteneurs SageMaker",
      body: "En 'File Mode' (par défaut), toutes les données sont téléchargées depuis S3 sur le disque EBS de l'instance d'entraînement avant le début de l'apprentissage (temps de démarrage long pour de gros volumes). En 'Pipe Mode', les données sont diffusées en flux continu (streamed) directement en mémoire depuis S3 via des sockets Unix au format RecordIO (gain majeur de temps et d'espace disque). 'FastFile Mode' combine la simplicité de File Mode avec le streaming direct sans attendre le téléchargement complet.",
      m1: { label: "File Mode", value: "Téléchargement Complet Initial", desc: "Nécessite un volume EBS plus grand que la taille du dataset." },
      m2: { label: "Pipe Mode", value: "Streaming Continu Linux FIFO", desc: "Zéro attente de pré-téléchargement, débit maximal en RecordIO." },
      m3: { label: "FastFile Mode", value: "Streaming POSIX Transparent", desc: "Accès immédiat comme un système de fichiers local monté." },
      rules: [
        "1. Pour des datasets géants (> 100 Go) où le temps de démarrage est critique, préconiser Pipe Mode ou FastFile Mode.",
        "2. Pipe Mode exige un format de données supporté (RecordIO ou textline)."
      ],
      tag: "SAGEMAKER DATA MODES"
    },
    {
      title: "Amazon EMR : Traitement Distribué avec Spark et Hadoop",
      lead: "Quand faut-il utiliser Amazon EMR plutôt qu'AWS Glue pour la préparation des données ML ?",
      heading: "Clusters Distribués Haute Performance Personnalisables",
      body: "Amazon EMR (Elastic MapReduce) est recommandé lorsqu'on a besoin d'un contrôle fin sur l'infrastructure matérielle (GPU, mémoire personnalisée), d'outils de l'écosystème Hadoop non gérés par Glue (HBase, Presto, Flink, Spark Streaming) ou pour migrer des pipelines Big Data existants sur site. On peut combiner des instances EMR Spot avec des instances On-Demand pour réduire les coûts jusqu'à 80%.",
      m1: { label: "Instances Spot", value: "Économie jusqu'à 80%", desc: "Idéal pour les Task Nodes EMR qui ne stockent pas de données HDFS." },
      m2: { label: "EMRFS", value: "S3 comme HDFS", desc: "Sépare le calcul du stockage pour éteindre le cluster sans perdre les données." },
      m3: { label: "Glue vs EMR", value: "Serverless vs Contrôle Total", desc: "Glue pour le serverless managé ; EMR pour le tuning avancé Spark." },
      rules: [
        "1. Pour les nœuds de tâches (Task nodes) sans stockage HDFS persistant, utiliser des instances Spot sur EMR.",
        "2. Toujours stocker les données persistantes sur S3 (via EMRFS) plutôt que sur le disque local HDFS."
      ],
      tag: "EMR & BIG DATA"
    },
    {
      title: "Amazon Kinesis Video Streams pour les Modèles de Vision en Direct",
      lead: "Comment ingérer et traiter de manière sécurisée des flux vidéo RTSP provenant de milliers de caméras pour du ML ?",
      heading: "Ingestion et Stockage Sécurisé de Flux Vidéo",
      body: "Amazon Kinesis Video Streams (KVS) capture, traite et stocke des flux vidéo et audio provenant de caméras de sécurité, drones ou smartphones. Il intègre le chiffrement TLS et KMS, permet la lecture en temps réel ou à la demande, et s'intègre nativement avec Amazon Rekognition Video pour la détection de visages et d'objets en direct, ainsi qu'avec des conteneurs SageMaker personnalisés.",
      m1: { label: "Protocole", value: "RTSP / WebRTC", desc: "Support de l'ingestion temps réel avec standard WebRTC bidirectionnel." },
      m2: { label: "Intégration ML", value: "Amazon Rekognition Video", desc: "Analyse faciale et détection d'objets sans pipeline complexe." },
      m3: { label: "Conservation", value: "Rétention Configurable", desc: "Stockage durable indexé par horodatage pour relecture d'inférence." },
      rules: [
        "1. Pour l'ingestion vidéo continue à grande échelle, la réponse AWS ML est Kinesis Video Streams.",
        "2. Kinesis Data Streams ne gère que des données binaires/texte génériques, pas les codecs et conteneurs vidéo spécialisés."
      ],
      tag: "KINESIS VIDEO STREAMS"
    },
    {
      title: "Amazon SageMaker Data Wrangler : Préparation Visuelle Low-Code",
      lead: "Comment nettoyer, transformer et exporter des features de données vers un pipeline ML sans coder d'ETL complexe ?",
      heading: "Préparation et Visualisation Rapide de Données dans SageMaker",
      body: "SageMaker Data Wrangler permet aux data scientists d'importer des données depuis plus de 40 sources (S3, Athena, Redshift, Snowflake), d'inspecter visuellement la qualité des données, de détecter les anomalies et d'appliquer plus de 300 transformations prédéfinies (imputation, encodage one-hot, vectorisation). Il peut exporter directement le workflow sous forme de code Python, de pipeline SageMaker ou vers le Feature Store.",
      m1: { label: "Transformations", value: "+300 Fonctions Prêtes", desc: "Nettoyage de valeurs manquantes, normalisation, détection de corrélation." },
      m2: { label: "Rapport de Qualité", value: "Insights & Biais", desc: "Détecte les déséquilibres de classes et l'importance prédictive des variables." },
      m3: { label: "Export Direct", value: "SageMaker Pipelines", desc: "Génère un script d'étape de processing réutilisable en CI/CD." },
      rules: [
        "1. Pour une préparation interactive de données intégrée à SageMaker Studio, choisir Data Wrangler.",
        "2. Data Wrangler génère automatiquement les scripts PySpark correspondants pour le passage à l'échelle."
      ],
      tag: "DATA WRANGLER"
    },
    {
      title: "Amazon SageMaker Feature Store : Gestion des Caractéristiques en Ligne et Hors Ligne",
      lead: "Comment partager et réutiliser des features calculées entre l'entraînement par lots et l'inférence temps réel avec consistance ?",
      heading: "Registre Centralisé de Features pour le ML",
      body: "SageMaker Feature Store est un référentiel géré pour stocker, partager et versionner les caractéristiques de Machine Learning. Il comprend : 1. L'Online Store (stockage haute performance à très faible latence, milliseconde, pour l'inférence en temps réel avec lookup de clé primaire) ; 2. L'Offline Store (stockage historique sur Amazon S3, interrogé via Athena pour l'entraînement de modèles et les requêtes temporelles point-in-time sans fuite de données futures).",
      m1: { label: "Online Store", value: "Latence < 10ms", desc: "Recherche immédiate des features pour l'inférence temps réel." },
      m2: { label: "Offline Store", value: "Historique S3 / Athena", desc: "Conservation de toutes les versions historiques des features pour l'apprentissage." },
      m3: { label: "Time-Travel", value: "Point-in-Time Join", desc: "Évite la fuite de données (data leakage) lors de l'entraînement." },
      rules: [
        "1. Pour éviter la divergence d'entraînement/inférence (training-serving skew), utiliser SageMaker Feature Store.",
        "2. L'Online Store stocke uniquement la valeur la plus récente ; l'Offline Store conserve l'historique complet."
      ],
      tag: "FEATURE STORE"
    },
    {
      title: "Sécurité et Gouvernance des Données : IAM, KMS et VPC Endpoints",
      lead: "Comment garantir qu'un job d'entraînement SageMaker ne fasse transiter aucune donnée sur l'Internet public ?",
      heading: "Isolation Réseau et Chiffrement de Bout en Bout",
      body: "Pour sécuriser les données dans AWS ML : 1. Configurer SageMaker pour s'exécuter dans un VPC privé avec des sous-réseaux privés (sans passerelle Internet) ; 2. Utiliser des VPC Interface Endpoints (AWS PrivateLink) pour communiquer avec S3, Glue et SageMaker API ; 3. Appliquer des rôles IAM stricts avec le principe du moindre privilège ; 4. Chiffrer les données au repos sur S3 et les volumes EBS associés aux instances d'entraînement avec AWS KMS (Customer Managed Keys).",
      m1: { label: "PrivateLink", value: "VPC Endpoints", desc: "Le trafic réseau reste confiné au réseau dorsal d'AWS sans traverser Internet." },
      m2: { label: "Chiffrement EBS", value: "KMS CMK", desc: "Chiffrement automatique des disques temporaires d'entraînement." },
      m3: { label: "Inter-Container", value: "TLS Chiffré", desc: "Option 'EnableInterContainerTrafficEncryption' pour l'entraînement distribué." },
      rules: [
        "1. Si la conformité exige l'absence totale de trafic Internet, configurer des VPC Endpoints et désactiver l'accès réseau direct.",
        "2. Pour l'entraînement distribué multi-nœuds, activer le chiffrement inter-conteneurs pour sécuriser les échanges de gradients."
      ],
      tag: "SÉCURITÉ DES DONNÉES"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'S3 & FORMATS PARQUET/RECORDIO',
    'KINESIS DATA STREAMS VS FIREHOSE',
    'AWS GLUE ETL & CATALOG',
    'ATHENA SQL & PARTITIONING',
    'SAGEMAKER FILE VS PIPE MODE',
    'EMR SPARK & INSTANCES SPOT',
    'KINESIS VIDEO STREAMS VISION',
    'SAGEMAKER DATA WRANGLER',
    'FEATURE STORE ONLINE/OFFLINE',
    'SÉCURITÉ VPC PRIVATELINK & KMS'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-mlsc01-d1-${String(num).padStart(3, '0')}`,
    category: `MLS-C01 • DOMAINE 1 • ${subCategory}`,
    categoryBadgeColor: '#2563eb',
    levelTag: `MLS-C01 • D1 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 20%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[MLS-C01 D1-#${num}] ${baseTopic.title} (Question Examen #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Objectif clé du Domaine 1 (Data Engineering) de la certification AWS Machine Learning Specialty.`,
    solutionHeading: `${baseTopic.heading} - Standard AWS Well-Architected ML`,
    solutionBody: `${baseTopic.body} La maîtrise de l'ingénierie des données dans AWS (S3, Kinesis, Glue, Athena, SageMaker Data Modes) garantit des architectures d'apprentissage performantes, rentables et sécurisées.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé MLS-C01 D1 : Vérifier que les rôles IAM de SageMaker disposent de la permission s3:GetObject/PutObject et kms:Decrypt/GenerateDataKey sur la clé KMS utilisée.`
    ],
    deckName: "AWS MLS-C01 : Domaine 1 - Ingénierie des données",
    domainId: 'domain1',
    domainName: "1. Ingénierie des données (Data Engineering)",
    certCode: 'MLS-C01',
  };
});
