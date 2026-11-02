# 📝 CHANGELOG • Historique des Versions CertifIA

Toutes les modifications notables apportées au projet **CertifIA** sont consignées dans ce document selon les conventions [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et [Semantic Versioning](https://semver.org/).

---

## [2.4.0] - 2026-11-02

### ✨ Ajouté
* **Menu Hamburger Catégorisé (`src/components/CategorizedHamburgerMenu.tsx`) :**
  * Tiroir coulissant moderne accessible depuis l'en-tête (mobile et desktop) et la barre latérale.
  * Regroupement complet des fonctionnalités en 5 catégories intuitives :
    * 🎯 *Session & Orientation* (Aujourd'hui, Parcours IA).
    * 📚 *Révisions & Entraînement* (Catalogue 18 certifs, QCM, Fiches SRS).
    * ⏱️ *Évaluation & Spécifications* (Examen Blanc, Blueprints).
    * 📊 *Télémétrie & Compte* (Analytics, Profil Firebase).
    * ⚙️ *Paramètres & Utilitaires* (Paramètres Système, Mentions Légales, PWA, Thème, Guide).
  * Filtre de recherche instantané à l'intérieur du menu.
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
