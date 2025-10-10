import prisma from "@/prisma/prisma";
import {
  ReactionCreateDto,
  ReactionRemoveDto,
  ReactionsQuery,
} from "./reaction.dto";

class ReactionService {
  async create(data: ReactionCreateDto, userId: string) {
    return prisma.reaction.upsert({
      where: {
        postId_userId: {
          postId: data.postId,
          userId,
        },
      },
      update: {
        type: data.type,
      },
      create: {
        postId: data.postId,
        userId,
        type: data.type,
      },
    });
  }

  async remove(data: ReactionRemoveDto, userId: string) {
    return prisma.reaction.delete({
      where: {
        postId_userId: {
          postId: data.postId,
          userId,
        },
      },
    });
  }

  async getAll(query: ReactionsQuery) {
    return prisma.reaction.findMany({
      where: {
        ...(query.postId && { postId: query.postId }),
        ...(query.userId && { userId: query.userId }),
      },
      orderBy: {
        createdAt: query.sortOrder,
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        user: true,
        post: true,
      },
    });
  }

  async countByPostId(postId: string) {
    return prisma.reaction.count({
      where: { postId },
    });
  }
}

export default new ReactionService();
