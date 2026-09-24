import { Flashcard } from '../../types';

// AI-900 - Domaine 2 : Décrire les principes fondamentaux de l'apprentissage automatique sur Azure (100 Flashcards)
// Poids officiel de l'examen AI-900 : 25-30%
export const ai900Domain2Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `AI900-D2-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Régression vs Classification vs Clustering : Les 3 Piliers du ML",
      lead: "Comment choisir le bon type de tâche d'apprentissage automatique selon la nature de la variable cible ?",
      heading: "Typologie Fondamentale des Tâches ML",
      body: "La Régression est une tâche supervisée prédisant une valeur numérique continue (ex: prix d'un bien immobilier, température de demain). La Classification est une tâche supervisée prédisant une catégorie ou classe discrète (ex: spam ou non-spam, diagnostic positif/négatif). Le Clustering est une tâche non supervisée regroupant des données similaires sans étiquettes préalables (ex: segmentation de clientèle selon le panier d'achat).",
      m1: { label: "Régression", value: "Nombre Continu", desc: "Prédit un montant en euros, un âge, un kilométrage." },
      m2: { label: "Classification", value: "Catégorie / Classe", desc: "Binaire (2 choix) ou Multiclasse (3+ choix exclusifs)." },
      m3: { label: "Clustering", value: "Non Supervisé", desc: "Aucun label cible nécessaire lors de l'apprentissage." },
      rules: [
        "1. Si la question demande de prédire un montant chiffré, la réponse est Régression.",
        "2. Si la question demande d'attribuer une étiquette ou un choix, la réponse est Classification."
      ],
      tag: "TYPES DE TÂCHES ML"
    },
    {
      title: "Caractéristiques (Features) et Étiquette Cible (Label)",
      lead: "Dans un jeu de données de prédiction des prix immobiliers, qu'est-ce qu'une 'feature' et qu'est-ce qu'un 'label' ?",
      heading: "Vocabulaire Essentiel des Données ML",
      body: "Les 'Features' (caractéristiques ou variables indépendantes, notées x) sont les attributs d'entrée décrivant chaque observation (ex: surface en m², nombre de chambres, code postal). Le 'Label' (étiquette ou variable cible, notée y) est la valeur spécifique que le modèle cherche à prédire (ex: prix de vente final du logement).",
      m1: { label: "Features (x)", value: "Variables d'Entrée", desc: "Caractéristiques observables décrivant l'objet d'étude." },
      m2: { label: "Label (y)", value: "Variable Cible", desc: "La réponse ou valeur finale attendue par la prédiction." },
      m3: { label: "Phase de Test", value: "Features sans Label", desc: "Le modèle infère le label à partir des seules features fournies." },
      rules: [
        "1. Dans l'examen : l'étiquette (label) est TOUJOURS ce que l'on veut prédire.",
        "2. Les features sont les indices ou données d'entrée fournies au modèle."
      ],
      tag: "FEATURES & LABELS"
    },
    {
      title: "Automated ML (AutoML) dans Azure Machine Learning",
      lead: "Comment entraîner et comparer des dizaines d'algorithmes différents sans écrire une seule ligne de code ?",
      heading: "Automatisation du Choix et Réglage de Modèle",
      body: "Automated ML (AutoML) dans Azure Machine Learning Studio teste automatiquement de multiples algorithmes d'apprentissage (Random Forest, LightGBM, régression logistique, etc.) et optimise leurs hyperparamètres sur votre jeu de données. À l'issue de l'exécution de l'expérience, il classe les modèles selon la métrique d'évaluation choisie et désigne le meilleur modèle prêt à être déployé.",
      m1: { label: "Cible Utilisateur", value: "Sans Code / Low Code", desc: "Accessible aux profils métier et accélérateur pour Data Scientists." },
      m2: { label: "Tâches Supportées", value: "Classif, Régression, Séries", desc: "Supporte également la prévision de séries chronologiques." },
      m3: { label: "Résultat Final", value: "Meilleur Modèle + Score", desc: "Génération de graphiques d'explicabilité et métriques complètes." },
      rules: [
        "1. Pour comparer rapidement de multiples algorithmes sans coder : choisir Automated ML (AutoML).",
        "2. Automated ML fournit l'importance des variables (feature importance) pour expliquer les décisions."
      ],
      tag: "AUTOMATED ML"
    },
    {
      title: "Azure Machine Learning Designer : Glisser-Déposer Visuel",
      lead: "Quel outil visuel d'Azure ML permet de créer des pipelines d'apprentissage par blocs reliés entre eux ?",
      heading: "Conception Visuelle de Pipelines de Données",
      body: "Azure Machine Learning Designer est une interface graphique en glisser-déposer (drag-and-drop) permettant de construire visuellement des flux de travail d'apprentissage automatique. On y connecte des modules de préparation de données (Clean Missing Data, Normalize Data, Split Data), d'entraînement d'algorithmes et d'évaluation (Score Model, Evaluate Model).",
      m1: { label: "Interface", value: "Canvas Graphique", desc: "Modules connectés par des flèches représentant le flux de données." },
      m2: { label: "Module Split Data", value: "Train / Test Split", desc: "Sépare les données (ex: 70% entraînement, 30% validation)." },
      m3: { label: "Module Score Model", value: "Génération Prédictions", desc: "Applique le modèle entraîné sur le jeu de test pour prédire les labels." },
      rules: [
        "1. Si la question mentionne 'interface visuelle par glisser-déposer de modules', la réponse est Azure ML Designer.",
        "2. Le module 'Evaluate Model' compare les métriques des prédictions générées par 'Score Model'."
      ],
      tag: "AZURE ML DESIGNER"
    },
    {
      title: "Métriques d'Évaluation de Régression : MAE, RMSE et R²",
      lead: "Comment mesurer la précision d'un modèle prédisant des prix ou des durées de trajet ?",
      heading: "Validation Mathématique des Modèles Continus",
      body: "La MAE (Mean Absolute Error) calcule l'erreur moyenne en valeur absolue entre les prédictions et les valeurs réelles. La RMSE (Root Mean Squared Error) pénalise plus sévèrement les grosses erreurs d'écart en élevant les écarts au carré avant d'en prendre la racine. Le coefficient de détermination R² (entre 0 et 1) mesure la proportion de variance expliquée par le modèle (plus il est proche de 1.0, meilleur est le modèle).",
      m1: { label: "MAE", value: "Erreur Moyenne Brute", desc: "Exprimée dans la même unité monétaire ou métrique que le label." },
      m2: { label: "RMSE", value: "Pénalise les Gros Écarts", desc: "Plus sensible aux anomalies et valeurs aberrantes que la MAE." },
      m3: { label: "R² (R-Squared)", value: "Proche de 1.0 = Idéal", desc: "Un R² de 0.90 signifie que 90% de la variance est expliquée." },
      rules: [
        "1. Pour la régression, on cherche à MINIMISER la MAE et la RMSE, et à MAXIMISER le coefficient R².",
        "2. Si MAE ou RMSE vaut 0, le modèle a une précision absolue (cas théorique parfait)."
      ],
      tag: "MÉTRIQUES RÉGRESSION"
    },
    {
      title: "Métriques de Classification : Accuracy, Precision, Recall et F1",
      lead: "Pourquoi l'exactitude (Accuracy) est-elle trompeuse lorsque les classes sont déséquilibrées ?",
      heading: "Évaluation des Modèles Catégoriels",
      body: "L'Accuracy (Exactitude) mesure le pourcentage global de prédictions correctes. Mais si 99% des transactions sont légitimes et 1% frauduleuses, un modèle disant toujours 'légitime' aura 99% d'accuracy tout en manquant 100% des fraudes ! La Precision mesure la justesse parmi les prédictions positives (TP / (TP + FP)). Le Recall (Rappel) mesure la proportion de vrais positifs capturés (TP / (TP + FN)). Le F1-Score est la moyenne harmonique combinant Precision et Recall.",
      m1: { label: "Accuracy", value: "(TP + TN) / Total", desc: "Efficace uniquement si les classes sont équilibrées." },
      m2: { label: "Precision", value: "TP / (TP + FP)", desc: "Privilégiée pour minimiser les fausses alertes (faux positifs)." },
      m3: { label: "Recall", value: "TP / (TP + FN)", desc: "Cruciale en détection de maladie (aucun faux négatif toléré)." },
      rules: [
        "1. En cas de classes déséquilibrées (fraude, cancer), se fier au F1-Score et au Recall plutôt qu'à l'Accuracy.",
        "2. Pour l'examen AI-900 : connaître la différence entre Precision (fiabilité des positifs) et Recall (détection de tous les positifs)."
      ],
      tag: "MÉTRIQUES CLASSIFICATION"
    },
    {
      title: "La Matrice de Confusion (Confusion Matrix)",
      lead: "Comment visualiser les succès et les confusions d'un classificateur binaire sous forme de tableau 2x2 ?",
      heading: "Cartographie des Vrais et Faux Positifs / Négatifs",
      body: "La matrice de confusion compare les valeurs réelles et les valeurs prédites d'un modèle : 1. Vrais Positifs (TP) : Réel positif, prédit positif ; 2. Vrais Négatifs (TN) : Réel négatif, prédit négatif ; 3. Faux Positifs (FP / Erreur Type I) : Réel négatif, mais prédit positif par erreur ; 4. Faux Négatifs (FN / Erreur Type II) : Réel positif, mais manqué et prédit négatif par erreur.",
      m1: { label: "Vrais Positifs (TP)", value: "Succès Détection", desc: "Patient malade correctement identifié comme malade." },
      m2: { label: "Faux Positifs (FP)", value: "Fausse Alerte", desc: "Email légitime classé à tort dans les spams." },
      m3: { label: "Faux Négatifs (FN)", value: "Défaillance Manquée", desc: "Transaction frauduleuse non interceptée (grave)." },
      rules: [
        "1. Pour réduire les faux négatifs (FN), il faut maximiser le Rappel (Recall).",
        "2. Pour réduire les fausses alertes (FP), il faut maximiser la Précision."
      ],
      tag: "MATRICE DE CONFUSION"
    },
    {
      title: "Cycle de Vie d'un Modèle ML dans Azure Machine Learning",
      lead: "Quelles sont les 5 étapes successives allant de la donnée brute au déploiement en production ?",
      heading: "Cycle de Vie MLOps Fondamental",
      body: "Le cycle de vie complet comprend : 1. Préparation des données (Data Ingestion & Cleaning) ; 2. Entraînement du modèle (Model Training avec sélection d'algorithme) ; 3. Évaluation du modèle (Validation sur jeu de test et analyse des métriques) ; 4. Enregistrement (Model Registry pour le versioning) ; 5. Déploiement sous forme de point de terminaison en ligne (Managed Online Endpoint) pour recevoir des requêtes d'inférence en temps réel via une API REST.",
      m1: { label: "Étape 1", value: "Données & Nettoyage", desc: "Création des datastores et datasets dans Azure ML." },
      m2: { label: "Étape 4", value: "Model Registry", desc: "Conserve l'historique et les versions des artefacts du modèle." },
      m3: { label: "Étape 5", value: "Online Endpoint", desc: "Expose un point d'entrée HTTP sécurisé pour les applications clientes." },
      rules: [
        "1. Ne jamais déployer un modèle sans l'avoir préalablement enregistré dans le Model Registry.",
        "2. Les applications mobiles ou web consomment le modèle via des requêtes JSON envoyées à l'Endpoint."
      ],
      tag: "CYCLE DE VIE ML"
    },
    {
      title: "Apprentissage Non Supervisé : Le Clustering de Données",
      lead: "Comment regrouper automatiquement des clients selon leurs comportements sans disposer d'étiquettes préalables ?",
      heading: "Algorithme K-Means et Découverte de Motifs",
      body: "Le Clustering (comme l'algorithme K-Means) sépare un ensemble de données en 'k' groupes (clusters) distincts en calculant la distance géométrique euclidienne entre chaque point et le centre du groupe (centroïde). Chaque groupe rassemble des observations très semblables entre elles et dissemblables des autres groupes, sans qu'aucun humain n'ait eu besoin de nommer les groupes à l'avance.",
      m1: { label: "Nature des Données", value: "Sans Étiquettes (Unlabeled)", desc: "Seules les features d'observation sont fournies à l'algorithme." },
      m2: { label: "Nombre de Groupes", value: "Paramètre 'k'", desc: "Nombre de clusters défini manuellement avant l'entraînement." },
      m3: { label: "Applications", value: "Marketing & Biologie", desc: "Typologie de consommateurs, regroupement de gènes similaires." },
      rules: [
        "1. Dès qu'une question parle de 'regrouper des données sans données d'apprentissage étiquetées', la réponse est Clustering.",
        "2. Le clustering appartient à la famille de l'apprentissage NON supervisé."
      ],
      tag: "CLUSTERING"
    },
    {
      title: "Ressource et Espace de Travail Azure Machine Learning (Workspace)",
      lead: "Quel est le composant central hébergeant toutes les données, calculs, modèles et expériences dans Azure ?",
      heading: "L'Espace de Travail Azure Machine Learning",
      body: "Le Workspace Azure Machine Learning est la ressource centrale de premier niveau. Il fédère : les ressources de calcul (Compute Instances pour coder, Compute Clusters pour l'entraînement distribué et Inférence Clusters), les banques de données (Datastores reliés à Azure Blob Storage ou Data Lake), les expériences (Experiments), les modèles enregistrés et les points de terminaison (Endpoints).",
      m1: { label: "Compute Instance", value: "Poste de Dev Cloud", desc: "Machine virtuelle dédiée avec JupyterLab et VS Code intégrés." },
      m2: { label: "Compute Cluster", value: "Calcul Scalable", desc: "Grappe de serveurs démarrant à 0 nœud pour minimiser les coûts." },
      m3: { label: "Ressources Liées", value: "Storage, Key Vault, ACR", desc: "Créées automatiquement lors du déploiement du Workspace." },
      rules: [
        "1. Pour l'examen : l'espace de travail Azure Machine Learning regroupe l'ensemble des artefacts et calculs du projet.",
        "2. Configurer la taille minimale du cluster de calcul à 0 pour éviter de payer quand aucun job ne tourne."
      ],
      tag: "AZURE ML WORKSPACE"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'RÉGRESSION VS CLASSIFICATION',
    'FEATURES & LABELS BASICS',
    'AUTOMATED ML (AUTOML)',
    'AZURE ML DESIGNER VISUEL',
    'MÉTRIQUES RÉGRESSION (MAE/RMSE/R2)',
    'MÉTRIQUES CLASSIFICATION (ACCURACY/RECALL)',
    'MATRICE DE CONFUSION EXPLIQUÉE',
    'CYCLE DE VIE ML & DÉPLOIEMENT',
    'CLUSTERING NON SUPERVISÉ',
    'WORKSPACE & RESSOURCES DE CALCUL'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-ai900-d2-${String(num).padStart(3, '0')}`,
    category: `AI-900 • DOMAINE 2 • ${subCategory}`,
    categoryBadgeColor: '#059669',
    levelTag: `AI-900 • D2 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 25-30%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[AI-900 D2-#${num}] ${baseTopic.title} (Atelier Pratique #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Notion clé du Domaine 2 de l'examen officiel Azure AI-900.`,
    solutionHeading: `${baseTopic.heading} - Standard Microsoft Azure ML`,
    solutionBody: `${baseTopic.body} Le Domaine 2 constitue le poids le plus lourd de l'examen AI-900 (25-30%). La distinction absolue entre régression, classification binaire/multiclasse et clustering est indispensable.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé D2 : Un bon modèle de Machine Learning généralise sur des données non vues sans être en surapprentissage (overfitting) ni sous-apprentissage (underfitting).`
    ],
    deckName: "AI-900 : Domaine 2 - Principes fondamentaux du Machine Learning",
    domainId: 'domain2',
    domainName: "2. Décrire les principes fondamentaux de l'apprentissage automatique sur Azure",
    certCode: 'AI-900',
  };
});
