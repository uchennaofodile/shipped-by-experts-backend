// Import dependencies
const express = require('express');
const { Client } = require('pg');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const geolib = require('geolib');
const mapbox = require('@mapbox/mapbox-sdk/services/directions'); // Mapbox SDK for directions

// Load environment variables from .env file
dotenv.config();

// Set up Express
const app = express();
app.use(express.json());

// PostgreSQL client
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Connect to PostgreSQL
client.connect().catch(err => console.error('Connection error', err.stack));

// Set up Mapbox client
const mapboxClient = mapbox({ accessToken: process.env.MAPBOX_API_KEY });

// Route for customer registration
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      'INSERT INTO customers (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'Customer registered', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error registering customer', error: err.stack });
  }
});

// Route for customer login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query('SELECT * FROM customers WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.stack });
  }
});

// Route to book shipment
app.post('/api/book-shipment', async (req, res) => {
  const { customer_id, vehicle_details, pickup_location, dropoff_location, estimated_date } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO shipments (customer_id, vehicle_details, pickup_location, dropoff_location, estimated_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [customer_id, vehicle_details, pickup_location, dropoff_location, estimated_date]
    );
    res.status(201).json({ message: 'Shipment booked successfully', shipment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error booking shipment', error: err.stack });
  }
});

// Route to get available truckers
app.get('/api/available-truckers', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM truckers WHERE available = true');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching truckers', error: err.stack });
  }
});

// Route to assign trucker based on proximity and optimize route using Mapbox API
app.post('/api/assign-trucker', async (req, res) => {
  console.log("Assign trucker route hit"); // Debugging log
  const { shipment_id, pickup_location, dropoff_location, waypoints } = req.body;

  try {
    // Get available truckers
    const truckers = await client.query('SELECT * FROM truckers WHERE available = true');

    let closestTrucker = null;
    let minDistance = Infinity;

    truckers.rows.forEach(trucker => {
      const truckerLocation = { latitude: trucker.latitude, longitude: trucker.longitude };
      const distance = geolib.getDistance(pickup_location, truckerLocation);
      
      if (distance < minDistance) {
        closestTrucker = trucker;
        minDistance = distance;
      }
    });

    // If a trucker is found, proceed with route optimization using Mapbox API
    if (closestTrucker) {
      const optimizedWaypoints = [pickup_location, ...waypoints, dropoff_location];

      // Convert waypoints to the required format for Mapbox API
      const coordinates = optimizedWaypoints.map(point => [point.longitude, point.latitude]); // 

      // Request to Mapbox Directions API for optimized route
      const directionsResponse = await mapboxClient.getDirections({
        waypoints: coordinates,
        profile: 'driving', // This can be 'driving', 'walking', 'cycling', etc.
        steps: true,
        geometries: 'geojson', // To get the route geometry as GeoJSON
      }).send();

      const optimizedRoute = directionsResponse.body.routes[0].geometry.coordinates;

      // Log the optimized route and assign it to the shipment
      console.log('Optimized Route:', optimizedRoute);

      // Store the optimized route in the database
      await client.query('UPDATE shipments SET trucker_id = $1, route_data = $2 WHERE id = $3', [
        closestTrucker.id,
        JSON.stringify(optimizedRoute),
        shipment_id
      ]);

      res.json({ message: 'Shipment assigned to trucker and route optimized', trucker: closestTrucker, optimizedRoute });
    } else {
      res.status(404).json({ message: 'No available truckers found' });
    }
  } catch (err) {
    console.error('Error assigning trucker and optimizing route:', err.stack); // Log error
    res.status(500).json({ message: 'Error assigning trucker and optimizing route', error: err.stack });
  }
});

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Close PostgreSQL connection on exit
process.on('exit', () => {
  client.end();
});
