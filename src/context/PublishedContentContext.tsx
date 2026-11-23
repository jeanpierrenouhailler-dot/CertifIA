import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { OfficialCertStatus, PublishedContentOverride } from '../types/audit';
import { loadPublishedOverridesPublic } from '../services/audit/auditPersistenceService';

export interface CertLifecycleNotice {
  officialStatus: OfficialCertStatus;
  retirementDate?: string;
  changeAlert?: string;
  officialUrl?: string;
}

interface PublishedContentContextType {
  overrides: Record<string, PublishedContentOverride>;
  refreshPublishedOverrides: () => Promise<void>;
  getCertLifecycleNotice: (certId: string) => CertLifecycleNotice | null;
  getPublishedPatch: <T extends Record<string, unknown>>(contentId: string, base: T) => T;
}

const PublishedContentContext = createContext<PublishedContentContextType | undefined>(undefined);

export const PublishedContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overrides, setOverrides] = useState<Record<string, PublishedContentOverride>>({});

  const refreshPublishedOverrides = useCallback(async () => {
    const map = await loadPublishedOverridesPublic();
    setOverrides(map);
  }, []);

  useEffect(() => {
    refreshPublishedOverrides().catch(() => {});
  }, [refreshPublishedOverrides]);

  const getCertLifecycleNotice = useCallback(
    (certId: string): CertLifecycleNotice | null => {
      const ov = overrides[`cert_status:${certId}`] || overrides[`cert:${certId}`];
      if (!ov || !ov.patchJson) return null;
      try {
        const parsed = JSON.parse(ov.patchJson) as Partial<CertLifecycleNotice>;
        if (!parsed.officialStatus || parsed.officialStatus === 'active') {
          return parsed.changeAlert
            ? {
                officialStatus: parsed.officialStatus || 'active',
                changeAlert: parsed.changeAlert,
                retirementDate: parsed.retirementDate,
                officialUrl: parsed.officialUrl,
              }
            : null;
        }
        return {
          officialStatus: parsed.officialStatus,
          retirementDate: parsed.retirementDate,
          changeAlert: parsed.changeAlert,
          officialUrl: parsed.officialUrl,
        };
      } catch {
        return null;
      }
    },
    [overrides]
  );

  const getPublishedPatch = useCallback(
    <T extends Record<string, unknown>>(contentId: string, base: T): T => {
      const ov = overrides[contentId];
      if (!ov || !ov.patchJson || ov.isArchived) return base;
      try {
        const parsed = JSON.parse(ov.patchJson) as Record<string, unknown>;
        return { ...base, ...parsed };
      } catch {
        return base;
      }
    },
    [overrides]
  );

  return (
    <PublishedContentContext.Provider
      value={{
        overrides,
        refreshPublishedOverrides,
        getCertLifecycleNotice,
        getPublishedPatch,
      }}
    >
      {children}
    </PublishedContentContext.Provider>
  );
};

export const usePublishedContent = () => {
  const ctx = useContext(PublishedContentContext);
  if (!ctx) {
    throw new Error('usePublishedContent must be used within a PublishedContentProvider');
  }
  return ctx;
};
