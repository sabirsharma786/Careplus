import React, { useState } from 'react';
import { X, Star, ShieldCheck, Check, ShoppingBag, Zap, Truck } from 'lucide-react';
import { Product } from '../types';
import { appStore } from '../services/store';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const language = appStore.getLanguage();

  const currentPrice = product.isFlashSale && product.flashSaleDiscount
    ? Math.round(product.retailPrice * (1 - product.flashSaleDiscount / 100))
    : product.retailPrice;

  const handleAddToCart = () => {
    appStore.addToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    appStore.addToCart(product, quantity);
    onClose();
    appStore.setIsCartOpen(false);
    appStore.setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Left: 1:1 Image Showcase */}
            <div className="flex flex-col gap-3">
              <div className="relative w-full aspect-square bg-[#F4F7F4] rounded-xl overflow-hidden border border-stone-200">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {product.isFlashSale && (
                  <span className="absolute top-3 left-3 bg-[#F4A340] text-stone-900 font-extrabold text-xs px-2.5 py-1 rounded shadow flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-stone-900" />
                    FLASH DEAL -{product.flashSaleDiscount}%
                  </span>
                )}
              </div>

              {/* Thumbnails if multiple */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-[#176B51] ring-2 ring-[#176B51]/20' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* DDA & Heavy Metal Lab Certification */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs space-y-1 text-emerald-950">
                <div className="flex items-center gap-1.5 font-semibold text-[#176B51]">
                  <ShieldCheck className="w-4 h-4 text-[#176B51]" />
                  <span>Nepal DDA Approved & Heavy-Metal Certified</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Registered under Registration No: <span className="font-mono font-bold text-stone-800">{product.ddaRegNo}</span>
                </p>
              </div>
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#176B51] uppercase tracking-wider">
                  {product.subcategory}
                </span>

                <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1 leading-snug">
                  {language === 'np' ? product.nepaliName : product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <span className="text-sm font-bold text-stone-800 tabular-nums">{product.rating}</span>
                  <span className="text-xs text-stone-500">({product.reviewsCount} verified Nepal reviews)</span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs font-medium text-emerald-700">In Stock ({product.stock} units)</span>
                </div>

                {/* Pricing */}
                <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[#176B51] tabular-nums">
                    NPR {currentPrice.toLocaleString()}
                  </span>
                  {product.mrp > currentPrice && (
                    <span className="text-sm text-stone-400 line-through tabular-nums">
                      NPR {product.mrp.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    13% VAT Included
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                  {language === 'np' ? product.nepaliDescription : product.description}
                </p>

                {/* Key Benefits */}
                <div className="mt-4 space-y-1.5">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Ayurvedic Benefits:</h4>
                  {product.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-stone-700">
                      <Check className="w-3.5 h-3.5 text-[#176B51] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Ingredients */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">Active Botanical Ingredients:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.map((ing, idx) => (
                      <span key={idx} className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Usage */}
                <div className="mt-4 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-800">Direction for Use: </strong>
                  {product.usageInstructions}
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="mt-6 pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-stone-700 hover:bg-stone-200 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-stone-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-1.5 text-stone-700 hover:bg-stone-200 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#176B51] hover:bg-[#12543f] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart (NPR {(currentPrice * quantity).toLocaleString()})</span>
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#78B94A] hover:bg-[#68a63f] active:scale-[0.98] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now (Instant Nepal Checkout)</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                  <Truck className="w-3.5 h-3.5 text-[#176B51]" />
                  <span>Dispatches same day from Baluwatar Hub · Cash on Delivery available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
