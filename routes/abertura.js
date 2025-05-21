const mongoose = require('mongoose');
const express = require('express');
// const fetch = require('node-fetch');

const router = express.Router();

// Rota da pag de abertura
router.get("/", async (req, res) => {
    try {
      // Obter data e hora atual no formato local
      const dataHora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

      // Obter o IP do Cliente
      //const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const ip = "191.189.167.58"; //para teste
      console.log(ip);

      // Substitua com sua chave de API do serviço
      const API_KEY="0011d9e2380245ea92488558443b1598";

      // Obter detalhes da localização com base no IP
      const geoResponse = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${ip}`);
      const locationData = await geoResponse.json();

      // Extrair informações da resposta
      const { city, state_prov, country_name, latitude, longitude } = locationData;
      const responseData = {
        ip,
        localizacao: {
          cidade: city || 'Não disponível',
          estado: state_prov || 'Não disponível',
          pais: country_name || 'Não disponível',
          latitude: latitude || 'Não disponível',
          longitude: longitude || 'Não disponível'
        }
      };

      // Verificar o status do banco de dados
      const dbStatus = mongoose.connection.readyState; // Retorna o estado da conexão
      const statusTexto = {
        0: "Desconectado",
        1: "Conectado",
        2: "Conectando",
        3: "Desconectando"
      }[dbStatus] || "Desconhecido";
  
      // Enviar como resposta JSON
      res.status(200).json({
        dataHora,
        statusBanco: statusTexto,
        responseData
      });
    } catch (err) {
      // Caso ocorra algum erro
      res.status(500).json({
        erro: "Erro ao obter informações",
        detalhes: err.message
      });
    }
  });

module.exports = router;