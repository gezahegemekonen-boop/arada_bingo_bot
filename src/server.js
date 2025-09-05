import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import playersRoute from './routes/players.js';
import healthRoute from './routes/health.js';
import referralRoute from './routes/referral.js'; // ✅ Add this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/players', playersRoute);
app.use('/health', healthRoute);
app.use('/referral', referralRoute); // ✅ Register referral route

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
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
