import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  Leaf,
  FlaskConical,
  Award,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { appStore } from '../services/store';
import { CATEGORIES } from '../services/mockData';
import { ProductCard } from './ProductCard';
import { TopFlagshipSection } from './TopFlagshipSection';
import { FlashSaleSection } from './FlashSaleSection';
import { CuratedProductTabs } from './CuratedProductTabs';
import { Product } from '../types';

interface RetailStorefrontProps {
  onOpenProductDetails: (product: Product) => void;
}

const HERO_SLIDES = [
  {
    id: 'slide-shilajit',
    kickerEn: '100% Wild Alpine Harvest · Dolpa & Mustang',
    kickerNp: 'डोल्पा र मुस्ताङको उच्च हिमालबाट संकलित',
    titleEn: 'Authentic Himalayan Remedies from the Heights of Nepal',
    titleNp: 'हिमालयको शुद्धता र शास्त्रीय आयुर्वेद',
    subtitleEn:
      'Lab-certified Pure Shilajit Gold Resin, Saffron Kumkumadi Oil & Classical Chyawanprash formulated under strict Ayurvedic pharmacopeia.',
    subtitleNp:
      'प्रयोगशाला प्रमाणित शुद्ध शिलाजित, कुंकुमादि तेल, च्यवनप्राश र जडीबुटीका मौलिक उत्पादनहरू।',
    ctaLabelEn: 'Explore Top 5 Flagships',
    ctaLabelNp: 'शीर्ष ५ उत्पादन हेर्नुहोस्',
    bgImage:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80',
    targetCategory: 'all'
  },
  {
    id: 'slide-immunity',
    kickerEn: 'Sharad–Hemanta Ritu Wellness · Nepal DDA Reg. AYU-78',
    kickerNp: 'शरद–हेमन्त ऋतु विशेष रोग प्रतिरोधात्मक काढा',
    titleEn: 'Seasonal Immunity Elixirs & Classical Rasayana',
    titleNp: 'मौसमी रोग प्रतिरोधात्मक काढा र रसायन',
    subtitleEn:
      'Strengthen respiratory & digestive vitality with Gold Kesar Chyawanprash, Giloy Tulsi Kadha, and Organic Triphala.',
    subtitleNp:
      'केशर युक्त च्यवनप्राश, तुलसी-गुर्जो काढा र त्रिफला चूर्णले मौसमी स्वास्थ्य बलियो बनाउनुहोस्।',
    ctaLabelEn: 'Shop Immunity Elixirs',
    ctaLabelNp: 'काढा र रसायन किन्नुहोस्',
    bgImage:
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80',
    targetCategory: 'immunity-elixirs'
  },
  {
    id: 'slide-skincare',
    kickerEn: 'Kshir Pak Vidhi · 72-Hour Brass Vat Infusion',
    kickerNp: 'क्षीर पाक विधिद्वारा निर्मित आयुर्वेदिक सौन्दर्य',
    titleEn: 'Miraculous Saffron Kumkumadi & Bhringraj Care',
    titleNp: 'केशर कुंकुमादि तेल र भृङ्गराज हेयर केयर',
    subtitleEn:
      'Zero mineral oil, zero parabens — pure cold-pressed botanical oils for radiant skin and nourished roots.',
    subtitleNp:
      'रसायन रहित शुद्ध जडीबुटीको तेल — चम्किलो छाला र बलियो कपालका लागि।',
    ctaLabelEn: 'Explore Skin & Hair Care',
    ctaLabelNp: 'छाला र कपाल हेरचाह',
    bgImage:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1600&q=80',
    targetCategory: 'ayurvedic-skincare'
  }
];

