import { Request, Response, NextFunction } from "express";
import CommentService from "./comments.service";
import { CreateCommentDto, CommentsQuery } from "./comments.dto";

class CommentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const { content, attachmentIds } = req.body as CreateCommentDto;
      const authorId = req.user?.id;
      const comment = await CommentService.create(
        {
          content,
          attachmentIds,
          postId,
        },
        authorId || ""
      );
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }
  async getAllByPostId(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const query = req.query as unknown as CommentsQuery;
      const comments = await CommentService.getAllByPostId(postId, query);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  }
}
export default new CommentController();
