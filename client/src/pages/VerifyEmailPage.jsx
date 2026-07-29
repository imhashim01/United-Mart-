import { useEffect, useState } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const { token: pathToken } = useParams();
  const { verifyEmail, loading } = useAuthStore();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const token = searchParams.get('token') || pathToken;
    if (!token) {
      setStatus('error');
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success');
        toast.success('Email verified successfully');
      })
      .catch(() => {
        setStatus('error');
      });
  }, [searchParams, pathToken, verifyEmail]);

  return (
    <div className="min-h-screen bg-linen-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-white p-8 text-center">
        <h1 className="text-2xl font-display text-orchard-900">Email Verification</h1>
        {loading && <p className="mt-4 text-sm text-charcoal-600">Verifying your email address...</p>}
        {status === 'success' && (
          <>
            <p className="mt-4 text-sm text-charcoal-600">Your email address has been verified. You can now sign in.</p>
            <Link to="/login" className="mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-orchard-900 px-4 text-sm font-semibold text-white">Go to login</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="mt-4 text-sm text-charcoal-600">The verification link is invalid or has expired.</p>
            <Link to="/login" className="mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-orchard-900 px-4 text-sm font-semibold text-white">Back to login</Link>
          </>
        )}
      </div>
    </div>
  );
}
