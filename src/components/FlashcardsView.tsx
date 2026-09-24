import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Bookmark, 
  Clock, 
  Layers, 
  Lightbulb, 
  Zap,
  Search,
  Shuffle,
  FolderOpen,
  Award
} from 'lucide-react';
import { AppScreen } from '../types';
import { 
  c1000177FlashcardsData,
  gcpmleFlashcardsData,
  aifc01FlashcardsData,
  mlsc01FlashcardsData,
  ai900FlashcardsData, 
  ai102FlashcardsData,
  c1000177DomainsMeta,
  gcpmleDomainsMeta,
  aifc01DomainsMeta,
  mlsc01DomainsMeta,
  ai900DomainsMeta, 
  ai102DomainsMeta 
} from '../data/flashcardsData';

interface FlashcardsViewProps {
  onNavigate: (screen: AppScreen) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ onNavigate }) => {
  // Certification selection: default to C1000-177 (IBM Certified Specialist - watsonx.ai)
  const [selectedCert, setSelectedCert] = useState<'c1000177' | 'gcpmle' | 'aifc01' | 'mlsc01' | 'ai900' | 'ai102'>('c1000177');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratedInterval, setRatedInterval] = useState<string | null>(null);
  const [jumpInput, setJumpInput] = useState('');

  // Active dataset and metadata based on selected certification
  const activeDataset = useMemo(() => {
    if (selectedCert === 'c1000177') return c1000177FlashcardsData;
    if (selectedCert === 'gcpmle') return gcpmleFlashcardsData;
    if (selectedCert === 'aifc01') return aifc01FlashcardsData;
    if (selectedCert === 'mlsc01') return mlsc01FlashcardsData;
    if (selectedCert === 'ai900') return ai900FlashcardsData;
    return ai102FlashcardsData;
  }, [selectedCert]);

  const activeDomainsMeta = useMemo(() => {
    if (selectedCert === 'c1000177') return c1000177DomainsMeta;
    if (selectedCert === 'gcpmle') return gcpmleDomainsMeta;
    if (selectedCert === 'aifc01') return aifc01DomainsMeta;
    if (selectedCert === 'mlsc01') return mlsc01DomainsMeta;
    if (selectedCert === 'ai900') return ai900DomainsMeta;
    return ai102DomainsMeta;
  }, [selectedCert]);

  // When changing certification, reset active domain and indices
  const handleSelectCert = (cert: 'c1000177' | 'gcpmle' | 'aifc01' | 'mlsc01' | 'ai900' | 'ai102') => {
    if (cert !== selectedCert) {
      setSelectedCert(cert);
      setSelectedDomain('all');
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setSearchQuery('');
    }
  };

  // Filter cards based on domain, bookmark, and search query
  const filteredCards = useMemo(() => {
    return activeDataset.filter((card) => {
      if (selectedDomain !== 'all' && card.domainId !== selectedDomain) return false;
      if (bookmarkedOnly && !bookmarkedIds.has(card.id)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          card.questionTitle.toLowerCase().includes(q) ||
          card.questionLead.toLowerCase().includes(q) ||
          card.solutionBody.toLowerCase().includes(q) ||
          card.category.toLowerCase().includes(q) ||
          card.promptNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeDataset, selectedDomain, bookmarkedOnly, searchQuery, bookmarkedIds]);

  // Reset or bound card index when filtered list changes
  useEffect(() => {
    if (currentCardIndex >= filteredCards.length) {
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  }, [filteredCards.length, currentCardIndex]);

  const card = filteredCards[currentCardIndex] || activeDataset[0];
  const isCurrentBookmarked = card ? bookmarkedIds.has(card.id) : false;

  const currentDomainMeta = useMemo(() => {
    return activeDomainsMeta.find((d) => d.id === selectedDomain) || activeDomainsMeta[0];
  }, [activeDomainsMeta, selectedDomain]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (interval: string) => {
    setRatedInterval(interval);
    setTimeout(() => {
      setRatedInterval(null);
      setIsFlipped(false);
      setCurrentCardIndex((prev) => (prev + 1) % Math.max(1, filteredCards.length));
    }, 400);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % Math.max(1, filteredCards.length));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % Math.max(1, filteredCards.length));
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShuffle = () => {
    if (filteredCards.length <= 1) return;
    const randomIdx = Math.floor(Math.random() * filteredCards.length);
    setCurrentCardIndex(randomIdx);
    setIsFlipped(false);
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpInput, 10);
    if (!isNaN(target) && target >= 1 && target <= filteredCards.length) {
      setCurrentCardIndex(target - 1);
      setIsFlipped(false);
      setJumpInput('');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        handleRate('1j (À revoir)');
      } else if (e.key === '2') {
        handleRate('3j (Moyen)');
      } else if (e.key === '3') {
        handleRate('7j (Maîtrisé)');
      } else if (e.key === '4') {
        handleRate('14j (Facile)');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCards.length]);

  return (
    <div id="flashcards-main-container" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Certification Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1c1f2a]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              {selectedCert === 'c1000177'
                ? 'IBM watsonx C1000-177 • IBM watsonx.ai Specialist v1.0'
                : selectedCert === 'gcpmle'
                ? 'Google Cloud GCP-PMLE • Professional Machine Learning Engineer'
                : selectedCert === 'aifc01'
                ? 'AWS AIF-C01 • AWS Certified AI Practitioner'
                : selectedCert === 'mlsc01' 
                ? 'AWS MLS-C01 • AWS Machine Learning Specialty' 
                : selectedCert === 'ai900' 
                ? 'Azure AI-900 • Azure AI Fundamentals' 
                : 'Azure AI-102 • Azure AI Engineer Associate'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              100 Fiches / Domaine ({activeDataset.length} Cartes)
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white font-headline">
            {selectedCert === 'c1000177'
              ? 'Fiches Mémo & Mémorisation Espacée (SRS) — IBM watsonx.ai (C1000-177)'
              : selectedCert === 'gcpmle'
              ? 'Fiches Mémo & Mémorisation Espacée (SRS) — GCP-PMLE'
              : selectedCert === 'aifc01'
              ? 'Fiches Mémo & Mémorisation Espacée (SRS) — AWS AIF-C01'
              : selectedCert === 'mlsc01' 
              ? 'Fiches Mémo & Mémorisation Espacée (SRS) — AWS MLS-C01' 
              : selectedCert === 'ai900'
              ? 'Fiches Mémo & Mémorisation Espacée (SRS) — Azure AI-900'
              : 'Fiches Mémo & Mémorisation Espacée (SRS) — Azure AI-102'}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            {selectedCert === 'c1000177'
              ? "400 fiches officielles d'ingénierie et de gouvernance IBM watsonx couvrant les 4 domaines : watsonx.ai Studio & Prompt Engineering (30%), watsonx.data & Lakehouse Iceberg (25%), watsonx.governance & AI Act (30%), et Intégration d'API SDK & Déploiement Red Hat OpenShift (15%)."
              : selectedCert === 'gcpmle'
              ? "500 fiches officielles d'ingénierie ML Google Cloud couvrant les 5 domaines : Architecture & Accélérateurs GPU/TPU (20%), Pipelines de données & Feature Store (20%), Entraînement & Vizier (25%), MLOps Vertex Pipelines & Canaries (20%), Monitoring & Explicabilité (15%)."
              : selectedCert === 'aifc01'
              ? "500 fiches officielles couvrant les 5 domaines AWS Certified AI Practitioner : Fondamentaux IA/ML (20%), Principes GenAI & Transformeurs (24%), Amazon Bedrock & RAG (28%), IA Responsable & Biais Clarify (14%), Sécurité KMS & PrivateLink (14%)."
              : selectedCert === 'mlsc01'
              ? "400 fiches spécialisées couvrant les 4 domaines officiels AWS MLS-C01 : Ingénierie des données (S3, Glue, Kinesis), EDA (Outliers, Scaling, Clarify), Modélisation (XGBoost, DeepAR, RCF, régularisation) et MLOps (Endpoints, Drift, Pipelines)."
              : selectedCert === 'ai900'
              ? "500 fiches officielles couvrant l'intégralité des 5 domaines d'apprentissage Microsoft Azure AI Fundamentals (IA Responsable, Machine Learning, Vision, NLP, IA Générative)."
              : "500 fiches complètes couvrant l'intégralité des 5 domaines officiels Microsoft Azure AI Engineer Associate (Sécurité, Vision, NLP, GenAI RAG, Gouvernance)."}
          </p>
        </div>

        {/* Top Summary Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171b26] border border-[#262a35] text-xs font-mono text-slate-300">
            <span>Progression session :</span>
            <span className="font-bold text-amber-400">
              {currentCardIndex + 1} / {filteredCards.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171b26] border border-[#262a35] text-xs font-mono text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>14 jours de série</span>
          </div>
        </div>
      </div>

      {/* Certification Toggle Bar (6 Certifications) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#171b26] border border-[#262a35]">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Certification Cible :
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:w-auto w-full">
          <button
            onClick={() => handleSelectCert('c1000177')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
              selectedCert === 'c1000177'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/50'
                : 'bg-[#0f131d] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            <span>IBM watsonx</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-200 border border-blue-500/30">
              400
            </span>
          </button>

          <button
            onClick={() => handleSelectCert('gcpmle')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
              selectedCert === 'gcpmle'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/50'
                : 'bg-[#0f131d] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            <span>GCP-PMLE</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-200 border border-blue-500/30">
              500
            </span>
          </button>

          <button
            onClick={() => handleSelectCert('aifc01')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
              selectedCert === 'aifc01'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 border border-amber-400/50'
                : 'bg-[#0f131d] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            <span>AWS AIF-C01</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-200 border border-amber-500/30">
              500
            </span>
          </button>

          <button
            onClick={() => handleSelectCert('mlsc01')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
              selectedCert === 'mlsc01'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 border border-amber-400/50'
                : 'bg-[#0f131d] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            <span>AWS MLS-C01</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-200 border border-amber-500/30">
              400
            </span>
          </button>

          <button
            onClick={() => handleSelectCert('ai900')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
              selectedCert === 'ai900'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-400/50'
                : 'bg-[#0f131d] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            <span>Azure AI-900</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-200">
              500
            </span>
          </button>

          <button
            onClick={() => handleSelectCert('ai102')}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
              selectedCert === 'ai102'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-400/50'
                : 'bg-[#0f131d] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            <span>Azure AI-102</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-200">
              500
            </span>
          </button>
        </div>
      </div>

      {/* Domain Selector Tabs (100 Cards per Domain) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300 px-1">
          <span className="font-semibold uppercase tracking-wider font-mono flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
            Domaines Officiels {selectedCert.toUpperCase()} (100 fiches chacun) :
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Total : {activeDataset.length} cartes actives
          </span>
        </div>

        <div className={`grid grid-cols-2 sm:grid-cols-3 ${activeDomainsMeta.length <= 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-6'} gap-2`}>
          {activeDomainsMeta.map((dm) => {
            const isSelected = selectedDomain === dm.id;
            return (
              <button
                key={dm.id}
                id={`flashcard-domain-tab-${dm.id}`}
                onClick={() => {
                  setSelectedDomain(dm.id);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/70 border-blue-500 text-white shadow-lg shadow-blue-950/60 ring-1 ring-blue-500/50'
                    : 'bg-[#171b26] border-[#262a35] hover:border-[#384155] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: dm.color }}
                  />
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-900/80 text-slate-300 border border-slate-700/50">
                    {dm.weight}
                  </span>
                </div>
                <div className="text-xs font-bold line-clamp-2 leading-snug">
                  {dm.id === 'all' 
                    ? `Tous (${activeDataset.length})` 
                    : dm.name.split('.')[1]?.trim() || dm.name}
                </div>
                <div className="text-[11px] font-mono text-blue-400 font-semibold mt-1">
                  {dm.count} fiches
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Bar: Search, Bookmark Filter, Shuffle & Jump */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#171b26] border border-[#262a35]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              selectedCert === 'c1000177'
                ? "Rechercher IBM watsonx (ex: Granite, Prompt Lab, Iceberg, Presto, Factsheets, Disparate Impact, OpenShift)..."
                : selectedCert === 'gcpmle'
                ? "Rechercher GCP-PMLE (ex: TPU, Vizier, tf.Transform, Feature Store, BigQuery ML, LoRA, Kubeflow, Wasserstein)..."
                : selectedCert === 'aifc01'
                ? "Rechercher AIF-C01 (ex: Bedrock, Claude, RAG, Guardrails, Clarify, KMS, Hallucination, Few-shot)..."
                : selectedCert === 'mlsc01'
                ? "Rechercher un concept AWS MLS-C01 (ex: XGBoost, DeepAR, Glue, Pipe Mode, Model Monitor)..."
                : selectedCert === 'ai900' 
                ? "Rechercher un concept AI-900 (ex: Régression, K-Means, Fairness, OCR, DALL-E, PII)..."
                : "Rechercher par concept AI-102 (ex: BM25, IoU, SSML, Jailbreak, PTU)..."
            }
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[#0f131d] border border-[#262a35] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Bookmark filter toggle */}
          <button
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border flex items-center gap-1.5 transition-colors ${
              bookmarkedOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#0f131d] text-slate-400 hover:text-white border-[#262a35]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarkedOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favoris ({bookmarkedIds.size})</span>
          </button>

          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            title="Mélanger aléatoirement le paquet"
            className="px-3 py-1.5 rounded-xl bg-[#0f131d] hover:bg-[#262a35] text-slate-400 hover:text-white border border-[#262a35] text-xs font-mono transition-colors flex items-center gap-1"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mélanger</span>
          </button>

          {/* Jump To Form */}
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              max={filteredCards.length}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder="#"
              className="w-12 px-2 py-1.5 rounded-xl bg-[#0f131d] border border-[#262a35] text-xs text-center text-white focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono transition-colors"
            >
              Aller
            </button>
          </form>
        </div>
      </div>

      {/* Main Flashcard Stage (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Auxiliary Card: Context Topology & Domain Specs (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Current Domain Info Card */}
          <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                Domaine Sélectionné
              </span>
              <span 
                className="text-[11px] font-mono px-2 py-0.5 rounded-full font-bold text-white"
                style={{ backgroundColor: currentDomainMeta.color }}
              >
                Poids {currentDomainMeta.weight}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white font-headline">
              {currentDomainMeta.name}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentDomainMeta.description}
            </p>

            <div className="pt-2 border-t border-[#262a35] space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-400">Cartes du domaine :</span>
                <span className="text-blue-400 font-bold">{filteredCards.length} fiches</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-400">Objectif de rétention :</span>
                <span className="text-emerald-400 font-bold">SM-2 ≥ 85%</span>
              </div>
            </div>
          </div>

          {/* Context Topology Scheme */}
          <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-400" />
                {selectedCert === 'c1000177'
                  ? "Architecture IBM watsonx Platform"
                  : selectedCert === 'gcpmle'
                  ? "Cycle MLOps Google Cloud Vertex AI"
                  : selectedCert === 'aifc01'
                  ? "Architecture Amazon Bedrock GenAI"
                  : selectedCert === 'mlsc01' 
                  ? "Cycle de Vie MLOps Amazon SageMaker" 
                  : selectedCert === 'ai900' 
                  ? "Écosystème Azure AI Workloads" 
                  : "Architecture Réseau Azure AI Hub"}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedCert.toUpperCase()}
              </span>
            </div>

            {/* SVG Visual Scheme */}
            {selectedCert === 'c1000177' ? (
              <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
                <svg viewBox="0 0 280 135" className="w-full h-auto">
                  <rect width="280" height="135" rx="8" fill="#0a0e18" />

                  {/* 3 Main Pillars of watsonx */}
                  <rect x="10" y="12" width="82" height="74" rx="5" fill="#002d9c" stroke="#0f62fe" strokeWidth="1" />
                  <text x="51" y="25" fill="#edf5ff" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">watsonx.ai</text>
                  <text x="51" y="38" fill="#bfdbfe" fontSize="5.5" textAnchor="middle" fontFamily="monospace">Prompt Lab</text>
                  <text x="51" y="49" fill="#bfdbfe" fontSize="5.5" textAnchor="middle" fontFamily="monospace">Granite Models</text>
                  <text x="51" y="60" fill="#bfdbfe" fontSize="5.5" textAnchor="middle" fontFamily="monospace">Tuning Studio</text>
                  <text x="51" y="71" fill="#bfdbfe" fontSize="5.5" textAnchor="middle" fontFamily="monospace">Synthetic Data</text>

                  <rect x="99" y="12" width="82" height="74" rx="5" fill="#0043ce" stroke="#4589ff" strokeWidth="1" />
                  <text x="140" y="25" fill="#edf5ff" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">watsonx.data</text>
                  <text x="140" y="38" fill="#d0e2ff" fontSize="5.5" textAnchor="middle" fontFamily="monospace">Open Lakehouse</text>
                  <text x="140" y="49" fill="#d0e2ff" fontSize="5.5" textAnchor="middle" fontFamily="monospace">Apache Iceberg</text>
                  <text x="140" y="60" fill="#d0e2ff" fontSize="5.5" textAnchor="middle" fontFamily="monospace">Presto &amp; Spark</text>
                  <text x="140" y="71" fill="#d0e2ff" fontSize="5.5" textAnchor="middle" fontFamily="monospace">Milvus Vector DB</text>

                  <rect x="188" y="12" width="82" height="74" rx="5" fill="#491d8b" stroke="#8a3ffc" strokeWidth="1" />
                  <text x="229" y="25" fill="#f6f2ff" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">watsonx.governance</text>
                  <text x="229" y="38" fill="#e8daff" fontSize="5.5" textAnchor="middle" fontFamily="monospace">AI Factsheets</text>
                  <text x="229" y="49" fill="#e8daff" fontSize="5.5" textAnchor="middle" fontFamily="monospace">Disparate Impact 80%</text>
                  <text x="229" y="60" fill="#e8daff" fontSize="5.5" textAnchor="middle" fontFamily="monospace">ROUGE / Groundedness</text>
                  <text x="229" y="71" fill="#e8daff" fontSize="5.5" textAnchor="middle" fontFamily="monospace">EU AI Act Conformité</text>

                  {/* Underlying Infrastructure */}
                  <rect x="10" y="93" width="260" height="30" rx="4" fill="#161616" stroke="#fa4d56" strokeWidth="1" />
                  <text x="140" y="106" fill="#ff8389" fontSize="6.8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    RED HAT OPENSHIFT CONTAINER PLATFORM (RHOCP)
                  </text>
                  <text x="140" y="117" fill="#c6c6c6" fontSize="5.6" textAnchor="middle" fontFamily="monospace">
                    Sur Site (Air-Gapped) • Multi-Cloud • NVIDIA GPU Operator (MIG) • SDK Python
                  </text>
                </svg>
              </div>
            ) : selectedCert === 'gcpmle' ? (
              <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
                <svg viewBox="0 0 280 135" className="w-full h-auto">
                  <rect width="280" height="135" rx="8" fill="#0a0e18" />
                  <rect x="10" y="14" width="58" height="74" rx="5" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                  <text x="39" y="27" fill="#bfdbfe" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">1. DATA &amp; STORE</text>
                  <text x="39" y="41" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">BigQuery / BQML</text>
                  <text x="39" y="53" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Dataflow Beam</text>
                  <text x="39" y="65" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">tf.Transform</text>
                  <text x="39" y="77" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Feature Store</text>

                  <path d="M68 51 H77" stroke="#3b82f6" strokeWidth="1.5" />

                  <rect x="77" y="14" width="58" height="74" rx="5" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                  <text x="106" y="27" fill="#a7f3d0" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">2. TRAIN &amp; TUNE</text>
                  <text x="106" y="41" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">GPU T4/A100/TPU</text>
                  <text x="106" y="53" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">MultiWorker TF</text>
                  <text x="106" y="65" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Vizier Bayesian</text>
                  <text x="106" y="77" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">LoRA PEFT</text>

                  <path d="M135 51 H144" stroke="#10b981" strokeWidth="1.5" />

                  <rect x="144" y="14" width="58" height="74" rx="5" fill="#3b0764" stroke="#a855f7" strokeWidth="1" />
                  <text x="173" y="27" fill="#f3e8ff" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">3. REGISTRY &amp; CI</text>
                  <text x="173" y="41" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Model Registry</text>
                  <text x="173" y="53" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Alias @champion</text>
                  <text x="173" y="65" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Vertex Pipelines</text>
                  <text x="173" y="77" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Cloud Build CI</text>

                  <path d="M202 51 H211" stroke="#a855f7" strokeWidth="1.5" />

                  <rect x="211" y="14" width="58" height="74" rx="5" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                  <text x="240" y="27" fill="#ffe4e6" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">4. SERVE &amp; DRIFT</text>
                  <text x="240" y="41" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Online / Batch</text>
                  <text x="240" y="53" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Traffic Splitting</text>
                  <text x="240" y="65" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Model Monitor</text>
                  <text x="240" y="77" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Wasserstein/XRAI</text>

                  <rect x="10" y="98" width="259" height="25" rx="4" fill="#171923" stroke="#eab308" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="140" y="114" fill="#fde047" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    BOUCLE MLOPS NIVEAU 2 : ALERTE DRIFT -&gt; PUB/SUB -&gt; RÉ-ENTRAÎNEMENT AUTO
                  </text>
                </svg>
              </div>
            ) : selectedCert === 'aifc01' ? (
              <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
                <svg viewBox="0 0 280 135" className="w-full h-auto">
                  <rect width="280" height="135" rx="8" fill="#0a0e18" />
                  <rect x="10" y="12" width="260" height="42" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
                  <text x="140" y="26" fill="#c7d2fe" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    AMAZON BEDROCK (API SERVERLESS UNIFIÉE)
                  </text>
                  <text x="140" y="42" fill="#a5b4fc" fontSize="6.5" textAnchor="middle" fontFamily="monospace">
                    Claude 3.5 Sonnet • Llama 3.1 • Mistral Large • Amazon Titan
                  </text>
                  <rect x="10" y="60" width="80" height="45" rx="5" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                  <text x="50" y="74" fill="#a7f3d0" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">KNOWLEDGE BASES</text>
                  <text x="50" y="86" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">S3 • Chunking Overlap</text>
                  <text x="50" y="96" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">OpenSearch Serverless</text>
                  <rect x="98" y="60" width="84" height="45" rx="5" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                  <text x="140" y="74" fill="#ffe4e6" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BEDROCK GUARDRAILS</text>
                  <text x="140" y="86" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Denied Topics • Caviardage PII</text>
                  <text x="140" y="96" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Prompt Attack Anti-Jailbreak</text>
                  <rect x="190" y="60" width="80" height="45" rx="5" fill="#172554" stroke="#3b82f6" strokeWidth="1" />
                  <text x="230" y="74" fill="#dbeafe" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BEDROCK AGENTS</text>
                  <text x="230" y="86" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">ReAct • Multi-Étapes</text>
                  <text x="230" y="96" fill="#cbd5e1" fontSize="5.8" textAnchor="middle" fontFamily="monospace">Action Groups (Lambda)</text>
                  <rect x="10" y="110" width="260" height="18" rx="3" fill="#18181b" stroke="#52525b" strokeWidth="0.8" strokeDasharray="2 2" />
                  <text x="140" y="122" fill="#fbbf24" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    KMS CMK CHIFFREMENT • PRIVATELINK VPC • CLOUDTRAIL AUDIT
                  </text>
                </svg>
              </div>
            ) : selectedCert === 'mlsc01' ? (
              <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
                <svg viewBox="0 0 280 135" className="w-full h-auto">
                  <rect width="280" height="135" rx="8" fill="#0a0e18" />
                  <rect x="10" y="15" width="58" height="75" rx="5" fill="#172554" stroke="#3b82f6" strokeWidth="1" />
                  <text x="39" y="30" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">1. INGESTION</text>
                  <text x="39" y="44" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">S3 Parquet</text>
                  <text x="39" y="56" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">Kinesis Streams</text>
                  <text x="39" y="68" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">Glue ETL</text>
                  <text x="39" y="80" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">Athena SQL</text>
                  <path d="M68 52 H77" stroke="#3b82f6" strokeWidth="1.5" />
                  <rect x="77" y="15" width="58" height="75" rx="5" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                  <text x="106" y="30" fill="#a7f3d0" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">2. EDA PREP</text>
                  <text x="106" y="44" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">Data Wrangler</text>
                  <text x="106" y="56" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">Clarify Bias</text>
                  <text x="106" y="68" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">Feature Store</text>
                  <text x="106" y="80" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">PCA / Scaling</text>
                  <path d="M135 52 H144" stroke="#10b981" strokeWidth="1.5" />
                  <rect x="144" y="15" width="58" height="75" rx="5" fill="#3b0764" stroke="#a855f7" strokeWidth="1" />
                  <text x="173" y="30" fill="#f3e8ff" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">3. MODELING</text>
                  <text x="173" y="44" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">XGBoost / DeepAR</text>
                  <text x="173" y="56" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">Linear / RCF</text>
                  <text x="173" y="68" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">Bayesian AMT</text>
                  <text x="173" y="80" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">Pipe Mode</text>
                  <path d="M202 52 H211" stroke="#a855f7" strokeWidth="1.5" />
                  <rect x="211" y="15" width="58" height="75" rx="5" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                  <text x="240" y="30" fill="#ffe4e6" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">4. MLOPS</text>
                  <text x="240" y="44" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">Real-time / Async</text>
                  <text x="240" y="56" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">MME / Serverless</text>
                  <text x="240" y="68" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">Model Monitor</text>
                  <text x="240" y="80" fill="#cbd5e1" fontSize="6" textAnchor="middle" fontFamily="monospace">A/B Testing</text>
                  <rect x="10" y="98" width="259" height="24" rx="4" fill="#1c1917" stroke="#78716c" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="140" y="113" fill="#fbbf24" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    SAGEMAKER PIPELINES • MODEL REGISTRY • KMS &amp; PRIVATELINK
                  </text>
                </svg>
              </div>
            ) : selectedCert === 'ai900' ? (
              <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
                <svg viewBox="0 0 280 135" className="w-full h-auto">
                  <rect width="280" height="135" rx="8" fill="#0a0e18" />
                  <rect x="15" y="10" width="250" height="22" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                  <text x="140" y="24" fill="#a7f3d0" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    CADRE IA RESPONSABLE (6 PRINCIPES &amp; CONTENT SAFETY)
                  </text>
                  <rect x="15" y="40" width="75" height="52" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <text x="52" y="55" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">AZURE ML</text>
                  <text x="52" y="67" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontFamily="monospace">AutoML • Designer</text>
                  <text x="52" y="78" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontFamily="monospace">Régression • Classif</text>
                  <rect x="100" y="40" width="80" height="52" rx="5" fill="#2e1065" stroke="#a855f7" strokeWidth="1" />
                  <text x="140" y="55" fill="#f3e8ff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">COGNITIVE</text>
                  <text x="140" y="67" fill="#d8b4fe" fontSize="6.5" textAnchor="middle" fontFamily="monospace">Vision • Custom OCR</text>
                  <text x="140" y="78" fill="#d8b4fe" fontSize="6.5" textAnchor="middle" fontFamily="monospace">Language • CLU</text>
                  <rect x="190" y="40" width="75" height="52" rx="5" fill="#172554" stroke="#60a5fa" strokeWidth="1" />
                  <text x="227" y="55" fill="#dbeafe" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">AZURE OPENAI</text>
                  <text x="227" y="67" fill="#93c5fd" fontSize="6.5" textAnchor="middle" fontFamily="monospace">GPT-4o • DALL-E</text>
                  <text x="227" y="78" fill="#93c5fd" fontSize="6.5" textAnchor="middle" fontFamily="monospace">RAG On Your Data</text>
                  <rect x="15" y="100" width="250" height="24" rx="4" fill="#111827" stroke="#4b5563" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="140" y="115" fill="#cbd5e1" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    APPLICATIONS CLIENTES • BOT SERVICES • TABLEAUX ERP
                  </text>
                </svg>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
                <svg viewBox="0 0 280 130" className="w-full h-auto">
                  <rect width="280" height="130" rx="8" fill="#0a0e18" />
                  <rect x="15" y="45" width="60" height="40" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="45" y="65" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">APPS / UI</text>
                  <rect x="110" y="25" width="70" height="80" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                  <text x="145" y="45" fill="#c7d2fe" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">AZURE AI</text>
                  <rect x="215" y="45" width="55" height="40" rx="6" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
                  <text x="242" y="64" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SECURITY</text>
                </svg>
              </div>
            )}

            <p className="text-[11px] text-slate-300 leading-relaxed">
              {selectedCert === 'c1000177'
                ? "L'examen IBM watsonx.ai Specialist (C1000-177) valide l'intégration des 3 piliers : watsonx.ai (modèles Granite & Prompt Lab), watsonx.data (Lakehouse ouvert Iceberg) et watsonx.governance (Factsheets & conformité EU AI Act)."
                : selectedCert === 'gcpmle'
                ? "L'examen GCP-PMLE valide la maîtrise des composants MLOps intégrés : Dataflow Beam, tf.Transform, Vertex Pipelines KFP v2, Model Registry et boucle de feedback ré-entraînement continu."
                : selectedCert === 'aifc01'
                ? "L'examen AIF-C01 teste la compréhension de bout en bout de l'écosystème Bedrock, de l'ancrage RAG avec Knowledge Bases et de la sécurisation par Guardrails."
                : selectedCert === 'mlsc01'
                ? "L'examen MLS-C01 teste l'enchaînement fluide de ces 4 étapes sous l'angle de la haute performance, du moindre coût et de la sécurité IAM/KMS."
                : selectedCert === 'ai900'
                ? "L'examen AI-900 valide l'identification de ces briques et la sélection de la charge de travail optimale pour chaque besoin métier."
                : "Toutes les requêtes applicatives utilisent des tokens Entra ID (sans clés statiques) et transitent via Private Link."}
            </p>
          </div>

          {/* Exam Tip Callout */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-blue-300 font-headline">
                {selectedCert === 'c1000177'
                  ? "Conseil Stratégique Examen IBM C1000-177"
                  : selectedCert === 'gcpmle'
                  ? "Conseil Stratégique Examen GCP-PMLE"
                  : selectedCert === 'aifc01'
                  ? "Conseil Stratégique Examen AWS AIF-C01"
                  : selectedCert === 'mlsc01' 
                  ? "Conseil Stratégique Examen AWS MLS-C01" 
                  : selectedCert === 'ai900' 
                  ? "Conseil Stratégique Examen AI-900" 
                  : "Conseil Stratégique Examen AI-102"}
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {selectedCert === 'c1000177'
                  ? "Les Domaines 1 (watsonx.ai Studio) et 3 (watsonx.governance) comptent pour 60% de l'examen à eux deux ! Maîtrisez : la clause d'indemnisation de propriété intellectuelle propre aux modèles IBM Granite, le décodage Greedy (déterministe) vs Sampling, le Prompt Tuning (soft prompts sans toucher aux poids), les AI Factsheets pour la conformité EU AI Act, et le calcul du Disparate Impact (seuil minimal des 80%). Pour watsonx.data, retenez que Presto est pour le SQL interactif et Iceberg apporte les transactions ACID et le Time Travel sur stockage objet."
                  : selectedCert === 'gcpmle'
                  ? "Le Domaine 3 (Scaling into ML Models) pèse 25% et le Domaine 4 (Serving & MLOps) pèse 20% ! Maîtrisez le format TFRecord/tf.data pour saturer les TPUs, la différence clé entre tf.Transform (anti Training-Serving Skew) et le Feature Store (< 10 ms Bigtable), l'entraînement distribué MultiWorkerMirrored avec TF_CONFIG, et les métriques de dérive de Vertex Model Monitoring (distance de Wasserstein pour continu, L-Infinity pour catégoriel)."
                  : selectedCert === 'aifc01'
                  ? "Le Domaine 3 (Bedrock & Applications) compte pour 28% et le Domaine 2 (Principes GenAI) compte pour 24% ! Maîtrisez le fonctionnement d'Amazon Bedrock (Knowledge Bases RAG, Agents, Guardrails anti-jailbreak), les paramètres d'inférence (température = 0 pour déterministe vs 1 pour créatif) et la règle absolue de confidentialité (les données clients ne sont JAMAIS utilisées pour entraîner les modèles publics)."
                  : selectedCert === 'mlsc01'
                  ? "Le Domaine 3 (Modélisation) compte pour 36% des points ! Maîtrisez sur le bout des doigts les 17 algorithmes intégrés de SageMaker (XGBoost, DeepAR, RCF, BlazingText, Factorization Machines), leurs formats d'entrée (RecordIO, CSV avec label en 1ère colonne) et leurs hyperparamètres anti-overfitting (max_depth, min_child_weight, eta)."
                  : selectedCert === 'ai900'
                  ? "Pour l'AI-900, maîtrisez parfaitement la distinction entre Régression (valeur continue), Classification (classes) et Clustering (groupes non supervisés). Associez également sans hésiter les 6 principes d'IA responsable de Microsoft aux scénarios éthiques !"
                  : "Révisez au moins 20 fiches par jour en alternant les 5 domaines. Prêtez une attention particulière au Domaine 4 (GenAI & RAG) et au Domaine 2 (Computer Vision) qui représentent ensemble près de 50% de la note finale."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Stage: 3D Flip Flashcard & SM-2 Rating Dock (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          {/* Main Flashcard Container */}
          {filteredCards.length === 0 ? (
            <div className="min-h-[400px] rounded-3xl bg-[#171b26] border border-[#262a35] p-8 flex flex-col items-center justify-center text-center space-y-3">
              <Bookmark className="w-10 h-10 text-slate-600" />
              <h3 className="text-lg font-bold text-white">Aucune fiche correspondante</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Aucune fiche ne correspond à votre filtre de recherche ou à vos favoris pour ce domaine.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setBookmarkedOnly(false);
                  setSelectedDomain('all');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div
              id="active-flashcard-stage"
              onClick={handleFlip}
              className="relative min-h-[400px] sm:min-h-[440px] rounded-3xl bg-gradient-to-br from-[#172033] via-[#171b26] to-[#0f131d] border border-[#262a35] hover:border-blue-500/40 shadow-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 select-none flex flex-col justify-between group"
            >
              {/* Top Card Ribbon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: card.categoryBadgeColor || '#0f62fe' }}
                  >
                    {card.category}
                  </span>
                  <span className="text-[10px] font-mono text-blue-300 font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                    {card.levelTag}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(card.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition-colors"
                    title={isCurrentBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <Bookmark className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#262a35] text-slate-300 hover:text-white text-xs font-mono font-medium transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
                    <span>{isFlipped ? 'Voir Question' : 'Retourner [Espace]'}</span>
                  </button>
                </div>
              </div>

              {/* Central Content (Recto vs Verso) */}
              <div className="my-auto py-6">
                {!isFlipped ? (
                  /* RECTO */
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      {card.promptNumber}
                    </div>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-white font-headline leading-snug">
                      {card.questionTitle}
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">
                      {card.questionLead}
                    </p>
                    <div className="pt-4 flex items-center gap-2 text-xs text-blue-400 font-mono">
                      <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                      <span>Cliquez ou appuyez sur [Espace] pour révéler la solution et les standards officiels IBM</span>
                    </div>
                  </div>
                ) : (
                  /* VERSO */
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
                        Solution &amp; Concept Officiel IBM watsonx / OpenShift
                      </span>
                      <h3 className="text-base sm:text-xl font-bold text-white font-headline mt-0.5">
                        {card.solutionHeading}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {card.solutionBody}
                    </p>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {card.metrics.map((m, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#0a0e18]/80 border border-[#262a35]">
                          <div className="text-[10px] text-slate-400 font-mono">{m.label}</div>
                          <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">{m.value}</div>
                          <div className="text-[10px] text-slate-400 mt-1 leading-tight">{m.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* Golden Rules */}
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                      <div className="text-[11px] font-mono font-semibold uppercase text-blue-300">
                        Règles d'Or Spécialiste IBM watsonx :
                      </div>
                      {card.goldenRules.map((rule, idx) => (
                        <div key={idx} className="text-xs text-slate-300 leading-relaxed">
                          {rule}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-[#262a35]/60">
                <div className="flex items-center gap-3">
                  <span className="font-mono">
                    Fiche {currentCardIndex + 1} sur {filteredCards.length}
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-blue-300 font-mono">{card.domainName || card.deckName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="p-1.5 rounded-lg bg-[#262a35] hover:bg-[#343a49] text-white transition-colors"
                    title="Précédent [Flèche Gauche]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="p-1.5 rounded-lg bg-[#262a35] hover:bg-[#343a49] text-white transition-colors"
                    title="Suivant [Flèche Droite]"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SM-2 Spaced Repetition Rating Dock */}
          <div className="p-4 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px] uppercase">
                Évaluez votre niveau de rétention (Algorithme SM-2)
              </span>
              <span className="font-mono text-emerald-400 text-xs">
                {ratedInterval ? `Planifié à : ${ratedInterval}` : 'Touches [1] [2] [3] [4] pour noter'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => handleRate('1j (À revoir)')}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold text-center transition-all group"
              >
                <div className="font-mono text-sm font-bold text-rose-400">À revoir</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Échéance 1 jour [1]</div>
              </button>

              <button
                onClick={() => handleRate('3j (Moyen)')}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold text-center transition-all group"
              >
                <div className="font-mono text-sm font-bold text-amber-400">Moyen</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Échéance 3 jours [2]</div>
              </button>

              <button
                onClick={() => handleRate('7j (Maîtrisé)')}
                className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold text-center transition-all group"
              >
                <div className="font-mono text-sm font-bold text-blue-400">Maîtrisé</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Échéance 7 jours [3]</div>
              </button>

              <button
                onClick={() => handleRate('14j (Facile)')}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold text-center transition-all group"
              >
                <div className="font-mono text-sm font-bold text-emerald-400">Facile</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Échéance 14 jours [4]</div>
              </button>
            </div>
          </div>

          {/* Upcoming Queue Carousel */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Prochaines fiches dans la file d'attente SRS</span>
              <span>{Math.max(0, filteredCards.length - 1)} restantes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {filteredCards
                .filter((_, i) => i !== currentCardIndex)
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      const targetIdx = filteredCards.findIndex((c) => c.id === item.id);
                      if (targetIdx !== -1) {
                        setCurrentCardIndex(targetIdx);
                        setIsFlipped(false);
                      }
                    }}
                    className="p-3 rounded-xl bg-[#171b26] border border-[#262a35] hover:border-blue-500/40 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="text-[10px] font-mono text-blue-400 font-semibold mb-1">
                      {item.category}
                    </div>
                    <div className="text-xs font-medium text-slate-200 line-clamp-2">
                      {item.questionTitle}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Intervalle {item.intervalDays}j</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
