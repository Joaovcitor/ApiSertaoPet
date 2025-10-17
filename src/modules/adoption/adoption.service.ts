import { createError } from "../../core/middleware/errorHandler";
import prisma from "../../prisma/prisma";
import type {
  adoptionInterest,
  adoptionProcessDtoCreate,
  updateStatusDto,
} from "./adoption.dto";

export const AdoptionService = {
  adoptionInterestCreate: async (
    adoptionInterestDto: adoptionInterest,
    userId: string
  ) => {
    const { petId } = adoptionInterestDto;
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });
    if (!pet) {
      throw createError("Pet não encontrado");
    }
    const adoptionInterest = await prisma.adoptionInterest.create({
      data: {
        petId,
        userId,
      },
    });
    return adoptionInterest;
  },
  adoptionProcess: async (
    adoptionProcessDto: adoptionProcessDtoCreate,
    userId: string
  ) => {
    const { petId, contact, notes } = adoptionProcessDto;
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });
    if (!pet) {
      throw createError("Pet não encontrado");
    }
    const adoptionProcess = await prisma.adoptionProcess.create({
      data: {
        petId,
        userId,
        contact,
        notes,
      },
    });
    return adoptionProcess;
  },
  updateStatus: async (data: updateStatusDto, petId: string) => {
    const { status, completedAt, rejectedAt } = data;
    const adoptionProcess = await prisma.adoptionProcess.update({
      where: { id: petId },
      data: {
        status,
        completedAt,
        rejectedAt,
      },
    });
    return adoptionProcess;
  },
  getAdoptionInterest: async (userId: string) => {
    const adoptionInterest = await prisma.adoptionInterest.findMany({
      where: { userId },
    });
    return adoptionInterest;
  },
  getAdoptionProcess: async (userId: string) => {
    const adoptionProcess = await prisma.adoptionProcess.findMany({
      where: { userId },
    });
    return adoptionProcess;
  },
};
