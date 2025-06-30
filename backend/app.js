// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const authRoutes=require("./routes/auth.routes")
const userRoutes=require("./routes/user.routes")

const app = express();
const session = require('express-session');
const passport = require('passport');

app.use(session({
  secret: 'some_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-data
app.use('/uploads', express.static('uploads'));

// Routes (add later)
app.get('/', (req, res) => res.send('Welcome to UserHub API 🔐'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
