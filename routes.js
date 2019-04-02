/* api endpoints */
const express = require('express');
const multer = require('multer');
const zip = require('unzipper');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const db = require('./db');
const config = JSON.parse(fs.readFileSync('./config.json'));

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/notes');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4()); //Generate a UUIDv4 to use for the filename
  }
});
var upload = multer({ storage: storage, limits: {fileSize: config.fileSizeLimit} }); 



router.get('/info', (req, res) => {
  res.json({ title: config.serverTitle, motd: config.serverMOTD });
});   

router.get('/list', (req, res) => {
  db.listNotes(null, (err, notes) => {
    res.json(notes);
  });
});

router.get('/note/:noteId', (req, res) =>  {
  db.getNote(req.params.noteId, (err, note) => {
    res.json(note);
  });
});

router.get('/download/:noteId', (req, res) => {
  db.getNote(req.params.noteId, (err, note) => {
    if(note.length != 0)
      res.sendFile(req.params.noteId, { root: __dirname + '/data/notes/' });
    else res.sendStatus(404);
  });
});


router.post('/upload', upload.single('file'), (req, res) => {
  var success = true;
  fs.createReadStream(__dirname + '/data/notes/' + req.file.filename)
  .pipe(zip.Parse())
  .on('entry', (entry) => {
    if(!(entry.path.endsWith('.png') || entry.path.endsWith('.ogg') || entry.path.endsWith('.ini')))
      success = false;
    entry.autodrain();
  })
  .on('error', (err) => {
    success = false;
  })
  .on('finish', () => {
      if(success) {
        db.insertNote(req.file.filename, req.body.author, (err) => {
          res.sendStatus(200);
        });
      } else {
        fs.unlink(__dirname + '/data/notes/' + req.file.filename, (err) => { if(err) throw err } );
        res.sendStatus(400);
      }
  });
});


module.exports = router;    