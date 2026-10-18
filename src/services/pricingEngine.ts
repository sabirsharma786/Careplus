import {
  Product,
  Customer,
  OrderChannel,
  ProductPricingConfig,
  CustomerGroup,
  CustomPriceList,
  PriceResolutionResult,
  PriceCandidateStep,
  PriceSourceType,
  ImmutablePriceSnapshot,
  WholesaleQuotation
} from '../types';

/**
 * DOCUMENTED PRICE PRECEDENCE HIERARCHY (Server-Grade Multi-Price Engine)
 * ------------------------------------------------------------------------
 * Priority 1: INVOICE_OVERRIDE      — Authorized staff manual line-item price override (never mutates global catalog)
 * Priority 2: CONTRACT_PRICE        — Active date-bound B2B contract price (effectiveFrom <= date <= effectiveTo)
 * Priority 3: CUSTOMER_SPECIFIC     — Negotiated customer-specific price assigned to Customer ID
 * Priority 4: CUSTOM_PRICE_LIST     — Assigned Customer Group / Custom Price List rate
 * Priority 5: BULK_QUANTITY_TIER    — Quantity tier break matching ordered quantity (or lower of tier vs base B2B rate)
 * Priority 6: DISTRIBUTOR_PRICE     — National/Regional Distributor tier (for customer.type === 'distributor')
 * Priority 7: DEALER_PRICE          — Approved Wholesale Dealer tier (for customer.type === 'dealer')
 * Priority 8: CHANNEL_RULE          — Sales channel rule (POS / Wholesale / Retail channel rule)
 * Priority 9: SALE_PRICE            — Active promotional / flash sale price
 * Priority 10: RETAIL_PRICE / MRP   — Standard Retail selling price, falling back to MRP
 */
export const PRICE_PRECEDENCE_DOCUMENTATION = [
  { rank: 1, code: 'INVOICE_OVERRIDE', title: 'Authorized Invoice-Time Override', description: 'Per-invoice manual unit price edit with mandatory reason, permission check, floor validation, and manager approval.' },
  { rank: 2, code: 'CONTRACT_PRICE', title: 'Active Contract Price (Date-Bound)', description: 'Fixed contract rate valid within effectiveFrom and effectiveTo dates for a customer or customer group.' },
  { rank: 3, code: 'CUSTOMER_SPECIFIC', title: 'Customer-Specific Negotiated Price', description: 'Standing negotiated unit price bound to a specific approved dealer or institutional customer ID.' },
  { rank: 4, code: 'CUSTOM_PRICE_LIST', title: 'Customer Group / Custom Price List', description: 'Assigned price list rate from the customer group (e.g. Valley Pharmacies, Ayurvedic Hospitals).' },
  { rank: 5, code: 'BULK_QUANTITY_TIER', title: 'Bulk Quantity Tier Break', description: 'Volume-based unit price unlocked when line quantity reaches 10+, 30+, or 100+ units.' },
  { rank: 6, code: 'DISTRIBUTOR_PRICE', title: 'Distributor Tier Price', description: 'Standard ex-depot distributor price for verified regional distributors.' },
  { rank: 7, code: 'DEALER_PRICE', title: 'Approved Dealer Price', description: 'Wholesale trade rate for approved retail pharmacies and Ayurvedic dealers.' },
  { rank: 8, code: 'CHANNEL_RULE', title: 'Sales Channel Rule', description: 'Channel-level price adjustment for POS walk-in clinic, B2B portal, or online retail.' },
  { rank: 9, code: 'SALE_PRICE', title: 'Promotional Sale Price', description: 'Seasonal campaign or flash-sale discounted retail price.' },
  { rank: 10, code: 'RETAIL_PRICE', title: 'Standard Retail Price & MRP', description: 'Baseline D2C retail selling price bounded by Maximum Retail Price (MRP).' }
] as const;

