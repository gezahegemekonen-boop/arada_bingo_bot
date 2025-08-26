import mongoose from 'mongoose';

export async function initDb(dbUrl) {
  try {
    await mongoose.connect(dbUrl, { dbName: 'telegram_bingo_bot' });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

