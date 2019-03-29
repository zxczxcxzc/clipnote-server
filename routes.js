const express = require('express');
const mysql = require('mysql');
const router = express.Router();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'clip',
  password : 'temporary', //move these into a config file later
  database : 'clip'
});

connection.connect();



router.get('/', (req, res) => {
	res.send('index');
});

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

module.exports = router;