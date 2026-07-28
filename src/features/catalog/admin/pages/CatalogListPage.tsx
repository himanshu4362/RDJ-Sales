import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { Button } from '../../../../common/components/ui/Button';
import { ROUTES } from '../../../../app/navigation/routes';
import { Speaker, AlertTriangle, Search } from 'lucide-react';
import { LoadingSkeleton } from '../../../../common/components/ui/LoadingSkeleton';
import { useCatalogList } from '../../hooks/catalog.hooks';
import { useCatalogDiscovery } from '../../hooks/useCatalogDiscovery';
import { CatalogDiscoveryBar } from '../components/CatalogDiscoveryBar';
import { Pagination } from '../../../../common/components/ui/Pagination';

const SKELETON_CARD_COUNT = 8;

export const CatalogListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. Invoke Discovery Hook (URL State)
  // FIXED: Added hasActiveDiscovery
  const { 
    query, localSearch, setLocalSearch, updateFilter, clearFilters, setPage, activeFilterCount, hasActiveDiscovery, searchParams 
  } = useCatalogDiscovery();

  // 2. Invoke Data Hook (API)
  // YELLOW 3 FIX: Extract isFetching
  const { data, isLoading, isFetching, isError, refetch } = useCatalogList(query);
  
  const products = data?.data ?? [];
  const meta = data?.meta;
  const isEmpty = products.length === 0;

  // 3. Distinct Empty States
  const isTotallyEmpty = isEmpty && activeFilterCount === 0 && !query.search;
  const isFilterEmpty = isEmpty && !isTotallyEmpty;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Catalog</h1>
          <LoadingSkeleton className="h-12 w-36 rounded-md" />
        </div>
        <LoadingSkeleton className="h-20 w-full rounded-lg" />
        <ProductGrid>
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </ProductGrid>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center px-4">
        <div className="h-16 w-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Couldn't load your catalog.</h2>
        <p className="text-text-secondary mb-6 max-w-md">Please check your connection and try again.</p>
        <Button onClick={() => refetch()}>Retry Connection</Button>
      </div>
    );
  }

  // State A: Brand new installation (No inventory)
  if (isTotallyEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-125 text-center px-4 border-2 border-dashed border-border-default rounded-xl bg-surface-primary">
        <div className="h-20 w-20 bg-surface-secondary text-text-muted rounded-full flex items-center justify-center mb-4">
          <Speaker size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Your catalog is ready to be built.</h2>
        <p className="text-text-secondary mb-6 max-w-md">Add your first amplifier, cabinet, or audio component.</p>
        <Button onClick={() => navigate(ROUTES.ADMIN_PRODUCT_CREATE)}>+ Add Product</Button>
      </div>
    );
  }

  // State B: Normal Operations (Data exists)
  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-text-primary">Catalog</h1>
          {/* YELLOW 3 FIX: Grouped metadata and fetching indicator */}
          <div className="flex items-center gap-3">
             {meta && <span className="text-sm text-text-muted">{meta.total} Products</span>}
             
             {/* YELLOW 3 FIX: Subtle feedback during background refresh */}
             {isFetching && !isLoading && (
               <span className="text-xs font-medium text-brand-primary animate-pulse">Updating...</span>
             )}
          </div>
        </div>
        <Button onClick={() => navigate(ROUTES.ADMIN_PRODUCT_CREATE)}>+ Add Product</Button>
      </div>

      {/* Discovery Layer */}
      {/* FIXED: Passed down clearFilters and hasActiveDiscovery */}
      <CatalogDiscoveryBar 
        localSearch={localSearch}
        setLocalSearch={setLocalSearch}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        searchParams={searchParams}
        activeFilterCount={activeFilterCount}
        hasActiveDiscovery={hasActiveDiscovery}
      />

      {/* Grid or Filter Empty State */}
      {isFilterEmpty ? (
        <div className="flex flex-col items-center justify-center min-h-64 text-center px-4 border-2 border-dashed border-border-default rounded-xl bg-surface-primary py-12">
          <div className="h-16 w-16 bg-surface-secondary text-text-muted rounded-full flex items-center justify-center mb-4">
            <Search size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">No products match these filters.</h2>
          <p className="text-text-secondary mb-6 max-w-md">Try changing your search terms or clearing some filters.</p>
          <Button variant="secondary" onClick={clearFilters}>Clear All Filters</Button>
        </div>
      ) : (
        <>
          <ProductGrid>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={(slug) => navigate(ROUTES.ADMIN_PRODUCT_DETAILS(slug))}
              />
            ))}
          </ProductGrid>
          
          {meta && (
             <Pagination 
               currentPage={meta.page} 
               totalPages={meta.totalPages} 
               onPageChange={setPage} 
             />
          )}
        </>
      )}
    </div>
  );
};