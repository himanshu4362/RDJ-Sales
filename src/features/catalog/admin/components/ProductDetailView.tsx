import React from 'react';
import { Speaker } from 'lucide-react';
import type { Product } from '../../domain/catalog.types';
import { PRODUCT_STATUS_UI } from '../../constants/status';
import { Card, CardContent, CardHeader } from '../../../../common/components/ui/Card';
import { Badge } from '../../../../common/components/ui/Badge';
import { formatCurrency } from '../../../../common/utils/formatters';

interface ProductDetailViewProps {
  product: Product;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const statusUi = PRODUCT_STATUS_UI[product.status];
  
  // Recommendation 3: Robust description fallback
  const displayDescription = product.description || product.shortDescription;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Column: Image */}
      <div className="w-full md:w-1/3 lg:w-2/5 shrink-0">
        <Card className="aspect-square flex items-center justify-center bg-surface-secondary overflow-hidden">
          {primaryImage ? (
            <img 
              src={primaryImage.url} 
              alt={primaryImage.alt || product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Speaker size={80} className="text-border-default opacity-50" strokeWidth={1} />
          )}
        </Card>
      </div>

      {/* Right Column: Chunked Information */}
      <div className="flex flex-col gap-6 w-full">
        
        {/* Chunk 1: Identity */}
        <div className="flex flex-col gap-2 border-b border-border-default pb-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-text-muted uppercase tracking-wider">
              {product.modelNumber}
            </span>
            <Badge variant={statusUi.variant}>
              {statusUi.label}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
            {product.name}
          </h1>
        </div>

        {/* Chunk 2: Commercial & Inventory */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="flex flex-col p-4">
              <span className="text-xs text-text-muted uppercase font-semibold mb-1">Selling Price</span>
              <span className="text-2xl font-bold text-brand-primary">{formatCurrency(product.sellingPrice)}</span>
              {product.mrp > product.sellingPrice && (
                <span className="text-sm text-text-muted line-through mt-1">MRP: {formatCurrency(product.mrp)}</span>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col p-4">
              <span className="text-xs text-text-muted uppercase font-semibold mb-1">Current Stock</span>
              <span className={`text-2xl font-bold ${product.stock.quantity > 0 ? 'text-text-primary' : 'text-danger'}`}>
                {product.stock.quantity}
              </span>
              <span className="text-sm text-text-secondary mt-1">Units available</span>
            </CardContent>
          </Card>
        </div>

        {/* Chunk 3: Technical / Specifications */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-text-primary">Specifications</h2>
          </CardHeader>
          <CardContent className="p-0 border-t border-border-default">
            {/* Recommendation 2: No zebra striping, just clean industrial borders */}
            <dl className="divide-y divide-border-default">
              <div className="flex justify-between p-4">
                <dt className="text-sm font-medium text-text-secondary">Brand</dt>
                {/* Blocker 2: Consuming clean Domain data */}
                <dd className="text-sm font-bold text-text-primary">{product.brandName}</dd>
              </div>
              <div className="flex justify-between p-4">
                <dt className="text-sm font-medium text-text-secondary">Category</dt>
                <dd className="text-sm font-bold text-text-primary">{product.categoryName}</dd>
              </div>
              <div className="flex justify-between p-4">
                <dt className="text-sm font-medium text-text-secondary">Warranty</dt>
                <dd className="text-sm font-bold text-text-primary">{product.warrantyMonths} Months</dd>
              </div>
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between p-4">
                  <dt className="text-sm font-medium text-text-secondary">{spec.name}</dt>
                  <dd className="text-sm font-bold text-text-primary">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        {/* Chunk 4: Description */}
        {displayDescription && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Description</h3>
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {displayDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};