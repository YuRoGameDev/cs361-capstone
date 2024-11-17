"use strict";

const express = require('express');
const app = express();
app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);

app.get('/hello', function (req, res) {
  res.set("Content-Type", "text/plain");
  res.send('Hello World!');
});

app.get('/echo', function (req, res) {
  const value = req.query['input'];
  res.set("Content-Type", "text/plain");
  res.send(value);
});

app.get('/error', function(req, res) {
  res.set("Content-Type", "text/plain");
  res.status(400).send('Error, Bad Request!');
});