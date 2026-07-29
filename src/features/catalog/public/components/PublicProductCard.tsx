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
    const hoverImage = product.images.find(img => img !== primaryImage);
    const isAvailable = product.stock.quantity > 0;
    const isLowStock = isAvailable && product.stock.quantity <= 3;

    const PREFERRED_SPECS = ['RMS Power', 'Program Power', 'Peak Power', 'Impedance', 'Sensitivity'];
    let specPreview = product.specifications
        .filter(spec => PREFERRED_SPECS.includes(spec.name))
        .slice(0, 2);

    if (specPreview.length === 0) {
        specPreview = product.specifications.slice(0, 2);
    }

    return (
        <div
            onClick={() => onClick(product.slug)}
            className="group flex flex-col bg-surface-primary border border-border-default rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-text-primary transition-all duration-300"
        >
            {/* 1. Media Area — crossfades to a second angle on hover, like a storefront card */}
            <div className="relative aspect-[4/3] bg-surface-elevated border-b border-border-default overflow-hidden">
                {primaryImage ? (
                    <>
                        <img
                            src={primaryImage.url}
                            alt={primaryImage.alt || product.name}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                                hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
                            } ${!hoverImage ? 'transition-transform duration-500' : ''}`}
                        />
                        {hoverImage && (
                            <img
                                src={hoverImage.url}
                                alt={hoverImage.alt || product.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            />
                        )}
                    </>
                ) : (
                    <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center text-center p-4">
                        <span className="text-brand-primary font-black tracking-widest text-lg mb-1">RDJ</span>
                        <span className="text-text-muted text-xs font-semibold tracking-widest uppercase border-t border-text-muted/30 pt-1">Photo Coming Soon</span>
                    </div>
                )}

                {/* Stock status overlay */}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-surface-primary/70 flex items-center justify-center">
                        <span className="text-xs font-bold px-3 py-1.5 bg-surface-primary text-text-primary rounded-full uppercase tracking-wider border border-border-default shadow-sm">
                            Out of Stock
                        </span>
                    </div>
                )}
                {isLowStock && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 bg-danger text-white rounded-full uppercase tracking-wider shadow-sm">
                        Only {product.stock.quantity} left
                    </span>
                )}
            </div>

            {/* 2. Industrial Data & Trust Area */}
            <div className="flex flex-col flex-1 p-5">

                <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={16} className="text-success shrink-0" />
                    <span className="text-xs font-bold text-text-primary uppercase tracking-widest truncate">
                        Original {product.brandName}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-text-primary leading-tight mb-1 group-hover:text-brand-primary transition-colors line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-5">
                    Model: {product.modelNumber}
                </p>

                {specPreview.length > 0 && (
                    <div className="mt-auto mb-5 space-y-2 border-l-2 border-brand-primary/50 pl-3">
                        {specPreview.map((spec, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                                <span className="text-text-secondary w-24 font-medium shrink-0">{spec.name}:</span>
                                <span className="font-bold text-text-primary truncate">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-end justify-between pt-4 border-t border-border-default mt-auto">
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Price</p>
                        <p className="text-2xl font-black text-text-primary tracking-tight">
                            {formatCurrency(product.sellingPrice)}
                        </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-surface-secondary flex items-center justify-center text-text-primary group-hover:bg-text-primary group-hover:text-surface-primary transition-colors">
                        <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
};