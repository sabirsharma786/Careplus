import React from 'react';
import { Award, Star, ShoppingBag, Zap } from 'lucide-react';
import { Product } from '../types';
import { appStore } from '../services/store';

interface TopFlagshipSectionProps {
  onOpenDetails: (product: Product) => void;
}

export const TopFlagshipSection: React.FC<TopFlagshipSectionProps> = ({ onOpenDetails }) => {
  const products = appStore.getProducts();
  const language = appStore.getLanguage();

  // Pick the 5 flagship remedies
  const flagshipProducts = products
    .filter((p) => p.isFlagship)
    .sort((a, b) => (a.flagshipRank || 99) - (b.flagshipRank || 99))
    .slice(0, 5);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    appStore.addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    appStore.addToCart(product, 1);
    appStore.setIsCartOpen(false);
    appStore.setIsCheckoutOpen(true);
  };

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-5">
          <div className="inline-flex items-center gap-1.5 text-[#176B51] text-xs font-semibold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>नेपालका शीर्ष ५ प्रामाणिक औषधिहरू · Nepal's Top 5 Flagship Remedies</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {language === 'np' ? 'हाम्रा मुख्य ५ हिमालयन उपचारहरू' : 'CarePlus Flagship Herbal Formulations'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Hand-harvested from high alpine cliffs in Manang, Dolpa, and Mustang. Laboratory tested, heavy-metal certified, and Department of Drug Administration (DDA) registered.
          </p>
        </div>

        {/* 5-Column Grid on Desktop / 2-Column on Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {flagshipProducts.map((product) => {
            const currentPrice = product.isFlashSale && product.flashSaleDiscount
              ? Math.round(product.retailPrice * (1 - product.flashSaleDiscount / 100))
              : product.retailPrice;

            const productUrl = `?product=${encodeURIComponent(product.id)}`;
            const handleCardNav = (e: React.MouseEvent) => {
              if (!e.metaKey && !e.ctrlKey && e.button !== 1) {
                e.preventDefault();
                onOpenDetails(product);
              }
            };

            return (
              <div
                key={product.id}
                onClick={() => onOpenDetails(product)}
                className="group relative bg-[#FBFDFB] hover:bg-white rounded-xl border border-stone-200/90 hover:border-[#176B51] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                {/* Ranking Tag */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="bg-[#176B51] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow flex items-center gap-0.5">
                    #{product.flagshipRank} Best Seller
                  </span>
                </div>

                {/* 1:1 Image Link */}
                <a
                  href={productUrl}
                  onClick={handleCardNav}
                  className="relative w-full aspect-square bg-[#F4F7F4] overflow-hidden block"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </a>

                {/* Content */}
                <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-bold text-stone-800 tabular-nums">{product.rating}</span>
                      <span className="text-[10px] text-stone-400">({product.reviewsCount})</span>
                    </div>

                    <a
                      href={productUrl}
                      onClick={handleCardNav}
                      className="block font-semibold text-stone-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#176B51] transition-colors"
                    >
                      {language === 'np' ? product.nepaliName : product.name}
                    </a>
                    <p className="text-[11px] text-stone-500 mt-1 truncate">{product.packSize}</p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 flex flex-col gap-2">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-[#176B51] tabular-nums">
                        NPR {currentPrice.toLocaleString()}
                      </span>
                      {product.mrp > currentPrice && (
                        <span className="text-[10px] sm:text-xs text-stone-400 line-through tabular-nums">
                          NPR {product.mrp.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Both Add to Cart and Buy Now */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full bg-emerald-50 hover:bg-emerald-100 active:scale-[0.98] text-[#176B51] border border-emerald-200 text-[10px] sm:text-xs font-semibold py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-3 h-3 shrink-0" />
                        <span className="truncate">Cart</span>
                      </button>

                      <button
                        onClick={(e) => handleBuyNow(e, product)}
                        className="w-full bg-[#176B51] hover:bg-[#12543f] active:scale-[0.98] text-white text-[10px] sm:text-xs font-bold py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 shadow-xs transition-all"
                        title="Buy Now (Instant Checkout)"
                      >
                        <Zap className="w-3 h-3 fill-white shrink-0" />
                        <span className="truncate">Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quality Footnote Centered */}
        <div className="mt-8 text-center text-xs text-stone-500 flex items-center justify-center gap-2 flex-wrap">
          <span>✓ 100% Himalayan Alpine Botanicals</span>
          <span>·</span>
          <span>✓ Zero Heavy Metal Contaminants</span>
          <span>·</span>
          <span>✓ Cash on Delivery Across All 7 Provinces</span>
        </div>
      </div>
    </section>
  );
};