export const RetailStorefront: React.FC<RetailStorefrontProps> = ({ onOpenProductDetails }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const products = appStore.getProducts();
  const selectedCategory = appStore.getSelectedCategory();
  const searchQuery = appStore.getSearchQuery().toLowerCase().trim();
  const language = appStore.getLanguage();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  // Filter products for the main catalog section
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery) ||
      p.nepaliName.includes(searchQuery) ||
      p.sku.toLowerCase().includes(searchQuery) ||
      p.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery)) ||
      p.benefits.some((b) => b.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const handleSlideCta = () => {
    if (slide.targetCategory === 'all') {
      const el = document.getElementById('flagship-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      appStore.setSelectedCategory(slide.targetCategory);
      const el = document.getElementById('product-catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-0">
      {/* 1. COMPACT SLEEK HERO SLIDER & BANNER */}
      <section className="relative bg-[#0E4232] text-white overflow-hidden py-5 sm:py-7 lg:py-8 border-b border-emerald-900">
        {/* Mountain Atmosphere Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay transition-all duration-700"
          style={{
            backgroundImage: `url('${slide.bgImage}')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3528] via-[#0E4232]/90 to-[#0B3528]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Left / Center Compact Slider Content */}
            <div className="text-center md:text-left max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#9BE16B] tracking-wide uppercase">
                <Leaf className="w-3.5 h-3.5 text-[#78B94A] shrink-0" />
                <span>{language === 'np' ? slide.kickerNp : slide.kickerEn}</span>
              </div>

              <h1 className="text-xl sm:text-3xl lg:text-4xl font-serif font-extrabold tracking-tight text-white leading-snug">
                {language === 'np' ? slide.titleNp : slide.titleEn}
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                {language === 'np' ? slide.subtitleNp : slide.subtitleEn}
              </p>
            </div>

            {/* Right: Compact Call to Action & Slider Controls */}
            <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end gap-2.5 shrink-0 w-full md:w-auto justify-center">
              <div className="flex items-center justify-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSlideCta}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#78B94A] hover:bg-[#68a63f] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{language === 'np' ? slide.ctaLabelNp : slide.ctaLabelEn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => appStore.setIsTrackOrderOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-emerald-300" />
                  <span className="hidden sm:inline">Track Order</span>
                </button>
              </div>

              {/* Slider Dots & Prev/Next Arrows */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                  }
                  aria-label="Previous slide"
                  className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1.5">
                  {HERO_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx ? 'w-5 bg-[#78B94A]' : 'w-1.5 bg-white/35 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                  aria-label="Next slide"
                  className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Compact Trust Strip */}
          <div className="mt-4 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] sm:text-xs text-emerald-100/85 border-t border-white/10">
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#78B94A] shrink-0" />
              <span>100% Wild Alpine Harvest</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-[#78B94A] shrink-0" />
              <span>Zero Heavy Metal Toxicity</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#78B94A] shrink-0" />
              <span>Nepal DDA Reg. AYU-78</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#78B94A] shrink-0" />
              <span>GMP Laboratory Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED 5 FLAGSHIP PRODUCTS SECTION DIRECTLY AFTER SLIDER */}
      <div id="flagship-section">
        <TopFlagshipSection onOpenDetails={onOpenProductDetails} />
      </div>

      {/* 3. FLASH SALE SECTION */}
      <FlashSaleSection onOpenDetails={onOpenProductDetails} />

      {/* 4. CURATED PRODUCT TABS: TRENDING NOW, TOP RATED, NEW ARRIVALS */}
      <CuratedProductTabs onOpenDetails={onOpenProductDetails} />

      {/* 5. COMPLETE 25 REMEDIES CATALOG (5 PER CATEGORY) */}
      <section id="product-catalog-section" className="py-8 sm:py-10 bg-[#F7FAF7] border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          {/* Centered Catalog Header */}
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#176B51]">
              CarePlus Nepal Full Pharmacopeia
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {language === 'np' ? 'हाम्रा सबै प्राकृतिक उपचारहरू' : 'All Authentic Himalayan Remedies'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              25 lab-certified botanical formulations categorized by holistic healing systems.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => appStore.setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#176B51] text-white shadow-md'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {language === 'np' ? cat.nepaliName : cat.name}
              </button>
            ))}
          </div>

          {/* Active Category Meta Bar */}
          <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-200 pb-2">
            <span>
              Showing <strong className="text-stone-800">{filteredProducts.length}</strong> remedies
              {selectedCategory !== 'all' && ` in ${CATEGORIES.find((c) => c.id === selectedCategory)?.name}`}
            </span>
            <span>All prices inclusive of 13% Nepal VAT</span>
          </div>

          {/* Product Grid: 2 Columns on Mobile (`grid-cols-2`), 4 Columns on Desktop */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
              <p className="text-stone-600 font-medium">No botanical remedies found matching your criteria.</p>
              <button
                onClick={() => {
                  appStore.setSelectedCategory('all');
                  appStore.setSearchQuery('');
                }}
                className="text-xs text-[#176B51] font-bold underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={onOpenProductDetails}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. LAB PURITY, TESTING & DDA CERTIFICATION SECTION */}
      <section id="lab-quality" className="py-14 bg-white border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#176B51] uppercase tracking-wider">
                Government of Nepal Verified
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                Purity Guaranteed By Strict Laboratory Assays
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Every batch of CarePlus Shilajit, Kumkumadi Oil, and Chyawanprash passes multi-stage ICP-MS testing for heavy metals (Lead, Arsenic, Cadmium, Mercury) well below WHO and Nepal Department of Drug Administration permissible thresholds.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-[#176B51] shrink-0 mt-0.5" />
                  <span><strong>100% Alpine Sourced:</strong> Gathered responsibly by indigenous Sherpa, Gurung, and Thakali harvesters above 12,000 feet.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-[#176B51] shrink-0 mt-0.5" />
                  <span><strong>Classical Pharmacopeia Cooking:</strong> Oils cooked for 72 continuous hours in pure brass vats under Kshir Pak Vidhi.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-[#176B51] shrink-0 mt-0.5" />
                  <span><strong>Zero Adulteration / Zero Additives:</strong> Free from parabens, mineral oils, synthetic fragrances, and artificial preservatives.</span>
                </div>
              </div>
            </div>

            {/* Visual Lab Certificate Card */}
            <div className="bg-[#F8FAF8] border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4 border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#176B51] text-white flex items-center justify-center">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Certificate of Analysis (COA)</h3>
                    <p className="text-[11px] text-stone-500">CarePlus Central Quality Lab, Kathmandu</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  PASSED QC
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-600">Lead (Pb) Content:</span>
                  <span className="font-mono font-bold text-emerald-700">&lt; 0.05 ppm (Safe)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-600">Arsenic (As) Content:</span>
                  <span className="font-mono font-bold text-emerald-700">&lt; 0.02 ppm (Safe)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-600">Active Fulvic Acid:</span>
                  <span className="font-mono font-bold text-emerald-700">78.4% (Grade A+)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-600">DDA Registration Code:</span>
                  <span className="font-mono font-bold text-stone-800">DDA-AY-2079/012</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
