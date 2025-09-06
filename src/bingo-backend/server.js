import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import playersRoute from './routes/players.js';
import healthRoute from './routes/health.js';
import referralRoute from './routes/referral.js';
import depositRoute from './routes/deposit.js';   // ✅ Deposit + Confirmation
import adminRoute from './routes/admin.js';       // ✅ Admin dashboard

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve Telegram Web App frontend from src/webapp
app.use(express.static(path.join(__dirname, '../webapp')));

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use('/players', playersRoute);
app.use('/health', healthRoute);
app.use('/referral', referralRoute);
app.use('/deposit', depositRoute);   // includes /deposit and /deposit/confirm
app.use('/admin', adminRoute);       // includes /admin/payouts and approvals

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('Arada Bingo Bot backend is running 🎯');
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
