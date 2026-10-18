import React, { useState } from 'react';
import { X, MapPin, Search, CheckCircle2, Truck, Navigation, ChevronRight } from 'lucide-react';
import { appStore } from '../services/store';
import { NEPAL_PROVINCES, getProvinceByName } from '../services/nepalLocations';

export const LocationPickerModal: React.FC = () => {
  const isOpen = appStore.getIsLocationPickerOpen();
  const currentProvince = appStore.getSelectedProvince();
  const currentCity = appStore.getSelectedCity();

  const [activeProvinceId, setActiveProvinceId] = useState<string>(() => {
    const prov = getProvinceByName(currentProvince);
    return prov.id;
  });

  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const activeProvince = NEPAL_PROVINCES.find((p) => p.id === activeProvinceId) || NEPAL_PROVINCES[0];

  const handleSelectCity = (cityName: string, provinceName: string) => {
    appStore.setSelectedLocation(provinceName, cityName);
    appStore.setIsLocationPickerOpen(false);
  };

  // If search query is typed, search across all 7 provinces
  const searchResults = searchQuery.trim()
    ? NEPAL_PROVINCES.flatMap((p) =>
        p.cities
          .filter(
            (c) =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.nepaliName.includes(searchQuery) ||
              c.district.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((c) => ({ city: c, province: p }))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#176B51] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900 leading-tight">
                Select Your Delivery Location in Nepal
              </h2>
              <p className="text-xs text-stone-500">
                Pick your province & city in 1 click for accurate delivery ETA and dispatch rates
              </p>
            </div>
          </div>

          <button
            onClick={() => appStore.setIsLocationPickerOpen(false)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search */}
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your city or district (e.g. Pokhara, Biratnagar, Dharan, Butwal, Chitwan)..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#176B51] focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {searchQuery.trim() ? (
            /* Search Results Mode */
            <div className="space-y-2">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Matching Nepal Locations ({searchResults.length}):
              </p>
              {searchResults.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-8">
                  No cities found for "{searchQuery}". Try selecting from the 7 provinces below.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {searchResults.map(({ city, province }, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectCity(city.name, `${province.name} (${province.nepaliName})`)}
                      className="p-3 rounded-xl border border-stone-200 hover:border-[#176B51] hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-bold text-stone-900 group-hover:text-[#176B51]">
                          {city.name}
                        </p>
                        <p className="text-[10px] text-stone-500">
                          {province.name} · {city.deliveryEta}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#176B51]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Interactive Province Tabs + 1-Click City Grid */
            <div className="space-y-4">
              {/* Province Tabs */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  1. Choose Your Province (प्रदेश छान्नुहोस्):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {NEPAL_PROVINCES.map((prov) => {
                    const isSelected = activeProvinceId === prov.id;
                    return (
                      <button
                        key={prov.id}
                        onClick={() => setActiveProvinceId(prov.id)}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-[#176B51] text-white border-[#176B51] shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                        }`}
                      >
                        <p className="text-xs font-bold leading-tight truncate">{prov.name.replace(' Province', '')}</p>
                        <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                          {prov.nepaliName}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Related Cities Auto-Cascade for Selected Province */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <label className="text-xs font-bold text-stone-800">
                      2. Select City in {activeProvince.name} (१-क्लिकमा शहर छान्नुहोस्):
                    </label>
                    <p className="text-[11px] text-[#176B51] font-medium flex items-center gap-1 mt-0.5">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{activeProvince.deliveryEta} · COD Available</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {activeProvince.cities.length} Delivery Zones
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {activeProvince.cities.map((city) => {
                    const isCitySelected = currentCity.toLowerCase().includes(city.id) || currentCity.toLowerCase().includes(city.name.toLowerCase());

                    return (
                      <button
                        key={city.id}
                        onClick={() => handleSelectCity(city.name, `${activeProvince.name} (${activeProvince.nepaliName})`)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                          isCitySelected
                            ? 'bg-emerald-50 border-[#176B51] ring-1 ring-[#176B51]'
                            : 'bg-white border-stone-200 hover:border-[#176B51] hover:bg-emerald-50/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900 group-hover:text-[#176B51]">
                              {city.name}
                            </span>
                            {city.isHub && (
                              <span className="text-[9px] bg-emerald-100 text-[#176B51] font-extrabold px-1.5 py-0.2 rounded">
                                MAIN HUB
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            {city.nepaliName} · <span className="text-emerald-700 font-medium">{city.deliveryEta}</span>
                          </p>
                        </div>

                        {isCitySelected ? (
                          <CheckCircle2 className="w-4 h-4 text-[#176B51] shrink-0" />
                        ) : (
                          <span className="text-[10px] font-semibold text-[#176B51] opacity-0 group-hover:opacity-100 transition-opacity">
                            Select →
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Active Location */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#176B51]" />
            <span>Currently Delivering To: <strong className="text-stone-900">{currentCity}, {currentProvince.split(' ')[0]}</strong></span>
          </div>

          <button
            onClick={() => appStore.setIsLocationPickerOpen(false)}
            className="px-3 py-1 bg-[#176B51] text-white rounded-lg text-xs font-semibold hover:bg-[#124C3A]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
