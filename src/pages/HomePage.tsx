import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { VerifierLogo, WalletLogo, AssistantLogo } from '../components/ModuleIcons';
import { ArrowRight, FileSearch, UserCheck } from 'lucide-react';

/**
 * Safely segments text into grapheme clusters using Intl.Segmenter.
 * Guarantees Bengali conjuncts (যুক্তবর্ণ) and vowel signs (কার-ফলা) are never split or broken.
 */
function getGraphemes(text: string, locale: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new Intl.Segmenter(locale === 'bn' ? 'bn' : 'en', {
        granularity: 'grapheme',
      });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    } catch {
      // Fallback if locale is unsupported
    }
  }
  // Unicode-aware fallback
  return Array.from(text);
}

export const HomePage: React.FC = () => {
  const { navigateWithAuth, judgeDemoLogin, locale, t } = useApp();
  const isBn = locale === 'bn';
  const videoRef = useRef<HTMLVideoElement>(null);

  // Welcome heading text based on current locale
  const headingText = t.heroWelcome;

  // Unicode-safe graphemes for the heading
  const graphemes = useMemo(() => {
    return getGraphemes(headingText, locale);
  }, [headingText, locale]);

  // Animation sequence states
  const [displayedGraphemeCount, setDisplayedGraphemeCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [showTagline, setShowTagline] = useState<boolean>(false);
  const [showSupporting, setShowSupporting] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  // Typewriter effect and sequential reveal timing
  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayedGraphemeCount(graphemes.length);
      setIsTyping(false);
      setShowCursor(false);
      setShowTagline(true);
      setShowSupporting(true);
      setShowButtons(true);
      return;
    }

    // Reset sequence for new heading / language
    setDisplayedGraphemeCount(0);
    setIsTyping(true);
    setShowCursor(true);
    setShowTagline(false);
    setShowSupporting(false);
    setShowButtons(false);

    let currentIndex = 0;
    let typeTimer: NodeJS.Timeout | null = null;
    let cursorTimer: NodeJS.Timeout | null = null;
    let taglineTimer: NodeJS.Timeout | null = null;
    let supportingTimer: NodeJS.Timeout | null = null;
    let buttonsTimer: NodeJS.Timeout | null = null;

    // Typewriter step function with natural, calm pace (75-90ms per grapheme)
    const typeNext = () => {
      currentIndex += 1;
      setDisplayedGraphemeCount(currentIndex);

      if (currentIndex < graphemes.length) {
        const nextGrapheme = graphemes[currentIndex];
        // Natural cadence: slightly more time on spaces
        const stepDelay = nextGrapheme === ' ' ? 115 : 85;
        typeTimer = setTimeout(typeNext, stepDelay);
      } else {
        // Typing complete
        setIsTyping(false);

        // Smoothly fade out / remove cursor after a short pause
        cursorTimer = setTimeout(() => {
          setShowCursor(false);
        }, 280);

        // Phase 2: Reveal Tagline with gentle fade-in / subtle upward reveal
        taglineTimer = setTimeout(() => {
          setShowTagline(true);
        }, 380);

        // Phase 3: Reveal Supporting Description
        supportingTimer = setTimeout(() => {
          setShowSupporting(true);
        }, 880);

        // Phase 4: Reveal Action Buttons with soft pop-in
        buttonsTimer = setTimeout(() => {
          setShowButtons(true);
        }, 1480);
      }
    };

    // Small initial breath before typing begins
    typeTimer = setTimeout(typeNext, 220);

    return () => {
      if (typeTimer) clearTimeout(typeTimer);
      if (cursorTimer) clearTimeout(cursorTimer);
      if (taglineTimer) clearTimeout(taglineTimer);
      if (supportingTimer) clearTimeout(supportingTimer);
      if (buttonsTimer) clearTimeout(buttonsTimer);
    };
  }, [graphemes]);

  // Sliced text displayed so far
  const displayedHeading = useMemo(() => {
    return graphemes.slice(0, displayedGraphemeCount).join('');
  }, [graphemes, displayedGraphemeCount]);

  return (
    <div className="space-y-16 pb-16 bg-[#F4F9F5] dark:bg-[#0D1812] transition-colors">
      {/* HERO SECTION WITH FIXED 8-SECOND BANGLADESH COUNTRYSIDE VIDEO */}
      <section className="relative overflow-hidden min-h-[520px] lg:min-h-[580px] flex items-center justify-center">
        {/* Background Video Element - Unaltered, looping, muted, playsInline */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#EFF8F2]">
          <video
            ref={videoRef}
            src="/videos/bhumidisha-hero.mp4"
            poster="/images/land-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center"
          />

          {/* Gentle, light scrim overlay: Keeps lush countryside, green fields, and sky vibrant & clearly visible */}
          <div className="absolute inset-0 bg-black/15 dark:bg-black/40" />
        </div>

        {/* Hero Content Overlay: Restrained translucent light-panel for text contrast without darkening the landscape */}
        <div className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <div className="p-6 sm:p-10 rounded-3xl bg-white/92 dark:bg-[#0E1812]/85 backdrop-blur-md border border-white/90 dark:border-emerald-500/20 shadow-2xl space-y-6">
            {/* Main Welcome Heading with Slow Typewriter & Stable Container Dimensions */}
            <div className="min-h-[72px] sm:min-h-[64px] lg:min-h-[80px] flex items-center justify-center">
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-[#126B3A] dark:text-white inline-flex items-center justify-center flex-wrap"
                aria-label={headingText}
              >
                <span>{displayedHeading}</span>
                {showCursor && (
                  <span
                    className="inline-block w-[3px] sm:w-[4px] h-[0.8em] bg-[#126B3A] dark:bg-emerald-400 ml-1.5 align-middle animate-cursor-blink transition-opacity duration-300"
                    aria-hidden="true"
                  />
                )}
              </h1>
            </div>

            {/* Tagline & Supporting Copy (Gentle Staggered Fade-in) */}
            <div className="space-y-2.5 max-w-2xl mx-auto min-h-[84px] flex flex-col justify-center">
              {/* Tagline */}
              <p
                className={`text-base sm:text-xl font-bold text-[#198754] dark:text-emerald-300 tracking-wide transition-all duration-700 ease-out ${
                  showTagline
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                {t.heroTagline}
              </p>

              {/* Supporting Description */}
              <p
                className={`text-xs sm:text-sm text-[#202923] dark:text-neutral-200 leading-relaxed mx-auto transition-all duration-700 ease-out ${
                  showSupporting
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                {t.heroSupporting}
              </p>
            </div>

            {/* Action Buttons: Soft Pop-in Effect */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 min-h-[64px]">
              {/* Primary Action Button (Forest Green #126B3A) */}
              <button
                onClick={() => navigateWithAuth('verifier')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#126B3A] hover:bg-[#0E542D] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#126B3A] focus:ring-offset-2 transition-all duration-500 ease-out ${
                  showButtons
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-[0.94] pointer-events-none sm:pointer-events-auto'
                }`}
              >
                <FileSearch className="w-4 h-4" />
                <span>{t.heroCtaPrimary}</span>
              </button>

              {/* Secondary Action Button (Soft Brown #A66A3F) */}
              <button
                onClick={() => judgeDemoLogin('citizen')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#A66A3F] hover:bg-[#8C542E] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A66A3F] focus:ring-offset-2 transition-all duration-500 ease-out delay-150 ${
                  showButtons
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-[0.94] pointer-events-none sm:pointer-events-auto'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{t.heroCtaSecondary}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* THREE MAIN MODULE CARDS WITH REFINED WHITE & GREEN VISUAL HIERARCHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#126B3A] dark:text-[#38C172]">
            {isBn ? 'ভূমিদিশা মূল মডিউল' : 'BhumiDisha Core Modules'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#202923] dark:text-white">
            {isBn ? 'জমির তথ্য ও সুরক্ষা সেবা' : 'Land Information & Verification Services'}
          </h2>
          <p className="text-xs sm:text-sm text-[#66736B] dark:text-[#9FB0A5]">
            {isBn
              ? 'নিরাপদ লেনদেন ও স্বচ্ছ রেকর্ডের জন্য বিশেষায়িত ডিজিটাল প্ল্যাটফর্ম।'
              : 'Digital workflows engineered for pre-transaction due diligence and title clarity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: জমি কেনার আগে যাচাই */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md hover:border-[#126B3A] transition-all group">
            <div className="space-y-4">
              <div className="group-hover:scale-105 transition-transform">
                <VerifierLogo size={52} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#202923] dark:text-white group-hover:text-[#126B3A] transition-colors">
                {t.feature1Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#66736B] dark:text-[#9FB0A5] leading-relaxed">
                {t.feature1Desc}
              </p>
            </div>

            <button
              onClick={() => navigateWithAuth('verifier')}
              className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#EFF8F2] dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] text-xs font-bold group-hover:bg-[#126B3A] group-hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
            >
              <span>{t.feature1Action}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: আমার ভূমি-ওয়ালেট */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md hover:border-[#126B3A] transition-all group">
            <div className="space-y-4">
              <div className="group-hover:scale-105 transition-transform">
                <WalletLogo size={52} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#202923] dark:text-white group-hover:text-[#126B3A] transition-colors">
                {t.feature2Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#66736B] dark:text-[#9FB0A5] leading-relaxed">
                {t.feature2Desc}
              </p>
            </div>

            <button
              onClick={() => navigateWithAuth('wallet')}
              className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#EFF8F2] dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] text-xs font-bold group-hover:bg-[#126B3A] group-hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
            >
              <span>{t.feature2Action}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: ভূমিসাথী */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#14241B] border border-[#D9E7DD] dark:border-[#233B2E] shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md hover:border-[#126B3A] transition-all group">
            <div className="space-y-4">
              <div className="group-hover:scale-105 transition-transform">
                <AssistantLogo size={52} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#202923] dark:text-white group-hover:text-[#126B3A] transition-colors">
                {t.feature3Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#66736B] dark:text-[#9FB0A5] leading-relaxed">
                {t.feature3Desc}
              </p>
            </div>

            <button
              onClick={() => navigateWithAuth('assistant')}
              className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#EFF8F2] dark:bg-[#1E3024] text-[#126B3A] dark:text-[#38C172] text-xs font-bold group-hover:bg-[#126B3A] group-hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#126B3A]"
            >
              <span>{t.feature3Action}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
