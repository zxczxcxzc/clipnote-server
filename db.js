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
		var totalQuery = 'SELECT count(id) FROM notes WHERE hidden = 0';
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
		connection.query(totalQuery, function(error, results, fields) {
			connection.query(query, [start_index], function (err, res, field) {
				var totalPages = results[0]['count(id)'] / 6;
				return cb(err, res, totalPages);
			});
		});
	},

	getNote: function(note, cb) {
		connection.query('SELECT uuid, author, locked, spinoff, rating, time FROM notes WHERE uuid = ?', [note], function (error, results, fields) {
  			return cb(error, results);
		});	
	},

	insertNote: function(uuid, author, cb) {
		connection.query('INSERT INTO notes (uuid, author) VALUES (?, ?)', [uuid, author], function (error, results, fields) {
			return cb(error);
		});
	},

	getUser: function(username, cb) {
		connection.query('SELECT username, permissions, stars, joinDate FROM users WHERE username = ?', [username], function(error, results, fields) {
			return cb(error, results);
		});
	},

	getUserHash: function(username, cb) {
		connection.query('SELECT hash FROM users WHERE username = ?', [username], function(error, results, fields) {
			return cb(error, results);
		});
	},

	addStar: function(user, uuid, cb) {
		this.getUser(user, (err, res) => {
			if(res[0].stars <= 0) return cb("ERROR: No stars");
			else {
				connection.query('UPDATE users SET stars = stars - 1 WHERE username = ?', [user], function(error, results, fields) {
					if(error) return cb(error);
					else {
						connection.query('UPDATE notes SET rating = rating + 1 WHERE uuid = ?', [uuid], function(e, r, f) {
							if(error) return cb(error);
							else return cb(null);
						});
					}
				});
			}
		});
	},
};