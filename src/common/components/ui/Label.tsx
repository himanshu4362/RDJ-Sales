import { forwardRef, type LabelHTMLAttributes } from 'react';

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = '', children, ...props }, ref) => (
    <label ref={ref} className={`block text-sm font-semibold text-text-primary mb-1.5 ${className}`} {...props}>
      {children}
    </label>
  )
);
Label.displayName = 'Label';