import { Router } from "express";
import { AuthController } from "./authController";
const authRoutes = Router();
authRoutes.post("/login", AuthController.login);
export default authRoutes;
