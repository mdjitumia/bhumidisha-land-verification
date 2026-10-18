/**
 * BhumiDisha (ভূমিদিশা) Type Definitions
 * 100% Synthetic Demo Specifications
 */

export type Locale = 'bn' | 'en';
export type Theme = 'light' | 'dark';
export type Persona = 'citizen' | 'institution' | 'judge';

export interface UserProfile {
  id: string;
  nameBn: string;
  nameEn: string;
  role: Persona;
  mobileMasked: string;
  emailMasked: string;
  nidMasked: string;
  birthRegMasked: string;
  fatherNameBn: string;
  fatherNameEn: string;
  motherNameBn: string;
  motherNameEn: string;
  presentAddressBn: string;
  presentAddressEn: string;
  permanentAddressBn: string;
  permanentAddressEn: string;
  isVerified: boolean; // Always false in demo, labeled explicitly
}

export type ConflictSeverity = 'CONFLICT' | 'REVIEW' | 'CLEAR';

export interface ConflictFinding {
  ruleId: string;
  severity: ConflictSeverity;
  titleBn: string;
  titleEn: string;
  reasonBn: string;
  reasonEn: string;
  affectedDeedIds: string[];
  inputValues: Record<string, string | number>;
  missingInfoBn?: string;
  missingInfoEn?: string;
  recommendedActionBn: string;
  recommendedActionEn: string;
}

export interface TransferEvent {
  id: string;
  parcelId: string;
  deedNo: string;
  deedDate: string;
  sellerId: string;
  sellerNameBn: string;
  sellerNameEn: string;
  buyerId: string;
  buyerNameBn: string;
  buyerNameEn: string;
  sharePercentage: number;
  transferredAreaAcre: number;
  mutationKhatianNo: string;
  mutationStatus: 'MUTATED' | 'PENDING' | 'DISCREPANCY';
  notesBn?: string;
  notesEn?: string;
}

export interface ParcelScenario {
  id: string;
  titleBn: string;
  titleEn: string;
  scenarioType: 'OVER_ALLOCATION' | 'CONFLICTING_TRANSFER' | 'MISSING_RECORDS' | 'CONSISTENT';
  mouzaBn: string;
  mouzaEn: string;
  dagNo: string;
  khatianNo: string;
  jlNo: string;
  totalAreaAcre: number;
  initialRecordedOwnerBn: string;
  initialRecordedOwnerEn: string;
  initialSharePercentage: number;
  summaryBn: string;
  summaryEn: string;
  history: TransferEvent[];
  defaultProposedTransfer: {
    sellerId: string;
    proposedSharePercentage: number;
    proposedAreaAcre: number;
    proposedDate: string;
  };
}

export type DocumentType = 'DEED' | 'KHATIAN' | 'MUTATION' | 'TAX_RECEIPT' | 'SKETCH' | 'OTHER';

export interface WalletDocument {
  id: string;
  parcelId: string;
  docType: DocumentType;
  titleBn: string;
  titleEn: string;
  fileReference: string;
  recordedSha256: string;
  fileSizeKb: number;
  uploadedDate: string;
  status: 'DEMO_ONLY';
  previewTextBn: string;
  previewTextEn: string;
  fileUrl?: string;
  fileType?: string;
  referenceNumber?: string;
  documentDate?: string;
}

export interface WalletParcel {
  id: string;
  parcelCode: string;
  districtBn?: string;
  districtEn?: string;
  upazilaBn?: string;
  upazilaEn?: string;
  mouzaBn: string;
  mouzaEn: string;
  jlNo?: string;
  surveyType?: string; // CS, SA, RS, BS/BRS
  dagNo: string;
  khatianNo: string;
  areaDecimal: number;
  ownershipSharePercent?: number; // e.g. 100%, 50%, etc.
  landClassBn: string;
  landClassEn: string;
  recordedOwnerBn: string;
  recordedOwnerEn: string;
  userNotesBn: string;
  userNotesEn: string;
  plotImageUrl?: string;
  plotImageName?: string;
  documents: WalletDocument[];
}

export interface AssistantFAQ {
  id: string;
  categoryBn: string;
  categoryEn: string;
  questionBn: string;
  questionEn: string;
  shortAnswerBn: string;
  shortAnswerEn: string;
  detailedAnswerBn: string;
  detailedAnswerEn: string;
  sourceNameBn: string;
  sourceNameEn: string;
  sourceUrl: string;
  isMockDemo: boolean;
}

export interface CitizenChecklistItem {
  id: string;
  titleBn: string;
  titleEn: string;
  reasonBn: string;
  reasonEn: string;
  officialRefBn: string;
  officialRefEn: string;
  completed: boolean;
  helpTextBn: string;
  helpTextEn: string;
}
