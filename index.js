const express = require('express');

const app = express();
const PORT = '8007';

const fs = require('fs');
const exphb = require('express-handlebars').engine;


const multer = require('multer');

const upload = multer({ dest: './uploads/shields' });
app.engine('handlebars', exphb());
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/assets`));
app.use(express.static(`${__dirname}/uploads`));

