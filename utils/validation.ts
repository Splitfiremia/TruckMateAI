import React from "react";
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  numeric?: boolean;
  min?: number;
  max?: number;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule;
}

export interface FormErrors {
  [fieldName: string]: string;
}

export interface FormTouched {
  [fieldName: string]: boolean;
}

export const validateField = (value: string, rules: ValidationRule): ValidationResult => {
  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    return { isValid: false, error: 'This field is required' };
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === '') {
    return { isValid: true };
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    return { 
      isValid: false, 
      error: `Must be at least ${rules.minLength} characters` 
    };
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return { 
      isValid: false, 
      error: `Must be no more than ${rules.maxLength} characters` 
    };
  }

  // Email validation
  if (rules.email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
  }

  // Phone validation
  if (rules.phone) {
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
    if (!phonePattern.test(cleanPhone) || cleanPhone.length < 10) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }
  }

  // Numeric validation
  if (rules.numeric) {
    const numericPattern = /^\d+$/;
    if (!numericPattern.test(value)) {
      return { isValid: false, error: 'Please enter numbers only' };
    }
  }

  // Min value validation (for numeric fields)
  if (rules.min !== undefined && rules.numeric) {
    const numValue = parseInt(value);
    if (numValue < rules.min) {
      return { 
        isValid: false, 
        error: `Value must be at least ${rules.min}` 
      };
    }
  }

  // Max value validation (for numeric fields)
  if (rules.max !== undefined && rules.numeric) {
    const numValue = parseInt(value);
    if (numValue > rules.max) {
      return { 
        isValid: false, 
        error: `Value must be no more than ${rules.max}` 
      };
    }
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, error: 'Please enter a valid format' };
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return { isValid: false, error: customError };
    }
  }

  return { isValid: true };
};

export const validateForm = (
  formData: { [key: string]: string },
  validationRules: FieldValidation
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(fieldName => {
    const value = formData[fieldName] || '';
    const rules = validationRules[fieldName];
    const result = validateField(value, rules);
    
    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Common validation rules
export const commonValidationRules = {
  required: { required: true },
  email: { required: true, email: true },
  phone: { phone: true },
  name: { required: true, minLength: 2, maxLength: 50 },
  companyName: { required: true, minLength: 2, maxLength: 100 },
  cdlNumber: { 
    minLength: 8, 
    maxLength: 20, 
    pattern: /^[A-Z0-9]+$/i,
    custom: (value: string) => {
      if (value && value.length > 0 && value.length < 8) {
        return 'CDL number must be at least 8 characters';
      }
      return null;
    }
  },
  dotNumber: { 
    numeric: true, 
    minLength: 6, 
    maxLength: 8,
    custom: (value: string) => {
      if (value && (value.length < 6 || value.length > 8)) {
        return 'DOT number must be 6-8 digits';
      }
      return null;
    }
  },
  mcNumber: { 
    numeric: true, 
    minLength: 6, 
    maxLength: 8,
    custom: (value: string) => {
      if (value && (value.length < 6 || value.length > 8)) {
        return 'MC number must be 6-8 digits';
      }
      return null;
    }
  },
  fleetSize: { 
    numeric: true, 
    min: 1, 
    max: 10000,
    custom: (value: string) => {
      if (value && parseInt(value) < 1) {
        return 'Fleet size must be at least 1';
      }
      return null;
    }
  },
  location: { required: true, minLength: 3, maxLength: 100 },
  defectDescription: { 
    required: true, 
    minLength: 10, 
    maxLength: 500,
    custom: (value: string) => {
      if (value && value.length < 10) {
        return 'Please provide a detailed description (at least 10 characters)';
      }
      return null;
    }
  },
  notes: { maxLength: 500 },
  colorHex: {
    pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    custom: (value: string) => {
      if (value && !value.startsWith('#')) {
        return 'Color must start with #';
      }
      return null;
    }
  },
  url: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (value && !value.startsWith('http')) {
        return 'URL must start with http:// or https://';
      }
      return null;
    }
  }
};

// Hook for form validation
export const useFormValidation = (
  initialData: { [key: string]: string },
  validationRules: FieldValidation
) => {
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState<FormTouched>({});

  const validateSingleField = (fieldName: string, value: string) => {
    const rules = validationRules[fieldName];
    if (!rules) return;

    const result = validateField(value, rules);
    setErrors(prev => ({
      ...prev,
      [fieldName]: result.error && result.error.trim && result.error.trim() ? result.error : ''
    }));
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Validate on change if field has been touched
    if (touched[fieldName]) {
      validateSingleField(fieldName, value);
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateSingleField(fieldName, formData[fieldName] || '');
  };

  const validateAllFields = () => {
    const { isValid, errors: formErrors } = validateForm(formData, validationRules);
    setErrors(formErrors);
    
    // Mark all fields as touched
    const allTouched: FormTouched = {};
    Object.keys(validationRules).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    return isValid;
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  };

  const hasErrors = Object.values(errors).some(error => error && error.length > 0);

  return {
    formData,
    errors,
    touched,
    hasErrors,
    handleFieldChange,
    handleFieldBlur,
    validateAllFields,
    resetForm,
    setFormData
  };
};