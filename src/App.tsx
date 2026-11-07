/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppScreen, CloudProvider } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { TodayView } from './components/TodayView';
import { RecommendationView } from './components/RecommendationView';
import { CatalogueView } from './components/CatalogueView';
import { QuizView } from './components/QuizView';
import { FlashcardsView } from './components/FlashcardsView';
import { ExamView } from './components/ExamView';
import { AnalyticsView } from './components/AnalyticsView';
import { AIAssistantView } from './components/AIAssistantView';
import { AIAssistantDrawer, AIAssistantContext } from './components/AIAssistantDrawer';
import { CertificationsComparatorModal } from './components/CertificationsComparatorModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { BlueprintDrawer } from './components/BlueprintDrawer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ProfileView } from './components/ProfileView';
import { CategorizedHamburgerMenu } from './components/CategorizedHamburgerMenu';
import { SystemSettingsModal } from './components/SystemSettingsModal';
import { LegalOnboardingModal } from './components/LegalOnboardingModal';
import { InstallAppModal } from './components/InstallAppModal';
import { FlashcardsDistributionModal, FlashcardCertId } from './components/FlashcardsDistributionModal';
import { GlossaryView } from './components/GlossaryView';
import { LandingPageView } from './components/LandingPageView';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false);
  const [isFlashcardsDistributionOpen, setIsFlashcardsDistributionOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isAIAssistantDrawerOpen, setIsAIAssistantDrawerOpen] = useState(false);
  const [aiAssistantContext, setAiAssistantContext] = useState<AIAssistantContext | null>(null);
  const [selectedFlashcardCert, setSelectedFlashcardCert] = useState<FlashcardCertId>('c1000177');
  const [blueprintExamId, setBlueprintExamId] = useState<string | null>(null);

  const { isLegalModalOpen, closeLegalModal, acceptLegal, hasAcceptedLegal } = useGuide();
  const { isInstallModalOpen, closeInstallModal } = usePwa();

  const handleSelectCertFlashcards = (certId: FlashcardCertId) => {
    setSelectedFlashcardCert(certId);
    setCurrentScreen('flashcards');
    setIsFlashcardsDistributionOpen(false);
  };

  const handleOpenAIAssistantWithContext = (context?: AIAssistantContext) => {
    setAiAssistantContext(context || null);
    setIsAIAssistantDrawerOpen(true);
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsCommandPaletteOpen(false);
        setIsComparatorOpen(false);
        setIsAIAssistantDrawerOpen(false);
        setBlueprintExamId(null);
        setIsMobileSidebarOpen(false);
        setIsHamburgerOpen(false);
        setIsSystemSettingsOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsHamburgerOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsAIAssistantDrawerOpen((prev) => !prev);
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

  if (currentScreen === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0e17] dark:text-[#dfe2f1] font-sans selection:bg-blue-500/30 selection:text-blue-600 dark:selection:text-blue-200 transition-colors duration-200">
        <LandingPageView
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenBlueprint={handleOpenBlueprint}
          onOpenAIAssistant={() => handleOpenAIAssistantWithContext()}
        />
        {blueprintExamId && selectedBlueprintCert && (
          <BlueprintDrawer
            certification={selectedBlueprintCert}
            isOpen={!!blueprintExamId}
            onClose={() => setBlueprintExamId(null)}
            onStartTraining={handleStartTrainingFromBlueprint}
          />
        )}
        <AIAssistantDrawer
          isOpen={isAIAssistantDrawerOpen}
          onClose={() => setIsAIAssistantDrawerOpen(false)}
          context={aiAssistantContext || undefined}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0f131d] dark:text-[#dfe2f1] font-sans selection:bg-blue-500/30 selection:text-blue-600 dark:selection:text-blue-200 transition-colors duration-200">
      {/* Sidebar Navigation (Collapsible Desktop + Mobile Drawer) */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        activeProviderFilter={activeProviderFilter}
        onSelectProvider={(prov) => setActiveProviderFilter(prov)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenBlueprint={handleOpenBlueprint}
        onOpenHamburgerMenu={() => setIsHamburgerOpen(true)}
        onOpenSystemSettings={() => setIsSystemSettingsOpen(true)}
        onOpenLegalModal={() => {
          closeLegalModal();
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-legal-modal'));
          }, 50);
        }}
        onOpenFlashcardsDistribution={() => setIsFlashcardsDistributionOpen(true)}
        onOpenComparator={() => setIsComparatorOpen(true)}
        onOpenAIAssistant={() => handleOpenAIAssistantWithContext()}
      />

      {/* Main Workspace (offset dynamically based on sidebar collapsed state) */}
      <div className={`flex flex-col min-h-screen transition-all duration-200 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        {/* Sticky Top Header */}
        <Header
          currentScreen={currentScreen}
          onOpenHamburgerMenu={() => setIsHamburgerOpen(true)}
          onOpenSystemSettings={() => setIsSystemSettingsOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenBlueprint={handleOpenBlueprint}
          onOpenAIAssistant={() => handleOpenAIAssistantWithContext()}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 pb-20 lg:pb-16">
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
              onOpenComparator={() => setIsComparatorOpen(true)}
              onOpenAIAssistant={(certId, certCode) =>
                handleOpenAIAssistantWithContext({ certId, certCode, topic: certCode })
              }
              initialProviderFilter={activeProviderFilter}
            />
          )}

          {currentScreen === 'quiz' && (
            <QuizView
              onNavigate={(screen) => setCurrentScreen(screen)}
              onOpenBlueprint={handleOpenBlueprint}
              onOpenAIAssistant={handleOpenAIAssistantWithContext}
            />
          )}

          {currentScreen === 'flashcards' && (
            <FlashcardsView
              initialCert={selectedFlashcardCert}
              onOpenDistributionModal={() => setIsFlashcardsDistributionOpen(true)}
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
              onOpenAIAssistant={handleOpenAIAssistantWithContext}
            />
          )}

          {currentScreen === 'assistant' && (
            <AIAssistantView
              onNavigate={(screen) => setCurrentScreen(screen)}
              onOpenBlueprint={handleOpenBlueprint}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileView
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'glossary' && (
            <GlossaryView
              onNavigate={(screen) => setCurrentScreen(screen)}
              onOpenBlueprint={handleOpenBlueprint}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenAIAssistant={() => handleOpenAIAssistantWithContext()}
        onOpenSystemSettings={() => setIsSystemSettingsOpen(true)}
        onOpenFlashcardsDistribution={() => setIsFlashcardsDistributionOpen(true)}
        onOpenComparator={() => setIsComparatorOpen(true)}
        onOpenMenu={() => setIsHamburgerOpen(true)}
      />

      {/* Contextual AI Pedagogical Assistant Slide-Over Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantDrawerOpen}
        onClose={() => setIsAIAssistantDrawerOpen(false)}
        context={aiAssistantContext}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenBlueprint={handleOpenBlueprint}
      />

      {/* Certifications Side-by-Side Comparator Modal */}
      <CertificationsComparatorModal
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenBlueprint={handleOpenBlueprint}
      />

      {/* Command Palette Global Search (Cmd+K / Ctrl+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenBlueprint={handleOpenBlueprint}
        onOpenComparator={() => setIsComparatorOpen(true)}
        onOpenAIAssistant={() => handleOpenAIAssistantWithContext()}
        onOpenSystemSettings={() => setIsSystemSettingsOpen(true)}
        onOpenFlashcardsDistribution={() => setIsFlashcardsDistributionOpen(true)}
      />

      {/* Categorized Hamburger Menu Drawer */}
      <CategorizedHamburgerMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenSystemSettings={() => setIsSystemSettingsOpen(true)}
        onOpenBlueprint={handleOpenBlueprint}
        onOpenFlashcardsDistribution={() => setIsFlashcardsDistributionOpen(true)}
        onSelectCertFlashcards={handleSelectCertFlashcards}
      />

      {/* Flashcards Distribution & Inventory Modal */}
      <FlashcardsDistributionModal
        isOpen={isFlashcardsDistributionOpen}
        onClose={() => setIsFlashcardsDistributionOpen(false)}
        onSelectCert={handleSelectCertFlashcards}
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
