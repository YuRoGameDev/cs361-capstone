"use strict";

const { Client } = require('pg');
const express = require('express');
const app = express();
app.use(express.static("public"));
const PORT = 8000;
app.listen(PORT);


const clientConfig = new Client({
  user: 'postgres',
  host: 'my-pace-postgresql.c9wo2yq84f4w.us-east-2.rds.amazonaws.com',
  database: 'steam_games_db',
  password: 'mypacepostgresql',
  port: 5432,
  connectionTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false,
  }
});


app.get('/hello', function (req, res) {
  res.set("Content-Type", "text/plain");
  res.send('Hello World!');
});

app.get('/echo', function (req, res) {
  const value = req.query['input'];
  res.set("Content-Type", "text/plain");
  res.send(value);
});


app.get('/error', function (req, res) {
  res.set("Content-Type", "text/plain");
  res.status(400).send('Error, Bad Request!');
});

//GET request that reads the data
app.get('/games', async function (req, res) {
  const client = new Client(clientConfig);
  await client.connect();
  const result = await client.query("SELECT * FROM steam_user_activity");
  if (result.rowCount < 1) {
    res.status(500).send("Internal Error - No Games Found");
  } else {
    res.set("Content-Type", "application/json");
    res.send(result.rows);
  }
  await client.end();
});

//POST request that inserts the data
app.post('/add-game', async function (req, res) {
  const { user_id, game_name, behavior, value } = req.body;
  const client = new Client(clientConfig);

  try {
    await client.connect();
    const query = await client.query(
      'INSERT INTO steam_user_activity (user_id, game_name, behavior, value) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, game_name, behavior, value]
    );
    res.send(query.rows[0]);

  } catch (error) {
    res.status(500).json({ error: "Failed to insert", details: error.message });
  }

});

//PUT request that updates a users activity by putting in their id first, and then the data to update.
app.put('/update-game', async function (req, res) {
  const { id, user_id, game_name, behavior, value } = req.body; 
  const client = new Client(clientConfig);

  try {
    await client.connect();

    const query = await client.query(
      `UPDATE steam_user_activity
       SET user_id = $1, game_name = $2, behavior = $3, value = $4
       WHERE id = $5
       RETURNING *`,
      [user_id, game_name, behavior, value, id]
    );

    if (query.rowCount === 0) {
      res.status(404).send("No record found to update");
    } else {
      res.send(query.rows[0]); // Send the updated record as JSON
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update record", details: error.message });
  } 
});

//DELETE request that deletes an ID
app.delete('/delete-game/:id', async function (req, res) {
  const { id } = req.params; 
  const client = new Client(clientConfig);

  try {
    await client.connect();

    const query = await client.query(
      'DELETE FROM steam_user_activity WHERE id = $1 RETURNING *', [id]
    );


    if (query.rowCount === 0) {
      res.status(404).send("No record found to delete");
    } else {
      res.send(query.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete record", details: error.message });
  } 
});


