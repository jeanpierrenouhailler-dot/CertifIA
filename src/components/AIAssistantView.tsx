import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  HelpCircle, 
  Lightbulb, 
  AlertTriangle, 
  BookOpen, 
  Target, 
  Layers, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Award
} from 'lucide-react';
import { AppScreen } from '../types';
import { PageHeader } from './ui/PageHeader';
import { certificationsData } from '../data/certificationsData';

interface AIAssistantViewProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint?: (certId: string) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  onNavigate,
  onOpenBlueprint,
}) => {
  const [selectedCert, setSelectedCert] = useState('ai102');
  const [selectedTopic, setSelectedTopic] = useState('RAG & Recherche Hybride');
  const [queryInput, setQueryInput] = useState('');
  const [activeTab, setActiveTab] = useState<'concepts' | 'traps' | 'mnemonics' | 'custom'>('concepts');

  const topicsByCert: Record<string, string[]> = {
    ai102: [
      'RAG & Recherche Hybride Vectorielle',
      'Content Safety & Regex Custom Blocklists',
      'Azure AI Search Semantic Ranker',
      'Fine-Tuning LoRA vs In-Context Learning',
      'Document Intelligence & Modèles Pré-entraînés',
      'Isolation Réseau VNet & Private Endpoints',
    ],
    aifc01: [
      'Fondamentaux AWS Bedrock & Foundation Models',
      'Guardrails for Amazon Bedrock',
      'Différences Amazon Kendra vs OpenSearch Vector',
      'Responsabilité Partagée en IA Cloud',
      'Amazon Q Business & Cas d’usage Entreprise',
    ],
    gcpmle: [
      'Vertex AI Feature Store & Pipelines Kubeflow',
      'Optimisation d’Hyperparamètres Vizier',
      'Dérive de Données (Data Drift) & Monitoring',
      'TensorFlow Serving vs TorchServe sur GKE',
      'Explainable AI & Valeurs de Shapley',
    ],
    ai900: [
      'Principes d’IA Responsable Microsoft (6 piliers)',
      'Computer Vision : Classification vs Détection d’objets',
      'Speech & Language : Traduction et Synthèse Vocale',
      'Azure Machine Learning Studio Automated ML',
    ],
    c1000177: [
      'watsonx.ai Model Studio & Inférence',
      'watsonx.governance Factsheets & Lignées de données',
      'watsonx.data Lakehouse & Apache Iceberg',
      'Détection des Hallucinations & Biais IBM',
    ],
  };

  const currentTopics = topicsByCert[selectedCert] || topicsByCert.ai102;
  const currentCertData = certificationsData.find((c) => c.id === selectedCert) || certificationsData[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Assistant Pédagogique IA"
        subtitle="Tuteur intelligent calibré sur les référentiels officiels Cloud AI pour accélérer votre assimilation et déjouer les pièges d’examen."
        badge="Accompagnement IA"
        breadcrumbs={[
          { label: 'Accueil', onClick: () => onNavigate('today') },
          { label: 'Assistant IA', active: true },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('quiz')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171b26] dark:hover:bg-[#202533] border border-slate-200 dark:border-[#262a35] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
            >
              <Target className="w-4 h-4 text-blue-500" />
              S’entraîner
            </button>
            <button
              onClick={() => onNavigate('flashcards')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              Fiches Mémo
            </button>
          </div>
        }
      />

      {/* Target Certification Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Certification Cible</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{currentCertData.code} - {currentCertData.title}</span>
              {onOpenBlueprint && (
                <button
                  onClick={() => onOpenBlueprint(selectedCert)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-normal"
                >
                  (Voir Blueprint)
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {certificationsData.slice(0, 5).map((cert) => (
            <button
              key={cert.id}
              onClick={() => {
                setSelectedCert(cert.id);
                setSelectedTopic(topicsByCert[cert.id]?.[0] || 'Général');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                selectedCert === cert.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#202533] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#262c3d]'
              }`}
            >
              {cert.code}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Topic selector on left, Interactive pedagogical panel on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topics of the cert */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Notions au Programme</span>
              <span>{currentTopics.length} clés</span>
            </div>

            <div className="space-y-1.5">
              {currentTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between group ${
                    selectedTopic === topic
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/30 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202533] border border-transparent'
                  }`}
                >
                  <span className="truncate pr-2">{topic}</span>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${selectedTopic === topic ? 'text-blue-500 translate-x-0.5' : 'text-slate-400 opacity-40 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Study Methodology Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent border border-blue-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 font-mono uppercase">
              <Sparkles className="w-4 h-4" />
              Méthodologie CertifIA
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Pour chaque notion : lisez l’explication théorique, identifiez les <strong>pièges d’examen</strong>, puis testez votre rétention via les <strong>Fiches Mémo SRS</strong>.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400">Rétention moyenne</span>
              <span className="text-emerald-500 font-mono">+84 %</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Pedagogical Breakdown */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#262a35] pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('concepts')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'concepts'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#1a2030] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#252d42]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Explication Pédagogique
            </button>
            <button
              onClick={() => setActiveTab('traps')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'traps'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#1a2030] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#252d42]'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Pièges d’Examen Officiels
            </button>
            <button
              onClick={() => setActiveTab('mnemonics')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'mnemonics'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#1a2030] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#252d42]'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Astuces Mnémotechniques
            </button>
          </div>

          {/* Active Card Content */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#262a35] flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Notion Active • {currentCertData.code}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-headline mt-0.5">
                  {selectedTopic}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('quiz')}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300 hover:bg-blue-500/20 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <span>QCM associé</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TAB: Explication */}
            {activeTab === 'concepts' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  Dans l'examen <strong>{currentCertData.code} ({currentCertData.title})</strong>, le sujet <strong>{selectedTopic}</strong> fait l'objet de questions scénarisées basées sur des besoins d'entreprise concrets (latence, coûts, sécurité des données).
                </p>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35] space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase font-mono tracking-wider text-blue-600 dark:text-blue-400">
                    Les 3 Piliers Clés à Maîtriser
                  </h4>
                  <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm">
                    <li>
                      <strong>Architecture nominale</strong> : Utiliser l’approche modulaire adaptée sans sur-dimensionner l’infrastructure de calcul.
                    </li>
                    <li>
                      <strong>Sécurité & Conformité</strong> : Chiffrement en transit et au repos (Customer-Managed Keys), conformité RGPD/HIPAA et isolation VNet.
                    </li>
                    <li>
                      <strong>Observabilité</strong> : Journalisation des traces d’inférence, calcul du P99 de latence et analyse des dérives de prompt.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-blue-700 dark:text-blue-300">Règle d'or pour le jour J :</strong>
                    Ne choisissez jamais une solution personnalisée longue à développer si un service managé natif du fournisseur répond au besoin avec moins de code.
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Pièges */}
            {activeTab === 'traps' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-700 dark:text-amber-400 uppercase">
                    <AlertTriangle className="w-4 h-4" />
                    Piège n°1 : Choix entre RAG et Fine-Tuning
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    L’examen présente souvent un cas où des documents internes sont mis à jour toutes les semaines. 
                    <strong className="text-rose-600 dark:text-rose-400"> Réponse piège :</strong> fine-tuner le modèle chaque semaine (coûteux, risque de catastrophe forgetting). 
                    <strong className="text-emerald-600 dark:text-emerald-400"> Bonne réponse :</strong> indexation vectorielle RAG avec Semantic Ranker.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-700 dark:text-amber-400 uppercase">
                    <AlertTriangle className="w-4 h-4" />
                    Piège n°2 : Mauvaise gestion des filtres de sécurité
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    Les filtres de modération intégrés ne bloquent pas automatiquement la propriété intellectuelle de votre entreprise sans ajout d'une liste de blocage personnalisée (*Custom Blocklist*).
                  </p>
                </div>
              </div>
            )}

            {/* TAB: Mnémotechnique */}
            {activeTab === 'mnemonics' && (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold font-mono text-purple-700 dark:text-purple-300 uppercase">
                    <Lightbulb className="w-4 h-4" />
                    Moyen Mnémotechnique CertifIA : Formule « R-A-G »
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-lg bg-white dark:bg-[#1a2030] border border-purple-500/20 text-center">
                      <div className="text-lg font-extrabold text-purple-600 dark:text-purple-400 font-mono">R</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Récupérer</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Top-K chunks vectoriels</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-[#1a2030] border border-purple-500/20 text-center">
                      <div className="text-lg font-extrabold text-purple-600 dark:text-purple-400 font-mono">A</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Augmenter</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Injecter dans le prompt système</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-[#1a2030] border border-purple-500/20 text-center">
                      <div className="text-lg font-extrabold text-purple-600 dark:text-purple-400 font-mono">G</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Générer</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Synthèse avec sources citées</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
