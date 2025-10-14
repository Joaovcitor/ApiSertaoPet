import { ReportsService } from "./reports.service";
import { Request, Response, NextFunction } from "express";
import { ReportCreateDto, ReportUpdateDto } from "./reports.dto";

class ReportsController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Dados do formulário vêm do req.body
      const formData = req.body;
      
      // Arquivos vêm do req.files (processados pelo Multer)
      const files = (req.files || []) as Express.Multer.File[];
      
      // Construir o DTO com os dados do formulário
      const dto: ReportCreateDto = {
        type: formData.type,
        description: formData.description,
        reporter: formData.reporter,
        phone: formData.phone,
        urgency: formData.urgency,
        location: formData.location,
        species: formData.species,
        // Converter os arquivos em URLs/paths
        images: files.map(file => `/uploads/${file.filename}`)
      };
      
      const userId = req.user?.id || "";
      const report = await ReportsService.create(dto, userId);
      res.status(201).json(report);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reports = await ReportsService.getAll();
      res.status(200).json(reports);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const report = await ReportsService.getById(id);
      
      if (!report) {
        return res.status(404).json({ message: "Denúncia não encontrada" });
      }
      
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const dto = req.body as ReportUpdateDto;
      const report = await ReportsService.update(id, dto);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await ReportsService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new ReportsController();
