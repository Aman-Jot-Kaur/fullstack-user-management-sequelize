import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { auth } = useAuth();

if (!auth.user || !auth.accessToken) {
    return <p>please login again</p>;
  }
  if (auth.user?.role !== 'admin') {
    return <div className="text-center mt-10 text-red-500 font-semibold">Access Denied</div>;
  }

  return children;
};

export default AdminRoute;
