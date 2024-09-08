const argon2 = require('argon2');
const prisma = require('../db');
const passport = require('../config/passport');
const { signupSchema } = require('../config/validationSchema');

// Handle user profile
exports.getProfile = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res
    .status(200)
    .json({ message: `Welcome ${req.user.email}!`, user: req.user });
};

// Handle user signup
exports.signup = async (req, res) => {
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

    // Hash the password using Argon2
    const hashedPassword = await argon2.hash(password);

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
        password: undefined, // Don't send the password in the response
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'User signup failed' });
  }
};

// Handle user login
exports.login = (req, res, next) => {
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
          password: undefined, // Don't send the password in the response
        },
      });
    });
  })(req, res, next);
};

// Handle Google OAuth login
exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Handle Google OAuth callback
exports.googleCallback = [
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL);
  },
];

// Handle user logout
exports.logout = async (req, res) => {
  await req.logout();
  return res.status(200).json({ message: 'Logged out successfully' });
};
