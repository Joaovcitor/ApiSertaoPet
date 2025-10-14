import ReportsController from "./reports.controller";
import { Router } from "express";
import { authenticateToken } from "@/core/middleware/auth";
import { uploadImages, handleMulterError } from "@/core/middleware/upload";

const reportsRoutes = Router();

// Criar nova denúncia (com múltiplas fotos)
reportsRoutes.post("/", 
  authenticateToken, 
  uploadImages, 
  handleMulterError, 
  ReportsController.create
);

// Listar todas as denúncias
reportsRoutes.get("/", ReportsController.getAll);

// Buscar denúncia por ID
reportsRoutes.get("/:id", ReportsController.getById);

// Atualizar denúncia
reportsRoutes.put("/:id", authenticateToken, ReportsController.update);

// Deletar denúncia
reportsRoutes.delete("/:id", authenticateToken, ReportsController.delete);

export default reportsRoutes;
