import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  Check, 
  ArrowRight, 
  Plus, 
  ExternalLink, 
  Clock, 
  Award, 
  DollarSign, 
  BookOpen, 
  Sparkles,
  Layers,
  Target
} from 'lucide-react';
import { Certification, AppScreen } from '../types';
import { getLocalizedCertifications } from '../data/localizedCertifications';
import { useTranslation, getCurrentLanguage } from '../i18n';

interface CertificationsComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: AppScreen) => void;
  onOpenBlueprint: (certId: string) => void;
}

export const CertificationsComparatorModal: React.FC<CertificationsComparatorModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenBlueprint,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['ai102', 'aifc01']);
  const { t, i18n } = useTranslation(['certifications', 'common', 'navigation']);
  const lang = (i18n.language === 'en' ? 'en' : 'fr');
  const allCerts = getLocalizedCertifications(lang);

  if (!isOpen) return null;

  const handleToggleCert = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        // replace the last one
        setSelectedIds([selectedIds[0], selectedIds[1], id]);
      }
    }
  };

  const comparedCerts = selectedIds
    .map((id) => allCerts.find((c) => c.id === id))
    .filter(Boolean) as Certification[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-[#262a35] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-[#262a35] bg-slate-50 dark:bg-[#171b26] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-headline">
                {t('certifications:comparator.title', 'Comparateur de Certifications IA')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('certifications:comparator.subtitle', 'Comparez 2 à 3 certifications officielles côte à côte pour choisir la plus adaptée à vos objectifs.')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#262a35] transition-colors"
            aria-label={t('common:actions.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cert Picker Strip */}
        <div className="p-4 bg-slate-100 dark:bg-[#10141f] border-b border-slate-200 dark:border-[#262a35] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-mono text-slate-500 dark:text-slate-400 uppercase text-[10px] shrink-0 font-semibold mr-1">
            {t('certifications:comparator.selectPrompt', 'Sélectionner (max 3) :')}
          </span>
          {allCerts.slice(0, 10).map((c) => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => handleToggleCert(c.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-[#171b26] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#262a35] hover:border-slate-400'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{c.code}</span>
              </button>
            );
          })}
        </div>

        {/* Comparison Matrix Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className={`grid grid-cols-1 ${comparedCerts.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4 sm:gap-6`}>
            {comparedCerts.map((cert) => {
              const estPrice = cert.provider === 'azure' ? '$165 USD' : cert.provider === 'aws' ? (cert.level === 'fondamental' ? '$100 USD' : '$150 USD') : cert.provider === 'gcp' ? '$200 USD' : cert.provider === 'ibm' ? '$200 USD' : (lang === 'en' ? 'Free (Course) / $135 (Badge)' : 'Gratuit (Cours) / 135 $ (Badge)');

              return (
                <div
                  key={cert.id}
                  className="rounded-2xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-[#262a35] p-5 flex flex-col justify-between space-y-5 shadow-sm"
                >
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {cert.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        {cert.providerName}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {cert.targetAudience}
                      </p>
                    </div>

                    {/* Quick Badges Matrix */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35]">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">{t('certifications:comparator.level', 'Niveau')}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize mt-0.5 block">
                          {cert.levelLabel}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35]">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">{t('certifications:comparator.duration', 'Durée')}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                          {cert.durationMinutes} {t('common:units.minutes')}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35]">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">{t('certifications:comparator.passScore', 'Score de passage')}</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block font-mono">
                          {cert.passScore} / {cert.maxScore}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#10141f] border border-slate-200 dark:border-[#262a35]">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">{t('certifications:comparator.estimatedPrice', 'Prix estimé')}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block font-mono">
                          {estPrice}
                        </span>
                      </div>
                    </div>

                    {/* Domains breakdown */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#202533]">
                      <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t('certifications:comparator.domainWeights', 'Pondération des Domaines')}
                      </div>
                      <div className="space-y-1.5">
                        {cert.domains.map((dom, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-0.5">
                              <span className="truncate pr-2">{dom.name}</span>
                              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                                {dom.weight}
                              </span>
                            </div>
                            <div className="w-full h-1 bg-slate-100 dark:bg-[#10141f] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${dom.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-[#202533] space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBlueprint(cert.id);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{t('certifications:actions.viewBlueprint', 'Consulter le blueprint')}</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate('quiz');
                        }}
                        className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#202533] dark:hover:bg-[#262c3d] text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-[#262a35] transition-all flex items-center justify-center gap-1"
                      >
                        <Target className="w-3 h-3 text-blue-500" />
                        <span>{t('navigation:items.quiz.shortLabel', 'QCM')}</span>
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate('flashcards');
                        }}
                        className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#202533] dark:hover:bg-[#262c3d] text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-[#262a35] transition-all flex items-center justify-center gap-1"
                      >
                        <Layers className="w-3 h-3 text-emerald-500" />
                        <span>{t('navigation:items.flashcards.shortLabel', 'Flashcards')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
