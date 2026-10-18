import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ChevronLeft, ChevronRight, Check, Copy, Leaf } from 'lucide-react';
import { appStore } from '../services/store';

interface SeasonalCampaign {
  id: string;
  seasonEn: string;
  seasonNp: string;
  headlineEn: string;
  headlineNp: string;
  detailEn: string;
  detailNp: string;
  promoCode: string;
  ctaLabelEn: string;
  ctaLabelNp: string;
  targetCategory: string;
  targetSearch?: string;
}

const SEASONAL_CAMPAIGNS: SeasonalCampaign[] = [
  {
    id: 'sharad-immunity-2083',
    seasonEn: 'Sharad–Hemanta Ritu Campaign',
    seasonNp: 'शरद–हेमन्त ऋतु स्वास्थ्य अभियान',
    headlineEn: '20% OFF Seasonal Immunity & Respiratory Elixirs',
    headlineNp: 'मौसमी रोग प्रतिरोधात्मक काढा र रसायनमा २०% छुट',
    detailEn: 'Classical Chyawanprash, Tulsi & Giloy formulations for autumn-winter transition',
    detailNp: 'चिसो मौसमका लागि विशेष च्यावनप्राश, तुलसी र गुर्जोका आयुर्वेदिक उत्पादन',
    promoCode: 'RITU20',
    ctaLabelEn: 'Explore Elixirs',
    ctaLabelNp: 'काढा र रस हेर्नुहोस्',
    targetCategory: 'immunity-elixirs'
  },
  {
    id: 'dolpa-shilajit-harvest',
    seasonEn: 'High-Altitude Harvest Special',
    seasonNp: 'उच्च हिमाली शिलाजित विशेष छुट',
    headlineEn: 'Flat NPR 450 OFF Pure Dolpa Shilajit Gold Resin',
    headlineNp: 'डोल्पाको शुद्ध शिलाजित गोल्ड रेजिनमा रु. ४५० छुट',
    detailEn: '100% Heavy-Metal Tested & DDA Certified · Complimentary Brass Dosing Spoon',
    detailNp: 'DDA प्रमाणित र प्रयोगशाला परीक्षण गरिएको · निःशुल्क पित्तलको चम्चा सहित',
    promoCode: 'SHILAJIT450',
    ctaLabelEn: 'Shop Shilajit',
    ctaLabelNp: 'शिलाजित किन्नुहोस्',
    targetCategory: 'herbal-supplements',
    targetSearch: 'Shilajit'
  },
  {
    id: 'winter-joint-relief',
    seasonEn: 'Autumn Joint & Vata Care Drive',
    seasonNp: 'वायु तथा जोर्नी हेरचाह अभियान',
    headlineEn: 'Extra 15% OFF Ayurvedic Joint Oils & Pain Relief Balms',
    headlineNp: 'जोर्नी दुखाइ तेल र बाममा अतिरिक्त १५% छुट',
    detailEn: 'Free Nepal-Wide Express COD on orders above NPR 2,500',
    detailNp: 'रु. २,५०० माथिको अर्डरमा नेपालभर निःशुल्क एक्सप्रेस डेलिभरी',
    promoCode: 'VATA15',
    ctaLabelEn: 'Shop Joint Care',
    ctaLabelNp: 'जोर्नी हेरचाह हेर्नुहोस्',
    targetCategory: 'joint-personal-care'
  }
];

const STORAGE_KEY = 'careplus_promo_banner_dismissed_v1';

export const PromoBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const language = appStore.getLanguage();
  const campaign = SEASONAL_CAMPAIGNS[activeIndex];

  useEffect(() => {
    if (isDismissed || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SEASONAL_CAMPAIGNS.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isDismissed, isPaused]);

  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore storage error in restricted environments
    }
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SEASONAL_CAMPAIGNS.length) % SEASONAL_CAMPAIGNS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SEASONAL_CAMPAIGNS.length);
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    window.setTimeout(() => {
      setCopiedCode((current) => (current === code ? null : current));
    }, 2200);
  };

  const handleApplyCampaign = () => {
    appStore.setSelectedCategory(campaign.targetCategory);
    appStore.setSearchQuery(campaign.targetSearch || '');
    const catalogEl = document.getElementById('product-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      role="region"
      aria-label={language === 'en' ? 'Seasonal Ayurvedic Health Promotions' : 'मौसमी आयुर्वेदिक स्वास्थ्य अभियान'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-[#1F1A14] text-[#F9F6F0] border-b border-[#362E24] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-2 sm:gap-4 text-xs">
        {/* Left: Campaign Switcher Controls (Desktop/Tablet) */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            aria-label={language === 'en' ? 'Previous campaign' : 'अघिल्लो अभियान'}
            className="p-1 text-stone-400 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-amber-400 rounded transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-stone-400 tabular-nums select-none">
            {activeIndex + 1}/{SEASONAL_CAMPAIGNS.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            aria-label={language === 'en' ? 'Next campaign' : 'अर्को अभियान'}
            className="p-1 text-stone-400 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-amber-400 rounded transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Seasonal Campaign Message & Interactive Controls */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-center sm:text-left min-w-0">
          <span className="inline-flex items-center gap-1.5 font-medium text-amber-300/95 tracking-wide shrink-0">
            <Leaf className="w-3.5 h-3.5 text-[#78B94A] shrink-0" />
            <span>{language === 'en' ? campaign.seasonEn : campaign.seasonNp}</span>
          </span>

          <span aria-hidden="true" className="hidden md:inline text-stone-500">
            ·
          </span>

          <span className="font-semibold text-white tracking-tight">
            {language === 'en' ? campaign.headlineEn : campaign.headlineNp}
          </span>

          <span aria-hidden="true" className="hidden lg:inline text-stone-500">
            —
          </span>

          <span className="hidden xl:inline text-stone-300 truncate max-w-md">
            {language === 'en' ? campaign.detailEn : campaign.detailNp}
          </span>

          <span aria-hidden="true" className="hidden sm:inline text-stone-500">
            ·
          </span>

          {/* Interactive Copy Promo Code Control */}
          <button
            type="button"
            onClick={() => handleCopyCode(campaign.promoCode)}
            title={language === 'en' ? 'Click to copy promo code' : 'प्रोमो कोड कपी गर्नुहोस्'}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#2D261E] hover:bg-[#3A3127] text-amber-200 border border-amber-500/30 font-mono text-[11px] transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <span>{language === 'en' ? 'Code:' : 'कोड:'}</span>
            <strong className="font-bold text-amber-300">{campaign.promoCode}</strong>
            {copiedCode === campaign.promoCode ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-sans font-medium">
                <Check className="w-3 h-3" />
                <span>{language === 'en' ? 'Copied' : 'कपी भयो'}</span>
              </span>
            ) : (
              <Copy className="w-3 h-3 text-stone-400" />
            )}
          </button>

          {/* Direct Action CTA Link */}
          <button
            type="button"
            onClick={handleApplyCampaign}
            className="inline-flex items-center gap-1 font-semibold text-[#9BE16B] hover:text-amber-300 underline underline-offset-4 decoration-[#9BE16B]/50 hover:decoration-amber-300 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <span>{language === 'en' ? campaign.ctaLabelEn : campaign.ctaLabelNp}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Dismiss Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            aria-label={language === 'en' ? 'Dismiss promotional banner' : 'यो सूचना बन्द गर्नुहोस्'}
            title={language === 'en' ? 'Dismiss banner' : 'बन्द गर्नुहोस्'}
            className="p-1 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
