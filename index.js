const express = require('express');
const app = express();
const routes = require('./routes')

app.use('/api', routes);

app.listen(80, () => console.log('up'));