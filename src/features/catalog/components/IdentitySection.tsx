import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '../validation/catalog.schema';
import { Card, CardContent, CardHeader } from '../../../common/components/ui/Card';
import { Input } from '../../../common/components/ui/Input';
import { Label } from '../../../common/components/ui/Label';
import { FieldError } from '../../../common/components/ui/FieldError';
import { Select } from '../../../common/components/ui/Select';
import { Textarea } from '../../../common/components/ui/Textarea';

export interface SelectOption {
  id: string;
  name: string;
}

interface IdentitySectionProps {
  form: UseFormReturn<ProductFormData>;
  brands: SelectOption[];
  categories: SelectOption[];
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({ form, brands, categories }) => {
  const { register, formState: { errors } } = form;
  
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-text-primary">Identity</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" placeholder="e.g. ATI Pro 1200W Amplifier" error={!!errors.name} {...register('name')} />
          <FieldError error={errors.name?.message} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="modelNumber">Model Number</Label>
            <Input id="modelNumber" placeholder="e.g. RX-1200" error={!!errors.modelNumber} {...register('modelNumber')} />
            <FieldError error={errors.modelNumber?.message} />
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" placeholder="e.g. ATI-AMP-1200" error={!!errors.sku} {...register('sku')} />
            <FieldError error={errors.sku?.message} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="brandId">Brand</Label>
            <Select id="brandId" error={!!errors.brandId} {...register('brandId')}>
              <option value="">Select a brand...</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </Select>
            <FieldError error={errors.brandId?.message} />
          </div>
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select id="categoryId" error={!!errors.categoryId} {...register('categoryId')}>
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>
            <FieldError error={errors.categoryId?.message} />
          </div>
        </div>

        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input 
            id="shortDescription" 
            placeholder="A brief overview for the catalog list..." 
            error={!!errors.shortDescription} 
            {...register('shortDescription')} 
          />
          <FieldError error={errors.shortDescription?.message} />
        </div>

        <div>
          <Label htmlFor="description">Full Description</Label>
          <Textarea 
            id="description" 
            placeholder="Detailed product information..." 
            error={!!errors.description} 
            {...register('description')} 
          />
          <FieldError error={errors.description?.message} />
        </div>
      </CardContent>
    </Card>
  );
};