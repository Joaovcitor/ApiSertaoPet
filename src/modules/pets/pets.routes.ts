import { Router } from "express";
import PetController from "./pets.controller";
import { authenticateToken } from "../../core/middleware/auth";
import { uploadImages, handleMulterError } from "../../core/middleware/upload";

const petRoutes = Router();

petRoutes.post(
  "/",
  authenticateToken,
  uploadImages,
  handleMulterError,
  PetController.create
);
petRoutes.get("/", PetController.getAll);
petRoutes.get("/:id", PetController.getById);
petRoutes.delete("/:id", authenticateToken, PetController.delete);

export default petRoutes;
