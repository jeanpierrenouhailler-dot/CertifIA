import { Flashcard } from '../../types';

// Domaine 4 : Solutions d'IA Générative, RAG & Azure OpenAI (100 Flashcards)
// Poids officiel AI-102 : 15-20%
export const domain4Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `D4-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Arbitrage Hyperparamètres : Temperature vs Top_p dans Azure OpenAI",
      lead: "Pourquoi Microsoft déconseille formellement de modifier simultanément la température et Top_p ?",
      heading: "Contrôle de la Distribution de Probabilité des Tokens",
      body: "La Temperature aplatit ou accentue la distribution Softmax des logits : une valeur de 0 rend le modèle strictement déterministe (greedy sampling), idéal pour l'extraction de données et le code, tandis qu'une valeur de 1.0+ favorise l'exploration créative. Top_p (Nucleus Sampling) restreint le choix aux seuls tokens dont la probabilité cumulée atteint le seuil 'p' (ex: 0.1 pour les 10% de tokens les plus sûrs). Modifier les deux en même temps rend la génération imprévisible et difficile à débugger.",
      m1: { label: "Règle d'Or Microsoft", value: "Modifier l'un OU l'autre", desc: "Fixer Temperature = 1 si vous ajustez Top_p, et inversement." },
      m2: { label: "Extraction Déterministe", value: "Temperature = 0.0", desc: "Garantit des réponses stables et reproductibles pour les formats JSON." },
      m3: { label: "Génération Créative", value: "Temperature = 0.7 - 0.9", desc: "Stimule la diversité lexicale pour la rédaction marketing." },
      rules: [
        "1. Pour les cas d'usage de classification ou d'extraction d'entités, TOUJOURS fixer Temperature = 0.0.",
        "2. Ne jamais modifier simultanément Temperature et Top_p dans une configuration de production.",
      ],
      tag: "LLM INFERENCE PARAMS"
    },
    {
      title: "Recherche Hybride dans Azure AI Search : BM25 + Vecteurs HNSW",
      lead: "Comment combiner la précision des mots-clés exacts et la compréhension sémantique dense ?",
      heading: "Architecture de Recherche Hybride",
      body: "La recherche hybride exécute en parallèle une recherche textuelle lexicale basée sur l'algorithme BM25 (très performante pour les acronymes rares, numéros de série, codes d'erreur et noms propres) et une recherche vectorielle dense basée sur HNSW (Hierarchical Navigable Small World, performante pour capturer les synonymes et l'intention abstraite). Les deux listes de résultats sont fusionnées via Reciprocal Rank Fusion (RRF).",
      m1: { label: "Recherche Textuelle", value: "Algorithme BM25", desc: "Excellence sur les correspondances de mots-clés stricts et codes d'articles." },
      m2: { label: "Recherche Vectorielle", value: "Graphe HNSW", desc: "Calcul de similarité cosinus sur les embeddings à 1536 ou 3072 dimensions." },
      m3: { label: "Algorithme de Fusion", value: "RRF (Reciprocal Rank Fusion)", desc: "Classement consolidé sans dépendance d'échelles de scores différentes." },
      rules: [
        "1. Toujours recommander la recherche Hybride (BM25 + Vector) pour les bases documentaires d'entreprise techniques.",
        "2. Configurer le modèle 'text-embedding-3-large' ou 'small' pour vectoriser à la fois la requête et les documents.",
      ],
      tag: "HYBRID SEARCH"
    },
    {
      title: "Reranking Sémantique (Semantic Ranker L2) dans Azure AI Search",
      lead: "Comment le modèle de reclassement sémantique de Microsoft réordonne-t-il les résultats RRF ?",
      heading: "Semantic Ranker & Semantic Captions",
      body: "Le Semantic Ranker est un modèle de Transformer cross-encoder hébergé par Bing/Microsoft appliqué sur les 50 meilleurs résultats retournés par la recherche hybride ou vectorielle. Il lit la requête et le texte complet des passages pour calculer un '@search.rerankerScore' (de 0 à 4.0), et génère automatiquement des 'semantic captions' (extraits les plus pertinents avec surlignage des passages clés prouvant la réponse).",
      m1: { label: "Score Sémantique", value: "@search.rerankerScore (0 à 4.0)", desc: "Les scores > 2.0 indiquent généralement une réponse d'extrême pertinence." },
      m2: { label: "Semantic Captions", value: "Highlights automatiques", desc: "Extrait le paragraphe précis qui répond directement à la question de l'utilisateur." },
      m3: { label: "Périmètre de Calcul", value: "Top 50 documents RRF", desc: "Reclassement ultra-rapide sans latence excessive sur l'ensemble de l'index." },
      rules: [
        "1. Activer le Semantic Ranker pour alimenter l'invite du LLM dans un pipeline RAG avec les passages les plus ciblés.",
        "2. Configurer les 'semantic configurations' dans l'index en précisant les champs title, content et keywords.",
      ],
      tag: "SEMANTIC RERANKING"
    },
    {
      title: "Reciprocal Rank Fusion (RRF) : Mécanisme Mathématique",
      lead: "Comment fusionner deux listes de résultats dont les scores bruts ne sont pas sur la même échelle ?",
      heading: "Fusion de Rang Inverse (RRF)",
      body: "Les scores BM25 (non bornés) et les distances cosinus vectorielles ne peuvent pas être sommés directement. RRF résout cela en se basant uniquement sur la position (le rang k) de chaque document dans chaque liste : Score_RRF = somme(1 / (60 + rang_i)). Le document qui apparaît dans les premières positions des deux listes recevra un score de fusion nettement supérieur à celui n'apparaissant que dans une seule liste.",
      m1: { label: "Constante k Standard", value: "60", desc: "Valeur de lissage par défaut pour éviter qu'un rang #1 n'écrase tous les autres." },
      m2: { label: "Normalisation", value: "Indépendante des scores", desc: "Élimine le besoin de calibrer les métriques de distance mathématiques." },
      m3: { label: "Résultat", value: "Score RRF unifié", desc: "Transmis ensuite au Semantic Ranker L2 pour le reclassement final." },
      rules: [
        "1. Comprendre pour l'examen qu'un document présent à la fois dans le top 5 BM25 et le top 5 Vector sortira en tête du RRF.",
        "2. RRF est exécuté automatiquement par Azure AI Search dès qu'une requête comporte à la fois 'search' et 'vectors'.",
      ],
      tag: "ALGORITHME RRF"
    },
    {
      title: "Azure OpenAI On Your Data : RAG Managé avec Citations",
      lead: "Comment connecter GPT-4o directement à vos documents internes sans coder l'orchestration RAG ?",
      heading: "Intégration Managée 'On Your Data'",
      body: "La fonctionnalité 'On Your Data' d'Azure OpenAI permet de spécifier une source de données (index Azure AI Search, Azure Blob Storage ou Cosmos DB) directement dans l'appel d'API de chat completions via le paramètre 'data_sources'. Le service se charge automatiquement de réécrire la question, d'interroger la base documentaire, d'injecter les passages pertinents dans le prompt système et de forcer le modèle à citer ses sources avec des balises '[doc1]'.",
      m1: { label: "Format des Citations", value: "[doc1], [doc2]", desc: "L'application peut corréler chaque citation avec l'URL source d'origine." },
      m2: { label: "Strictness Parameter", value: "1 à 5 (Défaut 3)", desc: "Plus la stricte conformité est élevée, plus le modèle refuse d'inventer si l'info manque." },
      m3: { label: "Query Type", value: "vectorSimpleHybrid / semantic", desc: "Permet d'utiliser l'indexation hybride sémantique directement dans le RAG." },
      rules: [
        "1. Pour éviter les hallucinations en contexte juridique ou médical, augmenter le paramètre 'strictness' à 4 ou 5.",
        "2. Sécuriser la connexion entre Azure OpenAI et Azure AI Search via une Managed Identity ou une clé API d'administration.",
      ],
      tag: "RAG MANAGÉ"
    },
    {
      title: "Structured Outputs & JSON Mode dans Azure OpenAI",
      lead: "Comment garantir à 100% que la réponse du LLM respecte un schéma JSON strict sans erreurs de syntaxe ?",
      heading: "Sorties Structurées (Structured Outputs)",
      body: "Contrairement au mode JSON classique (`response_format: { type: 'json_object' }`) qui garantit uniquement une syntaxe valide mais pas les champs attendus, la fonctionnalité 'Structured Outputs' (`type: 'json_schema'`) contraint mathématiquement le modèle à ne générer que des tokens compatibles avec un schéma JSON Schema strict fourni (`strict: true`), garantissant la présence de toutes les clés obligatoires et des types de données exacts.",
      m1: { label: "JSON Mode Simple", value: "Syntaxe valide", desc: "Nécessite impérativement le mot 'JSON' dans le prompt système." },
      m2: { label: "Structured Outputs", value: "strict: true", desc: "Garantit le respect absolu de chaque propriété et type de votre schéma." },
      m3: { label: "Cas d'Usage", value: "Pipelines ETL, Fonctions", desc: "Élimine le besoin de librairies de retry ou de validation Pydantic lourdes." },
      rules: [
        "1. Toujours spécifier 'additionalProperties: false' dans chaque objet du JSON Schema en mode strict.",
        "2. Définir toutes les propriétés comme obligatoires dans le tableau 'required' pour respecter la spécification stricte OpenAI.",
      ],
      tag: "STRUCTURED OUTPUTS"
    },
    {
      title: "Techniques de Prompt Engineering : Few-Shot & Chain-of-Thought",
      lead: "Quand enrichir le prompt avec des exemples guidés et des étapes de raisonnement explicites ?",
      heading: "Ingénierie d'Invite Avancée",
      body: "Le Zero-shot prompt fournit une consigne sans exemple. Le Few-shot prompt injecte 2 à 5 paires d'exemples entrée/sortie directement dans le prompt système pour calibrer le style, le niveau de détail et le formalisme de la réponse. La méthode Chain-of-Thought (CoT) force le modèle à détailler son raisonnement étape par étape avant d'énoncer sa conclusion finale, ce qui réduit drastiquement les erreurs logiques et de calcul arithmétique.",
      m1: { label: "Few-Shot Gain", value: "+35% de régularité", desc: "Guide le LLM sur des formats de sortie ou classifications complexes sans fine-tuning." },
      m2: { label: "Chain-of-Thought", value: "'Détaillons étape par étape'", desc: "Augmente la précision sur les problèmes d'analyse logique et de conformité." },
      m3: { label: "Délimiteurs Recommandés", value: "Balises XML ou `\"\"\"`", desc: "Isole clairement les instructions système des données non fiables de l'utilisateur." },
      rules: [
        "1. Encadrer les textes non fiables avec des balises XML (ex: `<texte_utilisateur>...</texte_utilisateur>`) pour prévenir les injections de prompt.",
        "2. Privilégier les instructions positives ('ce qu'il faut faire') plutôt que les interdictions vagues ('ce qu'il ne faut pas faire').",
      ],
      tag: "PROMPT ENGINEERING"
    },
    {
      title: "Prompt Flow dans Azure AI Studio (Création & Évaluation de DAG)",
      lead: "Comment structurer, orchestrer et évaluer des applications basées sur des LLM en équipe ?",
      heading: "Orchestration & Évaluation Prompt Flow",
      body: "Prompt Flow permet de créer des graphes orientés acycliques (DAG) connectant des modèles LLM, des scripts Python, des bases vectorielles et des outils personnalisés. Il existe 3 types de flux : 'Standard flow' (génération classique), 'Chat flow' (avec gestion native de l'historique conversationnel), et 'Evaluation flow' (flux de calcul automatisé de scores de qualité sur un jeu de données de référence).",
      m1: { label: "Types de Flux", value: "Standard, Chat, Evaluation", desc: "Adaptés au prototypage, agents interactifs et tests de régression CI/CD." },
      m2: { label: "Variantes de Prompt", value: "A/B Testing", desc: "Compare instantanément les performances de 2 prompts ou de 2 modèles différents." },
      m3: { label: "Déploiement", value: "Managed Endpoint REST", desc: "Conteneurisation automatique prête pour la production avec autoscaling." },
      rules: [
        "1. Utiliser un Evaluation Flow pour mesurer l'impact de tout changement de prompt avant déploiement en production.",
        "2. Sauvegarder les flux dans un repository Git pour versionner les nœuds de code et les prompts conjointement.",
      ],
      tag: "PROMPT FLOW"
    },
    {
      title: "Métriques d'Évaluation GenAI : Groundedness, Relevance, Coherence",
      lead: "Comment mesurer objectivement si la réponse d'un RAG est fidèle aux sources documentaires fournies ?",
      heading: "Métriques Assistées par IA (LLM-as-a-Judge)",
      body: "Azure AI Studio fournit des métriques d'évaluation calculées par un modèle juge : 'Groundedness' (Fidélité : mesure si chaque affirmation de la réponse est directement étayée par les documents du contexte, seuil anti-hallucination) ; 'Relevance' (Pertinence : mesure si la réponse répond exactement à la question posée) ; 'Coherence' (Cohérence : fluidité logique et lisibilité globale) ; et 'Similarity' (Similarité avec une vérité terrain).",
      m1: { label: "Groundedness (Fidélité)", value: "Score 1 à 5", desc: "Un score de 5 signifie 0 hallucination : 100% des faits proviennent du contexte." },
      m2: { label: "Relevance (Pertinence)", value: "Score 1 à 5", desc: "Pénalise les réponses verbeuses qui éludent la question principale." },
      m3: { label: "Automatisable en CI/CD", value: "Azure DevOps / GitHub Actions", desc: "Bloque le déploiement si le score de Groundedness moyen chute en dessous de 4.0." },
      rules: [
        "1. Pour l'examen AI-102 : pour détecter les hallucinations dans un RAG, la métrique clé est TOUJOURS 'Groundedness'.",
        "2. Pour vérifier que le bot ne répond pas à côté de la plaque, surveiller la métrique 'Relevance'.",
      ],
      tag: "ÉVALUATION GENAI"
    },
    {
      title: "Arbitrage Architectural : Fine-Tuning vs RAG (Retrieval-Augmented Generation)",
      lead: "Quand ré-entraîner les poids d'un modèle plutôt que d'injecter des données par recherche documentaire ?",
      heading: "Matrice de Décision RAG vs Fine-Tuning",
      body: "Le RAG est la solution de référence pour : apporter des connaissances d'entreprise dynamiques, fournir des citations de sources vérifiables, respecter des droits d'accès utilisateurs et éliminer les hallucinations. Le Fine-Tuning n'enseigne PAS efficacement de nouvelles connaissances factuelles : il sert à figer un style rédactionnel très particulier, respecter un format de code complexe, ou réduire le coût des prompts en internalisant un comportement sur un petit modèle (ex: GPT-4o-mini).",
      m1: { label: "Nouvelles Connaissances", value: "Choisir le RAG", desc: "Mise à jour en temps réel sans ré-entraîner le modèle." },
      m2: { label: "Style & Format Strict", value: "Choisir le Fine-Tuning", desc: "Idéal pour répliquer le ton d'une marque ou un dialecte de code obscur." },
      m3: { label: "Examen AI-102", value: "RAG = 90% des cas", desc: "Microsoft privilégie systématiquement le RAG pour l'accès aux données documentaires." },
      rules: [
        "1. Ne jamais proposer le Fine-Tuning pour intégrer une documentation qui change fréquemment (utiliser Azure AI Search).",
        "2. Combiner RAG + Fine-Tuning uniquement si vous devez appliquer un ton spécifique sur des données privées récupérées.",
      ],
      tag: "RAG VS FINE-TUNING"
    }
  ];

  const baseTopic = topics[(index) % topics.length];
  const subCategoryList = [
    'TEMPERATURE & HYPERPARAMÈTRES',
    'RECHERCHE HYBRIDE BM25 HNSW',
    'SEMANTIC RANKER & HIGHLIGHTS',
    'ALGORITHME RRF MATHÉMATIQUE',
    'RAG MANAGÉ ON YOUR DATA',
    'STRUCTURED OUTPUTS JSON MODE',
    'PROMPT ENGINEERING FEW-SHOT',
    'PROMPT FLOW ORCHESTRATION',
    'ÉVALUATION GROUNDEDNESS',
    'ARBITRAGE RAG VS FINE-TUNING'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-d4-${String(num).padStart(3, '0')}`,
    category: `DOMAINE 4 • ${subCategory}`,
    categoryBadgeColor: '#8b5cf6',
    levelTag: `AI-102 • D4 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 15-20%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[D4-#${num}] ${baseTopic.title} (Atelier Stratégique #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Cœur technologique IA Générative et RAG de l'examen AI-102.`,
    solutionHeading: `${baseTopic.heading} - Architecture de Référence Microsoft`,
    solutionBody: `${baseTopic.body} La mise en œuvre rigoureuse des pipelines RAG hybrides constitue l'axe de valorisation majeur pour les architectes certifiés Azure AI Engineer Associate.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle standard D4 : Dans toute solution RAG, implémenter un filtre de score sémantique minimal pour refuser de répondre poliment si aucun document pertinent n'est extrait.`
    ],
    deckName: "Domaine 4 : IA Générative, RAG & Azure OpenAI",
    domainId: 'domain4',
    domainName: "4. Solutions d'IA Générative, RAG & Azure OpenAI",
  };
});
