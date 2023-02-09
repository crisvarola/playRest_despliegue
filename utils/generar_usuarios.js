const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost:27017/playrest_v3');

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