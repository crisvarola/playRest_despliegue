
const bcrypt = require('bcrypt');
const express = require("express");

let Usuario = require(__dirname + "/../models/usuario.js");

let router = express.Router();

// Vista de login
router.get('/login', (req, res) => {
    res.render('auth_login');
});

 //generar usuarios 
router.get('/usuarios', (req, res) => {
  try{
  Usuario.collection.drop();
  let usu1 = new Usuario({
  login: 'maycalle',
  password: '12345678'
  });
  usu1.save();
  let usu2 = new Usuario({
  login: 'rosamaria',
  password: '87654321'
  });
  usu2.save();
  res.render('auth_login');
  }catch{
    res.render('publico_error', { error: "Error generando usuarios" });
  }
});
 
// Ruta para login
router.post('/login', async (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
  
    try {
      const usuario = await Usuario.findOne({ login: login });
      if (!usuario) {
        return res.render('auth_login', { error: "Usuario o contraseña incorrectos" });
       
      }
      //comprueba contraseña encriptada
      const esValido = await bcrypt.compare(password, usuario.password);
  
      if (!esValido) {
        return res.render('auth_login', { error: "Usuario o contraseña incorrectos" });
        
      }
      req.session.usuario = usuario.login;
      req.session.rol = usuario.rol;
      res.redirect('/admin');
    } catch (error) {
      res.render('error', { error: "Error iniciando sesión" });
    }
  });

// Ruta para logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('auth_login');
});

module.exports = router;