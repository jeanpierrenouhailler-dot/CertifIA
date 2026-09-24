import { Flashcard } from '../../types';

// AWS MLS-C01 - Domaine 2 : Analyse exploratoire des données (EDA) (100 Flashcards)
// Poids officiel de l'examen AWS Certified Machine Learning - Specialty : 24%
export const mlsc01Domain2Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `MLS-D2-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Gestion des Valeurs Manquantes : Imputation par Moyenne vs Médiane vs Mode",
      lead: "Quelle stratégie d'imputation choisir pour une variable numérique continue présentant une forte asymétrie (skewness) et des valeurs aberrantes ?",
      heading: "Stratégies d'Imputation Robustes",
      body: "La moyenne arithmétique est fortement distordue par les valeurs aberrantes (outliers) et ne doit être utilisée que pour des distributions normales symétriques. Pour une distribution asymétrique (ex: revenus, prix de maisons), l'imputation par la MÉDIANE est la méthode standard la plus robuste car elle résiste aux valeurs extrêmes. Le MODE est utilisé pour imputer les variables catégorielles avec la modalité la plus fréquente.",
      m1: { label: "Moyenne (Mean)", value: "Distribution Normale", desc: "Sensible aux valeurs extrêmes ; distord la tendance centrale en cas d'asymétrie." },
      m2: { label: "Médiane (Median)", value: "Distribution Asymétrique", desc: "Recommandation officielle AWS pour données réelles bruitées." },
      m3: { label: "Indicateur Booléen", value: "Flag 'is_missing'", desc: "Bonne pratique : ajouter une colonne binaire indiquant si la donnée a été imputée." },
      rules: [
        "1. Si la distribution est étirée vers la droite (skewed right) avec des outliers, TOUJOURS imputer par la médiane.",
        "2. Si plus de 70-80% des valeurs d'une colonne sont manquantes, supprimer la colonne (drop feature) plutôt que d'imputer."
      ],
      tag: "VALEURS MANQUANTES"
    },
    {
      title: "Détection et Traitement des Valeurs Aberrantes (Outliers) : IQR vs Z-Score",
      lead: "Comment identifier formellement des points aberrants dans un jeu de données sans présumer d'une distribution normale ?",
      heading: "Méthodes IQR (Interquartile Range) et Z-Score",
      body: "La méthode de l'écart interquartile (IQR = Q3 - Q1) est non paramétrique : tout point situé en dessous de Q1 - 1.5 * IQR ou au-dessus de Q3 + 1.5 * IQR est considéré comme aberrant. La méthode du Z-score calcule l'écart à la moyenne en nombre d'écarts-types (z = (x - μ) / σ), avec un seuil typique de |z| > 3, mais elle suppose une distribution gaussienne sous-jacente. Pour les données multidimensionnelles, l'algorithme Random Cut Forest (RCF) de SageMaker est idéal.",
      m1: { label: "Seuil IQR", value: "Q1 - 1.5*IQR / Q3 + 1.5*IQR", desc: "Méthode des boîtes à moustaches (box plots), robuste et sans hypothèse normale." },
      m2: { label: "Seuil Z-Score", value: "|z| > 3", desc: "Identifie les 0.27% de points les plus extrêmes dans une loi normale." },
      m3: { label: "Winsorisation", value: "Clamping aux Percentiles", desc: "Remplace les valeurs extrêmes par le 1er ou 99e percentile sans supprimer les lignes." },
      rules: [
        "1. Ne supprimez pas aveuglément les outliers s'ils correspondent à des fraudes réelles (la fraude EST une anomalie).",
        "2. Pour des modèles d'arbres de décision (XGBoost, Random Forest), les outliers sur les features ont très peu d'impact négatif."
      ],
      tag: "DÉTECTION OUTLIERS"
    },
    {
      title: "Encodage des Variables Catégorielles : One-Hot vs Ordinal vs Target Encoding",
      lead: "Quel type d'encodage appliquer à une colonne 'Taille de T-Shirt' (S, M, L, XL) vs 'Code Postal' (5000 valeurs) ?",
      heading: "Conversion Numérique des Variables Catégorielles",
      body: "L'encodage ordinal (Ordinal Encoding) convient aux variables catégorielles possédant un ordre naturel intrinsèque (ex: S=1, M=2, L=3, XL=4). Le One-Hot Encoding (création de colonnes binaires 0/1) s'applique aux variables nominales sans hiérarchie (ex: Couleurs), mais engendre le 'fléau de la dimension' si la cardinalité est élevée. Pour les colonnes à haute cardinalité (ex: Code Postal), le Target Encoding ou des embeddings appris sont préconisés.",
      m1: { label: "Ordinal Encoding", value: "Ordre Respecté", desc: "Préserve la relation d'ordre (Faible < Moyen < Élevé)." },
      m2: { label: "One-Hot Encoding", value: "Faible Cardinalité", desc: "Risque de matrice creuse géante si nombre de classes > 50." },
      m3: { label: "Target Encoding", value: "Moyenne du Label", desc: "Remplacé par la moyenne de la cible ; nécessite un lissage anti-overfitting." },
      rules: [
        "1. N'utilisez JAMAIS l'Ordinal Encoding sur des catégories sans ordre (ex: Rouge=1, Vert=2, Bleu=3 induirait une fausse relation 3 > 1).",
        "2. Pour l'algorithme XGBoost, One-Hot Encoding est obligatoire sur les données textuelles catégorielles."
      ],
      tag: "ENCODAGE CATÉGORIEL"
    },
    {
      title: "Mise à l'Échelle des Features : StandardScaler vs MinMaxScaler vs RobustScaler",
      lead: "Pourquoi et quand faut-il normaliser les caractéristiques numériques avant l'entraînement ?",
      heading: "Normalisation et Standardisation des Features",
      body: "Les algorithmes basés sur le calcul de distances (K-Means, KNN, SVM, PCA) et les réseaux de neurones sont biaisés par les variables aux ordres de grandeur massifs (ex: Salaire de 50 000 € écrasant l'Âge de 35 ans). StandardScaler centre sur 0 avec un écart-type de 1. MinMaxScaler compresse les valeurs entre 0 et 1 (sensible aux outliers). RobustScaler utilise la médiane et l'IQR, idéal en présence de valeurs aberrantes.",
      m1: { label: "StandardScaler", value: "z = (x - μ) / σ", desc: "Moyenne = 0, Écart-type = 1 ; indispensable pour PCA et descente de gradient." },
      m2: { label: "MinMaxScaler", value: "(x - min) / (max - min)", desc: "Échelle [0, 1] ; requis pour les images ou réseaux avec activations Sigmoïde." },
      m3: { label: "Arbres de Décision", value: "Invulnérables à l'Échelle", desc: "XGBoost et Random Forest ne nécessitent AUCUNE mise à l'échelle des données." },
      rules: [
        "1. Règle d'or MLOps : Toujours calculer μ et σ sur le train set SEULEMENT, puis appliquer ces mêmes paramètres au test set.",
        "2. Si la question implique K-Means ou PCA, la normalisation préalable est une étape obligatoire."
      ],
      tag: "FEATURE SCALING"
    },
    {
      title: "Transformations Non Linéaires : Log Transform, Box-Cox et Yeo-Johnson",
      lead: "Comment transformer une variable à distribution exponentielle fortement étirée pour satisfaire les hypothèses de régression linéaire ?",
      heading: "Stabilisation de Variance et Rapprochement de la Normalité",
      body: "Les modèles linéaires supposent l'homoscédasticité et la normalité des résidus. Lorsque les données sont fortement asymétriques à droite (right-skewed, ex: prix, volumes de vente), la transformation logarithmique log(x + 1) compresse les grandes valeurs et symétrise la courbe. La transformation Box-Cox trouve le paramètre optimal λ pour transformer vers une loi normale (applicable uniquement sur x > 0). Yeo-Johnson permet la même optimisation sur des valeurs négatives ou nulles.",
      m1: { label: "Log Transform", value: "y = log(x + 1)", desc: "Élimine l'asymétrie droite et stabilise la variance." },
      m2: { label: "Box-Cox", value: "Optimisation de λ (x > 0)", desc: "Transformation paramétrique continue vers la gaussianité." },
      m3: { label: "Yeo-Johnson", value: "Supporte x ≤ 0", desc: "Extension moderne de Box-Cox compatible avec les nombres négatifs." },
      rules: [
        "1. Pour prédire un montant positif avec de très gros écarts (prix de vente), appliquer log1p(y) avant l'entraînement.",
        "2. Penser à appliquer l'exponentielle inverse exp(y) - 1 lors de l'évaluation finale des prédictions."
      ],
      tag: "TRANSFORMATIONS DE DONNÉES"
    },
    {
      title: "Réduction de Dimension : PCA (Principal Component Analysis)",
      lead: "Comment réduire 200 variables corrélées en 10 composantes indépendantes tout en conservant 95% de l'information ?",
      heading: "Extraction de Caractéristiques par Décomposition Linéaire",
      body: "L'Analyse en Composantes Principales (PCA) est une méthode d'apprentissage non supervisé qui projette les données sur de nouveaux axes orthogonaux (les composantes principales) maximisant la variance expliquée. Chaque composante est une combinaison linéaire des features d'origine, non corrélée aux autres. SageMaker inclut un algorithme PCA intégré optimisé (mode 'regular' ou 'randomized').",
      m1: { label: "Hypothèse Clé", value: "Standardisation Obligatoire", desc: "Les données doivent impérativement être centrées et réduites avant PCA." },
      m2: { label: "Variance Expliquée", value: "Explained Variance Ratio", desc: "On choisit le nombre de composantes k capturant par exemple 90% ou 95% de la variance." },
      m3: { label: "Non Supervisé", value: "Ignore les Labels", desc: "PCA ne prend en compte que la matrice de covariance des features x." },
      rules: [
        "1. Si des variables sont fortement colinéaires (multicolinéarité), appliquer PCA pour éliminer la redondance.",
        "2. Inconvénient de PCA : perte de l'interprétabilité directe des variables d'origine pour les métiers."
      ],
      tag: "PCA & RÉDUCTION DIMENSION"
    },
    {
      title: "Visualisation Non Linéaire : t-SNE vs PCA",
      lead: "Pourquoi t-SNE est-il le choix de référence pour visualiser des clusters de données complexes en 2D ?",
      heading: "Préservation des Voisinages Locaux en Basse Dimension",
      body: "t-SNE (t-Distributed Stochastic Neighbor Embedding) est une technique non linéaire optimisée pour projeter des espaces à haute dimension vers 2D ou 3D à des fins de visualisation humaine. Contrairement à PCA qui préserve la structure globale et les grandes distances, t-SNE préserve les voisinages locaux (les points proches restent proches). Cependant, t-SNE est non déterministe, coûteux en calcul et ne doit PAS être utilisé comme étape de preprocessing pour un modèle de prédiction.",
      m1: { label: "Objectif t-SNE", value: "Visualisation 2D / 3D", desc: "Révèle visuellement la présence de clusters et structures non linéaires." },
      m2: { label: "Hyperparamètre", value: "Perplexité (Perplexity)", desc: "Équilibre l'attention entre les aspects locaux et globaux des données." },
      m3: { label: "Contrainte Examen", value: "Ne pas utiliser pour inférence", desc: "t-SNE ne permet pas de projeter facilement de nouveaux points de test non vus." },
      rules: [
        "1. Question piège examen MLS-C01 : N'utilisez JAMAIS t-SNE pour réduire les dimensions d'un dataset avant un modèle de production.",
        "2. Utiliser t-SNE uniquement pour l'exploration et la visualisation de clusters dans des notebooks."
      ],
      tag: "T-SNE & VISUALISATION"
    },
    {
      title: "Prétraitement de Texte NLP : Stemming vs Lemmatisation & TF-IDF",
      lead: "Comment nettoyer et vectoriser un corpus textuel pour alimenter un algorithme de classification d'avis clients ?",
      heading: "Pipeline de Préparation Textuelle Traditionnel",
      body: "Les étapes clés sont : 1. Tokenisation et mise en minuscules ; 2. Suppression des stop words (mots grammaticaux non porteurs de sens) ; 3. Réduction morphologique : le Stemming tronque brutalement les suffixes par règles heuristiques (ex: 'running' -> 'run', 'studies' -> 'studi'), tandis que la Lemmatisation s'appuie sur le dictionnaire et le rôle grammatical (POS tagging) pour retourner le vrai lemme (ex: 'better' -> 'good') ; 4. Vectorisation TF-IDF qui pondère la fréquence d'un terme par sa rareté dans l'ensemble des documents.",
      m1: { label: "Stemming", value: "Troncature Heuristique", desc: "Rapide et léger, mais produit parfois des mots inexistants dans la langue." },
      m2: { label: "Lemmatisation", value: "Base Dictionnaire Morphologique", desc: "Plus précise et sémantiquement correcte, mais plus lente en calcul." },
      m3: { label: "TF-IDF", value: "Fréquence × Rareté Document", desc: "Pondère fortement les termes distinctifs d'un document spécifique." },
      rules: [
        "1. Pour préserver le sens linguistique exact dans l'analyse de sentiment, préférer la lemmatisation au stemming.",
        "2. Pour capturer les négations ('pas bon', 'ne jamais'), utiliser des N-grams (bi-grams ou tri-grams) avec TF-IDF."
      ],
      tag: "TEXT PREPROCESSING"
    },
    {
      title: "Augmentation de Données d'Images pour la Vision par Ordinateur",
      lead: "Comment éviter le surapprentissage (overfitting) lorsqu'on n'a que 500 images pour entraîner un modèle de classification ?",
      heading: "Expansion Artificielle du Dataset Visuel",
      body: "L'augmentation de données (Data Augmentation) génère de nouvelles variations d'images d'entraînement sans collecter de nouvelles photos : retournement horizontal (flip), rotations aléatoires (ex: ±15°), recadrage aléatoire (random crop), ajustement de la luminosité et du contraste (color jitter), ajout de bruit gaussien. Cela force les réseaux neuronaux convolutifs (CNN) à apprendre des caractéristiques invariantes aux transformations spatiales.",
      m1: { label: "Techniques Majeures", value: "Flip, Crop, Rotation, Jitter", desc: "Multiplie artificiellement par 5 à 10 la taille du dataset d'entraînement." },
      m2: { label: "Contrainte Métier", value: "Invariance du Label", desc: "Ne jamais faire de flip vertical sur des chiffres manuscrits (ex: 6 deviendrait 9 !)." },
      m3: { label: "Objectif Clé", value: "Généralisation & Anti-Overfitting", desc: "Améliore considérablement le score de validation sur données réelles." },
      rules: [
        "1. L'augmentation de données d'image s'applique UNIQUEMENT sur le jeu d'entraînement, jamais sur le jeu de test.",
        "2. Toujours vérifier que la transformation ne modifie pas le label sémantique de l'objet."
      ],
      tag: "IMAGE AUGMENTATION"
    },
    {
      title: "Détection des Biais Pré-Entraînement avec Amazon SageMaker Clarify",
      lead: "Comment mesurer mathématiquement si un dataset d'octroi de prêt contient un biais envers un groupe protégé avant d'entraîner le modèle ?",
      heading: "Audit d'Équité et Métriques de Biais dans SageMaker Clarify",
      body: "SageMaker Clarify calcule des métriques de biais sur les données brutes avant l'apprentissage : 1. CI (Class Imbalance) : mesure le déséquilibre de représentation du groupe protégé (ex: femmes vs hommes) ; 2. DPL (Difference in Positive Proportions in Labels) : compare la proportion d'attributions favorables historiques entre les groupes (ex: si le groupe favorisé a reçu 80% de prêts accordés contre 40% pour le groupe défavorisé, DPL = 0.40, signalant un biais historique majeur).",
      m1: { label: "CI (Class Imbalance)", value: "(n_a - n_d) / (n_a + n_d)", desc: "Déséquilibre de volume d'échantillons entre facette favorisée et défavorisée." },
      m2: { label: "DPL (Diff Positive Prop)", value: "q_a - q_d", desc: "Mesure l'écart d'attribution d'étiquettes positives ; 0 indique l'égalité parfaite." },
      m3: { label: "Rapport PDF / JSON", value: "Export Automatique", desc: "Génération de rapports d'audit de conformité pour les régulateurs financiers." },
      rules: [
        "1. Pour auditer les biais sur les données avant l'entraînement sur AWS, le service officiel est SageMaker Clarify.",
        "2. Si DPL est significativement différent de 0, équilibrer les données (sur-échantillonnage SMOTE ou repondération)."
      ],
      tag: "SAGEMAKER CLARIFY BIAIS"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'IMPUTATION VALEURS MANQUANTES',
    'OUTLIERS IQR & Z-SCORE',
    'ENCODAGE ONE-HOT & ORDINAL',
    'FEATURE SCALING & NORMALISATION',
    'LOG TRANSFORM & BOX-COX',
    'PCA RÉDUCTION DE DIMENSION',
    'T-SNE EXPLORATION VISUELLE',
    'TEXT NLP LEMMATISATION & TF-IDF',
    'IMAGE AUGMENTATION CNN',
    'SAGEMAKER CLARIFY BIAIS PRE-TRAIN'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-mlsc01-d2-${String(num).padStart(3, '0')}`,
    category: `MLS-C01 • DOMAINE 2 • ${subCategory}`,
    categoryBadgeColor: '#059669',
    levelTag: `MLS-C01 • D2 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 24%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[MLS-C01 D2-#${num}] ${baseTopic.title} (Scénario EDA #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Compétence fondamentale du Domaine 2 (EDA) pour l'examen AWS MLS-C01.`,
    solutionHeading: `${baseTopic.heading} - Méthodologie Data Science AWS`,
    solutionBody: `${baseTopic.body} L'analyse exploratoire et le feature engineering (24% de l'examen) conditionnent directement la qualité des modèles. Les questions mettent en situation des choix d'imputation, d'encodage et de mise à l'échelle.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé MLS-C01 D2 : Les transformations de données (StandardScaler, Imputer) doivent être fittées sur le train set et appliquées via des pipelines d'inférence pour éviter toute fuite de données.`
    ],
    deckName: "AWS MLS-C01 : Domaine 2 - Analyse exploratoire des données",
    domainId: 'domain2',
    domainName: "2. Analyse exploratoire des données (EDA)",
    certCode: 'MLS-C01',
  };
});
