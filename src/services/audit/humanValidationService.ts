import type {
  AuditFinding,
  AuditSettings,
  CertificationReference,
  ContentEvidence,
  ContentItem,
  HumanReview,
  SourceReference,
} from '../../types/audit';
import { isOpenFindingStatus } from './findingManagementService';
import { isOfficialPrioritySource } from './sourceRegistryService';

export interface ApprovalEligibilityResult {
  canApprove: boolean;
  canApproveWithReserves: boolean;
  blockingReasons: string[];
  warnings: string[];
}

export function evaluateHumanApprovalEligibility(params: {
  item: ContentItem;
  findings: AuditFinding[];
  sources: SourceReference[];
  evidence: ContentEvidence[];
  certifications: CertificationReference[];
  settings: AuditSettings;
  hasPendingAiSuggestion?: boolean;
}): ApprovalEligibilityResult {
  const { item, findings, sources, evidence, certifications, settings, hasPendingAiSuggestion } = params;
  const blockingReasons: string[] = [];
  const warnings: string[] = [];

  const itemFindings = findings.filter((f) => f.contentId === item.id);
  const openCritical = itemFindings.filter(
    (f) => f.severity === 'critical' && isOpenFindingStatus(f.status)
  );
  const openHigh = itemFindings.filter(
    (f) => f.severity === 'high' && isOpenFindingStatus(f.status)
  );

  if (openCritical.length > 0) {
    blockingReasons.push(
      `${openCritical.length} anomalie(s) critique(s) ouverte(s) empêchent la validation (${openCritical[0].title}).`
    );
  }

  // Verify MCQ / Exam explanation and answer key presence
  if (item.contentType === 'quiz_question' || item.contentType === 'exam_question') {
    const options = Array.isArray(item.payloadFr.options)
      ? (item.payloadFr.options as Array<{ key?: string }>)
      : [];
    const correctKey = String(item.payloadFr.correctKey || '');
    const validKey = options.some((o) => o.key === correctKey);
    if (!validKey || options.length < 4) {
      blockingReasons.push('La réponse correcte du QCM ou ses 4 options ne sont pas valides.');
    }
    const expl = item.payloadFr.explanation as Record<string, unknown> | undefined;
    const hasReason =
      typeof expl?.mainReason === 'string' && expl.mainReason.trim().length >= 20;
    if (!hasReason) {
      blockingReasons.push(
        'Aucune justification pédagogique suffisante (explanation.mainReason) n’est renseignée.'
      );
    }
  }

  // Verify certification lifecycle status consistency
  const certRef = certifications.find((c) => c.id === item.certificationId);
  if (
    certRef &&
    (certRef.officialStatus === 'retired' || certRef.officialStatus === 'suspended') &&
    !item.archived
  ) {
    blockingReasons.push(
      `La certification ${certRef.code} est marquée « ${certRef.officialStatus} ». L’élément doit être archivé ou reclassé obsolète/historique avant validation active.`
    );
  }

  // Official source requirement
  const attachedSources = sources.filter(
    (s) =>
      item.attachedSourceIds.includes(s.id) ||
      (item.officialDocUrl && s.url === item.officialDocUrl)
  );
  const hasOfficialSource = attachedSources.some((s) => isOfficialPrioritySource(s));
  const hasBrokenSource = attachedSources.some((s) => s.availabilityStatus === 'broken');
  const itemEvidence = evidence.filter((e) => e.contentId === item.id && e.supportsClaim);

  if (hasBrokenSource) {
    blockingReasons.push('Une source rattachée est cassée (erreur HTTP). Corrigez ou remplacez le lien.');
  }

  if (
    (settings.requireOfficialSourceForApproval ||
      item.contentType === 'certification' ||
      item.contentType === 'quiz_question' ||
      item.contentType === 'exam_question') &&
    !hasOfficialSource &&
    !item.officialDocUrl &&
    itemEvidence.length === 0
  ) {
    blockingReasons.push(
      'Aucune source officielle (priorité 1 à 3) ni preuve documentaire n’appuie cet élément.'
    );
  }

  if (hasPendingAiSuggestion) {
    blockingReasons.push(
      'Une proposition de correction assistée est en attente d’arbitrage : appliquez-la ou écartez-la explicitement.'
    );
  }

  if (openHigh.length > 0) {
    warnings.push(`${openHigh.length} anomalie(s) majeure(s) restent ouverte(s) — validation possible uniquement sous réserve ou après résolution.`);
  }

  if (item.localeCoverage !== 'fr_en' && (item.contentType === 'quiz_question' || item.contentType === 'exam_question' || item.contentType === 'glossary')) {
    warnings.push('Contrepartie linguistique EN incomplète.');
  }

  return {
    canApprove: blockingReasons.length === 0 && openHigh.length === 0,
    canApproveWithReserves: blockingReasons.length === 0,
    blockingReasons,
    warnings,
  };
}

export function buildHumanReviewRecord(params: {
  contentId: string;
  contentVersion: number;
  reviewerUid: string;
  reviewerEmail: string;
  decision: HumanReview['decision'];
  justification: string;
  conditionalReserves?: string;
  attachedSourceIds: string[];
}): HumanReview {
  if (!params.justification.trim()) {
    throw new Error('Une justification humaine est obligatoire pour enregistrer la décision.');
  }
  if (
    params.decision === 'approved_with_reserves' &&
    (!params.conditionalReserves || !params.conditionalReserves.trim())
  ) {
    throw new Error('Les réserves documentées sont obligatoires pour une validation sous réserve.');
  }

  const now = new Date().toISOString();
  const safeId = params.contentId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return {
    id: `rev-${safeId}-v${params.contentVersion}-${Date.now()}`,
    contentId: params.contentId,
    contentVersion: params.contentVersion,
    reviewerUid: params.reviewerUid,
    reviewerEmail: params.reviewerEmail,
    decision: params.decision,
    justification: params.justification.trim(),
    conditionalReserves: params.conditionalReserves?.trim() || undefined,
    attachedSourceIds: params.attachedSourceIds,
    reviewedAt: now,
  };
}
