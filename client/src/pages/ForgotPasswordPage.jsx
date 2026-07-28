import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../features/auth/hooks/useAuth';

export default function ForgotPasswordPage() {
  const { forgotPassword, loading } = useAuthStore();
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await forgotPassword(email);
      toast.success('If an account exists, a password reset link has been sent.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not process request');
    }
  };

  return (
    <div className="min-h-screen bg-linen-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-white p-8">
        <h1 className="text-2xl font-display text-orchard-900">Forgot password</h1>
        <p className="mt-2 text-sm text-charcoal-600">Enter your email and we’ll send a reset link.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal-800">Email address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-[var(--radius-md)] border border-border px-3 text-sm outline-none focus:border-orchard-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] bg-orchard-900 text-sm font-semibold text-white transition-colors hover:bg-orchard-700 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Send reset link'}
          </button>
        </form>
        <Link to="/login" className="mt-5 inline-block text-sm font-medium text-orchard-700">Back to login</Link>
      </div>
    </div>
  );
}
