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
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cookie session configuration
app.use(
  cookieSession({
    name: 'session',
    keys: ['secretKey1', 'secretKey2'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
