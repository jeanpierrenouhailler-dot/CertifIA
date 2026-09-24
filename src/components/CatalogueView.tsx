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
  CheckCircle2
} from 'lucide-react';
import { Certification, CloudProvider, CertificationLevel, AppScreen } from '../types';
import { certificationsData } from '../data/certificationsData';

interface CatalogueViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint: (certId: string) => void;
  initialProviderFilter?: CloudProvider;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  onNavigate,
  onOpenBlueprint,
  initialProviderFilter = 'Tous',
}) => {
  const [providerFilter, setProviderFilter] = useState<CloudProvider>(initialProviderFilter);
  const [levelFilter, setLevelFilter] = useState<CertificationLevel>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'progress' | 'duration'>('recommended');
  const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);

  const providerCounts = {
    Tous: certificationsData.length,
    azure: certificationsData.filter((c) => c.provider === 'azure').length,
    aws: certificationsData.filter((c) => c.provider === 'aws').length,
    gcp: certificationsData.filter((c) => c.provider === 'gcp').length,
    ibm: certificationsData.filter((c) => c.provider === 'ibm').length,
    nvidia: 2,
  };

  const filteredCertifications = certificationsData
    .filter((c) => {
      if (providerFilter !== 'Tous' && c.provider !== providerFilter) return false;
      if (levelFilter !== 'all' && c.level !== levelFilter) return false;
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1c1f2a]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Référentiel 2025 • Alignement Blueprint V3.4
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-headline tracking-tight">
            Catalogue des Certifications IA
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Parcours certifiants Cloud AI, pondérations officielles d'examen et plans de révision cognitive adaptés aux architectes.
          </p>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] text-center min-w-[100px]">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Disponibles</div>
            <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">18 Examens</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] text-center min-w-[100px]">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Questions Pool</div>
            <div className="text-base sm:text-lg font-bold font-mono text-blue-400 mt-0.5">2,450+</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] text-center min-w-[100px]">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Score Cible</div>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-0.5">700 / 1000</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-4">
        {/* Provider Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setProviderFilter('Tous')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              providerFilter === 'Tous'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-[#171b26] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            Tous ({providerCounts.Tous})
          </button>
          <button
            onClick={() => setProviderFilter('azure')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              providerFilter === 'azure'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-[#171b26] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            Microsoft Azure ({providerCounts.azure})
          </button>
          <button
            onClick={() => setProviderFilter('aws')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              providerFilter === 'aws'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-[#171b26] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            AWS ({providerCounts.aws})
          </button>
          <button
            onClick={() => setProviderFilter('gcp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              providerFilter === 'gcp'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-[#171b26] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            Google Cloud ({providerCounts.gcp})
          </button>
          <button
            onClick={() => setProviderFilter('ibm')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              providerFilter === 'ibm'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-[#171b26] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            IBM watsonx ({providerCounts.ibm})
          </button>
          <button
            onClick={() => setProviderFilter('nvidia')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              providerFilter === 'nvidia'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-[#171b26] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            NVIDIA ({providerCounts.nvidia})
          </button>
        </div>

        {/* Search, Level and Sort row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 bg-[#171b26]/60 border border-[#262a35] rounded-2xl">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrer par module (ex: RAG)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0f131d] border border-[#262a35] rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Level selection */}
            <div className="flex items-center gap-1 bg-[#0f131d] p-1 rounded-xl border border-[#262a35]">
              {(['all', 'fondamental', 'associate', 'expert'] as CertificationLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors ${
                    levelFilter === lvl
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl === 'all' ? 'Tous niveaux' : lvl}
                </button>
              ))}
            </div>

            {/* Sort selection */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Trier les certifications"
                className="bg-[#0f131d] border border-[#262a35] text-slate-300 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="recommended">Recommandé (Actif)</option>
                <option value="progress">Maîtrise Décroissante</option>
                <option value="duration">Durée de l'Épreuve</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertifications.map((cert) => {
          const isTarget = cert.isActiveTarget;
          return (
            <div
              key={cert.id}
              className={`relative rounded-2xl bg-gradient-to-b from-[#171b26] to-[#121520] border transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-blue-500/5 ${
                isTarget
                  ? 'border-blue-500/40 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/10'
                  : 'border-[#262a35] hover:border-[#3a4050]'
              }`}
            >
              {/* Card Top Banner if Active Target */}
              {isTarget && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500 text-white uppercase tracking-wider shadow-md shadow-blue-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                  Objectif Actif • J-6
                </div>
              )}

              <div className="p-6">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      {cert.code}
                    </span>
                    <span className="text-[11px] font-medium text-slate-300">
                      {cert.providerName}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#262a35] text-slate-300">
                    {cert.levelLabel}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white font-headline group-hover:text-blue-200 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {cert.targetAudience}
                </p>

                {/* Progress bar */}
                <div className="mt-5 p-3 rounded-xl bg-[#0f131d]/90 border border-[#262a35]/60">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-mono text-[11px]">Préparation estimée</span>
                    <span className="font-mono font-bold text-emerald-400">{cert.progressLabel}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#171b26] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-blue-500 to-emerald-400"
                      style={{ width: `${cert.userProgress}%` }}
                    />
                  </div>
                </div>

                {/* Specs Strip */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="p-2 rounded-lg bg-[#0f131d]/60 border border-[#262a35]/50">
                    <div className="text-[9px] font-mono text-slate-300">Durée</div>
                    <div className="text-xs font-mono font-semibold text-slate-200 mt-0.5">{cert.durationMinutes} min</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0f131d]/60 border border-[#262a35]/50">
                    <div className="text-[9px] font-mono text-slate-300">Format</div>
                    <div className="text-xs font-mono font-semibold text-slate-200 mt-0.5">{cert.itemsCount} QCM</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0f131d]/60 border border-[#262a35]/50">
                    <div className="text-[9px] font-mono text-slate-300">Succès</div>
                    <div className="text-xs font-mono font-semibold text-emerald-400 mt-0.5">{cert.avgPassRate}%</div>
                  </div>
                </div>

                {/* Module Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cert.modules.map((mod, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#262a35]/60 text-slate-300 border border-[#313540]/60"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 border-t border-[#262a35] bg-[#0f131d]/60 rounded-b-2xl flex items-center gap-2">
                <button
                  onClick={() => {
                    if (cert.id === 'aifc01') {
                      onNavigate('exam');
                    } else {
                      onNavigate('quiz');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20 active:scale-95"
                >
                  <span>{cert.userProgress > 0 ? "Reprendre l'entraînement" : "Commencer l'entraînement"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Blueprint slide-over trigger */}
                <button
                  onClick={() => onOpenBlueprint(cert.id)}
                  className="p-2 rounded-xl bg-[#171b26] text-slate-300 hover:text-white hover:bg-[#262a35] border border-[#262a35] transition-colors"
                  title="Voir le Blueprint d'examen"
                  aria-label="Voir le Blueprint d'examen"
                >
                  <Network className="w-4 h-4 text-blue-400" />
                </button>

                {/* Official Doc link */}
                <a
                  href={cert.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-[#171b26] text-slate-300 hover:text-white hover:bg-[#262a35] border border-[#262a35] transition-colors"
                  title="Documentation officielle"
                  aria-label="Documentation officielle"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise Cohort Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#171b26] to-[#121520] border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
              CertifAI Enterprise Portal
            </div>
            <h3 className="text-base font-bold text-white font-headline">
              Déploiement d'Entreprise & Cohortes d'Équipe
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Configurez un parcours d'entraînement unifié pour vos équipes Cloud & IA avec tableau de bord de suivi RH, benchmarks d'équipe et bons d'examens Pearson VUE centralisés.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCohortModalOpen(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/25 whitespace-nowrap"
        >
          Configurer une cohorte d'équipe
        </button>
      </div>

      {/* Cohort Modal */}
      {isCohortModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-[#171b26] border border-[#262a35] rounded-2xl shadow-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cohorte d'Équipe Active</h3>
                <p className="text-xs text-slate-400">Organisation : Cloud Engineering EMEA</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Votre cohorte <span className="text-blue-400 font-mono font-semibold">"Azure AI-102 Q1 Batch"</span> rassemble 14 collaborateurs. 11 membres ont déjà validé l'étape de recherche hybride.
            </p>
            <div className="p-3 rounded-xl bg-[#0f131d] border border-[#262a35] space-y-2 mb-5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Taux d'avancement collectif</span>
                <span className="font-mono text-emerald-400 font-semibold">68.5%</span>
              </div>
              <div className="w-full h-1.5 bg-[#171b26] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '68.5%' }} />
              </div>
            </div>
            <button
              onClick={() => setIsCohortModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all"
            >
              Fermer le statut
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
