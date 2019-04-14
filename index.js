/* clipnote server */
const express = require('express');
const cors = require('cors');
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

app.use(cors());

app.use('/info', info);
app.use('/note', note);
app.use('/user', user);


app.listen(config.port, () => console.log('-clipnote server v' + config.serverVersion + '-'));