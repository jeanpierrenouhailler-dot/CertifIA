import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  formatLocalizedDate, 
  formatLocalizedNumber, 
  formatLocalizedPercent, 
  formatLocalizedCurrency 
} from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NAMESPACES = [
  'common',
  'navigation',
  'dashboard',
  'certifications',
  'learning',
  'quizzes',
  'flashcards',
  'examinations',
  'progress',
  'assistant',
  'settings',
  'errors',
  'notifications'
];

function getAllKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(getAllKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function verifyParity() {
  console.log('--- Starting CertifIA i18n Parity & Integrity Verification ---');
  let hasErrors = false;
  let totalFrKeys = 0;
  let totalEnKeys = 0;

  const frDir = path.join(__dirname, 'locales', 'fr');
  const enDir = path.join(__dirname, 'locales', 'en');

  for (const ns of NAMESPACES) {
    const frFile = path.join(frDir, `${ns}.json`);
    const enFile = path.join(enDir, `${ns}.json`);

    if (!fs.existsSync(frFile)) {
      console.error(`❌ Missing FR namespace: ${ns}.json`);
      hasErrors = true;
      continue;
    }
    if (!fs.existsSync(enFile)) {
      console.error(`❌ Missing EN namespace: ${ns}.json`);
      hasErrors = true;
      continue;
    }

    const frContent = JSON.parse(fs.readFileSync(frFile, 'utf-8'));
    const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'));

    const frKeys = new Set(getAllKeys(frContent));
    const enKeys = new Set(getAllKeys(enContent));

    totalFrKeys += frKeys.size;
    totalEnKeys += enKeys.size;

    // Check FR -> EN
    const missingInEn: string[] = [];
    for (const key of frKeys) {
      if (!enKeys.has(key)) {
        missingInEn.push(key);
      }
    }

    // Check EN -> FR
    const missingInFr: string[] = [];
    for (const key of enKeys) {
      if (!frKeys.has(key)) {
        missingInFr.push(key);
      }
    }

    if (missingInEn.length > 0) {
      console.error(`⚠️ [${ns}] Missing in EN (${missingInEn.length} keys):`, missingInEn.slice(0, 5));
      hasErrors = true;
    }

    if (missingInFr.length > 0) {
      console.error(`⚠️ [${ns}] Missing in FR (${missingInFr.length} keys):`, missingInFr.slice(0, 5));
      hasErrors = true;
    }

    if (missingInEn.length === 0 && missingInFr.length === 0) {
      console.log(`✅ [${ns}] Perfect 1:1 match (${frKeys.size} keys)`);
    }
  }

  console.log(`\nTotal verified: ${totalFrKeys} French keys, ${totalEnKeys} English keys across ${NAMESPACES.length} namespaces.`);

  // Verify Intl Formatters
  console.log('\n--- Verifying Intl Localization Formatters ---');
  const testDate = new Date('2026-03-15T14:30:00Z');
  
  const frDate = formatLocalizedDate(testDate, { dateStyle: 'long' }, 'fr');
  const enDate = formatLocalizedDate(testDate, { dateStyle: 'long' }, 'en');
  console.log(`Date FR: "${frDate}" | Date EN: "${enDate}"`);
  if (!frDate || !enDate) throw new Error('Date formatter failed');

  const frNum = formatLocalizedNumber(1250000, undefined, 'fr');
  const enNum = formatLocalizedNumber(1250000, undefined, 'en');
  console.log(`Number FR: "${frNum}" | Number EN: "${enNum}"`);

  const frPct = formatLocalizedPercent(85.4, 'fr');
  const enPct = formatLocalizedPercent(85.4, 'en');
  console.log(`Percent FR: "${frPct}" | Percent EN: "${enPct}"`);

  const frCurr = formatLocalizedCurrency(165, 'USD', 'fr');
  const enCurr = formatLocalizedCurrency(165, 'USD', 'en');
  console.log(`Currency FR: "${frCurr}" | Currency EN: "${enCurr}"`);

  if (hasErrors) {
    console.error('\n❌ Parity verification failed with discrepancies.');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL I18N PARITY & FORMATTER CHECKS PASSED SUCCESSFULLY!');
  }
}

verifyParity();
