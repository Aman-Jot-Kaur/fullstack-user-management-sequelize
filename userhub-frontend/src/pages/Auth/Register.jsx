import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/validations/registerSchema';
import { useState } from 'react';
import axios from '@/api/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const [preview, setPreview] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('profileImage', data.profileImage[0]);

      const res = await axios.post('/auth/register', formData);
      toast.success(res.data.message);
      reset(); // Clear form
      setPreview(null);
      setSelectedFileName('');
    } catch (err) {
     
      toast.error(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold text-center text-purple-700">Register</h2>

        <input {...register('fullName')} placeholder="Full Name" className="w-full p-3 border rounded-xl" />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}

        <input {...register('email')} type="email" placeholder="Email" className="w-full p-3 border rounded-xl" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input {...register('password')} type="password" placeholder="Password" className="w-full p-3 border rounded-xl" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        {/* Custom File Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
          <label className="cursor-pointer bg-purple-100 text-purple-700 py-2 px-4 rounded-lg inline-block text-center w-full hover:bg-purple-200 transition">
            {selectedFileName || 'Choose File'}
            <input
              {...register('profileImage')}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setSelectedFileName(file.name);
                }
              }}
            />
          </label>
          {errors.profileImage && <p className="text-red-500 text-sm mt-1">{errors.profileImage.message}</p>}
        </div>

        {preview && (
          <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-full mx-auto mt-3 shadow-md" />
        )}

        <button className="bg-purple-600 text-white px-4 py-2 rounded-xl w-full hover:bg-purple-700 transition">
          Register
        </button>

        <p className="text-center text-sm text-gray-600 mt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:underline">
            Go to login
          </Link>
        </p>
      </form>
    </div>
  );
}
