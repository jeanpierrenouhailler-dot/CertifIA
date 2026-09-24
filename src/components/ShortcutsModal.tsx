import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Espace', desc: "Retourner la fiche mémoire (SRS) / Valider l'étape" },
    { key: '1, 2, 3, 4', desc: "Sélectionner les options A, B, C, D en QCM ou voter la difficulté SM-2" },
    { key: 'F', desc: "Marquer / Démarquer la question active pour révision" },
    { key: '← / →', desc: "Passer à la question ou carte précédente / suivante" },
    { key: 'P', desc: "Mettre en pause l'examen blanc officiel" },
    { key: 'Ctrl + K', desc: "Ouvrir la recherche globale et les blueprints" },
    { key: 'Échap', desc: "Fermer les fenêtres modales ou le drawer latéral" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#171b26] border border-[#262a35] rounded-2xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#262a35] mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white font-headline text-base">
                Raccourcis Clavier CertifAI
              </h3>
              <p className="text-xs text-slate-400">
                Accélérez vos sessions d'entraînement et de simulation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#262a35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#0f131d]/60 border border-[#262a35]/60"
            >
              <span className="text-xs text-slate-300">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-[#1c1f2a] border border-[#313540] text-xs font-mono font-semibold text-blue-300 shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#262a35] flex items-center justify-between">
          <span className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5" />
            Optimisé pour révisions intensives
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20"
          >
            Compris
          </button>
        </div>
      </div>
    </div>
  );
};
