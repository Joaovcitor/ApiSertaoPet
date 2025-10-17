import prisma from "../../prisma/prisma";
import {
  CommentsQuery,
  CommentIdParam,
  CreateCommentDto,
} from "./comments.dto";

class CommentService {
  async create(data: CreateCommentDto, authorId: string) {
    return prisma.comment.create({
      data: {
        ...data,
        authorId,
      },
    });
  }
  async getAllByPostId(postId: string, query: CommentsQuery) {
    return prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
        attachments: true,
      },
      orderBy: {
        createdAt: query.sortOrder,
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
  }
}
export default new CommentService();
