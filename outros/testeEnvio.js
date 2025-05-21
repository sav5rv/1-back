require('dotenv').config();
const nodemailer = require('nodemailer');

const enviarEmailTeste = async () => {
  try {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // false para TLS (STARTTLS)
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
      from: process.env.SMTP_PASS, // Seu e-mail
      to: 'wsavioli@hotmail.com', // Substitua pelo e-mail de teste
      subject: 'Teste de envio com GMAIL',
      text: 'Este é um e-mail de teste enviado via Nodemailer para GMAIL.',
      html: '<p>Este é um <b>e-mail de teste</b> enviado via Nodemailer para GMAIL.</p>',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso:', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
};

// Executar a função de teste
enviarEmailTeste();
