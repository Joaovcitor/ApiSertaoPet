import { Router } from "express";
import BadgeController from "./badge.controller";
import { authenticateToken } from "../../core/middleware/auth";

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

/**
 * @route GET /badges/me
 * @desc Obtém todos os badges do usuário autenticado
 * @access Private
 */
router.get("/me", BadgeController.getUserBadges);

/**
 * @route GET /badges/progress
 * @desc Obtém o progresso do usuário em direção aos badges
 * @access Private
 */
router.get("/progress", BadgeController.getUserBadgeProgress);

/**
 * @route GET /badges/definitions
 * @desc Obtém todas as definições de badges disponíveis
 * @access Private
 */
router.get("/definitions", BadgeController.getBadgeDefinitions);

/**
 * @route POST /badges/check
 * @desc Verifica e concede badges automaticamente (endpoint para testes)
 * @access Private
 */
router.post("/check", BadgeController.checkAndAwardBadges);

/**
 * @route POST /badges/award
 * @desc Concede badge manualmente (apenas para admins)
 * @access Admin
 * @body { userId: string, badge: string }
 */
router.post("/award", BadgeController.awardBadge);

export default router;
