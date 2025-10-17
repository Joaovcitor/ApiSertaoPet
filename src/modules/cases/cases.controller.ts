import { Request, Response, NextFunction } from "express";
import CasesService from "./cases.service";
import { CreateCaseSchema, UpdateCaseSchema, CasesQuerySchema } from "./cases.dto";
import { paginatedResponse } from "../../utils/response";
import { IdParamSchema } from "../../utils/validation";

class CasesController {
  async createForOrg(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const body = CreateCaseSchema.parse(req.body);
      const requesterId = req.user?.id || "";
      const created = await CasesService.createForOrg(id, body, requesterId);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  async listByOrg(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const query = CasesQuerySchema.parse(req.query);
      const result = await CasesService.listByOrg(id, query);
      paginatedResponse(res, result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const data = await CasesService.getById(id);
      if (!data) {
        res.status(404).json({ message: "Caso não encontrado" });
        return;
      }
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const body = UpdateCaseSchema.parse(req.body);
      const requesterId = req.user?.id || "";
      const updated = await CasesService.update(id, body, requesterId);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const requesterId = req.user?.id || "";
      await CasesService.delete(id, requesterId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new CasesController();
