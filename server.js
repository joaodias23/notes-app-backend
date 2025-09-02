const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();

// middleware
// allow frontend running on localhost:5173 to access backend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173' , 'https://notes-app-frontend-om23tqbzn-joao-dias-projects-c47a3e98.vercel.app/'],
}));
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
