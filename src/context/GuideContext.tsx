import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface GuideContextType {
  isGuideModeActive: boolean;
  toggleGuideMode: () => void;
  setGuideMode: (active: boolean) => void;
  isLegalModalOpen: boolean;
  openLegalModal: () => void;
  closeLegalModal: () => void;
  hasAcceptedLegal: boolean;
  acceptLegal: () => void;
  isHelpModalOpen: boolean;
  openHelpModal: (screenKey?: string) => void;
  closeHelpModal: () => void;
  activeScreenForHelp: string | null;
}

const LOCAL_STORAGE_GUIDE_KEY = 'certifai_guide_mode_v1';
const LOCAL_STORAGE_LEGAL_KEY = 'certifai_legal_accepted_v1';

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export const GuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGuideModeActive, setIsGuideModeActive] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_GUIDE_KEY);
      if (stored !== null) return stored === 'true';
    } catch {}
    return true; // Active by default for novice clarity
  });

  const [hasAcceptedLegal, setHasAcceptedLegal] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_LEGAL_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(() => {
    try {
      // If legal terms not yet accepted, open onboarding automatically
      return localStorage.getItem(LOCAL_STORAGE_LEGAL_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [activeScreenForHelp, setActiveScreenForHelp] = useState<string | null>(null);

  const toggleGuideMode = useCallback(() => {
    setIsGuideModeActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(LOCAL_STORAGE_GUIDE_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  const setGuideMode = useCallback((active: boolean) => {
    setIsGuideModeActive(active);
    try {
      localStorage.setItem(LOCAL_STORAGE_GUIDE_KEY, String(active));
    } catch {}
  }, []);

  const openLegalModal = useCallback(() => setIsLegalModalOpen(true), []);
  const closeLegalModal = useCallback(() => setIsLegalModalOpen(false), []);

  const acceptLegal = useCallback(() => {
    setHasAcceptedLegal(true);
    setIsLegalModalOpen(false);
    try {
      localStorage.setItem(LOCAL_STORAGE_LEGAL_KEY, 'true');
    } catch {}
  }, []);

  const openHelpModal = useCallback((screenKey?: string) => {
    if (screenKey) setActiveScreenForHelp(screenKey);
    setIsHelpModalOpen(true);
  }, []);

  const closeHelpModal = useCallback(() => {
    setIsHelpModalOpen(false);
  }, []);

  return (
    <GuideContext.Provider
      value={{
        isGuideModeActive,
        toggleGuideMode,
        setGuideMode,
        isLegalModalOpen,
        openLegalModal,
        closeLegalModal,
        hasAcceptedLegal,
        acceptLegal,
        isHelpModalOpen,
        openHelpModal,
        closeHelpModal,
        activeScreenForHelp,
      }}
    >
      {children}
    </GuideContext.Provider>
  );
};

export const useGuide = () => {
  const context = useContext(GuideContext);
  if (!context) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
};
