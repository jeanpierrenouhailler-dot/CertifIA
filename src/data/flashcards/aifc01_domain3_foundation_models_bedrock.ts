import { Flashcard } from '../../types';

// AWS AIF-C01 - Domaine 3 : Déploiement et applications des solutions d'IA AWS (100 Flashcards)
// Poids officiel de l'examen AWS Certified AI Practitioner : 28% (Le plus lourd de l'examen !)
export const aifc01Domain3Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `AIF-D3-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Amazon Bedrock : Service Serverless Unifié pour les Modèles de Fondation",
      lead: "Quel service AWS permet d'accéder aux meilleurs modèles de fondation du marché via une API unique sans gérer aucun serveur ?",
      heading: "L'Écosystème Majeur d'IA Générative Managée sur AWS",
      body: "Amazon Bedrock est un service entièrement géré (serverless) qui met à disposition les modèles de fondation de pointe des principaux éditeurs d'IA : Anthropic (famille Claude 3.5 Sonnet / Haiku / Opus), Meta (Llama 3 / 3.1), Mistral AI (Mistral Large / Mixtral), AI21 Labs (Jurassic-2), Cohere (Command & Embed), Stability AI (Stable Diffusion) et Amazon Titan (Text, Multimodal Embeddings, Image Generator). Vous consommez ces modèles via une API REST sécurisée unifiée sans déployer ni payer d'instances EC2 permanentes.",
      m1: { label: "Fournisseurs Inclus", value: "Anthropic, Meta, Mistral, Titan...", desc: "Choix étendu de modèles propriétaires et ouverts sous une même API." },
      m2: { label: "Architecture", value: "100% Serverless", desc: "Zéro gestion d'infrastructure, de conteneurs, de patching ou de capacité GPU." },
      m3: { label: "Confidentialité Absolue", value: "Zéro Partage de Données", desc: "Vos requêtes d'entreprise ne servent JAMAIS à entraîner les modèles publics." },
      rules: [
        "1. Pour utiliser Claude 3.5 ou Llama 3 sans gérer d'infrastructure : le choix AWS officiel est Amazon Bedrock.",
        "2. Dans Bedrock, les modèles tiers doivent d'abord être activés via 'Model Access' dans la console de la région choisie."
      ],
      tag: "AMAZON BEDROCK"
    },
    {
      title: "Amazon Bedrock Knowledge Bases : L'Architecture RAG Clé en Main",
      lead: "Comment connecter automatiquement un LLM Bedrock à des milliers de documents PDF sur S3 avec recherche vectorielle sans coder de pipeline complexe ?",
      heading: "Retrieval-Augmented Generation (RAG) Entièrement Géré",
      body: "Bedrock Knowledge Bases automatise l'intégralité du cycle de vie RAG : 1. Ingestion : synchronisation des documents stockés dans un bucket Amazon S3 ; 2. Chunking : découpage intelligent des textes (taille fixe avec chevauchement ou sémantique) ; 3. Vectorisation : calcul des embeddings via Amazon Titan Embeddings ; 4. Indexation : stockage dans une base vectorielle gérée (Amazon OpenSearch Serverless, Pinecone, Aurora pgvector) ; 5. Restitution : lors d'une question, Bedrock recherche les passages les plus pertinents et les injecte comme contexte sourcé dans le prompt du LLM.",
      m1: { label: "Base Vectorielle Standard", value: "OpenSearch Serverless", desc: "Configuration vectorielle automatique en un clic sans provisioning de cluster." },
      m2: { label: "Modèles d'Embedding", value: "Titan Embeddings & Cohere", desc: "Convertissent texte ou images en vecteurs de nombres flottants comparables." },
      m3: { label: "Citations de Sources", value: "Attribution Vérifiable", desc: "Chaque affirmation de la réponse générée renvoie vers l'extrait du document source." },
      rules: [
        "1. Pour implémenter une solution RAG gérée de bout en bout sur AWS sans coder d'ETL vectoriel : Amazon Bedrock Knowledge Bases.",
        "2. Knowledge Bases élimine les hallucinations en ancrant les réponses exclusivement sur les documents de l'entreprise."
      ],
      tag: "BEDROCK KNOWLEDGE BASES (RAG)"
    },
    {
      title: "Agents for Amazon Bedrock : Raisonnement et Exécution Autonome d'Actions",
      lead: "Comment permettre à un modèle de fondation de vérifier un solde bancaire et d'exécuter un virement dans votre base de données ?",
      heading: "Orchestration Intelligente et Appel de Fonctions (Action Groups)",
      body: "Les Agents for Amazon Bedrock étendent les capacités des LLM pour accomplir des tâches multi-étapes complexes : 1. Ils décomposent la demande de l'utilisateur en sous-objectifs logiques grâce au patron de conception ReAct (Reasoning and Acting) ; 2. Ils consultent si nécessaire les Knowledge Bases d'entreprise ; 3. Ils exécutent des 'Action Groups' en appelant des fonctions AWS Lambda définies via des schémas d'API OpenAPI (Swagger) ; 4. Ils synthétisent les résultats obtenus pour répondre au client.",
      m1: { label: "Raisonnement ReAct", value: "Pensée -> Action -> Observation", desc: "L'agent évalue dynamiquement s'il a besoin d'outils externes ou de clarifications." },
      m2: { label: "Action Groups", value: "AWS Lambda & Spécification OpenAPI", desc: "Permet au modèle d'interagir en écriture/lecture avec vos bases CRM et ERP." },
      m3: { label: "Intégration RAG", value: "Knowledge Bases Intégrées", desc: "Accès transparent aux bases de connaissances documentaires en cours de route." },
      rules: [
        "1. Dès qu'un chatbot doit 'exécuter des actions métier concrètes (réserver, commander, modifier)', choisir Agents for Amazon Bedrock.",
        "2. Les autorisations d'exécution sont contrôlées de manière étanche par les rôles IAM de la fonction Lambda."
      ],
      tag: "AGENTS FOR BEDROCK"
    },
    {
      title: "Stratégies de Découpage de Texte (Chunking) dans les Bases de Connaissances",
      lead: "Pourquoi est-il crucial de configurer un chevauchement (Overlap) lors du découpage de documents pour un moteur RAG ?",
      heading: "Prévention de la Perte de Contexte aux Frontières de Chunks",
      body: "Lors de l'ingestion de documents dans Bedrock Knowledge Bases, le texte est découpé en morceaux (Chunks) car les fenêtres d'embedding et de contexte ont une taille finie : 1. Fixed-size Chunking (Taille fixe) : divise le document par exemple en blocs de 300 tokens ; 2. Overlap (Chevauchement, typiquement 10% à 20%) : répète les derniers mots du chunk précédent au début du chunk suivant pour éviter de couper une phrase ou une idée maîtresse en plein milieu ; 3. Hierarchical / Semantic Chunking : découpe par paragraphes et sections naturelles.",
      m1: { label: "Chunk Size", value: "Taille de Fragment (Tokens)", desc: "Équilibre entre spécificité du passage et richesse du contexte entourant." },
      m2: { label: "Chunk Overlap", value: "Chevauchement (10 - 20%)", desc: "Garantit la continuité sémantique et évite les ruptures de sens brutales." },
      m3: { label: "Impact Recherche", value: "Précision Cosinus Élevée", desc: "Un chunk bien dimensionné génère un vecteur d'embedding beaucoup plus net." },
      rules: [
        "1. Si les réponses du RAG tronquent le milieu des explications : augmenter le paramètre de chevauchement (Overlap).",
        "2. Des chunks trop grands diluent l'information pertinente ; des chunks trop petits perdent le contexte global."
      ],
      tag: "CHUNKING STRATEGIES RAG"
    },
    {
      title: "Facturation Bedrock : À la Demande (On-Demand) vs Débit Provisionné (Provisioned Throughput)",
      lead: "Quelle option de tarification Bedrock choisir pour une application critique exigeant un débit garanti de 1 000 requêtes/seconde sans limitation ?",
      heading: "Modèles Économiques et Engagement de Capacité",
      body: "1. À la Demande (On-Demand) : facturation à l'usage strict calculée au nombre de 1 000 tokens traités en entrée et en sortie. Idéal pour le développement, les tests et les charges imprévisibles, mais soumis aux quotas régionaux partagés ; 2. Débit Provisionné (Provisioned Throughput) : réservation d'Unités de Modèle (Model Units) dédiées avec engagement de 1 ou 6 mois (ou sans engagement). Garantit un débit constant de tokens par seconde sans risque de limitation (throttling HTTP 429), obligatoire pour déployer des modèles personnalisés (fine-tunés).",
      m1: { label: "On-Demand", value: "Pay-as-you-go par Token", desc: "Zéro coût fixe, paiement au token d'entrée et de sortie consommé." },
      m2: { label: "Provisioned Throughput", value: "Model Units Réservées", desc: "Débit garanti prévisible et latence constante pour la production à fort trafic." },
      m3: { label: "Modèles Fine-Tunés", value: "Exigent Provisioned Units", desc: "L'inférence d'un modèle personnalisé nécessite l'achat d'unités provisionnées." },
      rules: [
        "1. Pour héberger en production un modèle Bedrock ayant subi un Fine-Tuning personnalisé : Débit Provisionné obligatoire.",
        "2. Pour prototyper une application au coût le plus bas : choisir la tarification À la Demande (On-Demand)."
      ],
      tag: "TARIFICATION BEDROCK"
    },
    {
      title: "Personnalisation dans Bedrock : Fine-Tuning vs Continued Pre-training",
      lead: "Comment enseigner à un modèle de fondation le vocabulaire technique inédit d'une industrie pharmaceutique à partir de 50 Go de brevets bruts non annotés ?",
      heading: "Adaptation Spécifique sur Données d'Entreprise Propriétaires",
      body: "Amazon Bedrock supporte deux modes d'adaptation personnalisée : 1. Continued Pre-training (Pré-entraînement continu) : fournit des données textuelles brutes non étiquetées pour familiariser le modèle avec un jargon spécifique, des acronymes propriétaires ou un domaine très spécialisé (médical, fiscal, juridique) ; 2. Fine-Tuning : fournit des paires étiquetées prompt/réponse attendue (format JSONL) pour spécialiser le modèle dans une tâche précise (ex: rédiger des comptes-rendus médicaux selon un gabarit strict).",
      m1: { label: "Continued Pre-training", value: "Textes Bruts Non Annotés", desc: "Apprend le vocabulaire et les connaissances d'un nouveau domaine d'expertise." },
      m2: { label: "Fine-Tuning", value: "Paires (Prompt, Réponse)", desc: "Ajuste le style, le ton et le respect d'une structure de sortie prédéfinie." },
      m3: { label: "Isolation Complète", value: "Copie Privée Chiffrée KMS", desc: "Votre modèle personnalisé n'est visible que dans votre compte AWS." },
      rules: [
        "1. Pour injecter du vocabulaire métier à partir de documents bruts volumineux : Continued Pre-training.",
        "2. Pour imposer un style d'écriture ou un formatage JSON précis avec des exemples annotés : Fine-Tuning."
      ],
      tag: "FINE-TUNING BEDROCK"
    },
    {
      title: "Amazon Bedrock vs Amazon SageMaker JumpStart : Le Bon Choix d'Architecture",
      lead: "Quand faut-il choisir SageMaker JumpStart plutôt qu'Amazon Bedrock pour exploiter un grand modèle de langage ?",
      heading: "API Managée Serverless vs Contrôle Total de l'Infrastructure",
      body: "Le choix repose sur le niveau de contrôle requis : 1. Amazon Bedrock : API 100% serverless, aucun serveur ou conteneur à administrer, idéal pour intégrer rapidement l'IA générative dans des applications sans équipe MLOps dédiée ; 2. SageMaker JumpStart : déploie les modèles open-source (Llama 3, Mistral, Falcon) sur des instances EC2 gérées par vos soins dans votre propre VPC, offrant un contrôle total sur les hyperparamètres matériels, les conteneurs Docker et le code source de scoring.",
      m1: { label: "Amazon Bedrock", value: "Serverless & Managé", desc: "Simplicité maximale, facturation au token, intégration RAG native en un clic." },
      m2: { label: "SageMaker JumpStart", value: "Instances EC2 Dédiées", desc: "Contrôle d'infrastructure complet, instances GPU dédiées, accès au conteneur Docker." },
      m3: { label: "Critère de Choix", value: "Équipe & Gouvernance", desc: "Privilégier Bedrock par défaut ; JumpStart si exigence de personnalisation de bas niveau." },
      rules: [
        "1. Si la contrainte principale est 'aucun serveur à administrer et paiement au token' : Amazon Bedrock.",
        "2. Si l'entreprise exige d'héberger le modèle sur une instance EC2 spécifique dans un sous-réseau privé isolé : SageMaker JumpStart."
      ],
      tag: "BEDROCK VS JUMPSTART"
    },
    {
      title: "Amazon Q Business : L'Assistant d'Entreprise Connecté aux Données Internes",
      lead: "Comment permettre à tous les collaborateurs de l'entreprise de rechercher des procédures dans Jira, Salesforce, Slack et SharePoint via un chat IA sécurisé ?",
      heading: "Assistant d'Entreprise Génératif Respectant les Permissions (ACLs)",
      body: "Amazon Q Business est un assistant d'IA générative clé en main pour les entreprises : 1. Il intègre plus de 40 connecteurs prédéfinis vers les applications de l'entreprise (Slack, Jira, Confluence, SharePoint, Salesforce, Amazon S3) ; 2. Il respecte strictement les contrôles d'accès et permissions existantes (ACLs) : un employé ne peut JAMAIS obtenir une réponse issue d'un document auquel il n'a pas accès dans le système source ; 3. Il fournit des réponses synthétisées complètes accompagnées de citations directes.",
      m1: { label: "Connecteurs Négociés", value: "+40 Outils d'Entreprise", desc: "Indexation automatique de Salesforce, Confluence, Google Drive, Jira..." },
      m2: { label: "Respect des ACLs", value: "Contrôle d'Accès Strict", desc: "Les réponses respectent fidèlement les droits d'accès de chaque utilisateur connecté." },
      m3: { label: "Amazon Q Developer", value: "Compagnon de Code pour Devs", desc: "Génération de code, explications et tests unitaires intégrés à l'IDE (VS Code)." },
      rules: [
        "1. Pour un assistant IA d'entreprise prêt à l'emploi qui respecte les permissions documentaires : Amazon Q Business.",
        "2. Pour l'assistance au développement logiciel et la modernisation de code Java dans l'IDE : Amazon Q Developer."
      ],
      tag: "AMAZON Q BUSINESS & DEVELOPER"
    },
    {
      title: "Amazon Bedrock Guardrails : Filtrage de Contenu et Protection contre les Attaques",
      lead: "Comment interdire formellement à un modèle génératif de discuter de politique ou de dévoiler les numéros de carte bancaire des clients ?",
      heading: "Garde-Fous Éthiques et Barrières de Sécurité Configurables",
      body: "Amazon Bedrock Guardrails permet d'appliquer des barrières de sécurité personnalisées sur TOUS les modèles de fondation (y compris les modèles tiers) : 1. Filtres de contenu : bloque la haine, la violence, le contenu sexuel et les insultes avec des seuils ajustables ; 2. Sujets refusés (Denied Topics) : définit des thèmes interdits en langage naturel (ex: 'Ne jamais donner de conseil en investissement boursier') ; 3. Filtres de mots : bloque les jurons et termes concurrents ; 4. Filtres d'informations sensibles (PII) : masque ou bloque les données personnelles (NIR, CB, adresses) ; 5. Protection contre les attaques de prompt (Jailbreak).",
      m1: { label: "Denied Topics", value: "Thématiques Interdites", desc: "Empêche l'assistant de s'écarter du périmètre métier autorisé." },
      m2: { label: "PII Masking / Blocking", value: "Protection Données Clients", desc: "Masque automatiquement les numéros sensibles dans les prompts et réponses." },
      m3: { label: "Prompt Attack Shield", value: "Anti-Jailbreak Natif", desc: "Détecte et neutralise les tentatives de manipulation du système." },
      rules: [
        "1. Pour imposer des politiques de sécurité unifiées à travers plusieurs modèles Bedrock : utiliser Bedrock Guardrails.",
        "2. Guardrails s'applique en entrée (sur l'invite utilisateur) ET en sortie (sur la réponse du modèle)."
      ],
      tag: "BEDROCK GUARDRAILS"
    },
    {
      title: "Évaluation de Modèles dans Amazon Bedrock (Model Evaluation)",
      lead: "Comment comparer objectivement Claude 3.5 Sonnet, Llama 3 et Amazon Titan sur vos données métier avant de choisir le modèle définitif ?",
      heading: "Benchmarking Automatisé et Évaluation Humaine Intégrée",
      body: "Amazon Bedrock propose un outil d'évaluation de modèles (Model Evaluation) permettant de comparer plusieurs modèles de fondation sur des critères rigoureux : 1. Évaluation automatisée : calcule des métriques algorithmiques standard comme l'exactitude (Accuracy), la robustesse, la toxicité et le F1-Score sur un jeu de données de test fourni par le client ; 2. Évaluation avec supervision humaine (Human in the loop) : fait appel à des annotateurs internes de votre entreprise ou à l'équipe AWS pour noter la pertinence, la courtoisie et le respect du style métier.",
      m1: { label: "Évaluation Automatisée", value: "Métriques de Précision & Biais", desc: "Mesure la toxicité, la factualité et la performance sans intervention humaine." },
      m2: { label: "Évaluation Humaine", value: "Workforce Interne / AWS", desc: "Évalue la qualité subjective, l'empathie et la satisfaction client." },
      m3: { label: "Rapport Comparatif", value: "Aide à la Décision d'Achat", desc: "Met en regard le coût, la latence et la qualité pour chaque modèle candidat." },
      rules: [
        "1. Pour choisir scientifiquement le modèle le plus rentable répondant à vos exigences de qualité : utiliser Bedrock Model Evaluation.",
        "2. L'évaluation automatisée permet de tester rapidement des centaines de prompts de régression."
      ],
      tag: "BEDROCK MODEL EVALUATION"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'AMAZON BEDROCK SERVERLESS',
    'BEDROCK KNOWLEDGE BASES RAG',
    'AGENTS FOR BEDROCK REACTION',
    'CHUNKING STRATEGIES & OVERLAP',
    'BEDROCK PRICING ON-DEMAND VS PTU',
    'FINE-TUNING VS CONTINUED PRETRAIN',
    'BEDROCK VS SAGEMAKER JUMPSTART',
    'AMAZON Q BUSINESS & ACLS',
    'BEDROCK GUARDRAILS SÉCURITÉ',
    'MODEL EVALUATION BENCHMARK'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-aifc01-d3-${String(num).padStart(3, '0')}`,
    category: `AIF-C01 • DOMAINE 3 • ${subCategory}`,
    categoryBadgeColor: '#059669',
    levelTag: `AIF-C01 • D3 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 28%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[AIF-C01 D3-#${num}] ${baseTopic.title} (Scénario Architecture Bedrock #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Cœur de l'examen AWS Certified AI Practitioner (Domaine 3 : 28% de la note globale).`,
    solutionHeading: `${baseTopic.heading} - Standard AWS Bedrock & Foundation Models`,
    solutionBody: `${baseTopic.body} Le Domaine 3 est le plus important de l'examen AIF-C01. Il valide l'aptitude à concevoir des architectures d'entreprise avec Amazon Bedrock, les Knowledge Bases (RAG), les Agents autonomes, Amazon Q et SageMaker JumpStart.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé AIF-C01 D3 : Pour un cas d'usage nécessitant la recherche dans des documents internes, préférer Knowledge Bases (RAG) avant d'envisager un Fine-Tuning qui ne permet pas d'actualiser les faits dynamiques.`
    ],
    deckName: "AWS AIF-C01 : Domaine 3 - Déploiement et applications des solutions d'IA",
    domainId: 'domain3',
    domainName: "3. Déploiement et applications des solutions d'IA AWS",
    certCode: 'AIF-C01',
  };
});
