import { z } from "zod";
import { ReactionType } from "@prisma/client";

// Body: criar reação (um único tipo por usuário/post devido ao @@unique [postId, userId])
export const ReactionCreateSchema = z.object({
  postId: z.string().min(1, "postId é obrigatório"),
  type: z.nativeEnum(ReactionType),
});

// Body: remover reação (usa par único [postId, userId]; o userId vem do token)
export const ReactionRemoveSchema = z.object({
  postId: z.string().min(1, "postId é obrigatório"),
});

// Params: reação por id (se você expor endpoints por id)
export const ReactionIdParamSchema = z.object({
  id: z.string().min(1, "ID da reação é obrigatório"),
});

// Query: listar reações com paginação e filtros
export const ReactionsQuerySchema = z
  .object({
    postId: z.string().optional(),
    userId: z.string().optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
    sortBy: z.enum(["createdAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .refine((data) => data.page >= 1 && data.limit >= 1 && data.limit <= 100, {
    message: "Page deve ser >= 1 e limit deve estar entre 1 e 100",
  });

// Tipos inferidos
export type ReactionCreateDto = z.infer<typeof ReactionCreateSchema>;
export type ReactionRemoveDto = z.infer<typeof ReactionRemoveSchema>;
export type ReactionIdParam = z.infer<typeof ReactionIdParamSchema>;
export type ReactionsQuery = z.infer<typeof ReactionsQuerySchema>;
