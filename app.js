require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', require('./routes'));

app.get('/', (req, res) => {
  res.send('Welcome to the Car Shipping API');
});

// Centralized error handling middleware
app.use(require('./backend/src/middleware/errorHandler'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
