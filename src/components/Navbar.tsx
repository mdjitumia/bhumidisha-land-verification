import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BhumiDishaLogo } from './BhumiDishaLogo';
import { Globe, Moon, Sun, UserCheck, Menu, X, LogIn, UserPlus } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    locale,
    toggleLocale,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    isLoggedIn,
    judgeDemoLogin,
    openAuthModal,
    t,
  } = useApp();

  const [publicMobileMenuOpen, setPublicMobileMenuOpen] = useState(false);

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setPublicMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111A15]/95 backdrop-blur-md border-b border-[#D9E7DD] dark:border-[#1E3024] transition-colors shadow-2xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Zone: Brand Logo & Title (Moved further toward the left edge) */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#126B3A] rounded-lg"
          >
            <BhumiDishaLogo size={36} />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#126B3A] dark:text-[#38C172]">
                {t.brandName}
              </span>
              <span className="text-xs font-normal text-[#66736B] dark:text-[#9FB0A5] hidden md:inline">
                | {t.brandEnglishName}
              </span>
            </div>
          </button>
        </div>

        {/* Center Zone: Clean Public Navigation Links (Visible on large desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#46544C] dark:text-[#BAC7BE]">
          <button
            onClick={() => handleNav('home')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'home'
                ? 'border-[#126B3A] text-[#126B3A] dark:border-[#38C172] dark:text-[#38C172]'
                : 'border-transparent hover:text-[#126B3A]'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => handleNav('how-it-works')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'how-it-works'
                ? 'border-[#126B3A] text-[#126B3A] dark:border-[#38C172] dark:text-[#38C172]'
                : 'border-transparent hover:text-[#126B3A]'
            }`}
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => handleNav('how-it-works')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'how-it-works'
                ? 'border-[#126B3A] text-[#126B3A] dark:border-[#38C172] dark:text-[#38C172]'
                : 'border-transparent hover:text-[#126B3A]'
            }`}
          >
            {t.navGuides}
          </button>
        </nav>

        {/* Right Zone: Controls (Language, Theme, Auth) with Responsive Spacing */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Language Switch */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-[#D9E7DD] dark:border-[#1E3024] bg-[#EFF8F2] dark:bg-[#14241B] text-[#126B3A] dark:text-[#38C172] hover:bg-[#E2F2E7] transition-colors whitespace-nowrap"
            title="Switch Language / ভাষা পরিবর্তন"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{locale === 'bn' ? 'বাং' : 'EN'}</span>
          </button>

          {/* Theme Toggle (Default Light) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[#D9E7DD] dark:border-[#1E3024] bg-[#EFF8F2] dark:bg-[#14241B] text-[#46544C] dark:text-[#BAC7BE] hover:text-[#126B3A] dark:hover:text-[#38C172] transition-colors"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>

          {/* Registration Button (Visible on medium+ screens) */}
          <button
            onClick={() => openAuthModal('register')}
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#126B3A] text-[#126B3A] dark:border-[#38C172] dark:text-[#38C172] hover:bg-[#EFF8F2] dark:hover:bg-[#14241B] transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.navRegister}</span>
          </button>

          {/* Login Button (Visible on sm+ screens) */}
          <button
            onClick={() => openAuthModal('login')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:border-[#126B3A] hover:text-[#126B3A] transition-colors whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t.navLogin}</span>
          </button>

          {/* Judge Demo 1-Click Button (Visible on sm+ screens) */}
          <button
            onClick={() => judgeDemoLogin('citizen')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#126B3A] hover:bg-[#0E542D] text-white shadow-xs transition-all whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.navJudgeDemo}</span>
            <span className="lg:hidden">{locale === 'bn' ? 'ডেমো প্রবেশ' : 'Judge Demo'}</span>
          </button>

          {/* Mobile & Tablet Drawer Trigger */}
          <button
            onClick={() => setPublicMobileMenuOpen(!publicMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-[#D9E7DD] dark:border-[#1E3024] text-[#46544C] dark:text-[#BAC7BE] hover:bg-[#EFF8F2] dark:hover:bg-[#14241B] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {publicMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Dropdown Drawer */}
      {publicMobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-5 border-t border-[#D9E7DD] dark:border-[#1E3024] bg-white dark:bg-[#111A15] space-y-2.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="space-y-1">
            <button
              onClick={() => handleNav('home')}
              className={`block w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'home'
                  ? 'bg-[#EFF8F2] text-[#126B3A] dark:bg-[#14241B] dark:text-[#38C172]'
                  : 'text-[#202923] dark:text-white hover:bg-[#EFF8F2]'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => handleNav('how-it-works')}
              className={`block w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'how-it-works'
                  ? 'bg-[#EFF8F2] text-[#126B3A] dark:bg-[#14241B] dark:text-[#38C172]'
                  : 'text-[#202923] dark:text-white hover:bg-[#EFF8F2]'
              }`}
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => handleNav('how-it-works')}
              className="block w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#202923] dark:text-white hover:bg-[#EFF8F2]"
            >
              {t.navGuides}
            </button>
          </nav>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setPublicMobileMenuOpen(false);
                openAuthModal('login');
              }}
              className="sm:hidden w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold text-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.navLogin}</span>
            </button>

            <button
              onClick={() => {
                setPublicMobileMenuOpen(false);
                openAuthModal('register');
              }}
              className="md:hidden w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#126B3A] text-[#126B3A] dark:border-[#38C172] dark:text-[#38C172] font-bold text-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.navRegister}</span>
            </button>

            <button
              onClick={() => {
                setPublicMobileMenuOpen(false);
                judgeDemoLogin('citizen');
              }}
              className="sm:hidden w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#126B3A] text-white font-bold text-xs shadow-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t.navJudgeDemo}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
