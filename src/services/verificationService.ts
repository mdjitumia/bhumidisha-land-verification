import { ParcelScenario, ConflictFinding, ConflictSeverity } from '../types';

export interface VerificationResult {
  scenario: ParcelScenario;
  initialRecordedShare: number;
  totalPriorTransferredShare: number;
  remainingCalculatedShare: number;
  proposedShare: number;
  newBalanceAfterProposed: number;
  isOverAllocated: boolean;
  overAllocationDelta: number;
  findings: ConflictFinding[];
  overallStatus: ConflictSeverity;
  calculationAssumptionsBn: string[];
  calculationAssumptionsEn: string[];
}

export class VerificationService {
  /**
   * Deterministic screening against synthetic land records
   */
  public static analyzeScenario(
    scenario: ParcelScenario,
    proposedTransfer?: {
      sellerId: string;
      proposedSharePercentage: number;
      proposedAreaAcre: number;
      proposedDate: string;
    }
  ): VerificationResult {
    const activeProposed = proposedTransfer || scenario.defaultProposedTransfer;
    const initialShare = scenario.initialSharePercentage;

    // Calculate sum of prior transfers
    const totalPriorTransferredShare = scenario.history.reduce(
      (sum, tx) => sum + tx.sharePercentage,
      0
    );

    // Remaining share based on current ledger
    const remainingCalculatedShare = Math.max(0, initialShare - totalPriorTransferredShare);
    const newBalanceAfterProposed = remainingCalculatedShare - activeProposed.proposedSharePercentage;
    const isOverAllocated = newBalanceAfterProposed < 0;
    const overAllocationDelta = isOverAllocated ? Math.abs(newBalanceAfterProposed) : 0;

    const findings: ConflictFinding[] = [];

    // Rule 1: Ownership-Share Over-Allocation Check
    if (isOverAllocated) {
      findings.push({
        ruleId: 'RULE-BD-101',
        severity: 'CONFLICT',
        titleBn: 'মালিকানা অংশের অতিরিক্ত বরাদ্দ ঝুঁকি চিহ্নিত (Share Over-Allocation)',
        titleEn: 'Ownership-Share Over-Allocation Risk Detected',
        reasonBn: `রেকর্ডীয় মূল মালিকানা ১০০% থেকে পূর্বের হস্তান্তর (৩০% + ৪০% = ৭০%) বাদ দিলে অবশিষ্ট থাকে ৩০%। নতুন প্রস্তাবিত ${activeProposed.proposedSharePercentage}% হস্তান্তর অবশিষ্ট রেকর্ডকৃত অংশের চেয়ে ${overAllocationDelta.toFixed(1)} শতাংশ পয়েন্ট বেশি।`,
        reasonEn: `From 100% recorded title, prior transfers (30% + 40% = 70%) leave a calculated balance of 30%. The proposed ${activeProposed.proposedSharePercentage}% transfer exceeds recorded remaining share by ${overAllocationDelta.toFixed(1)} percentage points.`,
        affectedDeedIds: scenario.history.map((h) => h.deedNo),
        inputValues: {
          initialRecordedShare: initialShare,
          totalPriorTransferred: totalPriorTransferredShare,
          calculatedRemaining: remainingCalculatedShare,
          proposedTransfer: activeProposed.proposedSharePercentage,
          overAllocationDelta: overAllocationDelta,
        },
        missingInfoBn: 'বিক্রেতার অন্য কোনো অনিবন্ধিত খতিয়ান বা উত্তরাধিকার হিস্যার সরকারি প্রমাণ ডাটাবেজে নেই।',
        missingInfoEn: 'No unindexed heirship deeds or additional registered khatians are present in synthetic ledger.',
        recommendedActionBn: 'উপজেলা সাব-রেজিস্ট্রি রেকর্ড ও সহকারী কমিশনার (ভূমি) অফিসে নামজারি রেজিস্টার পরীক্ষা করুন।',
        recommendedActionEn: 'Conduct manual verification of Volume Registers at Sub-Registry and AC Land office.',
      });
    }

    // Rule 2: Conflicting Transfer / Overlapping Sale Check
    if (scenario.scenarioType === 'CONFLICTING_TRANSFER') {
      const deeds = scenario.history.map((h) => h.deedNo);
      findings.push({
        ruleId: 'RULE-BD-102',
        severity: 'CONFLICT',
        titleBn: 'পরস্পরবিরোধী হস্তান্তর / দ্বৈত বিক্রয় সম্ভাবনা (Conflicting Transfer)',
        titleEn: 'Conflicting Transfer / Potential Overlapping Sale Detected',
        reasonBn: 'একই দাগের একই ৫০% অংশের জন্য দুটি পৃথক ক্রেতার অনুকূলে পূর্বাপর বাতিলের প্রমাণ ছাড়াই হস্তান্তর রেকর্ড পাওয়া গেছে।',
        reasonEn: 'Conflicting registered deeds for the identical 50% plot share are indexed for two distinct buyers without prior deed cancellation.',
        affectedDeedIds: deeds,
        inputValues: {
          conflictingDeeds: deeds.join(', '),
          targetShare: '50%',
        },
        missingInfoBn: 'পূর্ববর্তী দলিলের দেওয়ানি বাতিলের রায় বা নোটারি এফিডেভিট অনুপস্থিত।',
        missingInfoEn: 'Civil court cancellation decree or registered deed of cancellation is missing.',
        recommendedActionBn: 'বিজ্ঞ দেওয়ানি আইনজীবীর মাধ্যমে তল্লাশিসহ সাব-রেজিস্ট্রারের সূচিবহি পরীক্ষা করতে হবে।',
        recommendedActionEn: 'Engage civil land lawyer to inspect index books and verify chain of title.',
      });
    }

    // Rule 3: Missing Records / Mutation Gap
    const pendingMutations = scenario.history.filter(
      (h) => h.mutationStatus === 'PENDING' || h.mutationStatus === 'DISCREPANCY'
    );
    if (pendingMutations.length > 0 || scenario.scenarioType === 'MISSING_RECORDS') {
      findings.push({
        ruleId: 'RULE-BD-103',
        severity: 'REVIEW',
        titleBn: 'নামজারি ও রেকর্ডের অমিল / ঘাটতি (Mutation Gap)',
        titleEn: 'Mutation Gap / Missing Government Record',
        reasonBn: 'দলিল নম্বর DEED-2022-808 এর অনুকূলে ডিজিটাল নামজারি খতিয়ান ডাটাবেজে অন্তর্ভুক্ত নেই। দলিল কার্যকর হলেও রেকর্ড হালনাগাদ করা হয়নি।',
        reasonEn: 'Deed DEED-2022-808 lacks a corresponding computerized mutation khatian index in government ledger.',
        affectedDeedIds: pendingMutations.map((p) => p.deedNo),
        inputValues: {
          pendingDeedCount: pendingMutations.length,
          expectedDoc: 'E-Mutation Khatian',
        },
        missingInfoBn: 'সহকারী কমিশনার (ভূমি) এর মিসকেস নম্বর ও জমাখারিজ আদেশ অনুপস্থিত।',
        missingInfoEn: 'AC Land Miss-Case order sheet and split-record DCR reference missing.',
        recommendedActionBn: 'সংশ্লিষ্ট ইউনিয়ন ভূমি অফিসে মূল রেকর্ড বহি যাচাই করে নামজারি নিষ্পত্তির আবেদন করুন।',
        recommendedActionEn: 'Inquire with Union Land Office and inspect original Record Room registers.',
      });
    }

    // Rule 4: Clean Baseline
    if (findings.length === 0) {
      findings.push({
        ruleId: 'RULE-BD-100',
        severity: 'CLEAR',
        titleBn: 'উপলব্ধ সিন্থেটিক ডাটাতে কোনো গাণিতিক অমিল নেই (No Discrepancy Found)',
        titleEn: 'No Conflict Found in Available Synthetic Data',
        reasonBn: 'পূর্ববর্তী হস্তান্তরের পর রেকর্ডীয় অংশ পর্যাপ্ত রয়েছে এবং নামজারি রেকর্ড নিয়মিতভাবে সম্পন্ন।',
        reasonEn: 'Historical transfers match recorded ledger math, and mutation status is consistent with recorded shares.',
        affectedDeedIds: scenario.history.map((h) => h.deedNo),
        inputValues: {
          remainingCalculatedShare: remainingCalculatedShare,
          proposedTransfer: activeProposed.proposedSharePercentage,
        },
        recommendedActionBn: 'চূড়ান্ত বায়নার পূর্বে সরেজমিনে সীমানা ও দখল নিশ্চিত করে চুক্তি সম্পাদন করুন।',
        recommendedActionEn: 'Conduct physical ground survey of corner pillars before final deed registration.',
      });
    }

    // Overall status priority: CONFLICT > REVIEW > CLEAR
    let overallStatus: ConflictSeverity = 'CLEAR';
    if (findings.some((f) => f.severity === 'CONFLICT')) {
      overallStatus = 'CONFLICT';
    } else if (findings.some((f) => f.severity === 'REVIEW')) {
      overallStatus = 'REVIEW';
    }

    const calculationAssumptionsBn = [
      '১. হিসেবটি শুধুমাত্র এই ডেমো সিস্টেমে অন্তর্ভুক্ত সিন্থেটিক দলিলের উপর ভিত্তি করে তৈরি।',
      '২. অনিবন্ধিত বা অফলাইন উত্তরাধিকারী বণ্টননামা এই ডাটাবেজে অন্তর্ভুক্ত নয়।',
      '৩. ফলাফলটি স্বয়ংক্রিয় স্ক্রিনিং সহায়তা মাত্র; কোনো আইনি স্বত্ব নিশ্চিতকরণ বা আদালতের রায় নয়।',
    ];

    const calculationAssumptionsEn = [
      '1. Calculations rely strictly on indexed synthetic demo records.',
      '2. Unregistered inheritance settlements or unindexed volume entries are not assumed.',
      '3. Results are heuristic screening flags and do not constitute a legal title guarantee or court decree.',
    ];

    return {
      scenario,
      initialRecordedShare: initialShare,
      totalPriorTransferredShare,
      remainingCalculatedShare,
      proposedShare: activeProposed.proposedSharePercentage,
      newBalanceAfterProposed,
      isOverAllocated,
      overAllocationDelta,
      findings,
      overallStatus,
      calculationAssumptionsBn,
      calculationAssumptionsEn,
    };
  }
}
