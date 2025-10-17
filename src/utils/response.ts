import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

// Resposta de sucesso
export const successResponse = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  
  return res.status(statusCode).json(response);
};

// Resposta de erro
export const errorResponse = (
  res: Response,
  error: string,
  statusCode: number = 400
): Response => {
  const response: ApiResponse = {
    success: false,
    error
  };
  
  return res.status(statusCode).json(response);
};

// Resposta paginada
export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message?: string
): Response => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    message,
    pagination: {
      ...pagination,
      totalPages
    }
  };
  
  return res.status(200).json(response);
};

// Resposta de criação
export const createdResponse = <T>(
  res: Response,
  data: T,
  message?: string
): Response => {
  return successResponse(res, data, message, 201);
};

// Resposta sem conteúdo
export const noContentResponse = (res: Response): Response => {
  return res.status(204).send();
};
