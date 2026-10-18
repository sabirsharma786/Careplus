import {
  PurchaseBill,
  ExpenseVoucher,
  TreasuryAccount,
  TreasuryTransaction,
  LogisticsCarrier,
  PickupBranch,
  CouponCampaign,
  UrlRedirectRule,
  AyurvedaBlogArticle
} from '../types';

export const INITIAL_PURCHASE_BILLS: PurchaseBill[] = [
  {
    id: 'pur-2083-01',
    billNumber: 'PB-DOLPA-2083-104',
    supplierName: 'Dolpa High-Altitude Herb Collectors Co-op',
    supplierPan: '601994821',
    supplierPhone: '+977-9848312099',
    originRegion: 'Dunai, Dolpa (4,100m Harvest Zone)',
    date: '2026-10-14',
    dueDate: '2026-11-13',
    productId: 'prod-shilajit-resin',
    productName: 'Pure Himalayan Shilajit Gold Resin (20g)',
    batchNumberGenerated: 'SHL-2083-DLP11',
    quantityReceived: 120,
    unitCost: 820,
    subtotal: 98400,
    vatAmount: 12792,
    totalAmount: 111192,
    paidAmount: 25000,
    balancePayable: 86192,
    status: 'partial',
    qaAssayCertificate: 'DDA-ASSAY-8841-PASS (Fulvic 76.8%)'
  },
  {
    id: 'pur-2083-02',
    billNumber: 'PB-MANANG-2083-109',
    supplierName: 'Manang Annapurna Botanicals Pvt. Ltd.',
    supplierPan: '604221908',
    supplierPhone: '+977-9856028411',
    originRegion: 'Chame, Manang District',
    date: '2026-10-16',
    dueDate: '2026-11-15',
    productId: 'prod-cordyceps-yarsa',
    productName: 'Yarsagumba & Cordyceps Vitality Extract',
    batchNumberGenerated: 'YRS-2083-MNG04',
    quantityReceived: 45,
    unitCost: 1950,
    subtotal: 87750,
    vatAmount: 11408,
    totalAmount: 99158,
    paidAmount: 18239.52,
    balancePayable: 80918.48,
    status: 'partial',
    qaAssayCertificate: 'DDA-ASSAY-8912-PASS (Cordycepin 4.2%)'
  },
  {
    id: 'pur-2083-03',
    billNumber: 'PB-GORKHA-2083-112',
    supplierName: 'Gorkha Amla & Ashtavarga Processing Mill',
    supplierPan: '607819330',
    supplierPhone: '+977-9841772019',
    originRegion: 'Palungtar, Gorkha',
    date: '2026-10-17',
    dueDate: '2026-11-16',
    productId: 'prod-chyawanprash-gold',
    productName: 'Swarna Siddha Chyawanprash Lehyam (500g)',
    batchNumberGenerated: 'CHY-2083-GRK09',
    quantityReceived: 16,
    unitCost: 634.48,
    subtotal: 10151.79,
    vatAmount: 1319.73,
    totalAmount: 11471.52,
    paidAmount: 0,
    balancePayable: 11471.52,
    status: 'unpaid',
    qaAssayCertificate: 'DDA-ASSAY-8955-PASS (Heavy Metal Negative)'
  }
];

export const INITIAL_EXPENSE_VOUCHERS: ExpenseVoucher[] = [
  {
    id: 'exp-2083-01',
    voucherNumber: 'EXP-2083-0419',
    date: '2026-10-17',
    category: 'DDA Lab Assay Testing',
    payeeName: 'National Medicines Laboratory (DDA Babarmahal)',
    description: 'ICP-MS Heavy Metal & Fulvic Acid Spectral Assay for Dolpa Shilajit Batch #SHL-2083-DLP11',
    amount: 3200,
    vatIncluded: 368.14,
    paidFromAccountId: 'acc-operating-01',
    paidFromAccountName: 'Careplus Nepal Pvt Ltd (Primary Operating)',
    approvedBy: 'Suman Vaidya (superadmin)',
    status: 'paid'
  },
  {
    id: 'exp-2083-02',
    voucherNumber: 'EXP-2083-0420',
    date: '2026-10-17',
    category: 'Cold-Chain Logistics',
    payeeName: 'Upaya Cold-Chain Cargo Services',
    description: 'Insulated gel-pack air freight dispatch from Pokhara Airport to Baluwatar Central Hub',
    amount: 1800,
    vatIncluded: 207.08,
    paidFromAccountId: 'acc-operating-01',
    paidFromAccountName: 'Careplus Nepal Pvt Ltd (Primary Operating)',
    approvedBy: 'Suman Vaidya (superadmin)',
    status: 'paid'
  }
];

