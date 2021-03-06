const express = require('express');
const bcrypt = require('bcrypt');
const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');
const multer = require('multer');
const zip = require('unzipper');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const db = require('../db');
const config = JSON.parse(fs.readFileSync('./config.json'));
const log = require('../log');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(basicAuth({
  authorizer: authorizer,
  authorizeAsync: true,
  unauthorizedResponse: getUnauthorizedResponse
}));

function authorizer(username, password, cb) {
  db.getUserHash(username, (err, hash) => {
    if(err || hash === null)
      return cb(null, false);
    else bcrypt.compare(password, hash).then(function(res) {
      return cb(null, res);
    });
  });
}

function getUnauthorizedResponse(req) {
  return "Authorization Error";
} 

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/notes');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4()); 
  } 
}); 
var upload = multer({ storage: storage, limits: { fileSize: config.uploadSizeLimit } }); 

router.get('/profile/:id', (req, res) => {
  db.getUser(req.params.id, (err, profile) => {
    res.json(profile);
  });
});

router.post('/upload', upload.single('file'), (req, res) => {
  log.info('Starting upload ' + req.file.filename);
  let validFrames = false;
  let validFiles = true;
  let thumbnail = false;
  fs.createReadStream('data/notes/' + req.file.filename)
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
      thumbnail = true;
      entry.pipe(fs.createWriteStream('data/thumbnails/' + req.file.filename + '.png'));
    }
    else entry.autodrain();
  })
  .on('error', (err) => {
    validFiles = false;
  })
  .on('finish', () => {
    if(validFiles && validFrames) {
      log.info(`Uploaded note ${req.file.filename} by author ${req.auth.user}`);
      db.insertNote(req.file.filename, req.auth.user, (err) => {
        res.sendStatus(200);
      });
    } else {
      log.error('Upload ' + req.file.filename + ' failed: invalid files');
      if (thumbnail) fs.unlink('data/thumbnails/' + req.file.filename, (err) => { if(err) throw err });
      fs.unlink('data/notes/' + req.file.filename, (err) => { if(err) throw err });
      res.sendStatus(400); 
    }
  });
});


module.exports = router;    