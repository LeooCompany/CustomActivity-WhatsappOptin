const express = require('express');
const router = require('./router');
const path = require('path');

const app = express();

app.use(express.json())
// app.use(express.static('./src'))
app.use('/', express.static(path.join(__dirname, 'public')));

app.post('/api/save',(resquest,response) => {
    console.log('Salvando jornada...');
    response.status(200).json()
});
app.post('/api/validate',(resquest,response) => {
    console.log('Validando jornada...');
    response.status(200).json()
});
app.post('/api/publish',(resquest,response) => {
    console.log('Publicando jornada...');
    response.status(200).json()
});
app.post('/api/stop',(resquest,response) => {
    console.log('Parando jornada...');
    response.status(200).json()
});
app.post('/api/execute',(resquest,response) =>
    {
        // let {metadata, ...cleanData} = resquest.body;
        console.log('Obtendo dados do Contato...');
        console.log(resquest.body);
        return response.status(200).json(); 
    }
);

module.exports = app;

