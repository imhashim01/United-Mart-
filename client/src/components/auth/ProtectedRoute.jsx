import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation();
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
