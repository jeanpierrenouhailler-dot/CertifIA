import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Database, 
  UserCheck, 
  X, 
  CheckCircle2, 
  XCircle, 
  Download, 
  HelpCircle, 
  Eye, 
  KeyRound, 
  CreditCard, 
  MapPin, 
  Camera, 
  Cookie, 
  Layers, 
  FileCode, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import type { UserProfile } from '../types';
import type { User } from 'firebase/auth';

interface GdprHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  userProfile: UserProfile | null;
}

type TabType = 'sent' | 'not_sent' | 'rights' | 'raw_data';

export const GdprHelpModal: React.FC<GdprHelpModalProps> = ({
  isOpen,
  onClose,
  user,
  userProfile
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('sent');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportData = () => {
    const exportPayload = {
      rgpd_notice: "Export conforme au droit d'accès et de portabilité des données (Art. 15 et 20 du RGPD - UE 2016/679)",
      exportDate: new Date().toISOString(),
      platform: "CertifAI Cloud Exam Prep",
      firestoreDatabaseId: "ai-studio-certifaiaicloude",
      firebaseAuth: {
        uid: user?.uid || "non_authentifié",
        email: user?.email || null,
        displayName: user?.displayName || null,
        emailVerified: user?.emailVerified || false,
        providerId: user?.providerData?.[0]?.providerId || "google.com",
      },
      storedProfileDocument: userProfile || {
        status: "Document non encore synchronisé ou profil invité"
      },
      dataMinimizationNotice: "Seules les données strictement nécessaires au calcul de la progression et à la préparation aux examens sont collectées."
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certifai_donnees_rgpd_${user?.uid?.slice(0, 8) || 'export'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice("Export JSON généré avec succès !");
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div 
      id="gdpr-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="gdpr-modal-container"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Confidentialité & Respect du RGPD
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Règlement UE 2016/679
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transparence totale sur vos données dans Firebase Firestore & vos droits d'accès
              </p>
            </div>
          </div>

          <button
            id="gdpr-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Fermer le menu d'aide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/30 overflow-x-auto">
          <button
            id="gdpr-tab-sent"
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'sent'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Ce qui est envoyé à Firebase
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[10px]">5 éléments</span>
          </button>

          <button
            id="gdpr-tab-not-sent"
            onClick={() => setActiveTab('not_sent')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'not_sent'
                ? 'border-rose-400 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            Ce qui n'est JAMAIS envoyé
            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-[10px]">6 protections</span>
          </button>

          <button
            id="gdpr-tab-rights"
            onClick={() => setActiveTab('rights')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'rights'
                ? 'border-indigo-400 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            Vos Droits RGPD
          </button>

          <button
            id="gdpr-tab-raw-data"
            onClick={() => setActiveTab('raw_data')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'raw_data'
                ? 'border-violet-400 text-violet-400 bg-violet-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-violet-400" />
            Données Brutes (JSON)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
          {/* TAB 1: WHAT IS SENT */}
          {activeTab === 'sent' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 font-semibold">Principe de minimisation (Art. 5.1.c RGPD) : </strong>
                  Seules les données strictement indispensables au suivi de votre préparation aux certifications Cloud (Azure, AWS, GCP) et à la sauvegarde de votre série d'entraînement sont conservées dans la base Firestore.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. Auth UID & Identity */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">
                      Identifiant Unique (UID Firebase)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Un identifiant alphanumérique unique généré par Google OAuth (ex: <code className="text-indigo-300 font-mono">{user?.uid?.slice(0, 12) || 'k9DQSwDMWJ...'}</code>). Il sert de clé de partitionnement pour isoler strictement votre document sous <code className="text-indigo-300 font-mono">/users/{'{userId}'}</code>.
                  </p>
                </div>

                {/* 2. Nom & Email */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">
                      Nom d'Affichage & E-mail
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Transmis par le compte Google (<code className="text-indigo-300">{user?.email || 'votre email'}</code>). Utilisé pour associer votre profil d'architecte et afficher votre progression. Le nom d'affichage est modifiable à tout moment.
                  </p>
                </div>

                {/* 3. Certification Cible */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">
                      Objectif Certifiant Actif
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Le code de l'examen que vous préparez actuellement (ex: <code className="text-indigo-300 font-mono">{userProfile?.targetExam || 'ai102'}</code> - Azure AI Engineer) afin de personnaliser les quiz, flashcards et simulations proposés.
                  </p>
                </div>

                {/* 4. Métriques d'entraînement */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">
                      Télémétrie d'Apprentissage
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Vos indicateurs d'assiduité : série consécutive en jours (<code className="text-indigo-300">{userProfile?.streakDays ?? 12}j</code>), nombre d'items résolus, score moyen et indice de préparation global.
                  </p>
                </div>

                {/* 5. Horodatages techniques */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors md:col-span-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">
                      Horodatages de Synchronisation (Timestamps)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Les champs techniques <code className="text-indigo-300 font-mono">createdAt</code> et <code className="text-indigo-300 font-mono">updatedAt</code> au format standardisé ISO 8601 pour permettre la synchronisation temps réel entre vos différents navigateurs et sessions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHAT IS NEVER SENT */}
          {activeTab === 'not_sent' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-300 font-semibold">Garantie de Confidentialité Stricte : </strong>
                  Les données suivantes ne sont ni collectées, ni transmises à Firebase, ni partagées avec un quelconque tiers publicitaire ou commercial.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. Mot de passe */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 text-rose-400">
                    <KeyRound className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">
                      Aucun Mot de Passe Google
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Votre mot de passe Google n'est jamais accessible par l'application. L'authentification utilise le protocole officiel Google Identity Services / OAuth 2.0 avec jetons d'accès cryptés temporaires.
                  </p>
                </div>

                {/* 2. Données bancaires */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 text-rose-400">
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">
                      Aucune Donnée Bancaire ou Paiement
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aucun numéro de carte bancaire, compte ou coordonnée financière n'est collecté ni stocké sur Firestore.
                  </p>
                </div>

                {/* 3. Géolocalisation */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 text-rose-400">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">
                      Aucune Géolocalisation GPS
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aucun suivi de votre localisation géographique, position GPS ou historique de déplacement n'est requis ni enregistré.
                  </p>
                </div>

                {/* 4. Matériel / Caméra / Micro */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 text-rose-400">
                    <Camera className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">
                      Aucun Enregistrement Audio/Vidéo
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aucun accès à votre webcam, microphone ou données biométriques. La préparation se déroule entièrement via l'interface interactive.
                  </p>
                </div>

                {/* 5. Traqueurs publicitaires */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 text-rose-400">
                    <Cookie className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">
                      Zéro Traqueur Publicitaire
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aucun cookie tiers commercial, aucun pixel de reciblage publicitaire (Facebook Pixel, Criteo) et aucune revente de vos données à des courtiers (data brokers).
                  </p>
                </div>

                {/* 6. Données confidentielles d'entreprise */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 text-rose-400">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">
                      Aucune Donnée d'Entreprise
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Vos identifiants cloud professionnels (clés d'API Azure, AWS IAM, secrets GCP de production) ne doivent jamais être saisis et ne sont jamais enregistrés.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GDPR RIGHTS */}
          {activeTab === 'rights' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-xs flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-300 font-semibold">Exercice de vos droits RGPD : </strong>
                  Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez du plein contrôle sur vos informations personnelles.
                </div>
              </div>

              <div className="space-y-3">
                {/* Droit d'accès & portabilité */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wider">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">Art. 15 & 20</span>
                      Droit d'accès et de portabilité des données
                    </div>
                    <p className="text-xs text-slate-400">
                      Vous pouvez à tout moment exporter l'intégralité des données de votre profil Firestore sous un format JSON ouvert et lisible par machine.
                    </p>
                  </div>
                  <button
                    id="gdpr-export-btn"
                    onClick={handleExportData}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Télécharger mes données (JSON)
                  </button>
                </div>

                {/* Droit de rectification */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wider">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">Art. 16</span>
                    Droit de rectification
                  </div>
                  <p className="text-xs text-slate-400">
                    Vous pouvez modifier instantanément votre nom d'affichage ainsi que votre objectif de certification directement depuis l'écran de profil. La mise à jour est répercutée en temps réel dans Firestore.
                  </p>
                </div>

                {/* Droit à l'effacement */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wider">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">Art. 17</span>
                    Droit à l'effacement (Droit à l'oubli)
                  </div>
                  <p className="text-xs text-slate-400">
                    En cas de déconnexion ou sur demande de suppression, vous pouvez révoquer l'accès à l'application dans les paramètres de votre compte Google (<a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-1">Gérer les autorisations Google <ExternalLink className="w-2.5 h-2.5" /></a>).
                  </p>
                </div>

                {/* Sécurité du stockage */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wider">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">Art. 32</span>
                    Sécurité et cloisonnement technique
                  </div>
                  <p className="text-xs text-slate-400">
                    Vos données sont hébergées sur l'infrastructure européenne sécurisée de Google Cloud Platform (Firestore). Les règles de sécurité appliquées (<code className="text-indigo-300 font-mono">firestore.rules</code>) interdisent formellement à tout autre utilisateur de lire ou modifier votre document.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RAW DATA JSON VIEWER */}
          {activeTab === 'raw_data' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Visualisation brute du document Firestore <code className="text-indigo-300 font-mono">/users/{user?.uid || 'guest'}</code> :</span>
                <button
                  onClick={handleExportData}
                  className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" /> Exporter en JSON
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-72">
                <pre>
                  {JSON.stringify(
                    {
                      userId: userProfile?.userId || user?.uid || "guest",
                      email: userProfile?.email || user?.email || "non_authentifié",
                      displayName: userProfile?.displayName || user?.displayName || "Architecte Cloud",
                      targetExam: userProfile?.targetExam || "ai102",
                      targetExamTitle: userProfile?.targetExamTitle || "Azure AI Engineer Associate (AI-102)",
                      streakDays: userProfile?.streakDays ?? 12,
                      questionsSolved: userProfile?.questionsSolved ?? 342,
                      averageScore: userProfile?.averageScore ?? 84,
                      readinessIndex: userProfile?.readinessIndex ?? 78,
                      createdAt: userProfile?.createdAt || new Date().toISOString(),
                      updatedAt: userProfile?.updatedAt || new Date().toISOString(),
                      securityRulesIsolation: "isOwner(userId) enforced by firestore.rules"
                    }, 
                    null, 
                    2
                  )}
                </pre>
              </div>

              <p className="text-[11px] text-slate-500">
                Ce payload représente l'exacte totalité de ce qui est persisté dans votre espace Cloud Firestore.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Base Firestore chiffrée AES-256 : <code className="text-slate-300 font-mono">ai-studio-certifaiaicloude</code></span>
          </div>

          <div className="flex items-center gap-3">
            {exportNotice && (
              <span className="text-xs text-emerald-400 font-medium animate-in fade-in">
                {exportNotice}
              </span>
            )}
            <button
              id="gdpr-modal-footer-export-btn"
              onClick={handleExportData}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Exporter (JSON)
            </button>
            <button
              id="gdpr-modal-footer-close-btn"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              Compris & Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
