import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BhumiDishaLogo } from './BhumiDishaLogo';
import { X, Eye, EyeOff, UserCheck, ArrowRight, User, Building, Smartphone, Mail, Lock } from 'lucide-react';

export const SimulatedAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    judgeDemoLogin,
    setIsLoggedIn,
    setActiveTab,
    showToast,
    locale,
    t,
  } = useApp();

  const isBn = locale === 'bn';
  const isRegister = authModalMode === 'register';

  const [authRole, setAuthRole] = useState<'citizen' | 'institution'>('citizen');
  const [authMethod, setAuthMethod] = useState<'mobile' | 'email'>('mobile');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    if (isAuthModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister && !name.trim()) {
      setErrorMsg(isBn ? 'আপনার পূর্ণ নাম প্রদান করুন' : 'Please enter your full name');
      return;
    }

    if (!contact.trim()) {
      setErrorMsg(
        authMethod === 'mobile'
          ? isBn
            ? 'মোবাইল নম্বর প্রদান করুন'
            : 'Please enter your mobile number'
          : isBn
          ? 'ইমেইল ঠিকানা প্রদান করুন'
          : 'Please enter your email address'
      );
      return;
    }

    if (password.length < 6) {
      setErrorMsg(isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setErrorMsg(isBn ? 'পাসওয়ার্ড দুটি মেলেনি' : 'Passwords do not match');
      return;
    }

    // Successful simulated authentication
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    closeAuthModal();
    showToast(isRegister ? t.authSuccessRegister : t.authSuccessLogin);
  };

  return (
    <div
      onClick={closeAuthModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md my-auto bg-white dark:bg-[#14241B] rounded-3xl shadow-2xl border border-[#D9E7DD] dark:border-[#233B2E] overflow-hidden text-[#202923] dark:text-[#E4EBE6]"
      >
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-[#EFF8F2] dark:border-[#1E3024] relative text-center">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1E3024] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-3">
            <BhumiDishaLogo size={48} />
          </div>

          <h2 className="text-xl font-bold text-[#126B3A] dark:text-[#38C172]">
            {isRegister ? t.authRegisterTitle : t.authLoginTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {t.tagline}
          </p>
        </div>

        {/* 1-Click Judge Demo Login */}
        <div className="px-6 pt-5">
          <button
            onClick={() => judgeDemoLogin('citizen')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#126B3A] hover:bg-[#0E542D] text-white font-bold text-xs shadow-md transition-all focus:ring-2 focus:ring-[#126B3A]"
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.authJudgeQuickLogin}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative px-6 my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
          </div>
          <div className="relative flex justify-center text-[11px] text-neutral-400 uppercase tracking-wider">
            <span className="bg-white dark:bg-[#14241B] px-3 font-semibold">
              {isBn ? 'অথবা নিজস্ব অ্যাকাউন্ট' : 'or with demo account'}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Role Segmented Switcher: Citizen vs Institution */}
          <div className="grid grid-cols-2 p-1 bg-[#EFF8F2] dark:bg-[#0D1812] rounded-xl border border-[#D9E7DD] dark:border-[#1E3024]">
            <button
              type="button"
              onClick={() => setAuthRole('citizen')}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authRole === 'citizen'
                  ? 'bg-white dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.authTabCitizen}</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthRole('institution')}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authRole === 'institution'
                  ? 'bg-white dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>{t.authTabInstitution}</span>
            </button>
          </div>

          {/* Full Name (if registering) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isBn ? 'পূর্ণ নাম' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.authNamePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs text-[#202923] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
              />
            </div>
          )}

          {/* Contact Input Toggle: Mobile vs Email */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {authMethod === 'mobile' ? t.authTypeMobile : t.authTypeEmail}
              </label>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <button
                  type="button"
                  onClick={() => setAuthMethod('mobile')}
                  className={`hover:text-[#126B3A] ${authMethod === 'mobile' ? 'text-[#126B3A] font-bold' : ''}`}
                >
                  {t.authTypeMobile}
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`hover:text-[#126B3A] ${authMethod === 'email' ? 'text-[#126B3A] font-bold' : ''}`}
                >
                  {t.authTypeEmail}
                </button>
              </div>
            </div>

            <div className="relative flex items-center">
              {authMethod === 'mobile' ? (
                <>
                  <div className="absolute left-3 text-neutral-400 flex items-center gap-1 font-mono text-xs font-semibold">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={t.authMobilePlaceholder}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs text-[#202923] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#126B3A] font-mono"
                  />
                </>
              ) : (
                <>
                  <div className="absolute left-3 text-neutral-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={t.authEmailPlaceholder}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs text-[#202923] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
                  />
                </>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {isBn ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-neutral-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.authPasswordPlaceholder}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs text-[#202923] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-neutral-400 hover:text-neutral-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (if registering) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.authConfirmPasswordPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs text-[#202923] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
              />
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg border border-red-200 dark:border-red-900/50">
              {errorMsg}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#198754] hover:bg-[#157347] text-white font-bold text-xs shadow-md transition-all focus:ring-2 focus:ring-[#198754]"
          >
            {isRegister ? t.authRegisterSubmit : t.authLoginSubmit}
          </button>

          {/* Toggle between Login and Registration */}
          <div className="text-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
            {isRegister ? (
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {isBn ? 'আগেই একাউন্ট করেছেন?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-bold text-[#126B3A] dark:text-[#38C172] hover:underline ml-1"
                >
                  {t.authHasAccount}
                </button>
              </p>
            ) : (
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {isBn ? 'নতুন ব্যবহারকারী?' : 'New to BhumiDisha?'}{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="font-bold text-[#126B3A] dark:text-[#38C172] hover:underline ml-1"
                >
                  {t.authNoAccount}
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
