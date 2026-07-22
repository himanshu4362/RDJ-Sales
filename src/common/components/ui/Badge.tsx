import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";
  
  const variants = {
    default: "bg-surface-secondary text-text-secondary border-border-default",
    success: "bg-green-50 text-success border-green-200 dark:bg-green-900/20 dark:border-green-900",
    warning: "bg-yellow-50 text-warning border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900",
    danger: "bg-red-50 text-danger border-red-200 dark:bg-red-900/20 dark:border-red-900",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </span>
  );
};