export const INITIAL_CUSTOMER_GROUPS: CustomerGroup[] = [
  {
    id: 'grp-valley-dist',
    name: 'Province-1 & Bagmati Regional Distributors',
    code: 'DIST-REG',
    description: 'High-volume stockists and regional medical distributors across Kathmandu, Lalitpur, and Biratnagar.',
    defaultDiscountPercent: 28,
    priceListId: 'plist-distributor-gold',
    memberCount: 6
  },
  {
    id: 'grp-ayur-pharmacies',
    name: 'Approved Ayurvedic Pharmacies & Dealers',
    code: 'DEALER-AYU',
    description: 'DDA-registered retail Ayurvedic pharmacies and wellness stores with Net-30/45 credit terms.',
    defaultDiscountPercent: 22,
    priceListId: 'plist-dealer-standard',
    memberCount: 14
  },
  {
    id: 'grp-hospitals-clinics',
    name: 'Hospitals & Panchakarma Clinics',
    code: 'CLINIC-INST',
    description: 'Institutional healthcare partners, Ayurvedic teaching hospitals, and therapy centers.',
    defaultDiscountPercent: 25,
    priceListId: 'plist-institutional',
    memberCount: 5
  },
  {
    id: 'grp-vip-retail',
    name: 'Rishi Platinum & VIP Retail Members',
    code: 'VIP-D2C',
    description: 'Top-tier loyal retail customers eligible for preferential wellness pricing.',
    defaultDiscountPercent: 8,
    memberCount: 42
  }
];

export const INITIAL_CUSTOM_PRICE_LISTS: CustomPriceList[] = [
  {
    id: 'plist-distributor-gold',
    name: 'National Distributor Gold Tariff (2083)',
    code: 'PL-DIST-2083',
    targetType: 'distributor',
    discountStackingMode: 'MUTUALLY_EXCLUSIVE',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2027-04-15',
    isActive: true,
    productRates: {
      'prod-shilajit-resin': 1620,
      'prod-ashwagandha-ksm66': 900,
      'prod-cordyceps-yarsa': 2760,
      'prod-chyawanprash-gold': 920,
      'prod-wintergreen-liniment': 430
    }
  },
  {
    id: 'plist-dealer-standard',
    name: 'Nepal Wholesale Pharmacy Price List',
    code: 'PL-DEALER-STD',
    targetType: 'dealer',
    discountStackingMode: 'EXPLICITLY_STACKABLE',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2027-04-15',
    isActive: true,
    productRates: {
      'prod-shilajit-resin': 1820,
      'prod-ashwagandha-ksm66': 1020,
      'prod-cordyceps-yarsa': 3150,
      'prod-chyawanprash-gold': 1040,
      'prod-wintergreen-liniment': 490
    }
  },
  {
    id: 'plist-institutional',
    name: 'Institutional Panchakarma & Hospital Contract Tariff',
    code: 'PL-HOSP-2083',
    targetType: 'custom',
    discountStackingMode: 'MUTUALLY_EXCLUSIVE',
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-31',
    isActive: true,
    productRates: {
      'prod-shilajit-resin': 1740,
      'prod-ashwagandha-ksm66': 970,
      'prod-cordyceps-yarsa': 2950,
      'prod-chyawanprash-gold': 980,
      'prod-wintergreen-liniment': 460
    }
  }
];

