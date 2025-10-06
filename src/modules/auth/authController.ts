import { Request, Response, NextFunction } from "express";
import { AuthService } from "./authService";
import { successResponse, createdResponse } from "../../utils/response";
import { setTokenCookie, clearTokenCookie } from "../../utils/auth";
import { asyncHandler } from "../../core/middleware/errorHandler";

export class AuthController {
  // Login
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await AuthService.login(req.body);

    // Configurar cookie
    setTokenCookie(res, token);

    successResponse(res, { user, token }, "Login realizado com sucesso");
  });

  // Logout
  static logout = asyncHandler(async (req: Request, res: Response) => {
    // Limpar cookie
    clearTokenCookie(res);

    successResponse(res, null, "Logout realizado com sucesso");
  });

  // Obter perfil do usuário autenticado
  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.getProfile(req.user!.id);

    successResponse(res, user, "Perfil obtido com sucesso");
  });

  // Atualizar perfil
  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.updateProfile(req.user!.id, req.body);

    successResponse(res, user, "Perfil atualizado com sucesso");
  });

  // Verificar se usuário está autenticado
  static checkAuth = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.getProfile(req.user!.id);

    successResponse(res, { user, authenticated: true }, "Usuário autenticado");
  });
}
