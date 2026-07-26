import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData } from '../validation/catalog.schema';
import type { Product } from '../domain/catalog.types';

export const useProductForm = (existingProduct?: Product) => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: 'onTouched',
    defaultValues: {
      sku: '', modelNumber: '', name: '', shortDescription: '', description: '',
      categoryId: '', brandId: '', sellingPrice: 0, mrp: 0, status: 'DRAFT',
      stock: { quantity: 0 }, images: [], specifications: [], warrantyMonths: 0, isFeatured: false,
    }
  });

  // Hydration Safety: Updates form ONLY when existingProduct is provided by the Page
  useEffect(() => {
    if (existingProduct) {
      form.reset(existingProduct);
    }
  }, [existingProduct, form]);

  return {
    form,
    isDirty: form.formState.isDirty,
    isSaving: form.formState.isSubmitting,
  };
};