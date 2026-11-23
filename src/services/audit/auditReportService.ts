import type {
  AuditFinding,
  AuditQualityMetrics,
  AuditRun,
  CertificationReference,
  ContentItem,
  HumanReview,
  PriorityAlert,
  SourceReference,
} from '../../types/audit';
import { isOpenFindingStatus, SEVERITY_WEIGHT } from './findingManagementService';

export interface InventoryCounters {
  totalItems: number;
  auditedItems: number;
  humanValidatedItems: number;
  pendingHumanValidationItems: number;
  openFindingsTotal: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  retiredOrAnnouncedCerts: number;
  brokenOrUncheckedSources: number;
  byType: Record<ContentItem['contentType'], number>;
}

export function computeInventoryCounters(params: {
  items: ContentItem[];
  findings: AuditFinding[];
  sources: SourceReference[];
  certifications: CertificationReference[];
}): InventoryCounters {
  const { items, findings, sources, certifications } = params;
  const activeItems = items.filter((i) => !i.archived);
  const openFindings = findings.filter((f) => isOpenFindingStatus(f.status));

  const byType: InventoryCounters['byType'] = {
    certification: 0,
    domain: 0,
    quiz_question: 0,
    exam_question: 0,
    flashcard: 0,
    glossary: 0,
  };

  let auditedItems = 0;
  let humanValidatedItems = 0;
  let pendingHumanValidationItems = 0;

  for (const item of activeItems) {
    byType[item.contentType] += 1;
    if (item.lastAuditedAt) auditedItems += 1;
    if (
      (item.validationStatus === 'validated' || item.validationStatus === 'validated_with_reserves') &&
      item.humanValidatedVersion === item.activeVersion
    ) {
      humanValidatedItems += 1;
    } else {
      pendingHumanValidationItems += 1;
    }
  }

  return {
    totalItems: activeItems.length,
    auditedItems,
    humanValidatedItems,
    pendingHumanValidationItems,
    openFindingsTotal: openFindings.length,
    criticalFindings: openFindings.filter((f) => f.severity === 'critical').length,
    highFindings: openFindings.filter((f) => f.severity === 'high').length,
    mediumFindings: openFindings.filter((f) => f.severity === 'medium').length,
    lowFindings: openFindings.filter((f) => f.severity === 'low').length,
    retiredOrAnnouncedCerts: certifications.filter(
      (c) => c.officialStatus === 'retired' || c.officialStatus === 'announced_retirement' || c.officialStatus === 'suspended'
    ).length,
    brokenOrUncheckedSources: sources.filter(
      (s) => s.availabilityStatus === 'broken' || s.availabilityStatus === 'blocked_or_unverified'
    ).length,
    byType,
  };
}

/**
 * Calculates the 5 core editorial quality indicators using explicit, auditable ratios.
 * Zero invented or static placeholder percentages.
 */
export function computeAuditQualityMetrics(params: {
  items: ContentItem[];
  findings: AuditFinding[];
  certifications: CertificationReference[];
}): AuditQualityMetrics {
  const active = params.items.filter((i) => !i.archived);
  const total = active.length;
  if (total === 0) {
    return {
      technicalComplianceRate: 0,
      sourcedContentRate: 0,
      translationCoherenceRate: 0,
      humanValidationRate: 0,
      staleOrDeprecatedRate: 0,
      methodologyNote: 'Aucun élément actif inventorié.',
    };
  }

  const openCriticalOrHighIds = new Set(
    params.findings
      .filter((f) => isOpenFindingStatus(f.status) && (f.severity === 'critical' || f.severity === 'high'))
      .map((f) => f.contentId)
  );
  const retiredCertIds = new Set(
    params.certifications
      .filter((c) => c.officialStatus === 'retired' || c.officialStatus === 'suspended')
      .map((c) => c.id)
  );

  // Evaluated technical compliance is computed across items audited OR checked without open critical/high findings
  const compliantCount = active.filter((i) => !openCriticalOrHighIds.has(i.id)).length;
  const sourcedCount = active.filter((i) => i.attachedSourceIds.length > 0 || Boolean(i.officialDocUrl)).length;
  const bilingualCount = active.filter((i) => i.localeCoverage === 'fr_en').length;
  const validatedCount = active.filter(
    (i) =>
      (i.validationStatus === 'validated' || i.validationStatus === 'validated_with_reserves') &&
      i.humanValidatedVersion === i.activeVersion
  ).length;
  const staleOrDeprecatedCount = active.filter(
    (i) => i.freshnessStatus === 'stale' || retiredCertIds.has(i.certificationId)
  ).length;

  return {
    technicalComplianceRate: Math.round((compliantCount / total) * 1000) / 10,
    sourcedContentRate: Math.round((sourcedCount / total) * 1000) / 10,
    translationCoherenceRate: Math.round((bilingualCount / total) * 1000) / 10,
    humanValidationRate: Math.round((validatedCount / total) * 1000) / 10,
    staleOrDeprecatedRate: Math.round((staleOrDeprecatedCount / total) * 1000) / 10,
    methodologyNote:
      'Taux calculés strictement à partir des éléments actifs inventoriés, anomalies ouvertes, sources rattachées, couverture FR/EN et validations humaines liées à la version active.',
  };
}

