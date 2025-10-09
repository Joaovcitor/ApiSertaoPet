import ReportsController from "./reports.controller";
import { Router } from "express";
import { authenticateToken } from "@/core/middleware/auth";

const reportsRoutes = Router();

reportsRoutes.post("/", authenticateToken, ReportsController.create);
reportsRoutes.get("/", ReportsController.getAll);

export default reportsRoutes;
