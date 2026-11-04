import { QuizQuestion } from '../types';
import { quizQuestionsData } from './quizData';
import { SupportedLanguage } from '../i18n';

const QUIZ_QUESTIONS_EN: QuizQuestion[] = [
  {
    id: 'q1',
    code: 'Q-7102',
    type: 'Single Choice Question (SCQ)',
    points: 30,
    scenario: "Your organization wants to deploy an Azure OpenAI foundation model for a highly secure internal enterprise application. Corporate data must never traverse the public Internet, and network access must be strictly restricted to the company's Virtual Network (VNet).",
    question: "Which network and security configuration strictly satisfies this requirement with minimal maintenance overhead?",
    architectureBadge: {
      title: "Network Architecture",
      subtitle: "Private VNet -> Private Endpoint -> Azure OpenAI",
    },
    options: [
      {
        key: 'A',
        text: "Create an Azure Private Endpoint (Private Link) for the Azure OpenAI resource and disable public network access.",
        subtext: "Recommended for strict RFC 1918 network isolation without public internet traversal."
      },
      {
        key: 'B',
        text: "Deploy an Azure Application Gateway with WAF inspection rules running in detection mode only.",
        subtext: "Leaves the Azure OpenAI endpoint reachable over its public FQDN."
      },
      {
        key: 'C',
        text: "Configure Service Tags inside Network Security Groups (NSGs) without disabling the public IP address of the resource.",
        subtext: "Does not allocate a dedicated private IP inside the local subnet."
      },
      {
        key: 'D',
        text: "Run a reverse SSH tunnel on a self-managed Linux virtual machine acting as an unmanaged reverse proxy.",
        subtext: "Introduces a single point of failure (SPOF) and heavy operational burden."
      }
    ],
    correctKey: 'A',
    explanation: {
      mainReason: "Using Azure Private Endpoint projects the Azure OpenAI resource directly into the customer's VNet subnet with a private RFC 1918 IP. By setting 'Public network access: Disabled', all traffic remains strictly confined to Microsoft's private global backbone.",
      highlights: [
        {
          title: "Zero-Trust Network Isolation",
          desc: "Prevents data exfiltration and blocks unauthorized access attempts originating from outside the virtual network.",
          icon: "security"
        },
        {
          title: "Private DNS Integration",
          desc: "The 'privatelink.openai.azure.com' private DNS zone automatically resolves the canonical hostname to the internal IP.",
          icon: "dns"
        }
      ],
      traps: [
        { key: 'B', reason: "Application Gateway in detection mode does not block traffic and fails to isolate the target API from the public web." },
        { key: 'C', reason: "Service Tags filter inbound traffic, but the resource still exposes a publicly routable IP address." },
        { key: 'D', reason: "Cloud architecture anti-pattern: high operational overhead and absence of managed high availability." }
      ],
      officialDocTitle: "Securing Azure OpenAI resources with Private Link",
      officialDocSubtitle: "Microsoft Learn • Azure AI Virtual Network Security Guide",
      officialDocUrl: "https://learn.microsoft.com/en-us/azure/ai-services/cognitive-services-virtual-networks"
    }
  },
  {
    id: 'q7',
    code: 'Q-7294',
    type: 'Single Choice Question (SCQ)',
    points: 40,
    scenario: "You are designing a Retrieval-Augmented Generation (RAG) architecture on Azure for a legal corpus containing 450,000 contracts. The solution must support both exact legal terminology (specific article numbers, exact Latin legal citations) and conceptual natural language queries. You need to maximize recall and precision while maintaining an inference latency under 350 ms.",
    question: "Which storage and retrieval strategy should you recommend in full compliance with the Azure AI-102 blueprint?",
    architectureBadge: {
      title: "Validated Architecture",
      subtitle: "Azure Blob -> Hybrid Search (BM25 + text-embedding-3-large) -> Semantic Ranker -> Azure OpenAI",
    },
    options: [
      {
        key: 'A',
        text: "Use Azure AI Search with hybrid retrieval (BM25 keyword search + dense vector embeddings) paired with the Semantic Ranker.",
        subtext: "Reciprocal Rank Fusion (RRF) combines exact keyword precision with dense contextual understanding."
      },
      {
        key: 'B',
        text: "Configure an Azure Cosmos DB for PostgreSQL cluster with pgvector and run brute-force exact k-NN queries without an HNSW index.",
        subtext: "Prohibitive query latency on 450k documents (>1200ms) and inability to capture rare exact lexical keywords."
      },
      {
        key: 'C',
        text: "Deploy a self-hosted Qdrant instance on an Azure IaaS virtual machine with ephemeral disks and a custom CRON synchronization script.",
        subtext: "Violates Azure AI-102 PaaS principles, incurs data loss risks, and requires manual maintenance."
      },
      {
        key: 'D',
        text: "Embed all raw document text directly into the System Prompt of each individual Azure OpenAI gpt-4o API call.",
        subtext: "Catastrophic context window overflow, prohibitive token costs, and unacceptable latency."
      }
    ],
    correctKey: 'A',
    explanation: {
      mainReason: "Hybrid search on Azure AI Search merges traditional BM25 keyword matching (for exact legal citations and article numbers) with dense vector embeddings (for semantic similarity). Results are fused via Reciprocal Rank Fusion (RRF) and re-ranked using the Microsoft Turing L2 Semantic Ranker.",
      highlights: [
        {
          title: "Reciprocal Rank Fusion (RRF)",
          desc: "Mathematically merges lexical and vector scores without requiring arbitrary weight normalization between BM25 and cosine distance.",
          icon: "reorder"
        },
        {
          title: "Semantic Ranker (Turing L2)",
          desc: "Deep reranking model re-evaluates the top 50 retrieved candidate chunks within milliseconds to place the most relevant evidence first.",
          icon: "psychology"
        },
        {
          title: "Native Security Trimming",
          desc: "Automatic document-level filtering enforced via Microsoft Entra ID Access Control Lists (ACLs) during query execution.",
          icon: "verified_user"
        }
      ],
      traps: [
        { key: 'B', reason: "Brute-force k-NN across 450,000 vectors causes latency spikes without an approximate nearest neighbor index (HNSW)." },
        { key: 'C', reason: "The AI-102 exam evaluates managed Azure PaaS services; unmanaged virtual machines violate core exam criteria." },
        { key: 'D', reason: "450,000 contracts far exceed token context limits and would trigger immediate Tokens Per Minute (TPM) throttling." }
      ],
      officialDocTitle: "Hybrid search using vectors and full text in Azure AI Search",
      officialDocSubtitle: "Microsoft Learn • Retrieval-Augmented Generation (RAG) Architecture Guide",
      officialDocUrl: "https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview"
    }
  },
  {
    id: 'q8',
    code: 'Q-7315',
    type: 'Single Choice Question (SCQ)',
    points: 35,
    scenario: "You are training an Azure Custom Vision Object Detection model to inspect manufactured aerospace components for microscopic hairline cracks. Initial validation shows the model detects 98% of true defects, but generates 40% false positives (acceptable parts incorrectly flagged as defective).",
    question: "Which action should you take inside the Custom Vision interface to improve precision while maintaining quality assurance standards?",
    architectureBadge: {
      title: "Model Optimization",
      subtitle: "Custom Vision Object Detection -> Probability Threshold & Precision/Recall Curve",
    },
    options: [
      {
        key: 'A',
        text: "Increase the Probability Threshold slider from 50% to 75% while monitoring the Recall metric.",
        subtext: "Filters out marginal low-confidence bounding boxes and directly reduces false alarms."
      },
      {
        key: 'B',
        text: "Lower the Overlap Threshold (Intersection over Union - IoU) slider down to 10%.",
        subtext: "Would actually increase the number of redundant and poorly aligned bounding boxes."
      },
      {
        key: 'C',
        text: "Delete 50% of the positive training crack images to balance the dataset class ratio.",
        subtext: "Drastically impairs the convolutional neural network's feature generalization capabilities."
      },
      {
        key: 'D',
        text: "Switch the project domain to 'General [compact]' to accelerate edge inference speed.",
        subtext: "Compact domains sacrifice fine-grained accuracy for mobile and microcontroller deployment."
      }
    ],
    correctKey: 'A',
    explanation: {
      mainReason: "The Probability Threshold sets the minimum confidence level required for a predicted bounding box to be reported. When a model exhibits excessive false positives (low precision), raising this threshold requires higher certainty, directly filtering out spurious detections.",
      highlights: [
        {
          title: "Precision / Recall Trade-off",
          desc: "In aerospace QA, recall must stay high to catch defects, but overly low thresholds overwhelm manual inspection review teams.",
          icon: "balance"
        },
        {
          title: "Essential Negative Samples",
          desc: "Supplying negative images (flawless parts without tags) is Microsoft's official best practice to calibrate model discrimination.",
          icon: "photo_library"
        }
      ],
      traps: [
        { key: 'B', reason: "IoU measures overlap with ground truth bounding boxes; lowering IoU permits poorly localized detections." },
        { key: 'C', reason: "Deleting positive training images degrades model learning and accuracy." },
        { key: 'D', reason: "Compact domains are engineered for edge exports (ONNX, TFLite) and suffer noticeable loss in fine-grained precision." }
      ],
      officialDocTitle: "Evaluate and test Custom Vision models",
      officialDocSubtitle: "Microsoft Learn • Azure AI Vision Object Detection Testing",
      officialDocUrl: "https://learn.microsoft.com/en-us/azure/ai-services/custom-vision-service/test-your-model"
    }
  },
  {
    id: 'q9',
    code: 'Q-7342',
    type: 'Single Choice Question (SCQ)',
    points: 35,
    scenario: "A multinational commercial bank must deploy Azure OpenAI Service to automate loan credit memo summaries. Due to stringent PCI-DSS and GDPR Article 9 data confidentiality policies, no Microsoft engineer or automated process may retain prompt or completion data for model training or abuse monitoring.",
    question: "Which official Azure process must you submit to disable prompt and completion logging by Microsoft security teams?",
    architectureBadge: {
      title: "Governance & Compliance",
      subtitle: "Azure AI Studio -> Abuse Monitoring Exemption Request",
    },
    options: [
      {
        key: 'A',
        text: "Submit the official Modified Content Filtering and Abuse Monitoring Exemption form via the Azure compliance portal.",
        subtext: "Formal regulatory approval granted to enterprises meeting strict legal and compliance qualifications."
      },
      {
        key: 'B',
        text: "Set the environment variable 'LOGGING_ENABLED=false' in the local Python SDK client.",
        subtext: "Has no effect on server-side managed Azure OpenAI telemetry or compliance storage."
      },
      {
        key: 'C',
        text: "Create an outbound DNS firewall rule blocking Microsoft's global telemetry domain.",
        subtext: "Would sever critical DNS resolution endpoints required for service communication."
      },
      {
        key: 'D',
        text: "Deploy an open-source model on Azure Container Instances without API credentials.",
        subtext: "Fails to provide the state-of-the-art GPT-4o capabilities mandated by business requirements."
      }
    ],
    correctKey: 'A',
    explanation: {
      mainReason: "By default, Azure OpenAI temporarily stores prompts and completions for up to 30 days to monitor for abuse and safety violations. Highly regulated customers can submit a formal application for an Abuse Monitoring & Content Logging Exemption, disabling data retention completely upon approval.",
      highlights: [
        {
          title: "Zero Data Retention Guarantee",
          desc: "Once approved, no customer prompt or completion text is written to persistent abuse logging storage disks.",
          icon: "shield"
        },
        {
          title: "Financial Regulatory Compliance",
          desc: "Mandatory for banking and financial institutions subject to banking secrecy laws and GDPR Article 9 data rules.",
          icon: "gavel"
        }
      ],
      traps: [
        { key: 'B', reason: "Client-side SDK environment variables do not override managed cloud server-side compliance logging." },
        { key: 'C', reason: "DNS blocking causes connection timeouts and does not alter backend Azure datacenter policies." },
        { key: 'D', reason: "Does not meet the project requirement to leverage certified GPT-4o foundation models." }
      ],
      officialDocTitle: "Data, privacy, and security for Azure OpenAI Service",
      officialDocSubtitle: "Microsoft Learn • Content Filtering & Abuse Monitoring Exemption Process",
      officialDocUrl: "https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy"
    }
  }
];

export function getLocalizedQuizQuestions(lang: SupportedLanguage): QuizQuestion[] {
  return lang === 'en' ? QUIZ_QUESTIONS_EN : quizQuestionsData;
}
