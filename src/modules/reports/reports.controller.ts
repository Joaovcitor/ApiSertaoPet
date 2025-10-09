import { ReportsService } from "./reports.service";
import { Request, Response, NextFunction } from "express";
import { ReportCreateDto, ReportUpdateDto } from "./reports.dto";

class ReportsController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as ReportCreateDto;
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
}

export default new ReportsController();
