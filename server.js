"use strict";
const express = require('express');
const recipes = require('./recipes.js');
const app = express();

app.set('port', process.env.PORT || 3000);

app.use('/api/', (req, res) => {
  res.send(recipes());
});

app.listen(app.get('port'), () => {
  console.log("Test running on port: ", app.get('port'));
});