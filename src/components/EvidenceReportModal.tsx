import React, { useState, useEffect, useRef } from 'react';
import { VerificationResult } from '../services/verificationService';
import { ReportService } from '../services/reportService';
import { BhumiDishaLogo } from './BhumiDishaLogo';
import { X, Printer, Download, CheckCircle, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface Props {
  result: VerificationResult;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceReportModal: React.FC<Props> = ({ result, isOpen, onClose }) => {
  const { locale, showToast } = useApp();
  const isBn = locale === 'bn';
  const { scenario } = result;
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Real client-side PDF file generator
  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    showToast(isBn ? 'PDF প্রস্তুত হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...' : 'Generating PDF, please wait...');

    try {
      // Use html-to-image to support modern CSS like oklch without regex parsing errors
      let imgData: string;
      try {
        imgData = await toJpeg(reportRef.current, {
          quality: 0.95,
          backgroundColor: '#FFFFFF',
          pixelRatio: 2,
        });
      } catch (renderErr) {
        console.warn('Retrying PDF snapshot with skipFonts:', renderErr);
        imgData = await toJpeg(reportRef.current, {
          quality: 0.95,
          backgroundColor: '#FFFFFF',
          pixelRatio: 2,
          skipFonts: true,
        });
      }

      // Load image to determine natural dimensions
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (img.naturalHeight * pdfWidth) / img.naturalWidth;

      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }

      pdf.save(`BhumiDisha_Report_${scenario.dagNo}_${Date.now()}.pdf`);
      showToast(isBn ? 'PDF সফলভাবে ডাউনলোড হয়েছে!' : 'PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast(isBn ? 'PDF তৈরিতে সমস্যা হয়েছে, প্রিন্ট বিকল্পটি ব্যবহার করুন' : 'PDF generation failed, use Print option');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl my-auto bg-white dark:bg-[#14241B] rounded-3xl shadow-2xl border border-[#D9E7DD] dark:border-[#233B2E] overflow-hidden text-[#202923] dark:text-[#E4EBE6]"
      >
        {/* Top Control Header Bar (Hidden on print) */}
        <div className="p-4 bg-[#EFF8F2] dark:bg-[#0D1812] border-b border-[#D9E7DD] dark:border-[#1E3024] flex items-center justify-between no-print gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#126B3A] dark:text-[#38C172]">
              {isBn ? 'প্রাক-লেনদেন প্রমাণপত্র রিপোর্ট' : 'Pre-Transaction Evidence Report'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Real PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#126B3A] hover:bg-[#0E542D] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-60"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
            </button>

            {/* Separate Print Action */}
            <button
              onClick={() => ReportService.printReport()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#126B3A] text-[#126B3A] dark:text-[#38C172] text-xs font-semibold hover:bg-white dark:hover:bg-[#1E3024] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
            </button>

            {/* CSV Download */}
            <button
              onClick={() => ReportService.downloadCsv(result, locale)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-white dark:hover:bg-[#1E3024] transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1E3024] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Content Area */}
        <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8">
          <div ref={reportRef} className="bg-white p-6 rounded-2xl text-[#202923] space-y-6">
            {/* Header Lockup */}
            <div className="flex items-start justify-between border-b border-neutral-200 pb-5">
              <div className="flex items-center gap-3">
                <BhumiDishaLogo size={48} />
                <div>
                  <h1 className="text-2xl font-bold text-[#126B3A]">
                    {isBn ? 'ভূমিদিশা' : 'BhumiDisha'}
                  </h1>
                  <p className="text-xs text-neutral-500">
                    {isBn
                      ? 'জমির তথ্য, যাচাই ও সহায়তা প্ল্যাটফর্ম — প্রমাণপত্র স্ক্রিনিং রিপোর্ট'
                      : 'Land Information & Verification Platform — Evidence Audit Report'}
                  </p>
                </div>
              </div>
              <div className="text-right text-xs text-neutral-500 font-mono">
                <div>REPORT: BD-REP-{Date.now().toString().slice(-6)}</div>
                <div>DATE: {new Date().toLocaleDateString()}</div>
                <div className="text-emerald-700 font-semibold font-sans">
                  {isBn ? 'ডিজিটাল স্ক্রিনিং রেকর্ড' : 'Digital Screening Record'}
                </div>
              </div>
            </div>

            {/* Disclaimer Box */}
            <div className="p-3.5 rounded-xl bg-[#EFF8F2] border border-[#D9E7DD] text-xs text-neutral-700 leading-relaxed">
              <strong>{isBn ? 'সতর্কতা ও ঘোষণা:' : 'Disclosure:'}</strong>{' '}
              {isBn
                ? 'এই রিপোর্টে উপস্থাপিত তথ্য ও ফলাফল প্রাক-লেনদেন সহায়তামূলক স্ক্রিনিং মাত্র। এটি কোনো সরকারি রেকর্ড নয় এবং আইনি নিশ্চয়তা প্রদান করে না। প্রকৃত লেনদেনের পূর্বে সংশ্লিষ্ট সাব-রেজিস্ট্রি সূচিবহি ও সরকারি ভূমি রেকর্ড যাচাই করা আবশ্যক।'
                : 'All information in this report represents heuristic screening guidance. It does not constitute an official government record and does not guarantee title. Physical verification of Volume books and official registers is required.'}
            </div>

            {/* Parcel Metric Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
              <div>
                <span className="text-neutral-500 block">{isBn ? 'দাগ নম্বর' : 'Dag No'}</span>
                <span className="font-mono font-bold text-sm text-[#126B3A]">
                  {scenario.dagNo}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">{isBn ? 'খতিয়ান নম্বর' : 'Khatian No'}</span>
                <span className="font-mono font-bold text-sm text-neutral-800">
                  {scenario.khatianNo}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">{isBn ? 'মৌজা' : 'Mouza'}</span>
                <span className="font-semibold text-neutral-800">
                  {isBn ? scenario.mouzaBn : scenario.mouzaEn}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">{isBn ? 'মোট আয়তন' : 'Total Area'}</span>
                <span className="font-bold text-neutral-800">
                  {scenario.totalAreaAcre} {isBn ? 'একর' : 'Acre'}
                </span>
              </div>
            </div>

            {/* Math Breakdown */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                {isBn ? 'মালিকানা হিস্যা গাণিতিক সারাংশ' : 'Ownership Share Ledger Math'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3.5 rounded-xl border border-neutral-200 text-xs">
                <div>
                  <span className="text-neutral-500 block">{isBn ? 'মূল রেকর্ডীয় অংশ' : 'Recorded Initial'}</span>
                  <span className="font-bold text-sm text-neutral-800">{result.initialRecordedShare}%</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">{isBn ? 'পূর্বের বিক্রয় মোট' : 'Prior Transferred'}</span>
                  <span className="font-bold text-sm text-neutral-700">
                    {result.totalPriorTransferredShare}%
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">{isBn ? 'হিসাবকৃত অবশিষ্ট' : 'Calculated Balance'}</span>
                  <span className="font-bold text-sm text-[#126B3A]">
                    {result.remainingCalculatedShare}%
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">{isBn ? 'প্রস্তাবিত বিক্রয়' : 'Proposed Transfer'}</span>
                  <span className="font-bold text-sm text-blue-600">
                    {result.proposedShare}%
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">{isBn ? 'বরাদ্দ স্থিতি' : 'Allocation Status'}</span>
                  <span
                    className={`font-bold text-sm ${
                      result.isOverAllocated ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {result.isOverAllocated ? `-${result.overAllocationDelta}% (ঘাটতি)` : `+${result.newBalanceAfterProposed}%`}
                  </span>
                </div>
              </div>
            </div>

            {/* Findings List */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                {isBn ? 'স্ক্রিনিং ফলাফলসমূহ' : 'Screening Findings & Inconsistencies'}
              </h3>
              <div className="space-y-3">
                {result.findings.map((f, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                      f.severity === 'CONFLICT'
                        ? 'border-red-200 bg-red-50/60'
                        : f.severity === 'REVIEW'
                        ? 'border-amber-200 bg-amber-50/60'
                        : 'border-emerald-200 bg-emerald-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm flex items-center gap-1.5 text-neutral-900">
                        {f.severity === 'CONFLICT' ? (
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        ) : f.severity === 'REVIEW' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <span>{isBn ? f.titleBn : f.titleEn}</span>
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border">
                        {f.ruleId}
                      </span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">
                      {isBn ? f.reasonBn : f.reasonEn}
                    </p>
                    <p className="font-semibold text-neutral-900 pt-1">
                      <strong>{isBn ? 'সুপারিশকৃত পরবর্তী পদক্ষেপ:' : 'Recommended Action:'}</strong>{' '}
                      {isBn ? f.recommendedActionBn : f.recommendedActionEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Assumptions */}
            <div className="border-t border-neutral-200 pt-4 text-[11px] text-neutral-500 space-y-1">
              <span className="font-bold text-neutral-700 block">
                {isBn ? 'হিসাবের শর্তাবলী ও সীমাবদ্ধতা:' : 'Assumptions & Data Scope:'}
              </span>
              {(isBn ? result.calculationAssumptionsBn : result.calculationAssumptionsEn).map(
                (a, idx) => (
                  <div key={idx}>{a}</div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
