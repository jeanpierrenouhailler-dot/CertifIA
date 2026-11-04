import { ExamQuestionDetail, examQuestionsBank } from './examData';
import { SupportedLanguage } from '../i18n';

const EXAM_QUESTIONS_EN: Record<number, ExamQuestionDetail> = {
  28: {
    number: 28,
    domain: "Domain 3: Applications and Deployment of AWS AI Solutions",
    scenario: "A financial services institution wants to integrate foundation models (FMs) to assist equity analysts in drafting market research summaries. To adhere to internal security policy, network traffic must never traverse the public Internet and access must be strictly restricted via an AWS private VPC. Additionally, the company wants to benchmark and swap between multiple leading foundation models (such as Anthropic Claude 3.5 Sonnet, Meta Llama 3, and Amazon Titan) through a unified API without managing backend servers.",
    question: "Which AWS service and architecture rigorously satisfy all compliance and agility criteria?",
    options: [
      {
        key: 'A',
        text: "Deploy open-source models onto Amazon EC2 Spot instances distributed across multiple Availability Zones with an Internet Gateway (IGW)."
      },
      {
        key: 'B',
        text: "Use Amazon Bedrock with Interface VPC Endpoints powered by AWS PrivateLink to secure network traffic without an Internet gateway."
      },
      {
        key: 'C',
        text: "Train custom classifiers using Amazon Comprehend hosted on m5.xlarge instances in synchronous batch mode."
      },
      {
        key: 'D',
        text: "Build an AWS Lambda function without VPC attachment that calls third-party public endpoints through proxy tunneling."
      }
    ],
    correctKey: 'B'
  },
  7: {
    number: 7,
    domain: "Domain 1: Fundamentals of AI and Machine Learning",
    scenario: "An e-commerce platform wants to recommend similar products in real time to shoppers without relying on pre-existing product categories, solely by analyzing live browsing patterns and cart additions.",
    question: "Which type of machine learning is most suitable to cluster these items without prior labels?",
    options: [
      { key: 'A', text: "Unsupervised learning (K-Means or DBSCAN clustering)." },
      { key: 'B', text: "Supervised linear regression on revenue figures." },
      { key: 'C', text: "Reinforcement learning with negative reward functions." },
      { key: 'D', text: "Supervised binary classification with manual tagging." }
    ],
    correctKey: 'A'
  },
  27: {
    number: 27,
    domain: "Domain 2: Fundamentals of Generative AI",
    scenario: "An AI engineer wants to constrain the creativity and response variance of an LLM to reliably extract strict, deterministic JSON data.",
    question: "Which inference hyperparameter should they adjust and to what value?",
    options: [
      { key: 'A', text: "Lower Temperature close to 0 (e.g. 0.0 or 0.1) and decrease Top-P." },
      { key: 'B', text: "Increase Temperature to 1.8 and maximize Top-K." },
      { key: 'C', text: "Increase Presence Penalty to its maximum value." },
      { key: 'D', text: "Double the maximum allowed token parameter (max_tokens)." }
    ],
    correctKey: 'A'
  },
  29: {
    number: 29,
    domain: "Domain 4: Responsible AI Guidelines & Data Governance",
    scenario: "An insurance company uses an automated credit scoring model. During an independent regulatory compliance audit, auditors require verification that no indirect discrimination occurs based on policyholders' postal zip codes.",
    question: "Which Responsible AI concept describes an unprotected feature acting as an implicit stand-in for a protected attribute?",
    options: [
      { key: 'A', text: "Proxy Variable Bias." },
      { key: 'B', text: "Model Underfitting." },
      { key: 'C', text: "Semantic Context Hallucination." },
      { key: 'D', text: "Covariate Shift." }
    ],
    correctKey: 'A'
  }
};

export function getLocalizedExamQuestionsBank(lang: SupportedLanguage): Record<number, ExamQuestionDetail> {
  return lang === 'en' ? EXAM_QUESTIONS_EN : examQuestionsBank;
}
