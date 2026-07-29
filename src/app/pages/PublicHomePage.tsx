import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Search, Package, Wrench, MessageSquare } from 'lucide-react';
import { ROUTES } from '../navigation/routes';
import { Button } from '../../common/components/ui/Button';

export const PublicHomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 py-12">
      <div className="max-w-4xl flex flex-col items-center">

        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-primary border border-border-default px-4 py-1.5 text-xs font-bold text-text-secondary uppercase tracking-widest shadow-sm">
          <ShieldCheck size={16} className="text-brand-primary" /> Rana Sales Professional Control Center
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight leading-tight mb-6">
          Professional Audio Equipment & <span className="text-brand-primary">Workshop Support.</span>
        </h1>

        <p className="text-base md:text-lg text-text-secondary max-w-2xl mb-8 leading-relaxed font-medium">
          What would you like to do today? Select an action below to enter the workspace.
        </p>

        {/* Immediate Interactive Action Buttons (Replacing passive hero text) */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-2xl mb-16">
          <Button onClick={() => navigate(ROUTES.CATALOG)} className="h-14 px-8 text-base font-bold shadow-md flex items-center gap-2">
            <Search size={18} /> Browse Equipment
          </Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.LOGIN, { state: { intent: 'track_order' } })} className="h-14 px-8 text-base font-bold flex items-center gap-2">
            <Package size={18} /> Track My Order
          </Button>
          <Button variant="ghost" onClick={() => navigate('/contact')} className="h-14 px-6 text-base font-bold text-text-secondary hover:text-text-primary">
            Contact Ravi
          </Button>
        </div>

        {/* Popular Categories Grid (Immediate engagement) */}
        <div className="w-full text-left border-t border-border-default pt-10">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Amplifiers', 'Line Arrays', 'Custom Cabinets', 'Stage Monitors'].map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate(ROUTES.CATALOG)}
                className="bg-surface-primary p-4 rounded-xl border border-border-default hover:border-brand-primary cursor-pointer transition-all shadow-sm group text-center"
              >
                <span className="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors">{cat}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};