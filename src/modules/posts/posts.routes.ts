import PostsController from "./posts.controller";
import { Router } from "express";
import { authenticateToken } from "@/core/middleware/auth";
const postsRouter = Router();

postsRouter.post("/", authenticateToken, PostsController.create);
postsRouter.get("/", PostsController.getAll);
postsRouter.get("/:id", PostsController.getById);

export default postsRouter;
