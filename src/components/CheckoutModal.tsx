import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, MapPin, Phone, CreditCard, Sparkles, CheckCircle2, Truck, Navigation } from 'lucide-react';
import { appStore } from '../services/store';
import { NEPAL_PROVINCES, getCitiesByProvinceName, getProvinceByName } from '../services/nepalLocations';
import { OrderPaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const isOpen = appStore.getIsCheckoutOpen();
  const cart = appStore.getCart();
  const currentCustomer = appStore.getCurrentCustomer();
  const storeProvince = appStore.getSelectedProvince();
  const storeCity = appStore.getSelectedCity();

  // Form states initialized with active store location
  const [fullName, setFullName] = useState(currentCustomer.name);
  const [phone, setPhone] = useState(currentCustomer.phone);
  const [province, setProvince] = useState(storeProvince || 'Bagmati Province (बागमती प्रदेश)');
  const [availableCities, setAvailableCities] = useState(() => getCitiesByProvinceName(storeProvince || 'Bagmati Province'));
  const [district, setDistrict] = useState(storeCity || 'Kathmandu');
  const [municipality, setMunicipality] = useState(currentCustomer.addresses[0]?.municipality || 'Kathmandu Metropolitan City');
  const [ward, setWard] = useState(currentCustomer.addresses[0]?.ward || '3');
  const [tole, setTole] = useState(currentCustomer.addresses[0]?.tole || 'Maharajgunj Chakrapath Marg');
  const [landmark, setLandmark] = useState(currentCustomer.addresses[0]?.landmark || 'Near Teaching Hospital Gate 2');
  const [instructions, setInstructions] = useState(currentCustomer.addresses[0]?.instructions || '');

  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>('cod');
  const [redeemLoyaltyPoints, setRedeemLoyaltyPoints] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync when store location changes
  useEffect(() => {
    if (storeProvince) {
      setProvince(storeProvince);
      const cities = getCitiesByProvinceName(storeProvince);
      setAvailableCities(cities);
      if (storeCity) {
        setDistrict(storeCity);
      }
    }
  }, [storeProvince, storeCity]);

  // When province changes, AUTO-CASCADE related cities and update default district
  const handleProvinceChange = (newProvince: string) => {
    setProvince(newProvince);
    const cities = getCitiesByProvinceName(newProvince);
    setAvailableCities(cities);
    if (cities.length > 0) {
      setDistrict(cities[0].name);
      setMunicipality(`${cities[0].district} City Area`);
    }
    // Also sync to store
    appStore.setSelectedLocation(newProvince, cities[0]?.name || '');
  };

  const handleQuickCityClick = (cityName: string, districtName: string) => {
    setDistrict(cityName);
    setMunicipality(`${districtName} Metro/Nagarpalika`);
    appStore.setSelectedLocation(province, cityName);
  };

  if (!isOpen) return null;

  const currentProvData = getProvinceByName(province);
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const pointsAvailable = currentCustomer.loyaltyPoints;
  const maxPointsDiscount = Math.min(pointsAvailable, Math.floor(subtotal * 0.5));
  const pointsDiscount = redeemLoyaltyPoints ? maxPointsDiscount : 0;
  const taxableSubtotal = Math.max(0, subtotal - pointsDiscount);
  const vatAmount = Math.round(taxableSubtotal * 0.13); // 13% Nepal VAT
  const shippingFee = subtotal >= 2500 ? 0 : 150;
  const finalTotal = taxableSubtotal + vatAmount + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderItems = cart.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      packSize: i.product.packSize,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      lineTotal: i.unitPrice * i.quantity
    }));

    setTimeout(() => {
      const createdOrder = appStore.placeOrder({
        customerName: fullName,
        customerPhone: phone,
        items: orderItems,
        subtotal,
        discountAmount: pointsDiscount,
        pointsToRedeem: pointsDiscount,
        paymentMethod,
        shippingAddress: {
          id: `addr-${Date.now()}`,
          fullName,
          phone,
          province,
          district,
          municipality,
          ward,
          tole,
          landmark,
          instructions
        }
      });

      setIsSubmitting(false);
      appStore.setIsCheckoutOpen(false);
      appStore.setTaxInvoiceOrder(createdOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
              Nepal Express Checkout
            </h2>
            <p className="text-xs text-stone-500">
              Fast, secure delivery across all 7 Provinces · Inland Revenue Dept (IRD) 13% VAT Compliant
            </p>
          </div>
          <button
            onClick={() => appStore.setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePlaceOrder} className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Section 1: Customer & Delivery Address in Nepal with Auto-Cascading City Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-800">
                <MapPin className="w-4 h-4 text-[#176B51]" />
                <span>1. Nepal Delivery Destination & Auto-City Selector</span>
              </div>
              <span className="text-[11px] text-[#176B51] font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>{currentProvData.deliveryEta}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#176B51] focus:outline-none"
                  placeholder="e.g. Sabir Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Mobile Number (Nepal)</label>
                <div className="flex items-center">
                  <span className="bg-stone-100 border border-r-0 border-stone-300 px-2.5 py-2 text-xs text-stone-600 rounded-l-lg font-mono">
                    +977
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-r-lg focus:ring-2 focus:ring-[#176B51] focus:outline-none"
                    placeholder="98XXXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* PROVINCE SELECTOR & AUTO CASCADING CITY DROPDOWN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Province (प्रदेश छान्नुहोस्)
                </label>
                <select
                  value={province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#176B51] focus:outline-none bg-white font-medium"
                >
                  {NEPAL_PROVINCES.map((p) => (
                    <option key={p.id} value={`${p.name} (${p.nepaliName})`}>
                      {p.name} ({p.nepaliName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  City / District in {currentProvData.name}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#176B51] focus:outline-none bg-white font-medium"
                >
                  {availableCities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name} - {city.nepaliName} ({city.deliveryEta})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ONE-CLICK CITY QUICK SELECTION CHIPS */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-stone-600 block">
                1-Click Quick Select Major Hubs in {currentProvData.name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableCities.map((c) => {
                  const isSelected = district.toLowerCase().includes(c.id) || district.toLowerCase().includes(c.name.toLowerCase());
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => handleQuickCityClick(c.name, c.district)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-[#176B51] text-white border-[#176B51] font-bold shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-[#176B51] hover:bg-emerald-50'
                      }`}
                    >
                      {c.name} {c.isHub ? '★' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-stone-700 mb-1">Municipality / Nagarpalika</label>
                <input
                  type="text"
                  required
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#176B51] focus:outline-none"
                  placeholder="e.g. Kathmandu Metro, Pokhara"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Ward No.</label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#176B51] focus:outline-none"
                  placeholder="e.g. 4"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-stone-700 mb-1">Tole / Street</label>
                <input
                  type="text"
                  required
                  value={tole}
                  onChange={(e) => setTole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#176B51] focus:outline-none"
                  placeholder="e.g. Baluwatar Marg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Landmark & Delivery Notes</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#176B51] focus:outline-none"
                placeholder="e.g. Opposite Russian Embassy, Ring Road corner"
              />
            </div>
          </div>

          {/* Section 2: CarePlus Loyalty Points Redemption */}
          {pointsAvailable > 0 && (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">
                    CarePlus Ayurvedic Rewards: {pointsAvailable} Points Available
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={redeemLoyaltyPoints}
                      onChange={(e) => setRedeemLoyaltyPoints(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#176B51]"></div>
                  </label>
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  Redeem {maxPointsDiscount} points to save an instant <strong className="font-bold">NPR {maxPointsDiscount}</strong> on this order.
                </p>
              </div>
            </div>
          )}

          {/* Section 3: Payment Method Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-800 border-b border-stone-100 pb-1.5">
              <CreditCard className="w-4 h-4 text-[#176B51]" />
              <span>2. Verified Nepal Payment Options</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#176B51] bg-emerald-50/40 ring-2 ring-[#176B51]/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#176B51]"
                  />
                  <Truck className="w-4 h-4 text-[#176B51]" />
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</p>
                  <p className="text-[10px] text-stone-500">Pay cash upon delivery</p>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'esewa'
                    ? 'border-[#176B51] bg-emerald-50/40 ring-2 ring-[#176B51]/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'esewa'}
                    onChange={() => setPaymentMethod('esewa')}
                    className="accent-[#176B51]"
                  />
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">eSewa</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-stone-900">eSewa Wallet / Fonepay</p>
                  <p className="text-[10px] text-stone-500">Instant digital settlement</p>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'connectips'
                    ? 'border-[#176B51] bg-emerald-50/40 ring-2 ring-[#176B51]/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'connectips'}
                    onChange={() => setPaymentMethod('connectips')}
                    className="accent-[#176B51]"
                  />
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">ConnectIPS</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-stone-900">Direct Bank QR / IPS</p>
                  <p className="text-[10px] text-stone-500">All Nepal commercial banks</p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 4: Order Breakdown */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="font-bold tabular-nums">NPR {subtotal.toLocaleString()}</span>
            </div>

            {pointsDiscount > 0 && (
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>CarePlus Points Redeemed ({pointsDiscount} pts)</span>
                <span className="tabular-nums">- NPR {pointsDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>Nepal VAT (13% Government Tax)</span>
              <span className="font-bold tabular-nums">NPR {vatAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Shipping Fee to {district}</span>
              <span className="font-bold tabular-nums">
                {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : `NPR ${shippingFee}`}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline text-sm">
              <span className="font-bold text-stone-900">Total Payable Amount</span>
              <span className="text-lg font-bold text-[#176B51] tabular-nums">
                NPR {finalTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="w-full bg-[#176B51] hover:bg-[#12543f] active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all text-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Verifying & Generating IRD Tax Invoice...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Order for {district} (NPR {finalTotal.toLocaleString()})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
