import { Flashcard } from '../../types';

// Google Cloud GCP-PMLE - Domaine 3 : Développer et entraîner des modèles de ML (100 Flashcards)
// Poids officiel de l'examen Professional Machine Learning Engineer : 25% (Le plus lourd de l'examen !)
export const gcpmleDomain3Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `GCP-D3-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Vertex AI Custom Training : Conteneurs Pré-construits vs Conteneurs Personnalisés",
      lead: "Quand faut-il créer son propre conteneur Docker sur Artifact Registry plutôt que d'utiliser une image de conteneur fournie par Google Cloud ?",
      heading: "Choix de l'Environnement d'Exécution sur Vertex AI",
      body: "Vertex AI propose deux modes de conteneurisation pour l'entraînement : 1. Conteneurs pré-construits (Pre-built Containers) : images maintenues et optimisées par Google pour TensorFlow, PyTorch, Scikit-learn et XGBoost ; vous fournissez simplement votre code Python sous forme de package source (`python_package`) sans jamais manipuler Docker. À privilégier par défaut ; 2. Conteneurs personnalisés (Custom Containers) : obligatoires si vous devez compiler des dépendances C++/CUDA non standard, installer des packages système complexes sous Ubuntu, ou exécuter un framework alternatif (ex: HuggingFace Optimum, JAX avec extensions propriétaires). L'image est construite et poussée sur Google Artifact Registry.",
      m1: { label: "Pre-built Containers", value: "Code Python Seul", desc: "Zéro gestion Docker, patchs de sécurité et drivers GPU maintenus par Google." },
      m2: { label: "Custom Containers", value: "Dockerfile sur Artifact Registry", desc: "Contrôle total sur l'OS, les binaires natifs et les versions de bibliothèques." },
      m3: { label: "Variables AIP_*", value: "AIP_MODEL_DIR & Checkpoints", desc: "Vertex AI injecte automatiquement les chemins Cloud Storage cibles." },
      rules: [
        "1. Toujours privilégier les conteneurs pré-construits Google si les dépendances tiennent dans un simple `requirements.txt`.",
        "2. Le modèle final doit être sauvegardé dans le répertoire indiqué par la variable d'environnement `AIP_MODEL_DIR`."
      ],
      tag: "VERTEX AI CUSTOM TRAINING"
    },
    {
      title: "Entraînement Distribué : Data Parallelism et MultiWorkerMirroredStrategy",
      lead: "Comment distribuer l'entraînement d'un grand modèle TensorFlow sur 8 machines contenant chacune 4 GPU NVIDIA A100 sur Vertex AI ?",
      heading: "Parallélisme de Données Synchrone Multi-Nœuds avec TF_CONFIG",
      body: "Pour entraîner sur des données massives réparties sur plusieurs machines : 1. Data Parallelism (Parallélisme de Données) : chaque GPU possède une copie intégrale des poids du modèle et traite un sous-batch différent ; 2. `tf.distribute.MultiWorkerMirroredStrategy` : synchronise les gradients entre tous les nœuds via un anneau All-Reduce ultra-rapide (NVIDIA NCCL) ; 3. Configuration automatique : Vertex AI génère et injecte dynamiquement la variable d'environnement `TF_CONFIG` sur chaque nœud (indiquant l'adresse IP et le rôle de chaque machine `chief` vs `worker`) sans nécessiter de script de découverte manuel par l'ingénieur.",
      m1: { label: "MultiWorkerMirrored", value: "Multi-Machines Multi-GPU", desc: "All-reduce synchrone avec tolérance aux pannes sur réseau haut débit." },
      m2: { label: "TF_CONFIG", value: "Géré Automatiquement par Vertex", desc: "Contient le cluster spec et les adresses IP internes des workers." },
      m3: { label: "Backend NCCL", value: "Communication GPU Directe", desc: "Bande passante maximale entre cartes graphiques sans passage par le CPU hôte." },
      rules: [
        "1. Pour du multi-nœud TensorFlow sur GCP : utiliser MultiWorkerMirroredStrategy avec la variable TF_CONFIG fournie par Vertex AI.",
        "2. S'assurer que la taille globale du batch (Global Batch Size) soit multipliée par le nombre total de GPUs déployés."
      ],
      tag: "ENTRAÎNEMENT DISTRIBUÉ TF"
    },
    {
      title: "Optimisation Bayésienne d'Hyperparamètres avec Vertex AI Vizier",
      lead: "Pourquoi l'optimisation bayésienne de Vertex AI Vizier est-elle infiniment supérieure à la recherche par grille (Grid Search) pour calibrer un modèle lourd ?",
      heading: "Exploration Intelligente de l'Espace des Paramètres et Arrêt Précoce",
      body: "La recherche par grille (Grid Search) teste aveuglément toutes les combinaisons possibles, gaspillant des milliers d'heures de calcul GPU. Vertex AI Vizier utilise l'optimisation bayésienne (Processus Gaussiens) : 1. Il construit un modèle probabiliste de la fonction objectif liant hyperparamètres et métrique de validation ; chaque nouvel essai est sélectionné là où l'amélioration attendue est maximale ; 2. Règles d'arrêt précoce (Median Stopping Rule) : Vizier évalue les courbes d'apprentissage en cours de route et termine prématurément les essais dont la performance est inférieure à la médiane des essais précédents, économisant jusqu'à 70% du budget de calcul.",
      m1: { label: "Optimisation Bayésienne", value: "Apprentissage sur Essais Passés", desc: "Converge vers les meilleurs hyperparamètres avec 10x moins d'itérations." },
      m2: { label: "Median Stopping Rule", value: "Arrêt Automatique des Essais Nuls", desc: "Tue immédiatement les entraînements sous-performants dès les premières époques." },
      m3: { label: "Métrique Objective", value: "Maximiser AUC / Minimiser Loss", desc: "Gère l'optimisation mono-objectif ou multi-objectifs (ex: précision vs latence)." },
      rules: [
        "1. Règle d'examen : Ne jamais utiliser Grid Search sur des modèles de Deep Learning ; toujours choisir l'optimisation bayésienne Vertex Vizier.",
        "2. Activer la règle d'arrêt anticipé (Early Stopping / Median Stopping) pour diviser drastiquement les coûts de calcul GPU."
      ],
      tag: "VERTEX AI VIZIER TUNING"
    },
    {
      title: "Fine-Tuning Efficace des Modèles de Langage avec LoRA (Low-Rank Adaptation)",
      lead: "Comment adapter un modèle géant de 70 milliards de paramètres à votre vocabulaire interne sans ré-entraîner l'intégralité de ses poids sur 64 GPU ?",
      heading: "Parameter-Efficient Fine-Tuning (PEFT) par Décomposition de Rang Réduit",
      body: "Le Fine-Tuning intégral (Full Fine-Tuning) d'un grand LLM est prohibitif en coût et risque l'oubli catastrophique (Catastrophic Forgetting). LoRA (Low-Rank Adaptation) gèle tous les poids d'origine du modèle de base ($W_0$) et injecte deux petites matrices de rang réduit entraînables $A$ et $B$ dans les couches d'attention ($W = W_0 + B \times A$) : 1. Si $W_0$ est de taille $4096 \times 4096$ (16M paramètres), avec un rang $r = 8$, les matrices $A$ et $B$ n'ont que $2 \times 4096 \times 8 = 65 536$ paramètres (réduction de 99.6% des poids modifiés) ; 2. Réduit l'empreinte mémoire VRAM et permet d'héberger plusieurs adaptateurs LoRA sur un seul modèle de base partagé.",
      m1: { label: "Poids de Base Gelés", value: "Zero Catastrophic Forgetting", desc: "Le modèle conserve ses connaissances générales intactes." },
      m2: { label: "Matrices LoRA (r=8 ou 16)", value: "< 1% des Paramètres", desc: "Entraînement rapide possible sur une seule carte GPU A100." },
      m3: { label: "Déploiement Économique", value: "Multi-Adaptateurs Partagés", desc: "Bascule instantanée d'un cas d'usage à un autre en swappant l'adaptateur LoRA léger." },
      rules: [
        "1. Pour adapter un LLM avec des ressources de calcul limitées sans dégrader ses capacités de base : utiliser LoRA (PEFT).",
        "2. Les poids LoRA peuvent être fusionnés mathématiquement dans le modèle de base lors de l'export final pour zéro latence additionnelle."
      ],
      tag: "LORA & PEFT FINE-TUNING"
    },
    {
      title: "Suivi des Expériences avec Vertex AI Experiments et TensorBoard Managé",
      lead: "Comment comparer visuellement les courbes de perte, les métriques d'évaluation et les hyperparamètres de 50 essais d'entraînement menés par différents chercheurs ?",
      heading: "Traçabilité Centralisée et Analyse des Courbes d'Apprentissage",
      body: "Vertex AI Experiments fournit une interface managée pour tracer et reproduire tous les travaux de recherche : 1. Journalisation avec le SDK Python (`aiplatform.log_params`, `aiplatform.log_metrics`) : enregistre le taux d'apprentissage, le batch size, l'AUC et le temps d'exécution de chaque run ; 2. Vertex AI TensorBoard : version entièrement managée et sécurisée de l'outil open-source Google, sans serveur à héberger ; 3. TensorBoard Profiler : inspecte la ligne de temps de calcul (timeline) pour identifier si les GPU passent trop de temps inactifs à attendre des données (I/O Bottleneck) ou s'il y a saturation de mémoire VRAM.",
      m1: { label: "Vertex AI Experiments", value: "Tableau de Bord Comparatif", desc: "Compare les runs côte à côte pour identifier la meilleure configuration." },
      m2: { label: "TensorBoard Managé", value: "Visualisation Graphique Cloud", desc: "Courbes de loss, histogrammes de gradients et matrices de confusion sans installer de serveur." },
      m3: { label: "TensorBoard Profiler", value: "Diagnostic Matériel GPU/TPU", desc: "Détecte les étapes de calcul inefficaces et les goulots d'étranglement mémoire." },
      rules: [
        "1. Pour analyser pourquoi un entraînement GPU s'exécute lentement : utiliser le TensorBoard Profiler sur Vertex AI.",
        "2. Lier chaque entraînement à une expérience Vertex AI pour garantir la reproductibilité scientifique des modèles de production."
      ],
      tag: "VERTEX EXPERIMENTS & TENSORBOARD"
    },
    {
      title: "Prévention du Surapprentissage en Deep Learning : Dropout, Régularisation L2 et Early Stopping",
      lead: "Quelles techniques combinées appliquer à un réseau de neurones profond pour stopper le surapprentissage dès que la perte de validation commence à remonter ?",
      heading: "Stabilisation et Généralisation des Réseaux Profonds",
      body: "Pour garantir la capacité de généralisation d'un modèle : 1. Dropout (ex: `rate = 0.3`) : désactive aléatoirement 30% des neurones à chaque passage avant, forçant le réseau à apprendre des représentations robustes et redondantes sans co-dépendances fragiles ; 2. Régularisation L2 (Weight Decay) : ajoute la somme des carrés des poids à la fonction de perte pour empêcher les poids de prendre des valeurs démesurées ; 3. Early Stopping Callback : surveille la métrique `val_loss` avec un paramètre `patience = 5` et `restore_best_weights = True` pour interrompre l'apprentissage au point culminant et restaurer les poids optimaux.",
      m1: { label: "Dropout", value: "Désactivation Aléatoire Neurones", desc: "Désactivé automatiquement lors de l'inférence (serving)." },
      m2: { label: "Régularisation L2", value: "Pénalisation des Poids Élevés", desc: "Lisse la surface de décision pour éviter les décisions trop abruptes." },
      m3: { label: "Early Stopping", value: "Arrêt au Meilleur Équilibre", desc: "Interrompt le job dès que la performance sur données de validation régresse." },
      rules: [
        "1. Toujours spécifier `restore_best_weights=True` dans le callback EarlyStopping de TensorFlow/Keras.",
        "2. Le Dropout est actif uniquement pendant la phase d'entraînement (`training=True`) et s'éteint lors de la prédiction."
      ],
      tag: "RÉGULARISATION & EARLY STOPPING"
    },
    {
      title: "Résolution des Problèmes de Gradient : Vanishing Gradient vs Exploding Gradient",
      lead: "Comment diagnostiquer et corriger un réseau profond dont la perte devient subitement 'NaN' ou dont les premières couches n'apprennent plus rien ?",
      heading: "Stabilité Numérique de la Rétropropagation du Gradient",
      body: "Dans les réseaux profonds : 1. Vanishing Gradient (Disparition du gradient) : les gradients diminuent exponentiellement vers les premières couches en utilisant des fonctions d'activation saturantes (Sigmoïde, Tanh) ; Solution : utiliser des activations non saturantes (ReLU, LeakyReLU, GELU), l'initialisation de poids He/Xavier et des connexions résiduelles (Skip Connections de ResNet) ; 2. Exploding Gradient (Explosion du gradient) : les gradients croissent de façon démesurée, provoquant des dépassements numériques (`loss = NaN`) ; Solution : appliquer le Gradient Clipping (`clipnorm = 1.0` ou `clipvalue = 0.5`) dans l'optimiseur (Adam/SGD) et la Batch/Layer Normalization.",
      m1: { label: "Vanishing Gradient", value: "Gradients Proches de Zéro", desc: "Les premières couches du modèle cessent d'ajuster leurs poids." },
      m2: { label: "Exploding Gradient", value: "Loss = NaN ou Divergence", desc: "Les poids deviennent astronomiques, faisant planter l'entraînement." },
      m3: { label: "Gradient Clipping", value: "Écrêtage du Vecteur Gradient", desc: "Plafonne la norme maximale du gradient pour préserver la stabilité." },
      rules: [
        "1. Si la perte d'entraînement affiche brusquement 'NaN' : implémenter immédiatement le Gradient Clipping dans l'optimiseur.",
        "2. Remplacer les fonctions d'activation Sigmoïde par ReLU ou GELU dans les couches cachées des réseaux profonds."
      ],
      tag: "VANISHING & EXPLODING GRADIENTS"
    },
    {
      title: "Normalisation des Couches : Batch Normalization vs Layer Normalization",
      lead: "Pourquoi utilise-t-on la Layer Normalization plutôt que la Batch Normalization dans les architectures Transformers et le traitement du langage ?",
      heading: "Normalisation par Lot vs Normalisation par Échantillon Individuel",
      body: "1. Batch Normalization (BatchNorm) : normalise les activations sur l'ensemble du mini-lot (batch) pour chaque canal ; très efficace en vision par ordinateur (CNN), mais très instable si la taille de batch est petite ou variable, et inadaptée aux séquences de longueurs variables ; 2. Layer Normalization (LayerNorm) : normalise toutes les caractéristiques d'un SEUL échantillon indépendamment des autres éléments du lot ; parfaitement adaptée aux séquences de mots de longueurs différentes et aux batchs de taille 1. C'est le standard universel de toutes les architectures Transformers (BERT, GPT, Gemini).",
      m1: { label: "Batch Normalization", value: "Moyenne sur le Batch Entier", desc: "Standard pour les réseaux convolutifs (CNN) avec grands batchs stables." },
      m2: { label: "Layer Normalization", value: "Moyenne sur les Features d'un Échantillon", desc: "Standard obligatoire pour les Transformers et le traitement de séquences (NLP)." },
      m3: { label: "Indépendance de Batch", value: "Idéal pour Petits Batchs", desc: "LayerNorm fonctionne de façon identique avec un batch size de 1 ou de 1024." },
      rules: [
        "1. Pour tout modèle basé sur les Transformers ou le NLP séquentiel : utiliser Layer Normalization.",
        "2. BatchNorm introduit des dépendances entre les échantillons d'un lot, ce qui peut poser problème lors d'inférence temps réel unitaire."
      ],
      tag: "BATCHNORM VS LAYERNORM"
    },
    {
      title: "Format d'Exportation de Production : TensorFlow SavedModel et TorchScript",
      lead: "Comment exporter un modèle entraîné afin qu'il soit déployable sur un endpoint de production Vertex AI sans exiger le code source Python d'origine ?",
      heading: "Sérialisation Autonome et Portabilité du Graphe de Calcul",
      body: "Pour déployer un modèle en production de façon hermétique et pérenne : 1. TensorFlow SavedModel : format standard Google comprenant le graphe de calcul complet, les variables entraînées et les signatures de serving (`serving_default`) ; il est 100% indépendant du code Python d'origine et peut être exécuté par un runtime C++ haute performance (TensorFlow Serving) ; 2. PyTorch TorchScript (`torch.jit.trace` ou `torch.jit.script`) : compile le modèle PyTorch en un graphe statique sérialisable exécutable sans interpréteur Python ; 3. Stockage sur Cloud Storage : le dossier SavedModel exporté est copié sur `gs://mon-bucket/model/` pour enregistrement direct dans Vertex AI Model Registry.",
      m1: { label: "SavedModel (TF)", value: "Format Universel C++ Serving", desc: "Contient variables/, assets/ et saved_model.pb pour inférence compilée." },
      m2: { label: "TorchScript (PyTorch)", value: "JIT Trace / Script", desc: "Élimine la dépendance au runtime Python pour servir à très haute fréquence." },
      m3: { label: "Signatures Serving", value: "Spécification Input/Output", desc: "Définit les tenseurs d'entrée attendus et les clés de sortie retournées." },
      rules: [
        "1. Pour déployer un modèle TensorFlow sur un conteneur pré-construit Vertex AI : exporter impérativement au format SavedModel.",
        "2. Tester systématiquement le SavedModel exporté avec l'utilitaire `saved_model_cli` avant de lancer le déploiement sur l'endpoint."
      ],
      tag: "SAVEDMODEL & TORCHSCRIPT"
    },
    {
      title: "Apprentissage par Transfert (Transfer Learning) : Feature Extraction vs Fine-Tuning",
      lead: "Comment obtenir un classificateur d'images ultra-précis en disposant de seulement 200 photos étiquetées par classe et de 30 minutes de calcul ?",
      heading: "Réutilisation des Connaissances de Modèles Pré-entraînés (ResNet, EfficientNet)",
      body: "Entraîner un réseau de vision de zéro sur 200 images provoquerait un surapprentissage massif. Solution : le Transfer Learning sur un modèle pré-entraîné sur ImageNet (ex: EfficientNetV2) : 1. Étape 1 : Feature Extraction (Extraction de caractéristiques) : geler toutes les couches de convolution du modèle de base (`base_model.trainable = False`) et entraîner uniquement une nouvelle couche de classification supérieure (Dense layer) avec un taux d'apprentissage standard ($10^{-3}$) ; 2. Étape 2 : Fine-Tuning progressif : dégeler les dernières couches de convolution et ré-entraîner l'ensemble avec un taux d'apprentissage très faible ($10^{-5}$) pour peaufiner les filtres aux spécificités des images cibles sans écraser les poids appris.",
      m1: { label: "Couches Gelées", value: "base_model.trainable = False", desc: "Préserve les détecteurs de formes, contours et textures universels." },
      m2: { label: "Faible Données Requises", value: "Quelques Centaines d'Exemples", desc: "Permet d'atteindre 95%+ de précision avec un volume d'images minime." },
      m3: { label: "Learning Rate Faible", value: "1e-5 pour Fine-Tuning", desc: "Empêche la destruction violente des représentations pré-apprises." },
      rules: [
        "1. Toujours commencer par entraîner la nouvelle tête de classification avec le modèle de base gelé avant de dégeler des couches.",
        "2. Appliquer un taux d'apprentissage (learning rate) 10 à 100 fois plus faible lors du dégel des couches de convolution."
      ],
      tag: "TRANSFER LEARNING VISION"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'VERTEX CUSTOM TRAINING CONTAINERS',
    'ENTRAÎNEMENT DISTRIBUÉ MULTIWORKER',
    'VERTEX VIZIER BAYESIAN TUNING',
    'LORA & PEFT FINE-TUNING LLM',
    'VERTEX EXPERIMENTS & TENSORBOARD',
    'RÉGULARISATION DROPOUT EARLY STOPPING',
    'VANISHING & EXPLODING GRADIENT CLIPPING',
    'BATCHNORM VS LAYERNORM TRANSFORMERS',
    'SAVEDMODEL TF & TORCHSCRIPT EXPORT',
    'TRANSFER LEARNING EFFICIENTNET'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-gcpmle-d3-${String(num).padStart(3, '0')}`,
    category: `GCP-PMLE • DOMAINE 3 • ${subCategory}`,
    categoryBadgeColor: '#8b5cf6',
    levelTag: `GCP-PMLE • D3 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 25%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[GCP-PMLE D3-#${num}] ${baseTopic.title} (Scénario Entraînement Deep Learning #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Cœur technique de l'examen GCP Professional ML Engineer (Domaine 3 : 25% de la note).`,
    solutionHeading: `${baseTopic.heading} - Standard Google Cloud Model Training & Scaling`,
    solutionBody: `${baseTopic.body} Le Domaine 3 est le plus lourd de l'examen GCP-PMLE. Il évalue l'entraînement distribué (MultiWorkerMirroredStrategy), le tuning bayésien (Vizier), les conteneurs custom, l'adaptation PEFT/LoRA, la régularisation et l'export SavedModel pour production.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé GCP-PMLE D3 : L'entraînement à grande échelle sur Vertex AI exige l'isolation des dépendances, la journalisation des métriques dans Vertex Experiments et la sauvegarde des modèles dans un format autonome indépendant du code source (SavedModel / TorchScript).`
    ],
    deckName: "Google Cloud GCP-PMLE : Domaine 3 - Développer et entraîner des modèles",
    domainId: 'domain3',
    domainName: "3. Développer et entraîner des modèles de ML",
    certCode: 'GCP-PMLE',
  };
});
