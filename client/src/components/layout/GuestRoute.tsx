import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/account" replace />;
  return <>{children}</>;
}
