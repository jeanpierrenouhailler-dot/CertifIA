export interface ExamQuestionDetail {
  number: number;
  domain: string;
  scenario: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctKey: 'A' | 'B' | 'C' | 'D';
}

export const examQuestionsBank: Record<number, ExamQuestionDetail> = {
  28: {
    number: 28,
    domain: "Domaine 3 : Déploiement et applications des solutions d'IA AWS",
    scenario: "Une société de services financiers souhaite intégrer des modèles de fondation (FM) pour assister ses analystes dans la rédaction de synthèses de rapports boursiers. Pour respecter la politique de sécurité interne, le trafic réseau ne doit en aucun cas transiter par l'Internet public et l'accès doit être restreint via un VPC privé AWS. De plus, l'entreprise souhaite tester et interchanger plusieurs modèles de fondation de pointe (comme Anthropic Claude 3.5 Sonnet, Meta Llama 3 et Amazon Titan) au travers d'une API unifiée sans gérer de serveurs sous-jacents.",
    question: "Quel service et architecture AWS répondent rigoureusement à l'ensemble de ces critères de conformité et d'agilité ?",
    options: [
      {
        key: 'A',
        text: "Déployer les modèles open-source sur des instances Amazon EC2 Spot réparties dans plusieurs zones de disponibilité avec passerelle Internet (IGW)."
      },
      {
        key: 'B',
        text: "Utiliser Amazon Bedrock avec des points de terminaison d'un VPC d'interface (Interface VPC Endpoints optimisés par AWS PrivateLink) pour sécuriser le trafic sans passerelle internet."
      },
      {
        key: 'C',
        text: "Entraîner des classifieurs personnalisés sur Amazon Comprehend déployés sur des instances m5.xlarge en mode batch synchrone."
      },
      {
        key: 'D',
        text: "Créer une fonction AWS Lambda sans connectivité VPC qui invoque des endpoints publics tiers via un tunneling mandataire."
      }
    ],
    correctKey: 'B'
  },
  7: {
    number: 7,
    domain: "Domaine 1 : Principes fondamentaux de l'IA et du Machine Learning",
    scenario: "Une plateforme e-commerce souhaite recommander des produits similaires en temps réel à ses visiteurs sans disposer de catégories préétablies, uniquement en analysant les comportements de navigation et les paniers d'achat.",
    question: "Quel type d'apprentissage automatique est le plus approprié pour regrouper ces articles sans étiquettes préalables ?",
    options: [
      { key: 'A', text: "Apprentissage non supervisé (Clustering de type K-Means ou DBSCAN)." },
      { key: 'B', text: "Régression linéaire supervisée sur le chiffre d'affaires." },
      { key: 'C', text: "Apprentissage par renforcement avec fonction de récompense négative." },
      { key: 'D', text: "Classification binaire supervisée avec étiquetage manuel." }
    ],
    correctKey: 'A'
  },
  27: {
    number: 27,
    domain: "Domaine 2 : Principes fondamentaux de l'IA générative",
    scenario: "Un ingénieur IA souhaite contraindre la créativité et la variabilité des réponses d'un LLM pour générer des extractions de données JSON strictes.",
    question: "Quel paramètre d'inférence doit-il ajuster et vers quelle valeur ?",
    options: [
      { key: 'A', text: "Réduire la température (Temperature) proche de 0 (ex: 0.0 ou 0.1) et baisser Top-P." },
      { key: 'B', text: "Augmenter la température à 1.8 et fixer Top-K au maximum." },
      { key: 'C', text: "Augmenter la pénalité de présence (Presence Penalty) à sa valeur maximale." },
      { key: 'D', text: "Doubler le nombre maximal de tokens autorisés (max_tokens)." }
    ],
    correctKey: 'A'
  },
  29: {
    number: 29,
    domain: "Domaine 4 : Directives d'IA responsable et gouvernance de données",
    scenario: "Une compagnie d'assurance utilise un modèle de scoring de crédit automatisé. Lors de l'audit réglementaire, l'autorité exige de vérifier qu'aucune discrimination indirecte n'est opérée en fonction du code postal des souscripteurs.",
    question: "Quel concept d'IA responsable décrit le fait qu'une variable non protégée serve de substitut masqué à une caractéristique protégée ?",
    options: [
      { key: 'A', text: "Biais par variable proxy (Proxy Variable Bias)." },
      { key: 'B', text: "Sous-apprentissage (Underfitting)." },
      { key: 'C', text: "Hallucination de contexte sémantique." },
      { key: 'D', text: "Dérive des caractéristiques de distribution (Covariate Shift)." }
    ],
    correctKey: 'A'
  }
};

// Generate the 65 exam items initial state
export function getInitialExamGrid() {
  const items: { number: number; status: 'answered' | 'flagged' | 'unvisited'; selectedOption?: 'A' | 'B' | 'C' | 'D' }[] = [];
  
  for (let i = 1; i <= 65; i++) {
    if (i < 28) {
      if (i === 7 || i === 14 || i === 22) {
        items.push({ number: i, status: 'flagged', selectedOption: 'A' });
      } else {
        items.push({ number: i, status: 'answered', selectedOption: i % 2 === 0 ? 'B' : 'A' });
      }
    } else if (i === 28) {
      items.push({ number: i, status: 'unvisited' });
    } else {
      items.push({ number: i, status: 'unvisited' });
    }
  }
  return items;
}
