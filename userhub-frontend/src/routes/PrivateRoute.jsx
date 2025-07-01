import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute({ children }) {
  const { auth, loading } = useAuth();

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (!auth?.user || !auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }
 
  return children;
}
