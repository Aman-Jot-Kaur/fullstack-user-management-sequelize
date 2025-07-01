// src/components/LogoutButton.jsx
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clears localStorage + context
    navigate('/login'); // redirect to login
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition-all text-sm"
    >
      🚪 Logout
    </button>
  );
};

export default LogoutButton;
