import React from 'react';

export const Input = ({ 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label fw-medium text-gray-700">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <input 
        className={`form-control form-control-modern ${error ? 'is-invalid' : ''} ${className}`}
        {...props}
      />
      {error && (
        <div className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
};

export const Select = ({ 
  label, 
  error, 
  children, 
  className = '', 
  required = false,
  ...props 
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label fw-medium text-gray-700">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <select 
        className={`form-select form-select-modern ${error ? 'is-invalid' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <div className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
};

export const Textarea = ({ 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label fw-medium text-gray-700">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <textarea 
        className={`form-control form-control-modern ${error ? 'is-invalid' : ''} ${className}`}
        {...props}
      />
      {error && (
        <div className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
};
