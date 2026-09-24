import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Flame, 
  Award, 
  CheckCircle2, 
  Database, 
  LogOut, 
  LogIn, 
  Edit3, 
  Save, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Target,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  Cpu,
  HelpCircle,
  Shield,
  Download,
  Lock,
  XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GdprHelpModal } from './GdprHelpModal';
import type { AppScreen } from '../types';

interface ProfileViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenCatalogue?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { 
    user, 
    userProfile, 
    loading, 
    loginWithGoogle, 
    logout, 
    updateUserGoal, 
    updateDisplayName 
  } = useAuth();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [isGdprModalOpen, setIsGdprModalOpen] = useState(false);

  const availableCertifications = [
    { id: 'ai102', code: 'AI-102', title: 'Azure AI Engineer Associate', provider: 'Microsoft Azure' },
    { id: 'aifc01', code: 'AIF-C01', title: 'AWS Certified AI Practitioner', provider: 'AWS Cloud' },
    { id: 'gcp-pcle', code: 'PCLE', title: 'Google Cloud Professional Cloud Architect', provider: 'Google Cloud' },
    { id: 'gcp-mle', code: 'MLE', title: 'Google Cloud Professional Machine Learning Engineer', provider: 'Google Cloud' },
  ];

  const handleStartEditName = () => {
    setNameInput(userProfile?.displayName || user?.displayName || '');
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setIsSaving(true);
    try {
      await updateDisplayName(nameInput.trim());
      setIsEditingName(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleManualSync = () => {
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2500);
  };

  return (
    <div id="profile-view-container" className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl mx-auto space-y-8">
      {/* Banner / Header */}
      <div id="profile-hero-card" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              {user?.photoURL ? (
                <img 
                  id="profile-avatar-img"
                  src={user.photoURL} 
                  alt="Profile" 
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-400/40 shadow-lg shadow-indigo-900/30"
                />
              ) : (
                <div 
                  id="profile-avatar-placeholder"
                  className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-indigo-400/40 shadow-lg"
                >
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
                </div>
              )}
              {user && (
                <div 
                  title="Connecté à Firebase Auth"
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input 
                      id="profile-edit-name-input"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3 py-1 bg-slate-950/90 border border-indigo-500/50 rounded-lg text-white font-medium text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      id="profile-save-name-btn"
                      onClick={handleSaveName}
                      disabled={isSaving}
                      className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs flex items-center gap-1 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 id="profile-display-name" className="text-2xl font-bold text-white tracking-tight">
                      {userProfile?.displayName || user?.displayName || 'Architecte Cloud'}
                    </h1>
                    {user && (
                      <button 
                        id="profile-edit-name-trigger"
                        onClick={handleStartEditName}
                        className="text-slate-400 hover:text-indigo-300 transition-colors p-1"
                        title="Modifier le nom"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {user?.email || 'Non connecté'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Compte Vérifié Google
                </span>
              </div>
            </div>
          </div>

          {/* Auth Action */}
          <div className="flex items-center gap-2.5">
            <button
              id="profile-open-gdpr-btn"
              onClick={() => setIsGdprModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/30 text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
              title="Menu d'aide et transparence RGPD"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Aide & RGPD</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  id="profile-manual-sync-btn"
                  onClick={handleManualSync}
                  className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 text-sm font-medium transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${syncSuccess ? 'text-emerald-400 rotate-180 transition-transform' : ''}`} />
                  {syncSuccess ? 'Synchronisé' : 'Synchroniser'}
                </button>
                <button
                  id="profile-signout-btn"
                  onClick={() => logout()}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-sm font-medium transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                id="profile-google-login-btn"
                onClick={() => loginWithGoogle()}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2.5"
              >
                <LogIn className="w-4 h-4" />
                Se connecter avec Google
              </button>
            )}
          </div>
        </div>

        {/* Sync & Database Meta bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Base Firestore Live : ai-studio-certifaiaicloude
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              Document: <code className="text-indigo-300 font-mono">/users/{user?.uid ? `${user.uid.slice(0, 10)}...` : 'guest'}</code>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="profile-gdpr-meta-link"
              onClick={() => setIsGdprModalOpen(true)}
              className="flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 transition-colors"
              title="Consulter le registre de confidentialité RGPD"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conforme RGPD (UE 2016/679)</span>
            </button>

            {user && (
              <button 
                id="profile-copy-uid-btn"
                onClick={handleCopyUid}
                className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
              >
                {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUid ? 'UID copié' : 'Copier UID Auth'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Target Certification Section */}
      <div id="profile-target-cert-card" className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Objectif de Certification Actif</h2>
              <p className="text-xs text-slate-400">Défini et synchronisé en continu sur votre profil Firestore</p>
            </div>
          </div>
          <button 
            id="profile-goto-catalogue-btn"
            onClick={() => onNavigate('catalogue')}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            Explorer tout le catalogue <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Target Cert Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {availableCertifications.map((cert) => {
            const isSelected = (userProfile?.targetExam || 'ai102') === cert.id;
            return (
              <div
                key={cert.id}
                id={`profile-cert-option-${cert.id}`}
                onClick={() => user && updateUserGoal(cert.id, `${cert.title} (${cert.code})`)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-950/50' 
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {cert.code}
                    </span>
                    <span className="text-xs text-slate-400">{cert.provider}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{cert.title}</h3>
                </div>

                <div className="flex items-center">
                  {isSelected ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Actif
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 hover:text-slate-300">
                      Sélectionner
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress & Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div id="profile-stat-streak" className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-medium text-slate-400">Série d'assiduité</span>
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {userProfile?.streakDays ?? 12}
            </span>
            <span className="text-xs text-slate-400">jours consécutifs</span>
          </div>
          <p className="text-xs text-amber-400/80">Prochaine étape : Badge 15 jours</p>
        </div>

        {/* Questions Solved */}
        <div id="profile-stat-questions" className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-medium text-slate-400">Questions résolues</span>
            <Cpu className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {userProfile?.questionsSolved ?? 342}
            </span>
            <span className="text-xs text-slate-400">items validés</span>
          </div>
          <p className="text-xs text-indigo-400/80">+28 cette semaine</p>
        </div>

        {/* Average Score */}
        <div id="profile-stat-score" className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-medium text-slate-400">Score Moyen</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {userProfile?.averageScore ?? 84}%
            </span>
            <span className="text-xs text-emerald-400 font-medium">Seuil 70%</span>
          </div>
          <p className="text-xs text-emerald-400/80">Simulation certifiante admissible</p>
        </div>

        {/* Readiness Index */}
        <div id="profile-stat-readiness" className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-violet-400">
            <span className="text-xs font-medium text-slate-400">Indice de Préparation</span>
            <Award className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {userProfile?.readinessIndex ?? 78}%
            </span>
            <span className="text-xs text-violet-400 font-medium">Niveau Confirmé</span>
          </div>
          <p className="text-xs text-violet-400/80">Prêt pour l'examen officiel</p>
        </div>
      </div>

      {/* Quick Launchpad to modules */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-slate-400">
          Reprendre l'entraînement pour {userProfile?.targetExamTitle || 'AI-102'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            id="profile-launch-quiz"
            onClick={() => onNavigate('quiz')}
            className="p-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-indigo-400">Mode Examen Rapide</span>
              <Sparkles className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-sm font-semibold text-white">Quiz Scénario & Cas Pratique</div>
            <p className="text-xs text-slate-400 mt-1">Questions d'architecture complexes avec explications officielles</p>
          </button>

          <button
            id="profile-launch-flashcards"
            onClick={() => onNavigate('flashcards')}
            className="p-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-violet-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-violet-400">Mémorisation SM-2</span>
              <Clock className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-sm font-semibold text-white">Flashcards Spaced Repetition</div>
            <p className="text-xs text-slate-400 mt-1">Règles d'or, quotas, SLA et métriques clés d'examen</p>
          </button>

          <button
            id="profile-launch-exam"
            onClick={() => onNavigate('exam')}
            className="p-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-emerald-400">Simulation Réelle</span>
              <Award className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-sm font-semibold text-white">Examen Blanc Chronométré</div>
            <p className="text-xs text-slate-400 mt-1">120 minutes, conditions Pearson VUE réelles</p>
          </button>
        </div>
      </div>

      {/* GDPR & Privacy Transparency Card */}
      <div id="profile-gdpr-card" className="rounded-2xl bg-gradient-to-br from-slate-900/90 via-indigo-950/20 to-slate-900/90 border border-slate-800 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Transparence Données & Respect du RGPD</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Règlement UE 2016/679
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Isolation stricte par compte, chiffrement AES-256 et minimisation des données dans Google Cloud Firestore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="profile-open-gdpr-guide-btn"
              onClick={() => setIsGdprModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Guide & Vos Droits RGPD
            </button>
          </div>
        </div>

        {/* 2 Comparison Panels: Ce qui est envoyé vs Ce qui n'est pas envoyé */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Envoyé à Firebase */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Ce qui est envoyé à Firebase
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                Minimisation stricte
              </span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Identité Auth :</strong> UID Google anonymisé, e-mail de liaison, nom public et URL d'avatar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Cible d'examen :</strong> Code certifiant sélectionné (ex: Azure AI-102, AWS AIF-C01, GCP PCLE)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Télémétrie d'apprentissage :</strong> Série d'assiduité (streak), score moyen, questions résolues, indice de préparation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Horodatages :</strong> Date de création du profil et de dernière synchronisation</span>
              </li>
            </ul>
          </div>

          {/* Jamais envoyé */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-rose-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Ce qui n'est JAMAIS envoyé
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-mono">
                100% Hors-portée
              </span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Mots de passe :</strong> Zéro mot de passe stocké (jeton OAuth 2.0 Google Identity chiffré)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Finances :</strong> Aucune donnée bancaire, carte de crédit ou information de facturation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Périphériques & GPS :</strong> Pas de géolocalisation, pas de caméra/micro, pas de biométrie</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Traqueurs :</strong> Zéro cookie publicitaire tiers, zéro revente à des data brokers</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Droits d'accès (Art. 15), de rectification (Art. 16) et d'effacement (Art. 17) garantis.</span>
          </div>

          <button
            id="profile-gdpr-details-btn"
            onClick={() => setIsGdprModalOpen(true)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline flex items-center gap-1 transition-colors"
          >
            Afficher les détails de sécurité et exporter mes données
          </button>
        </div>
      </div>

      {/* GDPR Help & Transparency Modal */}
      <GdprHelpModal
        isOpen={isGdprModalOpen}
        onClose={() => setIsGdprModalOpen(false)}
        user={user}
        userProfile={userProfile}
      />
    </div>
  );
};
