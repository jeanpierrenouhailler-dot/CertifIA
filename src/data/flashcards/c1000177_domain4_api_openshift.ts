import { Flashcard } from '../../types';

// IBM watsonx C1000-177 - Domaine 4 : Intégration d'API et Déploiement Cloud Pak (100 Flashcards)
// Poids officiel de l'examen IBM Certified Specialist - watsonx.ai : 15%
export const c1000177Domain4Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `IBMX-D4-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "SDK Python ibm-watsonx-ai : Initialisation et Authentification",
      lead: "Comment instancier correctement le client Python officiel pour interroger un modèle watsonx.ai depuis un script backend d'entreprise ?",
      heading: "Initialisation Sécurisée avec Credentials, API Key et Project ID",
      body: "Le SDK Python officiel `ibm-watsonx-ai` (qui remplace `ibm-watson-machine-learning`) permet d'intégrer facilement les modèles de fondation : 1. Dictionnaire d'authentification : requiert obligatoirement l'URL de service (ex: `https://us-south.ml.cloud.ibm.com`) et la clé d'API IAM (`apikey`) ; 2. Contexte d'exécution : vous devez impérativement spécifier soit un `project_id` (pour les appels de développement), soit un `space_id` (pour les appels en environnement de déploiement de production) ; 3. Bonnes pratiques : ne jamais inscrire la clé d'API en clair dans le code, mais la charger depuis une variable d'environnement sécurisée (`os.getenv('WATSONX_APIKEY')`).",
      m1: { label: "SDK ibm-watsonx-ai", value: "Bibliothèque Python Officielle", desc: "Fournit les classes de haut niveau pour l'inférence et le tuning." },
      m2: { label: "Credentials IAM", value: "URL & Clé d'API IAM", desc: "Authentifie l'application auprès des serveurs d'authentification IBM Cloud." },
      m3: { label: "Project ID vs Space ID", value: "Contexte Requis", desc: "Définit le périmètre de facturation et de traçabilité des appels de modèle." },
      rules: [
        "1. Pour interroger watsonx.ai en Python, utiliser la bibliothèque `ibm-watsonx-ai`.",
        "2. Tout appel d'inférence exige soit un `project_id` valide, soit un `space_id` de déploiement."
      ],
      tag: "SDK PYTHON INITIALISATION"
    },
    {
      title: "Classe ModelInference et Méthodes generate_text() vs generate_text_stream()",
      lead: "Quelle méthode du SDK Python utiliser pour afficher les mots d'un chatbot au fur et à mesure de leur génération comme sur ChatGPT ?",
      heading: "Inférence Synchrone Complète vs Streaming de Tokens en Temps Réel",
      body: "La classe `ModelInference` du SDK propose deux modes de consommation des modèles : 1. `generate_text()` : méthode synchrone qui attend que l'intégralité de la réponse soit générée par le serveur avant de retourner le texte complet ; pratique pour les batchs ou le traitement asynchrone ; 2. `generate_text_stream()` : générateur Python itératif qui renvoie chaque token (ou groupe de tokens) dès qu'il est calculé par le GPU distant ; indispensable pour les interfaces utilisateurs interactives (réduisant le temps ressenti du premier token à quelques centaines de millisecondes).",
      m1: { label: "generate_text()", value: "Réponse Complète d'un Coup", desc: "Retourne le texte final une fois que la séquence d'arrêt ou le max_tokens est atteint." },
      m2: { label: "generate_text_stream()", value: "Streaming Continu de Tokens", desc: "Itérateur Python (yield) diffusant la réponse en temps réel vers le frontend." },
      m3: { label: "Latence Perçue", value: "Premier Token < 300 ms", desc: "Améliore considérablement l'expérience utilisateur des assistants conversationnels." },
      rules: [
        "1. Pour une expérience utilisateur interactive type chatbot : utiliser `generate_text_stream()`.",
        "2. Les paramètres d'inférence (GenParams) s'appliquent de manière identique aux deux méthodes."
      ],
      tag: "MODELINFERENCE STREAMING"
    },
    {
      title: "API REST watsonx.ai : Endpoints de Génération et Headers d'Authentification",
      lead: "Comment appeler directement l'API REST watsonx.ai depuis un service écrit en Java, Go ou C# sans passer par le SDK Python ?",
      heading: "Consommation HTTP REST avec Token Bearer IAM et Versioning d'API",
      body: "L'API REST de watsonx.ai est universelle et suit les standards de l'industrie : 1. Échange de jeton : appel à `https://iam.cloud.ibm.com/identity/token` avec la clé d'API pour obtenir un `Bearer <access_token>` valide 1 heure ; 2. Endpoint unitaire : `POST /ml/v1/text/generation?version=2023-05-29` ; 3. Endpoint streaming : `POST /ml/v1/text/generation_stream?version=2023-05-29` (utilise Server-Sent Events SSE avec `Content-Type: text/event-stream`) ; 4. Payload JSON obligatoire contenant `model_id`, `input`, `parameters` et `project_id`.",
      m1: { label: "Bearer Token IAM", value: "En-tête Authorization", desc: "Jeton d'accès JWT généré à partir de la clé d'API IAM IBM Cloud." },
      m2: { label: "Paramètre version", value: "Date de Version d'API", desc: "Obligatoire dans l'URL pour garantir la rétrocompatibilité (ex: `version=2023-05-29`)." },
      m3: { label: "SSE Streaming", value: "text/event-stream", desc: "Format de flux Server-Sent Events pour la réception continue des tokens." },
      rules: [
        "1. Tout appel REST à l'API watsonx.ai doit obligatoirement inclure le paramètre de requête `?version=YYYY-MM-DD`.",
        "2. Renouveler le Bearer token IAM toutes les 50 minutes avant son expiration automatique de 60 minutes."
      ],
      tag: "API REST ENDPOINTS"
    },
    {
      title: "Projets vs Espaces de Déploiement (Deployment Spaces) dans watsonx.ai",
      lead: "Pourquoi est-il formellement interdit d'exposer l'endpoint d'un modèle directement depuis son projet de développement dans une architecture de production ?",
      heading: "Cloisonnement des Environnements de Recherche (Projects) et d'Opérations (Spaces)",
      body: "watsonx.ai impose une stricte séparation des responsabilités : 1. Projets (Projects) : bacs à sable collaboratifs (Sandbox) destinés à l'exploration, l'expérimentation de prompts, le prototypage de notebooks et le test de modèles ; réservés aux data scientists ; 2. Espaces de Déploiement (Deployment Spaces) : environnements isolés et sécurisés dédiés aux opérations et à la mise en production ; dotés de ressources matérielles garanties, d'une haute disponibilité, d'une gestion stricte des droits d'accès et d'audits de conformité ; 3. Processus de promotion : les artefacts validés (prompts, modèles tunés) sont exportés du projet vers l'espace de déploiement via un clic ou un pipeline CI/CD.",
      m1: { label: "Projets (Projects)", value: "Environnement d'Expérimentation", desc: "Idéal pour le développement itératif sans impact sur les utilisateurs finaux." },
      m2: { label: "Espaces (Spaces)", value: "Environnement de Production", desc: "Fournit les endpoints HTTP de serving stables avec monitoring et SLAs stricts." },
      m3: { label: "Promotion d'Artefacts", value: "Transfert Formalisé Dev -> Prod", desc: "Garantit que seul du code et des modèles audités sont mis à disposition des clients." },
      rules: [
        "1. Les applications de production doivent TOUJOURS appeler des modèles déployés dans un Deployment Space (jamais dans un Project).",
        "2. Les autorisations d'accès peuvent être restreintes dans l'Espace de Déploiement sans affecter le projet de développement d'origine."
      ],
      tag: "PROJECTS VS DEPLOYMENT SPACES"
    },
    {
      title: "Déploiements en Ligne (Online Deployments) vs Déploiements par Lots (Batch Deployments)",
      lead: "Quel mode de déploiement choisir pour classifier chaque nuit 5 millions de tickets de support client sans saturer un endpoint temps réel ?",
      heading: "Arbitrage Architectural : Inférence Synchrone Dédiée vs Jobs Asynchrones Massifs",
      body: "Dans un Deployment Space watsonx.ai, vous pouvez configurer deux types de déploiement : 1. Déploiement en Ligne (Online Deployment) : crée un point de terminaison REST persistant qui répond immédiatement aux requêtes synchrones unitaire avec une latence minimale ; idéal pour les applications web, les chatbots et les transactions en temps réel ; 2. Déploiement par Lots (Batch Deployment) : lit un ensemble massif de données stocké sur Cloud Object Storage, exécute les inférences en parallèle sur un pool de calcul dédié, et écrit les résultats dans un fichier de sortie ; idéal pour les traitements nocturnes récurrents.",
      m1: { label: "Online Deployment", value: "Endpoint REST Synchrone", desc: "Disponibilité permanente pour des réponses interactives sous les 500 ms." },
      m2: { label: "Batch Deployment", value: "Jobs Asynchrones Haute Capacité", desc: "Traitement de millions de lignes sans risque de timeout HTTP." },
      m3: { label: "Source de Données Batch", value: "Fichiers COS / S3 / DB", desc: "Lecture et écriture automatiques dans les référentiels de stockage de l'entreprise." },
      rules: [
        "1. Pour traiter de volumineux jeux de données sans bloquer l'infrastructure : créer un Batch Deployment.",
        "2. Pour un endpoint d'inférence instantanée appelé par une application mobile : créer un Online Deployment."
      ],
      tag: "ONLINE VS BATCH DEPLOYMENT"
    },
    {
      title: "Déploiement sur Red Hat OpenShift Container Platform (RHOCP) et Cloud Pak for Data",
      lead: "Comment une grande banque peut-elle déployer watsonx.ai dans son propre centre de données sécurisé sans aucune connexion vers le cloud public ?",
      heading: "Architecture Conteneurisée Hybride sur Red Hat OpenShift (Sur Site / Multi-Cloud)",
      body: "watsonx est nativement conçu sur Red Hat OpenShift Container Platform (RHOCP) via IBM Cloud Pak for Data (CP4D) : 1. Déploiement universel 'Anywhere' : peut s'exécuter sur IBM Cloud, AWS (ROSA), Azure (ARO), Google Cloud (OpenShift sur GCP) ou sur serveurs physiques sur site (Bare Metal / VMware) ; 2. Environnements déconnectés (Air-Gapped / Dark Sites) : fonctionne à 100% sans accès à Internet pour les gouvernements, le secteur de la défense et les banques centrales ; 3. Isolation totale des données : aucun token de prompt ni document d'entreprise ne quitte le réseau privé du client.",
      m1: { label: "Red Hat OpenShift", value: "Socle Kubernetes d'Entreprise", desc: "Orchestration robuste, sécurisée et certifiée pour les charges d'IA critiques." },
      m2: { label: "Mode Air-Gapped", value: "Zéro Accès Internet Public", desc: "Installation en circuit fermé absolu pour conformité de défense et bancaire." },
      m3: { label: "Cloud Pak for Data", value: "Plateforme Intégrée Data & AI", desc: "Mutualise le stockage, les catalogues de données et les moteurs d'inférence." },
      rules: [
        "1. Pour garantir une souveraineté totale des données : déployer watsonx.ai sur un cluster Red Hat OpenShift sur site.",
        "2. watsonx.ai offre exactement la même expérience logicielle et les mêmes APIs en mode SaaS Cloud qu'en mode OpenShift on-premises."
      ],
      tag: "RED HAT OPENSHIFT & AIR-GAPPED"
    },
    {
      title: "Gestion des Accélérateurs GPU avec NVIDIA GPU Operator sur OpenShift",
      lead: "Comment OpenShift orchestre-t-il automatiquement les pilotes et l'allocation des cartes NVIDIA A100 pour les pods d'inférence watsonx.ai ?",
      heading: "Automatisation de la Couche Matérielle avec les Opérateurs Kubernetes",
      body: "Pour exploiter la puissance des GPU sans gestion manuelle complexe : 1. NVIDIA GPU Operator : opérateur Kubernetes standardisé qui installe et met à jour automatiquement les pilotes de périphériques CUDA, le NVIDIA Container Toolkit et les outils de surveillance télémétrique sur les nœuds workers d'OpenShift ; 2. Découpage GPU (MIG - Multi-Instance GPU) : permet de partitionner une carte NVIDIA A100 physique en jusqu'à 7 instances virtuelles isolées pour mutualiser les coûts d'inférence entre plusieurs modèles légers ; 3. Tolérance aux pannes : redémarre instantanément les pods de modèles sur un nœud sain en cas de défaillance matérielle.",
      m1: { label: "NVIDIA GPU Operator", value: "Automatisation Drivers CUDA", desc: "Élimine l'installation manuelle des dépendances graphiques sur les serveurs hôtes." },
      m2: { label: "Technologie MIG", value: "Jusqu'à 7 Tranches par GPU A100", desc: "Permet à plusieurs équipes de partager une seule carte physique en toute étanchéité." },
      m3: { label: "Orchestration Pods", value: "Affinité Matérielle Déclarative", desc: "OpenShift achemine automatiquement les conteneurs LLM vers les nœuds équipés de GPU." },
      rules: [
        "1. L'utilisation du NVIDIA GPU Operator est le prérequis standard pour tout déploiement watsonx.ai avec GPU sur Red Hat OpenShift.",
        "2. MIG (Multi-Instance GPU) optimise le coût d'inférence en évitant d'assigner un GPU A100 complet à un petit modèle de 7 milliards de paramètres."
      ],
      tag: "NVIDIA GPU OPERATOR OPENSHIFT"
    },
    {
      title: "Haute Disponibilité (HA), Autoscaling et Reprise après Sinistre (Disaster Recovery)",
      lead: "Comment dimensionner l'infrastructure watsonx.ai pour absorber un pic inattendu de 10 000 requêtes par minute sans temps d'arrêt ?",
      heading: "Scalabilité Horizontale (HPA) et Résilience Multi-Zones sur OpenShift",
      body: "La résilience de production d'un cluster watsonx repose sur des mécanismes d'automatisation avancés : 1. Horizontal Pod Autoscaler (HPA) : surveille en continu l'utilisation CPU/GPU et le débit de requêtes HTTP pour instancier automatiquement de nouveaux pods de modèles en cas de surcharge ; 2. Déploiement Multi-Zones : répartit les répliques sur plusieurs centres de données indépendants au sein de la même région ; si une zone subit une panne électrique, le trafic est instantanément basculé vers les zones survivantes sans interruption ; 3. Sauvegarde et Restauration avec OADP (OpenShift APIs for Data Protection) pour garantir un RPO et un RTO minimaux.",
      m1: { label: "Horizontal Pod Autoscaler", value: "Scale-Out Automatique", desc: "Augmente dynamiquement le nombre de répliques sous forte charge de requêtes." },
      m2: { label: "Multi-Zone Resilience", value: "Haute Disponibilité (HA)", desc: "Élimine tout point unique de défaillance (Single Point of Failure - SPOF)." },
      m3: { label: "Sauvegarde OADP", value: "Plan de Reprise d'Activité (DR)", desc: "Sauvegarde les états des métadonnées, catalogues et configurations de modèles." },
      rules: [
        "1. Pour garantir une haute disponibilité sans coupure de service : déployer au moins 2 répliques de pod réparties sur des zones différentes.",
        "2. Configurer des sondes de vivacité (Liveness) et d'aptitude (Readiness Probes) pour que le routeur OpenShift isole immédiatement un pod défaillant."
      ],
      tag: "HA AUTOSCALING & RÉSILIENCE"
    },
    {
      title: "Gestion des Quotas, Facturation et Suivi des Coûts d'Inférence watsonx.ai",
      lead: "Comment une entreprise peut-elle refacturer précisément la consommation de tokens watsonx.ai à ses différentes filiales internes ?",
      heading: "Métriques de Consommation, Unités de Facturation (Capacity Units) et Quotas",
      body: "Pour maîtriser et imputer les budgets d'IA à l'échelle de l'entreprise : 1. Modèle de facturation SaaS : basé sur la consommation réelle de tokens d'entrée (input tokens) et de sortie (output tokens) ou sur des unités de capacité d'inférence (Resource Units / Capacity Units) ; 2. Imputation par Projet (Chargeback / Showback) : chaque projet possède un identifiant de facturation dédié, permettant de générer des rapports de coûts détaillés par centre de coût ou département ; 3. Quotas de limitation de débit (Rate Limiting) : configuration de plafonds stricts pour empêcher un script buggé de générer une facture imprévue.",
      m1: { label: "Facturation au Token", value: "Input & Output Mesurés", desc: "Comptabilisation précise du volume de texte traité par chaque appel d'API." },
      m2: { label: "Chargeback Interne", value: "Refacturation par Projet", desc: "Permet au service informatique d'imputer les coûts aux différentes branches métiers." },
      m3: { label: "Rate Limiting", value: "Plafonds Budgétaires Verrouillés", desc: "Empêche les dépassements de coûts grâce à des seuils de blocage configurables." },
      rules: [
        "1. Assigner un projet distinct à chaque département pour isoler les quotas et faciliter la refacturation interne.",
        "2. Surveiller le tableau de bord des métriques d'utilisation dans la console d'administration IBM Cloud ou Cloud Pak for Data."
      ],
      tag: "FACTURATION QUOTAS CHARGEBACK"
    },
    {
      title: "Pipeline CI/CD MLOps avec Watson Machine Learning et GitOps sur OpenShift",
      lead: "Comment automatiser complètement la promotion d'un nouveau prompt template de l'environnement de Test vers la Production lors d'un merge Git ?",
      heading: "Intégration et Déploiement Continus (CI/CD) d'Artefacts d'IA avec Red Hat OpenShift Pipelines (Tekton)",
      body: "L'industrialisation MLOps moderne s'appuie sur les principes GitOps : 1. Contrôle de version Git : les templates de prompts, configurations d'hyperparamètres et scripts de scoring sont versionnés dans un dépôt Git d'entreprise ; 2. OpenShift Pipelines (basé sur Tekton) : dès qu'une Pull Request est approuvée, le pipeline CI/CD valide le schéma du prompt, exécute des tests automatisés de non-régression de métriques (ROUGE, Groundedness) et pousse l'artefact vers le Deployment Space de staging ; 3. Déploiement Canary : le nouveau modèle est testé sur 10% du trafic avant bascule totale.",
      m1: { label: "GitOps pour l'IA", value: "Git comme Source de Vérité", desc: "Historise chaque modification de prompt ou de configuration de modèle." },
      m2: { label: "Tekton Pipelines", value: "Orchestration CI/CD Native", desc: "Automatise les tests unitaires, l'évaluation et la promotion des artefacts." },
      m3: { label: "Déploiement Canary", value: "Bascule Progressive Sans Coupure", desc: "Valide la stabilité sous trafic réel avant de router 100% des utilisateurs." },
      rules: [
        "1. Dans une gouvernance d'entreprise mature, aucun déploiement en production n'est effectué manuellement : tout passe par un pipeline CI/CD automatisé.",
        "2. Les tests automatisés doivent inclure la vérification des critères de toxicité et de dérive avant toute promotion."
      ],
      tag: "CI/CD GITOPS OPENSHIFT MLOPS"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'SDK PYTHON INITIALISATION CREDENTIALS',
    'MODELINFERENCE STREAMING VS SYNCHRONE',
    'API REST ENDPOINTS BEARER TOKEN',
    'PROJECTS VS DEPLOYMENT SPACES ISOLATION',
    'ONLINE VS BATCH DEPLOYMENTS SERVING',
    'RED HAT OPENSHIFT AIR-GAPPED SOUVERAINETÉ',
    'NVIDIA GPU OPERATOR MULTI-INSTANCE MIG',
    'HA AUTOSCALING MULTI-ZONES OPENSHIFT',
    'FACTURATION QUOTAS CHARGEBACK TOKENS',
    'CI/CD GITOPS OPENSHIFT PIPELINES MLOPS'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-c1000177-d4-${String(num).padStart(3, '0')}`,
    category: `C1000-177 • DOMAINE 4 • ${subCategory}`,
    categoryBadgeColor: '#002d9c',
    levelTag: `C1000-177 • D4 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 15%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[C1000-177 D4-#${num}] ${baseTopic.title} (Question API & Déploiement #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Objectif clé du Domaine 4 (Intégration d'API et Déploiement Cloud Pak) pour la certification IBM watsonx.ai Specialist.`,
    solutionHeading: `${baseTopic.heading} - Standard IBM Déploiement & Intégration`,
    solutionBody: `${baseTopic.body} Le Domaine 4 (15% de l'examen C1000-177) évalue la mise en œuvre technique : SDK Python ibm-watsonx-ai (generate_text_stream), endpoints REST, séparation Projects vs Deployment Spaces, déploiements en ligne et par lots, et hébergement sur Red Hat OpenShift (air-gapped, GPU operator, HA).`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé C1000-177 D4 : Pour servir des applications de production, toujours utiliser un Espace de Déploiement (Deployment Space) et le streaming de tokens pour garantir une expérience utilisateur fluide et une isolation totale.`
    ],
    deckName: "IBM watsonx C1000-177 : Domaine 4 - Intégration API & Déploiement Cloud Pak",
    domainId: 'domain4',
    domainName: "4. Intégration d'API et Déploiement Cloud Pak",
    certCode: 'C1000-177',
  };
});
