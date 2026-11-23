import test from 'node:test';
import assert from 'node:assert/strict';

import {
  canonicalizeValue,
  computeDeterministicHash,
  computeStructuredDiff,
  detectProblematicAbsolutes,
} from '../src/services/audit/hashAndDiffService';
import {
  buildDefaultCertificationReferences,
  buildFullContentInventory,
} from '../src/services/audit/contentInventoryService';
import { buildDefaultSourceRegistry } from '../src/services/audit/sourceRegistryService';
import { runDeterministicAuditChecks } from '../src/services/audit/deterministicChecksService';
import {
  mergeFindingsPreservingHistory,
  transitionFindingStatus,
} from '../src/services/audit/findingManagementService';
import {
  buildHumanReviewRecord,
  evaluateHumanApprovalEligibility,
} from '../src/services/audit/humanValidationService';
import {
  buildPublishedOverride,
  createContentRevision,
  parseRevisionSnapshot,
} from '../src/services/audit/contentVersioningService';
import {
  buildSortedPriorityAlerts,
  computeAuditQualityMetrics,
  computeInventoryCounters,
  exportAuditReportToCsv,
  exportAuditTraceabilityJson,
} from '../src/services/audit/auditReportService';
import type { AuditSettings } from '../src/types/audit';

const TEST_SETTINGS: AuditSettings = {
  id: 'global',
  activeAiModel: 'gemini-4-hydrogen',
  promptVersion: 'audit-v1.0.0',
  freshnessMaxDays: 90,
  dailyAiCallCap: 120,
  maxBatchSize: 25,
  requireOfficialSourceForApproval: true,
  updatedAt: '2026-11-22T00:00:00.000Z',
  updatedBy: 'test-suite',
};

test('Content inventory indexes all real CertifIA entities with unique stable IDs', () => {
  const sources = buildDefaultSourceRegistry();
  const items = buildFullContentInventory({ sources });

  const ids = new Set(items.map((i) => i.id));
  assert.equal(ids.size, items.length, 'Every ContentItem must have a unique prefixed ID');

  const counters = computeInventoryCounters({
    items,
    findings: [],
    sources,
    certifications: buildDefaultCertificationReferences(),
  });

  assert.equal(counters.byType.certification, 6);
  assert.equal(counters.byType.domain, 28);
  assert.equal(counters.byType.quiz_question, 4);
  assert.equal(counters.byType.exam_question, 4);
  assert.equal(counters.byType.flashcard, 2800);
  assert.equal(counters.byType.glossary, 20);
  assert.equal(counters.totalItems, 2862);
});

test('Canonical hash, structured diff, and problematic absolutes detection work deterministically', () => {
  const hashA = computeDeterministicHash({ b: 2, a: 1, nested: { y: 'y', x: 'x' } });
  const hashB = computeDeterministicHash({ nested: { x: 'x', y: 'y' }, a: 1, b: 2 });
  assert.equal(hashA, hashB);
  assert.equal(canonicalizeValue({ b: 2, a: 1 }), '{"a":1,"b":2}');

  const diffs = computeStructuredDiff(
    { title: 'Azure OpenAI', passScore: 700 },
    { title: 'Azure OpenAI Foundry', passScore: 700 }
  );
  assert.equal(diffs.length, 1);
  assert.equal(diffs[0].field, 'title');

  const abs = detectProblematicAbsolutes(
    'Il est toujours obligatoire d’utiliser un index vectoriel, sans jamais activer BM25.'
  );
  assert.ok(abs.some((m) => m.term === 'toujours'));
  assert.ok(abs.some((m) => m.term === 'jamais'));
});

test('Deterministic audit checks detect retired certs, invalid MCQs, and untranslated glossary EN entries', () => {
  const sources = buildDefaultSourceRegistry();
  const certs = buildDefaultCertificationReferences();
  certs[0] = {
    ...certs[0],
    officialStatus: 'retired',
    retirementDate: '2026-06-30',
  };

  const items = buildFullContentInventory({ sources }).filter(
    (i) => i.contentType !== 'flashcard'
  );
  // Inject a broken MCQ item
  const brokenMcq = {
    ...items.find((i) => i.contentType === 'quiz_question')!,
    id: 'mcq:broken_test',
    payloadFr: {
      options: [{ key: 'A', text: 'Only one' }],
      correctKey: 'Z',
    },
  };

  const findings = runDeterministicAuditChecks({
    items: [...items, brokenMcq],
    sources,
    certifications: certs,
    runId: 'run-test-1',
    nowIso: '2026-11-22T00:00:00.000Z',
  });

  assert.ok(
    findings.some(
      (f) => f.contentId === `cert:${certs[0].id}` && f.severity === 'critical' && f.category === 'obsolescence_certification'
    ),
    'Retired certification must raise critical obsolescence finding'
  );
  assert.ok(
    findings.some(
      (f) => f.contentId === 'mcq:broken_test' && f.severity === 'critical' && f.category === 'erreur_metadonnee'
    ),
    'Invalid MCQ structure must raise critical metadata error'
  );
  assert.ok(
    findings.some(
      (f) => f.contentType === 'glossary' && f.category === 'probleme_traduction_fr_en'
    ),
    'Glossary entries with identical FR/EN shortDefinition must be flagged'
  );

  // Merge history retention
  const resolvedOld = transitionFindingStatus(findings[0], 'resolved', 'admin@example.com', 'Corrigé');
  const { merged, added } = mergeFindingsPreservingHistory([resolvedOld], findings);
  assert.ok(merged.some((f) => f.id === resolvedOld.id && f.status === 'resolved'));
  assert.equal(added.length, findings.length, 'Closed historical findings must remain untouched and re-openable as new occurrences');
});

