// src/components/Layout.jsx
import LogoutButton from '../UI/LogoutButton';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Outlet } from 'react-router-dom';
const Layout = () => {
  const { auth } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔮 Navbar */}
      <nav className="bg-purple-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <Link to={auth?.user?.role === 'admin' ? '/admin/userlist' : '/profile'}>
          <h1 className="text-xl font-bold tracking-wide">User Dashboard</h1>
        </Link>
{auth?.user?.role === 'admin' && <Link to={ '/profile'}>Profile</Link>}
{auth?.user?.role === 'admin' && <Link to={ '/admin/userlist'}>Userlist</Link>}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{auth?.user?.fullName}</span>
          <LogoutButton />
        </div>
      </nav>

     <main className="p-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
      </div>
  );

};

export default Layout;
