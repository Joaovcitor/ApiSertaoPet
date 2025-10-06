import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { createError } from "../core/middleware/errorHandler";

// Middleware de validação genérico
export const validateSchema = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        next(
          createError(
            `Dados inválidos: ${errorMessages
              .map((e) => e.message)
              .join(", ")}`,
            400
          )
        );
      } else {
        next(error);
      }
    }
  };
};

// Validação de parâmetros da URL
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(createError("Parâmetros inválidos", 400));
      } else {
        next(error);
      }
    }
  };
};

// Validação de query parameters
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(createError("Query parameters inválidos", 400));
      } else {
        next(error);
      }
    }
  };
};

// Schema para validação de ID
export const IdParamSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

// Schema para paginação
export const PaginationQuerySchema = z
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
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .refine(
    (data) => {
      return data.page >= 1 && data.limit >= 1 && data.limit <= 100;
    },
    {
      message: "Page deve ser >= 1 e limit deve estar entre 1 e 100",
    }
  );
