import { Router } from "express";
import OrganizationsController from "./organizations.controller";
import { authenticateToken } from "../../core/middleware/auth";
import { validateQuery, PaginationQuerySchema, validateParams, IdParamSchema, validateSchema } from "../../utils/validation";
import { UpdateOrganizationSchema, AddMemberSchema } from "./organizations.dto";
import CasesController from "../cases/cases.controller";
import { CreateCaseSchema, CasesQuerySchema } from "../cases/cases.dto";

const organizationsRouter = Router();

// Criar organização (somente usuário autenticado)
organizationsRouter.post(
  "/",
  authenticateToken,
  OrganizationsController.create.bind(OrganizationsController)
);

// Listar organizações com paginação e busca
organizationsRouter.get(
  "/",
  validateQuery(PaginationQuerySchema),
  OrganizationsController.getAll.bind(OrganizationsController)
);

// Obter organização por ID (público)
organizationsRouter.get(
  "/:id",
  validateParams(IdParamSchema),
  OrganizationsController.getById.bind(OrganizationsController)
);

// Listar membros da organização com paginação e busca (público)
organizationsRouter.get(
  "/:id/members",
  validateParams(IdParamSchema),
  validateQuery(PaginationQuerySchema),
  OrganizationsController.getMembers.bind(OrganizationsController)
);

// Adicionar membro à organização (owner ou ADMIN)
organizationsRouter.post(
  "/:id/members",
  authenticateToken,
  validateParams(IdParamSchema),
  validateSchema(AddMemberSchema),
  OrganizationsController.addMember.bind(OrganizationsController)
);

// Atualizar organização por ID (owner ou ADMIN)
organizationsRouter.put(
  "/:id",
  authenticateToken,
  validateParams(IdParamSchema),
  validateSchema(UpdateOrganizationSchema),
  OrganizationsController.update.bind(OrganizationsController)
);

// Deletar organização (somente owner)
organizationsRouter.delete(
  "/:id",
  authenticateToken,
  validateParams(IdParamSchema),
  OrganizationsController.delete.bind(OrganizationsController)
);

// Casos da organização
organizationsRouter.post(
  "/:id/cases",
  authenticateToken,
  validateParams(IdParamSchema),
  validateSchema(CreateCaseSchema),
  CasesController.createForOrg.bind(CasesController)
);
organizationsRouter.get(
  "/:id/cases",
  validateParams(IdParamSchema),
  validateQuery(CasesQuerySchema),
  CasesController.listByOrg.bind(CasesController)
);

export default organizationsRouter;