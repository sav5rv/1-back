const mongoose = require('mongoose');

// Função para obter a data e hora no fuso horário de São Paulo
function obterDataHoraSaoPaulo() {
  const agora = new Date();
  const offset = -3; // Fuso horário de São Paulo (UTC-3)
  const dataSaoPaulo = new Date(agora.getTime() + offset * 60 * 60 * 1000);
  return dataSaoPaulo;
}


// Definir o Schema do Contador
const counterSchema = new mongoose.Schema({
    collectionName: { type: String, required: true, unique: true }, // Nome do contador
    sequenceValue: { type: Number, required: true } // Valor atual do contador
    }, {
    timestamps: {
      createdAt: 'criadoEm', //renomeia o campo createdAt
      updatedAt: 'atualizadoEm', 
      currentTime: obterDataHoraSaoPaulo //funçao personalizada que define dt/hr
    }
  }
);

const Contador = mongoose.model('Contador', counterSchema);
module.exports = Contador;