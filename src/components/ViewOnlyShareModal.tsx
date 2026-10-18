import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { WalletService } from '../services/walletService';
import { WalletParcel } from '../types';
import { X, Copy, Check, ExternalLink, ShieldAlert, Clock, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  parcel: WalletParcel;
  isOpen: boolean;
  onClose: () => void;
  onOpenViewer: (shareData: {
    token: string;
    passcode: string | null;
    expiresAt: string;
    parcel: WalletParcel;
  }) => void;
}

export const ViewOnlyShareModal: React.FC<Props> = ({
  parcel,
  isOpen,
  onClose,
  onOpenViewer,
}) => {
  const { locale, t, showToast } = useApp();
  const [duration, setDuration] = useState<number>(24);
  const [requiresPasscode, setRequiresPasscode] = useState(true);
  const [shareData, setShareData] = useState<{
    token: string;
    passcode: string | null;
    expiresAt: string;
    shareUrl: string;
  } | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const generated = WalletService.generateShareToken(parcel.id, duration, requiresPasscode);
      setShareData(generated);
      QRCode.toDataURL(generated.shareUrl, { width: 180, margin: 1 })
        .then((url) => setQrDataUrl(url))
        .catch(() => {});
    }
  }, [isOpen, parcel.id, duration, requiresPasscode]);

  if (!isOpen || !shareData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareData.shareUrl);
    setCopied(true);
    showToast(locale === 'bn' ? 'লিংক ক্লিপবোর্ডে কপি করা হয়েছে' : 'Share link copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#14241B] rounded-2xl shadow-2xl border border-[#D9E7DD] dark:border-[#233B2E] overflow-hidden text-[#202923] dark:text-[#E4EBE6]">
        {/* Header */}
        <div className="p-5 border-b border-[#D9E7DD] dark:border-[#1E3024] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#126B3A] dark:text-[#38C172]">
              {t.shareModalTitle}
            </h3>
            <p className="text-xs text-neutral-500">
              {parcel.dagNo} · {locale === 'bn' ? parcel.mouzaBn : parcel.mouzaEn}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Security Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">{t.shareSecurityNotice}</p>
          </div>

          {/* Expiry Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.shareDurationLabel}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { hours: 1, label: t.share1Hour },
                { hours: 24, label: t.share24Hours },
                { hours: 168, label: t.share7Days },
              ].map((opt) => (
                <button
                  key={opt.hours}
                  type="button"
                  onClick={() => setDuration(opt.hours)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                    duration === opt.hours
                      ? 'bg-[#126B3A] border-[#126B3A] text-white'
                      : 'border-[#D9E7DD] dark:border-[#233B2E] text-neutral-700 dark:text-neutral-300 hover:bg-[#EFF8F2]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Passcode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#EFF8F2] dark:bg-[#0D1812] border border-[#D9E7DD] dark:border-[#1E3024]">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#126B3A] dark:text-[#38C172]" />
              <span className="text-xs font-semibold">{t.sharePasscodeLabel}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={requiresPasscode}
                onChange={(e) => setRequiresPasscode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#126B3A]"></div>
            </label>
          </div>

          {requiresPasscode && shareData.passcode && (
            <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-center font-mono text-xs">
              <span className="text-neutral-500 mr-2">{locale === 'bn' ? 'ডেমো অ্যাক্সেস পিন:' : 'Demo Access PIN:'}</span>
              <strong className="text-base text-[#126B3A] dark:text-[#38C172] tracking-wider">
                {shareData.passcode}
              </strong>
            </div>
          )}

          {/* QR Code and Link */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0D1812]">
            {qrDataUrl && (
              <div className="bg-white p-2 rounded-lg border shrink-0">
                <img src={qrDataUrl} alt="Share QR" className="w-28 h-28" />
              </div>
            )}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <span className="text-xs text-neutral-500 font-medium block">
                {t.shareQrTitle}
              </span>
              <div className="font-mono text-[11px] bg-white dark:bg-[#14241B] p-2 rounded border truncate text-neutral-700 dark:text-neutral-300 select-all">
                {shareData.shareUrl}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#126B3A] text-[#126B3A] dark:text-[#38C172] text-xs font-semibold hover:bg-[#EFF8F2] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t.shareCopied : t.shareCopyBtn}</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenViewer({
                      token: shareData.token,
                      passcode: shareData.passcode,
                      expiresAt: shareData.expiresAt,
                      parcel,
                    });
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#126B3A] hover:bg-[#0E542D] text-white text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t.shareOpenViewer}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
