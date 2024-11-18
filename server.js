"use strict";

const { Client } = require('pg');
const express = require('express');
const app = express();
app.use(express.static("public"));
app.use(express.json());
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
    rejectUnauthorized: true,
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

  try {
    await client.connect();

    const query = `
   SELECT 
      user_id,
      game_name,
      behavior,
      COUNT(*) AS activity_count,
      SUM(value) AS total_value
    FROM steam_user_activity
    GROUP BY user_id, game_name, behavior
    ORDER BY activity_count DESC;
`;

    const result = await client.query(query);
    if (result.rowCount < 1) {
      res.status(500).send("Internal Error - No Games Found");
    } else {
      res.set("Content-Type", "application/json");
      res.send(result.rows);
    }
  }
  catch (error) {
    res.status(500).json({ error: "Failed to read", details: error.message });
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
  await client.end();

});

//PUT request that updates users activity
app.put('/update-game', async function (req, res) {
  const { user_id, game_name, behavior, value } = req.body;
  const client = new Client(clientConfig);

  try {
    await client.connect();

    const query = await client.query(
      `UPDATE steam_user_activity
      SET value = $1
       WHERE user_id = $2 AND game_name = $3 AND behavior = $4
       RETURNING *`,
      [value, user_id, game_name, behavior]
    );

    if (query.rowCount === 0) {
      res.status(404).send("No record found to update");
    } else {
      res.send(query.rows[0]); // Send the updated record as JSON
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update record", details: error.message });
  }
  await client.end();
});


// Example of setting Content Security Policy (CSP) headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'none'; connect-src 'self' http://ec2-18-222-75-52.us-east-2.compute.amazonaws.com:8000;");
  next();
});


//DELETE request that deletes an ID
app.delete('/delete-game', async function (req, res) {
  
  const { user_id, game_name } = req.params;
  const client = new Client(clientConfig);

  try {
    await client.connect();

    const query = await client.query(
      'DELETE FROM steam_user_activity WHERE "user_id" = $1 AND "game_name" = $2 RETURNING *',
      [user_id, game_name]
    );


    if (query.rowCount === 0) {
      res.status(404).send("No record found to delete");
    } else {
      res.send(query.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete record", details: error.message });
  }
  await client.end();
});


