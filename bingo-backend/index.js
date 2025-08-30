const express = require('express');
const mongoose = require('mongoose');
const playRoute = require('./routes/playRoute');

const app = express();
app.use(express.json());
app.use('/api', playRoute);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(3000, () => console.log("Server running on port 3000")))
  .catch(err => console.error(err));
