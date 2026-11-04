import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// French namespaces
import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';
import frDashboard from './locales/fr/dashboard.json';
import frCertifications from './locales/fr/certifications.json';
import frLearning from './locales/fr/learning.json';
import frQuizzes from './locales/fr/quizzes.json';
import frFlashcards from './locales/fr/flashcards.json';
import frExaminations from './locales/fr/examinations.json';
import frProgress from './locales/fr/progress.json';
import frAssistant from './locales/fr/assistant.json';
import frSettings from './locales/fr/settings.json';
import frErrors from './locales/fr/errors.json';
import frNotifications from './locales/fr/notifications.json';

// English namespaces
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enDashboard from './locales/en/dashboard.json';
import enCertifications from './locales/en/certifications.json';
import enLearning from './locales/en/learning.json';
import enQuizzes from './locales/en/quizzes.json';
import enFlashcards from './locales/en/flashcards.json';
import enExaminations from './locales/en/examinations.json';
import enProgress from './locales/en/progress.json';
import enAssistant from './locales/en/assistant.json';
import enSettings from './locales/en/settings.json';
import enErrors from './locales/en/errors.json';
import enNotifications from './locales/en/notifications.json';

export type SupportedLanguage = 'fr' | 'en';

export const LANGUAGE_STORAGE_KEY = 'certifai_language_preference_v1';

export const resources = {
  fr: {
    common: frCommon,
    navigation: frNavigation,
    dashboard: frDashboard,
    certifications: frCertifications,
    learning: frLearning,
    quizzes: frQuizzes,
    flashcards: frFlashcards,
    examinations: frExaminations,
    progress: frProgress,
    assistant: frAssistant,
    settings: frSettings,
    errors: frErrors,
    notifications: frNotifications,
  },
  en: {
    common: enCommon,
    navigation: enNavigation,
    dashboard: enDashboard,
    certifications: enCertifications,
    learning: enLearning,
    quizzes: enQuizzes,
    flashcards: enFlashcards,
    examinations: enExaminations,
    progress: enProgress,
    assistant: enAssistant,
    settings: enSettings,
    errors: enErrors,
    notifications: enNotifications,
  },
} as const;

export function getInitialLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'fr') {
      return saved;
    }
  } catch {}

  // Fallback to browser language if available and supported
  try {
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.slice(0, 2).toLowerCase();
      if (browserLang === 'en') return 'en';
    }
  } catch {}

  // Default per user request: French
  return 'fr';
}

const initialLang = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'fr',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already prevents XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
    },
  });

// Sync document lang attribute
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
  document.documentElement.dir = 'ltr';
}

export default i18n;
