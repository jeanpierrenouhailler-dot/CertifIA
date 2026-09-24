import { Flashcard } from '../../types';

// IBM watsonx C1000-177 - Domaine 1 : watsonx.ai Studio & Prompt Engineering (100 Flashcards)
// Poids officiel de l'examen IBM Certified Specialist - watsonx.ai : 30%
export const c1000177Domain1Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `IBMX-D1-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Les 3 Modes du Prompt Lab dans watsonx.ai Studio",
      lead: "Quels sont les trois modes d'interaction du Prompt Lab de watsonx.ai et quand privilégier le mode Structured plutôt que Freeform ?",
      heading: "Modes d'Expérimentation du Prompt Lab (Freeform, Structured, Chat)",
      body: "watsonx.ai Prompt Lab propose 3 modes complémentaires : 1. Mode Freeform (Texte Libre) : zone d'édition vierge pour rédiger librement des prompts longs, des templates personnalisés ou des instructions complexes sans contrainte de format ; 2. Mode Structured (Structuré) : sépare visuellement l'Instruction système, le Contexte et les Exemples (Few-shot input/output pairs) ; idéal pour prototyper avec rigueur sans risque d'oublier des délimiteurs de sections ; 3. Mode Chat : interface conversationnelle avec mémoire de session et historique de dialogue, idéale pour tester les modèles de dialogue comme Granite Chat ou Llama Chat.",
      m1: { label: "Mode Freeform", value: "Éditeur Texte Brut", desc: "Idéal pour copier-coller des prompts complexes et formater librement les balises." },
      m2: { label: "Mode Structured", value: "Sections Séparées & Exemples", desc: "Guide le Few-shot prompt engineering avec champs 'Input' et 'Output' dédiés." },
      m3: { label: "Mode Chat", value: "Conversation Multi-Tours", desc: "Maintient l'historique d'échange pour évaluer le suivi contextuel du modèle." },
      rules: [
        "1. Pour créer des prompts Few-shot avec des exemples propres sans erreurs de formatage : utiliser le mode Structured du Prompt Lab.",
        "2. Il est possible de basculer du mode Structured au mode Freeform pour visualiser le prompt compilé final."
      ],
      tag: "PROMPT LAB MODES"
    },
    {
      title: "Modèles de Fondation IBM Granite et Garantie d'Indemnisation Propriété Intellectuelle",
      lead: "Pourquoi un directeur juridique d'entreprise impose-t-il d'utiliser les modèles IBM Granite plutôt que des modèles open source non audités ?",
      heading: "Transparence des Données d'Entraînement et Protection Légale IBM",
      body: "La famille de modèles de fondation IBM Granite (Granite 13b Chat/Instruct, Granite Code, Granite Time Series) se distingue par deux engagements majeurs : 1. Entraînement responsable et transparent : les modèles Granite sont formés exclusivement sur des données d'entreprise vérifiées (finances, code, documents légaux, domaines académiques) rigoureusement filtrées contre les contenus haineux, la toxicité et les licences de propriété intellectuelle litigieuses ; 2. Clause contractuelle d'indemnisation IP (Intellectual Property Indemnification) : IBM protège juridiquement et indemnise financièrement ses clients contre toute poursuite en contrefaçon de droits d'auteur liée à l'utilisation des modèles Granite.",
      m1: { label: "Modèles IBM Granite", value: "Granite 13b / 20b / Code", desc: "Modèles d'entreprise haute performance entraînés sur des données professionnelles saines." },
      m2: { label: "Indemnisation IP", value: "Garantie Juridique Totale", desc: "IBM assume la responsabilité légale face aux litiges de droits d'auteur." },
      m3: { label: "Données Filtrées", value: "Zéro Scraping Hasardeux", desc: "Exclusion stricte des contenus toxiques, illégaux ou sous licence restrictive." },
      rules: [
        "1. Règle absolue examen IBM : Les modèles Granite bénéficient de la garantie d'indemnisation de propriété intellectuelle par IBM.",
        "2. Pour des tâches de génération de code Python, Java ou SQL en environnement régulé : choisir IBM Granite Code."
      ],
      tag: "IBM GRANITE & PROPRIÉTÉ INTELLECTUELLE"
    },
    {
      title: "Paramètres de Décodage : Greedy Decoding vs Sampling et Maîtrise du Déterminisme",
      lead: "Comment paramétrer watsonx.ai pour garantir qu'une tâche d'extraction d'entités financières produise exactement la même réponse à chaque exécution ?",
      heading: "Méthodes de Décodage : Glouton (Greedy) vs Échantillonnage (Sampling)",
      body: "watsonx.ai supporte deux stratégies de décodage pour prédire le token suivant : 1. Décodage Glouton (Greedy Decoding) : le modèle sélectionne systématiquement le token ayant la probabilité mathématique absolue la plus élevée à chaque pas ($P(w)$ max) ; résultat 100% déterministe, reproductible et stable, idéal pour l'extraction de données, la classification, le parsing JSON et les tâches factuelles ; 2. Décodage par Échantillonnage (Sampling) : le modèle tire au sort parmi les tokens probables selon une distribution contrôlée par la Température, Top-P et Top-K ; résultat créatif et varié, idéal pour le marketing ou le brainstorming.",
      m1: { label: "Greedy Decoding", value: "Token de Probabilité Maximale", desc: "Déterministe à 100%, idéal pour l'extraction d'informations et le code." },
      m2: { label: "Sampling Decoding", value: "Tirage Probabiliste", desc: "Introduit de la variabilité contrôlée par Temperature, Top-P et Top-K." },
      m3: { label: "Reproductibilité", value: "Indispensable en Audit", desc: "Greedy garantit qu'un test unitaire ou réglementaire renvoie toujours la même sortie." },
      rules: [
        "1. Pour une extraction de données factuelles, une classification ou une tâche d'audit : choisir Greedy Decoding.",
        "2. Pour de la rédaction créative ou de la reformulation de texte : choisir Sampling Decoding."
      ],
      tag: "DÉCODAGE GREEDY VS SAMPLING"
    },
    {
      title: "Contrôle Fin du Sampling : Température, Top-P (Nucleus) et Top-K",
      lead: "Comment réduire les hallucinations tout en conservant une fluidité naturelle dans les réponses générées par un modèle watsonx.ai ?",
      heading: "Hyperparamètres de Contrôle de la Distribution des Tokens",
      body: "Lorsque le mode Sampling est activé dans watsonx.ai : 1. Température ($0.0$ à $2.0$) : aplatit ou accentue la distribution de probabilités ; une température basse ($0.1 - 0.3$) concentre le choix sur les tokens les plus sûrs ; une température élevée ($0.8 - 1.2$) favorise l'originalité mais augmente le risque d'hallucinations ; 2. Top-P (Nucleus Sampling) : sélectionne le plus petit ensemble de tokens dont la somme des probabilités cumulées atteint le seuil $P$ (ex: $0.90$) ; 3. Top-K : restreint le choix aux $K$ tokens les plus probables (ex: $K=40$), éliminant la longue traîne de mots improbables.",
      m1: { label: "Température Basse (0.2)", value: "Réduit les Hallucinations", desc: "Favorise les réponses factuelles et cohérentes avec les documents sources." },
      m2: { label: "Top-P (Nucleus)", value: "Seuil de Probabilité Cumulée", desc: "S'adapte dynamiquement au contexte selon que la certitude du modèle est haute ou basse." },
      m3: { label: "Top-K", value: "Nombre Fixe de Candidats", desc: "Plafonne strictement la sélection aux K meilleurs mots à chaque étape." },
      rules: [
        "1. Pour minimiser les hallucinations sans basculer en mode greedy : régler la Température entre 0.1 et 0.3 et Top-P à 0.85.",
        "2. Dans watsonx.ai, si la méthode de décodage est Greedy, les curseurs de Température et Top-P sont désactivés."
      ],
      tag: "TEMPÉRATURE TOP-P & TOP-K"
    },
    {
      title: "Gestion des Répétitions et Arrêt : Repetition Penalty et Stop Sequences",
      lead: "Comment empêcher un LLM d'entrer dans une boucle infinie de phrases répétitives ou d'inventer la suite d'un dialogue imaginaire ?",
      heading: "Pénalité de Fréquence et Séquences d'Arrêt Prédéfinites",
      body: "watsonx.ai fournit deux leviers essentiels de cadrage de sortie : 1. Repetition Penalty ($1.0$ à $2.0$) : pénalise mathématiquement les tokens déjà générés dans la fenêtre de contexte courante ; une valeur de $1.0$ n'applique aucune pénalité ; une valeur de $1.1$ à $1.3$ élimine les répétitions désagréables et les boucles sans dégrader la grammaire ; une valeur trop élevée ($>1.5$) force le modèle à inventer des synonymes bizarres ; 2. Stop Sequences (Séquences d'Arrêt) : chaînes de caractères (ex: `###`, `Utilisateur:`, `FIN`) provoquant l'interruption immédiate de la génération dès qu'elles sont émises par le modèle.",
      m1: { label: "Repetition Penalty (1.1 - 1.2)", value: "Anti-Bégaiement", desc: "Élimine les répétitions circulaires de paragraphes sans casser le style." },
      m2: { label: "Stop Sequences", value: "Balises d'Interruption Stricte", desc: "Empêche le modèle de continuer à générer des questions pour le prochain tour." },
      m3: { label: "Min / Max New Tokens", value: "Encadrement de Longueur", desc: "Fixe le nombre minimal et maximal de tokens générés pour maîtriser les coûts API." },
      rules: [
        "1. Pour un chatbot conversationnel : toujours définir le prompt de l'utilisateur comme Stop Sequence (ex: '\\nHumain:').",
        "2. Si un modèle répète la même phrase en boucle, augmenter progressivement la Repetition Penalty vers 1.15."
      ],
      tag: "REPETITION PENALTY & STOP SEQUENCES"
    },
    {
      title: "Prompt Tuning dans watsonx.ai Tuning Studio : Principes et Avantages face au Fine-Tuning",
      lead: "Comment adapter un modèle de fondation de 13B paramètres pour classer des réclamations d'assurance sans modifier aucun poids du modèle d'origine ?",
      heading: "Ajustement de Prompt (Soft Prompts / Virtual Tokens) dans Tuning Studio",
      body: "Le Prompt Tuning dans watsonx.ai Tuning Studio est une méthode de Parameter-Efficient Tuning (PEFT) : 1. Au lieu de modifier les milliards de poids du modèle de base (coûteux et sujet à l'oubli catastrophique), le Prompt Tuning gèle le modèle à 100% et n'entraîne qu'un petit vecteur de 'tokens virtuels continus' (Soft Prompt) préfixé à l'entrée ; 2. Avantages majeurs : ne nécessite qu'un jeu d'entraînement modeste (quelques centaines d'exemples JSONL/CSV avec colonnes `input` et `output`), prend quelques minutes sur GPU et génère un artefact de quelques mégaoctets déployable instantanément sur le même modèle partagé.",
      m1: { label: "Poids de Base Gelés", value: "Zéro Risque de Dégradation", desc: "Le modèle conserve toutes ses capacités de raisonnement générales." },
      m2: { label: "Soft Prompt Léger", value: "Vecteur de Tokens Virtuels", desc: "Artefact compact de quelques Mo très facile à stocker et versionner." },
      m3: { label: "Dataset Requis", value: "Format JSONL / CSV", desc: "Paires input/output représentatives du vocabulaire métier cible." },
      rules: [
        "1. Règle d'examen : Le Prompt Tuning dans Tuning Studio ne modifie JAMAIS les poids internes du modèle de fondation.",
        "2. Le Prompt Tuning est beaucoup moins consommateur de ressources GPU que le Full Fine-Tuning tout en offrant une précision ciblée équivalente."
      ],
      tag: "TUNING STUDIO & PROMPT TUNING"
    },
    {
      title: "Techniques de Prompt Engineering : Zero-shot, Few-shot et Chain-of-Thought (CoT)",
      lead: "Quand faut-il utiliser la technique 'Chain-of-Thought' (Pensée pas à pas) plutôt que des exemples 'Few-shot' dans watsonx.ai ?",
      heading: "Stratégies d'Optimisation des Instructions pour Tâches de Raisonnement",
      body: "1. Zero-shot Prompting : le modèle reçoit une instruction directe sans aucun exemple préalable ; efficace pour les résumés simples ou la détection de sentiment binaire ; 2. Few-shot Prompting (In-Context Learning) : le prompt intègre 2 à 5 paires d'exemples (Entrée -> Sortie idéale) montrant le style, la terminologie et le format JSON attendu sans modifier les poids ; 3. Chain-of-Thought (CoT) : invite explicite forçant le modèle à décomposer son raisonnement étape par étape ('Réfléchissons pas à pas :') avant de fournir la réponse finale ; indispensable pour les calculs arithmétiques, la logique juridique ou l'analyse financière complexe.",
      m1: { label: "Zero-shot", value: "Instruction Directe Seule", desc: "Test initial rapide pour évaluer la compréhension native du modèle." },
      m2: { label: "Few-shot", value: "2 à 5 Exemples Illustratifs", desc: "Guide le format de sortie et calibre le style de réponse sans ré-entraînement." },
      m3: { label: "Chain-of-Thought", value: "Raisonnement Étape par Étape", desc: "Augmente drastiquement la précision sur les problèmes logiques et mathématiques complexes." },
      rules: [
        "1. Si le modèle échoue sur un calcul de taxe ou un problème de déduction logique : ajouter l'instruction 'Explique ton raisonnement pas à pas avant de conclure'.",
        "2. En Few-shot, veiller à ce que les exemples fournis soient équilibrés pour éviter d'induire un biais de classe dans les réponses."
      ],
      tag: "PROMPT ENGINEERING COT FEW-SHOT"
    },
    {
      title: "Génération de Données Synthétiques avec Synthetic Data Generator dans watsonx.ai",
      lead: "Comment entraîner un modèle de scoring de crédit sans violer le RGPD lorsque les données réelles des clients contiennent des PII hautement confidentielles ?",
      heading: "Création de Datasets Tabulaires et Textuels Synthétiques Respectueux de la Vie Privée",
      body: "Le générateur de données synthétiques (Synthetic Data Generator) intégré à watsonx.ai permet de générer des jeux de données d'apprentissage artificiels : 1. Données Tabulaires Synthétiques : apprend les distributions statistiques, les corrélations multi-colonnes et les dépendances mathématiques d'un dataset réel de référence pour générer des millions de profils clients 100% fictifs (zéro PII réelle) ; 2. Données Textuelles Synthétiques : utilise des modèles de fondation pour générer des variantes paraphrasées de réclamations ou requêtes clients afin d'enrichir un dataset déséquilibré ; 3. Conformité totale avec le RGPD et le secret bancaire.",
      m1: { label: "Zéro PII Réelle", value: "Conformité RGPD Garantie", desc: "Les données peuvent être partagées avec des prestataires externes sans risque juridique." },
      m2: { label: "Préservation des Corrélations", value: "Fidélité Statistique Élevée", desc: "Le modèle synthétique réplique les relations complexes entre variables du monde réel." },
      m3: { label: "Augmentation de Données", value: "Enrichissement Classes Rares", desc: "Génère des milliers d'exemples de cas rares (fraudes, pannes) pour rééquilibrer le dataset." },
      rules: [
        "1. Pour pallier le manque de données ou contourner les restrictions strictes sur les PII : utiliser le Synthetic Data Generator de watsonx.",
        "2. Valider la fidélité statistique et les métriques de confidentialité (évaluation de ré-identification) du dataset synthétique produit."
      ],
      tag: "SYNTHETIC DATA GENERATOR"
    },
    {
      title: "Gestion des Tokens et Fenêtre de Contexte (Context Window Limits)",
      lead: "Que se passe-t-il lorsque le prompt soumis et les documents RAG dépassent la taille maximale de la fenêtre de contexte du modèle ?",
      heading: "Troncature de Contexte et Calcul du Coût en Tokens",
      body: "Chaque modèle de fondation dans watsonx.ai possède une fenêtre de contexte maximale (ex: 4 096, 8 192 ou 32 768 tokens) qui englobe obligatoirement : le System Prompt + le Contexte documentaire + les Exemples Few-shot + la Question + les Nouveaux Tokens à générer (`max_new_tokens`) : 1. En cas de dépassement, l'API renvoie une erreur ou tronque silencieusement les premiers tokens du prompt (perdant l'instruction initiale) ; 2. La tokenisation watsonx découpe les mots en sous-mots (environ 1 token = 0.75 mot en anglais, 0.5 mot en français) ; 3. Pour traiter de longs rapports, il faut découper les documents en chunks ou utiliser un modèle à fenêtre étendue (Granite 8k/32k).",
      m1: { label: "Somme Totale", value: "Prompt + max_new_tokens <= Window", desc: "L'espace restant pour la réponse dépend directement de la taille de l'invite envoyée." },
      m2: { label: "Risque de Troncature", value: "Perte d'Instructions Clés", desc: "Si le prompt est trop long, l'instruction système initiale peut être tronquée." },
      m3: { label: "Tokenisation Multilingue", value: "Tokens Plus Nombreux en FR", desc: "Le français et les langues à accents consomment davantage de tokens par phrase." },
      rules: [
        "1. Toujours vérifier que : Taille du Prompt (tokens) + max_new_tokens <= Capacité maximale du modèle choisi.",
        "2. Si un document fait 50 pages : appliquer une stratégie RAG avec chunking sémantique plutôt que d'injecter le document entier dans le prompt."
      ],
      tag: "TOKENS & FENÊTRE DE CONTEXTE"
    },
    {
      title: "Sauvegarde, Versioning et Partage des Prompts avec la Bibliothèque de Prompts",
      lead: "Comment une équipe de 10 data engineers peut-elle collaborer et réutiliser des templates de prompts standardisés au sein d'un projet watsonx.ai ?",
      heading: "Prompt Templates, Variables Dynamiques et Espaces Collaboratifs",
      body: "watsonx.ai Studio intègre une gestion collaborative des prompts : 1. Sauvegarde en tant que 'Prompt Template' dans le projet avec contrôle de version ; 2. Variables dynamiques : insertion de variables entre accolades (ex: `{input_text}`, `{customer_id}`, `{document_extract}`) permettant au template d'être instancié dynamiquement par des applications via l'API ; 3. Publication dans le catalogue d'entreprise (IBM Knowledge Catalog) pour mise à disposition auprès d'autres équipes sans duplication ; 4. Exportation directe de snippets de code exécutables (Python, cURL, Node.js).",
      m1: { label: "Variables Dynamiques", value: "{variable} dans le Template", desc: "Permet d'injecter des données temps réel à l'exécution de l'API." },
      m2: { label: "Génération de Code", value: "Export Python & cURL", desc: "Fournit le code exact avec headers d'authentification et paramètres d'inférence prêts à l'emploi." },
      m3: { label: "Partage Projet", value: "Collaboration d'Équipe", desc: "Gestion des droits d'accès (Viewer, Editor, Admin) sur les templates de prompts." },
      rules: [
        "1. Pour intégrer un prompt validé dans une application d'entreprise : insérer des variables dynamiques et exporter le snippet Python.",
        "2. Enregistrer les versions de prompts stables dans le projet pour permettre des comparaisons A/B au cours du temps."
      ],
      tag: "PROMPT TEMPLATES & VARIABLES"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'PROMPT LAB MODES FREEFORM STRUCTURED CHAT',
    'IBM GRANITE INDEMNISATION PROPRIÉTÉ INTELLECTUELLE',
    'DÉCODAGE GREEDY DÉTERMINISTE VS SAMPLING',
    'CONTRÔLE SAMPLING TEMPÉRATURE TOP-P TOP-K',
    'REPETITION PENALTY & STOP SEQUENCES',
    'TUNING STUDIO PROMPT TUNING SOFT PROMPTS',
    'PROMPT ENGINEERING ZERO FEW SHOT COT',
    'SYNTHETIC DATA GENERATOR RGPD',
    'GESTION DES TOKENS & FENÊTRE DE CONTEXTE',
    'PROMPT TEMPLATES & VARIABLES DYNAMIQUES'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-c1000177-d1-${String(num).padStart(3, '0')}`,
    category: `C1000-177 • DOMAINE 1 • ${subCategory}`,
    categoryBadgeColor: '#0f62fe',
    levelTag: `C1000-177 • D1 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 30%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[C1000-177 D1-#${num}] ${baseTopic.title} (Question Prompt Studio #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Compétence centrale du Domaine 1 (watsonx.ai Studio & Prompt Engineering) pour la certification IBM watsonx.ai Specialist.`,
    solutionHeading: `${baseTopic.heading} - Standard IBM watsonx.ai Studio`,
    solutionBody: `${baseTopic.body} Le Domaine 1 (30% de l'examen C1000-177) évalue la maîtrise du Prompt Lab (Freeform, Structured, Chat), des modèles Granite (avec garantie IP), du décodage (Greedy vs Sampling), des hyperparamètres, du Prompt Tuning (Tuning Studio) et des techniques de prompt engineering.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé C1000-177 D1 : Dans watsonx.ai, le décodage Greedy est à privilégier pour toutes les tâches d'extraction et de classification exigeant un résultat déterministe, tandis que les modèles Granite offrent une sécurité juridique maximale.`
    ],
    deckName: "IBM watsonx C1000-177 : Domaine 1 - watsonx.ai Studio & Prompt Engineering",
    domainId: 'domain1',
    domainName: "1. watsonx.ai Studio & Prompt Engineering",
    certCode: 'C1000-177',
  };
});
