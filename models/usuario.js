const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


let usuarioSchema = new mongoose.Schema({
    login: {
      type: String,
      required: true,
      trim: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      max: 2023,
    },
  });

// Metodo para encriptar la contraseña antes de guardarla en la bda
usuarioSchema.pre('save', async function (next) {
  const usuario = this;
  if (!usuario.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(usuario.password, salt);
    usuario.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});
  const usuario = mongoose.model("usuario", usuarioSchema);

  module.exports = usuario;