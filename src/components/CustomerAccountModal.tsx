import React, { useState } from 'react';
import { X, Sparkles, Award, ShoppingBag, MapPin, Receipt, ShieldCheck } from 'lucide-react';
import { appStore } from '../services/store';

export const CustomerAccountModal: React.FC = () => {
  const isOpen = appStore.getIsCustomerAccountOpen();
  const customer = appStore.getCurrentCustomer();
  const orders = appStore.getOrders().filter((o) => o.customerId === customer.id);
  const [activeTab, setActiveTab] = useState<'loyalty' | 'orders' | 'addresses'>('loyalty');

  if (!isOpen) return null;

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'rishi_platinum':
        return { name: 'Rishi Platinum (ऋषि प्लेटिनम)', color: 'from-amber-600 to-yellow-500', rate: '2.0x Points', min: 1000, next: 2000 };
      case 'vaidya_gold':
        return { name: 'Vaidya Gold (वैद्य स्वर्ण)', color: 'from-amber-500 to-amber-400', rate: '1.5x Points', min: 500, next: 1000 };
      case 'seeker':
        return { name: 'Ayurvedic Seeker (आयुर्वेदिक साधक)', color: 'from-emerald-600 to-teal-500', rate: '1.25x Points', min: 250, next: 500 };
      default:
        return { name: 'Herbal Novice (हर्बल प्रारम्भिक)', color: 'from-stone-600 to-stone-500', rate: '1.0x Points', min: 0, next: 250 };
    }
  };

  const tierInfo = getTierInfo(customer.memberTier);
  const ptsToNext = Math.max(0, tierInfo.next - customer.lifetimePointsEarned);
  const tierProgress = Math.min(100, Math.round((customer.lifetimePointsEarned / tierInfo.next) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#176B51] text-white flex items-center justify-center font-bold text-base">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900 leading-tight">
                {customer.name}
              </h2>
              <p className="text-xs text-stone-500 font-mono">+977 {customer.phone} · Nepal Retail Patron</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => appStore.setIsCustomerAccountOpen(false)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 px-4 sm:px-6 bg-stone-100/60 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'loyalty'
                ? 'border-[#176B51] text-[#176B51]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>CarePlus Rewards & Loyalty</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-[#176B51] text-[#176B51]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'addresses'
                ? 'border-[#176B51] text-[#176B51]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'loyalty' && (
            <div className="space-y-6">
              {/* VIP Membership Card */}
              <div className={`p-5 rounded-2xl bg-gradient-to-r ${tierInfo.color} text-white shadow-xl relative overflow-hidden`}>
                <div className="relative z-10 flex flex-col justify-between h-36">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">
                        CarePlus Ayurvedic Club
                      </span>
                      <h3 className="text-lg font-bold font-serif">{tierInfo.name}</h3>
                    </div>
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold">
                      {tierInfo.rate}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[11px] text-white/80">Available Store Credit</p>
                      <p className="text-2xl font-black font-mono tracking-tight tabular-nums">
                        {customer.loyaltyPoints.toLocaleString()} <span className="text-xs font-normal">PTS (NPR {customer.loyaltyPoints})</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/80">Lifetime Earned</p>
                      <p className="text-xs font-bold font-mono tabular-nums">{customer.lifetimePointsEarned} PTS</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress to next tier */}
              {ptsToNext > 0 && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                  <div className="flex justify-between text-stone-700 font-medium">
                    <span>Progress to Next Tier Level</span>
                    <span className="font-bold text-[#176B51]">{ptsToNext} pts needed</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#176B51] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${tierProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Ledger History */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Points Activity Statement
                </h4>
                <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
                  {customer.ledgerHistory.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-stone-800">{item.description}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{item.date}</p>
                      </div>
                      <span className={`font-mono font-bold ${item.points > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {item.points > 0 ? `+${item.points}` : item.points} PTS
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-8">No order records found.</p>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-stone-900">{o.orderNumber}</span>
                        <p className="text-[11px] text-stone-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {o.fulfillmentStatus}
                      </span>
                    </div>

                    <div className="divide-y divide-stone-200/60">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex justify-between">
                          <span className="text-stone-700 truncate">{item.productName} × {item.quantity}</span>
                          <span className="font-mono font-bold text-stone-900">NPR {item.lineTotal.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                      <div>
                        <span className="text-stone-500">Total: </span>
                        <strong className="text-stone-900">NPR {o.totalAmount.toLocaleString()}</strong>
                      </div>
                      <button
                        onClick={() => {
                          appStore.setIsCustomerAccountOpen(false);
                          appStore.setTaxInvoiceOrder(o);
                        }}
                        className="text-xs font-semibold text-[#176B51] hover:underline flex items-center gap-1"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View IRD Tax Invoice</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-3">
              {customer.addresses.map((addr) => (
                <div key={addr.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-stone-900">
                    <span>{addr.fullName}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Default Address</span>
                  </div>
                  <p className="text-stone-600 font-mono">+977 {addr.phone}</p>
                  <p className="text-stone-700">{addr.tole}, Ward {addr.ward}, {addr.municipality}</p>
                  <p className="text-stone-500">{addr.district}, {addr.province}</p>
                  {addr.landmark && (
                    <p className="text-[11px] text-stone-400 italic">Landmark: {addr.landmark}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
