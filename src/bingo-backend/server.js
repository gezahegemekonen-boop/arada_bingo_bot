import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors'; // ✅ Added for Netlify frontend support
import { fileURLToPath } from 'url';

import playersRoute from './routes/players.js';
import healthRoute from './routes/health.js';
import referralRoute from './routes/referral.js';
import depositRoute from './routes/deposit.js';
import adminRoute from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve Telegram Web App frontend (optional)
app.use(express.static(path.join(__dirname, '../webapp')));

// ✅ Serve uploaded screenshots (if used)
app.use('/uploads', express.static('uploads'));

// ✅ Middleware
app.use(cors()); // ✅ Enables cross-origin requests from Netlify
app.use(express.json());
app.use(morgan('dev')); // Logs requests for debugging

// ✅ API Routes
app.use('/players', playersRoute);
app.use('/health', healthRoute);
app.use('/referral', referralRoute);
app.use('/deposit', depositRoute);
app.use('/admin', adminRoute);

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('🎯 Arada Bingo Bot backend is running');
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
