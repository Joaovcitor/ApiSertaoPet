import { Router } from "express";
import UserController from "./users.controller";
import { authenticateToken } from "@/core/middleware/auth";
import { handleMulterError, uploadSingleImage } from "@/core/middleware/upload";

const userRoutes = Router();
userRoutes.put(
  "/photo",
  authenticateToken,
  uploadSingleImage,
  handleMulterError,
  UserController.updatePhoto
);
userRoutes.put("/email", authenticateToken, UserController.updateEmail);
userRoutes.put("/password", authenticateToken, UserController.updatePassword);
userRoutes.get("/profile", authenticateToken, UserController.get);
userRoutes.get("/stats", authenticateToken, UserController.stats);
userRoutes.post("/", UserController.create);
userRoutes.put("/", authenticateToken, UserController.update);

export default userRoutes;
