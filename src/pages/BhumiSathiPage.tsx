import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_FAQS, DEMO_CHECKLISTS } from '../data/demo';
import { AssistantFAQ, CitizenChecklistItem } from '../types';
import {
  MessageSquare,
  Search,
  CheckSquare,
  FileSearch,
  ExternalLink,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const BhumiSathiPage: React.FC = () => {
  const { locale, t } = useApp();
  const isBn = locale === 'bn';

  const [activeTab, setActiveTab] = useState<'faq' | 'docSearch' | 'checklists'>('faq');
  const [selectedFaq, setSelectedFaq] = useState<AssistantFAQ>(DEMO_FAQS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Document Q&A sample
  const [docQuestion, setDocQuestion] = useState('জমিটির সীমানা তফসিলে কী কী উল্লেখ আছে?');
  const [docAnswerResult, setDocAnswerResult] = useState<{
    docName: string;
    section: string;
    supportingSnippet: string;
    status: 'ANSWERED' | 'UNCERTAIN';
    confidence: string;
  } | null>({
    docName: 'মূল সাফ-কবলা দলিল (DEED-2021-001)',
    section: 'চতুঃসীমা তফসিল ও দাগ বিবরণী (পাতা ৩)',
    supportingSnippet:
      'উত্তরে ৫০ ফুট চওড়া সরকারি পাকা রাস্তা, দক্ষিণে করিম বক্সের জোত জমি, পূর্বে আব্দুল কাদেরের নাল জমি, পশ্চিমে সার্ভে ড্রেন। মোট জমি ৩০ শতাংশ।',
    status: 'ANSWERED',
    confidence: 'উচ্চ (ম্যাচকৃত ক্লজ ৯৮%)',
  });

  // Checklist state
  const [checklists, setChecklists] = useState(DEMO_CHECKLISTS);
  const [activeChecklistKey, setActiveChecklistKey] = useState<'prePurchase' | 'mutationSteps'>(
    'prePurchase'
  );

  const toggleChecklistItem = (id: string) => {
    setChecklists((prev) => ({
      ...prev,
      [activeChecklistKey]: prev[activeChecklistKey].map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const filteredFaqs = DEMO_FAQS.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.questionBn.toLowerCase().includes(q) ||
      f.questionEn.toLowerCase().includes(q) ||
      f.categoryBn.toLowerCase().includes(q) ||
      f.categoryEn.toLowerCase().includes(q)
    );
  });

  const handleDocQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docQuestion.includes('ব্যাংক') || docQuestion.includes('বন্ধক') || docQuestion.includes('mortgage')) {
      // Missing info case
      setDocAnswerResult({
        docName: 'মূল সাফ-কবলা দলিল (DEED-2021-001)',
        section: 'সম্পূর্ণ দলিল অনুসন্ধান',
        supportingSnippet:
          'উপলব্ধ দলিলের পাঠ্যাংশে কোনো ব্যাংক দায়দেনা বা বন্ধকী উল্লেখ নেই। তবে ব্যাংক দায় নিশ্চিত করতে সাব-রেজিস্ট্রি অফিসে নির্দায় সার্টিফিকেট (Non-Encumbrance Certificate - NEC) ফর্ম ১২ অনুসন্ধান করা আবশ্যক।',
        status: 'UNCERTAIN',
        confidence: 'অনিশ্চিত — দলিলে তথ্য অনুপস্থিত',
      });
    } else {
      setDocAnswerResult({
        docName: 'মূল সাফ-কবলা দলিল (DEED-2021-001)',
        section: 'স্বত্ব ঘোষণা ও হস্তান্তর ধারা',
        supportingSnippet:
          'দাতা অত্র দলিলের মাধ্যমে তাহার স্বত্বীয় ও দখলীয় জমি সম্পূর্ণ নির্ভেজাল অবস্থায় কোনো প্রকার আপত্তি ব্যতীত গ্রহীতার বরাবরে হস্তান্তর করিলেন।',
        status: 'ANSWERED',
        confidence: 'উচ্চ (সিন্থেটিক ক্লজ ম্যাচ)',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9E7DD] dark:border-[#1E3024] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#126B3A] dark:text-[#38C172]">
              {t.assistantPageTitle}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
              GROUNDED CITATIONS
            </span>
          </div>
          <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] mt-1">
            {t.assistantSubtitle}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#EFF8F2] dark:bg-[#14241B] rounded-xl border border-[#D9E7DD] dark:border-[#233B2E]">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'faq'
                ? 'bg-white dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {t.assistantFaqTab}
          </button>
          <button
            onClick={() => setActiveTab('docSearch')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'docSearch'
                ? 'bg-white dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {t.assistantDocSearchTab}
          </button>
          <button
            onClick={() => setActiveTab('checklists')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'checklists'
                ? 'bg-white dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {t.assistantChecklistTab}
          </button>
        </div>
      </div>

      {/* TAB 1: Grounded FAQ Assistant */}
      {activeTab === 'faq' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question List (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#14241B] rounded-2xl border border-[#D9E7DD] dark:border-[#233B2E] p-5 shadow-xs space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.assistantSearchPlaceholder}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-neutral-50 dark:bg-[#0D1812] text-xs text-[#202923] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            </div>

            <div className="space-y-2">
              {filteredFaqs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => setSelectedFaq(faq)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedFaq.id === faq.id
                      ? 'border-[#126B3A] bg-[#EFF8F2] dark:bg-[#1A3024] shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14241B] hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-[10px] font-bold text-[#126B3A] dark:text-[#38C172] uppercase tracking-wider block">
                    {isBn ? faq.categoryBn : faq.categoryEn}
                  </span>
                  <h4 className="text-xs font-bold text-[#202923] dark:text-white mt-1">
                    {isBn ? faq.questionBn : faq.questionEn}
                  </h4>
                </button>
              ))}
            </div>
          </div>

          {/* Answer Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#14241B] rounded-2xl border border-[#D9E7DD] dark:border-[#233B2E] p-6 shadow-xs space-y-5">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <span className="text-xs font-bold text-[#126B3A] dark:text-[#38C172] uppercase tracking-wider">
                {isBn ? selectedFaq.categoryBn : selectedFaq.categoryEn}
              </span>
              <h2 className="text-lg font-bold text-[#202923] dark:text-white mt-1">
                {isBn ? selectedFaq.questionBn : selectedFaq.questionEn}
              </h2>
            </div>

            {/* Quick Answer */}
            <div className="p-4 rounded-xl bg-[#EFF8F2] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024] text-xs leading-relaxed font-semibold text-[#126B3A] dark:text-[#38C172]">
              {isBn ? selectedFaq.shortAnswerBn : selectedFaq.shortAnswerEn}
            </div>

            {/* Detailed Explanation */}
            <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line space-y-2">
              {isBn ? selectedFaq.detailedAnswerBn : selectedFaq.detailedAnswerEn}
            </div>

            {/* Grounded Citation Box */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0D1812] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  {t.assistantSourceRef}
                </span>
                <span className="font-bold text-[#202923] dark:text-white">
                  {isBn ? selectedFaq.sourceNameBn : selectedFaq.sourceNameEn}
                </span>
              </div>
              <a
                href={selectedFaq.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#126B3A] text-white font-semibold text-xs hover:bg-[#0E542D] transition-colors"
              >
                <span>{isBn ? 'সোর্স লিংক দেখুন' : 'View Source'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="text-[11px] text-neutral-400 italic">
              {t.assistantSyntheticAnswerTag}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Document Clause Inspector & Q&A */}
      {activeTab === 'docSearch' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <FileSearch className="w-4 h-4 text-[#126B3A] dark:text-[#38C172]" />
              <h3 className="text-sm font-bold text-[#126B3A] dark:text-[#38C172]">
                {isBn ? 'দলিল শর্তাবলি অনুসন্ধান ও প্রশ্নোত্তর (সিমুলেটেড)' : 'Evidence-Linked Document Q&A (Simulated)'}
              </h3>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {t.assistantDocSearchDesc}
            </p>

            <form onSubmit={handleDocQuestionSubmit} className="flex gap-2">
              <input
                type="text"
                value={docQuestion}
                onChange={(e) => setDocQuestion(e.target.value)}
                placeholder={isBn ? 'দলিল সম্পর্কে আপনার প্রশ্ন লিখুন (যেমন: সীমানা তফসিল, ব্যাংক বন্ধক)' : 'Ask a question about the document clauses...'}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs text-[#202923] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#126B3A] hover:bg-[#0E542D] text-white text-xs font-semibold shadow-xs"
              >
                {isBn ? 'অনুসন্ধান করুন' : 'Search Clauses'}
              </button>
            </form>

            {/* Result Snippet */}
            {docAnswerResult && (
              <div
                className={`p-5 rounded-xl border text-xs space-y-3 ${
                  docAnswerResult.status === 'ANSWERED'
                    ? 'border-emerald-200 bg-[#EFF8F2]/60 dark:bg-[#14241B]'
                    : 'border-amber-200 bg-amber-50/60 dark:bg-amber-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold">
                    {docAnswerResult.status === 'ANSWERED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>{docAnswerResult.docName}</span>
                  </div>
                  <span className="font-mono text-[11px] text-neutral-500">
                    {docAnswerResult.confidence}
                  </span>
                </div>

                <div className="text-[11px] text-neutral-500 font-mono">
                  {docAnswerResult.section}
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-[#0D1812] border font-serif text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  "{docAnswerResult.supportingSnippet}"
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Guided Citizen Checklists */}
      {activeTab === 'checklists' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveChecklistKey('prePurchase')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeChecklistKey === 'prePurchase'
                  ? 'bg-[#126B3A] text-white shadow-xs'
                  : 'bg-white dark:bg-[#14241B] border text-neutral-600'
              }`}
            >
              {isBn ? 'জমি বায়নার পূর্ববর্তী চেকলিস্ট' : 'Pre-Purchase Due Diligence'}
            </button>
            <button
              onClick={() => setActiveChecklistKey('mutationSteps')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeChecklistKey === 'mutationSteps'
                  ? 'bg-[#126B3A] text-white shadow-xs'
                  : 'bg-white dark:bg-[#14241B] border text-neutral-600'
              }`}
            >
              {isBn ? 'ই-মিউটেশন আবেদন প্রক্রিয়া' : 'E-Mutation Step-by-Step'}
            </button>
          </div>

          <div className="space-y-3">
            {checklists[activeChecklistKey].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                  item.completed
                    ? 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#14241B]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    item.completed ? 'bg-[#126B3A] text-white' : 'border border-neutral-300'
                  }`}
                >
                  {item.completed && <CheckSquare className="w-4 h-4" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#202923] dark:text-white">
                      {isBn ? item.titleBn : item.titleEn}
                    </h3>
                    <span className="font-mono text-[10px] text-neutral-400">
                      {item.id}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    {isBn ? item.reasonBn : item.reasonEn}
                  </p>
                  <div className="text-[11px] text-[#126B3A] dark:text-[#38C172] font-semibold pt-1">
                    {isBn ? 'আইনি ভিত্তি:' : 'Statutory Reference:'}{' '}
                    {isBn ? item.officialRefBn : item.officialRefEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
