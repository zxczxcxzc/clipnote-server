const express = require('express');

const multer = require('multer');
const zip = require('unzipper');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const db = require('../db');
const config = JSON.parse(fs.readFileSync('./config.json'));
const router = express.Router();


router.get('/list', (req, res) => {
  db.listNotes(req.query.page, req.query.sort, (err, notes) => {
    res.json(notes);
  });
});

router.get('/info/:noteId', (req, res) =>  {
  db.getNote(req.params.noteId, (err, note) => {
    if(note.length != 0)
      res.json(note);
    else res.sendStatus(404);
  });
});

router.get('/thumbnail/:noteId', (req, res) => {
  db.getNote(req.params.noteId, (err, note) => {
    if(note.length != 0) {
      fs.access('data/thumbnails/' + req.params.noteId + '.png', fs.F_OK, (err) => {
        if(err) res.sendStatus(404);
        else res.sendFile(req.params.noteId + '.png', { root: 'data/thumbnails/' });
      });
    } else res.sendStatus(404);
  });
});

router.get('/download/:noteId', (req, res) => {
  var id = req.params.noteId;

  if(id.endsWith('.clip'))
    id = id.split('.clip')[0];

  db.getNote(id, (err, note) => {
    if(note.length != 0)
      res.download(__dirname + '/data/notes/' + id, id + '.clip');
    else res.sendStatus(404);
  });
});

module.exports = router;    