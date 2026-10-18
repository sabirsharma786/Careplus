import React, { useState } from 'react';
import {
  Building2,
  Lock,
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  Truck,
  Phone,
  Mail,
  MessageSquare,
  Download,
  RefreshCw,
  ArrowLeft,
  Search,
  Plus,
  Minus,
  ClipboardList,
  CreditCard,
  Sparkles,
  LogOut,
  AlertCircle,
  Eye,
  PackageCheck,
  UserCheck,
  Layers
} from 'lucide-react';
import { appStore } from '../services/store';
import { resolveMultiPrice, createImmutablePriceSnapshot } from '../services/pricingEngine';
import { CarePlusLogo } from './CarePlusLogo';
import { CATEGORIES } from '../services/mockData';
import { Order, WholesaleQuotationLine } from '../types';

export const WholesalePortal: React.FC = () => {
  const activeDealer = appStore.getActiveWholesaleDealer();
  const products = appStore.getProducts();
  const customPriceLists = appStore.getCustomPriceLists();
  const quotations = appStore.getWholesaleQuotations();
  const allOrders = appStore.getOrders();

  // Login State
  const [identifier, setIdentifier] = useState('DLR-LAL-019');
  const [pin, setPin] = useState('2244');
  const [loginError, setLoginError] = useState('');

  // Portal Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'catalog' | 'bulk_order' | 'quotations' | 'orders' | 'statement' | 'deliveries' | 'sales_exec'
  >('catalog');

  // Catalog Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Bulk Order Pad State: productId -> quantity
  const [bulkQuantities, setBulkQuantities] = useState<Record<string, number>>({
    'prod-shilajit-resin': 30,
    'prod-ashwagandha-ksm66': 20
  });
  const [poRefNumber, setPoRefNumber] = useState('PO-2083-104');
  const [poFileName, setPoFileName] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderSuccessBanner, setOrderSuccessBanner] = useState<string | null>(null);

  // Quotation Request State
  const [qtnLines, setQtnLines] = useState<{ productId: string; quantity: number; requestedUnitPrice: number }[]>([
    { productId: 'prod-shilajit-resin', quantity: 50, requestedUnitPrice: 1690 },
    { productId: 'prod-chyawanprash-gold', quantity: 40, requestedUnitPrice: 950 }
  ]);
  const [qtnPoRef, setQtnPoRef] = useState('PO-QTN-2083/89');
  const [qtnAttachment, setQtnAttachment] = useState('');
  const [qtnNotes, setQtnNotes] = useState('Requesting special winter pharmacy stocking rate with Net-45 credit.');
  const [qtnNotice, setQtnNotice] = useState<string | null>(null);

  // Sales Executive Message Modal State
  const [execMessage, setExecMessage] = useState('');
  const [execMessageSent, setExecMessageSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = appStore.loginWholesaleDealer(identifier, pin);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginError('');
    }
  };

  // ============================================================================
  // STRICT SECURITY GATE: Wholesale pricing is NEVER exposed to unauthenticated visitors
  // ============================================================================
  if (!activeDealer) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-between p-4 sm:p-8 font-sans">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <button
            onClick={() => appStore.setCurrentView('store')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#058852] bg-white px-3.5 py-2 rounded-lg border border-stone-200 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Retail Storefront</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-[#058852]" />
            <span>Encrypted B2B Dealer & Distributor Gateway</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full my-8 bg-white rounded-2xl shadow-lg border border-stone-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: B2B Security & Portal Capabilities */}
          <div className="lg:col-span-5 bg-[#0D3B2A] text-white p-7 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="bg-white px-3.5 py-2 rounded-xl inline-flex items-center shadow-xs">
                <CarePlusLogo className="h-8 w-auto object-contain" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                  Approved Partners Only
                </span>
                <h1 className="text-xl font-bold tracking-tight">
                  Wholesale Customer Portal
                </h1>
                <p className="text-xs text-emerald-100/80 mt-1.5 leading-relaxed">
                  Wholesale trade tariffs, volume tier breaks, contract pricing, and credit ledger statements are strictly restricted to authenticated DDA-approved dealers and regional distributors.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-emerald-100 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Private Dealer, Distributor & Contract Price Lists</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Quantity-Based Bulk Pricing Tiers (10+, 30+, 100+)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Purchase Order (PO) Upload & Quotation Negotiation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Credit Limit Gauge, SOA Statements & 1-Click Reorder</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-emerald-800/80 text-[11px] text-emerald-200/70">
              Unauthenticated retail visitors never see B2B pricing. All sessions are logged in the CarePlus ERP Audit Trail.
            </div>
          </div>

          {/* Right Column: Login Form & Instant Demo Credentials */}
          <div className="lg:col-span-7 p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#058852] mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Business Customer Authentication</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900">
                Sign In to Your Trade Account
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Enter your approved Dealer Code, PAN Number, or Registered Email and 4-digit Trade PIN.
              </p>

              {loginError && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dealer Code / PAN / Registered Email
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. DLR-LAL-019 or order@himalayanaushadhi.com.np"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#058852]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    4-Digit Trade Security PIN
                  </label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm font-mono focus:outline-none focus:border-[#058852]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#058852] hover:bg-[#047243] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  Access Private Wholesale Portal
                </button>
              </form>
            </div>

            {/* 1-Click Approved Dealer / Distributor Demo Accounts */}
            <div className="mt-6 pt-5 border-t border-stone-200">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2.5">
                Quick-Fill Approved B2B Accounts (Click to Load):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('DLR-LAL-019');
                    setPin('2244');
                    appStore.loginWholesaleDealer('DLR-LAL-019', '2244');
                  }}
                  className="text-left p-2.5 rounded-lg border border-stone-200 hover:border-[#058852] bg-stone-50 hover:bg-emerald-50/40 transition-colors cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-[#058852] uppercase">Approved Dealer</div>
                  <div className="text-xs font-bold text-stone-800 truncate">Himalayan Aushadhi</div>
                  <div className="text-[10px] font-mono text-stone-500">ID: DLR-LAL-019 · PIN: 2244</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('DST-BRT-004');
                    setPin('3355');
                    appStore.loginWholesaleDealer('DST-BRT-004', '3355');
                  }}
                  className="text-left p-2.5 rounded-lg border border-stone-200 hover:border-[#058852] bg-stone-50 hover:bg-emerald-50/40 transition-colors cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-blue-700 uppercase">Regional Distributor</div>
                  <div className="text-xs font-bold text-stone-800 truncate">Koshi Herbal Dist.</div>
                  <div className="text-[10px] font-mono text-stone-500">ID: DST-BRT-004 · PIN: 3355</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('DLR-KTM-028');
                    setPin('1122');
                    appStore.loginWholesaleDealer('DLR-KTM-028', '1122');
                  }}
                  className="text-left p-2.5 rounded-lg border border-stone-200 hover:border-[#058852] bg-stone-50 hover:bg-emerald-50/40 transition-colors cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-amber-700 uppercase">Corporate Dealer</div>
                  <div className="text-xs font-bold text-stone-800 truncate">Faiyaz Bhai - IT FLY</div>
                  <div className="text-[10px] font-mono text-stone-500">ID: DLR-KTM-028 · PIN: 1122</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-stone-400">
          CarePlus Nepal Pvt. Ltd. · B2B Wholesale & Institutional Division · Baluwatar-04, Kathmandu
        </div>
      </div>
    );
  }

  // ============================================================================
  // AUTHENTICATED WHOLESALE CUSTOMER PORTAL
  // ============================================================================
  const dealerOrders = allOrders.filter(
    (o) => o.customerId === activeDealer.id || o.customerName === activeDealer.name
  );
  const dealerQuotations = quotations.filter(
    (q) => q.customerId === activeDealer.id || q.customerName === activeDealer.name
  );
  const availableCredit = Math.max(0, activeDealer.creditLimit - activeDealer.outstandingBalance);
  const creditUsagePercent = activeDealer.creditLimit > 0
    ? Math.min(100, Math.round((activeDealer.outstandingBalance / activeDealer.creditLimit) * 100))
    : 0;

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Compute Bulk Order Lines using the Multi-Price Engine
  const bulkOrderLines = Object.entries(bulkQuantities)
    .filter(([, qty]) => qty > 0)
    .map(([productId, qty]) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return null;
      const pricingConfig = appStore.getPricingConfig(product.id);
      const resolution = resolveMultiPrice({
        product,
        pricingConfig,
        customer: activeDealer,
        customPriceLists,
        channel: 'wholesale',
        quantity: qty,
        isAuthenticatedWholesale: true
      });
      return { product, pricingConfig, qty, resolution };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const bulkSubtotalExcl = bulkOrderLines.reduce((s, l) => s + l.resolution.lineSubtotalExclTax, 0);
  const bulkTaxTotal = bulkOrderLines.reduce((s, l) => s + l.resolution.lineTaxAmount, 0);
  const bulkGrandTotal = bulkOrderLines.reduce((s, l) => s + l.resolution.lineTotalInclTax, 0);

  const handlePlaceBulkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkOrderLines.length === 0) return;

    const orderItems = bulkOrderLines.map((line) => ({
      productId: line.product.id,
      productName: line.product.name,
      packSize: line.product.packSize,
      quantity: line.qty,
      unitPrice: line.resolution.finalUnitPrice,
      lineTotal: line.resolution.lineTotalInclTax,
      batchNumber: 'FEFO-AUTO',
      priceSnapshot: createImmutablePriceSnapshot({
        pricingConfig: line.pricingConfig,
        resolution: line.resolution
      })
    }));

    const created = appStore.createInvoiceOrder({
      customer: activeDealer,
      channel: 'wholesale',
      items: orderItems,
      subtotal: Number(bulkSubtotalExcl.toFixed(2)),
      taxAmount: Number(bulkTaxTotal.toFixed(2)),
      totalAmount: Number(bulkGrandTotal.toFixed(2)),
      paymentMethod: 'credit',
      paymentStatus: 'unpaid',
      poReferenceNumber: poRefNumber || undefined,
      poDocumentName: poFileName || undefined,
      notes: orderNotes || 'Placed via Authenticated Wholesale Dealer Portal'
    });

    setOrderSuccessBanner(
      `Wholesale Order ${created.orderNumber} (Tax Invoice ${created.invoiceNumber}) submitted with PO Ref ${poRefNumber || 'N/A'}! Immutable price snapshots saved.`
    );
    setBulkQuantities({});
  };

  const handleReorderPreviousInvoice = (order: Order) => {
    const nextMap: Record<string, number> = {};
    for (const item of order.items) {
      nextMap[item.productId] = (nextMap[item.productId] || 0) + item.quantity;
    }
    setBulkQuantities(nextMap);
    setPoRefNumber(`REORDER-${order.orderNumber}`);
    setActiveTab('bulk_order');
    setOrderSuccessBanner(`Loaded ${order.items.length} SKU lines from previous invoice ${order.invoiceNumber} into your Bulk Order Pad.`);
  };

  const handleRequestQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const validLines: WholesaleQuotationLine[] = qtnLines
      .filter((l) => l.quantity > 0)
      .map((l) => {
        const prod = products.find((p) => p.id === l.productId) || products[0];
        const pCfg = appStore.getPricingConfig(prod.id);
        return {
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          packSize: prod.packSize,
          quantity: l.quantity,
          standardDealerPrice: pCfg.dealerPrice,
          requestedUnitPrice: l.requestedUnitPrice
        };
      });

    if (validLines.length === 0) return;

    const qtnNum = `QTN-2083-${Math.floor(1000 + Math.random() * 9000)}`;
    appStore.createWholesaleQuotation({
      id: `qtn-${Date.now()}`,
      quotationNumber: qtnNum,
      customerId: activeDealer.id,
      customerName: activeDealer.name,
      dealerCode: activeDealer.dealerCode || 'DLR-NP',
      createdAt: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kathmandu' }),
      validUntil: '2026-11-15',
      status: 'requested',
      poReferenceNumber: qtnPoRef || undefined,
      poAttachmentName: qtnAttachment || undefined,
      dealerNotes: qtnNotes,
      lines: validLines
    });

    setQtnNotice(`Quotation Request ${qtnNum} sent to CarePlus B2B Desk! Our Admin team can now review and publish negotiated rates.`);
  };

  const handleDownloadStatementCsv = () => {
    const rows = [
      ['Date', 'Document No', 'Transaction Type', 'PO Ref', 'Debit (NPR)', 'Credit (NPR)', 'Running Balance (NPR)'],
      ['2026-09-01', 'OPN-2083', 'Opening Balance B/F', '-', '44290.00', '0.00', '44290.00'],
      ...dealerOrders.map((o) => [
        o.createdAt.split('T')[0],
        o.invoiceNumber,
        `Wholesale Tax Invoice (${o.orderNumber})`,
        o.poReferenceNumber || '-',
        o.totalAmount.toFixed(2),
        o.paymentStatus === 'paid' ? o.totalAmount.toFixed(2) : '0.00',
        activeDealer.outstandingBalance.toFixed(2)
      ])
    ];
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CarePlus_Statement_${activeDealer.dealerCode || activeDealer.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const salesExec = activeDealer.assignedSalesExec || {
    id: 'exec-01',
    name: 'Rameshwar Adhikari',
    designation: 'Senior B2B Trade & Institutional Manager',
    phone: '+977-9851144209',
    whatsapp: '+977-9851144209',
    email: 'rameshwar.b2b@careplusnepal.com',
    territory: 'Bagmati & Gandaki Province'
  };

  return (
    <div className="min-h-screen bg-[#F6F8F7] text-stone-900 flex flex-col font-sans">
      {/* Top Wholesale Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CarePlusLogo className="h-8 sm:h-9 w-auto object-contain" />
            <div className="h-6 w-px bg-stone-200 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#058852] border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                  {activeDealer.type === 'distributor' ? 'Verified Distributor' : 'Approved Wholesale Dealer'}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  {activeDealer.dealerCode || 'DLR-01'} · PAN: {activeDealer.panNumber || '602398411'}
                </span>
              </div>
              <h1 className="text-sm font-bold text-stone-900">{activeDealer.name}</h1>
            </div>
          </div>

          {/* Credit Limit Quick Summary & Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden lg:flex items-center gap-4 bg-stone-50 border border-stone-200/90 px-3.5 py-1.5 rounded-xl text-xs">
              <div>
                <span className="text-[10px] uppercase text-stone-400 font-semibold block">Credit Limit</span>
                <span className="font-bold text-stone-800">Rs. {activeDealer.creditLimit.toLocaleString()}</span>
              </div>
              <div className="h-6 w-px bg-stone-200" />
              <div>
                <span className="text-[10px] uppercase text-stone-400 font-semibold block">Outstanding</span>
                <span className="font-bold text-red-600">Rs. {activeDealer.outstandingBalance.toLocaleString()}</span>
              </div>
              <div className="h-6 w-px bg-stone-200" />
              <div>
                <span className="text-[10px] uppercase text-stone-400 font-semibold block">Available Credit</span>
                <span className="font-bold text-[#058852]">Rs. {availableCredit.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => appStore.setCurrentView('store')}
              className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-700 cursor-pointer"
            >
              Retail Storefront
            </button>

            <button
              onClick={() => appStore.logoutWholesaleDealer()}
              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-1 border-t border-stone-100 text-xs font-semibold">
          {[
            { id: 'catalog', label: 'Private Price List & Catalog', icon: Layers },
            { id: 'bulk_order', label: `Bulk Order & PO Upload (${bulkOrderLines.length})`, icon: ClipboardList },
            { id: 'quotations', label: `Quotations (${dealerQuotations.length})`, icon: FileText },
            { id: 'orders', label: `Previous Orders & Reorder (${dealerOrders.length})`, icon: RefreshCw },
            { id: 'statement', label: 'Credit & Statements', icon: CreditCard },
            { id: 'deliveries', label: 'Track Deliveries', icon: Truck },
            { id: 'sales_exec', label: 'Assigned Sales Executive', icon: UserCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'border-[#058852] text-[#058852] bg-emerald-50/40'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        {orderSuccessBanner && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#058852] shrink-0" />
              <span>{orderSuccessBanner}</span>
            </div>
            <button onClick={() => setOrderSuccessBanner(null)} className="text-xs font-bold underline">
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: PRIVATE PRICE LIST & WHOLESALE CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Private Wholesale Price List & Quantity Tier Matrix
                </h2>
                <p className="text-xs text-stone-500">
                  Prices below are resolved dynamically for <strong className="text-stone-800">{activeDealer.name}</strong> ({activeDealer.type.toUpperCase()}) via the Multi-Price Engine.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search SKU or remedy..."
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-[#058852]"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white focus:outline-none focus:border-[#058852]"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase text-stone-500">
                      <th className="py-3 px-4">Product / SKU</th>
                      <th className="py-3 px-3 text-right">MRP</th>
                      <th className="py-3 px-3 text-right">Retail</th>
                      <th className="py-3 px-3 text-right bg-emerald-50/60 text-[#058852]">Your Base Rate</th>
                      <th className="py-3 px-3">Price Source</th>
                      <th className="py-3 px-3">Quantity-Based Pricing Tiers</th>
                      <th className="py-3 px-3 text-center">Tax (13% VAT)</th>
                      <th className="py-3 px-4 text-right">Bulk Order Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((product) => {
                      const pConfig = appStore.getPricingConfig(product.id);
                      const currentQty = bulkQuantities[product.id] || 0;
                      const res = resolveMultiPrice({
                        product,
                        pricingConfig: pConfig,
                        customer: activeDealer,
                        customPriceLists,
                        channel: 'wholesale',
                        quantity: Math.max(1, currentQty),
                        isAuthenticatedWholesale: true
                      });
                      const dealerMarginPct = Math.round(((pConfig.mrp - res.finalUnitPrice) / pConfig.mrp) * 100);

                      return (
                        <tr key={product.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-stone-900">{product.name}</div>
                                <div className="text-[11px] text-stone-500 font-mono">
                                  {product.sku} · {product.packSize} · Stock: {product.stock}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-stone-400 line-through">
                            Rs. {pConfig.mrp}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-stone-600">
                            Rs. {pConfig.retailPrice}
                          </td>
                          <td className="py-3 px-3 text-right bg-emerald-50/40">
                            <div className="font-bold text-sm text-[#058852] font-mono">
                              Rs. {res.finalUnitPrice}
                            </div>
                            <div className="text-[10px] text-emerald-700 font-semibold">
                              {dealerMarginPct}% below MRP
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-900 font-mono text-[10px] font-bold">
                              {res.finalPriceSource}
                            </span>
                            <div className="text-[10px] text-stone-500 mt-0.5 max-w-[160px] truncate" title={res.finalSourceLabel}>
                              {res.finalSourceLabel}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex flex-wrap gap-1.5">
                              {pConfig.bulkTiers.map((tier) => {
                                const isUnlocked = currentQty >= tier.minQty && (!tier.maxQty || currentQty <= tier.maxQty);
                                return (
                                  <span
                                    key={tier.id}
                                    className={`px-2 py-0.5 rounded border text-[10px] font-mono ${
                                      isUnlocked
                                        ? 'bg-[#058852] text-white border-[#058852] font-bold'
                                        : 'bg-stone-50 text-stone-600 border-stone-200'
                                    }`}
                                  >
                                    {tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : '+'}: Rs.{tier.unitPrice}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-semibold uppercase">
                              {pConfig.taxSetting}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setBulkQuantities((prev) => ({
                                    ...prev,
                                    [product.id]: Math.max(0, (prev[product.id] || 0) - 10)
                                  }))
                                }
                                className="w-6 h-6 rounded bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min={0}
                                value={currentQty}
                                onChange={(e) =>
                                  setBulkQuantities((prev) => ({
                                    ...prev,
                                    [product.id]: Math.max(0, parseInt(e.target.value, 10) || 0)
                                  }))
                                }
                                className="w-14 text-center font-mono text-xs font-bold bg-white rounded border border-stone-200 py-1"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setBulkQuantities((prev) => ({
                                    ...prev,
                                    [product.id]: (prev[product.id] || 0) + 10
                                  }))
                                }
                                className="w-6 h-6 rounded bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BULK QUANTITY ORDER PAD & PURCHASE ORDER UPLOAD */}
        {activeTab === 'bulk_order' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-stone-900">Bulk Quantity Order Entry</h2>
                  <p className="text-xs text-stone-500">
                    Quantity tiers and contract prices auto-update as you adjust line quantities.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs font-semibold text-[#058852] hover:underline cursor-pointer"
                >
                  + Add More SKUs from Price List
                </button>
              </div>

              {bulkOrderLines.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">
                  No bulk quantities entered yet. Select quantities from the Private Price List tab.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-[11px] uppercase text-stone-400 font-bold">
                        <th className="py-2">SKU / Remedy</th>
                        <th className="py-2">Resolved Price Source</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Unit Price</th>
                        <th className="py-2 text-right">Line Total (Incl. VAT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {bulkOrderLines.map(({ product, qty, resolution }) => (
                        <tr key={product.id}>
                          <td className="py-3 font-medium text-stone-900">
                            <div>{product.name}</div>
                            <div className="text-[10px] font-mono text-stone-400">{product.sku} · {product.packSize}</div>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#058852] font-mono text-[10px] font-bold">
                              {resolution.finalPriceSource}
                            </span>
                            <div className="text-[10px] text-stone-500">{resolution.finalSourceLabel}</div>
                          </td>
                          <td className="py-3 text-center">
                            <input
                              type="number"
                              min={0}
                              value={qty}
                              onChange={(e) =>
                                setBulkQuantities((prev) => ({
                                  ...prev,
                                  [product.id]: Math.max(0, parseInt(e.target.value, 10) || 0)
                                }))
                              }
                              className="w-16 text-center font-mono font-bold border border-stone-300 rounded py-1"
                            />
                          </td>
                          <td className="py-3 text-right font-mono font-bold text-stone-800">
                            Rs. {resolution.finalUnitPrice.toLocaleString()}
                          </td>
                          <td className="py-3 text-right font-mono font-bold text-[#058852]">
                            Rs. {resolution.lineTotalInclTax.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right: Purchase Order Upload & Credit Submission */}
            <form onSubmit={handlePlaceBulkOrder} className="lg:col-span-4 bg-white rounded-xl border border-stone-200 p-5 space-y-4 h-fit">
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2.5">
                Purchase Order Reference & Dispatch
              </h3>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Purchase Order (PO) Reference Number *
                </label>
                <input
                  type="text"
                  required
                  value={poRefNumber}
                  onChange={(e) => setPoRefNumber(e.target.value)}
                  placeholder="e.g. PO-2083/104"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#058852]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Upload Official Purchase Order Document (PDF/Image/CSV)
                </label>
                <label className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg border border-dashed border-stone-300 hover:border-[#058852] bg-stone-50 text-xs text-stone-600 cursor-pointer">
                  <Upload className="w-4 h-4 text-[#058852]" />
                  <span className="truncate">{poFileName || 'Click to attach signed PO document'}</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.csv"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setPoFileName(f.name);
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Dispatch & Delivery Instructions
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Preferred transport carrier or warehouse branch..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-[#058852]"
                />
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Net Taxable Subtotal:</span>
                  <span className="font-mono">Rs. {bulkSubtotalExcl.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Nepal VAT (13%):</span>
                  <span className="font-mono">Rs. {bulkTaxTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Total Invoice Amount:</span>
                  <span className="font-mono text-[#058852]">Rs. {bulkGrandTotal.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-stone-500 pt-1">
                  Billed against Net-{activeDealer.paymentTermsDays} Credit Line (Available: Rs. {availableCredit.toLocaleString()})
                </div>
              </div>

              <button
                type="submit"
                disabled={bulkOrderLines.length === 0}
                className="w-full py-2.5 px-4 rounded-lg bg-[#058852] hover:bg-[#047243] disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Submit Wholesale Order & Generate Tax Invoice
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: REQUEST & CONFIRM NEGOTIATED QUOTATIONS */}
        {activeTab === 'quotations' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Active & Negotiated Quotations */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-base font-bold text-stone-900">
                Your B2B Quotations & Negotiated Rate Offers
              </h2>
              {qtnNotice && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  {qtnNotice}
                </div>
              )}

              {dealerQuotations.map((qtn) => (
                <div key={qtn.id} className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900">{qtn.quotationNumber}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            qtn.status === 'negotiated_by_admin'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : qtn.status === 'converted_to_order'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {qtn.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Requested: {qtn.createdAt} · Valid Until: {qtn.validUntil} · PO Ref: {qtn.poReferenceNumber || 'N/A'}
                      </div>
                    </div>

                    {qtn.status === 'negotiated_by_admin' && (
                      <button
                        onClick={() => {
                          const order = appStore.confirmQuotationAndConvertToOrder(qtn.id);
                          if (order) {
                            setOrderSuccessBanner(
                              `Confirmed Negotiated Quotation ${qtn.quotationNumber}! Converted to Official Order ${order.orderNumber} (${order.invoiceNumber}).`
                            );
                          }
                        }}
                        className="px-3.5 py-2 rounded-lg bg-[#058852] hover:bg-[#047243] text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        ✓ Confirm Negotiated Quotation & Convert to Order
                      </button>
                    )}
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[10px] uppercase text-stone-400 border-b border-stone-100">
                        <th className="py-1.5">Product</th>
                        <th className="py-1.5 text-center">Qty</th>
                        <th className="py-1.5 text-right">Std Dealer</th>
                        <th className="py-1.5 text-right">Requested</th>
                        <th className="py-1.5 text-right text-[#058852]">Negotiated Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {qtn.lines.map((l) => (
                        <tr key={l.productId}>
                          <td className="py-2 font-medium">{l.productName}</td>
                          <td className="py-2 text-center font-mono">{l.quantity}</td>
                          <td className="py-2 text-right font-mono text-stone-500">Rs. {l.standardDealerPrice}</td>
                          <td className="py-2 text-right font-mono text-stone-700">Rs. {l.requestedUnitPrice}</td>
                          <td className="py-2 text-right font-mono font-bold text-[#058852]">
                            {l.negotiatedUnitPrice ? `Rs. ${l.negotiatedUnitPrice}` : 'Pending Admin Review'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {qtn.adminResponseNotes && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-950">
                      <strong>Admin Negotiation Note ({qtn.negotiatedByStaff}):</strong> {qtn.adminResponseNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right: Request New Quotation Form */}
            <form onSubmit={handleRequestQuotation} className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-5 space-y-4 h-fit">
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2.5">
                Request Custom Bulk Quotation
              </h3>
              <p className="text-xs text-stone-500">
                Propose target quantities and requested unit rates for special institutional or seasonal tenders.
              </p>

              <div className="space-y-2.5">
                {qtnLines.map((line, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <div className="col-span-6">
                      <label className="text-[10px] text-stone-400 block">Product</label>
                      <select
                        value={line.productId}
                        onChange={(e) => {
                          const next = [...qtnLines];
                          next[idx].productId = e.target.value;
                          setQtnLines(next);
                        }}
                        className="w-full text-xs bg-white border border-stone-200 rounded px-2 py-1"
                      >
                        {products.slice(0, 10).map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-stone-400 block">Qty</label>
                      <input
                        type="number"
                        value={line.quantity}
                        onChange={(e) => {
                          const next = [...qtnLines];
                          next[idx].quantity = parseInt(e.target.value, 10) || 0;
                          setQtnLines(next);
                        }}
                        className="w-full text-xs font-mono bg-white border border-stone-200 rounded px-2 py-1"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-stone-400 block">Target Rs.</label>
                      <input
                        type="number"
                        value={line.requestedUnitPrice}
                        onChange={(e) => {
                          const next = [...qtnLines];
                          next[idx].requestedUnitPrice = parseInt(e.target.value, 10) || 0;
                          setQtnLines(next);
                        }}
                        className="w-full text-xs font-mono bg-white border border-stone-200 rounded px-2 py-1"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">PO / Tender Reference</label>
                <input
                  type="text"
                  value={qtnPoRef}
                  onChange={(e) => setQtnPoRef(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Notes to B2B Pricing Desk</label>
                <textarea
                  rows={2}
                  value={qtnNotes}
                  onChange={(e) => setQtnNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#058852] hover:bg-[#047243] text-white font-semibold text-xs cursor-pointer"
              >
                Submit Quotation Request to Admin
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: PREVIOUS ORDERS & 1-CLICK REORDER PREVIOUS INVOICES */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Previous Wholesale Orders & Immutable Invoice Snapshots
                </h2>
                <p className="text-xs text-stone-500">
                  Review historical invoices, inspect locked line-item price snapshots, or reorder any invoice in one click.
                </p>
              </div>
            </div>

            {dealerOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-stone-900">{order.invoiceNumber}</span>
                      <span className="text-xs font-mono text-stone-500">({order.orderNumber})</span>
                      {order.poReferenceNumber && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                          PO: {order.poReferenceNumber}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#058852] text-[10px] font-bold uppercase">
                        {order.fulfillmentStatus}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Date: {new Date(order.createdAt).toLocaleDateString()} · Carrier: {order.courierName} · AWB: {order.trackingNumber}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => appStore.setTaxInvoiceOrder(order)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Tax Invoice</span>
                    </button>
                    <button
                      onClick={() => handleReorderPreviousInvoice(order)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#058852] hover:bg-[#047243] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reorder Invoice</span>
                    </button>
                  </div>
                </div>

                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] uppercase text-stone-400 border-b border-stone-100">
                      <th className="py-1.5">Item</th>
                      <th className="py-1.5">Batch</th>
                      <th className="py-1.5">Immutable Price Snapshot Source</th>
                      <th className="py-1.5 text-center">Qty</th>
                      <th className="py-1.5 text-right">Locked Unit Price</th>
                      <th className="py-1.5 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 font-medium text-stone-800">{item.productName}</td>
                        <td className="py-2 font-mono text-[11px] text-stone-500">{item.batchNumber || 'FEFO'}</td>
                        <td className="py-2">
                          {item.priceSnapshot ? (
                            <div className="text-[11px]">
                              <span className="px-1.5 py-0.5 rounded bg-stone-100 font-mono text-[10px] font-bold">
                                {item.priceSnapshot.finalPriceSource}
                              </span>
                              <span className="text-stone-400 ml-1.5">
                                (MRPAtSale: Rs.{item.priceSnapshot.mrpAtSale})
                              </span>
                            </div>
                          ) : (
                            <span className="text-stone-400 text-[11px]">Standard Snapshot</span>
                          )}
                        </td>
                        <td className="py-2 text-center font-mono">{item.quantity}</td>
                        <td className="py-2 text-right font-mono">Rs. {item.unitPrice.toLocaleString()}</td>
                        <td className="py-2 text-right font-mono font-bold">Rs. {item.lineTotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: CREDIT LIMIT, OUTSTANDING BALANCE & DOWNLOAD STATEMENTS */}
        {activeTab === 'statement' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <div className="text-[11px] font-bold uppercase text-stone-400">Approved Credit Limit</div>
                <div className="text-xl font-bold text-stone-900 mt-1 font-mono">
                  Rs. {activeDealer.creditLimit.toLocaleString()}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">Terms: Net {activeDealer.paymentTermsDays} Days</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <div className="text-[11px] font-bold uppercase text-stone-400">Outstanding Balance</div>
                <div className="text-xl font-bold text-red-600 mt-1 font-mono">
                  Rs. {activeDealer.outstandingBalance.toLocaleString()}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">{creditUsagePercent}% of credit line utilized</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <div className="text-[11px] font-bold uppercase text-stone-400">Available Credit</div>
                <div className="text-xl font-bold text-[#058852] mt-1 font-mono">
                  Rs. {availableCredit.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">Eligible for immediate indent</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold uppercase text-stone-400">Account Statement (SOA)</div>
                <button
                  onClick={handleDownloadStatementCsv}
                  className="mt-2 w-full py-2 px-3 rounded-lg bg-[#058852] hover:bg-[#047243] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Statement (CSV)</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="text-sm font-bold text-stone-900 mb-3">
                Party Ledger & Statement of Account ({activeDealer.name})
              </h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-[11px] uppercase text-stone-400">
                    <th className="py-2">Date</th>
                    <th className="py-2">Voucher / Invoice</th>
                    <th className="py-2">Particulars</th>
                    <th className="py-2">PO Reference</th>
                    <th className="py-2 text-right">Debit (Invoiced)</th>
                    <th className="py-2 text-right">Credit (Paid)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-2.5 font-mono text-stone-500">2026-09-01</td>
                    <td className="py-2.5 font-mono">OPN-2083</td>
                    <td className="py-2.5">Opening Balance Brought Forward</td>
                    <td className="py-2.5 font-mono">-</td>
                    <td className="py-2.5 text-right font-mono">Rs. 44,290.00</td>
                    <td className="py-2.5 text-right font-mono">Rs. 0.00</td>
                  </tr>
                  {dealerOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5 font-mono text-stone-500">{o.createdAt.split('T')[0]}</td>
                      <td className="py-2.5 font-mono font-bold text-stone-800">{o.invoiceNumber}</td>
                      <td className="py-2.5">Wholesale Tax Invoice ({o.orderNumber})</td>
                      <td className="py-2.5 font-mono">{o.poReferenceNumber || '-'}</td>
                      <td className="py-2.5 text-right font-mono text-red-600">Rs. {o.totalAmount.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono text-[#058852]">
                        {o.paymentStatus === 'paid' ? `Rs. ${o.totalAmount.toLocaleString()}` : 'Rs. 0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: TRACK DELIVERIES */}
        {activeTab === 'deliveries' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900">B2B Consignment & Delivery Tracking</h2>
            {dealerOrders.map((o) => (
              <div key={o.id} className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-[#058852]" />
                    <span className="font-bold text-sm">{o.orderNumber}</span>
                    <span className="text-xs font-mono text-stone-500">AWB: {o.trackingNumber}</span>
                  </div>
                  <div className="text-xs text-stone-600">
                    Assigned Carrier: <strong>{o.courierName}</strong> · Pickup Branch: <strong>{o.pickupBranch || 'Baluwatar Central Hub'}</strong>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Destination: {o.shippingAddress.tole}, {o.shippingAddress.district}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#058852] border border-emerald-200 font-bold uppercase">
                    Status: {o.fulfillmentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 7: CONTACT ASSIGNED SALES EXECUTIVE */}
        {activeTab === 'sales_exec' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 bg-white rounded-xl border border-stone-200 p-6 space-y-4">
              <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-[#058852] text-[10px] font-bold uppercase">
                Dedicated Account Manager
              </span>
              <div>
                <h2 className="text-lg font-bold text-stone-900">{salesExec.name}</h2>
                <p className="text-xs text-stone-500">{salesExec.designation}</p>
              </div>
              <div className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#058852]" />
                  <span>Direct Line: <strong>{salesExec.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#058852]" />
                  <span>WhatsApp Business: <strong>{salesExec.whatsapp}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#058852]" />
                  <span>Email: <strong>{salesExec.email}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#058852]" />
                  <span>Territory: <strong>{salesExec.territory}</strong></span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 bg-white rounded-xl border border-stone-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-stone-900">
                Send Priority Dispatch / Rate Inquiry to {salesExec.name}
              </h3>
              {execMessageSent && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  Message logged and dispatched to {salesExec.name} ({salesExec.phone}).
                </div>
              )}
              <textarea
                rows={4}
                value={execMessage}
                onChange={(e) => setExecMessage(e.target.value)}
                placeholder="Write to your assigned sales executive regarding credit limit extension, contract renewal, or urgent stock dispatch..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-[#058852]"
              />
              <button
                type="button"
                onClick={() => {
                  if (!execMessage.trim()) return;
                  appStore.addAuditLog(
                    activeDealer.name,
                    'Sales Executive Contacted',
                    `Dealer message sent to ${salesExec.name}: "${execMessage}"`
                  );
                  setExecMessage('');
                  setExecMessageSent(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#058852] hover:bg-[#047243] text-white text-xs font-semibold cursor-pointer"
              >
                Send Direct Message to Account Executive
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
