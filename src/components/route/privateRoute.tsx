import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/hooks/useAuthStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? <>{children}</> : null;
}