test('Content revision, rollback, and human validation blocking rules enforce governance integrity', () => {
  const sources = buildDefaultSourceRegistry();
  const certs = buildDefaultCertificationReferences();
  const items = buildFullContentInventory({ sources });
  const quizItem = items.find((i) => i.contentType === 'quiz_question')!;

  // Pending AI suggestion blocks approval until applied or dismissed
  const blockedByAi = evaluateHumanApprovalEligibility({
    item: quizItem,
    findings: [],
    sources,
    evidence: [],
    certifications: certs,
    settings: TEST_SETTINGS,
    hasPendingAiSuggestion: true,
  });
  assert.equal(blockedByAi.canApprove, false);
  assert.ok(blockedByAi.blockingReasons.some((r) => r.includes('arbitrage')));

  // Clear AI blocker -> verify eligibility when source exists
  const cleanQuizItem = {
    ...quizItem,
    attachedSourceIds: [sources[0].id],
  };
  const eligible = evaluateHumanApprovalEligibility({
    item: cleanQuizItem,
    findings: [],
    sources,
    evidence: [],
    certifications: certs,
    settings: TEST_SETTINGS,
    hasPendingAiSuggestion: false,
  });
  assert.equal(eligible.canApprove, true);

  // Simulate previous validation, then edit -> must invalidate prior validation
  const validatedQuiz = {
    ...cleanQuizItem,
    humanValidatedVersion: 1,
    validationStatus: 'validated' as const,
  };
  const revResult = createContentRevision({
    item: validatedQuiz,
    updatedPayloadFr: {
      ...validatedQuiz.payloadFr,
      question: 'Version révisée avec précision réglementaire 2026.',
    },
    authorUid: 'admin-uid-1',
    authorEmail: 'jeanpierre.nouhailler@gmail.com',
    changeNote: 'Mise à jour 2026',
  });
  assert.equal(revResult.revision.versionNumber, 2);
  assert.equal(revResult.revision.invalidatesPriorValidation, true);
  assert.equal(revResult.nextState.validationStatus, 'invalidated_by_edit');
  assert.equal(revResult.nextState.humanValidatedVersion, undefined);

  // Snapshot parse / rollback verification
  const parsedSnap = parseRevisionSnapshot(revResult.revision);
  assert.ok(parsedSnap);
  assert.equal(parsedSnap.payloadFr.question, 'Version révisée avec précision réglementaire 2026.');

  // Human validation record validation + published override
  assert.throws(
    () =>
      buildHumanReviewRecord({
        contentId: cleanQuizItem.id,
        contentVersion: 2,
        reviewerUid: 'admin-1',
        reviewerEmail: 'jeanpierre.nouhailler@gmail.com',
        decision: 'approved_with_reserves',
        justification: 'OK partiel',
        conditionalReserves: '',
        attachedSourceIds: [sources[0].id],
      }),
    /réserves/i
  );

  const reviewRecord = buildHumanReviewRecord({
    contentId: cleanQuizItem.id,
    contentVersion: 2,
    reviewerUid: 'admin-1',
    reviewerEmail: 'jeanpierre.nouhailler@gmail.com',
    decision: 'approved',
    justification: 'Conforme Microsoft Learn 2026',
    attachedSourceIds: [sources[0].id],
  });
  assert.equal(reviewRecord.decision, 'approved');

  const override = buildPublishedOverride({
    item: { ...cleanQuizItem, activeVersion: 2 },
    approvedByEmail: 'jeanpierre.nouhailler@gmail.com',
  });
  assert.equal(override.approvedVersion, 2);
  assert.equal(override.isArchived, false);
});

test('Quality metrics, alerts, CSV export, and JSON traceability export produce accurate outputs', () => {
  const sources = buildDefaultSourceRegistry();
  const certs = buildDefaultCertificationReferences();
  const items = buildFullContentInventory({ sources }).slice(0, 20);
  const findings = runDeterministicAuditChecks({
    items,
    sources,
    certifications: certs,
    runId: 'run-metrics-1',
  });

  const metrics = computeAuditQualityMetrics({ items, findings, certifications: certs });
  assert.ok(metrics.technicalComplianceRate >= 0 && metrics.technicalComplianceRate <= 100);
  assert.ok(metrics.sourcedContentRate >= 0 && metrics.sourcedContentRate <= 100);
  assert.ok(metrics.translationCoherenceRate >= 0 && metrics.translationCoherenceRate <= 100);
  assert.equal(metrics.humanValidationRate, 0);

  const alerts = buildSortedPriorityAlerts({ items, findings, sources, certifications: certs });
  assert.ok(Array.isArray(alerts));

  const csv = exportAuditReportToCsv({ items, findings, reviews: [], sources });
  assert.ok(csv.startsWith('\uFEFFcontentId,contentType,certificationCode'));
  assert.equal(csv.trim().split('\n').length, items.length + 1);

  const jsonStr = exportAuditTraceabilityJson({
    items,
    findings,
    reviews: [],
    runs: [],
    sources,
    certifications: certs,
  });
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.inventorySampleCount, items.length);
  assert.equal(parsed.certifications.length, 6);
});
