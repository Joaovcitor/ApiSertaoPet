import bcrypt from "bcryptjs";
import prisma from "../../prisma/prisma";
import { User } from "@prisma/client";
import type { UserDtoCreate, UserDtoUpdate } from "./users.dto";

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
}
export default new UserService();