export const INITIAL_TREASURY_ACCOUNTS: TreasuryAccount[] = [
  {
    id: 'acc-operating-01',
    name: 'Careplus Nepal Pvt Ltd',
    accountType: 'bank_operating',
    bankName: 'Nabil Bank Ltd. (Teendhara Corporate Branch)',
    accountNumber: '0110017504921',
    balance: 1341.0,
    currency: 'NPR',
    lastReconciledAt: '2026-10-18 07:45 AM'
  },
  {
    id: 'acc-settlement-02',
    name: 'Careplus Nepal Pvt Ltd (Settlement OD)',
    accountType: 'bank_od',
    bankName: 'Global IME Bank Ltd. (Panipokhari)',
    accountNumber: '0701010008419',
    balance: -2000.0,
    currency: 'NPR',
    lastReconciledAt: '2026-10-18 07:45 AM'
  },
  {
    id: 'acc-credit-03',
    name: 'Bank Account (Corporate Credit Facility)',
    accountType: 'credit_facility',
    bankName: 'Nepal Investment Mega Bank (Working Capital Line)',
    accountNumber: 'TR-OD-00491822',
    balance: -11605.0,
    currency: 'NPR',
    lastReconciledAt: '2026-10-18 07:45 AM'
  },
  {
    id: 'acc-cash-04',
    name: 'cash account',
    accountType: 'cash_vault',
    bankName: 'Baluwatar Central Hub Physical Safe',
    accountNumber: 'VAULT-KTM-01',
    balance: 0.0,
    currency: 'NPR',
    lastReconciledAt: '2026-10-18 08:00 AM'
  }
];

export const INITIAL_TREASURY_TRANSACTIONS: TreasuryTransaction[] = [
  {
    id: 'trn-2083-01',
    date: '2026-10-17 16:40',
    type: 'receipt',
    toAccountName: 'Careplus Nepal Pvt Ltd',
    referenceNumber: 'NCHL-IPS-994812',
    partyName: 'Himalayan Aushadhi Kendra (Bishal Pokharel)',
    amount: 24500,
    description: 'Part settlement against wholesale invoice CP-TI-2083-0912',
    recordedBy: 'Suman Vaidya'
  },
  {
    id: 'trn-2083-02',
    date: '2026-10-17 14:15',
    type: 'payment',
    fromAccountName: 'Careplus Nepal Pvt Ltd',
    referenceNumber: 'EXP-2083-0419',
    partyName: 'National Medicines Laboratory (DDA)',
    amount: 3200,
    description: 'Heavy metal & Fulvic acid batch assay fee',
    recordedBy: 'Suman Vaidya'
  },
  {
    id: 'trn-2083-03',
    date: '2026-10-17 11:20',
    type: 'payment',
    fromAccountName: 'Bank Account (Corporate Credit Facility)',
    referenceNumber: 'PB-MANANG-2083-109',
    partyName: 'Manang Annapurna Botanicals Pvt. Ltd.',
    amount: 18239.52,
    description: 'Advance settlement for Yarsagumba batch #YRS-2083-MNG04',
    recordedBy: 'Suman Vaidya'
  }
];

export const INITIAL_CARRIERS: LogisticsCarrier[] = [
  {
    id: 'car-upaya',
    name: 'Upaya City Cargo (B2B Pallet & Cold-Chain)',
    code: 'UPAYA-B2B',
    serviceType: 'B2B Heavy Cargo',
    contactPerson: 'Ramesh Thapa (Fleet Supervisor)',
    phone: '+977-9801844210',
    codCommissionPercent: 0.5,
    baseRateNpr: 350,
    activeShipments: 4,
    onTimeRatePercent: 98.4,
    isActive: true
  },
  {
    id: 'car-ncm',
    name: 'Nepal Can Move (NCM National Express)',
    code: 'NCM-NAT',
    serviceType: 'National Surface & Air',
    contactPerson: 'Dipendra Karki (Tinkune Hub)',
    phone: '+977-01-5199680',
    codCommissionPercent: 1.5,
    baseRateNpr: 150,
    activeShipments: 12,
    onTimeRatePercent: 95.8,
    isActive: true
  },
  {
    id: 'car-pathao',
    name: 'Pathao Parcel & CarePlus Valley Riders',
    code: 'PTH-VALLEY',
    serviceType: 'Valley Same-Day Rider',
    contactPerson: 'Sujan Maharjan (Baluwatar Dispatch)',
    phone: '+977-9841229011',
    codCommissionPercent: 1.0,
    baseRateNpr: 95,
    activeShipments: 9,
    onTimeRatePercent: 99.1,
    isActive: true
  }
];

