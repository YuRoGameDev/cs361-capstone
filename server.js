"use strict";

const { Client } = require('pg');
const express = require('express');
const app = express();
app.use(express.static("public"));
const PORT = 8000;
app.listen(PORT);



// Configure your PostgreSQL client
const clientConfig = new Client({
  user: 'postgres',
  host: 'my-pace-postgresql.c9wo2yq84f4w.us-east-2.rds.amazonaws.com',  // Usually 'localhost' or RDS endpoint
  database: 'steam_games_db',
  password: 'mypacepostgresql',
  port: 5432,  // Default port for PostgreSQL
  connectionTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false,
  }
});

// client.connect()
//   .then(() => console.log('Connected to the database!'))
//   .catch(err => console.error('Database connection error:', err.stack));


// Basic routes
app.get('/hello', function (req, res) {
  res.set("Content-Type", "text/plain");
  res.send('Hello World!');
});

// Echo route (no change here)
app.get('/echo', function (req, res) {
  const value = req.query['input'];
  res.set("Content-Type", "text/plain");
  res.send(value);
});

// Error route (no change here)
app.get('/error', function(req, res) {
  res.set("Content-Type", "text/plain");
  res.status(400).send('Error, Bad Request!');
});

app.get('/games', async function (req, res) {
  const client = new Client(clientConfig);
  await client.connect();
  const result = await client.query("SELECT * FROM steam_user_activity LIMIT 10");
  if (result.rowCount < 1) {
  res.status(500).send("Internal Error - No Games Found");
  } else {
  res.set("Content-Type", "application/json");
  res.send(result.rows);
  }
  await client.end();
  });


// GET route to fetch all records from the steam_user_activity table
// app.get('/games', async function (req, res)  {
//   try {
//       const result = await client.query('SELECT * FROM steam_user_activity'); // Query to fetch all steam_user_activity records
//       res.json(result.rows); // Send data as JSON response
//   } catch (err) {
//       console.error(err);
//       res.status(500).send('Server Error');
//   }
// });

// POST route to add a new record to the steam_user_activity table
// app.post('/games', async (req, res) => {
//   const { user_id, game_name, behavior, value } = req.body;
//   try {
//       const result = await client.query(
//           'INSERT INTO steam_user_activity (user_id, game_name, behavior, value) VALUES ($1, $2, $3, $4) RETURNING *',
//           [user_id, game_name, behavior, value]
//       );
//       res.json(result.rows[0]); // Return the inserted data
//   } catch (err) {
//       console.error(err);
//       res.status(500).send('Server Error');
//   }
// });

// // PUT route to update a specific record in the steam_user_activity table
// app.put('/games/:id', async (req, res) => {
//   const { id } = req.params;
//   const { behavior, value } = req.body;
//   try {
//       const result = await client.query(
//           'UPDATE steam_user_activity SET behavior = $1, value = $2 WHERE user_id = $3 RETURNING *',
//           [behavior, value, id]
//       );
//       if (result.rows.length === 0) {
//           return res.status(404).send('Game not found');
//       }
//       res.json(result.rows[0]); // Return the updated data
//   } catch (err) {
//       console.error(err);
//       res.status(500).send('Server Error');
//   }
// });

// // DELETE route to remove a specific record from the steam_user_activity table
// app.delete('/games/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//       const result = await client.query(
//           'DELETE FROM steam_user_activity WHERE user_id = $1 RETURNING *',
//           [id]
//       );
//       if (result.rows.length === 0) {
//           return res.status(404).send('Game not found');
//       }
//       res.json({ message: 'Game deleted' }); // Confirm deletion
//   } catch (err) {
//       console.error(err);
//       res.status(500).send('Server Error');
//   }
// });


