import express from "express";
import { signinForm, signupForm, signin, signup, signout } from "../controllers/auth.js";

const router = express.Router();

router.get("/signin", signinForm); // Страница аутентификации пользователя
router.post("/signin", signin);    //  Аутентификация пользователя

router.get("/signup", signupForm); // Страница регистрации пользователя
router.post("/signup", signup);    // Регистрация пользователя

router.get("/signout", signout); // Выход

export default router;
