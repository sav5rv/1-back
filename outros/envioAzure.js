require('dotenv').config();

const { EmailClient } = require("@azure/communication-email");

const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const client = new EmailClient(connectionString);

async function main() {
    const emailMessage = {
        senderAddress: "DoNotReply@258df1dc-ebba-4ce7-86d1-36ebd5f8dbbc.azurecomm.net",
        content: {
            subject: "Email de Teste 2",
            plainText: "Olá, mundo por email.",
            html: `
			<html>
				<body>
					<h1>Olá, mundo por email 2.</h1>
				</body>
			</html>`,
        },
        recipients: {
            to: [{ address: "wsavioli@hotmail.com" }],
        },
        
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
}

main();