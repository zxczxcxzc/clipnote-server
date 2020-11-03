/* database functions */
const MongoClient = require('mongodb').MongoClient;
const log = require('./log.js');
var db;
module.exports = {
	connect: function(server, database) {
		MongoClient.connect(server, {useUnifiedTopology: true}, function(err, client) {
		if(err) throw err;
		else {
			db = client.db(database);
			log.info("Connected to database");
		}
	  });
	},
	
	listNotes: function(page, sort, max, cb) {
		if(max === undefined) max = 6;
		var skip = max * (page - 1);
		var order;
		switch(sort) {
			case 'time':
				order = {time: -1};
				break;
			case 'score':
				order = {rating: -1};
				break;
			default: 
				order = {time: 1};
				break;
		}
		db.collection("notes").find({}).toArray(function(err, res) {
			var total = Math.ceil(res.length / max);
			db.collection("notes").find({}, {projection: {_id: 0}}).skip(skip).limit(parseInt(max)).sort(order).toArray(function(error, result) {
				return cb(error, {notes: result, totalPages: total});
			});
		});
	},

	getNote: function(note, cb) {
		db.collection("notes").findOne({uuid: note}, {projection: {_id: 0}}, function(err, result) {
			return cb(err, result);
		});
	},

	insertNote: function(uuid, author, cb) {
		var obj = {
			uuid: uuid,
			author: author,
			locked: false,
			spinoff: false,
			rating: 0,
			time: new Date()
		}
		db.collection("notes").insertOne(obj, function(err, res) {
			if (err) throw err;
			return cb(err);
		});
	},

	getUser: function(username, cb) {
		db.collection("users").findOne({username: username}, {projection: {_id: 0, username: 1, permissions: 1, stars: 1, joinDate: 1}}, function (err, res) {
			return cb(err, res);
		});
	},

	getUserHash: function(username, cb) {
		db.collection("users").findOne({username: username}, {projection: {hash: 1}}, function(err, res) {
			if(res !== null) return cb(err, res['hash']);
			else return cb(err, null)
		});
	},
};