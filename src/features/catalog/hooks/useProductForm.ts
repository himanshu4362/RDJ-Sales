/**
 * src/features/catalog/hooks/useProductForm.ts
 * 
 * Orchestrates the Product Form UI state.
 * Strictly adheres to the rule: No business logic, only coordination.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { productSchema, type ProductFormData } from '../validation/catalog.schema';
import { useGetProductBySlugQuery } from '../api/catalog.api';
// import { useCreateProductMutation, useUpdateProductMutation } from '../api/catalog.api';

export const useProductForm = (existingProductSlug?: string) => {
  // Refinement 2: Return intent, not implementation
  const isEditMode = Boolean(existingProductSlug);

  // 1. Data Fetching (Infrastructure)
  const { 
    data: existingProduct, 
    isLoading: isFetching 
  } = useGetProductBySlugQuery(existingProductSlug ?? '', {
    skip: !isEditMode,
  });

  // Future RTK Query Mutations (Commented to prevent TS errors until API is expanded)
  // const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  // const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isCreating = false; // Placeholder
  const isUpdating = false; // Placeholder

  // 2. Form State Management (UI)
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: 'onTouched',
    defaultValues: {
      sku: '',
      modelNumber: '',
      name: '',
      shortDescription: '',
      description: '',
      categoryId: '',
      brandId: '',
      sellingPrice: 0,
      mrp: 0,
      status: 'DRAFT',
      stock: { quantity: 0 },
      images: [],
      specifications: [],
      warrantyMonths: 0,
      isFeatured: false,
    }
  });

  // 3. Synchronization
  useEffect(() => {
    if (existingProduct) {
      form.reset(existingProduct);
    }
  }, [existingProduct, form]);

  // 4. Submission Orchestration
  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditMode) {
        // TODO(RDJ): Execute updateProduct mutation
        // await updateProduct({ slug: existingProductSlug, ...data }).unwrap();
      } else {
        // TODO(RDJ): Execute createProduct mutation
        // await createProduct(data).unwrap();
      }
      
      // TODO(RDJ): Dispatch success toast notification
      // TODO(RDJ): Navigate back to Catalog List
    } catch (error) {
      // TODO(RDJ): Dispatch error toast notification
    }
  };

  // Refinement 3: Unified loading state for the UI
  const isSaving = form.formState.isSubmitting || isCreating || isUpdating;

  // 5. Expose purely what the UI Component needs
  return {
    form,
    isEditMode,
    isFetching,
    isSaving,
    submit: form.handleSubmit(onSubmit),
  };
};