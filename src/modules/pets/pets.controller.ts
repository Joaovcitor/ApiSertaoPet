import { Request, Response, NextFunction } from "express";
import PetService from "./pets.service";
import { createError } from "@/core/middleware/errorHandler";
import { PetDtoCreate, PetDtoUpdate } from "./pets.dto";

class PetController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(createError("Usuário não autenticado", 401));
      }

      // Processar arquivos de imagem enviados
      const files = req.files as Express.Multer.File[];
      const petImages =
        files?.map((file) => ({
          imageUrl: `/uploads/${file.filename}`,
          petId: "", // Será preenchido após criar o pet
        })) || [];

      const petData: PetDtoCreate = {
        ...req.body,
        petImage: petImages,
      };

      const pet = await PetService.create(petData, userId);

      res.status(201).json({
        success: true,
        message: "Pet criado com sucesso",
        data: pet,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pets = await PetService.getAll();
      res.json({
        success: true,
        data: pets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pet = await PetService.getById(id);

      if (!pet) {
        return next(createError("Pet não encontrado", 404));
      }

      res.json({
        success: true,
        data: pet,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return next(createError("Usuário não autenticado", 401));
      }

      await PetService.delete(id, userId);

      res.json({
        success: true,
        message: "Pet removido com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PetController();
