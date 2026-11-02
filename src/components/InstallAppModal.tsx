import React from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Globe 
} from 'lucide-react';
import { usePwa } from '../context/PwaContext';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstalled } = usePwa();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#151a26] text-slate-800 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-blue-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-[#262a35] flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#0f131d]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Installation Progressive Web App
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-headline text-slate-900 dark:text-white mt-0.5">
                Installer CertifIA sur votre Écran
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#262a35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-sm">Application déjà installée !</div>
                <div className="text-[11px] opacity-80">
                  CertifIA est configuré en mode standalone sur votre appareil. Vous pouvez la lancer directement depuis votre écran d'accueil.
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Ajoutez CertifIA directement sur l'écran d'accueil de votre smartphone, tablette ou bureau PC/Mac pour une expérience plein écran ultra-rapide et accessible hors-ligne.
            </p>
          )}

          {/* Instructions Tabs / Accordion */}
          <div className="space-y-3.5">
            {/* iOS Safari */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span>Sur iPhone &amp; iPad (Safari)</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <li>
                  Appuyez sur l'icône de <strong className="text-blue-600 dark:text-blue-400">Partage</strong> (le carré avec une flèche vers le haut <Share className="w-3 h-3 inline text-blue-500" /> en bas de l'écran).
                </li>
                <li>
                  Faites défiler vers le bas et touchez <strong className="text-slate-900 dark:text-white">« Sur l'écran d'accueil »</strong> (<PlusSquare className="w-3 h-3 inline text-slate-500" />).
                </li>
                <li>
                  Confirmez en appuyant sur <strong className="text-blue-600 dark:text-blue-400">Ajouter</strong> en haut à droite. L'icône CertifIA apparaîtra sur votre écran.
                </li>
              </ol>
            </div>

            {/* Android Chrome */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>Sur Android (Chrome &amp; Edge)</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <li>
                  Appuyez sur les <strong className="text-emerald-600 dark:text-emerald-400">3 points verticaux</strong> en haut à droite du navigateur.
                </li>
                <li>
                  Sélectionnez <strong className="text-slate-900 dark:text-white">« Installer l'application »</strong> ou <strong className="text-slate-900 dark:text-white">« Ajouter à l'écran d'accueil »</strong>.
                </li>
                <li>
                  Validez : CertifIA s'installe comme une véritable application native.
                </li>
              </ol>
            </div>

            {/* Desktop PC / Mac */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#262a35] space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                <Monitor className="w-4 h-4 text-indigo-500" />
                <span>Sur Ordinateur (Chrome, Edge, Brave)</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Repérez la petite icône d'<strong className="text-indigo-600 dark:text-indigo-400">écran avec flèche</strong> dans la barre d'adresse de votre navigateur (à droite de l'URL), puis cliquez sur <em>« Installer »</em>. L'application s'ouvrira dans sa propre fenêtre autonome dédiée sans barre d'outils.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Aucun passage par l'App Store ou le Play Store requis. Zéro compte supplémentaire !</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-[#262a35] bg-slate-50 dark:bg-[#0f131d]/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md"
          >
            Compris, merci !
          </button>
        </div>

      </div>
    </div>
  );
};
