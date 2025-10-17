import { Request, Response, NextFunction } from "express";
import BadgeService from "./badge.service";
import { createError } from "../../core/middleware/errorHandler";

class BadgeController {
  /**
   * Obtém todos os badges do usuário
   */
  async getUserBadges(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(createError("Usuário não autenticado", 401));
      }

      const userBadges = await BadgeService.getUserBadges(userId);

      res.json({
        success: true,
        message: "Badges do usuário obtidos com sucesso",
        data: userBadges,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém o progresso do usuário em direção aos badges
   */
  async getUserBadgeProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(createError("Usuário não autenticado", 401));
      }

      const progress = await BadgeService.getUserBadgeProgress(userId);

      res.json({
        success: true,
        message: "Progresso dos badges obtido com sucesso",
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém todas as definições de badges disponíveis
   */
  async getBadgeDefinitions(req: Request, res: Response, next: NextFunction) {
    try {
      const definitions = BadgeService.getBadgeDefinitions();

      res.json({
        success: true,
        message: "Definições de badges obtidas com sucesso",
        data: definitions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verifica e concede badges automaticamente (endpoint para testes)
   */
  async checkAndAwardBadges(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(createError("Usuário não autenticado", 401));
      }

      const newBadges = await BadgeService.checkAndAwardBadges(userId);

      res.json({
        success: true,
        message: `${newBadges.length} novos badges concedidos`,
        data: newBadges,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Concede badge manualmente (apenas para admins)
   */
  async awardBadge(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, badge } = req.body;

      // Verificar se o usuário é admin
      if (req.user?.role !== "ADMIN") {
        return next(createError("Acesso negado. Apenas administradores podem conceder badges manualmente", 403));
      }

      const newBadge = await BadgeService.createBadge({
        userId,
        badge,
      });

      res.status(201).json({
        success: true,
        message: "Badge concedido com sucesso",
        data: newBadge,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BadgeController();
