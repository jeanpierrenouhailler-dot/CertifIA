export interface FieldDiffEntry {
  field: string;
  before: string;
  after: string;
}

/**
 * Produces deterministic canonical JSON representation sorting object keys recursively
 * so identical semantic content always produces an identical fingerprint.
 */
export function canonicalizeValue(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return JSON.stringify(value);
  if (typeof value === 'string') return JSON.stringify(value.trim());
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalizeValue(item)).join(',')}]`;
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    const pairs = keys
      .filter((k) => record[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${canonicalizeValue(record[k])}`);
    return `{${pairs.join(',')}}`;
  }
  return JSON.stringify(String(value));
}

/**
 * Deterministic 64-bit FNV-1a composite hash usable synchronously in both Node.js and browsers.
 * Formats as stable `fnv64-<hex1>-<hex2>` fingerprint for change & tampering detection.
 */
export function computeDeterministicHash(input: unknown): string {
  const str = typeof input === 'string' ? input : canonicalizeValue(input);
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < str.length; i += 1) {
    const code = str.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= code + (i & 0xff);
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `h64-${part1}${part2}-${str.length}`;
}

/**
 * Computes field-level readable differences between two structured content snapshots.
 */
export function computeStructuredDiff(
  beforeObj: Record<string, unknown> | null | undefined,
  afterObj: Record<string, unknown> | null | undefined
): FieldDiffEntry[] {
  const before = beforeObj || {};
  const after = afterObj || {};
  const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)])).sort();
  const diffs: FieldDiffEntry[] = [];

  for (const key of keys) {
    const bVal = before[key];
    const aVal = after[key];
    const bCanonical = canonicalizeValue(bVal);
    const aCanonical = canonicalizeValue(aVal);
    if (bCanonical !== aCanonical) {
      diffs.push({
        field: key,
        before: typeof bVal === 'string' ? bVal : JSON.stringify(bVal ?? null),
        after: typeof aVal === 'string' ? aVal : JSON.stringify(aVal ?? null),
      });
    }
  }
  return diffs;
}

const ABSOLUTE_PATTERNS_FR = [
  /\btoujours\b/gi,
  /\bjamais\b/gi,
  /\bobligatoirement\b/gi,
  /\buniquement\b/gi,
  /\bnécessairement\b/gi,
  /\bdans tous les cas\b/gi,
  /\bsans aucune exception\b/gi,
];

const ABSOLUTE_PATTERNS_EN = [
  /\balways\b/gi,
  /\bnever\b/gi,
  /\bmandatorily\b/gi,
  /\bonly ever\b/gi,
  /\bin all cases\b/gi,
  /\bwithout exception\b/gi,
];

export interface AbsoluteMatch {
  term: string;
  contextSnippet: string;
}

/**
 * Detects potentially brittle absolute formulations ("toujours", "jamais", "obligatoirement", etc.)
 * which frequently trigger technical inaccuracy or outdated exam claims when services evolve.
 */
export function detectProblematicAbsolutes(text: string): AbsoluteMatch[] {
  if (!text) return [];
  const matches: AbsoluteMatch[] = [];
  const patterns = [...ABSOLUTE_PATTERNS_FR, ...ABSOLUTE_PATTERNS_EN];

  for (const regex of patterns) {
    regex.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      const start = Math.max(0, m.index - 40);
      const end = Math.min(text.length, m.index + m[0].length + 45);
      matches.push({
        term: m[0],
        contextSnippet: `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\s+/g, ' ')}${
          end < text.length ? '…' : ''
        }`,
      });
      if (matches.length >= 8) return matches;
    }
  }
  return matches;
}
