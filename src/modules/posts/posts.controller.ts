import PostsService from "./posts.service";
import {
  CreatePostSchema,
  UpdatePostSchema,
  PostsQuerySchema,
} from "./posts.dto";
import { Request, Response, NextFunction } from "express";

class PostsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, attachmentIds } = CreatePostSchema.parse(req.body);
      const post = await PostsService.create(
        { content, attachmentIds },
        req.user?.id || ""
      );
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = PostsQuerySchema.parse(req.query);
      const posts = await PostsService.getAll(query);
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await PostsService.getById(id);
      if (!post) {
        res.status(404).json({ message: "Post não encontrado" });
        return;
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  }
}

export default new PostsController();
