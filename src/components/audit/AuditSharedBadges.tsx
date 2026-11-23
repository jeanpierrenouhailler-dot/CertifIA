import React from 'react';
import type {
  ContentItem,
  ContentType,
  EditorialStatus,
  FindingSeverity,
  FindingStatus,
  FreshnessStatus,
  OfficialCertStatus,
  SourceAvailabilityStatus,
  ValidationStatus,
} from '../../types/audit';

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  certification: 'Certification',
  domain: 'Domaine',
  quiz_question: 'QCM Scénarisé',
  exam_question: 'Examen Blanc',
  flashcard: 'Flashcard',
  glossary: 'Glossaire',
};

export const SEVERITY_STYLES: Record<FindingSeverity, string> = {
  critical: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30',
  high: 'bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/30',
  medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  low: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
};

export const SEVERITY_LABELS: Record<FindingSeverity, string> = {
  critical: 'Critique',
  high: 'Élevée',
  medium: 'Moyenne',
  low: 'Faible',
};

export const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  new: 'Nouvelle',
  analyzing: 'En cours d’analyse',
  to_fix: 'À corriger',
  corrected: 'Corrigée',
  pending_validation: 'En attente de validation',
  resolved: 'Résolue',
  dismissed: 'Rejetée / non retenue',
};

export const EDITORIAL_STATUS_LABELS: Record<EditorialStatus, string> = {
  draft: 'Brouillon',
  to_verify: 'À vérifier',
  ai_audited: 'Analysé par IA',
  under_review: 'En cours de revue',
  approved: 'Validé',
  approved_with_reserves: 'Validé sous réserve',
  published: 'Publié',
  to_fix: 'À corriger',
  obsolete: 'Obsolète',
  archived: 'Archivé',
};

export const VALIDATION_STATUS_LABELS: Record<ValidationStatus, string> = {
  pending_human: 'En attente humaine',
  validated: 'Validé humainement',
  validated_with_reserves: 'Validé avec réserves',
  rejected: 'Rejeté',
  invalidated_by_edit: 'Invalidé (modifié)',
};

export const FRESHNESS_LABELS: Record<FreshnessStatus, string> = {
  fresh: 'Frais',
  review_due: 'À revoir bientôt',
  stale: 'Obsolescence possible',
  unverified: 'Non vérifié',
};

export const CERT_STATUS_LABELS: Record<OfficialCertStatus, string> = {
  active: 'Active',
  announced_retirement: 'Retrait annoncé',
  retired: 'Retirée',
  suspended: 'Suspendue',
  historical: 'Historique',
};

export const SOURCE_AVAIL_LABELS: Record<SourceAvailabilityStatus, string> = {
  reachable: 'Accessible (HTTP 2xx)',
  redirected: 'Redirigée',
  broken: 'Lien cassé',
  blocked_or_unverified: 'Bloqué / Non vérifié',
  unchecked: 'Non vérifié',
};

export const SeverityBadge: React.FC<{ severity: FindingSeverity }> = ({ severity }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${SEVERITY_STYLES[severity]}`}
  >
    {SEVERITY_LABELS[severity]}
  </span>
);

export const ValidationBadge: React.FC<{ item: ContentItem }> = ({ item }) => {
  const isCurrentValidated =
    (item.validationStatus === 'validated' || item.validationStatus === 'validated_with_reserves') &&
    item.humanValidatedVersion === item.activeVersion;

  let tone = 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20';
  if (isCurrentValidated && item.validationStatus === 'validated') {
    tone = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
  } else if (isCurrentValidated && item.validationStatus === 'validated_with_reserves') {
    tone = 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
  } else if (item.validationStatus === 'rejected' || item.validationStatus === 'invalidated_by_edit') {
    tone = 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${tone}`}>
      {VALIDATION_STATUS_LABELS[item.validationStatus]}
    </span>
  );
};

export const FreshnessBadge: React.FC<{ status: FreshnessStatus }> = ({ status }) => {
  const styles: Record<FreshnessStatus, string> = {
    fresh: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    review_due: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    stale: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    unverified: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles[status]}`}>
      {FRESHNESS_LABELS[status]}
    </span>
  );
};

export const CertStatusBadge: React.FC<{ status: OfficialCertStatus }> = ({ status }) => {
  const styles: Record<OfficialCertStatus, string> = {
    active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    announced_retirement: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    retired: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    suspended: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
    historical: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${styles[status]}`}>
      {CERT_STATUS_LABELS[status]}
    </span>
  );
};
