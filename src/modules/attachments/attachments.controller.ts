import { Request, Response, NextFunction } from "express";
import AttachmentsService from "./attachments.service";
import {
  AttachmentCreateSchema,
  AttachmentsQuery,
  AttachmentIdParamSchema,
} from "./attachments.dto";

class AttachmentsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = AttachmentCreateSchema.parse(req.body);
      const files = (req.files || []) as Express.Multer.File[];
      const uploaderId = req.user?.id || "";
      const created = await AttachmentsService.createMany(
        data,
        files,
        uploaderId
      );
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as AttachmentsQuery;
      const attachments = await AttachmentsService.getAll(query);
      res.status(200).json(attachments);
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = AttachmentIdParamSchema.parse(req.params);
      const requesterId = req.user?.id || "";
      const result = await AttachmentsService.remove(id, requesterId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AttachmentsController();
