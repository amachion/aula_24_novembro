const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const Cliente = require('./models/cliente');
const clienteRouters = require('./rotas/clientes');

mongoose.connect('mongodb+srv://hamilton:161810@cluster0.dweok.mongodb.net/Cliente?retryWrites=true&w=majority')
    .then(() => {
        console.log("Conexão OK")
    }).catch(() => {
        console.log("Conexão NOK")
    });


app.use(bodyParser.json());



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
});

app.use('/api/clientes', clienteRouters);

module.exports = app;