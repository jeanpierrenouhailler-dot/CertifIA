export type ContentType =
  | 'certification'
  | 'domain'
  | 'quiz_question'
  | 'exam_question'
  | 'flashcard'
  | 'glossary';

export type AuditProvider = 'azure' | 'aws' | 'gcp' | 'ibm' | 'nvidia' | 'general';

export type EditorialStatus =
  | 'draft'
  | 'to_verify'
  | 'ai_audited'
  | 'under_review'
  | 'approved'
  | 'approved_with_reserves'
  | 'published'
  | 'to_fix'
  | 'obsolete'
  | 'archived';

export type ValidationStatus =
  | 'pending_human'
  | 'validated'
  | 'validated_with_reserves'
  | 'rejected'
  | 'invalidated_by_edit';

export type FreshnessStatus = 'fresh' | 'review_due' | 'stale' | 'unverified';

export type SourcePriorityLevel = 1 | 2 | 3 | 4;

export type SourceType =
  | 'official_vendor_doc'
  | 'official_exam_guide'
  | 'official_changelog'
  | 'supplemental_reference'
  | 'internal_editorial_note';

export type SourceAvailabilityStatus =
  | 'reachable'
  | 'redirected'
  | 'broken'
  | 'blocked_or_unverified'
  | 'unchecked';

export type FindingCategory =
  | 'exactitude_technique'
  | 'obsolescence_certification'
  | 'incoherence_pedagogique'
  | 'probleme_traduction_fr_en'
  | 'ambiguite_question_distracteurs'
  | 'justification_insuffisante'
  | 'source_absente_ou_non_officielle'
  | 'duplication_redondance'
  | 'erreur_metadonnee'
  | 'risque_hallucination_editorial';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';

export type FindingStatus =
  | 'new'
  | 'analyzing'
  | 'to_fix'
  | 'corrected'
  | 'pending_validation'
  | 'resolved'
  | 'dismissed';

export type OfficialCertStatus =
  | 'active'
  | 'announced_retirement'
  | 'retired'
  | 'suspended'
  | 'historical';

export type AuditScopeType =
  | 'single'
  | 'selection'
  | 'certification'
  | 'domain'
  | 'provider'
  | 'all_catalog';

export interface ContentItem {
  id: string;
  sourceEntityId: string;
  contentType: ContentType;
  certificationId: string;
  certificationCode: string;
  provider: AuditProvider;
  domainId?: string;
  domainName?: string;
  title: string;
  summary: string;
  localeCoverage: 'fr_only' | 'en_only' | 'fr_en';
  officialDocUrl?: string;
  payloadFr: Record<string, unknown>;
  payloadEn?: Record<string, unknown> | null;
  contentHash: string;
  activeVersion: number;
  editorialStatus: EditorialStatus;
  validationStatus: ValidationStatus;
  freshnessStatus: FreshnessStatus;
  lastAuditedAt?: string;
  lastAuditModel?: string;
  lastAuditConfidence?: number;
  humanValidatedVersion?: number;
  lastValidatedAt?: string;
  lastValidatedBy?: string;
  openFindingsCount: number;
  criticalFindingsCount: number;
  attachedSourceIds: string[];
  archived: boolean;
  updatedAt: string;
}

export interface AuditContentState {
  id: string;
  contentType: ContentType;
  certificationId: string;
  provider: AuditProvider;
  editorialStatus: EditorialStatus;
  validationStatus: ValidationStatus;
  freshnessStatus: FreshnessStatus;
  activeVersion: number;
  contentHash: string;
  humanValidatedVersion?: number;
  lastAuditedAt?: string;
  lastAuditModel?: string;
  lastAuditConfidence?: number;
  lastValidatedAt?: string;
  lastValidatedBy?: string;
  archived: boolean;
  updatedAt: string;
}

