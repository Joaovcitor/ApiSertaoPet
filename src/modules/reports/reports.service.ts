import { ReportCreateDto, ReportUpdateDto } from "./reports.dto";
import prisma from "../../prisma/prisma";

export const ReportsService = {
  create: async (dto: ReportCreateDto, userId: string) => {
    const { images, ...reportData } = dto;
    const result = await prisma.$transaction(async (tsx) => {
      const report = await tsx.report.create({
        data: {
          type: reportData.type,
          description: reportData.description,
          reporter: reportData.reporter || userId,
          phone: reportData.phone,
          urgency: reportData.urgency,
          location: reportData.location,
          species: reportData.species,
          userId: userId,
          reportImages: images
            ? {
                create: images.map((imageUrl) => ({
                  imageUrl,
                })),
              }
            : undefined,
        },
        include: {
          reportImages: true,
        },
      });
      const badge = tsx.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: 70,
          },
        },
      });
      return {
        report,
        badge,
      };
    });
    return result;
  },

  getAll: async (page = 1, pageSize = 20) => {
    const currentPage = Math.max(1, Number(page));
    const size = Math.max(1, Math.min(100, Number(pageSize)));
    const skip = (currentPage - 1) * size;

    const [items, total] = await Promise.all([
      prisma.report.findMany({
        skip,
        take: size,
        orderBy: { createdAt: "desc" },
        include: {
          reportImages: true,
        },
      }),
      prisma.report.count(),
    ]);

    return {
      items,
      meta: {
        page: currentPage,
        pageSize: size,
        total,
        totalPages: Math.max(1, Math.ceil(total / size)),
      },
    };
  },

  getById: async (id: string) => {
    return prisma.report.findUnique({
      where: { id },
      include: {
        reportImages: true,
      },
    });
  },

  update: async (id: string, dto: ReportUpdateDto) => {
    return prisma.report.update({
      where: { id },
      data: dto,
      include: {
        reportImages: true,
      },
    });
  },

  delete: async (id: string) => {
    return prisma.report.delete({
      where: { id },
    });
  },
};
