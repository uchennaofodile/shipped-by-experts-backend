import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import routes from './routes/index.js';
import { sanitizeInput } from './middleware/sanitize.js';
import { rateLimit } from './middleware/rateLimit.js';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(cors());

// Stripe webhook raw body parser (must be before express.json)
app.post('/api/payments/webhook', bodyParser.raw({ type: 'application/json' }));

app.use(express.json());
app.use(sanitizeInput);
app.use(rateLimit());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Shipped By Experts API');
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
