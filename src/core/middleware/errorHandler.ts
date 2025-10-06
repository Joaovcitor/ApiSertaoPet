import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Erro interno do servidor';
  let details: any = undefined;

  // Erro customizado da aplicação
  if ('statusCode' in error && error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Erros do Prisma
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Recurso já existe';
        details = { field: error.meta?.target };
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Recurso não encontrado';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Violação de chave estrangeira';
        break;
      default:
        statusCode = 400;
        message = 'Erro de banco de dados';
    }
  }
  // Erro de validação do Prisma
  else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Dados inválidos';
  }
  // Outros erros
  else {
    message = error.message || 'Erro interno do servidor';
  }

  // Log do erro em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 Erro capturado:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
  }

  // Resposta do erro
  const errorResponse: any = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  if (details) {
    errorResponse.details = details;
  }

  // Incluir stack trace apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

// Função para criar erros customizados
export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

// Middleware para capturar erros assíncronos
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};