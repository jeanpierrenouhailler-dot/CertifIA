import { Flashcard } from '../../types';

// AI-900 - Domaine 3 : Décrire les fonctionnalités des charges de travail de vision par ordinateur sur Azure (100 Flashcards)
// Poids officiel de l'examen AI-900 : 15-20%
export const ai900Domain3Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `AI900-D3-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Classification d'Images vs Détection d'Objets vs Segmentation Sémantique",
      lead: "Comment distinguer ces 3 tâches fondamentales de vision par ordinateur selon le niveau de détail attendu ?",
      heading: "Hiérarchie de la Compréhension Visuelle",
      body: "La Classification d'images attribue une étiquette globale à l'ensemble de l'image (ex: 'Cette image représente un taxi'). La Détection d'objets localise plusieurs objets distincts en traçant des rectangles englobants (Bounding Boxes) avec leurs coordonnées (x, y, largeur, hauteur). La Segmentation sémantique classifie chaque pixel individuel de l'image (ex: peindre les pixels représentant la route en bleu et ceux des piétons en rouge).",
      m1: { label: "Classification", value: "Étiquette Globale", desc: "Répond à la question : 'De quoi s'agit-il dans l'image ?'" },
      m2: { label: "Détection d'Objets", value: "Bounding Boxes", desc: "Répond à la question : 'Quels objets et où sont-ils précisément ?'" },
      m3: { label: "Segmentation", value: "Précision au Pixel", desc: "Détourage exact des contours d'organes ou de chaussée." },
      rules: [
        "1. Dès qu'une question mentionne des 'boîtes englobantes' (bounding boxes), choisir Détection d'Objets.",
        "2. Si la question mentionne l'étiquetage de 'chaque pixel', choisir Segmentation Sémantique."
      ],
      tag: "CONCEPTS VISION"
    },
    {
      title: "Reconnaissance Optique de Caractères (OCR) & Read API",
      lead: "Quelle technologie extrait le texte imprimé ou manuscrit présent dans une photo ou un document scanné ?",
      heading: "Extraction de Texte avec Azure AI Vision",
      body: "L'OCR (Optical Character Recognition), implémenté via la fonction 'Read' d'Azure AI Vision, extrait automatiquement le texte imprimé et manuscrit depuis des images (JPEG, PNG) ou des documents PDF. Il identifie les lignes et les mots, leurs positions spatiales (polygones de délimitation) et supporte de multiples langues avec une haute résilience face aux reflets ou inclinaisons.",
      m1: { label: "Formats Reçus", value: "Images & PDF", desc: "Photos de panneaux routiers, scans de livres, notes manuscrites." },
      m2: { label: "Capacité Clé", value: "Texte Imprimé & Manuscrit", desc: "Reconnaît aussi bien les polices typographiques que l'écriture à la main." },
      m3: { label: "Sortie Structurée", value: "JSON avec Coordonnées", desc: "Texte extrait ordonné par pages, lignes et mots avec boîtes de position." },
      rules: [
        "1. Pour extraire le texte d'un panneau stop photographié par une voiture autonome, la charge de travail est l'OCR.",
        "2. La fonctionnalité 'Read' d'Azure AI Vision est optimisée pour les documents denses en texte."
      ],
      tag: "OCR & EXTRACTION TEXTE"
    },
    {
      title: "Azure AI Custom Vision : Créer ses Propres Modèles sans Coder",
      lead: "Quand faut-il utiliser Custom Vision plutôt que le service générique Azure AI Vision ?",
      heading: "Entraînement Personnalisé de Modèles Visuels",
      body: "Azure AI Custom Vision s'utilise lorsque les modèles pré-entraînés standard d'Azure ne reconnaissent pas vos objets métier spécifiques (ex: identifier des pièces détachées d'usine spécifiques, classifier des maladies de feuilles de plantes, ou repérer le logo de votre entreprise). Il suffit de téléverser quelques dizaines d'images, d'étiqueter les objets ou les classes, et d'entraîner le modèle en un clic.",
      m1: { label: "Deux Tâches", value: "Classification & Détection", desc: "Permet d'entraîner soit un classificateur, soit un détecteur d'objets." },
      m2: { label: "Volume Requis", value: "Quelques Dizaines d'Images", desc: "Technique de Transfer Learning permettant un apprentissage rapide." },
      m3: { label: "Export Edge", value: "ONNX, Docker, CoreML", desc: "Possibilité d'exporter le modèle pour une exécution locale hors-ligne." },
      rules: [
        "1. Si la question mentionne la reconnaissance d'un produit spécifique à une entreprise : choisir Custom Vision.",
        "2. Custom Vision ne nécessite aucune compétence mathématique ni écriture de code pour l'entraînement."
      ],
      tag: "CUSTOM VISION"
    },
    {
      title: "Azure AI Document Intelligence (Form Recognizer)",
      lead: "Comment extraire automatiquement les montants, dates et tableaux d'une facture ou d'un reçu de caisse ?",
      heading: "Compréhension Structurée de Documents",
      body: "Azure AI Document Intelligence (anciennement Form Recognizer) combine l'OCR avancé avec des modèles de Deep Learning pour extraire non seulement le texte, mais surtout la structure sémantique des documents : paires clé-valeur (ex: 'Total: 154,20 €', 'Date: 12/04/2026'), tableaux avec colonnes et lignes, ainsi que des sélections de cases à cocher. Il propose des modèles pré-entraînés pour les factures, reçus, cartes d'identité et fiches de paie.",
      m1: { label: "Modèles Prebuilt", value: "Factures, Reçus, ID", desc: "Modèles prêts à l'emploi pour les documents comptables courants." },
      m2: { label: "Modèles Custom", value: "Formulaires Métier", desc: "Possibilité d'entraîner sur des formulaires fiscaux ou contrats sur-mesure." },
      m3: { label: "Sortie JSON", value: "Paires Clé-Valeur & Tables", desc: "Structure directement exploitable pour insertion en base de données ERP." },
      rules: [
        "1. Si une question parle d'extraire des données de factures, de reçus de caisse ou de cartes d'identité : la réponse est Document Intelligence.",
        "2. Document Intelligence va bien au-delà du simple OCR en comprenant la relation entre les étiquettes et les valeurs."
      ],
      tag: "DOCUMENT INTELLIGENCE"
    },
    {
      title: "Analyse des Visages et Détection Faciale (Azure AI Face)",
      lead: "Quelles sont les capacités de vision dédiées aux visages humains et quelles sont les règles éthiques associées ?",
      heading: "Détection, Attributs et Vérification Faciale",
      body: "Le service Azure AI Face détecte la présence de visages humains dans une image, localise les points de repère faciaux (pupilles, nez, commissures des lèvres), estime la pose de la tête et permet la vérification faciale (1:1 : est-ce bien la même personne ?). Conformément aux principes d'IA responsable de Microsoft, l'analyse d'émotions a été retirée pour éviter les dérives et l'accès à la reconnaissance faciale est soumis à approbation préalable (Limited Access).",
      m1: { label: "Détection Faciale", value: "Localisation du Visage", desc: "Retourne les coordonnées du rectangle contenant le visage humain." },
      m2: { label: "Vérification 1:1", value: "Match Biométrique", desc: "Compare deux visages pour confirmer s'il s'agit de la même identité." },
      m3: { label: "Gouvernance", value: "Limited Access", desc: "Restrictions éthiques strictes imposées par Microsoft pour protéger la vie privée." },
      rules: [
        "1. Pour comparer la photo d'un passeport avec un selfie de l'utilisateur, utiliser le service Azure AI Face.",
        "2. Microsoft a retiré l'inférence des émotions faciales de ses API publiques au nom de la fiabilité éthique."
      ],
      tag: "ANALYSE FACIALE (FACE)"
    },
    {
      title: "Légendage d'Image (Image Captioning) et Génération de Tags",
      lead: "Comment générer automatiquement une phrase descriptive pour rendre une image accessible aux personnes malvoyantes ?",
      heading: "Description Automatique en Langage Naturel",
      body: "La fonctionnalité 'Caption' d'Azure AI Vision analyse la scène visuelle globale et produit une phrase complète en langage naturel décrivant le contenu de l'image (ex: 'Un chien golden retriever courant sur une plage au coucher du soleil') avec un score de confiance (confidence score). Elle génère également des balises (tags) décrivant les objets, couleurs et décors présents, idéal pour le référencement et l'accessibilité web (balises alt).",
      m1: { label: "Captioning", value: "Phrase Descriptive", desc: "Fournit une phrase synthétique compréhensible par un humain." },
      m2: { label: "Tags (Balises)", value: "Mots-Clés Visuels", desc: "Liste de descripteurs (outdoor, grass, animal, happy)." },
      m3: { label: "Accessibilité", value: "Principe d'Inclusion", desc: "Alimente les lecteurs d'écran pour personnes non-voyantes." },
      rules: [
        "1. Pour créer automatiquement des textes alternatifs (alt text) pour des images web, utiliser la fonctionnalité Caption d'Azure AI Vision.",
        "2. Le score de confiance (entre 0.0 et 1.0) indique la certitude du modèle sur la description produite."
      ],
      tag: "LÉGENDAGE & TAGS"
    },
    {
      title: "Modèles Multimodaux : Vision & Langage Unifiés",
      lead: "Comment poser une question en langage naturel à propos d'une image et obtenir une réponse détaillée ?",
      heading: "Convergence Vision et Modèles de Langage",
      body: "Avec l'avènement des modèles multimodaux (comme GPT-4o dans Azure OpenAI et Florence dans Azure AI Vision), les systèmes d'IA peuvent désormais recevoir simultanément des images et du texte en entrée. Ils sont capables de répondre à des questions complexes sur une image ('Combien de personnes portent un casque sur ce chantier ?' ou 'Explique le schéma technique affiché').",
      m1: { label: "Entrée Combinée", value: "Image + Prompt Texte", desc: "L'image sert de contexte visuel pour la question textuelle." },
      m2: { label: "Capacité", value: "Raisonnement Visuel", desc: "Compréhension des relations spatiales et du texte présent dans l'image." },
      m3: { label: "Cas d'Usage", value: "Inspection & Assistance", desc: "Aide au diagnostic médical, contrôle qualité industriel." },
      rules: [
        "1. Un modèle capable de traiter à la fois des images et du texte est qualifié de 'multimodal'.",
        "2. Dans Azure, ces fonctionnalités sont propulsées par Azure AI Vision et Azure OpenAI (GPT-4o)."
      ],
      tag: "VISION MULTIMODALE"
    },
    {
      title: "Détection de Contenu Inapproprié dans les Images (Adult & Racy)",
      lead: "Comment filtrer automatiquement les photos de profil téléversées par les utilisateurs sur un forum public ?",
      heading: "Modération Visuelle et Sécurité",
      body: "Azure AI Vision et Azure AI Content Safety analysent les images pour y détecter les contenus réservés aux adultes (pornographie), osés (racy), violents ou sanglants (gory). Chaque catégorie renvoie une valeur booléenne (isAdultContent) ainsi qu'un score de sévérité de 0 à 1, permettant aux plateformes d'automatiser le rejet des images non conformes à leurs conditions d'utilisation.",
      m1: { label: "Catégories", value: "Adult, Racy, Gory", desc: "Classification des types de contenus inappropriés ou violents." },
      m2: { label: "Seuils Réglables", value: "Scores de Risque", desc: "Possibilité de bloquer automatiquement au-delà d'un score donné." },
      m3: { label: "Objectif Éthique", value: "Protection des Mineurs", desc: "Conforme au principe de Fiabilité et Sécurité de l'IA." },
      rules: [
        "1. Pour interdire les images choquantes sur une application mobile, utiliser les fonctionnalités de modération d'Azure AI Content Safety.",
        "2. Toujours prévoir une file de révision humaine pour les cas ambigus proches du seuil de décision."
      ],
      tag: "SÉCURITÉ VISUELLE"
    },
    {
      title: "Indexation Vidéo et Analyse Temporelle (Azure AI Video Indexer)",
      lead: "Quel service extrait automatiquement les visages, mots prononcés, sujets et émotions tout au long d'un fichier vidéo ?",
      heading: "Analyse Multimodale de Fichiers Vidéo",
      body: "Azure AI Video Indexer est un service cloud qui combine plusieurs technologies d'IA (vision par ordinateur, transcription vocale Speech-to-Text, reconnaissance faciale, OCR et NLP) pour analyser des vidéos de bout en bout. Il produit des insights horodatés : transcription intégrale des dialogues, détection des intervenants, identification des personnes célèbres, mots clés et découpage en scènes.",
      m1: { label: "Entrée", value: "Fichiers Vidéo & Audio", desc: "MP4, AVI, MOV avec piste sonore intégrée." },
      m2: { label: "Insights Extraits", value: "Visages, Sujets, Mots", desc: "Génération automatique de chapitres, de tags et de sous-titres fermés (closed captions)." },
      m3: { label: "Recherche", value: "Recherche dans la Vidéo", desc: "Permet de sauter directement à la seconde où un mot précis a été prononcé." },
      rules: [
        "1. Dès qu'une question mentionne l'analyse complète d'un fichier vidéo (voix + images + scènes), la réponse est Video Indexer.",
        "2. Video Indexer génère des fichiers de sous-titres standards (VTT, SRT) prêts pour les lecteurs vidéo."
      ],
      tag: "ANALYSE VIDÉO"
    },
    {
      title: "Architecture Déployée : Single-Service vs Multi-Service Azure AI",
      lead: "Faut-il créer une ressource 'Azure AI Services' unique ou une ressource dédiée 'Computer Vision' ?",
      heading: "Ressources Dédiées vs Ressource Multi-Services",
      body: "Une ressource multi-services 'Azure AI Services' (anciennement Cognitive Services multi-service) donne accès à la Vision, au Langage, à la Parole et à la Traduction avec une seule clé d'API et un seul point de terminaison de facturation unifiée. À l'inverse, une ressource mono-service (ex: ressource Azure AI Vision dédiée) permet d'isoler la facturation, d'attribuer des droits RBAC spécifiques et d'utiliser le niveau gratuit (F0).",
      m1: { label: "Ressource Multi-Services", value: "1 Clé pour Tous les Services", desc: "Idéal pour les applications consommant Vision + NLP + Speech ensemble." },
      m2: { label: "Ressource Mono-Service", value: "Clé & Quota Dédiés", desc: "Idéal pour isoler les coûts d'un département ou bénéficier du palier F0." },
      m3: { label: "Examen AI-900", value: "Question d'Architecture", desc: "Comprendre la différence entre ressource générale et ressource spécifique." },
      rules: [
        "1. Pour utiliser Vision et Langage avec un seul contrat de facturation : déployer une ressource multi-services Azure AI.",
        "2. Si un sous-traitant ne doit avoir accès qu'à la vision, déployer une ressource mono-service Azure AI Vision."
      ],
      tag: "RESSOURCES AZURE AI"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'CLASSIFICATION VS DÉTECTION',
    'OCR & READ API PRATIQUE',
    'CUSTOM VISION SANS CODE',
    'DOCUMENT INTELLIGENCE FACTURES',
    'AZURE AI FACE & BIOMÉTRIE',
    'CAPTIONING & ACCESSIBILITÉ',
    'VISION MULTIMODALE MODERNE',
    'CONTENT SAFETY POUR IMAGES',
    'VIDEO INDEXER & INSIGHTS',
    'MULTI-SERVICE VS SINGLE-SERVICE'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-ai900-d3-${String(num).padStart(3, '0')}`,
    category: `AI-900 • DOMAINE 3 • ${subCategory}`,
    categoryBadgeColor: '#d97706',
    levelTag: `AI-900 • D3 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 15-20%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[AI-900 D3-#${num}] ${baseTopic.title} (Scénario Examen #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Thème essentiel du Domaine 3 de l'examen officiel Azure AI-900.`,
    solutionHeading: `${baseTopic.heading} - Référentiel Vision Microsoft Azure`,
    solutionBody: `${baseTopic.body} Dans le Domaine 3 (15-20%), l'examen teste votre capacité à choisir le bon service cognitif visuel en fonction du problème métier posé (lire un ticket, détecter des objets, reconnaître des visages ou décrire une scène).`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé D3 : La vision par ordinateur repose sur le traitement matriciel des intensités de pixels à l'aide de réseaux de neurones convolutifs (CNN) et de transformeurs visuels.`
    ],
    deckName: "AI-900 : Domaine 3 - Charges de travail de vision par ordinateur",
    domainId: 'domain3',
    domainName: "3. Décrire les fonctionnalités des charges de travail de vision par ordinateur sur Azure",
    certCode: 'AI-900',
  };
});
