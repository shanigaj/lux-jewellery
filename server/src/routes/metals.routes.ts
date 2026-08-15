import { Router } from "express";
import { getMetalRates } from "../controllers/metals.controller";

const router = Router();

// Public — the storefront ticker polls this.
router.get("/rates", getMetalRates);

export default router;
