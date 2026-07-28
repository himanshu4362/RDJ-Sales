import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Wrench, Truck } from 'lucide-react';
import { ROUTES } from '../../../../app/navigation/routes';
import { usePublicCatalogList } from '../../hooks/public.hooks';
import { PublicProductCard } from '../components/PublicProductCard';

export const PublicCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // In a real scenario, this would pass the activeCategory to the hook
  const { data, isLoading } = usePublicCatalogList({}); 
  const products = data?.data || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface-secondary">
      
      {/* 1. ORIENTATION & TRUST (Why am I here? Why trust Rana Sales?) */}
      <div className="w-full bg-surface-primary border-b border-border-default pt-16 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
            Rana Sales Equipment Catalog
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl">
            Explore our curated selection of professional amplifiers, line arrays, and stage monitors. Built for heavy-duty performance and backed by our in-house service team.
          </p>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center gap-6 mt-4 pt-6 border-t border-border-default">
            <div className="flex items-center gap-2 text-sm font-bold text-text-secondary uppercase tracking-wider">
              <ShieldCheck size={18} className="text-brand-primary" /> Authorized Dealer
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-text-secondary uppercase tracking-wider">
              <Wrench size={18} className="text-brand-primary" /> In-House Repair
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-text-secondary uppercase tracking-wider">
              <Truck size={18} className="text-brand-primary" /> Nationwide Shipping
            </div>
          </div>
        </div>
      </div>

      {/* 2. DISCOVERY & NAVIGATION (How do I explore?) */}
      <div className="w-full bg-surface-primary border-b border-border-default sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['All Equipment', 'Amplifiers', 'Line Arrays', 'Custom Cabinets', 'Monitors', 'Mixers'].map((cat, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveCategory(idx === 0 ? null : cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-colors border ${
                (idx === 0 && !activeCategory) || activeCategory === cat 
                  ? 'bg-text-primary text-surface-primary border-text-primary' 
                  : 'bg-surface-secondary text-text-secondary border-transparent hover:border-border-default hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. THE BROWSE GRID (What is the main content?) */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/4] bg-surface-elevated animate-pulse rounded-lg border border-border-default" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {/* Asset Backlog: Empty State Artwork */}
            <div className="w-32 h-32 bg-surface-elevated border-2 border-dashed border-border-default rounded-lg mb-6 flex items-center justify-center text-text-muted text-xs font-bold uppercase">
              No Data Graphic
            </div>
            <h3 className="text-xl font-bold text-text-primary">No equipment found</h3>
            <p className="text-text-secondary mt-2">Adjust your filters to see available inventory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <PublicProductCard 
                key={product.id} 
                product={product} 
                onClick={(slug) => navigate(ROUTES.PRODUCT_DETAILS(slug))} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};