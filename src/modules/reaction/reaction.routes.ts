import { Router } from "express";
import reactionController from "./reaction.controller";
import { authenticateToken } from "@/core/middleware/auth";
import { validateQuery } from "@/utils/validation";
import { ReactionsQuerySchema } from "./reaction.dto";

const reactionRouter = Router();

reactionRouter.post("/", authenticateToken, reactionController.create);
reactionRouter.delete("/", authenticateToken, reactionController.remove);
reactionRouter.get(
  "/",
  authenticateToken,
  validateQuery(ReactionsQuerySchema),
  reactionController.getAll
);
reactionRouter.get(
  "/count/:postId",
  authenticateToken,
  reactionController.countByPostId
);

export default reactionRouter;