export function buildSortedPriorityAlerts(params: {
  items: ContentItem[];
  findings: AuditFinding[];
  sources: SourceReference[];
  certifications: CertificationReference[];
}): PriorityAlert[] {
  const alerts: PriorityAlert[] = [];

  for (const cert of params.certifications) {
    if (cert.officialStatus !== 'active') {
      alerts.push({
        id: `alert-cert-${cert.id}`,
        severity: cert.officialStatus === 'retired' ? 'critical' : 'high',
        type: 'retired_certification',
        contentId: `cert:${cert.id}`,
        title: `Certification ${cert.code} — statut « ${cert.officialStatus} »`,
        detail: cert.changeAlert || cert.retirementDate || 'Statut officiel non actif nécessitant revue.',
        targetTab: 'certifications',
      });
    }
  }

  for (const src of params.sources) {
    if (src.availabilityStatus === 'broken') {
      alerts.push({
        id: `alert-src-${src.id}`,
        severity: 'high',
        type: 'broken_source',
        title: `Lien officiel inaccessible : ${src.title}`,
        detail: `${src.url} (HTTP ${src.httpStatus ?? 'Erreur'})`,
        targetTab: 'sources',
      });
    }
  }

  for (const f of params.findings) {
    if (isOpenFindingStatus(f.status) && (f.severity === 'critical' || f.severity === 'high')) {
      alerts.push({
        id: `alert-f-${f.id}`,
        severity: f.severity,
        type: 'critical_finding',
        contentId: f.contentId,
        title: f.title,
        detail: `${f.contentId} (v${f.contentVersion}) — ${f.rationale.slice(0, 140)}`,
        targetTab: 'findings',
      });
    }
  }

  for (const item of params.items) {
    if (!item.archived && item.validationStatus === 'invalidated_by_edit') {
      alerts.push({
        id: `alert-inv-${item.id}`,
        severity: 'high',
        type: 'invalidated_validation',
        contentId: item.id,
        title: `Revalidation requise après modification : ${item.title.slice(0, 80)}`,
        detail: `Version active v${item.activeVersion} non encore validée humainement.`,
        targetTab: 'validations',
      });
    }
  }

  return alerts.sort((a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]).slice(0, 25);
}

function escapeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportAuditReportToCsv(params: {
  items: ContentItem[];
  findings: AuditFinding[];
  reviews: HumanReview[];
  sources: SourceReference[];
}): string {
  const header = [
    'contentId',
    'contentType',
    'certificationCode',
    'provider',
    'title',
    'activeVersion',
    'contentHash',
    'editorialStatus',
    'validationStatus',
    'humanValidatedVersion',
    'lastValidatedBy',
    'lastValidatedAt',
    'freshnessStatus',
    'localeCoverage',
    'openFindingsCount',
    'criticalFindingsCount',
    'attachedSources',
    'officialDocUrl',
  ];

  const sourceMap = new Map(params.sources.map((s) => [s.id, s]));
  const rows = params.items.map((item) => {
    const srcUrls = item.attachedSourceIds
      .map((id) => sourceMap.get(id)?.url || id)
      .join(' | ');
    return [
      item.id,
      item.contentType,
      item.certificationCode,
      item.provider,
      item.title,
      item.activeVersion,
      item.contentHash,
      item.editorialStatus,
      item.validationStatus,
      item.humanValidatedVersion ?? '',
      item.lastValidatedBy ?? '',
      item.lastValidatedAt ?? '',
      item.freshnessStatus,
      item.localeCoverage,
      item.openFindingsCount,
      item.criticalFindingsCount,
      srcUrls,
      item.officialDocUrl ?? '',
    ]
      .map(escapeCsvCell)
      .join(',');
  });

  return `\uFEFF${header.join(',')}\n${rows.join('\n')}`;
}

export function exportAuditTraceabilityJson(params: {
  items: ContentItem[];
  findings: AuditFinding[];
  reviews: HumanReview[];
  runs: AuditRun[];
  sources: SourceReference[];
  certifications: CertificationReference[];
}): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      platform: 'CertifIA Content Audit Governance',
      summary: computeInventoryCounters(params),
      qualityMetrics: computeAuditQualityMetrics(params),
      certifications: params.certifications,
      sources: params.sources,
      runs: params.runs,
      findings: params.findings,
      reviews: params.reviews,
      inventorySampleCount: params.items.length,
      inventoryItems: params.items.map((i) => ({
        id: i.id,
        contentType: i.contentType,
        certificationCode: i.certificationCode,
        provider: i.provider,
        title: i.title,
        activeVersion: i.activeVersion,
        contentHash: i.contentHash,
        editorialStatus: i.editorialStatus,
        validationStatus: i.validationStatus,
        humanValidatedVersion: i.humanValidatedVersion,
        lastAuditedAt: i.lastAuditedAt,
        openFindingsCount: i.openFindingsCount,
        attachedSourceIds: i.attachedSourceIds,
      })),
    },
    null,
    2
  );
}
