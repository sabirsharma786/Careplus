export type CustomerType = 'retail' | 'vip' | 'dealer' | 'distributor';

export type LoyaltyTier = 'novice' | 'seeker' | 'vaidya_gold' | 'rishi_platinum';

export interface LoyaltyLedgerEntry {
  id: string;
  date: string;
  type: 'earned' | 'redeemed' | 'bonus' | 'tier_upgrade';
  orderId?: string;
  points: number;
  description: string;
  balanceAfter: number;
}

export interface CustomerAddress {
  id: string;
  label?: string;
  fullName?: string;
  phone?: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  tole?: string;
  landmark?: string;
  streetLandmark?: string;
  instructions?: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

export interface AssignedSalesExecutive {
  id: string;
  name: string;
  designation: string;
  phone: string;
  whatsapp: string;
  email: string;
  territory: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: CustomerType;
  panNumber?: string; // For B2B Dealers/Distributors
  ddaLicenseNo?: string; // Department of Drug Administration License
  dealerCode?: string; // e.g. "DLR-KTM-001"
  pinCode?: string; // Demo login PIN for wholesale portal
  approvedDealer?: boolean;
  customerGroupId?: string; // Link to CustomerGroup
  priceListId?: string; // Link to CustomPriceList
  assignedPriceListId?: string; // Link to CustomPriceList
  creditLimit: number;
  creditUsed?: number;
  outstandingBalance: number; // Positive = To Receive
  paymentTermsDays?: number; // e.g. 30 days credit terms
  overdueDays?: number;
  assignedSalesExec?: AssignedSalesExecutive;
  loyaltyPoints: number;
  lifetimePointsEarned: number;
  memberTier: LoyaltyTier;
  ledgerHistory: LoyaltyLedgerEntry[];
  addresses: CustomerAddress[];
}

// ============================================================================
// 7. ADVANCED MULTI-PRICE ENGINE TYPES
// ============================================================================

export type PriceSourceType =
  | 'INVOICE_OVERRIDE'
  | 'CONTRACT_PRICE'
  | 'CUSTOMER_SPECIFIC'
  | 'CUSTOM_PRICE_LIST'
  | 'BULK_QUANTITY_TIER'
  | 'CHANNEL_RULE'
  | 'DISTRIBUTOR_PRICE'
  | 'DEALER_PRICE'
  | 'SALE_PRICE'
  | 'RETAIL_PRICE'
  | 'MRP';

export type TaxInclusionSetting = 'TAX_EXCLUSIVE' | 'TAX_INCLUSIVE' | 'inclusive' | 'exclusive';

export type DiscountStackingMode = 'MUTUALLY_EXCLUSIVE' | 'EXPLICITLY_STACKABLE';

export interface BulkQuantityTier {
  id: string;
  minQty: number;
  maxQty?: number | null; // null/undefined = unlimited
  unitPrice: number;
  applicableTo?: 'all' | 'dealer' | 'distributor' | 'retail';
  channel?: OrderChannel | 'all';
  label: string;
}

export interface CustomerSpecificPriceRule {
  id: string;
  customerId: string;
  customerName: string;
  productId?: string;
  negotiatedPrice?: number;
  unitPrice: number;
  notes?: string;
  updatedAt: string;
}

export interface ContractPriceRule {
  id: string;
  contractNumber?: string;
  contractCode: string;
  customerId?: string;
  customerGroupId?: string;
  customerName?: string;
  partyName: string;
  productId?: string;
  contractUnitPrice?: number;
  unitPrice: number;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo: string;   // YYYY-MM-DD
  minCommitmentQty?: number;
  isActive?: boolean;
  active?: boolean;
}

export interface SalesChannelPriceRule {
  id?: string;
  channel: OrderChannel;
  label: string;
  productId?: string;
  channelUnitPrice?: number;
  unitPrice?: number;
  discountPercentOffRetail?: number;
  isStackableWithBulkTier?: boolean;
  active: boolean;
}

export interface ProductPricingConfig {
  productId: string;
  variantLabel?: string;
  mrp: number;
  retailPrice: number;
  salePrice: number;
  dealerPrice: number;
  distributorPrice: number;
  internalMinPrice: number; // Absolute floor / requires Manager Approval if breached
  staffApprovalLimitPrice: number; // Lowest price a staff can set without manager PIN
  taxSetting: TaxInclusionSetting;
  taxRatePercent: number; // Default 13% VAT in Nepal
  discountStackingMode: DiscountStackingMode;
  maxStackableDiscountPercent?: number;
  stackablePromoDiscountPercent?: number;
  bulkTiers: BulkQuantityTier[];
  bulkQuantityTiers?: BulkQuantityTier[];
  customerSpecificPrices: CustomerSpecificPriceRule[];
  contractPrices: ContractPriceRule[];
  channelRules: SalesChannelPriceRule[];
}

export interface CustomerGroup {
  id: string;
  name: string;
  code: string;
  description: string;
  defaultPriceTier?: 'retail' | 'sale' | 'dealer' | 'distributor';
  additionalGroupDiscountPercent?: number;
  defaultDiscountPercent: number;
  isStackable?: boolean;
  memberCount: number;
  priceListId?: string;
  assignedPriceListId?: string;
}

export interface CustomPriceList {
  id: string;
  name: string;
  code: string;
  targetType: 'dealer' | 'distributor' | 'vip' | 'custom';
  discountStackingMode: DiscountStackingMode;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  productRates: Record<string, number>; // productId -> custom unit price
}

export interface PriceCandidateStep {
  source: PriceSourceType;
  label: string;
  eligible: boolean;
  candidatePrice?: number;
  reason: string;
}

export interface PriceResolutionResult {
  productId: string;
  quantity: number;
  channel: OrderChannel;
  customerId?: string;
  // Auto-resolved before manual override
  autoSelectedPrice: number;
  autoSelectedSource: PriceSourceType;
  autoSelectedLabel: string;
  // Final effective price (after override or stackable discount)
  finalUnitPrice: number;
  finalPriceSource: PriceSourceType;
  finalSourceLabel: string;
  // Tax breakdown
  taxSetting: TaxInclusionSetting;
  taxRatePercent: number;
  netUnitPriceExclTax: number;
  unitTaxAmount: number;
  grossUnitPriceInclTax: number;
  lineSubtotalExclTax: number;
  lineTaxAmount: number;
  lineTotalInclTax: number;
  // Floor & Approval validation
  internalMinPrice: number;
  staffApprovalLimitPrice: number;
  requiresManagerApproval: boolean;
  breachesInternalFloor: boolean;
  approvalReasonRequired: boolean;
  // Precedence trace
  precedenceTrace: PriceCandidateStep[];
}

export interface ImmutablePriceSnapshot {
  capturedAt: string;
  mrpAtSale: number;
  retailPriceAtSale: number;
  salePriceAtSale: number;
  dealerPriceAtSale: number;
  distributorPriceAtSale: number;
  internalMinPriceAtSale: number;
  staffApprovalLimitAtSale: number;
  autoSelectedPrice: number;
  autoSelectedSource: PriceSourceType;
  finalUnitPrice: number;
  finalPriceSource: PriceSourceType;
  taxSetting: TaxInclusionSetting;
  taxRatePercent: number;
  netUnitPriceExclTax: number;
  unitTaxAmount: number;
  grossUnitPriceInclTax: number;
  isOverridden: boolean;
  overrideReason?: string;
  overriddenByStaffId?: string;
  overriddenByStaffName?: string;
  approvedByManagerId?: string;
  approvedByManagerName?: string;
  approvedAt?: string;
}

// ============================================================================
// WHOLESALE B2B PORTAL TYPES
// ============================================================================

export interface WholesaleQuotationLine {
  productId: string;
  productName: string;
  sku: string;
  packSize: string;
  quantity: number;
  standardDealerPrice: number;
  requestedUnitPrice: number;
  negotiatedUnitPrice?: number;
  notes?: string;
}

export interface WholesaleQuotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  dealerCode: string;
  createdAt: string;
  validUntil: string;
  status: 'requested' | 'negotiated_by_admin' | 'confirmed_by_dealer' | 'converted_to_order' | 'rejected';
  poReferenceNumber?: string;
  poAttachmentName?: string;
  lines: WholesaleQuotationLine[];
  dealerNotes?: string;
  adminResponseNotes?: string;
  negotiatedByStaff?: string;
  negotiatedAt?: string;
  confirmedAt?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  nepaliName: string;
  category: string;
  subcategory: string;
  packSize: string;
  mrp: number;
  retailPrice: number;
  salePrice?: number;
  dealerPrice: number;
  distributorPrice: number;
  minApprovalFloorPrice: number;
  staffApprovalLimitPrice?: number;
  taxSetting?: TaxInclusionSetting;
  stock: number;
  images: string[];
  description: string;
  nepaliDescription: string;
  benefits: string[];
  ingredients: string[];
  ddaRegNo: string;
  usageInstructions: string;
  rating: number;
  reviewsCount: number;
  // Merchandising flags
  isFlagship?: boolean;
  flagshipRank?: number;
  isFlashSale?: boolean;
  flashSaleDiscount?: number;
  flashSaleEndsAt?: string;
  isTrending?: boolean;
  isTopRated?: boolean;
  isNewArrival?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface InventoryBatch {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  warehouseId: string;
  warehouseName: string;
  initialQuantity: number;
  currentQuantity: number;
  reservedQuantity: number;
  manufactureDate: string;
  expiryDate: string;
  daysToExpiry: number;
  status: 'active' | 'expiring_soon' | 'expired' | 'quarantine';
  unitCost: number;
}

export type OrderPaymentMethod = 'cod' | 'esewa' | 'khalti' | 'connectips' | 'credit' | 'cash';
export type PaymentStatus = 'unpaid' | 'paid' | 'partial';
export type FulfillmentStatus = 'pending' | 'packed' | 'dispatched' | 'delivered';
export type OrderChannel = 'retail' | 'wholesale' | 'pos';

export interface OrderItem {
  productId: string;
  productName: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  batchNumber?: string;
  priceSnapshot?: ImmutablePriceSnapshot;
}

export interface Order {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number; // 13% Nepal VAT
  shippingFee: number;
  discountAmount: number;
  pointsRedeemed?: number;
  pointsDiscount?: number;
  totalAmount: number;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  channel: OrderChannel;
  createdAt: string;
  shippingAddress: CustomerAddress;
  trackingNumber: string;
  courierName: string;
  pickupBranch?: string;
  poReferenceNumber?: string;
  poDocumentName?: string;
  quotationId?: string;
  irdCbmsSynced?: boolean;
  irdFiscalSignature?: string;
  notes?: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'pos_cashier' | 'warehouse_manager';
  branch: string;
  canOverridePrice?: boolean;
  canApproveFloorBreach?: boolean;
  approvalPin?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  category?: 'security' | 'pricing_override' | 'inventory' | 'invoice' | 'quotation' | 'treasury' | 'procurement';
}

// ============================================================================
// ENTERPRISE BACKEND ERP MODULES (PURCHASE, EXPENSE, TREASURY, LOGISTICS, CMS)
// ============================================================================

export interface PurchaseBill {
  id: string;
  billNumber: string;
  supplierName: string;
  supplierPan: string;
  supplierPhone: string;
  originRegion: string; // e.g., "Dolpa High-Altitude Co-op", "Manang Herbals"
  date: string;
  dueDate: string;
  productId: string;
  productName: string;
  batchNumberGenerated: string;
  quantityReceived: number;
  unitCost: number;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  balancePayable: number; // Contributes to "TO GIVE"
  status: 'unpaid' | 'partial' | 'paid';
  qaAssayCertificate: string;
}

export interface ExpenseVoucher {
  id: string;
  voucherNumber: string;
  date: string;
  category: 'Cold-Chain Logistics' | 'DDA Lab Assay Testing' | 'Warehouse Rent & Utilities' | 'Staff Payroll' | 'Digital Marketing' | 'Packaging & Glass Jars';
  payeeName: string;
  description: string;
  amount: number;
  vatIncluded: number;
  paidFromAccountId: string;
  paidFromAccountName: string;
  approvedBy: string;
  status: 'paid' | 'pending_approval';
}

export interface TreasuryAccount {
  id: string;
  name: string;
  accountType: 'bank_operating' | 'bank_od' | 'credit_facility' | 'cash_vault' | 'digital_wallet';
  bankName: string;
  accountNumber: string;
  balance: number;
  currency: 'NPR';
  lastReconciledAt: string;
}

export interface TreasuryTransaction {
  id: string;
  date: string;
  type: 'receipt' | 'payment' | 'contra_transfer' | 'journal_adjustment';
  fromAccountName?: string;
  toAccountName?: string;
  referenceNumber: string;
  partyName?: string;
  amount: number;
  description: string;
  recordedBy: string;
}

export interface LogisticsCarrier {
  id: string;
  name: string;
  code: string;
  serviceType: 'B2B Heavy Cargo' | 'National Surface & Air' | 'Valley Same-Day Rider' | 'Temperature-Controlled Cold Chain';
  contactPerson: string;
  phone: string;
  codCommissionPercent: number;
  baseRateNpr: number;
  activeShipments: number;
  onTimeRatePercent: number;
  isActive: boolean;
}

export interface PickupBranch {
  id: string;
  name: string;
  code: string;
  province: string;
  city: string;
  address: string;
  managerName: string;
  phone: string;
  openingHours: string;
  posTerminalsCount: number;
  activeStockUnits: number;
  isColdStorageEquipped: boolean;
  status: 'operational' | 'maintenance';
}

export interface CouponCampaign {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  eligibleChannel: 'all' | 'retail' | 'wholesale';
  isStackableWithSalePrice: boolean;
  usageCount: number;
  usageLimit: number;
  validUntil: string;
  isActive: boolean;
}

export interface UrlRedirectRule {
  id: string;
  sourcePath: string;
  targetPath: string;
  redirectType: 301 | 302;
  reason: string;
  hitsCount: number;
  lastTriggeredAt: string;
  isActive: boolean;
}

export interface AyurvedaBlogArticle {
  id: string;
  slug: string;
  title: string;
  nepaliTitle: string;
  authorVaidya: string;
  category: 'Rasayana & Longevity' | 'Seasonal Ritucharya' | 'Clinical Formulation' | 'Quality & Lab Testing';
  readTimeMinutes: number;
  publishedAt: string;
  viewsCount: number;
  featuredProductId: string;
  status: 'published' | 'draft';
  excerpt: string;
}
