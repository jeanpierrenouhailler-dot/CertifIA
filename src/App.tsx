/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppScreen, CloudProvider } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TodayView } from './components/TodayView';
import { RecommendationView } from './components/RecommendationView';
import { CatalogueView } from './components/CatalogueView';
import { QuizView } from './components/QuizView';
import { FlashcardsView } from './components/FlashcardsView';
import { ExamView } from './components/ExamView';
import { AnalyticsView } from './components/AnalyticsView';
import { BlueprintDrawer } from './components/BlueprintDrawer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ProfileView } from './components/ProfileView';
import { CategorizedHamburgerMenu } from './components/CategorizedHamburgerMenu';
import { SystemSettingsModal } from './components/SystemSettingsModal';
import { LegalOnboardingModal } from './components/LegalOnboardingModal';
import { InstallAppModal } from './components/InstallAppModal';
import { certificationsData } from './data/certificationsData';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { SystemUpdateProvider } from './context/SystemUpdateContext';
import { GuideProvider, useGuide } from './context/GuideContext';
import { PwaProvider, usePwa } from './context/PwaContext';

export default function App() {
  return (
    <ThemeProvider>
      <SystemUpdateProvider>
        <GuideProvider>
          <PwaProvider>
            <AuthProvider>
              <ProgressProvider>
                <AppContent />
              </ProgressProvider>
            </AuthProvider>
          </PwaProvider>
        </GuideProvider>
      </SystemUpdateProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('today');
  const [activeProviderFilter, setActiveProviderFilter] = useState<CloudProvider>('Tous');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false);
  const [blueprintExamId, setBlueprintExamId] = useState<string | null>(null);

  const { isLegalModalOpen, closeLegalModal, acceptLegal, hasAcceptedLegal } = useGuide();
  const { isInstallModalOpen, closeInstallModal } = usePwa();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setBlueprintExamId(null);
        setIsMobileSidebarOpen(false);
        setIsHamburgerOpen(false);
        setIsSystemSettingsOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsHamburgerOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenBlueprint = (certId: string) => {
    setBlueprintExamId(certId);
  };

  const handleStartTrainingFromBlueprint = (certId: string) => {
    setBlueprintExamId(null);
    if (certId === 'aifc01') {
      setCurrentScreen('exam');
    } else {
      setCurrentScreen('quiz');
    }
  };

  const selectedBlueprintCert = certificationsData.find((c) => c.id === blueprintExamId) || null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0f131d] dark:text-[#dfe2f1] font-sans selection:bg-blue-500/30 selection:text-blue-600 dark:selection:text-blue-200 transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        activeProviderFilter={activeProviderFilter}
        onSelectProvider={(prov) => setActiveProviderFilter(prov)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenBlueprint={handleOpenBlueprint}
        onOpenHamburgerMenu={() => setIsHamburgerOpen(true)}
        onOpenSystemSettings={() => setIsSystemSettingsOpen(true)}
        onOpenLegalModal={() => {
          // Open legal modal manually
          closeLegalModal();
          setTimeout(() => {
            // trigger open
            window.dispatchEvent(new CustomEvent('open-legal-modal'));
          }, 50);
        }}
      />

      {/* Main Workspace (offset by 64 Tailwind spacing for lg sidebar) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <Header
          onOpenHamburgerMenu={() => setIsHamburgerOpen(true)}
          onOpenSystemSettings={() => setIsSystemSettingsOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenBlueprint={handleOpenBlueprint}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 pb-16">
          {currentScreen === 'today' && (
            <TodayView
              onNavigate={(screen) => setCurrentScreen(screen)}
              onOpenBlueprint={handleOpenBlueprint}
            />
          )}

          {currentScreen === 'recommendation' && (
            <RecommendationView
              onNavigate={(screen) => setCurrentScreen(screen)}
              onOpenBlueprint={handleOpenBlueprint}
            />
          )}

          {currentScreen === 'catalogue' && (
            <CatalogueView
              onNavigate={(screen) => setCurrentScreen(screen)}
              onOpenBlueprint={handleOpenBlueprint}
              initialProviderFilter={activeProviderFilter}
            />
          )}

          {currentScreen === 'quiz' && (
            <QuizView
              onNavigate={(screen) => setCurrentScreen(screen)}
              onOpenBlueprint={handleOpenBlueprint}
            />
          )}

          {currentScreen === 'flashcards' && (
            <FlashcardsView
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'exam' && (
            <ExamView
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'analytics' && (
            <AnalyticsView
              onNavigate={(screen) => setCurrentScreen(screen)}
              onOpenBlueprint={handleOpenBlueprint}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileView
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}
        </main>
      </div>

      {/* Categorized Hamburger Menu Drawer */}
      <CategorizedHamburgerMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenSystemSettings={() => setIsSystemSettingsOpen(true)}
        onOpenBlueprint={handleOpenBlueprint}
      />

      {/* System Settings & Updates Modal */}
      <SystemSettingsModal
        isOpen={isSystemSettingsOpen}
        onClose={() => setIsSystemSettingsOpen(false)}
      />

      {/* Legal Onboarding & Disclaimer Modal (Mandatory on 1st visit, revisitable anytime) */}
      <LegalOnboardingModal
        isOpen={isLegalModalOpen}
        onClose={closeLegalModal}
        onAccept={acceptLegal}
        isMandatoryFirstTime={!hasAcceptedLegal}
      />

      {/* PWA Installation Instructions Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={closeInstallModal}
      />

      {/* Slide-over Blueprint Drawer */}
      <BlueprintDrawer
        certification={selectedBlueprintCert}
        isOpen={Boolean(blueprintExamId)}
        onClose={() => setBlueprintExamId(null)}
        onStartTraining={handleStartTrainingFromBlueprint}
      />

      {/* Shortcuts Cheat Sheet Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
