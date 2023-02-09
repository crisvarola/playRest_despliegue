
const bcrypt = require('bcrypt');
const express = require("express");

let Usuario = require(__dirname + "/../models/usuario.js");

let router = express.Router();

// Vista de login
router.get('/login', (req, res) => {
    res.render('auth_login');
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