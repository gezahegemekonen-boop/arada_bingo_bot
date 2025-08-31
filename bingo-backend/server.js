import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import playRoute from './routes/play.js';
import depositRoute from './routes/deposit.js';
import adminRoute from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 🛠️ Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use('/api', playRoute);
app.use('/api', depositRoute);
app.use('/api/admin', adminRoute);

// ✅ Serve frontend (Telegram Web App)
app.use(express.static(path.join(__dirname, '../bingo-frontend')));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected (server.js)');
  app.listen(PORT, () => {
    console.log(`🚀 server.js backend running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error (server.js):', err.message);
});