export function buildDefaultPricingConfig(product: Product): ProductPricingConfig {
  const mrp = product.mrp;
  const retailPrice = product.retailPrice;
  const salePrice = product.isFlashSale && product.flashSaleDiscount
    ? Math.round(retailPrice * (1 - product.flashSaleDiscount / 100))
    : Math.round(retailPrice * 0.94);
  const dealerPrice = product.dealerPrice;
  const distributorPrice = product.distributorPrice;
  const internalMinPrice = product.minApprovalFloorPrice;
  const staffApprovalLimitPrice = Math.round((dealerPrice + internalMinPrice) / 2);

  const tier10Price = Math.round(dealerPrice * 0.96);
  const tier30Price = Math.round(dealerPrice * 0.92);
  const tier100Price = Math.max(internalMinPrice + 25, Math.round(distributorPrice * 0.98));

  return {
    productId: product.id,
    variantLabel: `${product.name} (${product.packSize})`,
    mrp,
    retailPrice,
    salePrice,
    dealerPrice,
    distributorPrice,
    internalMinPrice,
    staffApprovalLimitPrice,
    taxSetting: product.taxSetting || 'inclusive',
    taxRatePercent: 13,
    discountStackingMode: 'MUTUALLY_EXCLUSIVE',
    stackablePromoDiscountPercent: 3,
    bulkTiers: [
      { id: `${product.id}-t1`, minQty: 10, maxQty: 29, unitPrice: tier10Price, label: '10–29 Units (Carton Pack)' },
      { id: `${product.id}-t2`, minQty: 30, maxQty: 99, unitPrice: tier30Price, label: '30–99 Units (Master Case)' },
      { id: `${product.id}-t3`, minQty: 100, unitPrice: tier100Price, label: '100+ Units (Depot Pallet)' }
    ],
    customerSpecificPrices: product.id === 'prod-shilajit-resin'
      ? [
          {
            id: 'csp-1',
            customerId: 'cust-dealer-01',
            customerName: 'Himalayan Aushadhi Kendra (Bishal Pokharel)',
            unitPrice: 1760,
            notes: 'Annual Dolpa Shilajit volume commitment rate',
            updatedAt: '2026-10-01'
          },
          {
            id: 'csp-2',
            customerId: 'cust-faiyaz-01',
            customerName: 'Faiyaz Bhai - IT FLY',
            unitPrice: 1790,
            notes: 'Negotiated B2B account rate (30d terms)',
            updatedAt: '2026-10-12'
          }
        ]
      : product.id === 'prod-ashwagandha-ksm66'
      ? [
          {
            id: 'csp-3',
            customerId: 'cust-dist-01',
            customerName: 'Koshi Herbal & Surgical Distributors Pvt. Ltd.',
            unitPrice: 890,
            notes: 'Eastern Nepal stockist special rate',
            updatedAt: '2026-09-20'
          }
        ]
      : [],
    contractPrices: product.id === 'prod-shilajit-resin' || product.id === 'prod-chyawanprash-gold'
      ? [
          {
            id: `ctr-${product.id}`,
            contractCode: 'CTR-2083-AYUR-09',
            customerId: 'cust-dist-01',
            customerGroupId: 'grp-valley-dist',
            partyName: 'Koshi Herbal & Surgical Distributors Pvt. Ltd.',
            unitPrice: product.id === 'prod-shilajit-resin' ? 1600 : 910,
            effectiveFrom: '2026-09-01',
            effectiveTo: '2027-03-31',
            isActive: true
          }
        ]
      : [],
    channelRules: [
      { channel: 'pos', discountPercentOffRetail: 4, label: 'Baluwatar Clinic Walk-In POS (-4%)', active: true },
      { channel: 'wholesale', unitPrice: dealerPrice, label: 'B2B Portal Trade Baseline', active: true },
      { channel: 'retail', unitPrice: retailPrice, label: 'D2C Online Storefront', active: true }
    ]
  };
}

export const INITIAL_WHOLESALE_QUOTATIONS: WholesaleQuotation[] = [
  {
    id: 'qtn-101',
    quotationNumber: 'QTN-2083-0412',
    customerId: 'cust-dealer-01',
    customerName: 'Himalayan Aushadhi Kendra (Bishal Pokharel)',
    dealerCode: 'DLR-LAL-019',
    createdAt: '2026-10-15 11:20 AM',
    validUntil: '2026-10-30',
    status: 'negotiated_by_admin',
    poReferenceNumber: 'PO-HAK-2083/77',
    poAttachmentName: 'Himalayan_Aushadhi_PO_77.pdf',
    dealerNotes: 'Requesting special festival stockist rate for 60 jars of Shilajit Gold and 80 bottles of Ashwagandha KSM-66.',
    adminResponseNotes: 'Approved special Autumn-Winter trade rate by SuperAdmin (Suman Vaidya). Ready for immediate FEFO dispatch from Kathmandu Hub.',
    negotiatedByStaff: 'Suman Vaidya (superadmin)',
    negotiatedAt: '2026-10-16 04:15 PM',
    lines: [
      {
        productId: 'prod-shilajit-resin',
        productName: 'CarePlus Himalayan Pure Shilajit Gold Resin',
        sku: 'CP-SHJ-001',
        packSize: '30g Glass Jar + Golden Spoon',
        quantity: 60,
        standardDealerPrice: 1850,
        requestedUnitPrice: 1680,
        negotiatedUnitPrice: 1710,
        notes: 'Master case 50+ tier + special seasonal rebate'
      },
      {
        productId: 'prod-ashwagandha-ksm66',
        productName: 'CarePlus Organic Himalayan Ashwagandha KSM-66',
        sku: 'CP-ASH-002',
        packSize: '60 Veggie Capsules (500mg)',
        quantity: 80,
        standardDealerPrice: 1050,
        requestedUnitPrice: 940,
        negotiatedUnitPrice: 960,
        notes: 'Approved at institutional contract rate'
      }
    ]
  },
  {
    id: 'qtn-102',
    quotationNumber: 'QTN-2083-0419',
    customerId: 'cust-dist-01',
    customerName: 'Koshi Herbal & Surgical Distributors Pvt. Ltd.',
    dealerCode: 'DST-BRT-004',
    createdAt: '2026-10-17 09:45 AM',
    validUntil: '2026-11-02',
    status: 'requested',
    poReferenceNumber: 'PO-KOSHI-882',
    poAttachmentName: 'Koshi_Pharma_Bulk_Indent_Oct.pdf',
    dealerNotes: 'Eastern Region winter stock indent for Biratnagar, Itahari, and Dharan pharmacies.',
    lines: [
      {
        productId: 'prod-chyawanprash-gold',
        productName: 'CarePlus Special Gold Kesar Himalayan Chyawanprash',
        sku: 'CP-CHY-016',
        packSize: '500g Glass Jar',
        quantity: 120,
        standardDealerPrice: 1080,
        requestedUnitPrice: 900
      },
      {
        productId: 'prod-wintergreen-liniment',
        productName: 'CarePlus Himalayan Wintergreen Pain Relief Liniment',
        sku: 'CP-JNT-021',
        packSize: '100ml Bottle',
        quantity: 150,
        standardDealerPrice: 510,
        requestedUnitPrice: 425
      }
    ]
  }
];

