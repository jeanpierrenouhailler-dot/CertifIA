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
  Award,
  Database,
  CheckCircle2,
  Filter,
  Check,
  Brain,
  Calendar,
  TrendingUp,
  BarChart3,
  Info,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { AppScreen } from '../types';
import { useProgress } from '../context/ProgressContext';
import { InfoTooltip } from './InfoTooltip';
import { 
  getCardSRSMetrics, 
  predictNextIntervals, 
  formatSRSDisplay, 
  computeDailyReviewQueue,
  SRSGrade 
} from '../lib/srsAlgorithm';
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

import { FlashcardCertId } from './FlashcardsDistributionModal';

interface FlashcardsViewProps {
  onNavigate: (screen: AppScreen) => void;
  initialCert?: FlashcardCertId;
  onOpenDistributionModal?: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ 
  onNavigate,
  initialCert,
  onOpenDistributionModal
}) => {
  const {
    reviews,
    bookmarkedCardIds,
    lastCardIndices,
    rateFlashcard,
    toggleBookmarkCard,
    saveLastCardIndex,
    getCertStats,
    isSyncing,
  } = useProgress();

  // Certification selection: default to initialCert or C1000-177 (IBM Certified Specialist - watsonx.ai)
  const [selectedCert, setSelectedCert] = useState<FlashcardCertId>(() => initialCert || 'c1000177');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [masteryFilter, setMasteryFilter] = useState<'today' | 'all' | 'maitrise' | 'revoir' | 'difficile' | 'unreviewed'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [isAlgorithmModalOpen, setIsAlgorithmModalOpen] = useState(false);

  // Sync with initialCert if it changes from parent
  useEffect(() => {
    if (initialCert) {
      setSelectedCert(initialCert);
      setSelectedDomain('all');
      setCurrentCardIndex(lastCardIndices[initialCert] || 0);
      setIsFlipped(false);
    }
  }, [initialCert]);
  
  // Initialize currentCardIndex from persisted lastCardIndices
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(() => {
    return lastCardIndices[initialCert || 'c1000177'] || 0;
  });

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

  // Daily review queue calculated by SM-2 / FSRS algorithm
  const dailyQueue = useMemo(() => {
    return computeDailyReviewQueue(activeDataset, reviews, 17);
  }, [activeDataset, reviews]);

  // Statistics for active certification
  const certStats = useMemo(() => {
    return getCertStats(selectedCert);
  }, [getCertStats, selectedCert, reviews]);

  // When changing certification, restore saved card index and reset domain
  const handleSelectCert = (cert: 'c1000177' | 'gcpmle' | 'aifc01' | 'mlsc01' | 'ai900' | 'ai102') => {
    if (cert !== selectedCert) {
      setSelectedCert(cert);
      setSelectedDomain('all');
      setMasteryFilter('today');
      const savedIndex = lastCardIndices[cert] || 0;
      setCurrentCardIndex(savedIndex);
      setIsFlipped(false);
      setSearchQuery('');
    }
  };

  // Filter cards based on domain, bookmark, retention mastery, and search query
  const filteredCards = useMemo(() => {
    const sourceCards = masteryFilter === 'today' ? dailyQueue.dueCards : activeDataset;

    return sourceCards.filter((c) => {
      if (selectedDomain !== 'all' && c.domainId !== selectedDomain) return false;
      if (bookmarkedOnly && !bookmarkedCardIds.has(c.id)) return false;

      const rev = reviews[c.id];
      const metrics = getCardSRSMetrics(c.id, rev);

      if (masteryFilter === 'maitrise' && (!rev || rev.intervalDays < 7)) return false;
      if (masteryFilter === 'revoir' && (!rev || (rev.intervalDays !== 1 && rev.rating !== 'revoir'))) return false;
      if (masteryFilter === 'difficile' && (!rev || (metrics.difficulty < 4 && rev.rating !== 'difficile' && rev.rating !== 'moyen'))) return false;
      if (masteryFilter === 'unreviewed' && rev) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.questionTitle.toLowerCase().includes(q) ||
          c.questionLead.toLowerCase().includes(q) ||
          c.solutionBody.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.promptNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeDataset, dailyQueue.dueCards, selectedDomain, bookmarkedOnly, masteryFilter, searchQuery, bookmarkedCardIds, reviews]);

  // Bound card index when filtered list changes
  useEffect(() => {
    if (currentCardIndex >= filteredCards.length) {
      const newIdx = 0;
      setCurrentCardIndex(newIdx);
      setIsFlipped(false);
    }
  }, [filteredCards.length, currentCardIndex]);

  const card = filteredCards[currentCardIndex] || activeDataset[0];
  const isCurrentBookmarked = card ? bookmarkedCardIds.has(card.id) : false;
  const currentCardReview = card ? reviews[card.id] : undefined;

  // Real-time SM-2 metrics for the active card
  const currentMetrics = useMemo(() => {
    if (!card) return getCardSRSMetrics('default', undefined, 0);
    return getCardSRSMetrics(card.id, reviews[card.id], currentCardIndex);
  }, [card, reviews, currentCardIndex]);

  // Formatted labels for card header
  const srsDisplay = useMemo(() => {
    if (!card) return formatSRSDisplay(currentMetrics, '#1');
    return formatSRSDisplay(currentMetrics, card.promptNumber || `#${currentCardIndex + 1}`);
  }, [card, currentMetrics, currentCardIndex]);

  // Predicted intervals for the 4 grading buttons
  const predictedIntervals = useMemo(() => {
    return predictNextIntervals(currentMetrics);
  }, [currentMetrics]);

  const currentDomainMeta = useMemo(() => {
    return activeDomainsMeta.find((d) => d.id === selectedDomain) || activeDomainsMeta[0];
  }, [activeDomainsMeta, selectedDomain]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (ratingKey: 'revoir' | 'difficile' | 'moyen' | 'facile', days: number, label: string) => {
    if (!card) return;
    setRatedInterval(label);
    rateFlashcard(card.id, selectedCert, ratingKey, days);
    setTimeout(() => {
      setRatedInterval(null);
      setIsFlipped(false);
      const nextIdx = (currentCardIndex + 1) % Math.max(1, filteredCards.length);
      setCurrentCardIndex(nextIdx);
      saveLastCardIndex(selectedCert, nextIdx);
    }, 380);
  };

  const handleNext = () => {
    setIsFlipped(false);
    const nextIdx = (currentCardIndex + 1) % Math.max(1, filteredCards.length);
    setCurrentCardIndex(nextIdx);
    saveLastCardIndex(selectedCert, nextIdx);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    const prevIdx = (currentCardIndex - 1 + filteredCards.length) % Math.max(1, filteredCards.length);
    setCurrentCardIndex(prevIdx);
    saveLastCardIndex(selectedCert, prevIdx);
  };

  const toggleBookmark = (id: string) => {
    toggleBookmarkCard(id, selectedCert);
  };

  const handleShuffle = () => {
    if (filteredCards.length <= 1) return;
    const randomIdx = Math.floor(Math.random() * filteredCards.length);
    setCurrentCardIndex(randomIdx);
    saveLastCardIndex(selectedCert, randomIdx);
    setIsFlipped(false);
  };

  // Jump directly to Card #127 (scenario from user prompt)
  const handleJumpToCard127 = () => {
    setMasteryFilter('all');
    setSelectedDomain('all');
    setSearchQuery('');
    setBookmarkedOnly(false);
    const targetIdx = 126; // 0-indexed 126 = Card #127
    if (targetIdx < activeDataset.length) {
      setCurrentCardIndex(targetIdx);
      saveLastCardIndex(selectedCert, targetIdx);
      setIsFlipped(false);
    }
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = jumpInput.replace('#', '').trim();
    const target = parseInt(cleanInput, 10);
    if (!isNaN(target) && target >= 1 && target <= activeDataset.length) {
      const targetIdx = target - 1;
      if (masteryFilter !== 'all') {
        setMasteryFilter('all');
        setSelectedDomain('all');
      }
      setCurrentCardIndex(targetIdx);
      saveLastCardIndex(selectedCert, targetIdx);
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
        handleRate('revoir', predictedIntervals.revoir.days, `${predictedIntervals.revoir.days}j (À revoir)`);
      } else if (e.key === '2') {
        handleRate('difficile', predictedIntervals.difficile.days, `${predictedIntervals.difficile.days}j (Difficile)`);
      } else if (e.key === '3') {
        handleRate('moyen', predictedIntervals.moyen.days, `${predictedIntervals.moyen.days}j (Bien)`);
      } else if (e.key === '4') {
        handleRate('facile', predictedIntervals.facile.days, `${predictedIntervals.facile.days}j (Facile)`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCards.length, currentCardIndex, card, selectedCert, predictedIntervals]);

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
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-300">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>{isSyncing ? "Synchronisation Firestore..." : "Persistance Firestore active"}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171b26] border border-[#262a35] text-xs font-mono text-slate-300">
            <span>Position deck :</span>
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

      {/* Daily SRS Intelligent Queue Hero Announcement */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/40 to-[#171b26] border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Algorithme SM-2 / FSRS • Ordonnancement Intelligent
              </span>
              <button
                onClick={() => setIsAlgorithmModalOpen(true)}
                className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 underline underline-offset-2 ml-2 transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                Comment ça marche ?
              </button>
            </div>
            <p className="text-sm sm:text-base font-bold text-white font-headline mt-1">
              « Aujourd'hui, voici les {dailyQueue.totalDue} cartes que tu dois absolument revoir. »
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] font-mono text-slate-300">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                {dailyQueue.overdueCards.length} en retard
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                <Clock className="w-3 h-3 text-amber-400" />
                {dailyQueue.dueTodayCards.length} à échéance aujourd'hui
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
                <Layers className="w-3 h-3 text-blue-400" />
                {dailyQueue.newCards.length} consolidations prioritaires
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setMasteryFilter('today');
              setSelectedDomain('all');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-4 py-2.5 rounded-xl font-bold font-mono text-xs transition-all flex items-center gap-2 shadow-lg ${
              masteryFilter === 'today'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/30 border border-blue-400/50'
                : 'bg-blue-600/20 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40'
            }`}
          >
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{masteryFilter === 'today' ? `Session du Jour (${dailyQueue.totalDue}) Active` : `Lancer la session (${dailyQueue.totalDue})`}</span>
          </button>

          <button
            onClick={handleJumpToCard127}
            className="px-3.5 py-2.5 rounded-xl bg-[#171b26] hover:bg-[#262a35] text-slate-300 hover:text-white border border-[#262a35] font-mono text-xs transition-colors flex items-center gap-1.5"
            title="Consulter l'exemple complet de la Carte #127 avec ses statistiques SRS réelles"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Carte #127</span>
          </button>
        </div>
      </div>

      {/* Certification Toggle Bar (6 Certifications) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#171b26] border border-[#262a35]">
        <div className="flex items-center gap-2 flex-wrap">
          <Award className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Certification Cible :
          </span>
          {onOpenDistributionModal && (
            <button
              onClick={onOpenDistributionModal}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1 transition-colors sm:ml-2"
              title="Consulter l'inventaire officiel et la répartition des 2 800 cartes par certification"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Répartition (2 800)</span>
            </button>
          )}
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

      {/* Retention Mastery Filter Bar (Maîtrisées / À revoir / Difficiles) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#131722] border border-[#262a35]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            État de Rétention SRS :
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:w-auto w-full">
          <button
            onClick={() => {
              setMasteryFilter('today');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              masteryFilter === 'today'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                : 'bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/30'
            }`}
          >
            <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>À revoir aujourd'hui</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950/80 text-blue-200 border border-blue-500/30">
              {dailyQueue.totalDue}
            </span>
          </button>

          <button
            onClick={() => {
              setMasteryFilter('all');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              masteryFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-[#171b26] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            Toutes ({activeDataset.length})
          </button>

          <button
            onClick={() => {
              setMasteryFilter('maitrise');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              masteryFilter === 'maitrise'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Maîtrisées</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-200">
              {certStats.maitriseCount}
            </span>
          </button>

          <button
            onClick={() => {
              setMasteryFilter('revoir');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              masteryFilter === 'revoir'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>À revoir</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-200">
              {certStats.revoirCount}
            </span>
          </button>

          <button
            onClick={() => {
              setMasteryFilter('difficile');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              masteryFilter === 'difficile'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Difficiles (≥ 4/5)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-200">
              {certStats.moyenCount}
            </span>
          </button>

          <button
            onClick={() => {
              setMasteryFilter('unreviewed');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              masteryFilter === 'unreviewed'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-[#171b26] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            Non évaluées ({Math.max(0, activeDataset.length - certStats.totalReviewed)})
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
            <span>Favoris ({bookmarkedCardIds.size})</span>
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
              {/* Top Card Ribbon with 5-Item SM-2 / FSRS Telemetry */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: card.categoryBadgeColor || '#0f62fe' }}
                    >
                      {card.category}
                    </span>
                    <span className="text-[10px] font-mono text-blue-300 font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      {card.levelTag}
                    </span>
                    {srsDisplay.isDueToday ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        À revoir aujourd'hui
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Planifié
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAlgorithmModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 hover:text-white border border-blue-500/20 text-[11px] font-mono transition-colors"
                      title="Explications mathématiques de l'algorithme SM-2 / FSRS"
                    >
                      <Brain className="w-3.5 h-3.5 text-blue-400" />
                      <span className="hidden sm:inline">SM-2 / FSRS</span>
                    </button>
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

                {/* The 5 SRS Core Metadata Points: Identifiant, Dernière révision, Difficulté 3/5, Prochaine révision, Répétitions / Taux */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0a0e18]/85 border border-[#262a35] grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
                  {/* Carte # */}
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>Identifiant</span>
                      <InfoTooltip
                        title="Identifiant de la Fiche"
                        content="Numérotation unique de la fiche mémo permettant un repérage précis dans le référentiel d'examen (ex: Carte #127)."
                      />
                    </div>
                    <div className="text-sm font-bold text-blue-400 mt-0.5">{srsDisplay.cardNumber}</div>
                  </div>
                  {/* Dernière révision */}
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>Dernière révision</span>
                      <InfoTooltip
                        title="Historique de révision"
                        content="Date à laquelle vous avez interagi pour la dernière fois avec cette notion (aujourd'hui, hier, il y a 3 jours...)."
                      />
                    </div>
                    <div className="text-sm font-bold text-slate-100 mt-0.5 capitalize">{srsDisplay.lastReviewLabel}</div>
                  </div>
                  {/* Difficulté 3/5 */}
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>Difficulté</span>
                      <InfoTooltip
                        title="Indice de Difficulté (1 à 5)"
                        content="Calculé dynamiquement par l'algorithme SM-2 selon vos réussites et échecs. 1/5 = Très facile, 5/5 = Piège critique."
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-sm font-bold ${
                        srsDisplay.diffScore >= 4 ? 'text-rose-400' :
                        srsDisplay.diffScore === 3 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {srsDisplay.diffLabel}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <span
                            key={dot}
                            className={`w-1.5 h-1.5 rounded-full ${
                              dot <= srsDisplay.diffScore
                                ? srsDisplay.diffScore >= 4
                                  ? 'bg-rose-400'
                                  : srsDisplay.diffScore === 3
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                                : 'bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Prochaine révision */}
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>Prochaine révision</span>
                      <InfoTooltip
                        title="Prochaine échéance SM-2"
                        content="Intervalle calculé pour présenter la carte juste avant que votre mémoire ne commence à effacer le souvenir (seuil d'oubli Ebbinghaus)."
                      />
                    </div>
                    <div className={`text-sm font-bold mt-0.5 ${
                      srsDisplay.isDueToday ? 'text-amber-400 font-bold' : 'text-emerald-400'
                    }`}>
                      {srsDisplay.nextReviewLabel}
                    </div>
                  </div>
                  {/* Nombre de répétitions & Taux de réussite */}
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>Répétitions / Taux</span>
                      <InfoTooltip
                        title="Taux de réussite cumulé"
                        content="Nombre total d'évaluations réussies sur cette carte et pourcentage de victoires mémo."
                      />
                    </div>
                    <div className="text-sm font-bold text-purple-400 mt-0.5">
                      {srsDisplay.repCount} rep. • {srsDisplay.successLabel}
                    </div>
                  </div>
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
              <span className="text-slate-400 font-mono text-[11px] uppercase flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-blue-400" />
                Évaluez votre niveau de rétention (Algorithme SM-2 / FSRS)
              </span>
              <span className="font-mono text-emerald-400 text-xs">
                {ratedInterval ? `Planifié à : ${ratedInterval}` : 'Touches [1] [2] [3] [4] pour noter'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => handleRate('revoir', predictedIntervals.revoir.days, `${predictedIntervals.revoir.days}j (À revoir)`)}
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold text-center transition-all group"
              >
                <div className="font-mono text-sm font-bold text-rose-400">À revoir [1]</div>
                <div className="text-[11px] text-rose-300/90 font-mono mt-0.5 font-bold">
                  {predictedIntervals.revoir.label} • Remise à zéro
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">EF -0.20 • Diff. +1</div>
              </button>

              <button
                onClick={() => handleRate('difficile', predictedIntervals.difficile.days, `${predictedIntervals.difficile.days}j (Difficile)`)}
                className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold text-center transition-all group"
              >
                <div className="font-mono text-sm font-bold text-amber-400">Difficile [2]</div>
                <div className="text-[11px] text-amber-300/90 font-mono mt-0.5 font-bold">
                  {predictedIntervals.difficile.label} • Réduction
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">EF -0.15 • Diff. +0.5</div>
              </button>

              <button
                onClick={() => handleRate('moyen', predictedIntervals.moyen.days, `${predictedIntervals.moyen.days}j (Bien)`)}
                className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold text-center transition-all group"
              >
                <div className="font-mono text-sm font-bold text-blue-400">Bien [3]</div>
                <div className="text-[11px] text-blue-300/90 font-mono mt-0.5 font-bold">
                  {predictedIntervals.moyen.label} • Standard SM-2
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">EF {currentMetrics.easeFactor} • Normal</div>
              </button>

              <button
                onClick={() => handleRate('facile', predictedIntervals.facile.days, `${predictedIntervals.facile.days}j (Facile)`)}
                className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold text-center transition-all group"
              >
                <div className="font-mono text-sm font-bold text-emerald-400">Facile [4]</div>
                <div className="text-[11px] text-emerald-300/90 font-mono mt-0.5 font-bold">
                  {predictedIntervals.facile.label} • Boost rétention
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">EF +0.15 • Diff. -1</div>
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

      {/* SM-2 / FSRS Algorithmic Explainer Modal */}
      {isAlgorithmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#171b26] border border-[#262a35] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAlgorithmModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-[#0f131d] border border-[#262a35] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-headline">
                  Moteur SRS CertifAI : SuperMemo SM-2 &amp; FSRS
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Pourquoi réviser 17 cartes ciblées bat le défilement aveugle de 500 fiches
                </p>
              </div>
            </div>

            {/* Core Explanation */}
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="p-4 rounded-2xl bg-[#0f131d] border border-[#262a35] space-y-2">
                <div className="font-bold text-blue-300 font-mono text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  La Courbe de l'Oubli d'Ebbinghaus inversée
                </div>
                <p>
                  Sans révision espacée, le cerveau humain oublie 70% des notions techniques complexes en 48 heures.
                  Le moteur SRS de CertifAI calcule la date exacte où la probabilité de rappel descend sous 85%, pour te faire réviser la carte au moment le plus efficace mathématiquement.
                </p>
              </div>

              {/* The 5 Key Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#131722] border border-[#262a35] space-y-1">
                  <div className="font-bold font-mono text-white text-[11px] text-blue-400">1. Identifiant unique</div>
                  <p className="text-[11px] text-slate-400">
                    Chaque fiche (ex: Carte #127) possède son propre modèle d'historique indépendant.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#131722] border border-[#262a35] space-y-1">
                  <div className="font-bold font-mono text-white text-[11px] text-emerald-400">2. Difficulté adaptative (1/5 à 5/5)</div>
                  <p className="text-[11px] text-slate-400">
                    S'adapte dynamiquement selon tes réponses. Une carte hésitante monte à 4 ou 5/5.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#131722] border border-[#262a35] space-y-1">
                  <div className="font-bold font-mono text-white text-[11px] text-amber-400">3. Prochaine révision au jour près</div>
                  <p className="text-[11px] text-slate-400">
                    Calculée via l'Ease Factor (EF) : 1j → 3j → 7j → 14j → 30j+.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#131722] border border-[#262a35] space-y-1">
                  <div className="font-bold font-mono text-white text-[11px] text-purple-400">4. Répétitions &amp; Taux de réussite</div>
                  <p className="text-[11px] text-slate-400">
                    Suivi statistique des succès (ex: 4 répétitions consécutives, 75% de réussite).
                  </p>
                </div>
              </div>

              {/* SM-2 Formula Card */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 font-mono text-[11px] space-y-2">
                <div className="font-bold text-blue-300">Formule Mathématique SM-2 Implémentée :</div>
                <div className="bg-[#0a0e18] p-3 rounded-xl border border-blue-500/20 text-slate-200">
                  EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))<br />
                  Intervalle(n) = Intervalle(n-1) * EF
                </div>
                <div className="text-slate-400 text-[10px]">
                  Où q est votre note de rappel (1 = Revoir, 3 = Difficile, 4 = Bien, 5 = Facile).
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsAlgorithmModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-colors"
              >
                Compris, continuer mes révisions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
