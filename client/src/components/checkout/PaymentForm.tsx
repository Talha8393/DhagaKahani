import { CreditCard, Banknote, Wallet } from 'lucide-react';
import { Input } from '../ui/Input';
import type { PaymentMethod } from '../../types/cart';

interface PaymentFormProps {
  method: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  onCardChange: (field: 'cardNumber' | 'cardExpiry' | 'cardCvc', value: string) => void;
  cardError?: string | null;
}

const methods = [
  { id: 'card' as const, label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
  { id: 'cod' as const, label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
  { id: 'wallet' as const, label: 'Digital Wallet', icon: Wallet, desc: 'Apple Pay, Google Pay' },
];

export function PaymentForm({
  method,
  onMethodChange,
  cardNumber,
  cardExpiry,
  cardCvc,
  onCardChange,
  cardError,
}: PaymentFormProps) {
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
      <p className="text-sm text-gray-500">
        {/* EXTENSION: Replace with Stripe/PayPal integration */}
        Mock payment — no real charges will be made.
      </p>

      <div className="space-y-3">
        {methods.map((m) => {
          const Icon = m.icon;
          return (
            <label
              key={m.id}
              className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                method === m.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={m.id}
                checked={method === m.id}
                onChange={() => onMethodChange(m.id)}
                className="text-brand-600 focus:ring-brand-500"
              />
              <Icon className="h-6 w-6 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{m.label}</p>
                <p className="text-sm text-gray-500">{m.desc}</p>
              </div>
            </label>
          );
        })}
      </div>

      {method === 'card' && (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <Input
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => onCardChange('cardNumber', formatCardNumber(e.target.value))}
            autoComplete="cc-number"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry"
              placeholder="MM/YY"
              value={cardExpiry}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
                onCardChange('cardExpiry', v);
              }}
              autoComplete="cc-exp"
            />
            <Input
              label="CVC"
              placeholder="123"
              value={cardCvc}
              onChange={(e) => onCardChange('cardCvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
              autoComplete="cc-csc"
            />
          </div>
          {cardError && <p className="text-sm text-red-600">{cardError}</p>}
        </div>
      )}
    </div>
  );
}
