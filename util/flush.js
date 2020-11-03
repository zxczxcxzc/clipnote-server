const fs = require('fs');
const prompt = require('prompt');
const rimraf = require('rimraf');
const MongoClient = require('mongodb').MongoClient;
const config = JSON.parse(fs.readFileSync('../config.json'));

prompt.start();

var schema = {
    properties: {
        notes: {
            message: 'Delete all notes? [yes/no]',
            validator: /y[es]*|n[o]?/,
            warning: 'Must respond yes or no'
        },
        users: {
            message: 'Delete all users? [yes/no]',
            validator: /y[es]*|n[o]?/,
            warning: 'Must respond yes or no'
        }
    }
};

prompt.get(schema, (err, result) => {
    var notes = result.notes.startsWith('y');
    var users = result.users.startsWith('y');
    MongoClient.connect(config.dbString, {useUnifiedTopology: true}, function(err, client) {
        if(err) throw err;
        else {
            db = client.db(config.dbName);
            if(notes) {
                rimraf.sync('../data/');
                console.log('deleted local files');
                db.collection('notes').drop((err, res) => {
                    if(err) throw err;
                    if(res) console.log('cleared notes db');
                    client.close();
                });
            }
            if(users) {
                db.collection('users').drop((err, res) => {
                    if(err) throw err;
                    if(res) console.log('cleared users db');
                    client.close();
                });
            }
        }
    });
});