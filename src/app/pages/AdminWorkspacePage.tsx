import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Wrench, Calendar } from 'lucide-react';
import { ROUTES } from '../navigation/routes';

export const AdminWorkspacePage: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    { name: 'Products', icon: Package, route: ROUTES.ADMIN_CATALOG, color: 'text-brand-primary' },
    // Placeholders: To be replaced by actual feature routes when their modules are built
    // Reason: Bounded contexts not yet started.
    { name: 'Customer Orders', icon: ShoppingCart, route: ROUTES.ORDERS, color: 'text-text-secondary' },
    { name: 'Repair Jobs', icon: Wrench, route: ROUTES.REPAIRS, color: 'text-text-secondary' },
    { name: 'Appointments', icon: Calendar, route: ROUTES.VIP_APPOINTMENTS, color: 'text-text-secondary' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Orientation: Where am I? */}
      <div className="text-center mb-12 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">Rana Sales Workspace</h1>
        <p className="text-lg text-text-secondary mt-4 leading-relaxed">
          Manage products, customer requests, repairs and business operations from one place.
        </p>
      </div>

      {/* Action: What can I do? */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {modules.map((mod) => (
          <button
            key={mod.name}
            onClick={() => navigate(mod.route)}
            className="flex flex-col items-center justify-center gap-5 p-10 bg-surface-primary border border-border-default rounded-2xl hover:border-brand-primary hover:shadow-lg transition-all duration-300 group"
          >
            <mod.icon size={48} className={`${mod.color} group-hover:text-brand-primary group-hover:scale-110 transition-all duration-300`} strokeWidth={1.5} />
            <span className="text-xl font-bold text-text-primary">{mod.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};