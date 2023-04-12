const express = require('express');

const app = express();
const PORT = '8007';

const fs = require('fs');
const exphb = require('express-handlebars').engine;

const multer = require('multer');

const upload = multer({ dest: './uploads/shields' });
app.engine('handlebars', exphb());
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/assets`));
app.use(express.static(`${__dirname}/uploads`));

// interfaz 10 de especificidad
// interfaz
app.get('/app/team/:tla/delete', (req, res) => {
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

// interfaz
app.get('/app/team/:tla/edit', (req, res) => {
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

// interfaz
app.get('/app/team/:tla', (req, res) => {
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

// interfaz
app.get('/app/team-created', (req, res) => {
  const teams = JSON.parse(fs.readFileSync('./data/teams.db.json'));
  const teamsLength = teams.length;
  res.render('team-created', {
    layout: 'main',
    data: {
      teamsLength,
    },
  });
});

// interfaz
  const teamsLength = JSON.parse(fs.readFileSync('./data/teams.db.json')).length;
app.get('/app/new-team/error', (req, res) => {
  res.render('new-team', {
    layout: 'main',
    data: {
      teamsLength,
    },
  });
});
// interfaz y recurso tengo q separar
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
    res.redirect('/team-created');
  }
  res.render('new-team', {
    layout: 'main',
app.get('/app', (req, res) => {
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

app.get('/', (req, res) => {
  res.redirect('/app');
});

/// /////////////////////// RECURSOOS //////////////////////////////////////////
/// /////////////////////// RECURSOOS //////////////////////////////////////////
/// /////////////////////// RECURSOOS //////////////////////////////////////////

// recurso
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

// recurso
app.post('/team/:tla/edit', upload.single('shield'), (req, res) => {
  const myTla = req.params.tla;
  const {
    name, tla, country, address, website, founded,
  } = req.body;

  const teams = JSON.parse(fs.readFileSync('./data/teams.db.json'));
  const myTeam = teams.find((team) => team.tla === myTla);
  const newTeams = teams.filter((team) => team.tla !== myTla);
  const editedTeams = {
    ...myTeam,
    area: {
      name: country,
    },
    name,
    tla: tla.toUpperCase(),
    address,
    website,
    founded,
  };
  if (req.file) {
    editedTeams.crestUrl = `/shields/${req.file.filename}`;
  }
  newTeams.push(editedTeams);
  fs.writeFileSync('./data/teams.db.json', JSON.stringify(newTeams), (err) => {
    res.status(200).json({
      status: 'success',
      data: {
        editedTeams,
      },
    });
  });
  res.redirect('/');
});

// diferenciar entre interface y recurso interfaz--> app
// recurso quedaria igual

// recurso
app.post('/team/:tla/delete', (req, res) => {
  const teams = JSON.parse(fs.readFileSync('./data/teams.db.json'));
  const teamTla = req.params.tla;
  const newTeams = teams.filter((team) => team.tla !== teamTla);
  fs.writeFile('./data/teams.db.json', JSON.stringify(newTeams), (err) => {
    res.status(200).json({
      status: 'success',
      data: {
        newTeams,
      },
    });
  });
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log('server is starting at port:', PORT);
});
