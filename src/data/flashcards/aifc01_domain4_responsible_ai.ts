import { Flashcard } from '../../types';

// AWS AIF-C01 - Domaine 4 : Directives d'IA responsable et gouvernance de données (100 Flashcards)
// Poids officiel de l'examen AWS Certified AI Practitioner : 14%
export const aifc01Domain4Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `AIF-D4-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Les 6 Piliers Fondamentaux de l'IA Responsable selon AWS",
      lead: "Quels sont les six principes directeurs régissant le développement et le déploiement éthique de l'IA sur AWS ?",
      heading: "Cadre Éthique et de Gouvernance de l'IA chez AWS",
      body: "AWS structure sa politique d'IA responsable autour de 6 piliers majeurs : 1. Équité (Fairness) : traiter équitablement tous les groupes démographiques sans préjugés ; 2. Explicabilité (Explainability) : permettre la compréhension des raisons motivant une prédiction ; 3. Robustesse et Fiabilité (Robustness) : garantir un fonctionnement prévisible même sous contrainte ou données bruitées ; 4. Confidentialité et Protection des Données (Privacy) : protéger les données sensibles et PII ; 5. Sécurité (Security) : défendre les systèmes contre les attaques malveillantes ; 6. Contrôlabilité (Controllability) : maintenir une supervision humaine (Human-in-the-loop).",
      m1: { label: "Équité & Neutralité", value: "Fairness", desc: "Élimination des biais discriminatoires envers les populations vulnérables." },
      m2: { label: "Transparence", value: "Explainability & Service Cards", desc: "Clarté sur le fonctionnement et les limites intrinsèques des modèles." },
      m3: { label: "Supervision Humaine", value: "Controllability / HITL", desc: "Capacité des opérateurs humains à auditer et corriger les décisions de l'IA." },
      rules: [
        "1. Pour l'examen, mémoriser les 6 piliers : Équité, Explicabilité, Robustesse, Confidentialité, Sécurité, Contrôlabilité.",
        "2. L'IA responsable n'est pas qu'une question morale : elle est exigée par les régulations (EU AI Act, RGPD)."
      ],
      tag: "PILIERS IA RESPONSABLE"
    },
    {
      title: "Origines et Typologies des Biais dans les Données de Machine Learning",
      lead: "Comment des données historiques d'embauche sur 10 ans peuvent-elles amener une IA à discriminer involontairement des candidates féminines ?",
      heading: "Biais Historique, Biais d'Échantillonnage et Biais Algorithmique",
      body: "Un modèle ne fait que reproduire les patterns statistiques présents dans ses données d'apprentissage : 1. Biais historique : préjugés et inégalités sociétales passées gravées dans les données (ex: historique d'embauches favorisant les hommes) ; 2. Biais d'échantillonnage (Sampling Bias) : sous-représentation d'une catégorie démographique dans le dataset (ex: tester la reconnaissance faciale sur 90% de visages masculins à peau claire) ; 3. Biais de mesure : instruments de collecte défectueux ou mal étalonnés selon les contextes.",
      m1: { label: "Biais Historique", value: "Inégalités Passées Répliquées", desc: "Le modèle perpétue des injustices existantes présentes dans les archives." },
      m2: { label: "Biais d'Échantillonnage", value: "Sous-Représentation de Données", desc: "Certains groupes ont trop peu d'échantillons pour que le modèle généralise bien." },
      m3: { label: "Correction Pré-Train", value: "Ré-équilibrage & SMOTE", desc: "Sur-échantillonnage des groupes minoritaires ou collecte ciblée de données." },
      rules: [
        "1. Une grande quantité de données ne garantit pas l'absence de biais si la collecte est mal représentative.",
        "2. Toujours auditer les données en amont de l'entraînement avec Amazon SageMaker Clarify."
      ],
      tag: "ORIGINE DES BIAIS"
    },
    {
      title: "Audit d'Équité avec Amazon SageMaker Clarify (Métriques Pré- et Post-Entraînement)",
      lead: "Quel service AWS mesure mathématiquement les déséquilibres démographiques avant et après l'entraînement ?",
      heading: "Détection Automatisée de Biais et Rapports d'Équité",
      body: "Amazon SageMaker Clarify permet de quantifier les biais à chaque étape du cycle de vie ML : 1. Métriques pré-entraînement (sur les données brutes) : CI (Class Imbalance - mesure la disparité de volume d'échantillons entre groupes) et DPL (Difference in Positive Proportions in Labels - compare les taux d'étiquettes favorables historiques) ; 2. Métriques post-entraînement (sur les prédictions) : Disparate Impact (ratio des taux de sélection) et CDD (Conditional Demographic Disparity).",
      m1: { label: "CI (Class Imbalance)", value: "Pré-Entraînement Données", desc: "Vérifie si un groupe protégé est minoritaire dans le jeu de données d'origine." },
      m2: { label: "DPL", value: "Différence de Traitement Passé", desc: "Compare les taux d'attribution historique d'un prêt ou d'un avantage." },
      m3: { label: "Disparate Impact", value: "Post-Entraînement Prédictions", desc: "Vérifie si les prédictions finales du modèle traitent équitablement chaque groupe." },
      rules: [
        "1. Pour auditer formellement les biais algorithmiques sur AWS, le service officiel est SageMaker Clarify.",
        "2. Clarify produit des rapports d'audit PDF exportables pour prouver la conformité aux régulateurs bancaires."
      ],
      tag: "SAGEMAKER CLARIFY ÉQUITÉ"
    },
    {
      title: "Explicabilité des Modèles et Valeurs SHAP (Shapley Additive exPlanations)",
      lead: "Pourquoi un organisme de crédit rejetant une demande de prêt doit-il impérativement utiliser les valeurs SHAP pour justifier sa décision ?",
      heading: "Attribution des Caractéristiques par Théorie des Jeux Coopératifs",
      body: "Dans les secteurs hautement réglementés (crédit, assurance, santé), la loi interdit l'effet 'boîte noire' (Black Box) : l'entreprise doit expliquer le motif exact d'un refus. Amazon SageMaker Clarify utilise les valeurs SHAP, issues de la théorie des jeux : 1. Chaque caractéristique (revenu, taux d'endettement, ancienneté) reçoit un score SHAP quantifiant son impact positif ou négatif sur la décision finale ; 2. Explicabilité locale : explique la prédiction spécifique pour un individu donné ; 3. Explicabilité globale : classe l'importance relative des variables sur tout le modèle.",
      m1: { label: "Score SHAP Positif", value: "Augmente la Probabilité", desc: "Ex: un revenu élevé augmente les chances d'approbation du prêt." },
      m2: { label: "Score SHAP Négatif", value: "Diminue la Probabilité", desc: "Ex: un incident bancaire récent a fait basculer la décision vers le refus." },
      m3: { label: "Explicabilité Locale", value: "Justification Personnalisée", desc: "Permet de fournir au client la liste des motifs exacts de rejet de son dossier." },
      rules: [
        "1. Dès qu'une question parle 'd'expliquer la contribution de chaque variable à une prédiction individuelle' : choisir les valeurs SHAP.",
        "2. Les valeurs SHAP sont indépendantes du modèle (Model-Agnostic) et fonctionnent aussi bien sur XGBoost que sur des réseaux profonds."
      ],
      tag: "EXPLICABILITÉ SHAP"
    },
    {
      title: "AWS AI Service Cards : La Transparence Documentée des Services Cognitifs",
      lead: "Où un architecte AWS peut-il vérifier officiellement les cas d'utilisation prévus, les limites et les résultats d'équité d'Amazon Rekognition ?",
      heading: "Fiches de Transparence Publiques pour l'IA Responsable",
      body: "Les AWS AI Service Cards sont des fiches documentaires publiques fournies par AWS pour ses services d'IA managés (Amazon Rekognition Face Comparison, Amazon Textract AnalyzeID, Amazon Comprehend). Elles documentent : 1. Les cas d'usage recommandés et les applications déconseillées ; 2. Les résultats des tests d'équité et de précision à travers différents groupes démographiques ; 3. Les conseils de conception et seuils de confiance recommandés pour éviter les faux positifs en production.",
      m1: { label: "Contenu Documenté", value: "Cas Prévus, Limites, Équité", desc: "Transparence totale sur la méthodologie de test et les biais mesurés par AWS." },
      m2: { label: "Seuils de Confiance", value: "Recommandations Officielles", desc: "AWS préconise par exemple un seuil de similarité faciale de 99% pour la sécurité." },
      m3: { label: "Conformité Client", value: "Aide à l'Analyse d'Impact", desc: "Sert de référence officielle pour les équipes de conformité et délégués DPO." },
      rules: [
        "1. Pour connaître les limites d'utilisation et les tests d'équité d'un service d'IA managé AWS : consulter les AWS AI Service Cards.",
        "2. Les Service Cards matérialisent l'engagement d'AWS pour le pilier de Transparence."
      ],
      tag: "AWS AI SERVICE CARDS"
    },
    {
      title: "Supervision Humaine dans la Boucle (Human-in-the-Loop - HITL) avec Amazon A2I",
      lead: "Comment router automatiquement les prédictions d'un modèle dont le score de confiance est inférieur à 80% vers des réviseurs humains ?",
      heading: "Amazon Augmented AI (A2I) pour la Vérification Critique",
      body: "Amazon Augmented AI (Amazon A2I) met en œuvre le principe de supervision humaine (Human-in-the-Loop). Si un modèle de ML ou un service cognitif (Textract, Rekognition) émet une prédiction avec un score de confiance incertain (ex: confiance < 85%) ou sur des documents sensibles prédéfinis, Amazon A2I déclenche automatiquement un workflow de révision humaine. Des opérateurs humains (collaborateurs internes, équipes tierces certifiées) inspectent et corrigent la donnée avant validation finale.",
      m1: { label: "Déclenchement Conditionnel", value: "Seuil de Confiance Faible", desc: "Seuls les cas ambigus sont inspectés par des humains pour optimiser les coûts." },
      m2: { label: "Workforce", value: "Équipes Internes / Privées", desc: "Gestion des accès et des interfaces de révision pour les employés accrédités." },
      m3: { label: "Amélioration Continue", value: "Données pour Ré-entraînement", desc: "Les corrections des opérateurs alimentent le prochain cycle d'apprentissage du modèle." },
      rules: [
        "1. Pour intégrer des vérifications humaines automatiques en cas de score de confiance insuffisant : Amazon A2I (Augmented AI).",
        "2. Amazon A2I est nativement pré-intégré avec Amazon Textract et Amazon Rekognition."
      ],
      tag: "AMAZON A2I & HUMAN-IN-THE-LOOP"
    },
    {
      title: "Filigranes Invisibles (Watermarking C2PA) et Détection de Contenus Génératifs",
      lead: "Comment certifier qu'une image numérique a été générée par un modèle d'IA et prouver son authenticité face aux deepfakes ?",
      heading: "Traçabilité et Normes de Provenance Numérique",
      body: "Face aux risques de désinformation et de contrefaçon visuelle (deepfakes), Amazon Titan Image Generator intègre par défaut un filigrane invisible (Invisible Watermarking) conforme aux normes C2PA (Coalition for Content Provenance and Authenticity). Ce filigrane est imperceptible à l'œil nu, résiste aux compressions, au recadrage et aux modifications de format légères, et permet à une API de détection AWS de confirmer instantanément si une image a été synthétisée par Titan.",
      m1: { label: "Invisible Watermark", value: "Résistant au Recadrage", desc: "Intégré dans les pixels de l'image générée sans altérer sa qualité visuelle." },
      m2: { label: "Norme C2PA", value: "Standard Industriel Ouvert", desc: "Garantit la traçabilité de la création et des métadonnées de l'image." },
      m3: { label: "API de Détection", value: "Vérification Automatisée", desc: "Permet aux plateformes de vérifier si une photo soumise provient de l'IA Titan." },
      rules: [
        "1. Pour marquer et détecter automatiquement les images générées par IA sur AWS : Amazon Titan Image Generator Watermarking.",
        "2. Le filigrane de Titan est activé par défaut et contribue au pilier de Transparence de l'IA responsable."
      ],
      tag: "WATERMARKING C2PA & DEEPFAKES"
    },
    {
      title: "Gouvernance des Données et Respect de la Confidentialité (RGPD / Privacy)",
      lead: "Quelles règles de gouvernance appliquer pour garantir que des données d'entraînement ne violent pas le droit à l'oubli des clients ?",
      heading: "Protection de la Vie Privée et Minimisation des Données",
      body: "Le pilier Confidentialité (Privacy) exige : 1. La minimisation des données : ne collecter que les attributs strictement indispensables à la prédiction ; 2. L'anonymisation et le caviardage automatique des PII (avec Amazon Comprehend) avant l'ingestion ; 3. Le droit à l'effacement : attention, effacer une donnée d'un lac S3 n'efface pas les connaissances mémorisées dans les poids d'un modèle déjà entraîné (peut nécessiter un ré-entraînement) ; 4. Le consentement explicite et la finalité déterminée.",
      m1: { label: "Minimisation", value: "Attributs Pertinents Seuls", desc: "Interdiction de collecter des données personnelles superflues pour le cas d'usage." },
      m2: { label: "Droit à l'Oubli", value: "Impact sur les Modèles", desc: "Sensibilisation aux risques de mémorisation involontaire de données par les LLM." },
      m3: { label: "Anonymisation", value: "K-Anonymat & Masquage", desc: "Remplacement des identifiants directs par des pseudonymes non réversibles." },
      rules: [
        "1. Toujours caviarder les informations PII avant de les transmettre à des modèles d'IA tiers.",
        "2. Les LLM peuvent parfois régurgiter des données d'entraînement mémorisées s'ils ne sont pas protégés par du masquage strict."
      ],
      tag: "PRIVACY & RGPD"
    },
    {
      title: "Robustesse des Systèmes d'IA et Attaques par Empoisonnement (Data Poisoning)",
      lead: "Comment se prémunir contre des attaquants qui injecteraient des faux avis délibérément pour fausser les prédictions d'un modèle ?",
      heading: "Défense de l'Intégrité des Données d'Apprentissage",
      body: "Le pilier Robustesse concerne la résilience du modèle face à des environnements hostiles : 1. Data Poisoning (Empoisonnement de données) : injection malveillante d'échantillons corrompus dans le jeu d'entraînement pour créer une porte dérobée (Backdoor) ou dégrader la performance globale ; 2. Attaques contradictoires (Adversarial Attacks) : ajout de perturbations imperceptibles à une image pour tromper un classificateur ; 3. Parade : validation stricte des sources de données, filtrage d'anomalies statistique et signature cryptographique des datasets.",
      m1: { label: "Data Poisoning", value: "Corruption du Jeu d'Entraînement", desc: "Attaque visant à biaiser le modèle dès sa phase de formation." },
      m2: { label: "Adversarial Examples", value: "Perturbations Indétectables", desc: "Modifications de pixels trompant la vision par ordinateur." },
      m3: { label: "Contre-Mesures", value: "Provenance S3 & Contrôles d'Intégrité", desc: "Validation de schémas stricts et contrôle d'accès IAM sur les compartiments d'entraînement." },
      rules: [
        "1. Protéger les compartiments S3 contenant les données d'entraînement avec des politiques IAM restrictives et le versioning S3.",
        "2. Tester régulièrement la robustesse du modèle face à des données bruitées ou adverses."
      ],
      tag: "ROBUSTESSE & DATA POISONING"
    },
    {
      title: "Le Cadre Réglementaire : EU AI Act et Classification des Risques d'IA",
      lead: "Comment l'IA Responsable d'AWS s'aligne-t-elle avec la législation européenne sur l'IA (EU AI Act) ?",
      heading: "Approche Basée sur les Niveaux de Risque Réglementaire",
      body: "L'EU AI Act classe les systèmes d'IA selon 4 niveaux de risques : 1. Risque inacceptable (interdiction formelle : notation sociale, manipulation subliminale) ; 2. Haut risque (exigences strictes de gouvernance, audit de biais, transparence et supervision humaine : recrutement, santé, crédit bancaire, justice) ; 3. Risque spécifique de transparence (obligation d'informer l'utilisateur qu'il discute avec un bot et de filigraner les deepfakes) ; 4. Risque minimal (aucun fardeau réglementaire : filtres anti-spam, jeux vidéo). AWS fournit les outils (Clarify, Guardrails, Service Cards) pour répondre aux exigences des systèmes à Haut Risque.",
      m1: { label: "Haut Risque", value: "Gouvernance & Audit Obligatoires", desc: "Recrutement, éligibilité aux crédits, santé, infrastructures critiques." },
      m2: { label: "Transparence", value: "Déclaration d'IA & Filigrane", desc: "Les chatbots et images génératives doivent déclarer leur nature artificielle." },
      m3: { label: "Outils AWS", value: "Clarify, Guardrails, A2I", desc: "Permettent aux entreprises de documenter et garantir leur conformité réglementaire." },
      rules: [
        "1. Les systèmes d'IA utilisés pour des décisions RH ou d'octroi de crédits sont classés 'Haut Risque' et exigent un audit d'équité.",
        "2. La supervision humaine (HITL) est une obligation légale pour de nombreuses applications à haut risque."
      ],
      tag: "RÉGLEMENTATION EU AI ACT"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'PILIERS IA RESPONSABLE AWS',
    'ORIGINE & DÉTECTION DES BIAIS',
    'SAGEMAKER CLARIFY ÉQUITÉ',
    'EXPLICABILITÉ & VALEURS SHAP',
    'AWS AI SERVICE CARDS TRANSPARENCE',
    'SUPERVISION HUMAINE AMAZON A2I',
    'WATERMARKING C2PA TITAN IMAGE',
    'CONFIDENTIALITÉ DONNÉES & RGPD',
    'ROBUSTESSE & DATA POISONING',
    'GOUVERNANCE & CADRE RÉGLEMENTAIRE'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-aifc01-d4-${String(num).padStart(3, '0')}`,
    category: `AIF-C01 • DOMAINE 4 • ${subCategory}`,
    categoryBadgeColor: '#f59e0b',
    levelTag: `AIF-C01 • D4 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 14%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[AIF-C01 D4-#${num}] ${baseTopic.title} (Scénario Éthique #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Objectif clé du Domaine 4 (IA Responsable et Gouvernance de Données) pour l'examen AWS AIF-C01.`,
    solutionHeading: `${baseTopic.heading} - Standard AWS Responsible AI`,
    solutionBody: `${baseTopic.body} Le Domaine 4 (14% de l'examen) évalue la conformité éthique et légale des solutions d'IA : explicabilité (SHAP), équité (SageMaker Clarify), transparence (AI Service Cards), supervision humaine (A2I) et protection des données.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé AIF-C01 D4 : L'explicabilité et la supervision humaine (Human-in-the-Loop) sont indispensables dès qu'un modèle prend des décisions impactant la vie, la santé ou les finances des individus.`
    ],
    deckName: "AWS AIF-C01 : Domaine 4 - Directives d'IA responsable et gouvernance",
    domainId: 'domain4',
    domainName: "4. Directives d'IA responsable et gouvernance de données",
    certCode: 'AIF-C01',
  };
});
