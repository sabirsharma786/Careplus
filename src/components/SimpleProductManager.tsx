import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
  Upload,
  CheckCircle2,
  Edit3,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Package,
  SlidersHorizontal,
  Layers,
  Zap,
  Copy,
  RotateCcw
} from 'lucide-react';
import { appStore } from '../services/store';
import { CATEGORIES } from '../services/mockData';
import { Product } from '../types';

interface SimpleProductManagerProps {
  onNavigateSection?: (section: any, productId?: string) => void;
}

const PRESET_PRODUCT_IMAGES = [
  {
    label: 'Shilajit / Resin Jar',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&h=600&q=80'
  },
  {
    label: 'Herbal Capsules',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&h=600&q=80'
  },
  {
    label: 'Ayurvedic Dropper / Oil',
    url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&h=600&q=80'
  },
  {
    label: 'Botanical Elixir / Ras',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&h=600&q=80'
  },
  {
    label: 'Skincare / Kumkumadi',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&h=600&q=80'
  },
  {
    label: 'Herbal Churna / Powder',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&h=600&q=80'
  }
];

const PACK_SIZE_PRESETS = [
  '60 Veggie Capsules',
  '30g Glass Jar',
  '100ml Bottle',
  '500ml Bottle',
  '200g Herbal Pack',
  '30ml Dropper'
];

