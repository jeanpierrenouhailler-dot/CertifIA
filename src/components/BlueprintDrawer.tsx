import React from 'react';
import { X, ExternalLink, ArrowRight, BookOpen } from 'lucide-react';
import { Certification } from '../types';

interface BlueprintDrawerProps {
  certification: Certification | null;
  isOpen: boolean;
  onClose: () => void;
  onStartTraining: (certId: string) => void;
}

export const BlueprintDrawer: React.FC<BlueprintDrawerProps> = ({
  certification,
  isOpen,
  onClose,
  onStartTraining,
}) => {
  if (!isOpen || !certification) return null;

  // Colors for donut segments
  const sliceColors = ['#4d8eff', '#4edea3', '#a078ff', '#ffb4ab', '#60a5fa', '#f59e0b'];

  // Calculate SVG donut paths
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-xl bg-[#171b26] border-l border-[#262a35] shadow-2xl flex flex-col justify-between overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header */}
          <div className="p-6 border-b border-[#262a35] sticky top-0 bg-[#171b26]/95 backdrop-blur-md z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  {certification.code}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#262a35] text-slate-300">
                  {certification.providerName}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {certification.levelLabel}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#262a35] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-white font-headline">
              {certification.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Référentiel officiel des compétences et pondération d'examen
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* Donut & Key Metrics Overview */}
            <div className="p-5 rounded-2xl bg-[#0f131d] border border-[#262a35] flex flex-col sm:flex-row items-center gap-6">
              {/* Donut SVG */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="#1c1f2a"
                    strokeWidth="16"
                    fill="none"
                  />
                  {certification.domains.map((d, index) => {
                    const strokeDash = (d.percentage / 100) * circumference;
                    const strokeOffset = accumulatedOffset;
                    accumulatedOffset += strokeDash;
                    return (
                      <circle
                        key={index}
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke={sliceColors[index % sliceColors.length]}
                        strokeWidth="16"
                        strokeDasharray={`${strokeDash} ${circumference}`}
                        strokeDashoffset={-strokeOffset}
                        fill="none"
                        className="transition-all duration-700 ease-out"
                      />
                    );
                  })}
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-bold font-mono text-white">
                    {certification.domains.length}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    Domaines
                  </span>
                </div>
              </div>

              {/* Exam specs */}
              <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                <div className="p-2.5 rounded-xl bg-[#171b26] border border-[#262a35]/60">
                  <div className="text-[10px] text-slate-400 font-mono">Score de Passage</div>
                  <div className="text-sm font-bold font-mono text-blue-400 mt-0.5">
                    {certification.passScore} / {certification.maxScore} pts
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#171b26] border border-[#262a35]/60">
                  <div className="text-[10px] text-slate-400 font-mono">Durée Allouée</div>
                  <div className="text-sm font-bold font-mono text-slate-200 mt-0.5">
                    {certification.durationMinutes} minutes
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#171b26] border border-[#262a35]/60">
                  <div className="text-[10px] text-slate-400 font-mono">Volume Questions</div>
                  <div className="text-sm font-bold font-mono text-slate-200 mt-0.5">
                    {certification.itemsCount} QCM & Cas
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#171b26] border border-[#262a35]/60">
                  <div className="text-[10px] text-slate-400 font-mono">Taux Réussite Moyen</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {certification.avgPassRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Domains Breakdown List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                  Pondération Détaillée des Domaines
                </h3>
                <span className="text-xs text-slate-300 font-mono">
                  Maîtrise : {certification.userProgress}%
                </span>
              </div>

              <div className="space-y-3">
                {certification.domains.map((domain, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0f131d]/80 border border-[#262a35] hover:border-[#313540] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: sliceColors[idx % sliceColors.length] }}
                        />
                        <h4 className="text-sm font-semibold text-white">
                          {domain.name}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#171b26] text-blue-300 border border-[#262a35] shrink-0">
                        {domain.weight}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-3 pl-4 leading-relaxed">
                      {domain.description}
                    </p>

                    {/* Progress Bar for this domain */}
                    <div className="pl-4 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-[#171b26] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${domain.mastery}%`,
                            backgroundColor:
                              domain.mastery >= 75
                                ? '#4edea3'
                                : domain.mastery >= 50
                                ? '#adc6ff'
                                : '#ffb4ab',
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-400 shrink-0">
                        {domain.mastery}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Doc Link Box */}
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white">
                    Documentation Officielle de l'Examen
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Guide d'évaluation et compétences mesurées
                  </div>
                </div>
              </div>
              <a
                href={certification.docUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="Ouvrir le guide officiel"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-6 border-t border-[#262a35] bg-[#171b26]/95 backdrop-blur-md sticky bottom-0 flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#0f131d] border border-[#262a35] hover:bg-[#262a35] transition-all"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onStartTraining(certification.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/25 active:scale-[0.99]"
            >
              <span>S'entraîner sur ce blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
