
export interface VoucherValidation {
  isValid: boolean;
  errors: string[];
}

export const validateVoucherData = (
  type: string,
  value: string,
  price: string,
  quantity: string
): VoucherValidation => {
  const errors: string[] = [];

  // Validate type
  if (!type || !['time', 'data'].includes(type)) {
    errors.push('Package type must be either "time" or "data"');
  }

  // Validate value
  const valueNum = parseInt(value);
  if (!value || isNaN(valueNum) || valueNum <= 0) {
    errors.push(`${type === 'time' ? 'Minutes' : 'MB'} must be a positive number`);
  } else if (type === 'time' && valueNum > 1440) {
    errors.push('Time cannot exceed 24 hours (1440 minutes)');
  } else if (type === 'data' && valueNum > 10240) {
    errors.push('Data cannot exceed 10GB (10240 MB)');
  }

  // Validate price
  const priceNum = parseFloat(price);
  if (!price || isNaN(priceNum) || priceNum <= 0) {
    errors.push('Price must be a positive number');
  } else if (priceNum > 1000) {
    errors.push('Price cannot exceed $1000');
  }

  // Validate quantity
  const quantityNum = parseInt(quantity);
  if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
    errors.push('Quantity must be a positive number');
  } else if (quantityNum > 100) {
    errors.push('Cannot generate more than 100 vouchers at once');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateVoucherCode = (code: string): boolean => {
  // Voucher codes should follow pattern: TYPE-VALUE-RANDOM
  const codeRegex = /^(TIME|DATA)-\d+-[A-Z0-9]{6}$/;
  return codeRegex.test(code);
};
