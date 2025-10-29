import { Router } from "express";
import ejemplo from "./ejemplo.routes.js";

const indexRoutes = Router();

indexRoutes.use('/ejemplo', ejemplo);

export default indexRoutes;
