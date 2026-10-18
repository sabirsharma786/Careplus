import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User,
  Truck,
  Globe,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  MapPin,
  Bell,
  Zap,
  Sparkles,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { appStore } from '../services/store';
import { CATEGORIES } from '../services/mockData';
import { CarePlusLogo } from './CarePlusLogo';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(appStore.getSearchQuery());

  const cart = appStore.getCart();
  const currentCustomer = appStore.getCurrentCustomer();
  const language = appStore.getLanguage();
  const selectedCategory = appStore.getSelectedCategory();
  const selectedProvince = appStore.getSelectedProvince();
  const selectedCity = appStore.getSelectedCity();

  const totalCartCount = cart.reduce((total, i) => total + i.quantity, 0);

  // Sub-nav categories matching Jeevee style
  const subNavItems = [
    { id: 'all', label: 'All Remedies', npLabel: 'सबै उपचार' },
    { id: 'herbal-supplements', label: 'Supplements', npLabel: 'सप्लिमेन्ट्स' },
    { id: 'ayurvedic-skincare', label: 'Skin', npLabel: 'स्किन' },
    { id: 'botanical-haircare', label: 'Hair', npLabel: 'हेयर' },
    { id: 'immunity-elixirs', label: 'Immunity & Elixirs', npLabel: 'काढा र रस' },
    { id: 'joint-personal-care', label: 'Pain & Joint Care', npLabel: 'जोर्नी दुखाइ' },
    { id: 'pure-shilajit', label: 'Shilajit Gold', npLabel: 'शिलाजित' },
    { id: 'lab-quality', label: 'Lab Quality & DDA', npLabel: 'गुणस्तर/DDA', isAnchor: true }
  ];

  const handleCategoryClick = (catId: string, isAnchor?: boolean) => {
    if (isAnchor) {
      appStore.setSelectedProductForModal(null);
      setTimeout(() => {
        const el = document.getElementById('lab-quality');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    if (catId === 'pure-shilajit') {
      appStore.setSelectedCategory('herbal-supplements');
      appStore.setSearchQuery('Shilajit');
    } else {
      appStore.setSelectedCategory(catId);
      appStore.setSearchQuery('');
    }

    setCategoriesDropdownOpen(false);
    setMobileMenuOpen(false);

    const catalogEl = document.getElementById('product-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.setSearchQuery(searchVal);
    const catalogEl = document.getElementById('product-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-xs">
      {/* 1. TOP UTILITY BAR (Live Verified Date & Nepal Delivery Guarantee) */}
      <div className="bg-[#124C3A] text-white text-[11px] py-1 px-4 font-medium border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-center sm:text-left">
          <div className="hidden md:flex items-center gap-1.5 text-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#78B94A]" />
            <span>Govt. of Nepal DDA Reg. AYU-78 · 100% Heavy-Metal Lab Certified</span>
          </div>

          <div className="flex items-center justify-center gap-2 mx-auto font-medium text-white">
            <Calendar className="w-3.5 h-3.5 text-[#78B94A] shrink-0" />
            <span className="tabular-nums">Saturday, 17 October 2026 · शनिबार, १ कात्तिक २०८३</span>
          </div>

          <div className="flex items-center gap-3 text-emerald-200">
            <button
              onClick={() => appStore.setCurrentView('wholesale')}
              className="hover:text-white font-semibold underline decoration-emerald-400/60 cursor-pointer"
            >
              Wholesale Dealer Portal
            </button>
            <span>·</span>
            <button
              onClick={() => appStore.setCurrentView('admin')}
              className="hover:text-white font-semibold underline decoration-emerald-400/60 cursor-pointer"
            >
              Admin ERP
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-3 sm:gap-5">
          {/* Left: Brand Logo & Navigation Dropdowns */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Uploaded carePLUS Original Logo File */}
            <button
              onClick={() => {
                appStore.setSelectedProductForModal(null);
                appStore.setSelectedCategory('all');
                appStore.setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center group text-left cursor-pointer focus:outline-none py-0.5"
              title="carePLUS Nepal Home"
            >
              <CarePlusLogo className="h-8 sm:h-9 md:h-10 w-auto object-contain group-hover:scale-[1.02] transition-transform" />
            </button>

            {/* CATEGORIES Dropdown Button (Jeevee Style) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider py-1.5 px-2 rounded-lg transition-colors ${
                  categoriesDropdownOpen ? 'bg-emerald-50 text-[#176B51]' : 'text-stone-800 hover:text-[#176B51]'
                }`}
              >
                <span>CATEGORIES</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesDropdownOpen ? 'rotate-180 text-[#176B51]' : 'text-stone-500'}`} />
              </button>

              {/* Mega Categories Dropdown */}
              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-stone-100">
                    <span className="text-[10px] font-bold uppercase text-stone-400">Explore by Category</span>
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-[#176B51] flex items-center justify-between transition-colors"
                    >
                      <span>{language === 'np' ? cat.nepaliName : cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Center: CLEAN WIDE PILL SEARCH BAR */}
          <div className="flex-1 max-w-2xl min-w-0 mx-2 sm:mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search for Products, Medicine, Remedies..."
                  className="w-full pl-11 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm bg-stone-50/70 hover:bg-white focus:bg-white border border-stone-200/90 hover:border-stone-300 focus:border-[#176B51] rounded-full focus:ring-2 focus:ring-[#176B51]/15 focus:outline-none transition-all placeholder:text-stone-400 shadow-2xs"
                />
                {searchVal && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchVal('');
                      appStore.setSearchQuery('');
                    }}
                    className="absolute right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right: Deliver To Location + Account + Cart + Notification + Language */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* NEPAL LOCATION SELECTOR BUTTON (1-Click Picker) */}
            <button
              onClick={() => appStore.setIsLocationPickerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/70 text-[#176B51] text-xs font-semibold transition-all group"
              title="Change Delivery Location in Nepal"
            >
              <MapPin className="w-3.5 h-3.5 text-[#176B51] shrink-0" />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] text-emerald-800 font-medium">Deliver to:</span>
                <span className="text-[11px] font-bold text-stone-900 truncate max-w-[90px] sm:max-w-[110px]">
                  {selectedCity} ▾
                </span>
              </div>
            </button>

            {/* MY ACCOUNT (Exact Jeevee Style: Hello User / My Account ▾) */}
            <button
              onClick={() => appStore.setIsCustomerAccountOpen(true)}
              className="flex items-center gap-2 text-stone-800 hover:text-[#176B51] transition-colors p-1"
              title="Customer Profile & Loyalty Points"
            >
              <div className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 bg-stone-50">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-stone-500 font-medium">
                  Hello {currentCustomer.name.split(' ')[0]}
                </span>
                <span className="text-xs font-bold text-stone-900 flex items-center gap-0.5">
                  My Account <ChevronDown className="w-3 h-3 text-stone-400" />
                </span>
              </div>
            </button>

            {/* SHOPPING CART (With item counter) */}
            <button
              onClick={() => appStore.setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-stone-800 hover:text-[#176B51] hover:bg-stone-50 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#176B51] text-white font-extrabold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center tabular-nums shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* TRACK ORDER NOTIFICATION / TRUCK */}
            <button
              onClick={() => appStore.setIsTrackOrderOpen(true)}
              className="p-2 rounded-xl text-stone-600 hover:text-[#176B51] hover:bg-stone-50 transition-colors relative"
              title="Track Active Shipment"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>

            {/* LANGUAGE SWITCHER */}
            <button
              onClick={() => appStore.setLanguage(language === 'en' ? 'np' : 'en')}
              className="hidden lg:flex items-center gap-1 text-[11px] font-bold text-stone-600 hover:text-stone-900 px-1.5 py-1 rounded border border-stone-200"
            >
              <Globe className="w-3 h-3 text-[#176B51]" />
              <span>{language === 'en' ? 'नेपाली' : 'EN'}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 md:hidden rounded-lg text-stone-600 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. HORIZONTAL CATEGORIES SUB-NAV BAR (Exact Jeevee Style Bottom Bar) */}
      <div className="border-t border-stone-200/90 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2 no-scrollbar gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              {subNavItems.map((item) => {
                const isActive = selectedCategory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleCategoryClick(item.id, item.isAnchor)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-[#176B51] font-bold bg-emerald-50/80 border-b-2 border-[#176B51]'
                        : 'text-stone-700 hover:text-[#176B51] hover:bg-stone-50'
                    }`}
                  >
                    {language === 'np' ? item.npLabel : item.label}
                  </button>
                );
              })}
            </div>

            {/* Right arrow scroll hint like in Jeevee image */}
            <div className="hidden sm:flex items-center text-stone-400 pl-2">
              <ChevronRight className="w-4 h-4 cursor-pointer hover:text-stone-700" />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU ACCORDION */}
      {mobileMenuOpen && (
        <div className="md:hidden py-3 px-4 border-t border-stone-200 bg-stone-50 space-y-2 animate-in fade-in">
          <p className="text-[10px] font-bold uppercase text-stone-400">All Categories</p>
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className="text-left text-xs font-medium p-2 rounded-lg bg-white border border-stone-200 text-stone-700"
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 flex flex-col gap-1.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                appStore.setIsLocationPickerOpen(true);
              }}
              className="text-left text-xs font-semibold p-2 rounded-lg bg-emerald-100/70 text-[#176B51] flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Change Location ({selectedCity})</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                appStore.setIsTrackOrderOpen(true);
              }}
              className="text-left text-xs font-medium p-2 rounded-lg bg-white border border-stone-200 text-stone-700 flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-[#176B51]" />
              <span>Track Order Consignment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
