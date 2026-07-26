import React from 'react';
import { Speaker } from 'lucide-react';
import type { Product, ProductStatus } from '../domain/catalog.types';
import { Card, CardContent, CardFooter } from '../../../common/components/ui/Card';
import { Badge } from '../../../common/components/ui/Badge';
import { Button } from '../../../common/components/ui/Button';
import { formatCurrency } from '../../../common/utils/formatters';

interface ProductCardProps {
  product: Product;
  onOpen?: (slug: string) => void;
}

const getStatusVariant = (status: ProductStatus) => {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'OUT_OF_STOCK': return 'danger';
    case 'DISCONTINUED': return 'warning';
    case 'DRAFT': return 'default';
    default: return 'default';
  }
};

const STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE: 'Active',
  OUT_OF_STOCK: 'Out of Stock',
  DISCONTINUED: 'Discontinued',
  DRAFT: 'Draft',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpen }) => {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const formattedPrice = formatCurrency(product.sellingPrice); 

  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-md">
      
      {/* Visual Hierarchy 1: Image & Status */}
      <div className="relative aspect-square bg-surface-secondary flex items-center justify-center overflow-hidden">
        {primaryImage ? (
           <img 
             src={primaryImage.url} 
             alt={primaryImage.alt || product.name}
             className="w-full h-full object-cover"
             loading="lazy"
           />
        ) : (
          <Speaker size={48} className="text-border-default opacity-50" strokeWidth={1.5} />
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={getStatusVariant(product.status)}>
            {STATUS_LABELS[product.status]}
          </Badge>
        </div>
      </div>

      {/* Visual Hierarchy 2: Identity & Specs */}
      <CardContent className="flex-1 flex flex-col gap-1">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          {product.modelNumber}
        </span>
        <h3 className="text-base font-bold text-text-primary line-clamp-2 leading-snug">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            <div className="text-lg font-bold text-brand-primary">
              {formattedPrice}
            </div>
            {product.mrp > product.sellingPrice && (
              <div className="text-xs text-text-muted/70 line-through">
                {formatCurrency(product.mrp)}
              </div>
            )}
          </div>
          <div className="text-right">
            <span className={`text-sm font-medium ${product.stock.quantity > 0 ? 'text-text-secondary' : 'text-danger'}`}>
              {product.stock.quantity > 0 ? `Stock: ${product.stock.quantity}` : 'Out of stock'}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Visual Hierarchy 3: Action */}
      <CardFooter>
        <Button 
          variant="secondary" 
          fullWidth 
          onClick={() => onOpen?.(product.slug)}
          aria-label={`View Details for ${product.name}`}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};