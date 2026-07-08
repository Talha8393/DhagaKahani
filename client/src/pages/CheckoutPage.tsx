import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageMeta } from '../components/layout/PageMeta';
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { PaymentForm } from '../components/checkout/PaymentForm';
import { OrderReview } from '../components/checkout/OrderReview';
import { OrderSummarySidebar } from '../components/checkout/OrderSummary';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { calculateCartTotals } from '../utils/cartCalculations';
import { validateShippingForm, validateCardPayment } from '../utils/validators';
import { orderService } from '../services/orderService';
import type { ShippingFormData, PaymentMethod } from '../types/cart';
import type { Address } from '../types';

const emptyShipping: ShippingFormData = {
  fullName: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',
  phone: '',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const couponDiscount = useCartStore((s) => s.couponDiscount);
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState<ShippingFormData>(emptyShipping);
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardError, setCardError] = useState<string | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [placing, setPlacing] = useState(false);

  const totals = calculateCartTotals(items, couponDiscount);

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items.length, navigate]);

  useEffect(() => {
    if (user?.addresses?.length) {
      const addr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setShipping({
        fullName: addr.fullName,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        country: addr.country,
        phone: addr.phone,
      });
    } else if (user) {
      setShipping((s) => ({
        ...s,
        fullName: `${user.firstName} ${user.lastName}`,
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handleShippingNext = () => {
    const errors = validateShippingForm(shipping);
    setShippingErrors(errors);
    if (Object.keys(errors).length === 0) setStep(2);
  };

  const handlePaymentNext = () => {
    if (paymentMethod === 'card') {
      const err = validateCardPayment(cardNumber, cardExpiry, cardCvc);
      if (err) {
        setCardError(err);
        return;
      }
    }
    setCardError(null);
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      if (paymentMethod === 'card') {
        const payment = await orderService.mockPayment(simulateFailure);
        if (!payment.success) {
          addToast(payment.message || 'Payment failed', 'error');
          setPlacing(false);
          return;
        }
      }

      const shippingAddress: Address = {
        id: 'checkout-addr',
        label: 'Shipping',
        fullName: shipping.fullName,
        street: shipping.street,
        city: shipping.city,
        state: shipping.state,
        zipCode: shipping.zipCode,
        country: shipping.country,
        phone: shipping.phone,
        isDefault: false,
      };

      const order = await orderService.create({
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          variantId: item.variantId,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        shippingAddress,
        paymentMethod,
        subtotal: totals.subtotal,
        tax: totals.tax,
        shipping: totals.shipping,
        discount: totals.discount,
        total: totals.total,
        couponCode: couponCode || undefined,
      });

      clearCart();
      addToast('Order placed successfully!');
      navigate(`/order-confirmation/${order.orderNumber}`, { state: { order } });
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to place order', 'error');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <>
      <PageMeta title="Checkout" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <CheckoutSteps currentStep={step} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
            {step === 1 && (
              <>
                <ShippingForm data={shipping} errors={shippingErrors} onChange={setShipping} />
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleShippingNext}>Continue to Payment</Button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <PaymentForm
                  method={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  cardNumber={cardNumber}
                  cardExpiry={cardExpiry}
                  cardCvc={cardCvc}
                  onCardChange={(field, value) => {
                    if (field === 'cardNumber') setCardNumber(value);
                    if (field === 'cardExpiry') setCardExpiry(value);
                    if (field === 'cardCvc') setCardCvc(value);
                  }}
                  cardError={cardError}
                />
                <div className="mt-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={simulateFailure}
                      onChange={(e) => setSimulateFailure(e.target.checked)}
                      className="rounded border-gray-300 text-brand-600"
                    />
                    Simulate payment failure (for testing)
                  </label>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={handlePaymentNext}>Review Order</Button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <OrderReview
                  items={items}
                  totals={totals}
                  shipping={shipping}
                  paymentMethod={paymentMethod}
                  couponCode={couponCode}
                />
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button onClick={handlePlaceOrder} loading={placing}>Place Order</Button>
                </div>
              </>
            )}
          </div>
          <div>
            <OrderSummarySidebar items={items} totals={totals} />
          </div>
        </div>
      </div>
    </>
  );
}
