import { Flashcard } from '../../types';

// Google Cloud GCP-PMLE - Domaine 4 : Automatiser et orchestrer les flux de travail ML - MLOps (100 Flashcards)
// Poids officiel de l'examen Professional Machine Learning Engineer : 20%
export const gcpmleDomain4Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `GCP-D4-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Orchestration Serverless de Pipelines avec Vertex AI Pipelines (Kubeflow v2 & TFX)",
      lead: "Comment orchestrer un workflow de données, d'entraînement, d'évaluation et de déploiement sans administrer de cluster Kubernetes GKE ?",
      heading: "Exécution Serverless de DAGs avec KFP v2 et TFX",
      body: "Vertex AI Pipelines est le service d'orchestration MLOps serverless de Google Cloud : 1. Compatible avec Kubeflow Pipelines (KFP SDK v2) et TensorFlow Extended (TFX) ; 2. Aucun cluster Kubernetes à provisionner, patcher ou dimensionner : vous soumettez le pipeline sous forme de fichier JSON/YAML compilé et Google instancie les conteneurs à la volée avec facturation à la seconde d'exécution ; 3. Caching d'exécution (Execution Caching) activé par défaut : si une étape (ex: ingestion de données) a déjà tourné avec le même code et les mêmes entrées, Vertex réutilise l'artefact en cache sans relancer le calcul, divisant le temps de pipeline par trois.",
      m1: { label: "100% Serverless", value: "Zéro Gestion de Cluster GKE", desc: "Élimine le coût et la complexité d'administration d'infrastructure Kubernetes." },
      m2: { label: "Execution Caching", value: "Réutilisation des Résultats", desc: "Évite de recalculer inutilement des étapes de preprocessing inchangées." },
      m3: { label: "SDK KFP v2", value: "Composants Python Décorés", desc: "Définition de tâches via `@dsl.component` avec typage strict d'artefacts." },
      rules: [
        "1. Pour orchestrer des workflows ML reproductibles sur GCP sans coût fixe d'infrastructure : Vertex AI Pipelines.",
        "2. Désactiver le cache (`enable_caching=False`) uniquement si une étape lit une source de données externe dynamique non versionnée."
      ],
      tag: "VERTEX AI PIPELINES SERVERLESS"
    },
    {
      title: "Lignage des Métadonnées et Audit avec Vertex ML Metadata (MLMD)",
      lead: "Comment prouver à un auditeur réglementaire quel commit Git, quel dataset Cloud Storage et quels hyperparamètres ont produit le modèle déployé en production ?",
      heading: "Traçabilité Cryptographique de l'Ascendance Complète des Modèles",
      body: "Vertex ML Metadata (MLMD) enregistre automatiquement l'arbre généalogique complet (lineage) de chaque exécution de pipeline Vertex AI : 1. Artefacts : jeux de données sources, conteneurs Docker, modèles générés, rapports d'évaluation ; 2. Exécutions : étapes unitaires de calcul avec leurs paramètres et temps d'exécution ; 3. Contextes : regroupements logiques d'expériences ; 4. Visualisation d'ascendance (Lineage Graph) : permet de cliquer sur un modèle en production et de remonter visuellement jusqu'au fichier CSV/Parquet d'origine et au code utilisé, garantissant une reproductibilité et conformité d'audit totales.",
      m1: { label: "Lineage Graph", value: "Visualisation d'Ascendance", desc: "Trace le flux complet depuis les données brutes jusqu'à l'endpoint déployé." },
      m2: { label: "Reproductibilité", value: "Enregistrement des Paramètres", desc: "Permet de recréer à l'identique un modèle entraîné il y a 6 mois." },
      m3: { label: "Conformité Audit", value: "Traçabilité Réglementaire", desc: "Preuve formelle indispensable pour les modèles bancaires et médicaux." },
      rules: [
        "1. Vertex ML Metadata est activé nativement et sans surcoût sur tous les pipelines Vertex AI.",
        "2. En cas de détection d'une anomalie dans un jeu de données, MLMD permet d'identifier immédiatement tous les modèles dérivés contaminés."
      ],
      tag: "VERTEX ML METADATA LINEAGE"
    },
    {
      title: "Gestion du Cycle de Vie des Modèles avec Vertex AI Model Registry",
      lead: "Comment versionner les modèles d'entreprise et basculer l'alias '@champion' vers une nouvelle version sans changer le code de l'application cliente ?",
      heading: "Registre Centralisé, Versioning et Système d'Alias Découplé",
      body: "Vertex AI Model Registry sert de catalogue unique et sécurisé pour tous les modèles entraînés de l'entreprise (AutoML, Custom, BigQuery ML) : 1. Versioning automatique : chaque nouvel export crée une sous-version incrémentale (v1, v2, v3) tout en conservant le même ID de modèle ; 2. Alias de modèles : attribution de labels symboliques (ex: `@champion` pour le modèle actif en production, `@challenger` pour le candidat en cours d'évaluation) ; les clients appellent l'endpoint avec l'alias `@champion`, permettant à l'équipe MLOps de promouvoir un nouveau modèle en déplaçant l'étiquette sans aucune modification côté client ; 3. Model Cards : documentation intégrée des performances et biais.",
      m1: { label: "Alias Symboliques", value: "@champion & @challenger", desc: "Découple l'application appelante de la version physique sous-jacente du modèle." },
      m2: { label: "Multi-Origines", value: "AutoML, Custom, BQML", desc: "Rassemble sous une même gouvernance tous les modèles créés sur GCP." },
      m3: { label: "Model Cards", value: "Fiches de Transparence", desc: "Documente le cas d'usage prévu, les métriques de test et les limites opérationnelles." },
      rules: [
        "1. Utiliser les alias (`@champion`) dans les URLs d'inférence pour permettre des promotions de modèle sans redéploiement d'application.",
        "2. Ne jamais écraser un modèle existant : toujours enregistrer une nouvelle version dans Vertex AI Model Registry."
      ],
      tag: "VERTEX MODEL REGISTRY ALIASES"
    },
    {
      title: "Inférence en Ligne (Online Prediction) vs Inférence par Lots (Batch Prediction)",
      lead: "Quel mode de déploiement choisir pour générer chaque nuit les recommandations personnalisées de 10 millions d'abonnés stockés dans BigQuery ?",
      heading: "Arbitrage Architectural : Latence Temps Réel vs Débit Économique par Lots",
      body: "1. Online Prediction (Endpoints Temps Réel) : le modèle est déployé sur un serveur permanent (Vertex AI Endpoint) ; répond à des requêtes HTTP/gRPC individuelles avec une latence de quelques millisecondes ; dispose d'un autoscaling avec min/max replicas ; tarification à l'heure d'instance VM allumée. Recommandé pour les applications interactives (web, mobile, paiement bancaire) ; 2. Batch Prediction (Prédiction par Lots) : traite de gigantesques volumes de données asynchrones depuis Cloud Storage ou BigQuery ; alloue temporairement un cluster de dizaines de machines en parallèle, effectue les inférences, écrit les résultats et s'éteint immédiatement ; tarification à l'usage strict sans coût résiduel. Recommandé pour le scoring nocturne.",
      m1: { label: "Online Prediction", value: "Endpoint Dédié < 50 ms", desc: "Réponse synchrone immédiate avec autoscaling basé sur le trafic en direct." },
      m2: { label: "Batch Prediction", value: "Cluster Éphémère Massif", desc: "Traitement asynchrone ultra-économique pour scoring récurrent de millions de lignes." },
      m3: { label: "Source Batch", value: "BigQuery & GCS", desc: "Lecture directe et réécriture des scores dans des tables BigQuery de production." },
      rules: [
        "1. Pour scorer des millions de profils chaque nuit : utiliser impérativement Vertex AI Batch Prediction (pas d'endpoint temps réel).",
        "2. Pour une API web nécessitant une réponse en moins de 100 ms : déployer sur un Vertex AI Endpoint avec min_replica_count >= 1."
      ],
      tag: "ONLINE VS BATCH PREDICTION"
    },
    {
      title: "Stratégies de Déploiement Sécurisé : Canary Deployment et Traffic Splitting",
      lead: "Comment tester en conditions réelles une nouvelle version de modèle sur 10% des utilisateurs de production tout en conservant la capacité de revenir en arrière instantanément ?",
      heading: "Répartition Graduelle du Trafic sur un Même Endpoint Vertex AI",
      body: "Un Vertex AI Endpoint peut héberger simultanément plusieurs modèles (ou versions de modèles) : 1. Déploiement Canary : on déploie le nouveau modèle `v2` sur l'endpoint existant hébergeant `v1` ; 2. Traffic Splitting : on configure la répartition du trafic réseau via l'API (`traffic_split = {'v1': 90, 'v2': 10}`) ; 90% des requêtes réelles continuent d'aller vers le modèle stable, tandis que 10% alimentent le nouveau modèle pour vérifier la latence et l'exactitude sous charge réelle ; 3. Rollback immédiat : en cas d'anomalie ou d'erreur 5xx, il suffit de repasser `traffic_split = {'v1': 100, 'v2': 0}` en une seconde sans interruption de service.",
      m1: { label: "Traffic Splitting", value: "Pourcentage Ajustable en Direct", desc: "Permet une montée en charge progressive (10% -> 25% -> 50% -> 100%)." },
      m2: { label: "Endpoint Unique", value: "Zéro Changement DNS/URL", desc: "L'application cliente continue d'appeler la même URL unique d'endpoint." },
      m3: { label: "Rollback en 1 Clic", value: "Remise à Zéro Instantanée", desc: "Élimine tout risque de panne majeure lors d'une mise à jour de modèle." },
      rules: [
        "1. Pour déployer un nouveau modèle en production sans interruption : utiliser le Traffic Splitting sur un Vertex AI Endpoint.",
        "2. Conserver l'ancienne version déployée avec 0% de trafic pendant 48 heures pour permettre un retour arrière d'urgence immédiat."
      ],
      tag: "TRAFFIC SPLITTING & CANARY"
    },
    {
      title: "Shadow Testing (Dark Traffic) : Validation en Conditions Réelles sans Impact Utilisateur",
      lead: "Comment évaluer la latence et la stabilité d'un grand modèle avant son lancement officiel sans qu'aucun client ne reçoive ses prédictions ?",
      heading: "Duplication Asynchrone du Trafic de Production (Dark Launch)",
      body: "Dans le Shadow Testing (Trafic Fantôme) : 1. L'application envoie chaque requête de production au modèle actuel de référence (`Champion`), qui répond immédiatement à l'utilisateur ; 2. En parallèle et de façon asynchrone (via Cloud Pub/Sub ou une passerelle d'API comme Apigee / Cloud Run), la même requête est dupliquée et envoyée au modèle candidat (`Shadow / Challenger`) ; 3. La réponse du modèle candidat est enregistrée dans BigQuery pour analyse statistique comparative (précision, dérive, latence) mais n'est JAMAIS renvoyée à l'utilisateur final. Risque utilisateur = zéro absolu.",
      m1: { label: "Zéro Risque Client", value: "Réponses Non Visibles", desc: "Seules les réponses du modèle validé sont transmises à l'utilisateur." },
      m2: { label: "Conditions Réelles 100%", value: "Vrai Volume de Production", desc: "Valide le comportement sous le vrai débit, avec le vrai bruit des données réelles." },
      m3: { label: "Analyse Comparée", value: "Jointure SQL dans BigQuery", desc: "Compare les écarts de prédiction entre Champion et Challenger sur des millions d'appels." },
      rules: [
        "1. Pour valider les performances d'un modèle critique (médical, trading) avant bascule : privilégier le Shadow Testing.",
        "2. Le Shadow Testing requiert de dimensionner le modèle candidat pour encaisser le volume complet de requêtes en parallèle."
      ],
      tag: "SHADOW TESTING & DARK TRAFFIC"
    },
    {
      title: "Co-Hébergement de Modèles (Model Co-Hosting) sur Vertex AI Endpoints",
      lead: "Comment réduire drastiquement les coûts d'infrastructure lorsqu'une entreprise doit héberger 50 petits modèles personnalisés à faible trafic individuel ?",
      heading: "Mutualisation de Flotte et Partage d'Instances d'Inférence",
      body: "Déployer une machine virtuelle avec GPU pour chaque petit modèle sous-utilisé engendre un gaspillage financier majeur. Vertex AI supporte le Co-Hébergement de Modèles (Model Co-hosting) : 1. Plusieurs modèles compatibles partagent les ressources d'une même machine virtuelle ou d'un même groupe d'autoscaling ; 2. L'infrastructure ajuste dynamiquement la mémoire et les cœurs CPU pour servir les requêtes routées vers l'un ou l'autre des modèles ; 3. Réduction des coûts jusqu'à 80% pour les applications SaaS multi-tenants où chaque client dispose d'un petit modèle personnalisé rarement sollicité.",
      m1: { label: "Partage de Ressources", value: "Multi-Modèles sur 1 Instance", desc: "Mutualise la RAM, le CPU et le système d'exploitation entre plusieurs modèles." },
      m2: { label: "Économie Majeure", value: "Divise les Coûts Fixes par 5 à 10", desc: "Évite de payer 50 instances minimales tournant à 2% de charge." },
      m3: { label: "Routage Intelligent", value: "Sous-Chemins d'Endpoint", desc: "Vertex AI achemine la requête vers le conteneur approprié en interne." },
      rules: [
        "1. Pour déployer de nombreux modèles à faible fréquence d'appel : utiliser le Co-Hébergement sur Vertex AI Endpoints.",
        "2. Les modèles co-hébergés doivent utiliser des frameworks d'exécution compatibles pour être colocalisés."
      ],
      tag: "CO-HÉBERGEMENT DE MODÈLES"
    },
    {
      title: "Intégration et Déploiement Continus (CI/CD) pour le Machine Learning avec Cloud Build",
      lead: "Comment automatiser complètement le cycle de vie ML dès qu'un ingénieur effectue une 'Pull Request' sur le dépôt Git du projet ?",
      heading: "Pipelines CI/CD Dédiés au Code et aux Modèles ML (CT/CD)",
      body: "Le MLOps étend le CI/CD classique au cycle de vie des modèles avec Google Cloud Build : 1. Phase CI (Intégration Continue) : déclenchée par un commit Git ; exécute les tests unitaires du code de preprocessing, valide les schémas de données, compile le pipeline Kubeflow v2 et construit l'image Docker sur Artifact Registry ; 2. Phase CD (Déploiement Continu) : déclenche l'exécution du Vertex AI Pipeline dans l'environnement de staging ; 3. Gate de validation : si le nouveau modèle dépasse les performances du modèle de production sur le jeu de test, il est enregistré dans le Model Registry et déployé en mode Canary.",
      m1: { label: "Google Cloud Build", value: "Serveur CI/CD Managé Serverless", desc: "Exécute les étapes de build, test et déploiement dans des conteneurs isolés." },
      m2: { label: "Tests Unitaires ML", value: "Validation Code & Transformations", desc: "Vérifie l'absence de fuite de données et le bon format des tenseurs." },
      m3: { label: "Seuils d'Approbation", value: "Promotion Automatique Conditionnelle", desc: "Le modèle n'est promu que si son F1-Score ou AUC dépasse formellement la référence." },
      rules: [
        "1. Dans une architecture MLOps mature, aucun modèle n'est déployé manuellement : tout passe par un pipeline Cloud Build automatisé.",
        "2. Configurer des triggers Cloud Build basés sur les branches Git (ex: `main` pour la préproduction, tags pour la production)."
      ],
      tag: "CI/CD & CLOUD BUILD MLOPS"
    },
    {
      title: "Dimensionnement Élastique des Endpoints (Autoscaling Min/Max Replicas)",
      lead: "Comment configurer un endpoint d'inférence Vertex AI pour absorber des pics de charge de 0 à 5 000 requêtes/sec sans temps de latence excessif au démarrage ?",
      heading: "Règles d'Autoscaling Horizontal et Gestion du Démarrage à Froid",
      body: "Lors du déploiement d'un modèle sur un Vertex AI Endpoint, vous configurez deux paramètres clés : 1. `min_replica_count` : nombre minimum d'instances actives en permanence. Pour une application critique grand public, régler `min_replica_count >= 2` (répartis sur plusieurs zones) pour garantir une haute disponibilité et éliminer le démarrage à froid (Cold Start) ; 2. `max_replica_count` : plafond maximal d'instances pour maîtriser le budget en cas d'attaque ou de pic viral ; 3. Déclencheur de mise à l'échelle : Vertex AI surveille en continu la charge CPU/GPU et le temps de latence des requêtes pour instancier de nouveaux nœuds automatiquement.",
      m1: { label: "min_replica_count >= 2", value: "Zéro Cold Start & Haute Dispo", desc: "Garantit des réponses immédiates même lors d'une panne matérielle zonale." },
      m2: { label: "max_replica_count", value: "Plafond Budgétaire Verrouillé", desc: "Évite l'explosion de la facture en cas de boucle infinie de requêtes clientes." },
      m3: { label: "Scale-Down Période", value: "Refroidissement Progressif", desc: "Maintient les nœuds quelques minutes après le pic pour éviter les oscillations rapides." },
      rules: [
        "1. Pour une application de production à faible latence : ne jamais régler `min_replica_count = 0` (évite le délai de démarrage de conteneur).",
        "2. Surveiller la métrique `aiplatform.googleapis.com/prediction/online/node_utilization` pour calibrer les seuils d'autoscaling."
      ],
      tag: "AUTOSCALING ENDPOINTS"
    },
    {
      title: "Compilation et Optimisation d'Inférence avec NVIDIA TensorRT et TFLite",
      lead: "Comment diviser par 4 la latence d'inférence et doubler le débit de prédiction d'un réseau profond déployé sur GPU NVIDIA ?",
      heading: "Optimisation de Graphe, Fusion de Couches et Quantification",
      body: "Déployer un modèle sans optimisation logicielle sous-exploite le matériel GPU : 1. NVIDIA TensorRT : moteur d'inférence haute performance qui analyse le graphe de calcul du modèle, fusionne les opérations consécutives (ex: convolution + biais + ReLU combinés en un seul kernel CUDA) et élimine les couches mortes ; 2. Quantification numérique : conversion des poids de FP32 (virgule flottante 32 bits) vers FP16 ou INT8 (entiers 8 bits) ; réduit la bande passante mémoire et exploite les cœurs Tensor Cores dédiés avec une perte de précision quasi nulle ; 3. TensorFlow Lite (TFLite) : équivalent pour l'inférence sur processeurs mobiles et edge computing.",
      m1: { label: "Fusion de Couches", value: "Kernel CUDA Unique", desc: "Élimine les allers-retours coûteux en mémoire VRAM entre chaque opération." },
      m2: { label: "Quantification INT8", value: "Gain VRAM x4 & Débit x3", desc: "Exploite les instructions d'entiers ultra-rapides des GPU NVIDIA récents." },
      m3: { label: "TensorRT Container", value: "Triton Inference Server", desc: "Conteneur pré-optimisé pour servir les modèles compilés à très haute cadence." },
      rules: [
        "1. Pour maximiser le débit et minimiser la latence sur GPU NVIDIA en production : compiler le modèle avec TensorRT.",
        "2. Toujours valider la dégradation de précision (accuracy loss) après une quantification agressive en INT8."
      ],
      tag: "TENSORRT & QUANTIFICATION"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'VERTEX PIPELINES KUBEFLOW SERVERLESS',
    'VERTEX ML METADATA AUDIT LINEAGE',
    'VERTEX MODEL REGISTRY ALIASES CHAMPION',
    'ONLINE VS BATCH PREDICTION ENDPOINTS',
    'TRAFFIC SPLITTING CANARY DEPLOYMENT',
    'SHADOW TESTING DARK TRAFFIC',
    'CO-HÉBERGEMENT DE MODÈLES ENDPOINT',
    'CI/CD CLOUD BUILD AUTOMATION MLOPS',
    'AUTOSCALING ENDPOINTS MIN MAX REPLICAS',
    'TENSORRT QUANTIFICATION ACCÉLÉRATION'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-gcpmle-d4-${String(num).padStart(3, '0')}`,
    category: `GCP-PMLE • DOMAINE 4 • ${subCategory}`,
    categoryBadgeColor: '#ea4335',
    levelTag: `GCP-PMLE • D4 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 20%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[GCP-PMLE D4-#${num}] ${baseTopic.title} (Scénario MLOps #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Objectif clé du Domaine 4 (Automatiser et orchestrer les flux de travail ML - MLOps) de l'examen GCP-PMLE.`,
    solutionHeading: `${baseTopic.heading} - Standard Google Cloud MLOps Architecture`,
    solutionBody: `${baseTopic.body} Le Domaine 4 (20% de l'examen) évalue la maîtrise des pipelines Kubeflow serverless, la traçabilité Vertex ML Metadata, la gestion des alias du Model Registry, le traffic splitting, le canary testing et l'automatisation CI/CD avec Cloud Build.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé GCP-PMLE D4 : Le succès MLOps sur Google Cloud repose sur l'automatisation intégrale du cycle de vie (Vertex Pipelines) et le déploiement sécurisé sans coupure (Traffic Splitting avec alias de modèles).`
    ],
    deckName: "Google Cloud GCP-PMLE : Domaine 4 - MLOps et orchestration de pipelines",
    domainId: 'domain4',
    domainName: "4. Automatiser et orchestrer les flux de travail ML (MLOps)",
    certCode: 'GCP-PMLE',
  };
});
