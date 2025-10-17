import { Router } from "express";
import CommentController from "./comments.controller";
import { authenticateToken } from "../../core/middleware/auth";
import { validateQuery } from "../../utils/validation";
import { CommentsQuerySchema } from "./comments.dto";

const commentRouter = Router();

commentRouter.post(
  "/:postId",
  authenticateToken,
  CommentController.create.bind(CommentController)
);
commentRouter.get(
  "/:postId",
  validateQuery(CommentsQuerySchema),
  CommentController.getAllByPostId.bind(CommentController)
);

export default commentRouter;
