import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Wrench, PhoneCall, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '../../../../app/navigation/routes';
import { usePublicProductDetails } from '../../hooks/public.hooks';
import { LoadingSkeleton } from '../../../../common/components/ui/LoadingSkeleton';
import { formatCurrency } from '../../../../common/utils/formatters';
import { OpportunityDrawer } from '../../../sales-opportunity/public/components/OpportunityDrawer';

export const PublicProductDetailsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = usePublicProductDetails(slug ?? '');


  if (isLoading || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 w-full">
        <LoadingSkeleton className="h-10 w-48 mb-8" />
        <div className="flex flex-col md:flex-row gap-12">
          <LoadingSkeleton className="w-full md:w-1/2 aspect-square rounded-2xl" />
          <div className="w-full md:w-1/2 space-y-6"><LoadingSkeleton className="h-64 w-full" /></div>
        </div>
      </div>
    );
  }

  // P0 Correction 1: Removed client-side status check. Server is authoritative.
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const displayDescription = product.description || product.shortDescription;

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface-secondary pb-24">

      {/* 1. NAVIGATION */}
      <div className="bg-surface-primary border-b border-border-default sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <button onClick={() => navigate(ROUTES.CATALOG)} className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors w-max">
            <ArrowLeft size={18} /> Back to Equipment Catalog
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-8 md:pt-12">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

          {/* 2. MEDIA (Left Column) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="aspect-square bg-surface-elevated rounded-2xl border border-border-default overflow-hidden flex items-center justify-center relative shadow-sm">
              {primaryImage ? (
                <img src={primaryImage.url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center text-center p-4">
                  <span className="text-brand-primary font-black tracking-widest text-2xl mb-1">RDJ</span>
                  <span className="text-text-muted text-sm font-semibold tracking-widest uppercase border-t border-text-muted/30 pt-2">Photo Coming Soon</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. BUSINESS DATA & ACTION (Right Column) */}
          <div className="w-full lg:w-1/2 flex flex-col">

            {/* Identity & Trust */}
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={20} className="text-success" />
              <span className="text-sm font-bold text-text-primary uppercase tracking-widest">
                Original {product.brandName} Equipment
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-text-primary leading-tight mb-2">
              {product.name}
            </h1>
            <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6 pb-6 border-b border-border-default">
              Model Reference: {product.modelNumber}
            </p>

            {/* P0 Correction 4 & Product Suggestion: Price and CTA moved UP */}
            <div className="bg-surface-primary border border-brand-primary/20 rounded-xl p-6 md:p-8 shadow-lg mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Pricing Guide</p>
                  <p className="text-4xl font-black text-text-primary">{formatCurrency(product.sellingPrice)}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 bg-surface-secondary text-text-primary rounded-full uppercase tracking-wider border border-border-default">
                  {product.stock.quantity > 0 ? 'In Stock' : 'Check Availability'}
                </span>
              </div>

              {/* P0 Correction 3: Dead CTA Fixed */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white h-16 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-md"
              >
                <PhoneCall size={22} />
                Request Pricing & Availability
              </button>
              <p className="text-xs text-center text-text-secondary mt-4 font-medium">
                Need help verifying compatibility with your setup? Ask our experts.
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Product Overview</h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                {/* P0 Correction 4: Intentional Fallback */}
                {displayDescription || "Product description will be available soon."}
              </p>
            </div>

            {/* The Rana Sales Difference (Future: <ServiceTrustPanel />) */}
            <div className="bg-surface-primary border border-border-default rounded-xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">The Rana Sales Guarantee</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Wrench size={20} className="text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-text-primary">In-House Repair Support</p>
                    <p className="text-xs text-text-secondary mt-0.5">We service what we sell. Technical support available.</p>
                  </div>
                </div>
                {product.warrantyMonths > 0 && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-brand-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-text-primary">{product.warrantyMonths}-Month Warranty</p>
                      <p className="text-xs text-text-secondary mt-0.5">Backed by manufacturer guarantees.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* 4. TECHNICAL SPECIFICATIONS */}
        {product.specifications.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border-default">
            <h2 className="text-2xl font-bold text-text-primary mb-8">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-border-default/50">
                  <span className="text-sm font-medium text-text-secondary">{spec.name}</span>
                  <span className="text-sm font-bold text-text-primary text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <OpportunityDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={product}
      />
    </div>
  );
};