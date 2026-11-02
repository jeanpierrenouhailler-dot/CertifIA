import React from 'react';
import { 
  Home, 
  Compass, 
  GraduationCap, 
  BarChart3, 
  Bot, 
  Menu
} from 'lucide-react';
import { AppScreen } from '../types';

interface MobileBottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenAIAssistant: () => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenAIAssistant,
  onOpenMenu,
}) => {
  const isApprentissageActive = ['quiz', 'flashcards', 'exam', 'recommendation'].includes(currentScreen);
  const isCertificationsActive = currentScreen === 'catalogue';
  const isAccueilActive = currentScreen === 'today';
  const isProgressionActive = currentScreen === 'analytics';
  const isAssistantActive = currentScreen === 'assistant';

  return (
    <nav 
      aria-label="Navigation principale mobile"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0f131d]/95 backdrop-blur-xl border-t border-slate-200 dark:border-[#1c1f2a] px-1 py-1 flex items-center justify-around shadow-2xl safe-area-pb"
    >
      {/* 1. Accueil */}
      <button
        onClick={() => onNavigate('today')}
        className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all ${
          isAccueilActive
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label="Accueil CertifIA"
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Accueil</span>
      </button>

      {/* 2. Certifications */}
      <button
        onClick={() => onNavigate('catalogue')}
        className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all ${
          isCertificationsActive
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label="Certifications et Blueprints"
      >
        <Compass className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Certifs</span>
      </button>

      {/* 3. Apprentissage */}
      <button
        onClick={() => onNavigate('quiz')}
        className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all ${
          isApprentissageActive
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label="Apprentissage et entraînement"
      >
        <GraduationCap className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Apprendre</span>
      </button>

      {/* 4. Progression */}
      <button
        onClick={() => onNavigate('analytics')}
        className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all ${
          isProgressionActive
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label="Progression et statistiques"
      >
        <BarChart3 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Progrès</span>
      </button>

      {/* 5. Assistant IA */}
      <button
        onClick={onOpenAIAssistant}
        className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all ${
          isAssistantActive
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label="Assistant Pédagogique IA"
      >
        <div className="relative">
          <Bot className="w-5 h-5 mb-0.5 text-blue-500 dark:text-blue-400" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </div>
        <span className="text-[10px] tracking-tight">Tuteur IA</span>
      </button>

      {/* 6. Plus / Menu Drawer */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
        aria-label="Menu complémentaire et paramètres"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Plus</span>
      </button>
    </nav>
  );
};
