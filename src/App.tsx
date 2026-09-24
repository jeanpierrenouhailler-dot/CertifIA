/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppScreen, CloudProvider } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CatalogueView } from './components/CatalogueView';
import { QuizView } from './components/QuizView';
import { FlashcardsView } from './components/FlashcardsView';
import { ExamView } from './components/ExamView';
import { AnalyticsView } from './components/AnalyticsView';
import { BlueprintDrawer } from './components/BlueprintDrawer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ProfileView } from './components/ProfileView';
import { certificationsData } from './data/certificationsData';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('catalogue');
  const [activeProviderFilter, setActiveProviderFilter] = useState<CloudProvider>('Tous');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [blueprintExamId, setBlueprintExamId] = useState<string | null>(null);

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
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsShortcutsOpen(true);
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
    <div className="min-h-screen bg-[#0f131d] text-[#dfe2f1] font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        activeProviderFilter={activeProviderFilter}
        onSelectProvider={(prov) => setActiveProviderFilter(prov)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenBlueprint={handleOpenBlueprint}
      />

      {/* Main Workspace (offset by 64 Tailwind spacing for lg sidebar) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <Header
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenBlueprint={handleOpenBlueprint}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 pb-16">
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
