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

app.get('/', (req, res) => {
  const teams = JSON.parse(fs.readFileSync('./data/teams.db.json'));
  const teamsLength = teams.length;
  res.render('teams', {
    layout: 'main',
    data: {
      teams,
      teamsLength,
    },
  });
});
app.get('/team-creado', (req, res) => {
  const teams = JSON.parse(fs.readFileSync('./data/teams.db.json'));
  const teamsLength = teams.length;
  res.render('team-creado', {
    layout: 'main',
    data: {
      teamsLength,
    },
  });
});

app.get('/new-team', (req, res) => {
  const teamsLength = JSON.parse(fs.readFileSync('./data/teams.db.json')).length;
  res.render('new-team', {
    layout: 'main',
    data: {
      teamsLength,
    },
  });
});

app.get('/team/:tla', (req, res) => {
  const teams = JSON.parse(fs.readFileSync('./data/teams.db.json'));
  const teamsLength = teams.length;
  const teamTla = req.params.tla;
  const oneTeam = teams.find((team) => team.tla === teamTla);
  const {
    name, tla, crestUrl, address, website, founded, country = oneTeam.area.name,
  } = oneTeam;
  res.render('team', {
    layout: 'main',
    data: {
      name,
      tla,
      country,
      crestUrl,
      address,
      website,
      founded,
      teamsLength,
    },
  });
});

