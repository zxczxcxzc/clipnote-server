const express = require('express');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const router = express.Router();


router.get('/', (req, res) => {
  res.json({ title: config.serverTitle, motd: config.serverMOTD, version: config.version, signup: config.signupURL });
});  

router.get('/icon', (req, res) => {
  res.sendFile('icon.png', { root: '.' });
});

router.get('/header', (req, res) => {
  res.sendFile('header.png', { root: '.'});
});

module.exports = router;