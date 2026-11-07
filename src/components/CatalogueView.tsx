import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ExternalLink, 
  Network, 
  ArrowRight, 
  Award, 
  Filter, 
  Users, 
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Scale,
  Bot,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { Certification, CloudProvider, CertificationLevel, AppScreen } from '../types';
import { getLocalizedCertifications } from '../data/localizedCertifications';
import { PageHeader } from './ui/PageHeader';
import { useTranslation, getCurrentLanguage } from '../i18n';

interface CatalogueViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint: (certId: string) => void;
  onOpenComparator?: () => void;
  onOpenAIAssistant?: (certId: string, certCode: string) => void;
  initialProviderFilter?: CloudProvider;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  onNavigate,
  onOpenBlueprint,
  onOpenComparator,
  onOpenAIAssistant,
  initialProviderFilter = 'Tous',
}) => {
  const { t } = useTranslation(['certifications', 'common']);
  const lang = getCurrentLanguage();
  const certs = getLocalizedCertifications(lang);
  const [providerFilter, setProviderFilter] = useState<CloudProvider>(initialProviderFilter);
  const [levelFilter, setLevelFilter] = useState<CertificationLevel>('all');
  const [domainFilter, setDomainFilter] = useState<'all' | 'genai' | 'cloud_ai' | 'ml'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free_eco' | 'standard'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'progress' | 'duration'>('recommended');
  const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);

  const providerCounts = {
    Tous: certs.length,
    azure: certs.filter((c) => c.provider === 'azure').length,
    aws: certs.filter((c) => c.provider === 'aws').length,
    gcp: certs.filter((c) => c.provider === 'gcp').length,
    ibm: certs.filter((c) => c.provider === 'ibm').length,
    nvidia: 2,
  };

  const filteredCertifications = certs
    .filter((c) => {
      if (providerFilter !== 'Tous' && c.provider !== providerFilter) return false;
      if (levelFilter !== 'all' && c.level !== levelFilter) return false;
      
      // Domain filter check
      if (domainFilter === 'genai') {
        const isGenAI = c.title.toLowerCase().includes('generative') || c.title.toLowerCase().includes('genai') || c.modules.some(m => m.toLowerCase().includes('genai') || m.toLowerCase().includes('rag'));
        if (!isGenAI) return false;
      } else if (domainFilter === 'ml') {
        const isML = c.title.toLowerCase().includes('machine learning') || c.code.toLowerCase().includes('mle') || c.code.toLowerCase().includes('mls');
        if (!isML) return false;
      }

      // Price filter check
      if (priceFilter === 'free_eco') {
        if (c.provider !== 'nvidia' && c.level !== 'fondamental') return false;
      }

      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(query);
        const matchesCode = c.code.toLowerCase().includes(query);
        const matchesModule = c.modules.some((m) => m.toLowerCase().includes(query));
        return matchesTitle || matchesCode || matchesModule;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recommended') {
        if (a.isActiveTarget) return -1;
        if (b.isActiveTarget) return 1;
        return b.userProgress - a.userProgress;
      }
      if (sortBy === 'progress') {
        return b.userProgress - a.userProgress;
      }
      if (sortBy === 'duration') {
        return b.durationMinutes - a.durationMinutes;
      }
      return 0;
    });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Standard Page Header */}
      <PageHeader
        title={t('certifications:title')}
        subtitle={t('certifications:subtitle')}
        badge={t('certifications:badgeCount', '18 Certifications 2025')}
        breadcrumbs={[
          { label: t('navigation:items.today.label'), onClick: () => onNavigate('today') },
          { label: t('navigation:categories.certifications.label'), active: true },
          { label: t('navigation:items.catalogue.label'), active: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {onOpenComparator && (
              <button
                onClick={onOpenComparator}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171b26] dark:hover:bg-[#202533] border border-slate-200 dark:border-[#262a35] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Scale className="w-4 h-4 text-amber-500" />
                <span>{t('certifications:compareButton')}</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('recommendation')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('navigation:items.recommendation.label')}</span>
            </button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div data-tour="catalogue-filters" className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] space-y-4 shadow-sm">
        {/* Provider Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-mono text-slate-400 uppercase text-[10px] font-bold mr-1 shrink-0">{t('certifications:filterByProvider')} :</span>
          <button
            onClick={() => setProviderFilter('Tous')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              providerFilter === 'Tous'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-[#202533] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#262c3d]'
            }`}
          >
            {t('certifications:filterAll')} ({providerCounts.Tous})
          </button>
          <button
            onClick={() => setProviderFilter('azure')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              providerFilter === 'azure'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-[#202533] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#262c3d]'
            }`}
          >
            {t('certifications:providers.azure')} ({providerCounts.azure})
          </button>
          <button
            onClick={() => setProviderFilter('aws')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              providerFilter === 'aws'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-[#202533] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#262c3d]'
            }`}
          >
            {t('certifications:providers.aws')} ({providerCounts.aws})
          </button>
          <button
            onClick={() => setProviderFilter('gcp')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              providerFilter === 'gcp'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-[#202533] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#262c3d]'
            }`}
          >
            {t('certifications:providers.gcp')} ({providerCounts.gcp})
          </button>
          <button
            onClick={() => setProviderFilter('ibm')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              providerFilter === 'ibm'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-[#202533] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#262c3d]'
            }`}
          >
            {t('certifications:providers.ibm')} ({providerCounts.ibm})
          </button>
        </div>

        {/* Secondary Filters (Search, Level, Domain, Price, Sort) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#202533]">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('certifications:searchPlaceholder', 'Filtrer par titre, code (AI-102...), module...')}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Level Select */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as CertificationLevel)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">{t('certifications:filters.allLevels', 'Tous niveaux')}</option>
              <option value="fondamental">{t('certifications:filters.fundamental', 'Fondamental')}</option>
              <option value="associate">{t('certifications:filters.associate', 'Associate')}</option>
              <option value="expert">{t('certifications:filters.expert', 'Expert / Pro')}</option>
            </select>

            {/* Domain Select */}
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">{t('certifications:filters.allDomains', 'Tous domaines')}</option>
              <option value="genai">{t('certifications:filters.genai', 'IA Générative & RAG')}</option>
              <option value="ml">{t('certifications:filters.ml', 'Machine Learning & MLOps')}</option>
            </select>

            {/* Price Select */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">{t('certifications:filters.allBudgets', 'Tous budgets')}</option>
              <option value="free_eco">{t('certifications:filters.freeEco', 'Gratuit / Éco')}</option>
              <option value="standard">{t('certifications:filters.standardPrice', 'Standard (~150-200$)')}</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 focus:outline-none font-mono"
            >
              <option value="recommended">{t('certifications:filters.sortRecommended', 'Tri : Recommandé')}</option>
              <option value="progress">{t('certifications:filters.sortProgress', 'Tri : Progression')}</option>
              <option value="duration">{t('certifications:filters.sortDuration', 'Tri : Durée d’examen')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Certification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertifications.map((cert) => (
          <div
            key={cert.id}
            className="rounded-2xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] flex flex-col justify-between hover:border-blue-500/50 transition-all shadow-sm group"
          >
            <div className="p-5 space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {cert.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    {cert.providerName}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-[#202533] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#262a35]">
                  {cert.levelLabel}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {cert.targetAudience}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">{t('certifications:card.progress', 'Progression')}</span>
                  <span className="font-bold text-emerald-500">{cert.userProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-[#10141f] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${cert.userProgress}%` }}
                  />
                </div>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35]">
                  <span className="text-[10px] text-slate-400 font-mono block">{t('certifications:card.duration', 'Durée')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{cert.durationMinutes} min</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35]">
                  <span className="text-[10px] text-slate-400 font-mono block">{t('certifications:card.threshold', 'Seuil')}</span>
                  <span className="font-semibold text-emerald-500 font-mono mt-0.5 block">{cert.passScore} pts</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35]">
                  <span className="text-[10px] text-slate-400 font-mono block">{t('certifications:card.successRate', 'Réussite')}</span>
                  <span className="font-semibold text-blue-500 font-mono mt-0.5 block">{cert.avgPassRate}%</span>
                </div>
              </div>

              {/* Modules list */}
              <div className="flex flex-wrap gap-1">
                {cert.modules.slice(0, 3).map((mod, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#202533] text-slate-600 dark:text-slate-300"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3.5 border-t border-slate-100 dark:border-[#202533] bg-slate-50 dark:bg-[#121622] rounded-b-2xl flex items-center gap-2">
              <button
                onClick={() => {
                  if (cert.id === 'aifc01') {
                    onNavigate('exam');
                  } else {
                    onNavigate('quiz');
                  }
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
              >
                <span>{t('certifications:card.train', 'S’entraîner')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onOpenBlueprint(cert.id)}
                className="p-2 rounded-xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title={t('certifications:card.blueprintTooltip', 'Consulter la Fiche Détaillée & Blueprint')}
              >
                <BookOpen className="w-4 h-4" />
              </button>

              {onOpenAIAssistant && (
                <button
                  onClick={() => onOpenAIAssistant(cert.id, cert.code)}
                  className="p-2 rounded-xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title={t('certifications:card.aiTutorTooltip', 'Ouvrir le Tuteur IA sur cette certification')}
                >
                  <Bot className="w-4 h-4 text-blue-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
