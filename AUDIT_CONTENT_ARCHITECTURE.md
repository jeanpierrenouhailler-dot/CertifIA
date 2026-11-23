# 🛡️ Architecture & Gouvernance — Module d'Audit du contenu CertifIA

## 1. Vue d'ensemble
Le module **Audit du contenu** est un espace d'administration complet et cloisonné destiné à la gouvernance éditoriale, à la traçabilité documentaire et à la validation humaine des contenus pédagogiques CertifIA :
- **6** certifications de référence (`AI-102`, `AI-900`, `AIF-C01`, `MLS-C01`, `GCP-PMLE`, `C1000-177`)
- **28** domaines d'examen pondérés
- **8** questions évaluables (QCM scénarisés FR/EN et questions d'examen blanc)
- **2 800** flashcards réparties sur les 28 fichiers de domaines
- **20** fiches du glossaire et encyclopédie technique

Toute l'indexation est calculée dynamiquement depuis les jeux de données réels dans `src/services/audit/contentInventoryService.ts` (aucune donnée fictive ni compteur codé en dur).

---

## 2. Sécurité & Contrôle d'accès (RBAC)
1. **Barrière UI stricte (`ContentAuditWorkspace.tsx`)** :
   - Les liens vers *Audit du contenu* dans `Sidebar`, `Header`, `CategorizedHamburgerMenu` et `CommandPaletteModal` sont filtrés par `isAdmin === true`.
   - L'accès direct via `/?view=audit` affiche `AdminAccessGate` tant que l'utilisateur n'est pas authentifié avec Google ET reconnu comme administrateur ; aucune donnée ni onglet d'administration n'est monté côté DOM avant confirmation.
2. **Double vérification Firestore (`firestore.rules` déployées)** :
   - Toutes les collections d'administration (`admins`, `auditContentStates`, `auditCertifications`, `auditSources`, `auditEvidence`, `auditRuns`, `auditFindings`, `auditReviews`, `auditRevisions`, `auditSettings`) exigent `isAdmin()` en lecture comme en écriture, avec validation de schéma stricte et immuabilité de `auditReviews` et `auditRevisions`.
   - Seule la collection publique `publishedContent/{contentId}` est lisible par les apprenants et les visiteurs (contenant exclusivement les correctifs humains publiés et les statuts publics de certification, sans aucune note d'audit interne), avec écriture réservée à `isAdmin()`.
3. **Vérification cryptographique côté serveur Express (`server.ts`)** :
   - Le middleware `requireAdminAuth` vérifie la signature RS256 du jeton Firebase ID via les certificats X.509 publics de Google (`securetoken@system.gserviceaccount.com`), le projet (`aud` / `iss`), l'expiration et l'appartenance à `ADMIN_EMAILS` (ou custom claim `admin` / `role == 'admin'`).
   - Les routes `/api/audit/analyze` et `/api/audit/check-source` renvoient `HTTP 401` sans jeton valide et `HTTP 403` pour tout compte non-administrateur.
   - Protection SSRF sur `/api/audit/check-source` : validation HTTPS/HTTP, résolution DNS (`node:dns/promises`) et blocage de toute IP loopback, privée RFC1918, link-local / métadonnées Cloud (`169.254.169.254`), CGNAT (`100.64.0.0/10`) ou IPv6 ULA à chaque saut de redirection.

---

## 3. Intégration IA & Hiérarchie documentaire
- **Modèle serveur** : `@google/genai` sur `/server.ts` uniquement avec le modèle `gemini-4-hydrogen` (`User-Agent: aistudio-build`), la variable `process.env.GEMINI_API_KEY` (jamais exposée côté navigateur), une sortie JSON structurée (`responseSchema`), un découpage anti-injection par balises XML `<UNTRUSTED_CONTENT_TO_AUDIT>`, et un plafonnement par fenêtre temporelle et quota journalier.
- **Hiérarchie officielle des sources (`sourceRegistryService.ts`)** :
  - **Priorité 1** : Documentation officielle constructeur (`learn.microsoft.com`, `docs.aws.amazon.com`, `cloud.google.com/docs`, `dataplatform.cloud.ibm.com`, `nvidia.com`)
  - **Priorité 2** : Exam guides, skill outlines et pages d'examen officiels
  - **Priorité 3** : Notes de version, annonces de retrait et changelogs officiels
  - **Priorité 4** : Références éditoriales complémentaires internes (insuffisantes à elles seules si `requireOfficialSourceForApproval` est actif)

---

## 4. Workflow éditorial, validation humaine & Rollback
1. **Contrôles déterministes (`deterministicChecksService.ts`)** : détection de doublons d'intitulés, alignement sur les statuts de certification retirée/suspendue, sources cassées/absentes, formulations absolues (*toujours, jamais, obligatoirement*), parité FR/EN (détectant notamment les définitions anglaises non traduites du glossaire) et intégrité QCM.
2. **Audit assisté par IA (`aiReviewService.ts`)** : analyse ciblée avec stockage dans `latestAiSuggestions` ; **jamais auto-validé ni auto-publié**.
3. **Établissement des versions (`contentVersioningService.ts`)** : toute modification JSON ou application de suggestion IA crée un `ContentRevision` immuable avec hash déterministe, diff par champ et invalidation automatique de toute validation humaine antérieure (`validationStatus = 'invalidated_by_edit'`).
4. **Règles bloquantes (`humanValidationService.ts`)** : l'approbation humaine est bloquée en cas d'anomalie critique ouverte, d'absence de source officielle requise, de suggestion IA en attente d'arbitrage (à appliquer ou écarter), d'explication QCM manquante ou de certification retirée non archivée.
5. **Restauration (Rollback)** : la restauration d'une version antérieure crée une nouvelle version `vN+1` reprenant le snapshot choisi et réinitialise le cycle de validation humaine.

---

## 5. Exploitation, Tests & Sauvegarde
- **Tests unitaires & gouvernance** : `npm test` (`tests/metricsEngine.test.ts` + `tests/auditModule.test.ts`)
- **Validation des règles Firestore** : `npx eslint firestore.rules`
- **Tests E2E Playwright & garde-fous HTTP** : `npm run test:e2e` (`tests/landing-responsive.mjs`)
- **Exports de traçabilité** : téléchargement CSV et JSON complet depuis l'onglet *Historique* du module Audit.
- **Sauvegarde Firestore** : exporter régulièrement les collections d'audit et `publishedContent` via `gcloud firestore export` en complément des exports JSON/CSV intégrés.
