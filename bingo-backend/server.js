// server.js

const express = require('express');
const app = express();
const playRoute = require('./routes/play');

app.use(express.json());
app.use('/api', playRoute);

// Optional: serve frontend from here
app.use(express.static('../bingo-frontend'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Bingo backend running on port ${PORT}`);
});

