import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  Target, 
  Award, 
  Clock, 
  BookOpen, 
  Layers, 
  Zap, 
  Flame, 
  Briefcase, 
  Compass, 
  GraduationCap, 
  DollarSign, 
  Globe, 
  RotateCcw, 
  Check, 
  ChevronRight, 
  FileText,
  HelpCircle,
  TrendingUp,
  Brain
} from 'lucide-react';
import { 
  AppScreen, 
  UserLevel, 
  UserRole, 
  UserPrimaryGoal, 
  UserBudget, 
  UserWeeklyTime, 
  UserLanguage, 
  UserCareerGoal,
  UserRecommendationProfile,
  PathwayPlan,
  PathwayLevel
} from '../types';
import { 
  LEVEL_OPTIONS, 
  ROLE_OPTIONS, 
  PRIMARY_GOAL_OPTIONS, 
  BUDGET_OPTIONS, 
  WEEKLY_TIME_OPTIONS, 
  LANGUAGE_OPTIONS, 
  CAREER_GOAL_OPTIONS, 
  DEFAULT_USER_PROFILE,
  generatePathways 
} from '../lib/recommendationEngine';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { certificationsData } from '../data/certificationsData';

interface RecommendationViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (certId: string) => void;
}

export const RecommendationView: React.FC<RecommendationViewProps> = ({ 
  onNavigate, 
  onOpenBlueprint 
}) => {
  const { userProfile } = useAuth();
  const { activeCertId, setActiveCertId, updateGoalTarget } = useProgress();

  // Load saved profile or defaults
  const [profile, setProfile] = useState<UserRecommendationProfile>(() => {
    try {
      const saved = localStorage.getItem('certifai_recommendation_profile_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      ...DEFAULT_USER_PROFILE,
      // If user profile has target exam, align primary goal
      primaryGoal: userProfile?.targetExam === 'aifc01' ? 'ia_generative' : 'cloud_ai',
    };
  });

  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>('primary-recommended');
  const [isDiagnosticMode, setIsDiagnosticMode] = useState<boolean>(false);
  const [adoptedFeedback, setAdoptedFeedback] = useState<string | null>(null);

  // Compute generated pathways
  const pathways = useMemo(() => {
    return generatePathways(profile, activeCertId, ['ai900']);
  }, [profile, activeCertId]);

  // Active pathway
  const activePathway = useMemo(() => {
    return pathways.find((p) => p.id === selectedPathwayId) || pathways[0];
  }, [pathways, selectedPathwayId]);

  // Save profile helper
  const handleUpdateProfile = <K extends keyof UserRecommendationProfile>(
    key: K, 
    value: UserRecommendationProfile[K]
  ) => {
    setProfile((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem('certifai_recommendation_profile_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Adopt cert as primary target
  const handleAdoptTarget = async (certId: string, certCode: string, certTitle: string) => {
    setActiveCertId(certId);
    try {
      await updateGoalTarget(certId, `${certCode} • ${certTitle}`);
    } catch {}
    setAdoptedFeedback(`${certCode} défini comme objectif actif !`);
    setTimeout(() => setAdoptedFeedback(null), 3000);
  };

  // Provider colors
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'azure':
        return 'border-blue-500/40 bg-blue-500/10 text-blue-300';
      case 'aws':
        return 'border-amber-500/40 bg-amber-500/10 text-amber-300';
      case 'gcp':
        return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
      case 'ibm':
        return 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300';
      default:
        return 'border-slate-500/40 bg-slate-500/10 text-slate-300';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 font-sans">
      
      {/* 1. Header Banner & Identity */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1c1f2a]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5" />
            <span>Moteur d'Orientation &amp; Diagnostic CertifIA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-headline tracking-tight">
            Le Moteur de Recommandation
          </h1>

          <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            CertifIA évalue votre niveau, votre métier et vos contraintes pour structurer votre feuille de route certifiante officielle du <strong>Niveau 1 (Fondations)</strong> jusqu'au <strong>Niveau 4 (Spécialisation)</strong>.
          </p>
        </div>

        {/* Diagnostic Toggle Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsDiagnosticMode(!isDiagnosticMode)}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 border shadow-lg ${
              isDiagnosticMode
                ? 'bg-blue-600 text-white border-blue-400 shadow-blue-600/30'
                : 'bg-[#171b26] hover:bg-[#262a35] text-blue-300 border-[#262a35] hover:border-blue-500/40'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isDiagnosticMode ? 'Masquer le questionnaire' : 'Ajuster mon profil & critères'}</span>
          </button>

          <button
            onClick={() => onNavigate('today')}
            className="px-4 py-2.5 rounded-xl bg-[#0f131d] hover:bg-[#1c2233] text-slate-300 hover:text-white border border-[#262a35] font-mono text-xs transition-colors flex items-center gap-2"
          >
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span>Session du jour</span>
          </button>
        </div>
      </div>

      {/* Adopted Target Toast Notification */}
      {adoptedFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-mono font-bold flex items-center justify-between shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{adoptedFeedback}</span>
          </div>
          <button 
            onClick={() => onNavigate('flashcards')}
            className="text-xs text-white underline underline-offset-2 hover:text-emerald-300"
          >
            Commencer à réviser →
          </button>
        </div>
      )}

      {/* 2. Interactive Diagnostic Stepper (Collapsible / Toggleable) */}
      {(isDiagnosticMode || !profile.completedAt) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#172033] via-[#171b26] to-[#0f131d] border border-blue-500/30 shadow-2xl space-y-8 animate-in fade-in duration-300">
          
          {/* Stepper Tabs */}
          <div className="flex items-center justify-between border-b border-[#262a35] pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveStep(1)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeStep === 1
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-[#0f131d] text-slate-400 hover:text-white'
                }`}
              >
                <span>1. Votre profil</span>
                <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center">1</span>
              </button>

              <button
                onClick={() => setActiveStep(2)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeStep === 2
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-[#0f131d] text-slate-400 hover:text-white'
                }`}
              >
                <span>2. Vos contraintes &amp; objectifs</span>
                <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center">2</span>
              </button>
            </div>

            <span className="text-xs font-mono text-blue-300">
              Étape {activeStep} sur 2
            </span>
          </div>

          {/* STEP 1: Votre profil (Niveau, Métier, Objectif) */}
          {activeStep === 1 && (
            <div className="space-y-8 animate-in fade-in">
              {/* Question 1: Quel est votre niveau ? */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                    A
                  </span>
                  <label className="text-sm font-bold text-white font-headline">
                    Quel est votre niveau ?
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {LEVEL_OPTIONS.map((opt) => {
                    const isSelected = profile.level === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleUpdateProfile('level', opt.id)}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/20 text-white ring-1 ring-blue-500'
                            : 'bg-[#0f131d] border-[#262a35] text-slate-300 hover:border-slate-600 hover:bg-[#131722]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{opt.icon}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">{opt.label}</div>
                          <div className="text-xs text-slate-400 mt-1 leading-snug">{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Votre métier ? */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                    B
                  </span>
                  <label className="text-sm font-bold text-white font-headline">
                    Votre métier ?
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {ROLE_OPTIONS.map((opt) => {
                    const isSelected = profile.role === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleUpdateProfile('role', opt.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                            : 'bg-[#0f131d] border-[#262a35] text-slate-300 hover:border-slate-600 hover:bg-[#131722]'
                        }`}
                      >
                        <span className="text-2xl mb-2">{opt.icon}</span>
                        <div>
                          <div className="font-bold text-xs text-white">{opt.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Votre objectif ? */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                    C
                  </span>
                  <label className="text-sm font-bold text-white font-headline">
                    Votre objectif ?
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {PRIMARY_GOAL_OPTIONS.map((opt) => {
                    const isSelected = profile.primaryGoal === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleUpdateProfile('primaryGoal', opt.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                            : 'bg-[#0f131d] border-[#262a35] text-slate-300 hover:border-slate-600 hover:bg-[#131722]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">{opt.icon}</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">{opt.label}</div>
                          <div className="text-[10px] text-slate-400 mt-1 leading-snug">{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation button to Step 2 */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>Continuer : Budget, Temps &amp; Objectif pro</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Contraintes (Budget, Temps disponible, Langue, Objectif pro) */}
          {activeStep === 2 && (
            <div className="space-y-8 animate-in fade-in">
              {/* Question 4: Budget */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                    D
                  </span>
                  <label className="text-sm font-bold text-white font-headline">
                    Quel est votre budget certifications ?
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {BUDGET_OPTIONS.map((opt) => {
                    const isSelected = profile.budget === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleUpdateProfile('budget', opt.id)}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                            : 'bg-[#0f131d] border-[#262a35] text-slate-300 hover:border-slate-600 hover:bg-[#131722]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {opt.priceTag}
                          </span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">{opt.label}</div>
                          <div className="text-[11px] text-slate-400 mt-1 leading-snug">{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 5: Temps disponible / semaine */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                    E
                  </span>
                  <label className="text-sm font-bold text-white font-headline">
                    Temps disponible / semaine
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {WEEKLY_TIME_OPTIONS.map((opt) => {
                    const isSelected = profile.weeklyTime === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleUpdateProfile('weeklyTime', opt.id)}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                            : 'bg-[#0f131d] border-[#262a35] text-slate-300 hover:border-slate-600 hover:bg-[#131722]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {opt.hoursDesc}
                          </span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">{opt.label}</div>
                          <div className="text-[11px] text-slate-400 mt-1 leading-snug">{opt.pacing}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 6: Langue & Question 7: Objectif professionnel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Langue */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                      F
                    </span>
                    <label className="text-sm font-bold text-white font-headline">
                      Langue préférée
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {LANGUAGE_OPTIONS.map((opt) => {
                      const isSelected = profile.language === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleUpdateProfile('language', opt.id)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                              : 'bg-[#0f131d] border-[#262a35] text-slate-300 hover:border-slate-600 hover:bg-[#131722]'
                          }`}
                        >
                          <div className="text-2xl mb-1">{opt.flag}</div>
                          <div className="font-bold text-xs text-white">{opt.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Objectif professionnel */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                      G
                    </span>
                    <label className="text-sm font-bold text-white font-headline">
                      Objectif professionnel
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CAREER_GOAL_OPTIONS.map((opt) => {
                      const isSelected = profile.careerGoal === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleUpdateProfile('careerGoal', opt.id)}
                          className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                              : 'bg-[#0f131d] border-[#262a35] text-slate-300 hover:border-slate-600 hover:bg-[#131722]'
                          }`}
                        >
                          <span className="text-lg shrink-0">{opt.icon}</span>
                          <div>
                            <div className="font-bold text-xs text-white">{opt.label}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{opt.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Finish Stepper */}
              <div className="pt-4 flex items-center justify-between border-t border-[#262a35]">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-[#0f131d] hover:bg-[#262a35] text-slate-300 font-mono text-xs font-medium transition-colors"
                >
                  ← Revenir à l'étape 1
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleUpdateProfile('completedAt', new Date().toISOString());
                    setIsDiagnosticMode(false);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-headline font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2.5 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>Construire mon Parcours IA CertifIA</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Output Section: « 🎯 Votre parcours IA » */}
      <div className="space-y-6">
        
        {/* Pathway Selection Tabs (Plusieurs parcours possibles selon le profil) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-[#171b26] border border-[#262a35]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-blue-400" />
              Moteur CertifIA • Parcours disponibles
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-headline mt-0.5 flex items-center gap-2">
              <span>🎯 Votre parcours IA</span>
            </h2>
          </div>

          {/* Multiple Pathways Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {pathways.map((p) => {
              const isSelected = p.id === selectedPathwayId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPathwayId(p.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/50'
                      : 'bg-[#0f131d] text-slate-400 hover:text-white border border-[#262a35]'
                  }`}
                >
                  <span>{p.badge}</span>
                  <span className="hidden sm:inline font-sans font-semibold text-[11px] text-slate-300">
                    ({p.matchScore}% Match)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Pathway Summary Bar */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#172033] to-[#121622] border border-blue-500/30 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-headline">
                  {activePathway.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {activePathway.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {activePathway.description}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-[#0a0e18] border border-[#262a35] text-xs font-mono text-center">
                <div className="text-[10px] text-slate-400">Durée estimée</div>
                <div className="font-bold text-emerald-400">~{activePathway.totalWeeks} semaines</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#0a0e18] border border-[#262a35] text-xs font-mono text-center">
                <div className="text-[10px] text-slate-400">Heures de travail</div>
                <div className="font-bold text-blue-400">~{activePathway.totalHours} heures</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#0a0e18] border border-[#262a35] text-xs font-mono text-center">
                <div className="text-[10px] text-slate-400">Coût estimé</div>
                <div className="font-bold text-amber-400">{activePathway.estimatedCost}</div>
              </div>
            </div>
          </div>

          {/* Highlights checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-3 border-t border-[#262a35]/80 text-[11px] font-mono text-slate-300">
            {activePathway.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. THE CORE 4-LEVEL CONNECTED FLOWCHART */}
        {/* 
            Niveau 1 : AI Fundamentals
                  ↓
            Niveau 2 : Generative AI
                  ↓
            Niveau 3 : Cloud AI
                  ↓
            Niveau 4 : Machine Learning / MLOps
        */}
        <div className="space-y-4 pt-2">
          {activePathway.levels.map((level, index) => {
            const isLast = index === activePathway.levels.length - 1;
            const certData = certificationsData.find((c) => c.id === level.certId);
            const isCurrentActiveTarget = activeCertId === level.certId;
            const isCompleted = level.status === 'completed';

            return (
              <React.Fragment key={level.levelNumber}>
                {/* Level Card */}
                <div className={`relative rounded-3xl p-6 sm:p-7 border transition-all shadow-xl group ${
                  isCurrentActiveTarget
                    ? 'bg-gradient-to-br from-[#1a233a] via-[#171b26] to-[#0f131d] border-blue-500 ring-1 ring-blue-500/50 shadow-blue-500/10'
                    : isCompleted
                    ? 'bg-gradient-to-br from-[#13221d] via-[#171b26] to-[#0f131d] border-emerald-500/40'
                    : 'bg-[#171b26] border-[#262a35] hover:border-slate-600'
                }`}>
                  
                  {/* Top Level Ribbon */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262a35]">
                    <div className="flex items-center gap-3">
                      {/* Level Number Badge */}
                      <div className={`w-10 h-10 rounded-2xl font-mono font-extrabold text-sm flex items-center justify-center shrink-0 shadow-inner ${
                        isCurrentActiveTarget
                          ? 'bg-blue-600 text-white shadow-blue-500/30'
                          : isCompleted
                          ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                          : 'bg-[#0f131d] text-slate-300 border border-[#262a35]'
                      }`}>
                        {isCompleted ? <Check className="w-5 h-5 text-white" /> : `N${level.levelNumber}`}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                            {level.levelTitle}
                          </span>
                          {isCurrentActiveTarget && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Cible Actuelle
                            </span>
                          )}
                          {isCompleted && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Validé ✓
                            </span>
                          )}
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-white font-headline mt-0.5">
                          {level.certCode} • {level.certTitle}
                        </h4>
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${getProviderColor(level.provider)}`}>
                        {level.providerName}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-medium bg-[#0f131d] text-slate-300 border border-[#262a35] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {level.estimatedWeeks} sem. (~{level.estimatedHours}h)
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-medium bg-[#0f131d] text-amber-300 border border-[#262a35]">
                        {level.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-5 items-center">
                    {/* Left: Subtitle & Rationale (7 cols) */}
                    <div className="lg:col-span-7 space-y-3">
                      <p className="text-xs text-slate-300 font-medium">
                        {level.subtitle}
                      </p>

                      <div className="p-3 rounded-2xl bg-[#0a0e18]/80 border border-[#262a35] text-xs space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-blue-300 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-400" />
                          Pourquoi ce niveau pour vous ?
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {level.rationale}
                        </p>
                      </div>

                      {/* Acquired Skills Pills */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                          Compétences clés validées :
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {level.skills.map((skill, si) => (
                            <span 
                              key={si}
                              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#1c2233] text-blue-200 border border-[#262a35]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: CertifIA Arsenal & Exam Stats (5 cols) */}
                    <div className="lg:col-span-5 p-4 rounded-2xl bg-[#0f131d] border border-[#262a35] space-y-3">
                      <div className="text-[11px] font-mono font-bold text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-400" />
                          Contenu disponible CertifIA
                        </span>
                        <span className="text-emerald-400">Prêt à l'emploi</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                        <div className="p-2 rounded-xl bg-[#171b26] border border-[#262a35]">
                          <div className="text-[10px] text-slate-400">Fiches SRS</div>
                          <div className="font-bold text-white mt-0.5">{level.cardsCount}</div>
                        </div>
                        <div className="p-2 rounded-xl bg-[#171b26] border border-[#262a35]">
                          <div className="text-[10px] text-slate-400">QCM Examen</div>
                          <div className="font-bold text-white mt-0.5">{level.questionsCount}</div>
                        </div>
                        <div className="p-2 rounded-xl bg-[#171b26] border border-[#262a35]">
                          <div className="text-[10px] text-slate-400">Seuil de réussite</div>
                          <div className="font-bold text-emerald-400 mt-0.5">70%</div>
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
                        <span>Score passage : {level.examPassScore}</span>
                        {certData && <span className="text-blue-300">Taux réussite moy. {certData.avgPassRate}%</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#262a35]/80">
                    <div className="flex flex-wrap items-center gap-2">
                      {!isCurrentActiveTarget && (
                        <button
                          onClick={() => handleAdoptTarget(level.certId, level.certCode, level.certTitle)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                        >
                          <Target className="w-3.5 h-3.5" />
                          <span>Définir comme cible active</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setActiveCertId(level.certId);
                          onNavigate('flashcards');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#0f131d] hover:bg-[#262a35] text-slate-300 hover:text-white border border-[#262a35] font-mono text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-400" />
                        <span>Réviser les fiches</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveCertId(level.certId);
                          onNavigate('quiz');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#0f131d] hover:bg-[#262a35] text-slate-300 hover:text-white border border-[#262a35] font-mono text-xs transition-colors flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Entraînement QCM</span>
                      </button>
                    </div>

                    {onOpenBlueprint && (
                      <button
                        onClick={() => onOpenBlueprint(level.certId)}
                        className="text-xs font-mono text-slate-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <span>Consulter le Blueprint officiel</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Vertical Connector Arrow (Niveau 1 ↓ Niveau 2 ↓ Niveau 3 ↓ Niveau 4) */}
                {!isLast && (
                  <div className="flex flex-col items-center justify-center my-1 select-none py-1">
                    <div className="w-0.5 h-4 bg-gradient-to-b from-blue-500/60 to-indigo-500/60" />
                    <div className="w-8 h-8 rounded-full bg-[#171b26] border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20 my-1 group-hover:scale-110 transition-transform">
                      <ArrowDown className="w-4 h-4 animate-bounce" />
                    </div>
                    <div className="w-0.5 h-4 bg-gradient-to-b from-indigo-500/60 to-blue-500/60" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 5. Coach Callout & Career Acceleration Tips */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#171b26] to-[#0f131d] border border-[#262a35] grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-1 md:col-span-2">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase">
            <GraduationCap className="w-4 h-4" />
            <span>Conseil Pédagogique CertifIA</span>
          </div>
          <h4 className="text-base font-bold text-white font-headline">
            Pourquoi structurer sa progression en 4 niveaux ?
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Aborder directement une certification Specialist comme <strong>Azure AI-102</strong> ou <strong>GCP-PMLE</strong> sans validation préalable des fondations génère un taux d'échec de 42%. Franchir les 4 paliers garantit une rétention durable et maximise votre valeur sur le marché de l'emploi tech.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => onNavigate('catalogue')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0f131d] hover:bg-[#262a35] text-slate-200 border border-[#262a35] text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Explorer tout le catalogue (18)</span>
          </button>

          <button
            onClick={() => onNavigate('today')}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Lancer ma session du jour</span>
          </button>
        </div>
      </div>
    </div>
  );
};
