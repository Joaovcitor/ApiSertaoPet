import { z } from "zod";

export const CreateConversationSchema = z
  .object({
    petId: z.string().min(1, "petId é obrigatório").optional(),
    adoptionProcessId: z
      .string()
      .min(1, "adoptionProcessId é obrigatório")
      .optional(),
    initialMessage: z
      .string()
      .min(1, "Mensagem deve ter pelo menos 1 caractere")
      .max(2000, "Mensagem muito longa")
      .optional(),
  })
  .refine((data) => Boolean(data.petId) || Boolean(data.adoptionProcessId), {
    message: "Informe petId ou adoptionProcessId",
    path: ["petId"],
  });

// Params: conversa
export const ConversationIdParamSchema = z.object({
  id: z.string().min(1, "ID da conversa é obrigatório"),
});

// Query: paginação de conversas (segue estilo PaginationQuerySchema)
export const ConversationsQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
    search: z.string().optional(),
    sortBy: z.string().optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .refine((data) => data.page >= 1 && data.limit >= 1 && data.limit <= 100, {
    message: "Page deve ser >= 1 e limit deve estar entre 1 e 100",
  });

// Body: enviar mensagem
export const SendMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Mensagem deve ter pelo menos 1 caractere")
    .max(2000, "Mensagem muito longa"),
});

// Params: mensagem
export const MessageIdParamSchema = z.object({
  msgId: z.string().min(1, "ID da mensagem é obrigatório"),
});

// Query: paginação de mensagens de uma conversa
export const MessagesQuerySchema = z
  .object({
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
export type CreateConversationDto = z.infer<typeof CreateConversationSchema>;
export type ConversationIdParam = z.infer<typeof ConversationIdParamSchema>;
export type ConversationsQuery = z.infer<typeof ConversationsQuerySchema>;
export type SendMessageDto = z.infer<typeof SendMessageSchema>;
export type MessageIdParam = z.infer<typeof MessageIdParamSchema>;
export type MessagesQuery = z.infer<typeof MessagesQuerySchema>;
