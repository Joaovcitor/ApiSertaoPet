import { z } from "zod";

// DTO para criação de organização
export const CreateOrganizationSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(120, "Nome deve ter no máximo 120 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
});

export type CreateOrganizationDto = z.infer<typeof CreateOrganizationSchema>;

// DTO para atualização de organização
export const UpdateOrganizationSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome deve ter ao menos 2 caracteres")
      .max(120, "Nome deve ter no máximo 120 caracteres")
      .optional(),
    description: z
      .string()
      .max(500, "Descrição deve ter no máximo 500 caracteres")
      .optional(),
  })
  .refine((data) => Boolean(data.name || data.description), {
    message: "Informe ao menos um campo para atualizar",
    path: ["name"],
  });

export type UpdateOrganizationDto = z.infer<typeof UpdateOrganizationSchema>;

// DTO para adicionar membro à organização
export const AddMemberSchema = z.object({
  userId: z.string({ required_error: "userId é obrigatório" }).min(1, "userId é obrigatório"),
  role: z
    .enum(["MEMBER", "COORDINATOR", "ADMIN"])
    .optional()
    .default("MEMBER"),
});

export type AddMemberDto = z.infer<typeof AddMemberSchema>;