import { Router } from "express";
import CasesController from "./cases.controller";
import TasksController from "./tasks.controller";
import { CreateTaskSchema, TasksQuerySchema } from "./tasks.dto";
import { authenticateToken } from "../../core/middleware/auth";
import { validateSchema, validateParams, validateQuery, IdParamSchema } from "../../utils/validation";
import { CreateCaseSchema, CasesQuerySchema, UpdateCaseSchema } from "./cases.dto";

const casesRouter = Router();

// Endpoints em contexto de organização são expostos em organizations.routes

// Endpoints de caso
casesRouter.get("/:id", validateParams(IdParamSchema), CasesController.getById.bind(CasesController));
casesRouter.put(
  "/:id",
  authenticateToken,
  validateParams(IdParamSchema),
  validateSchema(UpdateCaseSchema),
  CasesController.update.bind(CasesController)
);

casesRouter.delete(
  "/:id",
  authenticateToken,
  validateParams(IdParamSchema),
  CasesController.delete.bind(CasesController)
);

export default casesRouter;

// Nested tasks under case
casesRouter.post(
  "/:id/tasks",
  authenticateToken,
  validateParams(IdParamSchema),
  validateSchema(CreateTaskSchema),
  TasksController.createForCase.bind(TasksController)
);
casesRouter.get(
  "/:id/tasks",
  validateParams(IdParamSchema),
  validateQuery(TasksQuerySchema),
  TasksController.listByCase.bind(TasksController)
);