export const SimpleProductManager: React.FC<SimpleProductManagerProps> = ({
  onNavigateSection
}) => {
  const products = appStore.getProducts();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form Mode: 'simple' (5 quick fields) or 'advanced' (includes B2B dealer tiers, Nepali name, DDA)
  const [formMode, setFormMode] = useState<'simple' | 'advanced'>('simple');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Essential Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('herbal-supplements');
  const [subcategory, setSubcategory] = useState('Daily Wellness');
  const [packSize, setPackSize] = useState('60 Veggie Capsules');
  const [retailPrice, setRetailPrice] = useState<number>(1250);
  const [mrp, setMrp] = useState<number>(1600);
  const [stock, setStock] = useState<number>(100);
  const [imageUrl, setImageUrl] = useState<string>(PRESET_PRODUCT_IMAGES[0].url);
  const [description, setDescription] = useState('');
  const [benefitsText, setBenefitsText] = useState(
    'Boosts Daily Immunity & Stamina, 100% Pure Himalayan Herbs, Lab Tested & DDA Certified'
  );

  // Optional / Advanced Fields (auto-calculated if left untouched in Simple Mode)
  const [nepaliName, setNepaliName] = useState('');
  const [sku, setSku] = useState('');
  const [dealerPrice, setDealerPrice] = useState<number>(0);
  const [distributorPrice, setDistributorPrice] = useState<number>(0);
  const [ddaRegNo, setDdaRegNo] = useState('DDA-AY-2083/108');
  const [usageInstructions, setUsageInstructions] = useState(
    'Take 1–2 capsules or 1 teaspoon twice daily with warm water or milk after meals.'
  );
  const [ingredientsText, setIngredientsText] = useState(
    'Standardized Himalayan Botanical Extract, Organic Herbal Base'
  );
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [flashSaleDiscount, setFlashSaleDiscount] = useState(15);

  // Catalog Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 5000);
  };

  // Auto-computed B2B rates when in Simple Mode
  const effectiveMrp = mrp >= retailPrice ? mrp : Math.round(retailPrice * 1.25);
  const effectiveDealerPrice =
    dealerPrice > 0 ? dealerPrice : Math.round(retailPrice * 0.76);
  const effectiveDistributorPrice =
    distributorPrice > 0 ? distributorPrice : Math.round(retailPrice * 0.66);
  const discountPercent =
    effectiveMrp > retailPrice
      ? Math.round(((effectiveMrp - retailPrice) / effectiveMrp) * 100)
      : 0;

  const resetForm = () => {
    setEditingProductId(null);
    setName('');
    setNepaliName('');
    setCategory('herbal-supplements');
    setSubcategory('Daily Wellness');
    setPackSize('60 Veggie Capsules');
    setRetailPrice(1250);
    setMrp(1600);
    setStock(100);
    setDealerPrice(0);
    setDistributorPrice(0);
    setSku('');
    setImageUrl(PRESET_PRODUCT_IMAGES[0].url);
    setDescription('');
    setBenefitsText(
      'Boosts Daily Immunity & Stamina, 100% Pure Himalayan Herbs, Lab Tested & DDA Certified'
    );
    setIsFlashSale(false);
    setFlashSaleDiscount(15);
  };

  const handleFillSampleProduct = () => {
    const rand = Math.floor(100 + Math.random() * 900);
    setEditingProductId(null);
    setName(`CarePlus Himalayan Moringa & Spirulina Superfood (${rand})`);
    setNepaliName('हिमालयन शितलचिनी (मोरिंगा) र स्पिरुलिना सुपरफुड');
    setCategory('herbal-supplements');
    setSubcategory('Superfood & Nutrition');
    setPackSize('60 Veggie Capsules');
    setRetailPrice(1190);
    setMrp(1550);
    setDealerPrice(890);
    setDistributorPrice(780);
    setStock(120);
    setSku(`CP-MOR-${rand}`);
    setImageUrl(PRESET_PRODUCT_IMAGES[1].url);
    setDescription(
      'Organic Terai Moringa oleifera leaf combined with high-protein Spirulina. Packed with plant iron, chlorophyll, calcium, and essential amino acids for all-day cellular vitality.'
    );
    setBenefitsText(
      'Rich in Plant Iron & Multivitamins, Supports Healthy Energy & Digestion, Strengthens Immunity & Bone Density'
    );
    setIsFlashSale(true);
    setFlashSaleDiscount(20);
  };

  const handleLoadProductForEdit = (prod: Product) => {
    setEditingProductId(prod.id);
    setName(prod.name);
    setNepaliName(prod.nepaliName || '');
    setCategory(prod.category);
    setSubcategory(prod.subcategory || 'Daily Wellness');
    setPackSize(prod.packSize);
    setRetailPrice(prod.retailPrice);
    setMrp(prod.mrp);
    setDealerPrice(prod.dealerPrice);
    setDistributorPrice(prod.distributorPrice);
    setStock(prod.stock);
    setSku(prod.sku);
    setDdaRegNo(prod.ddaRegNo || 'DDA-AY-2083/108');
    setImageUrl(prod.images[0] || PRESET_PRODUCT_IMAGES[0].url);
    setDescription(prod.description);
    setBenefitsText((prod.benefits || []).join(', '));
    setIngredientsText((prod.ingredients || []).join(', '));
    setUsageInstructions(prod.usageInstructions || '');
    setIsFlashSale(Boolean(prod.isFlashSale));
    setFlashSaleDiscount(prod.flashSaleDiscount || 15);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cleanName = name.trim();
    const generatedSku =
      sku.trim() ||
      `CP-${cleanName
        .replace(/[^a-zA-Z]/g, '')
        .slice(0, 3)
        .toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const parsedBenefits = benefitsText
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    const parsedIngredients = ingredientsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const finalFloorPrice = Math.round(effectiveDistributorPrice * 0.9);

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      const updatedProduct: Product = {
        ...(existing || ({} as Product)),
        id: editingProductId,
        sku: generatedSku,
        barcode: existing?.barcode || `89012345${Math.floor(1000 + Math.random() * 9000)}`,
        name: cleanName,
        nepaliName: nepaliName.trim() || cleanName,
        category,
        subcategory: subcategory.trim() || 'Ayurvedic Formulation',
        packSize: packSize.trim() || 'Standard Pack',
        mrp: effectiveMrp,
        retailPrice: Number(retailPrice),
        salePrice: Number(retailPrice),
        dealerPrice: effectiveDealerPrice,
        distributorPrice: effectiveDistributorPrice,
        minApprovalFloorPrice: finalFloorPrice,
        stock: Number(stock),
        images: [imageUrl.trim() || PRESET_PRODUCT_IMAGES[0].url],
        description:
          description.trim() ||
          `${cleanName} — Authentic Himalayan Ayurvedic formulation crafted under GMP & Nepal DDA quality standards.`,
        nepaliDescription:
          existing?.nepaliDescription ||
          `${nepaliName.trim() || cleanName} — १००% प्राकृतिक र आयुर्वेदिक जडीबुटीबाट निर्मित।`,
        benefits:
          parsedBenefits.length > 0
            ? parsedBenefits
            : ['100% Pure Himalayan Herbs', 'GMP & DDA Certified Quality'],
        ingredients:
          parsedIngredients.length > 0
            ? parsedIngredients
            : ['Standardized Ayurvedic Herbal Extract'],
        ddaRegNo: ddaRegNo.trim() || 'DDA-AY-2083/108',
        usageInstructions:
          usageInstructions.trim() || 'Use as directed by an Ayurvedic physician.',
        rating: existing?.rating || 4.9,
        reviewsCount: existing?.reviewsCount || 24,
        isNewArrival: true,
        isFlashSale,
        flashSaleDiscount: isFlashSale ? flashSaleDiscount : undefined,
        flashSaleEndsAt: isFlashSale ? '2026-10-30T23:59:59' : undefined
      };

      appStore.updateProduct(updatedProduct, 'superadmin');
      showToast(`Updated "${updatedProduct.name}" — changes are live on the storefront!`);
      resetForm();
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        sku: generatedSku,
        barcode: `89012345${Math.floor(1000 + Math.random() * 9000)}`,
        name: cleanName,
        nepaliName: nepaliName.trim() || cleanName,
        category,
        subcategory: subcategory.trim() || 'Ayurvedic Wellness',
        packSize: packSize.trim() || '60 Capsules',
        mrp: effectiveMrp,
        retailPrice: Number(retailPrice),
        salePrice: Number(retailPrice),
        dealerPrice: effectiveDealerPrice,
        distributorPrice: effectiveDistributorPrice,
        minApprovalFloorPrice: finalFloorPrice,
        stock: Number(stock),
        images: [imageUrl.trim() || PRESET_PRODUCT_IMAGES[0].url],
        description:
          description.trim() ||
          `${cleanName} — Authentic Himalayan Ayurvedic formulation crafted under GMP & Nepal DDA quality standards.`,
        nepaliDescription: `${nepaliName.trim() || cleanName} — १००% प्राकृतिक र आयुर्वेदिक जडीबुटीबाट निर्मित।`,
        benefits:
          parsedBenefits.length > 0
            ? parsedBenefits
            : ['100% Pure Himalayan Herbs', 'GMP & DDA Certified Quality'],
        ingredients:
          parsedIngredients.length > 0
            ? parsedIngredients
            : ['Standardized Ayurvedic Herbal Extract'],
        ddaRegNo: ddaRegNo.trim() || 'DDA-AY-2083/108',
        usageInstructions:
          usageInstructions.trim() || 'Take twice daily after meals with warm water.',
        rating: 4.9,
        reviewsCount: 18,
        isNewArrival: true,
        isTrending: true,
        isFlashSale,
        flashSaleDiscount: isFlashSale ? flashSaleDiscount : undefined,
        flashSaleEndsAt: isFlashSale ? '2026-10-30T23:59:59' : undefined
      };

      appStore.addNewProduct(newProduct, 'superadmin');
      showToast(
        `Added "${newProduct.name}" (Rs. ${newProduct.retailPrice})! It is now live on the Storefront & Wholesale Catalog.`
      );
      resetForm();
    }
  };

  const filteredProducts = products
    .filter((p) => (categoryFilter === 'all' ? true : p.category === categoryFilter))
    .filter(
      (p) =>
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nepaliName || '').includes(searchQuery)
    );

  const selectedCategoryObj =
    CATEGORIES.find((c) => c.id === category) || CATEGORIES[1];

  return (
    <div className="space-y-6">
      {/* Top Banner Notification */}
      {saveBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-semibold flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#058852] shrink-0" />
            <span>{saveBanner}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => appStore.setCurrentView('store')}
              className="px-3 py-1.5 rounded-lg bg-[#058852] text-white text-xs font-bold cursor-pointer"
            >
              View on Storefront →
            </button>
            <button
              type="button"
              onClick={() => setSaveBanner(null)}
              className="px-2.5 py-1.5 rounded-lg text-emerald-800 hover:bg-emerald-100 text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          1. EASY PRODUCT CREATOR & EDITOR CARD
         ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Card Header Bar */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#058852] text-white flex items-center justify-center shadow-2xs">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {editingProductId ? 'Edit Product Details' : 'Quick Add New Product'}
              </h2>
              <p className="text-xs text-slate-500">
                {editingProductId
                  ? 'Update product name, photo, price, or stock and click Save Changes.'
                  : 'Enter product name, price, stock, and photo — wholesale tiers & warehouse batches are configured automatically.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleFillSampleProduct}
              className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-[#058852] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Auto-Fill Sample Product</span>
            </button>

            {editingProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel Edit</span>
              </button>
            )}

            {/* Simple vs Full Mode Switch */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setFormMode('simple')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  formMode === 'simple'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Simple Mode
              </button>
              <button
                type="button"
                onClick={() => setFormMode('advanced')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  formMode === 'advanced'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + B2B & Full Options
              </button>
            </div>
          </div>
        </div>

        {/* Form Body + Live Storefront Preview */}
        <form onSubmit={handleSaveProduct} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Columns: Clean Step-by-Step Inputs */}
          <div className="lg:col-span-8 space-y-5">
            {/* Row 1: Product Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-7">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., CarePlus Himalayan Pure Shilajit Gold"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#058852] focus:outline-none text-sm font-medium text-slate-900"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Store Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#058852] focus:outline-none text-sm font-semibold text-slate-800 bg-white"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.nepaliName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Selling Price, MRP, Stock, Pack Size */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-200/80">
              <div>
                <label className="block text-xs font-bold text-[#058852] mb-1">
                  3. Selling Price (Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={retailPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRetailPrice(val);
                    if (mrp < val) setMrp(Math.round(val * 1.25));
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-300 bg-white font-mono font-bold text-sm text-[#058852]"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Customer pays this price
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4. MRP / Crossed Price
                </label>
                <input
                  type="number"
                  min={1}
                  value={mrp}
                  onChange={(e) => setMrp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-semibold text-sm text-slate-700"
                />
                <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                  {discountPercent > 0 ? `Shows ${discountPercent}% OFF badge` : 'No discount badge'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  5. Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold text-sm text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Units ready to sell
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  6. Pack Size / Unit
                </label>
                <input
                  type="text"
                  value={packSize}
                  onChange={(e) => setPackSize(e.target.value)}
                  placeholder="e.g. 60 Capsules"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {PACK_SIZE_PRESETS.slice(0, 3).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPackSize(preset)}
                      className="text-[10px] text-[#058852] hover:underline cursor-pointer"
                    >
                      {preset.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Easy Product Photo Upload / URL / Quick Presets */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#058852]" />
                  <span>7. Product Image (Upload Photo from Device or Paste Link)</span>
                </label>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-[#058852] hover:bg-[#047243] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image from Computer / Phone</span>
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL (https://...) or click Upload above"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono text-slate-700"
              />

              {/* Quick 1-Click Photo Presets */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                  Or pick a quick photo:
                </span>
                {PRESET_PRODUCT_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium shrink-0 cursor-pointer transition-colors ${
                      imageUrl === preset.url
                        ? 'border-[#058852] bg-emerald-50 text-[#058852] font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-5 h-5 rounded object-cover"
                    />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 4: Short Product Description & Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  8. Product Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a clear description of what this product does and why customers love it..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-[#058852] focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    9. Key Health Benefits (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={benefitsText}
                    onChange={(e) => setBenefitsText(e.target.value)}
                    placeholder="e.g. Boosts Immunity, Improves Energy, 100% Natural"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-[#058852] focus:outline-none"
                  />
                </div>

                {/* Flash Sale Quick Checkbox */}
                <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200 rounded-xl px-3.5 py-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFlashSale}
                      onChange={(e) => setIsFlashSale(e.target.checked)}
                      className="rounded text-[#058852]"
                    />
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Feature in Homepage Flash Sale</span>
                  </label>
                  {isFlashSale && (
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-amber-800">Extra Off:</span>
                      <input
                        type="number"
                        min={5}
                        max={70}
                        value={flashSaleDiscount}
                        onChange={(e) => setFlashSaleDiscount(Number(e.target.value))}
                        className="w-14 px-2 py-0.5 rounded border border-amber-300 bg-white font-mono font-bold text-center"
                      />
                      <span className="font-bold text-amber-900">%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Advanced / B2B Section */}
            {formMode === 'advanced' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#058852]" />
                    <span>Advanced Wholesale B2B Pricing & Nepal DDA Details</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Optional — auto-filled if left blank
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      B2B Dealer Price (Rs.)
                    </label>
                    <input
                      type="number"
                      value={dealerPrice || effectiveDealerPrice}
                      onChange={(e) => setDealerPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono font-bold text-[#058852]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Distributor Price (Rs.)
                    </label>
                    <input
                      type="number"
                      value={distributorPrice || effectiveDistributorPrice}
                      onChange={(e) => setDistributorPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono font-bold text-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Custom SKU Code
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="Auto-generated"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      DDA Registration No.
                    </label>
                    <input
                      type="text"
                      value={ddaRegNo}
                      onChange={(e) => setDdaRegNo(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Nepali Name (नेपाली नाम)
                    </label>
                    <input
                      type="text"
                      value={nepaliName}
                      onChange={(e) => setNepaliName(e.target.value)}
                      placeholder="उदा. हिमालयन शिलाजित"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Subcategory Tag
                    </label>
                    <input
                      type="text"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      placeholder="e.g. Vitality & Stamina"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Dosage / Usage Instructions
                    </label>
                    <input
                      type="text"
                      value={usageInstructions}
                      onChange={(e) => setUsageInstructions(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Auto-configured B2B rates: <strong>Dealer Rs. {effectiveDealerPrice}</strong> ·{' '}
                <strong>Distributor Rs. {effectiveDistributorPrice}</strong>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#058852] hover:bg-[#047243] text-white font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {editingProductId
                    ? 'Save Product Changes'
                    : 'Add Product to Storefront'}
                </span>
              </button>
            </div>
          </div>

          {/* Right 4 Columns: Live Storefront Card Preview */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50 rounded-xl border border-slate-200 p-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Live Storefront Preview
                </span>
                <span className="text-[11px] font-semibold text-[#058852]">
                  {selectedCategoryObj.name}
                </span>
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="relative h-44 bg-stone-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={imageUrl || PRESET_PRODUCT_IMAGES[0].url}
                    alt={name || 'Product Preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_PRODUCT_IMAGES[0].url;
                    }}
                  />
                  {discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#058852] text-white text-[10px] font-bold">
                      {discountPercent}% OFF
                    </span>
                  )}
                  {isFlashSale && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold">
                      FLASH -{flashSaleDiscount}%
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] text-slate-500">
                    {selectedCategoryObj.name} · {packSize || 'Standard Pack'}
                  </div>
                  <div className="font-bold text-sm text-slate-900 line-clamp-2">
                    {name.trim() || 'Your New Product Name Appears Here'}
                  </div>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-bold text-[#058852]">
                      Rs. {Number(retailPrice || 0).toLocaleString()}
                    </span>
                    {effectiveMrp > retailPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        Rs. {Number(effectiveMrp).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Stock: {stock} units</span>
                    <span>B2B Dealer: Rs. {effectiveDealerPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 leading-relaxed">
              Once added, clicking this product on the website opens its full single-product page with category breadcrumb, stock status, Add to Cart, Buy Now, and related products.
            </div>
          </div>
        </form>
      </div>

      {/* =====================================================================
          2. ALL PRODUCTS LIST (WITH INSTANT INLINE PRICE & STOCK EDITING)
         ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#058852]" />
              <span>Store Product Catalog ({filteredProducts.length} of {products.length} Products)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tip: You can edit Selling Price, MRP, Dealer Price, or Stock directly in the table below, or click Edit to modify photos & descriptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product name or SKU..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:border-[#058852] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? products.length
                : products.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-[#058852] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] uppercase text-slate-400">
                <th className="py-3 px-4">Product & Category</th>
                <th className="py-3 px-3">Pack Size</th>
                <th className="py-3 px-3 text-right">Selling Price (Rs.)</th>
                <th className="py-3 px-3 text-right">MRP (Rs.)</th>
                <th className="py-3 px-3 text-right">B2B Dealer (Rs.)</th>
                <th className="py-3 px-3 text-center">In Stock</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => {
                const catName =
                  CATEGORIES.find((c) => c.id === prod.category)?.name || prod.category;
                return (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Product Thumbnail + Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 bg-stone-100"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {prod.name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span>{catName}</span>
                            <span>·</span>
                            <span className="font-mono text-slate-400">{prod.sku}</span>
                            {prod.isFlashSale && (
                              <>
                                <span>·</span>
                                <span className="text-amber-600 font-bold">Flash Sale</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Pack Size */}
                    <td className="py-3 px-3 text-slate-600 font-medium">{prod.packSize}</td>

                    {/* Inline Editable Selling Price */}
                    <td className="py-3 px-3 text-right">
                      <input
                        type="number"
                        value={prod.retailPrice}
                        onChange={(e) =>
                          appStore.quickUpdateProduct(prod.id, {
                            retailPrice: Math.max(1, Number(e.target.value))
                          })
                        }
                        className="w-24 text-right px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/30 font-mono font-bold text-[#058852]"
                      />
                    </td>

                    {/* Inline Editable MRP */}
                    <td className="py-3 px-3 text-right">
                      <input
                        type="number"
                        value={prod.mrp}
                        onChange={(e) =>
                          appStore.quickUpdateProduct(prod.id, {
                            mrp: Math.max(1, Number(e.target.value))
                          })
                        }
                        className="w-24 text-right px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-slate-600"
                      />
                    </td>

                    {/* Inline Editable Dealer Price */}
                    <td className="py-3 px-3 text-right">
                      <input
                        type="number"
                        value={prod.dealerPrice}
                        onChange={(e) =>
                          appStore.quickUpdateProduct(prod.id, {
                            dealerPrice: Math.max(1, Number(e.target.value))
                          })
                        }
                        className="w-24 text-right px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-slate-700"
                      />
                    </td>

                    {/* Inline Editable Stock */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        value={prod.stock}
                        onChange={(e) =>
                          appStore.quickUpdateProduct(prod.id, {
                            stock: Math.max(0, Number(e.target.value))
                          })
                        }
                        className={`w-20 text-center px-2 py-1.5 rounded-lg border font-mono font-bold ${
                          prod.stock <= 10
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : 'border-slate-200 bg-white text-slate-800'
                        }`}
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleLoadProductForEdit(prod)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
                          title="Edit product name, photo & description"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            appStore.setCurrentView('store');
                            appStore.setSelectedProductForModal(prod);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#058852] font-semibold flex items-center gap-1 cursor-pointer"
                          title="Open single product page on storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {onNavigateSection && (
                          <button
                            type="button"
                            onClick={() => onNavigateSection('inventory_pricing', prod.id)}
                            className="px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                            title="Configure 10-Tier Multi-Price Rules"
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {confirmDeleteId === prod.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                appStore.deleteProduct(prod.id, 'superadmin');
                                setConfirmDeleteId(null);
                                showToast(`Removed "${prod.name}" from catalog.`);
                              }}
                              className="px-2 py-1 rounded bg-red-600 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-[11px] cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(prod.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
  );
};
