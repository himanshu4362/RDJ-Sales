import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../../../../common/components/ui/Button';

interface OpportunitySuccessProps {
  customerPhone: string;
  onClose: () => void;
}

export const OpportunitySuccess: React.FC<OpportunitySuccessProps> = ({ customerPhone, onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 animate-in fade-in duration-500">
      
      <div className="w-48 h-48 bg-surface-secondary border-2 border-dashed border-border-default rounded-full flex flex-col items-center justify-center mb-8">
        <CheckCircle2 size={40} className="text-success mb-2" />
        <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Success Graphic</span>
      </div>

      <h2 className="text-3xl font-extrabold text-text-primary tracking-tight mb-6">Request Received</h2>
      
      <div className="bg-surface-secondary p-6 rounded-xl border border-border-default max-w-md w-full mb-8">
        <p className="text-text-secondary leading-relaxed">
          A member of the Rana Sales team will review your requirements and contact you at <span className="font-bold text-text-primary">{customerPhone}</span> to discuss pricing and availability.
        </p>
      </div>

      <Button onClick={onClose} variant="secondary" className="px-8 h-14 font-bold text-lg">
        Back to Product
      </Button>
    </div>
  );
};