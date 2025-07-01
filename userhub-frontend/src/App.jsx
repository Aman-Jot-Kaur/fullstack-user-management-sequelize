import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { setupAxiosInterceptors } from '@/api/axios';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import MyProfile from './pages/Dashboard/MyProfile';
import UserList from './components/UI/UserList';
import Layout from './components/Layout/Layout';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
export default function App() {
  const { auth, login, logout, loading } = useAuth();

useEffect(() => {
  if (!loading) {
    setupAxiosInterceptors(auth, login, logout);
  }
}, [auth, loading]);
;
  if (loading) {
    return <div className="p-10 text-center text-purple-500">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />
 

<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />

         <Route
          element={
              <Layout />
         
          }
        >
        <Route path="/admin/userlist" element={<AdminRoute><UserList/></AdminRoute>}/>
        {/* <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        /> */}

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