export function resolveMultiPrice(params: {
  product: Product;
  pricingConfig: ProductPricingConfig;
  customer?: Customer | null;
  customPriceLists: CustomPriceList[];
  channel: OrderChannel;
  quantity: number;
  invoiceDate?: string;
  manualOverrideUnitPrice?: number | null;
  isAuthenticatedWholesale?: boolean;
}): PriceResolutionResult {
  const {
    product,
    pricingConfig,
    customer,
    customPriceLists,
    channel,
    quantity,
    invoiceDate = '2026-10-18',
    manualOverrideUnitPrice,
    isAuthenticatedWholesale = false
  } = params;

  const trace: PriceCandidateStep[] = [];

  // Security Rule: Wholesale pricing must NEVER be exposed to unauthenticated retail visitors
  const isEligibleForB2BPricing =
    channel === 'wholesale' ||
    channel === 'pos' ||
    isAuthenticatedWholesale ||
    Boolean(customer && (customer.type === 'dealer' || customer.type === 'distributor'));

  let autoSelectedPrice: number | null = null;
  let autoSelectedSource: PriceSourceType = 'RETAIL_PRICE';
  let autoSelectedLabel = 'Standard Retail Price';

  // 1. Check Contract Price (with effective dates)
  if (isEligibleForB2BPricing && customer) {
    const matchingContract = pricingConfig.contractPrices.find((c) => {
      if (!c.isActive) return false;
      const inDateRange = invoiceDate >= c.effectiveFrom && invoiceDate <= c.effectiveTo;
      const matchesParty =
        (c.customerId && c.customerId === customer.id) ||
        (c.customerGroupId && c.customerGroupId === customer.customerGroupId);
      return inDateRange && matchesParty;
    });

    if (matchingContract) {
      trace.push({
        source: 'CONTRACT_PRICE',
        label: `Contract ${matchingContract.contractCode}`,
        eligible: true,
        candidatePrice: matchingContract.unitPrice,
        reason: `Active contract (${matchingContract.effectiveFrom} to ${matchingContract.effectiveTo}) for ${matchingContract.partyName}`
      });
      if (autoSelectedPrice === null) {
        autoSelectedPrice = matchingContract.unitPrice;
        autoSelectedSource = 'CONTRACT_PRICE';
        autoSelectedLabel = `Contract ${matchingContract.contractCode} (${matchingContract.effectiveFrom}–${matchingContract.effectiveTo})`;
      }
    } else {
      trace.push({
        source: 'CONTRACT_PRICE',
        label: 'Contract Price',
        eligible: false,
        reason: 'No active date-valid contract found for this party'
      });
    }
  }

  // 2. Check Customer-Specific Negotiated Price
  if (isEligibleForB2BPricing && customer) {
    const custRule = pricingConfig.customerSpecificPrices.find((r) => r.customerId === customer.id);
    if (custRule) {
      trace.push({
        source: 'CUSTOMER_SPECIFIC',
        label: 'Customer-Specific Rate',
        eligible: true,
        candidatePrice: custRule.unitPrice,
        reason: custRule.notes || `Standing negotiated rate for ${customer.name}`
      });
      if (autoSelectedPrice === null) {
        autoSelectedPrice = custRule.unitPrice;
        autoSelectedSource = 'CUSTOMER_SPECIFIC';
        autoSelectedLabel = `Customer-Specific Negotiated Rate (${customer.name})`;
      }
    } else {
      trace.push({
        source: 'CUSTOMER_SPECIFIC',
        label: 'Customer-Specific Rate',
        eligible: false,
        reason: 'No individual customer-specific rate configured'
      });
    }
  }

  // 3. Check Custom Price List (via Customer or Customer Group)
  if (isEligibleForB2BPricing && customer) {
    const priceList = customPriceLists.find(
      (pl) => pl.isActive && (pl.id === customer.priceListId || (customer.type === 'distributor' && pl.targetType === 'distributor'))
    );
    const listPrice = priceList?.productRates[product.id];
    if (priceList && listPrice !== undefined) {
      trace.push({
        source: 'CUSTOM_PRICE_LIST',
        label: priceList.name,
        eligible: true,
        candidatePrice: listPrice,
        reason: `Assigned price list ${priceList.code}`
      });
      if (autoSelectedPrice === null) {
        autoSelectedPrice = listPrice;
        autoSelectedSource = 'CUSTOM_PRICE_LIST';
        autoSelectedLabel = `${priceList.name} (${priceList.code})`;
      }
    } else {
      trace.push({
        source: 'CUSTOM_PRICE_LIST',
        label: 'Assigned Price List',
        eligible: false,
        reason: 'No custom price list rate matched'
      });
    }
  }

  // 4. Check Bulk Quantity Tiers
  if (isEligibleForB2BPricing) {
    const matchingTier = [...pricingConfig.bulkTiers]
      .sort((a, b) => b.minQty - a.minQty)
      .find((t) => quantity >= t.minQty && (!t.maxQty || quantity <= t.maxQty));

    if (matchingTier) {
      trace.push({
        source: 'BULK_QUANTITY_TIER',
        label: matchingTier.label,
        eligible: true,
        candidatePrice: matchingTier.unitPrice,
        reason: `Quantity ${quantity} matches tier (${matchingTier.minQty}${matchingTier.maxQty ? `–${matchingTier.maxQty}` : '+'} units)`
      });
      if (autoSelectedPrice === null || matchingTier.unitPrice < autoSelectedPrice) {
        autoSelectedPrice = matchingTier.unitPrice;
        autoSelectedSource = 'BULK_QUANTITY_TIER';
        autoSelectedLabel = `Bulk Tier: ${matchingTier.label}`;
      }
    } else {
      trace.push({
        source: 'BULK_QUANTITY_TIER',
        label: 'Bulk Quantity Tiers',
        eligible: false,
        reason: `Ordered qty (${quantity}) below minimum bulk tier (10+ units)`
      });
    }
  }

  // 5. Check Distributor / Dealer Role Tier
  if (isEligibleForB2BPricing && customer?.type === 'distributor') {
    trace.push({
      source: 'DISTRIBUTOR_PRICE',
      label: 'Distributor Price',
      eligible: true,
      candidatePrice: pricingConfig.distributorPrice,
      reason: 'Customer account classified as Regional Distributor'
    });
    if (autoSelectedPrice === null) {
      autoSelectedPrice = pricingConfig.distributorPrice;
      autoSelectedSource = 'DISTRIBUTOR_PRICE';
      autoSelectedLabel = 'Verified Distributor Tier Price';
    }
  } else if (isEligibleForB2BPricing && (customer?.type === 'dealer' || channel === 'wholesale')) {
    trace.push({
      source: 'DEALER_PRICE',
      label: 'Dealer Price',
      eligible: true,
      candidatePrice: pricingConfig.dealerPrice,
      reason: 'Approved Wholesale Dealer trade tier'
    });
    if (autoSelectedPrice === null) {
      autoSelectedPrice = pricingConfig.dealerPrice;
      autoSelectedSource = 'DEALER_PRICE';
      autoSelectedLabel = 'Approved Dealer Trade Price';
    }
  }

  // 6. Check Sales Channel Rule (e.g., POS walk-in discount)
  const channelRule = pricingConfig.channelRules.find((r) => r.channel === channel && r.active);
  if (channelRule) {
    const channelPrice = channelRule.unitPrice !== undefined
      ? channelRule.unitPrice
      : channelRule.discountPercentOffRetail
      ? Math.round(pricingConfig.retailPrice * (1 - channelRule.discountPercentOffRetail / 100))
      : pricingConfig.retailPrice;

    trace.push({
      source: 'CHANNEL_RULE',
      label: channelRule.label,
      eligible: true,
      candidatePrice: channelPrice,
      reason: `Active ${channel.toUpperCase()} channel pricing rule`
    });
    if (autoSelectedPrice === null && channel === 'pos') {
      autoSelectedPrice = channelPrice;
      autoSelectedSource = 'CHANNEL_RULE';
      autoSelectedLabel = channelRule.label;
    }
  }

  // 7. Check Promotional Sale Price (Retail Flash Sale)
  if (product.isFlashSale && pricingConfig.salePrice < pricingConfig.retailPrice) {
    trace.push({
      source: 'SALE_PRICE',
      label: 'Promotional Sale Price',
      eligible: true,
      candidatePrice: pricingConfig.salePrice,
      reason: `Active campaign / flash sale (${product.flashSaleDiscount || 5}% off)`
    });
    if (autoSelectedPrice === null) {
      autoSelectedPrice = pricingConfig.salePrice;
      autoSelectedSource = 'SALE_PRICE';
      autoSelectedLabel = 'Promotional Sale Price';
    }
  }

  // 8. Standard Retail Price & MRP Fallback
  trace.push({
    source: 'RETAIL_PRICE',
    label: 'Retail Selling Price',
    eligible: true,
    candidatePrice: pricingConfig.retailPrice,
    reason: `Standard D2C retail price (MRP: Rs. ${pricingConfig.mrp})`
  });

  if (autoSelectedPrice === null) {
    autoSelectedPrice = pricingConfig.retailPrice || pricingConfig.mrp;
    autoSelectedSource = pricingConfig.retailPrice ? 'RETAIL_PRICE' : 'MRP';
    autoSelectedLabel = pricingConfig.retailPrice ? 'Standard Retail Price' : 'Maximum Retail Price (MRP)';
  }

  // Apply Explicitly Stackable discount if configured and no manual override is active
  let stackedAutoPrice = autoSelectedPrice;
  let stackedLabel = autoSelectedLabel;
  if (
    pricingConfig.discountStackingMode === 'EXPLICITLY_STACKABLE' &&
    pricingConfig.stackablePromoDiscountPercent &&
    pricingConfig.stackablePromoDiscountPercent > 0 &&
    quantity >= 25 &&
    isEligibleForB2BPricing
  ) {
    const discounted = Math.round(autoSelectedPrice * (1 - pricingConfig.stackablePromoDiscountPercent / 100));
    stackedAutoPrice = Math.max(pricingConfig.internalMinPrice, discounted);
    stackedLabel = `${autoSelectedLabel} + Stackable ${pricingConfig.stackablePromoDiscountPercent}% Volume Rebate`;
  }

  // 9. Check Authorized Invoice-Time Price Override (Priority #1)
  const hasManualOverride =
    manualOverrideUnitPrice !== undefined &&
    manualOverrideUnitPrice !== null &&
    !Number.isNaN(manualOverrideUnitPrice) &&
    Number(manualOverrideUnitPrice) !== stackedAutoPrice;

  const finalUnitPrice = hasManualOverride ? Number(manualOverrideUnitPrice) : stackedAutoPrice;
  const finalPriceSource: PriceSourceType = hasManualOverride ? 'INVOICE_OVERRIDE' : autoSelectedSource;
  const finalSourceLabel = hasManualOverride
    ? `Authorized Invoice Override (Auto was Rs. ${stackedAutoPrice} via ${autoSelectedSource})`
    : stackedLabel;

  if (hasManualOverride) {
    trace.unshift({
      source: 'INVOICE_OVERRIDE',
      label: 'Invoice-Time Manual Override',
      eligible: true,
      candidatePrice: finalUnitPrice,
      reason: `Overridden from Rs. ${stackedAutoPrice} to Rs. ${finalUnitPrice} (Invoice-scoped only; global price untouched)`
    });
  }

  // Floor & Approval Validation
  const requiresManagerApproval =
    hasManualOverride && finalUnitPrice < pricingConfig.staffApprovalLimitPrice;
  const breachesInternalFloor =
    hasManualOverride && finalUnitPrice < pricingConfig.internalMinPrice;
  const approvalReasonRequired = hasManualOverride;

  // Tax Inclusion or Exclusion Calculation (13% Nepal VAT)
  const taxRate = pricingConfig.taxRatePercent / 100;
  let netUnitPriceExclTax = finalUnitPrice;
  let unitTaxAmount = 0;
  let grossUnitPriceInclTax = finalUnitPrice;

  if (pricingConfig.taxSetting === 'inclusive') {
    netUnitPriceExclTax = Number((finalUnitPrice / (1 + taxRate)).toFixed(2));
    unitTaxAmount = Number((finalUnitPrice - netUnitPriceExclTax).toFixed(2));
    grossUnitPriceInclTax = finalUnitPrice;
  } else {
    netUnitPriceExclTax = finalUnitPrice;
    unitTaxAmount = Number((finalUnitPrice * taxRate).toFixed(2));
    grossUnitPriceInclTax = Number((finalUnitPrice + unitTaxAmount).toFixed(2));
  }

  const lineSubtotalExclTax = Number((netUnitPriceExclTax * quantity).toFixed(2));
  const lineTaxAmount = Number((unitTaxAmount * quantity).toFixed(2));
  const lineTotalInclTax = Number((grossUnitPriceInclTax * quantity).toFixed(2));

  return {
    productId: product.id,
    quantity,
    channel,
    customerId: customer?.id,
    autoSelectedPrice: stackedAutoPrice,
    autoSelectedSource,
    autoSelectedLabel: stackedLabel,
    finalUnitPrice,
    finalPriceSource,
    finalSourceLabel,
    taxSetting: pricingConfig.taxSetting,
    taxRatePercent: pricingConfig.taxRatePercent,
    netUnitPriceExclTax,
    unitTaxAmount,
    grossUnitPriceInclTax,
    lineSubtotalExclTax,
    lineTaxAmount,
    lineTotalInclTax,
    internalMinPrice: pricingConfig.internalMinPrice,
    staffApprovalLimitPrice: pricingConfig.staffApprovalLimitPrice,
    requiresManagerApproval,
    breachesInternalFloor,
    approvalReasonRequired,
    precedenceTrace: trace
  };
}

