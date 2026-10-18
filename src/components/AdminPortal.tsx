import React, { useState } from 'react';
import {
  LayoutGrid,
  Users,
  Boxes,
  FileSpreadsheet,
  ShoppingBag,
  CircleDollarSign,
  Landmark,
  BarChart3,
  Bell,
  Upload,
  Truck,
  MapPin,
  FileText,
  Image as ImageIcon,
  ArrowRightLeft,
  TicketPercent,
  ChevronRight,
  ChevronDown,
  Plus,
  Calendar,
  TrendingUp,
  ShoppingCart,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Edit3,
  Lock,
  Layers,
  RefreshCw,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { appStore } from '../services/store';
import {
  resolveMultiPrice,
  createImmutablePriceSnapshot,
  PRICE_PRECEDENCE_DOCUMENTATION
} from '../services/pricingEngine';
import {
  CarePlusLogo
} from './CarePlusLogo';
import { AdminErpModules } from './AdminErpModules';
import { SimpleProductManager } from './SimpleProductManager';
import { INITIAL_STAFF } from '../services/mockData';
import {
  OrderChannel,
  TaxInclusionSetting,
  DiscountStackingMode
} from '../types';

type AdminSection =
  | 'dashboard'
  | 'inventory_products'
  | 'parties'
  | 'inventory_pricing'
  | 'inventory_groups'
  | 'inventory_batches'
  | 'sales_create_order'
  | 'sales_quotations'
  | 'sales_invoices'
  | 'purchase'
  | 'expense'
  | 'manage_accounts'
  | 'reports'
  | 'payment_reminders'
  | 'import_data'
  | 'assign_carrier'
  | 'pickup_branches'
  | 'blogs'
  | 'media_center'
  | 'redirects'
  | 'coupons';

interface DraftInvoiceLine {
  id: string;
  productId: string;
  quantity: number;
  manualOverridePrice: number | null;
  overrideReason: string;
  managerApproved: boolean;
  approvedByManagerName?: string;
  approvedTimestamp?: string;
  showTrace?: boolean;
}

export const AdminPortal: React.FC = () => {
  const products = appStore.getProducts();
  const customers = appStore.getCustomers();
  const orders = appStore.getOrders();
  const batches = appStore.getBatches();
  const auditLogs = appStore.getAuditLogs();
  const customerGroups = appStore.getCustomerGroups();
  const customPriceLists = appStore.getCustomPriceLists();
  const quotations = appStore.getWholesaleQuotations();
  const activeStaff = appStore.getActiveStaff() || {
    ...INITIAL_STAFF[0],
    name: 'Suman Vaidya (superadmin)',
    role: 'super_admin' as const
  };

  // Sidebar Navigation State
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [salesOpen, setSalesOpen] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<'Monthly' | 'Weekly' | 'Quarterly'>('Monthly');

  // Staff Role Simulation (so user can test floor/approval limits as Cashier vs SuperAdmin)
  const [simulatedRole, setSimulatedRole] = useState<'super_admin' | 'pos_cashier'>('super_admin');

  // Multi-Price Engine Editor State (`inventory_pricing`)
  const [selectedProductIdForPricing, setSelectedProductIdForPricing] = useState<string>(
    products[0]?.id || 'prod-shilajit-resin'
  );
  const [pricingSaveBanner, setPricingSaveBanner] = useState<string | null>(null);
  const [newContractCode, setNewContractCode] = useState('CTR-2083-NEW');
  const [newContractPartyId, setNewContractPartyId] = useState('cust-dealer-01');
  const [newContractPrice, setNewContractPrice] = useState(1720);
  const [newContractFrom, setNewContractFrom] = useState('2026-10-01');
  const [newContractTo, setNewContractTo] = useState('2027-04-30');

  const [newCspCustomerId, setNewCspCustomerId] = useState('cust-faiyaz-01');
  const [newCspPrice, setNewCspPrice] = useState(1750);
  const [newCspNotes, setNewCspNotes] = useState('Special annual B2B commitment rate');

  // Customer Groups & Custom Price Lists State (`inventory_groups`)
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCode, setNewGroupCode] = useState('');
  const [newGroupDiscount, setNewGroupDiscount] = useState(20);
  const [selectedPriceListId, setSelectedPriceListId] = useState(
    customPriceLists[0]?.id || 'plist-distributor-gold'
  );

  // Invoice / Order Creation Builder State (`sales_create_order`)
  const [invCustomerId, setInvCustomerId] = useState<string>('cust-dealer-01');
  const [invChannel, setInvChannel] = useState<OrderChannel>('wholesale');
  const [invDate, setInvDate] = useState<string>('2026-10-18');
  const [invPoRef, setInvPoRef] = useState<string>('PO-2083/902');
  const [invPaymentMethod, setInvPaymentMethod] = useState<'credit' | 'cash' | 'esewa' | 'connectips'>('credit');
  const [invLines, setInvLines] = useState<DraftInvoiceLine[]>([
    {
      id: 'line-1',
      productId: 'prod-shilajit-resin',
      quantity: 35,
      manualOverridePrice: null,
      overrideReason: '',
      managerApproved: false,
      showTrace: false
    },
    {
      id: 'line-2',
      productId: 'prod-ashwagandha-ksm66',
      quantity: 12,
      manualOverridePrice: 910, // Below staffApprovalLimit to demonstrate override & manager approval!
      overrideReason: 'Special hospital camp bulk courtesy rate',
      managerApproved: true,
      approvedByManagerName: 'Suman Vaidya (superadmin)',
      approvedTimestamp: '18/10/2026, 08:04:44',
      showTrace: false
    }
  ]);
  const [managerPinInput, setManagerPinInput] = useState('9988');
  const [approvingLineId, setApprovingLineId] = useState<string | null>(null);
  const [invoiceCreatedBanner, setInvoiceCreatedBanner] = useState<string | null>(null);

  // Quotation Negotiation State
  const [negotiationPrices, setNegotiationPrices] = useState<Record<string, number>>({});
  const [negotiationNote, setNegotiationNote] = useState(
    'Approved special dealer volume rate. Valid for 15 days with FEFO dispatch.'
  );

  // Selected Product Pricing Config
  const selectedProductForPricing =
    products.find((p) => p.id === selectedProductIdForPricing) || products[0];
  const currentPricingConfig = appStore.getPricingConfig(selectedProductForPricing.id);

  // Breadcrumb label helper
  const sectionLabels: Record<AdminSection, string> = {
    dashboard: 'Dashboard',
    inventory_products: 'Products › Add & Manage Store Products',
    parties: 'Parties (Customers, Dealers & Suppliers)',
    inventory_pricing: 'Inventory › Advanced Multi-Price Engine',
    inventory_groups: 'Inventory › Customer Groups & Price Lists',
    inventory_batches: 'Inventory › FEFO Batches & Expiry',
    sales_create_order: 'Sales › Create Order & Multi-Price Invoice Builder',
    sales_quotations: 'Sales › B2B Quotations & Rate Negotiations',
    sales_invoices: 'Sales › Completed Invoices & Immutable Price Snapshots',
    purchase: 'Purchase › Supplier Bills & Payables',
    expense: 'Expense › Operating Expenses',
    manage_accounts: 'Manage Accounts › Cash & Bank Ledgers',
    reports: 'Reports › Multi-Price Override & Security Audit Trail',
    payment_reminders: 'Payment Reminders › Credit Terms & Collections',
    import_data: 'Import Data',
    assign_carrier: 'Assign Carrier',
    pickup_branches: 'Pickup Branches',
    blogs: 'Blogs',
    media_center: 'Media Center & Brand Logo',
    redirects: 'Redirects',
    coupons: 'Coupons'
  };

  // Resolve all draft invoice lines dynamically
  const invCustomer = customers.find((c) => c.id === invCustomerId) || customers[0];
  const resolvedInvLines = invLines.map((line) => {
    const product = products.find((p) => p.id === line.productId) || products[0];
    const pricingConfig = appStore.getPricingConfig(product.id);
    const resolution = resolveMultiPrice({
      product,
      pricingConfig,
      customer: invCustomer,
      customPriceLists,
      channel: invChannel,
      quantity: line.quantity,
      invoiceDate: invDate,
      manualOverrideUnitPrice: line.manualOverridePrice,
      isAuthenticatedWholesale: invChannel === 'wholesale'
    });
    const isOverridden = resolution.finalPriceSource === 'INVOICE_OVERRIDE';
    const needsManagerApproval =
      isOverridden &&
      (resolution.requiresManagerApproval || simulatedRole === 'pos_cashier') &&
      !line.managerApproved;
    const missingReason = isOverridden && !line.overrideReason.trim();

    return {
      line,
      product,
      pricingConfig,
      resolution,
      isOverridden,
      needsManagerApproval,
      missingReason
    };
  });

  const invSubtotalExcl = resolvedInvLines.reduce((s, r) => s + r.resolution.lineSubtotalExclTax, 0);
  const invTaxTotal = resolvedInvLines.reduce((s, r) => s + r.resolution.lineTaxAmount, 0);
  const invGrandTotal = resolvedInvLines.reduce((s, r) => s + r.resolution.lineTotalInclTax, 0);
  const hasBlockingOverrideIssue = resolvedInvLines.some(
    (r) => r.needsManagerApproval || r.missingReason
  );

  const handleFinalizeInvoice = () => {
    if (hasBlockingOverrideIssue || resolvedInvLines.length === 0) return;

    const items = resolvedInvLines.map((r) => ({
      productId: r.product.id,
      productName: r.product.name,
      packSize: r.product.packSize,
      quantity: r.line.quantity,
      unitPrice: r.resolution.finalUnitPrice,
      lineTotal: r.resolution.lineTotalInclTax,
      batchNumber: 'FEFO-AUTO',
      priceSnapshot: createImmutablePriceSnapshot({
        pricingConfig: r.pricingConfig,
        resolution: r.resolution,
        overrideReason: r.line.overrideReason || undefined,
        overriddenByStaffId: simulatedRole === 'super_admin' ? 'staff-1' : 'staff-2',
        overriddenByStaffName:
          simulatedRole === 'super_admin' ? 'Suman Vaidya (superadmin)' : 'Nabina Gurung (pos_cashier)',
        approvedByManagerId: r.line.managerApproved ? 'staff-1' : undefined,
        approvedByManagerName: r.line.approvedByManagerName
      })
    }));

    const created = appStore.createInvoiceOrder({
      customer: invCustomer,
      channel: invChannel,
      items,
      subtotal: Number(invSubtotalExcl.toFixed(2)),
      taxAmount: Number(invTaxTotal.toFixed(2)),
      totalAmount: Number(invGrandTotal.toFixed(2)),
      paymentMethod: invPaymentMethod,
      paymentStatus: invPaymentMethod === 'credit' ? 'unpaid' : 'paid',
      poReferenceNumber: invPoRef || undefined,
      actorName: simulatedRole === 'super_admin' ? 'superadmin' : 'Nabina Gurung (POS)'
    });

    setInvoiceCreatedBanner(
      `Invoice ${created.invoiceNumber} (${created.orderNumber}) finalized for ${invCustomer.name}! Immutable price snapshots stored on all ${items.length} line items. Global product prices were NOT modified.`
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex font-sans antialiased">
      {/* =====================================================================
          LEFT SIDEBAR (Exact Quark CarePlus UAT Admin Layout from Screenshot)
         ===================================================================== */}
      <aside className="w-60 bg-white border-r border-slate-200/90 flex flex-col shrink-0 select-none">
        {/* Top Brand Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <button
            onClick={() => setActiveSection('dashboard')}
            className="flex items-center focus:outline-none cursor-pointer"
          >
            <CarePlusLogo className="h-7 w-auto object-contain" />
          </button>
        </div>

        {/* Sidebar Scrollable Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-[13px]">
          {/* Dashboard & Quick Add Product Primary Buttons */}
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-[#E6F4EC] text-[#058852]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSection('inventory_products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeSection === 'inventory_products'
                  ? 'bg-[#058852] text-white shadow-2xs'
                  : 'bg-emerald-50/80 text-[#058852] hover:bg-emerald-100/80 border border-emerald-200/80'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Plus className="w-4 h-4" />
                <span>Add / Manage Products</span>
              </span>
              <span
                className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  activeSection === 'inventory_products'
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-[#058852]'
                }`}
              >
                {products.length}
              </span>
            </button>
          </div>

          {/* MAIN Group */}
          <div className="space-y-1">
            <div className="px-3.5 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              MAIN
            </div>

            {/* Parties */}
            <button
              onClick={() => setActiveSection('parties')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'parties'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <Users className="w-4 h-4 text-slate-500" />
                <span>Parties</span>
              </span>
            </button>

            {/* Inventory (Expandable) */}
            <div>
              <button
                onClick={() => {
                  setInventoryOpen(!inventoryOpen);
                  if (!activeSection.startsWith('inventory_')) {
                    setActiveSection('inventory_products');
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeSection.startsWith('inventory_')
                    ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Boxes className="w-4 h-4 text-slate-500" />
                  <span>Inventory</span>
                </span>
                {inventoryOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {inventoryOpen && (
                <div className="pl-9 pr-2 py-1 space-y-1 text-xs">
                  <button
                    onClick={() => setActiveSection('inventory_products')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeSection === 'inventory_products'
                        ? 'text-[#058852] font-bold bg-emerald-50/70'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    + Add & Edit Products ({products.length})
                  </button>
                  <button
                    onClick={() => setActiveSection('inventory_pricing')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeSection === 'inventory_pricing'
                        ? 'text-[#058852] font-bold bg-emerald-50/70'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Multi-Price Engine & SKUs
                  </button>
                  <button
                    onClick={() => setActiveSection('inventory_groups')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeSection === 'inventory_groups'
                        ? 'text-[#058852] font-bold bg-emerald-50/70'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Customer Groups & Price Lists
                  </button>
                  <button
                    onClick={() => setActiveSection('inventory_batches')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeSection === 'inventory_batches'
                        ? 'text-[#058852] font-bold bg-emerald-50/70'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    FEFO Batches & Expiry
                  </button>
                </div>
              )}
            </div>

            {/* Sales (Expandable) */}
            <div>
              <button
                onClick={() => {
                  setSalesOpen(!salesOpen);
                  if (!activeSection.startsWith('sales_')) {
                    setActiveSection('sales_create_order');
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeSection.startsWith('sales_')
                    ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                  <span>Sales</span>
                </span>
                {salesOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {salesOpen && (
                <div className="pl-9 pr-2 py-1 space-y-1 text-xs">
                  <button
                    onClick={() => setActiveSection('sales_create_order')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeSection === 'sales_create_order'
                        ? 'text-[#058852] font-bold bg-emerald-50/70'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Create Order / Invoice Builder
                  </button>
                  <button
                    onClick={() => setActiveSection('sales_quotations')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeSection === 'sales_quotations'
                        ? 'text-[#058852] font-bold bg-emerald-50/70'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    B2B Quotations ({quotations.length})
                  </button>
                  <button
                    onClick={() => setActiveSection('sales_invoices')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeSection === 'sales_invoices'
                        ? 'text-[#058852] font-bold bg-emerald-50/70'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Invoices & Price Snapshots
                  </button>
                </div>
              )}
            </div>

            {/* Purchase */}
            <button
              onClick={() => setActiveSection('purchase')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'purchase'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-slate-500" />
                <span>Purchase</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Expense */}
            <button
              onClick={() => setActiveSection('expense')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'expense'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <CircleDollarSign className="w-4 h-4 text-slate-500" />
                <span>Expense</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Manage Accounts */}
            <button
              onClick={() => setActiveSection('manage_accounts')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'manage_accounts'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <Landmark className="w-4 h-4 text-slate-500" />
                <span>Manage Accounts</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Reports */}
            <button
              onClick={() => setActiveSection('reports')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'reports'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <span>Reports</span>
              </span>
            </button>

            {/* Payment Reminders */}
            <button
              onClick={() => setActiveSection('payment_reminders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'payment_reminders'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-slate-500" />
                <span>Payment Reminders</span>
              </span>
            </button>

            {/* Import Data */}
            <button
              onClick={() => setActiveSection('import_data')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'import_data'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Import Data</span>
              </span>
            </button>

            {/* Assign Carrier */}
            <button
              onClick={() => setActiveSection('assign_carrier')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'assign_carrier'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-slate-500" />
                <span>Assign Carrier</span>
              </span>
            </button>

            {/* Pickup Branches */}
            <button
              onClick={() => setActiveSection('pickup_branches')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'pickup_branches'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Pickup Branches</span>
              </span>
            </button>

            {/* Blogs */}
            <button
              onClick={() => setActiveSection('blogs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'blogs'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Blogs</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Media Center */}
            <button
              onClick={() => setActiveSection('media_center')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'media_center'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span>Media Center</span>
              </span>
            </button>

            {/* Redirects */}
            <button
              onClick={() => setActiveSection('redirects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'redirects'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <ArrowRightLeft className="w-4 h-4 text-slate-500" />
                <span>Redirects</span>
              </span>
            </button>

            {/* Coupons */}
            <button
              onClick={() => setActiveSection('coupons')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeSection === 'coupons'
                  ? 'bg-[#E6F4EC] text-[#058852] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <TicketPercent className="w-4 h-4 text-slate-500" />
                <span>Coupons</span>
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Portal Switchers */}
        <div className="p-3 border-t border-slate-200 space-y-1.5 bg-slate-50/60">
          <button
            onClick={() => appStore.setCurrentView('wholesale')}
            className="w-full py-2 px-3 rounded-lg bg-[#095B9E] hover:bg-[#07477B] text-white text-xs font-semibold flex items-center justify-between cursor-pointer"
          >
            <span>Wholesale Dealer Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => appStore.setCurrentView('store')}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-between cursor-pointer"
          >
            <span>← Retail Storefront</span>
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </aside>

      {/* =====================================================================
          RIGHT MAIN WORKSPACE (Top Header + View Content)
         ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top White Bar matching Screenshot */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-20">
          {/* Left Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setActiveSection('dashboard')}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold text-slate-800">{sectionLabels[activeSection]}</span>
          </div>

          {/* Right Action Controls (`+ Create order`, Express Backend Pill, Bell, `S superadmin`) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSection('reports')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#058852] text-[11px] font-mono font-bold cursor-pointer hover:bg-emerald-100"
              title="Inspect Express REST API & Nepal IRD CBMS Gateway"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>API + IRD CBMS v2.4</span>
            </button>

            <button
              onClick={() => setActiveSection('inventory_products')}
              className="px-3.5 py-2 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-[#058852] text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>

            <button
              onClick={() => setActiveSection('sales_create_order')}
              className="px-4 py-2 rounded-lg bg-[#058852] hover:bg-[#047243] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create order</span>
            </button>

            <button
              onClick={() => setActiveSection('payment_reminders')}
              className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              title="Notifications & Payment Reminders"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 rounded-full bg-[#D8F3E5] text-[#058852] font-bold text-xs flex items-center justify-center">
                S
              </div>
              <span className="text-sm font-medium text-slate-800">
                {activeStaff.role === 'super_admin' ? 'superadmin' : activeStaff.name}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto space-y-6">
          {/* =================================================================
              1. STORE OVERVIEW DASHBOARD (Exact Match to Screenshot)
             ================================================================= */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Store Overview Header & Date Filters */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Store Overview</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    01 Oct 2026 – 18 Oct 2026 &nbsp;·&nbsp; <span className="text-slate-400">vs 01 Sep 2026 – 30 Sep 2026</span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <select
                      value={periodFilter}
                      onChange={(e) => setPeriodFilter(e.target.value as typeof periodFilter)}
                      className="appearance-none bg-[#058852] hover:bg-[#047243] text-white text-xs font-semibold pl-4 pr-9 py-2.5 rounded-lg cursor-pointer focus:outline-none"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Quarterly">Quarterly</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <button
                    onClick={() => setActiveSection('reports')}
                    className="px-4 py-2.5 rounded-lg bg-[#058852] hover:bg-[#047243] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Custom range</span>
                  </button>
                </div>
              </div>

              {/* Row 1: 5 Financial Cards (TO RECEIVE, TO GIVE, SALES, PURCHASE, EXPENSE) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Card 1: TO RECEIVE */}
                <div
                  onClick={() => setActiveSection('payment_reminders')}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:border-emerald-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      TO RECEIVE
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-[#E6F4EC] text-[#058852] flex items-center justify-center">
                      <CircleDollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-[#058852]">Rs. 11,750.00</div>
                  <div className="text-[11px] text-slate-400 mt-1">Owed to you by customers</div>
                </div>

                {/* Card 2: TO GIVE */}
                <div
                  onClick={() => setActiveSection('purchase')}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:border-red-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      TO GIVE
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-red-50 text-[#D92D20] flex items-center justify-center">
                      <Landmark className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-[#D92D20]">Rs. 1,78,582.00</div>
                  <div className="text-[11px] text-slate-400 mt-1">Owed by you to suppliers</div>
                </div>

                {/* Card 3: SALES */}
                <div
                  onClick={() => setActiveSection('sales_invoices')}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      SALES
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-slate-900">Rs. 1,000.00</div>
                  <div className="text-[11px] text-slate-400 mt-1">Invoiced in this period</div>
                </div>

                {/* Card 4: PURCHASE */}
                <div
                  onClick={() => setActiveSection('purchase')}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:border-purple-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      PURCHASE
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-slate-900">Rs. 11,471.52</div>
                  <div className="text-[11px] text-slate-400 mt-1">Billed in this period</div>
                </div>

                {/* Card 5: EXPENSE */}
                <div
                  onClick={() => setActiveSection('expense')}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:border-amber-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      EXPENSE
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <CircleDollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-slate-900">Rs. 5,000.00</div>
                  <div className="text-[11px] text-slate-400 mt-1">Paid out in this period</div>
                </div>
              </div>

              {/* Row 2: Cashflow (Left 2/3) + Total Balance & Payment Reminders (Right 1/3) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Cashflow Card */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Cashflow</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Money actually moved on your accounts, last 7 days
                      </p>
                    </div>
                    <div className="flex items-center gap-5 text-right">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Money In</span>
                        <span className="text-xs font-bold text-[#058852]">Rs. 0.00</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Money Out</span>
                        <span className="text-xs font-bold text-[#D92D20]">Rs. 0.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="my-4 flex-1 min-h-[220px] rounded-xl border border-dashed border-slate-200 bg-slate-50/40 flex items-center justify-center text-xs text-slate-400">
                    No money has moved through your accounts in the last 7 days.
                  </div>
                </div>

                {/* Right Column: Total Balance + Payment Reminders */}
                <div className="lg:col-span-4 space-y-4">
                  {/* TOTAL BALANCE (CASH & BANK) */}
                  <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      TOTAL BALANCE (CASH & BANK)
                    </div>
                    <div className="text-2xl font-bold text-[#D92D20] mt-1">Rs. -12,264.00</div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-600">
                          <Landmark className="w-3.5 h-3.5 text-slate-400" />
                          <span>Careplus Nepal Pvt Ltd</span>
                        </span>
                        <span className="font-bold text-slate-900">Rs. 1,341.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-600">
                          <Landmark className="w-3.5 h-3.5 text-slate-400" />
                          <span>Careplus Nepal Pvt Ltd</span>
                        </span>
                        <span className="font-bold text-[#D92D20]">Rs. -2,000.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-600">
                          <Landmark className="w-3.5 h-3.5 text-slate-400" />
                          <span>Bank Account</span>
                        </span>
                        <span className="font-bold text-[#D92D20]">Rs. -11,605.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-600">
                          <CircleDollarSign className="w-3.5 h-3.5 text-slate-400" />
                          <span>cash account</span>
                        </span>
                        <span className="font-bold text-slate-900">Rs. 0.00</span>
                      </div>
                    </div>
                  </div>

                  {/* PAYMENT REMINDERS */}
                  <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        PAYMENT REMINDERS
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-amber-700">1</span>
                      <span className="text-xs text-slate-400">none past terms yet</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Faiyaz Bhai - IT FLY</div>
                        <div className="text-[11px] text-slate-400">5d pending of 30d terms</div>
                      </div>
                      <div className="text-xs font-bold text-[#D92D20]">Rs. 11,750.00</div>
                    </div>

                    <button
                      onClick={() => setActiveSection('payment_reminders')}
                      className="mt-3 text-xs font-semibold text-[#058852] hover:underline cursor-pointer"
                    >
                      See all reminders
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: 4 Storefront KPI Cards (Revenue, Orders, Avg. Order Value, Total Users) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Revenue */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-slate-500 font-medium">Revenue</span>
                    <div className="w-8 h-8 rounded-lg bg-[#E6F4EC] text-[#058852] flex items-center justify-center">
                      <CircleDollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">Rs 9,54,400</div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Prev: Rs 2,980</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#E6F4EC] text-[#058852] text-[11px] font-bold">
                      ↗ +31926.8%
                    </span>
                  </div>
                </div>

                {/* Orders */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-slate-500 font-medium">Orders</span>
                    <div className="w-8 h-8 rounded-lg bg-[#E6F4EC] text-[#058852] flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{ Math.max(6, orders.length) }</div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Prev: 2</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#E6F4EC] text-[#058852] text-[11px] font-bold">
                      ↗ +200.0%
                    </span>
                  </div>
                </div>

                {/* Avg. Order Value */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-slate-500 font-medium">Avg. Order Value</span>
                    <div className="w-8 h-8 rounded-lg bg-[#E6F4EC] text-[#058852] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">Rs 1,59,066.67</div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Prev: Rs 1,490</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#E6F4EC] text-[#058852] text-[11px] font-bold">
                      ↗ +10575.6%
                    </span>
                  </div>
                </div>

                {/* Total Users */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-slate-500 font-medium">Total Users</span>
                    <div className="w-8 h-8 rounded-lg bg-[#E6F4EC] text-[#058852] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">21</div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Prev: 0 new</span>
                  </div>
                </div>
              </div>

              {/* Quick Product & Enterprise Shortcuts Banner */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E6F4EC] text-[#058852] flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Quick Product Studio, Multi-Price Engine & Wholesale B2B Portal
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Easily add new products with photos & stock, or configure 10-tier B2B price rules and invoices.
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveSection('inventory_products')}
                    className="px-3.5 py-2 rounded-lg bg-[#058852] hover:bg-[#047243] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Product Easily</span>
                  </button>
                  <button
                    onClick={() => setActiveSection('inventory_pricing')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Configure Multi-Price Matrix
                  </button>
                  <button
                    onClick={() => setActiveSection('sales_create_order')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Open Invoice Price Override Builder
                  </button>
                  <button
                    onClick={() => appStore.setCurrentView('wholesale')}
                    className="px-3 py-1.5 rounded-lg bg-[#095B9E] text-white text-xs font-semibold cursor-pointer"
                  >
                    Launch B2B Wholesale Portal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              1B. SIMPLE PRODUCT ADD & CATALOG MANAGER (`inventory_products`)
             ================================================================= */}
          {activeSection === 'inventory_products' && (
            <SimpleProductManager
              onNavigateSection={(sec, prodId) => {
                if (prodId) {
                  setSelectedProductIdForPricing(prodId);
                }
                setActiveSection(sec);
              }}
            />
          )}

          {/* =================================================================
              2. ADVANCED MULTI-PRICE ENGINE (`inventory_pricing`)
             ================================================================= */}
          {activeSection === 'inventory_pricing' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#058852]">
                    7. Advanced Multi-Price Engine
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Master Variant Pricing Matrix, Precedence & Floor Limits
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure MRP, Retail, Sale, Dealer, Distributor, Bulk Tiers, Customer-Specific Rates, Date-Bound Contracts, Tax Inclusion/Exclusion, and Floor Approval Limits.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Select Variant:</span>
                  <select
                    value={selectedProductIdForPricing}
                    onChange={(e) => setSelectedProductIdForPricing(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:border-[#058852]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.sku} — {p.name} ({p.packSize})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {pricingSaveBanner && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
                  <span>{pricingSaveBanner}</span>
                  <button onClick={() => setPricingSaveBanner(null)} className="underline">Dismiss</button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 8 Cols: Core Tiers, Floors, Tax & Bulk Tiers */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Core Price Tiers & Floor Limits */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        1. Core Price Tiers, Internal Floors & Tax Setting ({selectedProductForPricing.sku})
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        Variant: {selectedProductForPricing.packSize}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">MRP (Max Retail)</label>
                        <input
                          type="number"
                          value={currentPricingConfig.mrp}
                          onChange={(e) => {
                            const updated = { ...currentPricingConfig, mrp: Number(e.target.value) };
                            appStore.updateProductPricingConfig(selectedProductForPricing.id, updated, 'superadmin');
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Retail Price</label>
                        <input
                          type="number"
                          value={currentPricingConfig.retailPrice}
                          onChange={(e) => {
                            const updated = { ...currentPricingConfig, retailPrice: Number(e.target.value) };
                            appStore.updateProductPricingConfig(selectedProductForPricing.id, updated, 'superadmin');
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Sale / Promo Price</label>
                        <input
                          type="number"
                          value={currentPricingConfig.salePrice}
                          onChange={(e) => {
                            const updated = { ...currentPricingConfig, salePrice: Number(e.target.value) };
                            appStore.updateProductPricingConfig(selectedProductForPricing.id, updated, 'superadmin');
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-amber-700"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#058852] mb-1">Dealer Price (B2B)</label>
                        <input
                          type="number"
                          value={currentPricingConfig.dealerPrice}
                          onChange={(e) => {
                            const updated = { ...currentPricingConfig, dealerPrice: Number(e.target.value) };
                            appStore.updateProductPricingConfig(selectedProductForPricing.id, updated, 'superadmin');
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-emerald-300 bg-emerald-50/30 font-mono font-bold text-[#058852]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-blue-700 mb-1">Distributor Price</label>
                        <input
                          type="number"
                          value={currentPricingConfig.distributorPrice}
                          onChange={(e) => {
                            const updated = { ...currentPricingConfig, distributorPrice: Number(e.target.value) };
                            appStore.updateProductPricingConfig(selectedProductForPricing.id, updated, 'superadmin');
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-blue-50/30 font-mono font-bold text-blue-700"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-amber-800 mb-1">Staff Approval Limit</label>
                        <input
                          type="number"
                          value={currentPricingConfig.staffApprovalLimitPrice}
                          onChange={(e) => {
                            const updated = {
                              ...currentPricingConfig,
                              staffApprovalLimitPrice: Number(e.target.value)
                            };
                            appStore.updateProductPricingConfig(selectedProductForPricing.id, updated, 'superadmin');
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-amber-50/40 font-mono font-bold text-amber-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-red-700 mb-1">Internal Min Floor</label>
                        <input
                          type="number"
                          value={currentPricingConfig.internalMinPrice}
                          onChange={(e) => {
                            const updated = { ...currentPricingConfig, internalMinPrice: Number(e.target.value) };
                            appStore.updateProductPricingConfig(selectedProductForPricing.id, updated, 'superadmin');
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-red-300 bg-red-50/40 font-mono font-bold text-red-700"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Tax (13% VAT) Mode</label>
                        <select
                          value={currentPricingConfig.taxSetting}
                          onChange={(e) => {
                            const updated = {
                              ...currentPricingConfig,
                              taxSetting: e.target.value as TaxInclusionSetting
                            };
                            appStore.updateProductPricingConfig(selectedProductForPricing.id, updated, 'superadmin');
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-white"
                        >
                          <option value="inclusive">Tax Inclusive (13% VAT)</option>
                          <option value="exclusive">Tax Exclusive (+13% VAT)</option>
                        </select>
                      </div>
                    </div>

                    {/* Discount Stacking Mode */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-800">Discount Precedence & Stacking Rule:</span>
                        <span className="text-slate-500 ml-2">
                          Choose whether winning tier is mutually exclusive or allows a stackable volume rebate.
                        </span>
                      </div>
                      <select
                        value={currentPricingConfig.discountStackingMode}
                        onChange={(e) => {
                          const updated = {
                            ...currentPricingConfig,
                            discountStackingMode: e.target.value as DiscountStackingMode
                          };
                          appStore.updateProductPricingConfig(selectedProductForPricing.id, updated, 'superadmin');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 font-semibold bg-white"
                      >
                        <option value="MUTUALLY_EXCLUSIVE">Mutually Exclusive (Single Winning Price)</option>
                        <option value="EXPLICITLY_STACKABLE">Explicitly Stackable (+3% Volume Rebate on 25+)</option>
                      </select>
                    </div>
                  </div>

                  {/* Bulk Quantity Tiers */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">
                      2. Bulk Quantity Tiers (Volume Price Breaks)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentPricingConfig.bulkTiers.map((tier, idx) => (
                        <div key={tier.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                          <div className="font-bold text-slate-800">{tier.label}</div>
                          <div className="text-[11px] text-slate-500">
                            Min Qty: {tier.minQty} {tier.maxQty ? `to ${tier.maxQty}` : '+'} units
                          </div>
                          <div>
                            <label className="text-[10px] uppercase text-slate-400 block">Tier Unit Price (NPR)</label>
                            <input
                              type="number"
                              value={tier.unitPrice}
                              onChange={(e) => {
                                const nextTiers = [...currentPricingConfig.bulkTiers];
                                nextTiers[idx] = { ...tier, unitPrice: Number(e.target.value) };
                                appStore.updateProductPricingConfig(
                                  selectedProductForPricing.id,
                                  { ...currentPricingConfig, bulkTiers: nextTiers },
                                  'superadmin'
                                );
                              }}
                              className="w-full mt-1 px-2.5 py-1.5 rounded border border-slate-300 bg-white font-mono font-bold text-[#058852]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contract Prices with Effective Dates & Customer-Specific Prices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date-Bound Contract Prices */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        3. Contract Prices (With Effective Dates)
                      </h3>
                      <div className="space-y-2">
                        {currentPricingConfig.contractPrices.map((c) => (
                          <div key={c.id} className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs">
                            <div className="flex justify-between font-bold text-emerald-950">
                              <span>{c.contractCode}</span>
                              <span className="font-mono">Rs. {c.unitPrice}</span>
                            </div>
                            <div className="text-[11px] text-slate-600">{c.partyName}</div>
                            <div className="text-[10px] font-mono text-slate-500">
                              Valid: {c.effectiveFrom} → {c.effectiveTo}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                        <div className="font-semibold text-slate-700">+ Add Date-Effective Contract Rate</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newContractCode}
                            onChange={(e) => setNewContractCode(e.target.value)}
                            placeholder="Contract Code"
                            className="px-2.5 py-1.5 rounded border border-slate-300 font-mono text-xs"
                          />
                          <input
                            type="number"
                            value={newContractPrice}
                            onChange={(e) => setNewContractPrice(Number(e.target.value))}
                            placeholder="Unit Price"
                            className="px-2.5 py-1.5 rounded border border-slate-300 font-mono text-xs"
                          />
                          <input
                            type="date"
                            value={newContractFrom}
                            onChange={(e) => setNewContractFrom(e.target.value)}
                            className="px-2 py-1 rounded border border-slate-300 text-[11px]"
                          />
                          <input
                            type="date"
                            value={newContractTo}
                            onChange={(e) => setNewContractTo(e.target.value)}
                            className="px-2 py-1 rounded border border-slate-300 text-[11px]"
                          />
                        </div>
                        <select
                          value={newContractPartyId}
                          onChange={(e) => setNewContractPartyId(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                        >
                          {customers.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const party = customers.find((c) => c.id === newContractPartyId) || customers[0];
                            const updated = {
                              ...currentPricingConfig,
                              contractPrices: [
                                ...currentPricingConfig.contractPrices,
                                {
                                  id: `ctr-${Date.now()}`,
                                  contractCode: newContractCode,
                                  customerId: party.id,
                                  partyName: party.name,
                                  unitPrice: newContractPrice,
                                  effectiveFrom: newContractFrom,
                                  effectiveTo: newContractTo,
                                  isActive: true
                                }
                              ]
                            };
                            appStore.updateProductPricingConfig(selectedProductForPricing.id, updated, 'superadmin');
                            setPricingSaveBanner(`Added Contract ${newContractCode} for ${party.name} (Rs. ${newContractPrice})`);
                          }}
                          className="w-full py-1.5 rounded-lg bg-[#058852] text-white font-semibold cursor-pointer"
                        >
                          Save Contract Price Rule
                        </button>
                      </div>
                    </div>

                    {/* Customer-Specific Negotiated Prices */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        4. Customer-Specific Negotiated Prices
                      </h3>
                      <div className="space-y-2">
                        {currentPricingConfig.customerSpecificPrices.map((csp) => (
                          <div key={csp.id} className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-200 text-xs">
                            <div className="flex justify-between font-bold text-blue-950">
                              <span>{csp.customerName}</span>
                              <span className="font-mono">Rs. {csp.unitPrice}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">{csp.notes}</div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                        <div className="font-semibold text-slate-700">+ Assign Customer-Specific Price</div>
                        <select
                          value={newCspCustomerId}
                          onChange={(e) => setNewCspCustomerId(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                        >
                          {customers.map((c) => (
                            <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={newCspPrice}
                          onChange={(e) => setNewCspPrice(Number(e.target.value))}
                          placeholder="Negotiated Unit Price"
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                        />
                        <input
                          type="text"
                          value={newCspNotes}
                          onChange={(e) => setNewCspNotes(e.target.value)}
                          placeholder="Negotiation reason / reference"
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const party = customers.find((c) => c.id === newCspCustomerId) || customers[0];
                            const filtered = currentPricingConfig.customerSpecificPrices.filter(
                              (r) => r.customerId !== party.id
                            );
                            const updated = {
                              ...currentPricingConfig,
                              customerSpecificPrices: [
                                ...filtered,
                                {
                                  id: `csp-${Date.now()}`,
                                  customerId: party.id,
                                  customerName: party.name,
                                  unitPrice: newCspPrice,
                                  notes: newCspNotes,
                                  updatedAt: '2026-10-18'
                                }
                              ]
                            };
                            appStore.updateProductPricingConfig(selectedProductForPricing.id, updated, 'superadmin');
                            setPricingSaveBanner(`Saved Customer-Specific Price Rs. ${newCspPrice} for ${party.name}`);
                          }}
                          className="w-full py-1.5 rounded-lg bg-[#095B9E] text-white font-semibold cursor-pointer"
                        >
                          Save Customer-Specific Rate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 4 Cols: Documented 10-Level Price Precedence Specification */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 space-y-4 h-fit">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#058852]">
                      Server-Side Engine Specification
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Documented 10-Tier Price Precedence
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Evaluated top-to-bottom on every invoice line. Override never mutates master prices.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {PRICE_PRECEDENCE_DOCUMENTATION.map((step) => (
                      <div key={step.code} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            #{step.rank}. {step.title}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100/80 text-[#058852] font-mono text-[10px] font-bold">
                            {step.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              3. CUSTOMER GROUPS & SEPARATE PRICE LISTS (`inventory_groups`)
             ================================================================= */}
          {activeSection === 'inventory_groups' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Customer Groups */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 space-y-4 h-fit">
                <h2 className="text-base font-bold text-slate-900">Customer Groups</h2>
                <div className="space-y-2.5">
                  {customerGroups.map((g) => (
                    <div key={g.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{g.name}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#058852] font-mono text-[10px] font-bold">
                          {g.code}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{g.description}</p>
                      <div className="text-[11px] text-slate-600 pt-1">
                        Default Discount: <strong>{g.defaultDiscountPercent}%</strong> · Members: <strong>{g.memberCount}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2.5 text-xs">
                  <div className="font-bold text-slate-800">+ Create New Customer Group</div>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Group Name (e.g. Western Nepal Stockists)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newGroupCode}
                      onChange={(e) => setNewGroupCode(e.target.value)}
                      placeholder="Code (e.g. DIST-WEST)"
                      className="px-3 py-2 rounded-lg border border-slate-300 font-mono"
                    />
                    <input
                      type="number"
                      value={newGroupDiscount}
                      onChange={(e) => setNewGroupDiscount(Number(e.target.value))}
                      placeholder="Discount %"
                      className="px-3 py-2 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newGroupName.trim()) return;
                      appStore.addCustomerGroup(
                        {
                          id: `grp-${Date.now()}`,
                          name: newGroupName,
                          code: newGroupCode || 'GRP-NEW',
                          description: 'Custom B2B pricing group created by Admin',
                          defaultDiscountPercent: newGroupDiscount,
                          priceListId: selectedPriceListId,
                          memberCount: 1
                        },
                        'superadmin'
                      );
                      setNewGroupName('');
                      setNewGroupCode('');
                    }}
                    className="w-full py-2 rounded-lg bg-[#058852] text-white font-semibold cursor-pointer"
                  >
                    Create Customer Group
                  </button>
                </div>
              </div>

              {/* Separate Price Lists */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Separate Custom Price Lists</h2>
                    <p className="text-xs text-slate-500">
                      Assign custom unit rates per SKU for specific B2B customer groups.
                    </p>
                  </div>
                  <select
                    value={selectedPriceListId}
                    onChange={(e) => setSelectedPriceListId(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                  >
                    {customPriceLists.map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        {pl.name} ({pl.code})
                      </option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const activeList =
                    customPriceLists.find((pl) => pl.id === selectedPriceListId) || customPriceLists[0];
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                        <div>
                          <span className="font-bold text-slate-800">{activeList.name}</span>
                          <span className="ml-2 font-mono text-slate-500">
                            Valid: {activeList.effectiveFrom} → {activeList.effectiveTo || 'Ongoing'}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#058852] font-mono text-[10px] font-bold">
                          {activeList.discountStackingMode}
                        </span>
                      </div>

                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-400">
                            <th className="py-2">Product</th>
                            <th className="py-2 text-right">MRP</th>
                            <th className="py-2 text-right">Std Dealer</th>
                            <th className="py-2 text-right">Custom Price List Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {products.slice(0, 8).map((p) => {
                            const rate = activeList.productRates[p.id] ?? p.dealerPrice;
                            return (
                              <tr key={p.id}>
                                <td className="py-2.5 font-medium text-slate-800">
                                  {p.name} <span className="text-slate-400 font-mono">({p.sku})</span>
                                </td>
                                <td className="py-2.5 text-right font-mono text-slate-400">Rs. {p.mrp}</td>
                                <td className="py-2.5 text-right font-mono text-slate-600">Rs. {p.dealerPrice}</td>
                                <td className="py-2.5 text-right">
                                  <input
                                    type="number"
                                    value={rate}
                                    onChange={(e) => {
                                      const updatedList = {
                                        ...activeList,
                                        productRates: {
                                          ...activeList.productRates,
                                          [p.id]: Number(e.target.value)
                                        }
                                      };
                                      appStore.saveCustomPriceList(updatedList, 'superadmin');
                                    }}
                                    className="w-24 text-right px-2 py-1 rounded border border-emerald-300 bg-emerald-50/30 font-mono font-bold text-[#058852]"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* =================================================================
              4. INVOICE CREATION & AUTHORIZED PRICE OVERRIDE BUILDER (`sales_create_order`)
             ================================================================= */}
          {activeSection === 'sales_create_order' && (
            <div className="space-y-5">
              {/* Top Header & Staff Permission Simulator */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#058852]">
                    Multi-Price Invoice & Order Engine
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Create Order / Tax Invoice with Price Precedence & Override Controls
                  </h2>
                  <p className="text-xs text-slate-500">
                    Auto-selects the customer&apos;s eligible price, displays price source, validates price floors, requires override reason, and saves immutable price snapshots without modifying global catalog prices.
                  </p>
                </div>

                {/* Staff Role Switcher to test Floor & Approval workflow */}
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs">
                  <span className="px-2 font-semibold text-slate-600">Acting Staff Role:</span>
                  <button
                    type="button"
                    onClick={() => setSimulatedRole('super_admin')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      simulatedRole === 'super_admin'
                        ? 'bg-[#058852] text-white'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    SuperAdmin / Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulatedRole('pos_cashier')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      simulatedRole === 'pos_cashier'
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    Sales / POS Staff (Floor Restricted)
                  </button>
                </div>
              </div>

              {invoiceCreatedBanner && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#058852] shrink-0" />
                    <span>{invoiceCreatedBanner}</span>
                  </div>
                  <button
                    onClick={() => setActiveSection('sales_invoices')}
                    className="px-3 py-1 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
                  >
                    Inspect Immutable Snapshots →
                  </button>
                </div>
              )}

              {/* Customer, Channel & Date Selector */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
                <div className="lg:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Customer / Party (Auto-Resolves Eligible Price Tier)
                  </label>
                  <select
                    value={invCustomerId}
                    onChange={(e) => setInvCustomerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-white"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — [{c.type.toUpperCase()}] {c.dealerCode ? `(${c.dealerCode})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sales Channel</label>
                  <select
                    value={invChannel}
                    onChange={(e) => setInvChannel(e.target.value as OrderChannel)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-white"
                  >
                    <option value="wholesale">Wholesale B2B</option>
                    <option value="pos">Walk-In POS Clinic</option>
                    <option value="retail">Online Retail D2C</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Invoice Date (Contract Check)</label>
                  <input
                    type="date"
                    value={invDate}
                    onChange={(e) => setInvDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PO Reference / Payment</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={invPoRef}
                      onChange={(e) => setInvPoRef(e.target.value)}
                      placeholder="PO Ref"
                      className="w-1/2 px-2.5 py-2 rounded-lg border border-slate-300 font-mono"
                    />
                    <select
                      value={invPaymentMethod}
                      onChange={(e) => setInvPaymentMethod(e.target.value as typeof invPaymentMethod)}
                      className="w-1/2 px-2 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                    >
                      <option value="credit">Credit</option>
                      <option value="cash">Cash</option>
                      <option value="esewa">eSewa</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Invoice Line Items Table with Price Source, Override & Manager Approval */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Invoice Lines · Live Price Resolution & Floor Validation
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setInvLines((prev) => [
                        ...prev,
                        {
                          id: `line-${Date.now()}`,
                          productId: products[2]?.id || 'prod-cordyceps-yarsa',
                          quantity: 10,
                          manualOverridePrice: null,
                          overrideReason: '',
                          managerApproved: false,
                          showTrace: false
                        }
                      ])
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#058852] text-white text-xs font-semibold cursor-pointer"
                  >
                    + Add Line Item
                  </button>
                </div>

                <div className="divide-y divide-slate-200">
                  {resolvedInvLines.map(({ line, product, pricingConfig, resolution, isOverridden, needsManagerApproval, missingReason }, idx) => (
                    <div key={line.id} className="p-5 space-y-3">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center text-xs">
                        {/* Product Select */}
                        <div className="lg:col-span-3">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Line #{idx + 1} · Product Variant
                          </label>
                          <select
                            value={line.productId}
                            onChange={(e) => {
                              const next = [...invLines];
                              next[idx] = {
                                ...line,
                                productId: e.target.value,
                                manualOverridePrice: null,
                                overrideReason: '',
                                managerApproved: false
                              };
                              setInvLines(next);
                            }}
                            className="w-full px-2.5 py-2 rounded-lg border border-slate-300 font-semibold bg-white"
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.packSize})
                              </option>
                            ))}
                          </select>
                          <div className="text-[10px] font-mono text-slate-400 mt-1">
                            MRP: Rs.{pricingConfig.mrp} · Retail: Rs.{pricingConfig.retailPrice} · Dealer: Rs.{pricingConfig.dealerPrice} · Staff Limit: Rs.{pricingConfig.staffApprovalLimitPrice} · Floor: Rs.{pricingConfig.internalMinPrice}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="lg:col-span-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={line.quantity}
                            onChange={(e) => {
                              const next = [...invLines];
                              next[idx] = { ...line, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) };
                              setInvLines(next);
                            }}
                            className="w-full px-2.5 py-2 rounded-lg border border-slate-300 font-mono font-bold text-center"
                          />
                        </div>

                        {/* Auto-Selected Eligible Price & Source */}
                        <div className="lg:col-span-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Auto-Selected Price
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-[#058852] font-mono text-[10px] font-bold">
                              {resolution.autoSelectedSource}
                            </span>
                          </div>
                          <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">
                            Rs. {resolution.autoSelectedPrice.toLocaleString()}
                            <span className="text-[10px] font-normal text-slate-500 ml-1">
                              ({pricingConfig.taxSetting})
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate" title={resolution.autoSelectedLabel}>
                            {resolution.autoSelectedLabel}
                          </div>
                        </div>

                        {/* Authorized Unit Price Edit (Override Input) */}
                        <div className="lg:col-span-2">
                          <label className="text-[10px] uppercase font-bold text-slate-600 flex items-center justify-between mb-1">
                            <span>Final Unit Price</span>
                            {isOverridden && (
                              <button
                                type="button"
                                onClick={() => {
                                  const next = [...invLines];
                                  next[idx] = {
                                    ...line,
                                    manualOverridePrice: null,
                                    overrideReason: '',
                                    managerApproved: false
                                  };
                                  setInvLines(next);
                                }}
                                className="text-[10px] text-blue-600 underline cursor-pointer"
                              >
                                Reset to Auto
                              </button>
                            )}
                          </label>
                          <div className="relative">
                            <Edit3 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="number"
                              value={line.manualOverridePrice ?? resolution.autoSelectedPrice}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                const next = [...invLines];
                                next[idx] = {
                                  ...line,
                                  manualOverridePrice: Number.isNaN(val) ? 0 : val,
                                  managerApproved: false
                                };
                                setInvLines(next);
                              }}
                              className={`w-full pl-8 pr-2.5 py-2 rounded-lg border font-mono font-bold ${
                                isOverridden
                                  ? 'border-amber-400 bg-amber-50/50 text-amber-900'
                                  : 'border-slate-300 bg-white text-slate-900'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Line Total & Precedence Trace Toggle */}
                        <div className="lg:col-span-3 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Line Total (Incl. 13% VAT)
                            </span>
                            <span className="font-mono font-bold text-base text-[#058852]">
                              Rs. {resolution.lineTotalInclTax.toLocaleString()}
                            </span>
                            <span className="block text-[10px] font-mono text-slate-400">
                              Net: Rs.{resolution.lineSubtotalExclTax} + VAT: Rs.{resolution.lineTaxAmount}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...invLines];
                                next[idx] = { ...line, showTrace: !line.showTrace };
                                setInvLines(next);
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-600 cursor-pointer"
                            >
                              {line.showTrace ? 'Hide Trace' : 'Price Trace'}
                            </button>
                            {invLines.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setInvLines(invLines.filter((l) => l.id !== line.id))}
                                className="px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Override Governance Bar: Mandatory Reason, Floor Validation & Manager Approval */}
                      {isOverridden && (
                        <div
                          className={`p-3.5 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-3 ${
                            needsManagerApproval || missingReason
                              ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                              : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                          }`}
                        >
                          <div className="flex-1 min-w-[260px] space-y-1">
                            <div className="flex items-center gap-2 font-bold">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>
                                Invoice-Time Price Override: Auto Rs. {resolution.autoSelectedPrice} ({resolution.autoSelectedSource}) → Final Rs. {resolution.finalUnitPrice}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-600">
                                Global Catalog Price (Rs. {pricingConfig.dealerPrice}) Remains Untouched
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              <input
                                type="text"
                                value={line.overrideReason}
                                onChange={(e) => {
                                  const next = [...invLines];
                                  next[idx] = { ...line, overrideReason: e.target.value };
                                  setInvLines(next);
                                }}
                                placeholder="Required: Enter override reason (e.g. Hospital tender match, damaged outer box)..."
                                className="flex-1 min-w-[260px] px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs"
                              />

                              {resolution.breachesInternalFloor && (
                                <span className="px-2 py-1 rounded bg-red-100 text-red-800 font-bold text-[11px]">
                                  ⚠ Below Internal Floor (Rs. {pricingConfig.internalMinPrice})
                                </span>
                              )}
                              {!resolution.breachesInternalFloor && resolution.requiresManagerApproval && (
                                <span className="px-2 py-1 rounded bg-amber-200/80 text-amber-900 font-bold text-[11px]">
                                  Below Staff Limit (Rs. {pricingConfig.staffApprovalLimitPrice}) — Manager Approval Required
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Manager Approval Action */}
                          <div>
                            {line.managerApproved ? (
                              <div className="px-3 py-1.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-bold">
                                ✓ Approved by {line.approvedByManagerName} ({line.approvedTimestamp})
                              </div>
                            ) : needsManagerApproval ? (
                              <div className="flex items-center gap-2">
                                {approvingLineId === line.id ? (
                                  <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-amber-300">
                                    <input
                                      type="password"
                                      value={managerPinInput}
                                      onChange={(e) => setManagerPinInput(e.target.value)}
                                      placeholder="Manager PIN"
                                      className="w-20 px-2 py-1 rounded border border-slate-300 font-mono text-xs"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nowStr = new Date().toLocaleString('en-GB', {
                                          timeZone: 'Asia/Kathmandu'
                                        });
                                        const next = [...invLines];
                                        next[idx] = {
                                          ...line,
                                          managerApproved: true,
                                          approvedByManagerName: 'Suman Vaidya (superadmin)',
                                          approvedTimestamp: nowStr
                                        };
                                        setInvLines(next);
                                        setApprovingLineId(null);
                                      }}
                                      className="px-2.5 py-1 rounded bg-[#058852] text-white font-bold text-xs cursor-pointer"
                                    >
                                      Confirm PIN
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setApprovingLineId(line.id)}
                                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
                                  >
                                    Request / Grant Manager Approval
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-800">
                                Within Authorized Staff Limit
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Expandable Precedence Trace */}
                      {line.showTrace && (
                        <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono space-y-1">
                          <div className="text-emerald-400 font-bold mb-1">
                            Server-Side Multi-Price Precedence Trace for {product.sku} (Qty: {line.quantity}):
                          </div>
                          {resolution.precedenceTrace.map((t, tidx) => (
                            <div key={tidx} className="flex items-center justify-between py-0.5 border-b border-slate-800">
                              <span>
                                [{t.eligible ? 'ELIGIBLE' : 'SKIPPED'}] {t.source} — {t.label}: {t.reason}
                              </span>
                              <span className="text-emerald-300 font-bold">
                                {t.candidatePrice !== undefined ? `Rs. ${t.candidatePrice}` : '-'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Invoice Footer Summary & Finalize Button */}
                <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 max-w-md">
                    <strong className="text-slate-800">Immutable Snapshot Guarantee:</strong> Finalizing this invoice records a permanent snapshot of MRP, Retail, Dealer, Auto-Selected Price, Final Price, Override Reason, and Approving Manager on every line item.
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right text-xs">
                      <div className="text-slate-500">
                        Taxable Subtotal: <span className="font-mono font-bold text-slate-800">Rs. {invSubtotalExcl.toLocaleString()}</span>
                      </div>
                      <div className="text-slate-500">
                        Nepal VAT (13%): <span className="font-mono font-bold text-slate-800">Rs. {invTaxTotal.toLocaleString()}</span>
                      </div>
                      <div className="text-base font-bold text-slate-900 mt-0.5">
                        Grand Total: <span className="font-mono text-[#058852]">Rs. {invGrandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={hasBlockingOverrideIssue}
                      onClick={handleFinalizeInvoice}
                      className="px-5 py-3 rounded-xl bg-[#058852] hover:bg-[#047243] disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-sm cursor-pointer"
                    >
                      {hasBlockingOverrideIssue
                        ? 'Complete Override Reason / Manager Approval First'
                        : 'Finalize Invoice & Lock Price Snapshots'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              5. B2B QUOTATIONS & NEGOTIATION DESK (`sales_quotations`)
             ================================================================= */}
          {activeSection === 'sales_quotations' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <h2 className="text-base font-bold text-slate-900">
                  Wholesale B2B Quotation Requests & Rate Negotiations
                </h2>
                <p className="text-xs text-slate-500">
                  Review bulk quotation requests from approved dealers, set negotiated unit rates, and publish back to their Wholesale Customer Portal.
                </p>
              </div>

              {quotations.map((qtn) => (
                <div key={qtn.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{qtn.quotationNumber}</span>
                        <span className="text-xs font-bold text-[#058852]">{qtn.customerName}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase">
                          {qtn.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        PO Ref: {qtn.poReferenceNumber || 'N/A'} · Attachment: {qtn.poAttachmentName || 'None'} · Created: {qtn.createdAt}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const negotiatedLines = qtn.lines.map((l) => ({
                          productId: l.productId,
                          negotiatedUnitPrice:
                            negotiationPrices[`${qtn.id}-${l.productId}`] ??
                            l.negotiatedUnitPrice ??
                            l.requestedUnitPrice
                        }));
                        appStore.updateQuotationNegotiation(
                          qtn.id,
                          negotiatedLines,
                          negotiationNote,
                          'Suman Vaidya (superadmin)'
                        );
                      }}
                      className="px-4 py-2 rounded-lg bg-[#058852] hover:bg-[#047243] text-white text-xs font-bold cursor-pointer"
                    >
                      Publish Negotiated Quotation to Dealer Portal
                    </button>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400">
                        <th className="py-2">Product</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Std Dealer Rate</th>
                        <th className="py-2 text-right">Dealer Requested</th>
                        <th className="py-2 text-right">Admin Negotiated Unit Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {qtn.lines.map((l) => {
                        const key = `${qtn.id}-${l.productId}`;
                        const currentVal =
                          negotiationPrices[key] ?? l.negotiatedUnitPrice ?? l.requestedUnitPrice;
                        return (
                          <tr key={l.productId}>
                            <td className="py-2.5 font-medium">{l.productName} ({l.packSize})</td>
                            <td className="py-2.5 text-center font-mono font-bold">{l.quantity}</td>
                            <td className="py-2.5 text-right font-mono text-slate-500">Rs. {l.standardDealerPrice}</td>
                            <td className="py-2.5 text-right font-mono text-amber-700 font-bold">Rs. {l.requestedUnitPrice}</td>
                            <td className="py-2.5 text-right">
                              <input
                                type="number"
                                value={currentVal}
                                onChange={(e) =>
                                  setNegotiationPrices((prev) => ({
                                    ...prev,
                                    [key]: Number(e.target.value)
                                  }))
                                }
                                className="w-28 text-right px-2.5 py-1 rounded border border-emerald-300 bg-emerald-50/40 font-mono font-bold text-[#058852]"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {/* =================================================================
              6. COMPLETED INVOICES & IMMUTABLE PRICE SNAPSHOTS (`sales_invoices`)
             ================================================================= */}
          {activeSection === 'sales_invoices' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Completed Invoices & Immutable Line-Item Price Snapshots
                  </h2>
                  <p className="text-xs text-slate-500">
                    Every completed order line stores an immutable snapshot of MRP, Retail, Dealer, Auto-Resolved Price, Final Price, Override Reason, and Approving Staff.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection('sales_create_order')}
                  className="px-3.5 py-2 rounded-lg bg-[#058852] text-white text-xs font-semibold cursor-pointer"
                >
                  + Create New Invoice
                </button>
              </div>

              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-sm text-slate-900">{order.invoiceNumber}</span>
                        <span className="text-xs font-semibold text-slate-700">{order.customerName}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#058852] text-[10px] font-bold uppercase">
                          {order.channel}
                        </span>
                        {order.poReferenceNumber && (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                            PO: {order.poReferenceNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Created: {new Date(order.createdAt).toLocaleString()} · Total: Rs. {order.totalAmount.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.irdCbmsSynced ? (
                        <span className="px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#058852] font-mono text-[11px] font-bold">
                          ✓ {order.irdFiscalSignature}
                        </span>
                      ) : (
                        <button
                          onClick={() => appStore.syncOrderWithIrdCbms(order.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#095B9E] hover:bg-[#07477B] text-white text-xs font-semibold cursor-pointer"
                        >
                          Sync IRD CBMS
                        </button>
                      )}
                      <button
                        onClick={() => appStore.setTaxInvoiceOrder(order)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Print Tax Invoice</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                          <th className="py-1.5">Line Item</th>
                          <th className="py-1.5">Qty</th>
                          <th className="py-1.5">Snapshot MRP / Dealer</th>
                          <th className="py-1.5">Auto-Resolved Price</th>
                          <th className="py-1.5">Final Locked Price</th>
                          <th className="py-1.5">Override & Approval Audit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {order.items.map((item, i) => {
                          const snap = item.priceSnapshot;
                          return (
                            <tr key={i}>
                              <td className="py-2.5 font-medium text-slate-800">{item.productName}</td>
                              <td className="py-2.5 font-mono">{item.quantity}</td>
                              <td className="py-2.5 font-mono text-[11px] text-slate-500">
                                {snap ? `MRP Rs.${snap.mrpAtSale} · Dlr Rs.${snap.dealerPriceAtSale}` : '-'}
                              </td>
                              <td className="py-2.5 font-mono text-[11px]">
                                {snap ? (
                                  <span>
                                    Rs.{snap.autoSelectedPrice} <span className="text-slate-400">({snap.autoSelectedSource})</span>
                                  </span>
                                ) : (
                                  `Rs.${item.unitPrice}`
                                )}
                              </td>
                              <td className="py-2.5 font-mono font-bold text-[#058852]">
                                Rs. {item.unitPrice} ({snap?.finalPriceSource || 'RETAIL_PRICE'})
                              </td>
                              <td className="py-2.5 text-[11px]">
                                {snap?.isOverridden ? (
                                  <div className="text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                                    <div><strong>Reason:</strong> {snap.overrideReason}</div>
                                    <div className="text-[10px] text-slate-500">
                                      By: {snap.overriddenByStaffName} · Approved: {snap.approvedByManagerName || 'Staff Limit'} ({snap.capturedAt})
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">Standard Auto-Resolved (No Override)</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =================================================================
              7–15. FULL INTERACTIVE ENTERPRISE ERP BACKEND MODULES
             ================================================================= */}
          <AdminErpModules activeSection={activeSection} setActiveSection={setActiveSection} />
        </main>
      </div>
    </div>
  );
};
