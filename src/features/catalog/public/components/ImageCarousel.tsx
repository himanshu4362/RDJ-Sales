import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselImage {
  url: string;
  alt?: string | null;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  productName: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const hasMultiple = images.length > 1;

  const goTo = (index: number) => {
    const total = images.length;
    setActiveIndex(((index % total) + total) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      goTo(activeIndex + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  // Empty state — matches the existing "Photo Coming Soon" identity
  if (images.length === 0) {
    return (
      <div className="aspect-square bg-surface-elevated rounded-2xl border border-border-default overflow-hidden flex items-center justify-center shadow-sm">
        <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center text-center p-4">
          <span className="text-brand-primary font-black tracking-widest text-2xl mb-1">RDJ</span>
          <span className="text-text-muted text-sm font-semibold tracking-widest uppercase border-t border-text-muted/30 pt-2">Photo Coming Soon</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main slide viewport */}
      <div
        className="group relative aspect-square bg-surface-elevated rounded-2xl border border-border-default overflow-hidden shadow-sm select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={img.alt || `${productName} — view ${idx + 1}`}
              className="w-full h-full object-cover shrink-0"
              draggable={false}
            />
          ))}
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-surface-primary/90 border border-border-default text-text-primary shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-surface-primary/90 border border-border-default text-text-primary shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <ChevronRight size={18} />
            </button>

            {/* Slide counter */}
            <div className="absolute top-3 right-3 bg-surface-primary/90 border border-border-default rounded-full px-2.5 py-1 text-[10px] font-bold text-text-secondary tracking-wider">
              {activeIndex + 1} / {images.length}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? 'w-5 bg-brand-primary' : 'w-1.5 bg-surface-primary/80 border border-border-default'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail rail */}
      {hasMultiple && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`relative shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === activeIndex ? 'border-brand-primary' : 'border-border-default hover:border-text-muted'
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" draggable={false} />
              {idx !== activeIndex && <div className="absolute inset-0 bg-surface-primary/30" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};