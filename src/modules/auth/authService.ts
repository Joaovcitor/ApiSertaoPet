import { prisma } from "../../server";
import { CreateUserInput, LoginInput } from "../../types";
import { hashPassword, comparePassword, generateToken } from "../../utils/auth";
import { createError } from "../../core/middleware/errorHandler";

export class AuthService {
  static async login(loginData: LoginInput) {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      throw createError("Credenciais inválidas", 401);
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(
      loginData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw createError("Credenciais inválidas", 401);
    }

    // Gerar token
    const token = generateToken(user.id);

    // Retornar dados sem senha
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // Obter perfil do usuário
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw createError("Usuário não encontrado", 404);
    }

    return user;
  }

  // Atualizar perfil
  static async updateProfile(
    userId: string,
    updateData: { name?: string; email?: string }
  ) {
    // Se email está sendo alterado, verificar se não existe
    if (updateData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: updateData.email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw createError("Email já está em uso", 409);
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}
