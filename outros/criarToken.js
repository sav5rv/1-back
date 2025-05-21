//require('dotenv').config();
require('dotenv').config({ path: '../.env' }) //o arquivo .js não está na mesma pasta que o .env
const jwt = require('jsonwebtoken');

const id = '67831a8b98c1235660479d75';

 // Gerar o token JWT
    const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    
    console.log(`iD: ${id}`);
    console.log(`ToKen: ${token}`);
    console.log(`https://jwt.io/#debugger-io?token=${token}`)

//link para testar o token - lembrar que o chave secreta é base64
//https://jwt.io/
// lembrar de alterar o id é de acordo com o usuario