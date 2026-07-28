import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../../../../common/components/ui/Input';
import { Select } from '../../../../common/components/ui/Select';
import { Button } from '../../../../common/components/ui/Button';
import { MOCK_BRANDS, MOCK_CATEGORIES } from '../../mock/catalog.constants';

interface CatalogDiscoveryBarProps {
  localSearch: string;
  setLocalSearch: (val: string) => void;
  updateFilter: (key: string, value: string | null) => void;
  clearFilters: () => void;
  searchParams: URLSearchParams;
  activeFilterCount: number;
  hasActiveDiscovery: boolean;
}

export const CatalogDiscoveryBar: React.FC<CatalogDiscoveryBarProps> = ({
  localSearch, setLocalSearch, updateFilter, clearFilters, searchParams, activeFilterCount, hasActiveDiscovery
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4 bg-surface-primary p-4 rounded-lg border border-border-default shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Search size={18} />
          </div>
          {/* YELLOW 2 FIX: Accessibility Context */}
          <Input 
            className="pl-10"
            placeholder="Search by product, model or SKU..." 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            aria-label="Search catalog by product name, model number, or SKU"
          />
        </div>
        
        <Button 
          variant={activeFilterCount > 0 ? 'primary' : 'secondary'}
          className="md:hidden flex-shrink-0 px-4"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          aria-label="Toggle Filters"
          aria-expanded={mobileExpanded}
        >
          <SlidersHorizontal size={18} />
          {activeFilterCount > 0 && <span className="ml-1 text-xs">{activeFilterCount}</span>}
        </Button>
      </div>

      <div className={`flex-col md:flex-row gap-4 md:items-center ${mobileExpanded ? 'flex' : 'hidden md:flex'}`}>
        <Select 
          value={searchParams.get('category') || ''} 
          onChange={(e) => updateFilter('category', e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>

        <Select 
          value={searchParams.get('brand') || ''} 
          onChange={(e) => updateFilter('brand', e.target.value)}
          aria-label="Filter by brand"
        >
          <option value="">All Brands</option>
          {MOCK_BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </Select>

        <Select 
          value={searchParams.get('status') || ''} 
          onChange={(e) => updateFilter('status', e.target.value)}
          aria-label="Filter by product status"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
          <option value="DRAFT">Draft</option>
          <option value="DISCONTINUED">Discontinued</option>
        </Select>

        <Select 
          value={searchParams.get('sort') || ''} 
          onChange={(e) => updateFilter('sort', e.target.value)}
          aria-label="Sort products"
        >
          <option value="">Newest First</option>
          <option value="sellingPrice:asc">Price: Low to High</option>
          <option value="sellingPrice:desc">Price: High to Low</option>
          <option value="name:asc">Name: A-Z</option>
        </Select>

        {/* BLOCKER 2 FIX: Accessible clear action dynamically mounted during normal operation */}
        {hasActiveDiscovery && (
           <Button variant="ghost" onClick={clearFilters} className="md:w-auto w-full text-text-secondary whitespace-nowrap">
             Clear
           </Button>
        )}
      </div>
    </div>
  );
};