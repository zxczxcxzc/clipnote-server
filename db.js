/* database functions */
const mysql = require('mysql');
var connection;
module.exports = {
	connect: function(config) {
		connection = mysql.createConnection({
 			host     : config.sqlHost,
  			user     : config.sqlUser,
			password : config.sqlPassword, 
			database : config.sqlDB
		});
		connection.connect();
	},

	listNotes: function(page, sort, cb) {
		var query = 'SELECT uuid, author, locked, spinoff, rating, time FROM notes WHERE hidden = 0';
		switch (sort) {
			case 'time':
				query += ' ORDER BY time DESC';
				break;
			case 'score':
				query += ' ORDER BY rating DESC';
				break;
		}
		if(page !== undefined) query += ' LIMIT ?, 6';
		start_index = (page - 1) * 6;
		connection.query(query, [start_index], function (error, results, fields) {
			return cb(error, results);
		});
	},

	getNote: function(note, cb) {
		connection.query('SELECT uuid, author, locked, rating, time FROM notes WHERE uuid = ?', [note], function (error, results, fields) {
  			return cb(error, results);
		});	
	},

	insertNote: function(uuid, author, cb) {
		connection.query('INSERT INTO notes (uuid, author) VALUES (?, ?)', [uuid, author], function (error, results, fields) {
			return cb(error);
		});
	},

	addStar: function(uuid, stars, cb) {
		connection.query('UPDATE notes SET rating = rating + ? WHERE uuid = ?', [stars, uuid], function (error, results, fields) {
			return cb(error);
		});
	}
};