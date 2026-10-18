import React, { useState, useEffect } from 'react';
import { appStore } from './services/store';
import { PromoBanner } from './components/PromoBanner';
import { Navbar } from './components/Navbar';
import { RetailStorefront } from './components/RetailStorefront';
import { Footer } from './components/Footer';
import { SingleProductPage } from './components/SingleProductPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TaxInvoiceModal } from './components/TaxInvoiceModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { AdminPortal } from './components/AdminPortal';
import { WholesalePortal } from './components/WholesalePortal';
import { Product } from './types';

export default function App() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const currentView = appStore.getCurrentView();
  const selectedProduct = appStore.getSelectedProductForModal();

  if (currentView === 'admin') {
    return (
      <>
        <AdminPortal />
        <TaxInvoiceModal />
      </>
    );
  }

  if (currentView === 'wholesale') {
    return (
      <>
        <WholesalePortal />
        <TaxInvoiceModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF7] text-[#1F2937] flex flex-col font-sans selection:bg-[#176B51] selection:text-white">
      {/* Dismissible Seasonal Ayurvedic Campaign Banner */}
      <PromoBanner />

      {/* Front End Navbar */}
      <Navbar />

      {/* Main Retail Storefront or Dedicated Single Product Page */}
      <main className="flex-1">
        {selectedProduct ? (
          <SingleProductPage
            product={selectedProduct}
            onBack={() => appStore.setSelectedProductForModal(null)}
            onSelectProduct={(product: Product) => appStore.setSelectedProductForModal(product)}
          />
        ) : (
          <RetailStorefront
            onOpenProductDetails={(product: Product) => {
              appStore.setSelectedProductForModal(product);
            }}
          />
        )}
      </main>

      {/* Front End Footer */}
      <Footer />

      {/* Active Modals & Overlays */}
      <CartDrawer />
      <CheckoutModal />
      <TaxInvoiceModal />
      <TrackOrderModal />
      <CustomerAccountModal />
      <LocationPickerModal />
    </div>
  );
}
