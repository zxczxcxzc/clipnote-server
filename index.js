/* clipnote server */
var version = 0.2;
const express = require('express');
const fs = require('fs');
const app = express();
const db = require('./db.js');
const config = JSON.parse(fs.readFileSync('./config.json'));

/* routes */
const info = require('./routes/info.js');
const note = require('./routes/note.js');
const user = require ('./routes/user.js');

if (!fs.existsSync(__dirname + '/data')) {
	fs.mkdirSync(__dirname + '/data');
	fs.mkdirSync(__dirname + '/data/notes');
	fs.mkdirSync(__dirname + '/data/thumbnails');
}

db.connect(config);

app.use('/info', info);
app.use('/note', note);
app.use('/user', user);


app.listen(config.port, () => console.log('-clipnote server v' + version + '-'));