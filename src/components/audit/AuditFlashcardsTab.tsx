import React, { useMemo, useState } from 'react';
import { Layers, Search, Sparkles, Eye } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { ValidationBadge } from './AuditSharedBadges';

interface AuditFlashcardsTabProps {
  onInspectContent: (contentId: string) => void;
  onNotify: (msg: string, tone?: 'success' | 'error' | 'info') => void;
}

const PAGE_SIZE = 30;

export const AuditFlashcardsTab: React.FC<AuditFlashcardsTabProps> = ({
  onInspectContent,
  onNotify,
}) => {
  const { inventory, runAuditScope } = useAudit();
  const [certFilter, setCertFilter] = useState<string>('c1000177');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [auditing, setAuditing] = useState(false);

  const flashcards = useMemo(
    () => inventory.filter((i) => i.contentType === 'flashcard' && !i.archived),
    [inventory]
  );

  const certOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of flashcards) {
      map.set(f.certificationId, f.certificationCode);
    }
    return Array.from(map.entries());
  }, [flashcards]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return flashcards.filter((c) => {
      if (certFilter !== 'all' && c.certificationId !== certFilter) return false;
      if (q) {
        return (
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          (c.domainName || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [flashcards, certFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleAuditFilteredDeterministic = async () => {
    setAuditing(true);
    try {
      const targetIds = filtered.map((f) => f.id);
      const run = await runAuditScope({
        scopeType: certFilter === 'all' ? 'all_catalog' : 'certification',
        scopeLabel: `Audit Flashcards (${certFilter}, ${targetIds.length} fiches)`,
        targetIds,
        includeAi: false,
        locale: 'fr',
      });
      onNotify(
        `Scan flashcards terminé : ${run.completedCount} fiches contrôlées, ${run.findingsCount} anomalie(s).`,
        'success'
      );
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur audit flashcards', 'error');
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Flashcards inventoriées ({flashcards.length.toLocaleString('fr-FR')})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Filtrer notion, domaine, ID..."
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
            />
          </div>

          <select
            value={certFilter}
            onChange={(e) => {
              setCertFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value="all">Toutes certifications ({flashcards.length})</option>
            {certOptions.map(([id, code]) => (
              <option key={id} value={id}>
                {code}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={auditing}
            onClick={handleAuditFilteredDeterministic}
            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Contrôler ce lot ({filtered.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {slice.map((card) => (
          <div
            key={card.id}
            className="p-4 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] flex flex-col justify-between gap-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {card.sourceEntityId} • {card.certificationCode}
                </span>
                <span className="text-slate-400">v{card.activeVersion}</span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                {card.title}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-2">{card.summary}</div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1e2436]">
              <ValidationBadge item={card} />
              <button
                type="button"
                onClick={() => onInspectContent(card.id)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1c2233] text-xs font-medium inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                Inspecter
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs pt-2">
        <span className="font-mono text-slate-500">
          Page {safePage} / {totalPages} ({filtered.length} cartes)
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-[#283044] disabled:opacity-40"
          >
            Précédent
          </button>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-[#283044] disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};
