in backend folder: 
npm i 
node index.js

in frontend:
npm i 
npm run dev


<img width="200" alt="image" src="https://github.com/user-attachments/assets/b800f1e3-29f6-437d-b40d-077e1ca46dcf" />
<img width="200" alt="image" src="https://github.com/user-attachments/assets/8910b9ce-26b6-436e-99fc-0f439d133f00" />
<img width="1677" alt="image" src="https://github.com/user-attachments/assets/514934f7-db33-4dab-b6ad-fd614dc0bdea" />

# fullstack-user-management-sequelize
# Fullstack User Management App (Node.js + React + Sequelize)

A full-featured user management application with authentication, role-based access, email verification, password reset, image uploads, and search — built using **Node.js**, **Express**, **MySQL (Sequelize)**, **React.js**, and **Redis**.

---

## 🚀 Features

- 🔐 JWT-based Authentication with Refresh Tokens
- ✅ Email Verification Flow
- 🔁 Password Reset via Email
- 📸 Profile Image Upload with Preview (Multer)
- 👥 Role-Based Access Control (Admin/User)
- 🔍 User Search + Pagination
- ⚡ Redis Caching for performance
- 🌐 Google OAuth Login (Optional)
- 📱 Fully Responsive Frontend (React.js)
- ⚙️ Backend Validation with `express-validator`

---

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MySQL + Sequelize
- Multer (file upload)
- Redis (caching)
- JWT (access + refresh)
- Nodemailer (emails)
- Google OAuth2 (passport)
- Express Validator

### Frontend
- React.js + Axios
- React Hook Form (form validation)
- Responsive Layout (mobile-first)
- Image preview before upload
- Paginated + Searchable user dashboard

---

## 📁 Folder Structure

```bash
backend/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── uploads/
├── app.js
├── server.js
└── .env
