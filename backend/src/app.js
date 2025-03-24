const express = require('express');
const router = require('./router');
const path = require('path');

const app = express();

app.use(express.json())
// app.use(express.static('./src'))
app.use('/', express.static(path.join(__dirname, 'public')));

app.post('/api/save',(resquest,response) => response.status(200).json());
app.post('/api/validate',(resquest,response) => response.status(200).json());
app.post('/api/publish',(resquest,response) => response.status(200).json());
app.post('/api/stop',(resquest,response) => response.status(200).json());
app.post('/api/execute',(resquest,response) =>
    {
        console.log(resquest.body) 
        return response.status(200).json();
    }
);

module.exports = app;

