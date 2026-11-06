import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  BookOpen, 
  Brain, 
  Sparkles,
  PieChart,
  ChevronDown,
  ChevronUp,
  Search,
  Filter
} from 'lucide-react';
import { 
  ai102DomainsMeta, 
  ai900DomainsMeta, 
  aifc01DomainsMeta, 
  mlsc01DomainsMeta, 
  gcpmleDomainsMeta, 
  c1000177DomainsMeta 
} from '../data/flashcardsData';

export type FlashcardCertId = 'c1000177' | 'gcpmle' | 'aifc01' | 'mlsc01' | 'ai900' | 'ai102';

interface FlashcardsDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCert: (certId: FlashcardCertId) => void;
}

import { useTranslation, getCurrentLanguage } from '../i18n';

export interface CertDistributionInfo {
  id: FlashcardCertId;
  code: string;
  title: string;
  provider: 'Microsoft Azure' | 'Amazon Web Services' | 'Google Cloud' | 'IBM';
  providerBadge: string;
  providerColor: string;
  totalCards: number;
  domainsCount: number;
  level: string;
  domains: typeof ai102DomainsMeta;
  description: string;
}

export function getLocalizedCertsDistribution(lang: 'fr' | 'en'): CertDistributionInfo[] {
  const isEn = lang === 'en';
  return [
    {
      id: 'ai102',
      code: 'AI-102',
      title: 'Azure AI Engineer Associate',
      provider: 'Microsoft Azure',
      providerBadge: 'Azure',
      providerColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      totalCards: 500,
      domainsCount: 5,
      level: isEn ? 'Associate • Advanced' : 'Associate • Avancé',
      domains: ai102DomainsMeta.filter(d => d.id !== 'all'),
      description: isEn
        ? "Design and deployment of end-to-end multimodal AI solutions on Azure (Vision 4.0, NLP, Speech, Azure OpenAI GPT-4o, BM25+HNSW RAG, and Content Safety)."
        : "Conception et déploiement de solutions d'IA multimodales complètes sur Azure (Vision 4.0, NLP, Speech, Azure OpenAI GPT-4o, RAG BM25+HNSW et Content Safety)."
    },
    {
      id: 'ai900',
      code: 'AI-900',
      title: 'Azure AI Fundamentals',
      provider: 'Microsoft Azure',
      providerBadge: 'Azure',
      providerColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      totalCards: 500,
      domainsCount: 5,
      level: isEn ? 'Foundational • Beginner' : 'Foundational • Débutant',
      domains: ai900DomainsMeta.filter(d => d.id !== 'all'),
      description: isEn
        ? "Fundamental concepts of artificial intelligence, visual Machine Learning, computer vision workloads, natural language processing, and Microsoft responsible AI ethics."
        : "Principes fondamentaux de l'intelligence artificielle, Machine Learning visuel, charges de vision, traitement du langage naturel et éthique responsable Microsoft."
    },
    {
      id: 'aifc01',
      code: 'AIF-C01',
      title: 'AWS Certified AI Practitioner',
      provider: 'Amazon Web Services',
      providerBadge: 'AWS',
      providerColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      totalCards: 500,
      domainsCount: 5,
      level: isEn ? 'Foundational • Intermediate' : 'Foundational • Intermédiaire',
      domains: aifc01DomainsMeta.filter(d => d.id !== 'all'),
      description: isEn
        ? "Practical mastery of generative AI on AWS, Amazon Bedrock ecosystem (Claude, Titan, Llama), RAG Knowledge Bases, Agents, and SageMaker Clarify ethical governance."
        : "Maîtrise pratique de l'IA générative sur AWS, écosystème Amazon Bedrock (Claude, Titan, Llama), Knowledge Bases RAG, Agents et gouvernance éthique SageMaker Clarify."
    },
    {
      id: 'mlsc01',
      code: 'MLS-C01',
      title: 'AWS Machine Learning - Specialty',
      provider: 'Amazon Web Services',
      providerBadge: 'AWS',
      providerColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      totalCards: 400,
      domainsCount: 4,
      level: 'Specialty • Expert',
      domains: mlsc01DomainsMeta.filter(d => d.id !== 'all'),
      description: isEn
        ? "End-to-end ML solution architecture on AWS: S3/Glue ingestion, exploratory data analysis, SageMaker native algorithms, Bayesian hyperparameter tuning, and MLOps pipelines."
        : "Architecture de solutions ML de bout en bout sur AWS : ingestion S3/Glue, analyse exploratoire, algorithmes natifs SageMaker, tuning bayésien et pipelines MLOps."
    },
    {
      id: 'gcpmle',
      code: 'GCP-PMLE',
      title: 'Professional Machine Learning Engineer',
      provider: 'Google Cloud',
      providerBadge: 'Google Cloud',
      providerColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      totalCards: 500,
      domainsCount: 5,
      level: isEn ? 'Professional • Advanced/Expert' : 'Professional • Avancé/Expert',
      domains: gcpmleDomainsMeta.filter(d => d.id !== 'all'),
      description: isEn
        ? "MLOps modeling and orchestration on Vertex AI: tf.Transform, Feature Store, GPU/TPU distribution, Vertex Pipelines (KFP/TFX), and Model Monitoring."
        : "Modélisation et orchestration MLOps sur Vertex AI : tf.Transform, Feature Store, distribution GPU/TPU, Vertex Pipelines (KFP/TFX) et Model Monitoring."
    },
    {
      id: 'c1000177',
      code: 'C1000-177',
      title: 'IBM watsonx.ai v1.0 Specialist',
      provider: 'IBM',
      providerBadge: 'IBM',
      providerColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      totalCards: 400,
      domainsCount: 4,
      level: isEn ? 'Specialist • Advanced' : 'Specialist • Avancé',
      domains: c1000177DomainsMeta.filter(d => d.id !== 'all'),
      description: isEn
        ? "IBM watsonx enterprise platform: Prompt Lab, Granite models, watsonx.data open lakehouse (Iceberg, Milvus), AI Factsheets governance, and OpenShift deployment."
        : "Plateforme watsonx d'IBM pour l'entreprise : Prompt Lab, modèles Granite, lakehouse watsonx.data (Iceberg, Milvus), gouvernance AI Factsheets et déploiement OpenShift."
    }
  ];
}

