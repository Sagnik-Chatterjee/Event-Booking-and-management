import { loginUser,registerUser,refreshAccessToken } from "../controllers/user.controller.js";
import { Router } from "express";
const router=Router();
router.post("/",loginUser)
router.post("/register",registerUser)
router.get("/refreshToken",refreshAccessToken)
export default router