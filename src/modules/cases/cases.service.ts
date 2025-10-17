import prisma from "../../prisma/prisma";
import { createError } from "../../core/middleware/errorHandler";
import type { CasesQuery, CreateCaseDto, UpdateCaseDto } from "./cases.dto";
import { Prisma } from "@prisma/client";

export class CasesService {
  async createForOrg(orgId: string, data: CreateCaseDto, requesterId: string) {
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw createError("Organização não encontrada", 404);

    let isAdmin = requesterId === org.ownerId;
    if (!isAdmin) {
      const membership = await prisma.userOrganization.findFirst({
        where: { userId: requesterId, orgId },
        select: { role: true },
      });
      isAdmin = membership?.role === "ADMIN";
    }
    if (!isAdmin) throw createError("Sem permissão para criar casos nesta organização", 403);

    const created = await prisma.case.create({
      data: {
        title: data.title,
        description: data.description,
        priority: (data.priority as any) ?? "MEDIA",
        assignedOrgId: orgId,
        createdById: requesterId,
        petId: data.petId ?? null,
      },
    });
    return created;
  }

  async listByOrg(orgId: string, query: CasesQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const search = query.search?.trim();
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    const where: Prisma.CaseWhereInput = {
      assignedOrgId: orgId,
      ...(query.status && { status: query.status as any }),
      ...(query.priority && { priority: query.priority as any }),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
              { description: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
            ],
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      prisma.case.count({ where }),
      prisma.case.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { data, page, limit, total };
  }

  async getById(id: string) {
    return prisma.case.findUnique({
      where: { id },
      include: { tasks: true, attachments: true, assignedOrg: true },
    });
  }

  async update(id: string, data: UpdateCaseDto, requesterId: string) {
    const c = await prisma.case.findUnique({ where: { id } });
    if (!c) throw createError("Caso não encontrado", 404);

    // Autorizar: owner/ADMIN da org atribuída ou criador do caso
    let authorized = requesterId === c.createdById;
    if (c.assignedOrgId) {
      const org = await prisma.organization.findUnique({ where: { id: c.assignedOrgId } });
      if (org) {
        if (requesterId === org.ownerId) authorized = true;
        if (!authorized) {
          const membership = await prisma.userOrganization.findFirst({
            where: { userId: requesterId, orgId: c.assignedOrgId },
            select: { role: true },
          });
          if (membership?.role === "ADMIN") authorized = true;
        }
      }
    }
    if (!authorized) throw createError("Sem permissão para atualizar este caso", 403);

    const updated = await prisma.case.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        status: (data.status as any) ?? undefined,
        priority: (data.priority as any) ?? undefined,
        assignedOrgId: data.assignedOrgId ?? undefined,
        petId: data.petId ?? undefined,
      },
    });
    return updated;
  }

  async delete(id: string, requesterId: string) {
    const c = await prisma.case.findUnique({ where: { id } });
    if (!c) throw createError("Caso não encontrado", 404);

    // Autorizar: owner/ADMIN da org atribuída ou criador do caso
    let authorized = requesterId === c.createdById;
    if (c.assignedOrgId) {
      const org = await prisma.organization.findUnique({ where: { id: c.assignedOrgId } });
      if (org) {
        if (requesterId === org.ownerId) authorized = true;
        if (!authorized) {
          const membership = await prisma.userOrganization.findFirst({
            where: { userId: requesterId, orgId: c.assignedOrgId },
            select: { role: true },
          });
          if (membership?.role === "ADMIN") authorized = true;
        }
      }
    }
    if (!authorized) throw createError("Sem permissão para remover este caso", 403);

    const tasks = await prisma.task.findMany({ where: { caseId: id }, select: { id: true } });
    const taskIds = tasks.map((t) => t.id);

    // Remover anexos vinculados às tarefas e ao caso
    if (taskIds.length > 0) {
      await prisma.attachment.deleteMany({ where: { taskId: { in: taskIds } } });
    }
    await prisma.attachment.deleteMany({ where: { caseId: id } });

    // Remover tarefas e o caso
    await prisma.task.deleteMany({ where: { caseId: id } });
    await prisma.case.delete({ where: { id } });
    return { success: true };
  }
}

export default new CasesService();
