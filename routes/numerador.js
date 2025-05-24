const express = require('express');
const router = express.Router();

const numeradorContr = require('../controllers/numeradorController');

// Endpoints para CRUD de Numerador
router.post('/cadastrar', numeradorContr.cadastrarNumerador);
router.get('/listar', numeradorContr.listarNumeradores);
router.get('/:id', numeradorContr.obterNumeradorPorId);
router.put('/atualizar/:id', numeradorContr.atualizarNumerador);
router.delete('/:id', numeradorContr.removerNumerador);

module.exports = router;
