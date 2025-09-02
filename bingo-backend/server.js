// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import playRoute from './routes/play.js';
import adminRoute from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.send('✅ Server is running');
});

// API routes
app.use('/api/play', playRoute);
app.use('/api/admin', adminRoute);

// Serve frontend (optional)
app.use(express.static(path.join(__dirname, '../bingo-frontend')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
