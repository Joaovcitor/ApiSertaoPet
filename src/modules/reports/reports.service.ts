import { ReportCreateDto, ReportUpdateDto } from "./reports.dto";
import prisma from "../../prisma/prisma";

export const ReportsService = {
  create: async (dto: ReportCreateDto, userId: string) => {
    const { images, ...reportData } = dto;
    
    return prisma.report.create({
      data: {
        type: reportData.type,
        description: reportData.description,
        reporter: reportData.reporter || userId,
        phone: reportData.phone,
        urgency: reportData.urgency,
        location: reportData.location,
        species: reportData.species,
        userId: userId,
        reportImages: images ? {
          create: images.map(imageUrl => ({
            imageUrl
          }))
        } : undefined
      },
      include: {
        reportImages: true
      }
    });
  },
  
  getAll: async () => {
    return prisma.report.findMany({
      include: {
        reportImages: true
      }
    });
  },
  
  getById: async (id: string) => {
    return prisma.report.findUnique({
      where: { id },
      include: {
        reportImages: true
      }
    });
  },
  
  update: async (id: string, dto: ReportUpdateDto) => {
    return prisma.report.update({
      where: { id },
      data: dto,
      include: {
        reportImages: true
      }
    });
  },
  
  delete: async (id: string) => {
    return prisma.report.delete({
      where: { id }
    });
  }
};
