import React, { forwardRef, type ButtonHTMLAttributes } from 'react';


export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', fullWidth, disabled, children, ...props }, ref) => {
    
    // Base classes enforce the 48px touch target and font weight
    const baseStyles = "inline-flex items-center justify-center h-12 px-6 rounded-md font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const widthStyles = fullWidth ? "w-full" : "";
    
    const variants = {
      primary: "bg-brand-primary text-surface-primary hover:bg-brand-secondary focus:ring-brand-primary",
      secondary: "bg-surface-secondary text-text-primary border border-border-default hover:bg-border-default focus:ring-text-primary",
      ghost: "bg-transparent text-text-secondary hover:bg-surface-secondary hover:text-text-primary focus:ring-text-secondary",
      danger: "bg-danger text-surface-primary hover:bg-red-600 focus:ring-danger",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';