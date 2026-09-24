import { Flashcard } from '../../types';

// AWS AIF-C01 - Domaine 1 : Principes fondamentaux de l'IA et du Machine Learning (100 Flashcards)
// Poids officiel de l'examen AWS Certified AI Practitioner : 20%
export const aifc01Domain1Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `AIF-D1-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Différence Fondamentale : IA vs Machine Learning vs Deep Learning vs IA Générative",
      lead: "Comment hiérarchiser et distinguer ces quatre termes incontournables de l'examen AWS ?",
      heading: "Imbrication Hiérarchique des Concepts d'Intelligence Artificielle",
      body: "L'Intelligence Artificielle (IA) est le concept parapluie englobant tout système imitant l'intelligence humaine. Le Machine Learning (ML) est un sous-ensemble de l'IA où les algorithmes apprennent des motifs à partir de données sans être explicitement programmés par des règles rigides. Le Deep Learning (DL) est un sous-ensemble du ML utilisant des réseaux de neurones profonds à plusieurs couches (inspirés du cerveau). L'IA Générative (GenAI) est une branche du Deep Learning capable de créer des contenus inédits (texte, image, son, code).",
      m1: { label: "Intelligence Artificielle", value: "Domaine Global", desc: "Systèmes informatiques reproduisant des facultés cognitives humaines." },
      m2: { label: "Machine Learning", value: "Apprentissage sur Données", desc: "Algorithmes statistiques (régression, forêts d'arbres, clustering)." },
      m3: { label: "Deep & GenAI", value: "Réseaux Profonds & Création", desc: "Transformeurs, LLM et modèles de diffusion générant des artefacts neufs." },
      rules: [
        "1. Règle d'inclusion : GenAI ⊂ Deep Learning ⊂ Machine Learning ⊂ Intelligence Artificielle.",
        "2. Si le système applique uniquement des règles 'SI ... ALORS' programmées en dur par un expert, c'est de l'IA symbolique, PAS du Machine Learning."
      ],
      tag: "HIÉRARCHIE IA & ML"
    },
    {
      title: "Apprentissage Supervisé : Régression vs Classification",
      lead: "Comment distinguer un problème de régression d'un problème de classification sur des données étiquetées ?",
      heading: "Nature de la Variable Cible (Label y)",
      body: "L'apprentissage supervisé (Supervised Learning) s'entraîne sur des données d'entrée (features x) associées à une cible connue (label y). Si la cible est une valeur numérique continue (ex: estimer le prix d'un bien immobilier, la température de demain, le temps de livraison), il s'agit d'une RÉGRESSION. Si la cible est une catégorie discrète (ex: spam vs non-spam = classification binaire ; classer un ticket en Bug, Facturation ou Demande = classification multiclasse), il s'agit d'une CLASSIFICATION.",
      m1: { label: "Régression", value: "Valeur Continue Réelle", desc: "Prédit un nombre (ex: 42.5 €, 120 km/h, 3.8 jours)." },
      m2: { label: "Classification", value: "Classes Discrètes (Catégories)", desc: "Prédit une étiquette d'appartenance parmi un nombre fini de classes." },
      m3: { label: "Données Requises", value: "Paires (x, y) Étiquetées", desc: "Nécessite impérativement un travail préalable d'annotation des données." },
      rules: [
        "1. Prédire le montant des ventes du trimestre prochain est une Régression.",
        "2. Déterminer si un client va résilier son abonnement (Churn : Oui / Non) est une Classification binaire."
      ],
      tag: "SUPERVISÉ RÉGRESSION & CLASSIFICATION"
    },
    {
      title: "Apprentissage Non Supervisé : Clustering et Détection d'Anomalies",
      lead: "Comment segmenter une clientèle en groupes homogènes sans disposer d'étiquettes préalables ?",
      heading: "Découverte Autonome de Motifs Cachés sans Cible",
      body: "L'apprentissage non supervisé (Unsupervised Learning) ingère des données brutes sans labels (pas de variable y à prédire). Il identifie automatiquement des similitudes et des structures sous-jacentes. Le Clustering (ex: K-Means) regroupe des clients ayant des comportements d'achat proches pour des campagnes marketing ciblées. La détection d'anomalies (ex: Random Cut Forest) isole les points atypiques s'écartant du comportement normal (détection de fraude, défaillance industrielle).",
      m1: { label: "Clustering", value: "Regroupement par Similarité", desc: "Segmentation de marché, regroupement d'articles similaires." },
      m2: { label: "Réduction Dimension", value: "PCA & Compression", desc: "Simplifie un grand nombre de variables corrélées sans perdre l'information clé." },
      m3: { label: "Entrée", value: "Données Non Étiquetées (x seul)", desc: "Aucun coût d'annotation humaine préalable." },
      rules: [
        "1. Dès qu'un scénario mentionne 'découvrir des groupes sans étiquettes fournies', la réponse est le Clustering (non supervisé).",
        "2. K-Means est l'algorithme de clustering le plus fréquemment cité à l'examen."
      ],
      tag: "NON SUPERVISÉ & CLUSTERING"
    },
    {
      title: "Apprentissage par Renforcement (Reinforcement Learning - RL)",
      lead: "Quel paradigme d'apprentissage fait intervenir un agent recevant des récompenses ou des pénalités ?",
      heading: "Optimisation de Décisions Séquentielles par Récompenses",
      body: "Dans l'Apprentissage par Renforcement (RL), un 'Agent' interagit avec un 'Environnement'. À chaque étape, il observe un 'État', prend une 'Action', et reçoit une 'Récompense' (Reward positive ou négative/pénalité). L'objectif de l'agent est d'apprendre une 'Politique' (Policy) maximisant le cumul des récompenses au fil du temps. AWS propose 'AWS DeepRacer' pour apprendre le RL sur des voitures de course autonomes physiques et virtuelles.",
      m1: { label: "Composants", value: "Agent, Environnement, Actions, Rewards", desc: "Cycle d'apprentissage interactif par essais et erreurs." },
      m2: { label: "Cas d'Usage", value: "Robotique, Trading, Jeux, Véhicules", desc: "Contrôle de trajectoire, pilotage de feux tricolores, jeux d'échecs/Go." },
      m3: { label: "AWS DeepRacer", value: "Véhicule Autonome 1/18e", desc: "Plateforme éducative AWS phare pour pratiquer le RL." },
      rules: [
        "1. Si la question mentionne 'actions d'un agent guidées par des récompenses (rewards)', choisir Reinforcement Learning.",
        "2. Le RL est également utilisé dans l'alignement des LLM via la méthode RLHF (Human Feedback)."
      ],
      tag: "REINFORCEMENT LEARNING"
    },
    {
      title: "Surapprentissage (Overfitting) vs Sous-apprentissage (Underfitting)",
      lead: "Comment diagnostiquer un modèle affichant 99% de réussite sur ses données d'entraînement mais seulement 55% sur des données réelles de test ?",
      heading: "Compromis Biais-Variance et Généralisation",
      body: "L'Overfitting (Surapprentissage / Forte Variance) survient lorsque le modèle mémorise le bruit et les spécificités anecdotiques du jeu d'entraînement au lieu d'apprendre la tendance générale : il est excellent sur le train set mais médiocre sur le test set (manque de généralisation). Solutions : simplifier le modèle, ajouter des données, régulariser (L1/L2, Dropout), ou arrêter tôt l'entraînement (Early Stopping). L'Underfitting (Sous-apprentissage / Fort Biais) survient quand le modèle est trop simpliste pour capturer la complexité des données (scores médiocres sur train ET test).",
      m1: { label: "Overfitting", value: "Train Excellent / Test Faible", desc: "Le modèle a 'appris par cœur' ; mauvaise capacité de généralisation." },
      m2: { label: "Underfitting", value: "Train Faible / Test Faible", desc: "Le modèle est trop simple (ex: ligne droite sur une courbe complexe)." },
      m3: { label: "Solutions Overfitting", value: "Régularisation, Plus de Données, Dropout", desc: "Techniques incontournables pour forcer le modèle à généraliser." },
      rules: [
        "1. Règle absolue examen : Écart massif entre performance Train et Test = OVERFITTING.",
        "2. Pour tester la capacité de généralisation réelle d'un modèle, évaluer impérativement sur un jeu de test indépendant jamais vu."
      ],
      tag: "OVERFITTING & UNDERFITTING"
    },
    {
      title: "Métriques de Classification : Accuracy vs Precision vs Recall vs F1-Score",
      lead: "Pourquoi l'Exactitude (Accuracy) est-elle trompeuse pour évaluer un détecteur de maladies rares touchant 1 personne sur 10 000 ?",
      heading: "Évaluation Adaptée aux Classes Déséquilibrées",
      body: "Si 99.99% des patients sont sains, un modèle prédisant systématiquement 'Sain' obtiendra 99.99% d'Accuracy tout en ratant 100% des malades ! La Précision (Precision = TP / (TP + FP)) mesure la proportion de prédictions positives qui étaient exactes (réduit les faux positifs). Le Rappel (Recall / Sensibilité = TP / (TP + FN)) mesure la proportion de vrais malades détectés (réduit les faux négatifs). Le F1-Score est la moyenne harmonique combinant Précision et Rappel.",
      m1: { label: "Précision (Precision)", value: "TP / (TP + FP)", desc: "Critique si un Faux Positif coûte cher (ex: blocage injustifié de compte client VIP)." },
      m2: { label: "Rappel (Recall)", value: "TP / (TP + FN)", desc: "Critique si un Faux Négatif est fatal (ex: manquer un cancer ou une fraude grave)." },
      m3: { label: "F1-Score", value: "2*(P*R)/(P+R)", desc: "Métrique idéale d'équilibre sur jeux de données déséquilibrés." },
      rules: [
        "1. Si manquer un événement positif a des conséquences catastrophiques : maximiser le RAPPEL (Recall).",
        "2. Sur des données fortement asymétriques, ne jamais se fier à l'Accuracy seule."
      ],
      tag: "MÉTRIQUES DE CLASSIFICATION"
    },
    {
      title: "Services d'IA Pré-entraînés AWS : Vision avec Amazon Rekognition",
      lead: "Comment ajouter l'analyse d'images, la modération de contenu et la détection faciale sans aucune compétence en Machine Learning ?",
      heading: "Vision par Ordinateur Clé en Main via API Managée",
      body: "Amazon Rekognition est un service entièrement géré d'analyse d'images et de vidéos. Capacités clés : 1. Détection d'étiquettes d'objets, scènes et actions ; 2. Modération de contenu (détection de nudité, violence, substances illicites) ; 3. Analyse et comparaison faciale (reconnaissance d'émotions, estimation d'âge, recherche de personnes autorisées) ; 4. Détection de texte dans les images (Text in Image) ; 5. Rekognition Custom Labels pour entraîner des modèles sur mesure avec très peu d'images via une interface visuelle.",
      m1: { label: "Modération Contenu", value: "Content Moderation API", desc: "Filtre automatiquement les contenus inappropriés sur les réseaux sociaux." },
      m2: { label: "Custom Labels", value: "Modèles Sur Mesure No-Code", desc: "Permet de reconnaître les pièces industrielles ou logos spécifiques d'une marque." },
      m3: { label: "Format d'Accès", value: "API REST (SDK AWS)", desc: "Aucun serveur à déployer, paiement à l'image ou minute vidéo traitée." },
      rules: [
        "1. Pour détecter si une photo téléchargée par un utilisateur contient de la violence : utiliser Amazon Rekognition.",
        "2. Rekognition ne nécessite aucun entraînement préalable pour les objets du quotidien."
      ],
      tag: "AMAZON REKOGNITION VISION"
    },
    {
      title: "Services d'IA Pré-entraînés AWS : Traitement de Documents avec Amazon Textract",
      lead: "Comment extraire avec précision le tableau des articles et les champs 'Total TTC' d'une facture PDF scannée ?",
      heading: "Extraction Intelligente de Texte Structuré, Tableaux et Formulaires",
      body: "Amazon Textract va bien au-delà de l'OCR (reconnaissance optique de caractères) traditionnel qui produit du texte brut sans structure. Textract utilise le Machine Learning pour comprendre la mise en page des documents : il extrait automatiquement les paires clé-valeur dans les formulaires (ex: 'Nom:' -> 'Dupont'), reconstruit fidèlement les tableaux multi-colonnes avec leurs cellules, et dispose d'APIs spécialisées (AnalyzeExpense pour les factures/reçus, AnalyzeID pour les passeports et permis de conduire).",
      m1: { label: "Formulaires", value: "Paires Clé-Valeur", desc: "Associe automatiquement l'intitulé du champ et sa valeur saisie." },
      m2: { label: "Tableaux", value: "Lignes & Colonnes Préservées", desc: "Restitue les grilles tarifaires et tableaux financiers complexes." },
      m3: { label: "AnalyzeExpense", value: "Spécialisé Factures & Reçus", desc: "Reconnaît les montants totaux, TVA, dates et noms de fournisseurs sans configuration." },
      rules: [
        "1. Si la question demande d'extraire des tableaux ou des formulaires de PDF administratifs : choisir Amazon Textract.",
        "2. Pour de la reconnaissance de texte sur des photos de rue ou panneaux : choisir Amazon Rekognition Text in Image."
      ],
      tag: "AMAZON TEXTRACT OCR"
    },
    {
      title: "Services d'IA Pré-entraînés AWS : Langage avec Amazon Comprehend & Amazon Translate",
      lead: "Comment analyser automatiquement les opinions des clients et caviarder les données personnelles (PII) dans des milliers d'emails ?",
      heading: "Traitement du Langage Naturel (NLP) et Traduction Managée",
      body: "Amazon Comprehend est un service NLP managé capable de : 1. Analyser le sentiment (Positif, Négatif, Neutre, Mixte) ; 2. Extraire des phrases clés et des entités nommées (Personnes, Lieux, Organisations) ; 3. Détecter la langue du texte ; 4. Détecter et masquer les informations personnellement identifiables (PII - Personally Identifiable Information comme numéros de sécurité sociale, emails, téléphones) pour la conformité RGPD. Amazon Translate offre une traduction neuronale multilingue rapide et de haute qualité.",
      m1: { label: "Détection PII", value: "Caviardage / Masquage RGPD", desc: "Protège les données confidentielles des clients avant stockage ou affichage." },
      m2: { label: "Sentiment", value: "Analyse d'Opinion", desc: "Permet de router en priorité les réclamations furieuses au support client." },
      m3: { label: "Amazon Translate", value: "Traduction Neuronale", desc: "Traduction automatique fluide entre des dizaines de langues." },
      rules: [
        "1. Pour masquer automatiquement les numéros de carte de crédit et emails dans des textes : Amazon Comprehend PII Redaction.",
        "2. Amazon Comprehend fonctionne sur du texte non structuré (avis clients, tickets support, articles de presse)."
      ],
      tag: "COMPREHEND & TRANSLATE"
    },
    {
      title: "Services d'IA Pré-entraînés AWS : Voix et Conversation (Amazon Transcribe, Polly & Lex)",
      lead: "Comment concevoir un centre d'appels interactif qui transcrit la voix du client, comprend son intention et lui répond vocalement ?",
      heading: "La Trilogie Vocale et Conversationnelle AWS",
      body: "Cette chaîne associe 3 services managés : 1. Amazon Transcribe (Speech-to-Text) convertit la parole audio en texte écrit (avec ponctuation, identification des interlocuteurs speaker diarization et masquage PII audio) ; 2. Amazon Lex (Chatbot & Voicebot) comprend l'intention de l'utilisateur (Intents, Utterances, Slots) en utilisant le même moteur d'IA conversationnelle qu'Amazon Alexa ; 3. Amazon Polly (Text-to-Speech) synthétise le texte écrit en voix humaine réaliste (voix neuronales fluides, support du balisage SSML).",
      m1: { label: "Amazon Transcribe", value: "Parole vers Texte (STT)", desc: "Transcrit les flux audio en direct ou enregistrements d'appels en texte." },
      m2: { label: "Amazon Lex", value: "Moteur de Chatbot / Intentions", desc: "Identifie l'intention du client et extrait les paramètres nécessaires (ex: réserver billet)." },
      m3: { label: "Amazon Polly", value: "Texte vers Parole (TTS)", desc: "Lit les réponses textuelles avec des voix neuronales naturelles expressives." },
      rules: [
        "1. Pour créer un chatbot conversationnel comme Alexa sur AWS : utiliser Amazon Lex.",
        "2. Pour générer des sous-titres automatiques à partir d'un fichier audio/vidéo : utiliser Amazon Transcribe."
      ],
      tag: "TRANSCRIBE, POLLY & LEX"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'HIÉRARCHIE IA ML DL GENAI',
    'APPRENTISSAGE SUPERVISÉ',
    'NON SUPERVISÉ & CLUSTERING',
    'REINFORCEMENT LEARNING',
    'OVERFITTING & SOUS-APPRENTISSAGE',
    'MÉTRIQUES ACCURACY RECALL F1',
    'AMAZON REKOGNITION VISION',
    'AMAZON TEXTRACT FORMULAIRES',
    'COMPREHEND NLP & PII MASKING',
    'TRANSCRIBE POLLY & LEX VOCAL'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-aifc01-d1-${String(num).padStart(3, '0')}`,
    category: `AIF-C01 • DOMAINE 1 • ${subCategory}`,
    categoryBadgeColor: '#0284c7',
    levelTag: `AIF-C01 • D1 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 20%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[AIF-C01 D1-#${num}] ${baseTopic.title} (Question Examen #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Objectif clé du Domaine 1 (Principes fondamentaux de l'IA et du ML) pour l'examen AWS Certified AI Practitioner.`,
    solutionHeading: `${baseTopic.heading} - Référentiel Officiel AWS AIF-C01`,
    solutionBody: `${baseTopic.body} Le Domaine 1 (20% de l'examen) évalue la compréhension globale des paradigmes d'apprentissage (supervisé, non supervisé, renforcement), des métriques d'évaluation et des services cognitifs pré-entraînés managés d'AWS.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé AIF-C01 D1 : Toujours privilégier un service d'IA pré-entraîné (Rekognition, Textract, Comprehend) avant d'envisager d'entraîner un modèle personnalisé sur SageMaker pour réduire les coûts et le délai de mise sur le marché.`
    ],
    deckName: "AWS AIF-C01 : Domaine 1 - Fondamentaux de l'IA et du Machine Learning",
    domainId: 'domain1',
    domainName: "1. Principes fondamentaux de l'IA et du Machine Learning",
    certCode: 'AIF-C01',
  };
});
