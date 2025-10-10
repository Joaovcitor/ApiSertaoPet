import { z } from "zod";

/**
 * Conteúdo do Post
 * - Exige pelo menos `text`, aceita campos adicionais via `.passthrough()`
 * - O modelo Prisma usa Json em `Post.content`
 */
export const PostContentSchema = z
  .object({
    text: z.string().min(1, "Texto do post é obrigatório"),
  })
  .passthrough();

// Body: criar post
export const CreatePostSchema = z.object({
  content: PostContentSchema,
  attachmentIds: z.array(z.string().min(1)).max(10).optional(),
});

// Body: atualizar post
export const UpdatePostSchema = z.object({
  content: PostContentSchema.optional(),
  attachmentIds: z.array(z.string().min(1)).max(10).optional(),
});

// Params: post
export const PostIdParamSchema = z.object({
  id: z.string().min(1, "ID do post é obrigatório"),
});

// Query: paginação e filtros
export const PostsQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
    authorId: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .refine((data) => data.page >= 1 && data.limit >= 1 && data.limit <= 100, {
    message: "Page deve ser >= 1 e limit deve estar entre 1 e 100",
  });

// Tipos inferidos
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
export type PostIdParam = z.infer<typeof PostIdParamSchema>;
export type PostsQuery = z.infer<typeof PostsQuerySchema>;