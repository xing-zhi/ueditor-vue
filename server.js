const path = require('path');

const express = require('express');
const busboy = require('connect-busboy');

const handleUeditor = require('./handle-ueditor');

const app = express();

app.use(express.static('public'));
app.use(busboy());

app.use('/ueditor', handleUeditor);

app.listen(3000);

console.log('http://localhost:3000');
