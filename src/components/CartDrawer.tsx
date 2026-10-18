import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { appStore } from '../services/store';

export const CartDrawer: React.FC = () => {
  const isOpen = appStore.getIsCartOpen();
  const cart = appStore.getCart();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const freeShippingThreshold = 2500;
  const freeShippingDiff = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckout = () => {
    appStore.setIsCartOpen(false);
    appStore.setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#176B51]" />
            <h2 className="font-serif font-bold text-lg text-stone-900">Your Herbal Remedy Cart</h2>
            <span className="bg-[#176B51] text-white text-xs font-bold px-2 py-0.5 rounded-full tabular-nums">
              {cart.reduce((total, i) => total + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => appStore.setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 text-xs">
          {freeShippingDiff > 0 ? (
            <p className="text-emerald-900 font-medium">
              Add <span className="font-bold text-[#176B51] tabular-nums">NPR {freeShippingDiff.toLocaleString()}</span> more for <span className="font-bold">FREE Delivery</span> anywhere in Nepal!
            </p>
          ) : (
            <p className="text-[#176B51] font-bold flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>You've unlocked FREE Shipping across all 7 Provinces!</span>
            </p>
          )}
          <div className="w-full bg-emerald-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#176B51] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${freeShippingPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300" />
              <p className="text-stone-600 font-medium">Your remedy basket is currently empty.</p>
              <button
                onClick={() => appStore.setIsCartOpen(false)}
                className="text-xs font-semibold text-[#176B51] underline hover:text-[#12543f]"
              >
                Browse Himalayan Formulations
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-3 flex gap-3 items-center">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">{item.product.packSize}</p>
                  <p className="text-xs font-bold text-[#176B51] tabular-nums mt-0.5">
                    NPR {item.unitPrice.toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                    <button
                      onClick={() => appStore.updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200"
                    >
                      -
                    </button>
                    <span className="px-2 py-0.5 text-xs font-bold tabular-nums text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => appStore.updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => appStore.removeFromCart(item.product.id)}
                    className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal (Inclusive of 13% VAT)</span>
                <span className="font-bold text-stone-800 tabular-nums">
                  NPR {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Estimated Shipping (Nepal Wide)</span>
                <span className="font-bold text-stone-800 tabular-nums">
                  {subtotal >= 2500 ? 'FREE' : 'NPR 150'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-stone-900">Total Payable</span>
              <span className="text-xl font-bold text-[#176B51] tabular-nums">
                NPR {(subtotal + (subtotal >= 2500 ? 0 : 150)).toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#176B51] hover:bg-[#12543f] active:scale-[0.98] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm"
            >
              <span>Proceed to Nepal Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#176B51]" />
              <span>Official 13% VAT Tax Invoice issued upon checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
