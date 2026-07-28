import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Edit2 } from 'lucide-react';
import { useProductDetails } from '../../hooks/catalog.hooks';
import { ROUTES } from '../../../../app/navigation/routes';
import { ProductDetailView } from '../components/ProductDetailView';
import { Button } from '../../../../common/components/ui/Button';
import { Card, CardContent } from '../../../../common/components/ui/Card';
import { LoadingSkeleton } from '../../../../common/components/ui/LoadingSkeleton';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProductDetails(slug ?? '');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-6 w-32" />
          <LoadingSkeleton className="h-10 w-32 rounded-md" />
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 lg:w-2/5 shrink-0">
            <LoadingSkeleton className="aspect-square w-full" />
          </div>
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-4 border-b border-border-default pb-6">
               <div className="flex justify-between">
                 <LoadingSkeleton className="h-4 w-24" />
                 <LoadingSkeleton className="h-6 w-20 rounded-full" />
               </div>
               <LoadingSkeleton className="h-8 w-3/4" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <Card><CardContent className="h-24"><LoadingSkeleton className="h-full w-full" /></CardContent></Card>
               <Card><CardContent className="h-24"><LoadingSkeleton className="h-full w-full" /></CardContent></Card>
            </div>
            <Card><CardContent className="h-48"><LoadingSkeleton className="h-full w-full" /></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center px-4">
        <div className="h-16 w-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Product Not Found</h2>
        <p className="text-text-secondary mb-6 max-w-md">
          We couldn't load the details for this product. It might have been deleted or the URL is incorrect.
        </p>
        <Button onClick={() => navigate(ROUTES.ADMIN_CATALOG)}>Back to Catalog</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(ROUTES.ADMIN_CATALOG)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Catalog
        </button>
        <Button 
          onClick={() => navigate(ROUTES.ADMIN_PRODUCT_EDIT(product.slug))}
          className="flex items-center gap-2"
        >
          <Edit2 size={18} />
          Edit Product
        </Button>
      </div>
      {/* FIXED: Restored Assembly Injection */}
      <ProductDetailView product={product} />
    </div>
  );
};