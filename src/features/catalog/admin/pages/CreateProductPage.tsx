import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useProductForm } from '../../hooks/useProductForm';
import { Button } from '../../../../common/components/ui/Button';
import { IdentitySection } from '../components/IdentitySection';
import { PricingSection } from '../components/PricingSection';
import { InventorySection } from '../components/InventorySection';
import { ROUTES } from '../../../../app/navigation/routes';
import { useCreateProduct } from '../../hooks/catalog.hooks';
import type { ProductFormData } from '../../validation/catalog.schema';
import { MOCK_BRANDS, MOCK_CATEGORIES } from '../../mock/catalog.constants';
import { MediaSection } from '../components/MediaSection';
import { SpecificationsSection } from '../components/SpecificationsSection';

export const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { form } = useProductForm();
  const [createProduct] = useCreateProduct();

  const onSubmit = async (data: ProductFormData) => {
    try {
      await createProduct(data).unwrap();
      navigate(ROUTES.ADMIN_CATALOG);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const isSaving = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-24 relative">
      <div className="flex items-center">
        <button 
          type="button"
          onClick={() => navigate(ROUTES.ADMIN_CATALOG)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Catalog
        </button>
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Add New Product</h1>
        <p className="text-text-secondary mt-1">Create a new product record in your catalog.</p>
      </div>

      <form id="create-product-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <IdentitySection form={form} brands={MOCK_BRANDS} categories={MOCK_CATEGORIES} />
        <PricingSection form={form} />
        <InventorySection form={form} />
        <MediaSection form={form} />
        {/* FIXED: Removed quotation marks around {form} */}
        <SpecificationsSection form={form} />
      </form>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border-default bg-surface-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-end gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(ROUTES.ADMIN_CATALOG)}
            disabled={isSaving}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="create-product-form"
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>
    </div>
  );
};