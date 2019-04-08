/* clipnote server */

const express = require('express');
const fs = require('fs');
const app = express();
const db = require('./db');
const routes = require('./routes');
const config = JSON.parse(fs.readFileSync('./config.json'));

var version = 0.1;

if (!fs.existsSync(__dirname + '/data')) {
	fs.mkdirSync(__dirname + '/data');
	fs.mkdirSync(__dirname + '/data/notes');
	fs.mkdirSync(__dirname + '/data/thumbnails');
}

db.connect(config);

app.use('/v1', routes);
app.listen(config.port, () => console.log('-clipnote server v' + version + '-'));