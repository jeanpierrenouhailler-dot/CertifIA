import type {
  AiAnalysisServerResponse,
  AuditFinding,
  ContentEvidence,
  ContentItem,
  SourceReference,
} from '../../types/audit';

/**
 * Executes an AI-assisted audit for a single ContentItem via the protected Express proxy `/api/audit/analyze`.
 * Never auto-approves or auto-publishes results; always generates reviewable findings tied to exact version & model ID.
 */
export async function analyzeContentItemWithServerAI(params: {
  item: ContentItem;
  sources: SourceReference[];
  evidence: ContentEvidence[];
  idToken: string;
  locale: 'fr' | 'en';
  dailyCap: number;
  runId: string;
}): Promise<{
  response: AiAnalysisServerResponse;
  findings: AuditFinding[];
}> {
  const { item, sources, evidence, idToken, locale, dailyCap, runId } = params;

  const attachedSources = sources
    .filter(
      (s) =>
        item.attachedSourceIds.includes(s.id) ||
        (item.officialDocUrl && s.url === item.officialDocUrl)
    )
    .map((s) => {
      const ev = evidence.find((e) => e.contentId === item.id && e.sourceId === s.id);
      return {
        id: s.id,
        title: s.title,
        url: s.url,
        sourceType: s.sourceType,
        priorityLevel: s.priorityLevel,
        availabilityStatus: s.availabilityStatus,
        excerpt: ev?.excerpt || '',
      };
    });

  const resp = await fetch('/api/audit/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      contentId: item.id,
      contentType: item.contentType,
      contentVersion: item.activeVersion,
      locale,
      certificationCode: item.certificationCode,
      provider: item.provider,
      serializedContent: item.payloadFr,
      counterpartContent: item.payloadEn || null,
      attachedSources,
      dailyCap,
    }),
  });

  const payload = await resp.json();
  if (!resp.ok) {
    throw new Error(
      typeof payload?.error === 'string'
        ? payload.error
        : `Erreur serveur d’audit IA (HTTP ${resp.status})`
    );
  }

  const typed = payload as AiAnalysisServerResponse;
  const now = typed.analyzedAt || new Date().toISOString();
  const safeContent = item.id.replace(/[^a-zA-Z0-9_-]/g, '_');

  const findings: AuditFinding[] = typed.result.findings.map((f, idx) => ({
    id: `ai-${runId}-${safeContent}-${idx + 1}`.slice(0, 124),
    runId,
    contentId: item.id,
    contentType: item.contentType,
    contentVersion: item.activeVersion,
    category: f.category,
    severity: f.severity,
    status: 'new',
    title: f.title,
    rationale: f.rationale,
    problematicExcerpt: f.problematicExcerpt,
    recommendedAction: f.recommendedAction,
    sourceBasis: f.sourceBasis,
    needsHumanConfirmation: true,
    origin: 'ai_assisted',
    createdAt: now,
  }));

  return { response: typed, findings };
}
