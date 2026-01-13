import { Router } from "express";
const router = Router();
import { index } from "../controllers/indexController.js";

router.get("/", index);

export default router;