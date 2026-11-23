import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import type {
  AdminAccount,
  AuditContentState,
  AuditFinding,
  AuditRun,
  AuditSettings,
  CertificationReference,
  ContentEvidence,
  ContentRevision,
  HumanReview,
  PublishedContentOverride,
  SourceReference,
} from '../../types/audit';

export const DEFAULT_AUDIT_SETTINGS: AuditSettings = {
  id: 'global',
  activeAiModel: 'gemini-4-hydrogen',
  promptVersion: 'audit-v1.0.0',
  freshnessMaxDays: 90,
  dailyAiCallCap: 120,
  maxBatchSize: 25,
  requireOfficialSourceForApproval: true,
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};

function cleanForFirestore<T extends object>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

export async function loadPublishedOverridesPublic(): Promise<Record<string, PublishedContentOverride>> {
  try {
    const snap = await getDocs(collection(db, 'publishedContent'));
    const map: Record<string, PublishedContentOverride> = {};
    snap.forEach((d) => {
      const data = d.data() as PublishedContentOverride;
      map[d.id] = data;
    });
    return map;
  } catch (err) {
    console.warn('[PublishedContent] Unable to load live overrides, falling back to bundled baseline:', err);
    return {};
  }
}

export interface LoadedAdminAuditBundle {
  contentStates: Record<string, AuditContentState>;
  certifications: CertificationReference[];
  sources: SourceReference[];
  evidence: ContentEvidence[];
  runs: AuditRun[];
  findings: AuditFinding[];
  reviews: HumanReview[];
  revisions: ContentRevision[];
  settings: AuditSettings;
  admins: AdminAccount[];
  publishedOverrides: Record<string, PublishedContentOverride>;
}

export async function loadAllAdminAuditCollections(): Promise<LoadedAdminAuditBundle> {
  try {
    const [
      statesSnap,
      certsSnap,
      sourcesSnap,
      evidenceSnap,
      runsSnap,
      findingsSnap,
      reviewsSnap,
      revisionsSnap,
      settingsSnap,
      adminsSnap,
      publishedSnap,
    ] = await Promise.all([
      getDocs(collection(db, 'auditContentState')),
      getDocs(collection(db, 'auditCertifications')),
      getDocs(collection(db, 'auditSources')),
      getDocs(collection(db, 'auditEvidence')),
      getDocs(query(collection(db, 'auditRuns'), orderBy('startedAt', 'desc'))),
      getDocs(collection(db, 'auditFindings')),
      getDocs(query(collection(db, 'auditReviews'), orderBy('reviewedAt', 'desc'))),
      getDocs(query(collection(db, 'auditRevisions'), orderBy('createdAt', 'desc'))),
      getDocs(collection(db, 'auditSettings')),
      getDocs(collection(db, 'admins')),
      getDocs(collection(db, 'publishedContent')),
    ]);

    const contentStates: Record<string, AuditContentState> = {};
    statesSnap.forEach((d) => {
      contentStates[d.id] = d.data() as AuditContentState;
    });

    const publishedOverrides: Record<string, PublishedContentOverride> = {};
    publishedSnap.forEach((d) => {
      publishedOverrides[d.id] = d.data() as PublishedContentOverride;
    });

    const settingsDoc = settingsSnap.docs.find((d) => d.id === 'global')?.data() as
      | AuditSettings
      | undefined;

    return {
      contentStates,
      certifications: certsSnap.docs.map((d) => d.data() as CertificationReference),
      sources: sourcesSnap.docs.map((d) => d.data() as SourceReference),
      evidence: evidenceSnap.docs.map((d) => d.data() as ContentEvidence),
      runs: runsSnap.docs.map((d) => d.data() as AuditRun),
      findings: findingsSnap.docs.map((d) => d.data() as AuditFinding),
      reviews: reviewsSnap.docs.map((d) => ({
        ...(d.data() as Omit<HumanReview, 'attachedSourceIds'>),
        attachedSourceIds: parseJsonArray(
          (d.data() as { attachedSourceIdsJson?: string; attachedSourceIds?: string[] })
            .attachedSourceIdsJson,
          (d.data() as { attachedSourceIds?: string[] }).attachedSourceIds
        ),
      })),
      revisions: revisionsSnap.docs.map((d) => d.data() as ContentRevision),
      settings: settingsDoc || DEFAULT_AUDIT_SETTINGS,
      admins: adminsSnap.docs.map((d) => d.data() as AdminAccount),
      publishedOverrides,
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'auditCollections');
  }
}

