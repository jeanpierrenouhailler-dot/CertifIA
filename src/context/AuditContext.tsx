import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { usePublishedContent } from './PublishedContentContext';
import type {
  AdminAccount,
  AiAnalysisServerResponse,
  AuditContentState,
  AuditFinding,
  AuditQualityMetrics,
  AuditRun,
  AuditScopeType,
  AuditSettings,
  CertificationReference,
  ContentEvidence,
  ContentItem,
  ContentRevision,
  FindingStatus,
  HumanReview,
  PriorityAlert,
  PublishedContentOverride,
  SourceReference,
} from '../types/audit';
import {
  buildDefaultCertificationReferences,
  buildFullContentInventory,
} from '../services/audit/contentInventoryService';
import {
  buildDefaultSourceRegistry,
  verifySourceAvailability,
} from '../services/audit/sourceRegistryService';
import { runDeterministicAuditChecks } from '../services/audit/deterministicChecksService';
import {
  mergeFindingsPreservingHistory,
  sortFindingsBySeverityAndDate,
  transitionFindingStatus,
} from '../services/audit/findingManagementService';
import { analyzeContentItemWithServerAI } from '../services/audit/aiReviewService';
import {
  buildHumanReviewRecord,
  evaluateHumanApprovalEligibility,
} from '../services/audit/humanValidationService';
import {
  buildPublishedOverride,
  createContentRevision,
  parseRevisionSnapshot,
} from '../services/audit/contentVersioningService';
import {
  buildSortedPriorityAlerts,
  computeAuditQualityMetrics,
  computeInventoryCounters,
  type InventoryCounters,
} from '../services/audit/auditReportService';
import {
  createContentRevisionDoc,
  createHumanReviewDoc,
  DEFAULT_AUDIT_SETTINGS,
  deleteSourceReference,
  loadAllAdminAuditCollections,
  saveAdminAccount,
  saveAuditContentState,
  saveAuditFinding,
  saveAuditRun,
  saveAuditSettings,
  saveCertificationReference,
  saveContentEvidence,
  savePublishedContentOverride,
  saveSourceReference,
} from '../services/audit/auditPersistenceService';

