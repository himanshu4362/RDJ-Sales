import React from 'react';

interface ProductGridProps {
  children: React.ReactNode;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {children}
    </div>
  );
};