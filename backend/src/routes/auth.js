const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../db');
const passport = require('../config/passport');
const { signupSchema } = require('../config/validationSchema');

const router = express.Router();

// Profile route
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.status(200).json({ message: `Welcome ${req.user.email}!` });
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'User already exists with same email' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });
    return res.status(201).json({
      message: 'User signup successfully',
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'User signup failed' });
  }
});

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging in' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in' });
      }
      return res.status(200).json({
        message: 'Logged in successfully',
        user: {
          ...user,
          password: undefined,
        },
      });
    });
  })(req, res, next);
});

// Protected route (e.g., dashboard)
router.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.status(200).json({ message: `Welcome ${req.user.email}!` });
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Google OAuth login route
router.get(
  '/google/login',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard'),
);

module.exports = router;
