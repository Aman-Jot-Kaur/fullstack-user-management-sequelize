// pages/auth/ForgotPassword.jsx
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from '@/api/axios';

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post('/auth/forgot-password', data);
      toast.success('Reset link sent to email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-purple-700 text-center">Forgot Password</h2>
        <input {...register('email')} placeholder="Enter your email" className="w-full p-3 border rounded-xl" />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-xl w-full">Send Reset Link</button>
      </form>
    </div>
  );
}
