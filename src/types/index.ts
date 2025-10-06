import { z } from 'zod';

// Schemas de validação com Zod
export const CreateUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional()
});

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().optional(),
  published: z.boolean().default(false)
});

export const UpdatePostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').optional(),
  content: z.string().optional(),
  published: z.boolean().optional()
});

// Tipos inferidos dos schemas
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos de usuário (sem senha)
export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de post
export interface PostResponse {
  id: string;
  title: string;
  content?: string;
  published: boolean;
  authorId: string;
  author?: UserResponse;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de autenticação
export interface AuthResponse {
  user: UserResponse;
  token: string;
}

// Parâmetros de query para paginação
export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}