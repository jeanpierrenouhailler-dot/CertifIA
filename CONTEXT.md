# 📖 CONTEXT.md • Architecture & Référentiel Produit CertifIA

## 1. Vision & Objectifs Produit
**CertifIA** est une plateforme applicative de préparation intensive et de télémétrie cognitive pour les certifications d'intelligence artificielle et de Cloud (Microsoft Azure AI-102 & AI-900, AWS Certified AI Practitioner & MLS-C01, Google Cloud Professional ML Engineer, IBM watsonx.ai Specialist C1000-177).

Plutôt qu'un catalogue passif de 500 fiches et de centaines de questions, CertifIA agit comme un **coach cognitif proactif** capable de :
1. Calculer précisément la **courbe d'oubli** de l'utilisateur grâce à l'algorithme **SuperMemo-2 (SM-2)** et au modèle **FSRS**.
2. Composer chaque matin une **session quotidienne personnalisée** ("Aujourd'hui") ciblant 17 cartes prioritaires, 8 notions fragiles et 12 questions non maîtrisées.
3. Structurer l'orientation de carrière grâce à un **moteur de recommandation en 4 niveaux** (Fondations → IA Générative → Cloud AI → Machine Learning & MLOps).
4. Offrir une expérience logicielle de niveau professionnel : **Menu Hamburger catégorisé**, **mode clair et mode sombre**, **panneau de paramètres système avec mises à jour automatiques en arrière-plan**, **infobulles novice**, **onboarding légal avec décharge de responsabilité**, et **installation PWA mobile/desktop**.

---

## 2. Modèle Mathématique de Mémorisation (SM-2 / FSRS)
Le moteur situé dans `src/lib/srsAlgorithm.ts` calcule les variables suivantes pour chaque fiche mémo :

* **Ease Factor ($EF$) :**
  Initialisé à $2.5$. Ajusté dynamiquement après chaque revue selon la formule :
  $$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
  Où $q \in \{1, 2, 3, 4, 5\}$ correspond au grade attribué par l'apprenant. ($EF \ge 1.3$).

