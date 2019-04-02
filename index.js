/* clipnote server */

const express = require('express');
const fs = require('fs');
const app = express();
const db = require('./db');
const routes = require('./routes');
const config = JSON.parse(fs.readFileSync('./config.json'));

db.connect(config);

app.use('/v1', routes);
app.listen(3000, () => console.log('up'));