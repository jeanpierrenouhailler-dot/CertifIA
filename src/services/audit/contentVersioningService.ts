import type {
  AuditContentState,
  ContentItem,
  ContentRevision,
  PublishedContentOverride,
} from '../../types/audit';
import {
  computeDeterministicHash,
  computeStructuredDiff,
  type FieldDiffEntry,
} from './hashAndDiffService';

export interface RevisionCreationResult {
  revision: ContentRevision;
  nextState: AuditContentState;
  diffs: FieldDiffEntry[];
}

/**
 * Creates an immutable versioned ContentRevision, computes field diffs against the
 * previous payload, updates the content hash, and invalidates any prior human validation.
 */
export function createContentRevision(params: {
  item: ContentItem;
  updatedPayloadFr: Record<string, unknown>;
  updatedPayloadEn?: Record<string, unknown> | null;
  authorUid: string;
  authorEmail: string;
  changeNote: string;
  restoredFromVersion?: number;
}): RevisionCreationResult {
  const now = new Date().toISOString();
  const nextVersion = params.item.activeVersion + 1;
  const diffs = computeStructuredDiff(params.item.payloadFr, params.updatedPayloadFr);
  const newHash = computeDeterministicHash({
    fr: params.updatedPayloadFr,
    en: params.updatedPayloadEn ?? params.item.payloadEn ?? null,
    docUrl: params.updatedPayloadFr.officialDocUrl || params.item.officialDocUrl || null,
  });

  const materialChange = diffs.length > 0 || newHash !== params.item.contentHash;
  const diffSummary =
    diffs.length > 0
      ? diffs.map((d) => `${d.field}: "${d.before.slice(0, 80)}" → "${d.after.slice(0, 80)}"`).join(' | ')
      : 'Modification mineure / métadonnées';

  const safeContent = params.item.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const revision: ContentRevision = {
    id: `ver-${safeContent}-v${nextVersion}-${Date.now()}`,
    contentId: params.item.id,
    versionNumber: nextVersion,
    contentHash: newHash,
    authorUid: params.authorUid,
    authorEmail: params.authorEmail,
    changeNote: params.changeNote.trim() || `Révision v${nextVersion}`,
    diffSummary: diffSummary.slice(0, 4000),
    snapshotJson: JSON.stringify({
      payloadFr: params.updatedPayloadFr,
      payloadEn: params.updatedPayloadEn ?? params.item.payloadEn ?? null,
    }),
    invalidatesPriorValidation: materialChange && Boolean(params.item.humanValidatedVersion),
    restoredFromVersion: params.restoredFromVersion,
    createdAt: now,
  };

  const nextState: AuditContentState = {
    id: params.item.id,
    contentType: params.item.contentType,
    certificationId: params.item.certificationId,
    provider: params.item.provider,
    editorialStatus: 'to_verify',
    validationStatus: materialChange ? 'invalidated_by_edit' : params.item.validationStatus,
    freshnessStatus: params.item.freshnessStatus,
    activeVersion: nextVersion,
    contentHash: newHash,
    humanValidatedVersion: materialChange ? undefined : params.item.humanValidatedVersion,
    lastAuditedAt: params.item.lastAuditedAt,
    lastAuditModel: params.item.lastAuditModel,
    lastAuditConfidence: params.item.lastAuditConfidence,
    lastValidatedAt: materialChange ? undefined : params.item.lastValidatedAt,
    lastValidatedBy: materialChange ? undefined : params.item.lastValidatedBy,
    archived: params.item.archived,
    updatedAt: now,
  };

  return { revision, nextState, diffs };
}

/**
 * Parses a saved ContentRevision snapshot safely for restoration / comparison.
 */
export function parseRevisionSnapshot(revision: ContentRevision): {
  payloadFr: Record<string, unknown>;
  payloadEn?: Record<string, unknown> | null;
} | null {
  try {
    const parsed = JSON.parse(revision.snapshotJson) as {
      payloadFr?: Record<string, unknown>;
      payloadEn?: Record<string, unknown> | null;
    };
    if (!parsed || !parsed.payloadFr) return null;
    return {
      payloadFr: parsed.payloadFr,
      payloadEn: parsed.payloadEn ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Builds the live runtime PublishedContentOverride record ONLY after an explicit
 * human approval (`approved` or `approved_with_reserves`).
 */
export function buildPublishedOverride(params: {
  item: ContentItem;
  approvedByEmail: string;
  isArchived?: boolean;
}): PublishedContentOverride {
  return {
    id: params.item.id,
    contentType: params.item.contentType,
    approvedVersion: params.item.activeVersion,
    approvedBy: params.approvedByEmail,
    approvedAt: new Date().toISOString(),
    patchJson: JSON.stringify(params.item.payloadFr),
    isArchived: Boolean(params.isArchived ?? params.item.archived),
  };
}
