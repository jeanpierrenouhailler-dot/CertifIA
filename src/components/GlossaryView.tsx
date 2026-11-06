import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Cloud, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  ChevronRight, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  X, 
  Cpu, 
  Sliders, 
  Share2, 
  Check, 
  HelpCircle,
  FileText,
  RotateCcw
} from 'lucide-react';
import { AppScreen } from '../types';
import { 
  GlossaryEntry, 
  GlossaryCategory, 
  GlossaryProvider 
} from '../data/glossaryData';
import { 
  getLocalizedGlossaryCategories, 
  getLocalizedGlossaryEntries 
} from '../data/localizedGlossaryData';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage } from '../i18n';
import { InfoTooltip } from './InfoTooltip';

interface GlossaryViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (certId: string) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  onNavigate,
  onOpenBlueprint,
}) => {
  const { t, i18n } = useTranslation(['learning', 'common']);
  const currentLang = (i18n.language === 'en' ? 'en' : 'fr') as SupportedLanguage;
  const glossaryEntries = useMemo(() => getLocalizedGlossaryEntries(currentLang), [currentLang]);
  const glossaryCategories = useMemo(() => getLocalizedGlossaryCategories(currentLang), [currentLang]);

  const [activeTab, setActiveTab] = useState<'glossary' | 'encyclopedia'>('glossary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all');
  const [selectedProvider, setSelectedProvider] = useState<GlossaryProvider | 'all'>('all');
  const [selectedLetter, setSelectedLetter] = useState<string | 'all'>('all');
  const [selectedTargetCert, setSelectedTargetCert] = useState<string>('all');
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string>(() => glossaryEntries[0]?.id || 'rag');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Local storage for bookmarked terms
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('certifia_glossary_bookmarks');
      return saved ? JSON.parse(saved) : ['rag', 'lora', 'drift-detection'];
    } catch {
      return ['rag', 'lora'];
    }
  });

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('certifia_glossary_bookmarks', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const handleCopy = (entry: GlossaryEntry, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `${entry.term} (${entry.acronym || ''})\n\nDéfinition : ${entry.shortDefinition}\n\nPiège d'examen : ${entry.examTrap}`;
    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Alphabet list for quick letter jumping
  const alphabet = useMemo(() => {
    const letters = new Set<string>();
    glossaryEntries.forEach(e => {
      const firstLetter = (e.acronym || e.term).charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstLetter)) letters.add(firstLetter);
    });
    return Array.from(letters).sort();
  }, [glossaryEntries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return glossaryEntries.filter(entry => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTerm = entry.term.toLowerCase().includes(q);
        const matchesAcronym = entry.acronym?.toLowerCase().includes(q);
        const matchesEnglish = entry.englishTerm?.toLowerCase().includes(q);
        const matchesDef = entry.shortDefinition.toLowerCase().includes(q);
        const matchesFull = entry.fullExplanation.toLowerCase().includes(q);
        const matchesTrap = entry.examTrap.toLowerCase().includes(q);
        if (!matchesTerm && !matchesAcronym && !matchesEnglish && !matchesDef && !matchesFull && !matchesTrap) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
        return false;
      }

      // Provider
      if (selectedProvider !== 'all' && !entry.providers.includes(selectedProvider)) {
        return false;
      }

      // Target Cert
      if (selectedTargetCert !== 'all' && !entry.targetCerts.includes(selectedTargetCert)) {
        return false;
      }

      // Letter
      if (selectedLetter !== 'all') {
        const firstLetter = (entry.acronym || entry.term).charAt(0).toUpperCase();
        if (firstLetter !== selectedLetter) return false;
      }

      // Bookmarks only
      if (onlyBookmarks && !bookmarkedIds.includes(entry.id)) {
        return false;
      }

      return true;
    });
  }, [glossaryEntries, searchQuery, selectedCategory, selectedProvider, selectedTargetCert, selectedLetter, onlyBookmarks, bookmarkedIds]);

  // Selected entry for encyclopedia view
  const currentEncyclopediaEntry = useMemo(() => {
    return glossaryEntries.find(e => e.id === selectedEntryId) || filteredEntries[0] || glossaryEntries[0];
  }, [glossaryEntries, selectedEntryId, filteredEntries]);

  const selectAndOpenEncyclopedia = (id: string) => {
    setSelectedEntryId(id);
    setActiveTab('encyclopedia');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProviderBadge = (provider: GlossaryProvider) => {
    switch (provider) {
      case 'azure':
        return <span key="az" className="px-2 py-0.5 text-xs font-medium rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Azure</span>;
      case 'aws':
        return <span key="aws" className="px-2 py-0.5 text-xs font-medium rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">AWS</span>;
      case 'gcp':
        return <span key="gcp" className="px-2 py-0.5 text-xs font-medium rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Google Cloud</span>;
      case 'ibm':
        return <span key="ibm" className="px-2 py-0.5 text-xs font-medium rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">IBM watsonx</span>;
      case 'nvidia':
        return <span key="nv" className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">NVIDIA</span>;
      default:
        return <span key="gen" className="px-2 py-0.5 text-xs font-medium rounded bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">Théorie / Fondamental</span>;
    }
  };

  const getCategoryMeta = (catId: GlossaryCategory) => {
    return glossaryCategories.find(c => c.id === catId) || glossaryCategories[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border border-blue-500/20 p-6 md:p-8 mb-8 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {t('learning:glossary.badgeCrossCloud', 'Référentiel Transversal Multi-Cloud')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t('learning:glossary.badgeCertsCovered', '18 Certifications Couvertes')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {t('learning:glossary.title', "Glossaire & Notions Clés de l'IA")}
              <InfoTooltip 
                title={t('learning:glossary.title', "Glossaire & Notions Clés")}
                content="Référentiel des concepts clés énoncés dans toutes les certifications (Azure, AWS, GCP, IBM, NVIDIA). Contient les définitions rapides A-Z, les pièges d'examen officiels et les fiches architecturales détaillées." 
              />
            </h1>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              {t('learning:glossary.subtitle', "Maîtrisez les concepts, formules mathématiques, métriques et pièges d'examen récurrents.")}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="px-4 py-3 rounded-xl bg-slate-900/60 dark:bg-slate-950/60 border border-slate-700/60 text-center shadow-inner">
              <div className="text-xl sm:text-2xl font-black text-blue-400">{glossaryEntries.length}</div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{t('learning:glossary.keyConcepts', 'Concepts Clés')}</div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-900/60 dark:bg-slate-950/60 border border-slate-700/60 text-center shadow-inner">
              <div className="text-xl sm:text-2xl font-black text-amber-400">100%</div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{t('learning:glossary.trapsIncluded', 'Pièges Inclus')}</div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-900/60 dark:bg-slate-950/60 border border-slate-700/60 text-center shadow-inner">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">{bookmarkedIds.length}</div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{t('learning:glossary.yourBookmarks', 'Vos Favoris')}</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher (Glossaire A-Z vs Encyclopédie) */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-700/40">
          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              activeTab === 'glossary'
                ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-500/30'
                : 'bg-white/10 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('learning:glossary.quickGlossaryTab', 'Glossaire Rapide (A-Z)')}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-white">
              {filteredEntries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('encyclopedia')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              activeTab === 'encyclopedia'
                ? 'bg-indigo-600 text-white shadow-indigo-500/25 ring-2 ring-indigo-500/30'
                : 'bg-white/10 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t('learning:glossary.encyclopediaTab', 'Encyclopédie Approfondie')}</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {t('learning:glossary.detailedArticlesBadge', 'Fiches Détaillées')}
            </span>
          </button>

          <button
            onClick={() => setOnlyBookmarks(!onlyBookmarks)}
            className={`ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              onlyBookmarks
                ? 'bg-amber-500/20 text-amber-500 dark:text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30'
                : 'bg-white/10 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={t('learning:glossary.bookmarksOnlyTitle', 'Afficher uniquement mes termes enregistrés')}
          >
            {onlyBookmarks ? <BookmarkCheck className="w-4 h-4 text-amber-500" /> : <Bookmark className="w-4 h-4" />}
            <span className="hidden sm:inline">{t('learning:glossary.yourBookmarks', 'Vos Favoris')}</span>
            {bookmarkedIds.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-500">
                {bookmarkedIds.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('learning:glossary.searchPlaceholder', "Rechercher un concept, acronyme (RAG, LoRA), formule ou piège d'examen...")}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Selects */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Provider Filter */}
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
            >
              <option value="all">{t('learning:glossary.allProviders', '🌐 Tous Fournisseurs')}</option>
              <option value="azure">🔷 Azure AI (AI-102/900)</option>
              <option value="aws">🟧 AWS AI (AIF-C01/MLS)</option>
              <option value="gcp">🟩 Google Cloud Vertex</option>
              <option value="ibm">🟦 IBM watsonx (C1000-177)</option>
              <option value="nvidia">🟩 NVIDIA AI</option>
              <option value="general">🧠 {t('common:theoryFoundations', 'Théorie & Fondamentaux')}</option>
            </select>

            {/* Target Cert Filter */}
            <select
              value={selectedTargetCert}
              onChange={(e) => setSelectedTargetCert(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
            >
              <option value="all">{t('learning:glossary.allCerts', '🎯 Toutes Certifications')}</option>
              <option value="ai102">Microsoft AI-102</option>
              <option value="ai900">Microsoft AI-900</option>
              <option value="aifc01">AWS AI Practitioner AIF-C01</option>
              <option value="mlsc01">AWS ML Specialty MLS-C01</option>
              <option value="gcpmle">Google Cloud PMLE</option>
              <option value="c1000177">IBM watsonx C1000-177</option>
            </select>

            {/* Reset Filters button */}
            {(selectedCategory !== 'all' || selectedProvider !== 'all' || selectedLetter !== 'all' || selectedTargetCert !== 'all' || searchQuery || onlyBookmarks) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedProvider('all');
                  setSelectedLetter('all');
                  setSelectedTargetCert('all');
                  setSearchQuery('');
                  setOnlyBookmarks(false);
                }}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                title={t('learning:glossary.clearFilters', 'Effacer')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('learning:glossary.clearFilters', 'Effacer')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('common:allCategories', 'Toutes Catégories')} ({glossaryEntries.length})
          </button>
          {glossaryCategories.map(cat => {
            const count = glossaryEntries.filter(e => e.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* A-Z Alphabet Filter Row (Only in Glossary view) */}
        {activeTab === 'glossary' && (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Index :</span>
            <button
              onClick={() => setSelectedLetter('all')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                selectedLetter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Tous
            </button>
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`min-w-6 px-1.5 py-0.5 rounded text-xs font-bold text-center transition-all ${
                  selectedLetter === letter
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MAIN VIEW CONTENT */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Aucun concept trouvé</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
            Aucun terme ne correspond à votre recherche « {searchQuery} » avec les filtres sélectionnés.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedProvider('all');
              setSelectedLetter('all');
              setSelectedTargetCert('all');
              setOnlyBookmarks(false);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-sm"
          >
            Réinitialiser la recherche
          </button>
        </div>
      ) : activeTab === 'glossary' ? (
        /* ======================== TAB 1: GLOSSAIRE A-Z ======================== */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>Affichage de <strong>{filteredEntries.length}</strong> concept(s)</span>
            <span>Cliquez sur une carte pour dérouler ou ouvrir l'encyclopédie</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map(entry => {
              const isExpanded = expandedCardId === entry.id;
              const isBookmarked = bookmarkedIds.includes(entry.id);
              const catMeta = getCategoryMeta(entry.category);

              return (
                <div
                  key={entry.id}
                  className={`group relative rounded-2xl border transition-all duration-200 p-5 cursor-pointer bg-white dark:bg-slate-900/90 hover:shadow-md ${
                    isExpanded 
                      ? 'border-blue-500/50 ring-2 ring-blue-500/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                  onClick={() => setExpandedCardId(isExpanded ? null : entry.id)}
                >
                  {/* Top line with badges and actions */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entry.acronym && (
                        <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {entry.acronym}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {catMeta.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                        entry.difficulty === 'Fondamental' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        entry.difficulty === 'Intermédiaire' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                        entry.difficulty === 'Avancé' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                        'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      }`}>
                        {entry.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleCopy(entry, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={t('learning:glossary.copyDefinitionTooltip', 'Copier la définition')}
                      >
                        {copiedId === entry.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => toggleBookmark(entry.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={isBookmarked ? t('learning:glossary.removeFromBookmarks', 'Retirer des favoris') : t('learning:glossary.addToBookmarks', 'Ajouter aux favoris')}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title & Term */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                    {entry.term}
                  </h3>
                  {entry.englishTerm && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium italic mb-2">
                      EN : {entry.englishTerm}
                    </div>
                  )}

                  {/* Short Definition */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {entry.shortDefinition}
                  </p>

                  {/* Exam Trap Pill (High-Yield Callout) */}
                  <div className="rounded-xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/25 p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                        <strong className="font-semibold text-amber-600 dark:text-amber-300">Piège d'examen : </strong>
                        {entry.examTrap}
                      </div>
                    </div>
                  </div>

                  {/* Providers tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {entry.providers.map(p => getProviderBadge(p))}
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAndOpenEncyclopedia(entry.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      <span>Fiche approfondie</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {isExpanded ? 'Réduire ▲' : 'Déplier ▼'}
                    </span>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Points Clés à Retenir
                        </h4>
                        <ul className="space-y-1">
                          {entry.keyTakeaways.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {entry.formulaOrMetric && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Formule / Règle de Calcul
                          </h4>
                          <div className="p-2.5 rounded-lg font-mono text-xs bg-slate-100 dark:bg-slate-950 text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-800 overflow-x-auto">
                            {entry.formulaOrMetric}
                          </div>
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectAndOpenEncyclopedia(entry.id);
                          }}
                          className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>{t('learning:glossary.openFullArticle', "Ouvrir l'article complet dans l'Encyclopédie")}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ======================== TAB 2: ENCYCLOPÉDIE APPROFONDIE ======================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Quick Article Directory (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-2 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pb-1">
              <span>{t('learning:glossary.encyclopedicArticles', 'Articles Encyclopédiques')}</span>
              <span>{t('learning:glossary.availableCount', '{{count}} dispo', { count: filteredEntries.length })}</span>
            </div>

            <div className="space-y-1.5">
              {filteredEntries.map(entry => {
                const isSelected = entry.id === currentEncyclopediaEntry.id;
                const isBookmarked = bookmarkedIds.includes(entry.id);

                return (
                  <button
                    key={entry.id}
                    onClick={() => {
                      setSelectedEntryId(entry.id);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-sm'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {entry.acronym && (
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            {entry.acronym}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 truncate">
                          {entry.difficulty}
                        </span>
                      </div>
                      <div className="text-sm font-bold truncate">
                        {entry.term}
                      </div>
                    </div>
                    {isBookmarked && (
                      <BookmarkCheck className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Full Deep-Dive Article Reader (8 cols on lg) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            {/* Header / Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {currentEncyclopediaEntry.acronym && (
                    <span className="px-2.5 py-1 rounded-lg font-mono text-xs font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                      {currentEncyclopediaEntry.acronym}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {getCategoryMeta(currentEncyclopediaEntry.category).label}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {currentEncyclopediaEntry.difficulty}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentEncyclopediaEntry.term}
                </h2>
                {currentEncyclopediaEntry.englishTerm && (
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Terminologie internationale : <strong>{currentEncyclopediaEntry.englishTerm}</strong>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(currentEncyclopediaEntry)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {copiedId === currentEncyclopediaEntry.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>{t('learning:glossary.shareAction', 'Partager')}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => toggleBookmark(currentEncyclopediaEntry.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    bookmarkedIds.includes(currentEncyclopediaEntry.id)
                      ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>{bookmarkedIds.includes(currentEncyclopediaEntry.id) ? t('learning:glossary.savedAction', 'Favori') : t('learning:glossary.saveAction', 'Enregistrer')}</span>
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="py-6 space-y-6">
              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-500/20">
                <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  {t('learning:glossary.executiveSummary', 'Résumé Exécutif')}
                </h4>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {currentEncyclopediaEntry.shortDefinition}
                </p>
              </div>

              {/* Full Explanation */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  {t('learning:glossary.architecturePrinciples', 'Fonctionnement & Principes Architecturaux')}
                </h3>
                <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
                  {currentEncyclopediaEntry.fullExplanation}
                </div>
              </div>

              {/* Architecture Diagram (if present) */}
              {currentEncyclopediaEntry.architectureDetails && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-500" />
                    {t('learning:glossary.dataFlowArchitecture', 'Flux de Données & Architecture')}
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs sm:text-sm text-emerald-400 border border-slate-800 overflow-x-auto shadow-inner leading-relaxed">
                    <pre>{currentEncyclopediaEntry.architectureDetails}</pre>
                  </div>
                </div>
              )}

              {/* Formula or Metric (if present) */}
              {currentEncyclopediaEntry.formulaOrMetric && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                    {t('learning:glossary.formalDefinition', '📐 Formule Mathématique / Définition Formelle')}
                  </h4>
                  <div className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    {currentEncyclopediaEntry.formulaOrMetric}
                  </div>
                </div>
              )}

              {/* Exam Trap Alert (Critical box) */}
              <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-500/40">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                      {t('learning:glossary.criticalExamTrap', "⚠️ Le Piège d'Examen Incontournable")}
                    </h4>
                    <p className="text-sm text-slate-800 dark:text-amber-100/90 leading-relaxed font-medium">
                      {currentEncyclopediaEntry.examTrap}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cloud Equivalents Comparison Grid */}
              {currentEncyclopediaEntry.cloudEquivalents && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-cyan-500" />
                    {t('learning:glossary.cloudMapping', 'Correspondance des Services par Cloud Provider')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentEncyclopediaEntry.cloudEquivalents.azure && (
                      <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Microsoft Azure
                        </div>
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {currentEncyclopediaEntry.cloudEquivalents.azure}
                        </div>
                      </div>
                    )}
                    {currentEncyclopediaEntry.cloudEquivalents.aws && (
                      <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Amazon Web Services (AWS)
                        </div>
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {currentEncyclopediaEntry.cloudEquivalents.aws}
                        </div>
                      </div>
                    )}
                    {currentEncyclopediaEntry.cloudEquivalents.gcp && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Google Cloud Platform (GCP)
                        </div>
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {currentEncyclopediaEntry.cloudEquivalents.gcp}
                        </div>
                      </div>
                    )}
                    {currentEncyclopediaEntry.cloudEquivalents.ibm && (
                      <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          IBM watsonx
                        </div>
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {currentEncyclopediaEntry.cloudEquivalents.ibm}
                        </div>
                      </div>
                    )}
                    {currentEncyclopediaEntry.cloudEquivalents.nvidia && (
                      <div className="p-3.5 rounded-xl bg-green-500/5 border border-green-500/20">
                        <div className="text-xs font-bold text-green-600 dark:text-green-400 mb-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          NVIDIA AI Enterprise
                        </div>
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {currentEncyclopediaEntry.cloudEquivalents.nvidia}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  {t('learning:glossary.keyTakeaways', 'À Retenir Absolument pour Réussir')}
                </h3>
                <div className="space-y-2">
                  {currentEncyclopediaEntry.keyTakeaways.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Terms Cross-Links */}
              {currentEncyclopediaEntry.relatedTermIds && currentEncyclopediaEntry.relatedTermIds.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    {t('learning:glossary.relatedConcepts', '🔗 Concepts Liés & Connexions')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentEncyclopediaEntry.relatedTermIds.map(relId => {
                      const relEntry = glossaryEntries.find((e: GlossaryEntry) => e.id === relId);
                      if (!relEntry) return null;
                      return (
                        <button
                          key={relId}
                          onClick={() => {
                            setSelectedEntryId(relId);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
                        >
                          <span>{relEntry.term}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Jumps (QCM & Flashcards) */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Prêt à tester vos connaissances sur ce concept ?
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onNavigate('flashcards')}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Réviser en Flashcard</span>
                  </button>
                  <button
                    onClick={() => onNavigate('quiz')}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>S'entraîner en QCM</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
