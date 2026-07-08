import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Shipping' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Review' },
];

interface CheckoutStepsProps {
  currentStep: number;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-center">
        {steps.map((step, i) => (
          <li key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm transition-colors ${
                  step.id < currentStep
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : step.id === currentStep
                      ? 'border-brand-600 text-brand-600 bg-brand-50'
                      : 'border-gray-300 text-gray-400 bg-white'
                }`}
              >
                {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <span className={`mt-2 text-xs font-medium ${step.id <= currentStep ? 'text-brand-600' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-6 ${step.id < currentStep ? 'bg-brand-600' : 'bg-gray-200'}`} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
