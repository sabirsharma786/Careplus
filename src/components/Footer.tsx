import React from 'react';
import { ShieldCheck, Truck, Lock, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { appStore } from '../services/store';
import { CarePlusLogo } from './CarePlusLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white px-3 py-1.5 rounded-lg inline-flex items-center shadow-xs">
                <CarePlusLogo className="h-7 w-auto object-contain" />
              </div>
              <span className="font-serif font-bold text-sm text-stone-300 tracking-wide">
                NEPAL PVT. LTD.
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-md leading-relaxed">
              Nepal's premier single-vendor Ayurvedic wellness and botanical apothecary. Hand-harvesting pristine alpine herbs from Manang, Dolpa, and Mustang with strict laboratory heavy-metal safety assays.
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
              <span>PAN / VAT: <strong className="font-mono text-stone-200">600123987</strong></span>
              <span>·</span>
              <span>DDA Reg: <strong className="font-mono text-stone-200">AYU-78-019</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Himalayan Remedies</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li><a href="#product-catalog-section" onClick={() => appStore.setSelectedCategory('herbal-supplements')} className="hover:text-emerald-400 transition-colors">Pure Shilajit Gold Resin</a></li>
              <li><a href="#product-catalog-section" onClick={() => appStore.setSelectedCategory('ayurvedic-skincare')} className="hover:text-emerald-400 transition-colors">Kumkumadi Saffron Oil</a></li>
              <li><a href="#product-catalog-section" onClick={() => appStore.setSelectedCategory('botanical-haircare')} className="hover:text-emerald-400 transition-colors">Bhringraj Scalp Revitalizer</a></li>
              <li><a href="#product-catalog-section" onClick={() => appStore.setSelectedCategory('immunity-elixirs')} className="hover:text-emerald-400 transition-colors">Special Chyawanprash & Triphala</a></li>
              <li><a href="#product-catalog-section" onClick={() => appStore.setSelectedCategory('joint-personal-care')} className="hover:text-emerald-400 transition-colors">Wintergreen Pain Liniment</a></li>
            </ul>
          </div>

          {/* Contact & Apothecary */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Apothecary Headquarters</h4>
            <div className="space-y-1.5 text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#78B94A] shrink-0 mt-0.5" />
                <span>Baluwatar-04 (Near Russian Embassy), Kathmandu, Nepal</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#78B94A] shrink-0" />
                <span>+977-1-4428900 / 9841239871</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#78B94A] shrink-0" />
                <span>care@careplusnepal.com</span>
              </p>
              <p className="flex items-center gap-2 text-emerald-400">
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span>COD Delivery to all 7 Provinces</span>
              </p>
            </div>
          </div>
        </div>

        {/* Centered Live Verified Date */}
        <div className="pt-6 border-t border-stone-800 text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-stone-800/80 border border-stone-700 text-stone-300 text-xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tabular-nums font-medium">Verified Active: Saturday, 17 October 2026 · शनिबार, १ कात्तिक २०८३</span>
          </div>
        </div>

        {/* Bottom Bar with discrete Staff Portal link */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
          <p>© 2026 CarePlus Nepal Pvt. Ltd. All rights reserved. Nepal DDA Certified.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => appStore.setIsTrackOrderOpen(true)}
              className="hover:text-stone-300 transition-colors"
            >
              Shipment Tracking
            </button>
            <span>·</span>
            <button
              onClick={() => appStore.setIsCustomerAccountOpen(true)}
              className="hover:text-stone-300 transition-colors"
            >
              Loyalty Portal
            </button>
            <span>·</span>
            {/* Wholesale Dealer Portal Link */}
            <button
              onClick={() => appStore.setCurrentView('wholesale')}
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors text-stone-300 font-medium cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Wholesale Dealer Portal</span>
            </button>
            <span>·</span>
            {/* Discrete Staff Portal Link */}
            <button
              onClick={() => appStore.setCurrentView('admin')}
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors text-stone-400 font-medium cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Staff / Admin ERP</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
