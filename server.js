const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();

// CORS configuration for frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://notes-app-frontend-red.vercel.app',
  'https://notes-app-frontend-885gox1cp-joao-dias-projects-c47a3e98.vercel.app',
  'https://notes-app-frontend-fimhwk2vu-joao-dias-projects-c47a3e98.vercel.app',
];

// preflight middleware for all requests (solves Render CORS)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// parse JSON bodies
app.use(express.json());

// test API route
app.get('/api', (req, res) => {
  res.json({ message: 'API running' });
});

// optional root route for browser testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

// actual app routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
