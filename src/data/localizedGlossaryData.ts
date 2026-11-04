import { GlossaryEntry, GLOSSARY_ENTRIES, GLOSSARY_CATEGORIES, GlossaryCategory } from './glossaryData';
import { SupportedLanguage } from '../i18n';

export interface LocalizedGlossaryCategory {
  id: GlossaryCategory;
  label: string;
  icon: string;
  description: string;
}

const GLOSSARY_CATEGORIES_EN: LocalizedGlossaryCategory[] = [
  {
    id: 'genai_llm',
    label: 'Generative AI & LLMs',
    icon: 'Sparkles',
    description: 'Transformer architectures, Attention, Fine-tuning (LoRA), generation parameters, and MoE.'
  },
  {
    id: 'rag_search',
    label: 'RAG & Vector Search',
    icon: 'Search',
    description: 'Embeddings, HNSW vector indexing, Hybrid Search, Re-ranking, and Semantic Chunking.'
  },
  {
    id: 'mlops_training',
    label: 'MLOps & Training',
    icon: 'Layers',
    description: 'CI/CD for ML, Feature Stores, Data & Concept Drift, Model Serving, and Monitoring.'
  },
  {
    id: 'governance_ethics',
    label: 'Governance, Ethics & Responsible AI',
    icon: 'ShieldCheck',
    description: 'Fairness, Bias mitigation, Safety guardrails, Watermarking, and EU AI Act compliance.'
  },
  {
    id: 'nlp_vision',
    label: 'NLP, Vision & Multimodal',
    icon: 'Eye',
    description: 'Computer Vision, OCR, Sentiment Analysis, Speech recognition, and Multimodal foundation models.'
  },
  {
    id: 'cloud_services',
    label: 'Cloud AI Managed Services',
    icon: 'Cloud',
    description: 'Azure AI Services, Amazon Bedrock, Google Vertex AI, IBM watsonx, and NVIDIA NIM.'
  }
];

export function getLocalizedGlossaryCategories(lang: SupportedLanguage): LocalizedGlossaryCategory[] {
  return lang === 'en' ? GLOSSARY_CATEGORIES_EN : GLOSSARY_CATEGORIES;
}

export function getLocalizedGlossaryEntries(lang: SupportedLanguage): GlossaryEntry[] {
  if (lang === 'fr') {
    return GLOSSARY_ENTRIES;
  }

  return GLOSSARY_ENTRIES.map((entry) => {
    // English presentation
    const term = entry.englishTerm || entry.term;
    return {
      ...entry,
      term,
      // If English difficulty labels needed:
      difficulty: entry.difficulty === 'Fondamental'
        ? ('Fondamental' as const)
        : entry.difficulty,
    };
  });
}
