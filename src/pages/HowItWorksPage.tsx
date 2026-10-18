import React from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  ShieldCheck,
  FileSearch,
  FolderLock,
  MessageSquare,
  AlertTriangle,
  Hash,
  Eye,
  CheckCircle,
} from 'lucide-react';

interface HowItWorksProps {
  initialSection?: 'manuals' | 'faqs';
}

export const HowItWorksPage: React.FC<HowItWorksProps> = ({ initialSection = 'manuals' }) => {
  const { locale, t, setActiveTab } = useApp();
  const isBn = locale === 'bn';
  const [activeSubTab, setActiveSubTab] = React.useState<'manuals' | 'faqs'>(
    initialSection === 'faqs' ? 'faqs' : 'manuals'
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#D9E7DD] dark:border-[#1E3024] pb-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#126B3A] dark:text-[#38C172]" />
          <h1 className="text-2xl font-bold tracking-tight text-[#126B3A] dark:text-[#38C172]">
            {isBn ? 'ব্যবহার নির্দেশিকা ও স্বচ্ছতা নীতিমালা' : 'User Guide & Transparency Standards'}
          </h1>
        </div>
        <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] mt-1">
          {isBn
            ? 'ভূমিদিশা প্রোটোটাইপের কার্যপ্রণালী, ফলাফল বিশ্লেষণের নিয়মাবলী এবং নিরাপত্তা সীমাবদ্ধতা।'
            : 'How BhumiDisha prototype functions, how to interpret status outputs, and safety boundaries.'}
        </p>
      </div>

      {/* Sub-tab pills for Manuals vs FAQs */}
      <div className="flex items-center gap-2 border-b border-[#D9E7DD] dark:border-[#1E3024] pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('manuals')}
          className={`px-3.5 py-1.5 rounded-xl transition-colors ${
            activeSubTab === 'manuals'
              ? 'bg-[#126B3A] text-white shadow-2xs'
              : 'text-[#46544C] dark:text-[#BAC7BE] hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024]'
          }`}
        >
          {t.sideManuals}
        </button>
        <button
          onClick={() => setActiveSubTab('faqs')}
          className={`px-3.5 py-1.5 rounded-xl transition-colors ${
            activeSubTab === 'faqs'
              ? 'bg-[#126B3A] text-white shadow-2xs'
              : 'text-[#46544C] dark:text-[#BAC7BE] hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024]'
          }`}
        >
          {t.sideFaq}
        </button>
      </div>

      {activeSubTab === 'faqs' ? (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-[#126B3A] dark:text-[#38C172]">
              {isBn ? 'নাগরিক ও বিচারকদের সচরাচর জিজ্ঞাসিত প্রশ্নাবলি' : 'Frequently Asked Questions (FAQ)'}
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-[#EFF8F2] dark:bg-[#15241C] border border-[#D9E7DD] dark:border-[#233B2E] space-y-1">
                <h3 className="font-bold text-[#126B3A] dark:text-[#38C172]">
                  {isBn ? 'প্রশ্ন ১: ভূমিদিশা কীভাবে অতিরিক্ত হিস্যা বিক্রয় ঝুঁকি শনাক্ত করে?' : 'Q1: How does BhumiDisha detect over-allocation risks?'}
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {isBn
                    ? 'সিস্টেমটি পূর্ববর্তী হস্তান্তরের ইতিহাস বিশ্লেষণ করে অবশিষ্ট রেকর্ডীয় অংশ হিসাব করে। নতুন প্রস্তাবিত বিক্রয় যদি অবশিষ্ট অংশ অতিক্রম করে, তবে সিস্টেম অতিরিক্ত বরাদ্দ ঝুঁকি চিহ্নিত করে মানব পর্যালোচনার সংকেত দেয়।'
                    : 'The engine audits the historical chain of transfers to determine the seller remaining recorded share. If the proposed deed exceeds the balance, it flags an over-allocation risk for human legal review.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF8F2] dark:bg-[#15241C] border border-[#D9E7DD] dark:border-[#233B2E] space-y-1">
                <h3 className="font-bold text-[#126B3A] dark:text-[#38C172]">
                  {isBn ? 'প্রশ্ন ২: আমার দলিলের গোপনীয়তা ও ফাইল নিরাপত্তা কীভাবে রক্ষা পায়?' : 'Q2: How is deed privacy and cryptographic integrity ensured?'}
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {isBn
                    ? 'ফাইলের অখণ্ডতা পরীক্ষা ব্রাউজারের ভেতর ক্লায়েন্ট-সাইড Web Crypto API ব্যবহার করে SHA-256 হ্যাশ বের করে করা হয়। কোনো দলিল অননুমোদিত তৃতীয় পক্ষের সার্ভারে সংরক্ষিত হয় না।'
                    : 'Cryptographic hash checks execute locally in your browser via the Web Crypto API without unauthorized document upload to external servers.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF8F2] dark:bg-[#15241C] border border-[#D9E7DD] dark:border-[#233B2E] space-y-1">
                <h3 className="font-bold text-[#126B3A] dark:text-[#38C172]">
                  {isBn ? 'প্রশ্ন ৩: এটি কি সরকারি চূড়ান্ত দলিল যাচাই হিসেবে গণ্য হবে?' : 'Q3: Does this constitute definitive government title verification?'}
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {isBn
                    ? 'না। এটি একটি প্রাক-লেনদেন স্ক্রিনিং ও সিদ্ধান্ত সহায়তা টুল। যে কোনো জমি রেজিস্ট্রির পূর্বে উপজেলা সাব-রেজিস্ট্রি অফিস ও সহকারী কমিশনার (ভূমি) অফিসে মূল বালাম বই নিরীক্ষা করা আইনত আবশ্যক।'
                    : 'No. This is a pre-transaction screening and advisory tool. On-ground inspection and official verification at the Sub-Registry and AC Land offices remain mandatory.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#EFF8F2] dark:bg-[#1E3024] flex items-center justify-center text-[#126B3A] dark:text-[#38C172]">
            <FileSearch className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-[#126B3A] dark:text-[#38C172]">
            {isBn ? '১. জমি কেনার আগে যাচাই (P3)' : '1. Pre-Purchase Verification'}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {isBn
              ? 'বিক্রেতার পূর্ববর্তী হস্তান্তরের ইতিহাস থেকে অবশিষ্ট রেকর্ডীয় অংশ হিসাব করা হয়। নতুন প্রস্তাবিত বিক্রয় যদি অবশিষ্ট অংশ অতিক্রম করে, তবে সিস্টেম অতিরিক্ত বরাদ্দ ঝুঁকি চিহ্নিত করে।'
              : 'Computes remaining recorded share from past sales. If proposed transfer exceeds recorded balance, the system flags an over-allocation risk.'}
          </p>
          <button
            onClick={() => setActiveTab('verifier')}
            className="text-xs font-semibold text-[#126B3A] dark:text-[#38C172] hover:underline"
          >
            {isBn ? 'স্ক্রিনিং শুরু করুন →' : 'Launch Screening →'}
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#EFF8F2] dark:bg-[#1E3024] flex items-center justify-center text-[#126B3A] dark:text-[#38C172]">
            <FolderLock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-[#126B3A] dark:text-[#38C172]">
            {isBn ? '২. আমার ভূমি-ওয়ালেট' : '2. My Land Wallet'}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {isBn
              ? 'দাগভিত্তিক ভল্টে দলিল সংরক্ষণ, ব্রাউজারের ভেতর ক্লায়েন্ট-সাইড SHA-256 ফাইল অখণ্ডতা পরীক্ষা এবং সাময়িক ভিউ-অনলি কিউআর শেয়ারিং সুবিধা।'
              : 'Parcel-based document vault with local in-browser Web Crypto SHA-256 hash checks and time-limited view-only QR sharing.'}
          </p>
          <button
            onClick={() => setActiveTab('wallet')}
            className="text-xs font-semibold text-[#126B3A] dark:text-[#38C172] hover:underline"
          >
            {isBn ? 'ওয়ালেট খুলুন →' : 'Open Wallet →'}
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#EFF8F2] dark:bg-[#1E3024] flex items-center justify-center text-[#126B3A] dark:text-[#38C172]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-[#126B3A] dark:text-[#38C172]">
            {isBn ? '৩. ভূমিসাথী তথ্য ও সহায়তা' : '3. BhumiSathi Assistant'}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {isBn
              ? 'ভূমি মন্ত্রণালয়ের পাবলিক নীতিমালার রেফারেন্সযুক্ত প্রশ্নোত্তর, দলিলের শর্তাবলি অনুসন্ধান এবং ধাপে ধাপে নাগরিক চেকলিস্ট।'
              : 'Grounded FAQ citing official Ministry circulars, document clause inspection, and step-by-step citizen action checklists.'}
          </p>
          <button
            onClick={() => setActiveTab('assistant')}
            className="text-xs font-semibold text-[#126B3A] dark:text-[#38C172] hover:underline"
          >
            {isBn ? 'সহায়তা নিন →' : 'Explore Assistant →'}
          </button>
        </div>
      </div>

      {/* Status Interpretation Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#126B3A] dark:text-[#38C172]">
          {isBn ? 'স্ক্রিনিং ফলাফলের অর্থ ও তাৎপর্য' : 'Interpreting Screening Status Outputs'}
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl border border-red-200 bg-red-50/60 dark:bg-red-950/20 dark:border-red-900/50 space-y-1">
            <div className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>CONFLICT DETECTED (ঝুঁকি চিহ্নিত)</span>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {isBn
                ? 'বিদ্যমান সিন্থেটিক দলিলের হিসেবে বিক্রেতার অবশিষ্ট অংশের অতিরিক্ত হিস্যা বিক্রয় অথবা একই দাগের জন্য একাধিক পরস্পরবিরোধী দলিলের অস্তিত্ব পাওয়া গেছে। এটি স্বয়ংক্রিয়ভাবে প্রতারণা প্রমাণ করে না, তবে গভীর আইনি পর্যালোচনার সংকেত দেয়।'
                : 'Indicates recorded math deficit or overlapping transfer deeds in the synthetic dataset. It flags high risk for human legal review, without conclusively claiming fraud.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-900/50 space-y-1">
            <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>REVIEW REQUIRED (পর্যালোচনা আবশ্যক)</span>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {isBn
                ? 'দলিল থাকা সত্ত্বেও নামজারি রেকর্ডের ঘাটতি বা কোনো তথ্যের অনুপস্থিতি লক্ষ্য করা গেছে। উপজেলা ভূমি অফিসে মূল খতিয়ান যাচাই প্রয়োজন।'
                : 'Identifies missing computerized mutation records or broken paper trail requiring physical verification at the local land office.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-900/50 space-y-1">
            <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>NO CONFLICT IN DATA (কোনো অমিল পাওয়া যায়নি)</span>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {isBn
                ? 'উপলব্ধ সিন্থেটিক দলিলের হিসেবে কোনো গাণিতিক অমিল পাওয়া যায়নি। তবে প্রকৃত ক্রয়ের পূর্বে সরেজমিনে সীমানা ও দখল নিশ্চিত করা অপরিহার্য।'
                : 'Confirms that available synthetic records are mathematically consistent. Physical survey of boundaries and possession remains mandatory.'}
            </p>
          </div>
        </div>
      </div>

      {/* Critical Limitations & Honesty Disclosures */}
      <div className="p-6 rounded-2xl bg-[#EFF8F2] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024] space-y-4">
        <h2 className="text-sm font-bold text-[#126B3A] dark:text-[#38C172] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>{isBn ? 'গুরুত্বপূর্ণ আইনি ও প্রযুক্তিগত সীমাবদ্ধতা' : 'Critical Legal & Technical Disclosures'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#14241B] border border-neutral-200 dark:border-neutral-800 space-y-1">
            <div className="font-bold text-[#126B3A] dark:text-[#38C172] flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" />
              <span>{isBn ? 'SHA-256 হ্যাশের সীমা' : 'Scope of SHA-256 Hashes'}</span>
            </div>
            <p>
              {isBn
                ? 'একটি ফাইলের হ্যাশ মিল প্রমাণ করে যে ফাইলটি তার ডিজিটাল রেফারেন্সের সাথে অবিকল এক। এটি দলিলটির সরকারি সত্যতা বা আইনি বৈধতা নিশ্চিত করে না।'
                : 'A matching cryptographic hash only proves file consistency with the recorded digital copy; it does not verify government genuineness or legal validity.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#14241B] border border-neutral-200 dark:border-neutral-800 space-y-1">
            <div className="font-bold text-[#126B3A] dark:text-[#38C172] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>{isBn ? 'ভিউ-অনলি শেয়ারিং এর সীমা' : 'Scope of View-Only Sharing'}</span>
            </div>
            <p>
              {isBn
                ? 'ভিউ-অনলি পোর্টালটি ডাউনলোড ও প্রিন্ট অপশন সীমিত রাখে, কিন্তু কোনো ব্রাউজার প্রযুক্তি স্ক্রিনশট বা ডিভাইসের ক্যামেরা দিয়ে ছবি তোলা রোধ করতে পারে না।'
                : 'View-only links disable standard download/print options, but client-side software cannot fully prevent device screenshots or external photography.'}
            </p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
