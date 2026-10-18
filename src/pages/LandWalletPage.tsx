import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WalletParcel, WalletDocument, DocumentType } from '../types';
import { WalletService } from '../services/walletService';
import { WalletStore } from '../services/walletStore';
import { ViewOnlyShareModal } from '../components/ViewOnlyShareModal';
import { SharedParcelView } from './SharedParcelView';
import {
  FolderLock,
  FileText,
  Share2,
  CheckCircle2,
  AlertCircle,
  Hash,
  Upload,
  Eye,
  ShieldCheck,
  FileCheck,
  Plus,
  ArrowLeft,
  Trash2,
  Edit2,
  X,
  Image as ImageIcon,
  Check,
  HelpCircle,
  FileCode,
  AlertTriangle,
} from 'lucide-react';

export const LandWalletPage: React.FC = () => {
  const { locale, t, setActiveTab, isLoggedIn, showToast } = useApp();
  const isBn = locale === 'bn';

  // In-memory parcels managed by session WalletStore
  const [parcels, setParcels] = useState<WalletParcel[]>(() => WalletStore.getParcels());
  const [selectedParcelId, setSelectedParcelId] = useState<string>(() => {
    const list = WalletStore.getParcels();
    return list.length > 0 ? list[0].id : '';
  });

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = WalletStore.subscribe(() => {
      const updated = WalletStore.getParcels();
      setParcels(updated);
      if (updated.length > 0 && !updated.some((p) => p.id === selectedParcelId)) {
        setSelectedParcelId(updated[0].id);
      }
    });
    return unsubscribe;
  }, [selectedParcelId]);

  // Current active parcel
  const parcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Document preview state
  const [activePreviewDoc, setActivePreviewDoc] = useState<WalletDocument | null>(null);

  // Sharing modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Active Shared View simulation
  const [sharedViewerState, setSharedViewerState] = useState<{
    token: string;
    passcode: string | null;
    expiresAt: string;
    parcel: WalletParcel;
  } | null>(null);

  // Web Crypto SHA-256 Interactive verification tool state
  const [hashTestDoc, setHashTestDoc] = useState<WalletDocument | null>(null);
  const [computedHash, setComputedHash] = useState<string>('');
  const [hashStatus, setHashStatus] = useState<'IDLE' | 'MATCHED' | 'MISMATCH'>('IDLE');
  const [isHashing, setIsHashing] = useState(false);

  // Sync default hash test doc when active parcel changes
  useEffect(() => {
    if (parcel && parcel.documents && parcel.documents.length > 0) {
      setHashTestDoc(parcel.documents[0]);
    } else {
      setHashTestDoc(null);
    }
    setHashStatus('IDLE');
    setComputedHash('');
  }, [selectedParcelId, parcel?.documents?.length]);

  // ---------------- MODAL STATES ----------------
  // Add Parcel Modal
  const [isAddParcelModalOpen, setIsAddParcelModalOpen] = useState(false);
  const [addParcelStep, setAddParcelStep] = useState<1 | 2>(1);
  const [newParcelForm, setNewParcelForm] = useState({
    district: 'ঢাকা',
    upazila: 'সাভার',
    mouza: '',
    jlNo: '',
    surveyType: 'বিএস (BS)',
    khatianNo: '',
    dagNo: '',
    areaDecimal: '',
    ownershipSharePercent: '১০০',
    landClass: 'নাল / কৃষি জমি',
    userNotes: '',
    plotImage: '' as string,
    plotImageName: '' as string,
  });

  // Edit Parcel Modal
  const [isEditParcelModalOpen, setIsEditParcelModalOpen] = useState(false);
  const [editParcelForm, setEditParcelForm] = useState({
    district: '',
    upazila: '',
    mouza: '',
    jlNo: '',
    surveyType: '',
    khatianNo: '',
    dagNo: '',
    areaDecimal: '',
    ownershipSharePercent: '',
    landClass: '',
    userNotes: '',
  });

  // Delete Parcel Confirmation
  const [isDeleteParcelConfirmOpen, setIsDeleteParcelConfirmOpen] = useState(false);

  // Add Document Modal
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [newDocForm, setNewDocForm] = useState<{
    targetParcelId: string;
    docType: DocumentType;
    title: string;
    referenceNumber: string;
    documentDate: string;
    file: File | null;
    fileName: string;
    fileSizeKb: number;
    previewText: string;
  }>({
    targetParcelId: parcel?.id || '',
    docType: 'DEED',
    title: '',
    referenceNumber: '',
    documentDate: '',
    file: null,
    fileName: '',
    fileSizeKb: 0,
    previewText: '',
  });

  // Delete Document Confirmation
  const [docToDelete, setDocToDelete] = useState<{ parcelId: string; docId: string; title: string } | null>(null);

  // Plot Image Full Preview Modal
  const [plotImagePreviewUrl, setPlotImagePreviewUrl] = useState<string | null>(null);

  // ---------------- DYNAMIC DOCUMENT CHECKLIST CALCULATION ----------------
  // Requirement 6.E: Calculated dynamically from documents actually associated with the selected parcel!
  const hasDeed = Boolean(parcel?.documents?.some((d) => d.docType === 'DEED'));
  const hasKhatian = Boolean(parcel?.documents?.some((d) => d.docType === 'KHATIAN'));
  const hasMutation = Boolean(parcel?.documents?.some((d) => d.docType === 'MUTATION'));
  const hasTaxReceipt = Boolean(parcel?.documents?.some((d) => d.docType === 'TAX_RECEIPT'));

  const completedCount = [hasDeed, hasKhatian, hasMutation, hasTaxReceipt].filter(Boolean).length;
  const totalRequired = 4;
  const isAllComplete = completedCount === totalRequired;

  // Optional/supporting documents (SKETCH or OTHER)
  const optionalDocs = parcel?.documents?.filter((d) => d.docType === 'SKETCH' || d.docType === 'OTHER') || [];

  // ---------------- ACTION HANDLERS ----------------

  // SHA-256 Check handler
  const runHashCheck = async (doc: WalletDocument, simulateTamper = false) => {
    setIsHashing(true);
    setHashTestDoc(doc);

    try {
      const textToHash = simulateTamper
        ? (doc.previewTextBn || doc.titleBn) + ' [TAMPERED_CONTENT_TEST]'
        : (doc.previewTextBn || doc.titleBn);

      const hash = await WalletService.computeTextSha256(textToHash);
      setComputedHash(hash);

      const verification = WalletService.verifyHashIntegrity(hash, doc.recordedSha256);
      setHashStatus(verification.isMatch ? 'MATCHED' : 'MISMATCH');
    } catch {
      setHashStatus('MISMATCH');
    } finally {
      setIsHashing(false);
    }
  };

  const handleLocalFileHash = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsHashing(true);
    try {
      const hash = await WalletService.computeFileSha256(file);
      setComputedHash(hash);
      if (hashTestDoc) {
        const verification = WalletService.verifyHashIntegrity(hash, hashTestDoc.recordedSha256);
        setHashStatus(verification.isMatch ? 'MATCHED' : 'MISMATCH');
      } else {
        setHashStatus('IDLE');
      }
      showToast(
        isBn
          ? `ব্রাউজারে SHA-256 গণনা সম্পন্ন: ${hash.substring(0, 14)}...`
          : `Computed local SHA-256: ${hash.substring(0, 14)}...`
      );
    } catch {
      showToast(isBn ? 'হ্যাশ গণনায় সমস্যা হয়েছে' : 'Failed to compute file hash');
    } finally {
      setIsHashing(false);
    }
  };

  // Open Add Parcel Modal
  const handleOpenAddParcel = () => {
    setNewParcelForm({
      district: 'ঢাকা',
      upazila: 'সাভার',
      mouza: '',
      jlNo: '',
      surveyType: 'বিএস (BS)',
      khatianNo: '',
      dagNo: '',
      areaDecimal: '',
      ownershipSharePercent: '১০০',
      landClass: 'নাল / কৃষি জমি',
      userNotes: '',
      plotImage: '',
      plotImageName: '',
    });
    setAddParcelStep(1);
    setIsAddParcelModalOpen(true);
  };

  // Handle Plot Image selection for Add Parcel (Step 2)
  const handlePlotImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast(isBn ? 'অনুগ্রহ করে একটি ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন' : 'Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast(isBn ? 'ছবির আকার সর্বোচ্চ ৫ মেগাবাইট হতে হবে' : 'Image size must be under 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setNewParcelForm((prev) => ({
      ...prev,
      plotImage: previewUrl,
      plotImageName: file.name,
    }));
  };

  // Submit Add Parcel
  const handleSaveParcel = () => {
    if (!newParcelForm.dagNo.trim() && !newParcelForm.khatianNo.trim() && !newParcelForm.mouza.trim()) {
      showToast(isBn ? 'অনুগ্রহ করে অন্তত দাগ, খতিয়ান বা মৌজার নাম প্রদান করুন' : 'Please provide Dag, Khatian or Mouza name');
      return;
    }

    const uniqueId = `PRCL-USER-${Date.now().toString().slice(-6)}`;
    const parsedArea = parseFloat(newParcelForm.areaDecimal) || 0;
    const parsedShare = parseFloat(newParcelForm.ownershipSharePercent) || 100;

    const createdParcel: WalletParcel = {
      id: uniqueId,
      parcelCode: `PRCL-REG-${Date.now().toString().slice(-4)}`,
      districtBn: newParcelForm.district || 'ঢাকা',
      districtEn: 'Dhaka',
      upazilaBn: newParcelForm.upazila || 'সাভার',
      upazilaEn: 'Savar',
      mouzaBn: newParcelForm.mouza || (isBn ? 'অনুলিখিত মৌজা' : 'Custom Mouza'),
      mouzaEn: newParcelForm.mouza || 'Custom Mouza',
      jlNo: newParcelForm.jlNo || '–',
      surveyType: newParcelForm.surveyType || 'BS',
      dagNo: newParcelForm.dagNo || '–',
      khatianNo: newParcelForm.khatianNo || '–',
      areaDecimal: parsedArea,
      ownershipSharePercent: parsedShare,
      landClassBn: newParcelForm.landClass || (isBn ? 'নাল জমি' : 'Agricultural'),
      landClassEn: 'Recorded Plot',
      recordedOwnerBn: isBn ? 'নাগরিক ব্যবহারকারী (স্বত্বাধিকারী)' : 'Citizen User (Recorded Owner)',
      recordedOwnerEn: 'Citizen User (Recorded Owner)',
      userNotesBn: newParcelForm.userNotes || (isBn ? 'ব্যবহারকারী কর্তৃক যুক্তকৃত নিজস্ব জমির রেকর্ড।' : 'User added parcel record.'),
      userNotesEn: newParcelForm.userNotes || 'User added parcel record.',
      plotImageUrl: newParcelForm.plotImage || undefined,
      plotImageName: newParcelForm.plotImageName || undefined,
      documents: [],
    };

    WalletStore.addParcel(createdParcel);
    setSelectedParcelId(createdParcel.id);
    setIsAddParcelModalOpen(false);
    showToast(isBn ? 'নতুন জমি সফলভাবে ওয়ালেটে সংরক্ষিত হয়েছে!' : 'New parcel successfully added to wallet!');
  };

  // Open Edit Parcel Modal
  const handleOpenEditParcel = () => {
    if (!parcel) return;
    setEditParcelForm({
      district: parcel.districtBn || 'ঢাকা',
      upazila: parcel.upazilaBn || 'সাভার',
      mouza: isBn ? parcel.mouzaBn : parcel.mouzaEn,
      jlNo: parcel.jlNo || '',
      surveyType: parcel.surveyType || 'বিএস (BS)',
      khatianNo: parcel.khatianNo,
      dagNo: parcel.dagNo,
      areaDecimal: parcel.areaDecimal.toString(),
      ownershipSharePercent: (parcel.ownershipSharePercent ?? 100).toString(),
      landClass: isBn ? parcel.landClassBn : parcel.landClassEn,
      userNotes: isBn ? parcel.userNotesBn : parcel.userNotesEn,
    });
    setIsEditParcelModalOpen(true);
  };

  // Submit Edit Parcel
  const handleSaveEditParcel = () => {
    if (!parcel) return;
    WalletStore.updateParcel(parcel.id, {
      districtBn: editParcelForm.district,
      upazilaBn: editParcelForm.upazila,
      mouzaBn: editParcelForm.mouza,
      mouzaEn: editParcelForm.mouza,
      jlNo: editParcelForm.jlNo,
      surveyType: editParcelForm.surveyType,
      dagNo: editParcelForm.dagNo,
      khatianNo: editParcelForm.khatianNo,
      areaDecimal: parseFloat(editParcelForm.areaDecimal) || parcel.areaDecimal,
      ownershipSharePercent: parseFloat(editParcelForm.ownershipSharePercent) || parcel.ownershipSharePercent,
      landClassBn: editParcelForm.landClass,
      userNotesBn: editParcelForm.userNotes,
      userNotesEn: editParcelForm.userNotes,
    });
    setIsEditParcelModalOpen(false);
    showToast(isBn ? 'জমির তথ্য আপডেট করা হয়েছে!' : 'Parcel details updated!');
  };

  // Handle Delete Parcel
  const handleDeleteParcel = () => {
    if (!parcel) return;
    WalletStore.deleteParcel(parcel.id);
    setIsDeleteParcelConfirmOpen(false);
    showToast(isBn ? 'জমি সফলভাবে মুছে ফেলা হয়েছে' : 'Parcel deleted');
  };

  // Plot Image direct update/replace for active parcel
  const handleDirectPlotImageUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !parcel) return;

    if (!file.type.startsWith('image/')) {
      showToast(isBn ? 'অনুগ্রহ করে ছবি ফাইল নির্বাচন করুন' : 'Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast(isBn ? 'ছবির আকার সর্বোচ্চ ৫ মেগাবাইট' : 'Max image size is 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    WalletStore.updateParcel(parcel.id, {
      plotImageUrl: previewUrl,
      plotImageName: file.name,
    });
    showToast(isBn ? 'প্লটের ছবি যুক্ত করা হয়েছে!' : 'Plot image attached!');
  };

  const handleRemovePlotImage = () => {
    if (!parcel) return;
    if (parcel.plotImageUrl && parcel.plotImageUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(parcel.plotImageUrl);
      } catch {
        // ignore
      }
    }
    WalletStore.updateParcel(parcel.id, {
      plotImageUrl: undefined,
      plotImageName: undefined,
    });
    showToast(isBn ? 'প্লটের ছবি মুছে ফেলা হয়েছে' : 'Plot image removed');
  };

  // Open Add Document Modal
  const handleOpenAddDoc = () => {
    setNewDocForm({
      targetParcelId: parcel?.id || '',
      docType: 'DEED',
      title: '',
      referenceNumber: '',
      documentDate: '',
      file: null,
      fileName: '',
      fileSizeKb: 0,
      previewText: '',
    });
    setIsAddDocModalOpen(true);
  };

  // Handle File selection for new document
  const handleDocFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast(isBn ? 'শুধুমাত্র PDF, JPEG, PNG ও WebP ফাইল গ্রহণযোগ্য' : 'Only PDF, JPEG, PNG and WebP files allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast(isBn ? 'ফাইলের আকার সর্বোচ্চ ১০ মেগাবাইট হতে হবে' : 'File must be under 10MB');
      return;
    }

    const sizeKb = Math.round(file.size / 1024);
    const previewUrl = URL.createObjectURL(file);

    setNewDocForm((prev) => ({
      ...prev,
      file,
      fileName: file.name,
      fileSizeKb: sizeKb,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      previewText: `${file.name} (আকার: ${sizeKb} KB, ধরন: ${file.type})`,
    }));
  };

  // Submit Add Document
  const handleSaveDocument = async () => {
    if (!newDocForm.title.trim()) {
      showToast(isBn ? 'অনুগ্রহ করে দলিলের নাম প্রদান করুন' : 'Please enter document title');
      return;
    }

    const targetParcel = parcels.find((p) => p.id === newDocForm.targetParcelId) || parcel;
    if (!targetParcel) return;

    let computedDocHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    let fileBlobUrl = '';

    if (newDocForm.file) {
      try {
        computedDocHash = await WalletService.computeFileSha256(newDocForm.file);
        fileBlobUrl = URL.createObjectURL(newDocForm.file);
      } catch {
        computedDocHash = await WalletService.computeTextSha256(newDocForm.title + Date.now());
      }
    } else {
      computedDocHash = await WalletService.computeTextSha256(newDocForm.title + (newDocForm.referenceNumber || 'REF'));
    }

    const uniqueDocId = `DOC-USER-${Date.now().toString().slice(-5)}`;
    const createdDoc: WalletDocument = {
      id: uniqueDocId,
      parcelId: targetParcel.id,
      docType: newDocForm.docType,
      titleBn: newDocForm.title,
      titleEn: newDocForm.title,
      fileReference: newDocForm.referenceNumber || newDocForm.fileName || `doc_${Date.now().toString().slice(-4)}.pdf`,
      recordedSha256: computedDocHash,
      fileSizeKb: newDocForm.fileSizeKb || 450,
      uploadedDate: new Date().toISOString().split('T')[0],
      status: 'DEMO_ONLY',
      previewTextBn: newDocForm.previewText || `নথির সারসংক্ষেপ: ${newDocForm.title}। রেফারেন্স: ${newDocForm.referenceNumber || '–'}।`,
      previewTextEn: `Document metadata: ${newDocForm.title}. Ref: ${newDocForm.referenceNumber || '–'}.`,
      fileUrl: fileBlobUrl || undefined,
      referenceNumber: newDocForm.referenceNumber || undefined,
      documentDate: newDocForm.documentDate || undefined,
    };

    WalletStore.addDocument(targetParcel.id, createdDoc);
    setIsAddDocModalOpen(false);
    showToast(isBn ? 'নথি সফলভাবে সংযুক্ত করা হয়েছে!' : 'Document successfully attached!');
  };

  // Submit Delete Document
  const handleConfirmDeleteDoc = () => {
    if (!docToDelete) return;
    WalletStore.deleteDocument(docToDelete.parcelId, docToDelete.docId);
    setDocToDelete(null);
    showToast(isBn ? 'নথি সফলভাবে মুছে ফেলা হয়েছে' : 'Document removed');
  };

  // If user opened the simulated shared viewer
  if (sharedViewerState) {
    return (
      <SharedParcelView
        parcel={sharedViewerState.parcel}
        token={sharedViewerState.token}
        expiresAt={sharedViewerState.expiresAt}
        onBack={() => setSharedViewerState(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F4F9F5] dark:bg-[#0D1812] transition-colors">
      {/* 1. Header with Back Navigation & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9E7DD] dark:border-[#1E3024] pb-6">
        <div>
          <button
            onClick={() => setActiveTab(isLoggedIn ? 'dashboard' : 'home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-[#126B3A] dark:hover:text-[#38C172] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {isLoggedIn
                ? isBn
                  ? 'ড্যাশবোর্ডে ফিরে যান'
                  : 'Back to Dashboard'
                : isBn
                ? 'হোমপেজে ফিরে যান'
                : 'Back to Home'}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#126B3A] dark:text-[#38C172]">
              {t.walletPageTitle}
            </h1>
          </div>
          <p className="text-xs text-[#66736B] dark:text-[#9FB0A5] mt-1 max-w-2xl leading-relaxed">
            {t.walletSubtitle}
          </p>
        </div>

        {/* Top Action Buttons: + Add Parcel & View-Only Share */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Prominent "+ নতুন জমি যোগ করুন" Button (Requirement 6.A) */}
          <button
            onClick={handleOpenAddParcel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#126B3A] hover:bg-[#0E542D] text-white text-xs font-bold shadow-xs transition-all focus:ring-2 focus:ring-[#126B3A]"
          >
            <Plus className="w-4 h-4" />
            <span>{t.walletAddParcelBtn}</span>
          </button>

          {/* "+ নথি যোগ করুন" Button (Requirement 6.C) */}
          <button
            onClick={handleOpenAddDoc}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#126B3A] text-[#126B3A] dark:border-[#38C172] dark:text-[#38C172] bg-white dark:bg-[#14241B] hover:bg-[#EFF8F2] text-xs font-semibold shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.walletAddDocBtn}</span>
          </button>

          {/* View-Only Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#14241B] text-[#202923] dark:text-[#E4EBE6] hover:bg-[#EFF8F2] text-xs font-semibold shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#126B3A]" />
            <span>{t.walletShareBtn}</span>
          </button>
        </div>
      </div>

      {/* 2. Parcel Selector Strip & Add Parcel Tile */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#126B3A] dark:text-[#38C172]">
            {t.walletSelectParcel} ({parcels.length}টি সংরক্ষিত প্লট)
          </span>
          <button
            onClick={handleOpenAddParcel}
            className="text-xs font-semibold text-[#126B3A] dark:text-[#38C172] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isBn ? 'নতুন জমি যোগ করুন' : 'Add Land'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {parcels.map((p) => {
            const isSelected = selectedParcelId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedParcelId(p.id)}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'border-[#126B3A] bg-white dark:bg-[#14241B] ring-2 ring-[#126B3A] shadow-md'
                    : 'border-[#D9E7DD] dark:border-[#233B2E] bg-white/80 dark:bg-[#14241B]/80 hover:bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#126B3A] dark:text-[#38C172] truncate">
                    {p.parcelCode}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EFF8F2] dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172]">
                      {p.areaDecimal} {isBn ? 'শতাংশ' : 'Decimal'}
                    </span>
                  </div>
                </div>

                <div className="text-base font-bold text-[#202923] dark:text-white mt-1.5 truncate">
                  দাগ: {p.dagNo} · {isBn ? p.mouzaBn : p.mouzaEn}
                </div>

                <div className="text-xs text-neutral-500 mt-1 flex items-center justify-between">
                  <span>খতিয়ান: {p.khatianNo}</span>
                  <span className="text-[11px] font-semibold text-[#126B3A] dark:text-[#38C172]">
                    হিস্যা: {p.ownershipSharePercent ?? 100}%
                  </span>
                </div>

                {p.plotImageUrl && (
                  <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>{isBn ? 'প্লট ছবি সংযুক্ত' : 'Plot image attached'}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Add Parcel Card Button */}
          <button
            onClick={handleOpenAddParcel}
            className="p-5 rounded-2xl border-2 border-dashed border-[#D9E7DD] dark:border-[#233B2E] hover:border-[#126B3A] dark:hover:border-[#38C172] bg-white/50 dark:bg-[#14241B]/40 hover:bg-[#EFF8F2] dark:hover:bg-[#15241C] text-left transition-all flex flex-col items-center justify-center text-center gap-2 group min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-full bg-[#EFF8F2] dark:bg-[#1E3024] flex items-center justify-center text-[#126B3A] dark:text-[#38C172] group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#126B3A] dark:text-[#38C172] block">
                {t.walletAddParcelBtn}
              </span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">
                {isBn ? 'সহজ ২ ধাপে জমির রেকর্ড তৈরি করুন' : 'Simple 2-step parcel registration'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Selected Parcel Details Card with Edit, Delete & Plot Image Management */}
      {parcel && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EFF8F2] dark:bg-[#1E3024] flex items-center justify-center text-[#126B3A] dark:text-[#38C172]">
                <FolderLock className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#126B3A] dark:text-[#38C172]">
                  {isBn ? 'প্লট প্রোফাইল ও সংরক্ষিত বিবরণ' : 'Selected Parcel Profile'}
                </h3>
                <p className="text-xs text-neutral-400 font-mono">ID: {parcel.id}</p>
              </div>
            </div>

            {/* Parcel Controls: Edit & Delete */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenEditParcel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-[#126B3A] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-[#126B3A] transition-colors"
                title="Edit parcel metadata"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'সম্পাদনা' : 'Edit'}</span>
              </button>

              <button
                onClick={() => setIsDeleteParcelConfirmOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors"
                title="Delete parcel"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'জমি মুছুন' : 'Delete'}</span>
              </button>
            </div>
          </div>

          {/* Parcel Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#F4F9F5] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024]">
              <span className="text-neutral-500 block text-[11px]">{isBn ? 'মৌজা ও জেএল' : 'Mouza & JL'}</span>
              <strong className="text-xs text-[#202923] dark:text-white block mt-0.5 truncate">
                {isBn ? parcel.mouzaBn : parcel.mouzaEn} {parcel.jlNo ? `(JL-${parcel.jlNo})` : ''}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#F4F9F5] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024]">
              <span className="text-neutral-500 block text-[11px]">{isBn ? 'দাগ নম্বর' : 'Dag No'}</span>
              <strong className="text-xs text-[#202923] dark:text-white block mt-0.5 font-mono">
                {parcel.dagNo}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#F4F9F5] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024]">
              <span className="text-neutral-500 block text-[11px]">{isBn ? 'খতিয়ান নম্বর' : 'Khatian No'}</span>
              <strong className="text-xs text-[#202923] dark:text-white block mt-0.5 font-mono">
                {parcel.khatianNo}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#F4F9F5] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024]">
              <span className="text-neutral-500 block text-[11px]">{isBn ? 'জমির পরিমাণ' : 'Total Area'}</span>
              <strong className="text-xs text-[#126B3A] dark:text-[#38C172] block mt-0.5 font-mono">
                {parcel.areaDecimal} {isBn ? 'শতাংশ' : 'Decimal'}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#F4F9F5] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024]">
              <span className="text-neutral-500 block text-[11px]">{isBn ? 'মালিকানার হিস্যা' : 'Ownership Share'}</span>
              <strong className="text-xs text-[#126B3A] dark:text-[#38C172] block mt-0.5 font-mono">
                {parcel.ownershipSharePercent ?? 100}%
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#F4F9F5] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024]">
              <span className="text-neutral-500 block text-[11px]">{isBn ? 'সংরক্ষিত দলিল' : 'Archived Docs'}</span>
              <strong className="text-xs text-[#202923] dark:text-white block mt-0.5 font-mono">
                {parcel.documents?.length || 0} টি
              </strong>
            </div>
          </div>

          {/* Plot Photograph / Sketch Section (Requirement 6.B) */}
          <div className="p-4 rounded-2xl bg-[#EFF8F2] dark:bg-[#15241C] border border-[#D9E7DD] dark:border-[#233B2E] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#126B3A] dark:text-[#38C172]" />
                <h4 className="text-xs font-bold text-[#126B3A] dark:text-[#38C172]">
                  {isBn ? 'প্লটের ছবি বা স্কেচ (ঐচ্ছিক)' : 'Plot Photograph or Sketch (Optional)'}
                </h4>
              </div>
              <span className="text-[10px] text-neutral-400">
                {isBn ? 'সীমানা নির্ধারণী আইনি প্রমাণ নয়' : 'Not legal boundary proof'}
              </span>
            </div>

            {parcel.plotImageUrl ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-xl bg-white dark:bg-[#0D1812] border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setPlotImagePreviewUrl(parcel.plotImageUrl!)}
                    className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 cursor-pointer shrink-0 hover:opacity-90"
                  >
                    <img
                      src={parcel.plotImageUrl}
                      alt="Plot preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#202923] dark:text-white truncate">
                      {parcel.plotImageName || (isBn ? 'সংযুক্ত প্লট ছবি' : 'Attached Plot Photo')}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {isBn ? 'ক্লিক করে পূর্ণ আকারে প্রিভিউ দেখুন' : 'Click to view full preview'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-[#126B3A] text-[#126B3A] dark:text-[#38C172] text-xs font-semibold hover:bg-[#EFF8F2] transition-colors">
                    <span>{isBn ? 'ছবি পরিবর্তন' : 'Replace Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDirectPlotImageUpdate}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleRemovePlotImage}
                    className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    {isBn ? 'ছবি মুছুন' : 'Remove'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#0D1812] text-center space-y-2">
                <p className="text-xs text-neutral-500">
                  {isBn
                    ? 'এই দাগের জন্য কোনো প্লট ছবি বা স্কেচ যুক্ত করা হয়নি।'
                    : 'No plot photograph or sketch attached for this parcel.'}
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#14241B] border border-[#126B3A] text-[#126B3A] dark:text-[#38C172] text-xs font-semibold hover:bg-[#EFF8F2] cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isBn ? '+ প্লট ছবি বা স্কেচ যুক্ত করুন' : '+ Add Plot Photo/Sketch'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDirectPlotImageUpdate}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. DYNAMIC DOCUMENT COMPLETENESS CHECKLIST (Requirement 6.E) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#126B3A] dark:text-[#38C172]" />
            <h3 className="text-sm font-bold text-[#126B3A] dark:text-[#38C172]">
              {t.walletChecklistTitle}
            </h3>
          </div>

          {/* DYNAMIC COUNT: Never displays 4/4 Complete unless all four applicable requirements are satisfied! */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                isAllComplete
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300'
              }`}
            >
              {completedCount}/4 {isBn ? 'সম্পন্ন (Complete)' : 'Complete'}
            </span>
          </div>
        </div>

        {/* Clear Notice / Disclosure */}
        <p className="text-xs text-neutral-500 leading-relaxed">
          {t.walletChecklistNotice}
        </p>

        {/* Dynamic 4 Required Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            {
              id: 'DEED',
              labelBn: '১. মূল সাফ-কবলা রেজিস্ট্রি দলিল',
              labelEn: '1. Original Registered Sale Deed',
              hasDoc: hasDeed,
              docCount: parcel?.documents?.filter((d) => d.docType === 'DEED').length || 0,
            },
            {
              id: 'KHATIAN',
              labelBn: '২. জরিপ খতিয়ান / পর্চা রেকর্ড',
              labelEn: '2. Survey Khatian / Porcha Record',
              hasDoc: hasKhatian,
              docCount: parcel?.documents?.filter((d) => d.docType === 'KHATIAN').length || 0,
            },
            {
              id: 'MUTATION',
              labelBn: '৩. নামজারি ও জমাভাগ ডিসিআর আদেশনামা',
              labelEn: '3. Mutation & Split-Record Order',
              hasDoc: hasMutation,
              docCount: parcel?.documents?.filter((d) => d.docType === 'MUTATION').length || 0,
            },
            {
              id: 'TAX_RECEIPT',
              labelBn: '৪. হালনাগাদ ভূমি উন্নয়ন কর (খাজনা) দাখিলা',
              labelEn: '4. Updated Land Development Tax DCR',
              hasDoc: hasTaxReceipt,
              docCount: parcel?.documents?.filter((d) => d.docType === 'TAX_RECEIPT').length || 0,
            },
          ].map((cat) => (
            <div
              key={cat.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                cat.hasDoc
                  ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/15'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {cat.hasDoc ? (
                  <CheckCircle2 className="w-4 h-4 text-[#126B3A] dark:text-[#38C172] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="text-xs font-bold text-[#202923] dark:text-white block">
                    {isBn ? cat.labelBn : cat.labelEn}
                  </strong>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">
                    {cat.hasDoc
                      ? isBn
                        ? `ভল্টে ${cat.docCount}টি নথি সংরক্ষিত রয়েছে`
                        : `${cat.docCount} file(s) archived in vault`
                      : isBn
                      ? 'নথি যুক্ত করা হয়নি (অনুপস্থিত)'
                      : 'Missing / Not yet attached'}
                  </span>
                </div>
              </div>

              {!cat.hasDoc && (
                <button
                  onClick={() => {
                    setNewDocForm((prev) => ({ ...prev, docType: cat.id as DocumentType }));
                    setIsAddDocModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] shrink-0 transition-colors"
                >
                  {isBn ? '+ যুক্ত করুন' : '+ Attach'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Optional / Supporting Documents List */}
        {optionalDocs.length > 0 && (
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] font-bold text-neutral-500 block mb-2">
              {isBn ? 'অতিরিক্ত ও সহায়ক নথি (Optional / Supporting):' : 'Additional & Supporting Documents:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {optionalDocs.map((od) => (
                <span
                  key={od.id}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  {isBn ? od.titleBn : od.titleEn} ({od.fileReference})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Document Vault Grid & Management (Requirement 6.C & 6.D) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#126B3A] dark:text-[#38C172]">
              {isBn ? 'সংরক্ষিত দলিলের তালিকা' : 'Archived Documents for this Parcel'}
            </h2>
            <p className="text-xs text-neutral-500">
              {isBn
                ? `বর্তমান দাগে মোট ${parcel?.documents?.length || 0}টি দলিল সংরক্ষিত রয়েছে`
                : `${parcel?.documents?.length || 0} document(s) in active vault`}
            </p>
          </div>

          <button
            onClick={handleOpenAddDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#126B3A] hover:bg-[#0E542D] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isBn ? '+ নতুন নথি' : '+ Add Document'}</span>
          </button>
        </div>

        {parcel?.documents && parcel.documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parcel.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#14241B] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#126B3A] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#126B3A] dark:text-[#38C172] shrink-0" />
                      <h3 className="text-xs font-bold text-[#202923] dark:text-white truncate">
                        {isBn ? doc.titleBn : doc.titleEn}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                      {doc.docType}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 mt-2 font-mono truncate">
                    REF: {doc.fileReference} · {doc.fileSizeKb} KB
                  </p>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 bg-[#F4F9F5] dark:bg-[#0D1812] p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800 font-serif line-clamp-2">
                    {isBn ? doc.previewTextBn : doc.previewTextEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActivePreviewDoc(doc)}
                      className="flex items-center gap-1 text-xs text-[#126B3A] dark:text-[#38C172] font-semibold hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isBn ? 'প্রিভিউ' : 'Preview'}</span>
                    </button>

                    <button
                      onClick={() => runHashCheck(doc, false)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#D9E7DD] dark:border-[#233B2E] text-xs font-semibold hover:bg-[#EFF8F2] dark:hover:bg-[#1E3024] transition-colors"
                      title="Run SHA-256 test on this file"
                    >
                      <Hash className="w-3 h-3" />
                      <span>{isBn ? 'হ্যাশ পরীক্ষা' : 'Check Hash'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      setDocToDelete({
                        parcelId: parcel.id,
                        docId: doc.id,
                        title: isBn ? doc.titleBn : doc.titleEn,
                      })
                    }
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    title={isBn ? 'নথি মুছুন' : 'Delete document'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl border-2 border-dashed border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#14241B] text-center space-y-3">
            <FolderLock className="w-8 h-8 text-neutral-400 mx-auto" />
            <div>
              <p className="text-xs font-bold text-[#202923] dark:text-white">
                {isBn ? 'এই দাগের জন্য এখনও কোনো দলিল যুক্ত করা হয়নি' : 'No documents attached to this parcel yet'}
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                {isBn ? 'উপরে "+ নথি যোগ করুন" বোতামে ক্লিক করে দলিল আপলোড করুন।' : 'Click "+ Add Document" above to upload land deeds.'}
              </p>
            </div>
            <button
              onClick={handleOpenAddDoc}
              className="px-4 py-2 rounded-xl bg-[#126B3A] text-white text-xs font-bold hover:bg-[#0E542D] transition-colors shadow-xs"
            >
              {t.walletAddDocBtn}
            </button>
          </div>
        )}
      </div>

      {/* 6. SHA-256 Web Crypto File Integrity Calculator (Requirement 6.F) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-[#126B3A] dark:text-[#38C172]" />
            <h3 className="text-sm font-bold text-[#126B3A] dark:text-[#38C172]">
              {t.walletIntegrityTitle}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
            BROWSER WEB CRYPTO API
          </span>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">
          {t.walletIntegrityDesc}
        </p>

        {/* Selected Document for Hash Comparison */}
        <div className="p-4 rounded-xl bg-[#EFF8F2] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-neutral-500 block">{isBn ? 'নির্বাচিত ফাইল:' : 'Inspected Document:'}</span>
              <strong className="text-sm text-[#126B3A] dark:text-[#38C172]">
                {hashTestDoc ? (isBn ? hashTestDoc.titleBn : hashTestDoc.titleEn) : (isBn ? 'কোনো ফাইল নির্বাচিত নয়' : 'No document selected')}
              </strong>
            </div>

            {hashTestDoc && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => runHashCheck(hashTestDoc, false)}
                  disabled={isHashing}
                  className="px-3 py-1.5 rounded-lg bg-[#126B3A] text-white text-xs font-semibold hover:bg-[#0E542D] disabled:opacity-50 transition-colors"
                >
                  {isHashing
                    ? isBn
                      ? 'হ্যাশ তৈরি হচ্ছে...'
                      : 'Computing...'
                    : isBn
                    ? 'রেফারেন্স হ্যাশ মিলান'
                    : 'Check Stored Hash'}
                </button>
                <button
                  onClick={() => runHashCheck(hashTestDoc, true)}
                  className="px-2.5 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  title="Simulate altered file to test mismatch"
                >
                  {isBn ? 'বিকৃত ফাইল সিমুলেশন' : 'Simulate Tamper'}
                </button>
              </div>
            )}
          </div>

          {/* Recorded vs Computed Comparison */}
          {hashTestDoc && (
            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-neutral-500 block text-[11px] font-sans">
                  {isBn ? 'সংরক্ষিত ডিজিটাল রেফারেন্স হ্যাশ (Stored Reference Hash):' : 'Recorded Digital Reference Hash:'}
                </span>
                <div className="p-2 rounded-lg bg-white dark:bg-[#14241B] border border-neutral-200 dark:border-neutral-800 break-all text-neutral-700 dark:text-neutral-300">
                  {hashTestDoc.recordedSha256}
                </div>
              </div>

              {computedHash && (
                <div>
                  <span className="text-neutral-500 block text-[11px] font-sans">
                    {isBn ? 'ব্রাউজারে রিয়েল-টাইমে প্রস্তুতকৃত হ্যাশ (Computed Hash):' : 'Computed Hash in Browser:'}
                  </span>
                  <div className="p-2 rounded-lg bg-white dark:bg-[#14241B] border border-neutral-200 dark:border-neutral-800 break-all text-neutral-700 dark:text-neutral-300">
                    {computedHash}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verification Status Banner */}
          {hashStatus !== 'IDLE' && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                hashStatus === 'MATCHED'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                  : 'border-red-300 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200'
              }`}
            >
              {hashStatus === 'MATCHED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="font-bold">
                  {hashStatus === 'MATCHED' ? t.walletHashMatch : t.walletHashMismatch}
                </strong>
                <p className="mt-0.5 leading-relaxed">{t.walletHashDisclaimer}</p>
              </div>
            </div>
          )}

          {/* Drop/Browse Local File Inspector */}
          <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-center space-y-1 bg-white dark:bg-[#14241B]">
            <Upload className="w-5 h-5 mx-auto text-neutral-400" />
            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {isBn ? 'আপনার নিজস্ব ফাইল ফেলে হ্যাশ পরীক্ষা করুন' : 'Drop local file to compute SHA-256'}
            </div>
            <p className="text-[11px] text-neutral-400">
              {isBn ? 'ফাইল স্থানীয়ভাবে ব্রাউজারে প্রসেস হয়; সার্ভারে আপলোড হয় না' : 'Processed locally in browser; never uploaded'}
            </p>
            <label className="inline-block mt-2 cursor-pointer">
              <span className="px-3 py-1.5 rounded-lg border border-[#126B3A] text-[#126B3A] dark:text-[#38C172] text-xs font-semibold hover:bg-[#EFF8F2] transition-colors">
                {isBn ? 'ফাইল নির্বাচন করুন' : 'Browse Local File'}
              </span>
              <input type="file" onChange={handleLocalFileHash} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* ---------------- MODALS & DIALOGS ---------------- */}

      {/* A. ADD PARCEL MODAL (2-Step Form - Requirement 6.A & 6.B) */}
      {isAddParcelModalOpen && (
        <div
          onClick={() => setIsAddParcelModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white dark:bg-[#14241B] rounded-3xl shadow-2xl border border-[#D9E7DD] dark:border-[#233B2E] overflow-hidden p-6 space-y-5 text-[#202923] dark:text-[#E4EBE6]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#EFF8F2] dark:border-[#1E3024] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#126B3A] dark:text-[#38C172]">
                  {isBn ? 'নতুন জমি যোগ করুন' : 'Register New Land Parcel'}
                </h3>
                <p className="text-xs text-[#66736B] dark:text-[#9FB0A5]">
                  {addParcelStep === 1
                    ? isBn
                      ? 'ধাপ ১/২: জমির মৌলিক রেকর্ড তথ্য'
                      : 'Step 1/2: Land Record Information'
                    : isBn
                    ? 'ধাপ ২/২: প্লটের ছবি বা স্কেচ (ঐচ্ছিক)'
                    : 'Step 2/2: Plot Photo / Sketch (Optional)'}
                </p>
              </div>
              <button
                onClick={() => setIsAddParcelModalOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Land Information */}
            {addParcelStep === 1 ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'জেলা' : 'District'}</label>
                    <input
                      type="text"
                      value={newParcelForm.district}
                      onChange={(e) => setNewParcelForm({ ...newParcelForm, district: e.target.value })}
                      placeholder="যেমন: ঢাকা, গাজীপুর"
                      className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs focus:ring-2 focus:ring-[#126B3A]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'উপজেলা' : 'Upazila'}</label>
                    <input
                      type="text"
                      value={newParcelForm.upazila}
                      onChange={(e) => setNewParcelForm({ ...newParcelForm, upazila: e.target.value })}
                      placeholder="যেমন: সাভার, সদর"
                      className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs focus:ring-2 focus:ring-[#126B3A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">
                      {isBn ? 'মৌজার নাম' : 'Mouza Name'} <span className="text-emerald-700 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={newParcelForm.mouza}
                      onChange={(e) => setNewParcelForm({ ...newParcelForm, mouza: e.target.value })}
                      placeholder="যেমন: মিরপুর, কাশিমপুর"
                      className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs focus:ring-2 focus:ring-[#126B3A]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      {isBn ? 'জেএল নম্বর (ঐচ্ছিক)' : 'JL Number (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={newParcelForm.jlNo}
                      onChange={(e) => setNewParcelForm({ ...newParcelForm, jlNo: e.target.value })}
                      placeholder="যেমন: ১২, ৪৫"
                      className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs focus:ring-2 focus:ring-[#126B3A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'জরিপ ধরন' : 'Survey Type'}</label>
                    <select
                      value={newParcelForm.surveyType}
                      onChange={(e) => setNewParcelForm({ ...newParcelForm, surveyType: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs focus:ring-2 focus:ring-[#126B3A]"
                    >
                      <option value="বিএস (BS)">বিএস (BS)</option>
                      <option value="আরএস (RS)">আরএস (RS)</option>
                      <option value="এসএ (SA)">এসএ (SA)</option>
                      <option value="সিএস (CS)">সিএস (CS)</option>
                      <option value="বিআরএস (BRS)">বিআরএস (BRS)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      {isBn ? 'খতিয়ান নং' : 'Khatian No'} <span className="text-emerald-700 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={newParcelForm.khatianNo}
                      onChange={(e) => setNewParcelForm({ ...newParcelForm, khatianNo: e.target.value })}
                      placeholder="যেমন: ১২৪"
                      className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs focus:ring-2 focus:ring-[#126B3A]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      {isBn ? 'দাগ নং' : 'Dag No'} <span className="text-emerald-700 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={newParcelForm.dagNo}
                      onChange={(e) => setNewParcelForm({ ...newParcelForm, dagNo: e.target.value })}
                      placeholder="যেমন: ৫৪০"
                      className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs focus:ring-2 focus:ring-[#126B3A]"
                    />
                  </div>
                </div>

                {/* Land Area and Ownership Share separated clearly (Requirement 6.A) */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#EFF8F2] dark:bg-[#15241C] border border-[#D9E7DD] dark:border-[#233B2E]">
                  <div>
                    <label className="block font-bold text-[#126B3A] dark:text-[#38C172] mb-1">
                      {isBn ? 'মোট জমির পরিমাণ (শতাংশ)' : 'Total Parcel Area (Decimal)'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newParcelForm.areaDecimal}
                      onChange={(e) => setNewParcelForm({ ...newParcelForm, areaDecimal: e.target.value })}
                      placeholder="যেমন: ২৫.৫"
                      className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs font-mono focus:ring-2 focus:ring-[#126B3A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#126B3A] dark:text-[#38C172] mb-1">
                      {isBn ? 'মালিকানার হিস্যা %' : 'Ownership Share %'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newParcelForm.ownershipSharePercent}
                      onChange={(e) =>
                        setNewParcelForm({ ...newParcelForm, ownershipSharePercent: e.target.value })
                      }
                      placeholder="১০০"
                      className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs font-mono focus:ring-2 focus:ring-[#126B3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">{isBn ? 'জমির শ্রেণি' : 'Land Classification'}</label>
                  <select
                    value={newParcelForm.landClass}
                    onChange={(e) => setNewParcelForm({ ...newParcelForm, landClass: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs focus:ring-2 focus:ring-[#126B3A]"
                  >
                    <option value="নাল / কৃষি জমি">নাল / কৃষি জমি (Agricultural Crop)</option>
                    <option value="ভিটি / বসতবাড়ি">ভিটি / বসতবাড়ি (Residential Homestead)</option>
                    <option value="বাণিজ্যিক প্লট">বাণিজ্যিক প্লট (Commercial Plot)</option>
                    <option value="পুকুর / জলাশয়">পুকুর / জলাশয় (Pond / Waterbody)</option>
                    <option value="অন্যান্য">অন্যান্য (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    {isBn ? 'ব্যক্তিগত নোট বা লেবেল (ঐচ্ছিক)' : 'Personal Notes / Label (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={newParcelForm.userNotes}
                    onChange={(e) => setNewParcelForm({ ...newParcelForm, userNotes: e.target.value })}
                    placeholder="যেমন: পৈতৃক সূত্রে প্রাপ্ত জমি, রাস্তা সংলগ্ন।"
                    className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs focus:ring-2 focus:ring-[#126B3A]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={handleSaveParcel}
                    className="px-4 py-2.5 rounded-xl border border-[#126B3A] text-[#126B3A] font-semibold text-xs hover:bg-[#EFF8F2]"
                  >
                    {isBn ? 'সরাসরি সংরক্ষণ' : 'Save Directly'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddParcelStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-[#126B3A] text-white font-bold text-xs hover:bg-[#0E542D] shadow-xs"
                  >
                    {isBn ? 'পরবর্তী: প্লট ছবি (ঐচ্ছিক) →' : 'Next: Plot Photo (Optional) →'}
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Optional Plot Image */
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs">
                  <p>
                    {isBn
                      ? '⚠️ দ্রষ্টব্য: সংযুক্ত প্লট ছবি বা মৌজা স্কেচ ব্যক্তিগত রেফারেন্সের জন্য। এটি আইনি সীমানা বা মালিকানার প্রমাণ হিসেবে গণ্য নয়।'
                      : '⚠️ Notice: Attached plot photograph or sketch is for visual reference and does not constitute legal proof of boundary.'}
                  </p>
                </div>

                {newParcelForm.plotImage ? (
                  <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0D1812] flex flex-col items-center gap-3">
                    <img
                      src={newParcelForm.plotImage}
                      alt="Plot Preview"
                      className="max-h-48 rounded-xl object-contain border"
                    />
                    <p className="text-xs font-semibold">{newParcelForm.plotImageName}</p>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg border border-[#126B3A] text-[#126B3A] text-xs font-semibold hover:bg-[#EFF8F2] cursor-pointer">
                        <span>{isBn ? 'ছবি পরিবর্তন' : 'Replace Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePlotImageSelect}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setNewParcelForm((prev) => ({
                            ...prev,
                            plotImage: '',
                            plotImageName: '',
                          }))
                        }
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50"
                      >
                        {isBn ? 'মুছে ফেলুন' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#0D1812] text-center space-y-3">
                    <ImageIcon className="w-10 h-10 mx-auto text-neutral-400" />
                    <div>
                      <p className="font-bold text-xs">{isBn ? 'প্লটের ছবি বা স্কেচ আপলোড করুন' : 'Upload Plot Photo or Sketch'}</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {isBn ? 'JPG, PNG, WEBP (সর্বোচ্চ ৫ MB)' : 'JPG, PNG, WEBP (Max 5MB)'}
                      </p>
                    </div>
                    <label className="inline-block px-4 py-2 rounded-xl bg-[#126B3A] text-white text-xs font-bold hover:bg-[#0E542D] cursor-pointer shadow-xs">
                      <span>{isBn ? 'ফাইল নির্বাচন' : 'Choose Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePlotImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setAddParcelStep(1)}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold"
                  >
                    {isBn ? '← পূর্ববর্তী ধাপ' : '← Back'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveParcel}
                    className="px-6 py-2.5 rounded-xl bg-[#126B3A] text-white font-bold text-xs hover:bg-[#0E542D] shadow-xs"
                  >
                    {isBn ? 'জমি যুক্ত করুন' : 'Confirm & Save Parcel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* B. EDIT PARCEL MODAL */}
      {isEditParcelModalOpen && (
        <div
          onClick={() => setIsEditParcelModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white dark:bg-[#14241B] rounded-3xl shadow-2xl border border-[#D9E7DD] dark:border-[#233B2E] p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-[#126B3A] dark:text-[#38C172]">
                {isBn ? 'জমির তথ্য সম্পাদনা' : 'Edit Parcel Information'}
              </h3>
              <button onClick={() => setIsEditParcelModalOpen(false)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'মৌজা' : 'Mouza'}</label>
                <input
                  type="text"
                  value={editParcelForm.mouza}
                  onChange={(e) => setEditParcelForm({ ...editParcelForm, mouza: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'জেএল নং' : 'JL No'}</label>
                <input
                  type="text"
                  value={editParcelForm.jlNo}
                  onChange={(e) => setEditParcelForm({ ...editParcelForm, jlNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'দাগ নং' : 'Dag No'}</label>
                <input
                  type="text"
                  value={editParcelForm.dagNo}
                  onChange={(e) => setEditParcelForm({ ...editParcelForm, dagNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'খতিয়ান নং' : 'Khatian No'}</label>
                <input
                  type="text"
                  value={editParcelForm.khatianNo}
                  onChange={(e) => setEditParcelForm({ ...editParcelForm, khatianNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'জমির পরিমাণ (শতাংশ)' : 'Area (Decimal)'}</label>
                <input
                  type="number"
                  value={editParcelForm.areaDecimal}
                  onChange={(e) => setEditParcelForm({ ...editParcelForm, areaDecimal: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'মালিকানার হিস্যা %' : 'Share %'}</label>
                <input
                  type="number"
                  value={editParcelForm.ownershipSharePercent}
                  onChange={(e) => setEditParcelForm({ ...editParcelForm, ownershipSharePercent: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'ব্যক্তিগত নোট' : 'User Notes'}</label>
              <textarea
                rows={2}
                value={editParcelForm.userNotes}
                onChange={(e) => setEditParcelForm({ ...editParcelForm, userNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setIsEditParcelModalOpen(false)}
                className="px-4 py-2 rounded-xl border text-xs"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveEditParcel}
                className="px-5 py-2 rounded-xl bg-[#126B3A] text-white font-bold text-xs hover:bg-[#0E542D]"
              >
                {isBn ? 'সংরক্ষণ' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* C. DELETE PARCEL CONFIRMATION DIALOG */}
      {isDeleteParcelConfirmOpen && (
        <div
          onClick={() => setIsDeleteParcelConfirmOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-[#14241B] rounded-3xl p-6 space-y-4 border border-red-200 dark:border-red-900 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-red-600 dark:text-red-400">
              {isBn ? 'জমি মুছবেন?' : 'Delete Parcel Record?'}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              {isBn
                ? `আপনি কি নিশ্চিতভাবে "${parcel?.dagNo} · ${parcel?.mouzaBn}" এবং এর সমস্ত সংযুক্ত দলিল মুছে ফেলতে চান?`
                : `Are you sure you want to permanently delete this parcel and all attached documents?`}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setIsDeleteParcelConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteParcel}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
              >
                {isBn ? 'মুছে ফেলুন' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* D. ADD DOCUMENT MODAL (Requirement 6.C) */}
      {isAddDocModalOpen && (
        <div
          onClick={() => setIsAddDocModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white dark:bg-[#14241B] rounded-3xl shadow-2xl border border-[#D9E7DD] dark:border-[#233B2E] p-6 space-y-4 text-xs text-[#202923] dark:text-[#E4EBE6]"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#126B3A] dark:text-[#38C172]">
                  {isBn ? 'জমি ওয়ালেটে নতুন নথি যোগ করুন' : 'Attach Land Document to Wallet'}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {isBn ? 'নির্বাচিত দাগে দলিল সংযুক্ত ও ক্রিপ্টোগ্রাফিক হ্যাশ তৈরি' : 'Attach and register document for selected parcel'}
                </p>
              </div>
              <button onClick={() => setIsAddDocModalOpen(false)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Target Parcel Selection */}
            <div>
              <label className="block font-semibold mb-1">{isBn ? 'জমি / প্লট নির্বাচন:' : 'Target Parcel:'}</label>
              <select
                value={newDocForm.targetParcelId}
                onChange={(e) => setNewDocForm({ ...newDocForm, targetParcelId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs font-semibold focus:ring-2 focus:ring-[#126B3A]"
              >
                {parcels.map((p) => (
                  <option key={p.id} value={p.id}>
                    দাগ {p.dagNo} · {isBn ? p.mouzaBn : p.mouzaEn} ({p.areaDecimal} শতাংশ)
                  </option>
                ))}
              </select>
            </div>

            {/* Document Type Category */}
            <div>
              <label className="block font-semibold mb-1">{isBn ? 'দলিলের শ্রেণি / ধরন:' : 'Document Category:'}</label>
              <select
                value={newDocForm.docType}
                onChange={(e) => setNewDocForm({ ...newDocForm, docType: e.target.value as DocumentType })}
                className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs font-bold text-[#126B3A] dark:text-[#38C172] focus:ring-2 focus:ring-[#126B3A]"
              >
                <option value="DEED">১. মূল সাফ-কবলা দলিল (Sale Deed)</option>
                <option value="KHATIAN">২. খতিয়ান / পর্চা রেকর্ড (Khatian / Porcha)</option>
                <option value="MUTATION">৩. নামজারি ও জমাভাগ ডিসিআর (Mutation Order)</option>
                <option value="TAX_RECEIPT">৪. ভূমি উন্নয়ন কর দাখিলা (Tax Receipt / DCR)</option>
                <option value="SKETCH">৫. মৌজা নকশা বা স্কেচ (Mouza Map / Sketch)</option>
                <option value="OTHER">৬. অন্যান্য সংশ্লিষ্ট ভূমি নথি (Other Relevant)</option>
              </select>
            </div>

            {/* Document Name */}
            <div>
              <label className="block font-semibold mb-1">
                {isBn ? 'দলিলের শিরোনাম / নাম:' : 'Document Title:'} <span className="text-emerald-700 font-bold">*</span>
              </label>
              <input
                type="text"
                value={newDocForm.title}
                onChange={(e) => setNewDocForm({ ...newDocForm, title: e.target.value })}
                placeholder="যেমন: ২০১৭ সালের মূল সাব-কবলা দলিল"
                className="w-full px-3 py-2 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-white dark:bg-[#0D1812] text-xs focus:ring-2 focus:ring-[#126B3A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'দলিল / খতিয়ান নং (ঐচ্ছিক):' : 'Ref / Deed No (Optional):'}</label>
                <input
                  type="text"
                  value={newDocForm.referenceNumber}
                  onChange={(e) => setNewDocForm({ ...newDocForm, referenceNumber: e.target.value })}
                  placeholder="যেমন: DEED-2023-891"
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'তারিখ (ঐচ্ছিক):' : 'Date (Optional):'}</label>
                <input
                  type="date"
                  value={newDocForm.documentDate}
                  onChange={(e) => setNewDocForm({ ...newDocForm, documentDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            {/* File Upload Selector with SHA-256 Info */}
            <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-[#F4F9F5] dark:bg-[#0D1812] text-center space-y-2">
              <Upload className="w-6 h-6 mx-auto text-[#126B3A]" />
              <div>
                <p className="font-semibold text-xs">
                  {newDocForm.fileName ? newDocForm.fileName : isBn ? 'ফাইল নির্বাচন করুন (PDF, JPG, PNG, WebP)' : 'Choose file (PDF, JPG, PNG, WebP)'}
                </p>
                <p className="text-[11px] text-neutral-400">
                  {newDocForm.fileSizeKb ? `${newDocForm.fileSizeKb} KB` : isBn ? 'সর্বোচ্চ ১০ মেগাবাইট' : 'Max 10MB'}
                </p>
              </div>
              <label className="inline-block px-3 py-1.5 rounded-lg border border-[#126B3A] text-[#126B3A] font-bold text-xs hover:bg-[#EFF8F2] cursor-pointer">
                <span>{newDocForm.fileName ? (isBn ? 'অন্য ফাইল বাছুন' : 'Change File') : (isBn ? 'ফাইল খুঁজুন' : 'Browse File')}</span>
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  onChange={handleDocFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsAddDocModalOpen(false)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveDocument}
                className="px-5 py-2 rounded-xl bg-[#126B3A] text-white font-bold text-xs hover:bg-[#0E542D] shadow-xs"
              >
                {isBn ? 'নথি সংরক্ষণ করুন' : 'Attach Document'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E. DELETE DOCUMENT CONFIRMATION DIALOG */}
      {docToDelete && (
        <div
          onClick={() => setDocToDelete(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-[#14241B] rounded-3xl p-6 space-y-4 border border-red-200 dark:border-red-900 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-red-600 dark:text-red-400">
              {isBn ? 'নথি মুছে ফেলবেন?' : 'Delete Document?'}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              {isBn
                ? `আপনি কি নিশ্চিতভাবে "${docToDelete.title}" নথিটি ওয়ালেট থেকে মুছে ফেলতে চান?`
                : `Are you sure you want to delete "${docToDelete.title}" from this parcel vault?`}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmDeleteDoc}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
              >
                {isBn ? 'মুছে ফেলুন' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* F. PLOT IMAGE FULL PREVIEW MODAL */}
      {plotImagePreviewUrl && (
        <div
          onClick={() => setPlotImagePreviewUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-white dark:bg-[#14241B] rounded-3xl p-4 shadow-2xl border overflow-hidden space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-xs font-bold text-[#126B3A] dark:text-[#38C172]">
                {isBn ? 'প্লট ছবি / স্কেচ প্রিভিউ' : 'Plot Photo / Sketch Preview'}
              </span>
              <button onClick={() => setPlotImagePreviewUrl(null)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <img
              src={plotImagePreviewUrl}
              alt="Plot enlarged"
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* G. DOCUMENT SNIPPET PREVIEW MODAL */}
      {activePreviewDoc && (
        <div
          onClick={() => setActivePreviewDoc(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white dark:bg-[#14241B] rounded-3xl shadow-2xl border border-[#D9E7DD] dark:border-[#233B2E] p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#126B3A] dark:text-[#38C172]">
                  {isBn ? activePreviewDoc.titleBn : activePreviewDoc.titleEn}
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono">
                  REF: {activePreviewDoc.fileReference}
                </span>
              </div>
              <button onClick={() => setActivePreviewDoc(null)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F9F5] dark:bg-[#0D1812] border font-serif leading-relaxed text-neutral-700 dark:text-neutral-200 space-y-2">
              <p>{isBn ? activePreviewDoc.previewTextBn : activePreviewDoc.previewTextEn}</p>
            </div>

            <div className="space-y-1 font-mono text-[11px] text-neutral-500">
              <span className="block">{isBn ? 'রেকর্ডকৃত হ্যাশ:' : 'Recorded SHA-256:'}</span>
              <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 break-all">
                {activePreviewDoc.recordedSha256}
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t">
              <button
                onClick={() => setActivePreviewDoc(null)}
                className="px-4 py-1.5 rounded-xl bg-[#126B3A] text-white font-bold text-xs"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* H. VIEW-ONLY SHARE MODAL */}
      {isShareModalOpen && parcel && (
        <ViewOnlyShareModal
          parcel={parcel}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onOpenViewer={(state) => {
            setIsShareModalOpen(false);
            setSharedViewerState(state);
          }}
        />
      )}
    </div>
  );
};
