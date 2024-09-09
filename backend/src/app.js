require('dotenv').config();

const cookieSession = require('cookie-session');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('./config/passport');

const middlewares = require('./middlewares');
const routes = require('./routes');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Extract root domain using URL parser
const frontendUrl = new URL(process.env.FRONTEND_URL);
const rootDomain = frontendUrl.hostname.split('.').slice(-2).join('.');

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Cookie session configuration
app.use(
  cookieSession({
    name: 'session',
    keys: ['secretKey1', 'secretKey2'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    domain: rootDomain, // Use root domain dynamically
    secure: process.env.NODE_ENV === 'production', // Ensure cookies are secure in production
    httpOnly: true, // Prevent client-side JS from accessing the cookie
    sameSite: 'lax', // Prevent CSRF by allowing cookies only in first-party contexts
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend is up and running!',
  });
});

// Mount API routes
app.use('/', routes);

// Error handling
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Routes
module.exports = app;
