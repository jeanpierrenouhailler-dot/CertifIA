import React, { useMemo, useState } from 'react';
import { BookOpen, Eye, Search, Sparkles } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { ValidationBadge } from './AuditSharedBadges';

interface AuditGlossaryTabProps {
  onInspectContent: (contentId: string) => void;
  onNotify: (msg: string, tone?: 'success' | 'error' | 'info') => void;
}

export const AuditGlossaryTab: React.FC<AuditGlossaryTabProps> = ({
  onInspectContent,
  onNotify,
}) => {
  const { inventory, runAuditScope } = useAudit();
  const [search, setSearch] = useState('');
  const [auditing, setAuditing] = useState(false);

  const glossaryItems = useMemo(
    () => inventory.filter((i) => i.contentType === 'glossary' && !i.archived),
    [inventory]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return glossaryItems;
    return glossaryItems.filter(
      (g) => g.title.toLowerCase().includes(q) || g.summary.toLowerCase().includes(q)
    );
  }, [glossaryItems, search]);

  const handleAuditAllGlossary = async () => {
    setAuditing(true);
    try {
      const run = await runAuditScope({
        scopeType: 'selection',
        scopeLabel: 'Audit déterministe du glossaire',
        targetIds: filtered.map((g) => g.id),
        includeAi: false,
        locale: 'fr',
      });
      onNotify(`Audit glossaire terminé : ${run.findingsCount} anomalie(s) détectée(s).`, 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur audit glossaire', 'error');
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-500" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Glossaire & Encyclopédie ({glossaryItems.length} entrées)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher terme, acronyme..."
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
            />
          </div>
          <button
            type="button"
            disabled={auditing}
            onClick={handleAuditAllGlossary}
            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Contrôler cohérence & traductions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((entry) => {
          const eq = entry.payloadFr.cloudEquivalents as Record<string, string> | undefined;
          const trap = String(entry.payloadFr.examTrap || '');
          return (
            <div
              key={entry.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400">
                    {entry.id} • {String(entry.payloadFr.difficulty || '')}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{entry.title}</h3>
                </div>
                <ValidationBadge item={entry} />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">{entry.summary}</p>

              {eq && (
                <div className="text-[11px] bg-slate-50 dark:bg-[#0f131d] p-2.5 rounded-xl space-y-0.5">
                  <div className="font-mono font-bold text-slate-400">Équivalents Multi-Cloud :</div>
                  {Object.entries(eq).map(([k, v]) => (
                    <div key={k} className="truncate">
                      <strong className="uppercase">{k}:</strong> {v}
                    </div>
                  ))}
                </div>
              )}

              {trap && (
                <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2 rounded-lg">
                  <strong>Piège d’examen :</strong> {trap}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1e2436] text-xs">
                <span className="font-mono text-[11px] text-slate-400">
                  {entry.openFindingsCount} anomalie(s) ouverte(s)
                </span>
                <button
                  type="button"
                  onClick={() => onInspectContent(entry.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1c2233] font-medium inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspecter / Éditer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
