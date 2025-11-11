// models/presupuesto.model.js
import mongoose from "mongoose";

const presupuestoSchema = new mongoose.Schema({
  propietario: {
    type: String,
    required: [true, 'El nombre del propietario es requerido']
  },
  marca: {
    type: String,
    required: [true, 'La marca es requerida'],
    enum: ['AMD', 'Intel', 'NVIDIA', 'Asus', 'Acer', 'HP', 'Lenovo', 'MSI', 'Gigabyte', 'Other']
  },
  presupuesto: {
    type: Number,
    required: [true, 'El presupuesto es requerido'],
    min: [0, 'El presupuesto debe ser mayor o igual a 0']
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es requerida']
  }
}, { timestamps: true });

const Presupuesto = mongoose.model('Presupuesto', presupuestoSchema);
export default Presupuesto;

