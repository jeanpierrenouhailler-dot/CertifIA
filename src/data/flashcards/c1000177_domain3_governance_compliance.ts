import { Flashcard } from '../../types';

// IBM watsonx C1000-177 - Domaine 3 : watsonx.governance & Conformité AI Act (100 Flashcards)
// Poids officiel de l'examen IBM Certified Specialist - watsonx.ai : 30%
export const c1000177Domain3Flashcards: Flashcard[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const promptId = `IBMX-D3-${String(num).padStart(3, '0')}`;

  const topics = [
    {
      title: "Les 3 Piliers Fondamentaux de watsonx.governance",
      lead: "Quels sont les trois volets interconnectés de watsonx.governance permettant de passer de l'IA expérimentale à l'IA industrielle responsable ?",
      heading: "Gouvernance du Cycle de Vie, Gestion des Risques et Conformité Réglementaire",
      body: "watsonx.governance s'articule autour de 3 piliers indissociables : 1. Gouvernance du Cycle de Vie (Lifecycle Governance) : orchestre et documente chaque étape depuis l'idéation (Plan), le prototypage (Develop), la validation (Validate), jusqu'au déploiement et monitoring en production (Monitor) ; 2. Gestion des Risques (Risk Management) : identifie les vulnérabilités (biais discriminatoires, hallucinations, dérives) et applique des seuils d'alerte stricts ; 3. Conformité Réglementaire (Compliance) : aligne automatiquement les modèles sur les exigences de l'EU AI Act (systèmes à haut risque), du NIST AI RMF et de la norme ISO 42001.",
      m1: { label: "Cycle de Vie", value: "De la Conception au Retrait", desc: "Assure la traçabilité complète de chaque version de modèle en entreprise." },
      m2: { label: "Gestion des Risques", value: "Seuils & Alertes Automatisées", desc: "Détecte immédiatement les biais, la toxicité et les pertes de précision." },
      m3: { label: "Conformité Réglementaire", value: "EU AI Act & NIST RMF", desc: "Génère les preuves d'audit obligatoires pour les régulateurs européens et mondiaux." },
      rules: [
        "1. watsonx.governance gouverne aussi bien les modèles traditionnels de Machine Learning que les LLMs d'IA Générative.",
        "2. Il peut gouverner des modèles déployés en dehors d'IBM (ex: AWS SageMaker, Azure OpenAI, HuggingFace)."
      ],
      tag: "LES 3 PILIERS WATSONX.GOVERNANCE"
    },
    {
      title: "AI Factsheets : Fiche d'Identité et Capture Automatique des Métadonnées",
      lead: "Comment générer un rapport d'audit exhaustif pour un régulateur sans passer 3 semaines à collecter manuellement les logs des data scientists ?",
      heading: "Enregistrement Continu et Automatisé de la Généalogie des Modèles",
      body: "IBM AI Factsheets agit comme 'l'étiquette nutritionnelle' ou la carte grise officielle de chaque modèle d'IA : 1. Capture automatique sans friction : dès qu'un data scientist entraîne ou ajuste un modèle dans watsonx.ai, Factsheets enregistre les données sources utilisées, les hyperparamètres, les métriques d'évaluation, les commits de code et l'environnement matériel ; 2. Suivi multi-étapes : trace le passage du modèle à travers les environnements de Dev, Test, Staging et Production ; 3. Génération de rapports : exporte en un clic un dossier d'audit PDF ou JSON complet certifiant l'historique pour les comités de conformité.",
      m1: { label: "Capture Automatique", value: "Zéro Saisie Manuelle", desc: "Intercepte les métadonnées lors de la construction et du déploiement du modèle." },
      m2: { label: "Lignage de Données", value: "Version & Provenance", desc: "Prouve formellement quel jeu de données exact a produit les prédictions en direct." },
      m3: { label: "Rapports d'Audit", value: "Exports PDF & JSON en 1 Clic", desc: "Fournit aux auditeurs et juristes une documentation technique irréfutable." },
      rules: [
        "1. Pour garantir la transparence et l'auditabilité exigées par l'EU AI Act : associer chaque modèle à une AI Factsheet.",
        "2. L'AI Factsheet conserve l'historique complet même si le modèle physique sous-jacent est retiré de production."
      ],
      tag: "AI FACTSHEETS & AUDITABILITÉ"
    },
    {
      title: "Surveillance de l'Équité : Disparate Impact et Règle des 80% (Four-Fifths Rule)",
      lead: "Comment watsonx.governance détecte-t-il mathématiquement si un algorithme d'octroi de prêt bancaire discrimine illégalement les femmes ?",
      heading: "Évaluation du Disparate Impact et Détection des Biais Algorithmiques",
      body: "Pour évaluer l'équité (Fairness) avec le moteur OpenScale de watsonx.governance : 1. Définition des groupes : Groupe de référence (Privileged Group, ex: Hommes) vs Groupe surveillé (Unprivileged / Protected Group, ex: Femmes) ; 2. Disparate Impact (Impact Disproportionné) : ratio entre le taux de décisions favorables accordées au groupe surveillé et celui accordé au groupe de référence : $\\text{Disparate Impact} = \\frac{P(\\text{Accord} \\mid \\text{Femme})}{P(\\text{Accord} \\mid \\text{Homme})}$ ; 3. Règle des 80% (Four-fifths rule) : si ce ratio est inférieur à $0.80$ (80%), le modèle est formellement considéré comme biaisé et déclenche une alerte de non-conformité.",
      m1: { label: "Disparate Impact", value: "Ratio de Taux Favorable", desc: "Mesure la parité statistique de décision entre groupes protégés et privilégiés." },
      m2: { label: "Seuil des 80%", value: "Ratio >= 0.80 Requis", desc: "Norme juridique de référence pour écarter toute présomption de discrimination." },
      m3: { label: "Statistical Parity", value: "Écart Absolu de Probabilité", desc: "Métrique complémentaire calculant la différence directe $P(\\text{Fav} \\mid \\text{Prot}) - P(\\text{Fav} \\mid \\text{Réf})$." },
      rules: [
        "1. Un score de Disparate Impact de 1.0 indique une équité parfaite entre les groupes.",
        "2. Si le Disparate Impact descend en dessous de 0.80, watsonx.governance génère une alerte d'infraction réglementaire."
      ],
      tag: "ÉQUITÉ & DISPARATE IMPACT"
    },
    {
      title: "Détection des Dérives en Production : Dérive de Données vs Dérive de Précision",
      lead: "Quelle est la différence entre une dérive de données (Data Drift) et une dérive de précision (Accuracy Drift) dans le monitoring watsonx ?",
      heading: "Identification des Causes de Dégradation Silencieuse des Modèles",
      body: "watsonx.governance surveille deux dimensions critiques de dérive : 1. Dérive de Données (Data / Feature Drift) : survient lorsque les caractéristiques statistiques des requêtes entrantes en production changent par rapport aux données d'apprentissage (ex: suite à une crise économique ou une nouvelle réglementation) ; mesurée sans nécessiter la connaissance de la vérité terrain (Ground Truth) ; 2. Dérive de Précision (Accuracy / Concept Drift) : survient lorsque la relation logique entre les caractéristiques et la cible change, faisant chuter la performance du modèle ; mesurée dès que les retours clients réels (vérité terrain) sont injectés pour feedback.",
      m1: { label: "Data Drift", value: "Écart de Distribution d'Entrée", desc: "Détectable immédiatement dès la première semaine sans attendre les labels réels." },
      m2: { label: "Accuracy Drift", value: "Chute de Précision / ROC AUC", desc: "Mesure la baisse de performance par rapport aux promesses initiales du modèle." },
      m3: { label: "Déclencheur d'Alerte", value: "Seuils Configurables", desc: "Avertit l'équipe MLOps qu'un ré-entraînement sur données récentes est impératif." },
      rules: [
        "1. La dérive de données est le premier signal annonciateur d'une future dégradation de précision.",
        "2. watsonx.governance stocke les transactions de scoring dans une table de payload pour analyser les dérives au fil du temps."
      ],
      tag: "DATA DRIFT VS ACCURACY DRIFT"
    },
    {
      title: "Métriques d'Évaluation des LLMs : ROUGE-1, ROUGE-2, ROUGE-L et BLEU",
      lead: "Comment mesurer objectivement si un modèle watsonx.ai résume fidèlement des contrats légaux sans omettre de clauses critiques ?",
      heading: "Évaluation de la Qualité de Résumé et de Traduction pour Modèles Génératifs",
      body: "watsonx.governance calcule automatiquement les métriques standardisées pour le traitement de texte génératif : 1. ROUGE-1 : mesure le taux de recouvrement des mots individuels (unigrammes) entre le texte généré et le résumé humain de référence ; 2. ROUGE-2 : mesure le recouvrement de paires consécutives de mots (bigrammes), évaluant la cohérence de la syntaxe ; 3. ROUGE-L : mesure la plus longue sous-séquence commune (LCS), reflétant la structure globale de la phrase ; 4. Score BLEU : principalement utilisé pour la traduction automatique en calculant la précision modifiée des n-grammes.",
      m1: { label: "ROUGE-1 & ROUGE-2", value: "Recouvrement Unigrammes & Bigrammes", desc: "Indispensable pour vérifier la présence des concepts clés dans un résumé." },
      m2: { label: "ROUGE-L", value: "Plus Longue Séquence Commune", desc: "Évalue la préservation de l'ordre naturel des idées et arguments." },
      m3: { label: "Score BLEU", value: "Précision de Traduction", desc: "Pénalise les répétitions et les traductions trop courtes via la pénalité de brièveté." },
      rules: [
        "1. Pour évaluer la qualité d'une tâche de résumé textuel (Summarization) : privilégier les métriques ROUGE (1, 2, L).",
        "2. Pour évaluer la qualité d'un modèle de traduction automatique : privilégier le score BLEU."
      ],
      tag: "MÉTRIQUES ROUGE & BLEU"
    },
    {
      title: "Gouvernance de l'IA Générative : Toxicité, Détection de PII et Hate Speech",
      lead: "Comment surveiller et bloquer automatiquement la génération de propos injurieux ou la divulgation de numéros de sécurité sociale par un LLM ?",
      heading: "Garde-Fous et Métriques de Sécurité Opérationnelle pour LLMs",
      body: "Dans watsonx.governance, le monitoring des modèles génératifs inclut des détecteurs spécialisés : 1. Détecteur de Toxicité (Toxicity Detector) : analyse le prompt entrant et la réponse sortante pour quantifier le degré d'insulte, de menace ou de langage haineux (Hate Speech) sur une échelle probabiliste ; 2. Détecteur de PII (Personally Identifiable Information) : identifie et alerte sur la présence de données personnelles sensibles (adresses e-mail, numéros de téléphone, cartes bancaires) pour empêcher la fuite d'informations confidentielles ; 3. Déclenchement de politiques : alerte en direct ou censure du token sortant en cas de dépassement des seuils de tolérance définis.",
      m1: { label: "Détection de Toxicité", value: "Score de Dangerosité 0 à 1", desc: "Alerte si la réponse générée contient des termes hostiles ou agressifs." },
      m2: { label: "Détection PII", value: "Protection Données Personnelles", desc: "Empêche le LLM de divulguer des identifiants confidentiels d'employés ou de clients." },
      m3: { label: "Garde-Fous Automatiques", value: "Blocage en Temps Réel", desc: "Interrompt la transmission de la réponse pour protéger la réputation de l'entreprise." },
      rules: [
        "1. Activer la surveillance de toxicité et de PII sur tout endpoint LLM exposé aux clients grand public.",
        "2. watsonx.governance consigne chaque infraction détectée dans le registre d'audit pour analyse forensic."
      ],
      tag: "TOXICITÉ & DÉTECTION PII"
    },
    {
      title: "Détection des Hallucinations et Mesure de l'Ancrage (Groundedness / Faithfulness)",
      lead: "Comment prouver mathématiquement qu'un modèle watsonx.ai n'a rien inventé et s'est appuyé fidèlement sur les documents fournis en contexte RAG ?",
      heading: "Évaluation de la Fidélité Factuelle et de la Pertinence de Réponse",
      body: "Les hallucinations représentent le risque opérationnel n°1 de l'IA générative. watsonx.governance fournit des métriques spécifiques pour architectures RAG : 1. Score d'Ancrage / Fidélité (Groundedness / Faithfulness) : mesure si chaque affirmation contenue dans la réponse générée peut être déduite logiquement et formellement des documents sources passés en contexte ; 2. Pertinence de Réponse (Answer Relevance) : vérifie que la réponse traite directement la question posée par l'utilisateur sans digression ; 3. Pertinence du Contexte (Context Relevance) : mesure si le moteur de recherche documentaire n'a extrait que des fragments utiles.",
      m1: { label: "Score de Groundedness", value: "Fidélité aux Sources (0-1)", desc: "Prouve que la réponse ne contient aucune affirmation non étayée par le contexte." },
      m2: { label: "Answer Relevance", value: "Alignement avec la Question", desc: "Garantit que le modèle répond précisément à l'attente exprimée par l'utilisateur." },
      m3: { label: "Anti-Hallucination", value: "Audit Continu des Réponses", desc: "Permet de rejeter automatiquement les réponses dont le score d'ancrage est insuffisant." },
      rules: [
        "1. Un score de Groundedness faible indique que le LLM a introduit des affirmations externes non vérifiables (hallucination).",
        "2. Dans un système RAG d'entreprise, fixer un seuil minimal de Groundedness (ex: >= 0.85) pour autoriser l'envoi de la réponse."
      ],
      tag: "GROUNDEDNESS & HALLUCINATIONS"
    },
    {
      title: "Conformité à l'EU AI Act : Catégorisation des Systèmes d'IA à Haut Risque",
      lead: "Quelles exigences obligatoires watsonx.governance permet-il de satisfaire pour un modèle d'IA classé 'Système à Haut Risque' sous l'EU AI Act ?",
      heading: "Alignement Réglementaire Européen pour l'IA à Haut Risque (High-Risk AI)",
      body: "L'EU AI Act impose des contraintes juridiques strictes sous peine d'amendes pouvant atteindre 35 millions d'euros ou 7% du chiffre d'affaires mondial : 1. Systèmes à Haut Risque (High-Risk) : recrutement, évaluation de crédit, santé, justice, gestion des infrastructures critiques ; 2. Exigences couvertes par watsonx.governance : système de gestion des risques continu (Art. 9), gouvernance des données et absence de biais (Art. 10), documentation technique détaillée et fiches Factsheets (Art. 11), journalisation automatique des événements (Art. 12), transparence pour les utilisateurs (Art. 13) et contrôle humain (Human Oversight, Art. 14).",
      m1: { label: "Documentation Art. 11", value: "Factsheets Automatisées", desc: "Fournit la documentation technique complète exigée par la commission européenne." },
      m2: { label: "Journalisation Art. 12", value: "Audit Trail Immuable", desc: "Enregistre automatiquement tous les événements et requêtes de scoring." },
      m3: { label: "Contrôle Humain Art. 14", value: "Workflows de Validation", desc: "Garantit qu'un opérateur humain peut superviser ou annuler une décision algorithmique." },
      rules: [
        "1. Pour tout déploiement d'IA à haut risque en Europe, l'auditabilité et la documentation technique sont des obligations légales.",
        "2. watsonx.governance fournit les tableaux de bord prêts à l'emploi mappés directement sur les articles de l'EU AI Act."
      ],
      tag: "EU AI ACT & HAUT RISQUE"
    },
    {
      title: "Workflows d'Approbation et Séparation des Rôles (Duty Segregation)",
      lead: "Pourquoi le data scientist qui a conçu le modèle ne doit-il JAMAIS avoir le droit de le déployer directement en production selon les standards de gouvernance ?",
      heading: "Séparation Stricte des Pouvoirs : Développeur, Validateur et Approbateur",
      body: "Pour empêcher les fraudes et garantir une revue impartiale, watsonx.governance applique la séparation des tâches (Separation of Duties) via des workflows d'approbation stricts : 1. Rôle Développeur (Data Scientist / AI Engineer) : conçoit le prompt ou entraîne le modèle dans un projet de développement ; ne peut pas promouvoir le modèle en production ; 2. Rôle Validateur de Risques (Model Risk Officer) : évalue les fiches Factsheets, vérifie le Disparate Impact et teste la robustesse ; 3. Rôle Approbateur Décisionnel (Model Approver) : accorde l'autorisation formelle de mise en service après revue des preuves réglementaires.",
      m1: { label: "Separation of Duties", value: "Zéro Déploiement Unilatéral", desc: "Empêche un ingénieur de pousser un modèle non validé en production." },
      m2: { label: "Statuts de Gouvernance", value: "Draft -> Review -> Approved", desc: "Cycle d'approbation officiel avec signature électronique des parties prenantes." },
      m3: { label: "Piste d'Audit Interne", value: "Horodatage des Signatures", desc: "Documente qui a validé la mise en production et à quelle date précise." },
      rules: [
        "1. La séparation des rôles entre développeur et approbateur est un critère d'audit obligatoire pour la conformité SOX et EU AI Act.",
        "2. Un modèle dont le statut est 'In Review' ne peut pas recevoir de trafic de production."
      ],
      tag: "WORKFLOWS D'APPROBATION & RÔLES"
    },
    {
      title: "Explicabilité des Modèles avec SHAP et LIME dans Watson OpenScale",
      lead: "Comment expliquer à un régulateur pourquoi un modèle de Machine Learning a attribué une probabilité de fraude de 92% à une transaction spécifique ?",
      heading: "Attribution Locale des Facteurs de Décision avec SHAP et LIME",
      body: "Watson OpenScale au sein de watsonx.governance fournit des méthodes d'explicabilité transparentes pour chaque transaction : 1. SHAP (SHapley Additive exPlanations) : basé sur la théorie des jeux coopératifs ; attribue à chaque variable une valeur positive ou négative indiquant son impact exact dans la déviation par rapport à la prédiction moyenne ; équitable et mathématiquement rigoureux ; 2. LIME (Local Interpretable Model-agnostic Explanations) : construit un modèle linéaire local simple autour de la transaction inspectée pour expliquer rapidement le raisonnement sans recalculer l'espace global ; 3. Visualisation graphique sous forme de diagramme en cascade (*Waterfall chart*).",
      m1: { label: "Méthode SHAP", value: "Attribution Mathématique Exacte", desc: "Quantifie l'impact marginal de chaque caractéristique sur la décision finale." },
      m2: { label: "Méthode LIME", value: "Modélisation Linéaire Locale", desc: "Explication rapide et agnostique du modèle pour chaque requête unitaire." },
      m3: { label: "Explication Transactionnelle", value: "Au Niveau de l'Utilisateur", desc: "Permet de fournir au client la justification légale exacte du refus de crédit." },
      rules: [
        "1. Pour une explication mathématiquement solide et conforme aux exigences réglementaires : privilégier SHAP.",
        "2. Les explications SHAP et LIME peuvent être générées automatiquement pour chaque transaction suspecte enregistrée dans OpenScale."
      ],
      tag: "EXPLICABILITÉ SHAP & LIME"
    }
  ];

  const baseTopic = topics[index % topics.length];
  const subCategoryList = [
    'LES 3 PILIERS WATSONX.GOVERNANCE',
    'AI FACTSHEETS AUDITABILITÉ AUTOMATISÉE',
    'ÉQUITÉ FAIRNESS DISPARATE IMPACT 80 PERCENT',
    'DATA DRIFT VS ACCURACY DRIFT OPENSCALE',
    'MÉTRIQUES TEXTE ROUGE 1 2 L & BLEU',
    'TOXICITÉ HATE SPEECH & DÉTECTION PII',
    'HALLUCINATIONS GROUNDEDNESS FAITHFULNESS',
    'EU AI ACT SYSTÈMES À HAUT RISQUE ART 9-14',
    'WORKFLOWS APPROBATION SÉPARATION DES RÔLES',
    'EXPLICABILITÉ LOCALE SHAP & LIME'
  ];
  const subCategory = subCategoryList[index % subCategoryList.length];

  return {
    id: `fc-c1000177-d3-${String(num).padStart(3, '0')}`,
    category: `C1000-177 • DOMAINE 3 • ${subCategory}`,
    categoryBadgeColor: '#8a3ffc',
    levelTag: `C1000-177 • D3 ITEM #${num}/100`,
    promptNumber: `PROMPT #${promptId} • POIDS 30%`,
    intervalDays: (num % 5 === 0) ? 14 : (num % 3 === 0) ? 7 : (num % 2 === 0) ? 3 : 1,
    questionTitle: `[C1000-177 D3-#${num}] ${baseTopic.title} (Question Gouvernance & Conformité #${(num % 10) + 1})`,
    questionLead: `${baseTopic.lead} - Cœur d'expertise du Domaine 3 (watsonx.governance & Conformité AI Act) pour l'examen IBM watsonx.ai Specialist.`,
    solutionHeading: `${baseTopic.heading} - Standard IBM watsonx.governance & Réglementation`,
    solutionBody: `${baseTopic.body} Le Domaine 3 (30% de l'examen C1000-177) est primordial. Il couvre les AI Factsheets, le calcul du Disparate Impact (règle des 80%), les dérives de données et d'exactitude, les métriques ROUGE/BLEU, la détection de toxicité/PII, le Groundedness anti-hallucinations, la conformité à l'EU AI Act et l'explicabilité SHAP/LIME.`,
    metrics: [
      baseTopic.m1,
      baseTopic.m2,
      baseTopic.m3,
    ],
    goldenRules: [
      ...baseTopic.rules,
      `3. Règle clé C1000-177 D3 : La gouvernance selon IBM repose sur l'automatisation intégrale de la capture de métadonnées (Factsheets) et la surveillance continue des biais (Disparate Impact >= 0.80) pour garantir la conformité à l'EU AI Act.`
    ],
    deckName: "IBM watsonx C1000-177 : Domaine 3 - watsonx.governance & AI Act",
    domainId: 'domain3',
    domainName: "3. watsonx.governance & Conformité AI Act",
    certCode: 'C1000-177',
  };
});
