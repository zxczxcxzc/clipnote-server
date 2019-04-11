/* api endpoints */
const express = require('express');
const basicAuth = require('express-basic-auth')
const multer = require('multer');
const zip = require('unzipper');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const db = require('../db');
const config = JSON.parse(fs.readFileSync('./config.json'));

const router = express.Router();


router.use(basicAuth({
    users: { 'nobody': 'pass' },
    unauthorizedResponse: getUnauthorizedResponse
}));

function getUnauthorizedResponse(req) {
  return "Authorization Error";
} 

var storage = multer.diskStorage({
  destination: function (req, file, cb) {2
    cb(null, 'data/notes');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4()); 
  } 
});
var upload = multer({ storage: storage, limits: { fileSize: config.fileSizeLimit } }); 



router.get('/profile/:id', (req, res) => {
  res.send('profile');
});


router.post('/upload', upload.single('file'), (req, res) => {
  console.log('Starting upload ' + req.file.filename);
  var validFiles = true;
  var validFrames;
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
      entry.pipe(fs.createWriteStream('data/thumbnails/' + req.file.filename + '.png'));
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
      fs.unlink('data/notes/' + req.file.filename, (err) => { if(err) throw err });
      res.sendStatus(400); 
    }
  });
});


module.exports = router;    