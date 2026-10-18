import { VerificationResult } from './verificationService';

export class ReportService {
  /**
   * Generates and downloads a CSV export of the verification findings
   */
  public static downloadCsv(result: VerificationResult, locale: 'bn' | 'en') {
    const isBn = locale === 'bn';
    const lines: string[] = [];

    lines.push('BHUMIDISHA SYNTHETIC AUDIT REPORT (DEMO ONLY)');
    lines.push(`Generated At,${new Date().toISOString()}`);
    lines.push(`Disclaimer,"ALL DATA IS SYNTHETIC DEMONSTRATION DATA - NOT OFFICIAL GOVERNMENT RECORD"`);
    lines.push('');
    lines.push('PARCEL METRICS');
    lines.push(`Scenario,${isBn ? result.scenario.titleBn : result.scenario.titleEn}`);
    lines.push(`Dag No,${result.scenario.dagNo}`);
    lines.push(`Khatian No,${result.scenario.khatianNo}`);
    lines.push(`Mouza,${isBn ? result.scenario.mouzaBn : result.scenario.mouzaEn}`);
    lines.push(`Total Area (Acre),${result.scenario.totalAreaAcre}`);
    lines.push(`Recorded Initial Share,${result.initialRecordedShare}%`);
    lines.push(`Total Prior Transferred,${result.totalPriorTransferredShare}%`);
    lines.push(`Calculated Remaining Share,${result.remainingCalculatedShare}%`);
    lines.push(`Proposed Transfer Share,${result.proposedShare}%`);
    lines.push(`Balance After Proposed,${result.newBalanceAfterProposed}%`);
    lines.push(`Over-Allocation Deficit,${result.overAllocationDelta}%`);
    lines.push(`Overall Status,${result.overallStatus}`);
    lines.push('');
    lines.push('TRANSACTION HISTORY');
    lines.push('Deed No,Date,From Seller,To Buyer,Share (%),Mutation Status');
    result.scenario.history.forEach((tx) => {
      lines.push(
        `"${tx.deedNo}","${tx.deedDate}","${isBn ? tx.sellerNameBn : tx.sellerNameEn}","${
          isBn ? tx.buyerNameBn : tx.buyerNameEn
        }","${tx.sharePercentage}%","${tx.mutationStatus}"`
      );
    });
    lines.push('');
    lines.push('FINDINGS & RECOMMENDATIONS');
    lines.push('Rule ID,Severity,Title,Reason,Recommended Action');
    result.findings.forEach((f) => {
      lines.push(
        `"${f.ruleId}","${f.severity}","${isBn ? f.titleBn : f.titleEn}","${
          isBn ? f.reasonBn : f.reasonEn
        }","${isBn ? f.recommendedActionBn : f.recommendedActionEn}"`
      );
    });

    const csvContent = '\uFEFF' + lines.join('\n'); // UTF-8 BOM for Excel Bangla support
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bhumidisha_audit_${result.scenario.dagNo}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Invokes print dialog for clean print-to-PDF
   */
  public static printReport() {
    window.print();
  }
}
