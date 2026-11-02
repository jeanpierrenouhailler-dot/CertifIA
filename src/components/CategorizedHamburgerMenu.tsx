import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Target, 
  Sparkles, 
  Compass, 
  CheckSquare, 
  Layers, 
  Clock, 
  BarChart3, 
  User, 
  Settings, 
  Download, 
  Moon, 
  Sun, 
  HelpCircle, 
  Scale, 
  ChevronRight, 
  Award,
  Zap,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { AppScreen } from '../types';
import { CertifAILogo } from './CertifAILogo';
import { useTheme } from '../context/ThemeContext';
import { useGuide } from '../context/GuideContext';
import { usePwa } from '../context/PwaContext';
import { useSystemUpdate } from '../context/SystemUpdateContext';

interface CategorizedHamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenSystemSettings: () => void;
  onOpenBlueprint?: (certId: string) => void;
}

export const CategorizedHamburgerMenu: React.FC<CategorizedHamburgerMenuProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onNavigate,
  onOpenSystemSettings,
  onOpenBlueprint,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { isGuideModeActive, toggleGuideMode, openLegalModal } = useGuide();
  const { isInstalled, promptInstall } = usePwa();
  const { versionInfo } = useSystemUpdate();

  if (!isOpen) return null;

  const categories = [
    {
      id: 'session',
      title: '🎯 Session & Orientation',
      description: 'Pilotage quotidien et trajectoire personnalisée',
      items: [
        {
          id: 'today' as AppScreen,
          label: "Aujourd'hui",
          subtitle: 'Votre session quotidienne (17 cartes SM-2 + 8 fragiles + 12 QCM)',
          icon: Target,
          badge: '🎯 Prioritaire',
          badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20',
        },
        {
          id: 'recommendation' as AppScreen,
          label: 'Parcours IA',
          subtitle: 'Moteur d’orientation sur-mesure du Niveau 1 au Niveau 4',
          icon: Sparkles,
          badge: '4 Niveaux',
          badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20',
        },
      ],
    },
    {
      id: 'study',
      title: '📚 Révisions & Entraînement',
      description: 'Apprentissage granulaire et répétition espacée',
      items: [
        {
          id: 'catalogue' as AppScreen,
          label: 'Catalogue Certifications',
          subtitle: '18 référentiels officiels Azure, AWS, Google Cloud, IBM',
          icon: Compass,
          badge: '18 Certifs',
          badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
        },
        {
          id: 'quiz' as AppScreen,
          label: 'Entraînement QCM',
          subtitle: 'Questions d’architecture corrigées avec pièges officiels',
          icon: CheckSquare,
          badge: 'QCM Examen',
          badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20',
        },
        {
          id: 'flashcards' as AppScreen,
          label: 'Fiches Mémo SRS',
          subtitle: 'Algorithme SuperMemo-2 / FSRS au seuil d’oubli calculé',
          icon: Layers,
          badge: 'SM-2 Actif',
          badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20',
        },
      ],
    },
    {
      id: 'evaluation',
      title: '⏱️ Évaluation & Spécifications',
      description: 'Mesure en conditions réelles et référentiels officiels',
      items: [
        {
          id: 'exam' as AppScreen,
          label: 'Examen Blanc Chronométré',
          subtitle: 'Épreuve live chronométrée 90 min (seuil éliminatoire 700 pts)',
          icon: Clock,
          badge: 'Live Simulation',
          badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20',
        },
      ],
    },
    {
      id: 'tracking',
      title: '📊 Télémétrie & Compte',
      description: 'Analytics de progression et synchronisation cloud',
      items: [
        {
          id: 'analytics' as AppScreen,
          label: 'Analytics & Rétention',
          subtitle: 'Courbes de progression, séries (streak) et indice de préparation',
          icon: BarChart3,
          badge: 'Télémétrie',
          badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20',
        },
        {
          id: 'profile' as AppScreen,
          label: 'Mon Profil & Objectifs',
          subtitle: 'Connexion Firebase, calendrier cible et volume hebdomadaire',
          icon: User,
          badge: 'Profil Cloud',
          badgeColor: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20',
        },
      ],
    },
  ];

  const handleSelectScreen = (screen: AppScreen) => {
    onNavigate(screen);
    onClose();
  };

  const filteredCategories = filterQuery.trim()
    ? categories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter(
            (item) =>
              item.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
              item.subtitle.toLowerCase().includes(filterQuery.toLowerCase()) ||
              cat.title.toLowerCase().includes(filterQuery.toLowerCase())
          ),
        }))
        .filter((cat) => cat.items.length > 0)
    : categories;

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-out Drawer Container */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white dark:bg-[#0c101b] text-slate-800 dark:text-slate-100 h-full shadow-2xl border-r border-slate-200 dark:border-[#1c1f2a] flex flex-col z-10 animate-in slide-in-from-left duration-250">
        
        {/* Top Header of Drawer */}
        <div className="p-5 border-b border-slate-200 dark:border-[#1c1f2a] bg-slate-50 dark:bg-[#080b13] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CertifAILogo />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
              Menu Catégorisé
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1a2030] transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Search Input */}
        <div className="p-4 border-b border-slate-200 dark:border-[#1c1f2a] bg-white dark:bg-[#0c101b]">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrer les fonctionnalités (ex: SRS, QCM, Examen)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Categorized Items List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-xs">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
                  {cat.title}
                </span>
                <span className="text-[10px] text-slate-400">
                  {cat.items.length} module{cat.items.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-1.5">
                {cat.items.map((item) => {
                  const isActive = currentScreen === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectScreen(item.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 group ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-600/15 border-blue-500/40 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'bg-slate-50/70 hover:bg-slate-100 dark:bg-[#131722] dark:hover:bg-[#1c2233] border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-[#0a0e18] text-slate-600 dark:text-slate-400 group-hover:text-blue-500 border border-slate-200 dark:border-[#262a35]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                        isActive ? 'text-blue-500' : 'text-slate-400'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Blueprint Jump Box */}
          {onOpenBlueprint && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-[#131722] dark:to-[#0a0e18] border border-slate-200 dark:border-[#262a35] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-500" />
                  Accès Direct Blueprints Officiels
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'ai102', code: 'AI-102' },
                  { id: 'aifc01', code: 'AIF-C01' },
                  { id: 'gcpmle', code: 'GCP-PMLE' },
                  { id: 'watsonx', code: 'watsonx' },
                  { id: 'mlsc01', code: 'MLS-C01' },
                  { id: 'ai900', code: 'AI-900' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onOpenBlueprint(b.id);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg text-center font-mono text-[11px] font-bold bg-white dark:bg-[#1a2030] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#262a35] transition-colors"
                  >
                    {b.code}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Quick Tools & System Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1c1f2a] bg-slate-50 dark:bg-[#080b13] space-y-2">
          
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {/* Toggle Theme: Clair / Sombre */}
            <button
              id="hamburger-btn-theme"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#131722] hover:bg-slate-100 dark:hover:bg-[#1a2030] text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2"
              title="Basculer Thème Clair / Thème Sombre"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Thème Clair</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-500" />
                  <span>Thème Sombre</span>
                </>
              )}
            </button>

            {/* Toggle Guide Novice */}
            <button
              id="hamburger-btn-guide"
              onClick={toggleGuideMode}
              className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center gap-1.5 ${
                isGuideModeActive
                  ? 'border-blue-500/40 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold'
                  : 'border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#131722] text-slate-500 dark:text-slate-400'
              }`}
              title="Activer/Désactiver les infobulles contextuelles pour débutants"
            >
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>{isGuideModeActive ? 'Guide : ON' : 'Guide : OFF'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
            {/* Paramètres Système */}
            <button
              onClick={() => {
                onClose();
                onOpenSystemSettings();
              }}
              className="p-2 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-200 hover:text-blue-500 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-blue-500" />
              <span>Système</span>
            </button>

            {/* Mentions Légales */}
            <button
              onClick={() => {
                onClose();
                openLegalModal();
              }}
              className="p-2 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-200 hover:text-blue-500 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-amber-500" />
              <span>Mentions</span>
            </button>

            {/* Installer PWA */}
            <button
              onClick={() => {
                onClose();
                promptInstall();
              }}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              title="Installer sur l'écran d'accueil"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Installer</span>
            </button>
          </div>

          <div className="pt-1 text-center text-[10px] font-mono text-slate-400">
            CertifIA {versionInfo.version} • Mises à jour auto actives
          </div>
        </div>

      </div>
    </div>
  );
};
