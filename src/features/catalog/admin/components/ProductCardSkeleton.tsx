import React from 'react';
import { Card, CardContent, CardFooter } from '../../../../common/components/ui/Card';
import { LoadingSkeleton } from '../../../../common/components/ui/LoadingSkeleton';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col h-full">
      {/* Image Area Skeleton */}
      <div className="relative aspect-square bg-surface-secondary">
        <LoadingSkeleton className="w-full h-full rounded-none" />
      </div>

      {/* Content Area Skeleton */}
      <CardContent className="flex-1 flex flex-col gap-3">
        <LoadingSkeleton className="h-3 w-1/3" /> {/* Model Number */}
        <LoadingSkeleton className="h-5 w-3/4" /> {/* Name */}
        
        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            <LoadingSkeleton className="h-6 w-24 mb-1" /> {/* Price */}
            <LoadingSkeleton className="h-3 w-16" /> {/* MRP */}
          </div>
          <LoadingSkeleton className="h-4 w-20" /> {/* Stock */}
        </div>
      </CardContent>

      {/* Action Area Skeleton */}
      <CardFooter>
        <LoadingSkeleton className="h-12 w-full" /> {/* Button */}
      </CardFooter>
    </Card>
  );
};