export interface SourceReference {
  id: string;
  title: string;
  vendor: 'microsoft' | 'aws' | 'google' | 'ibm' | 'nvidia' | string;
  url: string;
  finalUrl?: string;
  sourceType: SourceType;
  priorityLevel: SourcePriorityLevel;
  availabilityStatus: SourceAvailabilityStatus;
  httpStatus?: number;
  lastCheckedAt?: string;
  lastModifiedHeader?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface ContentEvidence {
  id: string;
  contentId: string;
  claimSummary: string;
  sourceId: string;
  sourceUrl: string;
  excerpt: string;
  supportsClaim: boolean;
  verifiedAt: string;
  verifiedBy: string;
}

export interface AuditRun {
  id: string;
  scopeType: AuditScopeType;
  scopeLabel: string;
  targetCount: number;
  completedCount: number;
  findingsCount: number;
  modelIdentifier: string;
  promptVersion: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  initiatedBy: string;
  summary: string;
}

export interface AuditFinding {
  id: string;
  runId: string;
  contentId: string;
  contentType: ContentType;
  contentVersion: number;
  category: FindingCategory;
  severity: FindingSeverity;
  status: FindingStatus;
  title: string;
  rationale: string;
  problematicExcerpt: string;
  recommendedAction: string;
  sourceBasis: string;
  needsHumanConfirmation: boolean;
  origin: 'deterministic' | 'ai_assisted' | 'human';
  resolutionComment?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
}

export interface HumanReview {
  id: string;
  contentId: string;
  contentVersion: number;
  reviewerUid: string;
  reviewerEmail: string;
  decision: 'approved' | 'approved_with_reserves' | 'rejected' | 'needs_source';
  justification: string;
  conditionalReserves?: string;
  attachedSourceIds: string[];
  reviewedAt: string;
}

export interface ContentRevision {
  id: string;
  contentId: string;
  versionNumber: number;
  contentHash: string;
  authorUid: string;
  authorEmail: string;
  changeNote: string;
  diffSummary: string;
  snapshotJson: string;
  invalidatesPriorValidation: boolean;
  restoredFromVersion?: number;
  createdAt: string;
}

export interface CertificationReference {
  id: string;
  code: string;
  title: string;
  provider: AuditProvider;
  officialStatus: OfficialCertStatus;
  launchDate?: string;
  deprecationAnnouncedDate?: string;
  retirementDate?: string;
  durationMinutes: number;
  itemsCount: number;
  passScore: number;
  maxScore: number;
  examPrice?: string;
  languagesSummary: string;
  officialUrl: string;
  domainWeightsSummary: string;
  changeAlert?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AuditSettings {
  id: string;
  activeAiModel: string;
  promptVersion: string;
  freshnessMaxDays: number;
  dailyAiCallCap: number;
  maxBatchSize: number;
  requireOfficialSourceForApproval: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface PublishedContentOverride {
  id: string;
  contentType: ContentType;
  approvedVersion: number;
  approvedBy: string;
  approvedAt: string;
  patchJson: string;
  isArchived: boolean;
}

export interface AdminAccount {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin';
  active: boolean;
  addedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditQualityMetrics {
  technicalComplianceRate: number;
  sourcedContentRate: number;
  translationCoherenceRate: number;
  humanValidationRate: number;
  staleOrDeprecatedRate: number;
  methodologyNote: string;
}

export interface PriorityAlert {
  id: string;
  severity: FindingSeverity;
  type: 'critical_finding' | 'broken_source' | 'retired_certification' | 'missing_source' | 'stale_content' | 'invalidated_validation';
  contentId?: string;
  title: string;
  detail: string;
  targetTab: string;
}

export interface AiAnalysisServerResponse {
  contentId: string;
  contentVersion: number;
  modelIdentifier: string;
  promptVersion: string;
  analyzedAt: string;
  analyzedBy: string;
  remainingDailyBudget: number;
  usageMetadata: Record<string, unknown> | null;
  result: {
    overallVerdict: 'pass' | 'warning' | 'fail';
    confidenceScore: number;
    summary: string;
    limitations: string[];
    findings: Array<{
      category: FindingCategory;
      severity: FindingSeverity;
      title: string;
      rationale: string;
      problematicExcerpt: string;
      recommendedAction: string;
      sourceBasis: string;
      needsHumanConfirmation: boolean;
    }>;
    proposedRevision: {
      suggestedTitle?: string;
      suggestedSummary?: string;
      suggestedExplanation?: string;
      suggestedTrap?: string;
      changeNote: string;
    };
  };
}
