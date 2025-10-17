import { AdoptionService } from "./adoption.service";
import {
  updateStatusDto,
  adoptionInterest,
  adoptionProcessDtoCreate,
} from "@/modules/adoption/adoption.dto";
import { Request, Response, NextFunction } from "express";
import { createError } from "../../core/middleware/errorHandler";
import PointsService from "../points/points.service";
import BadgeService from "../badge/badge.service";
import { ActivityType } from "@prisma/client";

class AdoptionController {
  async adoptionInterestCreate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const adoptionInterestDto: adoptionInterest = req.body;
      const userId = req.user?.id;
      if (!userId) {
        return next(createError("Usuário não autenticado", 401));
      }
      const adoptionProcess = await AdoptionService.adoptionInterestCreate(
        adoptionInterestDto,
        userId
      );
      res.status(201).json(adoptionProcess);
    } catch (error) {
      next(error);
    }
  }
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updateStatusDto: updateStatusDto = req.body;
      const petId = req.body.id;
      const adoptionProcess = await AdoptionService.updateStatus(
        updateStatusDto,
        petId
      );
      res.status(200).json(adoptionProcess);
    } catch (error) {
      next(error);
    }
  }
  async adoptionProcessCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const adoptionProcessDto: adoptionProcessDtoCreate = req.body;
      const userId = req.user?.id;
      if (!userId) {
        return next(createError("Usuário não autenticado", 401));
      }
      const adoptionProcess = await AdoptionService.adoptionProcess(
        adoptionProcessDto,
        userId
      );

      // Adicionar pontos por completar adoção
      await PointsService.addPoints({
        userId,
        action: ActivityType.ADOPTION,
        points: 100,
        description: "Completou um processo de adoção",
        metadata: { adoptionProcessId: adoptionProcess.id },
      });

      // Verificar e conceder badges
      await BadgeService.checkAndAwardBadges(userId);

      res.status(201).json(adoptionProcess);
    } catch (error) {
      next(error);
    }
  }
  async getAdoptionInterest(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(createError("Usuário não autenticado", 401));
      }
      const adoptionInterest = await AdoptionService.getAdoptionInterest(
        userId
      );
      res.status(200).json(adoptionInterest);
    } catch (error) {
      next(error);
    }
  }
  async getAdoptionProcess(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(createError("Usuário não autenticado", 401));
      }
      const adoptionProcess = await AdoptionService.getAdoptionProcess(userId);
      res.status(200).json(adoptionProcess);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdoptionController();