export const certsDistributionList: CertDistributionInfo[] = getLocalizedCertsDistribution('fr');

export const FlashcardsDistributionModal: React.FC<FlashcardsDistributionModalProps> = ({
  isOpen,
  onClose,
  onSelectCert
}) => {
  const { t } = useTranslation(['flashcards', 'common']);
  const lang = getCurrentLanguage();
  const certsList = React.useMemo(() => getLocalizedCertsDistribution(lang), [lang]);

  const [providerFilter, setProviderFilter] = useState<'All' | 'Microsoft Azure' | 'Amazon Web Services' | 'Google Cloud' | 'IBM'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCertId, setExpandedCertId] = useState<FlashcardCertId | null>('ai102');

  if (!isOpen) return null;

  const totalCardsCount = certsList.reduce((acc, curr) => acc + curr.totalCards, 0);
  const totalDomainsCount = certsList.reduce((acc, curr) => acc + curr.domainsCount, 0);

  const filteredCerts = certsList.filter(cert => {
    const matchesProvider = providerFilter === 'All' || cert.provider === providerFilter;
    const matchesQuery = 
      cert.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvider && matchesQuery;
  });

  const handleOpenStudy = (certId: FlashcardCertId) => {
    onSelectCert(certId);
    onClose();
  };

  const isEn = lang === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#0c101b] rounded-3xl border border-slate-200 dark:border-[#262a35] shadow-2xl flex flex-col z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-[#1c1f2a] bg-gradient-to-r from-slate-50 via-blue-50/20 to-slate-50 dark:from-[#0a0e18] dark:via-blue-950/20 dark:to-[#0a0e18] flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t('flashcards:distribution.title')}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    2 800 {t('flashcards:distribution.cards')}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('flashcards:distribution.subtitle')}
                </p>
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex items-center gap-2 pt-2 flex-wrap text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-semibold">
                🔢 {totalCardsCount} {t('flashcards:distribution.totalCards')}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-semibold">
                📁 {totalDomainsCount} {t('flashcards:distribution.examDomains')}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-semibold">
                🎓 6 {t('flashcards:distribution.keyCerts')}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-semibold">
                🧠 {t('flashcards:distribution.srsAlgorithm')}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1c2233] transition-colors shrink-0"
            aria-label={t('common:actions.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#1c1f2a] bg-white dark:bg-[#0c101b] flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Provider Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
            {(['All', 'Microsoft Azure', 'Amazon Web Services', 'Google Cloud', 'IBM'] as const).map(p => {
              const label = p === 'All' 
                ? (isEn ? 'All (2,800)' : 'Tous (2 800)') 
                : p === 'Microsoft Azure' ? 'Azure (1 000)' 
                : p === 'Amazon Web Services' ? 'AWS (900)' 
                : p === 'Google Cloud' ? 'GCP (500)' 
                : 'IBM (400)';
              return (
                <button
                  key={p}
                  onClick={() => setProviderFilter(p)}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap font-medium transition-all ${
                    providerFilter === p
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-[#131722] border-slate-200 dark:border-[#262a35] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c2233]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('flashcards:distribution.searchPlaceholder')}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Scrollable Certifications Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredCerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Layers className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
              <div className="text-sm font-semibold">{t('flashcards:distribution.emptyTitle')}</div>
              <div className="text-xs">{t('flashcards:distribution.emptySubtitle')}</div>
            </div>
          ) : (
            filteredCerts.map((cert) => {
              const isExpanded = expandedCertId === cert.id;

              return (
                <div
                  key={cert.id}
                  className="rounded-2xl border border-slate-200 dark:border-[#262a35] bg-slate-50/60 dark:bg-[#111522] overflow-hidden transition-all hover:border-blue-500/40"
                >
                  {/* Card Header & Summary */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${cert.providerColor}`}>
                          {cert.code}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {cert.title}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          ({cert.provider})
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {cert.description}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                          <Layers className="w-3.5 h-3.5 text-blue-500" />
                          {cert.totalCards} {t('flashcards:distribution.cards')}
                        </span>
                        <span>•</span>
                        <span>{cert.domainsCount} {t('flashcards:distribution.examDomains').toLowerCase()}</span>
                        <span>•</span>
                        <span>100 {t('flashcards:distribution.cardsPerSubdomain')}</span>
                        <span>•</span>
                        <span className="text-blue-600 dark:text-blue-400">{cert.level}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:self-center shrink-0">
                      <button
                        onClick={() => setExpandedCertId(isExpanded ? null : cert.id)}
                        className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#171b26] hover:bg-slate-100 dark:hover:bg-[#1f2535] text-xs font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                      >
                        <span>{t('flashcards:distribution.examDomains')} ({cert.domainsCount})</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenStudy(cert.id)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 active:scale-95"
                      >
                        <span>{t('flashcards:distribution.reviewCert')} ({cert.totalCards})</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Domain Breakdown Table */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#0c101b] space-y-3">
                      <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>{t('flashcards:distribution.breakdownByDomain', { count: cert.totalCards })}</span>
                        <span className="text-blue-600 dark:text-blue-400">100 {t('flashcards:distribution.cardsPerSubdomain')}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {cert.domains.map((domain) => (
                          <div
                            key={domain.id}
                            className="p-3 rounded-xl border border-slate-200 dark:border-[#1e2330] bg-slate-50 dark:bg-[#131722] space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                                {domain.name}
                              </span>
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shrink-0 border border-blue-500/20">
                                {domain.count} {t('flashcards:distribution.cards')} ({domain.weight})
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                              {domain.description}
                            </p>

                            <div className="w-full bg-slate-200 dark:bg-[#202636] h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: '100%' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-[#1c1f2a] bg-slate-50 dark:bg-[#080b13] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 dark:text-slate-400 text-center sm:text-left">
            {t('flashcards:distribution.footerNotice')}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#131722] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c2233] font-medium transition-colors"
            >
              {t('common:actions.close')}
            </button>
            <button
              onClick={() => handleOpenStudy('c1000177')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-sm"
            >
              {t('flashcards:distribution.startReview')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
