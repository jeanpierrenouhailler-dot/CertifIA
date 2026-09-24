import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Pause, 
  Play, 
  Bookmark, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Flag, 
  FileCheck, 
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { AppScreen } from '../types';
import { examQuestionsBank, getInitialExamGrid } from '../data/examData';

interface ExamViewProps {
  onNavigate: (screen: AppScreen) => void;
}

export const ExamView: React.FC<ExamViewProps> = ({ onNavigate }) => {
  const [currentQNum, setCurrentQNum] = useState(28);
  const [gridItems, setGridItems] = useState(getInitialExamGrid);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(4468); // 01:14:28
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (isPaused || isExamCompleted) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExamCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isExamCompleted]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentItem = gridItems.find((item) => item.number === currentQNum) || gridItems[27];
  const questionDetail = examQuestionsBank[currentQNum] || examQuestionsBank[28];

  const answeredCount = gridItems.filter((i) => i.status === 'answered' || (i.status === 'flagged' && i.selectedOption)).length;
  const flaggedCount = gridItems.filter((i) => i.status === 'flagged').length;
  const unvisitedCount = gridItems.filter((i) => i.status === 'unvisited').length;
  const progressPercent = Math.round((answeredCount / gridItems.length) * 100);

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    setGridItems((prev) =>
      prev.map((item) => {
        if (item.number === currentQNum) {
          return {
            ...item,
            selectedOption: key,
            status: item.status === 'flagged' ? 'flagged' : 'answered',
          };
        }
        return item;
      })
    );
  };

  const handleToggleFlag = () => {
    setGridItems((prev) =>
      prev.map((item) => {
        if (item.number === currentQNum) {
          return {
            ...item,
            status: item.status === 'flagged' ? (item.selectedOption ? 'answered' : 'unvisited') : 'flagged',
          };
        }
        return item;
      })
    );
  };

  const handleNext = () => {
    if (currentQNum < 65) {
      setCurrentQNum((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQNum > 1) {
      setCurrentQNum((prev) => prev - 1);
    }
  };

  const handleJumpToFirstFlagged = () => {
    const firstFlagged = gridItems.find((i) => i.status === 'flagged');
    if (firstFlagged) {
      setCurrentQNum(firstFlagged.number);
    }
  };

  const handleJumpToFirstUnvisited = () => {
    const firstUnvisited = gridItems.find((i) => i.status === 'unvisited');
    if (firstUnvisited) {
      setCurrentQNum(firstUnvisited.number);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Mode Examen Blanc Surveillé */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171b26] via-[#121520] to-[#0a0e18] border border-[#262a35] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                AIF-C01 • v2024.3
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Mode Surveillance Active
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white font-headline mt-1">
              AWS Certified AI Practitioner — Simulation Officielle
            </h1>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3">
          {/* Digital Timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a0e18] border border-blue-500/30 text-white font-mono shadow-inner">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm sm:text-base font-bold tracking-wider">
              {formatTimer(timeLeftSeconds)}
            </span>
          </div>

          {/* Pause Button */}
          <button
            onClick={() => setIsPaused(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171b26] text-slate-300 hover:text-white border border-[#262a35] text-xs font-semibold transition-colors"
          >
            <Pause className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Pause</span>
          </button>

          {/* Terminer l'Examen */}
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Terminer l'examen</span>
          </button>
        </div>
      </div>

      {/* Telemetry Strip */}
      <div className="p-4 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-3 font-semibold text-white">
            <span>Question {currentQNum} sur 65</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-emerald-400 font-mono">{answeredCount} répondues</span>
            <span className="text-purple-400 font-mono">{flaggedCount} marquées</span>
            <span className="text-slate-400 font-mono">{unvisitedCount} sans réponse</span>
          </div>
          <span className="text-blue-400 font-mono font-bold text-xs">
            Progression : {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#0a0e18] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Question & Radio Options (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#171b26] border border-[#262a35] shadow-xl space-y-6">
            {/* Meta Row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-blue-300 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                {questionDetail.domain}
              </span>

              {/* Flag Toggle Button */}
              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  currentItem.status === 'flagged'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'bg-[#0f131d] text-slate-400 hover:text-white border border-[#262a35]'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${currentItem.status === 'flagged' ? 'fill-purple-400 text-purple-400' : ''}`} />
                <span>{currentItem.status === 'flagged' ? 'Marquée pour révision' : 'Marquer pour révision'}</span>
              </button>
            </div>

            {/* Scenario */}
            <p className="text-sm text-slate-200 leading-relaxed">
              {questionDetail.scenario}
            </p>

            {/* Prompt */}
            <div className="p-4 rounded-xl bg-[#0f131d] border-l-4 border-blue-500 text-sm font-semibold text-white">
              {questionDetail.question}
            </div>

            {/* Radio Choices */}
            <div className="space-y-3 pt-2">
              {questionDetail.options.map((opt) => {
                const isSelected = currentItem.selectedOption === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/30 text-white ring-1 ring-blue-500/40 shadow-md'
                        : 'border-[#262a35] bg-[#0f131d]/60 hover:bg-[#0f131d] text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-[#1c1f2a] text-slate-400 border border-[#313540]'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Official Scoring Note */}
            <div className="p-3 rounded-xl bg-[#0f131d]/80 border border-[#262a35] flex items-center gap-2 text-xs text-slate-400">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Barème officiel AWS : Score requis 700 / 1000 pts. Aucune pénalité pour réponse incorrecte (répondez à toutes les questions).
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#262a35]">
              <button
                onClick={handlePrev}
                disabled={currentQNum <= 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#0f131d] border border-[#262a35] disabled:opacity-30 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédente (Q{currentQNum - 1})</span>
              </button>

              <span className="text-xs font-mono text-slate-400">
                Question {currentQNum} / 65
              </span>

              <button
                onClick={handleNext}
                disabled={currentQNum >= 65}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-30 transition-colors shadow-md shadow-blue-600/20"
              >
                <span>Suivante (Q{currentQNum + 1})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 65-Questions Grid & Pace Telemetry (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 65 Questions Grid */}
          <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold uppercase tracking-wider text-slate-300">
                Grille d'Examen
              </span>
              <span className="text-slate-400 font-mono text-[11px]">65 Questions</span>
            </div>

            {/* Quick jump filter buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleJumpToFirstFlagged}
                className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-medium bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20 transition-colors"
              >
                Sauter vers 1ère marquée (Q7)
              </button>
              <button
                onClick={handleJumpToFirstUnvisited}
                className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-medium bg-[#0f131d] text-slate-300 hover:text-white border border-[#262a35] transition-colors"
              >
                1ère sans réponse (Q28)
              </button>
            </div>

            {/* The 65 cells Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-1.5 max-h-80 overflow-y-auto pr-1">
              {gridItems.map((item) => {
                const isActive = item.number === currentQNum;
                let cellClass = 'bg-[#0f131d] text-slate-400 border-[#262a35] hover:border-slate-500';

                if (isActive) {
                  cellClass = 'bg-blue-600 text-white font-bold border-blue-400 ring-2 ring-blue-500/50 shadow-md shadow-blue-600/30';
                } else if (item.status === 'flagged') {
                  cellClass = 'bg-purple-600/25 text-purple-200 border-purple-500/50 font-semibold';
                } else if (item.status === 'answered') {
                  cellClass = 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40';
                }

                return (
                  <button
                    key={item.number}
                    onClick={() => setCurrentQNum(item.number)}
                    className={`h-8 rounded-lg border text-xs font-mono font-semibold flex items-center justify-center transition-all ${cellClass}`}
                  >
                    {item.number}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-[#262a35] grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400 text-center">
              <span className="flex items-center gap-1 justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Répondu
              </span>
              <span className="flex items-center gap-1 justify-center">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Marqué
              </span>
              <span className="flex items-center gap-1 justify-center">
                <span className="w-2 h-2 rounded-full bg-[#313540]" />
                Non visité
              </span>
            </div>
          </div>

          {/* Pace & Time Telemetry Card */}
          <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-3">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              Télémétrie d'Allure
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#0f131d] border border-[#262a35]">
                <span className="text-slate-400">Temps moyen par question</span>
                <span className="font-mono font-bold text-white">1m 18s</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#0f131d] border border-[#262a35]">
                <span className="text-slate-400">Cadence nominale requise</span>
                <span className="font-mono font-bold text-slate-300">1m 18s / q</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#0f131d] border border-[#262a35]">
                <span className="text-slate-400">Marge projetée restante</span>
                <span className="font-mono font-bold text-emerald-400">+12 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pause Modal Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#171b26] border border-[#262a35] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto flex items-center justify-center">
              <Pause className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-headline">
                Examen en Pause
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Le compte à rebours est suspendu. Vous pouvez vous hydrater ou souffler avant de reprendre votre session.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0a0e18] border border-[#262a35] font-mono text-sm text-blue-400">
              Temps restant : {formatTimer(timeLeftSeconds)}
            </div>
            <button
              onClick={() => setIsPaused(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/25 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Reprendre l'épreuve</span>
            </button>
          </div>
        </div>
      )}

      {/* Submission Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#171b26] border border-[#262a35] rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#262a35]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-headline">
                    Confirmer la Soumission
                  </h3>
                  <p className="text-xs text-slate-400">
                    Examen AWS Certified AI Practitioner (AIF-C01)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Breakdown summary */}
            <div className="space-y-3">
              <div className="flex justify-between p-3 rounded-xl bg-[#0f131d] text-xs">
                <span className="text-slate-300">Questions traitées</span>
                <span className="font-mono font-bold text-emerald-400">{answeredCount} / 65</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#0f131d] text-xs">
                <span className="text-slate-300">Questions marquées pour révision</span>
                <span className="font-mono font-bold text-purple-400">{flaggedCount}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#0f131d] text-xs">
                <span className="text-slate-300">Questions sans réponse</span>
                <span className="font-mono font-bold text-rose-400">{unvisitedCount}</span>
              </div>
            </div>

            {unvisitedCount > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Attention : {unvisitedCount} questions n'ont reçu aucune réponse. L'examen ne comporte aucun point négatif, il est fortement conseillé de répondre à toutes les questions.
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#0f131d] hover:bg-[#262a35] text-slate-300 text-xs font-semibold border border-[#262a35] transition-colors"
              >
                Revenir à l'examen
              </button>
              <button
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  setIsExamCompleted(true);
                  onNavigate('analytics');
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all"
              >
                Soumettre et voir les résultats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
