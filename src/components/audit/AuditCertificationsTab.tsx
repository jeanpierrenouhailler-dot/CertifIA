import React, { useState } from 'react';
import { Award, ExternalLink, Save, AlertTriangle, Edit3 } from 'lucide-react';
import type { CertificationReference, OfficialCertStatus } from '../../types/audit';
import { useAudit } from '../../context/AuditContext';
import { CertStatusBadge } from './AuditSharedBadges';

interface AuditCertificationsTabProps {
  onInspectContent: (contentId: string) => void;
  onNotify: (msg: string, tone?: 'success' | 'error' | 'info') => void;
}

export const AuditCertificationsTab: React.FC<AuditCertificationsTabProps> = ({
  onInspectContent,
  onNotify,
}) => {
  const { certifications, saveCertificationRef } = useAudit();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CertificationReference | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (cert: CertificationReference) => {
    setEditingId(cert.id);
    setDraft({ ...cert });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    try {
      await saveCertificationRef(draft);
      setEditingId(null);
      setDraft(null);
      onNotify(
        `Référentiel ${draft.code} mis à jour et statut publié pour les apprenants.`,
        'success'
      );
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur sauvegarde certification', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Référentiel officiel des certifications Cloud & IA ({certifications.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi du statut éditeur (active, retrait annoncé, retirée, suspendue, historique). Toute certification retirée conserve son contenu en mode historique avec alerte visible côté catalogue apprenant.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {certifications.map((cert) => {
          const isEditing = editingId === cert.id && draft;
          return (
            <div
              key={cert.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-500" />
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {cert.code}
                    </span>
                    <span className="text-[11px] uppercase font-mono text-slate-400">
                      {cert.provider}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {cert.title}
                  </h3>
                </div>
                <CertStatusBadge status={cert.officialStatus} />
              </div>

              {cert.officialStatus !== 'active' && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Alerte cycle de vie :</strong>{' '}
                    {cert.changeAlert || 'Statut officiel non actif.'}
                    {cert.retirementDate ? ` (Échéance : ${cert.retirementDate})` : ''}
                  </div>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#242b3d] text-xs">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Statut officiel</label>
                      <select
                        value={draft.officialStatus}
                        onChange={(e) =>
                          setDraft({ ...draft, officialStatus: e.target.value as OfficialCertStatus })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
                      >
                        <option value="active">Active</option>
                        <option value="announced_retirement">Retrait annoncé</option>
                        <option value="retired">Retirée</option>
                        <option value="suspended">Suspendue</option>
                        <option value="historical">Historique</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Date de retrait officielle</label>
                      <input
                        type="date"
                        value={draft.retirementDate || ''}
                        onChange={(e) => setDraft({ ...draft, retirementDate: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Durée (min)</label>
                      <input
                        type="number"
                        value={draft.durationMinutes}
                        onChange={(e) =>
                          setDraft({ ...draft, durationMinutes: Number(e.target.value) || 0 })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Score réussite / Max</label>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          value={draft.passScore}
                          onChange={(e) =>
                            setDraft({ ...draft, passScore: Number(e.target.value) || 0 })
                          }
                          className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
                        />
                        <input
                          type="number"
                          value={draft.maxScore}
                          onChange={(e) =>
                            setDraft({ ...draft, maxScore: Number(e.target.value) || 1000 })
                          }
                          className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">URL officielle éditeur</label>
                    <input
                      type="url"
                      value={draft.officialUrl}
                      onChange={(e) => setDraft({ ...draft, officialUrl: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Message d’alerte / changement (affiché aux apprenants si non actif)
                    </label>
                    <input
                      type="text"
                      value={draft.changeAlert || ''}
                      onChange={(e) => setDraft({ ...draft, changeAlert: e.target.value })}
                      placeholder="Ex: Retrait annoncé par l'éditeur, mise à jour de programme..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setDraft(null);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a3146]"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold inline-flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Enregistrer
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-50 dark:bg-[#10141f] p-3 rounded-xl">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Durée</span>
                      <strong>{cert.durationMinutes} min</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Questions</span>
                      <strong>{cert.itemsCount}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Seuil</span>
                      <strong>
                        {cert.passScore}/{cert.maxScore}
                      </strong>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong>Pondérations :</strong> {cert.domainWeightsSummary}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1e2436] text-xs">
                    <a
                      href={cert.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      Guide officiel
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onInspectContent(`cert:${cert.id}`)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#2a3146] hover:bg-slate-50 dark:hover:bg-[#1a2030]"
                      >
                        Fiche audit
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(cert)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-blue-600 text-white font-semibold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        Modifier statut
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
