import { Router } from "express";
import UserController from "./users.controller";
import { authenticateToken } from "@/core/middleware/auth";
const userRoutes = Router();
userRoutes.post("/", UserController.create);
userRoutes.put("/", authenticateToken, UserController.update);
export default userRoutes;
