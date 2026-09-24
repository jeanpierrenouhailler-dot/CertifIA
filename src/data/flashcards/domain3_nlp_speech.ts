import { Flashcard } from '../../types';

// Domaine 3 : Traitement du Langage Naturel & Solutions Speech (100 Flashcards)
// Poids officiel AI-102 : 20-25%
export const domain3Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `D3-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Analyse de Sentiments & Opinion Mining (Aspect-Based Sentiment)",
      lead: "Comment identifier à la fois le sentiment global d'un avis et l'évaluation ciblée de chaque attribut produit ?",
      heading: "Azure AI Language - Sentiment & Opinion Mining",
      body: "L'API Sentiment Analysis fournit des scores de positivité, négativité et neutralité à l'échelle du document et de chaque phrase. En activant le paramètre 'opinionMining=true', le moteur extrait les cibles (targets, ex: 'la batterie') et les termes d'évaluation associés (assessments, ex: 'dure longtemps'), permettant d'analyser précisément les points forts et faiblesses d'un produit même au sein d'une phrase contrastée.",
      m1: { label: "Niveau de Granularité", value: "Document, Phrase, Aspect", desc: "Permet de capturer les sentiments mixtes dans un même paragraphe." },
      m2: { label: "Flag Requis", value: "opinionMining=true", desc: "Génère les paires cibles-évaluations dans la réponse JSON." },
      m3: { label: "Scores Confiance", value: "Positif, Neutre, Négatif", desc: "Somme normalisée à 1.0 pour chaque segment textuel." },
      rules: [
        "1. Toujours spécifier la langue (lang) dans la requête pour maximiser la précision des embeddings linguistiques.",
        "2. Utiliser Opinion Mining pour alimenter les tableaux de bord Power BI d'analyse de satisfaction client par composant.",
      ],
      tag: "SENTIMENT & OPINION"
    },
    {
      title: "Personally Identifiable Information (PII) Redaction",
      lead: "Comment caviarder automatiquement les données confidentielles (sécurité sociale, CB, emails) avant archivage ?",
      heading: "Détection & Masquage de Données Personnelles",
      body: "L'opération PII Detection d'Azure AI Language détecte et catégorise les données à caractère personnel dans plus de 30 domaines (US SSN, NIR français, IBAN, cartes bancaires, adresses IP). Elle retourne le texte avec des caractères de masquage (ex: 'Mon numéro est *******') ou les coordonnées exactes (offset et length) des entités sensibles pour un traitement programmatique sur mesure.",
      m1: { label: "Conformité Cible", value: "RGPD, HIPAA, PCI-DSS", desc: "Évite d'ingérer des données sensibles dans des bases vectorielles non auditées." },
      m2: { label: "Types d'Entités", value: "IBAN, Email, Phone, SSN", desc: "Reconnaissance basée sur des modèles de deep learning et des expressions régulières." },
      m3: { label: "Mode de Restitution", value: "Redacted Text + Offsets", desc: "Permet soit le remplacement direct, soit l'anonymisation contextuelle." },
      rules: [
        "1. Exécuter systématiquement la détection PII avant d'envoyer des transcriptions d'appels vers un pipeline RAG ou un LLM.",
        "2. Définir des filtres 'piiCategories' personnalisés pour restreindre le masquage aux seuls champs réglementés.",
      ],
      tag: "PII & RGPD"
    },
    {
      title: "Conversational Language Understanding (CLU) : Intents & Entities",
      lead: "Comment structurer les intentions utilisateur et extraire les paramètres d'une commande vocale ?",
      heading: "Modélisation Conversationnelle CLU",
      body: "Dans Azure AI Language Studio, un projet CLU définit des Intentions (Intents, ex: 'ReserverBillet') et des Entités (Entities). Les entités peuvent être apprises par contexte (learned entities), de type liste fermée avec synonymes (list entities), ou prédéfinies (prebuilt: date, nombre, monnaie). Chaque intention requiert au moins 10 à 15 énoncés d'entraînement (utterances) variés pour assurer une bonne généralisation.",
      m1: { label: "Intents", value: "Objectif de l'utilisateur", desc: "Ex: AnnulerVol, ConsulterSolde, ModifierAdresse." },
      m2: { label: "Learned Entities", value: "Apprises par contexte", desc: "Idéal lorsque la valeur exacte n'est pas connue d'avance (ex: NomPassager)." },
      m3: { label: "List Entities", value: "Vocabulaire fini", desc: "Valeurs normées avec correspondances exactes de synonymes (ex: Classes de voyage)." },
      rules: [
        "1. Ne jamais négliger l'intention 'None' : y injecter des énoncés hors-sujet pour éviter les faux déclenchements.",
        "2. Répartir équitablement le nombre d'énoncés entre toutes les intentions pour éviter tout biais vers l'intention la plus fournie.",
      ],
      tag: "CLU CONVERSATIONAL"
    },
    {
      title: "Orchestration Workflow : Fédérer CLU et Question Answering",
      lead: "Comment concevoir un bot d'entreprise unifié sans conflit d'intention entre questions FAQ et actions métier ?",
      heading: "Orchestration Conversationnelle Multi-Modèles",
      body: "Un projet d'Orchestration Workflow dans Azure AI Language connecte plusieurs sous-projets (plusieurs modèles CLU pour différents services de l'entreprise et des bases de connaissances Question Answering). Lors d'une requête utilisateur, l'orchestrateur évalue l'énoncé, détermine le sous-projet le plus pertinent via un modèle de routage, et lui délègue l'exécution de la réponse sans duplication d'efforts.",
      m1: { label: "Composants Connectés", value: "CLU + Question Answering", desc: "Aiguille automatiquement vers la FAQ ou l'action transactionnelle." },
      m2: { label: "Déploiement", value: "Point de terminaison unique", desc: "L'application consomme une seule URL d'API pour tout le bot." },
      m3: { label: "Évaluation Conflit", value: "Score de routage", desc: "Pondération automatique pour trancher entre FAQ générale et intention spécifique." },
      rules: [
        "1. Toujours déployer les sous-projets CLU et Question Answering avant de déployer le projet d'orchestration parent.",
        "2. Ajouter des énoncés de routage dans l'orchestrateur dès l'ajout d'une nouvelle base de connaissances.",
      ],
      tag: "ORCHESTRATION"
    },
    {
      title: "Question Answering : Multi-Turn Conversations & Chit-Chat",
      lead: "Comment guider l'utilisateur dans des arbres de décision interactifs avec des questions complémentaires ?",
      heading: "Bases de Connaissances Question Answering",
      body: "Dans Azure AI Language Question Answering, les invites à plusieurs tours (multi-turn prompts) permettent de lier des paires Q/A parentes et enfants pour créer des arbres guidés (ex: 'Quel est votre modèle ?' -> boutons 'Modèle X' et 'Modèle Y'). L'ajout de sources de 'Chit-Chat' (ton amical, professionnel ou sarcastique) confère une personnalité au bot pour répondre aux salutations sans perturber les réponses documentaires.",
      m1: { label: "Sources de Données", value: "URL, PDF, DOCX, Excel", desc: "Extraction automatique des paires questions-réponses tabulaires et hiérarchiques." },
      m2: { label: "Multi-Turn", value: "Boutons de suivi contextuel", desc: "Restreint la réponse suivante au contexte immédiat de la question précédente." },
      m3: { label: "Active Learning", value: "Suggestions d'utilisateurs réels", desc: "Propose de nouvelles questions alternatives basées sur les requêtes non résolues." },
      rules: [
        "1. Valider et publier la base de connaissances pour que les modifications soient effectives sur le point de terminaison de production.",
        "2. Utiliser des métadonnées sur les paires Q/A pour filtrer les réponses selon le profil de l'utilisateur (ex: 'Role=Admin').",
      ],
      tag: "QUESTION ANSWERING"
    },
    {
      title: "Azure AI Speech : Streaming Audio vs Batch Transcription",
      lead: "Quand utiliser le Speech SDK temps réel plutôt que l'API de transcription par lots ?",
      heading: "Reconnaissance Vocale (Speech-to-Text)",
      body: "Le Speech SDK temps réel (WebSocket) est conçu pour les interfaces vocales interactives et le sous-titrage en direct avec une latence inférieure à la seconde. L'API Batch Transcription (REST asynchrone) est optimisée pour transcrire des téraoctets d'enregistrements audio stockés dans Azure Blob Storage, avec calcul automatique de la diarisation (séparation des locuteurs 'Speaker 1 / Speaker 2') et analyse de la qualité audio.",
      m1: { label: "Speech SDK (Temps Réel)", value: "Latence < 500 ms", desc: "Gère les événements 'Recognizing' (intermédiaire) et 'Recognized' (final)." },
      m2: { label: "Batch Transcription", value: "Volume massif asynchrone", desc: "Traitement par jobs avec webhook de notification de complétion." },
      m3: { label: "Diarisation Locuteurs", value: "Jusqu'à 10 locuteurs", desc: "Identifie qui a parlé à chaque milliseconde de l'enregistrement." },
      rules: [
        "1. Pour la transcription de centres d'appels archivés, TOUJOURS recommander l'API Batch Transcription.",
        "2. Pour un assistant vocal sur smartphone, utiliser le Speech SDK en reconnaissance continue.",
      ],
      tag: "SPEECH-TO-TEXT"
    },
    {
      title: "Custom Speech : Modèles Acoustiques & Modèles de Langage",
      lead: "Comment adapter la reconnaissance vocale aux environnements bruyants et aux jargons métiers complexes ?",
      heading: "Personnalisation Acoustique & Linguistique",
      body: "Un modèle acoustique personnalisé est entraîné avec des fichiers audio réels et leurs transcriptions humaines pour adapter le modèle aux bruits de fond d'usines, échos ou accents régionaux très marqués. Un modèle de langage/prononciation est entraîné avec des textes de domaine (lexique médical, juridique, codes produits) et des fichiers de prononciation phonétique (lexiques XML) pour orthographier correctement les termes inconnus du dictionnaire standard.",
      m1: { label: "Modèle Acoustique", value: "Audio + Transcriptions", desc: "Corrige les problèmes de bruit de fond et de déformation du signal vocal." },
      m2: { label: "Modèle de Langage", value: "Fichiers de texte brut", desc: "Augmente la probabilité statistique d'apparition des termes métiers spécialisés." },
      m3: { label: "Fichier de Prononciation", value: "Lexique .txt / .xml", desc: "Spécifie la prononciation exacte via alphabet IPA (International Phonetic Alphabet)." },
      rules: [
        "1. Si le problème est la détection des mots dans le bruit, entraîner un modèle acoustique.",
        "2. Si le mot est bien entendu mais mal orthographié (ex: marque propriétaire), injecter un modèle de langage et un lexique.",
      ],
      tag: "CUSTOM SPEECH"
    },
    {
      title: "Text-to-Speech (TTS) & Balisage SSML Avancé",
      lead: "Comment moduler le débit, la tonalité, les pauses et les émotions dans la voix synthétisée ?",
      heading: "Synthèse Vocale Neuronale & SSML",
      body: "Le Speech Synthesis Markup Language (SSML) est un standard XML permettant de contrôler précisément la voix générée. La balise `<prosody pitch='+10%' rate='0.9' volume='loud'>` contrôle la hauteur et la vitesse. La balise `<express-as style='empathetic' styledegree='2'>` active les styles émotionnels neuronaux (empathique, joyeux, journalistique). La balise `<phoneme alphabet='ipa' ph='...'>` garantit la prononciation exacte d'un mot rare.",
      m1: { label: "Balise Racine", value: "<speak version='1.0'>", desc: "Obligatoire avec namespace http://www.w3.org/2001/10/synthesis." },
      m2: { label: "Styles Neuronaux", value: "cheerful, newscast, angry", desc: "Disponibles sur les voix neuronales multilingues HD." },
      m3: { label: "Balise de Pause", value: "<break time='500ms'/>", desc: "Insère un silence naturel avant un chiffre ou un nom important." },
      rules: [
        "1. Pour la lecture de numéros de téléphone ou de codes, utiliser `<say-as interpret-as='telephone'>` pour éviter la lecture sous forme de grand nombre entier.",
        "2. Utiliser `<bookmark mark='point1'/>` pour synchroniser des animations graphiques d'avatar avec les paroles.",
      ],
      tag: "TTS & SSML"
    },
    {
      title: "Custom Neural Voice (CNV) & Conditions d'Éligibilité",
      lead: "Quelles sont les exigences éthiques et légales pour synthétiser la réplique exacte d'une voix humaine ?",
      heading: "Voix Neuronale Personnalisée & IA Éthique",
      body: "Custom Neural Voice crée un jumeau vocal synthétique à partir d'enregistrements d'un comédien vocal professionnel. En raison des risques de deepfakes vocaux, Microsoft applique une politique d'accès restreint (Limited Access). L'acteur doit obligatoirement enregistrer une déclaration de consentement formelle (Consent Statement) dont la signature biométrique vocale est validée par le système avant tout entraînement du modèle de voix.",
      m1: { label: "Accès Limité", value: "Approbation obligatoire", desc: "Formulaire d'approbation préalable imposé par le comité d'éthique Microsoft." },
      m2: { label: "Preuve de Consentement", value: "Audio de vérification", desc: "Le modèle compare la voix des sessions avec la lecture de la déclaration légale de l'acteur." },
      m3: { label: "Volume de Données", value: "300 à 2000 phrases", desc: "Enregistrées en studio insonorisé avec micro haute fidélité (WAV 24kHz/16-bit mono)." },
      rules: [
        "1. Le fichier de consentement de l'acteur doit être approuvé par Microsoft avant de pouvoir lancer le job d'entraînement CNV.",
        "2. Appliquer un filigrane audio (watermarking) pour assurer la traçabilité des synthèses vocales générées.",
      ],
      tag: "CUSTOM NEURAL VOICE"
    },
    {
      title: "Azure AI Translator : Traduction de Documents entiers avec Layout",
      lead: "Comment traduire des catalogues PDF ou fichiers Word complexes en conservant polices, images et tableaux ?",
      heading: "Document Translation API",
      body: "L'API Document Translation d'Azure Translator traduit des lots de documents (PDF, DOCX, PPTX, XLSX) stockés dans Azure Blob Storage tout en préservant scrupuleusement la mise en page, les tableaux, les en-têtes et le style typographique. Elle supporte l'application d'un 'Glossaire' personnalisé pour forcer la traduction de termes techniques spécifiques ou empêcher la traduction de noms de marques.",
      m1: { label: "Formats Supportés", value: "PDF, Office, HTML, Markdown", desc: "Préserve la mise en page originale sans décalage visuel des blocs." },
      m2: { label: "Architecture", value: "Source Blob -> Target Blob", desc: "Traitement asynchrone par lot avec conteneurs SAS ou Managed Identity." },
      m3: { label: "Custom Glossaries", value: "Fichiers CSV / TSV", desc: "Force la correspondance stricte des terminologies de votre industrie." },
      rules: [
        "1. Utiliser des URI de conteneurs SAS (avec permissions Read/List sur la source et Write sur la cible) ou une identité managée.",
        "2. Pour les traductions textuelles courtes d'API, utiliser l'endpoint standard 'translate?to=es&to=de' en un seul appel.",
      ],
      tag: "TRANSLATOR & DOCUMENTS"
    }
  ];

  const baseTopic = topics[(index) % topics.length];
  const subCategoryList = [
    'SENTIMENT & OPINION MINING',
    'PII REDACTION & RGPD',
    'CLU INTENTS & ENTITIES',
    'ORCHESTRATION MULTI-MODÈLES',
    'QUESTION ANSWERING & FAQ',
    'SPEECH-TO-TEXT TEMPS RÉEL',
    'BATCH TRANSCRIPTION & DIARISATION',
    'CUSTOM SPEECH ACOUSTIQUE',
    'SYNTHÈSE VOCALE & SSML AVANCÉ',
    'DOCUMENT TRANSLATION & GLOSSAIRES'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-d3-${String(num).padStart(3, '0')}`,
    category: `DOMAINE 3 • ${subCategory}`,
    categoryBadgeColor: '#10b981',
    levelTag: `AI-102 • D3 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 20-25%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[D3-#${num}] ${baseTopic.title} (Module Spécialisé #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Compétence officielle NLP & Traitement Vocal de l'examen AI-102.`,
    solutionHeading: `${baseTopic.heading} - Standard d'Ingénierie Microsoft`,
    solutionBody: `${baseTopic.body} La maîtrise conjointe du SDK Azure AI Language et d'Azure AI Speech garantit la conception d'expériences conversationnelles multicanales fluides et conformes aux exigences d'entreprise.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle standard D3 : Dans toute architecture conversationnelle vocale, découpler l'étape Speech-to-Text de l'analyse sémantique CLU pour faciliter les diagnostics d'erreurs d'interprétation.`
    ],
    deckName: 'Domaine 3 : Langage Naturel & Speech',
    domainId: 'domain3',
    domainName: '3. Traitement du Langage Naturel & Solutions Speech',
  };
});
