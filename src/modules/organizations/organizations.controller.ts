import { Request, Response, NextFunction } from "express";
import { CreateOrganizationSchema } from "./organizations.dto";
import OrganizationsService from "./organizations.service";
import { paginatedResponse } from "@/utils/response";
import { UpdateOrganizationSchema, AddMemberSchema } from "./organizations.dto";

class OrganizationsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = CreateOrganizationSchema.parse(req.body);
      const ownerId = req.user?.id || "";
      const org = await OrganizationsService.create(body, ownerId);
      res.status(201).json(org);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search, sortBy, sortOrder } =
        req.query as any;
      const result = await OrganizationsService.getAll({
        page: Number(page),
        limit: Number(limit),
        search,
        sortBy,
        sortOrder,
      });
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
      const { id } = req.params as { id: string };
      const org = await OrganizationsService.getById(id);
      if (!org) {
        res.status(404).json({ message: "Organização não encontrada" });
        return;
      }
      res.json(org);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const body = UpdateOrganizationSchema.parse(req.body);
      const requesterId = req.user?.id || "";
      const updated = await OrganizationsService.update(id, body, requesterId);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const { page = 1, limit = 10, search, sortBy, sortOrder } =
        req.query as any;
      const result = await OrganizationsService.getMembers(id, {
        page: Number(page),
        limit: Number(limit),
        search,
        sortBy,
        sortOrder,
      });
      paginatedResponse(res, result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const body = AddMemberSchema.parse(req.body);
      const requesterId = req.user?.id || "";
      const created = await OrganizationsService.addMember(id, requesterId, body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const requesterId = req.user?.id || "";
      await OrganizationsService.delete(id, requesterId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new OrganizationsController();