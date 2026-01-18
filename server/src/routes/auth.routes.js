import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { body } from "express-validator";

const router = express.Router();

router.post("/login",
    [
        body("email").isEmail(),
        body("password").notEmpty()
    ],
    login);


router.post("/register",
    [
        body("name").notEmpty(),
        body("email").isEmail(),
        body("password").isLength({ min: 8 })
    ],
    register);


export default router;