# Security Specification — CertifIA Content Audit Module

## Core Security Invariants
1. **Default Deny**: Every Firestore path defaults to `allow read, write: if false;`.
2. **Strict Separation of User PII & Admin Content Governance**:
   - Learner data under `/users/{userId}/**` remains strictly owner-scoped (`request.auth.uid == userId`).
   - All 10 internal audit collections (`/admins`, `/auditContentState`, `/auditCertifications`, `/auditSources`, `/auditEvidence`, `/auditRuns`, `/auditFindings`, `/auditReviews`, `/auditRevisions`, `/auditSettings`) are strictly restricted to verified administrators (`isAdmin()`).
   - Non-admin learners and unauthenticated guests can NEVER read or write internal audit findings, reviewer notes, AI diagnostics, or admin rosters.
3. **Verified Admin Predicate**:
   - `isAdmin()` requires `request.auth != null`, `request.auth.token.email_verified == true`, and either the verified primary admin email or an active `/admins/$(request.auth.uid)` record (`active == true`).
4. **Public Published Content Overlays (`/publishedContent/{contentId}`)**:
   - Contains zero PII and zero internal editorial notes/anomalies.
   - Readable (`get, list`) so learners receive human-validated corrections and certification retirement warnings; writable (`create, update, delete`) ONLY by `isAdmin()` with strict schema and bounded `patchJson` size.
5. **Immutable Audit History (`auditReviews`, `auditRevisions`)**:
   - `HumanReview` and `ContentRevision` records enforce `create` only (`allow update, delete: if false`) so approval and edit traceability can never be forged retroactively.
6. **Backend API Auth & SSRF Defense (`/api/audit/*`)**:
   - All mutating/analysis endpoints require a valid Google-signed Firebase ID Token verified cryptographically with RSA-SHA256 public certs, matching project `aud`/`iss`, `email_verified === true`, and authorized admin identity.
   - `/api/audit/check-source` resolves DNS records before connecting and rejects loopback, private RFC1918, link-local metadata (`169.254.169.254`), and ULA IPv6 ranges across redirect hops.

## Dirty Dozen Adversarial Payloads
1. **Unauthenticated read on `/auditFindings/{id}`**: Expected DENY (`isAdmin()` is false).
2. **Signed-in non-admin learner read/write on `/auditSources/{id}`**: Expected DENY (`isAdmin()` is false).
3. **Signed-in non-admin write on `/publishedContent/{id}`**: Expected DENY (`isAdmin()` required for writes).
4. **Privilege escalation creating `/admins/{attackerUid}`**: Expected DENY (`isAdmin()` required to create admins).
5. **Unverified email token calling `POST /api/audit/analyze`**: Expected HTTP 401 (`email_verified === true` enforced).
6. **Non-admin valid Firebase token calling `POST /api/audit/analyze`**: Expected HTTP 403.
7. **Mutating historical `/auditRevisions/{id}` or `/auditReviews/{id}`**: Expected DENY (`allow update, delete: if false`).
8. **Oversized `snapshotJson` (> 32KB) or invalid severity enum**: Expected DENY (strict size and field validation).
9. **SSRF request to `http://169.254.169.254/latest/meta-data/` on `/api/audit/check-source`**: Expected HTTP 400 SSRF block.
10. **Prompt injection inside quiz text trying to force `"overallVerdict": "pass"`**: Mitigated via untrusted XML delimiters + strict system instruction + server schema parser + mandatory human approval gate.