interface AuditContextType {
  loading: boolean;
  error: string | null;
  inventory: ContentItem[];
  certifications: CertificationReference[];
  sources: SourceReference[];
  evidence: ContentEvidence[];
  runs: AuditRun[];
  findings: AuditFinding[];
  reviews: HumanReview[];
  revisions: ContentRevision[];
  settings: AuditSettings;
  admins: AdminAccount[];
  counters: InventoryCounters;
  qualityMetrics: AuditQualityMetrics;
  priorityAlerts: PriorityAlert[];
  latestAiSuggestions: Record<string, AiAnalysisServerResponse>;
  activeBatchProgress: {
    runId: string;
    label: string;
    completed: number;
    total: number;
  } | null;
  refreshAdminData: () => Promise<void>;
  runAuditScope: (params: {
    scopeType: AuditScopeType;
    scopeLabel: string;
    targetIds: string[];
    includeAi: boolean;
    locale: 'fr' | 'en';
  }) => Promise<AuditRun>;
  cancelActiveRun: () => void;
  checkSourceLink: (sourceId: string) => Promise<void>;
  saveSource: (source: SourceReference) => Promise<void>;
  removeSource: (sourceId: string) => Promise<void>;
  addEvidence: (evidence: ContentEvidence) => Promise<void>;
  updateFindingStatus: (
    findingId: string,
    nextStatus: FindingStatus,
    resolutionComment?: string
  ) => Promise<void>;
  saveContentRevision: (params: {
    contentId: string;
    updatedPayloadFr: Record<string, unknown>;
    updatedPayloadEn?: Record<string, unknown> | null;
    changeNote: string;
  }) => Promise<ContentRevision>;
  restoreRevision: (revision: ContentRevision) => Promise<void>;
  submitHumanValidation: (params: {
    contentId: string;
    decision: HumanReview['decision'];
    justification: string;
    conditionalReserves?: string;
    attachedSourceIds: string[];
    publishLive: boolean;
  }) => Promise<void>;
  dismissAiSuggestion: (contentId: string) => void;
  saveCertificationRef: (cert: CertificationReference) => Promise<void>;
  setContentArchiveState: (contentId: string, archived: boolean) => Promise<void>;
  saveSettings: (next: AuditSettings) => Promise<void>;
  upsertAdmin: (account: AdminAccount) => Promise<void>;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, getIdToken } = useAuth();
  const { overrides: publicOverrides, refreshPublishedOverrides } = usePublishedContent();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentStates, setContentStates] = useState<Record<string, AuditContentState>>({});
  const [certifications, setCertifications] = useState<CertificationReference[]>(() =>
    buildDefaultCertificationReferences()
  );
  const [sources, setSources] = useState<SourceReference[]>(() => buildDefaultSourceRegistry());
  const [evidence, setEvidence] = useState<ContentEvidence[]>([]);
  const [runs, setRuns] = useState<AuditRun[]>([]);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [reviews, setReviews] = useState<HumanReview[]>([]);
  const [revisions, setRevisions] = useState<ContentRevision[]>([]);
  const [settings, setSettings] = useState<AuditSettings>(DEFAULT_AUDIT_SETTINGS);
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [adminPublishedMap, setAdminPublishedMap] = useState<
    Record<string, PublishedContentOverride>
  >({});
  const [latestAiSuggestions, setLatestAiSuggestions] = useState<
    Record<string, AiAnalysisServerResponse>
  >({});
  const [activeBatchProgress, setActiveBatchProgress] = useState<{
    runId: string;
    label: string;
    completed: number;
    total: number;
  } | null>(null);

  const cancelFlagRef = useRef(false);

  const refreshAdminData = useCallback(async () => {
    if (!isAdmin || !user) return;
    setLoading(true);
    setError(null);
    try {
      const bundle = await loadAllAdminAuditCollections();
      setContentStates(bundle.contentStates);

      // Merge stored certs with defaults so newly added certs never vanish
      const defaultCerts = buildDefaultCertificationReferences();
      const storedCertMap = new Map(bundle.certifications.map((c) => [c.id, c]));
      const mergedCerts = [
        ...defaultCerts.map((dc) => storedCertMap.get(dc.id) || dc),
        ...bundle.certifications.filter((sc) => !defaultCerts.some((dc) => dc.id === sc.id)),
      ];
      setCertifications(mergedCerts);

      // Merge stored sources with canonical baseline
      const defaultSources = buildDefaultSourceRegistry();
      const storedSrcMap = new Map(bundle.sources.map((s) => [s.id, s]));
      const mergedSources = [
        ...defaultSources.map((ds) => storedSrcMap.get(ds.id) || ds),
        ...bundle.sources.filter((ss) => !defaultSources.some((ds) => ds.id === ss.id)),
      ];
      setSources(mergedSources);

      setEvidence(bundle.evidence);
      setRuns(bundle.runs);
      setFindings(sortFindingsBySeverityAndDate(bundle.findings));
      setReviews(bundle.reviews);
      setRevisions(bundle.revisions);
      setSettings(bundle.settings);
      setAdmins(bundle.admins);
      setAdminPublishedMap(bundle.publishedOverrides);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger les données de gouvernance depuis Firestore.'
      );
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  useEffect(() => {
    if (isAdmin && user) {
      refreshAdminData();
    }
  }, [isAdmin, user, refreshAdminData]);

  const mergedPublishedOverrides = useMemo(
    () => ({ ...publicOverrides, ...adminPublishedMap }),
    [publicOverrides, adminPublishedMap]
  );

  const inventory = useMemo(
    () =>
      buildFullContentInventory({
        contentStates,
        publishedOverrides: mergedPublishedOverrides,
        findings,
        sources,
        evidence,
        freshnessMaxDays: settings.freshnessMaxDays,
      }),
    [
      contentStates,
      mergedPublishedOverrides,
      findings,
      sources,
      evidence,
      settings.freshnessMaxDays,
    ]
  );

  const counters = useMemo(
    () =>
      computeInventoryCounters({
        items: inventory,
        findings,
        sources,
        certifications,
      }),
    [inventory, findings, sources, certifications]
  );

  const qualityMetrics = useMemo(
    () =>
      computeAuditQualityMetrics({
        items: inventory,
        findings,
        certifications,
      }),
    [inventory, findings, certifications]
  );

  const priorityAlerts = useMemo(
    () =>
      buildSortedPriorityAlerts({
        items: inventory,
        findings,
        sources,
        certifications,
      }),
    [inventory, findings, sources, certifications]
  );

  const cancelActiveRun = useCallback(() => {
    cancelFlagRef.current = true;
  }, []);

  const runAuditScope = useCallback(
    async (params: {
      scopeType: AuditScopeType;
      scopeLabel: string;
      targetIds: string[];
      includeAi: boolean;
      locale: 'fr' | 'en';
    }): Promise<AuditRun> => {
      if (!isAdmin || !user) {
        throw new Error('Droits administrateur requis pour exécuter un audit.');
      }

      const idToken = params.includeAi ? await getIdToken() : null;
      if (params.includeAi && !idToken) {
        throw new Error('Jeton d’authentification Firebase indisponible.');
      }

      const targetItems = inventory.filter((item) => params.targetIds.includes(item.id));
      const boundedTargets = params.includeAi
        ? targetItems.slice(0, settings.maxBatchSize)
        : targetItems;

      const runId = `run-${Date.now()}`;
      const startedAt = new Date().toISOString();
      cancelFlagRef.current = false;

      let runRecord: AuditRun = {
        id: runId,
        scopeType: params.scopeType,
        scopeLabel: params.scopeLabel,
        targetCount: boundedTargets.length,
        completedCount: 0,
        findingsCount: 0,
        modelIdentifier: params.includeAi ? settings.activeAiModel : 'deterministic-rules-v1',
        promptVersion: params.includeAi ? settings.promptVersion : 'det-v1.0',
        status: 'running',
        startedAt,
        initiatedBy: user.email || user.uid,
        summary: 'Exécution en cours...',
      };

      setRuns((prev) => [runRecord, ...prev]);
      await saveAuditRun(runRecord);
      setActiveBatchProgress({
        runId,
        label: params.scopeLabel,
        completed: 0,
        total: boundedTargets.length,
      });

      const collectedNewFindings: AuditFinding[] = [];
      let completedCount = 0;

      try {
        // Phase 1: Deterministic structural/translation/source/absolute checks across targets
        const detFindings = runDeterministicAuditChecks({
          items: boundedTargets,
          sources,
          certifications,
          runId,
          nowIso: startedAt,
        });
        collectedNewFindings.push(...detFindings);

        // Phase 2: AI-assisted deep check when requested
        if (params.includeAi && idToken) {
          for (const item of boundedTargets) {
            if (cancelFlagRef.current) break;

            const { response, findings: aiFindings } = await analyzeContentItemWithServerAI({
              item,
              sources,
              evidence,
              idToken,
              locale: params.locale,
              dailyCap: settings.dailyAiCallCap,
              runId,
            });

            collectedNewFindings.push(...aiFindings);
            setLatestAiSuggestions((prev) => ({ ...prev, [item.id]: response }));

            const nextItemState: AuditContentState = {
              id: item.id,
              contentType: item.contentType,
              certificationId: item.certificationId,
              provider: item.provider,
              editorialStatus:
                aiFindings.length > 0 || detFindings.some((f) => f.contentId === item.id)
                  ? 'ai_audited'
                  : item.editorialStatus === 'draft' || item.editorialStatus === 'to_verify'
                  ? 'ai_audited'
                  : item.editorialStatus,
              validationStatus: item.validationStatus,
              freshnessStatus: 'fresh',
              activeVersion: item.activeVersion,
              contentHash: item.contentHash,
              humanValidatedVersion: item.humanValidatedVersion,
              lastAuditedAt: response.analyzedAt,
              lastAuditModel: response.modelIdentifier,
              lastAuditConfidence: response.result.confidenceScore,
              lastValidatedAt: item.lastValidatedAt,
              lastValidatedBy: item.lastValidatedBy,
              archived: item.archived,
              updatedAt: response.analyzedAt,
            };
            await saveAuditContentState(nextItemState);
            setContentStates((prev) => ({ ...prev, [item.id]: nextItemState }));

            completedCount += 1;
            setActiveBatchProgress({
              runId,
              label: params.scopeLabel,
              completed: completedCount,
              total: boundedTargets.length,
            });
          }
        } else {
          const nowIso = new Date().toISOString();
          for (const item of boundedTargets) {
            const nextState: AuditContentState = {
              id: item.id,
              contentType: item.contentType,
              certificationId: item.certificationId,
              provider: item.provider,
              editorialStatus:
                item.editorialStatus === 'draft' || item.editorialStatus === 'to_verify'
                  ? 'ai_audited'
                  : item.editorialStatus,
              validationStatus: item.validationStatus,
              freshnessStatus: item.freshnessStatus === 'unverified' ? 'review_due' : item.freshnessStatus,
              activeVersion: item.activeVersion,
              contentHash: item.contentHash,
              humanValidatedVersion: item.humanValidatedVersion,
              lastAuditedAt: nowIso,
              lastAuditModel: 'deterministic-rules-v1',
              lastValidatedAt: item.lastValidatedAt,
              lastValidatedBy: item.lastValidatedBy,
              archived: item.archived,
              updatedAt: nowIso,
            };
            // Save state selectively for reviewed non-flashcard items or items with findings to avoid 2800 writes in bulk
            const hasFinding = detFindings.some((f) => f.contentId === item.id);
            if (item.contentType !== 'flashcard' || boundedTargets.length <= 50 || hasFinding) {
              await saveAuditContentState(nextState);
              setContentStates((prev) => ({ ...prev, [item.id]: nextState }));
            }
          }
          completedCount = boundedTargets.length;
        }

        const { merged, added } = mergeFindingsPreservingHistory(findings, collectedNewFindings);
        setFindings(merged);
        for (const f of added) {
          await saveAuditFinding(f);
        }

        runRecord = {
          ...runRecord,
          completedCount,
          findingsCount: added.length,
          status: cancelFlagRef.current ? 'cancelled' : 'completed',
          completedAt: new Date().toISOString(),
          summary: `${completedCount}/${boundedTargets.length} élément(s) analysé(s) — ${added.length} nouvelle(s) anomalie(s) enregistrée(s). Validation humaine requise avant publication.`,
        };
        await saveAuditRun(runRecord);
        setRuns((prev) => prev.map((r) => (r.id === runId ? runRecord : r)));
        return runRecord;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Erreur d’exécution de l’audit.';
        runRecord = {
          ...runRecord,
          completedCount,
          status: 'failed',
          completedAt: new Date().toISOString(),
          summary: errMsg,
        };
        await saveAuditRun(runRecord).catch(() => {});
        setRuns((prev) => prev.map((r) => (r.id === runId ? runRecord : r)));
        throw err;
      } finally {
        setActiveBatchProgress(null);
      }
    },
    [
      isAdmin,
      user,
      getIdToken,
      inventory,
      settings.maxBatchSize,
      settings.activeAiModel,
      settings.promptVersion,
      settings.dailyAiCallCap,
      sources,
      certifications,
      evidence,
      findings,
    ]
  );

  const checkSourceLink = useCallback(
    async (sourceId: string) => {
      const target = sources.find((s) => s.id === sourceId);
      if (!target) return;
      const token = await getIdToken();
      if (!token) throw new Error('Authentification administrateur requise.');

      const result = await verifySourceAvailability(target.url, token);
      const updated: SourceReference = {
        ...target,
        availabilityStatus: result.availabilityState,
        finalUrl: result.finalUrl || target.url,
        httpStatus: result.statusCode,
        lastCheckedAt: result.checkedAt,
        lastModifiedHeader: result.lastModified || undefined,
      };
      await saveSourceReference(updated);
      setSources((prev) => prev.map((s) => (s.id === sourceId ? updated : s)));
    },
    [sources, getIdToken]
  );

  const saveSource = useCallback(async (source: SourceReference) => {
    await saveSourceReference(source);
    setSources((prev) => {
      const exists = prev.some((s) => s.id === source.id);
      return exists ? prev.map((s) => (s.id === source.id ? source : s)) : [source, ...prev];
    });
  }, []);

  const removeSource = useCallback(async (sourceId: string) => {
    await deleteSourceReference(sourceId);
    setSources((prev) => prev.filter((s) => s.id !== sourceId));
  }, []);

  const addEvidence = useCallback(async (ev: ContentEvidence) => {
    await saveContentEvidence(ev);
    setEvidence((prev) => {
      const exists = prev.some((e) => e.id === ev.id);
      return exists ? prev.map((e) => (e.id === ev.id ? ev : e)) : [ev, ...prev];
    });
  }, []);

  const updateFindingStatus = useCallback(
    async (findingId: string, nextStatus: FindingStatus, resolutionComment?: string) => {
      if (!user) return;
      const target = findings.find((f) => f.id === findingId);
      if (!target) return;
      const updated = transitionFindingStatus(
        target,
        nextStatus,
        user.email || user.uid,
        resolutionComment
      );
      await saveAuditFinding(updated);
      setFindings((prev) => sortFindingsBySeverityAndDate(prev.map((f) => (f.id === findingId ? updated : f))));
    },
    [findings, user]
  );

  const saveContentRevision = useCallback(
    async (params: {
      contentId: string;
      updatedPayloadFr: Record<string, unknown>;
      updatedPayloadEn?: Record<string, unknown> | null;
      changeNote: string;
    }) => {
      if (!user) throw new Error('Authentification requise.');
      const item = inventory.find((i) => i.id === params.contentId);
      if (!item) throw new Error(`Élément introuvable : ${params.contentId}`);

      const { revision, nextState } = createContentRevision({
        item,
        updatedPayloadFr: params.updatedPayloadFr,
        updatedPayloadEn: params.updatedPayloadEn,
        authorUid: user.uid,
        authorEmail: user.email || user.uid,
        changeNote: params.changeNote,
      });

      // Stage new draft payload in adminPublishedMap (only if already published we avoid pushing unvalidated edits live;
      // unvalidated working edits are reconstructed from latest ContentRevision snapshot in editor)
      await createContentRevisionDoc(revision);
      await saveAuditContentState(nextState);
      setRevisions((prev) => [revision, ...prev]);
      setContentStates((prev) => ({ ...prev, [item.id]: nextState }));
      return revision;
    },
    [user, inventory]
  );

  const restoreRevision = useCallback(
    async (revision: ContentRevision) => {
      if (!user) throw new Error('Authentification requise.');
      const item = inventory.find((i) => i.id === revision.contentId);
      if (!item) throw new Error('Élément introuvable.');
      const snapshot = parseRevisionSnapshot(revision);
      if (!snapshot) throw new Error('Snapshot de version illisible.');

      const { revision: newRev, nextState } = createContentRevision({
        item,
        updatedPayloadFr: snapshot.payloadFr,
        updatedPayloadEn: snapshot.payloadEn,
        authorUid: user.uid,
        authorEmail: user.email || user.uid,
        changeNote: `Restauration de la version v${revision.versionNumber}`,
        restoredFromVersion: revision.versionNumber,
      });

      await createContentRevisionDoc(newRev);
      await saveAuditContentState(nextState);
      setRevisions((prev) => [newRev, ...prev]);
      setContentStates((prev) => ({ ...prev, [item.id]: nextState }));
    },
    [user, inventory]
  );

  const dismissAiSuggestion = useCallback((contentId: string) => {
    setLatestAiSuggestions((prev) => {
      const copy = { ...prev };
      delete copy[contentId];
      return copy;
    });
  }, []);

  const submitHumanValidation = useCallback(
    async (params: {
      contentId: string;
      decision: HumanReview['decision'];
      justification: string;
      conditionalReserves?: string;
      attachedSourceIds: string[];
      publishLive: boolean;
    }) => {
      if (!user || !isAdmin) throw new Error('Droits administrateur requis.');
      const item = inventory.find((i) => i.id === params.contentId);
      if (!item) throw new Error('Contenu introuvable.');

      if (params.decision === 'approved' || params.decision === 'approved_with_reserves') {
        const eligibility = evaluateHumanApprovalEligibility({
          item,
          findings,
          sources,
          evidence,
          certifications,
          settings,
          hasPendingAiSuggestion: Boolean(latestAiSuggestions[item.id]),
        });
        if (params.decision === 'approved' && !eligibility.canApprove) {
          throw new Error(
            eligibility.blockingReasons[0] ||
              eligibility.warnings[0] ||
              'Validation bloquée par des anomalies ouvertes.'
          );
        }
        if (params.decision === 'approved_with_reserves' && !eligibility.canApproveWithReserves) {
          throw new Error(
            eligibility.blockingReasons[0] || 'Validation sous réserve bloquée par des critères critiques.'
          );
        }
      }

      const review = buildHumanReviewRecord({
        contentId: item.id,
        contentVersion: item.activeVersion,
        reviewerUid: user.uid,
        reviewerEmail: user.email || user.uid,
        decision: params.decision,
        justification: params.justification,
        conditionalReserves: params.conditionalReserves,
        attachedSourceIds: params.attachedSourceIds,
      });

      await createHumanReviewDoc(review);
      setReviews((prev) => [review, ...prev]);

      const nextEditorialStatus =
        params.decision === 'approved'
          ? params.publishLive
            ? 'published'
            : 'approved'
          : params.decision === 'approved_with_reserves'
          ? 'approved_with_reserves'
          : params.decision === 'rejected'
          ? 'to_fix'
          : 'to_verify';

      const nextValidationStatus =
        params.decision === 'approved'
          ? 'validated'
          : params.decision === 'approved_with_reserves'
          ? 'validated_with_reserves'
          : 'rejected';

      const nextState: AuditContentState = {
        id: item.id,
        contentType: item.contentType,
        certificationId: item.certificationId,
        provider: item.provider,
        editorialStatus: nextEditorialStatus,
        validationStatus: nextValidationStatus,
        freshnessStatus: 'fresh',
        activeVersion: item.activeVersion,
        contentHash: item.contentHash,
        humanValidatedVersion:
          params.decision === 'approved' || params.decision === 'approved_with_reserves'
            ? item.activeVersion
            : undefined,
        lastAuditedAt: item.lastAuditedAt,
        lastAuditModel: item.lastAuditModel,
        lastAuditConfidence: item.lastAuditConfidence,
        lastValidatedAt: review.reviewedAt,
        lastValidatedBy: review.reviewerEmail,
        archived: item.archived,
        updatedAt: review.reviewedAt,
      };
      await saveAuditContentState(nextState);
      setContentStates((prev) => ({ ...prev, [item.id]: nextState }));

      // Check latest ContentRevision snapshot if one exists for this version
      const matchingRev = revisions.find(
        (r) => r.contentId === item.id && r.versionNumber === item.activeVersion
      );
      const revSnap = matchingRev ? parseRevisionSnapshot(matchingRev) : null;
      const effectiveItem: ContentItem = revSnap
        ? { ...item, payloadFr: revSnap.payloadFr, payloadEn: revSnap.payloadEn ?? item.payloadEn }
        : item;

      if (
        params.publishLive &&
        (params.decision === 'approved' || params.decision === 'approved_with_reserves')
      ) {
        const override = buildPublishedOverride({
          item: effectiveItem,
          approvedByEmail: user.email || user.uid,
          isArchived: effectiveItem.archived,
        });
        await savePublishedContentOverride(override);
        setAdminPublishedMap((prev) => ({ ...prev, [override.id]: override }));
        await refreshPublishedOverrides();
      }
    },
    [
      user,
      isAdmin,
      inventory,
      findings,
      sources,
      evidence,
      certifications,
      settings,
      latestAiSuggestions,
      revisions,
      refreshPublishedOverrides,
    ]
  );

  const saveCertificationRef = useCallback(
    async (cert: CertificationReference) => {
      if (!user || !isAdmin) throw new Error('Droits administrateur requis.');
      const updated: CertificationReference = {
        ...cert,
        updatedAt: new Date().toISOString(),
        updatedBy: user.email || user.uid,
      };
      await saveCertificationReference(updated);
      setCertifications((prev) => {
        const exists = prev.some((c) => c.id === updated.id);
        return exists ? prev.map((c) => (c.id === updated.id ? updated : c)) : [...prev, updated];
      });

      // Mirror public lifecycle notice to learners cleanly (zero internal audit notes exposed)
      const statusOverride: PublishedContentOverride = {
        id: `cert_status:${updated.id}`,
        contentType: 'certification',
        approvedVersion: 1,
        approvedBy: user.email || user.uid,
        approvedAt: updated.updatedAt,
        patchJson: JSON.stringify({
          officialStatus: updated.officialStatus,
          retirementDate: updated.retirementDate,
          changeAlert: updated.changeAlert,
          officialUrl: updated.officialUrl,
        }),
        isArchived: false,
      };
      await savePublishedContentOverride(statusOverride);
      setAdminPublishedMap((prev) => ({ ...prev, [statusOverride.id]: statusOverride }));
      await refreshPublishedOverrides();
    },
    [user, isAdmin, refreshPublishedOverrides]
  );

  const setContentArchiveState = useCallback(
    async (contentId: string, archived: boolean) => {
      const item = inventory.find((i) => i.id === contentId);
      if (!item || !user) return;
      const now = new Date().toISOString();
      const nextState: AuditContentState = {
        id: item.id,
        contentType: item.contentType,
        certificationId: item.certificationId,
        provider: item.provider,
        editorialStatus: archived ? 'archived' : 'to_verify',
        validationStatus: archived ? item.validationStatus : 'pending_human',
        freshnessStatus: item.freshnessStatus,
        activeVersion: item.activeVersion,
        contentHash: item.contentHash,
        humanValidatedVersion: item.humanValidatedVersion,
        lastAuditedAt: item.lastAuditedAt,
        lastAuditModel: item.lastAuditModel,
        lastAuditConfidence: item.lastAuditConfidence,
        lastValidatedAt: item.lastValidatedAt,
        lastValidatedBy: item.lastValidatedBy,
        archived,
        updatedAt: now,
      };
      await saveAuditContentState(nextState);
      setContentStates((prev) => ({ ...prev, [item.id]: nextState }));
    },
    [inventory, user]
  );

  const saveSettings = useCallback(async (next: AuditSettings) => {
    await saveAuditSettings(next);
    setSettings(next);
  }, []);

  const upsertAdmin = useCallback(async (account: AdminAccount) => {
    await saveAdminAccount(account);
    setAdmins((prev) => {
      const exists = prev.some((a) => a.uid === account.uid);
      return exists ? prev.map((a) => (a.uid === account.uid ? account : a)) : [...prev, account];
    });
  }, []);

  return (
    <AuditContext.Provider
      value={{
        loading,
        error,
        inventory,
        certifications,
        sources,
        evidence,
        runs,
        findings,
        reviews,
        revisions,
        settings,
        admins,
        counters,
        qualityMetrics,
        priorityAlerts,
        latestAiSuggestions,
        activeBatchProgress,
        refreshAdminData,
        runAuditScope,
        cancelActiveRun,
        checkSourceLink,
        saveSource,
        removeSource,
        addEvidence,
        updateFindingStatus,
        saveContentRevision,
        restoreRevision,
        submitHumanValidation,
        dismissAiSuggestion,
        saveCertificationRef,
        setContentArchiveState,
        saveSettings,
        upsertAdmin,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = () => {
  const ctx = useContext(AuditContext);
  if (!ctx) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return ctx;
};
