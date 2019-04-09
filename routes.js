/* api endpoints */
const express = require('express');
const basicAuth = require('express-basic-auth')
const multer = require('multer');
const zip = require('unzipper');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const db = require('./db');
const config = JSON.parse(fs.readFileSync('./config.json'));

const router = express.Router();

/*
router.use(basicAuth({
    users: { 'nobody': 'pass' },
    unauthorizedResponse: getUnauthorizedResponse
}));

function getUnauthorizedResponse(req) {
  return "Authorization Error";
} */

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/notes');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4()); 
  } 
});
var upload = multer({ storage: storage, limits: { fileSize: config.fileSizeLimit } }); 



router.get('/info', (req, res) => {
  res.json({ title: config.serverTitle, motd: config.serverMOTD });
});  

router.get('/icon', (req, res) => {
  res.sendFile('icon.png', { root: __dirname });
});

router.get('/list', (req, res) => {
  db.listNotes(req.query.page, (err, notes) => {
    res.json(notes);
  });
});

router.get('/note/:noteId', (req, res) =>  {
  db.getNote(req.params.noteId, (err, note) => {
    res.json(note);
  });
});

router.get('/thumbnail/:noteId', (req, res) => {
  db.getNote(req.params.noteId, (err, note) => {
    if(note.length != 0) {
      fs.access(__dirname + '/data/thumbnails/' + req.params.noteId + '.png', fs.F_OK, (err) => {
        if(err) res.sendStatus(404);
        else res.sendFile(req.params.noteId + '.png', { root: __dirname + '/data/thumbnails/' });
      });
    } else res.sendStatus(404);
  });
});

router.get('/download/:noteId', (req, res) => {
  db.getNote(req.params.noteId, (err, note) => {
    if(note.length != 0)
      res.download(__dirname + '/data/notes/' + req.params.noteId, req.params.noteId + '.clip');
    else res.sendStatus(404);
  });
});

router.post('/upload', upload.single('file'), (req, res) => {
  console.log('Starting upload ' + req.file.filename);
  var validFiles = true;
  var validFrames;
  fs.createReadStream(__dirname + '/data/notes/' + req.file.filename)
  .pipe(zip.Parse())
  .on('entry', (entry) => {
    if(!(entry.path.endsWith('.png') || entry.path.endsWith('.ogg') || entry.path.endsWith('.ini'))) {
      validFiles = false;
      entry.autodrain();
    }
    else if(entry.path.includes('0,') && entry.path.endsWith('.png')) {
      validFrames = true;
      entry.autodrain();
    }
    else if(entry.path == "thumb.png") {
      entry.pipe(fs.createWriteStream(__dirname + '/data/thumbnails/' + req.file.filename + '.png'));
    }
    else entry.autodrain();
  
  })
  .on('error', (err) => {
    validFiles = false;
  })
  .on('finish', () => {
    if(validFiles && validFrames) {
      console.log('Upload ' + req.file.filename + ' completed.');
      db.insertNote(req.file.filename, req.body.author, (err) => {
        res.sendStatus(200);
      });
    } else {
      console.log('Upload ' + req.file.filename + ' failed: invalid files');
      fs.unlink(__dirname + '/data/notes/' + req.file.filename, (err) => { if(err) throw err });
      res.sendStatus(400); 
    }
  });
});


module.exports = router;    