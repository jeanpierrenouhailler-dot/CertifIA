import { Certification } from '../types';
import { certificationsData } from './certificationsData';
import { SupportedLanguage } from '../i18n';

interface LocalizedCertInfo {
  targetAudience: string;
  modules: string[];
  domains: {
    name: string;
    description: string;
  }[];
}

const CERTIFICATIONS_EN: Record<string, LocalizedCertInfo> = {
  ai102: {
    targetAudience: "Software Engineers, Data Scientists, Azure Application Developers",
    modules: ['Azure OpenAI', 'Azure AI Search', 'Vector Search', 'Computer Vision', 'Speech AI'],
    domains: [
      {
        name: "1. Plan and manage an Azure AI solution",
        description: "Secure multi-service provisioning, Microsoft Entra ID authentication, cost alerts, and latency monitoring."
      },
      {
        name: "2. Implement Computer Vision solutions",
        description: "Azure AI Vision, Custom Vision Object Detection threshold tuning, Precision/Recall trade-offs, and Document Intelligence."
      },
      {
        name: "3. Implement Natural Language Processing & Speech Solutions",
        description: "Azure AI Language CLU, Sentiment Analysis, Speech-to-Text Custom Acoustic models, and neural translation."
      },
      {
        name: "4. Implement Generative AI, RAG & Azure OpenAI Solutions",
        description: "Azure AI Search hybrid BM25 + vector indexing, semantic chunking, text-embedding-3 models, and GPT-4o integration."
      },
      {
        name: "5. Responsible AI & Security Governance",
        description: "Azure AI Studio content filters, jailbreak mitigation (hate/violence/self-harm thresholds), and access auditing."
      }
    ]
  },
  aifc01: {
    targetAudience: "Project Managers, Tech Leads, Cross-functional Engineers",
    modules: ['GenAI Fundamentals', 'Amazon Bedrock', 'SageMaker JumpStart', 'Security & Responsible AI'],
    domains: [
      {
        name: "1. Fundamentals of AI and Machine Learning",
        description: "Supervised and unsupervised learning concepts, generative models, and workload characteristics."
      },
      {
        name: "2. Fundamentals of Generative AI",
        description: "Foundation models, Transformers, diffusion models, prompt engineering, and hyperparameter tuning."
      },
      {
        name: "3. Applications and Deployment of AWS AI Solutions",
        description: "Amazon Bedrock, SageMaker JumpStart, VPC endpoints, serverless inference, and RAG architectures."
      },
      {
        name: "4. Responsible AI Guidelines & Governance",
        description: "Transparency, fairness, bias detection, data privacy, and regulatory compliance."
      },
      {
        name: "5. Security, Compliance, and Governance of AI Systems",
        description: "IAM policies, KMS encryption, VPC network isolation, AWS PrivateLink, and CloudTrail auditing."
      }
    ]
  },
  gcpmle: {
    targetAudience: "ML Engineers, MLOps Engineers, Data Architects",
    modules: ['Vertex AI Studio', 'Fine-tuning & LoRA', 'Kubeflow Pipelines', 'TF/PyTorch Serving'],
    domains: [
      {
        name: "1. Architecting ML Solutions on Google Cloud",
        description: "Scalable data ingestion with BigQuery, model serving options on GKE/Cloud Run, and latency SLAs."
      },
      {
        name: "2. Data Preparation and Processing Pipelines",
        description: "Feature Store ingestion, TFRecord serialization, Dataflow beam pipelines, and schema validation."
      },
      {
        name: "3. Machine Learning Model Development",
        description: "Custom training on Vertex AI, distributed GPU strategies, Vizier hyperparameter optimization, and Gemini fine-tuning."
      },
      {
        name: "4. MLOps Automation & Orchestration",
        description: "Vertex AI Pipelines (Kubeflow), Model Registry versioning, CI/CD with Cloud Build, and artifact tracking."
      },
      {
        name: "5. ML Solution Monitoring and Optimization",
        description: "Data drift detection, model explainability (Shapley values), continuous evaluation, and cost profiling."
      }
    ]
  },
  c1000177: {
    targetAudience: "Enterprise Architects, AI Developers, Governance Officers",
    modules: ['watsonx.ai Studio', 'Prompt Lab & Granite', 'watsonx.data Lakehouse', 'watsonx.governance'],
    domains: [
      {
        name: "1. Prompt Engineering & watsonx.ai Studio",
        description: "Prompt Lab tuning, IBM Granite foundation models, zero-shot and few-shot calibration."
      },
      {
        name: "2. Data Lakehouse & watsonx.data",
        description: "Apache Iceberg table formats, Presto query engine optimization, and enterprise RAG pipelines."
      },
      {
        name: "3. AI Governance, Risk & Compliance",
        description: "watsonx.governance lineage tracking, bias detection, EU AI Act compliance, and model fact sheets."
      },
      {
        name: "4. API Integration & OpenShift Deployment",
        description: "Red Hat OpenShift containerized serving, REST API endpoints, and hybrid cloud orchestration."
      }
    ]
  },
  ai900: {
    targetAudience: "Business Decision Makers, Cloud Beginners, Product Managers",
    modules: ['AI Workloads', 'Machine Learning Principles', 'Computer Vision Basics', 'Conversational AI'],
    domains: [
      {
        name: "1. Fundamental AI Workloads and Considerations",
        description: "Identification of AI use cases, computer vision, natural language processing, and conversational bots."
      },
      {
        name: "2. Fundamental Principles of Machine Learning on Azure",
        description: "Regression, classification, clustering, and automated machine learning (AutoML) in Azure AI Studio."
      },
      {
        name: "3. Features of Computer Vision Workloads on Azure",
        description: "Image classification, object detection, optical character recognition (OCR), and facial recognition concepts."
      },
      {
        name: "4. Features of Natural Language Processing (NLP) Workloads",
        description: "Key phrase extraction, sentiment analysis, named entity recognition (NER), and language translation."
      },
      {
        name: "5. Generative AI Workloads on Azure",
        description: "Generative AI applications, large language models, and responsible AI principles (Fairness, Reliability, Transparency)."
      }
    ]
  },
  mlsc01: {
    targetAudience: "Data Scientists, Machine Learning Practitioners, Big Data Architects",
    modules: ['SageMaker Studio', 'Data Engineering on AWS', 'Modeling & Algorithms', 'MLOps Deployment'],
    domains: [
      {
        name: "1. Data Engineering for Machine Learning",
        description: "Amazon S3 data lakes, AWS Glue ETL jobs, Amazon Kinesis real-time streaming, and Amazon Athena querying."
      },
      {
        name: "2. Exploratory Data Analysis & Feature Engineering",
        description: "SageMaker Data Wrangler, missing value imputation, one-hot encoding, and PCA dimensionality reduction."
      },
      {
        name: "3. Machine Learning Modeling",
        description: "Built-in SageMaker algorithms (XGBoost, Linear Learner, DeepAR), hyperparameter optimization, and loss metrics."
      },
      {
        name: "4. Machine Learning Implementation and Operations",
        description: "Real-time SageMaker endpoints, multi-model endpoints, A/B testing deployments, and Model Monitor for drift."
      }
    ]
  }
};

/**
 * Returns certifications data localized to the active language.
 */
export function getLocalizedCertifications(lang: SupportedLanguage): Certification[] {
  if (lang === 'fr') {
    return certificationsData;
  }

  return certificationsData.map((cert) => {
    const enInfo = CERTIFICATIONS_EN[cert.id];
    if (!enInfo) {
      return cert;
    }

    return {
      ...cert,
      targetAudience: enInfo.targetAudience,
      modules: enInfo.modules,
      domains: cert.domains.map((dom, index) => {
        const enDomain = enInfo.domains[index];
        if (!enDomain) return dom;
        return {
          ...dom,
          name: enDomain.name,
          description: enDomain.description,
        };
      }),
    };
  });
}
