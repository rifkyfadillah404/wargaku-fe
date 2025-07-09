import React from 'react';

const buttonVariants = {
  default: 'btn-modern-primary',
  destructive: 'btn-modern-destructive',
  outline: 'btn-modern-outline',
  secondary: 'btn-modern-secondary',
  ghost: 'btn-modern-ghost',
  link: 'btn-modern-link'
};

const buttonSizes = {
  default: 'btn-modern-default',
  sm: 'btn-modern-sm',
  lg: 'btn-modern-lg',
  icon: 'btn-modern-icon'
};

export const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseClasses = 'btn btn-modern';
  const variantClass = buttonVariants[variant] || buttonVariants.default;
  const sizeClass = buttonSizes[size] || buttonSizes.default;
  
  return (
    <button 
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      )}
      {children}
    </button>
  );
};
