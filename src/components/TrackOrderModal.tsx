import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, MapPin, PackageCheck } from 'lucide-react';
import { appStore } from '../services/store';
import { Order } from '../types';

export const TrackOrderModal: React.FC = () => {
  const isOpen = appStore.getIsTrackOrderOpen();
  const orders = appStore.getOrders();
  const [query, setQuery] = useState('PTH-NP-984102');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(orders[0] || null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.trackingNumber.toLowerCase().includes(clean) ||
        o.orderNumber.toLowerCase().includes(clean) ||
        o.customerPhone.includes(clean)
    );
    setSearchedOrder(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#176B51]" />
            <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">
              Track Consignment Across Nepal
            </h2>
          </div>
          <button
            onClick={() => appStore.setIsTrackOrderOpen(false)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Tracking No, Order ID (CP-ORD-XXXX) or Mobile No..."
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#176B51] focus:outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#176B51] text-white text-xs font-semibold rounded-xl hover:bg-[#12543f] transition-colors shrink-0"
            >
              Track
            </button>
          </form>

          {/* Result */}
          {searchedOrder ? (
            <div className="space-y-6">
              {/* Order Meta Box */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {searchedOrder.orderNumber}
                    </span>
                    <p className="text-stone-500">Tracking: <strong className="font-mono text-[#176B51]">{searchedOrder.trackingNumber}</strong></p>
                  </div>
                  <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                    {searchedOrder.fulfillmentStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200/60 flex justify-between text-stone-700">
                  <span>Courier: <strong>{searchedOrder.courierName}</strong></span>
                  <span>Destination: <strong>{searchedOrder.shippingAddress.district}</strong></span>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#176B51] text-white flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Order Placed & Certified</h4>
                  <p className="text-[11px] text-stone-500">Baluwatar Apothecary HQ, Kathmandu</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#176B51] text-white flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Batch Sealed & Dispatched</h4>
                  <p className="text-[11px] text-stone-500">Picked by Pathao Express Logistics Team</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <Clock className="w-3 h-3" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">In Transit to Regional Sorting Hub</h4>
                  <p className="text-[11px] text-stone-500">Expected Arrival at {searchedOrder.shippingAddress.district}: Within 24-48 Hours</p>
                </div>

                <div className="relative opacity-50">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-stone-300 text-white flex items-center justify-center">
                    <PackageCheck className="w-3 h-3" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-700">Delivered & Signed</h4>
                  <p className="text-[11px] text-stone-400">Final handover to {searchedOrder.customerName}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-stone-500 text-xs">
              No matching consignment found for "{query}". Try testing with <strong>PTH-NP-984102</strong>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
