require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const logger = require('./middlewares/logger'); // Importa o middleware

const app = express();

// Middlewares globais
app.use(express.json());
app.use(logger); // Usa o middleware de logger


// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado ao MongoDB"))
  .catch(err => console.error("Erro ao conectar ao MongoDB", err));

// Importar rotas
const usuarioRoutes = require('./routes/usuarios');
const acessoRoutes = require('./routes/acessos');

app.use('/usuarios', usuarioRoutes);
app.use('/acessos', acessoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