function parseJsonArray(json?: string, fallback?: string[]): string[] {
  if (Array.isArray(fallback)) return fallback;
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function sanitizeDocId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_:-]/g, '_').slice(0, 128);
}

export async function saveAuditContentState(state: AuditContentState): Promise<void> {
  const safeId = sanitizeDocId(state.id);
  try {
    await setDoc(doc(db, 'auditContentState', safeId), cleanForFirestore({ ...state, id: safeId }), {
      merge: true,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `auditContentState/${safeId}`);
  }
}

export async function saveCertificationReference(cert: CertificationReference): Promise<void> {
  const safeId = sanitizeDocId(cert.id);
  try {
    await setDoc(doc(db, 'auditCertifications', safeId), cleanForFirestore({ ...cert, id: safeId }), {
      merge: true,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `auditCertifications/${safeId}`);
  }
}

export async function saveSourceReference(source: SourceReference): Promise<void> {
  const safeId = sanitizeDocId(source.id);
  try {
    await setDoc(doc(db, 'auditSources', safeId), cleanForFirestore({ ...source, id: safeId }), {
      merge: true,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `auditSources/${safeId}`);
  }
}

export async function deleteSourceReference(sourceId: string): Promise<void> {
  const safeId = sanitizeDocId(sourceId);
  try {
    await deleteDoc(doc(db, 'auditSources', safeId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `auditSources/${safeId}`);
  }
}

export async function saveContentEvidence(evidence: ContentEvidence): Promise<void> {
  const safeId = sanitizeDocId(evidence.id);
  try {
    await setDoc(doc(db, 'auditEvidence', safeId), cleanForFirestore({ ...evidence, id: safeId }), {
      merge: true,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `auditEvidence/${safeId}`);
  }
}

export async function saveAuditRun(run: AuditRun): Promise<void> {
  const safeId = sanitizeDocId(run.id);
  try {
    await setDoc(doc(db, 'auditRuns', safeId), cleanForFirestore({ ...run, id: safeId }), {
      merge: true,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `auditRuns/${safeId}`);
  }
}

export async function saveAuditFinding(finding: AuditFinding): Promise<void> {
  const safeId = sanitizeDocId(finding.id);
  try {
    await setDoc(doc(db, 'auditFindings', safeId), cleanForFirestore({ ...finding, id: safeId }), {
      merge: true,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `auditFindings/${safeId}`);
  }
}

export async function createHumanReviewDoc(review: HumanReview): Promise<void> {
  const safeId = sanitizeDocId(review.id);
  try {
    await setDoc(
      doc(db, 'auditReviews', safeId),
      cleanForFirestore({
        id: safeId,
        contentId: review.contentId,
        contentVersion: review.contentVersion,
        reviewerUid: review.reviewerUid,
        reviewerEmail: review.reviewerEmail,
        decision: review.decision,
        justification: review.justification,
        conditionalReserves: review.conditionalReserves,
        attachedSourceIdsJson: JSON.stringify(review.attachedSourceIds || []),
        reviewedAt: review.reviewedAt,
      })
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `auditReviews/${safeId}`);
  }
}

export async function createContentRevisionDoc(revision: ContentRevision): Promise<void> {
  const safeId = sanitizeDocId(revision.id);
  try {
    await setDoc(doc(db, 'auditRevisions', safeId), cleanForFirestore({ ...revision, id: safeId }));
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `auditRevisions/${safeId}`);
  }
}

export async function saveAuditSettings(settings: AuditSettings): Promise<void> {
  try {
    await setDoc(doc(db, 'auditSettings', 'global'), cleanForFirestore({ ...settings }), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'auditSettings/global');
  }
}

export async function savePublishedContentOverride(
  override: PublishedContentOverride
): Promise<void> {
  const safeId = sanitizeDocId(override.id);
  try {
    await setDoc(
      doc(db, 'publishedContent', safeId),
      cleanForFirestore({ ...override, id: safeId }),
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `publishedContent/${safeId}`);
  }
}

export async function saveAdminAccount(account: AdminAccount): Promise<void> {
  const safeId = sanitizeDocId(account.uid);
  try {
    await setDoc(doc(db, 'admins', safeId), cleanForFirestore({ ...account, uid: safeId }), {
      merge: true,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `admins/${safeId}`);
  }
}
