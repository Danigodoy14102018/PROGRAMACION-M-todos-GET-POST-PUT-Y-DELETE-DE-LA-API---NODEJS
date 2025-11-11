import { Router } from "express";
import presupuesto from "./presupuesto.routes.js";

const indexRoutes = Router();

indexRoutes.use('/presupuestos', presupuesto);

export default indexRoutes;
