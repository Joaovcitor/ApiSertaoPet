import { Request, Response } from "express";
import {
  ReactionCreateDto,
  ReactionRemoveDto,
  type ReactionsQuery,
} from "./reaction.dto";
import reactionService from "./reaction.service";

class ReactionController {
  async create(req: Request, res: Response) {
    const userId = req.user?.id;
    const data: ReactionCreateDto = req.body;
    const reaction = await reactionService.create(data, userId!);
    res.status(201).json(reaction);
  }

  async remove(req: Request, res: Response) {
    const userId = req.user?.id;
    const data: ReactionRemoveDto = req.body;
    const reaction = await reactionService.remove(data, userId!);
    res.status(200).json(reaction);
  }

  async getAll(req: Request, res: Response) {
    const query = req.query as unknown as ReactionsQuery;
    const reactions = await reactionService.getAll(query);
    res.status(200).json(reactions);
  }

  async countByPostId(req: Request, res: Response) {
    const postId = req.params.postId;
    const count = await reactionService.countByPostId(postId);
    res.status(200).json(count);
  }
}

export default new ReactionController();
