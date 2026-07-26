import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";
  
  const variants = {
      default: "bg-surface-secondary text-text-secondary border-border-default",
      success: "bg-success/10 text-success border-success/20 dark:bg-success/20 dark:border-success/30",
      warning: "bg-warning/10 text-warning border-warning/20 dark:bg-warning/20 dark:border-warning/30",
      danger: "bg-danger/10 text-danger border-danger/20 dark:bg-danger/20 dark:border-danger/30",
    };

  return (
    <span className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </span>
  );
};