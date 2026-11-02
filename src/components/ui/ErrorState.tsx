import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Une erreur est survenue',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-6 sm:p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center max-w-lg mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-rose-700 dark:text-rose-300 mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-rose-600/90 dark:text-rose-300/80 mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
      )}
    </div>
  );
};
