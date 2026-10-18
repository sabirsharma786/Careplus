import React, { useState, useEffect } from 'react';
import { Zap, Timer, Flame, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { appStore } from '../services/store';

interface FlashSaleSectionProps {
  onOpenDetails: (product: Product) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({ onOpenDetails }) => {
  const products = appStore.getProducts();
  const language = appStore.getLanguage();

  // Flash sale products
  const flashSaleProducts = products.filter((p) => p.isFlashSale).slice(0, 4);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    <section className="py-6 sm:py-8 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FFFDF9] border-b border-amber-200/60 relative overflow-hidden">
      {/* Decorative subtle aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Flash Sale Header with Countdown */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-200/70 mb-5">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>सीमित समय अफर · Limited-Time Flash Sale</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {language === 'np' ? 'विशेष छुट अफर (३०% सम्म छुट)' : 'Autumn Harvest Mega Deals — Up to 30% Off'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Fresh mountain extractions bottled at Baluwatar apothecary. Offers expire when batch allocations sell out.
            </p>
          </div>

          {/* Centered Countdown Box */}
          <div className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-md border border-stone-800 shrink-0">
            <Timer className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-medium text-stone-300 mr-1 hidden sm:inline">Ends In:</span>
            <div className="flex items-center gap-1.5 font-mono text-base font-bold tabular-nums">
              <div className="bg-stone-800 px-2 py-1 rounded text-amber-400">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-amber-400">:</span>
              <div className="bg-stone-800 px-2 py-1 rounded text-amber-400">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-amber-400">:</span>
              <div className="bg-stone-800 px-2 py-1 rounded text-amber-400">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column on Mobile / 4-Column on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {flashSaleProducts.map((product) => {
            const currentPrice = Math.round(product.retailPrice * (1 - (product.flashSaleDiscount || 0) / 100));
            const unitsLeft = (product.stock % 15) + 3; // urgency counter

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
                className="group bg-white rounded-xl border border-amber-300/70 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden relative"
              >
                {/* Urgent Discount Ribbon */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="bg-[#F4A340] text-stone-900 font-extrabold text-[11px] sm:text-xs px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-stone-900" />
                    SAVE {product.flashSaleDiscount}%
                  </span>
                </div>

                {/* 1:1 Image Link */}
                <a
                  href={productUrl}
                  onClick={handleCardNav}
                  className="relative w-full aspect-square bg-[#FDFBF7] overflow-hidden block"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </a>

                {/* Content */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                      {product.packSize}
                    </span>
                    <a
                      href={productUrl}
                      onClick={handleCardNav}
                      className="block font-semibold text-stone-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#176B51] transition-colors mt-0.5"
                    >
                      {language === 'np' ? product.nepaliName : product.name}
                    </a>
                  </div>

                  {/* Stock Bar Urgency */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-amber-900">
                      <span>Limited Batch:</span>
                      <span className="text-red-600 font-bold tabular-nums">Only {unitsLeft} left!</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-base sm:text-lg font-extrabold text-[#176B51] tabular-nums">
                        NPR {currentPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-400 line-through tabular-nums">
                        NPR {product.retailPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full bg-amber-50 hover:bg-amber-100 active:scale-[0.98] text-amber-900 border border-amber-200 text-xs font-semibold py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                        title="Add to shopping cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Add to Cart</span>
                      </button>

                      <button
                        onClick={(e) => handleBuyNow(e, product)}
                        className="w-full bg-[#176B51] hover:bg-[#12543f] active:scale-[0.98] text-white text-xs font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 shadow transition-all"
                        title="One-click direct checkout"
                      >
                        <Zap className="w-3.5 h-3.5 fill-white shrink-0" />
                        <span className="truncate">Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
