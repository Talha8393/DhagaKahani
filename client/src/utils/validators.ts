import type { ShippingFormData } from '../types/cart';

type Errors = Partial<Record<keyof ShippingFormData, string>>;

export function validateShippingForm(data: ShippingFormData): Errors {
  const errors: Errors = {};

  if (!data.fullName.trim()) errors.fullName = 'Full name is required';
  if (!data.street.trim()) errors.street = 'Street address is required';
  if (!data.city.trim()) errors.city = 'City is required';
  if (!data.state.trim()) errors.state = 'State is required';
  if (!data.zipCode.trim()) errors.zipCode = 'ZIP code is required';
  else if (!/^\d{5}(-\d{4})?$/.test(data.zipCode.trim())) errors.zipCode = 'Enter a valid ZIP code';
  if (!data.country.trim()) errors.country = 'Country is required';
  if (!data.phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^[\d\s\-+()]{7,}$/.test(data.phone.trim())) errors.phone = 'Enter a valid phone number';

  return errors;
}

export function validateCardPayment(cardNumber?: string, cardExpiry?: string, cardCvc?: string): string | null {
  if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) return 'Enter a valid 16-digit card number';
  if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) return 'Enter expiry as MM/YY';
  if (!cardCvc || cardCvc.length < 3) return 'Enter a valid CVC';
  return null;
}
