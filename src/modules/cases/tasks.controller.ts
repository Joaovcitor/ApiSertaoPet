import { Request, Response, NextFunction } from "express";
import TasksService from "./tasks.service";
import { CreateTaskSchema, TasksQuerySchema, UpdateTaskSchema } from "./tasks.dto";
import { paginatedResponse } from "../../utils/response";
import { IdParamSchema } from "../../utils/validation";

class TasksController {
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const task = await TasksService.getById(id);
      if (!task) {
        res.status(404).json({ message: "Tarefa não encontrada" });
        return;
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async createForCase(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const body = CreateTaskSchema.parse(req.body);
      const requesterId = req.user?.id || "";
      const created = await TasksService.createForCase(id, body, requesterId);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  async listByCase(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const query = TasksQuerySchema.parse(req.query);
      const result = await TasksService.listByCase(id, query);
      paginatedResponse(res, result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const body = UpdateTaskSchema.parse(req.body);
      const requesterId = req.user?.id || "";
      const updated = await TasksService.update(id, body, requesterId);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const requesterId = req.user?.id || "";
      await TasksService.delete(id, requesterId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new TasksController();
