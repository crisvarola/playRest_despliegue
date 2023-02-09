const express = require("express");
const multer = require('multer');

let Juego = require(__dirname + "/../models/juego.js");
let autenticado = require(__dirname + "/../utils/auth.js");
let router = express.Router();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname)
  }
})

const upload = multer({ storage: storage });

//No entendí muy bien en el enunciado del trabajo, si había que poner en las rutas /juegos o sustituirlo por admin.. al final decidi dejarlo así, 
//me pareció que en algun lado se contradecía, asi que bueno te dejo el comentario para que sepas.

// Listado general
router.get('/', (req, res) => {
    Juego.find().then(resultado => {
        res.render('admin_juegos', { juegos: resultado});
    }).catch (error => {
      res.render('admin_error');
    }); 
});

// Formulario de nuevo juego
router.get('/nuevo', (req, res) => {
    res.render('admin_juegos_form');
});

// Formulario de edición de juego
router.get('/editar/:id', autenticado, (req, res) => {
  Juego.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('admin_juegos_form', {juego: resultado});
        } else {
            res.render('admin_error', {error: "juego no encontrado"});
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

// Ficha de juego
router.get('/:id', (req, res) => {
    Juego.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('admin_juego', { juego: resultado});
        else    
            res.render('admin_error', {error: "juego no encontrado"});
    }).catch (error => {
    }); 
});

// Insertar juegos
router.post('/', autenticado, upload.single('imagen'),(req, res) => {
    let nuevoJuego = new Juego({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        edad:req.body.edad,
        jugadores: req.body.jugadores,
        tipo: req.body.tipo,
        editorial: req.body.editorial,
        precio: req.body.precio,
        imagen: req.file.filename
    });
    nuevoJuego.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
      console.log(nuevoJuego);
        res.render('admin_error', {error: "Error insertando juego"});
    });
});

// Borrar juego
router.delete('/:id', autenticado, (req, res) => {
    Juego.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error', {error: "Error borrando juego"});
    });
});

// Modificar juego
router.put('/:id', upload.single('imagen', { storage: storage }), (req, res) => {
  let juego = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    edad:req.body.edad,
    jugadores: req.body.jugadores,
    tipo: req.body.tipo,
    editorial: req.body.editorial,
    precio: req.body.precio,
  };

  if (req.file) {
    juego.imagen = req.file.filename;
  }

  Juego.findByIdAndUpdate(req.params.id, { $set: juego }, {new: true, runValidators: true})
    .then(resultado => {
      res.redirect(req.baseUrl);
    })
    .catch(error => {
      res.render('error', {error: "Error modificando juego"});
    });
});

// Formulario de nueva edicion
router.get("/ediciones/:id", (req, res) => {
  Juego.findById(req.params.id).then(resultado => {
    if (resultado)
    res.render('add_ediciones', { juego: resultado});
    else    
    res.render('admin_error', {error: "juego no encontrado"});
}).catch (error => {
  res.render('admin_error', {error: "error cargando la página"});
}); 

});

//Servicio para añadir ediciones
router.put("/ediciones/:idJuego", autenticado, (req, res) => {
  //buscar por id, y luego hacer push
  Juego.findById(req.params.idJuego)
    .then((resultado) => {
      if (resultado) {
        resultado.ediciones.push({
          edicion: req.body.edicion,
          anyo: req.body.anyo,
        });
        resultado.save().then((resultado) => {
            res.redirect(req.baseUrl);
        });
      } else
        res.render('admin_error', {error: "Error añadiendo la edición al juego"});
    })
    .catch((error) => {
        res.render('admin_error', {error: "Error añadiendo la edición al juego"});
    });
});

//Servicio para borrar ediciones por la id_edición
router.delete("/ediciones/:idJuego/:idEdicion", autenticado, (req, res) => {
  Juego.findById(req.params.idJuego)
    .then((resultado) => {
      if (resultado) {
        if (
          resultado.ediciones.filter(
            (filtro) => filtro._id == req.params.idEdicion
          ).length > 0
        ) {
          let edicionEncontrada = resultado.ediciones.filter(
            (filtro) => filtro._id != req.params.idEdicion
          );
          resultado.ediciones = edicionEncontrada;
          resultado.save().then((resultado) => {
            res.redirect(req.baseUrl);
          });
        }
      } else
      res.render('admin_error', {error: "Error borrando la edición del juego"});
    })
    .catch((error) => {
        res.render('admin_error', {error: "Error borrando la edición del juego"});
    });
});


module.exports = router;
