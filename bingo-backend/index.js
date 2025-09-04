const express = require('express');
const mongoose = require('mongoose');
const playRoute = require('./routes/playRoute');
const adminRoute = require('./routes/admin'); // ✅ Add this line

const app = express();
app.use(express.json());

app.use('/api', playRoute);
app.use('/admin', adminRoute); // ✅ Mount admin routes

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(3000, () => {
    console.log('✅ index.js backend running on port 3000');
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error (index.js):', err.message);
});
