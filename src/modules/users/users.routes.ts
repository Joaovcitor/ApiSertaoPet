import { Router } from "express";
import UserController from "./users.controller";
import { authenticateToken } from "../../core/middleware/auth";
import {
  handleMulterError,
  uploadSingleImage,
} from "../../core/middleware/upload";

const userRoutes = Router();

userRoutes.put(
  "/photo",
  authenticateToken,
  uploadSingleImage,
  handleMulterError,
  UserController.updatePhoto
);
userRoutes.post("/", UserController.create);
userRoutes.get("/stats", authenticateToken, UserController.stats);
userRoutes.get("/profile", authenticateToken, UserController.get);
userRoutes.get("/:id", UserController.get);
userRoutes.put("/", authenticateToken, UserController.update);
userRoutes.get("/", authenticateToken, UserController.getAll);
userRoutes.get("/public/:id", UserController.getPublic);

export default userRoutes;
