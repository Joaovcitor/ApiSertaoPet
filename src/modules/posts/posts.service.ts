import prisma from "../../prisma/prisma";
import { CreatePostDto, type PostsQuery } from "./posts.dto";

class PostsService {
  async create(data: CreatePostDto, authorId: string) {
    return prisma.post.create({
      data: {
        authorId,
        content: data.content as any,
        ...(data.attachmentIds && { attachmentIds: data.attachmentIds }),
      },
    });
  }
  async getAll(query: PostsQuery) {
    return prisma.post.findMany({
      where: {
        ...(query.authorId && { authorId: query.authorId }),
        ...(query.search && {
          content: {
            path: ["text"],
            string_contains: query.search,
          },
        }),
      },
      orderBy: {
        [query.sortBy]: query.sortOrder,
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        attachments: true,
        author: true,
        comments: true,
        reactions: true,
      },
    });
  }
  async getById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        attachments: true,
        author: true,
        comments: true,
        reactions: true,
      },
    });
  }
}

export default new PostsService();
