import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../api/catalog.api';
import { ProductGrid } from '../components/ProductGrid';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { Button } from '../../../common/components/ui/Button';
import { Speaker, AlertTriangle } from 'lucide-react';
import { LoadingSkeleton } from '../../../common/components/ui/LoadingSkeleton';

const SKELETON_CARD_COUNT = 8;

export const CatalogListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetProductsQuery({});
  
  const products = data?.data ?? [];
  const isEmpty = products.length === 0;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {/* Recommendation 2: Consistent Loading Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-text-primary">Catalog</h1>
            <LoadingSkeleton className="h-4 w-24" />
          </div>
          <LoadingSkeleton className="h-12 w-36 rounded-md" />
        </div>
        <ProductGrid>
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ProductGrid>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="h-16 w-16 bg-red-50 text-danger rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Couldn't load your catalog.</h2>
        <p className="text-text-secondary mb-6 max-w-md">
          Please check your connection and try again. If the problem persists, the workshop server might be offline.
        </p>
        <Button onClick={() => refetch()}>Retry Connection</Button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4 border-2 border-dashed border-border-default rounded-xl bg-surface-primary">
        <div className="h-20 w-20 bg-surface-secondary text-text-muted rounded-full flex items-center justify-center mb-4">
          <Speaker size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Your catalog is ready to be built.</h2>
        <p className="text-text-secondary mb-6 max-w-md">
          Add your first amplifier, cabinet, or audio component to start managing inventory and sales.
        </p>
        <Button onClick={() => navigate('/catalog/new')}>+ Add Product</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-text-primary">Catalog</h1>
          {/* Recommendation 1: Truthful data label */}
          <span className="text-sm text-text-muted">{products.length} Products</span>
        </div>
        <Button onClick={() => navigate('/catalog/new')}>+ Add Product</Button>
      </div>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onEdit={(slug) => navigate(`/catalog/${slug}/edit`)} 
          />
        ))}
      </ProductGrid>
    </div>
  );
};