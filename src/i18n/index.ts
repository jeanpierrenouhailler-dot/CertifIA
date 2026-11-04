import i18n, { SupportedLanguage, LANGUAGE_STORAGE_KEY } from './config';
export { useTranslation } from 'react-i18next';
export { default as i18n } from './config';
export type { SupportedLanguage } from './config';

/**
 * Changes active application language without reloading.
 * Updates localStorage and <html lang="..."> attribute.
 */
export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(lang);
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {}
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
  }
}

/**
 * Retrieves the currently active language ('fr' | 'en')
 */
export function getCurrentLanguage(): SupportedLanguage {
  const current = (i18n.language || 'fr').slice(0, 2).toLowerCase();
  return current === 'en' ? 'en' : 'fr';
}

/**
 * Localized date formatter using native Intl API
 * fr: "3 novembre 2026" | en: "November 3, 2026"
 */
export function formatLocalizedDate(
  dateInput: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
  langOverride?: SupportedLanguage
): string {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number'
    ? new Date(dateInput)
    : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  const lang = langOverride || getCurrentLanguage();
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';

  const defaultOptions: Intl.DateTimeFormatOptions = options && (options.dateStyle || options.timeStyle)
    ? options
    : {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options,
      };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
}

/**
 * Localized time formatter (e.g. 14:30 or 2:30 PM)
 */
export function formatLocalizedTime(dateInput: Date | string | number, langOverride?: SupportedLanguage): string {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number'
    ? new Date(dateInput)
    : dateInput;
  if (isNaN(date.getTime())) return '';

  const lang = langOverride || getCurrentLanguage();
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Localized number formatter (e.g. 2 800 vs 2,800)
 */
export function formatLocalizedNumber(num: number, options?: Intl.NumberFormatOptions, langOverride?: SupportedLanguage): string {
  const lang = langOverride || getCurrentLanguage();
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  return new Intl.NumberFormat(locale, options).format(num);
}

/**
 * Localized percentage formatter (e.g. 78 % vs 78%)
 */
export function formatLocalizedPercent(num: number, langOverride?: SupportedLanguage): string {
  const lang = langOverride || getCurrentLanguage();
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(num / 100);
}

/**
 * Localized currency formatter (e.g. 150 $US or $150 USD)
 */
export function formatLocalizedCurrency(amount: number, currency = 'USD', langOverride?: SupportedLanguage): string {
  const lang = langOverride || getCurrentLanguage();
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

