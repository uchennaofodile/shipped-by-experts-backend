const express = require('express');
const app = express();

app.use(express.json()); // For parsing application/json

app.get('/', (req, res) => {
  res.send('Shipped By Experts API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Load environment variables from .env file
require('dotenv').config();

//Connect to PostgreSQL database
const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,        // Username from the .env file
  host: process.env.DB_HOST,        // Host from the .env file
  database: process.env.DB_DATABASE,// Database name from the .env file
  password: process.env.DB_PASSWORD,// Password from the .env file
  port: process.env.DB_PORT,        // Port from the .env file
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

 //Create registration route
 app.post('/register', async (req, res) => {
  const { name, email, password, user_type } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await client.query(
      'INSERT INTO users (name, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, user_type]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
}); 

//Create login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.rows[0].id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});