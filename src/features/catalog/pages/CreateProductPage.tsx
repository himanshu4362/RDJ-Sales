import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { useProductForm } from '../hooks/useProductForm';
import { Button } from '../../../common/components/ui/Button';
import { Card, CardContent } from '../../../common/components/ui/Card';
import { IdentitySection } from '../components/IdentitySection';
import { PricingSection } from '../components/PricingSection';
import { InventorySection } from '../components/InventorySection';
import { ROUTES } from '../../../app/navigation/routes';
import type { ProductFormData } from '../validation/catalog.schema';

// Mock data structures for the catalog forms
const MOCK_BRANDS = [
  { id: 'brand_ati', name: 'ATI Pro' },
  { id: 'brand_ahuja', name: 'Ahuja' },
  { id: 'brand_jbl', name: 'JBL' },
  { id: 'brand_custom', name: 'Custom RDJ' },
];

const MOCK_CATEGORIES = [
  { id: 'cat_amps', name: 'Amplifiers' },
  { id: 'cat_speakers', name: 'Speakers' },
  { id: 'cat_mixers', name: 'Mixers' },
  { id: 'cat_cabinets', name: 'Cabinets' },
];

export const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Custom hook containing react-hook-form instance and loading states
  const { form, isSaving } = useProductForm();

  // Page-level orchestration for submission logic and router redirection
  const onSubmit = async (data: ProductFormData) => {
    try {
      // TODO: Execute API Create Mutation here
      console.log('Creating product...', data);
      navigate(ROUTES.CATALOG);
    } catch (error) {
      // TODO: Handle Error Toast notifications
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-24 relative">
      
      {/* Top Navigation Link */}
      <div className="flex items-center">
        <button 
          type="button"
          onClick={() => navigate(ROUTES.CATALOG)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Catalog
        </button>
      </div>

      {/* Page Title & Context */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Add New Product</h1>
        <p className="text-text-secondary mt-1">Create a new product record in your catalog.</p>
      </div>

      {/* Main Form Body with Progressive Disclosure Layouts */}
      <form id="create-product-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {/* RESTORED: IdentitySection */}
        <IdentitySection form={form} brands={MOCK_BRANDS} categories={MOCK_CATEGORIES} />
        
        <PricingSection form={form} />
        <InventorySection form={form} />
        
        <Card className="bg-surface-secondary/30">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-text-muted">
             <ImageIcon size={32} className="mb-3 opacity-50" />
             <p className="font-semibold text-text-primary">Product Images</p>
             <p className="text-sm mt-1">Image upload functionality will be available in the next update.</p>
          </CardContent>
        </Card>
      </form>

      {/* Fixed Sticky Action Bar at viewport base */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border-default bg-surface-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-end gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(ROUTES.CATALOG)}
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
