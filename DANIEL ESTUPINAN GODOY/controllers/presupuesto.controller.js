// controllers/presupuesto.controller.js
import Presupuesto from "../models/presupuesto.model.js";
import mongoose from "mongoose";

export const getAllPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find({}, { __v: 0 });
    return res.status(200).json({ presupuestos });
  } catch (error) {
    return res.status(500).json({ msg: 'Error al obtener presupuestos', error });
  }
};

export const getPresupuestoById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: 'Id no válido' });
    const p = await Presupuesto.findById(id, { __v: 0 });
    if (!p) return res.status(404).json({ msg: 'Presupuesto no encontrado' });
    return res.status(200).json({ presupuesto: p });
  } catch (error) {
    return res.status(500).json({ msg: 'Error al obtener presupuesto', error });
  }
};

export const postPresupuesto = async (req, res) => {
  try {
    const body = req.body;
    const pres = new Presupuesto(body);
    const validationError = pres.validateSync();
    if (validationError) {
      const errorMessages = Object.values(validationError.errors).map(e => e.message);
      return res.status(400).json({ msg: errorMessages });
    }
    await pres.save();
    return res.status(201).json({ presupuesto: pres });
  } catch (error) {
    return res.status(500).json({ msg: 'Error al guardar presupuesto', error });
  }
};

export const putPresupuesto = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: 'Id no válido' });
    const pres = await Presupuesto.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!pres) return res.status(404).json({ msg: 'Presupuesto no encontrado' });
    return res.status(200).json({ presupuesto: pres });
  } catch (error) {
    return res.status(500).json({ msg: 'Error al actualizar presupuesto', error });
  }
};

export const deletePresupuesto = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: 'Id no válido' });
    const pres = await Presupuesto.findByIdAndDelete(id);
    if (!pres) return res.status(404).json({ msg: 'Presupuesto no encontrado' });
    return res.status(200).json({ msg: 'Presupuesto eliminado', presupuesto: pres });
  } catch (error) {
    return res.status(500).json({ msg: 'Error al eliminar presupuesto', error });
  }
};
