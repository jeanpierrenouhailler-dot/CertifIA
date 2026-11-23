import React, { useState } from 'react';
import {
  ExternalLink,
  Link2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import type {
  SourcePriorityLevel,
  SourceReference,
  SourceType,
} from '../../types/audit';
import { useAudit } from '../../context/AuditContext';
import { useAuth } from '../../context/AuthContext';
import { SOURCE_AVAIL_LABELS } from './AuditSharedBadges';

interface AuditSourcesTabProps {
  onNotify: (msg: string, tone?: 'success' | 'error' | 'info') => void;
}

export const AuditSourcesTab: React.FC<AuditSourcesTabProps> = ({ onNotify }) => {
  const { user } = useAuth();
  const { sources, checkSourceLink, saveSource, removeSource } = useAudit();

  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [vendor, setVendor] = useState('microsoft');
  const [customVendor, setCustomVendor] = useState('');
  const [url, setUrl] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('official_vendor_doc');
  const [priorityLevel, setPriorityLevel] = useState<SourcePriorityLevel>(1);
  const [notes, setNotes] = useState('');

  const handleCheckOne = async (id: string) => {
    setCheckingId(id);
    try {
      await checkSourceLink(id);
      onNotify('Vérification HTTP serveur effectuée.', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur vérification source', 'error');
    } finally {
      setCheckingId(null);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedVendor = vendor === 'custom' ? customVendor.trim().toLowerCase() : vendor;
    if (!title.trim() || !url.trim() || !resolvedVendor) {
      onNotify('Titre, éditeur et URL sont requis.', 'error');
      return;
    }
    const newSrc: SourceReference = {
      id: `src-${Date.now()}`,
      title: title.trim(),
      vendor: resolvedVendor,
      url: url.trim(),
      sourceType,
      priorityLevel,
      availabilityStatus: 'unchecked',
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      createdBy: user?.email || 'admin',
    };
    try {
      await saveSource(newSrc);
      setTitle('');
      setUrl('');
      setNotes('');
      onNotify('Source ajoutée au référentiel officiel.', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur ajout source', 'error');
    }
  };

  return (
    <div className="space-y-5">
      {/* Hierarchy Policy Notice */}
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Hiérarchie probatoire des sources documentaires</div>
          <p className="text-slate-600 dark:text-slate-300">
            <strong>Priorité 1 :</strong> Documentation officielle constructeur & guides d’examen (Microsoft Learn, AWS Docs, Google Cloud Docs, IBM Docs, NVIDIA Docs).{' '}
            <strong>Priorité 2 :</strong> Notes de version / annonces de dépréciation.{' '}
            <strong>Priorité 3 :</strong> Références secondaires reconnues.{' '}
            <strong>Priorité 4 :</strong> Notes éditoriales internes. Les blogs/forums ou sorties d’IA ne constituent jamais une preuve suffisante sans source officielle.
          </p>
        </div>
      </div>

      {/* Add Source Form */}
      <form
        onSubmit={handleAddSource}
        className="p-4 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-3 text-xs"
      >
        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-blue-500" />
          Ajouter une source documentaire officielle
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre officiel de la documentation..."
            className="md:col-span-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          />
          <select
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value="microsoft">Microsoft Learn / Azure</option>
            <option value="aws">Amazon Web Services (AWS)</option>
            <option value="google">Google Cloud</option>
            <option value="ibm">IBM watsonx</option>
            <option value="nvidia">NVIDIA</option>
            <option value="custom">Autre éditeur extensible...</option>
          </select>
          <select
            value={priorityLevel}
            onChange={(e) => setPriorityLevel(Number(e.target.value) as SourcePriorityLevel)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value={1}>Priorité 1 — Doc officielle / Exam Guide</option>
            <option value={2}>Priorité 2 — Changelog / Annonce retrait</option>
            <option value={3}>Priorité 3 — Référence complémentaire</option>
            <option value={4}>Priorité 4 — Note éditoriale interne</option>
          </select>
        </div>

        {vendor === 'custom' && (
          <input
            type="text"
            value={customVendor}
            onChange={(e) => setCustomVendor(e.target.value)}
            placeholder="Nom du fournisseur (ex: OpenAI, Anthropic, CNCF...)"
            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="md:col-span-2 px-3 py-1.5 rounded-xl font-mono bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          />
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value as SourceType)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          >
            <option value="official_vendor_doc">Documentation produit officielle</option>
            <option value="official_exam_guide">Guide d’examen officiel</option>
            <option value="official_changelog">Notes de version / Retrait</option>
            <option value="supplemental_reference">Référence secondaire</option>
            <option value="internal_editorial_note">Note éditoriale interne</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes d’usage / périmètre..."
            className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-semibold"
          >
            Ajouter la source
          </button>
        </div>
      </form>

      {/* Sources Registry Table */}
      <div className="rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#242b3d] bg-slate-50 dark:bg-[#10141f] font-mono text-[11px] text-slate-500 uppercase">
                <th className="p-3">Priorité & Éditeur</th>
                <th className="p-3">Titre & URL</th>
                <th className="p-3">Disponibilité serveur</th>
                <th className="p-3">Dernière vérif.</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1e2436]">
              {sources.map((src) => {
                const availTone =
                  src.availabilityStatus === 'reachable'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : src.availabilityStatus === 'redirected'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                    : src.availabilityStatus === 'broken'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                    : 'bg-slate-500/10 text-slate-500';
                return (
                  <tr key={src.id}>
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        P{src.priorityLevel}
                      </span>
                      <span className="ml-2 uppercase font-mono text-[11px] text-slate-500">
                        {src.vendor}
                      </span>
                    </td>
                    <td className="p-3 max-w-md">
                      <div className="font-semibold text-slate-900 dark:text-white">{src.title}</div>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 break-all"
                      >
                        <Link2 className="w-3 h-3 shrink-0" />
                        {src.url}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${availTone}`}>
                        {SOURCE_AVAIL_LABELS[src.availabilityStatus]}
                        {src.httpStatus ? ` (${src.httpStatus})` : ''}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {src.lastCheckedAt
                        ? new Date(src.lastCheckedAt).toLocaleString()
                        : 'Jamais vérifié'}
                    </td>
                    <td className="p-3 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={checkingId === src.id}
                          onClick={() => handleCheckOne(src.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-blue-600 text-white text-[11px] font-semibold inline-flex items-center gap-1 disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-3 h-3 ${checkingId === src.id ? 'animate-spin' : ''}`}
                          />
                          Tester URL
                        </button>
                        {src.createdBy !== 'system-seed' && (
                          <button
                            type="button"
                            onClick={() => removeSource(src.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                            title="Supprimer cette source personnalisée"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
