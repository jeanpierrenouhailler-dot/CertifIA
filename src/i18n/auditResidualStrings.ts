import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '..');

// Regex to detect common French words and accented characters that typically indicate untranslated UI text
const FRENCH_REGEX = /(?:[A-Za-z0-9_]|\b)(?:Aujourd['’]hui|Reprendre|mon apprentissage|Paramètres|Mentions légales|Déconnexion|Connexion|Fermer|Retour|Suivant|Précédent|Valider|Rechercher|Étape|Niveau|Parcours|Répartition|Fiches|Fiche|Examen blanc|Examens blancs|Toutes|Tous|Termes|Favoris|Maîtrisé|Difficile|À revoir|Bien|Correct|Annuler|Sauvegarder|Chargement|Aucun|Aucune|résultat|Revue|Question|Piège|Explication|Justification|Pondération|Durée|Score|Seuil|Passerelle|Tuteur|Télécharger|Installer|Mode sombr|Mode clair|Guide novice|Historique)(?:\b|[A-Za-z0-9_])/i;

// Legit exceptions: vendor names, official technical terms, file paths, ids
const ALLOWED_EXCEPTIONS = [
  'certifia',
  'watsonx',
  'vertex',
  'sagemaker',
  'bedrock',
  'azure',
  'aws',
  'gcp',
  'ibm',
  'nvidia',
  'openshift',
  'lora',
  'rag',
  'fsrs',
  'sm-2',
  'hnsw',
  'bm25',
  'tf-idf'
];

interface Finding {
  file: string;
  line: number;
  text: string;
  context: string;
}

function scanFile(filePath: string): Finding[] {
  // Ignore locale json files, test files, and flashcards raw datasets that have already localized wrappers
  const relPath = path.relative(SRC_DIR, filePath);
  if (relPath.startsWith('i18n/locales') || relPath.includes('verifyI18n') || relPath.includes('auditResidual')) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings: Finding[] = [];

  lines.forEach((line, index) => {
    // Ignore pure comments or import statements
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import ')) {
      return;
    }

    // Match French indicators
    if (FRENCH_REGEX.test(line)) {
      // Check if it's already using t('...')
      if (line.includes("t('") || line.includes('t("') || line.includes('i18n.t')) {
        // Only trigger if there is also raw French text outside t(...)
        // But often t('...', 'French fallback') is fine as fallback
        return;
      }

      findings.push({
        file: relPath,
        line: index + 1,
        text: trimmed.slice(0, 100),
        context: trimmed
      });
    }
  });

  return findings;
}

function walkDir(dir: string): string[] {
  let files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist') {
        files = files.concat(walkDir(fullPath));
      }
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }
  return files;
}

console.log('--- Scanning codebase for residual untranslated UI text ---');
const allFiles = walkDir(SRC_DIR);
let totalFindings = 0;
const findingsByFile: Record<string, Finding[]> = {};

for (const file of allFiles) {
  const f = scanFile(file);
  if (f.length > 0) {
    const rel = path.relative(SRC_DIR, file);
    findingsByFile[rel] = f;
    totalFindings += f.length;
  }
}

for (const [file, list] of Object.entries(findingsByFile)) {
  console.log(`\n📁 ${file} (${list.length} matches):`);
  list.slice(0, 8).forEach(item => {
    console.log(`  Line ${item.line}: ${item.text}`);
  });
  if (list.length > 8) {
    console.log(`  ... and ${list.length - 8} more`);
  }
}

console.log(`\nTotal scanned: ${allFiles.length} files. Found ${totalFindings} potential untranslated strings across ${Object.keys(findingsByFile).length} files.`);
