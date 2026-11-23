import { certificationsData } from '../../data/certificationsData';
import { getLocalizedCertifications } from '../../data/localizedCertifications';
import { quizQuestionsData } from '../../data/quizData';
import { getLocalizedQuizQuestions } from '../../data/localizedQuizData';
import { examQuestionsBank } from '../../data/examData';
import { getLocalizedExamQuestionsBank } from '../../data/localizedExamData';
import { DECK_FLASHCARDS_MAP } from '../../data/flashcardsData';
import { GLOSSARY_ENTRIES } from '../../data/glossaryData';
import { getLocalizedGlossaryEntries } from '../../data/localizedGlossaryData';
import type {
  AuditContentState,
  AuditFinding,
  AuditProvider,
  CertificationReference,
  ContentEvidence,
  ContentItem,
  PublishedContentOverride,
  SourceReference,
} from '../../types/audit';
import { computeDeterministicHash } from './hashAndDiffService';

function inferQuizCertAndProvider(questionId: string, text: string): {
  certId: string;
  certCode: string;
  provider: AuditProvider;
} {
  const lower = text.toLowerCase();
  if (lower.includes('azure') || questionId.startsWith('q')) {
    return { certId: 'ai102', certCode: 'AI-102', provider: 'azure' };
  }
  if (lower.includes('aws') || lower.includes('bedrock')) {
    return { certId: 'aifc01', certCode: 'AIF-C01', provider: 'aws' };
  }
  return { certId: 'ai102', certCode: 'AI-102', provider: 'azure' };
}

function inferExamCertAndProvider(questionNum: number, domain: string): {
  certId: string;
  certCode: string;
  provider: AuditProvider;
} {
  const lower = domain.toLowerCase();
  if (lower.includes('aws') || [7, 27, 28, 29].includes(questionNum)) {
    return { certId: 'aifc01', certCode: 'AIF-C01', provider: 'aws' };
  }
  return { certId: 'aifc01', certCode: 'AIF-C01', provider: 'aws' };
}

export function buildDefaultCertificationReferences(): CertificationReference[] {
  const now = new Date().toISOString();
  return certificationsData.map((cert) => ({
    id: cert.id,
    code: cert.code,
    title: cert.title,
    provider: cert.provider,
    officialStatus: 'active',
    durationMinutes: cert.durationMinutes,
    itemsCount: cert.itemsCount,
    passScore: cert.passScore,
    maxScore: cert.maxScore,
    languagesSummary: 'FR / EN',
    officialUrl: cert.docUrl,
    domainWeightsSummary: cert.domains.map((d) => `${d.name} (${d.weight})`).join(' | '),
    updatedAt: now,
    updatedBy: 'system-baseline',
  }));
}

export interface InventoryBuildContext {
  contentStates?: Record<string, AuditContentState>;
  publishedOverrides?: Record<string, PublishedContentOverride>;
  findings?: AuditFinding[];
  sources?: SourceReference[];
  evidence?: ContentEvidence[];
  freshnessMaxDays?: number;
}

function computeFreshnessStatus(
  lastCheckedIso: string | undefined,
  freshnessMaxDays = 90
): ContentItem['freshnessStatus'] {
  if (!lastCheckedIso) return 'unverified';
  const ts = Date.parse(lastCheckedIso);
  if (Number.isNaN(ts)) return 'unverified';
  const ageDays = (Date.now() - ts) / (1000 * 60 * 60 * 24);
  if (ageDays > freshnessMaxDays) return 'stale';
  if (ageDays > freshnessMaxDays * 0.75) return 'review_due';
  return 'fresh';
}

function applyOverride<T extends Record<string, unknown>>(
  base: T,
  override?: PublishedContentOverride
): T {
  if (!override || !override.patchJson) return base;
  try {
    const parsed = JSON.parse(override.patchJson) as Record<string, unknown>;
    return { ...base, ...parsed };
  } catch {
    return base;
  }
}

/**
 * Builds the unified, stable-ID pedagogical content inventory across all real app datasets:
 * - Certifications (6)
 * - Certification Domains (28)
 * - Scenario Quiz Questions (4 FR/EN)
 * - Exam Bank Questions (4 FR/EN)
 * - Flashcards across all 28 domain files (2,800)
 * - Glossary Entries (20)
 */
