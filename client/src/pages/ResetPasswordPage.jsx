import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../features/auth/hooks/useAuth';

export default function ResetPasswordPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuthStore();
  const token = params.token || new URLSearchParams(location.search).get('token');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!token) {
        toast.error('Password reset token is missing. Please use the link sent to your email.');
        return;
      }
      await resetPassword(token, password);
      toast.success('Password updated successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen bg-linen-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-white p-8">
        <h1 className="text-2xl font-display text-orchard-900">Reset password</h1>
        <p className="mt-2 text-sm text-charcoal-600">Choose a new password for your account.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal-800">New password</label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-[var(--radius-md)] border border-border px-3 pr-10 text-sm outline-none focus:border-orchard-600"
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 flex items-center text-charcoal-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] bg-orchard-900 text-sm font-semibold text-white transition-colors hover:bg-orchard-700 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Reset password'}
          </button>
        </form>
        <Link to="/login" className="mt-5 inline-block text-sm font-medium text-orchard-700">Back to login</Link>
      </div>
    </div>
  );
}
