const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/notes');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4()); //Generate a UUIDv4 to use for the filename
  }
});
var upload = multer({ storage: storage, limits: {fileSize: 5000000} }); //5MB file limit


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'clip',
  password : 'temporary', //move these into a config file later
  database : 'clip'
});
connection.connect();


router.get('/list', (req, res) => {
	connection.query('SELECT * FROM notes', function (error, results, fields) {
  		if (error) throw error;
  		res.json(results);
	});	
});

router.get('/note/:noteId', (req, res) =>  {
	connection.query('SELECT * FROM notes WHERE uuid = ?', [req.params.noteId], function (error, results, fields) {
  		if (error) throw error;
  		res.json(results);
	});	
});


router.post('/upload', upload.single('file'), (req, res) => {
	//todo: add sanity checks
	connection.query('INSERT INTO notes (uuid, author) VALUES (?, ?)', [req.file.filename, req.body.author] , function(error, results, fields) {
		if (error) throw error;
		res.send("uploaded");
	});
});


module.exports = router;