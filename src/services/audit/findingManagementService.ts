import type {
  AuditFinding,
  FindingSeverity,
  FindingStatus,
} from '../../types/audit';

export const SEVERITY_WEIGHT: Record<FindingSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function isOpenFindingStatus(status: FindingStatus): boolean {
  return status !== 'resolved' && status !== 'dismissed';
}

export function sortFindingsBySeverityAndDate(findings: AuditFinding[]): AuditFinding[] {
  return [...findings].sort((a, b) => {
    const openDiff = Number(isOpenFindingStatus(b.status)) - Number(isOpenFindingStatus(a.status));
    if (openDiff !== 0) return openDiff;
    const sevDiff = SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
    if (sevDiff !== 0) return sevDiff;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

/**
 * Merges newly discovered findings with existing finding history without deleting or
 * overwriting resolved/historical records. Deduplicates only exact identical open IDs or same category+title while open.
 */
export function mergeFindingsPreservingHistory(
  existing: AuditFinding[],
  incoming: AuditFinding[]
): { merged: AuditFinding[]; added: AuditFinding[] } {
  const bySignature = new Map<string, AuditFinding>();
  for (const f of existing) {
    if (isOpenFindingStatus(f.status)) {
      bySignature.set(`${f.contentId}::${f.category}::${f.title}`, f);
    }
  }

  const added: AuditFinding[] = [];
  for (const f of incoming) {
    const sig = `${f.contentId}::${f.category}::${f.title}`;
    if (!bySignature.has(sig)) {
      bySignature.set(sig, f);
      added.push(f);
    }
  }

  return {
    merged: sortFindingsBySeverityAndDate([...existing, ...added]),
    added,
  };
}

export function transitionFindingStatus(
  finding: AuditFinding,
  nextStatus: FindingStatus,
  actorEmail: string,
  resolutionComment?: string
): AuditFinding {
  const now = new Date().toISOString();
  const closing = nextStatus === 'resolved' || nextStatus === 'dismissed';
  return {
    ...finding,
    status: nextStatus,
    resolutionComment: resolutionComment ?? finding.resolutionComment,
    resolvedAt: closing ? now : undefined,
    resolvedBy: closing ? actorEmail : undefined,
  };
}
