import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../server";
import { createError } from "./errorHandler";

// Estender o tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verificar token nos cookies (tanto signed quanto unsigned) e header Authorization
    const cookieToken = req.cookies?.token || req.signedCookies?.token;
    const authHeader = req.headers.authorization;
    const headerToken = authHeader && authHeader.split(" ")[1];
    const token = cookieToken || headerToken;

    if (!token) {
      throw createError("Token de acesso requerido", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw createError("Usuário não encontrado", 401);
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      next(createError("Token inválido", 401));
    } else if (error.name === "TokenExpiredError") {
      next(createError("Token expirado", 401));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader && authHeader.split(" ")[1];
    const cookieToken = req.cookies?.token;
    const token = headerToken || cookieToken;

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Ignorar erros de token em auth opcional
    next();
  }
};
