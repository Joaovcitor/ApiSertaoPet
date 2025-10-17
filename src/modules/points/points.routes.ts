import { Router } from "express";
import PointsController from "./points.controller";
import { authenticateToken } from "../../core/middleware/auth";

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

/**
 * @route GET /points/me
 * @desc Obtém pontos e atividades recentes do usuário autenticado
 * @access Private
 */
router.get("/me", PointsController.getUserPoints);

/**
 * @route GET /points/leaderboard
 * @desc Obtém o ranking de usuários por pontos
 * @access Private
 * @query limit - Número de usuários no ranking (padrão: 10)
 */
router.get("/leaderboard", PointsController.getLeaderboard);

/**
 * @route GET /points/history
 * @desc Obtém histórico de atividades do usuário autenticado
 * @access Private
 * @query page - Página (padrão: 1)
 * @query limit - Itens por página (padrão: 20)
 */
router.get("/history", PointsController.getUserActivityHistory);

/**
 * @route POST /points/add
 * @desc Adiciona pontos manualmente (apenas para admins)
 * @access Admin
 * @body { userId: string, action: ActivityType, points: number, description?: string, metadata?: object }
 */
router.post("/add", PointsController.addPoints);

export default router;
