import { Router } from "express";
import AdoptionController from "./adoption.controller";
import { authenticateToken } from "../../core/middleware/auth";

const adoptionRouter = Router();

adoptionRouter.post(
  "/adoption-process",
  authenticateToken,
  AdoptionController.adoptionProcessCreate
);
adoptionRouter.patch(
  "/update-adoption",
  authenticateToken,
  AdoptionController.updateStatus
);
adoptionRouter.get(
  "/interest",
  authenticateToken,
  AdoptionController.getAdoptionInterest
);
adoptionRouter.get(
  "/process",
  authenticateToken,
  AdoptionController.getAdoptionProcess
);
adoptionRouter.post(
  "/",
  authenticateToken,
  AdoptionController.adoptionInterestCreate
);
export default adoptionRouter;
