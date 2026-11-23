import type {
  AuditFinding,
  CertificationReference,
  ContentItem,
  SourceReference,
} from '../../types/audit';
import { detectProblematicAbsolutes } from './hashAndDiffService';

export interface DeterministicAuditContext {
  items: ContentItem[];
  sources: SourceReference[];
  certifications: CertificationReference[];
  runId: string;
  nowIso?: string;
}

function makeFindingId(runId: string, contentId: string, ruleKey: string): string {
  const safeContent = contentId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `f-${runId}-${safeContent}-${ruleKey}`.slice(0, 124);
}

/**
 * Runs deterministic, verifiable structural, linguistic, source-presence,
 * MCQ distractor quality, and lifecycle audits across any list of ContentItems.
 */
export function runDeterministicAuditChecks(ctx: DeterministicAuditContext): AuditFinding[] {
  const now = ctx.nowIso || new Date().toISOString();
  const findings: AuditFinding[] = [];
  const sourceById = new Map(ctx.sources.map((s) => [s.id, s]));
  const certById = new Map(ctx.certifications.map((c) => [c.id, c]));

  // Detect duplicate titles across same content type
  const seenTitleByType = new Map<string, string>();

  for (const item of ctx.items) {
    if (item.archived) continue;

    // 1. Duplicate title check within same content type
    const normTitle = `${item.contentType}::${item.title.trim().toLowerCase()}`;
    const existingId = seenTitleByType.get(normTitle);
    if (existingId && existingId !== item.id) {
      findings.push({
        id: makeFindingId(ctx.runId, item.id, 'dup_title'),
        runId: ctx.runId,
        contentId: item.id,
        contentType: item.contentType,
        contentVersion: item.activeVersion,
        category: 'duplication_redondance',
        severity: 'medium',
        status: 'new',
        title: 'Intitulé potentiellement dupliqué dans l’inventaire',
        rationale: `Cet élément partage un intitulé normalisé identique avec ${existingId}. Vérifiez l’absence de doublon fonctionnel.`,
        problematicExcerpt: item.title,
        recommendedAction: 'Différencier clairement le scénario ou fusionner l’élément redondant.',
        sourceBasis: 'Vérification déterministe de l’inventaire CertifIA',
        needsHumanConfirmation: true,
        origin: 'deterministic',
        createdAt: now,
      });
    } else {
      seenTitleByType.set(normTitle, item.id);
    }

    // 2. Certification retirement / status alignment check
    const certRef = certById.get(item.certificationId);
    if (
      certRef &&
      (certRef.officialStatus === 'retired' || certRef.officialStatus === 'suspended')
    ) {
      findings.push({
        id: makeFindingId(ctx.runId, item.id, 'cert_retired'),
        runId: ctx.runId,
        contentId: item.id,
        contentType: item.contentType,
        contentVersion: item.activeVersion,
        category: 'obsolescence_certification',
        severity: item.contentType === 'certification' ? 'critical' : 'high',
        status: 'new',
        title: `Contenu rattaché à une certification ${certRef.officialStatus === 'retired' ? 'retirée' : 'suspendue'} (${certRef.code})`,
        rationale: `La certification de référence ${certRef.code} porte le statut officiel « ${certRef.officialStatus} »${certRef.retirementDate ? ` (retrait : ${certRef.retirementDate})` : ''}.`,
        problematicExcerpt: `${certRef.code} — ${item.title}`,
        recommendedAction: 'Marquer l’élément comme historique/obsolète ou afficher un bandeau explicite de remplacement.',
        sourceBasis: certRef.officialUrl || 'Référentiel certifications CertifIA',
        needsHumanConfirmation: true,
        origin: 'deterministic',
        createdAt: now,
      });
    }

    // 3. Official source presence & link health check
    const attachedSources = item.attachedSourceIds
      .map((sid) => sourceById.get(sid))
      .filter((s): s is SourceReference => Boolean(s));

    const brokenSource = attachedSources.find((s) => s.availabilityStatus === 'broken');
    if (brokenSource) {
      findings.push({
        id: makeFindingId(ctx.runId, item.id, 'broken_src'),
        runId: ctx.runId,
        contentId: item.id,
        contentType: item.contentType,
        contentVersion: item.activeVersion,
        category: 'source_absente_ou_non_officielle',
        severity: 'high',
        status: 'new',
        title: 'Source officielle rattachée inaccessible (lien cassé)',
        rationale: `La source ${brokenSource.title} (${brokenSource.url}) a renvoyé un statut HTTP ${brokenSource.httpStatus ?? 'erreur'}.`,
        problematicExcerpt: brokenSource.url,
        recommendedAction: 'Mettre à jour l’URL canonique officielle et revérifier sa disponibilité.',
        sourceBasis: brokenSource.id,
        needsHumanConfirmation: true,
        origin: 'deterministic',
        createdAt: now,
      });
    } else if (
      (item.contentType === 'quiz_question' ||
        item.contentType === 'exam_question' ||
        item.contentType === 'certification') &&
      !item.officialDocUrl &&
      attachedSources.length === 0
    ) {
      findings.push({
        id: makeFindingId(ctx.runId, item.id, 'missing_src'),
        runId: ctx.runId,
        contentId: item.id,
        contentType: item.contentType,
        contentVersion: item.activeVersion,
        category: 'source_absente_ou_non_officielle',
        severity: item.contentType === 'exam_question' ? 'high' : 'medium',
        status: 'new',
        title: 'Aucune documentation officielle rattachée directement',
        rationale:
          'Cet élément évaluable ne dispose ni d’URL officielle directe ni de preuve documentaire rattachée dans le registre des sources.',
        problematicExcerpt: item.title,
        recommendedAction: 'Rattacher au moins une documentation constructeur de priorité 1 ou 2 avec extrait vérifié.',
        sourceBasis: 'Vérification déterministe de traçabilité documentaire',
        needsHumanConfirmation: true,
        origin: 'deterministic',
        createdAt: now,
      });
    }

    // 4. Problematic absolute phrasing scan ("toujours", "jamais", "obligatoirement", ...)
    const fullTextFr = JSON.stringify(item.payloadFr);
    const absolutes = detectProblematicAbsolutes(fullTextFr);
    if (absolutes.length > 0 && item.contentType !== 'certification' && item.contentType !== 'domain') {
      findings.push({
        id: makeFindingId(ctx.runId, item.id, 'absolutes'),
        runId: ctx.runId,
        contentId: item.id,
        contentType: item.contentType,
        contentVersion: item.activeVersion,
        category: 'incoherence_pedagogique',
        severity: item.contentType === 'quiz_question' || item.contentType === 'exam_question' ? 'medium' : 'low',
        status: 'new',
        title: `Formulation absolue à confirmer (« ${absolutes[0].term} »)`,
        rationale: `${absolutes.length} formulation(s) péremptoire(s) détectée(s). En Cloud/IA, les services évoluent et certaines affirmations absolues deviennent fausses selon les régions, quotas ou nouvelles versions.`,
        problematicExcerpt: absolutes[0].contextSnippet,
        recommendedAction: 'Nuancer l’affirmation ou documenter précisément les conditions d’application avec une source éditeur.',
        sourceBasis: 'Analyse linguistique déterministe',
        needsHumanConfirmation: true,
        origin: 'deterministic',
        createdAt: now,
      });
    }

    // 5. FR/EN translation parity check for core translated entities
    if (
      (item.contentType === 'quiz_question' ||
        item.contentType === 'exam_question' ||
        item.contentType === 'certification' ||
        item.contentType === 'domain') &&
      item.localeCoverage !== 'fr_en'
    ) {
      findings.push({
        id: makeFindingId(ctx.runId, item.id, 'missing_en'),
        runId: ctx.runId,
        contentId: item.id,
        contentType: item.contentType,
        contentVersion: item.activeVersion,
        category: 'probleme_traduction_fr_en',
        severity: 'high',
        status: 'new',
        title: 'Contrepartie anglaise (EN) absente pour cet élément bilingue',
        rationale: 'Les vues d’entraînement et le catalogue doivent garantir une parité sémantique complète FR/EN.',
        problematicExcerpt: item.title,
        recommendedAction: 'Renseigner la version anglaise homologuée sans altérer les concepts d’examen.',
        sourceBasis: 'Vérification de parité FR/EN',
        needsHumanConfirmation: true,
        origin: 'deterministic',
        createdAt: now,
      });
    }

    // 6. Specialized MCQ & Exam question structural integrity checks
    if (item.contentType === 'quiz_question' || item.contentType === 'exam_question') {
      const options = Array.isArray(item.payloadFr.options)
        ? (item.payloadFr.options as Array<{ key?: string; text?: string }>)
        : [];
      const correctKey = String(item.payloadFr.correctKey || '');
      const validKeys = new Set(options.map((o) => o.key));

      if (options.length < 4 || !validKeys.has(correctKey)) {
        findings.push({
          id: makeFindingId(ctx.runId, item.id, 'mcq_struct'),
          runId: ctx.runId,
          contentId: item.id,
          contentType: item.contentType,
          contentVersion: item.activeVersion,
          category: 'erreur_metadonnee',
          severity: 'critical',
          status: 'new',
          title: 'Structure QCM invalide (options insuffisantes ou clé correcte introuvable)',
          rationale: `Le QCM comporte ${options.length} option(s) et déclare correctKey="${correctKey}".`,
          problematicExcerpt: item.title,
          recommendedAction: 'Corriger les options A/B/C/D et vérifier l’unicité de correctKey avant toute publication.',
          sourceBasis: 'Validation structurelle QCM',
          needsHumanConfirmation: true,
          origin: 'deterministic',
          createdAt: now,
        });
      } else {
        // Check if explanation/traps exist on quiz_question and check option length giveaway heuristic
        const correctOpt = options.find((o) => o.key === correctKey);
        const distractors = options.filter((o) => o.key !== correctKey);
        const avgDistractorLen =
          distractors.reduce((acc, o) => acc + (o.text?.length || 0), 0) /
          Math.max(1, distractors.length);

        if (correctOpt?.text && correctOpt.text.length > avgDistractorLen * 1.9 && correctOpt.text.length > 140) {
          findings.push({
            id: makeFindingId(ctx.runId, item.id, 'mcq_len_bias'),
            runId: ctx.runId,
            contentId: item.id,
            contentType: item.contentType,
            contentVersion: item.activeVersion,
            category: 'ambiguite_question_distracteurs',
            severity: 'low',
            status: 'new',
            title: 'Biais potentiel de longueur sur la bonne réponse QCM',
            rationale: `La bonne réponse (${correctOpt.text.length} car.) est nettement plus longue que la moyenne des distracteurs (${Math.round(avgDistractorLen)} car.), ce qui peut rendre le choix devinable.`,
            problematicExcerpt: correctOpt.text,
            recommendedAction: 'Équilibrer le niveau de détail technique entre la bonne réponse et les distracteurs plausibles.',
            sourceBasis: 'Heuristique qualité QCM',
            needsHumanConfirmation: true,
            origin: 'deterministic',
            createdAt: now,
          });
        }

        if (item.contentType === 'exam_question' && !item.payloadFr.explanation) {
          findings.push({
            id: makeFindingId(ctx.runId, item.id, 'exam_no_expl'),
            runId: ctx.runId,
            contentId: item.id,
            contentType: item.contentType,
            contentVersion: item.activeVersion,
            category: 'justification_insuffisante',
            severity: 'high',
            status: 'new',
            title: 'Question d’examen blanc sans explication ni source structurée',
            rationale: 'Le format ExamQuestionDetail actuel ne comporte pas encore de justification détaillée ni de lien vers la documentation officielle.',
            problematicExcerpt: item.title,
            recommendedAction: 'Enrichir la fiche d’audit avec une justification officielle et rattacher une source éditeur.',
            sourceBasis: 'Vérification pédagogique QCM',
            needsHumanConfirmation: true,
            origin: 'deterministic',
            createdAt: now,
          });
        }
      }
    }

    // 7. Glossary FR/EN parity check (detect when English descriptions were left untranslated)
    if (item.contentType === 'glossary' && item.payloadEn) {
      const frShort = String(item.payloadFr.shortDefinition || '');
      const enShort = String(item.payloadEn.shortDefinition || '');
      if (frShort && enShort && frShort === enShort) {
        findings.push({
          id: makeFindingId(ctx.runId, item.id, 'glossary_en_untranslated'),
          runId: ctx.runId,
          contentId: item.id,
          contentType: item.contentType,
          contentVersion: item.activeVersion,
          category: 'probleme_traduction_fr_en',
          severity: 'medium',
          status: 'new',
          title: 'Définition anglaise du glossaire non traduite (identique au français)',
          rationale: 'Seul le titre anglais est substitué dans getLocalizedGlossaryEntries ; la définition complète reste en français en mode EN.',
          problematicExcerpt: enShort.slice(0, 160),
          recommendedAction: 'Fournir une définition anglaise dédiée pour garantir l’homogénéité linguistique en mode EN.',
          sourceBasis: 'Vérification bilingue glossaire',
          needsHumanConfirmation: true,
          origin: 'deterministic',
          createdAt: now,
        });
      }
    }
  }

  return findings;
}
