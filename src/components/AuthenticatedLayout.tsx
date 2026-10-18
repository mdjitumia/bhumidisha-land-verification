import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from './Sidebar';
import { BhumiDishaLogo } from './BhumiDishaLogo';
import {
  Menu,
  Globe,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    locale,
    toggleLocale,
    theme,
    toggleTheme,
    persona,
    setPersona,
    currentProfile,
    logout,
    t,
  } = useApp();

  const isBn = locale === 'bn';
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Tab Title helper for breadcrumb in compact header
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return t.sideDashboard;
      case 'verifier':
        return t.feature1Title;
      case 'wallet':
        return t.feature2Title;
      case 'assistant':
        return t.feature3Title;
      case 'profile':
        return t.sideProfile;
      case 'faqs':
        return t.sideFaq;
      case 'manuals':
      case 'how-it-works':
        return t.sideManuals;
      case 'profile-verify':
        return t.sideVerifyProfile;
      case 'settings':
        return t.sideSettings;
      default:
        return t.sideDashboard;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9F5] dark:bg-[#0D1812] text-[#202923] dark:text-[#E4EBE6] transition-colors">
      {/* 1. COMPACT TOP HEADER */}
      <header className="sticky top-0 z-30 h-16 bg-white dark:bg-[#111A15] border-b border-[#D9E7DD] dark:border-[#1E3024] shadow-2xs transition-colors">
        <div className="w-full px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Left: Mobile Drawer Trigger + Brand Logo + Section Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024] transition-colors focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
              aria-label={isBn ? 'মেনু খুলুন' : 'Open navigation drawer'}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo & Name */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#126B3A] rounded-lg"
            >
              <BhumiDishaLogo size={34} />
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold tracking-tight text-[#126B3A] dark:text-[#38C172]">
                  {t.brandName}
                </span>
                <span className="text-xs text-[#66736B] dark:text-[#9FB0A5] hidden md:inline">
                  | {t.brandEnglishName}
                </span>
              </div>
            </button>

            {/* Breadcrumb separator & active tab indicator on desktop */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#66736B] dark:text-[#9FB0A5] pl-2 border-l border-[#D9E7DD] dark:border-[#1E3024]">
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-[#202923] dark:text-white">
                {getTabTitle(activeTab)}
              </span>
            </div>
          </div>

          {/* Right: Controls (Persona pill, Language, Theme, Logout) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Persona Switcher Pill */}
            <button
              onClick={() => setPersona(persona === 'citizen' ? 'institution' : 'citizen')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#D9E7DD] dark:border-[#1E3024] bg-[#EFF8F2] dark:bg-[#14241B] text-[#126B3A] dark:text-[#38C172] text-xs font-semibold hover:bg-[#E2F2E7] dark:hover:bg-[#1A3024] transition-colors"
              title={isBn ? 'ভূমিকা রূপান্তর করুন' : 'Switch persona role'}
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-none">
                {persona === 'institution' ? t.dashRoleInstitution : t.dashRoleCitizen}
              </span>
            </button>

            {/* Language Switch */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#D9E7DD] dark:border-[#1E3024] bg-white dark:bg-[#14241B] text-[#202923] dark:text-[#E4EBE6] text-xs font-semibold hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024] transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-[#126B3A]" />
              <span>{locale === 'bn' ? 'বাং' : 'EN'}</span>
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[#D9E7DD] dark:border-[#1E3024] bg-white dark:bg-[#14241B] text-[#202923] dark:text-[#E4EBE6] hover:text-[#126B3A] dark:hover:text-[#38C172] hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024] transition-colors"
              title={theme === 'dark' ? (isBn ? 'লাইট মোডে যান' : 'Switch to Light Mode') : (isBn ? 'ডার্ক মোডে যান' : 'Switch to Dark Mode')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-600" />
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              title={t.sideLogout}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.sideLogout}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. PERSISTENT LEFT SIDEBAR (Desktop: 260px fixed width; Mobile: Drawer) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 3. MAIN CONTENT AREA (Offset by 270px on desktop with lg:pl-[270px]) */}
      <div className="lg:pl-[270px] flex flex-col min-h-[calc(100vh-4rem)] transition-all min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Compact Authenticated Footer */}
        <footer className="border-t border-[#D9E7DD] dark:border-[#1E3024] bg-white dark:bg-[#111A15] px-6 py-4 text-center text-xs text-[#66736B] dark:text-[#9FB0A5]">
          <p>
            {isBn
              ? 'ভূমিদিশা (BhumiDisha) — ডেমো প্রোটোটাইপ। উপস্থাপিত সকল তথ্য সিন্থেটিক ও কাল্পনিক।'
              : 'BhumiDisha Prototype — All data presented is synthetic for demonstration purposes.'}
          </p>
        </footer>
      </div>
    </div>
  );
};
