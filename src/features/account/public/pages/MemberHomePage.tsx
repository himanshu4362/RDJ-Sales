import React from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { Package, Wrench, History } from 'lucide-react';

export const MemberHomePage: React.FC = () => {
  const { member } = useAppSelector(state => state.auth);

  // Safely extract the profile and identity
  const displayName = member?.profile?.displayName || 'Customer';
  const phone = member?.identity?.phone || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full py-8 px-4">
      <div className="bg-surface-primary border border-border-default rounded-2xl p-8 mb-8 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Welcome, {displayName}</h1>
          <p className="text-text-secondary mt-1 font-medium text-sm">Account: {phone}</p>
        </div>
        <div className="h-16 w-16 bg-sky-500/10 text-sky-600 rounded-full flex items-center justify-center font-black text-2xl shrink-0">
          {initial}
        </div>
      </div>

      <h2 className="text-xl font-bold text-text-primary mb-4">Your Setup & Operations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-primary border border-border-default rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
          <Package size={32} className="text-brand-primary mb-4" />
          <h3 className="font-bold text-text-primary text-lg">Active Orders</h3>
          <p className="text-sm text-text-secondary mt-1">Track pending equipment deliveries.</p>
        </div>
        <div className="bg-surface-primary border border-border-default rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer opacity-60">
          <Wrench size={32} className="text-text-muted mb-4" />
          <h3 className="font-bold text-text-primary text-lg">Repair Tickets</h3>
          <p className="text-sm text-text-secondary mt-1">View active workshop diagnostics.</p>
        </div>
        <div className="bg-surface-primary border border-border-default rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer opacity-60">
          <History size={32} className="text-text-muted mb-4" />
          <h3 className="font-bold text-text-primary text-lg">Order History</h3>
          <p className="text-sm text-text-secondary mt-1">Past purchases and invoices.</p>
        </div>
      </div>
    </div>
  );
};