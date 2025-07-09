import React from 'react';

const badgeVariants = {
  default: 'badge-modern-default',
  secondary: 'badge-modern-secondary',
  destructive: 'badge-modern-destructive',
  success: 'badge-modern-success',
  warning: 'badge-modern-warning',
  outline: 'badge-modern-outline'
};

export const Badge = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'badge badge-modern';
  const variantClass = badgeVariants[variant] || badgeVariants.default;
  
  return (
    <span 
      className={`${baseClasses} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
