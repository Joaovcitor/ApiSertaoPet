import { z } from "zod";

export const CreateCaseSchema = z.object({
  title: z.string().min(2, "Título deve ter ao menos 2 caracteres").max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional().default("MEDIA"),
  petId: z.string().optional(),
});

export type CreateCaseDto = z.infer<typeof CreateCaseSchema>;

export const UpdateCaseSchema = z
  .object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().max(2000).optional(),
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
    priority: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
    assignedOrgId: z.string().optional(),
    petId: z.string().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export type UpdateCaseDto = z.infer<typeof UpdateCaseSchema>;

export const CasesQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    search: z.string().optional(),
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
    priority: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
    sortBy: z
      .enum(["createdAt", "updatedAt", "priority", "status", "title"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .refine((d) => d.page >= 1 && d.limit >= 1 && d.limit <= 100, {
    message: "Page deve ser >= 1 e limit deve estar entre 1 e 100",
  });

export type CasesQuery = z.infer<typeof CasesQuerySchema>;
