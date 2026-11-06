import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Command, 
  Compass, 
  CheckSquare, 
  Layers, 
  Clock, 
  BarChart3, 
  Bot, 
  BookOpen, 
  Settings, 
  Scale, 
  Sparkles,
  Target
} from 'lucide-react';
import { AppScreen } from '../types';
import { getLocalizedCertifications } from '../data/localizedCertifications';
import { getLocalizedGlossaryEntries, LocalizedGlossaryEntry } from '../data/localizedGlossaryData';
import { useTranslation, getCurrentLanguage } from '../i18n';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint: (certId: string) => void;
  onOpenComparator: () => void;
  onOpenAIAssistant: () => void;
  onOpenSystemSettings: () => void;
  onOpenFlashcardsDistribution: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenBlueprint,
  onOpenComparator,
  onOpenAIAssistant,
  onOpenSystemSettings,
  onOpenFlashcardsDistribution,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, i18n } = useTranslation(['navigation', 'common']);
  const lang = (i18n.language === 'en' ? 'en' : 'fr');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Localized certifications & glossary entries
  const currentCerts = getLocalizedCertifications(lang);
  const currentGlossary = getLocalizedGlossaryEntries(lang);

  // Search through App actions
  const appActions = [
    {
      id: 'act-today',
      type: 'action',
      title: t('navigation:items.today.label', 'Aujourd’hui : Session quotidienne SRS'),
      category: t('navigation:categories.accueil', 'Navigation'),
      icon: Target,
      onSelect: () => {
        onNavigate('today');
        onClose();
      },
    },
    {
      id: 'act-assistant',
      type: 'action',
      title: t('navigation:items.assistant.label', 'Assistant Pédagogique IA (Tuteur CertifIA)'),
      category: t('navigation:categories.assistant', 'Accompagnement'),
      icon: Bot,
      onSelect: () => {
        onOpenAIAssistant();
        onClose();
      },
    },
    {
      id: 'act-catalogue',
      type: 'action',
      title: t('navigation:items.catalogue.label', 'Catalogue des 18 certifications IA'),
      category: t('navigation:categories.certifications', 'Certifications'),
      icon: Compass,
      onSelect: () => {
        onNavigate('catalogue');
        onClose();
      },
    },
    {
      id: 'act-comparator',
      type: 'action',
      title: t('navigation:items.comparator.label', 'Comparateur de certifications côte à côte'),
      category: t('navigation:categories.certifications', 'Certifications'),
      icon: Scale,
      onSelect: () => {
        onOpenComparator();
        onClose();
      },
    },
    {
      id: 'act-recommendations',
      type: 'action',
      title: t('navigation:items.recommendation.label', 'Parcours recommandés & Orientation'),
      category: t('navigation:categories.certifications', 'Certifications'),
      icon: Sparkles,
      onSelect: () => {
        onNavigate('recommendation');
        onClose();
      },
    },
    {
      id: 'act-quiz',
      type: 'action',
      title: t('navigation:items.quiz.label', 'Entraînement : Quiz & QCM scénarisés'),
      category: t('navigation:categories.apprentissage', 'Apprentissage'),
      icon: CheckSquare,
      onSelect: () => {
        onNavigate('quiz');
        onClose();
      },
    },
    {
      id: 'act-flashcards',
      type: 'action',
      title: t('navigation:items.flashcards.label', 'Fiches Mémo & Répétition Espacée (2 800 cartes)'),
      category: t('navigation:categories.apprentissage', 'Apprentissage'),
      icon: Layers,
      onSelect: () => {
        onNavigate('flashcards');
        onClose();
      },
    },
    {
      id: 'act-distribution',
      type: 'action',
      title: t('navigation:items.distribution.label', 'Inventaire & Répartition des 2 800 Flashcards'),
      category: t('navigation:categories.apprentissage', 'Apprentissage'),
      icon: Layers,
      onSelect: () => {
        onOpenFlashcardsDistribution();
        onClose();
      },
    },
    {
      id: 'act-exam',
      type: 'action',
      title: t('navigation:items.exam.label', 'Examen Blanc en conditions réelles (Chronométré)'),
      category: t('navigation:categories.apprentissage', 'Apprentissage'),
      icon: Clock,
      onSelect: () => {
        onNavigate('exam');
        onClose();
      },
    },
    {
      id: 'act-glossary',
      type: 'action',
      title: t('navigation:items.glossary.label', 'Glossaire & Encyclopédie de l’Intelligence Artificielle'),
      category: t('navigation:categories.apprentissage', 'Ressources'),
      icon: BookOpen,
      onSelect: () => {
        onNavigate('glossary');
        onClose();
      },
    },
    {
      id: 'act-analytics',
      type: 'action',
      title: t('navigation:items.analytics.label', 'Progression & Indicateurs de préparation'),
      category: t('navigation:categories.progression', 'Progression'),
      icon: BarChart3,
      onSelect: () => {
        onNavigate('analytics');
        onClose();
      },
    },
    {
      id: 'act-settings',
      type: 'action',
      title: t('navigation:items.settings.label', 'Paramètres système & Mises à jour automatiques'),
      category: t('navigation:categories.plus', 'Système'),
      icon: Settings,
      onSelect: () => {
        onOpenSystemSettings();
        onClose();
      },
    },
  ];

  const q = query.trim().toLowerCase();

  // Filter certifications
  const matchedCerts = q
    ? currentCerts.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.providerName.toLowerCase().includes(q) ||
          c.modules.some((m) => m.toLowerCase().includes(q))
      )
    : currentCerts.slice(0, 4);

  // Filter glossary concepts
  const matchedGlossary = q
    ? currentGlossary
        .filter(
          (g: LocalizedGlossaryEntry) =>
            g.term.toLowerCase().includes(q) ||
            (g.acronym && g.acronym.toLowerCase().includes(q)) ||
            g.shortDefinition.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  // Filter actions
  const matchedActions = q
    ? appActions.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    : appActions.slice(0, 5);

  const allResults = [
    ...matchedActions.map((a) => ({ ...a, kind: 'action' as const })),
    ...matchedCerts.map((c) => ({
      id: `cert-${c.id}`,
      kind: 'cert' as const,
      title: `${c.code} : ${c.title}`,
      subtitle: `${c.providerName} • ${c.levelLabel}`,
      onSelect: () => {
        onOpenBlueprint(c.id);
        onClose();
      },
    })),
    ...matchedGlossary.map((g: LocalizedGlossaryEntry) => ({
      id: `glossary-${g.id}`,
      kind: 'glossary' as const,
      title: `${g.term}${g.acronym ? ` (${g.acronym})` : ''}`,
      subtitle: g.shortDefinition,
      onSelect: () => {
        onNavigate('glossary');
        onClose();
      },
    })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        allResults[selectedIndex].onSelect();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#262a35] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-[#262a35] flex items-center gap-3 bg-slate-50 dark:bg-[#171b26]">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t('navigation:search.placeholder')}
            className="flex-1 text-xs sm:text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              aria-label={t('common:actions.reset')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded border border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#0f131d] text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
          {allResults.length > 0 ? (
            allResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.onSelect}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer text-xs sm:text-sm flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1c2233]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span
                      className={`p-2 rounded-lg text-xs font-mono font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-[#202533] text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.kind === 'action' ? 'ACT' : item.kind === 'cert' ? 'CERT' : 'DEF'}
                    </span>
                    <div className="truncate">
                      <div className="font-semibold truncate">{item.title}</div>
                      {'subtitle' in item && item.subtitle && (
                        <div
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-white translate-x-1' : 'text-slate-400 opacity-40'
                    }`}
                  />
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('navigation:search.noResults', { query })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-2.5 border-t border-slate-200 dark:border-[#262a35] bg-slate-50 dark:bg-[#10141f] text-[10px] font-mono text-slate-400 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span>{t('navigation:search.instructions')}</span>
          </div>
          <span>CertifIA Command Palette</span>
        </div>
      </div>
    </div>
  );
};
