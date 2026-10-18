import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthenticatedLayout } from './components/AuthenticatedLayout';
import { SimulatedAuthModal } from './components/SimulatedAuthModal';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { PrePurchaseVerificationPage } from './pages/PrePurchaseVerificationPage';
import { LandWalletPage } from './pages/LandWalletPage';
import { BhumiSathiPage } from './pages/BhumiSathiPage';
import { ProfilePage } from './pages/ProfilePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, isLoggedIn, toast } = useApp();

  // If the user is authenticated, ALWAYS render the AuthenticatedLayout with persistent sidebar.
  // The public homepage remains separate and unauthenticated without any sidebar.
  const showAuthenticatedLayout = isLoggedIn;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F9F5] dark:bg-[#0D1812] text-[#202923] dark:text-[#E4EBE6] transition-colors">
      {showAuthenticatedLayout ? (
        /* Authenticated Application Layout with persistent desktop sidebar (270px) & mobile drawer */
        <AuthenticatedLayout>
          {(activeTab === 'dashboard' || activeTab === 'home' || activeTab === 'services') && (
            <DashboardPage />
          )}
          {activeTab === 'verifier' && <PrePurchaseVerificationPage />}
          {activeTab === 'wallet' && <LandWalletPage />}
          {activeTab === 'assistant' && <BhumiSathiPage />}
          {activeTab === 'profile' && <ProfilePage initialSection="general" />}
          {activeTab === 'profile-verify' && <ProfilePage initialSection="verify" />}
          {activeTab === 'settings' && <ProfilePage initialSection="settings" />}
          {activeTab === 'faqs' && <HowItWorksPage initialSection="faqs" />}
          {activeTab === 'manuals' && <HowItWorksPage initialSection="manuals" />}
          {activeTab === 'how-it-works' && <HowItWorksPage />}
        </AuthenticatedLayout>
      ) : (
        /* Public Portal Layout with Public Navbar & Hero (No Sidebar) */
        <>
          <Navbar />
          <main className="flex-1">
            {activeTab === 'how-it-works' || activeTab === 'manuals' || activeTab === 'faqs' ? (
              <HowItWorksPage />
            ) : (
              <HomePage />
            )}
          </main>
          <Footer />
        </>
      )}

      {/* Simulated Authentication Modal */}
      <SimulatedAuthModal />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#126B3A] text-white text-xs font-semibold shadow-xl border border-emerald-400/30 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
