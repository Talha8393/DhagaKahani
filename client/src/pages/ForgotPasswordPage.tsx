import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authService } from '../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <>
        <PageMeta title="Reset Password" />
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-600 mb-2">
            If an account exists for <strong>{email}</strong>, we've sent password reset instructions.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            {/* EXTENSION: Wire up SendGrid/SES for real password reset emails */}
            This is a mock flow — no email was actually sent.
          </p>
          <Link to="/login"><Button>Back to Sign In</Button></Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Forgot Password" />
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Forgot Password</h1>
        <p className="text-gray-500 text-center mb-8">Enter your email and we'll send reset instructions</p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>Send Reset Link</Button>
        </form>

        <p className="text-center mt-6 text-sm">
          <Link to="/login" className="text-brand-600 hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </>
  );
}
