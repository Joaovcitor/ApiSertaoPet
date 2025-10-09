import bcrypt from "bcryptjs";
import prisma from "../../prisma/prisma";
import { User } from "@prisma/client";
import type { UserDtoCreate, UserDtoUpdate } from "./users.dto";
import { createError } from "@/core/middleware/errorHandler";

class UserService {
  async create(userData: UserDtoCreate): Promise<User> {
    const user = await prisma.user.findFirst({
      where: { email: userData.email },
    });
    if (user) {
      throw new Error("Email já cadastrado");
    }
    return await prisma.user.create({
      data: { ...userData, password: await bcrypt.hash(userData.password, 10) },
    });
  }
  async update(id: string, userData: UserDtoUpdate): Promise<User> {
    const user = await prisma.user.findFirst({
      where: { id },
    });
    if (userData.email) {
      const userEmail = await prisma.user.findFirst({
        where: { email: userData.email },
      });
      if (userEmail) {
        throw new Error("Email já cadastrado");
      }
    }
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return await prisma.user.update({
      where: { id },
      data: userData,
    });
  }
  async get(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        pets: {
          include: {
            petImages: true,
            adoptionProcesses: true,
          },
        },
        reports: true,
        adoptionProcesses: true,
      },
    });
    if (!user) {
      throw createError("Usuário não encontrado");
    }
    return user;
  }
  async stats(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        pets: {
          include: {
            petImages: true,
            adoptionProcesses: true,
          },
        },
        reports: true,
        adoptionProcesses: true,
        userBadges: true,
        donations: true,
      },
    });
    if (!user) {
      throw createError("Usuário não encontrado");
    }
    return user;
  }
  async updatePhoto(id: string, photo: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw createError("Usuário não encontrado");
    }
    return await prisma.user.update({
      where: { id },
      data: { photo },
    });
  }
  async updateEmail(id: string, email: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw createError("Usuário não encontrado");
    }
    if (user.email === email) {
      throw createError("Email já cadastrado");
    }
    return await prisma.user.update({
      where: { id },
      data: { email },
    });
  }
  async updatePassword(id: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw createError("Usuário não encontrado");
    }
    return await prisma.user.update({
      where: { id },
      data: { password: await bcrypt.hash(password, 10) },
    });
  }
}
export default new UserService();
