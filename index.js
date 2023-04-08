const express = require('express');

const app = express();
const PORT = '8007';

const fs = require('fs');
const exphb = require('express-handlebars').engine;
app.engine('handlebars', exphb());
app.set('view engine', 'handlebars');
