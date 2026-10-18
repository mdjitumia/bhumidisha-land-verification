import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { BhumiDishaLogo } from './BhumiDishaLogo';
import {
  LayoutDashboard,
  User,
  Layers,
  HelpCircle,
  BookOpen,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  X,
  FileSearch,
  FolderLock,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, currentProfile, logout, locale, t } = useApp();
  const isBn = locale === 'bn';

  // State for inline expandable "ভূমি সেবাসমূহ" submodules
  const [isServicesExpanded, setIsServicesExpanded] = useState(
    ['verifier', 'wallet', 'assistant'].includes(activeTab)
  );

  // State for the accessible modal/popup requested for "ভূমি সেবাসমূহ"
  const [showServicesPopup, setShowServicesPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Auto-expand when on any of the 3 services
  useEffect(() => {
    if (['verifier', 'wallet', 'assistant'].includes(activeTab)) {
      setIsServicesExpanded(true);
    }
  }, [activeTab]);

  // Handle outside click & Escape key for the accessible Bhumi Services popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowServicesPopup(false);
        if (mobileOpen) onCloseMobile();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowServicesPopup(false);
      }
    };

    if (showServicesPopup) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showServicesPopup, mobileOpen, onCloseMobile]);

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setShowServicesPopup(false);
    onCloseMobile();
  };

  const handleServicesClick = () => {
    // Toggles the inline accordion and opens the accessible popup modal
    setIsServicesExpanded((prev) => !prev);
    setShowServicesPopup(true);
  };

  // Required Bengali-first 8 menu items in exact order:
  // 1. ড্যাশবোর্ড
  // 2. প্রোফাইল
  // 3. ভূমি সেবাসমূহ (with submodules)
  // 4. জিজ্ঞাসিত প্রশ্নাবলি
  // 5. নির্দেশিকা / ম্যানুয়াল
  // 6. প্রোফাইল যাচাই
  // 7. সেটিংস
  // 8. লগআউট
  const menuItems = [
    {
      id: 'dashboard',
      label: t.sideDashboard,
      icon: LayoutDashboard,
      active: activeTab === 'dashboard',
      onClick: () => handleNav('dashboard'),
    },
    {
      id: 'profile',
      label: t.sideProfile,
      icon: User,
      active: activeTab === 'profile',
      onClick: () => handleNav('profile'),
    },
    {
      id: 'services',
      label: t.sideServices,
      icon: Layers,
      active: ['verifier', 'wallet', 'assistant'].includes(activeTab),
      hasSubmenu: true,
      expanded: isServicesExpanded,
      onClick: handleServicesClick,
    },
    {
      id: 'faqs',
      label: t.sideFaq,
      icon: HelpCircle,
      active: activeTab === 'faqs',
      onClick: () => handleNav('faqs'),
    },
    {
      id: 'manuals',
      label: t.sideManuals,
      icon: BookOpen,
      active: activeTab === 'manuals' || activeTab === 'how-it-works',
      onClick: () => handleNav('manuals'),
    },
    {
      id: 'profile-verify',
      label: t.sideVerifyProfile,
      icon: ShieldCheck,
      active: activeTab === 'profile-verify',
      onClick: () => handleNav('profile-verify'),
    },
    {
      id: 'settings',
      label: t.sideSettings,
      icon: Settings,
      active: activeTab === 'settings',
      onClick: () => handleNav('settings'),
    },
    {
      id: 'logout',
      label: t.sideLogout,
      icon: LogOut,
      active: false,
      isLogout: true,
      onClick: () => {
        onCloseMobile();
        logout();
      },
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Persistent Desktop Sidebar (270px) & Mobile Responsive Drawer */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-[270px] bg-white dark:bg-[#111A15] border-r border-[#D9E7DD] dark:border-[#1E3024] p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 overflow-y-auto ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        aria-label="Authenticated Navigation Sidebar"
      >
        <div className="space-y-4">
          {/* Mobile Header with visible Close Button (X) */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-[#D9E7DD] dark:border-[#1E3024]">
            <div className="flex items-center gap-2">
              <BhumiDishaLogo size={28} />
              <div className="leading-tight">
                <span className="font-bold text-sm text-[#126B3A] dark:text-[#38C172] block">
                  {t.brandName}
                </span>
                <span className="text-[10px] text-[#66736B] dark:text-[#9FB0A5] block">
                  {t.brandEnglishName}
                </span>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1A3024] transition-colors"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Generic Account Entry (No fictional names or phone numbers) */}
          <div className="px-3.5 py-2.5 rounded-xl bg-[#EFF8F2] dark:bg-[#15241C] border border-[#D9E7DD] dark:border-[#233B2E] flex items-center gap-2.5 text-xs text-[#202923] dark:text-[#E4EBE6]">
            <div className="w-7 h-7 rounded-lg bg-[#126B3A] text-white flex items-center justify-center shrink-0">
              <User className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div className="overflow-hidden min-w-0">
              <span className="font-semibold text-xs block text-[#126B3A] dark:text-[#38C172]">
                {isBn ? 'ব্যবহারকারী অ্যাকাউন্ট' : 'User Account'}
              </span>
              <span className="text-[10px] text-[#66736B] dark:text-[#9FB0A5] block">
                {isBn ? 'লগইন সেশন সক্রিয়' : 'Session Active'}
              </span>
            </div>
          </div>

          {/* 8 Required Bengali-First Navigation Menu Items */}
          <nav className="space-y-1" aria-label="Main Navigation">
            {menuItems.map((item) => {
              const Icon = item.icon;

              if (item.isLogout) {
                return (
                  <div key={item.id} className="pt-2 border-t border-[#D9E7DD] dark:border-[#1E3024] mt-2">
                    <button
                      onClick={item.onClick}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors group"
                    >
                      <Icon className="w-4 h-4 shrink-0 stroke-[1.8] group-hover:translate-x-0.5 transition-transform" />
                      <span>{item.label}</span>
                    </button>
                  </div>
                );
              }

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      item.active && !item.hasSubmenu
                        ? 'bg-[#126B3A] text-white shadow-xs'
                        : item.active && item.hasSubmenu
                        ? 'bg-[#EFF8F2] dark:bg-[#15241C] text-[#126B3A] dark:text-[#38C172] font-bold border border-[#D9E7DD] dark:border-[#233B2E]'
                        : 'text-[#46544C] dark:text-[#BAC7BE] hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024] hover:text-[#126B3A] dark:hover:text-[#38C172]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className="w-4 h-4 shrink-0 stroke-[1.8]" />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.hasSubmenu && (
                      <span className="p-0.5 text-neutral-400 shrink-0">
                        {item.expanded ? (
                          <ChevronDown className="w-4 h-4 text-[#126B3A] dark:text-[#38C172]" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </button>

                  {/* Expandable Submenu for "ভূমি সেবাসমূহ" (The 3 Core Modules) */}
                  {item.hasSubmenu && item.expanded && (
                    <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-[#D9E7DD] dark:border-[#1E3024] ml-4 animate-in fade-in slide-in-from-top-1 duration-150">
                      {/* Module 1 */}
                      <button
                        onClick={() => handleNav('verifier')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                          activeTab === 'verifier'
                            ? 'bg-[#126B3A] text-white font-bold shadow-2xs'
                            : 'text-[#46544C] dark:text-[#BAC7BE] hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024] hover:text-[#126B3A]'
                        }`}
                      >
                        <FileSearch className="w-3.5 h-3.5 shrink-0 stroke-[1.8]" />
                        <span className="truncate">{t.feature1Title}</span>
                      </button>

                      {/* Module 2 */}
                      <button
                        onClick={() => handleNav('wallet')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                          activeTab === 'wallet'
                            ? 'bg-[#126B3A] text-white font-bold shadow-2xs'
                            : 'text-[#46544C] dark:text-[#BAC7BE] hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024] hover:text-[#126B3A]'
                        }`}
                      >
                        <FolderLock className="w-3.5 h-3.5 shrink-0 stroke-[1.8]" />
                        <span className="truncate">{t.feature2Title}</span>
                      </button>

                      {/* Module 3 */}
                      <button
                        onClick={() => handleNav('assistant')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                          activeTab === 'assistant'
                            ? 'bg-[#126B3A] text-white font-bold shadow-2xs'
                            : 'text-[#46544C] dark:text-[#BAC7BE] hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024] hover:text-[#126B3A]'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 stroke-[1.8]" />
                        <span className="truncate">{t.feature3Title}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="pt-4 border-t border-[#D9E7DD] dark:border-[#1E3024] text-[11px] text-[#66736B] dark:text-[#9FB0A5] text-center">
          <p className="font-semibold text-[#126B3A] dark:text-[#38C172]">
            {t.brandName} v1.0
          </p>
          <p className="text-[10px] text-neutral-400 mt-0.5">
            {isBn ? 'লজিস্টিক ও ঝুঁকি স্ক্রিনিং প্রোটোটাইপ' : 'LandTech Prototype'}
          </p>
        </div>
      </aside>

      {/* ACCESSIBLE MODAL / POPUP FOR "ভূমি সেবাসমূহ" (Requirement 2: Bhumi Services Interaction) */}
      {showServicesPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="services-modal-title"
        >
          <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white dark:bg-[#14241B] rounded-3xl shadow-2xl border border-[#D9E7DD] dark:border-[#233B2E] overflow-hidden p-6 space-y-5 text-[#202923] dark:text-[#E4EBE6]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EFF8F2] dark:border-[#1E3024] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EFF8F2] dark:bg-[#1E3024] flex items-center justify-center text-[#126B3A] dark:text-[#38C172]">
                  <Layers className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 id="services-modal-title" className="text-base font-bold text-[#126B3A] dark:text-[#38C172]">
                    {t.sideServices}
                  </h3>
                  <p className="text-xs text-[#66736B] dark:text-[#9FB0A5]">
                    {isBn ? 'আপনার প্রয়োজনীয় ভূমি সেবা নির্বাচন করুন:' : 'Select a core land service module:'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowServicesPopup(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1E3024] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Visually Distinct Module Options */}
            <div className="space-y-3">
              {/* Option 1: Pre-Purchase Verification */}
              <div
                onClick={() => handleNav('verifier')}
                className="p-4 rounded-2xl border-2 border-emerald-500/30 hover:border-[#126B3A] bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#126B3A] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <FileSearch className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#126B3A] dark:text-[#38C172] truncate">
                      {t.feature1Title}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 shrink-0">
                      {isBn ? 'মডিউল ১' : 'Module 1'}
                    </span>
                  </div>
                  <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] mt-1 leading-relaxed line-clamp-2">
                    {t.feature1Desc}
                  </p>
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-[#126B3A] dark:text-[#38C172]">
                    <span>{t.feature1Action}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Option 2: Land Wallet */}
              <div
                onClick={() => handleNav('wallet')}
                className="p-4 rounded-2xl border-2 border-teal-500/30 hover:border-teal-600 bg-teal-50/40 dark:bg-teal-950/20 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <FolderLock className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-teal-800 dark:text-teal-300 truncate">
                      {t.feature2Title}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 shrink-0">
                      {isBn ? 'মডিউল ২' : 'Module 2'}
                    </span>
                  </div>
                  <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] mt-1 leading-relaxed line-clamp-2">
                    {t.feature2Desc}
                  </p>
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400">
                    <span>{t.feature2Action}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Option 3: BhumiSathi Assistant */}
              <div
                onClick={() => handleNav('assistant')}
                className="p-4 rounded-2xl border-2 border-amber-500/30 hover:border-amber-600 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 truncate">
                      {t.feature3Title}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 shrink-0">
                      {isBn ? 'মডিউল ৩' : 'Module 3'}
                    </span>
                  </div>
                  <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] mt-1 leading-relaxed line-clamp-2">
                    {t.feature3Desc}
                  </p>
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                    <span>{t.feature3Action}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