export const INITIAL_PICKUP_BRANCHES: PickupBranch[] = [
  {
    id: 'br-baluwatar',
    name: 'Baluwatar-04 Central Flagship Dispensary & Hub',
    code: 'KTM-HQ-01',
    province: 'Bagmati Province',
    city: 'Kathmandu',
    address: 'Thirbam Sadak, Baluwatar-04 (Near Nepal Rastra Bank)',
    managerName: 'Dr. Suman Vaidya',
    phone: '+977-01-4429810',
    openingHours: '07:30 AM – 08:00 PM (Sun–Fri)',
    posTerminalsCount: 3,
    activeStockUnits: 1480,
    isColdStorageEquipped: true,
    status: 'operational'
  },
  {
    id: 'br-kumaripati',
    name: 'Kumaripati Patan Ayurvedic Clinic & Pickup Point',
    code: 'LAL-KMP-02',
    province: 'Bagmati Province',
    city: 'Lalitpur',
    address: 'Kumaripati Main Road, Opposite St. Xavier School',
    managerName: 'Prativa Shakya',
    phone: '+977-01-5538219',
    openingHours: '08:30 AM – 07:30 PM (Sun–Fri)',
    posTerminalsCount: 2,
    activeStockUnits: 640,
    isColdStorageEquipped: true,
    status: 'operational'
  },
  {
    id: 'br-biratnagar',
    name: 'Hospital Chowk Eastern Wholesale Depot',
    code: 'KOS-BRT-03',
    province: 'Koshi Province',
    city: 'Biratnagar',
    address: 'Hospital Chowk, Rangeli Road, Biratnagar-09',
    managerName: 'Nabin Agrawal',
    phone: '+977-021-534912',
    openingHours: '09:00 AM – 07:00 PM (Sun–Fri)',
    posTerminalsCount: 2,
    activeStockUnits: 920,
    isColdStorageEquipped: false,
    status: 'operational'
  },
  {
    id: 'br-pokhara',
    name: 'New Road Gandaki Wellness & Trade Center',
    code: 'GND-PKR-04',
    province: 'Gandaki Province',
    city: 'Pokhara',
    address: 'New Road, Sabhagriha Chowk, Pokhara-08',
    managerName: 'Bिकास Gurung',
    phone: '+977-061-541209',
    openingHours: '08:30 AM – 07:30 PM (Sun–Fri)',
    posTerminalsCount: 1,
    activeStockUnits: 510,
    isColdStorageEquipped: true,
    status: 'operational'
  }
];

export const INITIAL_COUPONS: CouponCampaign[] = [
  {
    id: 'cpn-ritu20',
    code: 'RITU20',
    title: 'Sharad-Hemanta Seasonal Immunity 20% Off',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 2500,
    maxDiscountAmount: 1200,
    eligibleChannel: 'retail',
    isStackableWithSalePrice: false,
    usageCount: 142,
    usageLimit: 500,
    validUntil: '2026-12-31',
    isActive: true
  },
  {
    id: 'cpn-shilajit450',
    code: 'SHILAJIT450',
    title: 'Rs. 450 Direct Rebate on Pure Dolpa Shilajit Resin',
    discountType: 'fixed_amount',
    discountValue: 450,
    minOrderAmount: 3000,
    eligibleChannel: 'all',
    isStackableWithSalePrice: true,
    usageCount: 89,
    usageLimit: 300,
    validUntil: '2026-11-30',
    isActive: true
  },
  {
    id: 'cpn-dealerbulk5',
    code: 'DEALERBULK5',
    title: 'B2B Dealer Extra 5% Early Settlement Rebate',
    discountType: 'percentage',
    discountValue: 5,
    minOrderAmount: 50000,
    maxDiscountAmount: 5000,
    eligibleChannel: 'wholesale',
    isStackableWithSalePrice: true,
    usageCount: 18,
    usageLimit: 100,
    validUntil: '2026-12-31',
    isActive: true
  }
];

