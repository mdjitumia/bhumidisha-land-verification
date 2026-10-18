import React, { useState } from 'react';
import { WalletParcel } from '../types';
import { BhumiDishaLogo } from '../components/BhumiDishaLogo';
import { FileText, ShieldAlert, ArrowLeft, Lock, Eye, Calendar, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  parcel: WalletParcel;
  token: string;
  expiresAt: string;
  onBack: () => void;
}

export const SharedParcelView: React.FC<Props> = ({ parcel, token, expiresAt, onBack }) => {
  const { locale } = useApp();
  const isBn = locale === 'bn';
  const [activeDocPreview, setActiveDocPreview] = useState<string | null>(null);

  const selectedDoc = parcel.documents.find((d) => d.id === activeDocPreview) || parcel.documents[0];

  return (
    <div className="relative min-h-screen bg-[#EFF8F2] dark:bg-[#0D1812] text-[#202923] dark:text-[#E4EBE6] p-4 sm:p-8 select-none">
      {/* Watermark Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center opacity-5 dark:opacity-10 rotate-[-25deg] text-4xl sm:text-7xl font-black uppercase text-neutral-800 dark:text-neutral-200 select-none">
        DEMO VIEW-ONLY · SYNTHETIC RECORD
      </div>

      <div className="relative z-20 max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-sm">
          <div className="flex items-center gap-3">
            <BhumiDishaLogo size={42} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#126B3A] dark:text-[#38C172]">
                  {isBn ? 'ভূমিদিশা — ভিউ-অনলি সুরক্ষিত পোর্টাল' : 'BhumiDisha — Secure View-Only Viewer'}
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                TOKEN: {token} · EXPIRES: {new Date(expiresAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#126B3A] text-[#126B3A] dark:text-[#38C172] text-xs font-semibold hover:bg-[#EFF8F2] dark:hover:bg-[#1E3024] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}</span>
          </button>
        </div>

        {/* Security Warning Notice */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <strong className="font-bold">{isBn ? 'নিরাপত্তা ও প্রদর্শনী সীমাবদ্ধতা:' : 'Security & Scope Notice:'}</strong>
            <p className="mt-0.5 leading-relaxed">
              {isBn
                ? 'এই ভিউটি শুধুমাত্র পড়ার জন্য (Read-Only)। ডাউনলোড বা প্রিন্ট অপশন নিষ্ক্রিয় রাখা হয়েছে। তবে ক্লায়েন্ট-সাইড প্রযুক্তি ব্যবহারকারীর ডিভাইসে স্ক্রিনশট বা বাহ্যিক ছবি তোলা সম্পূর্ণ রোধ করতে পারে না। এটি একটি সিমুলেটেড ডেমো ভিউয়ার।'
                : 'This viewer is strictly Read-Only with download/print functionality disabled. Note that client-side controls cannot fully prevent device screenshots or screen captures. This is a frontend demonstration.'}
            </p>
          </div>
        </div>

        {/* Parcel Profile Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] text-xs">
          <div>
            <span className="text-neutral-500 block">{isBn ? 'দাগ নম্বর' : 'Dag No'}</span>
            <span className="font-mono font-bold text-base text-[#126B3A] dark:text-[#38C172]">
              {parcel.dagNo}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block">{isBn ? 'মৌজা' : 'Mouza'}</span>
            <span className="font-semibold">{isBn ? parcel.mouzaBn : parcel.mouzaEn}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">{isBn ? 'জমির পরিমাণ' : 'Land Area'}</span>
            <span className="font-bold">{parcel.areaDecimal} {isBn ? 'শতাংশ' : 'Decimals'}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">{isBn ? 'রেকর্ডীয় মালিক' : 'Recorded Owner'}</span>
            <span className="font-semibold">{isBn ? parcel.recordedOwnerBn : parcel.recordedOwnerEn}</span>
          </div>
        </div>

        {/* Document Viewer Split */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Document List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {isBn ? 'শেয়ারকৃত দলিলের তালিকা' : 'Shared Documents'}
            </h3>
            <div className="space-y-2">
              {parcel.documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocPreview(doc.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    selectedDoc?.id === doc.id
                      ? 'border-[#126B3A] bg-white dark:bg-[#1E3024] shadow-xs'
                      : 'border-[#D9E7DD] dark:border-[#233B2E] bg-white/60 dark:bg-[#14241B]/60 hover:bg-white'
                  }`}
                >
                  <FileText className="w-5 h-5 text-[#126B3A] dark:text-[#38C172] shrink-0 mt-0.5" />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-[#202923] dark:text-white truncate">
                      {isBn ? doc.titleBn : doc.titleEn}
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{doc.fileReference}</p>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 mt-1 inline-block">
                      {doc.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Document Content Simulation (No Download or Print) */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#126B3A] dark:text-[#38C172]" />
                  <span className="text-xs font-bold text-[#126B3A] dark:text-[#38C172]">
                    {isBn ? selectedDoc.titleBn : selectedDoc.titleEn}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  SHA-256: {selectedDoc.recordedSha256.substring(0, 16)}...
                </div>
              </div>

              {/* Simulated Content Box */}
              <div className="p-5 rounded-xl bg-neutral-50 dark:bg-[#0D1812] border border-neutral-200 dark:border-neutral-800 text-xs leading-relaxed font-serif text-[#202923] dark:text-neutral-200 space-y-3 min-h-[220px]">
                <p>{isBn ? selectedDoc.previewTextBn : selectedDoc.previewTextEn}</p>
                <div className="p-3 bg-white dark:bg-[#14241B] rounded border border-dashed border-neutral-300 dark:border-neutral-700 text-[11px] text-neutral-500">
                  {isBn
                    ? 'নোট: এই প্রিভিউটি মূল স্ক্যান ফাইলের অংশবিশেষ উপস্থাপন করে। ডাউনলোড ও মুদ্রণ নীতিমালার অধীনে নিষিদ্ধ।'
                    : 'Note: This preview presents an indexed snippet of the original deed record. Downloads and printing are disabled under view-only policy.'}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{isBn ? 'ভিউয়ার নিয়ন্ত্রণ সক্রিয়' : 'Controlled View Active'}</span>
              </span>
              <span>{isBn ? 'ডাউনলোড অক্ষম' : 'Download Disabled'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
