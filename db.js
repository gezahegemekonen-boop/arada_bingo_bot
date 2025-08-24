const mongoose = require('mongoose');

async function connectDB() {
  const url = process.env.DB_URL;
  if (!url) {
    console.error("Missing DB_URL env var");
    process.exit(1);
  }
  await mongoose.connect(url, { });
  console.log("MongoDB connected");
}

module.exports = { connectDB };

