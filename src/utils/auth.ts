import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Response } from 'express';
import type { StringValue } from 'ms';

// Gerar token JWT
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
  }
  
  const payload = { userId };
  const options: SignOptions = { 
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as StringValue
  };
  
  return jwt.sign(payload, secret, options);
};

// Verificar token JWT
export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
  }
  
  return jwt.verify(token, secret);
};

// Hash da senha
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Comparar senha
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Configurar cookie com token
export const setTokenCookie = (res: Response, token: string) => {
  const cookieOptions = {
    httpOnly: true, // Previne acesso via JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
    sameSite: 'strict' as const, // Proteção CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em millisegundos
    signed: true // Cookie assinado
  };
  
  res.cookie('token', token, cookieOptions);
};

// Limpar cookie de token
export const clearTokenCookie = (res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    signed: true
  });
};
