import { forwardRef, type SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, children, ...props }, ref) => {
    const baseStyles = "flex h-12 w-full rounded-md border bg-surface-primary px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors appearance-none";
    const borderStyles = error
      ? "border-danger focus:border-danger focus:ring-danger"
      : "border-border-default focus:border-brand-primary focus:ring-brand-primary";
    
    return (
      <div className="relative w-full">
        <select ref={ref} className={`${baseStyles} ${borderStyles} ${className}`} {...props}>
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-muted">
          {/* Simple SVG chevron down */}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';