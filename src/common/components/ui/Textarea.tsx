import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    const baseStyles = "flex min-h-[120px] w-full rounded-md border bg-surface-primary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y";
    const borderStyles = error
      ? "border-danger focus:border-danger focus:ring-danger"
      : "border-border-default focus:border-brand-primary focus:ring-brand-primary";
    
    return <textarea ref={ref} className={`${baseStyles} ${borderStyles} ${className}`} {...props} />;
  }
);
Textarea.displayName = 'Textarea';