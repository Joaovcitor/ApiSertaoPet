import usersService from "./users.service";
import { Request, Response } from "express";
import { asyncHandler } from "../../core/middleware/errorHandler";
import { successResponse } from "../../utils/response";

class UserController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.create(req.body);
    successResponse(res, user, "Usuário criado com sucesso");
  });
  update = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Usuário não autenticado");
    }
    const user = await usersService.update(req.user.id, req.body);
    successResponse(res, user, "Usuário atualizado com sucesso");
  });
}

export default new UserController();
