const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const prompt = require('prompt');
const config = JSON.parse(fs.readFileSync('../config.json'));

var schema = {
    properties: {
      username: {
        required: true,
        pattern: /^[A-Za-z0-9-_]{1,25}$/,
        message: "letters, numbers, underscore and dash only, maximum length is 25 characters"
      },
      password: {
        required: true
      },
      permissions: {
        required: true,
        pattern: /^[0-3]$/,
        message: 'Must be 0-3',
        description: "permission level (1 - normal user, 2 - moderator, 3 - admin, 0 - banned)"
      }
    }
};

prompt.start();

prompt.get(schema, function (err, result) {
    MongoClient.connect(config.dbString, {useUnifiedTopology: true}, function(err, client) {
		if(err) throw err;
		else {
            console.log('connected to database');
            let hash = bcrypt.hashSync(result.password, 10);
            let obj = {
                id: uuidv4(),
                username: result.username,
                permissions: result.permissions,
                stars: 0,
                joinDate: new Date(),
                lastLogin: null,
                ban: null,
                hash: hash
            }
			db = client.db(config.dbName);
            db.collection("users").insertOne(obj, function(err, res) {
                if (err) throw err;
                console.log('added user!');
                client.close();
            });
		}
	  });
});
