import express from "express";
import { isAuth, isAdmin } from "../middlewares/auth.js";
import { privatePage } from "../controllers/private.js";
import { adminPage } from "../controllers/admin.js";

const router = express.Router();

router.get("/", isAuth, privatePage);

router.get("/admin", isAuth, isAdmin, adminPage);

export default router;
