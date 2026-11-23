import type {
  SourceAvailabilityStatus,
  SourcePriorityLevel,
  SourceReference,
  SourceType,
} from '../../types/audit';

export interface SourceCheckResult {
  checkedUrl: string;
  finalUrl?: string;
  statusCode?: number;
  redirectCount?: number;
  availabilityState: SourceAvailabilityStatus;
  lastModified?: string | null;
  etag?: string | null;
  contentType?: string | null;
  checkedAt: string;
  error?: string;
}

const NOW_ISO = new Date().toISOString();

/**
 * Baseline catalog of official vendor documentation references strictly anchored
 * to URLs already present in CertifIA certification/quiz files plus canonical vendor portals.
 * Never invents page excerpts or unverified dates.
 */
export function buildDefaultSourceRegistry(): SourceReference[] {
  const seeds: Array<{
    id: string;
    title: string;
    vendor: string;
    url: string;
    sourceType: SourceType;
    priorityLevel: SourcePriorityLevel;
    notes: string;
  }> = [
    {
      id: 'src-ms-ai102',
      title: 'Microsoft Credentials — Azure AI Engineer Associate (AI-102)',
      vendor: 'microsoft',
      url: 'https://learn.microsoft.com/fr-fr/credentials/certifications/azure-ai-engineer/',
      sourceType: 'official_exam_guide',
      priorityLevel: 1,
      notes: 'Page officielle examen AI-102 et guide de compétences Microsoft Learn.',
    },
    {
      id: 'src-ms-ai900',
      title: 'Microsoft Credentials — Azure AI Fundamentals (AI-900)',
      vendor: 'microsoft',
      url: 'https://learn.microsoft.com/fr-fr/credentials/certifications/azure-ai-fundamentals/',
      sourceType: 'official_exam_guide',
      priorityLevel: 1,
      notes: 'Page officielle examen AI-900 Microsoft Learn.',
    },
    {
      id: 'src-ms-openai-vnet',
      title: 'Microsoft Learn — Azure AI Services Virtual Networks & Private Link',
      vendor: 'microsoft',
      url: 'https://learn.microsoft.com/fr-fr/azure/ai-services/cognitive-services-virtual-networks',
      sourceType: 'official_vendor_doc',
      priorityLevel: 1,
      notes: 'Référence utilisée par Q-7102 (q1) sur Private Endpoints Azure OpenAI.',
    },
    {
      id: 'src-ms-search-hybrid',
      title: 'Microsoft Learn — Hybrid Search (Vectors + BM25) in Azure AI Search',
      vendor: 'microsoft',
      url: 'https://learn.microsoft.com/fr-fr/azure/search/hybrid-search-overview',
      sourceType: 'official_vendor_doc',
      priorityLevel: 1,
      notes: 'Référence utilisée par Q-7294 (q7) sur RRF et Semantic Ranker.',
    },
    {
      id: 'src-ms-custom-vision',
      title: 'Microsoft Learn — Evaluate & Test Custom Vision Models',
      vendor: 'microsoft',
      url: 'https://learn.microsoft.com/fr-fr/azure/ai-services/custom-vision-service/test-your-model',
      sourceType: 'official_vendor_doc',
      priorityLevel: 1,
      notes: 'Référence utilisée par Q-7315 (q8) sur Probability Threshold et IoU.',
    },
    {
      id: 'src-ms-openai-privacy',
      title: 'Microsoft Learn — Data Privacy & Abuse Monitoring for Azure OpenAI',
      vendor: 'microsoft',
      url: 'https://learn.microsoft.com/fr-fr/legal/cognitive-services/openai/data-privacy',
      sourceType: 'official_vendor_doc',
      priorityLevel: 1,
      notes: 'Référence utilisée par Q-7342 (q9) sur les exemptions de journalisation.',
    },
    {
      id: 'src-aws-aifc01',
      title: 'AWS Certification — AWS Certified AI Practitioner (AIF-C01)',
      vendor: 'aws',
      url: 'https://aws.amazon.com/certification/certified-ai-practitioner/',
      sourceType: 'official_exam_guide',
      priorityLevel: 1,
      notes: 'Guide officiel de la certification AWS AIF-C01.',
    },
    {
      id: 'src-aws-mlsc01',
      title: 'AWS Certification — AWS Certified Machine Learning - Specialty (MLS-C01)',
      vendor: 'aws',
      url: 'https://aws.amazon.com/certification/certified-machine-learning-specialty/',
      sourceType: 'official_exam_guide',
      priorityLevel: 1,
      notes: 'Guide officiel de la certification AWS MLS-C01 (suivre annonces de cycle de vie AWS).',
    },
    {
      id: 'src-aws-bedrock-privatelink',
      title: 'AWS Documentation — Amazon Bedrock Security & Interface VPC Endpoints',
      vendor: 'aws',
      url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/security-vpc-endpoints.html',
      sourceType: 'official_vendor_doc',
      priorityLevel: 1,
      notes: 'Documentation officielle AWS Bedrock PrivateLink.',
    },
    {
      id: 'src-gcp-pmle',
      title: 'Google Cloud — Professional Machine Learning Engineer Certification',
      vendor: 'google',
      url: 'https://cloud.google.com/learn/certification/machine-learning-engineer',
      sourceType: 'official_exam_guide',
      priorityLevel: 1,
      notes: 'Guide officiel examen Google Cloud PMLE.',
    },
    {
      id: 'src-gcp-vertex-monitoring',
      title: 'Google Cloud Docs — Vertex AI Model Monitoring Overview',
      vendor: 'google',
      url: 'https://cloud.google.com/vertex-ai/docs/model-monitoring/overview',
      sourceType: 'official_vendor_doc',
      priorityLevel: 1,
      notes: 'Documentation Vertex AI Drift / Skew Detection.',
    },
    {
      id: 'src-ibm-c1000177',
      title: 'IBM Training & Certification — watsonx.ai Technical Essentials / C1000-177',
      vendor: 'ibm',
      url: 'https://www.ibm.com/training/certification',
      sourceType: 'official_exam_guide',
      priorityLevel: 1,
      notes: 'Portail officiel IBM Certification pour C1000-177.',
    },
    {
      id: 'src-ibm-watsonx-docs',
      title: 'IBM Documentation — watsonx.ai & watsonx.governance',
      vendor: 'ibm',
      url: 'https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/welcome-main.html',
      sourceType: 'official_vendor_doc',
      priorityLevel: 1,
      notes: 'Documentation produit IBM watsonx.',
    },
    {
      id: 'src-nvidia-dli',
      title: 'NVIDIA Certification & Deep Learning Institute — TensorRT-LLM / Triton',
      vendor: 'nvidia',
      url: 'https://www.nvidia.com/en-us/training/certification/',
      sourceType: 'official_exam_guide',
      priorityLevel: 2,
      notes: 'Portail certifications NVIDIA et ressources Triton / TensorRT.',
    },
  ];

  return seeds.map((s) => ({
    ...s,
    availabilityStatus: 'unchecked',
    createdAt: NOW_ISO,
    createdBy: 'system-seed',
  }));
}

export function isOfficialPrioritySource(source: SourceReference): boolean {
  return (
    source.priorityLevel <= 3 &&
    source.sourceType !== 'internal_editorial_note'
  );
}

/**
 * Triggers a genuine server-side HTTP check (with SSRF defense) for an official URL.
 */
export async function verifySourceAvailability(
  url: string,
  idToken: string
): Promise<SourceCheckResult> {
  const response = await fetch('/api/audit/check-source', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ url }),
  });

  const data = (await response.json()) as SourceCheckResult;
  if (!response.ok && response.status >= 401 && response.status <= 403) {
    throw new Error(data.error || 'Authentification administrateur requise pour vérifier la source.');
  }
  return data;
}
