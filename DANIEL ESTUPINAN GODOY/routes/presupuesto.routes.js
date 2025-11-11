// routes/presupuesto.routes.js
import { Router } from "express";
import {
  getAllPresupuestos,
  getPresupuestoById,
  postPresupuesto,
  putPresupuesto,
  deletePresupuesto
} from "../controllers/presupuesto.controller.js";

const router = Router();

router.get('/', getAllPresupuestos);
router.get('/:id', getPresupuestoById);
router.post('/', postPresupuesto);
router.put('/:id', putPresupuesto);
router.delete('/:id', deletePresupuesto);

export default router;
