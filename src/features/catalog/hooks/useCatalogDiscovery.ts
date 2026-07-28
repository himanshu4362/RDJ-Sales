import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../../../common/hooks/useDebounce';
import type { CatalogQuery } from '../api/catalog.api';

export const useCatalogDiscovery = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setLocalSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    if (debouncedSearch !== localSearch) return; 
    if (debouncedSearch === urlSearch) return; 

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (debouncedSearch) {
        newParams.set('search', debouncedSearch);
      } else {
        newParams.delete('search');
      }
      newParams.delete('page'); 
      return newParams;
    }, { replace: true });
  }, [debouncedSearch, localSearch, urlSearch, setSearchParams]);

  const updateFilter = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) newParams.set(key, value);
      else newParams.delete(key);
      newParams.delete('page');
      return newParams;
    }, { replace: true });
  };

  const clearFilters = () => {
    setLocalSearch(''); // FIXED: Instantly wipe the local input box
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const setPage = (page: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', Math.max(1, page).toString()); 
      return newParams;
    }, { replace: true });
  };

  const sortParam = searchParams.get('sort');
  let sortBy, sortOrder;
  if (sortParam) {
    [sortBy, sortOrder] = sortParam.split(':');
  }

  const rawPage = Number(searchParams.get('page'));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const query: CatalogQuery = {
    search: urlSearch || undefined, 
    categoryId: searchParams.get('category') || undefined,
    brandId: searchParams.get('brand') || undefined,
    status: searchParams.get('status') || undefined,
    sortBy,
    sortOrder: sortOrder as 'asc' | 'desc' | undefined,
    page,
    limit: 12,
  };

  const activeFilterCount = ['category', 'brand', 'status'].filter(k => searchParams.has(k)).length;
  const hasActiveDiscovery = Boolean(urlSearch) || activeFilterCount > 0 || Boolean(sortParam);

  return {
    query,
    localSearch,
    setLocalSearch,
    updateFilter,
    clearFilters,
    setPage,
    activeFilterCount,
    hasActiveDiscovery, 
    searchParams,
  };
};