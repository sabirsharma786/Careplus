import React, { useState } from 'react';
import { Flame, Star, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { appStore } from '../services/store';
import { ProductCard } from './ProductCard';

interface CuratedProductTabsProps {
  onOpenDetails: (product: Product) => void;
}

export const CuratedProductTabs: React.FC<CuratedProductTabsProps> = ({ onOpenDetails }) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'topRated' | 'newArrivals'>('trending');
  const products = appStore.getProducts();
  const language = appStore.getLanguage();

  let filteredProducts: Product[] = [];
  if (activeTab === 'trending') {
    filteredProducts = products.filter((p) => p.isTrending);
  } else if (activeTab === 'topRated') {
    filteredProducts = products.filter((p) => p.isTopRated || p.rating >= 4.9);
  } else if (activeTab === 'newArrivals') {
    filteredProducts = products.filter((p) => p.isNewArrival);
  }

  // Display top 8 in each category
  const displayList = filteredProducts.slice(0, 8);

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {language === 'np' ? 'विशेष चयन गरिएका उपचारहरू' : 'Curated Himalayan Collections'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-600">
            Explore authentic formulas loved by over 25,000+ wellness patrons across Kathmandu, Pokhara, Chitwan and beyond.
          </p>

          {/* Centered Segmented Filter Controls */}
          <div className="inline-flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-xl mt-4 border border-stone-200/60 shadow-inner">
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'trending'
                  ? 'bg-white text-[#176B51] shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${activeTab === 'trending' ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />
              <span>Trending Now</span>
            </button>

            <button
              onClick={() => setActiveTab('topRated')}
              className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'topRated'
                  ? 'bg-white text-[#176B51] shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${activeTab === 'topRated' ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />
              <span>Top Rated</span>
            </button>

            <button
              onClick={() => setActiveTab('newArrivals')}
              className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'newArrivals'
                  ? 'bg-white text-[#176B51] shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'newArrivals' ? 'text-emerald-600 fill-emerald-500' : 'text-stone-400'}`} />
              <span>New Arrivals</span>
            </button>
          </div>
        </div>

        {/* 2-Column on Mobile (`grid-cols-2`), 4-Column on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {displayList.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
