import React, { useState } from 'react';
import { Button } from '../../../../common/components/ui/Button';
import { Input } from '../../../../common/components/ui/Input';
import { Label } from '../../../../common/components/ui/Label';
import { Textarea } from '../../../../common/components/ui/Textarea';
import { FieldError } from '../../../../common/components/ui/FieldError';
import { useSubmitOpportunityMutation } from '../../api/opportunity.api';
import type { Product } from '../../../catalog/domain/catalog.types';
import { formatCurrency } from '../../../../common/utils/formatters';

interface OpportunityFormProps {
  product: Product;
  onSuccess: (customerPhone: string) => void;
  onCancel: () => void;
}

export const OpportunityForm: React.FC<OpportunityFormProps> = ({ product, onSuccess, onCancel }) => {
  const [submitOpportunity, { isLoading }] = useSubmitOpportunityMutation();
  const [formData, setFormData] = useState({ name: '', phone: '', location: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  // Improvement 3: Basic Business Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 2) newErrors.name = "Please enter a valid name.";
    
    // Strip non-digits and check length
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) newErrors.phone = "Please enter a valid 10-digit phone number.";
    
    if (formData.location.trim().length < 3) newErrors.location = "Please enter a valid city or district.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
     await submitOpportunity({
        customerName: formData.name,
        customerPhone: formData.phone,
        location: formData.location,
        message: formData.message,
        // Snapshot Data
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productModel: product.modelNumber,
        productImage: primaryImage?.url || null,
      }).unwrap();
      onSuccess(formData.phone);
    } catch (error) {
      console.error('Failed to submit inquiry', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* Improvement 5: Compact Product Context */}
      <div className="flex items-center gap-4 p-4 mb-8 bg-surface-secondary border border-border-default rounded-xl">
        <div className="h-16 w-16 shrink-0 bg-surface-primary rounded-md overflow-hidden border border-border-default">
          {primaryImage ? (
            <img src={primaryImage.url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#1A1A1A] text-brand-primary flex items-center justify-center text-[10px] font-black">RDJ</div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{product.modelNumber}</span>
          <span className="text-sm font-bold text-text-primary line-clamp-1">{product.name}</span>
          <span className="text-sm font-black text-brand-primary mt-0.5">{formatCurrency(product.sellingPrice)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-6">
        <div className="space-y-5">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" placeholder="e.g. Rahul Setup" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} error={!!errors.name} />
            <FieldError error={errors.name} />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="10-digit mobile number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} error={!!errors.phone} />
            <FieldError error={errors.phone} />
          </div>
          <div>
            <Label htmlFor="location">City / District</Label>
            <Input id="location" placeholder="Where is your setup located?" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} error={!!errors.location} />
            <FieldError error={errors.location} />
            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">Helps us determine shipping and dealer support</p>
          </div>
          <div>
            <Label htmlFor="message">Additional Requirements (Optional)</Label>
            <Textarea id="message" placeholder="Quantity needed, timeline, or specific questions..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="min-h-25" />
          </div>
        </div>

        <div className="mt-auto pt-8 flex gap-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="w-1/3">Cancel</Button>
          <Button type="submit" disabled={isLoading} className="w-2/3 bg-brand-primary hover:bg-brand-secondary text-white font-bold h-14">
            {isLoading ? 'Sending...' : 'Send Request'}
          </Button>
        </div>
      </form>
    </div>
  );
};