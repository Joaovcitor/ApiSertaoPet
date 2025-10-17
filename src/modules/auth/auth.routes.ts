import { Router } from "express";
import { AuthController } from "./authController";
import { authenticateToken } from "../../core/middleware/auth";
const authRoutes = Router();
authRoutes.post("/login", AuthController.login);
authRoutes.post("/logout", AuthController.logout);
authRoutes.get("/me", authenticateToken, AuthController.getProfile);
export default authRoutes;
