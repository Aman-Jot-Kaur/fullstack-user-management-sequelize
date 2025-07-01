// src/validations/registerSchema.js
import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  fullName: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  profileImage: yup
  .mixed()
  .test('fileSize', 'Image too large (max 2MB)', value => {
    if (!value || value.length === 0) return true; // No file is okay
    return value[0].size <= 2_000_000;
  })
  .test('fileType', 'Only image files allowed', value => {
    if (!value || value.length === 0) return true;
    return ['image/jpeg', 'image/png', 'image/jpg'].includes(value[0].type);
  })

});
