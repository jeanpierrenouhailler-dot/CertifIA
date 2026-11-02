# 🏆 CertifIA • AI Cloud Exam Prep & Cognitive Engine

<div align="center">

<img src="/icon.svg" alt="Logo CertifIA" width="128" height="128" />

### *Plateforme intelligente de préparation certifiante et de télémétrie cognitive pour examens Cloud & IA*

[![Version](https://img.shields.io/badge/Version-v2.4.0-blue.svg?style=for-the-badge&logo=semver)](CHANGELOG.md)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-emerald.svg?style=for-the-badge&logo=pwa)](public/manifest.webmanifest)
[![SM-2 Algorithm](https://img.shields.io/badge/Algorithm-SM--2%20%2F%20FSRS-purple.svg?style=for-the-badge)](src/lib/srsAlgorithm.ts)
[![Theme](https://img.shields.io/badge/Theme-Dark%20%7C%20Light-amber.svg?style=for-the-badge)](src/context/ThemeContext.tsx)
[![Coverage](https://img.shields.io/badge/Examens-Azure%20%7C%20AWS%20%7C%20GCP%20%7C%20IBM-indigo.svg?style=for-the-badge)](src/data/certificationsData.ts)

</div>

---

## 📸 Aperçu de l'Interface & Fonctionnalités Clés

<div align="center">
  <img src="/assets/certifai-screenshot.svg" alt="Capture d'écran CertifIA v2.4.0" width="100%" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.4);" />
</div>

> **Aperçu visuel complet :** Le tableau de bord unifié **Aujourd'hui** avec les 17 cartes SRS prêtes à réviser, le **Menu Hamburger Catégorisé**, le **Parcours IA en 4 Niveaux**, la carte d'exemple SM-2 **Carte #127** et les **Paramètres Système v2.4.0**.

---

## 🚀 Dernières Nouveautés • Version 2.4.0 (Novembre 2026)

* 🍔 **Menu Hamburger Catégorisé** : Regroupement ergonomique de l'ensemble des modules par catégorie (*Session & Orientation*, *Révisions & Entraînement*, *Évaluation & Spécifications*, *Télémétrie & Compte*).
* ⚙️ **Paramètres Système & Mises à Jour** :
  * 📅 Date de sortie officielle de la version (`v2.4.0 • 2 Novembre 2026`).
  * 🕒 Horodatage en direct de la dernière vérification certifiée.
  * 🔄 Bouton **« Vérifier les mises à jour »** avec interrogation réseau et retour instantané.
  * ⚡ Bouton **« Forcer la mise à jour »** avec nettoyage automatique du cache et réactualisation fluide.
  * 🔄 **Système de Mises à Jour Automatiques en Arrière-Plan** : Scrutation périodique silencieuse toutes les 3 minutes et application instantanée sans perte de progression utilisateur.
* ☀️ **Thème Clair & Thème Sombre** : Bascule instantanée entre le mode *Cyber Obsidian* (sombre immersif) et le mode *Workspace Entreprise* (clair haute lisibilité) avec persistance locale.
* 🛡️ **Onboarding Juridique & Mentions Légales** : Clause stricte et explicite d'exonération de responsabilité spécifiant que l'éditeur décline toute responsabilité quant à l'exactitude des données et questions fournies à des fins d'entraînement personnel.
* 🎓 **Mode Guide Novice & Infobulles Contextuelles** : Bulles explicatives interactives (`InfoTooltip`) sur chaque champ, carte et statistique pour guider pas à pas les utilisateurs débutants.
* 📲 **Bouton « Installer l'application » (PWA)** : Installation en un clic sur écran d'accueil mobile (iOS/Android) ou bureau (Windows/macOS/Chrome/Edge) pour un usage plein écran hors-ligne.

---

## 🧩 Les 5 Piliers Pédagogiques de CertifIA

### 1. 🎯 Page « Aujourd'hui » & Session Quotidienne Automatisée
Plus besoin de parcourir 500 fiches au hasard. CertifIA analyse vos performances passées et votre courbe d'oubli mathématique pour composer chaque matin votre session optimale :
* 🧠 **17 cartes à réviser** au seuil d'oubli calculé par l'algorithme SuperMemo-2 / FSRS.
* ⚠️ **8 notions fragiles** (difficulté $\ge 4/5$, hésitations répétées ou pièges d'examen officiels).
* ❓ **12 questions non maîtrisées** (cas pratiques d'architecture QCM).
* 🎯 Jauge d'avancement par rapport au seuil éliminatoire officiel (**700 / 1000 pts**).

### 2. ✨ Le Moteur de Recommandation en 4 Niveaux
Une orientation sur-mesure basée sur un questionnaire en 2 étapes :
```
┌────────────────────────────────────────────────────────┐
│ Niveau 1 : AI Fundamentals (ex: Azure AI-900 / AIF-C01) │
└───────────────────────────┬────────────────────────────┘
                            │
                            ↓
┌───────────────────────────┴────────────────────────────┐
│ Niveau 2 : Generative AI (ex: Bedrock / watsonx Studio) │
└───────────────────────────┬────────────────────────────┘
                            │
                            ↓
┌───────────────────────────┴────────────────────────────┐
│ Niveau 3 : Cloud AI (ex: Azure AI-102 Associate)       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ↓
┌───────────────────────────┴────────────────────────────┐
│ Niveau 4 : Machine Learning / MLOps (GCP-PMLE / MLS)   │
└────────────────────────────────────────────────────────┘
```

### 3. 🎴 Fiches Mémo SRS avec Moteur SM-2 & FSRS
Chaque carte dispose d'un historique scientifique de rétention :
* **Carte #127** (Identifiant précis du référentiel).
* **Dernière révision** : Aujourd'hui / Date relative.
* **Difficulté** : 1/5 à 5/5 avec code couleur dynamique.
* **Prochaine révision** : Intervalle calculé (*dans 3 jours, 7 jours, 14 jours...*).
* **Répétitions & Taux de réussite** : Cumul des évaluations positives.
* Évaluation à 4 boutons : **À revoir (1j)**, **Difficile (3j)**, **Bien (7j)**, **Facile (14j)**.

### 4. ⏱️ Examens Blancs Chronométrés en Conditions Réelles
* Épreuves complètes chronométrées (65 à 120 minutes selon la certification).
* Score seuil officiel (**700 à 750 / 1000 pts**).
* Débriefing par domaine officiel (*Planification, Vision, NLP, GenAI/RAG, Gouvernance*).

### 5. 📊 Télémétrie Cognitive & Synchronisation Firebase
* Indice de préparation global.
* Série quotidienne de travail (*Streak* avec flamme animée).
* Synchronisation transparente en Cloud Firestore et repli hors-ligne en LocalStorage.

---

## 🍔 Organisation du Menu Hamburger Catégorisé

Accessible à tout moment via le bouton **Menu** en haut à gauche ou le raccourci `Ctrl + M` :

| Catégorie | Modules Inclus | Description |
| :--- | :--- | :--- |
| **🎯 Session & Orientation** | *Aujourd'hui*, *Parcours IA* | Pilotage quotidien et feuille de route 4 niveaux |
| **🗂️ Répartition des Flashcards** | *Répartition par certification*, *Azure (1 000)*, *AWS (900)*, *GCP (500)*, *IBM (400)* | Inventaire officiel des **2 800 cartes**, pondérations et répartition par domaine |
| **📚 Révisions & Entraînement** | *Catalogue (18 certifs)*, *QCM*, *Fiches SRS* | Apprentissage granulaire et répétition espacée |
| **⏱️ Évaluation & Spécifications** | *Examen Blanc*, *Blueprints Officiels* | Mise en situation réelle et pondérations d'examen |
| **📊 Télémétrie & Compte** | *Analytics*, *Mon Profil Firebase* | Suivi de la courbe d'oubli et calendrier cible |
| **⚙️ Paramètres & Utilitaires** | *Paramètres Système*, *Mentions Légales*, *PWA*, *Thème*, *Guide* | Administration, vérification de mises à jour, accessibilité |

---

## ⌨️ Raccourcis Clavier

| Raccourci | Action |
| :--- | :--- |
| `Ctrl + M` / `Cmd + M` | Ouvrir / Fermer le **Menu Hamburger Catégorisé** |
| `Ctrl + K` / `Cmd + K` | Ouvrir la **Recherche globale et les raccourcis d'examen** |
| `Espace` | Retourner la fiche mémo active (Recto / Verso) |
| `1` / `2` / `3` / `4` | Noter la carte active (*À revoir*, *Difficile*, *Bien*, *Facile*) |
| `Échap` | Fermer n'importe quel panneau, tiroir ou modal |

---

## 🛠️ Stack Technique

* **Framework :** React 19 + TypeScript
* **Build Tool :** Vite 8
* **Styling :** Tailwind CSS v4 (Mode Sombre & Mode Clair natif)
* **PWA & Offline :** Web App Manifest + Service Worker autonome (`/sw.js`)
* **Icônes :** Lucide React
* **Persistance :** Firebase Firestore + LocalStorage haute fidélité

---

## ⚖️ Mentions Légales & Avertissement

> **Clause d'exonération de responsabilité :**  
> L'éditeur et les créateurs de **CertifIA** déclinent formellement toute responsabilité quant à l'exactitude, l'exhaustivité, l'actualité ou la conformité des données, questions, propositions de réponses, explications ou synthèses fournies dans l'application. CertifIA est un projet indépendant d'entraînement cognitif personnel et n'est affilié à aucun des organismes certificateurs mentionnés (Microsoft, AWS, Google Cloud, IBM).
