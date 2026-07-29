import React, { useState } from 'react';
import { X } from 'lucide-react';
import { OpportunityForm } from './OpportunityForm';
import { OpportunitySuccess } from './OpportunitySuccess';
import type { Product } from '../../../catalog/domain/catalog.types';

interface OpportunityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const OpportunityDrawer: React.FC<OpportunityDrawerProps> = ({ isOpen, onClose, product }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSuccess = (customerPhone: string) => {
    setPhone(customerPhone);
    setStep('success');
  };

  const handleClose = () => {
    setTimeout(() => setStep('form'), 300);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-overlay backdrop-blur-sm transition-opacity" onClick={handleClose} />
      
      {/* Improvement 4: Increased to max-w-2xl for better breathing room */}
      <div className="relative w-full max-w-2xl bg-surface-primary h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Improvement 4/Header: More welcoming, less empty */}
        <div className="flex items-start justify-between p-6 md:p-8 border-b border-border-default bg-surface-secondary/30">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Need Help Choosing Equipment?</h2>
            <p className="text-sm text-text-secondary mt-1">Our team will help you select the right setup.</p>
          </div>
          <button onClick={handleClose} className="p-2 -mr-2 text-text-secondary hover:text-text-primary bg-surface-primary rounded-full shadow-sm transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {step === 'form' ? (
            <OpportunityForm product={product} onSuccess={handleSuccess} onCancel={handleClose} />
          ) : (
            <OpportunitySuccess customerPhone={phone} onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
};