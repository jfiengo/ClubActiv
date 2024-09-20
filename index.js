// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Import required modules

// Express
import express from 'express';
const app = express();

//Sessions
import session from 'express-session';
app.use(
  session({
    secret: 'your-secret-key', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Session expires after 1 day
    },
  })
);

// Parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (from API clients)
app.use(express.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Access environment variables
const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT isn't defined
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to Database
import mongoose from 'mongoose';
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => console.error('Database connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

// Import Routes
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';

// Use Routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

// Application code
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Connected to database at ${DATABASE_URL}`);
});
