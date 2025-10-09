import { ReportCreateDto, ReportUpdateDto } from "./reports.dto";
import prisma from "@/prisma/prisma";

export const ReportsService = {
  create: async (dto: ReportCreateDto, userId: string) => {
    return prisma.report.create({
      data: {
        ...dto,
        reporter: userId,
        userId: userId,
      },
    });
  },
  getAll: async () => {
    return prisma.report.findMany();
  },
};
