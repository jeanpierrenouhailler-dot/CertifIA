import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  BookOpen, 
  GraduationCap, 
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { AppScreen } from '../types';
import { certificationsData } from '../data/certificationsData';

export interface AIAssistantContext {
  certId?: string;
  certCode?: string;
  topic?: string;
  questionText?: string;
  userSelection?: string;
  sourceScreen?: string;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context?: AIAssistantContext | null;
  onNavigate?: (screen: AppScreen) => void;
  onOpenBlueprint?: (certId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  context,
  onNavigate,
  onOpenBlueprint,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialContextPrompt = context?.topic 
    ? `Accompagnement pédagogique pour la notion : ${context.topic}${context.certCode ? ` (${context.certCode})` : ''}`
    : 'Comment puis-je vous aider dans vos révisions IA aujourd’hui ?';

  // Seed default welcome message or contextual greeting
  useEffect(() => {
    if (isOpen) {
      let initialMsg: ChatMessage;
      if (context?.questionText) {
        initialMsg = {
          id: 'ctx-q',
          sender: 'assistant',
          content: `Bonjour ! Je vois que vous travaillez sur la question suivante :\n\n> "${context.questionText.slice(0, 120)}..."\n\nSouhaitez-vous une explication détaillée de la bonne réponse, les pièges classiques ou une astuce mnémotechnique ?`,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            'Expliquer pourquoi cette réponse est la bonne',
            'Quels sont les pièges typiques d’examen ?',
            'Donne-moi une astuce mnémotechnique',
            'Quelle est la différence clé à retenir ?',
          ],
        };
      } else if (context?.certId) {
        const cert = certificationsData.find((c) => c.id === context.certId);
        initialMsg = {
          id: 'ctx-cert',
          sender: 'assistant',
          content: `Bonjour ! Je suis votre tuteur dédié pour la certification **${cert?.code || 'IA'} - ${cert?.title || 'Certification'}**.\n\nQuel domaine ou concept souhaitez-vous approfondir aujourd'hui ?`,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            'Quels sont les domaines les plus pondérés ?',
            'Conseils pour réussir le jour de l’examen',
            'Différence entre les services cognitifs clés',
            'Proposer un plan de révision express',
          ],
        };
      } else {
        initialMsg = {
          id: 'init-1',
          sender: 'assistant',
          content: `Bonjour ! Je suis votre **Assistant Pédagogique CertifIA** 🧠.\n\nJe suis calibré sur les examens officiels d’IA (Azure AI-102 & AI-900, AWS AIF-C01 & MLS-C01, GCP Professional ML Engineer, IBM watsonx).\n\nPosez-moi une question sur une notion complexe, un schéma d’architecture ou demandez une explication pas à pas.`,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            'Expliquer le RAG vs le Fine-Tuning',
            'Comment fonctionne l’algorithme SRS SM-2 ?',
            'Quels sont les pièges fréquents sur AI-102 ?',
            'Quelles métriques ML retenir pour l’examen GCP ?',
          ],
        };
      }
      setMessages([initialMsg]);
    }
  }, [isOpen, context]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    // Pedagogical response logic grounded in AI certs
    setTimeout(() => {
      let replyText = '';
      let nextSuggestions: string[] = [];

      const query = text.toLowerCase();

      if (query.includes('rag') || query.includes('fine-tuning') || query.includes('finetuning')) {
        replyText = `### RAG vs Fine-Tuning pour l'Examen 🎯\n\n- **RAG (Retrieval-Augmented Generation)** : Utilisez-le quand les données changent fréquemment, nécessitent une traçabilité des sources (grounding), ou doivent respecter des permissions d'accès strictes (RBAC/VNet). Ne met pas à jour les poids du modèle.\n- **Fine-Tuning (LoRA / SFT)** : Utilisez-le pour adapter le **style**, le format de sortie ou un vocabulaire ultra-spécifique (ex: jargon juridique). ⚠️ Ce n'est PAS la bonne solution pour enseigner des faits récents au modèle.\n\n💡 **Règle d'or d'examen** : Si la question mentionne "données dynamiques" ou "citer la source exacte", la réponse est toujours **RAG** !`;
        nextSuggestions = [
          'Qu’est-ce que le Semantic Reranker ?',
          'Différence entre indexation vectorielle et hybride',
          'Voir la fiche AI-102',
        ];
      } else if (query.includes('srs') || query.includes('sm-2') || query.includes('repetition')) {
        replyText = `### Algorithme SRS SM-2 & Répétition Espacée 🧠\n\nLe système de CertifIA s'appuie sur la courbe de l'oubli d'Ebbinghaus :\n1. **Facteur de facilité (Ease Factor)** : commence à 2.5 et s'ajuste selon votre vitesse et taux de réussite.\n2. **Intervalles progressifs** : 1 jour ➔ 3 jours ➔ 7 jours ➔ 14 jours ➔ 30 jours.\n3. **Ciblage des cartes dues** : Chaque matin, l'algorithme sélectionne les 17 notions dont la mémoire est sur le point de fléchir. Réviser 10 min par jour à ce moment précis augmente la rétention de 80 % !`;
        nextSuggestions = [
          'Voir mes 17 cartes dues aujourd’hui',
          'Comment sont calculées les notions fragiles ?',
        ];
      } else if (query.includes('piege') || query.includes('piège') || query.includes('ai-102') || query.includes('astuce')) {
        replyText = `### 3 Pièges Classiques en Examen d’Architecture IA ⚠️\n\n1. **Confondre Content Filters & Custom Blocklists** : Sur Azure OpenAI, les filtres par défaut bloquent la haine/violence. Mais pour interdire les données confidentielles de l’entreprise (n° de compte), il faut créer des Regex / Custom Blocklists !\n2. **Reranker vs Recherche Vectorielle pure** : La recherche hybride (Vectorielle + BM25) combinée à un *Semantic Ranker* (RRF) surpasse toujours la recherche vectorielle seule.\n3. **Clés d'API en clair** : Tout examen sanctionne le hardcodage de clés. La bonne réponse implique toujours un coffre-fort managé (Azure Key Vault, AWS Secrets Manager, GCP Secret Manager) ou une identité managée (Entra ID, IAM).`;
        nextSuggestions = [
          'Proposer une question d’entraînement',
          'Comment gérer l’isolation réseau VNet ?',
        ];
      } else {
        replyText = `Excellente question pédagogique ! Concernant **"${text}"** :\n\nDans le contexte des certifications Cloud AI (Microsoft, AWS, Google Cloud, IBM) :\n\n1. **Principe architectural clé** : Prioriser la modularité, le découplage des pipelines d'inférence et la gouvernance responsable (détection des biais, auditabilité).\n2. **Vérification d’examen** : Vérifiez toujours si la question exige le coût minimal (modèles SLM / serverless) ou la latence minimale (déploiement sur instances GPU dédiées).\n3. **Recommandation** : Associez toujours cette notion à une fiche mémo SRS pour consolider vos repères mnémotechniques.`;
        nextSuggestions = [
          'Créer un exemple concret',
          'Quelles sont les questions fréquentes liées ?',
          'Accéder aux fiches mémo',
        ];
      }

      const botReply: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        suggestions: nextSuggestions,
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div 
          className="w-screen max-w-lg bg-white dark:bg-[#141824] border-l border-slate-200 dark:border-[#262a35] shadow-2xl flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#262a35] bg-slate-50 dark:bg-[#171b26]/95 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-headline">
                    Assistant Pédagogique IA
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/15 text-blue-600 dark:text-blue-300 font-semibold border border-blue-500/30">
                    CertifIA Tutor
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {context?.certCode ? `Contextualisé sur ${context.certCode}` : 'Explications, mnémotechniques et pièges d’examens'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([]);
                  setTimeout(() => {
                    setMessages([
                      {
                        id: 'reset-1',
                        sender: 'assistant',
                        content: 'Session réinitialisée. Quel sujet d’intelligence artificielle souhaitez-vous aborder ?',
                        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                        suggestions: [
                          'Expliquer le RAG vs Fine-Tuning',
                          'Pièges fréquents en examen',
                          'Algorithme SRS SM-2',
                        ],
                      },
                    ]);
                  }, 100);
                }}
                title="Réinitialiser la conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#262a35] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#262a35] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Context Banner if opened with specific question or topic */}
          {context?.topic && (
            <div className="px-4 py-2 bg-blue-500/10 dark:bg-blue-500/15 border-b border-blue-500/20 flex items-center justify-between text-xs">
              <span className="text-blue-700 dark:text-blue-300 font-medium truncate">
                📌 Notion en cours : <strong className="font-semibold">{context.topic}</strong>
              </span>
              {context.certId && onOpenBlueprint && (
                <button
                  onClick={() => onOpenBlueprint(context.certId!)}
                  className="text-blue-600 dark:text-blue-400 hover:underline shrink-0 text-[11px]"
                >
                  Blueprint
                </button>
              )}
            </div>
          )}

          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-[#1a2030] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#2a3045] rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-1">
                    {msg.content}
                  </div>
                  <div
                    className={`text-[10px] mt-2 font-mono text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* Suggestions Pills if any */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-[#1c2235] dark:hover:bg-[#252e47] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#262a35] hover:border-blue-400 transition-all text-left flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono p-3 bg-slate-100 dark:bg-[#1a2030] rounded-2xl rounded-bl-none w-fit border border-slate-200 dark:border-[#2a3045]">
                <Bot className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>Analyse du référentiel officiel...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Buttons strip */}
          <div className="p-2.5 border-t border-slate-200 dark:border-[#262a35] bg-slate-50 dark:bg-[#10141f] flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => handleSendMessage('Expliquer les pièges d’examen')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs shrink-0 flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              Pièges d’examen
            </button>
            <button
              onClick={() => handleSendMessage('Donne-moi une astuce mnémotechnique')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs shrink-0 flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3 text-blue-500" />
              Mnémotechnique
            </button>
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('flashcards');
                  onClose();
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs shrink-0 flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-emerald-500" />
              Fiches Mémo
            </button>
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#141824]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Posez une question sur une certification ou un concept..."
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-[#1a2030] border border-slate-200 dark:border-[#2a3045] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isTyping}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-all shadow-md shadow-blue-500/20"
                aria-label="Envoyer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Assistance basée sur les blueprints officiels. Les estimations de niveau ne constituent pas une garantie de passage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
