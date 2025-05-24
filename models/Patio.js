const mongoose = require('mongoose');


// Função para obter a data e hora no fuso horário de São Paulo
function obterDataHoraSaoPaulo() {
  const agora = new Date();
  const offset = -3; // Fuso horário de São Paulo (UTC-3)
  const dataSaoPaulo = new Date(agora.getTime() + offset * 60 * 60 * 1000);
  return dataSaoPaulo;
}

const patioSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  numero:    { type: Number, unique: true }, // Campo de autonumeração
  eventoDER: { type: String, required: true },
  numRv:     { type: String, required: true },
  situacao:  { type: String, required: false },
  dtRecolha: { type: String, required: false },
  localPatioRecolha: { type: String, required: true },
  numBO:     { type: String, required: false },
  marca:     { type: String, required: false },
  modelo:    { type: String, required: false },
  placa:     { type: String, required: true },
  msg:       { type: String, required: false },
  dtMovimentacao: { type: String, required: true },
}, {
  timestamps: {
    createdAt: 'criadoEm', //renomeia o campo createdAt
    updatedAt: 'atualizadoEm', 
    currentTime: obterDataHoraSaoPaulo //funçao personalizada que define dt/hr
  }
}
);

const Patio = mongoose.model('Patio', patioSchema);
module.exports = Patio;
