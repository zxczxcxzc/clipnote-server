const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
	res.send('index');
});

router.get('/list', (req, res) => {
	res.send('not implemented');
});

router.get('/user', (req, res) =>  {
	res.send('not implemented');
});

module.exports = router;