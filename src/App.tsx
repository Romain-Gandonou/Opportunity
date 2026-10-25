import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Opportunity } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { ReportModal } from './components/ReportModal';
import { AuthModal } from './components/AuthModal';

// Views
import { HomeView } from './views/HomeView';
import { CatalogueView } from './views/CatalogueView';
import { DashboardView } from './views/DashboardView';
import { AdminView } from './views/AdminView';
import { MethodologyView } from './views/MethodologyView';
import { ScamPreventionView } from './views/ScamPreventionView';
import { AboutView, HelpView, ContactView, PrivacyView, TermsView, ProfileView } from './views/InfoPages';

const MainAppContent: React.FC = () => {
  const { opportunities } = useApp();

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [reportOpportunity, setReportOpportunity] = useState<Opportunity | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Read URL parameters on mount (?view=catalogue, ?autostart=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const oppParam = params.get('opp');

    if (viewParam) {
      setCurrentView(viewParam);
    }
    if (oppParam) {
      const match = opportunities.find((o) => o.id === oppParam);
      if (match) setSelectedOpportunity(match);
    }
  }, [opportunities]);

  const handleNavigate = (view: string, categoryFilter?: string) => {
    setCurrentView(view);
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    } else {
      setSelectedCategory(undefined);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReportGeneral = () => {
    // If no specific opportunity, pick the first one or a default reference
    if (opportunities.length > 0) {
      setReportOpportunity(opportunities[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            onOpenReport={(opp) => setReportOpportunity(opp)}
          />
        )}

        {currentView === 'catalogue' && (
          <CatalogueView
            initialCategory={selectedCategory}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            onOpenReport={(opp) => setReportOpportunity(opp)}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'profile' && <ProfileView />}

        {currentView === 'admin' && <AdminView />}

        {currentView === 'methodology' && <MethodologyView />}

        {currentView === 'scam-prevention' && (
          <ScamPreventionView onOpenReportGeneral={handleOpenReportGeneral} />
        )}

        {currentView === 'about' && <AboutView />}

        {currentView === 'help' && <HelpView />}

        {currentView === 'contact' && <ContactView />}

        {currentView === 'privacy' && <PrivacyView />}

        {currentView === 'terms' && <TermsView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onOpenReport={(opp) => {
          setSelectedOpportunity(null);
          setReportOpportunity(opp);
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <ReportModal
        opportunity={reportOpportunity}
        onClose={() => setReportOpportunity(null)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
