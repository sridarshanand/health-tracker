const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Health Tracker API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      health: '/api/health',
      stats: '/api/health/stats/summary'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
