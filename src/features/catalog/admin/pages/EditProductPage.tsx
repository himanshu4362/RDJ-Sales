import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { useProductForm } from '../../hooks/useProductForm';
import { useProductDetails, useUpdateProduct } from '../../hooks/catalog.hooks';
import { Button } from '../../../../common/components/ui/Button';
import { Card, CardContent } from '../../../../common/components/ui/Card';
import { LoadingSkeleton } from '../../../../common/components/ui/LoadingSkeleton';
import { IdentitySection } from '../components/IdentitySection';
import { PricingSection } from '../components/PricingSection';
import { InventorySection } from '../components/InventorySection';
import { MediaSection } from '../components/MediaSection';
import { MOCK_BRANDS, MOCK_CATEGORIES } from '../../mock/catalog.constants';
import { ROUTES } from '../../../../app/navigation/routes';
import type { ProductFormData } from '../../validation/catalog.schema';
import { SpecificationsSection } from '../components/SpecificationsSection';

export const EditProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading: isInitialLoad, isError } = useProductDetails(slug ?? '');
  const { form, isDirty } = useProductForm(product);
  const [updateProduct] = useUpdateProduct();

  const onSubmit = async (data: ProductFormData) => {
    try {
      await updateProduct({ slug: product!.slug, data }).unwrap();
      navigate(ROUTES.ADMIN_PRODUCT_DETAILS(product!.slug));
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const isSaving = form.formState.isSubmitting;
  const canSave = isDirty && !isSaving;

  if (isInitialLoad) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-24">
        <LoadingSkeleton className="h-6 w-32" />
        <div className="mb-2">
          <LoadingSkeleton className="h-8 w-48 mb-2" />
          <LoadingSkeleton className="h-4 w-64" />
        </div>
        <Card><CardContent className="h-96"><LoadingSkeleton className="h-full w-full" /></CardContent></Card>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center px-4">
        <div className="h-16 w-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Unable to load product</h2>
        <p className="text-text-secondary mb-6 max-w-md">Please verify the URL or return to the Catalog.</p>
        <Button type="button" onClick={() => navigate(ROUTES.ADMIN_CATALOG)}>Return to Catalog</Button>
      </div>
    );
  }

  const handleCancel = () => navigate(ROUTES.ADMIN_PRODUCT_DETAILS(product.slug));

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-24 relative">
      <div className="flex items-center">
        <button 
          type="button" 
          onClick={handleCancel}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Details
        </button>
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Edit Product</h1>
        <p className="text-text-secondary mt-1 font-medium">{product.name}</p>
      </div>

      <form id="edit-product-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <IdentitySection form={form} brands={MOCK_BRANDS} categories={MOCK_CATEGORIES} />
        <PricingSection form={form} />
        <InventorySection form={form} />
        <MediaSection form={form} />
        {/* FIXED: Removed quotation marks around {form} */}
        <SpecificationsSection form={form} />
      </form>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border-default bg-surface-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-end gap-4">
          <Button variant="ghost" type="button" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="edit-product-form"
            disabled={!canSave}
            className="flex items-center gap-2"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};