import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import type { Product } from '../../domain/catalog.types';
import { formatCurrency } from '../../../../common/utils/formatters';

interface PublicProductCardProps {
    product: Product;
    onClick: (slug: string) => void;
}

export const PublicProductCard: React.FC<PublicProductCardProps> = ({ product, onClick }) => {
    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
    const isAvailable = product.stock.quantity > 0;
    const PREFERRED_SPECS = ['RMS Power', 'Program Power', 'Peak Power', 'Impedance', 'Sensitivity'];
    // Extract top 2 specs for the card preview (e.g., "RMS Power", "Impedance")
    let specPreview = product.specifications
        .filter(spec => PREFERRED_SPECS.includes(spec.name))
        .slice(0, 2);

    if (specPreview.length === 0) {
        specPreview = product.specifications.slice(0, 2);
    }
    return (
        <div
            onClick={() => onClick(product.slug)}
            className="group flex flex-col bg-surface-primary border border-border-default rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:border-text-primary transition-all duration-300"
        >
            {/* 1. Media Area (With Intentional Placeholder) */}
            <div className="relative aspect-[4/3] bg-surface-elevated border-b border-border-default overflow-hidden flex items-center justify-center">
                {primaryImage ? (
                    <img
                        src={primaryImage.url}
                        alt={primaryImage.alt || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    // Intentional Asset Placeholder (Asset Backlog: Industrial Image Placeholder)
                    <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center text-center p-4">
                        <span className="text-brand-primary font-black tracking-widest text-lg mb-1">RDJ</span>
                        <span className="text-text-muted text-xs font-semibold tracking-widest uppercase border-t border-text-muted/30 pt-1">Photo Coming Soon</span>
                    </div>
                )}
            </div>

            {/* 2. Industrial Data & Trust Area */}
            <div className="flex flex-col flex-1 p-5">

                {/* Trust Hierarchy First */}
                <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={16} className="text-success" />
                    <span className="text-xs font-bold text-text-primary uppercase tracking-widest">
                        Original {product.brandName}
                    </span>
                </div>

                {/* Product Identity */}
                <h3 className="text-lg font-bold text-text-primary leading-tight mb-1 group-hover:text-brand-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-5">
                    Model: {product.modelNumber}
                </p>

                {/* Technical Specs */}
                {specPreview.length > 0 && (
                    <div className="mt-auto mb-5 space-y-2 border-l-2 border-brand-primary/50 pl-3">
                        {specPreview.map((spec, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                                <span className="text-text-secondary w-24 font-medium">{spec.name}:</span>
                                <span className="font-bold text-text-primary">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Commercial Action Area */}
                <div className="flex items-end justify-between pt-4 border-t border-border-default mt-auto">
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Price</p>
                        <p className="text-2xl font-black text-text-primary tracking-tight">
                            {formatCurrency(product.sellingPrice)}
                        </p>
                    </div>
                    <div className="h-10 w-10 rounded bg-surface-secondary flex items-center justify-center text-text-primary group-hover:bg-text-primary group-hover:text-surface-primary transition-colors">
                        <ArrowRight size={18} strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </div>
    );
};