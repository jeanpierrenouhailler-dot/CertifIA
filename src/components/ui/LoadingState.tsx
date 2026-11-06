import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  submessage,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const displayMessage = message ?? t('status.loading', 'Chargement en cours...');
  const displaySubmessage = submessage !== undefined ? submessage : t('status.syncing', 'Synchronisation...');

  return (
    <div className={`p-10 flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
        {displayMessage}
      </p>
      {displaySubmessage && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {displaySubmessage}
        </p>
      )}
    </div>
  );
};
