import { useNavigate } from 'react-router-dom';

export function useRoute() {
  const navigate = useNavigate();

  return {
    routeToSignup: () => navigate('/signup'),
    routeToLogin: () => navigate('/login'),
    routeToMain: () => navigate('/'),
  };
}
