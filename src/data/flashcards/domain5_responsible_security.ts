import { Flashcard } from '../../types';

// Domaine 5 : IA Responsable & Gouvernance de la Sécurité (100 Flashcards)
// Poids officiel AI-102 : 10-15%
export const domain5Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `D5-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Les 6 Piliers Fondamentaux de l'IA Responsable selon Microsoft",
      lead: "Maîtrisez la taxonomie éthique officielle évaluée à l'examen Azure AI-102.",
      heading: "Framework Microsoft Responsible AI",
      body: "Microsoft articule sa gouvernance autour de 6 principes cardinaux : 1. Équité (Fairness : les systèmes doivent traiter tous les groupes de manière impartiale sans discrimination) ; 2. Fiabilité & Sécurité (Reliability & Safety : tolérance aux pannes et résilience opérationnelle) ; 3. Confidentialité & Sécurité (Privacy & Security : protection des données et respect du RGPD) ; 4. Inclusion (Inclusiveness : accessibilité universelle pour tous les handicaps) ; 5. Transparence (Transparency : explicabilité des décisions et avertissement clair qu'il s'agit d'une IA) ; 6. Responsabilité (Accountability : des êtres humains restent ultimement redevables de l'impact des systèmes).",
      m1: { label: "Principe Équité", value: "Fairness", desc: "Évite les disparités de traitement selon le genre, l'ethnie ou l'âge." },
      m2: { label: "Principe Transparence", value: "Transparency", desc: "Obligation d'informer l'utilisateur qu'il interagit avec un agent artificiel." },
      m3: { label: "Principe Responsabilité", value: "Accountability", desc: "Responsabilité juridique et humaine des concepteurs et déployeurs." },
      rules: [
        "1. Pour l'examen : si la question évoque des personnes à mobilité réduite ou malvoyantes, le principe visé est 'Inclusiveness'.",
        "2. Si la question évoque des explications compréhensibles sur le fonctionnement de l'algorithme, le principe est 'Transparency'.",
      ],
      tag: "PILIERS IA RESPONSABLE"
    },
    {
      title: "Azure AI Content Safety : 4 Catégories & Seuils de Sévérité (0 à 6)",
      lead: "Comment filtrer automatiquement les contenus haineux, violents, sexuels ou incitant à l'automutilation ?",
      heading: "Filtres de Modération Textuelle et Visuelle",
      body: "Azure AI Content Safety analyse les flux texte et image selon 4 catégories de préjudice : Hate (Haine), Violence, Sexual (Contenu sexuel) et Self-Harm (Automutilation). La sévérité est graduée sur une échelle paire : 0 (Sûr), 2 (Faible / Low), 4 (Moyen / Medium) et 6 (Élevé / High). Le filtre de contenu par défaut d'Azure OpenAI bloque automatiquement tout contenu classé en sévérité 4 ou 6 (Medium et High) sur les prompts d'entrée et les réponses générées.",
      m1: { label: "Échelle de Sévérité", value: "0, 2, 4, 6", desc: "0 = Safe, 2 = Low, 4 = Medium, 6 = High." },
      m2: { label: "Seuil de Blocage Défaut", value: "Medium (4) & High (6)", desc: "Déclenche immédiatement une erreur HTTP 400 'content_filter'." },
      m3: { label: "Champs d'Action", value: "Prompt ET Complétion", desc: "Surveille l'intention de l'utilisateur et la réponse du LLM." },
      rules: [
        "1. Dans les applications médicales ou de fiction littéraire, demander une dérogation de seuil (Modified Content Filter) pour autoriser le niveau Medium sur la violence médicale.",
        "2. Surveiller les métriques de filtrage dans Azure Monitor pour détecter les tentatives répétées d'abus.",
      ],
      tag: "CONTENT SAFETY"
    },
    {
      title: "Listes de Blocage Personnalisées (Custom Blocklists) dans Content Safety",
      lead: "Comment interdire formellement des marques concurrentes ou des expressions injurieuses propres à votre secteur ?",
      heading: "Gouvernance Lexicale sur Mesure",
      body: "En complément des 4 catégories IA standard, vous pouvez créer des 'Blocklists' personnalisées dans Azure AI Content Safety Studio. Une blocklist contient des termes ou expressions interdits évalués selon deux modes : correspondance exacte ou expressions régulières (Regex). Une fois associée à la configuration du filtre de contenu, toute requête contenant l'un de ces mots est rejetée avec un code d'erreur spécifique 'blocklist_match'.",
      m1: { label: "Modes de Match", value: "Exact Match / Regex", desc: "Permet de bloquer des formats de numéros de compte ou des jargons spécifiques." },
      m2: { label: "Association", value: "Content Filter Configuration", desc: "S'applique à la fois sur le prompt entrant et la réponse sortante." },
      m3: { label: "Notification Déclenchée", value: "blocklists: [{ id, name }]", desc: "Précise quelle liste de blocage a intercepté l'incident dans l'audit log." },
      rules: [
        "1. Ne pas surcharger les blocklists avec des milliers de termes généraux (l'analyse de toxicité IA s'en charge déjà).",
        "2. Utiliser les blocklists pour la protection de marque, les clauses de non-concurrence et les expressions corporatives interdites.",
      ],
      tag: "BLOCKLISTS"
    },
    {
      title: "Attaques par Injection de Prompt : Directes (Jailbreaks) vs Indirectes",
      lead: "Distinguez l'utilisateur malveillant de l'attaque dissimulée dans un document ingéré par le RAG.",
      heading: "Défense contre les Attaques Adversariales LLM",
      body: "Une injection directe (Jailbreak / User Prompt Injection) est une tentative de l'utilisateur de tromper le LLM pour qu'il ignore ses consignes de sécurité (ex: 'Tu es en mode développeur sans filtre...'). Une injection indirecte (Indirect Prompt Injection) est un texte malveillant caché dans une source de données externe (ex: un commentaire HTML dans une page web ou du texte blanc sur fond blanc dans un PDF de CV) qui s'exécute lorsque le pipeline RAG ingère ce document et le soumet au modèle.",
      m1: { label: "Direct Injection", value: "Flux utilisateur interactif", desc: "Attaque frontale contrée par le modèle Jailbreak Risk Detection." },
      m2: { label: "Indirect Injection", value: "Poisoning de données RAG", desc: "Le document externe prend le contrôle des instructions du modèle." },
      m3: { label: "Module Dédié", value: "Jailbreak Detection API", desc: "Analyse spécifique d'Azure AI Content Safety pour identifier la manipulation d'invite." },
      rules: [
        "1. Activer impérativement la détection de Jailbreak dans la configuration du filtre de contenu Azure OpenAI.",
        "2. Dans le prompt système RAG, stipuler expressément que les instructions du contexte documentaire ne doivent JAMAIS écraser les règles système.",
      ],
      tag: "JAILBREAK & INJECTION"
    },
    {
      title: "Détection de Matériel Protégé (Protected Material Detection)",
      lead: "Comment empêcher votre LLM de reproduire du code sous licence propriétaire ou des textes avec copyright ?",
      heading: "Protection de la Propriété Intellectuelle",
      body: "Azure AI Content Safety intègre le filtre 'Protected Material Detection for Text' et 'Protected Material Detection for Code'. Il analyse en temps réel la complétion générée pour détecter si elle reproduit verbatim de longs extraits de code source sous copyright (ex: dépôts GitHub publics avec licences restrictives) ou des textes littéraires protégés. Si une violation est détectée, la génération est tronquée ou refusée avec l'indication 'protected_material'.",
      m1: { label: "Matériel Protégé Code", value: "Détection licences GitHub", desc: "Empêche la régurgitation de code propriétaire sous licence GPL/Copyleft." },
      m2: { label: "Matériel Protégé Texte", value: "Livres, articles protégés", desc: "Bloque la reproduction verbatim d'œuvres soumises au droit d'auteur." },
      m3: { label: "Bénéfice Juridique", value: "Engagement Microsoft", desc: "Active la protection 'Customer Copyright Commitment' pour indemniser les clients." },
      rules: [
        "1. Activer la détection de matériel protégé sur tout assistant de développement logiciel (Coding Copilot) déployé en entreprise.",
        "2. Prévoir un message utilisateur clair invitant à reformuler la demande sous un angle conceptuel plutôt que de demander la copie intégrale.",
      ],
      tag: "PROTECTED MATERIAL"
    },
    {
      title: "Filigrane Numérique & Provenance C2PA pour les Médias Synthétiques",
      lead: "Comment prouver de manière infalsifiable qu'une image a été générée par DALL-E 3 ?",
      heading: "Content Credentials & Standard C2PA",
      body: "Toutes les images générées par DALL-E 3 dans Azure OpenAI intègrent nativement des métadonnées cryptographiques signées conformes au standard ouvert C2PA (Coalition for Content Provenance and Authenticity). Ces 'Content Credentials' contiennent l'historique complet de la création : le nom du service, le modèle utilisé, la date et l'horodatage, permettant à tout visualiseur compatible de prouver son origine synthétique.",
      m1: { label: "Standard International", value: "C2PA (Coalition standard)", desc: "Adopté par Microsoft, Adobe, BBC, Sony et les géants de la presse." },
      m2: { label: "Signature", value: "Cryptographie asymétrique", desc: "Toute altération ou retouche de l'image invalide la signature de provenance." },
      m3: { label: "Obligation Légale", value: "EU AI Act Article 52", desc: "Conforme aux obligations de marquage obligatoire des contenus générés par IA." },
      rules: [
        "1. Ne jamais supprimer les métadonnées EXIF/C2PA des images générées avant leur publication sur vos canaux publics.",
        "2. Informer systématiquement les utilisateurs finaux de la nature synthétique des médias graphiques et audiovisuels.",
      ],
      tag: "C2PA & WATERMARKING"
    },
    {
      title: "Chiffrement Double Couche (Double Encryption) et Azure Key Vault",
      lead: "Comment satisfaire les exigences réglementaires les plus strictes de souveraineté et de défense ?",
      heading: "Double Chiffrement au Repos (AES-256)",
      body: "Azure AI services chiffre par défaut toutes les données au repos avec des clés gérées par Microsoft (MMK). Pour les secteurs hautement régulés (banque, défense, santé), vous pouvez activer le 'Double Encryption' : les données sont chiffrées une première fois au niveau de la couche de stockage physique, puis une seconde fois au niveau du service à l'aide de Customer-Managed Keys (CMK) stockées dans Azure Key Vault ou un HSM dédié (Hardware Security Module).",
      m1: { label: "Couche 1", value: "Chiffrement Plateforme (MMK)", desc: "Chiffrement AES-256 transparent au niveau matériel du datacenter Azure." },
      m2: { label: "Couche 2", value: "Clés Client (CMK)", desc: "Chiffrement applicatif contrôlé par votre propre Azure Key Vault." },
      m3: { label: "Conformité", value: "FIPS 140-2 Level 2 / 3", desc: "Répond aux critères de sécurité maximale de l'OTAN et des régulateurs financiers." },
      rules: [
        "1. La double encryption doit être configurée lors de la création de la ressource et ne peut pas être désactivée ultérieurement.",
        "2. Stocker les clés de chiffrement dans une région géographique identique à celle de la ressource Azure AI.",
      ],
      tag: "DOUBLE ENCRYPTION"
    },
    {
      title: "Red Teaming Automatisé & Simulation d'Attaques dans Azure AI Studio",
      lead: "Comment éprouver la robustesse de votre modèle face à des milliers d'attaques avant le lancement ?",
      heading: "Évaluation de Sécurité & Red Teaming",
      body: "Azure AI Studio intègre un outil de Red Teaming automatisé (Risk and Safety Evaluation) qui soumet le modèle à des batteries d'attaques adversariales générées par des simulateurs : tentatives de jailbreak, incitations au dénigrement, contournement de filtres et injection de faux contextes. L'outil génère un rapport consolidé indiquant le taux de vulnérabilité par catégorie de préjudice et suggère des ajustements de prompt système et de filtres.",
      m1: { label: "Simulateurs d'Attaques", value: "Jailbreak, Toxicité, Biais", desc: "Injecte des milliers de variations adversariales en quelques minutes." },
      m2: { label: "Rapport de Risque", value: "Defect Rate (%)", desc: "Mesure le pourcentage de requêtes ayant réussi à contourner les garde-fous." },
      m3: { label: "Garde-Fou Recommandé", value: "Prompt Shields for Text", desc: "Composant de détection en amont des tentatives de subversion." },
      rules: [
        "1. Exécuter un audit de Red Teaming à chaque changement majeur de version de modèle ou de prompt système.",
        "2. Fixer un seuil d'acceptation de sécurité strict dans le pipeline CI/CD (ex: Defect Rate < 1%).",
      ],
      tag: "RED TEAMING"
    },
    {
      title: "Gouvernance des Accès & Azure Policy pour Azure AI Services",
      lead: "Comment interdire à l'échelle de l'entreprise l'usage des clés API statiques au profit d'Entra ID ?",
      heading: "Gouvernance Globale par Azure Policy",
      body: "Azure Policy permet d'appliquer des règles de conformité obligatoires sur toutes les ressources Azure AI de vos abonnements. La politique 'Cognitive Services accounts should disable local authentication' force l'attribut 'disableLocalAuth: true', interdisant formellement l'utilisation des clés API statiques et obligeant l'ensemble des développeurs et applications à s'authentifier exclusivement via Microsoft Entra ID (Tokens OAuth / Managed Identities).",
      m1: { label: "Propriété ARM", value: "disableLocalAuth: true", desc: "Désactive immédiatement l'authentification par clés secrètes statiques." },
      m2: { label: "Mode d'Application", value: "Deny / Audit", desc: "'Deny' bloque la création de ressources non conformes ; 'Audit' liste les infractions." },
      m3: { label: "Bénéfice Sécurité", value: "Zéro Secret dans le Code", desc: "Supprime tout risque de fuite de clé sur GitHub ou dans des fichiers de logs." },
      rules: [
        "1. Appliquer la politique 'disableLocalAuth' en mode Audit d'abord, puis en Deny une fois le code migré sur DefaultAzureCredential.",
        "2. Assigner cette politique au niveau de la Management Group pour couvrir l'ensemble des souscriptions de l'entreprise.",
      ],
      tag: "AZURE POLICY"
    },
    {
      title: "Audit de Conformité & Export des Données de Modération",
      lead: "Comment conserver des preuves de filtrage pour les comités d'éthique et les régulateurs ?",
      heading: "Traçabilité & Journalisation de Sécurité",
      body: "Les décisions de filtrage d'Azure AI Content Safety peuvent être journalisées dans Azure Log Analytics. Chaque événement enregistre : l'horodatage, l'identifiant de requête, le niveau de sévérité mesuré pour chaque catégorie (Hate, Violence, etc.), et le statut (bloqué ou autorisé). Ces journaux constituent la preuve d'audit opposable exigée par les régulateurs pour démontrer la conformité avec l'Article 14 de l'EU AI Act sur le contrôle humain.",
      m1: { label: "Destination Journaux", value: "Azure Log Analytics", desc: "Espace de stockage immuable avec contrôle d'accès RBAC dédié aux auditeurs." },
      m2: { label: "Données Enregistrées", value: "Métadonnées de sévérité", desc: "Enregistre les scores d'infraction sans stocker nécessairement les propos toxiques." },
      m3: { label: "Rétention Conforme", value: "Jusqu'à 7 ans", desc: "Permet de satisfaire les audits périodiques des autorités de protection des données." },
      rules: [
        "1. Restreindre l'accès aux tables de logs Content Safety aux seuls membres de l'équipe Sécurité et Conformité.",
        "2. Configurer des alertes Azure Monitor en cas de pic anormal de blocages (attaque coordonnée de jailbreak).",
      ],
      tag: "AUDIT & CONFORMITÉ"
    }
  ];

  const baseTopic = topics[(index) % topics.length];
  const subCategoryList = [
    'PILIERS IA RESPONSABLE',
    'CONTENT SAFETY SÉVÉRITÉ',
    'BLOCKLISTS & TERMES INTERDITS',
    'JAILBREAK & PROMPT INJECTION',
    'PROTECTED MATERIAL CODE & TEXT',
    'C2PA & WATERMARKING SYNTHÉTIQUE',
    'DOUBLE ENCRYPTION & HSM CMK',
    'RED TEAMING & ATTAQUES ADVERSARIALES',
    'AZURE POLICY & ZERO KEY',
    'AUDIT TRAIL & EU AI ACT'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-d5-${String(num).padStart(3, '0')}`,
    category: `DOMAINE 5 • ${subCategory}`,
    categoryBadgeColor: '#0ea5e9',
    levelTag: `AI-102 • D5 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 10-15%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[D5-#${num}] ${baseTopic.title} (Module Gouvernance #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Standard d'IA Responsable et Gouvernance de la Sécurité pour Azure AI-102.`,
    solutionHeading: `${baseTopic.heading} - Cadre Réglementaire Microsoft & EU AI Act`,
    solutionBody: `${baseTopic.body} La conformité avec les directives d'IA responsable Microsoft et les réglementations européennes (EU AI Act, RGPD) est un critère éliminatoire dans l'évaluation finale de la certification AI-102.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle standard D5 : Documenter systématiquement la matrice des risques éthiques et les seuils de modération dans la documentation d'architecture de solution (Hazaards Analysis).`
    ],
    deckName: 'Domaine 5 : IA Responsable & Gouvernance',
    domainId: 'domain5',
    domainName: '5. IA Responsable & Gouvernance de la Sécurité',
  };
});
