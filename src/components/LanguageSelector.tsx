import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation, getCurrentLanguage, changeLanguage, SupportedLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';

interface LanguageSelectorProps {
  variant?: 'header' | 'compact' | 'expanded';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { t, i18n } = useTranslation('common');
  const { updatePreferredLanguage } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = (i18n.language || getCurrentLanguage()).slice(0, 2) as SupportedLanguage;

  const languages: { code: SupportedLanguage; label: string; short: string }[] = [
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'en', label: 'English', short: 'EN' },
  ];

  const handleSelectLanguage = async (code: SupportedLanguage) => {
    if (code === currentLang) {
      setIsOpen(false);
      return;
    }
    await changeLanguage(code);
    await updatePreferredLanguage(code);
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (variant === 'expanded') {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="text-xs font-mono text-slate-500 dark:text-slate-400 block font-semibold">
          {t('language.selectLanguage', 'Choisir la langue / Select language')}
        </label>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Sélection de langue">
          {languages.map((item) => {
            const isActive = item.code === currentLang;
            return (
              <button
                key={item.code}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => handleSelectLanguage(item.code)}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-[#262a35] bg-white dark:bg-[#141824] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    {item.short}
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] ${className}`}>
        {languages.map((item) => {
          const isActive = item.code === currentLang;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelectLanguage(item.code)}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={item.label}
              aria-label={`Switch to ${item.label}`}
            >
              {item.short}
            </button>
          );
        })}
      </div>
    );
  }

  // Header Dropdown variant (standard)
  const activeLangObj = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171b26] dark:hover:bg-[#262a35] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#262a35] transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-xs font-medium"
        aria-label={t('language.selectLanguage', 'Choisir la langue')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <span className="font-mono font-bold">{activeLangObj.short}</span>
        <span className="hidden sm:inline text-slate-500 dark:text-slate-400 text-[11px] font-normal">
          ({activeLangObj.label})
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-150" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t('language.selectLanguage', 'Choisir la langue')}
          className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#262a35] rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-[#1f2433]">
            {t('language.selectLanguage', 'Langue / Language')}
          </div>
          {languages.map((item) => {
            const isActive = item.code === currentLang;
            return (
              <button
                key={item.code}
                role="option"
                aria-selected={isActive}
                type="button"
                onClick={() => handleSelectLanguage(item.code)}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2030]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    {item.short}
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