export function buildFullContentInventory(ctx: InventoryBuildContext = {}): ContentItem[] {
  const states = ctx.contentStates || {};
  const overrides = ctx.publishedOverrides || {};
  const findings = ctx.findings || [];
  const sources = ctx.sources || [];
  const evidence = ctx.evidence || [];
  const freshnessMaxDays = ctx.freshnessMaxDays ?? 90;

  const openStatuses = new Set(['new', 'analyzing', 'to_fix', 'pending_validation']);
  const findingsByContent = new Map<string, { open: number; critical: number }>();
  for (const f of findings) {
    if (!openStatuses.has(f.status)) continue;
    const entry = findingsByContent.get(f.contentId) || { open: 0, critical: 0 };
    entry.open += 1;
    if (f.severity === 'critical') entry.critical += 1;
    findingsByContent.set(f.contentId, entry);
  }

  const sourcesByUrl = new Map<string, SourceReference>();
  for (const s of sources) {
    sourcesByUrl.set(s.url, s);
  }

  const evidenceSourcesByContent = new Map<string, Set<string>>();
  for (const ev of evidence) {
    const set = evidenceSourcesByContent.get(ev.contentId) || new Set<string>();
    set.add(ev.sourceId);
    evidenceSourcesByContent.set(ev.contentId, set);
  }

  const items: ContentItem[] = [];
  const certsEn = getLocalizedCertifications('en');
  const quizzesEn = getLocalizedQuizQuestions('en');
  const examEn = getLocalizedExamQuestionsBank('en');
  const glossaryEn = getLocalizedGlossaryEntries('en');

  const enrichItem = (
    raw: Omit<
      ContentItem,
      | 'contentHash'
      | 'activeVersion'
      | 'editorialStatus'
      | 'validationStatus'
      | 'freshnessStatus'
      | 'openFindingsCount'
      | 'criticalFindingsCount'
      | 'attachedSourceIds'
      | 'archived'
      | 'updatedAt'
    >
  ): ContentItem => {
    const state = states[raw.id];
    const counts = findingsByContent.get(raw.id) || { open: 0, critical: 0 };
    const matchedByUrl = raw.officialDocUrl ? sourcesByUrl.get(raw.officialDocUrl) : undefined;
    const evSources = Array.from(evidenceSourcesByContent.get(raw.id) || []);
    if (matchedByUrl && !evSources.includes(matchedByUrl.id)) {
      evSources.unshift(matchedByUrl.id);
    }

    const contentHash = computeDeterministicHash({
      fr: raw.payloadFr,
      en: raw.payloadEn || null,
      docUrl: raw.officialDocUrl || null,
    });

    const hashChanged = state?.contentHash && state.contentHash !== contentHash;

    return {
      ...raw,
      contentHash,
      activeVersion: state?.activeVersion ?? 1,
      editorialStatus: hashChanged
        ? 'to_verify'
        : state?.editorialStatus ?? 'to_verify',
      validationStatus: hashChanged
        ? 'invalidated_by_edit'
        : state?.validationStatus ?? 'pending_human',
      freshnessStatus:
        state?.freshnessStatus ||
        computeFreshnessStatus(state?.lastAuditedAt || matchedByUrl?.lastCheckedAt, freshnessMaxDays),
      lastAuditedAt: state?.lastAuditedAt,
      lastAuditModel: state?.lastAuditModel,
      lastAuditConfidence: state?.lastAuditConfidence,
      humanValidatedVersion: state?.humanValidatedVersion,
      lastValidatedAt: state?.lastValidatedAt,
      lastValidatedBy: state?.lastValidatedBy,
      openFindingsCount: counts.open,
      criticalFindingsCount: counts.critical,
      attachedSourceIds: evSources,
      archived: state?.archived ?? overrides[raw.id]?.isArchived ?? false,
      updatedAt: state?.updatedAt || new Date(0).toISOString(),
    };
  };

  // 1. Certifications + 2. Domains
  for (const cert of certificationsData) {
    const certEnObj = certsEn.find((c) => c.id === cert.id);
    const certItemId = `cert:${cert.id}`;
    const patchedCert = applyOverride(cert as unknown as Record<string, unknown>, overrides[certItemId]);

    items.push(
      enrichItem({
        id: certItemId,
        sourceEntityId: cert.id,
        contentType: 'certification',
        certificationId: cert.id,
        certificationCode: cert.code,
        provider: cert.provider,
        title: `${cert.code} — ${String(patchedCert.title || cert.title)}`,
        summary: `${cert.providerName} • ${cert.durationMinutes} min • ${cert.itemsCount} questions • Seuil ${cert.passScore}/${cert.maxScore}`,
        localeCoverage: certEnObj ? 'fr_en' : 'fr_only',
        officialDocUrl: String(patchedCert.docUrl || cert.docUrl),
        payloadFr: patchedCert,
        payloadEn: certEnObj ? (certEnObj as unknown as Record<string, unknown>) : null,
      })
    );

    cert.domains.forEach((domain, idx) => {
      const domainId = `domain${idx + 1}`;
      const domItemId = `domain:${cert.id}:${domainId}`;
      const domEn = certEnObj?.domains?.[idx];
      const patchedDom = applyOverride(domain as unknown as Record<string, unknown>, overrides[domItemId]);

      items.push(
        enrichItem({
          id: domItemId,
          sourceEntityId: `${cert.id}:${domainId}`,
          contentType: 'domain',
          certificationId: cert.id,
          certificationCode: cert.code,
          provider: cert.provider,
          domainId,
          domainName: String(patchedDom.name || domain.name),
          title: `${cert.code} • ${String(patchedDom.name || domain.name)}`,
          summary: `${domain.weight} — ${String(patchedDom.description || domain.description)}`,
          localeCoverage: domEn ? 'fr_en' : 'fr_only',
          officialDocUrl: cert.docUrl,
          payloadFr: patchedDom,
          payloadEn: domEn ? (domEn as unknown as Record<string, unknown>) : null,
        })
      );
    });
  }

  // 3. Scenario Quiz Questions (QCM Scénarisés)
  for (const q of quizQuestionsData) {
    const qEn = quizzesEn.find((item) => item.id === q.id);
    const mcqId = `mcq:${q.id}`;
    const meta = inferQuizCertAndProvider(q.id, `${q.scenario} ${q.question}`);
    const patchedQ = applyOverride(q as unknown as Record<string, unknown>, overrides[mcqId]);

    items.push(
      enrichItem({
        id: mcqId,
        sourceEntityId: q.id,
        contentType: 'quiz_question',
        certificationId: meta.certId,
        certificationCode: meta.certCode,
        provider: meta.provider,
        domainName: q.architectureBadge?.title || q.code,
        title: `${q.code} — ${String(patchedQ.question || q.question)}`,
        summary: String(patchedQ.scenario || q.scenario),
        localeCoverage: qEn ? 'fr_en' : 'fr_only',
        officialDocUrl: q.explanation?.officialDocUrl,
        payloadFr: patchedQ,
        payloadEn: qEn ? (qEn as unknown as Record<string, unknown>) : null,
      })
    );
  }

  // 4. Timed Exam Bank Questions
  for (const eq of Object.values(examQuestionsBank)) {
    const eqEn = examEn[eq.number];
    const itemId = `exam_q:${eq.number}`;
    const meta = inferExamCertAndProvider(eq.number, eq.domain);
    const patchedEq = applyOverride(eq as unknown as Record<string, unknown>, overrides[itemId]);

    items.push(
      enrichItem({
        id: itemId,
        sourceEntityId: String(eq.number),
        contentType: 'exam_question',
        certificationId: meta.certId,
        certificationCode: meta.certCode,
        provider: meta.provider,
        domainName: eq.domain,
        title: `Exam #${eq.number} — ${String(patchedEq.question || eq.question)}`,
        summary: String(patchedEq.scenario || eq.scenario),
        localeCoverage: eqEn ? 'fr_en' : 'fr_only',
        payloadFr: patchedEq,
        payloadEn: eqEn ? (eqEn as unknown as Record<string, unknown>) : null,
      })
    );
  }

  // 5. Flashcards (all 2,800 cards across 28 domains & 6 certs)
  for (const [certId, deck] of Object.entries(DECK_FLASHCARDS_MAP)) {
    const certMeta = certificationsData.find((c) => c.id === certId);
    const certCode = certMeta?.code || certId.toUpperCase();
    const provider: AuditProvider = certMeta?.provider || 'general';

    for (const card of deck) {
      const itemId = `fc:${card.id}`;
      const patchedCard = applyOverride(card as unknown as Record<string, unknown>, overrides[itemId]);
      items.push(
        enrichItem({
          id: itemId,
          sourceEntityId: card.id,
          contentType: 'flashcard',
          certificationId: certId,
          certificationCode: certCode,
          provider,
          domainId: card.domainId,
          domainName: card.domainName || card.deckName,
          title: String(patchedCard.questionTitle || card.questionTitle),
          summary: String(patchedCard.questionLead || card.questionLead),
          localeCoverage: 'fr_only',
          officialDocUrl: certMeta?.docUrl,
          payloadFr: patchedCard,
          payloadEn: null,
        })
      );
    }
  }

  // 6. Glossary / Encyclopedia Entries
  for (const entry of GLOSSARY_ENTRIES) {
    const enEntry = glossaryEn.find((g) => g.id === entry.id);
    const itemId = `glossary:${entry.id}`;
    const patchedEntry = applyOverride(entry as unknown as Record<string, unknown>, overrides[itemId]);
    const primaryCert = entry.targetCerts[0] || 'all';
    const primaryCertMeta = certificationsData.find((c) => c.id === primaryCert);
    const primaryProvider = (entry.providers.find((p) => p !== 'general') || 'general') as AuditProvider;

    items.push(
      enrichItem({
        id: itemId,
        sourceEntityId: entry.id,
        contentType: 'glossary',
        certificationId: primaryCert,
        certificationCode: primaryCertMeta?.code || 'MULTI',
        provider: primaryProvider,
        domainName: entry.category,
        title: String(patchedEntry.term || entry.term),
        summary: String(patchedEntry.shortDefinition || entry.shortDefinition),
        localeCoverage: enEntry && entry.englishTerm ? 'fr_en' : 'fr_only',
        payloadFr: patchedEntry,
        payloadEn: enEntry ? (enEntry as unknown as Record<string, unknown>) : null,
      })
    );
  }

  return items;
}
