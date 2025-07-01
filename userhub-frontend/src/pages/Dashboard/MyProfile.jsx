// src/pages/MyProfile.jsx
import { useEffect, useState } from 'react';
import axios from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import {motion} from 'framer-motion'
export default function MyProfile() {
  const { logout,auth } = useAuth();

  



  return (
    <motion.div
      className="max-w-md mx-auto mt-14 bg-white p-8 rounded-3xl shadow-2xl border border-purple-100 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-30 animate-ping" />
      <img
        src={auth?.user?.profileImage ? `http://localhost:8081/uploads/${auth?.user?.profileImage}` : `https://ui-avatars.com/api/?name=${auth?.user?.fullName}`}
        alt="Profile"
        className="w-28 h-28 rounded-full mx-auto mb-4 shadow-md border-4 border-purple-200 object-cover"
      />
      <h2 className="text-2xl font-bold text-center text-purple-700">{auth?.user?.fullName}</h2>
      <p className="text-center text-gray-600">{auth?.user?.email}</p>
      <p className="text-center mt-2 text-sm text-purple-500 capitalize">{auth?.user?.role}</p>
    </motion.div>
  );
}
