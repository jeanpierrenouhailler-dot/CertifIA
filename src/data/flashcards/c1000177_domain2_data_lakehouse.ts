import { Flashcard } from '../../types';

// IBM watsonx C1000-177 - Domaine 2 : watsonx.data & Gestion des données hybrides (100 Flashcards)
// Poids officiel de l'examen IBM Certified Specialist - watsonx.ai : 25%
export const c1000177Domain2Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `IBMX-D2-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Architecture Lakehouse Ouverte de watsonx.data : Découplage Calcul et Stockage",
      lead: "Comment une entreprise peut-elle réduire de 50% les coûts de son Data Warehouse traditionnel tout en conservant des performances SQL élevées pour l'IA ?",
      heading: "Le Modèle Lakehouse Ouvert : Moteurs Multiples sur Stockage Objet Économique",
      body: "watsonx.data repose sur une architecture Lakehouse ouverte construite pour briser les silos de données propriétaires : 1. Découplage strict entre Calcul (Compute) et Stockage (Storage) : les données résident dans du stockage objet économique (IBM Cloud Object Storage, AWS S3, MinIO sur site) dans des formats de fichiers ouverts (Parquet, ORC) ; 2. Moteurs de calcul multiples adaptés à la charge (Presto pour l'analytique SQL interactive, Spark pour l'ETL et l'ingénierie des caractéristiques) ; 3. Réduction des coûts jusqu'à 50% par rapport aux entrepôts de données classiques en évitant les frais de licence de stockage propriétaire.",
      m1: { label: "Découplage Total", value: "Calcul Indépendant du Stockage", desc: "Permet de dimensionner le CPU indépendamment de la volumétrie de données." },
      m2: { label: "Formats Ouverts", value: "Apache Iceberg & Parquet", desc: "Zéro verrouillage propriétaire (Vendor Lock-in) ; interopérabilité totale." },
      m3: { label: "Réduction des Coûts", value: "Jusqu'à 50% d'Économie", desc: "Déchargement des données froides et tièdes vers du stockage objet pas cher." },
      rules: [
        "1. watsonx.data permet d'exécuter des requêtes SQL ultra-rapides directement sur du stockage objet sans charger les données dans un entrepôt propriétaire.",
        "2. Plusieurs moteurs (Presto, Spark) peuvent interroger simultanément la même table sans conflit de verrouillage."
      ],
      tag: "ARCHITECTURE LAKEHOUSE WATSONX.DATA"
    },
    {
      title: "Format de Table Ouvert Apache Iceberg : Transactions ACID et Fiabilité",
      lead: "Pourquoi le format de table Apache Iceberg est-il le standard fondamental au cœur de watsonx.data pour fiabiliser les lacs de données ?",
      heading: "Gestion Transactionnelle Robuste sur Stockage Objet Distribué",
      body: "Apache Iceberg apporte au stockage objet les garanties d'un moteur de base de données relationnelle moderne : 1. Transactions ACID complètes (Atomicité, Cohérence, Isolation, Durabilité) : les écritures simultanées utilisent l'isolation d'instantané (Snapshot Isolation) ; si une tâche échoue au milieu d'une écriture, aucun fichier orphelin ou donnée corrompue n'est visible pour les requêtes de lecture ; 2. Gestion de métadonnées arborescente (Manifest files et Manifest lists) éliminant les opérations de listage coûteuses sur le stockage objet (`LIST`), garantissant des temps de réponse constants même sur des pétaoctets de données.",
      m1: { label: "Garanties ACID", value: "Snapshot Isolation", desc: "Empêche les lectures fantômes et les corruptions lors d'écritures concurrentes." },
      m2: { label: "Métadonnées Iceberg", value: "Manifests & Snapshots", desc: "Évite de scanner des millions de fichiers objets sur Cloud Storage." },
      m3: { label: "Standard Industriel", value: "Format Ouvert Neutre", desc: "Compatible avec Presto, Spark, Trino, Flink et d'autres moteurs d'analytique." },
      rules: [
        "1. Pour garantir des écritures fiables avec transactions ACID sur watsonx.data : utiliser les tables Apache Iceberg.",
        "2. Iceberg permet à des centaines de workers de lire et d'écrire en parallèle sans dégradation de cohérence."
      ],
      tag: "APACHE ICEBERG ACID"
    },
    {
      title: "Voyage dans le Temps (Time Travel) avec Apache Iceberg dans watsonx.data",
      lead: "Comment auditer ou reproduire l'entraînement d'un modèle en interrogeant les données exactement telles qu'elles existaient le 15 mars dernier à 14h00 ?",
      heading: "Interrogation Rétrospective d'Instantanés (Snapshots) Historiques",
      body: "Grâce à l'architecture de snapshots immuables d'Apache Iceberg, watsonx.data supporte nativement le Voyage dans le Temps (Time Travel) en SQL : 1. Chaque opération d'écriture génère un nouvel instantané (Snapshot ID) sans écraser les fichiers de données historiques ; 2. Syntaxe SQL Presto : `SELECT * FROM clients FOR TIMESTAMP AS OF '2024-03-15 14:00:00'` ou `FOR VERSION AS OF 8374928174` ; 3. Cas d'usage majeurs : audit réglementaire, rollback instantané après une mauvaise mise à jour de données, et garantie de reproductibilité scientifique absolue pour l'entraînement des modèles d'IA.",
      m1: { label: "Time Travel SQL", value: "FOR TIMESTAMP AS OF ...", desc: "Syntaxe standard pour interroger l'état d'une table à un instant passé précis." },
      m2: { label: "Snapshot ID", value: "Identifiant d'Instantané", desc: "Permet de verrouiller un jeu d'entraînement ML sur une version immuable exacte." },
      m3: { label: "Rollback d'Urgence", value: "Restauration Instantanée", desc: "Rétablit l'état antérieur en cas d'erreur humaine d'écriture sans restaurer de sauvegarde." },
      rules: [
        "1. Pour reproduire à l'identique un entraînement ML historique sur watsonx.data : utiliser les requêtes Time Travel Iceberg.",
        "2. Les instantanés sont conservés selon une politique d'expiration de snapshots configurable pour maîtriser l'espace disque."
      ],
      tag: "ICEBERG TIME TRAVEL"
    },
    {
      title: "Évolution de Schéma et de Partitionnement sans Réécriture de Données",
      lead: "Comment ajouter une colonne ou modifier le schéma d'une table de 100 To sans réécrire l'intégralité des fichiers Parquet sous-jacents ?",
      heading: "Évolution Transparente de Schéma (Schema Evolution) et de Partitions",
      body: "Dans les anciens formats (Hive), modifier une partition ou ajouter une colonne exigeait de réécrire tous les fichiers de données : 1. Schema Evolution dans Iceberg : l'ajout, la suppression, le renommage ou la réorganisation de colonnes sont de pures opérations de métadonnées instantanées ; chaque colonne possède un identifiant unique immuable (`field-id`) indépendant de sa position ou de son nom physique ; 2. Partition Evolution cachée : si vous passez d'un partitionnement par mois à un partitionnement par jour, les anciennes données conservent leur structure et les nouvelles adoptent la nouvelle sans aucune réécriture globale.",
      m1: { label: "Schema Evolution", value: "Opération Pure Métadonnées", desc: "Ajout/renommage de colonnes sans temps de blocage ni copie de téraoctets." },
      m2: { label: "Field ID Immuable", value: "Indépendance Nom/Position", desc: "Prévient toute confusion si une colonne est renommée ou déplacée." },
      m3: { label: "Partition Evolution", value: "Transition Douce", desc: "Permet de faire évoluer la stratégie de partitionnement au fil de la croissance des données." },
      rules: [
        "1. Avec Apache Iceberg dans watsonx.data, la modification du schéma d'une table ne nécessite JAMAIS de réécrire les fichiers de données existants.",
        "2. Le partitionnement masqué d'Iceberg évite aux analystes d'avoir à spécifier manuellement les filtres de partitions dans leurs requêtes SQL."
      ],
      tag: "SCHEMA & PARTITION EVOLUTION"
    },
    {
      title: "Moteur SQL Presto dans watsonx.data : Requêtes Interactives à Haute Vitesse",
      lead: "Pourquoi le moteur Presto est-il utilisé dans watsonx.data pour les tableaux de bord décisionnels et l'exploration de données pour l'IA ?",
      heading: "Moteur SQL Distribué en Mémoire pour Analytique Rapide",
      body: "Presto (Presto C++ / Velox) est le moteur SQL interactif par défaut de watsonx.data : 1. Architecture distribuée en mémoire (In-Memory Processing) : traite les flux de données en pipeline sans déverser les résultats intermédiaires sur disque, offrant des temps de réponse sous la seconde ; 2. Accélération de requêtes : exploitation poussée des statistiques de métadonnées Iceberg (min/max de colonnes, filtres de Bloom) pour éliminer les fichiers inutiles (*File Pruning*) avant lecture ; 3. Moteur natif Presto C++ (Velox) offrant une exécution vectorisée ultra-rapide optimisée pour les instructions SIMD des processeurs modernes.",
      m1: { label: "Presto SQL", value: "Requêtes Interactives < 1s", desc: "Conçu pour la BI interactive, l'exploration de features et les requêtes analytiques rapides." },
      m2: { label: "Pruning de Fichiers", value: "Élagage par Métadonnées", desc: "Lit uniquement les shards Parquet contenant les valeurs recherchées." },
      m3: { label: "Moteur Vectorisé", value: "Presto C++ / Velox", desc: "Multiplie par 2 à 3 le débit de traitement par rapport au Presto Java historique." },
      rules: [
        "1. Pour exécuter des requêtes SQL rapides et interactives sur le Lakehouse : choisir le moteur Presto dans watsonx.data.",
        "2. Presto est optimisé pour les charges en lecture seule concurrentes et les jointures distribuées volumineuses."
      ],
      tag: "MOTEUR PRESTO ACCÉLÉRATION"
    },
    {
      title: "Moteur Apache Spark dans watsonx.data : Traitement par Lots et Préparation ML Lourd",
      lead: "Quand faut-il router une tâche de données vers le moteur Apache Spark plutôt que vers Presto dans watsonx.data ?",
      heading: "Calcul Distribué Tolérant aux Pannes pour ETL Massif et Data Science",
      body: "watsonx.data intègre un moteur Apache Spark managé : 1. Quand utiliser Spark : pour les transformations de données massives (ETL par lots), les pipelines de feature engineering complexes, les agrégations lourdes exigeant une tolérance aux pannes avec reprise sur point de contrôle (Checkpoints), et les jobs de machine learning distribué (PySpark / Spark ML) ; 2. Coexistence harmonieuse : Spark écrit dans les tables Iceberg et Presto les lit instantanément pour l'analytique sans aucun pipeline de synchronisation additionnel.",
      m1: { label: "Apache Spark", value: "ETL Massif & Tolérance aux Pannes", desc: "Idéal pour les transformations lourdes de plusieurs heures avec réessais automatiques." },
      m2: { label: "PySpark & MLlib", value: "Machine Learning Distribué", desc: "Exécution de notebooks de Data Science directement sur le cluster de calcul." },
      m3: { label: "Catalogue Partagé", value: "Même Métastore Iceberg", desc: "Presto et Spark partagent le même catalogue sans duplication de données." },
      rules: [
        "1. Pour l'analytique interactive : choisir Presto. Pour l'ETL par lots lourd et les scripts PySpark : choisir Apache Spark.",
        "2. Les deux moteurs peuvent opérer sur les mêmes tables Apache Iceberg simultanément."
      ],
      tag: "APACHE SPARK DANS WATSONX.DATA"
    },
    {
      title: "Base Vectorielle Intégrée Milvus dans watsonx.data pour Cas d'Usage RAG",
      lead: "Comment stocker et rechercher efficacement des millions d'embeddings vectoriels pour alimenter un système RAG d'entreprise dans watsonx.data ?",
      heading: "Base de Données Vectorielle Distribuée pour Recherche Sémantique à Grande Échelle",
      body: "watsonx.data intègre nativement Milvus, la base de données vectorielle open source la plus populaire pour l'IA générative : 1. Stockage et indexation de vecteurs d'embeddings générés par les modèles d'intégration (ex: Slate, bge, text-embedding-ada) ; 2. Algorithmes de recherche de plus proches voisins approximatifs (ANN) haute performance : HNSW (Hierarchical Navigable Small World) pour une vitesse de recherche maximale en mémoire, et IVF_FLAT / IVF_SQ8 pour optimiser l'empreinte mémoire ; 3. Intégration native avec watsonx.ai pour des architectures RAG (Retrieval-Augmented Generation) hybrides combinant SQL structuré et recherche vectorielle non structurée.",
      m1: { label: "Base Milvus", value: "Indexation Vectorielle Dédiée", desc: "Capable de stocker et d'interroger des milliards de vecteurs d'embeddings." },
      m2: { label: "Index HNSW", value: "Recherche Sémantique Rapide", desc: "Navigation par graphe hiérarchique pour des réponses vectorielles en millisecondes." },
      m3: { label: "Support RAG Hybride", value: "SQL + Vecteurs Unifiés", desc: "Permet de filtrer par métadonnées SQL (date, client) puis par similarité sémantique." },
      rules: [
        "1. Pour stocker et requêter des embeddings pour le RAG dans l'écosystème watsonx : utiliser la base Milvus intégrée dans watsonx.data.",
        "2. L'index HNSW offre le meilleur compromis entre précision de recherche et latence de requête pour le RAG."
      ],
      tag: "MILVUS BASE VECTORIELLE RAG"
    },
    {
      title: "Stockage Hybride Multi-Cloud et On-Premises avec S3, MinIO et IBM COS",
      lead: "Comment connecter watsonx.data à la fois à un lac de données AWS S3 existant et à un stockage objet MinIO sur site sans rapatrier les données ?",
      heading: "Fédération de Stockage Objet sans Déplacement Physique de Données",
      body: "watsonx.data supporte une connectivité universelle vers n'importe quel stockage objet conforme à l'API S3 : 1. Fournisseurs supportés : IBM Cloud Object Storage (COS), Amazon Web Services (AWS S3), Microsoft Azure Blob, Google Cloud Storage (GCS), ainsi que des solutions sur site (MinIO, Ceph, Red Hat OpenShift Data Foundation - ODF) ; 2. Architecture 'In-Place Analytics' : les moteurs Presto et Spark exécutent les requêtes directement là où résident les données, sans nécessiter de transfert ETL long et coûteux ; 3. Gestion centralisée des identifiants et clés de compartiments (Buckets) dans la console d'administration.",
      m1: { label: "API S3 Universelle", value: "Multi-Cloud & Sur Site", desc: "Connecte IBM COS, AWS S3, Azure et MinIO sous une vue unifiée." },
      m2: { label: "In-Place Querying", value: "Zéro Déplacement de Données", desc: "Évite les frais d'exfiltration réseau (egress fees) et la duplication d'espace." },
      m3: { label: "Fédération Multi-Buckets", value: "Jointures Hybrides Directes", desc: "Permet une jointure SQL entre une table située sur AWS S3 et une table sur MinIO local." },
      rules: [
        "1. Pour interroger des données situées dans plusieurs clouds ou sur site sans les déplacer : configurer des connecteurs de stockage dans watsonx.data.",
        "2. watsonx.data peut réaliser des jointures SQL distribuées entre des buckets résidant dans des infrastructures différentes."
      ],
      tag: "STOCKAGE HYBRIDE S3 MINIO"
    },
    {
      title: "Gouvernance des Données et Masquage Dynamique avec IBM Knowledge Catalog",
      lead: "Comment s'assurer que les scientifiques de données ne voient que les 4 derniers chiffres des numéros de carte de crédit lorsqu'ils interrogent une table Iceberg ?",
      heading: "Règles de Masquage Dynamique de Colonnes (Dynamic Data Masking) et RBAC",
      body: "watsonx.data s'intègre étroitement avec IBM Knowledge Catalog pour appliquer des politiques de sécurité et de conformité centralisées : 1. Détection automatique des termes métier et des classes de données sensibles (PII, numéros de sécurité sociale, salaires) ; 2. Contrôle d'accès basé sur les rôles (RBAC) : définit précisément qui a le droit de lire, écrire ou administrer chaque catalogue et schéma ; 3. Masquage dynamique de données (Dynamic Data Masking) : applique des règles de masquage à la volée (remplacement par `XXXX-XXXX-XXXX-1234`, hachage cryptographique, ou suppression complète) selon le groupe de l'utilisateur sans altérer les données sous-jacentes du stockage objet.",
      m1: { label: "Masquage Dynamique", value: "À la Volée sans Duplication", desc: "La donnée reste intacte sur disque, mais est caviardée lors du transfert SQL." },
      m2: { label: "Intégration Catalog", value: "IBM Knowledge Catalog", desc: "Gouvernance unifiée des termes métier, métadonnées et politiques de confidentialité." },
      m3: { label: "RBAC Granulaire", value: "Niveau Table & Colonne", desc: "Restreint la visibilité des colonnes sensibles aux seuls utilisateurs accrédités." },
      rules: [
        "1. Pour protéger les données confidentielles sans créer de copies partielles de tables : configurer des règles de masquage dynamique dans watsonx.data.",
        "2. Les règles de masquage s'appliquent de façon transparente quel que soit le moteur d'interrogation utilisé (Presto ou Spark)."
      ],
      tag: "MASQUAGE DYNAMIQUE & GOUVERNANCE"
    },
    {
      title: "Optimisation des Performances Iceberg : Compaction et Suppression des Fichiers Orphelins",
      lead: "Pourquoi les requêtes SQL sur une table Iceberg deviennent-elles lentes après des milliers d'écritures continues en streaming et comment y remédier ?",
      heading: "Maintenance de Table : Compaction des Petits Fichiers et Nettoyage de Snapshots",
      body: "L'ingestion continue en streaming (ex: micro-batchs toutes les 10 secondes) génère des millions de très petits fichiers Parquet, créant le problème du 'Small Files Problem' qui sature le système de fichiers : 1. Procédure de Compaction (Compacting) : regroupe automatiquement des milliers de petits fichiers de quelques kilo-octets en gros fichiers optimisés de 128 Mo à 512 Mo pour maximiser le débit de lecture Presto ; 2. Suppression des fichiers orphelins (Remove Orphan Files) : nettoie les fichiers physiques abandonnés suite à des jobs interrompus ; 3. Expiration des instantanés (Expire Snapshots) : purge les métadonnées historiques obsolètes pour alléger la table.",
      m1: { label: "Compaction Iceberg", value: "Fusion des Petits Fichiers", desc: "Transforme les micro-fichiers en blocs optimaux de 128 à 512 Mo." },
      m2: { label: "Expire Snapshots", value: "Purge des Anciens Instantanés", desc: "Libère l'espace de stockage consommé par les versions historiques dépassées." },
      m3: { label: "Maintenance Périodique", value: "Jobs de Routine Planifiés", desc: "Garantit des performances de requête constantes au cours du cycle de vie de la table." },
      rules: [
        "1. Si les performances de requêtes se dégradent sur une table alimentée en continu : exécuter une procédure de compaction Iceberg.",
        "2. Toujours planifier l'expiration des snapshots anciens pour éviter une augmentation inutile des coûts de stockage objet."
      ],
      tag: "COMPACTION & MAINTENANCE ICEBERG"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'ARCHITECTURE LAKEHOUSE DÉCOUPLAGE CALCUL STOCKAGE',
    'APACHE ICEBERG TRANSACTIONS ACID',
    'VOYAGE DANS LE TEMPS TIME TRAVEL REQUÊTES',
    'ÉVOLUTION DE SCHÉMA ET PARTITIONNEMENT',
    'MOTEUR SQL PRESTO REQUÊTES INTERACTIVES',
    'APACHE SPARK ETL MASSIF ML DISTRIBUÉ',
    'MILVUS BASE VECTORIELLE INTÉGRÉE RAG',
    'STOCKAGE HYBRIDE MULTI-CLOUD S3 MINIO',
    'GOUVERNANCE DES DONNÉES MASQUAGE DYNAMIQUE',
    'OPTIMISATION COMPACTION SMALL FILES ICEBERG'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-c1000177-d2-${String(num).padStart(3, '0')}`,
    category: `C1000-177 • DOMAINE 2 • ${subCategory}`,
    categoryBadgeColor: '#0043ce',
    levelTag: `C1000-177 • D2 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 25%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[C1000-177 D2-#${num}] ${baseTopic.title} (Question Lakehouse Data #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Objectif clé du Domaine 2 (watsonx.data & Gestion des données hybrides) de l'examen IBM watsonx.ai Specialist.`,
    solutionHeading: `${baseTopic.heading} - Standard IBM watsonx.data Architecture`,
    solutionBody: `${baseTopic.body} Le Domaine 2 (25% de l'examen C1000-177) valide l'expertise sur le Lakehouse ouvert watsonx.data : tables Apache Iceberg (ACID, Time Travel, Schema Evolution), moteurs Presto et Spark, base vectorielle Milvus pour le RAG, connectivité hybride (S3, MinIO, COS) et masquage dynamique.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé C1000-177 D2 : watsonx.data applique le standard ouvert Apache Iceberg pour garantir l'indépendance technologique, l'interopérabilité multi-moteurs (Presto/Spark) et la conformité grâce au voyage dans le temps (Time Travel).`
    ],
    deckName: "IBM watsonx C1000-177 : Domaine 2 - watsonx.data & Données hybrides",
    domainId: 'domain2',
    domainName: "2. watsonx.data & Gestion des données hybrides",
    certCode: 'C1000-177',
  };
});
