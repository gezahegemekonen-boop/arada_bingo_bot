require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const playerRoutes = require('./routes/players');
const transactionRoutes = require('./routes/transactions');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/transactions', transactionRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('✅ Bingo Backend is running.');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
