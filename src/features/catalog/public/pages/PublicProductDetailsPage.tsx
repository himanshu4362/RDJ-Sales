import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Wrench, PhoneCall, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '../../../../app/navigation/routes';
import { usePublicProductDetails } from '../../hooks/public.hooks';
import { LoadingSkeleton } from '../../../../common/components/ui/LoadingSkeleton';
import { formatCurrency } from '../../../../common/utils/formatters';
import { OpportunityDrawer } from '../../../sales-opportunity/public/components/OpportunityDrawer';
import { useAppSelector } from '../../../../store/hooks';
import { ImageCarousel } from '../components/ImageCarousel';

export const PublicProductDetailsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: product, isLoading } = usePublicProductDetails(slug ?? '');
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // RULE #14 CONSUMER: Listen for intent from the router state
  useEffect(() => {
    const state = location.state as any;
    if (state?.intent === 'request_commercial_order') {
      setIsDrawerOpen(true);
      // Clean up the history state so refreshing doesn't re-trigger it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleRequestOrder = () => {
    if (!isAuthenticated) {
      // Pass the intent to the Auth Boundary so login can resume this action
      navigate(ROUTES.LOGIN, {
        state: {
          from: location.pathname,
          intent: 'request_commercial_order'
        }
      });
    } else {
      setIsDrawerOpen(true);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        <LoadingSkeleton className="h-4 w-40 mb-8" />
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          <LoadingSkeleton className="w-full lg:w-1/2 aspect-square rounded-2xl" />
          <div className="w-full lg:w-1/2 space-y-4">
            <LoadingSkeleton className="h-4 w-32" />
            <LoadingSkeleton className="h-10 w-3/4" />
            <LoadingSkeleton className="h-40 w-full rounded-xl mt-6" />
            <LoadingSkeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // P0 Correction 1: Removed client-side status check. Server is authoritative.
  const displayDescription = product.description || product.shortDescription;
  const inStock = product.stock.quantity > 0;

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface-secondary pb-24">

      {/* 1. NAVIGATION */}
      <div className="bg-surface-primary border-b border-border-default sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <button onClick={() => navigate(ROUTES.CATALOG)} className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors w-max group">
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Equipment Catalog
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-8 md:pt-12">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

          {/* 2. MEDIA (Left Column) — sliding carousel */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-36 self-start">
            <ImageCarousel images={product.images} productName={product.name} />
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

            <h1 className="text-3xl md:text-5xl font-extrabold text-text-primary leading-[1.1] mb-3">
              {product.name}
            </h1>
            <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6 pb-6 border-b border-border-default">
              Model Reference: {product.modelNumber}
            </p>

            {/* Price & CTA */}
            <div className="bg-surface-primary border border-brand-primary/20 rounded-xl p-6 md:p-8 shadow-lg shadow-black/[0.03] mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Pricing Guide</p>
                  <p className="text-4xl font-black text-text-primary tracking-tight">{formatCurrency(product.sellingPrice)}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border ${
                  inStock
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-surface-secondary text-text-primary border-border-default'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-success' : 'bg-text-muted'}`} />
                  {inStock ? 'In Stock' : 'Check Availability'}
                </span>
              </div>

              {/* P0 Correction 3: Dead CTA Fixed. Now auth-gated via RULE #14. */}
              <button
                onClick={handleRequestOrder}
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white h-16 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-md active:scale-[0.99]"
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

            {/* The Rana Sales Difference */}
            <div className="bg-surface-primary border border-border-default rounded-xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">The Rana Sales Guarantee</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <Wrench size={18} className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">In-House Repair Support</p>
                    <p className="text-xs text-text-secondary mt-0.5">We service what we sell. Technical support available.</p>
                  </div>
                </div>
                {product.warrantyMonths > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={18} className="text-brand-primary" />
                    </div>
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
            <div className="bg-surface-primary border border-border-default rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {product.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center px-6 py-4 ${
                      index % 2 === 0 ? 'bg-surface-primary' : 'bg-surface-secondary/40'
                    } ${index < product.specifications.length - (product.specifications.length % 2 === 0 ? 2 : 1) ? 'border-b border-border-default/50' : ''}`}
                  >
                    <span className="text-sm font-medium text-text-secondary">{spec.name}</span>
                    <span className="text-sm font-bold text-text-primary text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
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