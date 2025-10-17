import { Request, Response, NextFunction } from "express";
import PointsService from "./points.service";
import { createError } from "../../core/middleware/errorHandler";
import { ActivityType } from "@prisma/client";

class PointsController {
  /**
   * Obtém pontos e atividades recentes do usuário
   */
  async getUserPoints(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(createError("Usuário não autenticado", 401));
      }

      const userPoints = await PointsService.getUserPoints(userId);

      res.json({
        success: true,
        message: "Pontos do usuário obtidos com sucesso",
        data: userPoints,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém o ranking de usuários por pontos
   */
  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const leaderboard = await PointsService.getLeaderboard(limit);

      res.json({
        success: true,
        message: "Ranking obtido com sucesso",
        data: leaderboard,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém histórico de atividades do usuário
   */
  async getUserActivityHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(createError("Usuário não autenticado", 401));
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const activities = await PointsService.getUserActivityHistory(userId, page, limit);

      res.json({
        success: true,
        message: "Histórico de atividades obtido com sucesso",
        data: activities,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Adiciona pontos manualmente (apenas para admins)
   */
  async addPoints(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, action, points, description, metadata } = req.body;

      // Verificar se o usuário é admin
      if (req.user?.role !== "ADMIN") {
        return next(createError("Acesso negado. Apenas administradores podem adicionar pontos manualmente", 403));
      }

      const activityLog = await PointsService.addPoints({
        userId,
        action: action as ActivityType,
        points,
        description,
        metadata,
      });

      res.status(201).json({
        success: true,
        message: "Pontos adicionados com sucesso",
        data: activityLog,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PointsController();
