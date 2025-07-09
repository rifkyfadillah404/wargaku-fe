import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`card border-0 shadow-sm bg-white rounded-3 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`card-header bg-transparent border-0 p-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`card-body p-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 
      className={`card-title h5 mb-2 fw-semibold text-gray-900 ${className}`} 
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p 
      className={`card-text text-muted small mb-0 ${className}`} 
      {...props}
    >
      {children}
    </p>
  );
};
