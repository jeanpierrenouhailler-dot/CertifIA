import { Flashcard } from '../../types';

// AWS AIF-C01 - Domaine 5 : Sécurité, conformité et gouvernance des systèmes d'IA (100 Flashcards)
// Poids officiel de l'examen AWS Certified AI Practitioner : 14%
export const aifc01Domain5Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `AIF-D5-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Engagement de Confidentialité Amazon Bedrock et Propriété des Données",
      lead: "Comment répondre à un directeur juridique craignant que les prompts confidentiels de l'entreprise ne soient utilisés pour entraîner les futurs modèles publics d'Anthropic ou de Meta ?",
      heading: "Règle d'Or de la Confidentialité des Données d'Entreprise sur Bedrock",
      body: "AWS applique une politique de confidentialité contractuelle stricte dans Amazon Bedrock : 1. Vos données d'entrée (prompts, fichiers joints) et données de sortie (réponses du modèle) ne sont JAMAIS utilisées pour entraîner les modèles de base d'AWS (Titan) ou de tiers (Anthropic Claude, Meta Llama, Mistral) ; 2. Vos données ne sont JAMAIS partagées avec d'autres clients ou stockées par les fournisseurs tiers ; 3. Toutes vos données restent dans la région AWS que vous sélectionnez ; 4. Vos modèles personnalisés (fine-tunés) sont des copies privées chiffrées strictement isolées dans votre compte.",
      m1: { label: "Zéro Ré-entraînement", value: "Prompts Jamais Réutilisés", desc: "Les créateurs de modèles ne peuvent pas utiliser vos requêtes pour leurs futurs modèles." },
      m2: { label: "Résidence des Données", value: "Région AWS Maîtrisée", desc: "Les données ne quittent pas la région géographique choisie (ex: eu-west-3 Paris)." },
      m3: { label: "Modèles Personnalisés", value: "Strictement Privés", desc: "Accessibles uniquement par les rôles IAM de votre propre compte AWS." },
      rules: [
        "1. Règle absolue examen AIF-C01 : Les données des clients ne servent JAMAIS à entraîner les modèles publics dans Amazon Bedrock.",
        "2. Les fournisseurs de modèles (Anthropic, Meta...) n'ont aucun accès aux requêtes transitant par Bedrock."
      ],
      tag: "CONFIDENTIALITÉ BEDROCK"
    },
    {
      title: "Contrôle d'Accès IAM aux Modèles : Moindre Privilège et Limitation de Coûts",
      lead: "Comment autoriser les développeurs à tester le modèle économique Claude 3.5 Haiku tout en interdisant le modèle onéreux Claude 3 Opus ?",
      heading: "Politiques IAM Granulaires sur les ARNs de Modèles",
      body: "Dans AWS IAM, l'action `bedrock:InvokeModel` peut être restreinte au niveau de la ressource (ARN du modèle de fondation). Pour contrôler les dépenses : on rédige une stratégie IAM accordant l'autorisation `bedrock:InvokeModel` uniquement sur l'ARN de `anthropic.claude-3-haiku`, et refusant explicitement l'ARN de `anthropic.claude-3-opus`. Des balises (Tags) et des Service Control Policies (SCP) au niveau d'AWS Organizations peuvent verrouiller ces permissions pour tous les comptes de l'entreprise.",
      m1: { label: "Action IAM", value: "bedrock:InvokeModel", desc: "Permission requise pour envoyer un prompt et recevoir une inférence." },
      m2: { label: "Ciblage Ressource", value: "ARN Spécifique du Modèle", desc: "Permet de bloquer sélectivement les modèles les plus coûteux." },
      m3: { label: "Rôles de Service", value: "Bedrock Knowledge Bases", desc: "Permet à Bedrock de lire dans S3 et d'interroger la base vectorielle sans exposer de clés." },
      rules: [
        "1. Toujours appliquer le principe du moindre privilège en limitant les modèles invocables par ARN dans la politique IAM.",
        "2. Ne jamais utiliser de clés d'accès statiques (Access Keys) ; utiliser exclusivement des rôles IAM temporaires."
      ],
      tag: "IAM & MOINDRE PRIVILÈGE"
    },
    {
      title: "Chiffrement des Données avec AWS KMS (Customer Managed Keys)",
      lead: "Comment satisfaire une exigence bancaire imposant que l'entreprise contrôle et puisse révoquer elle-même les clés de chiffrement des modèles personnalisés ?",
      heading: "Chiffrement au Repos avec Clés Gérées par le Client (CMK)",
      body: "Amazon Bedrock et SageMaker intègrent nativement AWS Key Management Service (AWS KMS) : 1. Chiffrement par défaut : AWS chiffre les données avec des clés gérées par AWS ; 2. Clés gérées par le client (Customer Managed Keys - CMK) : l'entreprise crée, fait tourner et contrôle ses propres clés cryptographiques KMS. Une CMK peut être spécifiée pour chiffrer les données sources S3 de Knowledge Bases, les vecteurs dans OpenSearch Serverless, et les poids des modèles personnalisés (fine-tunés). En cas d'incident, révoquer la clé KMS rend les données immédiatement illisibles.",
      m1: { label: "KMS CMK", value: "Contrôle Total du Client", desc: "Permet la rotation automatique annuelle et la révocation immédiate de la clé." },
      m2: { label: "Chiffrement en Transit", value: "TLS 1.3 Obligatoire", desc: "Toutes les requêtes vers les APIs Bedrock sont chiffrées sur le réseau." },
      m3: { label: "Séparation des Clés", value: "Par Environnement", desc: "Clés KMS distinctes entre développement, préproduction et production." },
      rules: [
        "1. Dès qu'une question exige 'que le client contrôle la rotation et la révocation des clés de chiffrement' : choisir AWS KMS CMK.",
        "2. La politique de clé KMS (Key Policy) doit autoriser le principal de service 'bedrock.amazonaws.com'."
      ],
      tag: "CHIFFREMENT AWS KMS"
    },
    {
      title: "Sécurité Réseau et Isolation avec AWS PrivateLink (Points de Terminaison VPC)",
      lead: "Comment permettre à une application hébergée dans un sous-réseau privé d'appeler l'API Bedrock sans aucun accès à l'Internet public ?",
      heading: "Isolation Réseau Complète via Interface VPC Endpoints",
      body: "Par défaut, les points de terminaison d'API Bedrock sont publics. Pour isoler le trafic : 1. Créer un VPC Interface Endpoint (alimenté par AWS PrivateLink) pour le service `bedrock-runtime` dans vos sous-réseaux privés ; 2. L'appel d'API transite exclusivement sur le réseau dorsal privé sécurisé d'AWS, sans traverser l'Internet et sans nécessiter de passerelle Internet (IGW) ni de passerelle NAT ; 3. Les politiques de point de terminaison (Endpoint Policies) permettent de restreindre les appels autorisés au sein de ce VPC.",
      m1: { label: "AWS PrivateLink", value: "Interface VPC Endpoint", desc: "Génère des adresses IP privées dans votre VPC pour communiquer avec Bedrock." },
      m2: { label: "Zéro Internet", value: "Pas d'IGW ni de NAT", desc: "Élimine tout risque d'interception ou d'attaque venant du web public." },
      m3: { label: "Endpoint Policy", value: "Filtrage d'Accès Réseau", desc: "Interdit par exemple l'accès à des comptes AWS externes non autorisés." },
      rules: [
        "1. Pour sécuriser les flux de données entre un VPC d'entreprise et Bedrock sans passer par Internet : AWS PrivateLink.",
        "2. Les Security Groups appliqués au VPC Endpoint contrôlent les adresses IP sources autorisées."
      ],
      tag: "SÉCURITÉ RÉSEAU PRIVATELINK"
    },
    {
      title: "Audit et Traçabilité avec AWS CloudTrail et Amazon CloudWatch",
      lead: "Quel service AWS fournit la preuve légale irréfutable de qui a invoqué un modèle de fondation à telle heure précise avec son adresse IP ?",
      heading: "Journalisation des Appels d'API et Surveillance des Métriques",
      body: "La gouvernance opérationnelle repose sur le tandem CloudTrail et CloudWatch : 1. AWS CloudTrail enregistre l'historique complet de toutes les requêtes d'API Bedrock (événement `InvokeModel`, identité IAM de l'appelant, horodatage, adresse IP source, code réponse) pour les audits de sécurité et d'investigation médico-légale ; 2. Amazon CloudWatch collecte les métriques de performance en temps réel (nombre d'invocations, latence, erreurs HTTP 4xx/5xx) et déclenche des alarmes automatiques en cas d'anomalie ou de dépassement de budget.",
      m1: { label: "AWS CloudTrail", value: "Audit 'Qui a Fait Quoi ?'", desc: "Enregistre chaque appel d'API pour la conformité et les investigations." },
      m2: { label: "Amazon CloudWatch", value: "Métriques & Alarmes", desc: "Supervise la latence, le nombre de requêtes et le taux d'erreurs en direct." },
      m3: { label: "Conservation S3", value: "Archivage Immuable", desc: "Les journaux CloudTrail peuvent être verrouillés dans S3 avec Object Lock." },
      rules: [
        "1. Pour auditer la gouvernance et tracer les accès aux modèles Bedrock : AWS CloudTrail.",
        "2. Pour être alerté par SMS/email en cas de pic inhabituel d'erreurs ou d'invocations : CloudWatch Alarms + Amazon SNS."
      ],
      tag: "AUDIT CLOUDTRAIL & CLOUDWATCH"
    },
    {
      title: "Journalisation des Invocations de Modèles (Model Invocation Logging)",
      lead: "Comment archiver l'intégralité du texte des invites et des réponses générées dans un bucket S3 pour des exigences de conformité légale ?",
      heading: "Archivage Intégral des Prompts et Réponses Génératives",
      body: "Dans Amazon Bedrock, la fonctionnalité optionnelle 'Model Invocation Logging' permet de collecter et d'archiver les charges utiles complètes d'inférence (prompts textuels d'entrée, images soumises, et réponses générées par le modèle) : 1. Destination au choix : un compartiment Amazon S3 (recommandé pour l'archivage volumineux à long terme) ou un groupe de journaux Amazon CloudWatch Logs (pour l'analyse en temps réel) ; 2. Chiffrement obligatoire avec AWS KMS ; 3. Cette journalisation est DÉSACTIVÉE par défaut pour respecter la vie privée.",
      m1: { label: "Contenu Archivé", value: "Prompts Entrée + Sorties Texte", desc: "Conserve l'historique textuel exact de chaque conversation générative." },
      m2: { label: "Destinations", value: "Amazon S3 & CloudWatch Logs", desc: "Permet l'audit a posteriori par les équipes de conformité et de contrôle interne." },
      m3: { label: "Désactivé par Défaut", value: "Opt-in Explicite Requis", desc: "Nécessite une activation volontaire et un compartiment S3 configuré." },
      rules: [
        "1. Pour sauvegarder l'intégralité des prompts et réponses Bedrock à des fins réglementaires : activer Model Invocation Logging.",
        "2. Toujours chiffrer le bucket S3 de destination avec une clé AWS KMS dédiée pour protéger les secrets d'entreprise."
      ],
      tag: "MODEL INVOCATION LOGGING"
    },
    {
      title: "Téléchargement des Rapports de Conformité Réglementaire avec AWS Artifact",
      lead: "Où un responsable de la conformité peut-il télécharger les rapports d'audit SOC 2 et signer l'accord BAA pour héberger des données de santé HIPAA ?",
      heading: "Portail Centralisé de Conformité et Accords Réglementaires",
      body: "AWS Artifact est le portail officiel en libre-service fournissant un accès à la demande aux documents de conformité et de sécurité d'AWS : 1. AWS Artifact Reports : permet de télécharger les rapports d'auditeurs tiers attestant de la conformité des services AWS aux normes mondiales (SOC 1/2/3, ISO 27001, PCI-DSS, FedRAMP) ; 2. AWS Artifact Agreements : permet de consulter, accepter et gérer des accords juridiques avec AWS, notamment le Business Associate Addendum (BAA) obligatoire pour traiter des données de santé protégées (HIPAA).",
      m1: { label: "Rapports d'Audit", value: "SOC 1/2, ISO 27001, PCI-DSS", desc: "Preuves d'audit tierces indépendantes validant la sécurité de l'infrastructure AWS." },
      m2: { label: "Accord HIPAA BAA", value: "Signature Numérique Directe", desc: "Obligation légale aux USA pour traiter des dossiers médicaux électroniques." },
      m3: { label: "Libre-Service", value: "Accès Console Gratuit", desc: "Téléchargement immédiat sans contacter le support commercial." },
      rules: [
        "1. Dès qu'une question évoque le 'téléchargement de rapports de conformité SOC/ISO ou la signature d'un accord BAA' : choisir AWS Artifact.",
        "2. AWS Artifact est disponible pour tous les comptes AWS sans frais supplémentaires."
      ],
      tag: "AWS ARTIFACT & CONFORMITÉ"
    },
    {
      title: "Modèle de Responsabilité Partagée pour les Services d'IA et Modèles de Fondation",
      lead: "Dans une solution basée sur Amazon Bedrock, qui d'AWS ou du client est responsable de la protection contre les injections de prompt ?",
      heading: "Démarcation des Responsabilités selon la Nature du Service (PaaS vs IaaS)",
      body: "Le Modèle de Responsabilité Partagée (Shared Responsibility Model) définit les rôles : 1. Responsabilité d'AWS (Sécurité DU Cloud) : sécurité physique des datacenters, maintenance des serveurs matériels et GPU, sécurité des hyperviseurs, intégrité et disponibilité de l'API Bedrock ; 2. Responsabilité du Client (Sécurité DANS le Cloud) : gestion des identités et politiques IAM, chiffrement des données (KMS), configuration réseau (VPC PrivateLink), protection contre les attaques applicatives (Prompt Injection via Guardrails) et contrôle du contenu des données soumises.",
      m1: { label: "Responsabilité AWS", value: "Sécurité DU Cloud", desc: "Matériel, réseau physique, isolation des locataires, disponibilité de l'API." },
      m2: { label: "Responsabilité Client", value: "Sécurité DANS le Cloud", desc: "Configuration IAM, clés KMS, Bedrock Guardrails, qualité des données." },
      m3: { label: "SageMaker vs Bedrock", value: "IaaS vs Serverless", desc: "Sur SageMaker EC2, le client gère aussi les patchs OS des conteneurs ; sur Bedrock, non." },
      rules: [
        "1. Le client est TOUJOURS responsable de la gestion des identités IAM, de la classification des données et de l'activation des Guardrails.",
        "2. AWS garantit que l'infrastructure sous-jacente est isolée et exempte de vulnérabilités matérielles."
      ],
      tag: "RESPONSABILITÉ PARTAGÉE IA"
    },
    {
      title: "Gestion des Quotas et Protection contre le Déni de Service (Throttling HTTP 429)",
      lead: "Comment éviter que votre application client ne plante brutalement lors d'un pic d'appels atteignant les quotas par minute de Bedrock ?",
      heading: "Limites de Débit (Rate Limits) et Mécanismes de Résilience Applicative",
      body: "Pour préserver la disponibilité de la plateforme, Bedrock applique des quotas par région (nombre de requêtes par minute RPM et tokens par minute TPM) : 1. En cas de dépassement, l'API renvoie une erreur HTTP 429 (ThrottlingException) ; 2. Stratégie côté client : implémenter un mécanisme de réessais automatiques avec temporisation exponentielle et gigue (Exponential Backoff with Jitter) via les SDKs AWS officiels ; 3. Solution de capacité garantie : souscrire au Débit Provisionné (Provisioned Throughput) avec des Unités de Modèle dédiées ; 4. Demander une augmentation de quota via AWS Service Quotas.",
      m1: { label: "Erreur HTTP 429", value: "ThrottlingException", desc: "Indique que le quota de requêtes ou tokens par minute est atteint." },
      m2: { label: "Exponential Backoff", value: "Temporisation Exponentielle", desc: "Espace progressivement les réessais pour laisser le service souffler." },
      m3: { label: "Service Quotas", value: "Demande d'Augmentation", desc: "Console AWS pour solliciter une hausse des limites d'invocations par minute." },
      rules: [
        "1. Pour absorber les pics de trafic sans interruption : utiliser l'Exponential Backoff avec Jitter dans le code client.",
        "2. Pour un besoin de débit garanti à toute heure pour un SLA critique : acheter du Provisioned Throughput."
      ],
      tag: "QUOTAS & THROTTLING"
    },
    {
      title: "Gouvernance Multi-Comptes avec AWS Organizations et Service Control Policies (SCP)",
      lead: "Comment une direction informatique peut-elle interdire l'utilisation d'Amazon Bedrock dans toutes les régions en dehors de l'Union Européenne ?",
      heading: "Verrouillage Centralisé de la Conformité et Périmètres Régionaux",
      body: "AWS Organizations permet de gérer une flotte de centaines de comptes AWS sous une structure hiérarchique d'Unités Organisationnelles (OU) : 1. Les Service Control Policies (SCP) appliquent des barrières de sécurité (Guardrails organisationnels) centralisées ; 2. Une SCP peut stipuler : 'Refuser l'action `bedrock:*` si la condition `aws:RequestedRegion` n'est pas dans `eu-west-1` (Irlande) ou `eu-west-3` (Paris)' ; 3. Aucun administrateur de compte membre ne peut outrepasser une interdiction définie par une SCP.",
      m1: { label: "Service Control Policy", value: "SCP au Niveau Compte/OU", desc: "Définit les limites maximales de permissions pour l'ensemble d'un compte AWS." },
      m2: { label: "Souveraineté des Données", value: "Restrictions Géographiques", desc: "Garantit que les modèles d'IA ne tournent que dans les datacenters autorisés par le DPO." },
      m3: { label: "Inviolable", value: "Supérieur à l'Admin Compte", desc: "Même le compte root d'un compte membre reste assujetti aux règles de la SCP." },
      rules: [
        "1. Pour imposer des règles de conformité géographique à grande échelle sur tous les comptes AWS : utiliser les SCP dans AWS Organizations.",
        "2. Une SCP ne donne pas de droits, elle restreint le périmètre maximal des permissions autorisables par IAM."
      ],
      tag: "ORGANIZATIONS & SCPS"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'CONFIDENTIALITÉ DONNÉES BEDROCK',
    'IAM & CONTRÔLE D ACCÈS MODÈLES',
    'CHIFFREMENT AWS KMS CMK',
    'SÉCURITÉ RÉSEAU PRIVATELINK',
    'AUDIT CLOUDTRAIL & CLOUDWATCH',
    'MODEL INVOCATION LOGGING S3',
    'CONFORMITÉ AWS ARTIFACT & SOC',
    'RESPONSABILITÉ PARTAGÉE IA',
    'QUOTAS BEDROCK & THROTTLING 429',
    'GOUVERNANCE MULTI-COMPTES SCPS'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-aifc01-d5-${String(num).padStart(3, '0')}`,
    category: `AIF-C01 • DOMAINE 5 • ${subCategory}`,
    categoryBadgeColor: '#0ea5e9',
    levelTag: `AIF-C01 • D5 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 14%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[AIF-C01 D5-#${num}] ${baseTopic.title} (Question Sécurité & Gouvernance #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Objectif clé du Domaine 5 (Sécurité, Conformité et Gouvernance des Systèmes d'IA) pour l'examen AWS AIF-C01.`,
    solutionHeading: `${baseTopic.heading} - Standard AWS Sécurité & Conformité`,
    solutionBody: `${baseTopic.body} Le Domaine 5 (14% de l'examen) valide l'aptitude à sécuriser les architectures d'IA sur AWS : chiffrement KMS, isolation VPC PrivateLink, politiques IAM de moindre privilège, journalisation CloudTrail et conformité réglementaire.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé AIF-C01 D5 : Dans le modèle de responsabilité partagée, le client est toujours responsable de l'activation des Guardrails de sécurité applicative et du respect de la conformité de ses données.`
    ],
    deckName: "AWS AIF-C01 : Domaine 5 - Sécurité, conformité et gouvernance",
    domainId: 'domain5',
    domainName: "5. Sécurité, conformité et gouvernance des systèmes d'IA",
    certCode: 'AIF-C01',
  };
});
