const express = require("express");
const router = express.Router();
const Cliente = require('../models/cliente');
const multer = require("multer");

const MIME_TYPE_EXTENSAO_MAPA = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/bmp': 'bmp'
}

const { split } = require("ts-node");
const armazenamento = multer.diskStorage ({
  destination: (req, file, callback) => {
    let e = MIME_TYPE_EXTENSAO_MAPA[file.mimetype] ? null : new Error ('Mime Type Invalido');
    callback(null, "backend/imagens")
  },
  filename: (req, file, callback) => {
    const nome = file.originalname.toLowerCase().split(" ").join("-");
    const extensao = MIME_TYPE_EXTENSAO_MAPA[file.mimetype];
    callback (null, `${nome}-${Date.now()}.${extensao}`);
  }
})

// busca todos os clientes.
router.get('', (req, res, next) => {
    Cliente.find().then(documents => {
        //console.log(documents)
        res.status(200).json({
            mensagem: "Tudo OK",
            clientes: documents
        });
    })
});

// adicionando um cliente.
router.post('', multer({storage: armazenamento}).single('imagem'), (req, res, next) => {
    const imagemURL = `${req.protocol}://${req.get('host')}`
    const cliente = new Cliente({
        nome: req.body.nome,
        fone: req.body.fone,
        email: req.body.email,
        imagemURL:`${imagemURL}/imagens/$req.filename}`
    })
    cliente.save().
    then(clienteInserido => {
        res.status(201).json({
            mensagem: 'Cliente inserido',
            id: clienteInserido._id
        })
    })
});

// removendo um cliente
router.delete('/:id', (req, res, next) => {
    Cliente.deleteOne({ _id: req.params.id }).then((resultado) => {
        //console.log(req.params);
        res.status(200).json({ mensagem: "Cliente removido" })
    });
});

// atualizando um cliente
router.put("/:id", (req, res, next) => {
    const cliente = new Cliente({
        _id: req.params.id,
        nome: req.body.nome,
        fone: req.body.fone,
        email: req.body.email
    });
    Cliente.updateOne({ _id: req.params.id }, cliente)
        .then((resultado) => {
            console.log(resultado)
        });
    res.status(200).json({ mensagem: 'Atualização realizada com sucesso' })
});

router.get('/:id', (req, res, next) => {
    Cliente.findById(req.params.id).then(cli => {
        if (cli) {
            res.status(200).json(cli);
        } else
            res.status(404).json({ mensagem: "Cliente não encontrado!" })
    })
});

module.exports = router;
