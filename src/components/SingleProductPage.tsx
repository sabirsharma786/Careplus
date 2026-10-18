import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Check,
  ShoppingBag,
  Zap,
  Truck,
  ChevronRight,
  Share2,
  ExternalLink,
  FlaskConical,
  PackageCheck,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { appStore } from '../services/store';
import { CATEGORIES } from '../services/mockData';
import { ProductCard } from './ProductCard';

interface SingleProductPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SingleProductPage: React.FC<SingleProductPageProps> = ({
  product,
  onBack,
  onSelectProduct
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const language = appStore.getLanguage();
  const allProducts = appStore.getProducts();

  // Reset local state when switching between products on the single product page
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    const prevTitle = document.title;
    document.title = `${product.name} | CarePlus Ayurveda Nepal`;
    return () => {
      document.title = prevTitle;
    };
  }, [product]);

  const categoryInfo = CATEGORIES.find((c) => c.id === product.category);
  const categoryNameEn = categoryInfo ? categoryInfo.name : product.category;
  const categoryNameNp = categoryInfo ? categoryInfo.nepaliName : product.category;

  const currentPrice =
    product.isFlashSale && product.flashSaleDiscount
      ? Math.round(product.retailPrice * (1 - product.flashSaleDiscount / 100))
      : product.retailPrice;

  const discountPercent =
    product.isFlashSale && product.flashSaleDiscount
      ? product.flashSaleDiscount
      : Math.round(((product.mrp - product.retailPrice) / product.mrp) * 100);

  // Related products: same category first (excluding current product), up to 4 items
  const sameCategoryProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  const fallbackProducts = allProducts.filter(
    (p) => p.category !== product.category && p.id !== product.id && p.isFlagship
  );
  const relatedProducts = [...sameCategoryProducts, ...fallbackProducts].slice(0, 4);

  const handleAddToCart = () => {
    appStore.addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    appStore.addToCart(product, quantity);
    appStore.setIsCartOpen(false);
    appStore.setIsCheckoutOpen(true);
  };

  const handleCategoryRedirect = () => {
    appStore.setSelectedCategory(product.category);
    setTimeout(() => {
      const catalogEl = document.getElementById('product-catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleCopyProductLink = () => {
    const productUrl = `${window.location.origin}${window.location.pathname}?product=${encodeURIComponent(product.id)}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(productUrl).catch(() => {});
    }
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 2200);
  };

  const productDirectHref = `?product=${encodeURIComponent(product.id)}`;

  return (
    <div className="bg-[#F7FAF7] min-h-screen pb-16">
      {/* Top Breadcrumb & Page Navigation Bar */}
      <div className="bg-white border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-stone-500">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-semibold text-[#176B51] hover:text-[#124C3A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'np' ? 'स्टोरमा फर्कनुहोस्' : 'Back to Storefront'}</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <button
              type="button"
              onClick={handleCategoryRedirect}
              className="hover:text-[#176B51] font-medium transition-colors cursor-pointer"
            >
              {language === 'np' ? categoryNameNp : categoryNameEn}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {language === 'np' ? product.nepaliName : product.name}
            </span>
          </nav>

          {/* Direct Product Link & Share Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyProductLink}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium transition-colors cursor-pointer"
              title="Copy direct product link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">
                    {language === 'np' ? 'लिंक कपी भयो' : 'Link Copied'}
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>{language === 'np' ? 'लिंक सेयर' : 'Copy Product Link'}</span>
                </>
              )}
            </button>

            <a
              href={productDirectHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-[#176B51] font-semibold transition-colors"
              title="Open product page in a new browser tab"
            >
              <span>{language === 'np' ? 'नयाँ ट्याबमा खोल्नुहोस्' : 'Open in New Tab'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Single Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT COLUMN: Product Gallery & Lab Quality Verification (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-28">
              <div className="relative w-full aspect-square bg-[#F4F7F4] rounded-2xl overflow-hidden border border-stone-200">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&h=800&q=80';
                  }}
                />
                {product.isFlashSale ? (
                  <span className="absolute top-3.5 left-3.5 bg-[#F4A340] text-stone-900 font-extrabold text-xs px-3 py-1 rounded-md shadow flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-stone-900" />
                    FLASH DEAL -{product.flashSaleDiscount}%
                  </span>
                ) : discountPercent > 0 ? (
                  <span className="absolute top-3.5 left-3.5 bg-[#176B51] text-white font-bold text-xs px-3 py-1 rounded-md shadow">
                    SAVE {discountPercent}%
                  </span>
                ) : null}
              </div>

              {/* Image Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImage === idx
                          ? 'border-[#176B51] ring-2 ring-[#176B51]/20'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Nepal DDA & Lab Certification Box */}
              <div className="p-4 bg-[#F4F9F5] border border-emerald-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#176B51]">
                    <ShieldCheck className="w-4 h-4 text-[#176B51] shrink-0" />
                    <span>Govt. of Nepal DDA Certified Remedy</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-stone-700">
                    {product.ddaRegNo}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  ICP-MS laboratory tested for zero heavy-metal toxicity (Lead, Arsenic, Mercury &amp; Cadmium safe). Authentic Himalayan botanical extraction.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Requested Order -> 1. Category -> 2. Product Name -> 3. Review & Stock -> 4. Add to Cart & Buy Now -> 5. Product Description (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              {/* 1. PRODUCT CATEGORY ON TOP */}
              <div className="flex items-center flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-[#176B51]">
                <button
                  type="button"
                  onClick={handleCategoryRedirect}
                  className="hover:underline cursor-pointer"
                >
                  {language === 'np' ? categoryNameNp : categoryNameEn}
                </button>
                <span aria-hidden="true" className="text-stone-300">
                  ·
                </span>
                <span className="text-stone-500 font-medium normal-case">
                  {product.subcategory}
                </span>
                <span aria-hidden="true" className="text-stone-300">
                  ·
                </span>
                <span className="font-mono text-[11px] text-stone-400">SKU: {product.sku}</span>
              </div>

              {/* 2. PRODUCT NAME */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 mt-2 leading-tight">
                {language === 'np' ? product.nepaliName : product.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
                {language === 'np' ? product.name : product.nepaliName} ·{' '}
                <span className="text-stone-700 font-semibold">{product.packSize}</span>
              </p>

              {/* 3. REVIEW & STOCK STATUS */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-4 pb-4 border-b border-stone-200/80 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-stone-900 tabular-nums">{product.rating}</span>
                  <span className="text-stone-500">
                    ({product.reviewsCount} {language === 'np' ? 'प्रमाणित समीक्षाहरू' : 'verified reviews'})
                  </span>
                </div>

                <span aria-hidden="true" className="text-stone-300">
                  ·
                </span>

                {/* Stock Status */}
                <div className="flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  {product.stock > 0 ? (
                    <span className="font-semibold text-emerald-700 tabular-nums">
                      {language === 'np'
                        ? `स्टकमा उपलब्ध (${product.stock} थान)`
                        : `In Stock (${product.stock} units ready for dispatch)`}
                    </span>
                  ) : (
                    <span className="font-semibold text-red-600">
                      {language === 'np' ? 'स्टक सकियो' : 'Out of Stock'}
                    </span>
                  )}
                </div>
              </div>

              {/* PRICE BLOCK */}
              <div className="mt-5 p-4 bg-[#F8FAF8] rounded-xl border border-stone-200/80 flex flex-wrap items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#176B51] tabular-nums">
                    NPR {currentPrice.toLocaleString()}
                  </span>
                  {product.mrp > currentPrice && (
                    <span className="text-sm sm:text-base text-stone-400 line-through tabular-nums">
                      NPR {product.mrp.toLocaleString()}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold text-amber-800">
                      Save NPR {(product.mrp - currentPrice).toLocaleString()} ({discountPercent}% OFF)
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  Inclusive of 13% Nepal VAT
                </span>
              </div>

              {/* 4. QUANTITY + ADD TO CART & BUY NOW BUTTONS (Placed BEFORE Product Description as requested) */}
              <div className="mt-5 p-4 sm:p-5 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-3.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between sm:justify-start border border-stone-300 rounded-xl overflow-hidden bg-white shrink-0">
                    <span className="px-3 text-xs font-semibold text-stone-500 sm:hidden">
                      Quantity:
                    </span>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3.5 py-2.5 text-stone-700 hover:bg-stone-100 text-sm font-bold transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-4 py-2.5 text-sm font-bold text-stone-900 tabular-nums min-w-[2.5rem] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                        className="px-3.5 py-2.5 text-stone-700 hover:bg-stone-100 text-sm font-bold transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* ADD TO CART BUTTON */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#176B51] hover:bg-[#12543f] active:scale-[0.99] text-white text-xs sm:text-sm font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>
                      {language === 'np' ? 'कार्टमा राख्नुहोस्' : 'Add to Cart'} · NPR{' '}
                      {(currentPrice * quantity).toLocaleString()}
                    </span>
                  </button>

                  {/* BUY NOW BUTTON */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#78B94A] hover:bg-[#68a63f] active:scale-[0.99] text-white text-xs sm:text-sm font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white shrink-0" />
                    <span>
                      {language === 'np' ? 'अहिले किन्नुहोस् (Buy Now)' : 'Buy Now · Instant Checkout'}
                    </span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-stone-600 pt-1 border-t border-stone-200/70">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#176B51] shrink-0" />
                    <span>Same-Day Dispatch from Baluwatar Hub · Cash on Delivery Across All 7 Provinces</span>
                  </div>
                  <span className="font-semibold text-[#176B51]">Free Delivery over NPR 2,500</span>
                </div>
              </div>

              {/* 5. PRODUCT DESCRIPTION ON FRONTEND PAGE (Below Add to Cart & Buy Now) */}
              <div className="mt-7 pt-6 border-t border-stone-200 space-y-6">
                {/* Detailed Description */}
                <div className="space-y-2.5">
                  <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                    {language === 'np' ? 'उत्पादनको विस्तृत विवरण (Product Description)' : 'Product Description & Ayurvedic Overview'}
                  </h2>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {language === 'np' ? product.nepaliDescription : product.description}
                  </p>
                  <p className="text-xs text-stone-500 leading-relaxed italic">
                    {language === 'np' ? product.description : product.nepaliDescription}
                  </p>
                </div>

                {/* Key Ayurvedic Benefits */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    {language === 'np' ? 'प्रमुख आयुर्वेदिक फाइदाहरू' : 'Key Therapeutic & Ayurvedic Benefits'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-[#F8FAF8] border border-stone-200/70 text-xs text-stone-700"
                      >
                        <Check className="w-4 h-4 text-[#176B51] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Botanical Ingredients */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    {language === 'np' ? 'मुख्य जडीबुटी र सामग्रीहरू' : 'Active Himalayan Botanical Ingredients'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {product.ingredients.join(' · ')}
                  </p>
                </div>

                {/* Classical Dosage & Usage Instructions */}
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 uppercase tracking-wider">
                    <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
                    <span>
                      {language === 'np' ? 'सेवन वा प्रयोग गर्ने विधि (Direction for Use)' : 'Recommended Dosage & Direction for Use'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {product.usageInstructions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. RELATED PRODUCTS SECTION ON SINGLE PRODUCT PAGE */}
        <section aria-labelledby="related-products-heading" className="mt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#176B51] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'np' ? categoryNameNp : categoryNameEn}</span>
              </span>
              <h2
                id="related-products-heading"
                className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1"
              >
                {language === 'np'
                  ? 'सम्बन्धित आयुर्वेदिक उत्पादनहरू (Related Products)'
                  : 'Related Himalayan Remedies You May Also Like'}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleCategoryRedirect}
              className="text-xs font-bold text-[#176B51] hover:text-[#124C3A] underline underline-offset-4 self-start sm:self-auto cursor-pointer"
            >
              {language === 'np'
                ? `${categoryNameNp} का सबै उत्पादन हेर्नुहोस् →`
                : `View all in ${categoryNameEn} →`}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {relatedProducts.map((relProd) => (
              <ProductCard
                key={relProd.id}
                product={relProd}
                onOpenDetails={(selected) => onSelectProduct(selected)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
