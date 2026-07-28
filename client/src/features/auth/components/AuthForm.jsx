import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../hooks/useAuth';

export default function AuthForm({ mode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result =
        mode === 'register'
          ? await register(form)
          : await login({ email: form.email, password: form.password });

      toast.success(
        mode === 'register'
          ? 'Account created successfully. Please check your email to verify your address.'
          : 'Signed in successfully'
      );

      if (mode === 'register') {
        navigate('/login', { replace: true });
        return;
      }

      // Role-based redirect: staff (manager/admin) always land directly on
      // the admin dashboard. Customers return to wherever they were headed
      // (e.g. checkout, via ProtectedRoute's `state.from`), or home.
      const role = result?.user?.role;
      if (role === 'admin' || role === 'manager') {
        navigate('/admin', { replace: true });
      } else {
        const redirectTo = location.state?.from?.pathname ?? '/';
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-linen-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orchard-700">United Mart</p>
          <h1 className="mt-2 text-2xl font-display text-orchard-900">
            {mode === 'register' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-charcoal-600">
            {mode === 'register'
              ? 'Join United Mart for secure checkout and fast order tracking.'
              : 'Sign in to continue shopping and manage your orders.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal-800">Full name</label>
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="h-11 w-full rounded-[var(--radius-md)] border border-border px-3 text-sm outline-none focus:border-orchard-600"
                placeholder="Ayesha Khan"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal-800">Email address</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="h-11 w-full rounded-[var(--radius-md)] border border-border px-3 text-sm outline-none focus:border-orchard-600"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal-800">Password</label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="h-11 w-full rounded-[var(--radius-md)] border border-border px-3 pr-10 text-sm outline-none focus:border-orchard-600"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-3 flex items-center text-charcoal-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <p className="text-xs text-charcoal-600">
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] bg-orchard-900 text-sm font-semibold text-white transition-colors hover:bg-orchard-700 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : mode === 'register' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm text-charcoal-600">
          {mode === 'login' ? (
            <Link to="/forgot-password" className="hover:text-orchard-700">Forgot password?</Link>
          ) : (
            <Link to="/login" className="hover:text-orchard-700">Already have an account?</Link>
          )}
          {mode === 'login' ? (
            <Link to="/register" className="font-medium text-orchard-700">Create account</Link>
          ) : (
            <Link to="/login" className="font-medium text-orchard-700">Sign in</Link>
          )}
        </div>
      </div>
    </div>
  );
}
