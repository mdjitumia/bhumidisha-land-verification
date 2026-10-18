import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldAlert,
  Edit2,
  KeyRound,
  CheckCircle,
  AlertCircle,
  Home,
  MapPin,
  Save,
} from 'lucide-react';

interface ProfilePageProps {
  initialSection?: 'general' | 'verify' | 'settings';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ initialSection = 'general' }) => {
  const { currentProfile, updateProfile, persona, setPersona, locale, t, showToast, theme, toggleTheme, toggleLocale } =
    useApp();
  const isBn = locale === 'bn';
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'verify' | 'settings'>(
    initialSection === 'settings' ? 'settings' : initialSection === 'verify' ? 'verify' : 'profile'
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nameBn: currentProfile.nameBn,
    nameEn: currentProfile.nameEn,
    presentAddressBn: currentProfile.presentAddressBn,
    presentAddressEn: currentProfile.presentAddressEn,
    permanentAddressBn: currentProfile.permanentAddressBn,
    permanentAddressEn: currentProfile.permanentAddressEn,
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleSimulatedVerification = (type: 'nid' | 'brn') => {
    showToast(
      isBn
        ? `সিমুলেটেড যাচাই সম্পন্ন — ডেমো মোডে কোনো সরকারি সংযোগ নেই`
        : `Simulated verification test completed (No live government API)`
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E7DD] dark:border-[#1E3024] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#126B3A] dark:text-[#38C172]">
            {t.profilePageTitle}
          </h1>
          <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] mt-1">
            {t.profileSubtitle}
          </p>
        </div>

        {/* Persona Switcher for Judge / Reviewer */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500">
            {isBn ? 'ভূমিকা রূপান্তর:' : 'Switch Role:'}
          </span>
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E]">
            <button
              onClick={() => setPersona('citizen')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                persona === 'citizen'
                  ? 'bg-[#126B3A] text-white'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {t.dashRoleCitizen}
            </button>
            <button
              onClick={() => setPersona('institution')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                persona === 'institution'
                  ? 'bg-[#126B3A] text-white'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {t.dashRoleInstitution}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs (Profile, Verification, Settings) */}
      <div className="flex items-center gap-2 border-b border-[#D9E7DD] dark:border-[#1E3024] pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-3.5 py-1.5 rounded-xl transition-colors ${
            activeSubTab === 'profile'
              ? 'bg-[#126B3A] text-white shadow-2xs'
              : 'text-[#46544C] dark:text-[#BAC7BE] hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024]'
          }`}
        >
          {t.sideProfile}
        </button>
        <button
          onClick={() => setActiveSubTab('verify')}
          className={`px-3.5 py-1.5 rounded-xl transition-colors ${
            activeSubTab === 'verify'
              ? 'bg-[#126B3A] text-white shadow-2xs'
              : 'text-[#46544C] dark:text-[#BAC7BE] hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024]'
          }`}
        >
          {t.sideVerifyProfile}
        </button>
        <button
          onClick={() => setActiveSubTab('settings')}
          className={`px-3.5 py-1.5 rounded-xl transition-colors ${
            activeSubTab === 'settings'
              ? 'bg-[#126B3A] text-white shadow-2xs'
              : 'text-[#46544C] dark:text-[#BAC7BE] hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024]'
          }`}
        >
          {t.sideSettings}
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <strong className="font-bold">{isBn ? 'গোপনীয়তা ও নিরাপত্তা সুরক্ষা:' : 'Privacy & Demo Notice:'}</strong>
          <p className="mt-0.5 leading-relaxed">{t.profileSafetyNotice}</p>
        </div>
      </div>

      {/* Main Profile Grid inspired by Land Portal Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white dark:bg-[#14241B] rounded-2xl border border-[#D9E7DD] dark:border-[#233B2E] p-6 shadow-xs">
        {/* Left Column (4 cols): Photo, Name, Badge, Verification Actions */}
        <div className="md:col-span-4 flex flex-col items-center text-center space-y-4 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-800 md:pr-6 pb-6 md:pb-0">
          {/* Avatar Silhouette */}
          <div className="w-28 h-28 rounded-2xl bg-[#EFF8F2] dark:bg-[#0D1812] border-2 border-[#D9E7DD] dark:border-[#233B2E] flex items-center justify-center text-[#126B3A] dark:text-[#38C172]">
            <User className="w-16 h-16 stroke-1" />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#202923] dark:text-white">
              {isBn ? currentProfile.nameBn : currentProfile.nameEn}
            </h2>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              {currentProfile.mobileMasked}
            </p>
          </div>

          {/* Red Unverified Badge */}
          <div className="w-full py-2 px-3 rounded-xl bg-red-600 text-white font-bold text-xs tracking-wide">
            {t.profileUnverifiedBadge}
          </div>

          {/* Simulated Verification Card */}
          <div className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-[#0D1812] border border-neutral-200 dark:border-neutral-800 text-left space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              {isBn ? 'সিমুলেটেড পরিচিতি যাচাই' : 'Simulated Verification'}
            </span>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-700 dark:text-neutral-300">
                {isBn ? 'জাতীয় পরিচয়পত্র' : 'National ID'}
              </span>
              <button
                onClick={() => handleSimulatedVerification('nid')}
                className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[11px] hover:bg-blue-700 transition-colors"
              >
                {isBn ? 'যাচাই করুন' : 'Verify'}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-700 dark:text-neutral-300">
                {isBn ? 'জন্ম নিবন্ধন নং' : 'Birth Certificate'}
              </span>
              <button
                onClick={() => handleSimulatedVerification('brn')}
                className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[11px] hover:bg-blue-700 transition-colors"
              >
                {isBn ? 'যাচাই করুন' : 'Verify'}
              </button>
            </div>
          </div>

          <button
            onClick={() =>
              showToast(isBn ? 'পাসওয়ার্ড পরিবর্তন ডেমো ফাংশন' : 'Password change demo dialog')
            }
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#126B3A] text-white text-xs font-semibold hover:bg-[#0E542D] transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{t.profileChangePassBtn}</span>
          </button>
        </div>

        {/* Right Column (8 cols): Information Fields & Addresses */}
        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <h3 className="text-sm font-bold text-[#126B3A] dark:text-[#38C172]">
              {isBn ? 'ব্যক্তিগত তথ্য বিবরণী' : 'Personal Information Ledger'}
            </h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#126B3A] text-[#126B3A] dark:text-[#38C172] text-xs font-semibold hover:bg-[#EFF8F2]"
              >
                <Edit2 className="w-3 h-3" />
                <span>{t.profileEditBtn}</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#126B3A] text-white text-xs font-semibold hover:bg-[#0E542D]"
              >
                <Save className="w-3 h-3" />
                <span>{t.profileSaveBtn}</span>
              </button>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 block">{t.profileNameLabel}</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border text-xs"
                />
              ) : (
                <span className="font-semibold">{currentProfile.nameBn}</span>
              )}
            </div>

            <div>
              <span className="text-neutral-500 block">{t.profileNameEnLabel}</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border text-xs"
                />
              ) : (
                <span className="font-semibold font-mono">{currentProfile.nameEn}</span>
              )}
            </div>

            <div>
              <span className="text-neutral-500 block">{t.profileMobileLabel}</span>
              <span className="font-mono font-semibold">{currentProfile.mobileMasked}</span>
            </div>

            <div>
              <span className="text-neutral-500 block">{t.profileEmailLabel}</span>
              <span className="font-mono">{currentProfile.emailMasked}</span>
            </div>

            <div>
              <span className="text-neutral-500 block">{t.profileFatherLabel}</span>
              <span>{isBn ? currentProfile.fatherNameBn : currentProfile.fatherNameEn}</span>
            </div>

            <div>
              <span className="text-neutral-500 block">{t.profileMotherLabel}</span>
              <span>{isBn ? currentProfile.motherNameBn : currentProfile.motherNameEn}</span>
            </div>

            <div>
              <span className="text-neutral-500 block">{t.profileNidLabel}</span>
              <span className="font-mono font-semibold text-neutral-400">
                {currentProfile.nidMasked}
              </span>
            </div>

            <div>
              <span className="text-neutral-500 block">{t.profileBirthLabel}</span>
              <span className="font-mono font-semibold text-neutral-400">
                {currentProfile.birthRegMasked}
              </span>
            </div>
          </div>

          {/* Address Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Present Address */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0D1812] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#126B3A] dark:text-[#38C172]">
                <Home className="w-3.5 h-3.5" />
                <span>{t.profilePresentAddress}</span>
              </div>
              {isEditing ? (
                <textarea
                  value={isBn ? formData.presentAddressBn : formData.presentAddressEn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [isBn ? 'presentAddressBn' : 'presentAddressEn']: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border text-xs"
                  rows={2}
                />
              ) : (
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {isBn ? currentProfile.presentAddressBn : currentProfile.presentAddressEn}
                </p>
              )}
            </div>

            {/* Permanent Address */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0D1812] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#126B3A] dark:text-[#38C172]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{t.profilePermanentAddress}</span>
              </div>
              {isEditing ? (
                <textarea
                  value={isBn ? formData.permanentAddressBn : formData.permanentAddressEn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [isBn ? 'permanentAddressBn' : 'permanentAddressEn']: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border text-xs"
                  rows={2}
                />
              ) : (
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {isBn ? currentProfile.permanentAddressBn : currentProfile.permanentAddressEn}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
