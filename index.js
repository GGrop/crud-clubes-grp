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

app.post('/new-team', upload.single('shield'), (req, res) => {
  const teams = JSON.parse(fs.readFileSync('./data/teams.db.json'));
  const {
    name, tla, country, address, website, founded,
  } = req.body;
  const state = teams.find((team) => team.tla === tla.toUpperCase());
  if (state) {
    res.render('new-team', {
      layout: 'main',
      data: {
        error: 'Ops! The team you want to create has an existing TLA, try it again',
      },
    });
  } else {
    const newTeam = {
      area: {
        name: country,
      },
      name,
      tla: tla.toUpperCase(),
      country,
      crestUrl: `/shields/${req.file.filename}`,
      address,
      website,
      founded,
    };
    teams.push(newTeam);
    fs.writeFile('./data/teams.db.json', JSON.stringify(teams), (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          teams,
        },
      });
    });
    res.redirect('/team-creado');
  }
  res.render('new-team', {
    layout: 'main',
  });
});

app.post('/', (req, res) => {
  const allTeams = JSON.parse(fs.readFileSync('./data/teams.json'));
  fs.writeFile('./data/teams.db.json', JSON.stringify(allTeams), (err) => {
    res.status(200).json({
      status: 'success',
      data: {
        allTeams,
      },
    });
  });
  res.redirect('/');
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

app.get('/team/:tla/delete', (req, res) => {
  const teams = JSON.parse(fs.readFileSync('./data/teams.db.json'));
  const teamsLength = teams.length;
  const teamTla = req.params.tla;
  const oneTeam = teams.find((team) => team.tla === teamTla);
  const {
    name, tla, country = oneTeam.area.name, crestUrl, address, website, founded,
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
      delete: true,
    },
  });
});

app.get('/team/:tla/edit', (req, res) => {
  const teams = JSON.parse(fs.readFileSync('./data/teams.db.json'));
  const teamsLength = teams.length;
  const teamTla = req.params.tla;
  const oneTeam = teams.find((team) => team.tla === teamTla);
  const {
    name, tla, crestUrl, address, website, founded, country = oneTeam.area.name,
  } = oneTeam;
  res.render('team-edit', {
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

