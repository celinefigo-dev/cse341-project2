const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const { initDb } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth Strategy
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// GitHub login
app.get(
  '/login',
  passport.authenticate('github', {
    scope: ['user:email']
  })
);

// GitHub callback
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        "https://cse341-project2-clr4.onrender.com/github/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
// Logout
app.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    res.redirect('/');
  });
});

// Home route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `Logged in as ${req.user.username}. <a href="/logout">Logout</a>`
    );
  } else {
    res.send(
      'Travel Tours API is running! <a href="/login">Login with GitHub</a>'
    );
  }
});

// Swagger documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Tours and booking routes
const toursRoutes = require('./routes/tours');
const bookingsRoutes = require('./routes/bookings');

app.use('/tours', toursRoutes);
app.use('/bookings', bookingsRoutes);

const startServer = async () => {
  try {
    await initDb();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
};

startServer();