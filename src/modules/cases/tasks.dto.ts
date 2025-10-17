import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().min(2, "Título deve ter ao menos 2 caracteres").max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]).optional().default("TODO"),
  assigneeId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z
  .object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().max(2000).optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]).optional(),
    assigneeId: z.string().optional(),
    dueDate: z.string().datetime().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;

export const TasksQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]).optional(),
    sortBy: z.enum(["createdAt", "updatedAt", "dueDate", "status"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .refine((d) => d.page >= 1 && d.limit >= 1 && d.limit <= 100, {
    message: "Page deve ser >= 1 e limit deve estar entre 1 e 100",
  });

export type TasksQuery = z.infer<typeof TasksQuerySchema>;
