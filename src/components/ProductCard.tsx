import React from 'react';
import { Star, ShoppingBag, Eye, Zap } from 'lucide-react';
import { Product } from '../types';
import { appStore } from '../services/store';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const language = appStore.getLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    appStore.addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // One-click Buy: adds to cart and directly triggers Nepal Checkout Modal
    appStore.addToCart(product, 1);
    appStore.setIsCartOpen(false);
    appStore.setIsCheckoutOpen(true);
  };

  const currentPrice = product.isFlashSale && product.flashSaleDiscount
    ? Math.round(product.retailPrice * (1 - product.flashSaleDiscount / 100))
    : product.retailPrice;

  const discountPercent = product.isFlashSale && product.flashSaleDiscount
    ? product.flashSaleDiscount
    : Math.round(((product.mrp - product.retailPrice) / product.mrp) * 100);

  const productUrl = `?product=${encodeURIComponent(product.id)}`;

  const handleCardNavigation = (e: React.MouseEvent) => {
    if (!e.metaKey && !e.ctrlKey && e.button !== 1) {
      e.preventDefault();
      onOpenDetails(product);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-xl border border-stone-200/90 hover:border-[#176B51] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full cursor-pointer overflow-hidden relative"
    >
      {/* 1:1 Image Container as Browser Link */}
      <a
        href={productUrl}
        onClick={handleCardNavigation}
        className="relative w-full aspect-square bg-[#F5F8F5] overflow-hidden block"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&h=600&q=80';
          }}
        />

        {/* Promotional & Harvest Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {product.isFlashSale ? (
            <span className="bg-[#F4A340] text-stone-900 font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
              <Zap className="w-3 h-3 fill-stone-900" />
              {product.flashSaleDiscount}% OFF
            </span>
          ) : discountPercent > 0 ? (
            <span className="bg-[#176B51] text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-xs">
              {discountPercent}% OFF
            </span>
          ) : null}

          {product.isNewArrival && (
            <span className="bg-emerald-800 text-white text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
              2026 HARVEST
            </span>
          )}
        </div>

        {/* Open Product Page Floating Hint */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 pointer-events-none">
          <span className="bg-white/95 text-[#176B51] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5" />
            Open Product Page
          </span>
        </div>
      </a>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Metadata: Pack Size & DDA Number */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="truncate max-w-[65%] font-medium">{product.packSize}</span>
            <span className="font-mono text-[10px] text-stone-400 shrink-0">{product.ddaRegNo}</span>
          </div>

          {/* Title Link */}
          <a
            href={productUrl}
            onClick={handleCardNavigation}
            className="block font-semibold text-stone-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#176B51] transition-colors"
          >
            {language === 'np' ? product.nepaliName : product.name}
          </a>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] font-bold text-stone-800 tabular-nums">{product.rating}</span>
            <span className="text-[10px] text-stone-400 tabular-nums">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
          {/* Price Row */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-[#176B51] tabular-nums">
              NPR {currentPrice.toLocaleString()}
            </span>
            {product.mrp > currentPrice && (
              <span className="text-[11px] sm:text-xs text-stone-400 line-through tabular-nums">
                NPR {product.mrp.toLocaleString()}
              </span>
            )}
          </div>

          {/* TWO ACTION BUTTONS: Add to Cart + Buy Now (One-Click Buy) */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              onClick={handleAddToCart}
              className="w-full bg-emerald-50 hover:bg-emerald-100 active:scale-[0.98] text-[#176B51] border border-emerald-200/80 text-[11px] sm:text-xs font-semibold py-2 px-1.5 rounded-lg flex items-center justify-center gap-1 transition-all"
              title="Add to shopping cart"
            >
              <ShoppingBag className="w-3 h-3 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full bg-[#176B51] hover:bg-[#12543f] active:scale-[0.98] text-white text-[11px] sm:text-xs font-bold py-2 px-1.5 rounded-lg flex items-center justify-center gap-1 shadow-xs transition-all"
              title="One-click direct checkout"
            >
              <Zap className="w-3 h-3 fill-white shrink-0" />
              <span className="truncate">Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
