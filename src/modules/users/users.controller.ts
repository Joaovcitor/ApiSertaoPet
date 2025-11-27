import usersService from "./users.service";
import { Request, Response } from "express";
import { asyncHandler, createError } from "../../core/middleware/errorHandler";
import { successResponse } from "../../utils/response";

class UserController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.create(req.body);
    successResponse(res, user, "Usuário criado com sucesso");
  });
  update = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError("Usuário não autenticado");
    }
    const user = await usersService.update(req.user.id, req.body);
    successResponse(res, user, "Usuário atualizado com sucesso");
  });
  get = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError("Usuário não autenticado");
    }
    const user = await usersService.get(req.user.id);
    successResponse(res, user, "Usuário obtido com sucesso");
  });
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const users = await usersService.getAllUser();
    successResponse(res, users, "Usuários obtidos com sucesso");
  });
  getPublic = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const profile = await usersService.getPublicUser(id);
    successResponse(res, profile, "Perfil obtido com sucesso");
  });
  stats = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError("Usuário não autenticado");
    }
    const profile = await usersService.stats(req.user.id);
    successResponse(res, profile, "Perfil obtido com sucesso");
  });
  updatePhoto = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError("Usuário não autenticado");
    }
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      throw createError("Nenhum arquivo foi enviado");
    }
    const imageUrl = `/uploads/${file.filename}`;
    const user = await usersService.updatePhoto(req.user.id, imageUrl);
    successResponse(res, user, "Foto atualizada com sucesso");
  });
  updateEmail = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError("Usuário não autenticado");
    }
    const user = await usersService.updateEmail(req.user.id, req.body.email);
    successResponse(res, user, "Email atualizado com sucesso");
  });
  updatePassword = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw createError("Usuário não autenticado");
    }
    const user = await usersService.updatePassword(
      req.user.id,
      req.body.password
    );
    successResponse(res, user, "Senha atualizada com sucesso");
  });
}

export default new UserController();
