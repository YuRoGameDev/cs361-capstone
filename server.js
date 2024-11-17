"use strict";
const express = require('express');
const { Client } = require('pg');  // Import the PostgreSQL client

const app = express();
app.use(express.static("public"));
const PORT = 8000;

// PostgreSQL client setup
const client = new Client({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'my-pace-postgresql.c9wo2yq84f4w.us-east-2.rds.amazonaws.com', // Replace with your PostgreSQL host, for AWS EC2, it will be the public IP or hostname
  database: 'steam_games_db', // Replace with your database name
  password: 'mypacepostgresql', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// Basic 'Hello World' route
app.get('/hello', function (req, res) {
  res.set("Content-Type", "text/plain");
  res.send('Hello World!');
});

// Echo route to send back the input parameter
app.get('/echo', function (req, res) {
  const value = req.query['input'];
  res.set("Content-Type", "text/plain");
  res.send(value);
});

// GET route to fetch all records from the steam_user_activity table
app.get('/games', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM steam_user_activity'); // Query to fetch all steam_user_activity records
        res.json(result.rows); // Send data as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST route to add a new record to the steam_user_activity table
app.post('/games', async (req, res) => {
    const { user_id, game_name, behavior, value } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO steam_user_activity (user_id, game_name, behavior, value) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, game_name, behavior, value]
        );
        res.json(result.rows[0]); // Return the inserted data
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// PUT route to update a specific record in the steam_user_activity table
app.put('/games/:id', async (req, res) => {
    const { id } = req.params;
    const { behavior, value } = req.body;
    try {
        const result = await client.query(
            'UPDATE steam_user_activity SET behavior = $1, value = $2 WHERE user_id = $3 RETURNING *',
            [behavior, value, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Game not found');
        }
        res.json(result.rows[0]); // Return the updated data
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// DELETE route to remove a specific record from the steam_user_activity table
app.delete('/games/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query(
            'DELETE FROM steam_user_activity WHERE user_id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Game not found');
        }
        res.json({ message: 'Game deleted' }); // Confirm deletion
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

