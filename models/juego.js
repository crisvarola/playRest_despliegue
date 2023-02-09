const mongoose = require("mongoose");

let edicionesSchema = new mongoose.Schema({
  edicion: {
    type: String,
    required: true,
    trim: true,
  },
  anyo: {
    type: Number,
    required: true,
    min: 2000,
    max: 2023,
  },
});

//modelo juego con subdocumento
let juegoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  jugadores: {
    type: Number,
    required: true,
  },
  tipo: {
    type: String,
    require: true,
    enum: ["rol", "escape", "dados", "fichas", "cartas", "tablero"],
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  imagen: {
    type: String,
    required: false,
  },
  ediciones: [edicionesSchema],
});
let juego = mongoose.model("juegos", juegoSchema);
// let ediciones = mongoose.model("ediciones", edicionesSchema);

module.exports = juego;
