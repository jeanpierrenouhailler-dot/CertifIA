import { Flashcard } from '../../types';

// Domaine 2 : Mettre en œuvre des solutions de Vision par ordinateur (100 Flashcards)
// Poids officiel AI-102 : 20-25%
export const domain2Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `D2-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Azure AI Vision Analyze Image API v4.0 (Visual Features)",
      lead: "Comment sélectionner précisément les caractéristiques visuelles souhaitées pour minimiser les coûts d'appel ?",
      heading: "Paramétrage de l'API Image Analysis 4.0",
      body: "L'API Image Analysis 4.0 utilise le paramètre de requête 'features' (ex: features=tags,read,caption,denseCaptions,objects,people,smartCrops). Chaque feature active une branche de modèle spécifique et fait l'objet d'une unité de facturation distincte. Pour extraire du texte et une légende globale sans surcoût, activez uniquement 'features=caption,read'.",
      m1: { label: "Features Clés", value: "caption, read, objects", desc: "Permet de mixer OCR et description en 1 seule requête." },
      m2: { label: "Dense Captions", value: "Multi-zones", desc: "Génère des descriptions textuelles détaillées pour jusqu'à 10 sous-régions." },
      m3: { label: "People Detection", value: "Bounding boxes + Confidence", desc: "Localise les silhouettes humaines sans identification faciale nominative." },
      rules: [
        "1. Ne jamais demander toutes les features sans besoin métier : chaque feature additionnelle augmente la latence et le coût.",
        "2. Utiliser 'smartCrops' avec l'aspect ratio cible pour le recadrage automatique centré sur le sujet principal.",
      ],
      tag: "VISION ANALYZE API"
    },
    {
      title: "Custom Vision : Classification Multiclass vs Multilabel",
      lead: "Quand choisir un projet Multiclass plutôt que Multilabel pour catégoriser des composants industriels ?",
      heading: "Typologie de Projets Custom Vision",
      body: "Un projet Multiclass assigne une étiquette et une seule par image (les probabilités de toutes les classes somment à 1 via Softmax). Un projet Multilabel assigne zéro, une ou plusieurs étiquettes indépendantes par image (chaque classe est évaluée avec Sigmoid indépendamment). Pour classer des pièces selon leur état 'Conforme' vs 'Défectueux', Multiclass est requis.",
      m1: { label: "Multiclass", value: "1 seule étiquette", desc: "Classes mutuellement exclusives (ex: Chat OU Chien OU Oiseau)." },
      m2: { label: "Multilabel", value: "Plusieurs étiquettes", desc: "Propriétés cumulatives (ex: 'Extérieur', 'Jour', 'Pluvieux')." },
      m3: { label: "Minimum Dataset", value: "15 images par classe", desc: "Requis pour démarrer l'entraînement (50+ recommandé pour la prod)." },
      rules: [
        "1. Si une image peut présenter à la fois une fissure ET une corrosion, configurer impérativement Multilabel.",
        "2. Équilibrer les volumes d'images par classe pour éviter le surapprentissage (overfitting) sur la classe majoritaire.",
      ],
      tag: "CUSTOM VISION"
    },
    {
      title: "Arbitrage Precision vs Recall dans Custom Vision",
      lead: "Comment ajuster le seuil de probabilité selon l'impact des faux positifs versus faux négatifs ?",
      heading: "Optimisation de la Matrice de Confusion",
      body: "La Precision (Justesse) mesure : TP / (TP + FP). Le Recall (Rappel) mesure : TP / (TP + FN). Augmenter le 'Probability Threshold' (ex: de 50% à 85%) augmente la Precision (moins de faux positifs, prédictions très sûres) mais réduit le Recall. En détection de défauts critiques de sécurité, on baisse le seuil pour maximiser le Recall (aucun défaut manqué toléré, quitte à générer des faux positifs révisés par un humain).",
      m1: { label: "Haute Précision", value: "Seuil élevé (> 80%)", desc: "Idéal si un faux positif a un coût financier lourd." },
      m2: { label: "Haut Rappel", value: "Seuil bas (< 40%)", desc: "Indispensable pour le diagnostic médical et la sécurité critique." },
      m3: { label: "Métrique Synthétique", value: "Score mAP", desc: "Mean Average Precision sur l'ensemble des classes." },
      rules: [
        "1. Pour l'examen AI-102 : 'minimiser les faux négatifs' implique TOUJOURS d'augmenter le Recall (baisser le seuil).",
        "2. 'Minimiser les faux positifs' implique TOUJOURS d'augmenter la Precision (monter le seuil).",
      ],
      tag: "ÉVALUATION ML"
    },
    {
      title: "Overlap Threshold (IoU) et Non-Maximum Suppression (NMS)",
      lead: "À quoi sert le seuil d'Overlap dans un projet Custom Vision Object Detection ?",
      heading: "Suppression des Détections Redondantes",
      body: "L'Overlap Threshold est basé sur l'Intersection over Union (IoU) entre deux boîtes englobantes (bounding boxes). Lors de l'inférence, l'algorithme Non-Maximum Suppression (NMS) élimine les boîtes chevauchantes pour le même objet en ne conservant que celle ayant le score de probabilité le plus élevé. Si l'Overlap Threshold est trop bas, des objets réels très proches l'un de l'autre seront ignorés comme doublons.",
      m1: { label: "IoU Formule", value: "Zone d'Intersection / Zone d'Union", desc: "Mesure le taux de recouvrement spatial entre 2 rectangles." },
      m2: { label: "Valeur Standard", value: "0.5 (50%)", desc: "Seuil standard pour fusionner les détections multiples du même objet." },
      m3: { label: "Effet Seuil Élevé", value: "Conserve plus de boîtes", desc: "Permet de détecter des objets collés ou entassés." },
      rules: [
        "1. Si deux objets distincts superposés ne sont détectés qu'une seule fois, augmenter l'Overlap Threshold.",
        "2. Si un même objet génère 3 rectangles quasi-identiques, baisser l'Overlap Threshold.",
      ],
      tag: "OBJECT DETECTION"
    },
    {
      title: "Exportation Edge de Modèles Custom Vision (Compact Domains)",
      lead: "Quels formats d'export sont disponibles pour faire tourner le modèle hors-ligne sur un appareil IoT ?",
      heading: "Inférence Edge Déconnectée",
      body: "Pour exporter un modèle Custom Vision, le projet doit obligatoirement être créé avec un domaine 'Compact' (ex: General [compact], Food [compact]). Une fois entraîné, le modèle peut être exporté au format ONNX (Windows ML), TensorFlow Lite (Android), CoreML (iOS), ou sous forme de conteneur Docker avec serveur Flask prêt à être déployé sur Azure IoT Edge.",
      m1: { label: "Prérequis Initial", value: "Domaine 'Compact'", desc: "Un modèle entraîné sur un domaine standard ne peut JAMAIS être exporté." },
      m2: { label: "Formats Phares", value: "ONNX, TF Lite, Docker", desc: "Inférence temps réel basse consommation sur puces Edge." },
      m3: { label: "Taille Modèle", value: "~10 à 30 Mo", desc: "Optimisé par quantification et élagage de réseau." },
      rules: [
        "1. Toujours choisir un domaine Compact dès la création du projet si une inférence Edge sans cloud est prévue.",
        "2. Déployer l'image Docker exportée sur Azure IoT Edge pour une exécution ultra-rapide sur la chaîne de production.",
      ],
      tag: "EDGE & IOT"
    },
    {
      title: "Document Intelligence : Modèles Prédéfinis vs Modèles Composés",
      lead: "Comment traiter automatiquement des factures, reçus et pièces d'identité avec un seul point d'entrée ?",
      heading: "Azure AI Document Intelligence (Form Recognizer)",
      body: "Document Intelligence fournit des modèles pré-entraînés 'Prebuilt' (invoices, receipts, identity documents, tax forms) pour extraire clés-valeurs, lignes de facturation et montants sans aucun entraînement. Pour les formulaires sur mesure, entraînez des modèles personnalisés (Custom Extraction). Vous pouvez regrouper jusqu'à 200 modèles personnalisés sous un 'Composed Model' : le système classifie d'abord le document avant d'appliquer le sous-modèle adapté.",
      m1: { label: "Prebuilt Models", value: "0 entraînement requis", desc: "Extraction immédiate des champs normalisés internationaux." },
      m2: { label: "Composed Models", value: "Jusqu'à 200 modèles", desc: "Un seul Model ID gère tous les types de formulaires métier." },
      m3: { label: "Custom Extraction", value: "Minimum 5 documents", desc: "Requis pour entraîner un modèle avec ou sans labels." },
      rules: [
        "1. Pour composer des modèles, chaque sous-modèle doit avoir été entraîné avec des étiquettes (labels).",
        "2. Toujours tester le modèle Prebuilt correspondant avant d'envisager la création d'un modèle Custom.",
      ],
      tag: "DOCUMENT INTELLIGENCE"
    },
    {
      title: "Face API : Face Verification (1:1) vs Face Identification (1:N)",
      lead: "Distinguez l'authentification d'un utilisateur de la recherche dans une galerie de suspects.",
      heading: "Biométrie Faciale & Groupes de Personnes",
      body: "La vérification (1:1) compare un visage détecté avec une identité spécifique déclarée (ex: contrôle d'accès biométrique où l'utilisateur présente son badge). L'identification (1:N) compare un visage détecté contre une galerie de milliers de visages enregistrés dans un 'PersonGroup' ou 'LargePersonGroup' (jusqu'à 1 million de personnes) pour trouver les correspondances les plus probables.",
      m1: { label: "Vérification 1:1", value: "isIdentical + confidence", desc: "Répond à la question : 'S'agit-il bien de cette personne ?'." },
      m2: { label: "Identification 1:N", value: "Liste de candidats ordonnée", desc: "Répond à la question : 'Qui est cette personne dans le groupe ?'." },
      m3: { label: "LargePersonGroup", value: "Jusqu'à 1 000 000 profils", desc: "Nécessite d'appeler l'API 'Train' après chaque ajout ou mise à jour." },
      rules: [
        "1. Toujours appeler 'LargePersonGroup - Train' et vérifier le statut avec 'Get Training Status' avant d'effectuer des identifications.",
        "2. Face API nécessite une approbation d'accès 'Limited Access' auprès de Microsoft pour être activée.",
      ],
      tag: "FACE API"
    },
    {
      title: "Liveness Detection dans Face API contre le Spoofing",
      lead: "Comment contrer les attaques par présentation (photos imprimées, masques 3D, vidéos rejouées) ?",
      heading: "Détection du Caractère Vivant",
      body: "Liveness Detection analyse les micro-mouvements, la texture de peau, la réflexion lumineuse et la géométrie 3D pour s'assurer que le visage devant la caméra est un être humain réel et présent en direct, et non une photo imprimée ou un deepfake sur smartphone. Elle peut être combinée en une seule session avec la vérification faciale 1:1 (Liveness with face verification).",
      m1: { label: "Protection", value: "Anti-Spoofing ISO 30107-3", desc: "Conforme aux plus hauts standards bancaires PAD (Presentation Attack Detection)." },
      m2: { label: "Flux SDK", value: "Session ID éphémère", desc: "Le backend crée la session, le SDK client capture les images en streaming." },
      m3: { label: "Action Recommandée", value: "Vérification combinée", desc: "Valide le caractère vivant et l'identité en un seul aller-retour." },
      rules: [
        "1. Intégrer le SDK Azure AI Face côté mobile/web pour orchestrer la capture vidéo interactive.",
        "2. Ne jamais exécuter la décision d'accès uniquement côté client : vérifier le token de validation côté backend.",
      ],
      tag: "LIVENESS & SÉCURITÉ"
    },
    {
      title: "Azure AI Video Indexer (Insights & Extraction Multimodale)",
      lead: "Quelles métadonnées automatiques Video Indexer génère-t-il sur un flux vidéo ?",
      heading: "Indexation Vidéo Cognitive",
      body: "Azure AI Video Indexer ingère les fichiers vidéo et extrait simultanément : la transcription audio (Speech-to-Text avec horodatage mot à mot), les visages reconnus, les étiquettes visuelles (objets, scènes, actions), le texte visible à l'écran (OCR vidéo), les sentiments vocaux, les sujets abordés et les plans de caméra (shot detection). Les insights sont retournés sous forme d'un document JSON structuré.",
      m1: { label: "Formats Ingestés", value: "MP4, AVI, MOV, WMV", desc: "Support de plus de 40 codecs vidéo et audio courants." },
      m2: { label: "Recherche Précise", value: "Horodatage temporel", desc: "Permet de sauter directement à la seconde exacte où apparaît un mot ou un visage." },
      m3: { label: "Widgets Intégrables", value: "Player & Insights widgets", desc: "Composants iFrame prêts à intégrer dans des portails web d'entreprise." },
      rules: [
        "1. Associer Video Indexer à un compte Azure Media Services / Azure Storage pour le stockage longue durée.",
        "2. Utiliser l'API 'Get Video Index' en mode 'polling' ou configurer une URL de callback pour être notifié de la fin d'indexation.",
      ],
      tag: "VIDEO INDEXER"
    },
    {
      title: "Azure AI Spatial Analysis (Vision en Temps Réel sur Flux RTSP)",
      lead: "Comment mesurer la distanciation physique et le temps de présence en magasin sans stocker d'images ?",
      heading: "Edge Vision Analytics sur Caméras de Surveillance",
      body: "Azure AI Spatial Analysis est un ensemble de conteneurs déployés sur Azure IoT Edge connectés à des flux vidéo de caméras IP (RTSP). Il analyse en temps réel les opérations : 'personcount' (nombre de personnes dans un polygone), 'persondistance' (respect de distance entre personnes), et 'personcrossingline' (franchissement de lignes virtuelles). Aucune image ni visage n'est sauvegardé : seuls des événements de télémétrie JSON sont transmis vers Azure IoT Hub.",
      m1: { label: "Protocole Caméra", value: "RTSP (Real-Time Streaming)", desc: "Se connecte directement aux caméras de sécurité existantes." },
      m2: { label: "Respect Vie Privée", value: "Zero Image Stored", desc: "Les images sont traitées en mémoire volatile GPU et immédiatement effacées." },
      m3: { label: "Opérations Disponibles", value: "Line, Zone, Distance", desc: "Zones polygonales définies par coordonnées cartésiennes normalisées." },
      rules: [
        "1. Nécessite un matériel GPU sur site (NVIDIA Tesla T4 ou supérieur) pour assurer 15+ FPS par flux vidéo.",
        "2. Définir des zones d'exclusion pour ne pas monitorer les voies publiques ou les zones non autorisées.",
      ],
      tag: "SPATIAL ANALYSIS"
    }
  ];

  const baseTopic = topics[(index) % topics.length];
  const subCategoryList = [
    'ANALYZE IMAGE & OCR 4.0',
    'CUSTOM VISION CLASSIFICATION',
    'OBJECT DETECTION & BOUNDING BOXES',
    'PRECISION / RECALL THRESHOLDS',
    'EXPORTATION EDGE ONNX DOCKER',
    'DOCUMENT INTELLIGENCE PREBUILT',
    'DOCUMENT INTELLIGENCE CUSTOM COMPOSED',
    'FACE API VERIFY & IDENTIFY',
    'LIVENESS DETECTION ANTI-SPOOFING',
    'VIDEO INDEXER & SPATIAL ANALYSIS'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-d2-${String(num).padStart(3, '0')}`,
    category: `DOMAINE 2 • ${subCategory}`,
    categoryBadgeColor: '#f43f5e',
    levelTag: `AI-102 • D2 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 20-25%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[D2-#${num}] ${baseTopic.title} (Focus Pratique #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Objectif officiel Vision par Ordinateur pour Azure AI-102.`,
    solutionHeading: `${baseTopic.heading} - Spécification Microsoft Learn`,
    solutionBody: `${baseTopic.body} Cette compétence est fréquemment testée sous forme d'études de cas de contrôle qualité industriel, numérisation de reçus et surveillance d'accès physique.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle standard D2 : Pour les cas d'usage médicaux ou de conformité légale, vérifier systématiquement l'équilibre Precision/Recall avant tout passage en production.`
    ],
    deckName: 'Domaine 2 : Vision par ordinateur',
    domainId: 'domain2',
    domainName: '2. Mettre en œuvre des solutions de Vision par ordinateur',
  };
});
