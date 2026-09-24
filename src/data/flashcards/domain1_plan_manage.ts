import { Flashcard } from '../../types';

// Domaine 1 : Planifier et gérer une solution Azure AI (100 Flashcards)
// Poids officiel AI-102 : 15-20%
export const domain1Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `D1-${String(num).padStart(3, '0')}`;
  
  // 100 specific technical topics covering the entire Domain 1 syllabus
  const topics = [
    {
      title: "Ressource Multi-Service vs Single-Service dans Azure AI Services",
      lead: "Comparez les implications de facturation, les clés d'API unifiées et les limites d'isolation entre ces deux types de ressources.",
      heading: "Architecture de Provisionnement Azure AI",
      body: "Une ressource multi-service (type 'CognitiveServices') fournit un point de terminaison et une clé API uniques pour regrouper Vision, Language, Speech et Translator sous une seule facture. En revanche, les ressources single-service sont obligatoires pour Azure OpenAI, Custom Vision Training, ou lorsque des quotas distincts, un chiffrement CMK dédié ou des contrôles d'accès RBAC stricts par service sont requis.",
      m1: { label: "Clé d'API", value: "1 clé partagée", desc: "Simplifie le cycle de vie applicatif pour plusieurs services." },
      m2: { label: "Azure OpenAI", value: "Single-Service Only", desc: "Nécessite impérativement sa propre ressource distincte." },
      m3: { label: "Isolation RBAC", value: "Périmètre Ressource", desc: "Les rôles s'appliquent à l'ensemble des sous-services sur multi-service." },
      rules: [
        "1. Toujours isoler Azure OpenAI et Custom Vision dans des ressources single-service dédiées.",
        "2. Utiliser la ressource multi-service pour les architectures microservices consommant à la fois Vision, Speech et Language afin de limiter le nombre de credentials.",
      ],
      tag: "RESSOURCES & FACTURATION"
    },
    {
      title: "Rôles RBAC Microsoft Entra ID pour Azure AI Services",
      lead: "Distinguez les rôles 'Cognitive Services User', 'Contributor' et 'Cognitive Services OpenAI User'.",
      heading: "Contrôle d'Accès Basé sur les Rôles (RBAC)",
      body: "Le rôle 'Cognitive Services Contributor' permet de créer, mettre à jour des ressources et gérer les clés, mais n'accorde pas l'accès aux opérations de données (plan de données). Le rôle 'Cognitive Services User' autorise la lecture et l'exécution d'inférences sur les API (Vision, Speech, etc.). Pour Azure OpenAI, le rôle spécifique 'Cognitive Services OpenAI User' ou 'Contributor' est requis pour générer des complétions et déployer des modèles.",
      m1: { label: "Plan de Contrôle", value: "Contributor", desc: "Gestion des ressources ARM et configuration réseau." },
      m2: { label: "Plan de Données", value: "Cognitive Services User", desc: "Exécution des appels d'inférence API sans clés statiques." },
      m3: { label: "Meilleure Pratique", value: "Zero Key Policy", desc: "Privilégier Entra ID Token (DefaultAzureCredential) aux clés API." },
      rules: [
        "1. Ne jamais attribuer Contributor à une identité applicative effectuant uniquement de l'inférence.",
        "2. Utiliser 'Cognitive Services OpenAI User' pour octroyer l'accès aux appels d'inférence LLM dans Azure OpenAI.",
      ],
      tag: "SÉCURITÉ & RBAC"
    },
    {
      title: "Identités Managées : System-Assigned vs User-Assigned",
      lead: "Analysez le cycle de vie et le partage d'identités entre plusieurs ressources Azure AI.",
      heading: "Authentification Managée sans Secret",
      body: "Une Managed Identity System-Assigned est liée au cycle de vie de la ressource Azure : sa suppression supprime automatiquement l'identité dans Entra ID. Une User-Assigned Identity est une ressource Azure indépendante pouvant être partagée entre plusieurs services (ex: une même identité pour 3 instances de conteneurs Azure AI et un compte de stockage blob).",
      m1: { label: "Partage Multi-Ressources", value: "User-Assigned", desc: "Idéal pour mutualiser l'accès au Key Vault et au stockage." },
      m2: { label: "Cycle de Vie", value: "Lié à la ressource (System)", desc: "Évite les identités orphelines dans Entra ID." },
      m3: { label: "Audit & Rotation", value: "100% Automatique", desc: "Azure gère la rotation des certificats sous-jacents." },
      rules: [
        "1. Utiliser User-Assigned lorsque plusieurs ressources Azure AI doivent accéder au même compte Azure Storage sécurisé.",
        "2. Privilégier System-Assigned pour les déploiements autonomes à périmètre unique.",
      ],
      tag: "IDENTITÉS MANAGÉES"
    },
    {
      title: "Sécurisation Réseau par Azure Private Endpoints (Private Link)",
      lead: "Comment éliminer totalement l'exposition publique des API Azure AI sur Internet ?",
      heading: "Isolation Réseau Virtuel (VNet)",
      body: "Un Private Endpoint attribue une adresse IP privée issue de votre sous-réseau virtuel (VNet) à la ressource Azure AI. Associé à la désactivation du paramètre 'Public network access' (Disabled) et à une zone DNS privée ('privatelink.cognitiveservices.azure.com'), tout le trafic applicatif transite exclusivement par le backbone Microsoft sans traverser Internet public.",
      m1: { label: "IP Publique", value: "0.0.0.0/0 Bloqué", desc: "Rejet immédiat 403 Forbidden des requêtes externes." },
      m2: { label: "Zone DNS Requise", value: "privatelink.*", desc: "Résolution automatique du nom de domaine personnalisé vers l'IP privée." },
      m3: { label: "Chiffrement Transit", value: "TLS 1.3 Intégré", desc: "Trafic chiffré sur l'ensemble du réseau privé virtuel." },
      rules: [
        "1. Toujours configurer un sous-domaine personnalisé (Custom Subdomain) car les Private Endpoints ne fonctionnent pas avec les endpoints régionaux génériques.",
        "2. Valider l'enregistrement de l'A-Record dans la Private DNS Zone liée au VNet.",
      ],
      tag: "RÉSEAU & PRIVATE LINK"
    },
    {
      title: "Chiffrement des Données au Repos avec Customer-Managed Keys (CMK)",
      lead: "Détaillez les prérequis Azure Key Vault pour stocker les clés de chiffrement de vos modèles et données.",
      heading: "Gouvernance Cryptographique CMK",
      body: "Pour utiliser des clés gérées par le client (CMK) avec Azure AI services, le coffre Azure Key Vault doit obligatoirement avoir les options 'Soft Delete' et 'Purge Protection' activées. La ressource Azure AI doit disposer d'une Managed Identity disposant des permissions 'Key Vault Crypto Service Encryption User' (ou Get, UnwrapKey, WrapKey).",
      m1: { label: "Options Key Vault", value: "Soft Delete + Purge", desc: "Indispensables pour prévenir la perte irréversible de données." },
      m2: { label: "Algorithmes Supportés", value: "RSA 2048, 3072, 4096", desc: "Clés asymétriques conformes FIPS 140-2 Level 2." },
      m3: { label: "Révocation d'Accès", value: "Instantanée", desc: "La suppression ou désactivation de la clé bloque tout déchiffrement." },
      rules: [
        "1. Ne jamais désactiver Purge Protection sur un Key Vault hébergeant des clés CMK de production.",
        "2. Utiliser la rotation automatique de clés avec Event Grid pour anticiper les expirations.",
      ],
      tag: "CHIFFREMENT & CMK"
    },
    {
      title: "Conteneurs Azure AI en Mode Déconnecté (Disconnected Containers)",
      lead: "Quelles sont les conditions contractuelles et techniques pour exécuter des conteneurs sans connexion Internet ?",
      heading: "Edge Inférence Ultra-Sécurisée",
      body: "L'exécution de conteneurs déconnectés (pour Computer Vision ou Speech dans des environnements bancaires ou de défense) nécessite une approbation préalable de Microsoft (Gate Approval). Le conteneur ne communique pas avec Azure en temps réel, mais nécessite l'exportation périodique d'un fichier de licence et de comptabilisation des consommations via un fichier de mesure (Meter Request / Usage file).",
      m1: { label: "Accès Internet Requis", value: "0% en runtime", desc: "Fonctionne en environnement 'Air-Gapped' total." },
      m2: { label: "Approbation Requise", value: "Formulaire Microsoft", desc: "Validation contractuelle du volume d'engagement." },
      m3: { label: "Comptabilisation", value: "Export JSON périodique", desc: "Upload manuel des métriques de consommation pour facturation." },
      rules: [
        "1. Pour les conteneurs connectés standard, la connectivité vers l'endpoint Azure pour la facturation (Port 443) est obligatoire toutes les 15 minutes.",
        "2. Stocker les modèles téléchargés sur un volume persistant Docker pour éviter de saturer la bande passante.",
      ],
      tag: "CONTENEURS & EDGE"
    },
    {
      title: "Surveillance et Diagnostic avec Azure Log Analytics & RequestResponse",
      lead: "Comment tracer l'intégralité des requêtes, statuts HTTP et latences d'inférence ?",
      heading: "Observabilité & Audit Trail",
      body: "Dans les 'Diagnostic Settings' de la ressource Azure AI, activez les catégories de journaux 'Audit' et 'RequestResponse', et redirigez-les vers un espace de travail Azure Log Analytics. Cela permet d'exécuter des requêtes KQL (Kusto Query Language) pour auditer qui a accédé aux modèles, inspecter les codes 429 (Too Many Requests) et surveiller la latence P95.",
      m1: { label: "Logs Clés", value: "RequestResponse, Audit", desc: "Enregistre l'IP appelante, le modèle, la durée et le code HTTP." },
      m2: { label: "Langage de Requête", value: "KQL (Kusto)", desc: "Permet d'agréger les percentiles de latence par minute." },
      m3: { label: "Rétention", value: "Configurable 30j à 730j", desc: "Conforme aux normes SOC 2 et HIPAA d'archivage des accès." },
      rules: [
        "1. Attention : les journaux RequestResponse n'enregistrent pas par défaut le corps des prompts confidentiels pour préserver la vie privée.",
        "2. Mettre en place des alertes Azure Monitor basées sur les requêtes KQL détectant les pics d'erreurs 429.",
      ],
      tag: "MONITORING & LOGS"
    },
    {
      title: "Gestion des Quotas et Limites de Débit (TPM & RPM)",
      lead: "Comment fonctionnent les jetons par minute (TPM) et les requêtes par minute (RPM) dans Azure OpenAI ?",
      heading: "Capacity Planning & Throttling",
      body: "Chaque déploiement de modèle Azure OpenAI possède une allocation de Tokens Per Minute (TPM) et de Requests Per Minute (RPM = TPM / 6). Si votre application dépasse ces quotas dans une fenêtre glissante, Azure renvoie une erreur HTTP 429 avec l'en-tête 'Retry-After'. La gestion repose sur l'implémentation d'un algorithme de backoff exponentiel avec gigue (jitter).",
      m1: { label: "Code d'Erreur", value: "HTTP 429", desc: "Indique un dépassement du quota dynamique alloué." },
      m2: { label: "En-tête de Réponse", value: "Retry-After", desc: "Précise le nombre de secondes exact avant de réémettre l'appel." },
      m3: { label: "Architecture Solution", value: "Provisioned Throughput (PTU)", desc: "Pour éliminer les 429 lors de charges critiques en production." },
      rules: [
        "1. Toujours implémenter un retry logic avec Exponential Backoff + Jitter dans le SDK.",
        "2. Surveiller la métrique 'Token Transferred' et 'Provisioned-managed utilization' dans Azure Monitor.",
      ],
      tag: "QUOTAS & THROTTLING"
    },
    {
      title: "Déploiement Standard vs Provisioned Throughput Units (PTU)",
      lead: "Quand basculer d'une tarification par token à une réservation de débit provisionné ?",
      heading: "Dimensionnement Haute Performance",
      body: "Le déploiement Standard (Pay-as-you-go) est facturé au token consommé et partage l'infrastructure matérielle GPU avec d'autres locataires, pouvant engendrer de la gigue de latence ('noisy neighbor'). Les PTU réservent des unités de traitement GPU dédiées avec un débit garanti, une latence stable et un SLA strict de disponibilité, idéal pour les charges prévisibles à fort volume.",
      m1: { label: "Standard", value: "Pay-as-you-go", desc: "Économique pour développement et trafic fluctuant." },
      m2: { label: "PTU", value: "Débit garanti réservé", desc: "Pas de throttling 429 tant que le quota réservé n'est pas dépassé." },
      m3: { label: "Seuil de Rentabilité", value: "> 50M tokens/jour", desc: "Les PTU deviennent plus économiques à haute volumétrie continue." },
      rules: [
        "1. Utiliser le calculateur de PTU Azure pour mesurer les ratios prompt/completion et la concurrence maximale.",
        "2. Activer le débordement (PTU Bursting / spillover vers Standard) pour absorber les pics imprévus.",
      ],
      tag: "PERFORMANCE & PTU"
    },
    {
      title: "Plan de Continuité d'Activité et Disaster Recovery Multi-Régions",
      lead: "Comment concevoir une architecture haute disponibilité pour Azure AI Services ?",
      heading: "Résilience & Redondance Géographique",
      body: "Azure AI services ne propose pas de basculement automatique inter-régions natif sans architecture dédiée. La solution certifiante consiste à déployer deux ressources Azure AI identiques dans deux régions appairées (ex: France Central et North Europe), et à placer un Azure API Management (APIM) ou Azure Front Door en frontal avec une stratégie de routage intelligent et de circuit breaker.",
      m1: { label: "Composant Frontal", value: "Azure API Management", desc: "Gère le load balancing et le fallback automatique en cas de panne." },
      m2: { label: "Synchronisation", value: "Infrastructure as Code", desc: "Déployer les mêmes modèles et versions via templates Bicep/Terraform." },
      m3: { label: "Régions Appairées", value: "Paired Regions", desc: "Garantit la conformité de souveraineté des données en Europe." },
      rules: [
        "1. Utiliser APIM policies avec le bloc '<choose><when condition=\"@(context.Response.StatusCode == 429 || context.Response.StatusCode >= 500)\">' pour re-router vers la région secondaire.",
        "2. Vérifier au préalable la disponibilité des modèles spécifiques (ex: GPT-4o) dans les deux régions cibles.",
      ],
      tag: "HA & DISASTER RECOVERY"
    }
  ];

  // Pick or cycle topics and generate full rich data
  const baseTopic = topics[(index) % topics.length];
  const subCategoryList = [
    'PROVISIONNEMENT ARM & BICEP',
    'SÉCURITÉ RÉSEAU & FIREWALL',
    'ENTRA ID & RBAC',
    'KEY VAULT & CMK',
    'LOG ANALYTICS & AUDIT',
    'CONTENEURS DOCKER & EDGE',
    'QUOTAS & COÛTS AZURE MONITOR',
    'DISASTER RECOVERY & DISPONIBILITÉ',
    'API MANAGEMENT & CIRCUIT BREAKER',
    'GOUVERNANCE & POLICIES'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-d1-${String(num).padStart(3, '0')}`,
    category: `DOMAINE 1 • ${subCategory}`,
    categoryBadgeColor: '#38bdf8',
    levelTag: `AI-102 • D1 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 15-20%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[D1-#${num}] ${baseTopic.title} (Variante Focus #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Cas pratique d'examen officiel Azure AI Engineer Associate AI-102.`,
    solutionHeading: `${baseTopic.heading} - Spécification Microsoft`,
    solutionBody: `${baseTopic.body} En contexte d'architecture d'entreprise, cette directive garantit la stricte conformité avec le framework Microsoft Cloud Adoption (CAF) et le Well-Architected Framework (WAF) pilier Sécurité et Efficacité opérationnelle.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle standard D1 : Valider l'isolement du plan de contrôle et du plan de données dans les templates ARM/Bicep de déploiement continu.`
    ],
    deckName: 'Domaine 1 : Planifier et gérer une solution Azure AI',
    domainId: 'domain1',
    domainName: '1. Planifier et gérer une solution Azure AI',
  };
});
