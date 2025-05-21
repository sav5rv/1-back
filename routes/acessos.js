const express = require('express');
const router = express.Router();
const autenticar_jwt = require('../middlewares/autenticar');
const { registrarAcesso, obterAcessos, listarTodosAcessos, listarAcessosUsuario } = require('../controllers/acessoController');


// Rota para registrar acessos
router.post('/registrar', registrarAcesso);

// Rota para obter histórico de todos os acessos
//router.get('/obter-acessos', obterAcessos);

router.get('/listar-todos-acessos', autenticar_jwt, listarTodosAcessos); // Listar todos os acessos
router.get('/listar-acesso/:id', autenticar_jwt, listarAcessosUsuario); // Listar acessos de um usuário específico

module.exports = router;