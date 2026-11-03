# 📝 CHANGELOG • Historique des Versions CertifIA

Toutes les modifications notables apportées au projet **CertifIA** sont consignées dans ce document selon les conventions [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et [Semantic Versioning](https://semver.org/).

---

## [2.7.0] - 2026-11-03 • Unification Intégrale de la Navigation & Configuration Centralisée

### 🧭 Unification & Architecture Fonctionnelle Unique
* **Configuration Centralisée de Navigation (`src/navigation/navigationConfig.ts`) :**
  * Source de vérité unique pour toutes les rubriques, sous-items, icônes Lucide, libellés, raccourcis et cibles d'écrans.
  * Structure normalisée en 6 catégories directes :
    1. **ACCUEIL** : « Aujourd'hui » (reprise immédiate, session SRS du jour).
    2. **CERTIFICATIONS** : « Catalogue », « Comparateur » et « Parcours recommandés » (Niveau 1 à Niveau 4).
    3. **APPRENTISSAGE** : « Quiz et entraînements », « Flashcards et SRS », « Répartition des flashcards » (modal inventaire 2 800 fiches), « Examens blancs » (chronométré 90 min) et « Glossaire & notions ».
    4. **PROGRESSION** : « Tableau de bord » (Analytics cognitifs, diagnostic forces/faiblesses).
    5. **ASSISTANT IA** : « Assistant pédagogique » (Tuteur d'examen interactif, explications de pièges).
    6. **PLUS** : « Mon profil », « Paramètres système » (mises à jour automatiques en tâche de fond), « Guide novice », « Mentions légales » et « Installer l'application ».
* **Harmonisation Cohérente Multi-Supports :**
  * **Barre Latérale (`Sidebar.tsx`)** : Sous-sections accordéon unifiées, compteurs badges temps réel, suppression des duplications.
  * **Menu Hamburger Catégorisé (`CategorizedHamburgerMenu.tsx`)** : Consommation directe de `NAV_CATEGORIES` et `NAV_ITEMS`, filtres rapides, état actif synchrone.
  * **Barre Mobile Inférieure (`MobileBottomNav.tsx`)** : 5 accès principaux clairs avec zones tactiles ergonomiques ($\ge 48\text{px}$), bouton « Plus » avec tiroir modal fluide respectant les safe areas iOS/Android.
  * **Fil d'Ariane Dynamique (`Header.tsx`)** : Balisage sémantique WCAG AA avec `aria-current="page"`, icônes de rubriques et intitulé exact de la vue en cours.
  * **Command Palette (`CommandPaletteModal.tsx` • `Cmd+K` / `Ctrl+K`)** : Recherche dynamique multi-niveaux connectée à `getSearchableNavItems()`, aux 18 certifications et aux concepts du glossaire avec navigation fléchée clavier.

---

## [2.6.0] - 2026-11-02 • Restructuration Majeure de la Navigation & UX/UI

### 🏛️ Restructuration Piliers & Navigation
* **Refonte de l'Architecture autour de 5 Piliers Majeurs :**
  1. **ACCUEIL (`today`)** : Tableau de bord épuré, accueil personnalisé post-connexion, indicateur de certification cible, bouton d'action principal « Reprendre mon apprentissage » en 1 clic, récapitulatif des 17 cartes SM-2 dues, 8 notions fragiles, 12 questions ciblées, flux des activités récentes et prochaines étapes recommandées.
  2. **CERTIFICATIONS (`catalogue`)** : Catalogue officiel avec filtres avancés (fournisseur Cloud, niveau de difficulté, domaine IA, fourchette de prix), accès direct aux fiches détaillées (Blueprints), passerelle d'entraînement direct (« S'entraîner ») et intégration du comparateur.
  3. **APPRENTISSAGE (`quiz`, `flashcards`, `exam`, `recommendation`)** : Espace d'assimilation et d'entraînement avec passerelles post-activité fluides (revoir les erreurs, fiches mémo associées, questionner le tuteur IA, lancer un examen blanc chronométré 90 min).
  4. **PROGRESSION (`analytics`)** : Télémétrie cognitive, diagnostic des compétences maîtrisées vs compétences à renforcer, historique détaillé des tentatives avec clause de transparence méthodologique (les estimations ne sont pas des garanties d'examen).
  5. **ASSISTANT IA (`assistant` & `AIAssistantDrawer`)** : Tuteur pédagogique IA disponible en tiroir latéral contextuel ou écran dédié, pré-chargé avec le contexte d'une question ou d'une certification, fournissant explications, pièges d'examen officiels et astuces mnémotechniques.
* **Barre Latérale Rétractable (Collapsible Sidebar) :**
  * Mode développé complet (72 de large) et mode réduit (icônes avec tooltips natifs).
  * Navigation accordéon fluide, zéro surcharge visuelle, statut actif net et contrasté.
* **Barre Supérieure Légère & Fil d'Ariane Dynamique (`Header.tsx`) :**
  * Fil d'Ariane contextuel (`Section > Page active`).
  * Badge interactif de certification cible active (accès direct au Blueprint).
  * Déclencheur Command Palette (`Cmd+K`), accès rapide tuteur IA, bascule thème clair/sombre, mode infobulles guidées et accès profil.
* **Barre de Navigation Inférieure Mobile (`MobileBottomNav.tsx`) :**
  * 5 destinations tactiles de premier niveau avec surface d'appui normalisée ($\ge 44\text{px}$).
  * Bouton « Plus » ouvrant le menu catégorisé pour les réglages et l'encyclopédie.
* **Command Palette Globale (`CommandPaletteModal.tsx` • `Cmd+K` / `Ctrl+K`) :**
  * Recherche instantanée multi-sources (certifications, notions du glossaire, quiz, actions directes et paramètres).
* **Comparateur de Certifications Côte à Côte (`CertificationsComparatorModal.tsx`) :**
  * Comparaison simultanée de 2 à 3 examens (fournisseur, niveau, prix, durée, seuil, domaines pondérés, passerelle d'entraînement).
* **Composants d'État Réutilisables (`PageHeader`, `EmptyState`, `LoadingState`, `ErrorState`).**

---

## [2.5.0] - 2026-11-02

### ✨ Ajouté
* **Glossaire & Encyclopédie Transversale de l'IA (`src/components/GlossaryView.tsx` & `src/data/glossaryData.ts`) :**
  * **Mode Dual Fluide :**
    * 🔤 **Glossaire Rapide (A-Z)** : Cartes condensées avec recherche instantanée multi-champs (terme, acronyme, anglais, définition, piège), index alphabétique interactif (A à Z), filtres par catégorie (GenAI, RAG, MLOps, Gouvernance, Vision, Cloud) et par Cloud Provider (Azure, AWS, GCP, IBM, NVIDIA, Théorie).
    * 🏛️ **Encyclopédie Approfondie** : Fiches d'architecture complètes avec explications détaillées, flux de données ASCII, formules mathématiques (Cosinus, F1, RRF, BLEU, PSI), grilles de correspondances multi-cloud (Azure vs AWS vs GCP vs IBM vs NVIDIA), et liens directs d'entraînement vers les QCM et Flashcards.
  * **⚠️ Pièges d'Examen Systématiques :** Mise en exergue des erreurs et confusions récurrentes dans les examens officiels (AI-102, AI-900, AIF-C01, MLS-C01, GCP-PMLE, IBM watsonx C1000-177).
  * **⭐ Système de Termes Favoris :** Enregistrement local des concepts prioritaires à réviser avant l'épreuve.
  * **Intégration Complète :**
    * Nouvel onglet de navigation dans la barre latérale `Sidebar.tsx`.
    * Entrée dédiée dans la catégorie *📚 Révisions & Entraînement* du menu hamburger.
    * Carte d'accès rapide dans le tableau de bord quotidien `TodayView.tsx`.
    * Écran dédié avec support intégral des thèmes Sombre et Clair.

## [2.4.0] - 2026-11-02

### ✨ Ajouté
* **Menu Hamburger Catégorisé (`src/components/CategorizedHamburgerMenu.tsx`) :**
  * Tiroir coulissant moderne accessible depuis l'en-tête (mobile et desktop), la barre latérale et le raccourci `Ctrl + M`.
  * Regroupement complet des fonctionnalités avec une **catégorie dédiée « 🗂️ Répartition des Flashcards »** :
    * 🎯 *Session & Orientation* (Aujourd'hui, Parcours IA).
    * 🗂️ *Répartition des Flashcards* (Lien « Répartition des flashcards par certification », Azure 1 000 fiches, AWS 900 fiches, Google Cloud 500 fiches, IBM 400 fiches).
    * 📚 *Révisions & Entraînement* (Catalogue 18 certifs, QCM, Fiches SRS).
    * ⏱️ *Évaluation & Spécifications* (Examen Blanc, Blueprints).
    * 📊 *Télémétrie & Compte* (Analytics, Profil Firebase).
    * ⚙️ *Paramètres & Utilitaires* (Paramètres Système, Mentions Légales, PWA, Thème, Guide).
  * Filtre de recherche instantané à l'intérieur du menu.
* **Modal Interactif de Répartition des Flashcards (`src/components/FlashcardsDistributionModal.tsx`) :**
  * Inventaire exhaustif des **2 800 cartes mémo** réparties sur **6 certifications** et **27 domaines officiels**.
  * Fiches détaillées avec taux de couverture, répartition de 100 cartes par sous-domaine officiel et bouton de lancement direct des révisions.
  * Bouton d'accès rapide « Répartition (2 800) » intégré dans la barre latérale et le deck de flashcards.
* **Menu de Paramètres Système & Mises à Jour (`src/components/SystemSettingsModal.tsx`) :**
  * Affichage de la **Date de sortie officielle** (`2 Novembre 2026`).
  * Affichage de la **Date et heure de la dernière vérification certifiée**.
  * Bouton **« Vérifier les mises à jour »** avec indicateur rotatif et notification toast.
  * Bouton **« Forcer la mise à jour »** purgeant le cache applicatif et réinitialisant les assets du Service Worker.
  * Journal des versions et détails d'architecture intégrés.
* **Système de Mises à Jour Automatiques en Arrière-Plan (`src/context/SystemUpdateContext.tsx`) :**
  * Intervalle d'arrière-plan autonome vérifiant la disponibilité de nouveaux assets toutes les 3 minutes.
  * Vérification automatique à la reprise de focus de la fenêtre.
  * Commutateur d'activation/désactivation dans les paramètres.
* **Thème Clair Intégral (`src/context/ThemeContext.tsx`) :**
  * Ajout du mode Clair avec palette soignée (fond ardoise douce `bg-slate-50`, cartes blanches épurées `bg-white`, typographie foncée à haut contraste `text-slate-900`, bordures subtiles).
  * Sélecteur de thème dans l'en-tête, la barre latérale et le menu hamburger.
  * Persistance automatique dans le stockage local du navigateur.
* **Onboarding avec Mentions Légales & Clause de Non-Responsabilité (`src/components/LegalOnboardingModal.tsx`) :**
  * Avertissement solennel spécifiant que l'éditeur et le concepteur ne sont pas responsables des données, questions ou réponses fournies dans le cadre de l'outil pédagogique.
  * Déclaration de non-affiliation vis-à-vis de Microsoft, AWS, Google Cloud et IBM.
  * Case à cocher obligatoire à la première utilisation, consultable à tout moment par la suite.
* **Mode Guide Novice & Infobulles Contextuelles (`src/components/InfoTooltip.tsx` & `src/context/GuideContext.tsx`) :**
  * Infobulles interactives sur les champs critiques (métriques SM-2, cartes fragiles, seuils d'examen, options de diagnostic).
  * Commutateur global permettant d'activer ou masquer les explications pour débutants.
* **Bouton « Installer l'application » & Support PWA (`src/context/PwaContext.tsx` & `src/components/InstallAppModal.tsx`) :**
  * Capture de l'événement natif `beforeinstallprompt`.
  * Bouton d'installation dans l'en-tête, la barre latérale et les paramètres.
  * Modal d'accompagnement visuel avec instructions illustrées pour iOS Safari, Android Chrome et Desktop.
  * Web App Manifest officiel (`/manifest.webmanifest`) et Service Worker (`/sw.js`).
* **Nouvelle Identité Visuelle :**
  * Logo vectoriel officiel en haute résolution (`/public/icon.svg`).
  * Capture d'écran vectorielle complète pour la documentation (`/public/assets/certifai-screenshot.svg`).
  * Raccourci clavier `Ctrl + M` pour ouvrir le menu hamburger.

---

## [2.3.0] - 2026-10-03

### ✨ Ajouté
* **Moteur de Recommandation & Diagnostic en 4 Niveaux (`src/lib/recommendationEngine.ts`) :**
  * Questionnaire d'orientation complet : Niveau (Débutant, Intermédiaire, Avancé), Métier (Développeur, Data Scientist, Architecte, Chef de projet, Consultant, Autre), Objectif technologique (Comprendre l'IA, GenAI, Cloud AI, Machine Learning, MLOps).
  * Prise en compte du budget, du temps disponible par semaine et de l'objectif professionnel.
  * Génération automatique d'un parcours certifiant officiel structuré du Niveau 1 au Niveau 4.
  * 3 variantes de parcours générées (Parcours Principal Sur-Mesure, Fast-Track GenAI, Spécialiste MLOps).

---

## [2.2.0] - 2026-10-01

### ✨ Ajouté
* **Page d'Accueil « Aujourd'hui » (`src/components/TodayView.tsx`) :**
  * Boîte de session quotidienne composée automatiquement par CertifIA : 17 cartes SRS, 8 notions fragiles, 12 questions non maîtrisées.
  * Progression en temps réel vers le score cible d'examen.
  * Session interactive guidée en 3 étapes avec retournement de carte, barème 4 niveaux et bilan de score d'XP.

---

## [2.1.0] - 2026-09-29

### ✨ Ajouté
* **Moteur Spaced Repetition System (SM-2 / FSRS) (`src/lib/srsAlgorithm.ts`) :**
  * Modélisation de l'Ease Factor adaptatif et calcul précis des intervalles de révision.
  * Télémétrie complète par carte : Carte #127, dernière révision, difficulté 1 à 5, prochaine révision, répétitions et taux de réussite.
  * Déploiement des règles de sécurité Firestore pour la synchronisation multi-appareils.

---

## [2.0.0] - 2026-09-20

### ✨ Ajouté
* **Plateforme Multi-Fournisseurs CertifIA :**
  * Support de 18 certifications réparties sur Microsoft Azure, AWS, Google Cloud et IBM watsonx.
  * Bibliothèque de plus de 1900 fiches mémo et simulateur d'examen chronométré en 90 minutes.
  * Authentification Firebase et persistance des résultats.
