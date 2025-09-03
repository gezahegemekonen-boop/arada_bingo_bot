const express = require('express');
const mongoose = require('mongoose');
const playersRoute = require('./routes/players');
const playRoute = require('./routes/playRoute');
const healthRoute = require('./routes/health');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/players', playersRoute);
app.use('/play', playRoute);
app.use('/health', healthRoute);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Arada Bingo Bot backend is running 🎯');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
