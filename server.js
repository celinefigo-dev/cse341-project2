
const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const { initDb } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Trust Render's reverse proxy
app.set('trust proxy', 1);

// Middleware
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:3000/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Home route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.send(`
      <h1>Travel Tours API</h1>
      <p>Welcome, ${escapeHtml(req.user.username || 'User')}!</p>
      <p>You are successfully logged in with GitHub.</p>
      <a href="/api-docs">API Documentation</a>
      <br><br>
      <a href="/logout">Logout</a>
    `);
  }

  res.send(`
    <h1>Travel Tours API is running!</h1>
    <p>Welcome to the Travel Tours API.</p>
    <a href="/login">Login with GitHub</a>
    <br><br>
    <a href="/api-docs">API Documentation</a>
  `);
});

// Escape HTML in user-supplied values
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

// GitHub login route
app.get(
  '/login',
  passport.authenticate('github', {
    scope: ['user:email']
  })
);

// GitHub OAuth callback route
app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login-failed'
  }),
  (req, res) => {
    res.redirect('/');
  }
);

// Login failure route
app.get('/login-failed', (req, res) => {
  res.status(401).send(`
    <h2>GitHub Login Failed</h2>
    <p>Authentication was unsuccessful.</p>
    <a href="/login">Try Again</a>
  `);
});

// Logout route
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

// Swagger API documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Import routes
const toursRoutes = require('./routes/tours');
const bookingsRoutes = require('./routes/bookings');

// API routes
app.use('/tours', toursRoutes);
app.use('/bookings', bookingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);

  res.status(err.status || 500).json({
    message: 'An error occurred while processing the request.'
  });
});

// Start server
const startServer = async () => {
  try {
    await initDb();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
