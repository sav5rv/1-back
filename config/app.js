const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

const logger = require('../middlewares/logger'); // Importa o middleware

app.use(express.static(path.join(__dirname, 'public'))); //servindo pasta pública


// Middlewares globais
app.use(express.json());
app.use(logger); // Usa o middleware de logger
app.use(cors());
app.use(bodyParser.json());

// Importar rotas
//const backupRoutes = require('../routes/backup');
app.use('/backup', require('../routes/backup'));

const usuarioRoutes = require('../routes/usuarios');
app.use('/usuarios', usuarioRoutes);

const acessoRoutes = require('../routes/acessos');
app.use('/acessos', acessoRoutes);

const acessoAbertura = require('../routes/abertura');
app.use('/', acessoAbertura);

const patioRoutes = require('../routes/patios');
app.use('/patios', patioRoutes);

const numeradorRoutes = require('../routes/numerador');
app.use('/numerador', numeradorRoutes);


module.exports = app;