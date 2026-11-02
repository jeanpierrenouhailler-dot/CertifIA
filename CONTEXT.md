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
