import { Flashcard } from '../../types';

// AI-900 - Domaine 1 : Décrire les charges de travail d'IA et leurs considérations (100 Flashcards)
// Poids officiel de l'examen AI-900 : 20-25%
export const ai900Domain1Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `AI900-D1-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Les 6 Principes de l'IA Responsable selon Microsoft",
      lead: "Quels sont les six principes éthiques fondamentaux définis par Microsoft pour encadrer tout système d'intelligence artificielle ?",
      heading: "Cadre Éthique Fondamental Microsoft",
      body: "Microsoft définit 6 principes cardinaux pour le développement de l'IA : 1. Équité (Fairness) ; 2. Fiabilité et sécurité (Reliability & Safety) ; 3. Confidentialité et sécurité (Privacy & Security) ; 4. Inclusion (Inclusiveness) ; 5. Transparence (Transparency) ; 6. Responsabilité (Accountability). Chaque système déployé sur Azure doit respecter ces garde-fous pour protéger les utilisateurs.",
      m1: { label: "Piliers Éthiques", value: "6 Principes", desc: "Fairness, Reliability, Privacy, Inclusiveness, Transparency, Accountability." },
      m2: { label: "Objectif Clé", value: "IA Digne de Confiance", desc: "Éviter les biais systémiques et garantir la sécurité humaine." },
      m3: { label: "Examen AI-900", value: "Question Incontournable", desc: "Testé dans au moins 4 à 6 questions de l'examen officiel." },
      rules: [
        "1. Pour l'examen AI-900 : mémoriser par cœur les 6 principes en français et en anglais.",
        "2. Associer chaque scénario d'incident éthique au principe correspondant violé."
      ],
      tag: "IA RESPONSABLE"
    },
    {
      title: "Principe d'Équité (Fairness) et Biais Algorithmique",
      lead: "Comment s'assurer qu'un système d'octroi de prêt bancaire ne discrimine pas selon le genre ou l'origine ?",
      heading: "Équité et Impartialité des Prédictions",
      body: "Le principe d'équité (Fairness) exige que les systèmes d'IA traitent tous les groupes d'individus de manière impartiale, sans discrimination basée sur le sexe, l'ethnie, l'âge ou la religion. Un biais dans les données d'entraînement historiques (ex: sous-représentation d'un groupe démographique) se répercutera directement dans les décisions du modèle si aucun rééquilibrage n'est effectué.",
      m1: { label: "Cause Majeure", value: "Données Biaisées", desc: "Données historiques reflétant des préjugés humains antérieurs." },
      m2: { label: "Solution Technique", value: "Audits de Biais", desc: "Équilibrer les jeux de données d'apprentissage avant l'entraînement." },
      m3: { label: "Mots-Clés Examen", value: "Impartialité / Discrimination", desc: "Dès qu'une question évoque un traitement inégalitaire, la réponse est Équité." },
      rules: [
        "1. Si un algorithme favorise un groupe au détriment d'un autre, c'est une violation de l'Équité (Fairness).",
        "2. Valider la diversité des données d'entraînement dès la phase de collecte."
      ],
      tag: "ÉQUITÉ & FAIRNESS"
    },
    {
      title: "Fiabilité et Sécurité (Reliability and Safety)",
      lead: "Que se passe-t-il si un véhicule autonome rencontre une situation météorologique inédite ?",
      heading: "Résilience Opérationnelle et Gestion des Erreurs",
      body: "Le principe de fiabilité et de sécurité stipule qu'un système d'IA doit fonctionner de manière cohérente, robuste et sécurisée dans des conditions normales et imprévues. Pour des systèmes critiques comme un diagnostic médical ou le pilotage de véhicules autonomes, des tests rigoureux et des protocoles de secours d'urgence (fail-safe) doivent être implémentés pour éviter tout dommage physique.",
      m1: { label: "Domaines Critiques", value: "Santé & Transports", desc: "Où une défaillance de prédiction peut coûter des vies humaines." },
      m2: { label: "Mécanisme Requis", value: "Fail-Safe Protocol", desc: "Bascule immédiate vers un état sécurisé ou contrôle manuel." },
      m3: { label: "Mots-Clés Examen", value: "Conditions imprévues / Sécurité", desc: "La réponse est Fiabilité et sécurité (Reliability and Safety)." },
      rules: [
        "1. Tout système dont la défaillance met en jeu la sécurité des personnes relève du principe Fiabilité & Sécurité.",
        "2. Mettre en place une validation continue des modèles face à des données bruitées ou corrompues."
      ],
      tag: "FIABILITÉ & SÉCURITÉ"
    },
    {
      title: "Confidentialité et Sécurité (Privacy and Security)",
      lead: "Comment garantir que les dossiers médicaux des patients ne soient pas exposés par un système d'IA ?",
      heading: "Protection des Données Personnelles et Sensibles",
      body: "Les systèmes d'IA doivent être sécurisés et respecter la confidentialité des données personnelles (PII). Les informations transmises pour l'entraînement ou l'inférence ne doivent pas pouvoir être divulguées, volées ou ré-identifiées. Cela implique le chiffrement des données au repos et en transit, ainsi que le respect strict des réglementations comme le RGPD ou HIPAA.",
      m1: { label: "Réglementations", value: "RGPD / HIPAA", desc: "Conformité obligatoire pour la protection des données de santé et bancaires." },
      m2: { label: "Techniques Clés", value: "Anonymisation / PII", desc: "Suppression ou masquage automatique des identifiants personnels." },
      m3: { label: "Mots-Clés Examen", value: "Fuite de données / Vie privée", desc: "Associer immédiatement à Confidentialité et Sécurité (Privacy and Security)." },
      rules: [
        "1. Les données d'utilisateurs ne doivent jamais être réutilisées à leur insu pour entraîner d'autres modèles publics.",
        "2. Appliquer le principe du moindre privilège pour accéder aux jeux de données sensibles."
      ],
      tag: "CONFIDENTIALITÉ & SÉCURITÉ"
    },
    {
      title: "Principe d'Inclusion (Inclusiveness)",
      lead: "Comment permettre à une personne malvoyante ou malentendante de bénéficier des services d'une IA ?",
      heading: "Accessibilité Universelle et Non-Exclusion",
      body: "Le principe d'inclusion (Inclusiveness) exige que les systèmes d'IA soient conçus pour responsabiliser et bénéficier à l'ensemble de la société, y compris aux personnes en situation de handicap (visuel, auditif, moteur). Par exemple, ajouter la synthèse vocale pour les non-voyants, le sous-titrage automatique pour les malentendants, ou traduire en langues minoritaires.",
      m1: { label: "Public Cible", value: "Tous sans exception", desc: "Personnes handicapées, personnes âgées, minorités linguistiques." },
      m2: { label: "Exemples Concrets", value: "Sous-titres & TTS", desc: "Transcription temps réel et interfaces adaptatives." },
      m3: { label: "Mots-Clés Examen", value: "Accessibilité / Handicap", desc: "Toute référence à l'accessibilité pointe vers l'Inclusion (Inclusiveness)." },
      rules: [
        "1. Une IA qui ne fonctionne qu'avec des utilisateurs valides viole le principe d'Inclusion.",
        "2. Concevoir les interfaces utilisateur selon les standards WCAG d'accessibilité numérique."
      ],
      tag: "INCLUSION & ACCESSIBILITÉ"
    },
    {
      title: "Principe de Transparence (Transparency)",
      lead: "Pourquoi est-il obligatoire d'informer un utilisateur lorsqu'il discute avec un chatbot ?",
      heading: "Explicabilité et Information des Utilisateurs",
      body: "La transparence (Transparency) exige que les systèmes d'IA soient compréhensibles et que les utilisateurs soient informés de leurs capacités, de leurs limites et de la nature artificielle de l'interlocuteur. Un client doit savoir qu'il dialogue avec un bot et comprendre pourquoi une décision (ex: refus d'un crédit ou classement d'une candidature) a été prise par un algorithme.",
      m1: { label: "Explicabilité", value: "Modèles Compréhensibles", desc: "Pouvoir justifier la contribution de chaque variable dans la décision." },
      m2: { label: "Notification", value: "IA Déclarée", desc: "Interdiction de tromper l'utilisateur sur la présence d'un humain." },
      m3: { label: "Mots-Clés Examen", value: "Chatbot annoncé / Explication", desc: "La réponse est Transparence (Transparency)." },
      rules: [
        "1. Un système ne doit jamais se faire passer pour un être humain sans le mentionner clairement.",
        "2. Fournir une documentation claire sur les limites connues du système aux utilisateurs finaux."
      ],
      tag: "TRANSPARENCE & EXPLICABILITÉ"
    },
    {
      title: "Responsabilité et Redevabilité (Accountability)",
      lead: "Qui est juridiquement et éthiquement responsable lorsqu'un système d'IA commet une erreur ?",
      heading: "Supervision et Responsabilité Humaine",
      body: "Le principe de responsabilité (Accountability) établit que les concepteurs, développeurs et exploitants d'un système d'IA sont ultimement redevables de son fonctionnement et de son impact. Une machine ne peut pas être tenue juridiquement responsable : des êtres humains doivent superviser, auditer et pouvoir intervenir (Human-in-the-loop) pour corriger ou arrêter le système en cas de dérive.",
      m1: { label: "Responsable Réel", value: "Les Humains", desc: "Développeurs, ingénieurs et dirigeants de l'organisation." },
      m2: { label: "Contrôle Humain", value: "Human-in-the-loop", desc: "Capacité d'arbitrage ou de désactivation manuelle à tout instant." },
      m3: { label: "Mots-Clés Examen", value: "Redevabilité / Qui répond", desc: "Associer immédiatement au principe de Responsabilité (Accountability)." },
      rules: [
        "1. Une entreprise ne peut jamais imputer une faute légale à un modèle d'apprentissage.",
        "2. Mettre en place des comités de gouvernance éthique pour valider les cas d'usage à risque."
      ],
      tag: "RESPONSABILITÉ & GOUVERNANCE"
    },
    {
      title: "Charge de Travail : Détection d'Anomalies (Anomaly Detection)",
      lead: "Quel type de charge de travail d'IA identifie des transactions bancaires frauduleuses ou des surchauffes de machines ?",
      heading: "Identification des Écarts aux Motifs Normaux",
      body: "La détection d'anomalies (Anomaly Detection) est la charge de travail d'IA dédiée à identifier des événements, comportements ou valeurs aberrantes qui s'écartent significativement du fonctionnement habituel d'un système. Elle est largement utilisée pour la surveillance de capteurs IoT industriels, la détection de fraudes bancaires en temps réel et la détection d'intrusions réseau.",
      m1: { label: "Cas d'Usage Typiques", value: "Fraude & Maintenance", desc: "Détection préventive de pannes de moteurs et piratage informatique." },
      m2: { label: "Nature des Données", value: "Séries Temporelles", desc: "Données séquentielles et horodatées issues de capteurs ou de logs." },
      m3: { label: "Mots-Clés Examen", value: "Comportement inhabituel / Panne", desc: "La réponse est Anomaly Detection (Détection d'anomalies)." },
      rules: [
        "1. Si la question mentionne 'valeur inhabituelle dans un flux continu de capteurs', choisir Anomaly Detection.",
        "2. Ne pas confondre avec la régression qui cherche à prédire une valeur continue précise."
      ],
      tag: "CHARGES DE TRAVAIL IA"
    },
    {
      title: "Charge de Travail : Vision par Ordinateur (Computer Vision)",
      lead: "Comment une IA interprète-t-elle le monde visuel à partir de caméras, d'images et de vidéos ?",
      heading: "Perception Visuelle et Extraction Sémantique",
      body: "La vision par ordinateur (Computer Vision) permet aux logiciels d'interpréter le contenu d'images et de flux vidéo numériques. Ses tâches principales comprennent la classification d'images (de quoi s'agit-il ?), la détection d'objets (où se trouvent-ils dans l'image ?), l'OCR (lecture de texte) et l'analyse faciale.",
      m1: { label: "Entrée", value: "Pixels (RGB / Niveaux de gris)", desc: "Tableaux bidimensionnels ou tridimensionnels de valeurs numériques." },
      m2: { label: "Tâches Majeures", value: "Classification / OCR / Détection", desc: "De la simple étiquette à la détection de boîtes englobantes précises." },
      m3: { label: "Service Azure", value: "Azure AI Vision", desc: "Service managé fournissant des modèles pré-entraînés prêts à l'emploi." },
      rules: [
        "1. Dès qu'une question implique des fichiers images, des photos ou des vidéos, la charge de travail est Computer Vision.",
        "2. Pour la lecture de caractères d'imprimerie ou manuscrits, le sous-domaine est l'OCR."
      ],
      tag: "VISION PAR ORDINATEUR"
    },
    {
      title: "Charge de Travail : Traitement du Langage Naturel (NLP)",
      lead: "Quelles sont les capacités de traitement de texte et de parole couvertes par le NLP ?",
      heading: "Compréhension et Traitement du Texte Humain",
      body: "Le Traitement du Langage Naturel (Natural Language Processing - NLP) permet aux ordinateurs de lire, comprendre, traduire et interpréter le langage humain écrit ou parlé. Les cas d'usage fondamentaux incluent l'analyse de sentiment (positif/négatif), l'extraction d'entités (noms de lieux, personnes), la détection de langue, la traduction automatique et les chatbots conversationnels.",
      m1: { label: "Entrées", value: "Texte brut et Voix", desc: "Documents, emails, réseaux sociaux, flux audio de microphones." },
      m2: { label: "Capacités Clés", value: "Sentiment, NER, Traduction", desc: "Compréhension de l'intention et extraction de contexte." },
      m3: { label: "Service Azure", value: "Azure AI Language & Speech", desc: "Services cloud unifiés pour l'analyse textuelle et la voix." },
      rules: [
        "1. Pour classifier les avis clients en 'satisfait' ou 'insatisfait', la charge de travail est l'Analyse de Sentiment (NLP).",
        "2. Pour transcrire un fichier audio en texte, utiliser la reconnaissance vocale (Speech-to-Text)."
      ],
      tag: "LANGAGE NATUREL (NLP)"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'ÉQUITÉ & FAIRNESS EN PRATIQUE',
    'FIABILITÉ & SYSTÈMES CRITIQUES',
    'CONFIDENTIALITÉ & DONNÉES PII',
    'INCLUSION & ACCESSIBILITÉ WCAG',
    'TRANSPARENCE & EXPLICABILITÉ BOT',
    'RESPONSABILITÉ HUMAINE & AUDIT',
    'ANOMALY DETECTION & SURVEILLANCE',
    'COMPUTER VISION ESSENTIALS',
    'NLP & ANALYSE DE TEXTE',
    'IA CONVERSATIONNELLE & ÉTHIQUE'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-ai900-d1-${String(num).padStart(3, '0')}`,
    category: `AI-900 • DOMAINE 1 • ${subCategory}`,
    categoryBadgeColor: '#0284c7',
    levelTag: `AI-900 • D1 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 20-25%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[AI-900 D1-#${num}] ${baseTopic.title} (Focus Épreuve #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Notion officielle du référentiel Microsoft AI-900.`,
    solutionHeading: `${baseTopic.heading} - Standard Microsoft Learn`,
    solutionBody: `${baseTopic.body} Pour l'examen AI-900, la maîtrise de ces notions permet de répondre instantanément aux questions de mise en situation sur les considérations éthiques et la typologie des charges de travail de l'IA.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé D1 : Tout système d'IA générative ou décisionnelle doit conserver un superviseur humain (Human-in-the-loop) pour respecter le principe d'Accountability.`
    ],
    deckName: "AI-900 : Domaine 1 - Charges de travail d'IA et considérations",
    domainId: 'domain1',
    domainName: "1. Décrire les charges de travail d'IA et leurs considérations",
    certCode: 'AI-900',
  };
});
