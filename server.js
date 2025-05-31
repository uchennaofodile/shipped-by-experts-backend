// Import dependencies
const express = require('express');
const { Client } = require('pg');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const geolib = require('geolib');
//const mapbox = require('@mapbox/mapbox-sdk/services/directions'); // Mapbox SDK for directions

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
//const mapboxClient = mapbox({ accessToken: process.env.MAPBOX_API_KEY });

// Route to add a new shipment
app.post('/api/add-shipment', async (req, res) => {
  const { customer_id, pickup_location, dropoff_location, estimated_date, vehicle_id } = req.body;

  // Input validation
  if (!customer_id || !pickup_location || !dropoff_location || !estimated_date || !vehicle_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Insert the new shipment into the shipments table
    const result = await client.query(
      'INSERT INTO shipments (customer_id, pickup_location, dropoff_location, estimated_date, vehicle_id) VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), ST_SetSRID(ST_MakePoint($4, $5), 4326), $6, $7) RETURNING id',
      [
        customer_id,
        pickup_location.longitude,
        pickup_location.latitude,
        dropoff_location.longitude,
        dropoff_location.latitude,
        estimated_date,
        vehicle_id
      ]
    );

    // Return the ID of the newly created shipment
    res.status(201).json({ message: 'Shipment added successfully', shipmentId: result.rows[0].id });
  } catch (err) {
        console.error('Error adding shipment:', err.stack);
        res.status(500).json({ message: 'Error adding shipment', error: err.stack });
      }
    });


// Route to get all shipments
app.get('/api/shipments', async (req, res) => {
  try {
    // Query to get all shipments
    const result = await client.query('SELECT * FROM shipments');
    
    // Return the shipments
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching shipments:', err.stack);
    res.status(500).json({ message: 'Error fetching shipments', error: err.stack });
  }
});

// Route to assign trucker based on proximity and optimize route using TSP
app.post('/api/assign-trucker', async (req, res) => {
  //console.log("Assign trucker route hit"); // Debugging log
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

    // If a trucker is found, proceed with route optimization using Dynamic Programming (Held-Karp)
    if (closestTrucker) {
      const locations = [pickup_location, ...waypoints, dropoff_location];
      const numLocations = locations.length;

      // Calculate all pairwise distances between locations
      const distanceMatrix = Array.from({ length: numLocations }, () => Array(numLocations).fill(0));

      for (let i = 0; i < numLocations; i++) {
        for (let j = 0; j < numLocations; j++) {
          if (i !== j) {
            distanceMatrix[i][j] = geolib.getDistance(
              { latitude: locations[i].latitude, longitude: locations[i].longitude },
              { latitude: locations[j].latitude, longitude: locations[j].longitude }
            );
          }
        }
      }

      // DP Table: dp[mask][i] represents the minimum distance to visit all the locations in mask and end at location i
      const dp = Array.from({ length: 1 << numLocations }, () => Array(numLocations).fill(Infinity));
      dp[1][0] = 0; // Starting at pickup location

      // Iterate through all subsets of locations
      for (let mask = 1; mask < (1 << numLocations); mask++) {
        for (let u = 0; u < numLocations; u++) {
          if ((mask & (1 << u)) === 0) continue; // If u is not in the set, skip it

          for (let v = 0; v < numLocations; v++) {
            if ((mask & (1 << v)) !== 0) continue; // If v is already in the set, skip it
            const newMask = mask | (1 << v);
            dp[newMask][v] = Math.min(dp[newMask][v], dp[mask][u] + distanceMatrix[u][v]);
          }
        }
      }

      // The optimal route distance is the minimum distance to visit all locations and return to the start
      let optimalRouteDistance = Infinity;
      let lastLocation = -1;

      for (let i = 1; i < numLocations; i++) {
        if (dp[(1 << numLocations) - 1][i] + distanceMatrix[i][0] < optimalRouteDistance) {
          optimalRouteDistance = dp[(1 << numLocations) - 1][i] + distanceMatrix[i][0];
          lastLocation = i;
        }
      }

      // Reconstruct the optimal route
      let route = [pickup_location];
      let mask = (1 << numLocations) - 1;

      while (lastLocation !== 0) {
        route.push(locations[lastLocation]);
        const prevMask = mask ^ (1 << lastLocation);
        for (let i = 0; i < numLocations; i++) {
          if (dp[mask][lastLocation] === dp[prevMask][i] + distanceMatrix[i][lastLocation]) {
            lastLocation = i;
            mask = prevMask;
            break;
          }
        }
      }

      route.push(dropoff_location); // Add the dropoff location

      console.log('Optimal Route:', route);
      console.log('Optimal Route Distance:', optimalRouteDistance);

      // Store the optimized route in the database
      await client.query('UPDATE shipments SET trucker_id = $1, route_data = $2 WHERE id = $3', [
        closestTrucker.id,
        JSON.stringify(route),
        shipment_id
      ]);

      res.json({ message: 'Shipment assigned to trucker and route optimized', trucker: closestTrucker, optimizedRoute: route });
    } else {
      res.status(404).json({ message: 'No available truckers found' });
    }
  } catch (err) {
    console.error('Error assigning trucker and optimizing route:', err.stack); // Log error
    res.status(500).json({ message: 'Error assigning trucker and optimizing route', error: err.stack });
  }
});
// Route to authenticate a trucker
app.post('/api/authenticate-trucker', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if trucker exists
    const result = await client.query('SELECT * FROM truckers WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Trucker not found' });
    }

    const trucker = result.rows[0];

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, trucker.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: trucker.id, email: trucker.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Authentication successful', token });
  } catch (err) {
    console.error('Error authenticating trucker:', err.stack); // Log error
    res.status(500).json({ message: 'Error authenticating trucker', error: err.stack });
  }
});
// Route to register a new trucker
app.post('/api/register-trucker', async (req, res) => {
  const { name, email, password, latitude, longitude } = req.body;

  try {
    // Check if trucker already exists
    const existingTrucker = await client.query('SELECT * FROM truckers WHERE email = $1', [email]);
    if (existingTrucker.rows.length > 0) {
      return res.status(400).json({ message: 'Trucker already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new trucker into the database
    const newTrucker = await client.query(
      'INSERT INTO truckers (name, email, password, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword, latitude, longitude]
    );

    res.status(201).json({ message: 'Trucker registered successfully', trucker: newTrucker.rows[0] });
  } catch (err) {
    console.error('Error registering trucker:', err.stack); // Log error
    res.status(500).json({ message: 'Error registering trucker', error: err.stack });
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
