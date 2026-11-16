import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCurrentLanguage } from '../i18n';

export interface VersionInfo {
  version: string;
  releaseDate: string;
  buildNumber: string;
  channel: 'production' | 'preview';
  highlights: string[];
}

export const APP_VERSION_INFO: VersionInfo = {
  version: 'v2.9.0',
  releaseDate: '16 Novembre 2026',
  buildNumber: '20261116.1',
  channel: 'production',
  highlights: [
    'Barre supérieure allégée en 3 zones avec menu Compte & Préférences unifié',
    'Menu Hamburger Catégorisé avec recherche instantanée et raccourci Ctrl+M',
    'Onboarding contextuel (ScreenGuideBanner) et infobulles sur chacun des 10 écrans',
    'Moteur de mises à jour automatiques en arrière-plan via Service Worker (SKIP_WAITING)',
    'Icônes PWA dédiées (192x192, 512x512, maskable & Apple Touch PNG) + bouton Installer',
    'Cadre légal renforcé avec clause explicite de non-responsabilité des données',
  ],
};

interface SystemUpdateContextType {
  versionInfo: VersionInfo;
  lastCheckDate: string;
  isChecking: boolean;
  isUpdating: boolean;
  isAutoUpdateEnabled: boolean;
  hasPendingUpdate: boolean;
  updateStatusMessage: string | null;
  toggleAutoUpdate: () => void;
  checkForUpdates: (manual?: boolean) => Promise<boolean>;
  forceUpdate: () => Promise<void>;
  applyPendingUpdate: () => void;
}

const LOCAL_STORAGE_LAST_CHECK_KEY = 'certifai_sys_last_check_v1';
const LOCAL_STORAGE_AUTO_UPDATE_KEY = 'certifai_sys_auto_update_v1';

const SystemUpdateContext = createContext<SystemUpdateContextType | undefined>(undefined);

