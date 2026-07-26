import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    const baseStyles = "flex h-12 w-full rounded-md border bg-surface-primary px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors";
    const borderStyles = error
      ? "border-danger focus:border-danger focus:ring-danger"
      : "border-border-default focus:border-brand-primary focus:ring-brand-primary";
    
    return <input ref={ref} className={`${baseStyles} ${borderStyles} ${className}`} {...props} />;
  }
);
Input.displayName = 'Input';