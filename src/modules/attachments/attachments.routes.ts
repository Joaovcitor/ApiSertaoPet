import { Router } from "express";
import AttachmentsController from "./attachments.controller";
import { authenticateToken } from "@/core/middleware/auth";
import { validateQuery, validateParams } from "@/utils/validation";
import {
  AttachmentsQuerySchema,
  AttachmentIdParamSchema,
} from "./attachments.dto";
import {
  uploadImages,
  handleMulterError,
} from "@/core/middleware/upload";

const attachmentsRouter = Router();

// Upload múltiplo de imagens (campo: "images") com associação
attachmentsRouter.post(
  "/",
  authenticateToken,
  uploadImages,
  handleMulterError,
  AttachmentsController.create.bind(AttachmentsController)
);

// Listar anexos com filtros/paginação
attachmentsRouter.get(
  "/",
  validateQuery(AttachmentsQuerySchema),
  AttachmentsController.getAll.bind(AttachmentsController)
);

// Remover anexo (uploader somente)
attachmentsRouter.delete(
  "/:id",
  authenticateToken,
  validateParams(AttachmentIdParamSchema),
  AttachmentsController.remove.bind(AttachmentsController)
);

export default attachmentsRouter;