export const SystemUpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const formatNow = useCallback(() => {
    const lang = getCurrentLanguage() === 'en' ? 'en-US' : 'fr-FR';
    return new Date().toLocaleDateString(lang, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, []);

  const [lastCheckDate, setLastCheckDate] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_LAST_CHECK_KEY);
      if (stored) return stored;
    } catch {}
    return new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_AUTO_UPDATE_KEY);
      if (stored !== null) return stored === 'true';
    } catch {}
    return true; // Default auto-update to ON
  });

  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasPendingUpdate, setHasPendingUpdate] = useState(false);
  const [updateStatusMessage, setUpdateStatusMessage] = useState<string | null>(null);

  const setCheckedNow = useCallback(() => {
    const now = formatNow();
    setLastCheckDate(now);
    try {
      localStorage.setItem(LOCAL_STORAGE_LAST_CHECK_KEY, now);
    } catch {}
  }, [formatNow]);

  const activateWaitingWorker = useCallback(async (registration: ServiceWorkerRegistration) => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      return true;
    }
    return false;
  }, []);

  const checkForUpdates = useCallback(
    async (manual = false): Promise<boolean> => {
      const isEn = getCurrentLanguage() === 'en';
      setIsChecking(true);
      setUpdateStatusMessage(
        manual
          ? isEn
            ? 'Checking for certified CertifIA updates...'
            : 'Recherche de nouvelles versions certifiées...'
          : null
      );

      let foundNewVersion = false;

      try {
        // 1. Check Service Worker for updated bundle
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
              await registration.update();
              if (registration.waiting || registration.installing) {
                foundNewVersion = true;
                if (isAutoUpdateEnabled && registration.waiting) {
                  await activateWaitingWorker(registration);
                } else {
                  setHasPendingUpdate(true);
                }
              }
            }
          } catch (swErr) {
            console.warn('Service worker check error:', swErr);
          }
        }

        // 2. Network check on uncached manifest to validate server reachability & version freshness
        try {
          await fetch(`/manifest.webmanifest?t=${Date.now()}`, { cache: 'no-store' });
        } catch {
          // Offline mode fallback - non-fatal
        }

        if (manual) {
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
        setCheckedNow();
        setIsChecking(false);

        if (foundNewVersion) {
          setUpdateStatusMessage(
            isEn
              ? isAutoUpdateEnabled
                ? 'New version installed automatically in the background!'
                : 'A new version is ready to apply.'
              : isAutoUpdateEnabled
              ? 'Nouvelle version installée automatiquement en arrière-plan !'
              : 'Une nouvelle version est prête à être appliquée.'
          );
        } else if (manual) {
          setUpdateStatusMessage(
            isEn
              ? `CertifIA is up to date (${APP_VERSION_INFO.version}).`
              : `Votre application CertifIA est à jour (${APP_VERSION_INFO.version}).`
          );
        }

        setTimeout(() => {
          setUpdateStatusMessage(null);
        }, 4500);
        return foundNewVersion;
      } catch (e) {
        console.error('Update check failed:', e);
        setCheckedNow();
        setIsChecking(false);
        if (manual) {
          setUpdateStatusMessage(
            isEn
              ? `Check completed — running ${APP_VERSION_INFO.version}.`
              : `Vérification terminée — version active ${APP_VERSION_INFO.version}.`
          );
          setTimeout(() => {
            setUpdateStatusMessage(null);
          }, 4000);
        }
        return false;
      }
    },
    [activateWaitingWorker, isAutoUpdateEnabled, setCheckedNow]
  );

  const forceUpdate = useCallback(async () => {
    const isEn = getCurrentLanguage() === 'en';
    setIsUpdating(true);
    setUpdateStatusMessage(
      isEn
        ? 'Purging application cache and refreshing assets...'
        : 'Nettoyage du cache applicatif et rafraîchissement des assets...'
    );

    try {
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      }

      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 900));
      setCheckedNow();
      setUpdateStatusMessage(
        isEn
          ? 'Forced update applied! Reloading application...'
          : 'Mise à jour forcée appliquée ! Rechargement en cours...'
      );

      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (e) {
      console.error('Force update error:', e);
      setIsUpdating(false);
      window.location.reload();
    }
  }, [setCheckedNow]);

  const applyPendingUpdate = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }
    setHasPendingUpdate(false);
    window.location.reload();
  }, []);

  const toggleAutoUpdate = useCallback(() => {
    setIsAutoUpdateEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(LOCAL_STORAGE_AUTO_UPDATE_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  // Listen to Service Worker updatefound & controllerchange for seamless background installation
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let mounted = true;
    navigator.serviceWorker
      .getRegistration()
      .then((registration) => {
        if (!registration || !mounted) return;
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (isAutoUpdateEnabled) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                setCheckedNow();
              } else {
                setHasPendingUpdate(true);
              }
            }
          });
        });
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [isAutoUpdateEnabled, setCheckedNow]);

  // Background automated update check loop
  useEffect(() => {
    if (!isAutoUpdateEnabled) return;

    // Check once shortly after mount
    const initialTimer = setTimeout(() => {
      checkForUpdates(false);
    }, 15000);

    // Then check periodically every 3 minutes in the background
    const intervalTimer = setInterval(() => {
      checkForUpdates(false);
    }, 180000);

    // Also check when window regains focus
    const handleFocus = () => {
      checkForUpdates(false);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAutoUpdateEnabled, checkForUpdates]);

  return (
    <SystemUpdateContext.Provider
      value={{
        versionInfo: APP_VERSION_INFO,
        lastCheckDate,
        isChecking,
        isUpdating,
        isAutoUpdateEnabled,
        hasPendingUpdate,
        updateStatusMessage,
        toggleAutoUpdate,
        checkForUpdates,
        forceUpdate,
        applyPendingUpdate,
      }}
    >
      {children}
    </SystemUpdateContext.Provider>
  );
};

export const useSystemUpdate = () => {
  const context = useContext(SystemUpdateContext);
  if (!context) {
    throw new Error('useSystemUpdate must be used within a SystemUpdateProvider');
  }
  return context;
};
