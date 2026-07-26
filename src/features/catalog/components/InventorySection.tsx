import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '../validation/catalog.schema';
import { Card, CardContent, CardHeader } from '../../../common/components/ui/Card';
import { Input } from '../../../common/components/ui/Input';
import { Label } from '../../../common/components/ui/Label';
import { FieldError } from '../../../common/components/ui/FieldError';
import { Select } from '../../../common/components/ui/Select';

export const InventorySection: React.FC<{ form: UseFormReturn<ProductFormData> }> = ({ form }) => {
  const { register, formState: { errors } } = form;
  
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-text-primary">Inventory</h2>
      </CardHeader>
      {/* RESOLUTION: Changed from md:grid-cols-2 to md:grid-cols-3 for perfect balance */}
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="stock.quantity">Available Stock</Label>
          <Input 
            id="stock.quantity" 
            type="number"
            inputMode="numeric"
            placeholder="0" 
            error={!!errors.stock?.quantity} 
            {...register('stock.quantity', { valueAsNumber: true })} 
          />
          <FieldError error={errors.stock?.quantity?.message} />
        </div>
        <div>
          <Label htmlFor="warrantyMonths">Warranty (Months)</Label>
          <Input 
            id="warrantyMonths" 
            type="number"
            inputMode="numeric"
            placeholder="12" 
            error={!!errors.warrantyMonths} 
            {...register('warrantyMonths', { valueAsNumber: true })} 
          />
          <FieldError error={errors.warrantyMonths?.message} />
        </div>
        <div>
          <Label htmlFor="status">Initial Status</Label>
          <Select id="status" error={!!errors.status} {...register('status')}>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </Select>
          <FieldError error={errors.status?.message} />
        </div>
      </CardContent>
    </Card>
  );
};