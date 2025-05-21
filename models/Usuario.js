const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');

// Função para obter a data e hora no fuso horário de São Paulo
function obterDataHoraSaoPaulo() {
  const agora = new Date();
  const offset = -3; // Fuso horário de São Paulo (UTC-3)
  const dataSaoPaulo = new Date(agora.getTime() + offset * 60 * 60 * 1000);
  return dataSaoPaulo;
}

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  senhaHash: { type: String, required: true },
  status: { type: String, default: 'ativo' },
  perfil: { type: String, default: 'usuario'},
  criadoEm: { type: Date }
}, {
    timestamps: {
      createdAt: 'criadoEm', //renomeia o campo createdAt
      updatedAt: 'atualizadoEm', 
      currentTime: obterDataHoraSaoPaulo //funçao personalizada que define dt/hr
    }
  }
);

module.exports = mongoose.model('Usuario', usuarioSchema);
