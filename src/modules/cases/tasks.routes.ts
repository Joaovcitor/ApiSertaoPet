import { Router } from "express";
import TasksController from "./tasks.controller";
import { authenticateToken } from "@/core/middleware/auth";
import { validateSchema, validateParams, IdParamSchema } from "@/utils/validation";
import { UpdateTaskSchema } from "./tasks.dto";

const tasksRouter = Router();

tasksRouter.get("/:id", validateParams(IdParamSchema), TasksController.getById.bind(TasksController));

tasksRouter.put(
  "/:id",
  authenticateToken,
  validateParams(IdParamSchema),
  validateSchema(UpdateTaskSchema),
  TasksController.updateById.bind(TasksController)
);

tasksRouter.delete(
  "/:id",
  authenticateToken,
  validateParams(IdParamSchema),
  TasksController.deleteById.bind(TasksController)
);

export default tasksRouter;