export function createImmutablePriceSnapshot(params: {
  pricingConfig: ProductPricingConfig;
  resolution: PriceResolutionResult;
  overrideReason?: string;
  overriddenByStaffId?: string;
  overriddenByStaffName?: string;
  approvedByManagerId?: string;
  approvedByManagerName?: string;
}): ImmutablePriceSnapshot {
  const {
    pricingConfig,
    resolution,
    overrideReason,
    overriddenByStaffId,
    overriddenByStaffName,
    approvedByManagerId,
    approvedByManagerName
  } = params;

  const isOverridden = resolution.finalPriceSource === 'INVOICE_OVERRIDE';
  const nowIso = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kathmandu' });

  return {
    capturedAt: nowIso,
    mrpAtSale: pricingConfig.mrp,
    retailPriceAtSale: pricingConfig.retailPrice,
    salePriceAtSale: pricingConfig.salePrice,
    dealerPriceAtSale: pricingConfig.dealerPrice,
    distributorPriceAtSale: pricingConfig.distributorPrice,
    internalMinPriceAtSale: pricingConfig.internalMinPrice,
    staffApprovalLimitAtSale: pricingConfig.staffApprovalLimitPrice,
    autoSelectedPrice: resolution.autoSelectedPrice,
    autoSelectedSource: resolution.autoSelectedSource,
    finalUnitPrice: resolution.finalUnitPrice,
    finalPriceSource: resolution.finalPriceSource,
    taxSetting: resolution.taxSetting,
    taxRatePercent: resolution.taxRatePercent,
    netUnitPriceExclTax: resolution.netUnitPriceExclTax,
    unitTaxAmount: resolution.unitTaxAmount,
    grossUnitPriceInclTax: resolution.grossUnitPriceInclTax,
    isOverridden,
    overrideReason: isOverridden ? overrideReason : undefined,
    overriddenByStaffId: isOverridden ? overriddenByStaffId : undefined,
    overriddenByStaffName: isOverridden ? overriddenByStaffName : undefined,
    approvedByManagerId: isOverridden ? approvedByManagerId : undefined,
    approvedByManagerName: isOverridden ? approvedByManagerName : undefined,
    approvedAt: isOverridden && approvedByManagerName ? nowIso : undefined
  };
}
