import { z } from "zod";

// Body: criar anexos (upload) — requer ao menos um contexto de associação
export const AttachmentCreateSchema = z
  .object({
    postId: z.string().min(1).optional(),
    commentId: z.string().min(1).optional(),
    messageId: z.string().min(1).optional(),
    eventId: z.string().min(1).optional(),
    caseId: z.string().min(1).optional(),
    taskId: z.string().min(1).optional(),
  })
  .refine(
    (data) =>
      Boolean(
        data.postId ||
          data.commentId ||
          data.messageId ||
          data.eventId ||
          data.caseId ||
          data.taskId
      ),
    {
      message:
        "É necessário informar pelo menos um contexto (postId, commentId, messageId, eventId, caseId ou taskId)",
      path: ["postId"],
    }
  );

// Params: attachment
export const AttachmentIdParamSchema = z.object({
  id: z.string().min(1, "ID do anexo é obrigatório"),
});

// Query: listar anexos com filtros e paginação
export const AttachmentsQuerySchema = z
  .object({
    uploaderId: z.string().optional(),
    postId: z.string().optional(),
    commentId: z.string().optional(),
    messageId: z.string().optional(),
    eventId: z.string().optional(),
    caseId: z.string().optional(),
    taskId: z.string().optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 20)),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .refine((data) => data.page >= 1 && data.limit >= 1 && data.limit <= 100, {
    message: "Page deve ser >= 1 e limit deve estar entre 1 e 100",
  });

// Tipos inferidos
export type AttachmentCreateDto = z.infer<typeof AttachmentCreateSchema>;
export type AttachmentIdParam = z.infer<typeof AttachmentIdParamSchema>;
export type AttachmentsQuery = z.infer<typeof AttachmentsQuerySchema>;