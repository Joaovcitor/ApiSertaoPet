import { z } from "zod";

// Body: criar comentário
export const CreateCommentSchema = z.object({
  postId: z.string().min(1, "postId é obrigatório"),
  content: z
    .string()
    .min(1, "Comentário deve ter pelo menos 1 caractere")
    .max(2000, "Comentário muito longo"),
  attachmentIds: z.array(z.string().min(1)).max(5).optional(),
});

// Body: atualizar comentário
export const UpdateCommentSchema = z.object({
  content: z.string().min(1).max(2000).optional(),
  attachmentIds: z.array(z.string().min(1)).max(5).optional(),
});

// Params: comentário
export const CommentIdParamSchema = z.object({
  id: z.string().min(1, "ID do comentário é obrigatório"),
});

// Query: listar comentários (por post)
export const CommentsQuerySchema = z
  .object({
    postId: z.string().optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 20)),
    sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  })
  .refine((data) => data.page >= 1 && data.limit >= 1 && data.limit <= 100, {
    message: "Page deve ser >= 1 e limit deve estar entre 1 e 100",
  });

// Tipos inferidos
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>;
export type CommentIdParam = z.infer<typeof CommentIdParamSchema>;
export type CommentsQuery = z.infer<typeof CommentsQuerySchema>;
