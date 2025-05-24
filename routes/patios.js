const express = require('express');
const router = express.Router();

const patioContr = require('../controllers/patioController');

// Endpoints para CRUD de patio
router.post('/cadastrar', patioContr.cadastrarPatio);
router.get('/listar', patioContr.listarPatios);
router.get('/:id', patioContr.obterPatioPorId);
router.put('/atualizar/:id', patioContr.atualizarPatio);
router.delete('/:id', patioContr.removerPatio);

// resetar o contador
router.put('/reset-counter', patioContr.resetCounter);

// listar contadores
router.get('/contadores', patioContr.listarContadores);

module.exports = router;
