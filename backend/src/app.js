const express = require('express');
const router = require('./router');
const path = require('path');
const axios = require('axios');

const app = express();

app.use(express.json())
// app.use(express.static('./src'))
app.use('/', express.static(path.join(__dirname, 'public')));

app.post('/api/save',(req,resp) => {
    console.log('Salvando jornada...');
    resp.status(200).json()
});
app.post('/api/validate',(req,resp) => {
    console.log('Validando jornada...');
    resp.status(200).json()
});
app.post('/api/publish',(req,resp) => {
    console.log('Publicando jornada...');
    resp.status(200).json()
});
app.post('/api/stop',(req,resp) => {
    console.log('Parando jornada...');
    resp.status(200).json()
});
app.post('/api/execute', async (req,resp) =>
    {
        console.log('Obtendo dados do Contato...');
        try {
            const contactId = req.body.inArguments[0].ContactID;
            const phone = req.body.inArguments[1].usedPhoneField;
            const locale = req.body.inArguments[1].usedLocaleField;
            const status = req.body.inArguments[1].optinStatus;
            
            token = await GetToken();
    
            console.log(token); // ! Está retornando um Promise (Tem que arrumar)
    
            // Avaliar o status do clinte
            const userWhatsappStatus = '';
    
            if (status == 1) {
                // OPTIN: Se não tiver optin, deixar como optin
            } else {
                // OPTOUT: Se for optin não tiver opção,  deixar como optout
            }
    
            return resp.status(200).json();  
        } catch (error) {
            return resp.status(500).json({ error: 'Error while trying to process the request' });
        }
    }  
);

module.exports = app;

async function GetToken() {
    // ! Pegar o token apenas uma vez e armazenar em cash
    // Pegar Token API
    try {
        const response= await axios.post(
            'https://mczy4z4pr0jrrrmchxtpzh9kj180.auth.marketingcloudapis.com/v2/token', // Endpoint
            { // Body
                grant_type: "client_credentials",
                client_id: "1q3aa5k724nu7xkbt26vjuhr",
                client_secret: "tG0cElcwqZsEXMYyPdQ4LWqQ",
                account_id: "110005209"
            }
        )
    
        const token = "Bearer " + response.data.access_token;
        const tokenExpiracion = response.data.expires_in;
    
        return token
    } catch (error) {
        console.error("Erro ao obter token:", error.response?.data || error.message);
        return error
    }
}

