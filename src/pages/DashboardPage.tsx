import React from 'react';
import { useApp } from '../context/AppContext';
import { VerifierLogo, WalletLogo, AssistantLogo } from '../components/ModuleIcons';
import {
  FileSearch,
  ArrowRight,
  Clock,
  UserCheck,
  CheckCircle2,
  FolderLock,
  MessageSquare,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentProfile, persona, setPersona, setActiveTab, locale, t } = useApp();
  const isBn = locale === 'bn';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#126B3A] dark:text-[#38C172]">
            {t.dashRoleLabel} {persona === 'institution' ? t.dashRoleInstitution : t.dashRoleCitizen}
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202923] dark:text-white mt-1">
            {t.dashWelcome} {isBn ? currentProfile.nameBn : currentProfile.nameEn}
          </h1>
          <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] mt-1 max-w-2xl leading-relaxed">
            {isBn
              ? 'ভূমিদিশা ডিজিটাল ড্যাশবোর্ড — প্রাক-লেনদেন ঝুঁকি স্ক্রিনিং, দাগভিত্তিক ভল্ট ও সহকারী সেবা এক নজরে পরিচালনা করুন।'
              : 'BhumiDisha Digital Dashboard — manage pre-transaction conflict screening, parcel vaults, and grounded assistance.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Switch Persona */}
          <button
            onClick={() => setPersona(persona === 'citizen' ? 'institution' : 'citizen')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-[#EFF8F2] dark:hover:bg-[#1E3024] transition-colors"
          >
            <UserCheck className="w-4 h-4 text-[#126B3A]" />
            <span>{t.dashSwitchPersona}</span>
          </button>

          {/* Primary Quick Verify Button */}
          <button
            onClick={() => setActiveTab('verifier')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#126B3A] hover:bg-[#0E542D] text-white text-xs font-bold shadow-md transition-all focus:ring-2 focus:ring-[#126B3A]"
          >
            <FileSearch className="w-4 h-4" />
            <span>{t.dashQuickVerifyBtn}</span>
          </button>
        </div>
      </div>

      {/* Synthetic Metric Strip (Realistic formatting, uncluttered) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: t.dashStatTotalParcels,
            value: '২টি প্লট',
            valueEn: '2 Parcels',
            sub: 'DEMO-PARCEL-001 / 002',
          },
          {
            label: t.dashStatScreenedCases,
            value: '৪টি কেস',
            valueEn: '4 Cases',
            sub: isBn ? 'স্ক্রিনিং নিয়মাবলী সক্রিয়' : 'Screening Rules Active',
          },
          {
            label: t.dashStatVaultDocs,
            value: '৬টি দলিল',
            valueEn: '6 Documents',
            sub: isBn ? 'SHA-256 রেফারেন্স প্রস্তুত' : 'SHA-256 Hashes Ready',
          },
          {
            label: t.dashStatChecklistProgress,
            value: '৪/৪ প্রস্তুত',
            valueEn: '4/4 Complete',
            sub: isBn ? 'সম্পূর্ণতা চেকলিস্ট নিরীক্ষিত' : 'Completeness Audited',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs space-y-1"
          >
            <span className="text-xs text-neutral-500 font-medium block">{stat.label}</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#126B3A] dark:text-[#38C172]">
              {isBn ? stat.value : stat.valueEn}
            </div>
            <span className="text-[11px] text-neutral-400 block font-mono">
              {stat.sub}
            </span>
          </div>
        ))}
      </div>

      {/* The 3 Core Module Launch Cards with Original Matching Logos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1 */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#126B3A] hover:shadow-md transition-all group">
          <div className="space-y-4">
            <div className="group-hover:scale-105 transition-transform">
              <VerifierLogo size={52} />
            </div>
            <h2 className="text-lg font-bold text-[#202923] dark:text-white group-hover:text-[#126B3A] transition-colors">
              {t.feature1Title}
            </h2>
            <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] leading-relaxed">
              {t.feature1Desc}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('verifier')}
            className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#EFF8F2] dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] text-xs font-bold group-hover:bg-[#126B3A] group-hover:text-white transition-all"
          >
            <span>{t.feature1Action}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module 2 */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#126B3A] hover:shadow-md transition-all group">
          <div className="space-y-4">
            <div className="group-hover:scale-105 transition-transform">
              <WalletLogo size={52} />
            </div>
            <h2 className="text-lg font-bold text-[#202923] dark:text-white group-hover:text-[#126B3A] transition-colors">
              {t.feature2Title}
            </h2>
            <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] leading-relaxed">
              {t.feature2Desc}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('wallet')}
            className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#EFF8F2] dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] text-xs font-bold group-hover:bg-[#126B3A] group-hover:text-white transition-all"
          >
            <span>{t.feature2Action}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module 3 */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#126B3A] hover:shadow-md transition-all group">
          <div className="space-y-4">
            <div className="group-hover:scale-105 transition-transform">
              <AssistantLogo size={52} />
            </div>
            <h2 className="text-lg font-bold text-[#202923] dark:text-white group-hover:text-[#126B3A] transition-colors">
              {t.feature3Title}
            </h2>
            <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] leading-relaxed">
              {t.feature3Desc}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('assistant')}
            className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#EFF8F2] dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] text-xs font-bold group-hover:bg-[#126B3A] group-hover:text-white transition-all"
          >
            <span>{t.feature3Action}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Activity Log Strip */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#126B3A] dark:text-[#38C172]">
          {t.dashRecentTitle}
        </h3>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
          {[
            {
              time: '10 min ago',
              textBn: 'দাগ DEMO-DAG-402 এর ক্ষেত্রে প্রাক-লেনদেন What-if হিসেব নিরীক্ষা সম্পন্ন।',
              textEn: 'Pre-transaction What-if simulation completed for Dag DEMO-DAG-402.',
              tag: 'SCREENING',
            },
            {
              time: '1 hour ago',
              textBn: 'দলিল DOC-001 এর জন্য ক্লায়েন্ট-সাইড SHA-256 ফাইল সমতা পরীক্ষা সফল।',
              textEn: 'Client-side SHA-256 hash verified for document DOC-001.',
              tag: 'WALLET',
            },
            {
              time: 'Yesterday',
              textBn: 'ই-মিউটেশন চেকলিস্টের ২টি ধাপ সম্পন্ন হিসেবে চিহ্নিত।',
              textEn: '2 steps marked completed in E-Mutation checklist.',
              tag: 'ASSISTANT',
            },
          ].map((act, i) => (
            <div key={i} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="text-[#202923] dark:text-neutral-200">
                  {isBn ? act.textBn : act.textEn}
                </span>
              </div>
              <span className="font-mono text-[10px] text-neutral-400 shrink-0">
                {act.tag} · {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
