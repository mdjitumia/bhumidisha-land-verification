import React from 'react';
import { useApp } from '../context/AppContext';
import { BhumiDishaLogo } from './BhumiDishaLogo';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, locale, navigateWithAuth, setActiveTab } = useApp();
  const isBn = locale === 'bn';

  return (
    <footer className="bg-white dark:bg-[#0E1812] border-t border-[#D9E7DD] dark:border-[#1E3024] pt-12 pb-8 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <BhumiDishaLogo size={36} />
              <span className="text-xl font-bold text-[#126B3A] dark:text-[#38C172]">
                {t.brandName}
              </span>
            </div>
            <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] leading-relaxed">
              {t.tagline}
            </p>
          </div>

          {/* Col 2: Services / Modules */}
          <div>
            <h4 className="text-xs font-bold text-[#202923] dark:text-white uppercase tracking-wider mb-3">
              {isBn ? 'ভূমিদিশা মডিউল' : 'Platform Modules'}
            </h4>
            <ul className="space-y-2 text-xs text-[#46544C] dark:text-[#BAC7BE]">
              <li>
                <button
                  onClick={() => navigateWithAuth('verifier')}
                  className="hover:text-[#126B3A] dark:hover:text-[#38C172] transition-colors"
                >
                  {t.feature1Title}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateWithAuth('wallet')}
                  className="hover:text-[#126B3A] dark:hover:text-[#38C172] transition-colors"
                >
                  {t.feature2Title}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateWithAuth('assistant')}
                  className="hover:text-[#126B3A] dark:hover:text-[#38C172] transition-colors"
                >
                  {t.feature3Title}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('how-it-works')}
                  className="hover:text-[#126B3A] dark:hover:text-[#38C172] transition-colors"
                >
                  {t.navGuides}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official References */}
          <div>
            <h4 className="text-xs font-bold text-[#202923] dark:text-white uppercase tracking-wider mb-3">
              {isBn ? 'অফিসিয়াল পাবলিক পোর্টাল' : 'Official Public Portals'}
            </h4>
            <ul className="space-y-2 text-xs text-[#46544C] dark:text-[#BAC7BE]">
              <li>
                <a
                  href="https://land.gov.bd"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#126B3A] dark:hover:text-[#38C172] transition-colors"
                >
                  <span>ভূমি সেবা পোর্টাল (land.gov.bd)</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a
                  href="https://mutation.land.gov.bd"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#126B3A] dark:hover:text-[#38C172] transition-colors"
                >
                  <span>ই-নামজারি সিস্টেম</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a
                  href="https://ldtax.gov.bd"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#126B3A] dark:hover:text-[#38C172] transition-colors"
                >
                  <span>ভূমি উন্নয়ন কর (ldtax.gov.bd)</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a
                  href="https://minland.gov.bd"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#126B3A] dark:hover:text-[#38C172] transition-colors"
                >
                  <span>ভূমি মন্ত্রণালয় বাংলাদেশ</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: About Prototype */}
          <div>
            <h4 className="text-xs font-bold text-[#202923] dark:text-white uppercase tracking-wider mb-3">
              {isBn ? 'প্রোটোটাইপ তথ্য' : 'Prototype Context'}
            </h4>
            <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] leading-relaxed mb-2">
              {isBn
                ? 'ভূমিদিশা একটি নাগরিক-বান্ধব ল্যান্ড-টেক প্রোটোটাইপ।'
                : 'BhumiDisha is a citizen-focused land-tech prototype.'}
            </p>
            <p className="text-[11px] text-[#66736B] dark:text-[#9FB0A5] leading-relaxed">
              {isBn
                ? 'প্রাক-লেনদেন ঝুঁকি স্ক্রিনিং ও ব্যক্তিগত ভূমি দলিল ব্যবস্থাপনায় সহায়তা প্রদান করে।'
                : 'Assisting with pre-transaction conflict screening and parcel document management.'}
            </p>
          </div>
        </div>

        {/* Mandatory Declaration Section */}
        <div className="pt-6 border-t border-[#EFF8F2] dark:border-[#1E3024] space-y-3">
          <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] leading-relaxed text-center md:text-left">
            {t.footerDeclaration}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#66736B] dark:text-[#9FB0A5] pt-2">
            <span className="font-medium">{t.footerCopyright}</span>
            <span className="font-mono text-[11px]">BhumiDisha Platform · 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
