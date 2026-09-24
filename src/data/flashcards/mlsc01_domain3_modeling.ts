import { Flashcard } from '../../types';

// AWS MLS-C01 - Domaine 3 : Modélisation (Modeling) (100 Flashcards)
// Poids officiel de l'examen AWS Certified Machine Learning - Specialty : 36% (Le plus lourd de l'examen !)
export const mlsc01Domain3Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `MLS-D3-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Amazon SageMaker XGBoost : Hyperparamètres Clés et Prévention de l'Overfitting",
      lead: "Quels hyperparamètres d'XGBoost régler en priorité pour freiner un modèle qui surapprend sur les données d'entraînement ?",
      heading: "Régularisation Avancée de l'Algorithme XGBoost",
      body: "Pour contrer le surapprentissage dans SageMaker XGBoost : 1. Réduire le taux d'apprentissage `eta` (0.01 à 0.2) tout en augmentant le nombre d'arbres avec early stopping ; 2. Réduire la profondeur maximale des arbres `max_depth` (ex: passer de 10 à 4 ou 6) ; 3. Augmenter `min_child_weight` (poids minimum d'échantillons requis dans une feuille) ; 4. Augmenter `gamma` (gain minimal pour scinder une feuille) ; 5. Activer le sous-échantillonnage aléatoire avec `subsample` (< 1.0) et `colsample_bytree` (< 1.0) ; 6. Augmenter la régularisation L1 (`alpha`) et L2 (`lambda`).",
      m1: { label: "Taux d'Apprentissage", value: "eta (0.01 - 0.1)", desc: "Pondère la contribution de chaque nouvel arbre entraîné." },
      m2: { label: "Profondeur Max", value: "max_depth (3 - 8)", desc: "Une profondeur trop élevée produit des arbres mémorisant le bruit." },
      m3: { label: "Régularisation", value: "alpha (L1) & lambda (L2)", desc: "Pénalise la complexité et les poids extrêmes des feuilles." },
      rules: [
        "1. Si le score train est 99% et le score validation est 70%, réduire max_depth et augmenter min_child_weight.",
        "2. Dans SageMaker, XGBoost attend que la variable cible (label) soit dans la PREMIÈRE colonne du fichier CSV (sans en-tête)."
      ],
      tag: "SAGEMAKER XGBOOST"
    },
    {
      title: "Amazon SageMaker DeepAR : Prévision de Séries Temporelles Multiples",
      lead: "Quand choisir DeepAR plutôt qu'un modèle ARIMA classique ou Prophet pour prévoir des ventes ?",
      heading: "Prévision Séquentielle Récurrente (RNN) avec DeepAR",
      body: "DeepAR utilise des réseaux neuronaux récurrents (RNN) pour entraîner un modèle global unique sur des CENTAINES ou MILLIERS de séries temporelles interdépendantes (ex: ventes de tous les articles d'un supermarché). Avantages décisifs : 1. Capable de prédire des articles récents sans historique long (cold-start) grâce aux métadonnées d'articles ; 2. Génère des prévisions probabilistes (quantiles p10, p50, p90) plutôt qu'un point unique ; 3. Apprend automatiquement les saisonnalités complexes.",
      m1: { label: "Architecture", value: "RNN Autoregressif", desc: "Entraîné sur des milliers de séries chronologiques liées." },
      m2: { label: "Cold-Start", value: "Support Métadonnées", desc: "Prédit pour de nouveaux produits basés sur leur catégorie/prix." },
      m3: { label: "Sortie Probabiliste", value: "Intervalles de Confiance", desc: "Fournit les quantiles P10, P50 (médiane) et P90 pour évaluer le risque." },
      rules: [
        "1. Pour prévoir des stocks sur un catalogue de 10 000 produits avec des liens de corrélation, DeepAR est le choix AWS optimal.",
        "2. DeepAR requiert des données au format JSON Lines avec champs 'start' et 'target'."
      ],
      tag: "DEEPAR SÉRIES TEMPORELLES"
    },
    {
      title: "Amazon SageMaker Linear Learner : Régression et Optimisation du Seuil F1",
      lead: "Comment Linear Learner optimise-t-il automatiquement le seuil de décision pour la classification binaire ?",
      heading: "Modèles Linéaires Évolutifs et Réglage Automatique de Seuil",
      body: "SageMaker Linear Learner entraîne simultanément plusieurs modèles linéaires avec différentes configurations de descente de gradient et sélectionne automatiquement le meilleur. Pour la classification binaire (predictor_type='binary_classifier'), il teste de multiples seuils de probabilité pour maximiser l'objectif demandé (par exemple maximiser le score F1 à un niveau de précision donné), évitant le seuil arbitraire de 0.5.",
      m1: { label: "Tâches Supportées", value: "Régression & Classification", desc: "Supporte la régression linéaire et la régression logistique binaire/multiclasse." },
      m2: { label: "Normalisation", value: "Automatique par Défaut", desc: "Centre et réduit automatiquement les features sans prétraitement manuel." },
      m3: { label: "Optimisation de Seuil", value: "binary_classifier_model_selection", desc: "Calibre le seuil optimal pour maximiser le F1-Score sur le jeu de validation." },
      rules: [
        "1. Pour une baseline linéaire rapide et scalable avec régularisation L1/L2 intégrée, utiliser Linear Learner.",
        "2. Linear Learner accepte les formats RecordIO-Protobuf et CSV."
      ],
      tag: "LINEAR LEARNER"
    },
    {
      title: "Amazon SageMaker Random Cut Forest (RCF) : Détection d'Anomalies Non Supervisée",
      lead: "Comment détecter des pics suspects de température ou des transactions frauduleuses sans données étiquetées ?",
      heading: "Forêt d'Arbres de Coupes Aléatoires pour Séries et Flux",
      body: "SageMaker Random Cut Forest (RCF) est un algorithme non supervisé qui construit une forêt d'arbres de partitionnement aléatoire. Pour chaque point de données, RCF calcule un 'Anomaly Score' proportionnel à l'effort nécessaire pour isoler ce point : les points anormaux requièrent beaucoup moins de coupes que les points normaux. Les scores supérieurs à 3 écarts-types au-dessus de la moyenne indiquent typiquement une anomalie.",
      m1: { label: "Non Supervisé", value: "Aucun Label Requis", desc: "Fonctionne sans données préalables de fraudes ou pannes étiquetées." },
      m2: { label: "Temps Réel & Batch", value: "Streaming Kinesis & S3", desc: "Très efficace en streaming temps réel via Kinesis Data Analytics." },
      m3: { label: "Interprétation Score", value: "Score > 3σ = Anomalie", desc: "Plus le score est élevé, plus le point s'écarte de la distribution normale." },
      rules: [
        "1. Dès qu'une question évoque la détection d'anomalies non supervisée sur flux de données : choisir Random Cut Forest.",
        "2. Pour intégrer l'historique temporel dans RCF, utiliser une fenêtre glissante de décalages temporels (time lag window)."
      ],
      tag: "RANDOM CUT FOREST (RCF)"
    },
    {
      title: "Factorization Machines (FM) : Systèmes de Recommandation à Haute Dimension Creuse",
      lead: "Quel algorithme SageMaker est spécialement taillé pour prédire le taux de clic (CTR) sur des matrices utilisateurs-articles gigantesques et creuses ?",
      heading: "Modélisation des Interactions de Caractéristiques d'Ordre 2",
      body: "Factorization Machines (FM) est conçu pour les problèmes à très haute dimensionnalité où la majorité des entrées sont nulles (matrices creuses créées par encodage One-Hot de millions d'utilisateurs et de produits). FM capture les interactions deux-à-deux entre toutes les caractéristiques en factorisant la matrice de covariance en vecteurs latents de dimension k, calculant les interactions en complexité linéaire O(k·d).",
      m1: { label: "Cas d'Usage Phares", value: "Recommandation & CTR", desc: "Moteurs de recommandation e-commerce et prédiction de clics publicitaires." },
      m2: { label: "Format Requis", value: "RecordIO-Protobuf Float32", desc: "Optimisé exclusivement pour les tenseurs creux RecordIO." },
      m3: { label: "Complexité", value: "Linéaire O(k·d)", desc: "Permet de traiter des milliards de combinaisons sans explosion mémoire." },
      rules: [
        "1. Si la question mentionne 'système de recommandation' ou 'matrice creuse utilisateur-article avec One-Hot géant' : choisir Factorization Machines.",
        "2. Ne pas utiliser FM sur des données denses de petite dimension (XGBoost y est bien plus adapté)."
      ],
      tag: "FACTORIZATION MACHINES"
    },
    {
      title: "Amazon SageMaker BlazingText : FastText Supervisé et Word2Vec",
      lead: "Comment classifier des milliards de documents textuels ou apprendre des plongements de mots 10x plus vite que standard ?",
      heading: "Traitement Textuel Haute Performance GPU/Multi-CPU",
      body: "SageMaker BlazingText implémente une version ultra-optimisée de FastText et Word2Vec. En mode supervisé, il réalise la classification de documents textuels (sentiment, catégories d'articles) à des vitesses record en exploitant les GPU et CPU multi-cœurs. En mode non supervisé, il génère des représentations vectorielles (Word Embeddings) avec les architectures Skip-gram, CBOW ou Batch Skip-gram.",
      m1: { label: "Mode Supervisé", value: "Classification de Texte", desc: "Attend des données avec préfixe '__label__' devant chaque catégorie." },
      m2: { label: "Mode Non Supervisé", value: "Word2Vec (Skip-gram/CBOW)", desc: "Apprend la sémantique vectorielle des mots à partir d'un texte brut." },
      m3: { label: "Vitesse", value: "GPU Multi-Threads", desc: "Jusqu'à 10x plus rapide que les implémentations CPU classiques de FastText." },
      rules: [
        "1. Pour la classification rapide de texte sur AWS, formater les fichiers avec le préfixe '__label__nomdelaclasse texte du document'.",
        "2. BlazingText gère nativement les mots hors vocabulaire (OOV - Out Of Vocabulary) grâce aux sous-mots (subwords)."
      ],
      tag: "BLAZINGTEXT"
    },
    {
      title: "Algorithmes de Détection et Segmentation Visuelle : SSD vs ResNet vs DeepLabV3",
      lead: "Comment choisir le bon algorithme SageMaker intégré selon le niveau de précision visuelle recherché ?",
      heading: "Les 3 Piliers de la Vision par Ordinateur dans SageMaker",
      body: "SageMaker propose : 1. Image Classification (ResNet pré-entraîné sur ImageNet pour attribuer une étiquette globale à l'image) ; 2. Object Detection (Single Shot MultiBox Detector SSD combiné à un backbone VGG ou ResNet pour prédire les boîtes englobantes et classes d'objets) ; 3. Semantic Segmentation (DeepLabV3, PSPNet ou FCN pour classer chaque pixel individuellement).",
      m1: { label: "Image Classification", value: "ResNet (Transfer Learning)", desc: "Prédit une étiquette globale parmi des milliers de catégories." },
      m2: { label: "Object Detection", value: "SSD (Single Shot Detector)", desc: "Localise plusieurs objets avec coordonnées de Bounding Boxes et scores." },
      m3: { label: "Semantic Segmentation", value: "DeepLabV3 / PSPNet", desc: "Produit un masque de segmentation au niveau du pixel individuel." },
      rules: [
        "1. Si la question mentionne 'détection d'objets avec boîtes englobantes et coordonnées' : choisir Object Detection (SSD).",
        "2. Pour le découpage exact des contours de tumeurs sur radios médicales : choisir Semantic Segmentation."
      ],
      tag: "VISION SAGEMAKER"
    },
    {
      title: "Régularisation Deep Learning : L1 (Lasso) vs L2 (Ridge) vs Dropout",
      lead: "Quelle technique de régularisation conduit à des vecteurs de poids épars (sparsity) pour la sélection automatique de variables ?",
      heading: "Techniques de Régularisation Mathématique",
      body: "La régularisation L1 (Lasso : pénalité proportionnelle à la somme des valeurs absolues Σ|w|) force de nombreux poids non essentiels à devenir strictement nuls, agissant comme un mécanisme de sélection de variables automatique (vecteur épars). La régularisation L2 (Ridge / Weight Decay : pénalité proportionnelle à Σw²) rétrécit les poids sans jamais les annuler totalement, idéal face à la multicolinéarité. Le Dropout désactive aléatoirement un pourcentage de neurones à chaque époque d'entraînement pour forcer les représentations distribuées.",
      m1: { label: "L1 (Lasso)", value: "Éparsité (Poids = 0)", desc: "Élimine les variables inutiles ; idéal pour réduire la dimension." },
      m2: { label: "L2 (Ridge)", value: "Rétrécissement des Poids", desc: "Stabilise les modèles en présence de variables corrélées." },
      m3: { label: "Dropout", value: "Désactivation Aléatoire (ex: 0.2 - 0.5)", desc: "Désactive des neurones pour éviter la co-adaptation dans les réseaux profonds." },
      rules: [
        "1. Pour sélectionner automatiquement les caractéristiques les plus prédictives : appliquer la régularisation L1.",
        "2. Le Dropout s'applique UNIQUEMENT pendant l'entraînement, JAMAIS lors de l'inférence."
      ],
      tag: "RÉGULARISATION DEEP LEARNING"
    },
    {
      title: "Compromis Précision vs Rappel et Métriques de Validation (AUC-ROC vs PR-AUC)",
      lead: "Quelle métrique privilégier pour évaluer un modèle de détection de fraude où seulement 0.1% des transactions sont frauduleuses ?",
      heading: "Évaluation sur Classes Fortement Déséquilibrées",
      body: "L'AUC-ROC (Area Under ROC Curve) mesure le taux de vrais positifs vs faux positifs à travers tous les seuils. Cependant, en cas de fort déséquilibre de classes (ex: 99.9% de transactions normales), l'AUC-ROC peut rester artificiellement très élevée (ex: 0.98) même avec un modèle médiocre. La courbe PR-AUC (Precision-Recall AUC) est la métrique officielle à privilégier car elle ignore les vrais négatifs massifs et se concentre exclusivement sur la détection exacte de la classe minoritaire.",
      m1: { label: "Classes Équilibrées", value: "AUC-ROC", desc: "Capacité globale de discrimination du modèle sur les deux classes." },
      m2: { label: "Classes Déséquilibrées", value: "PR-AUC (Precision-Recall)", desc: "Métrique de référence pour la fraude, les pannes et les maladies rares." },
      m3: { label: "F1-Score", value: "2*(P*R)/(P+R)", desc: "Moyenne harmonique équilibrant précision et rappel sur un seuil donné." },
      rules: [
        "1. Question classique MLS-C01 : Face à un dataset asymétrique (fraude), remplacer l'AUC-ROC et l'Accuracy par PR-AUC ou F1-Score.",
        "2. Si le coût d'un faux négatif est catastrophique (manquer une tumeur), maximiser le Rappel (Recall)."
      ],
      tag: "MÉTRIQUES DE VALIDATION"
    },
    {
      title: "Optimisation Automatique des Hyperparamètres (SageMaker AMT)",
      lead: "Pourquoi l'optimisation bayésienne est-elle bien plus efficace que la recherche par grille (Grid Search) pour tuner un modèle ?",
      heading: "Recherche Bayésienne vs Random Search dans SageMaker",
      body: "SageMaker Automatic Model Tuning (AMT) supporte : 1. La recherche Bayésienne (Bayesian Optimization) qui traite le tuning comme un processus gaussien, analysant les résultats des essais précédents pour deviner mathématiquement la prochaine combinaison d'hyperparamètres la plus prometteuse ; 2. Random Search qui explore aléatoirement l'espace d'hyperparamètres (très efficace pour paralléliser de nombreux jobs simultanés) ; 3. Hyperband pour arrêter prématurément les essais peu performants.",
      m1: { label: "Optimisation Bayésienne", value: "Apprentissage Itératif", desc: "Chaque nouvel essai s'appuie sur les apprentissages des essais précédents." },
      m2: { label: "Random Search", value: "Parallélisme Massif", desc: "Idéal si on dispose de nombreux GPU pour lancer 50 jobs en même temps." },
      m3: { label: "Objectif Tuning", value: "Métrique Cible Unique", desc: "Ex: 'maximize: validation:auc' ou 'minimize: validation:rmse'." },
      rules: [
        "1. Pour l'optimisation bayésienne, limiter le nombre de jobs simultanés (max_parallel_jobs) pour laisser l'algorithme apprendre des résultats passés.",
        "2. Définir des plages logarithmiques (Logarithmic scaling) pour les hyperparamètres comme le learning rate (0.001 à 0.1)."
      ],
      tag: "HYPERPARAMETER TUNING"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'XGBOOST TUNING & OVERFITTING',
    'DEEPAR SÉRIES TEMPORELLES',
    'LINEAR LEARNER SEUIL F1',
    'RANDOM CUT FOREST ANOMALIES',
    'FACTORIZATION MACHINES CTR',
    'BLAZINGTEXT NLP RAPIDE',
    'VISION OBJECT DETECTION SSD',
    'RÉGULARISATION L1/L2 & DROPOUT',
    'MÉTRIQUES AUC-ROC VS PR-AUC',
    'AUTOMATIC MODEL TUNING BAYÉSIEN'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-mlsc01-d3-${String(num).padStart(3, '0')}`,
    category: `MLS-C01 • DOMAINE 3 • ${subCategory}`,
    categoryBadgeColor: '#7c3aed',
    levelTag: `MLS-C01 • D3 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 36%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[MLS-C01 D3-#${num}] ${baseTopic.title} (Question Modélisation #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Cœur de l'examen AWS MLS-C01 (Domaine 3 : 36% de la note globale).`,
    solutionHeading: `${baseTopic.heading} - Référentiel Algorithmes SageMaker`,
    solutionBody: `${baseTopic.body} Le Domaine 3 est le pilier central de la certification AWS Machine Learning Specialty. L'examen exige de choisir le bon algorithme parmi les 17 intégrés de SageMaker et de maîtriser ses hyperparamètres de régularisation.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé MLS-C01 D3 : Pour les problèmes d'entraînement distribué multi-GPU, utiliser les bibliothèques SageMaker Distributed Training (Data Parallelism / Model Parallelism).`
    ],
    deckName: "AWS MLS-C01 : Domaine 3 - Modélisation (Modeling)",
    domainId: 'domain3',
    domainName: "3. Modélisation (Modeling)",
    certCode: 'MLS-C01',
  };
});
