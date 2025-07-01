// pages/auth/ResetPassword.jsx
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '@/api/axios';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');

  const onSubmit = async (data) => {
    try {
      await axios.post('/auth/reset-password', { token, newPassword: data.password });
      toast.success('Password reset successful');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-purple-700 text-center">Reset Password</h2>
        <input {...register('password')} type="password" placeholder="New password" className="w-full p-3 border rounded-xl" />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-xl w-full">Reset Password</button>
      </form>
    </div>
  );
}
