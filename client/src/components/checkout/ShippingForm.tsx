import { Input } from '../ui/Input';
import type { ShippingFormData } from '../../types/cart';

interface ShippingFormProps {
  data: ShippingFormData;
  errors: Partial<Record<keyof ShippingFormData, string>>;
  onChange: (data: ShippingFormData) => void;
}

export function ShippingForm({ data, errors, onChange }: ShippingFormProps) {
  const update = (field: keyof ShippingFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
      <Input
        label="Full Name"
        value={data.fullName}
        onChange={(e) => update('fullName', e.target.value)}
        error={errors.fullName}
        autoComplete="name"
      />
      <Input
        label="Street Address"
        value={data.street}
        onChange={(e) => update('street', e.target.value)}
        error={errors.street}
        autoComplete="street-address"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City"
          value={data.city}
          onChange={(e) => update('city', e.target.value)}
          error={errors.city}
          autoComplete="address-level2"
        />
        <Input
          label="State"
          value={data.state}
          onChange={(e) => update('state', e.target.value)}
          error={errors.state}
          autoComplete="address-level1"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="ZIP Code"
          value={data.zipCode}
          onChange={(e) => update('zipCode', e.target.value)}
          error={errors.zipCode}
          autoComplete="postal-code"
        />
        <Input
          label="Country"
          value={data.country}
          onChange={(e) => update('country', e.target.value)}
          error={errors.country}
          autoComplete="country-name"
        />
      </div>
      <Input
        label="Phone Number"
        type="tel"
        value={data.phone}
        onChange={(e) => update('phone', e.target.value)}
        error={errors.phone}
        autoComplete="tel"
      />
    </div>
  );
}
