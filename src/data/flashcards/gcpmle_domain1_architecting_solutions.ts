import { Flashcard } from '../../types';

// Google Cloud GCP-PMLE - Domaine 1 : Architecturer des solutions de ML sur Google Cloud (100 Flashcards)
// Poids officiel de l'examen Professional Machine Learning Engineer : 20%
export const gcpmleDomain1Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `GCP-D1-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Hiérarchie de Décision ML sur GCP : Pre-trained APIs vs AutoML vs Custom Training",
      lead: "Face à un nouveau projet d'entreprise, quel arbre de décision officiel Google Cloud appliquer pour minimiser l'effort d'ingénierie et le coût total (TCO) ?",
      heading: "Règle d'Or de l'Architecture ML sur Google Cloud",
      body: "L'approche architecturale recommandée par Google suit un ordre strict à 3 niveaux : 1. APIs Pré-entraînées (Cloud Vision, Speech-to-Text, Document AI, Translation) si le besoin correspond à une tâche standard sans données d'entraînement nécessaires ; 2. Vertex AI AutoML (Vision, Tabular, Text, Video) si vous disposez de données étiquetées mais souhaitez éviter le codage de réseau de neurones et bénéficier du Neural Architecture Search (NAS) automatisé ; 3. Vertex AI Custom Training (TensorFlow, PyTorch, JAX, Scikit-learn) uniquement si le cas exige une fonction de perte personnalisée, un algorithme de recherche spécifique ou une architecture propriétaire.",
      m1: { label: "Niveau 1 : Pre-trained APIs", value: "Zéro Code ML & Zéro Train", desc: "Délai de mise en production immédiat, tarification à l'appel d'API." },
      m2: { label: "Niveau 2 : Vertex AI AutoML", value: "No-Code avec Données Métier", desc: "Hyperparameter tuning et NAS gérés de façon autonome par Google." },
      m3: { label: "Niveau 3 : Custom Training", value: "Contrôle Algorithmique Total", desc: "Développement en conteneurs Docker sur GPU/TPU dédiés." },
      rules: [
        "1. Règle d'examen : Toujours vérifier si une API pré-entraînée ou AutoML résout le problème avant d'envisager un Custom Training coûteux.",
        "2. Si l'entreprise n'a pas de data scientists spécialisés mais dispose de photos de produits étiquetées : choisir Vertex AI AutoML Image."
      ],
      tag: "ARBRE DE DÉCISION ML"
    },
    {
      title: "Sélection du Matériel d'Accélération : CPU vs GPU NVIDIA vs Google TPU",
      lead: "Comment dimensionner l'infrastructure de calcul entre CPU, GPU (NVIDIA T4/A100/H100) et TPU (v4/v5e/v5p) pour un entraînement ML intensif ?",
      heading: "Matrice d'Arbitrage Matériel et Accélérateurs sur Vertex AI",
      body: "1. CPU : adapté pour le preprocessing léger, l'inférence à faible trafic ou les modèles tabulaires simples (Scikit-learn, petits arbres de décision) ; 2. GPU NVIDIA : standard universel pour PyTorch, CUDA, inférence haute performance (T4 pour son rapport coût/efficacité exceptionnel ; A100/H100 80Go pour les LLMs et entraînements distribués lourds) ; 3. Google TPU (Tensor Processing Units) : puces ASIC propriétaires sur mesure ultra-optimisées pour les multiplications matricielles massives (matmul) en précision bfloat16, idéales pour TensorFlow et JAX sur des modèles de deep learning géants (TPU Pods inter-connectés par réseau optique dédié sans goulot d'étranglement).",
      m1: { label: "NVIDIA T4", value: "Inférence & Entraînement Léger", desc: "Accélérateur le plus économique pour les endpoints d'inférence en ligne." },
      m2: { label: "NVIDIA A100 / H100", value: "LLMs & Modèles Multimodaux", desc: "Bande passante mémoire HBM2e colossale pour l'entraînement de transformers." },
      m3: { label: "Google TPU v4/v5p", value: "ASIC Matmul TensorFlow/JAX", desc: "Topologie Pods à très haute densité de calcul pour les modèles massifs." },
      rules: [
        "1. Pour un entraînement TensorFlow/JAX massif avec opérations matricielles intensives : les TPUs offrent le meilleur ratio coût/performance.",
        "2. Si le code utilise des bibliothèques personnalisées avec dépendances C++/CUDA non standard : privilégier les GPU NVIDIA."
      ],
      tag: "ACCÉLÉRATEURS GPU & TPU"
    },
    {
      title: "Optimisation Budgétaire des Entraînements : Dynamic Workload Scheduler (Flex Start) & Spot VMs",
      lead: "Comment réduire de plus de 50% la facture GPU pour des jobs d'entraînement par lots non urgents pouvant tolérer des interruptions ou un démarrage différé ?",
      heading: "Ordonnancement Élastique et Instances Préemptibles sur Vertex AI",
      body: "Vertex AI propose deux mécanismes d'économie majeurs pour les charges discontinues : 1. Dynamic Workload Scheduler (DWS avec Flex Start) : permet de soumettre des Custom Jobs nécessitant des GPU rares (A100/H100) en acceptant que Google ordonnance le démarrage dans une fenêtre de temps glissante (jusqu'à 7 jours), en échange d'une réduction tarifaire substantielle et d'une garantie d'exécution ininterrompue une fois lancé ; 2. Spot VMs (Machines Préemptibles) : réduction jusqu'à 60-91% du coût VM, mais le job peut être préempté à tout instant (impose de sauvegarder des checkpoints réguliers dans Cloud Storage).",
      m1: { label: "DWS Flex Start", value: "Réduction Coût GPU Rares", desc: "Idéal pour les gros entraînements planifiés le week-end ou sous file d'attente." },
      m2: { label: "Spot VMs", value: "Économie jusqu'à 90%", desc: "Exige impérativement une stratégie de Checkpointing sur Google Cloud Storage." },
      m3: { label: "Checkpointing GCS", value: "Tolérance aux Pannes", desc: "Sauvegarde des poids toutes les N époques pour reprendre en cas de préemption." },
      rules: [
        "1. Sur les Spot VMs, implémenter systématiquement le callback ModelCheckpoint vers Cloud Storage pour éviter de perdre l'apprentissage.",
        "2. Utiliser Dynamic Workload Scheduler (Flex Start) pour acquérir des GPU A100/H100 sous tension de quota sans surcoût de réservation."
      ],
      tag: "OPTIMISATION COÛTS DWS & SPOT"
    },
    {
      title: "Sécurité et Périmètres Réservés avec VPC Service Controls et CMEK",
      lead: "Comment interdire formellement toute exfiltration de données d'entraînement sensibles vers un bucket Cloud Storage externe non autorisé ?",
      heading: "Isolation Périmétrique et Chiffrement Cryptographique d'Entreprise",
      body: "Pour les secteurs hautement régulés (banque, santé, défense) : 1. VPC Service Controls (VPC-SC) crée un périmètre de sécurité hermétique autour des services managés (Vertex AI, Cloud Storage, BigQuery) ; il bloque catégoriquement toute tentative de lecture ou d'écriture en dehors du périmètre, même avec des identifiants IAM valides (évite le vol de données vers des buckets tiers) ; 2. Customer-Managed Encryption Keys (CMEK) via Cloud KMS : l'entreprise contrôle la clé de chiffrement des modèles et datasets ; la désactivation de la clé détruit instantanément l'accès aux données chiffrées.",
      m1: { label: "VPC Service Controls", value: "Anti-Exfiltration de Données", desc: "Empêche l'accès aux ressources GCP depuis des réseaux ou buckets hors périmètre." },
      m2: { label: "Cloud KMS CMEK", value: "Clés Gérées par le Client", desc: "Contrôle cryptographique complet, rotation annuelle et révocation d'urgence." },
      m3: { label: "Private Service Connect", value: "Endpoints Privés sans Internet", desc: "Communication privée entre le VPC client et les endpoints managés de Vertex AI." },
      rules: [
        "1. Pour bloquer l'exfiltration de données vers des comptes Cloud Storage externes : configurer un périmètre VPC Service Controls.",
        "2. Pour respecter une clause de souveraineté imposant la révocation autonome des clés : configurer Cloud KMS CMEK sur Vertex AI."
      ],
      tag: "SÉCURITÉ VPC-SC & CMEK"
    },
    {
      title: "Gestion Granulaire des Rôles IAM pour les Équipes de Data Science",
      lead: "Quel rôle IAM attribuer à un Data Scientist pour lui permettre de lancer des entraînements sans lui donner le droit de détruire l'infrastructure réseau ?",
      heading: "Principe du Moindre Privilège sur Vertex AI",
      body: "Google Cloud propose des rôles prédéfinis spécifiques pour séparer les responsabilités : 1. `roles/aiplatform.user` : permet d'entraîner, tester et déployer des modèles sur des ressources existantes sans pouvoir modifier les règles IAM globales ; 2. `roles/aiplatform.admin` : contrôle total sur les ressources Vertex AI (réservé aux tech leads MLOps) ; 3. Pour le compte de service (Service Account) exécutant le job d'entraînement : lui octroyer uniquement `roles/storage.objectViewer` sur le bucket de données et `roles/storage.objectCreator` sur le bucket d'artefacts de sortie.",
      m1: { label: "Vertex AI User", value: "roles/aiplatform.user", desc: "Création et suivi de jobs, consultation des datasets et modèles." },
      m2: { label: "Service Account Dédié", value: "Moindre Privilège d'Exécution", desc: "Évite d'utiliser le compte de service Compute par défaut qui est trop permissif." },
      m3: { label: "Séparation Environnements", value: "Projets GCP Distincts", desc: "Isolation stricte entre projet de Dev, Staging et Production." },
      rules: [
        "1. Ne jamais utiliser le compte de service Compute Engine par défaut avec des droits d'éditeur pour les entraînements en production.",
        "2. Attribuer des rôles fins sur les buckets Cloud Storage spécifiques plutôt qu'au niveau global du projet."
      ],
      tag: "IAM & MOINDRE PRIVILÈGE"
    },
    {
      title: "BigQuery ML (BQML) : Machine Learning Directement au Cœur du Data Warehouse",
      lead: "Quand est-il recommandé d'entraîner un modèle de classification ou de régression avec BigQuery ML plutôt que d'exporter les données vers Vertex AI ?",
      heading: "Entraînement In-Database en SQL sans Déplacement de Données",
      body: "BigQuery ML permet d'entraîner et d'évaluer des modèles de Machine Learning directement en SQL sans exporter des téraoctets de données vers un autre environnement de calcul (éliminant la latence et les coûts de transfert). Modèles supportés : régression linéaire, régression logistique, arbres boostés (XGBoost), K-Means, factorisation matricielle (recommandation), Time Series (ARIMA_PLUS) et intégration de modèles TensorFlow ou Vertex AI distants via `CREATE MODEL ... OPTIONS(remote_service_type='CLOUD_AI_LARGE_LANGUAGE_MODEL_V1')`.",
      m1: { label: "Zéro Déplacement", value: "Élimine les Pipelines ETL", desc: "Le calcul ML se fait directement dans les clusters de traitement BigQuery." },
      m2: { label: "Clause TRANSFORM", value: "Prévention Skew Training/Serve", desc: "Intègre le feature engineering (ML.STANDARD_SCALER, ML.BUCKETIZE) dans le modèle." },
      m3: { label: "ARIMA_PLUS", value: "Séries Temporelles Automatisées", desc: "Décompose automatiquement tendance, saisonnalité et anomalies calendaires." },
      rules: [
        "1. Si les données résident déjà dans BigQuery et que l'équipe maîtrise le SQL : privilégier BigQuery ML pour un prototypage ultra-rapide.",
        "2. Utiliser la clause TRANSFORM dans CREATE MODEL pour encapsuler le preprocessing et éviter le Training-Serving Skew."
      ],
      tag: "BIGQUERY ML (BQML)"
    },
    {
      title: "Document AI : Traitement Intelligent de Formulaires et Documents d'Entreprise",
      lead: "Comment extraire avec fiabilité les tables, montants et numéros de TVA de factures PDF sans entraîner de modèle de vision complexe ?",
      heading: "Processeurs Spécialisés Pré-entraînés et Workbench Document AI",
      body: "Google Cloud Document AI propose des processeurs spécialisés basés sur des modèles multimodaux de vision et de langage : 1. General Processors : OCR Parser (extraction de texte brut avec mise en page) et Form Parser (extraction de paires clé-valeur et tables) ; 2. Specialized Processors : Invoice Parser (factures), Receipt Parser (tickets de caisse), ID Proofing (pièces d'identité et passeports), W-2, 1040 ; 3. Document AI Workbench : permet d'annoter et d'entraîner un extracteur sur mesure ou de classifier des types de documents spécifiques via une interface no-code.",
      m1: { label: "Invoice Parser", value: "Clé en Main pour Factures", desc: "Extrait fournisseur, montants HT/TTC, TVA, dates et lignes d'articles sans code." },
      m2: { label: "Form Parser", value: "Paires Clé-Valeur & Tables", desc: "Restitue la hiérarchie visuelle et les cellules de tableaux complexes." },
      m3: { label: "Human-in-the-Loop", value: "Document AI Review Tool", desc: "Route les formulaires dont la confiance est incertaine vers des réviseurs humains." },
      rules: [
        "1. Pour extraire des factures ou reçus sans modèle personnalisé : utiliser le processeur Invoice/Receipt de Document AI.",
        "2. Document AI gère nativement les documents scannés de mauvaise qualité, inclinés ou tachés."
      ],
      tag: "DOCUMENT AI"
    },
    {
      title: "Vertex AI Model Garden & Foundation Models (Gemini, Imagen, PaLM)",
      lead: "Comment sélectionner, tester et déployer les modèles de fondation ouverts et propriétaires de Google dans votre architecture ?",
      heading: "Le Hub Central des Modèles de Fondation sur Google Cloud",
      body: "Vertex AI Model Garden est le catalogue unifié fournissant l'accès à plus de 150 modèles : 1. Modèles propriétaires de pointe de Google : Gemini 1.5 Pro & Flash (multimodaux à très longue fenêtre de contexte jusqu'à 2 millions de tokens), Imagen 3 (génération d'images haute fidélité), Chirp (parole multilingue), Codey (génération et débogage de code) ; 2. Modèles ouverts (Open Weights) : Llama 3, Mistral, Gemma 2, Stable Diffusion, BERT ; 3. Déploiement en un clic sur Vertex AI Endpoints ou consommation directe via l'API Vertex AI Studio.",
      m1: { label: "Gemini 1.5 Pro", value: "Fenêtre Contexte 2M Tokens", desc: "Permet d'ingérer 1 heure de vidéo, 11h d'audio ou 30 000 lignes de code d'un bloc." },
      m2: { label: "Gemma 2", value: "Modèles Ouverts Google", desc: "Poids ouverts légers (2B, 9B, 27B) déployables sur vos propres VM ou edge." },
      m3: { label: "Model Garden", value: "Catalogue Multi-Modèles", desc: "Déploiement en un clic avec conteneurs d'inférence certifiés Google." },
      rules: [
        "1. Pour analyser de très longs documents PDF techniques ou des vidéos d'une heure : choisir Gemini 1.5 Pro dans Vertex AI.",
        "2. Model Garden permet d'héberger des modèles ouverts comme Llama ou Gemma sur votre infrastructure GCP dédiée."
      ],
      tag: "VERTEX AI MODEL GARDEN"
    },
    {
      title: "Solutions Low-Code : Vertex AI Search and Conversation (Agents Génératifs)",
      lead: "Comment déployer un moteur de recherche documentaire et un chatbot d'entreprise connecté aux intranets sans coder d'infrastructure vectorielle ?",
      heading: "RAG Managé Prêt à l'Emploi sur Google Cloud",
      body: "Anciennement Generative AI App Builder, Vertex AI Search and Conversation permet de construire des applications de recherche et d'agents d'IA générative clé en main : 1. Vertex AI Search : indexe automatiquement Cloud Storage, BigQuery, sites web publics ou connecteurs d'entreprise (Jira, Salesforce, Confluence) avec recherche sémantique multimodale, chunking automatique et citations de sources sourcées ; 2. Vertex AI Conversation : conçoit des agents conversationnels (bots) combinant des flux de dialogue structurés et des réponses génératives libres ancrées sur vos documents d'entreprise.",
      m1: { label: "Indexation Automatique", value: "Zéro Pipeline d'Embedding", desc: "Google gère le découpage, la vectorisation et l'indexation sans base externe." },
      m2: { label: "Ancrage (Grounding)", value: "Citations Précises", desc: "Garantit que chaque affirmation de l'agent est justifiée par un extrait du document." },
      m3: { label: "Connecteurs", value: "SharePoint, Salesforce, Confluence", desc: "Intégration d'entreprise respectant les droits d'accès aux documents." },
      rules: [
        "1. Pour une solution de recherche d'entreprise RAG sans déployer de base vectorielle : choisir Vertex AI Search.",
        "2. Vertex AI Search élimine les hallucinations en ancrant (grounding) les réponses exclusivement sur les données indexées."
      ],
      tag: "VERTEX SEARCH & CONVERSATION"
    },
    {
      title: "Gestion des Quotas et Réservation de Capacité GPU/TPU sur Google Cloud",
      lead: "Que faire lorsqu'un job d'entraînement critique échoue avec une erreur 'Resource exhausted: quota exceeded for GPUs' ?",
      heading: "Stratégies d'Allocation de Ressources et Réservations Dédiées",
      body: "Les accélérateurs matériels (A100, H100, TPU) sont soumis à des quotas stricts par région : 1. Quota de ressources : vérifier dans la console IAM & Admin > Quotas la limite de `NVIDIA_A100_GPUS` ou `Custom model training GPUs` et soumettre une demande d'augmentation avec justification commerciale ; 2. Réservations de capacité Compute Engine : pour les mises en production critiques à date fixe, souscrire une réservation de VM avec GPU garantissant la disponibilité matérielle dans la zone sélectionnée (avec engagement d'utilisation 1 an / 3 ans - CUD) ; 3. Multi-Region Fallback : basculer l'entraînement sur une autre région disposant de capacité disponible (ex: `us-central1` vers `europe-west4`).",
      m1: { label: "Erreur Quota Exceeded", value: "Demande via Service Quotas", desc: "Nécessite une augmentation manuelle du plafond d'accélérateurs alloués." },
      m2: { label: "Réservations de Capacité", value: "Garantie de Disponibilité", desc: "Assure que le matériel sera disponible le jour J sans rupture de stock zonale." },
      m3: { label: "Engagement CUD", value: "Réduction Coûts 1 ou 3 Ans", desc: "Permet d'économiser jusqu'à 57% sur l'infrastructure d'entraînement continue." },
      rules: [
        "1. Ne jamais attendre le jour du lancement d'un entraînement critique pour vérifier et solliciter les quotas GPU.",
        "2. Les réservations zonales de capacité éliminent le risque de pénurie matérielle lors des pics de demande mondiale."
      ],
      tag: "QUOTAS & RÉSERVATIONS GPU"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'ARBRE DE DÉCISION PRE-TRAINED AUTOML CUSTOM',
    'ACCÉLÉRATEURS GPU NVIDIA VS GOOGLE TPU',
    'OPTIMISATION COÛTS DWS FLEX START & SPOT',
    'SÉCURITÉ RÉSEAU VPC SERVICE CONTROLS & CMEK',
    'IAM PRINCIPE DU MOINDRE PRIVILÈGE',
    'BIGQUERY ML ENTRAÎNEMENT IN-DATABASE',
    'DOCUMENT AI OCR & FORM PARSER',
    'VERTEX MODEL GARDEN & FOUNDATION MODELS',
    'VERTEX SEARCH & CONVERSATION RAG',
    'QUOTAS & RÉSERVATIONS DE CAPACITÉ'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-gcpmle-d1-${String(num).padStart(3, '0')}`,
    category: `GCP-PMLE • DOMAINE 1 • ${subCategory}`,
    categoryBadgeColor: '#4285f4',
    levelTag: `GCP-PMLE • D1 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 20%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[GCP-PMLE D1-#${num}] ${baseTopic.title} (Scénario Architecture #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Objectif clé du Domaine 1 (Architecturer des solutions de ML sur Google Cloud) pour l'examen Professional ML Engineer.`,
    solutionHeading: `${baseTopic.heading} - Standard Google Cloud Architecture Framework`,
    solutionBody: `${baseTopic.body} Le Domaine 1 (20% de l'examen GCP-PMLE) évalue la capacité à choisir la solution optimale (APIs, AutoML, Custom Training, BigQuery ML), à dimensionner les accélérateurs (GPU vs TPU), à optimiser les coûts (DWS Flex Start, Spot) et à verrouiller la sécurité (VPC-SC, CMEK, IAM).`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé GCP-PMLE D1 : L'architecture ML optimale sur Google Cloud privilégie toujours la solution la plus managée (Pre-trained APIs > AutoML > Custom Training) pour accélérer le Time-to-Market et réduire la dette technique opérationnelle.`
    ],
    deckName: "Google Cloud GCP-PMLE : Domaine 1 - Architecturer des solutions de ML",
    domainId: 'domain1',
    domainName: "1. Architecturer des solutions de ML sur Google Cloud",
    certCode: 'GCP-PMLE',
  };
});