export const INITIAL_REDIRECTS: UrlRedirectRule[] = [
  {
    id: 'red-01',
    sourcePath: '/products/old-shilajit-gold-15g',
    targetPath: '/product/prod-shilajit-resin',
    redirectType: 301,
    reason: 'Upgraded to 20g UV-Violet Miron Glass Jar SKU',
    hitsCount: 1284,
    lastTriggeredAt: '2026-10-18 07:52 AM',
    isActive: true
  },
  {
    id: 'red-02',
    sourcePath: '/b2b-dealer-login',
    targetPath: '/wholesale-portal',
    redirectType: 301,
    reason: 'Legacy dealer catalog URL migrated to Quark Wholesale Portal',
    hitsCount: 642,
    lastTriggeredAt: '2026-10-18 08:01 AM',
    isActive: true
  },
  {
    id: 'red-03',
    sourcePath: '/dashain-tihar-offer',
    targetPath: '/?campaign=RITU20',
    redirectType: 302,
    reason: 'Seasonal Ritucharya campaign landing redirect',
    hitsCount: 3190,
    lastTriggeredAt: '2026-10-18 08:04 AM',
    isActive: true
  }
];

export const INITIAL_BLOG_ARTICLES: AyurvedaBlogArticle[] = [
  {
    id: 'blg-01',
    slug: 'dolpa-surya-tapi-shilajit-fulvic-assay-guide',
    title: 'Why Surya-Tapi (Sun-Cured) Dolpa Shilajit Outperforms Heat-Boiled Extracts',
    nepaliTitle: 'डोल्पाको सूर्य-तापी शिलाजीत र फुलभिक एसिडको वैज्ञानिक विश्लेषण',
    authorVaidya: 'Dr. Suman Vaidya (BAMS, MD Ayurveda)',
    category: 'Quality & Lab Testing',
    readTimeMinutes: 6,
    publishedAt: '2026-10-10',
    viewsCount: 4820,
    featuredProductId: 'prod-shilajit-resin',
    status: 'published',
    excerpt: 'Clinical comparison of 45-day solar-cured Himalayan mineral pitch versus commercial boiler-evaporated resins, with ICP-MS heavy metal safety benchmarks.'
  },
  {
    id: 'blg-02',
    slug: 'hemanta-ritucharya-immunity-chyawanprash',
    title: 'Hemanta Ritucharya: Preparing Respiratory Ojas for Nepal’s Autumn-Winter Transition',
    nepaliTitle: 'हेमन्त ऋतुचर्या: चिसो मौसममा रोग प्रतिरोधात्मक क्षमता (ओजस) बढाउने विधि',
    authorVaidya: 'Kabiraj Bikram Acharya',
    category: 'Seasonal Ritucharya',
    readTimeMinutes: 5,
    publishedAt: '2026-10-14',
    viewsCount: 3190,
    featuredProductId: 'prod-chyawanprash-gold',
    status: 'published',
    excerpt: 'How wild Gorkha Amla, Pippali, and Swarna Bhasma synergize to protect bronchial mucosa during Kathmandu Valley temperature inversions.'
  },
  {
    id: 'blg-03',
    slug: 'ksm66-ashwagandha-cortisol-sleep-protocol',
    title: 'Clinical Dosing of Root-Only Ashwagandha for High-Stress Professionals',
    nepaliTitle: 'मानसिक तनाव र अनिद्रामा अश्वगन्धा मूल-अर्कको क्लिनिकल प्रयोग',
    authorVaidya: 'Dr. Suman Vaidya (BAMS, MD Ayurveda)',
    category: 'Clinical Formulation',
    readTimeMinutes: 7,
    publishedAt: '2026-10-16',
    viewsCount: 2745,
    featuredProductId: 'prod-ashwagandha-ksm66',
    status: 'published',
    excerpt: 'Why standardized 5% withanolide root-only extraction avoids leaf-cytotoxic withaferin-A while restoring deep slow-wave sleep.'
  }
];
