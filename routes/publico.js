const express = require("express");
let Juego = require(__dirname + "/../models/juego.js");
const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');

mongoose.connect("mongodb://mymongodb/playrest_v3", { useNewUrlParser: true });
let router = express.Router();

// Listado general
router.get('/', (req, res) => {
    try {
        res.render('publico_index');
        }
       catch (error){
        res.render('error', {error: "No se encontró ningun resultado"});
    }});

// Listado por busqueda
    router.get("/buscar", (req, res) => {
      const nombre = req.query.nombre;
      Juego.find()
        .then((juegos) => {
          const resultados = juegos.filter(juego => juego.nombre.includes(nombre));
          if (resultados.length > 0) {
            res.render("publico_index", { juegos: resultados });
          } else {
            res.render("publico_index", { error: "No se encontraron juegos" });
          }
        })
        .catch((error) => {
          res.render("publico_error");
        });
    });

    router.get('/usuarios', (req, res) => {
      Usuario.collection.drop();
  
      let usu1 = new Usuario({
      login: 'May',
      password: '12345678'
      });
  
      usu1.save();
      res.render("publico_index");
  });
      
// Ficha de juego
router.get('/:id', (req, res) => {
  Juego.findById(req.params.id).then(resultado => {
      if (resultado)
          res.render('publico_juego', { juego: resultado});
      else    
          res.render('error', {error: "juego no encontrado"});
  }).catch (error => {
  }); 
});
module.exports = router;