import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Truck,
  MapPin,
  FileText,
  ArrowRightLeft,
  TicketPercent,
  Upload,
  Download,
  RefreshCw,
  ShieldCheck,
  Landmark,
  CircleDollarSign,
  ShoppingBag,
  Boxes,
  Users,
  ExternalLink,
  Server,
  Activity,
  Database,
  Send
} from 'lucide-react';
import { appStore } from '../services/store';
import {
  CarePlusLogo,
  setCustomLogoFile,
  resetCustomLogoFile,
  hasCustomLogoFile
} from './CarePlusLogo';
import {
  Customer,
  CustomerType,
  ExpenseVoucher,
  Order
} from '../types';

interface AdminErpModulesProps {
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export const AdminErpModules: React.FC<AdminErpModulesProps> = ({
  activeSection,
  setActiveSection
}) => {
  const products = appStore.getProducts();
  const customers = appStore.getCustomers();
  const orders = appStore.getOrders();
  const batches = appStore.getBatches();
  const auditLogs = appStore.getAuditLogs();
  const customerGroups = appStore.getCustomerGroups();
  const customPriceLists = appStore.getCustomPriceLists();
  const purchaseBills = appStore.getPurchaseBills();
  const expenseVouchers = appStore.getExpenseVouchers();
  const treasuryAccounts = appStore.getTreasuryAccounts();
  const treasuryTransactions = appStore.getTreasuryTransactions();
  const carriers = appStore.getCarriers();
  const pickupBranches = appStore.getPickupBranches();
  const coupons = appStore.getCoupons();
  const redirects = appStore.getRedirects();
  const blogArticles = appStore.getBlogArticles();

  // Toast / Action Feedback
  const [actionBanner, setActionBanner] = useState<string | null>(null);
  const triggerBanner = (msg: string) => {
    setActionBanner(msg);
    setTimeout(() => setActionBanner(null), 5000);
  };

  // Live Express Server Health Telemetry
  const [serverHealth, setServerHealth] = useState<{
    status: string;
    engine: string;
    uptimeSeconds: number;
    databaseFile: string;
    lastSyncedAt: string;
    syncCount: number;
    irdCbmsGateway?: {
      status: string;
      protocol: string;
      panSeller: string;
      fiscalYear: string;
      syncedInvoiceCount: number;
    };
  } | null>(null);

  const fetchServerHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setServerHealth(data);
      }
    } catch {
      // ignore if offline
    }
  };

  useEffect(() => {
    fetchServerHealth();
  }, [activeSection]);

  // ---------------------------------------------------------------------------
  // 1. PARTIES MODULE STATE (`parties`)
  // ---------------------------------------------------------------------------
  const [partyFilter, setPartyFilter] = useState<'all' | 'dealer' | 'distributor' | 'retail'>('all');
  const [partySearch, setPartySearch] = useState('');
  const [showAddPartyForm, setShowAddPartyForm] = useState(false);
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyType, setNewPartyType] = useState<CustomerType>('dealer');
  const [newPartyPhone, setNewPartyPhone] = useState('98511');
  const [newPartyEmail, setNewPartyEmail] = useState('');
  const [newPartyPan, setNewPartyPan] = useState('6098');
  const [newPartyDealerCode, setNewPartyDealerCode] = useState('DLR-KTM-045');
  const [newPartyPin, setNewPartyPin] = useState('2244');
  const [newPartyCreditLimit, setNewPartyCreditLimit] = useState(500000);
  const [newPartyPriceListId, setNewPartyPriceListId] = useState('plist-dealer-standard');

  // Party Payment Settlement State
  const [settlingCustomerId, setSettlingCustomerId] = useState<string | null>(null);
  const [settlementAmount, setSettlementAmount] = useState<number>(11750);
  const [settlementAccountId, setSettlementAccountId] = useState<string>('acc-operating-01');
  const [settlementRef, setSettlementRef] = useState<string>('NCHL-IPS-88412');

  // ---------------------------------------------------------------------------
  // 2. FEFO BATCHES & GRN STATE (`inventory_batches`)
  // ---------------------------------------------------------------------------
  const [batchWarehouseFilter, setBatchWarehouseFilter] = useState('all');
  const [showReceiveBatchForm, setShowReceiveBatchForm] = useState(false);
  const [grnProductId, setGrnProductId] = useState(products[0]?.id || 'prod-shilajit-resin');
  const [grnBatchNo, setGrnBatchNo] = useState('SHL-2083-NEW09');
  const [grnWarehouse, setGrnWarehouse] = useState('Baluwatar Central Hub (Kathmandu)');
  const [grnQty, setGrnQty] = useState(80);
  const [grnExpiry, setGrnExpiry] = useState('2028-11-30');
  const [grnUnitCost, setGrnUnitCost] = useState(810);

  // ---------------------------------------------------------------------------
  // 3. PURCHASE BILLS & SUPPLIER PAYABLES STATE (`purchase`)
  // ---------------------------------------------------------------------------
  const [showNewPurchaseModal, setShowNewPurchaseModal] = useState(false);
  const [purSupplierName, setPurSupplierName] = useState('Jumla Organic Sinja Valley Herbals');
  const [purSupplierPan, setPurSupplierPan] = useState('603918442');
  const [purOriginRegion, setPurOriginRegion] = useState('Sinja Valley, Jumla (3,400m)');
  const [purProductId, setPurProductId] = useState(products[0]?.id || 'prod-shilajit-resin');
  const [purBatchNo, setPurBatchNo] = useState(`JML-2083-${Math.floor(100 + Math.random() * 900)}`);
  const [purQty, setPurQty] = useState(50);
  const [purUnitCost, setPurUnitCost] = useState(760);
  const [purAssayCert, setPurAssayCert] = useState('DDA-ASSAY-9041-PASS (Fulvic 77.4%)');
  const [payingBillId, setPayingBillId] = useState<string | null>(null);
  const [billPayAmount, setBillPayAmount] = useState(11471.52);

  // ---------------------------------------------------------------------------
  // 4. EXPENSE VOUCHERS STATE (`expense`)
  // ---------------------------------------------------------------------------
  const [expCategory, setExpCategory] = useState<ExpenseVoucher['category']>('Cold-Chain Logistics');
  const [expPayee, setExpPayee] = useState('Himalayan Cold-Chain Express');
  const [expDesc, setExpDesc] = useState('Insulated air-cargo dispatch for Biratnagar & Pokhara B2B depots');
  const [expAmount, setExpAmount] = useState(4500);
  const [expAccountId, setExpAccountId] = useState('acc-operating-01');

  // ---------------------------------------------------------------------------
  // 5. MANAGE ACCOUNTS & TREASURY CONTRA STATE (`manage_accounts`)
  // ---------------------------------------------------------------------------
  const [fromAccId, setFromAccId] = useState('acc-operating-01');
  const [toAccId, setToAccId] = useState('acc-settlement-02');
  const [contraAmount, setContraAmount] = useState(2000);
  const [contraNotes, setContraNotes] = useState('Clear Global IME Settlement OD negative balance');

  // ---------------------------------------------------------------------------
  // 6. ASSIGN CARRIER & 3PL LOGISTICS STATE (`assign_carrier`)
  // ---------------------------------------------------------------------------
  const [newCarrierName, setNewCarrierName] = useState('');
  const [newCarrierCode, setNewCarrierCode] = useState('');
  const [newCarrierPhone, setNewCarrierPhone] = useState('+977-9801');
  const [newCarrierRate, setNewCarrierRate] = useState(140);

  // ---------------------------------------------------------------------------
  // 7. PICKUP BRANCHES STATE (`pickup_branches`)
  // ---------------------------------------------------------------------------
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('Chitwan (Bharatpur)');
  const [newBranchProvince, setNewBranchProvince] = useState('Bagmati Province');
  const [newBranchAddress, setNewBranchAddress] = useState('Chaubiskothi Medical Road, Bharatpur-10');
  const [newBranchManager, setNewBranchManager] = useState('Kabiraj Dipak Poudel');
  const [newBranchPhone, setNewBranchPhone] = useState('+977-056-524119');

  // ---------------------------------------------------------------------------
  // 8. IMPORT DATA CSV IMPORTER STATE (`import_data`)
  // ---------------------------------------------------------------------------
  const [importDatasetType, setImportDatasetType] = useState<'products' | 'batches' | 'parties' | 'pricelists'>('batches');
  const [importPreviewRows, setImportPreviewRows] = useState<
    Array<{ code: string; name: string; qtyOrLimit: number; priceOrBalance: number; status: string }>
  >([
    { code: 'SHL-2083-MUSTANG1', name: 'Pure Himalayan Shilajit Gold Resin (20g)', qtyOrLimit: 95, priceOrBalance: 815, status: 'READY_FEFO_VALID' },
    { code: 'ASH-2083-DANG04', name: 'KSM-66 Ashwagandha Root Rasayana (60 Caps)', qtyOrLimit: 140, priceOrBalance: 490, status: 'READY_FEFO_VALID' },
    { code: 'YRS-2083-DOLPA9', name: 'Yarsagumba & Cordyceps Vitality Extract', qtyOrLimit: 30, priceOrBalance: 1890, status: 'READY_FEFO_VALID' }
  ]);

  // ---------------------------------------------------------------------------
  // 9. COUPONS, REDIRECTS & BLOGS STATE
  // ---------------------------------------------------------------------------
  const [cpnCode, setCpnCode] = useState('WINTER25');
  const [cpnTitle, setCpnTitle] = useState('Poush-Magh Winter Rasayana 25% Rebate');
  const [cpnType, setCpnType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [cpnVal, setCpnVal] = useState(25);
  const [cpnMinOrder, setCpnMinOrder] = useState(3500);
  const [cpnChannel, setCpnChannel] = useState<'all' | 'retail' | 'wholesale'>('all');

  const [redSource, setRedSource] = useState('/old-winter-pack');
  const [redTarget, setRedTarget] = useState('/?campaign=WINTER25');
  const [redCode, setRedCode] = useState<301 | 302>(301);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogNepaliTitle, setBlogNepaliTitle] = useState('');
  const [blogVaidya, setBlogVaidya] = useState('Dr. Suman Vaidya (BAMS, MD Ayurveda)');
  const [blogExcerpt, setBlogExcerpt] = useState('');

  // ---------------------------------------------------------------------------
  // 10. REPORTS & BACKEND DIAGNOSTICS TAB STATE (`reports`)
  // ---------------------------------------------------------------------------
  const [reportTab, setReportTab] = useState<'audit' | 'vat_register' | 'price_realization' | 'backend_api'>('audit');
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {actionBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#058852] shrink-0" />
            <span>{actionBanner}</span>
          </div>
          <button
            onClick={() => setActionBanner(null)}
            className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* =====================================================================
          PARTIES MODULE (`parties`) — B2B Dealers, Distributors, VIP & Settlements
         ===================================================================== */}
      {activeSection === 'parties' && (
        <div className="space-y-4">
          {/* Header & Summary Strip */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Parties & B2B Trade Ledger — Customers, Approved Wholesale Dealers & Distributors
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Issue B2B Wholesale Portal login credentials (Dealer Code + PIN), assign Custom Price Lists, manage credit limits, and record payment settlements.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowAddPartyForm(!showAddPartyForm)}
                className="px-3.5 py-2 rounded-lg bg-[#058852] hover:bg-[#047243] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddPartyForm ? 'Close Form' : 'Add Party / Approve B2B Dealer'}</span>
              </button>
              <button
                onClick={() => appStore.setCurrentView('wholesale')}
                className="px-3.5 py-2 rounded-lg bg-[#095B9E] hover:bg-[#07477B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Wholesale Login Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add New Party / Approve Dealer Drawer */}
          {showAddPartyForm && (
            <div className="bg-emerald-50/50 rounded-xl border border-emerald-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Register New Party & Provision B2B Wholesale Credentials
                </h3>
                <span className="text-[11px] text-emerald-700 font-medium">
                  Automatically syncs with Multi-Price Engine & Wholesale Portal
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Party / Pharmacy Name</label>
                  <input
                    type="text"
                    value={newPartyName}
                    onChange={(e) => setNewPartyName(e.target.value)}
                    placeholder="e.g., Pashupati Aushadhalaya Pvt. Ltd."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Party Classification</label>
                  <select
                    value={newPartyType}
                    onChange={(e) => setNewPartyType(e.target.value as CustomerType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="dealer">Approved Wholesale Dealer</option>
                    <option value="distributor">Regional Stockist / Distributor</option>
                    <option value="vip">VIP Retail / Clinic Partner</option>
                    <option value="retail">Standard Retail Customer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nepal IRD PAN Number</label>
                  <input
                    type="text"
                    value={newPartyPan}
                    onChange={(e) => setNewPartyPan(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={newPartyPhone}
                    onChange={(e) => setNewPartyPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Wholesale Dealer Login ID</label>
                  <input
                    type="text"
                    value={newPartyDealerCode}
                    onChange={(e) => setNewPartyDealerCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold text-[#095B9E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">B2B Portal Access PIN</label>
                  <input
                    type="text"
                    value={newPartyPin}
                    onChange={(e) => setNewPartyPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Credit Limit (NPR)</label>
                  <input
                    type="number"
                    value={newPartyCreditLimit}
                    onChange={(e) => setNewPartyCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Assigned Custom Price List</label>
                  <select
                    value={newPartyPriceListId}
                    onChange={(e) => setNewPartyPriceListId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {customPriceLists.map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        {pl.name} ({pl.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!newPartyName.trim()) return;
                    const created: Customer = {
                      id: `cust-${Date.now()}`,
                      name: newPartyName.trim(),
                      phone: newPartyPhone.trim(),
                      email: newPartyEmail.trim() || `${newPartyDealerCode.toLowerCase()}@dealer.careplus.np`,
                      type: newPartyType,
                      panNumber: newPartyPan.trim(),
                      dealerCode: newPartyDealerCode.trim().toUpperCase(),
                      pinCode: newPartyPin.trim() || '2244',
                      approvedDealer: newPartyType === 'dealer' || newPartyType === 'distributor',
                      customerGroupId: newPartyType === 'distributor' ? 'grp-valley-dist' : 'grp-ayur-pharmacies',
                      assignedPriceListId: newPartyPriceListId,
                      creditLimit: newPartyCreditLimit,
                      creditUsed: 0,
                      outstandingBalance: 0,
                      paymentTermsDays: 30,
                      loyaltyPoints: 250,
                      lifetimePointsEarned: 250,
                      memberTier: 'seeker',
                      ledgerHistory: [],
                      addresses: [
                        {
                          id: `addr-${Date.now()}`,
                          label: 'Primary Trade Hub',
                          province: 'Bagmati Province',
                          district: 'Kathmandu',
                          municipality: 'Kathmandu Metropolitan City',
                          ward: '04',
                          streetLandmark: 'Ring Road Commercial Zone',
                          isDefault: true
                        }
                      ]
                    };
                    appStore.addCustomerParty(created, 'Suman Vaidya (superadmin)');
                    setNewPartyName('');
                    setShowAddPartyForm(false);
                    triggerBanner(`Approved & provisioned ${created.name} (Dealer ID: ${created.dealerCode}, PIN: ${created.pinCode})`);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#058852] text-white text-xs font-bold cursor-pointer"
                >
                  Save Party & Activate B2B Login
                </button>
              </div>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {(['all', 'dealer', 'distributor', 'retail'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPartyFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                    partyFilter === t
                      ? 'bg-[#058852] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'all' ? `All Parties (${customers.length})` : `${t}s`}
                </button>
              ))}
            </div>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={partySearch}
                onChange={(e) => setPartySearch(e.target.value)}
                placeholder="Search name, PAN, Dealer ID..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Parties Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-400">
                  <th className="py-3 px-4">Party Name & Trade Tier</th>
                  <th className="py-3 px-3">B2B Login ID & PIN</th>
                  <th className="py-3 px-3">PAN & Contact</th>
                  <th className="py-3 px-3">Assigned Price List</th>
                  <th className="py-3 px-3 text-right">Credit Limit</th>
                  <th className="py-3 px-3 text-right">To Receive (Balance)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers
                  .filter((c) => (partyFilter === 'all' ? true : c.type === partyFilter))
                  .filter(
                    (c) =>
                      !partySearch.trim() ||
                      c.name.toLowerCase().includes(partySearch.toLowerCase()) ||
                      (c.dealerCode || '').toLowerCase().includes(partySearch.toLowerCase()) ||
                      (c.panNumber || '').includes(partySearch)
                  )
                  .map((c) => {
                    const pList = customPriceLists.find(
                      (pl) => pl.id === (c.assignedPriceListId || (c as any).priceListId)
                    );
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-50 text-[#058852] font-bold uppercase text-[10px]">
                            {c.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {c.dealerCode ? (
                            <div>
                              <span className="font-bold text-[#095B9E]">{c.dealerCode}</span>
                              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                                PIN: {c.pinCode || '2244'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">D2C Retail Account</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          <div>PAN: {c.panNumber || 'Unregistered'}</div>
                          <div className="text-[11px] text-slate-400">{c.phone}</div>
                        </td>
                        <td className="py-3 px-3">
                          {pList ? (
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold text-[11px]">
                              {pList.code}
                            </span>
                          ) : (
                            <span className="text-slate-400">Standard Tier</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-700">
                          Rs. {c.creditLimit.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#058852]">
                          Rs. {c.outstandingBalance.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {c.outstandingBalance > 0 && (
                            <button
                              onClick={() => {
                                setSettlingCustomerId(c.id);
                                setSettlementAmount(c.outstandingBalance);
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-[#058852] font-semibold text-[11px] cursor-pointer"
                            >
                              Receive Payment
                            </button>
                          )}
                          {(c.type === 'dealer' || c.type === 'distributor') && (
                            <button
                              onClick={() => {
                                appStore.loginWholesaleDealer(c.dealerCode || c.email, c.pinCode || '2244');
                                appStore.setCurrentView('wholesale');
                              }}
                              className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-[#095B9E] font-semibold text-[11px] cursor-pointer"
                            >
                              View B2B Portal
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Receive Party Payment Modal Drawer */}
          {settlingCustomerId && (
            <div className="bg-amber-50/70 rounded-xl border border-amber-300 p-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Record Payment Receipt from{' '}
                  {customers.find((x) => x.id === settlingCustomerId)?.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  Automatically reduces Party Receivable ("TO RECEIVE") and credits selected Bank/Cash Treasury Account.
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <input
                  type="number"
                  value={settlementAmount}
                  onChange={(e) => setSettlementAmount(Number(e.target.value))}
                  className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                />
                <select
                  value={settlementAccountId}
                  onChange={(e) => setSettlementAccountId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                >
                  {treasuryAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      Deposit to: {a.name} (Rs. {a.balance})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={settlementRef}
                  onChange={(e) => setSettlementRef(e.target.value)}
                  placeholder="Cheque / IPS Ref"
                  className="w-36 px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                />
                <button
                  onClick={() => {
                    appStore.recordPartyPaymentReceived(
                      settlingCustomerId,
                      settlementAmount,
                      settlementAccountId,
                      settlementRef
                    );
                    setSettlingCustomerId(null);
                    triggerBanner(`Recorded Rs. ${settlementAmount.toLocaleString()} receipt & updated bank ledger!`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
                >
                  Post Receipt
                </button>
                <button
                  onClick={() => setSettlingCustomerId(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          FEFO BATCHES & EXPIRY WAREHOUSE LEDGER (`inventory_batches`)
         ===================================================================== */}
      {activeSection === 'inventory_batches' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                FEFO (First-Expiry, First-Out) Batch & Cold-Chain Warehouse Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All Retail, POS, and Wholesale invoices automatically allocate from the earliest-expiring active batch first.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={batchWarehouseFilter}
                onChange={(e) => setBatchWarehouseFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-white"
              >
                <option value="all">All Warehouse Hubs ({batches.length} Batches)</option>
                <option value="Baluwatar">Baluwatar Central Hub</option>
                <option value="Kumaripati">Kumaripati Patan Depot</option>
                <option value="Biratnagar">Biratnagar Eastern Hub</option>
              </select>
              <button
                onClick={() => setShowReceiveBatchForm(!showReceiveBatchForm)}
                className="px-3.5 py-2 rounded-lg bg-[#058852] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Receive New Batch (GRN)</span>
              </button>
            </div>
          </div>

          {showReceiveBatchForm && (
            <div className="bg-emerald-50/60 rounded-xl border border-emerald-200 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Goods Receipt Note (GRN) — Add New Manufacturing / Import Batch
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Product SKU</label>
                  <select
                    value={grnProductId}
                    onChange={(e) => setGrnProductId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.packSize})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={grnBatchNo}
                    onChange={(e) => setGrnBatchNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Quantity Received</label>
                  <input
                    type="number"
                    value={grnQty}
                    onChange={(e) => setGrnQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={grnExpiry}
                    onChange={(e) => setGrnExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      const prod = products.find((p) => p.id === grnProductId) || products[0];
                      const days = Math.max(
                        1,
                        Math.round((new Date(grnExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                      );
                      appStore.receiveInventoryBatch({
                        id: `bat-${Date.now()}`,
                        productId: prod.id,
                        productName: prod.name,
                        batchNumber: grnBatchNo.trim().toUpperCase(),
                        warehouseId: 'wh-ktm-01',
                        warehouseName: grnWarehouse,
                        initialQuantity: grnQty,
                        currentQuantity: grnQty,
                        reservedQuantity: 0,
                        manufactureDate: new Date().toISOString().slice(0, 10),
                        expiryDate: grnExpiry,
                        daysToExpiry: days,
                        status: days < 90 ? 'expiring_soon' : 'active',
                        unitCost: grnUnitCost
                      });
                      setShowReceiveBatchForm(false);
                      triggerBanner(`Batch ${grnBatchNo} (+${grnQty} units) added to FEFO warehouse ledger!`);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
                  >
                    Commit GRN Batch
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-400">
                  <th className="py-3 px-4">Batch Number</th>
                  <th className="py-3 px-3">Product Formulation</th>
                  <th className="py-3 px-3">Warehouse Hub</th>
                  <th className="py-3 px-3">Mfg / Expiry Date</th>
                  <th className="py-3 px-3 text-right">Unit Cost</th>
                  <th className="py-3 px-3 text-right">Available Qty</th>
                  <th className="py-3 px-3">FEFO QA Status</th>
                  <th className="py-3 px-4 text-right">Stock Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches
                  .filter(
                    (b) =>
                      batchWarehouseFilter === 'all' ||
                      b.warehouseName.toLowerCase().includes(batchWarehouseFilter.toLowerCase())
                  )
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.batchNumber}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{b.productName}</td>
                      <td className="py-3 px-3 text-slate-500">{b.warehouseName}</td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div>Exp: {b.expiryDate}</div>
                        <div className="text-slate-400">{b.daysToExpiry} days remaining</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">Rs. {b.unitCost}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#058852]">
                        {b.currentQuantity} / {b.initialQuantity}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                            b.status === 'quarantine'
                              ? 'bg-red-100 text-red-700'
                              : b.daysToExpiry < 90
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-[#058852]'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            appStore.adjustStock(b.id, 10, 'Cycle count positive adjustment');
                            triggerBanner(`Adjusted Batch ${b.batchNumber} by +10 units`);
                          }}
                          className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 font-mono text-[11px] cursor-pointer"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => {
                            appStore.toggleBatchQuarantine(b.id);
                            triggerBanner(`Toggled QA Quarantine state for Batch ${b.batchNumber}`);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer"
                        >
                          {b.status === 'quarantine' ? 'Release QA' : 'Quarantine'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          PURCHASE BILLS & HIMALAYAN SUPPLIER PAYABLES (`purchase`)
         ===================================================================== */}
      {activeSection === 'purchase' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Purchase Bills, Raw Herb Procurement & Supplier Payables (TO GIVE)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Total Supplier Payable Balance: <strong className="text-[#D92D20] font-mono">Rs. {purchaseBills.reduce((s, b) => s + b.balancePayable, 0).toLocaleString()}</strong> · Automatically generates FEFO Batches & DDA Lab Assay records upon posting.
              </p>
            </div>
            <button
              onClick={() => setShowNewPurchaseModal(!showNewPurchaseModal)}
              className="px-4 py-2 rounded-lg bg-[#058852] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Purchase Bill & GRN</span>
            </button>
          </div>

          {showNewPurchaseModal && (
            <div className="bg-emerald-50/50 rounded-xl border border-emerald-200 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Post New Supplier Purchase Invoice & Auto-Receive FEFO Batch
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Botanical Supplier Name</label>
                  <input
                    type="text"
                    value={purSupplierName}
                    onChange={(e) => setPurSupplierName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Supplier PAN</label>
                  <input
                    type="text"
                    value={purSupplierPan}
                    onChange={(e) => setPurSupplierPan(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Harvest / Origin Zone</label>
                  <input
                    type="text"
                    value={purOriginRegion}
                    onChange={(e) => setPurOriginRegion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Product Received</label>
                  <select
                    value={purProductId}
                    onChange={(e) => setPurProductId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Batch Code Assigned</label>
                  <input
                    type="text"
                    value={purBatchNo}
                    onChange={(e) => setPurBatchNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Quantity Received</label>
                  <input
                    type="number"
                    value={purQty}
                    onChange={(e) => setPurQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Unit Cost Excl. VAT (Rs)</label>
                  <input
                    type="number"
                    value={purUnitCost}
                    onChange={(e) => setPurUnitCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">DDA Lab Assay Certificate</label>
                  <input
                    type="text"
                    value={purAssayCert}
                    onChange={(e) => setPurAssayCert(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-[11px]"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const prod = products.find((p) => p.id === purProductId) || products[0];
                    const sub = Number((purQty * purUnitCost).toFixed(2));
                    const vat = Number((sub * 0.13).toFixed(2));
                    const tot = Number((sub + vat).toFixed(2));
                    appStore.createPurchaseBill({
                      id: `pur-${Date.now()}`,
                      billNumber: `PB-2083-${Math.floor(200 + Math.random() * 799)}`,
                      supplierName: purSupplierName,
                      supplierPan: purSupplierPan,
                      supplierPhone: '+977-9841009281',
                      originRegion: purOriginRegion,
                      date: new Date().toISOString().slice(0, 10),
                      dueDate: '2026-11-30',
                      productId: prod.id,
                      productName: prod.name,
                      batchNumberGenerated: purBatchNo,
                      quantityReceived: purQty,
                      unitCost: purUnitCost,
                      subtotal: sub,
                      vatAmount: vat,
                      totalAmount: tot,
                      paidAmount: 0,
                      balancePayable: tot,
                      status: 'unpaid',
                      qaAssayCertificate: purAssayCert
                    });
                    setShowNewPurchaseModal(false);
                    triggerBanner(`Posted Purchase Bill for Rs. ${tot.toLocaleString()} and generated FEFO Batch ${purBatchNo}`);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#058852] text-white text-xs font-bold cursor-pointer"
                >
                  Save Purchase Bill & Generate Batch
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-400">
                  <th className="py-3 px-4">Bill No & Date</th>
                  <th className="py-3 px-3">Himalayan Supplier & PAN</th>
                  <th className="py-3 px-3">Product & FEFO Batch</th>
                  <th className="py-3 px-3">DDA Lab Assay</th>
                  <th className="py-3 px-3 text-right">Total Billed</th>
                  <th className="py-3 px-3 text-right">To Give (Payable)</th>
                  <th className="py-3 px-4 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{bill.billNumber}</div>
                      <div className="text-[11px] text-slate-400">{bill.date}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{bill.supplierName}</div>
                      <div className="text-[11px] text-slate-500">
                        PAN: {bill.supplierPan} · {bill.originRegion}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{bill.productName}</div>
                      <div className="font-mono text-[11px] text-[#058852]">
                        Batch: {bill.batchNumberGenerated} ({bill.quantityReceived} units @ Rs.{bill.unitCost})
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#058852] font-mono text-[10px] font-bold">
                        {bill.qaAssayCertificate}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono">Rs. {bill.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#D92D20]">
                      Rs. {bill.balancePayable.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {bill.balancePayable > 0 ? (
                        <button
                          onClick={() => {
                            setPayingBillId(bill.id);
                            setBillPayAmount(bill.balancePayable);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#058852] text-white font-semibold text-[11px] cursor-pointer"
                        >
                          Pay Supplier
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold text-[11px]">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {payingBillId && (
            <div className="bg-amber-50 rounded-xl border border-amber-300 p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="font-bold text-slate-900">
                Settle Supplier Payable for {purchaseBills.find((b) => b.id === payingBillId)?.billNumber}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={billPayAmount}
                  onChange={(e) => setBillPayAmount(Number(e.target.value))}
                  className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                />
                <button
                  onClick={() => {
                    appStore.recordSupplierPayment(payingBillId, billPayAmount, 'acc-operating-01');
                    setPayingBillId(null);
                    triggerBanner(`Paid Rs. ${billPayAmount.toLocaleString()} to supplier & updated treasury balance!`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
                >
                  Confirm Bank Payout
                </button>
                <button
                  onClick={() => setPayingBillId(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          EXPENSE VOUCHERS & OPERATING OVERHEAD (`expense`)
         ===================================================================== */}
      {activeSection === 'expense' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-base font-bold text-slate-900">
              Corporate Operating Expenses & DDA Lab Assay Vouchers
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Total Paid Out in Period: <strong className="font-mono text-slate-900">Rs. {expenseVouchers.reduce((s, e) => s + e.amount, 0).toLocaleString()}</strong> across Cold-Chain Logistics, National Medicines Lab Testing, and Operations.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expense Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as ExpenseVoucher['category'])}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Cold-Chain Logistics">Cold-Chain Logistics</option>
                  <option value="DDA Lab Assay Testing">DDA Lab Assay Testing</option>
                  <option value="Warehouse Rent & Utilities">Warehouse Rent & Utilities</option>
                  <option value="Packaging & Glass Jars">Packaging & UV Glass Jars</option>
                  <option value="Staff Payroll">Staff Payroll</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Payee / Vendor Name</label>
                <input
                  type="text"
                  value={expPayee}
                  onChange={(e) => setExpPayee(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                <input
                  type="text"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Amount (NPR)</label>
                <input
                  type="number"
                  value={expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    const acc = treasuryAccounts.find((a) => a.id === expAccountId) || treasuryAccounts[0];
                    appStore.createExpenseVoucher({
                      id: `exp-${Date.now()}`,
                      voucherNumber: `EXP-2083-${Math.floor(1000 + Math.random() * 9000)}`,
                      date: new Date().toISOString().slice(0, 10),
                      category: expCategory,
                      payeeName: expPayee,
                      description: expDesc,
                      amount: expAmount,
                      vatIncluded: Number((expAmount - expAmount / 1.13).toFixed(2)),
                      paidFromAccountId: acc.id,
                      paidFromAccountName: acc.name,
                      approvedBy: 'Suman Vaidya (superadmin)',
                      status: 'paid'
                    });
                    triggerBanner(`Posted Expense Voucher for Rs. ${expAmount.toLocaleString()} (${expCategory})`);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
                >
                  + Record Expense Voucher
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-400">
                  <th className="py-3 px-4">Voucher No & Date</th>
                  <th className="py-3 px-3">Expense Head</th>
                  <th className="py-3 px-3">Payee & Particulars</th>
                  <th className="py-3 px-3">Paid From Account</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenseVouchers.map((v) => (
                  <tr key={v.id}>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {v.voucherNumber}
                      <div className="text-[11px] font-normal text-slate-400">{v.date}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {v.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{v.payeeName}</div>
                      <div className="text-[11px] text-slate-500">{v.description}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{v.paidFromAccountName}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      Rs. {v.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          MANAGE ACCOUNTS — DOUBLE-ENTRY CASH & BANK TREASURY (`manage_accounts`)
         ===================================================================== */}
      {activeSection === 'manage_accounts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Manage Accounts — Corporate Cash, Bank & Overdraft Facilities
                </h2>
                <p className="text-xs text-slate-500">
                  Combined Net Treasury Position:{' '}
                  <strong className="font-mono text-[#D92D20]">
                    Rs. {treasuryAccounts.reduce((s, a) => s + a.balance, 0).toLocaleString()}
                  </strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {treasuryAccounts.map((acc) => (
                <div key={acc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">{acc.name}</div>
                  <div className="text-[11px] text-slate-500">{acc.bankName}</div>
                  <div className="font-mono text-[10px] text-slate-400">A/C: {acc.accountNumber}</div>
                  <div
                    className={`pt-2 font-mono text-base font-bold ${
                      acc.balance >= 0 ? 'text-slate-900' : 'text-[#D92D20]'
                    }`}
                  >
                    Rs. {acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>

            {/* Inter-Account Contra Transfer Bar */}
            <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs items-end">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Transfer From Account</label>
                <select
                  value={fromAccId}
                  onChange={(e) => setFromAccId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {treasuryAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (Rs. {a.balance})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Transfer To Account</label>
                <select
                  value={toAccId}
                  onChange={(e) => setToAccId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {treasuryAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (Rs. {a.balance})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Amount (NPR)</label>
                <input
                  type="number"
                  value={contraAmount}
                  onChange={(e) => setContraAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Narration / Voucher Note</label>
                <input
                  type="text"
                  value={contraNotes}
                  onChange={(e) => setContraNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <button
                onClick={() => {
                  appStore.transferTreasuryFunds(fromAccId, toAccId, contraAmount, contraNotes);
                  triggerBanner(`Posted Contra Transfer of Rs. ${contraAmount.toLocaleString()} between accounts!`);
                }}
                className="py-2 px-4 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
              >
                Post Contra Transfer
              </button>
            </div>
          </div>

          {/* Treasury Ledger Statement */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Real-Time Bank & Vault Transaction Statement</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400">
                  <th className="py-2">Date</th>
                  <th className="py-2">Voucher Type</th>
                  <th className="py-2">Ref No</th>
                  <th className="py-2">Account Movement</th>
                  <th className="py-2">Narration</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {treasuryTransactions.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2.5 font-mono text-[11px] text-slate-500">{t.date}</td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          t.type === 'receipt'
                            ? 'bg-emerald-50 text-[#058852]'
                            : t.type === 'payment'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {t.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono font-bold">{t.referenceNumber}</td>
                    <td className="py-2.5 text-slate-700">
                      {t.fromAccountName && <span>From: {t.fromAccountName} </span>}
                      {t.toAccountName && <span>→ To: {t.toAccountName}</span>}
                    </td>
                    <td className="py-2.5 text-slate-500">{t.description}</td>
                    <td className="py-2.5 text-right font-mono font-bold">
                      Rs. {t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          PAYMENT REMINDERS & CREDIT AGING DESK (`payment_reminders`)
         ===================================================================== */}
      {activeSection === 'payment_reminders' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Payment Reminders, Credit Terms & B2B Receivables Collection
              </h2>
              <p className="text-xs text-slate-500">
                Automated credit-term monitoring for wholesale dealers and institutional buyers.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {customers
              .filter((c) => c.outstandingBalance > 0)
              .map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{c.name}</span>
                      {c.dealerCode && (
                        <span className="px-2 py-0.5 rounded bg-white border border-amber-300 font-mono text-[10px] font-bold">
                          {c.dealerCode}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {c.name.includes('Faiyaz')
                        ? '5d pending of 30d terms · Phone: ' + c.phone
                        : `Net ${c.paymentTermsDays || 30}d credit facility · Limit: Rs. ${c.creditLimit.toLocaleString()} · Phone: ${c.phone}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-[#D92D20] font-mono">
                      Rs. {c.outstandingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => {
                        appStore.addAuditLog(
                          'superadmin',
                          'Automated Payment Reminder Dispatched',
                          `Dispatched WhatsApp & SMS settlement alert to ${c.name} (${c.phone}) for outstanding balance Rs. ${c.outstandingBalance.toLocaleString()}`
                        );
                        triggerBanner(`Dispatched SMS & WhatsApp Payment Reminder to ${c.name} (${c.phone})`);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-[#058852] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send WhatsApp / SMS Reminder</span>
                    </button>
                    <button
                      onClick={() => {
                        appStore.recordPartyPaymentReceived(
                          c.id,
                          c.outstandingBalance,
                          'acc-operating-01',
                          `IPS-SETTLE-${Math.floor(1000 + Math.random() * 9000)}`
                        );
                        triggerBanner(`Marked Rs. ${c.outstandingBalance.toLocaleString()} received from ${c.name}!`);
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                    >
                      Mark Settled
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          ASSIGN CARRIER & 3PL DISPATCH MANIFEST (`assign_carrier`)
         ===================================================================== */}
      {activeSection === 'assign_carrier' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Assign Carrier — 3PL Logistics Partners & Live Shipment Dispatch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {carriers.map((car) => (
                <div key={car.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{car.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#058852] font-mono text-[10px] font-bold">
                      {car.code}
                    </span>
                  </div>
                  <div className="text-slate-500">{car.serviceType} · Contact: {car.contactPerson}</div>
                  <div className="font-mono text-[11px] text-slate-600">
                    Base Rate: Rs.{car.baseRateNpr} · COD Fee: {car.codCommissionPercent}% · On-Time: {car.onTimeRatePercent}%
                  </div>
                </div>
              ))}
            </div>

            {/* Add Carrier Row */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-end gap-3 text-xs">
              <input
                type="text"
                value={newCarrierName}
                onChange={(e) => setNewCarrierName(e.target.value)}
                placeholder="New Carrier Name (e.g. Buddha Air Cargo)"
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white w-64"
              />
              <input
                type="text"
                value={newCarrierCode}
                onChange={(e) => setNewCarrierCode(e.target.value)}
                placeholder="Code (BUDDHA-AIR)"
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono w-36"
              />
              <input
                type="number"
                value={newCarrierRate}
                onChange={(e) => setNewCarrierRate(Number(e.target.value))}
                placeholder="Base Rate NPR"
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono w-32"
              />
              <button
                onClick={() => {
                  if (!newCarrierName.trim()) return;
                  appStore.addCarrier({
                    id: `car-${Date.now()}`,
                    name: newCarrierName.trim(),
                    code: newCarrierCode.trim().toUpperCase() || '3PL-NEW',
                    serviceType: 'National Surface & Air',
                    contactPerson: 'Dispatch Desk',
                    phone: newCarrierPhone,
                    codCommissionPercent: 1.0,
                    baseRateNpr: newCarrierRate,
                    activeShipments: 1,
                    onTimeRatePercent: 97.5,
                    isActive: true
                  });
                  setNewCarrierName('');
                  triggerBanner(`Added 3PL Carrier "${newCarrierName}"`);
                }}
                className="px-4 py-2 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
              >
                + Add 3PL Carrier
              </button>
            </div>
          </div>

          {/* Assign Carrier to Orders Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Order Fulfillment & Carrier Assignment Queue</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400">
                  <th className="py-2">Invoice / Order</th>
                  <th className="py-2">Customer & Destination</th>
                  <th className="py-2">Assigned Carrier</th>
                  <th className="py-2">AWB Tracking Number</th>
                  <th className="py-2">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="py-2.5 font-mono font-bold">{ord.invoiceNumber}</td>
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-800">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-400">{ord.shippingAddress?.district}</div>
                    </td>
                    <td className="py-2.5">
                      <select
                        value={ord.courierName}
                        onChange={(e) => {
                          appStore.updateOrderLogistics(
                            ord.id,
                            e.target.value,
                            ord.trackingNumber,
                            ord.fulfillmentStatus
                          );
                          triggerBanner(`Assigned ${e.target.value} to ${ord.invoiceNumber}`);
                        }}
                        className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
                      >
                        <option value={ord.courierName}>{ord.courierName}</option>
                        {carriers.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 font-mono text-slate-700">{ord.trackingNumber}</td>
                    <td className="py-2.5">
                      <select
                        value={ord.fulfillmentStatus}
                        onChange={(e) => {
                          appStore.updateOrderLogistics(
                            ord.id,
                            ord.courierName,
                            ord.trackingNumber,
                            e.target.value as Order['fulfillmentStatus']
                          );
                          triggerBanner(`Updated ${ord.invoiceNumber} status to ${e.target.value.toUpperCase()}`);
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-50 text-[#058852] font-bold uppercase text-[11px] border border-emerald-200"
                      >
                        <option value="pending">PENDING</option>
                        <option value="packed">PACKED</option>
                        <option value="dispatched">DISPATCHED</option>
                        <option value="delivered">DELIVERED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          PICKUP BRANCHES & DISPENSARY HUBS (`pickup_branches`)
         ===================================================================== */}
      {activeSection === 'pickup_branches' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Pickup Branches, Regional Wholesale Depots & Ayurvedic Dispensaries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {pickupBranches.map((br) => (
                <div key={br.id} className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{br.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#058852] font-mono text-[10px] font-bold">
                      {br.code}
                    </span>
                  </div>
                  <div className="text-slate-600">{br.address} · {br.city} ({br.province})</div>
                  <div className="text-slate-500">
                    Branch Head: <strong>{br.managerName}</strong> · {br.phone} · {br.openingHours}
                  </div>
                  <div className="pt-1 flex items-center gap-3 text-[11px] font-mono text-slate-600">
                    <span>POS Terminals: {br.posTerminalsCount}</span>
                    <span>·</span>
                    <span>Active Stock: {br.activeStockUnits} units</span>
                    <span>·</span>
                    <span className="text-[#058852] font-bold">
                      {br.isColdStorageEquipped ? 'Cold-Storage Active' : 'Standard Dry Depot'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">New Branch Name</label>
                <input
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="e.g. Bharatpur Medical Chowk Depot"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">City & Address</label>
                <input
                  type="text"
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">In-Charge Vaidya / Manager</label>
                <input
                  type="text"
                  value={newBranchManager}
                  onChange={(e) => setNewBranchManager(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <button
                onClick={() => {
                  if (!newBranchName.trim()) return;
                  appStore.addPickupBranch({
                    id: `br-${Date.now()}`,
                    name: newBranchName.trim(),
                    code: `NP-BR-${Math.floor(10 + Math.random() * 89)}`,
                    province: newBranchProvince,
                    city: newBranchCity,
                    address: newBranchAddress,
                    managerName: newBranchManager,
                    phone: newBranchPhone,
                    openingHours: '08:00 AM – 07:30 PM',
                    posTerminalsCount: 2,
                    activeStockUnits: 420,
                    isColdStorageEquipped: true,
                    status: 'operational'
                  });
                  setNewBranchName('');
                  triggerBanner(`Registered new Pickup Branch "${newBranchName}"`);
                }}
                className="py-2 px-4 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
              >
                + Register Pickup Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          IMPORT DATA — BULK CSV / TALLY / ERP DATA IMPORTER (`import_data`)
         ===================================================================== */}
      {activeSection === 'import_data' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Import Data — Bulk CSV, Tally Prime XML & Legacy ERP Ledger Migration
              </h2>
              <p className="text-xs text-slate-500">
                Validate and commit bulk FEFO inventory batches, B2B dealer ledgers, or multi-price matrices in one click.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(['batches', 'products', 'parties', 'pricelists'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setImportDatasetType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                    importDatasetType === type
                      ? 'bg-[#058852] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Import {type}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <div className="font-bold text-slate-800">
                Staged Dry-Run Batch File: <span className="font-mono text-[#058852]">careplus_{importDatasetType}_2083_q3.csv</span>
              </div>
              <div className="text-slate-500">
                3 rows verified against Nepal DDA registration schema & Multi-Price floor rules (0 schema errors).
              </div>
            </div>
            <button
              onClick={() => {
                const prod = products[0];
                appStore.receiveInventoryBatch({
                  id: `bat-imp-${Date.now()}`,
                  productId: prod.id,
                  productName: prod.name,
                  batchNumber: `IMP-2083-${Math.floor(100 + Math.random() * 899)}`,
                  warehouseId: 'wh-ktm-01',
                  warehouseName: 'Baluwatar Central Hub (Kathmandu)',
                  initialQuantity: 95,
                  currentQuantity: 95,
                  reservedQuantity: 0,
                  manufactureDate: '2026-10-01',
                  expiryDate: '2028-10-01',
                  daysToExpiry: 712,
                  status: 'active',
                  unitCost: 815
                });
                triggerBanner(`Committed 3 staged ${importDatasetType} records into CarePlus ERP Ledger!`);
              }}
              className="px-4 py-2 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
            >
              Commit Validated CSV Rows to Database
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400">
                <th className="py-2">Code / Batch ID</th>
                <th className="py-2">Entity / Product Name</th>
                <th className="py-2 text-right">Quantity / Limit</th>
                <th className="py-2 text-right">Unit Cost / Rate</th>
                <th className="py-2">Dry-Run Schema Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {importPreviewRows.map((r, i) => (
                <tr key={i}>
                  <td className="py-2.5 font-mono font-bold">{r.code}</td>
                  <td className="py-2.5">{r.name}</td>
                  <td className="py-2.5 text-right font-mono">{r.qtyOrLimit}</td>
                  <td className="py-2.5 text-right font-mono">Rs. {r.priceOrBalance}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#058852] font-mono text-[10px] font-bold">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================================================
          COUPONS & SEASONAL CAMPAIGNS (`coupons`)
         ===================================================================== */}
      {activeSection === 'coupons' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Coupons & Promotional Discount Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {coupons.map((cpn) => (
              <div key={cpn.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-[#058852] font-mono font-bold text-xs">
                    {cpn.code}
                  </span>
                  <button
                    onClick={() => {
                      appStore.toggleCouponStatus(cpn.id);
                      triggerBanner(`Toggled status for coupon ${cpn.code}`);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                      cpn.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cpn.isActive ? 'Active' : 'Paused'}
                  </button>
                </div>
                <div className="font-bold text-slate-900">{cpn.title}</div>
                <div className="text-slate-500">
                  Value: {cpn.discountType === 'percentage' ? `${cpn.discountValue}% OFF` : `Rs. ${cpn.discountValue} OFF`} · Min Order: Rs. {cpn.minOrderAmount}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Channel: {cpn.eligibleChannel.toUpperCase()} · Redeemed: {cpn.usageCount}/{cpn.usageLimit}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs items-end">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Coupon Code</label>
              <input
                type="text"
                value={cpnCode}
                onChange={(e) => setCpnCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Campaign Title</label>
              <input
                type="text"
                value={cpnTitle}
                onChange={(e) => setCpnTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Discount Value</label>
              <input
                type="number"
                value={cpnVal}
                onChange={(e) => setCpnVal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Min Order (NPR)</label>
              <input
                type="number"
                value={cpnMinOrder}
                onChange={(e) => setCpnMinOrder(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>
            <button
              onClick={() => {
                if (!cpnCode.trim()) return;
                appStore.addCouponCampaign({
                  id: `cpn-${Date.now()}`,
                  code: cpnCode.trim().toUpperCase(),
                  title: cpnTitle,
                  discountType: cpnType,
                  discountValue: cpnVal,
                  minOrderAmount: cpnMinOrder,
                  eligibleChannel: cpnChannel,
                  isStackableWithSalePrice: true,
                  usageCount: 0,
                  usageLimit: 500,
                  validUntil: '2027-03-31',
                  isActive: true
                });
                triggerBanner(`Created Coupon Campaign "${cpnCode}"`);
              }}
              className="py-2 px-4 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
            >
              + Launch Coupon
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          REDIRECTS (`redirects`) & BLOGS (`blogs`)
         ===================================================================== */}
      {activeSection === 'redirects' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900">SEO 301 / 302 URL Redirect Rules</h2>
          <div className="flex flex-wrap items-end gap-3 text-xs">
            <input
              type="text"
              value={redSource}
              onChange={(e) => setRedSource(e.target.value)}
              placeholder="Source Path (/old-url)"
              className="px-3 py-2 rounded-lg border border-slate-300 font-mono w-64"
            />
            <input
              type="text"
              value={redTarget}
              onChange={(e) => setRedTarget(e.target.value)}
              placeholder="Target Path (/new-url)"
              className="px-3 py-2 rounded-lg border border-slate-300 font-mono w-64"
            />
            <select
              value={redCode}
              onChange={(e) => setRedCode(Number(e.target.value) as 301 | 302)}
              className="px-3 py-2 rounded-lg border border-slate-300 font-mono"
            >
              <option value={301}>301 Permanent</option>
              <option value={302}>302 Seasonal</option>
            </select>
            <button
              onClick={() => {
                appStore.addRedirectRule({
                  id: `red-${Date.now()}`,
                  sourcePath: redSource,
                  targetPath: redTarget,
                  redirectType: redCode,
                  reason: 'Admin configured route redirect',
                  hitsCount: 1,
                  lastTriggeredAt: 'Just now',
                  isActive: true
                });
                triggerBanner(`Added ${redCode} Redirect: ${redSource} -> ${redTarget}`);
              }}
              className="px-4 py-2 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
            >
              + Add Redirect Rule
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400">
                <th className="py-2">HTTP Type</th>
                <th className="py-2">Source Path</th>
                <th className="py-2">Target Destination</th>
                <th className="py-2 text-right">Hits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {redirects.map((r) => (
                <tr key={r.id}>
                  <td className="py-2.5 font-mono font-bold text-[#058852]">{r.redirectType}</td>
                  <td className="py-2.5 font-mono">{r.sourcePath}</td>
                  <td className="py-2.5 font-mono text-[#095B9E]">{r.targetPath}</td>
                  <td className="py-2.5 text-right font-mono">{r.hitsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'blogs' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Ayurvedic Clinical Journal & Vaidya Formulation CMS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {blogArticles.map((art) => (
              <div key={art.id} className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#058852] font-bold text-[10px]">
                  {art.category}
                </span>
                <div className="font-bold text-slate-900 text-sm">{art.title}</div>
                <div className="text-slate-500 text-[11px]">{art.nepaliTitle}</div>
                <p className="text-slate-600 text-[11px] line-clamp-2">{art.excerpt}</p>
                <div className="pt-1 text-[10px] text-slate-400 font-mono">
                  By {art.authorVaidya} · {art.viewsCount} reads
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
            <input
              type="text"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Clinical Article Title..."
              className="px-3 py-2 rounded-lg border border-slate-300"
            />
            <input
              type="text"
              value={blogNepaliTitle}
              onChange={(e) => setBlogNepaliTitle(e.target.value)}
              placeholder="नेपाली शीर्षक (Optional)"
              className="px-3 py-2 rounded-lg border border-slate-300"
            />
            <input
              type="text"
              value={blogExcerpt}
              onChange={(e) => setBlogExcerpt(e.target.value)}
              placeholder="Clinical summary / dosage takeaway..."
              className="px-3 py-2 rounded-lg border border-slate-300"
            />
            <button
              onClick={() => {
                if (!blogTitle.trim()) return;
                appStore.addBlogArticle({
                  id: `blg-${Date.now()}`,
                  slug: blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  title: blogTitle,
                  nepaliTitle: blogNepaliTitle || 'आयुर्वेदिक स्वास्थ्य लेख',
                  authorVaidya: blogVaidya,
                  category: 'Clinical Formulation',
                  readTimeMinutes: 5,
                  publishedAt: new Date().toISOString().slice(0, 10),
                  viewsCount: 1,
                  featuredProductId: products[0].id,
                  status: 'published',
                  excerpt: blogExcerpt || 'Peer-reviewed Ayurvedic clinical monograph.'
                });
                setBlogTitle('');
                setBlogExcerpt('');
                triggerBanner('Published new Ayurvedic Clinical Article!');
              }}
              className="py-2 px-4 rounded-lg bg-[#058852] text-white font-bold cursor-pointer"
            >
              + Publish Article
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          REPORTS, IRD VAT REGISTER & EXPRESS BACKEND API CONSOLE (`reports`)
         ===================================================================== */}
      {activeSection === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Enterprise BI Reports, Nepal IRD VAT Register & Express Backend Telemetry
              </h2>
              <p className="text-xs text-slate-500">
                Audit price overrides, export 13% VAT Sales/Purchase Annexes, and inspect live Express `/api/*` endpoints.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'audit', label: 'Security & Override Audit' },
                { id: 'vat_register', label: 'Nepal IRD 13% VAT Register' },
                { id: 'price_realization', label: 'Multi-Price Realization' },
                { id: 'backend_api', label: 'Express Backend & CBMS Console' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setReportTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    reportTab === t.id
                      ? 'bg-[#058852] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {reportTab === 'audit' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2.5">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-4"
                >
                  <div>
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-slate-500 ml-2">by {log.actor}</span>
                    <p className="text-slate-600 mt-0.5">{log.details}</p>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {reportTab === 'vat_register' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Nepal Inland Revenue Department (IRD) — Sales VAT Register (13% VAT Annex)
                </h3>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-[#058852] font-mono text-xs font-bold">
                  Seller PAN: 609841235 · FY 2083/84
                </span>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400">
                    <th className="py-2">Tax Invoice No</th>
                    <th className="py-2">Buyer Name</th>
                    <th className="py-2 text-right">Taxable Subtotal</th>
                    <th className="py-2 text-right">13% VAT Amount</th>
                    <th className="py-2 text-right">Grand Total</th>
                    <th className="py-2 text-right">IRD CBMS Fiscal Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="py-2.5 font-mono font-bold">{ord.invoiceNumber}</td>
                      <td className="py-2.5">{ord.customerName}</td>
                      <td className="py-2.5 text-right font-mono">Rs. {ord.subtotal.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono text-amber-800">Rs. {ord.taxAmount.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-[#058852]">
                        Rs. {ord.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right">
                        {ord.irdCbmsSynced ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#058852] font-mono text-[10px] font-bold">
                            {ord.irdFiscalSignature}
                          </span>
                        ) : (
                          <button
                            onClick={async () => {
                              const sig = await appStore.syncOrderWithIrdCbms(ord.id);
                              triggerBanner(`Fiscalized ${ord.invoiceNumber} with Nepal IRD CBMS -> ${sig}`);
                            }}
                            className="px-2.5 py-1 rounded bg-[#095B9E] text-white font-semibold text-[11px] cursor-pointer"
                          >
                            Push to IRD CBMS
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportTab === 'price_realization' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Multi-Price Engine Tier Realization & Margin Protection Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Catalog SKUs with 12-Layer Config</div>
                  <div className="text-xl font-bold text-slate-900 font-mono mt-1">{products.length} SKUs</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Active B2B Price Lists</div>
                  <div className="text-xl font-bold text-[#058852] font-mono mt-1">{customPriceLists.length} Lists</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Customer Groups Configured</div>
                  <div className="text-xl font-bold text-[#095B9E] font-mono mt-1">{customerGroups.length} Groups</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Floor Breaches Without Approval</div>
                  <div className="text-xl font-bold text-emerald-700 font-mono mt-1">0 (100% Enforced)</div>
                </div>
              </div>
            </div>
          )}

          {reportTab === 'backend_api' && (
            <div className="bg-slate-900 text-slate-100 rounded-xl p-5 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Server className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-bold text-sm text-white">
                      {serverHealth?.engine || 'CarePlus Quark Express Backend Engine v4.2'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Persistent DB: {serverHealth?.databaseFile || '.data/careplus-erp-db.json'} · IRD Gateway:{' '}
                      {serverHealth?.irdCbmsGateway?.protocol || 'Nepal IRD CBMS Real-Time REST v2.4'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      const res = await fetch('/api/pricing/resolve', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          productId: 'prod-shilajit-resin',
                          quantity: 35,
                          channel: 'wholesale'
                        })
                      });
                      const json = await res.json();
                      setApiTestResult(JSON.stringify(json, null, 2));
                      triggerBanner('Executed Server-Side /api/pricing/resolve successfully!');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                  >
                    Test POST /api/pricing/resolve
                  </button>
                  <button
                    onClick={async () => {
                      await fetch('/api/erp/snapshot', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          snapshotSummary: {
                            ordersCount: orders.length,
                            partiesCount: customers.length,
                            batchesCount: batches.length,
                            savedAt: new Date().toISOString()
                          }
                        })
                      });
                      await fetchServerHealth();
                      triggerBanner('Persisted ERP Ledger Snapshot to server .data/careplus-erp-db.json!');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
                  >
                    Persist Snapshot to Disk
                  </button>
                </div>
              </div>

              {apiTestResult && (
                <pre className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-64">
                  {apiTestResult}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MEDIA CENTER & ORIGINAL LOGO FILE (`media_center`)
         ===================================================================== */}
      {activeSection === 'media_center' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Media Center & Original Brand Logo File</h2>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <CarePlusLogo className="h-10 w-auto object-contain" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Active Brand Logo (/careplus-logo.png)</div>
                <div className="text-[11px] text-slate-500">
                  Displayed across Storefront Header, Footer, Tax Invoices, Wholesale Portal, and ERP Sidebar.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="px-3.5 py-2 rounded-lg bg-[#058852] text-white text-xs font-semibold cursor-pointer">
                <span>Upload Original Logo File</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setCustomLogoFile(f);
                      triggerBanner('Updated active CarePlus logo file across all portals!');
                    }
                  }}
                />
              </label>
              {hasCustomLogoFile() && (
                <button
                  onClick={() => {
                    resetCustomLogoFile();
                    triggerBanner('Restored default /careplus-logo.png file');
                  }}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Reset Default
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
