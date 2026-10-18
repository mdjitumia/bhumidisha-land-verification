import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Square, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface VoiceNarratorProps {
  textToSpeak: string;
  title?: string;
}

export const VoiceNarrator: React.FC<VoiceNarratorProps> = ({ textToSpeak, title }) => {
  const { locale, t } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [hasBengaliVoice, setHasBengaliVoice] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(
        (v) => v.lang.startsWith('bn') || v.lang.includes('Bengali') || v.lang.includes('Bangla')
      );
      setHasBengaliVoice(!!bnVoice);
    };

    checkVoices();
    window.speechSynthesis.onvoiceschanged = checkVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = locale === 'bn' ? 'bn-BD' : 'en-US';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const voice =
      locale === 'bn'
        ? voices.find((v) => v.lang.startsWith('bn') || v.name.includes('Bangla'))
        : voices.find((v) => v.lang.startsWith('en'));

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="p-4 rounded-xl border border-[#D9E7DD] dark:border-[#233B2E] bg-[#EFF8F2]/60 dark:bg-[#14241B]/60 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#126B3A] dark:text-[#38C172]">
          <Volume2 className="w-4 h-4 shrink-0" />
          <span>{title || t.p3VoiceTitle}</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#126B3A] hover:bg-[#0E542D] text-white text-xs font-semibold shadow-xs transition-colors"
              title={t.p3VoicePlay}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{t.p3VoicePlay}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
              title={t.p3VoicePause}
            >
              <Pause className="w-3 h-3 fill-current" />
              <span>{t.p3VoicePause}</span>
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="p-1 rounded-lg border border-[#D9E7DD] dark:border-[#233B2E] text-[#66736B] hover:text-red-600 disabled:opacity-40 transition-colors"
            title={t.p3VoiceStop}
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Synchronous Visible Text Transcript */}
      <p className="text-xs text-[#46544C] dark:text-[#BAC7BE] leading-relaxed italic bg-white dark:bg-[#0D1812] p-2.5 rounded-lg border border-[#D9E7DD] dark:border-[#1E3024]">
        "{textToSpeak}"
      </p>

      {/* Disclaimer / Limitations */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#66736B] dark:text-[#9FB0A5]">
        <AlertCircle className="w-3 h-3 shrink-0" />
        <span>
          {t.p3VoiceDisclaimer}
          {!hasBengaliVoice && locale === 'bn' && (
            <span className="text-amber-700 dark:text-amber-400 ml-1">
              (ডিভাইসে বাংলা ভয়েস ইঞ্জিন না থাকলে ব্রাউজারের ডিফল্ট ভয়েস ব্যবহৃত হবে)
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
