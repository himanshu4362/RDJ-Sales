import React from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { ProductFormData } from '../../validation/catalog.schema';
import { Card, CardContent, CardHeader } from '../../../../common/components/ui/Card';
import { Input } from '../../../../common/components/ui/Input';
import { Button } from '../../../../common/components/ui/Button';
import { FieldError } from '../../../../common/components/ui/FieldError';

export const SpecificationsSection: React.FC<{ form: UseFormReturn<ProductFormData> }> = ({ form }) => {
  const { control, register, formState: { errors } } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications"
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">Technical Specifications</h2>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => append({ name: '', value: '', displayOrder: 0 })} // Order ignored by API mapper
          className="h-8 px-3 text-xs"
        >
          <Plus size={14} className="mr-1" /> Add Spec
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-border-default rounded-md bg-surface-secondary/30">
            <p className="text-sm font-medium text-text-primary mb-1">Add the technical details customers ask for most</p>
            <p className="text-xs text-text-muted text-center max-w-sm">(RMS Power, Peak Power, Impedance, Frequency Response, Weight...)</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="flex-1">
                  <Input 
                    placeholder="Name (e.g. RMS Power)" 
                    {...register(`specifications.${index}.name` as const)} 
                    error={!!errors.specifications?.[index]?.name}
                  />
                  <FieldError error={errors.specifications?.[index]?.name?.message} />
                </div>
                <div className="flex-1">
                  <Input 
                    placeholder="Value (e.g. 1200W)" 
                    {...register(`specifications.${index}.value` as const)} 
                    error={!!errors.specifications?.[index]?.value}
                  />
                  <FieldError error={errors.specifications?.[index]?.value?.message} />
                </div>
                <Button 
                  type="button" 
                  variant="danger" 
                  onClick={() => remove(index)}
                  className="shrink-0 w-12 h-12 flex items-center justify-center p-0"
                  aria-label="Remove specification"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </div>
        )}
        <FieldError error={errors.specifications?.root?.message || errors.specifications?.message} />
      </CardContent>
    </Card>
  );
};