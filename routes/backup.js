const express = require('express');
const { listBackups, deleteBackup, createBackup } = require('../controllers/backupController');

const router = express.Router();

// Listar backups
router.get('/', (req, res) => {
    try {
        const backups = listBackups();
        res.json(backups);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar backups.', erro: error.message });
    }
});

// Fazer backup manualmente
router.post('/', async (req, res) => {
    const { format = 'json' } = req.body; // Formato do backup (json ou csv)
    try {
        await createBackup(format);
        res.json({ mensagem: 'Backup criado com sucesso.' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar backup.', erro: error.message });
    }
});

// Deletar backup
router.delete('/:fileName', (req, res) => {
    const { fileName } = req.params;
    try {
        const success = deleteBackup(fileName);
        if (success) {
            res.json({ mensagem: `Backup "${fileName}" deletado com sucesso.` });
        } else {
            res.status(404).json({ mensagem: `Backup "${fileName}" não encontrado.` });
        }
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao deletar backup.', erro: error.message });
    }
});

module.exports = router;
