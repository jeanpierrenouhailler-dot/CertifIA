import React, { useEffect, useState } from 'react';
import {
  Download,
  History,
  RotateCcw,
  Save,
  Server,
  Settings,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { useAuth } from '../../context/AuthContext';
import type { AuditSettings } from '../../types/audit';
import {
  exportAuditReportToCsv,
  exportAuditTraceabilityJson,
} from '../../services/audit/auditReportService';

interface AuditHistoryAndSettingsTabProps {
  mode: 'history' | 'settings';
  onInspectContent: (contentId: string) => void;
  onNotify: (msg: string, tone?: 'success' | 'error' | 'info') => void;
}

function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const AuditHistoryAndSettingsTab: React.FC<AuditHistoryAndSettingsTabProps> = ({
  mode,
  onInspectContent,
  onNotify,
}) => {
  const { user } = useAuth();
  const {
    inventory,
    certifications,
    sources,
    runs,
    findings,
    reviews,
    revisions,
    settings,
    admins,
    restoreRevision,
    saveSettings,
    upsertAdmin,
  } = useAudit();

  const [draftSettings, setDraftSettings] = useState<AuditSettings>(settings);
  const [newAdminUid, setNewAdminUid] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [serverHealth, setServerHealth] = useState<{
    ok: boolean;
    aiConfigured: boolean;
    model: string;
    promptVersion: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraftSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (mode !== 'settings') return;
    fetch('/api/audit/health')
      .then((r) => r.json())
      .then((data) => setServerHealth(data))
      .catch(() => setServerHealth(null));
  }, [mode]);

  const handleDownloadCsv = () => {
    const csv = exportAuditReportToCsv({ items: inventory, findings, reviews, sources });
    downloadTextFile(`certifia-audit-export-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv;charset=utf-8');
    onNotify('Export CSV généré et téléchargé.', 'success');
  };

  const handleDownloadJson = () => {
    const json = exportAuditTraceabilityJson({
      items: inventory,
      findings,
      reviews,
      runs,
      sources,
      certifications,
    });
    downloadTextFile(
      `certifia-audit-traceability-${new Date().toISOString().slice(0, 10)}.json`,
      json,
      'application/json;charset=utf-8'
    );
    onNotify('Export JSON complet généré et téléchargé.', 'success');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await saveSettings({
        ...draftSettings,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || 'admin',
      });
      onNotify('Paramètres de gouvernance enregistrés dans Firestore.', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur sauvegarde paramètres', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUid.trim() || !newAdminEmail.trim()) {
      onNotify('UID Firebase et adresse email requis.', 'error');
      return;
    }
    setBusy(true);
    try {
      const now = new Date().toISOString();
      await upsertAdmin({
        uid: newAdminUid.trim(),
        email: newAdminEmail.trim(),
        role: 'admin',
        active: true,
        addedBy: user?.email || user?.uid,
        createdAt: now,
        updatedAt: now,
      });
      setNewAdminUid('');
      setNewAdminEmail('');
      onNotify('Compte administrateur autorisé enregistré.', 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Erreur ajout administrateur', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (mode === 'history') {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-500" />
              Traçabilité, révisions et exports réglementaires
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {revisions.length} révision(s) • {reviews.length} décision(s) humaine(s) • {runs.length} exécution(s)
              d’audit
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#2a3146] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-[#1a2030]"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              Exporter CSV
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Exporter JSON complet
            </button>
          </div>
        </div>

        {/* Content Revisions & Rollback */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Historique immuable des versions & Restauration (Rollback)
          </h3>
          {revisions.length === 0 ? (
            <p className="text-xs text-slate-500">Aucune révision enregistrée pour le moment.</p>
          ) : (
            <div className="space-y-2.5">
              {revisions.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-[#242b3d] bg-slate-50/70 dark:bg-[#111520] flex flex-wrap items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => onInspectContent(rev.contentId)}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {rev.contentId}
                      </button>
                      <span>• v{rev.versionNumber}</span>
                      <span>• {rev.contentHash}</span>
                      <span>• {rev.authorEmail}</span>
                      <span>• {new Date(rev.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">{rev.changeNote}</div>
                    <div className="text-[11px] text-slate-500 font-mono break-words">{rev.diffSummary}</div>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await restoreRevision(rev);
                        onNotify(
                          `Version v${rev.versionNumber} restaurée en nouvelle révision (revalidation requise).`,
                          'info'
                        );
                      } catch (err) {
                        onNotify(err instanceof Error ? err.message : 'Erreur restauration', 'error');
                      } finally {
                        setBusy(false);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-[#2c344a] hover:bg-white dark:hover:bg-[#1b2234] text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restaurer v{rev.versionNumber}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Human Decisions Timeline */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Journal des décisions humaines ({reviews.length})
          </h3>
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-500">Aucune décision humaine enregistrée pour le moment.</p>
          ) : (
            <div className="space-y-2.5">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-[#242b3d] text-xs space-y-1"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                    <span>
                      <strong>{rev.contentId}</strong> (v{rev.contentVersion}) — Décision :{' '}
                      <strong>{rev.decision}</strong>
                    </span>
                    <span className="text-slate-500">
                      {rev.reviewerEmail} • {new Date(rev.reviewedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{rev.justification}</p>
                  {rev.conditionalReserves && (
                    <div className="text-[11px] text-amber-600 dark:text-amber-300">
                      Réserves : {rev.conditionalReserves}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Server Health & Model Config */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-500" />
          État du proxy serveur & modèle d’audit IA
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#242b3d]">
            <div className="text-slate-500">Modèle IA configuré côté serveur</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {serverHealth?.model || settings.activeAiModel}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#242b3d]">
            <div className="text-slate-500">Clé API Gemini côté serveur</div>
            <div
              className={`font-semibold mt-0.5 ${
                serverHealth?.aiConfigured ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {serverHealth ? (serverHealth.aiConfigured ? 'Configurée (prête)' : 'Variable GEMINI_API_KEY absente') : 'Vérification...'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#242b3d]">
            <div className="text-slate-500">Prompt d’audit actif</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{settings.promptVersion}</div>
          </div>
        </div>
      </div>

      {/* Governance Parameters Form */}
      <form
        onSubmit={handleSaveSettings}
        className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-4 text-xs"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-500" />
          Paramètres de gouvernance & budgets IA
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Fraîcheur maximale (jours)
            </label>
            <input
              type="number"
              min={7}
              max={365}
              value={draftSettings.freshnessMaxDays}
              onChange={(e) =>
                setDraftSettings({ ...draftSettings, freshnessMaxDays: Number(e.target.value) || 90 })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Plafond appels IA / jour
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={draftSettings.dailyAiCallCap}
              onChange={(e) =>
                setDraftSettings({ ...draftSettings, dailyAiCallCap: Number(e.target.value) || 30 })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Taille max d’un lot IA
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={draftSettings.maxBatchSize}
              onChange={(e) =>
                setDraftSettings({ ...draftSettings, maxBatchSize: Number(e.target.value) || 10 })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Version de prompt</label>
            <input
              type="text"
              value={draftSettings.promptVersion}
              onChange={(e) => setDraftSettings({ ...draftSettings, promptVersion: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={draftSettings.requireOfficialSourceForApproval}
            onChange={(e) =>
              setDraftSettings({ ...draftSettings, requireOfficialSourceForApproval: e.target.checked })
            }
          />
          <span>Exiger au moins une source officielle (Priorité 1 à 3) ou preuve avant validation humaine</span>
        </label>

        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold inline-flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          Enregistrer les paramètres
        </button>
      </form>

      {/* Admin Accounts Manager */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#242b3d] space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Administrateurs autorisés dans Firestore (/admins)
        </h3>

        <div className="space-y-2">
          {admins.length === 0 ? (
            <p className="text-slate-500">
              Seule la liste d’administrateurs bootstrap (Firebase email vérifié) est active tant qu’aucun document /admins
              supplémentaire n’est créé.
            </p>
          ) : (
            admins.map((adm) => (
              <div
                key={adm.uid}
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#242b3d] flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{adm.email}</div>
                  <div className="font-mono text-[11px] text-slate-500">UID : {adm.uid}</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    upsertAdmin({
                      ...adm,
                      active: !adm.active,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className={`px-2.5 py-1 rounded-lg font-semibold ${
                    adm.active
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {adm.active ? 'Actif' : 'Désactivé'}
                </button>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
          <input
            type="text"
            value={newAdminUid}
            onChange={(e) => setNewAdminUid(e.target.value)}
            placeholder="Firebase UID exact..."
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          />
          <input
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="Email Google vérifié..."
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0f131d] border border-slate-200 dark:border-[#283044]"
          />
          <button
            type="submit"
            disabled={busy}
            className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-semibold inline-flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Ajouter administrateur
          </button>
        </form>
      </div>
    </div>
  );
};
