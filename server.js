"use strict";

//Changed Client to Pool
const { Pool } = require('pg');
const express = require('express');
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "build")));
//app.use(express.static("public"));
app.use(express.json());
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "0.0.0.0";
//app.listen(PORT);
const fs = require('fs');

// app.use((req, res, next) => {
//   const origin = req.get("Origin") || req.get("Referer");
//   if (!origin || !origin.includes("localhost:8000")) {
//     return res.redirect("/"); 
//     //return res.status(403).json({ error: "Direct access to API is forbidden" });
//   }
//   next();
// });

app.use((req, res, next) => {
  const origin = req.get("Origin") || req.get("Referer");

  // Allow requests from localhost during development and the EC2 public address in production
  const allowedOrigins = [`http://localhost:8000`, `http://3.144.76.209:8000`, "ec2-3-144-76-209.us-east-2.compute.amazonaws.com:8000"];
  
  if (!origin || !allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
    return res.redirect("/"); // Redirect to home page if not from allowed origins
  }

  next();
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});



//Changed new Client to new Pool
const clientConfig = new Pool({
  user: 'postgres',
  host: 'my-pace-postgresql.c9wo2yq84f4w.us-east-2.rds.amazonaws.com',
  database: 'steam_games_db',
  password: 'mypacepostgresql',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  }
});


app.get('/hello', function (req, res) {
  //res.set("Content-Type", "text/plain");
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
  const client = await clientConfig.connect();

  try {
    const query = `
SELECT 
    user_id, 
    game_name, 
    behavior, 
     MAX(value) AS value
FROM steam_user_activity
GROUP BY user_id, game_name, behavior
ORDER BY game_name ASC
LIMIT 500;
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
  await client.release();
});

//POST request that inserts the data
app.post('/add-game', async function (req, res) {
  const { user_id, game_name, behavior, value } = req.body;
  const client = await clientConfig.connect();

  try {
    const query = await client.query(
      'INSERT INTO steam_user_activity (user_id, game_name, behavior, value) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, game_name, behavior, value]
    );
    res.send(query.rows[0]);

  } catch (error) {
    res.status(500).json({ error: "Failed to insert", details: error.message });
  }
  await client.release();

});

//PUT request that updates users activity
app.put('/update-game', async function (req, res) {
  const { user_id, game_name, behavior, value } = req.body;
  const client = await clientConfig.connect();

  try {
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
  await client.release();
});


//DELETE request that deletes a game
app.delete('/delete-game', async function (req, res) {

  const { user_id, game_name } = req.body;
  //Removed creating a new client and just connected to the pool
  //const client = new Client(clientConfig);
  const client = await clientConfig.connect();
  try {
    //await client.connect();

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
  //await client.end();
  await client.release();
});




