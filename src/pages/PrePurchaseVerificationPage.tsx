import React, { useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
} from '@xyflow/react';
import { useApp } from '../context/AppContext';
import { DEMO_SCENARIOS } from '../data/demo';
import { VerificationService, VerificationResult } from '../services/verificationService';
import { EvidenceReportModal } from '../components/EvidenceReportModal';
import { VoiceNarrator } from '../components/VoiceNarrator';
import { ReportService } from '../services/reportService';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Printer,
  Info,
  Layers,
  Sliders,
  ArrowRight,
  ArrowLeft,
  FileCheck,
} from 'lucide-react';

export const PrePurchaseVerificationPage: React.FC = () => {
  const { locale, t, setActiveTab, isLoggedIn, showToast } = useApp();
  const isBn = locale === 'bn';

  // Selected scenario (Case 1: Over-Allocation is default)
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    'SCENARIO-1-OVER-ALLOCATION'
  );

  const scenario = useMemo(() => {
    return (
      DEMO_SCENARIOS.find((s) => s.id === selectedScenarioId) || DEMO_SCENARIOS[0]
    );
  }, [selectedScenarioId]);

  // What-If proposed transfer state
  const [proposedShare, setProposedShare] = useState<number>(
    scenario.defaultProposedTransfer.proposedSharePercentage
  );
  const [proposedDate, setProposedDate] = useState<string>(
    scenario.defaultProposedTransfer.proposedDate
  );

  // Active view tab (Dual view / Graph vs Table)
  const [historyView, setHistoryView] = useState<'graph' | 'table'>('graph');

  // Interactive node/timeline synchronization
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Evidence Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Run deterministic verification engine
  const verificationResult: VerificationResult = useMemo(() => {
    return VerificationService.analyzeScenario(scenario, {
      sellerId: scenario.defaultProposedTransfer.sellerId,
      proposedSharePercentage: proposedShare,
      proposedAreaAcre: (proposedShare / 100) * scenario.totalAreaAcre,
      proposedDate,
    });
  }, [scenario, proposedShare, proposedDate]);

  // Build React Flow Nodes and Edges dynamically
  const { nodes, edges } = useMemo(() => {
    const nodeList: Node[] = [];
    const edgeList: Edge[] = [];

    // Root Initial Owner Node
    const isRootHighlighted =
      highlightedId === 'ROOT_OWNER' || highlightedId === scenario.history[0]?.id;
    nodeList.push({
      id: 'ROOT_OWNER',
      position: { x: 50, y: 150 },
      data: {
        label: (
          <div
            className={`p-3.5 rounded-2xl border text-left shadow-xs transition-all ${
              isRootHighlighted
                ? 'border-[#126B3A] ring-2 ring-[#126B3A] bg-[#EFF8F2] dark:bg-[#1A3024]'
                : 'border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#14241B]'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#126B3A] dark:text-[#38C172]">
              {isBn ? 'মূল রেকর্ডীয় মালিক' : 'Original Owner'}
            </div>
            <div className="text-xs font-bold text-[#202923] dark:text-white mt-0.5">
              {isBn ? scenario.initialRecordedOwnerBn : scenario.initialRecordedOwnerEn}
            </div>
            <div className="text-[11px] text-neutral-500 font-mono mt-1">
              {isBn ? 'রেকর্ডীয় অংশ: ১০০%' : 'Recorded Share: 100%'}
            </div>
          </div>
        ),
      },
    });

    // Subsequent buyer nodes and transfer edges
    scenario.history.forEach((tx, index) => {
      const nodeId = `BUYER_NODE_${tx.id}`;
      const isTxHighlighted = highlightedId === tx.id || highlightedId === nodeId;
      const xPos = 360;
      const yPos = 50 + index * 140;

      nodeList.push({
        id: nodeId,
        position: { x: xPos, y: yPos },
        data: {
          label: (
            <div
              className={`p-3.5 rounded-2xl border text-left shadow-xs transition-all ${
                isTxHighlighted
                  ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/40'
                  : 'border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#14241B]'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {isBn ? `ক্রেতা ${index + 1}` : `Buyer ${index + 1}`}
              </div>
              <div className="text-xs font-bold text-[#202923] dark:text-white mt-0.5">
                {isBn ? tx.buyerNameBn : tx.buyerNameEn}
              </div>
              <div className="text-[11px] text-neutral-500 font-mono mt-1">
                {isBn ? `অংশ: ${tx.sharePercentage}%` : `Share: ${tx.sharePercentage}%`}
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                {tx.deedNo}
              </div>
            </div>
          ),
        },
      });

      edgeList.push({
        id: `EDGE_${tx.id}`,
        source: 'ROOT_OWNER',
        target: nodeId,
        label: `${tx.sharePercentage}% (${tx.deedDate})`,
        animated: isTxHighlighted,
        style: {
          stroke: isTxHighlighted ? '#2563EB' : '#126B3A',
          strokeWidth: isTxHighlighted ? 3 : 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isTxHighlighted ? '#2563EB' : '#126B3A',
        },
      });
    });

    // Proposed Transfer Node (What-if simulation)
    const proposedNodeId = 'PROPOSED_BUYER_NODE';
    nodeList.push({
      id: proposedNodeId,
      position: { x: 360, y: 50 + scenario.history.length * 140 },
      data: {
        label: (
          <div
            className={`p-3.5 rounded-2xl border-2 border-dashed text-left shadow-xs transition-all ${
              verificationResult.isOverAllocated
                ? 'border-red-400 bg-red-50/70 dark:bg-red-950/30'
                : 'border-blue-400 bg-blue-50/70 dark:bg-blue-950/30'
            }`}
          >
            <div
              className={`text-[10px] font-bold uppercase tracking-wider ${
                verificationResult.isOverAllocated
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-blue-600 dark:text-blue-400'
              }`}
            >
              {isBn ? 'নতুন প্রস্তাবিত ক্রেতা' : 'Proposed Buyer'}
            </div>
            <div className="text-xs font-bold text-[#202923] dark:text-white mt-0.5">
              {isBn ? 'প্রস্তাবিত ক্রেতা' : 'Prospective Buyer'}
            </div>
            <div className="text-[11px] font-mono mt-1 font-semibold">
              {isBn ? `প্রস্তাব: ${proposedShare}%` : `Proposed: ${proposedShare}%`}
            </div>
            {verificationResult.isOverAllocated && (
              <div className="text-[10px] font-bold text-red-600 dark:text-red-400 mt-1">
                {isBn
                  ? `ঘাটতি: ${verificationResult.overAllocationDelta}%`
                  : `Deficit: ${verificationResult.overAllocationDelta}%`}
              </div>
            )}
          </div>
        ),
      },
    });

    edgeList.push({
      id: 'EDGE_PROPOSED',
      source: 'ROOT_OWNER',
      target: proposedNodeId,
      label: `${isBn ? 'প্রস্তাবিত' : 'Proposed'} ${proposedShare}%`,
      animated: true,
      style: {
        stroke: verificationResult.isOverAllocated ? '#DC2626' : '#2563EB',
        strokeWidth: 2.5,
        strokeDasharray: '5,5',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: verificationResult.isOverAllocated ? '#DC2626' : '#2563EB',
      },
    });

    return { nodes: nodeList, edges: edgeList };
  }, [scenario, highlightedId, proposedShare, verificationResult.isOverAllocated, isBn]);

  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    const target = DEMO_SCENARIOS.find((s) => s.id === id);
    if (target) {
      setProposedShare(target.defaultProposedTransfer.proposedSharePercentage);
      setProposedDate(target.defaultProposedTransfer.proposedDate);
    }
    setHighlightedId(null);
    showToast(isBn ? 'কেস সফলভাবে লোড হয়েছে' : 'Scenario loaded');
  };

  // Voice narrative text
  const voiceNarrativeText = useMemo(() => {
    if (isBn) {
      if (verificationResult.isOverAllocated) {
        return `দৃষ্টি আকর্ষণ: দাগ নম্বর ${scenario.dagNo} এর ক্ষেত্রে মূল মালিকের রেকর্ডীয় ১০০ শতাংশ থেকে পূর্বে মোট ${verificationResult.totalPriorTransferredShare} শতাংশ হস্তান্তর হওয়ায় অবশিষ্ট থাকে মাত্র ${verificationResult.remainingCalculatedShare} শতাংশ। নতুন প্রস্তাবিত ${proposedShare} শতাংশ বিক্রির ক্ষেত্রে ${verificationResult.overAllocationDelta} শতাংশ পয়েন্টের অতিরিক্ত বরাদ্দ ঝুঁকি রয়েছে।`;
      }
      if (scenario.scenarioType === 'CONFLICTING_TRANSFER') {
        return `সতর্কবার্তা: দাগ নম্বর ${scenario.dagNo} এর জন্য একই অংশের বিপরীতে একাধিক পরস্পরবিরোধী দলিলের রেকর্ড পাওয়া গেছে। সাব-রেজিস্ট্রারের সূচিবহি অনুসন্ধান করার পরামর্শ দেওয়া হচ্ছে।`;
      }
      return `দাগ নম্বর ${scenario.dagNo} এর জন্য উপলব্ধ রেকর্ডের হিসেবে কোনো গাণিতিক অমিল পাওয়া যায়নি। অবশিষ্ট অংশ পর্যাপ্ত রয়েছে।`;
    } else {
      if (verificationResult.isOverAllocated) {
        return `Notice: For Dag number ${scenario.dagNo}, previous sales totaled ${verificationResult.totalPriorTransferredShare} percent from recorded title, leaving a calculated balance of ${verificationResult.remainingCalculatedShare} percent. The proposed transfer of ${proposedShare} percent triggers an over-allocation risk of ${verificationResult.overAllocationDelta} percentage points.`;
      }
      return `For Dag number ${scenario.dagNo}, available synthetic records show sufficient remaining share balance with no mathematical discrepancy.`;
    }
  }, [verificationResult, scenario, proposedShare, isBn]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Back Navigation and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9E7DD] dark:border-[#1E3024] pb-6">
        <div>
          {/* Visible Back Navigation Button */}
          <button
            onClick={() => setActiveTab(isLoggedIn ? 'dashboard' : 'home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-[#126B3A] dark:hover:text-[#38C172] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isLoggedIn ? (isBn ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard') : (isBn ? 'হোমপেজে ফিরে যান' : 'Back to Home')}</span>
          </button>

          {/* Clean Module Title without internal hackathon tags */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#126B3A] dark:text-[#38C172]">
            {t.p3PageTitle}
          </h1>
          <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] mt-1 max-w-2xl leading-relaxed">
            {t.p3Subtitle}
          </p>
        </div>

        {/* Export & Evidence Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => ReportService.downloadCsv(verificationResult, locale)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#14241B] text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:border-[#126B3A] transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.p3ExportCsv}</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#126B3A] hover:bg-[#0E542D] text-white text-xs font-bold shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{t.p3ExportPdf}</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector Strip */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#202923] dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#126B3A] dark:text-[#38C172]" />
            <span>{t.p3ScenarioSelectLabel}</span>
          </label>
          <span className="text-[11px] text-neutral-500 font-mono">
            {scenario.dagNo} · {isBn ? scenario.mouzaBn : scenario.mouzaEn}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleScenarioChange(sc.id)}
              className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                selectedScenarioId === sc.id
                  ? 'border-[#126B3A] bg-[#EFF8F2] dark:bg-[#1A3024] text-[#126B3A] dark:text-[#38C172] font-semibold ring-1 ring-[#126B3A] shadow-xs'
                  : 'border-[#D9E7DD] dark:border-[#233B2E] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#14241B]'
              }`}
            >
              <div className="font-bold truncate">{isBn ? sc.titleBn : sc.titleEn}</div>
              <div className="text-[11px] text-neutral-500 font-mono mt-1">
                {sc.dagNo} · {sc.totalAreaAcre} {isBn ? 'একর' : 'Acre'}
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#0D1812] border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
          <strong>{isBn ? 'কেস বিবরণী:' : 'Scenario Context:'}</strong>{' '}
          {isBn ? scenario.summaryBn : scenario.summaryEn}
        </div>
      </div>

      {/* Main Dual-View Workspace: Graph + Timeline Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Interactive React Flow Ownership Graph */}
        <div className="lg:col-span-7 bg-white dark:bg-[#14241B] rounded-3xl border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs overflow-hidden flex flex-col h-[560px]">
          {/* Header & View Switcher */}
          <div className="p-4 border-b border-[#D9E7DD] dark:border-[#1E3024] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#126B3A] dark:text-[#38C172]">
                {t.p3GraphTab}
              </span>
              <span className="text-[11px] text-neutral-400">
                ({isBn ? 'নোডে ক্লিক করে বিস্তারিত দেখুন' : 'Click node to inspect'})
              </span>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFF8F2] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024]">
              <button
                onClick={() => setHistoryView('graph')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  historyView === 'graph'
                    ? 'bg-white dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                {t.p3GraphTab}
              </button>
              <button
                onClick={() => setHistoryView('table')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  historyView === 'table'
                    ? 'bg-white dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                {t.p3TableTab}
              </button>
            </div>
          </div>

          {/* Graph Port */}
          {historyView === 'graph' ? (
            <div className="flex-1 w-full h-full relative bg-[#F9FCFA] dark:bg-[#0C1610]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodeClick={(_, node) => {
                  if (node.id === 'ROOT_OWNER') setHighlightedId('ROOT_OWNER');
                  else if (node.id === 'PROPOSED_BUYER_NODE')
                    setHighlightedId('PROPOSED_TRANSFER');
                  else {
                    const txId = node.id.replace('BUYER_NODE_', '');
                    setHighlightedId(txId);
                  }
                }}
                fitView
              >
                <Background color="#126B3A" gap={18} size={0.7} />
                <Controls />
              </ReactFlow>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                    <th className="py-2">{isBn ? 'দলিল নম্বর' : 'Deed No'}</th>
                    <th className="py-2">{isBn ? 'তারিখ' : 'Date'}</th>
                    <th className="py-2">{isBn ? 'দাতা' : 'Seller'}</th>
                    <th className="py-2">{isBn ? 'গ্রহীতা' : 'Buyer'}</th>
                    <th className="py-2 text-right">{isBn ? 'অংশ (%)' : 'Share (%)'}</th>
                    <th className="py-2 text-right">{isBn ? 'নামজারি' : 'Mutation'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {scenario.history.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setHighlightedId(tx.id)}
                      className={`cursor-pointer hover:bg-[#EFF8F2] dark:hover:bg-[#1A3024] transition-colors ${
                        highlightedId === tx.id ? 'bg-[#EFF8F2] dark:bg-[#1A3024] font-bold' : ''
                      }`}
                    >
                      <td className="py-2.5 font-mono text-neutral-700 dark:text-neutral-300">
                        {tx.deedNo}
                      </td>
                      <td className="py-2.5 font-mono">{tx.deedDate}</td>
                      <td className="py-2.5">{isBn ? tx.sellerNameBn : tx.sellerNameEn}</td>
                      <td className="py-2.5">{isBn ? tx.buyerNameBn : tx.buyerNameEn}</td>
                      <td className="py-2.5 text-right font-mono tabular-nums">{tx.sharePercentage}%</td>
                      <td className="py-2.5 text-right font-mono text-[11px]">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold ${
                            tx.mutationStatus === 'MUTATED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {tx.mutationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (5 Cols): Synchronized Transaction Timeline */}
        <div className="lg:col-span-5 bg-white dark:bg-[#14241B] rounded-3xl border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs p-5 flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
            <h3 className="text-xs font-bold text-[#126B3A] dark:text-[#38C172] flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{t.p3TimelineTab}</span>
            </h3>
            {highlightedId && (
              <button
                onClick={() => setHighlightedId(null)}
                className="text-[11px] text-neutral-400 hover:text-neutral-700 underline"
              >
                {isBn ? 'রিসেট' : 'Reset'}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Timeline Root Event */}
            <div
              onClick={() => setHighlightedId('ROOT_OWNER')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                highlightedId === 'ROOT_OWNER'
                  ? 'border-[#126B3A] bg-[#EFF8F2] dark:bg-[#1A3024]'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0D1812]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span>{isBn ? 'মূল জরিপ রেকর্ড' : 'Survey Record'}</span>
                <span>{scenario.khatianNo}</span>
              </div>
              <div className="text-xs font-bold mt-1">
                {isBn ? scenario.initialRecordedOwnerBn : scenario.initialRecordedOwnerEn}
              </div>
              <div className="text-[11px] text-[#126B3A] dark:text-[#38C172] font-semibold mt-0.5">
                {isBn ? 'রেকর্ডীয় অংশ: ১০০%' : 'Recorded Share: 100%'} ({scenario.totalAreaAcre} {isBn ? 'একর' : 'Acre'})
              </div>
            </div>

            {/* Historical Transfers */}
            {scenario.history.map((tx) => {
              const isSel = highlightedId === tx.id;
              return (
                <div
                  key={tx.id}
                  onClick={() => setHighlightedId(tx.id)}
                  className={`relative pl-4 border-l-2 cursor-pointer transition-all ${
                    isSel ? 'border-blue-600' : 'border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-white dark:bg-[#14241B] border-2 border-[#126B3A]" />
                  <div
                    className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                      isSel
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14241B]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                      <span>{tx.deedNo}</span>
                      <span>{tx.deedDate}</span>
                    </div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      {isBn ? tx.sellerNameBn : tx.sellerNameEn}{' '}
                      <ArrowRight className="inline w-3 h-3 mx-1 text-neutral-400" />{' '}
                      {isBn ? tx.buyerNameBn : tx.buyerNameEn}
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                      <span className="font-bold text-[#126B3A] dark:text-[#38C172]">
                        {tx.sharePercentage}% ({tx.transferredAreaAcre} {isBn ? 'একর' : 'Acre'})
                      </span>
                      <span className="text-neutral-400">{tx.mutationKhatianNo}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Proposed Transaction in Timeline */}
            <div
              onClick={() => setHighlightedId('PROPOSED_TRANSFER')}
              className={`relative pl-4 border-l-2 border-dashed cursor-pointer transition-all ${
                verificationResult.isOverAllocated ? 'border-red-500' : 'border-blue-500'
              }`}
            >
              <div
                className={`absolute -left-[7px] top-2 w-3 h-3 rounded-full border-2 ${
                  verificationResult.isOverAllocated
                    ? 'border-red-600 bg-red-100'
                    : 'border-blue-600 bg-blue-100'
                }`}
              />
              <div
                className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                  verificationResult.isOverAllocated
                    ? 'border-red-300 bg-red-50/70 dark:bg-red-950/30 shadow-xs'
                    : 'border-blue-300 bg-blue-50/70 dark:bg-blue-950/30 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span
                    className={
                      verificationResult.isOverAllocated
                        ? 'text-red-700 dark:text-red-400'
                        : 'text-blue-700 dark:text-blue-400'
                    }
                  >
                    {isBn ? 'নতুন প্রস্তাবিত লেনদেন' : 'New Proposed Transfer'}
                  </span>
                  <span className="font-mono text-neutral-500">{proposedDate}</span>
                </div>
                <div className="text-neutral-800 dark:text-neutral-200">
                  {isBn ? 'প্রস্তাবিত বিক্রয় অংশ:' : 'Proposed Share:'}{' '}
                  <strong className="font-mono">{proposedShare}%</strong>
                </div>
                {verificationResult.isOverAllocated ? (
                  <div className="text-[11px] text-red-600 font-bold">
                    {isBn
                      ? `⚠️ অবশিষ্ট অংশের চেয়ে ${verificationResult.overAllocationDelta}% বেশি বরাদ্দ!`
                      : `⚠️ Exceeds recorded remaining balance by ${verificationResult.overAllocationDelta}%!`}
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-600 font-medium">
                    {isBn ? '✓ অবশিষ্ট অংশের ভারসাম্য সামঞ্জস্যপূর্ণ' : '✓ Balance within recorded share'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Transaction What-If Simulator Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#126B3A] dark:text-[#38C172]" />
            <h3 className="text-sm font-bold text-[#126B3A] dark:text-[#38C172]">
              {t.p3WhatIfTitle}
            </h3>
          </div>
          <span className="text-xs text-neutral-500">
            {isBn ? 'অবশিষ্ট রেকর্ডীয় অংশ' : 'Recorded Balance:'}{' '}
            <strong className="font-mono text-[#126B3A] dark:text-[#38C172]">
              {verificationResult.remainingCalculatedShare}%
            </strong>
          </span>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">
          {t.p3WhatIfDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Proposed Share Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {t.p3ProposedShare}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={proposedShare}
              onChange={(e) => setProposedShare(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-sm font-mono text-[#202923] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
            />
          </div>

          {/* Computed Acreage */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {t.p3ProposedArea}
            </label>
            <input
              type="text"
              readOnly
              value={`${((proposedShare / 100) * scenario.totalAreaAcre).toFixed(2)} ${isBn ? 'একর' : 'Acre'}`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#1E3024] text-sm font-mono text-neutral-700 dark:text-neutral-300 select-none"
            />
          </div>

          {/* Proposed Date */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {t.p3ProposedDate}
            </label>
            <input
              type="date"
              value={proposedDate}
              onChange={(e) => setProposedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-sm font-mono text-[#202923] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
            />
          </div>
        </div>

        {/* Calculation Output Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#EFF8F2] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024] text-xs">
          <div>
            <span className="text-neutral-500 block">{isBn ? 'পূর্ববর্তী বিক্রয় মোট' : 'Prior Sold'}</span>
            <span className="font-bold font-mono">{verificationResult.totalPriorTransferredShare}%</span>
          </div>
          <div>
            <span className="text-neutral-500 block">{isBn ? 'বর্তমান অবশিষ্ট অংশ' : 'Remaining Balance'}</span>
            <span className="font-bold font-mono text-[#126B3A] dark:text-[#38C172]">
              {verificationResult.remainingCalculatedShare}%
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block">{isBn ? 'নতুন প্রস্তাবের পর উদ্বৃত্ত' : 'Balance After Proposed'}</span>
            <span
              className={`font-bold font-mono ${
                verificationResult.isOverAllocated ? 'text-red-600 dark:text-red-400' : 'text-emerald-600'
              }`}
            >
              {verificationResult.newBalanceAfterProposed}%
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block">{isBn ? 'বরাদ্দ স্থিতি' : 'Allocation Status'}</span>
            <span
              className={`font-bold ${
                verificationResult.isOverAllocated
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {verificationResult.isOverAllocated
                ? isBn
                  ? `অতিরিক্ত বরাদ্দ (${verificationResult.overAllocationDelta}%)`
                  : `Deficit (${verificationResult.overAllocationDelta}%)`
                : isBn
                ? 'সামঞ্জস্যপূর্ণ'
                : 'Balanced'}
            </span>
          </div>
        </div>
      </div>

      {/* Evidence-Linked Conflict Screening Findings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#126B3A] dark:text-[#38C172]">
            {t.p3FindingsTitle}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              verificationResult.overallStatus === 'CONFLICT'
                ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                : verificationResult.overallStatus === 'REVIEW'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {verificationResult.overallStatus === 'CONFLICT'
              ? t.p3StatusConflict
              : verificationResult.overallStatus === 'REVIEW'
              ? t.p3StatusReview
              : t.p3StatusClear}
          </span>
        </div>

        <div className="space-y-3">
          {verificationResult.findings.map((finding) => (
            <div
              key={finding.ruleId}
              className={`p-5 rounded-2xl border text-xs space-y-2 transition-all ${
                finding.severity === 'CONFLICT'
                  ? 'border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20'
                  : finding.severity === 'REVIEW'
                  ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20'
                  : 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {finding.severity === 'CONFLICT' ? (
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  ) : finding.severity === 'REVIEW' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  <span>{isBn ? finding.titleBn : finding.titleEn}</span>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 border">
                  {finding.ruleId}
                </span>
              </div>

              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-xs">
                {isBn ? finding.reasonBn : finding.reasonEn}
              </p>

              {finding.missingInfoBn && (
                <div className="text-[11px] text-neutral-500 italic">
                  <strong>{isBn ? 'অনুপস্থিত তথ্য:' : 'Missing Information:'}</strong>{' '}
                  {isBn ? finding.missingInfoBn : finding.missingInfoEn}
                </div>
              )}

              <div className="p-3 rounded-xl bg-white dark:bg-[#14241B] border border-neutral-200 dark:border-neutral-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#126B3A] dark:text-[#38C172] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#202923] dark:text-white leading-relaxed">
                  <strong>{isBn ? 'সুপারিশকৃত পরবর্তী পর্যালোচনা:' : 'Recommended Review Step:'}</strong>{' '}
                  {isBn ? finding.recommendedActionBn : finding.recommendedActionEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Narrator Section */}
      <VoiceNarrator textToSpeak={voiceNarrativeText} />

      {/* Evidence Report Modal with PDF Download */}
      <EvidenceReportModal
        result={verificationResult}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
