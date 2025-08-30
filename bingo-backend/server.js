import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import playRoute from './routes/play.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use('/api', playRoute);

// ✅ Optional: Serve frontend
app.use(express.static('../bingo-frontend'));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Bingo backend running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
