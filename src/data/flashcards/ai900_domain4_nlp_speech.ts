import { Flashcard } from '../../types';

// AI-900 - Domaine 4 : Décrire les charges de travail de traitement du langage naturel (NLP) (100 Flashcards)
// Poids officiel de l'examen AI-900 : 15-20%
export const ai900Domain4Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `AI900-D4-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Analyse de Sentiments et Minage d'Opinions (Sentiment Analysis)",
      lead: "Comment mesurer automatiquement la satisfaction des clients à partir des avis laissés sur les réseaux sociaux ?",
      heading: "Évaluation de la Polarité Émotionnelle du Texte",
      body: "L'analyse de sentiments dans Azure AI Language analyse un texte fourni et lui attribue une étiquette globale : 'positive', 'negative', 'neutral' ou 'mixed'. Elle renvoie des scores de confiance compris entre 0.0 et 1.0 pour chaque sentiment, tant au niveau du document global que de chaque phrase individuelle. Le 'minage d'opinions' (Opinion Mining) va encore plus loin en associant les sentiments à des aspects cibles précis (ex: 'L'accueil était chaleureux mais la nourriture était froide').",
      m1: { label: "Sorties", value: "Positive, Negative, Neutral, Mixed", desc: "Classification de la polarité globale et détaillée par phrase." },
      m2: { label: "Scores de Confiance", value: "Somme égale à 1.0", desc: "Mesure probabiliste de la certitude du modèle sur le sentiment." },
      m3: { label: "Opinion Mining", value: "Cible + Opinion", desc: "Relie un adjectif qualificatif à un produit ou service précis." },
      rules: [
        "1. Si un texte contient à la fois des louanges et des critiques, le sentiment global est 'mixed' (mixte).",
        "2. Pour trier les réclamations urgentes au support client, filtrer les messages au sentiment 'negative'."
      ],
      tag: "ANALYSE DE SENTIMENTS"
    },
    {
      title: "Extraction de Phrases Clés (Key Phrase Extraction)",
      lead: "Comment résumer rapidement les thématiques majeures d'un rapport de 50 pages sans le lire en entier ?",
      heading: "Repérage des Sujets et Points Centraux",
      body: "L'extraction de phrases clés (Key Phrase Extraction) évalue le texte d'un document et retourne une liste de chaînes de caractères représentant les points de discussion et sujets principaux abordés (ex: 'voiture électrique', 'batterie lithium-ion', 'temps de recharge'). Elle ignore les mots vides courants (stop words comme 'le', 'de', 'avec') pour isoler les concepts porteurs de sens.",
      m1: { label: "Sortie", value: "Liste de Chaînes de Texte", desc: "Mots ou groupes nominaux synthétisant l'essence du document." },
      m2: { label: "Utilité", value: "Indexation & Moteurs de Recherche", desc: "Alimente les filtres de recherche et nuages de mots-clés." },
      m3: { label: "Traitement", value: "Filtrage des Stop Words", desc: "Élimine automatiquement les articles et prépositions non informatifs." },
      rules: [
        "1. Pour générer un nuage de mots-clés ou indexer des articles de presse, choisir Key Phrase Extraction.",
        "2. Cette fonctionnalité fonctionne sans aucun entraînement préalable sur vos propres données."
      ],
      tag: "PHRASES CLÉS (KEY PHRASES)"
    },
    {
      title: "Détection de Langue (Language Detection)",
      lead: "Comment router automatiquement un email entrant vers l'opérateur parlant la bonne langue ?",
      heading: "Identification Automatique de la Langue Écrite",
      body: "La détection de langue dans Azure AI Language analyse un texte et identifie la langue prédominante parmi plus de 120 idiomes supportés. Elle renvoie le nom officiel de la langue (ex: 'French', 'Spanish', 'Japanese'), son code standard ISO 639-1 (ex: 'fr', 'es', 'ja') et un score de confiance (de 0.0 à 1.0). Si le texte est ambigu ou trop court, elle renvoie 'Unknown'.",
      m1: { label: "Code ISO", value: "Code 2 Lettres (ex: 'fr')", desc: "Standard international facilitant l'interopérabilité logicielle." },
      m2: { label: "Score de Confiance", value: "0.0 à 1.0", desc: "Un score de 1.0 indique une certitude absolue de la langue détectée." },
      m3: { label: "Valeur de Repli", value: "'(Unknown)' si Indéterminé", desc: "Renvoyé lorsque le texte contient trop peu de caractères distinctifs." },
      rules: [
        "1. Avant de traduire un texte avec Azure Translator, utiliser la détection de langue pour déterminer la source.",
        "2. Plus le texte fourni est long, plus le score de confiance de détection de langue est élevé."
      ],
      tag: "DÉTECTION DE LANGUE"
    },
    {
      title: "Reconnaissance d'Entités Nommées (NER - Named Entity Recognition)",
      lead: "Comment repérer et catégoriser automatiquement les noms de personnes, de villes, d'organisations ou de dates dans un contrat ?",
      heading: "Classification Sémantique des Éléments Textuels",
      body: "La Reconnaissance d'Entités Nommées (NER) identifie dans un texte non structuré des entités prédéfinies et les classe dans des catégories reconnues : Person (ex: 'Satya Nadella'), Location (ex: 'Paris', 'Siège de Redmond'), Organization (ex: 'Microsoft'), DateTime (ex: '24 septembre 2026'), Quantity (ex: '500 Go') ou URL. Elle indique l'index de début, la longueur et le sous-type de chaque entité.",
      m1: { label: "Catégories Standarts", value: "Person, Location, Org, Date", desc: "Entités générales universelles pré-entraînées prêtes à l'emploi." },
      m2: { label: "Modèles Spécialisés", value: "Healthcare & PII", desc: "Modèles capables d'extraire la posologie médicale ou symptômes." },
      m3: { label: "Format Sortie", value: "Texte + Catégorie + Décalage", desc: "Offre la position exacte du mot dans la chaîne d'origine." },
      rules: [
        "1. Pour repérer le nom d'un PDG et la ville de sa société dans un communiqué de presse, la solution est NER.",
        "2. Ne pas confondre NER (qui classifie des entités) avec Key Phrase Extraction (qui résume les sujets)."
      ],
      tag: "ENTITÉS NOMMÉES (NER)"
    },
    {
      title: "Détection et Caviardage des Données Personnelles (PII Redaction)",
      lead: "Comment expurger automatiquement les numéros de carte bancaire, adresses postales et emails des relevés de chat ?",
      heading: "Protection de la Vie Privée et Masquage RGPD",
      body: "La détection d'informations personnelles identifiables (Personally Identifiable Information - PII) dans Azure AI Language repère les données sensibles (numéros de sécurité sociale, numéros de passeport, adresses IP, numéros de téléphone, IBAN) et permet de les caviarder (redaction) en les remplaçant par des astérisques ou des étiquettes (ex: 'Mon numéro est [REDACTED]'). C'est un élément clé de conformité au RGPD.",
      m1: { label: "Données Ciblées", value: "PII & Données Bancaires", desc: "Cartes bancaires, sécurité sociale, permis de conduire, adresses emails." },
      m2: { label: "Mode Caviardage", value: "Remplacement par Astérisques", desc: "Permet de stocker des logs de conversations sans risque juridique de fuite." },
      m3: { label: "Principe Éthique", value: "Privacy & Security", desc: "Répond directement au principe Microsoft de confidentialité des données." },
      rules: [
        "1. Dès qu'une question parle de masquer des numéros de téléphone ou de cartes bleues : choisir PII Detection / Redaction.",
        "2. Le caviardage PII garantit que les employés du support ne voient pas les secrets des clients."
      ],
      tag: "PII & CONFIDENTIALITÉ"
    },
    {
      title: "Azure AI Language : Question Answering & Bases de Connaissances",
      lead: "Comment transformer instantanément une page web de FAQ ou un document PDF en bot de questions-réponses ?",
      heading: "Création de FAQ Intelligente sans Code",
      body: "Question Answering (intégré dans Azure AI Language, successeur de QnA Maker) extrait automatiquement des paires de questions/réponses à partir de documents semi-structurés (manuels au format PDF, fichiers Word, pages web de FAQ). Les utilisateurs peuvent poser leurs questions en langage naturel, avec des synonymes ou des tournures familières, et le moteur retrouve la réponse exacte la plus pertinente, avec support du dialogue multi-tours (multi-turn).",
      m1: { label: "Sources de Données", value: "FAQ URLs, PDF, DOCX, Chit-Chat", desc: "Ingestion automatique de contenu existant en quelques secondes." },
      m2: { label: "Multi-Turn", value: "Questions de Suivi", desc: "Permet de guider l'utilisateur avec des choix et sous-questions." },
      m3: { label: "Chit-Chat", value: "Personnalité du Bot", desc: "Ajoute des réponses amicales aux politesses ('Bonjour', 'Merci', 'Au revoir')." },
      rules: [
        "1. Pour créer un bot d'assistance à partir d'un guide PDF de questions fréquentes : utiliser Question Answering.",
        "2. Question Answering comprend les requêtes même avec des fautes d'orthographe ou des formulations imprévues."
      ],
      tag: "QUESTION ANSWERING"
    },
    {
      title: "Conversational Language Understanding (CLU) : Intentions et Entités",
      lead: "Dans la phrase 'Réserve-moi un billet de train pour Lyon demain', comment le bot comprend-il l'action et les paramètres ?",
      heading: "Compréhension du Langage Conversationnel",
      body: "CLU (Conversational Language Understanding) permet d'entraîner des modèles personnalisés pour comprendre les requêtes d'utilisateurs d'un chatbot : 1. L'Intention (Intent) représente ce que l'utilisateur veut faire (ex: 'ReserverBillet') ; 2. Les Entités (Entities) sont les données ou variables utiles pour réaliser l'action (ex: destination='Lyon', date='demain'). Les Énoncés (Utterances) sont les phrases d'exemples fournies pour entraîner le modèle.",
      m1: { label: "Intention (Intent)", value: "Action Souhaitée", desc: "Ce que le bot doit accomplir (ex: CommanderPizza, AllumerLumiere)." },
      m2: { label: "Entités (Entities)", value: "Paramètres d'Entrée", desc: "Les détails requis pour l'action (ex: type='4Fromages', taille='Grande')." },
      m3: { label: "Énoncé (Utterance)", value: "Exemple de Phrase", desc: "Phrase d'entraînement saisie pour apprendre au modèle la variété des tournures." },
      rules: [
        "1. Dans CLU : Intent = Verbe/Action, Entity = Complément/Paramètre, Utterance = Exemple prononcé.",
        "2. Pour construire un assistant vocal domotique (ex: allumer la lumière), CLU est le service recommandé."
      ],
      tag: "CLU (INTENTIONS & ENTITÉS)"
    },
    {
      title: "Azure AI Speech : Reconnaissance Vocale (Speech-to-Text)",
      lead: "Quelle technologie convertit la voix parlée d'un utilisateur en flux textuel numérique en temps réel ?",
      heading: "Transcription Audio en Direct et par Lots",
      body: "Le service Azure AI Speech propose la transcription vocale (Speech-to-Text) qui écoute un flux audio provenant d'un microphone ou d'un fichier enregistré et le transcrit en texte écrit. Il supporte la transcription en temps réel avec faible latence, la transcription par lots pour de grands volumes de fichiers audio d'appels téléphoniques, ainsi que la diarisation (identification des différents locuteurs 'Intervenant 1', 'Intervenant 2').",
      m1: { label: "Temps Réel", value: "Microphone & Streaming", desc: "Idéal pour les dictées vocales et sous-titres de réunions en direct." },
      m2: { label: "Transcription par Lots", value: "Fichiers Enregistrés", desc: "Traitement massif d'enregistrements audio de centres d'appels." },
      m3: { label: "Diarisation", value: "Séparation des Locuteurs", desc: "Distingue qui a prononcé chaque phrase lors d'une conversation." },
      rules: [
        "1. Pour retranscrire une réunion audio en compte-rendu texte, utiliser Speech-to-Text.",
        "2. Custom Speech permet d'adapter le vocabulaire pour des jargons médicaux ou techniques particuliers."
      ],
      tag: "SPEECH-TO-TEXT"
    },
    {
      title: "Azure AI Speech : Synthèse Vocale (Text-to-Speech) et Voix Neuronales",
      lead: "Comment faire lire un texte écrit à voix haute par un ordinateur avec une intonation humaine naturelle ?",
      heading: "Génération Vocale Neuronale Réaliste",
      body: "La synthèse vocale (Text-to-Speech) d'Azure AI Speech transforme n'importe quel texte brut en parole fluide et naturelle grâce à des réseaux neuronaux profonds. Les voix neuronales (Neural Voices) imitent le rythme, l'accentuation et les inflexions émotionnelles d'acteurs professionnels dans des centaines de langues. Le langage de balisage SSML (Speech Synthesis Markup Language) permet de contrôler précisément la vitesse, le ton et les pauses.",
      m1: { label: "Voix Neuronales", value: "Qualité Humaine", desc: "Indiscernable d'une voix humaine naturelle pré-enregistrée." },
      m2: { label: "Standard SSML", value: "Contrôle Fin du Débit", desc: "Balises XML réglant les murmures, l'enthousiasme et la vitesse d'élocution." },
      m3: { label: "Accessibilité", value: "Principe d'Inclusion", desc: "Lecture vocale pour malvoyants et systèmes de navigation GPS." },
      rules: [
        "1. Pour faire prononcer une réponse à un bot vocal avec une voix réaliste : utiliser Text-to-Speech.",
        "2. SSML est le standard XML utilisé pour modifier la hauteur et le tempo de la voix synthétisée."
      ],
      tag: "TEXT-TO-SPEECH & SSML"
    },
    {
      title: "Azure AI Translator : Traduction Textuelle Multilingue Instantanée",
      lead: "Comment traduire un site web ou un message de chat instantanément entre plus de 100 langues ?",
      heading: "Traduction Automatique Neuronale (NMT)",
      body: "Azure AI Translator est un service cloud basé sur la traduction automatique neuronale (Neural Machine Translation - NMT) capable de traduire du texte en temps réel entre plus de 100 langues et dialectes. Il préserve la mise en forme HTML, offre la détection automatique de la langue source, et permet la translittération (conversion de caractères alphabétiques, ex: du cyrillique ou du kanji vers l'alphabet latin).",
      m1: { label: "Nombre de Langues", value: "Plus de 100 Langues", desc: "Couvre les principales langues parlées dans le monde." },
      m2: { label: "Translittération", value: "Conversion d'Alphabet", desc: "Ex: Écrire des caractères japonais en alphabet latin (rōmaji)." },
      m3: { label: "Préservation Format", value: "Balises HTML préservées", desc: "Traduit le contenu visible sans briser la structure du code web." },
      rules: [
        "1. Pour traduire un texte d'une langue à une autre, utiliser Azure AI Translator.",
        "2. Pour traduire de la parole en parole (Speech Translation), combiner Translator avec Azure AI Speech."
      ],
      tag: "TRADUCTION MULTILINGUE"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'SENTIMENT ANALYSIS & OPINIONS',
    'KEY PHRASES EXTRACTION',
    'LANGUAGE DETECTION CODES',
    'NAMED ENTITY RECOGNITION (NER)',
    'PII CONFIDENTIALITÉ RGPD',
    'QUESTION ANSWERING & FAQ BOTS',
    'CLU INTENTIONS & ENTITÉS',
    'SPEECH-TO-TEXT TRANSCRIPTION',
    'TEXT-TO-SPEECH & VOIX NEURONALES',
    'AZURE TRANSLATOR NMT'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-ai900-d4-${String(num).padStart(3, '0')}`,
    category: `AI-900 • DOMAINE 4 • ${subCategory}`,
    categoryBadgeColor: '#7c3aed',
    levelTag: `AI-900 • D4 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 15-20%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[AI-900 D4-#${num}] ${baseTopic.title} (Question Test #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Objectif clé du Domaine 4 de l'examen officiel Azure AI-900.`,
    solutionHeading: `${baseTopic.heading} - Standard NLP & Speech Microsoft Azure`,
    solutionBody: `${baseTopic.body} Le Domaine 4 évalue la compréhension du traitement du langage humain (écrit et oral) et la capacité à mapper un besoin utilisateur avec la bonne brique fonctionnelle d'Azure AI Language ou Azure AI Speech.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé D4 : Les services Azure AI Language et Azure AI Speech s'exécutent aussi bien dans le cloud qu'au sein de conteneurs Docker pour les environnements déconnectés.`
    ],
    deckName: "AI-900 : Domaine 4 - Traitement du langage naturel (NLP)",
    domainId: 'domain4',
    domainName: "4. Décrire les charges de travail de traitement du langage naturel (NLP)",
    certCode: 'AI-900',
  };
});
