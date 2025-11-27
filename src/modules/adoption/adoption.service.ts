import { AdoptionStatus } from "@prisma/client";
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
    const { status, completedAt, rejectedAt, id } = data;
    const result = await prisma.$transaction(async (tsx) => {
      const adoptionProcess = await tsx.adoptionProcess.update({
        where: { id: id },
        data: {
          status,
          completedAt,
          rejectedAt,
        },
      });
      const statusEnum = AdoptionStatus[status];
      if (statusEnum === AdoptionStatus.COMPLETED) {
        await tsx.pet.update({
          where: { id: petId },
          data: {
            isAvailable: false,
          },
        });
        await tsx.user.update({
          where: { id: adoptionProcess.userId },
          data: {
            points: {
              increment: 100,
            },
          },
        });
      }
    });
    return result;
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
