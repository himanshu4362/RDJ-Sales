import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '../../validation/catalog.schema';
import { Card, CardContent, CardHeader } from '../../../../common/components/ui/Card';
import { Input } from '../../../../common/components/ui/Input';
import { Label } from '../../../../common/components/ui/Label';
import { FieldError } from '../../../../common/components/ui/FieldError';

export const PricingSection: React.FC<{ form: UseFormReturn<ProductFormData> }> = ({ form }) => {
  const { register, formState: { errors } } = form;
  
  return (
    <Card>
      <CardHeader>
        {/* FIXED: Renamed from Commercial to Pricing */}
        <h2 className="text-lg font-bold text-text-primary">Pricing</h2>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
          <Input 
            id="sellingPrice" 
            type="number" 
            inputMode="decimal"
            placeholder="0.00" 
            error={!!errors.sellingPrice} 
            {...register('sellingPrice', { valueAsNumber: true })} 
          />
          <FieldError error={errors.sellingPrice?.message} />
        </div>
        <div>
          <Label htmlFor="mrp">MRP (₹)</Label>
          <Input 
            id="mrp" 
            type="number" 
            inputMode="decimal"
            placeholder="0.00" 
            error={!!errors.mrp} 
            {...register('mrp', { valueAsNumber: true })} 
          />
          <FieldError error={errors.mrp?.message} />
        </div>
      </CardContent>
    </Card>
  );
};