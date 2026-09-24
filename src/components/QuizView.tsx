import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Clock, 
  Award, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  ZoomIn, 
  Sparkles, 
  AlertTriangle,
  Layers,
  Search,
  ShieldCheck,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { QuizQuestion, AppScreen } from '../types';
import { quizQuestionsData, quizMatrixItems } from '../data/quizData';

interface QuizViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (certId: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onNavigate, onOpenBlueprint }) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(1); // Index 1 is Q7 in our set
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>('A');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(true);
  const [isFlagged, setIsFlagged] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(872); // 14:32
  const [isDiagramExpanded, setIsDiagramExpanded] = useState(false);

  // Live timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ: QuizQuestion = quizQuestionsData[activeQuestionIndex] || quizQuestionsData[1];

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    setSelectedOption(key);
  };

  const handleValidate = () => {
    setIsAnswerRevealed(true);
  };

  const handleNext = () => {
    if (activeQuestionIndex < quizQuestionsData.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    }
  };

  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
      setSelectedOption('A');
      setIsAnswerRevealed(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1c1f2a]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1.5 flex-wrap">
            <button 
              onClick={() => onOpenBlueprint ? onOpenBlueprint('ai102') : onNavigate('catalogue')}
              className="text-blue-400 hover:underline flex items-center gap-1"
            >
              Track Azure AI-102
            </button>
            <span>/</span>
            <span>Module 03</span>
            <span>/</span>
            <span className="text-slate-200">Déploiement GenAI & RAG</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-headline">
            Entraînement : Architectures RAG & Indexation Vectorielle
          </h1>
        </div>

        {/* Telemetry badges */}
        <div className="flex items-center gap-2.5">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171b26] border border-[#262a35] text-xs font-mono text-slate-200">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          {/* Current Session Score */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171b26] border border-[#262a35] text-xs font-mono">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">Score :</span>
            <span className="text-emerald-400 font-bold">6/7 (85.7%)</span>
          </div>

          {/* Flag button */}
          <button
            onClick={() => setIsFlagged(!isFlagged)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isFlagged
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-[#171b26] text-slate-400 hover:text-white border border-[#262a35]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Marquer pour révision</span>
          </button>
        </div>
      </div>

      {/* Global Progress Bar Strip */}
      <div className="p-4 rounded-2xl bg-[#171b26] border border-[#262a35]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 mb-2">
          <span className="font-semibold text-white">
            Question {currentQ.code === 'Q-7294' ? '7' : activeQuestionIndex + 1} sur 20 • Indexation & Recherche Vectorielle
          </span>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Seuil requis : 700 / 1000 pts</span>
            <span className="text-blue-400 font-bold">Progression : 35%</span>
          </div>
        </div>
        <div className="w-full h-2 bg-[#0a0e18] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: '35%' }}
          />
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question & Options & Explanation (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Card */}
          <div className="p-6 rounded-2xl bg-[#171b26] border border-[#262a35] shadow-xl">
            {/* Meta row */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  {currentQ.code}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentQ.type}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Pondération : {currentQ.points} pts
              </span>
            </div>

            {/* Architecture Badge */}
            {currentQ.architectureBadge && (
              <div className="mb-4 p-3 rounded-xl bg-[#0f131d] border border-blue-500/20 flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                  <Layers className="w-4 h-4" />
                </span>
                <div className="text-xs">
                  <span className="font-semibold text-blue-300 font-mono">
                    {currentQ.architectureBadge.title} :{' '}
                  </span>
                  <span className="text-slate-300 font-mono">
                    {currentQ.architectureBadge.subtitle}
                  </span>
                </div>
              </div>
            )}

            {/* Scenario */}
            <p className="text-sm text-slate-200 leading-relaxed mb-4">
              {currentQ.scenario}
            </p>

            {/* Prompt */}
            <div className="p-3.5 rounded-xl bg-[#0f131d]/90 border-l-4 border-blue-500 text-sm font-semibold text-white">
              {currentQ.question}
            </div>

            {/* Options List */}
            <div className="mt-6 space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrect = currentQ.correctKey === opt.key;
                
                let optionStyle = 'border-[#262a35] bg-[#0f131d]/60 hover:bg-[#0f131d] text-slate-200';
                let badgeStyle = 'bg-[#1c1f2a] text-slate-300 border-[#313540]';

                if (isAnswerRevealed) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-500/50 bg-emerald-950/25 text-emerald-100 ring-1 ring-emerald-500/30';
                    badgeStyle = 'bg-emerald-500 text-slate-950 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-rose-500/50 bg-rose-950/25 text-rose-100 ring-1 ring-rose-500/30';
                    badgeStyle = 'bg-rose-500 text-white font-bold';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-blue-500 bg-blue-950/30 text-white ring-1 ring-blue-500/40';
                  badgeStyle = 'bg-blue-500 text-white font-bold';
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${optionStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-mono text-xs transition-colors ${badgeStyle}`}
                    >
                      {opt.key}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs sm:text-sm font-medium leading-relaxed">
                        {opt.text}
                      </div>
                      {opt.subtext && (
                        <div className="text-[11px] text-slate-400 mt-1 font-mono leading-normal">
                          {opt.subtext}
                        </div>
                      )}
                    </div>
                    {isAnswerRevealed && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswerRevealed && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action buttons if not revealed */}
            {!isAnswerRevealed && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleValidate}
                  disabled={!selectedOption}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
                >
                  Valider la réponse
                </button>
              </div>
            )}
          </div>

          {/* Pedagogical Explanation Panel */}
          {isAnswerRevealed && (
            <div className="p-6 rounded-2xl bg-[#171b26] border border-emerald-500/30 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Explication Technique Validée • Option {currentQ.correctKey}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {currentQ.explanation.mainReason}
              </p>

              {/* Highlights badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentQ.explanation.highlights.map((h, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#0f131d] border border-[#262a35]">
                    <div className="text-xs font-semibold text-blue-300 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      {h.title}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      {h.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Traps and distractors breakdown */}
              <div className="p-4 rounded-xl bg-[#0f131d] border border-[#262a35] space-y-2.5">
                <div className="text-xs font-mono font-semibold uppercase text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Décryptage des Pièges & Distracteurs
                </div>
                <div className="space-y-2">
                  {currentQ.explanation.traps.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="font-mono font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 shrink-0 text-[10px]">
                        Option {t.key}
                      </span>
                      <span className="text-slate-300 leading-relaxed">{t.reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Doc Reference Box */}
              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">
                    {currentQ.explanation.officialDocTitle}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {currentQ.explanation.officialDocSubtitle}
                  </div>
                </div>
                <a
                  href={currentQ.explanation.officialDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white text-xs font-medium transition-colors"
                >
                  <span>Microsoft Learn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={activeQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#171b26] border border-[#262a35] disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Précédente (Q6)</span>
            </button>

            <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">
              Raccourci : Espace ou Touche 1-4 pour répondre
            </span>

            <button
              onClick={handleNext}
              disabled={activeQuestionIndex >= quizQuestionsData.length - 1}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition-colors shadow-md shadow-blue-600/20"
            >
              <span>Suivante (Q8)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Reference Schema & Domain Telemetry & 20-Questions Grid (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Reference Architecture Schema Card */}
          <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                Schéma de Référence
              </div>
              <button
                onClick={() => setIsDiagramExpanded(!isDiagramExpanded)}
                className="p-1 text-slate-400 hover:text-white"
                title="Agrandir le schéma"
                aria-label="Agrandir le schéma"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* SVG Interactive Architecture Pipeline */}
            <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] overflow-hidden">
              <svg viewBox="0 0 320 180" className="w-full h-auto">
                <rect width="320" height="180" rx="8" fill="#0a0e18" />
                
                {/* Blob Store */}
                <rect x="15" y="20" width="70" height="42" rx="6" fill="#171b26" stroke="#262a35" strokeWidth="1.5" />
                <text x="50" y="38" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Azure Blob</text>
                <text x="50" y="50" fill="#64748b" fontSize="7" textAnchor="middle">450k Contrats</text>

                {/* Arrow to AI Search */}
                <path d="M85 41 H115" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
                <polygon points="118,41 113,38 113,44" fill="#3b82f6" />

                {/* AI Search Hub */}
                <rect x="120" y="15" width="85" height="54" rx="6" fill="#1c2438" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="162" y="32" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Azure AI Search</text>
                <text x="162" y="44" fill="#60a5fa" fontSize="7" textAnchor="middle">Index Hybride BM25</text>
                <text x="162" y="56" fill="#4edea3" fontSize="7" textAnchor="middle">+ Vecteurs text-3</text>

                {/* Arrow to Semantic Ranker */}
                <path d="M162 69 V90" stroke="#4edea3" strokeWidth="1.5" />
                <polygon points="162,93 159,88 165,88" fill="#4edea3" />

                {/* Semantic Ranker Box */}
                <rect x="110" y="95" width="105" height="32" rx="6" fill="#172e27" stroke="#10b981" strokeWidth="1.5" />
                <text x="162" y="108" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Semantic Ranker (L2)</text>
                <text x="162" y="120" fill="#6ee7b7" fontSize="7" textAnchor="middle">RRF Reciprocal Rank</text>

                {/* Arrow to OpenAI */}
                <path d="M215 111 H235" stroke="#818cf8" strokeWidth="1.5" />
                <polygon points="238,111 233,108 233,114" fill="#818cf8" />

                {/* Azure OpenAI LLM */}
                <rect x="240" y="90" width="70" height="42" rx="6" fill="#201a38" stroke="#8b5cf6" strokeWidth="1.5" />
                <text x="275" y="108" fill="#c4b5fd" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Azure OpenAI</text>
                <text x="275" y="120" fill="#a78bfa" fontSize="7" textAnchor="middle">GPT-4o RAG Prompt</text>

                {/* Output tag */}
                <rect x="100" y="145" width="120" height="22" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="160" y="159" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Latence Moyenne : 240 ms</text>
              </svg>
            </div>
            <p className="text-[11px] text-slate-400">
              Pipeline complet avec reranking bi-directionnel et isolation réseau VNet.
            </p>
          </div>

          {/* Domain Skills Gauges */}
          <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-3.5">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              Compétences par Domaine
            </div>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">GenAI & Solutions RAG</span>
                  <span className="font-mono text-emerald-400 font-semibold">85%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Computer Vision Azure</span>
                  <span className="font-mono text-rose-400 font-semibold">54%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: '54%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Traitement Langage & Speech</span>
                  <span className="font-mono text-blue-400 font-semibold">72%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">IA Responsable & Sécurité</span>
                  <span className="font-mono text-amber-400 font-semibold">62%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '62%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Grille de Navigation (20 Questions Matrix) */}
          <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold uppercase tracking-wider text-slate-300">
                Grille de Navigation
              </span>
              <span className="text-slate-400 font-mono text-[11px]">20 Questions</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {quizMatrixItems.map((item) => {
                let btnStyle = 'bg-[#0f131d] text-slate-400 border-[#262a35] hover:border-slate-500';
                
                if (item.status === 'correct') {
                  btnStyle = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
                } else if (item.status === 'incorrect') {
                  btnStyle = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
                } else if (item.status === 'active') {
                  btnStyle = 'bg-blue-600 text-white font-bold border-blue-400 ring-2 ring-blue-500/40 shadow-md shadow-blue-600/30';
                }

                return (
                  <button
                    key={item.num}
                    onClick={() => {
                      if (item.num === 7) {
                        setActiveQuestionIndex(1);
                        setIsAnswerRevealed(true);
                        setSelectedOption('A');
                      } else if (item.num === 1) {
                        setActiveQuestionIndex(0);
                        setIsAnswerRevealed(true);
                        setSelectedOption('A');
                      } else if (item.num === 8) {
                        setActiveQuestionIndex(2);
                        setIsAnswerRevealed(true);
                        setSelectedOption('A');
                      }
                    }}
                    className={`h-9 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center transition-all ${btnStyle}`}
                  >
                    {item.num}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-[#262a35]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Correct (5)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Erreur (1)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Actif (Q7)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
