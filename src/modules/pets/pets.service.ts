import prisma from "../../prisma/prisma";
import { Pet, type PetStatus, type Species } from "@prisma/client";
import { PetDtoCreate, PetDtoUpdate, PetImageDtoCreate } from "./pets.dto";
import { createError } from "@/core/middleware/errorHandler";

class PetService {
  async create(petData: PetDtoCreate, userId: string): Promise<Pet> {
    const result = await prisma.$transaction(async (tsx) => {
      const pet = await tsx.pet.create({
        data: {
          name: petData.name,
          age: petData.age,
          status: petData.status as PetStatus,
          location: petData.location,
          latitude: petData?.latitude,
          longitude: petData?.longitude,
          description: petData.description,
          species: petData.species as Species,
          userId,
          petImages: {
            create: petData.petImage.map((img) => ({
              imageUrl: img.imageUrl,
            })),
          },
        },
        include: {
          petImages: true,
        },
      });
      const updatePointsUser = await tsx.user.update({
        where: { id: userId },
        data: { points: { increment: 100 } },
      });
      return { pet, updatePointsUser };
    });
    return result.pet;
  }

  async getAll(): Promise<Pet[]> {
    return await prisma.pet.findMany({
      include: {
        petImages: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        adoptionProcesses: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getById(id: string): Promise<Pet | null> {
    return await prisma.pet.findUnique({
      where: { id },
      include: {
        petImages: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        adoptionProcesses: true,
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const existingPet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!existingPet) {
      throw createError("Pet não encontrado", 404);
    }

    if (existingPet.userId !== userId) {
      throw createError("Você não tem permissão para remover este pet", 403);
    }

    await prisma.pet.delete({
      where: { id },
    });
  }
}

export default new PetService();