* **Intervalles de révision ($I$) :**
  * Répétition 1 : $I(1) = 1\text{ jour}$
  * Répétition 2 : $I(2) = 3\text{ jours}$ (ou $6\text{ jours}$ en cas de recall parfait)
  * Répétition $n > 2$ : $I(n) = I(n-1) \times EF$ (arrondi à l'entier le plus proche)

* **Métriques restituées sur chaque fiche (ex: Carte #127) :**
  * `cardNumber` : Identifiant précis (ex: `Carte #127`).
  * `lastReviewLabel` : Date de la dernière révision (`aujourd'hui`, `hier`, `il y a 3 jours`).
  * `diffScore` : Score de difficulté normalisé de 1 à 5.
  * `nextReviewLabel` : Date programmée (`dans 3 jours`, `dans 7 jours`).
  * `repCount` : Nombre de répétitions réussies consécutives.
  * `successRate` : Taux de réussite global en pourcentage.

---

## 3. Moteur de Recommandation en 4 Niveaux
Situé dans `src/lib/recommendationEngine.ts` et `src/components/RecommendationView.tsx` :

### Variables d'entrée :
* **Niveau :** Débutant, Intermédiaire, Avancé.
* **Métier :** Développeur, Data Scientist, Architecte, Chef de projet, Consultant, Autre.
* **Objectif technologique :** Comprendre l'IA, IA générative, Cloud AI, Machine Learning, MLOps.
* **Contraintes :** Budget (Éco, Standard, Illimité/Entreprise), Temps par semaine (2-4h, 5-8h, 10-15h+), Langue (FR, EN, Mixte), Objectif professionnel (Montée en compétences, Reconversion, Partenariats, Express 60j).

### Sortie générée :
Une trajectoire en 4 paliers interconnectés :
* **Niveau 1 :** AI Fundamentals (AI-900 / AIF-C01)
* **Niveau 2 :** Generative AI (Bedrock / watsonx Studio Prompt Lab)
* **Niveau 3 :** Cloud AI (Azure AI-102 OpenAI & RAG)
* **Niveau 4 :** Machine Learning & MLOps (Google Cloud PMLE / AWS MLS-C01)

---

## 4. Architecture Système, PWA & Mises à Jour

### Paramètres Système & Mises à Jour en Arrière-Plan (`src/context/SystemUpdateContext.tsx`)
* **Version actuelle :** `v2.4.0`
* **Date de sortie :** `2 Novembre 2026`
* **Surveillance continue :** Un timer autonome vérifie toutes les 3 minutes la disponibilité de nouvelles versions ou correctifs et met à jour l'horodatage de dernière vérification.
* **Bouton Vérifier les mises à jour :** Contrôle instantané avec retour visuel clair.
* **Bouton Forcer la mise à jour :** Purge les caches du navigateur via l'API `caches`, force la mise à jour du `ServiceWorker` et recharge proprement l'application.

### Progressive Web App (PWA) (`public/manifest.webmanifest` & `public/sw.js`)
* Conformité aux standards d'installation PWA (`display: standalone`, `id: /`, icônes `icon.svg` masquables et standard).
* Interception de l'événement `beforeinstallprompt` dans `src/context/PwaContext.tsx`.
* Modal interactif avec instructions pas à pas pour Safari iOS (Partager → Sur l'écran d'accueil), Chrome Android et Desktop.

### Thème Sombre & Thème Clair (`src/context/ThemeContext.tsx`)
* Gestion centralisée par classe CSS `dark` / `light` sur la racine `<html>`.
* Palette sombre : fond `#0f131d`, conteneurs `#171b26`, bordures `#262a35`, typographie `#dfe2f1`.
* Palette claire : fond `bg-slate-50`, conteneurs blancs `bg-white`, bordures `border-slate-200`, typographie foncée `text-slate-900`.

---

## 5. Cadre Juridique & Mentions Légales
Dans `src/components/LegalOnboardingModal.tsx` :
* Décharge de responsabilité formelle indiquant que l'éditeur ne saurait être tenu responsable des données, questions ou réponses fournies dans le cadre de l'outil d'entraînement.
* Acceptation obligatoire lors de la première utilisation (`localStorage` : `certifai_legal_accepted_v1`).
* Consultation accessible à tout moment depuis le menu hamburger, la barre latérale et les paramètres.

---

## 6. Inventaire & Répartition des 2 800 Flashcards
Accessible directement depuis la catégorie **« 🗂️ Répartition des Flashcards »** du menu hamburger ou le bouton inventaire du deck :
* **Azure AI-102 (Azure AI Engineer Associate) :** 500 fiches (5 domaines x 100 fiches)
* **Azure AI-900 (Azure AI Fundamentals) :** 500 fiches (5 domaines x 100 fiches)
* **AWS AIF-C01 (Certified AI Practitioner) :** 500 fiches (5 domaines x 100 fiches)
* **AWS MLS-C01 (Machine Learning - Specialty) :** 400 fiches (4 domaines x 100 fiches)
* **Google Cloud GCP-PMLE (Professional ML Engineer) :** 500 fiches (5 domaines x 100 fiches)
* **IBM watsonx C1000-177 (watsonx.ai v1.0 Specialist) :** 400 fiches (4 domaines x 100 fiches)

Total : **27 domaines officiels** d'examen couverts avec pondérations officielles, consultables via `src/components/FlashcardsDistributionModal.tsx`.

---

## 7. Glossaire & Encyclopédie des Concepts IA (`src/data/glossaryData.ts` & `src/components/GlossaryView.tsx`)
Conçu pour combler le fossé entre la mémorisation brute et la compréhension conceptuelle profonde transversale à toutes les certifications Cloud :
* **Vue Duale Intelligente :**
  1. **Glossaire Rapide A-Z :** Recherche instantanée multi-critères, index alphabétique cliquable, cartes rétractables, pièges d'examen officiels mis en évidence et bookmarking en favoris.
  2. **Encyclopédie Approfondie :** Articles de référence avec diagrammes de flux ASCII, principes de calcul formels, comparaisons multi-cloud (Azure vs AWS vs GCP vs IBM vs NVIDIA), et liens directs vers les questions QCM et fiches mémo associées.
* **Concepts Fondamentaux Couverts :**
  * RAG (Retrieval-Augmented Generation) & HyDE, Recherche Hybride (Dense + Sparse BM25 + Reciprocal Rank Fusion), Re-ranking sémantique.
  * Transformers, Multi-Head Self-Attention, Positional Encoding, MoE (Mixture of Experts).
  * LoRA, QLoRA, PEFT, Quantification (INT8, INT4, AWQ, FP8).
  * Feature Store (Online vs Offline), Data Drift (Covariate Shift) vs Concept Drift, Index de Stabilité de Population (PSI).
  * watsonx.governance FactSheets, EU AI Act (Catégories de risque), Guardrails & Prompt Injection (Directe/Indirecte).
  * Métriques de classification (Precision, Recall, F1-Score) et d'évaluation LLM (ROUGE, BLEU, BERTScore, G-Eval).

---

## 8. Nouvelle Architecture de Navigation & UX/UI (v2.6.0)
Restructuration fondée sur 5 piliers cardinaux et un design anti-slop à haute lisibilité :
1. **ACCUEIL (`today`)** : Message de bienvenue, progression générale, certification en cours, bouton d'action principal « Reprendre mon apprentissage » en 1 clic, récapitulatif des 17 cartes SM-2 dues, 8 notions fragiles, 12 questions ciblées, flux des activités récentes et prochaines étapes recommandées.
2. **CERTIFICATIONS (`catalogue`)** : Catalogue des 18 certifications officielles, filtres (fournisseur, niveau, domaine, budget), fiches détaillées (Blueprints), comparateur interactif côte à côte (`CertificationsComparatorModal.tsx`) et passerelles directes d'entraînement.
3. **APPRENTISSAGE (`quiz`, `flashcards`, `exam`, `recommendation`)** : Mes parcours, Quiz & entraînements scénarisés, Fiches mémo avec répétition espacée SRS SM-2 (2 800 cartes), examens blancs chronométrés 90 minutes en conditions réelles, et passerelles post-activité (revoir les erreurs, fiches associées, tuteur IA).
4. **PROGRESSION (`analytics`)** : Télémétrie cognitive, diagnostic des compétences maîtrisées vs compétences à renforcer, historique des tentatives avec clause de rigueur méthodologique (les estimations ne sont pas des garanties d'examen).
5. **ASSISTANT IA (`assistant` & `AIAssistantDrawer.tsx`)** : Tuteur pédagogique IA disponible en tiroir latéral contextuel ou écran dédié, fournissant explications pas à pas, pièges d'examen officiels et astuces mnémotechniques.
* **Barre Latérale Rétractable** : Mode étendu (72) et mode icônes avec tooltips natifs.
* **Barre Supérieure Légère & Fil d'Ariane Dynamique** : Titre contextuel, fil d'Ariane, certification cible active, Command Palette (`Cmd+K`) et accès profil.
* **Barre Inférieure Mobile (`MobileBottomNav.tsx`)** : 5 destinations tactiles conformes ($\ge 44\text{px}$) + menu tiroir pour les options secondaires.
* **Composants d'État Réutilisables** : `PageHeader.tsx`, `EmptyState.tsx`, `LoadingState.tsx`, `ErrorState.tsx`.

---

## 9. Architecture d'Internationalisation (i18n) & Bilinguisme FR/EN (v2.7.0)

CertifIA intègre un système d'internationalisation de niveau production conçu pour être robuste, sans régression et conforme aux contraintes PWA offline :

### 9.1 Organisation des Ressources & Namespaces
Les traductions sont découpées en **13 namespaces sémantiques** statiquement bundlés sous `src/i18n/locales/{fr,en}/` :
1. `common.json` : Actions universelles, statuts, badges, boutons génériques.
2. `navigation.json` : Les 5 catégories majeures, libellés courts et longs des 16 écrans, raccourcis.
3. `dashboard.json` : Cockpit du jour (« Aujourd'hui »), cartes SM-2 dues, indicateurs et flux d'activité.
4. `certifications.json` : Filtres, statuts, niveaux, comparateur et fiches Blueprints.
5. `learning.json` : Moteur de recommandation, questionnaire 4 niveaux, parcours IA et glossaire.
6. `quizzes.json` : Questions d'examen, options A/B/C/D, explications, analyse des pièges et références.
7. `flashcards.json` : Système SM-2, boutons d'évaluation 1-4, métriques et répartition des 2 800 fiches.
8. `examinations.json` : Examens blancs 90 min, décompte chrono, pondérations par domaine et résultats.
9. `progress.json` : Télémétrie cognitive, radar de compétences, courbe d'oubli et historique.
10. `assistant.json` : Tuteur pédagogique IA, suggestions d'amorces, cas pratiques et pièges.
11. `settings.json` : Paramètres système, surveillance des versions, diagnostic et cache.
12. `errors.json` : Codes d'erreur, pannes réseau et messages de secours.
13. `notifications.json` : Toasts d'action, synchronisation Firebase et rappels d'étude.

### 9.2 Composants & Passerelles Utilisateur
* **`LanguageSelector.tsx`** :
  - Variante `'header'` : Sélecteur épuré compact avec drapeaux et étiquettes FR / EN.
  - Variante `'expanded'` : Tuiles radio interactives pour le modal Paramètres Système.
  - Variante `'compact'` : Bouton minimaliste pour le menu hamburger et le tiroir mobile.
* **Synchronisation Document & Persistance** :
  - `document.documentElement.lang` mis à jour instantanément (`fr` $\leftrightarrow$ `en`).
  - Sauvegarde `localStorage` (`certifia_language`).
  - Synchronisation Cloud Firestore sur le document utilisateur (`preferredLanguage`).
* **Formatage Localisé `Intl` (`src/i18n/index.ts`)** :
  - `formatLocalizedDate(date, options, langOverride)` : formatage adapté (ex: `15 mars 2026` vs `March 15, 2026`).
  - `formatLocalizedTime(time, langOverride)` : formatage horaire `14:30` vs `2:30 PM`.
  - `formatLocalizedNumber(num, options, langOverride)` : séparateurs de milliers conformes (`1 250 000` vs `1,250,000`).
  - `formatLocalizedPercent(num, langOverride)` : symboles de pourcentage avec ou sans espace.
  - `formatLocalizedCurrency(amount, currency, langOverride)` : devises formatées (`165,00 $US` vs `$165.00`).

### 9.3 Guide d'Ajout d'une Nouvelle Langue (ex: Espagnol `es`)
1. Créer le sous-répertoire `src/i18n/locales/es/`.
2. Dupliquer les 13 fichiers JSON de `src/i18n/locales/en/` vers `src/i18n/locales/es/` et traduire les chaînes.
3. Déclarer la langue dans `src/i18n/index.ts` : ajouter `'es'` au type `SupportedLanguage`.
4. Importer les 13 namespaces dans `src/i18n/config.ts` et les rattacher à l'objet `resources.es`.
5. Ajouter l'option dans `src/components/LanguageSelector.tsx` (`{ code: 'es', label: 'Español', flag: '🇪🇸' }`).
6. Exécuter le script de parité `npx tsx src/i18n/verifyI18nParity.ts` pour valider l'intégrité 1:1.

