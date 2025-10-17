import prisma from "../../prisma/prisma";
import { createError } from "../../core/middleware/errorHandler";
import type { CreateTaskDto, TasksQuery, UpdateTaskDto } from "./tasks.dto";
import { Prisma } from "@prisma/client";

export class TasksService {
  async createForCase(caseId: string, data: CreateTaskDto, requesterId: string) {
    const c = await prisma.case.findUnique({ where: { id: caseId } });
    if (!c) throw createError("Caso não encontrado", 404);

    // Autorizar: owner/ADMIN da organização atribuída
    if (!c.assignedOrgId) throw createError("Caso não está vinculado a uma organização", 400);
    const org = await prisma.organization.findUnique({ where: { id: c.assignedOrgId } });
    if (!org) throw createError("Organização não encontrada", 404);

    let isAdmin = requesterId === org.ownerId;
    if (!isAdmin) {
      const membership = await prisma.userOrganization.findFirst({
        where: { userId: requesterId, orgId: c.assignedOrgId },
        select: { role: true },
      });
      isAdmin = membership?.role === "ADMIN";
    }
    if (!isAdmin) throw createError("Sem permissão para criar tarefas neste caso", 403);

    const created = await prisma.task.create({
      data: {
        caseId,
        title: data.title,
        description: data.description,
        status: (data.status as any) ?? "TODO",
        assigneeId: data.assigneeId ?? null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });
    return created;
  }

  async listByCase(caseId: string, query: TasksQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    const where: Prisma.TaskWhereInput = {
      caseId,
      ...(query.status && { status: query.status as any }),
    };

    const [total, data] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { data, page, limit, total };
  }

  async getById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        attachments: true,
        assignee: true,
        case: true,
      },
    });
    return task;
  }

  async update(id: string, data: UpdateTaskDto, requesterId: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw createError("Tarefa não encontrada", 404);

    const c = await prisma.case.findUnique({ where: { id: task.caseId } });
    if (!c) throw createError("Caso não encontrado", 404);
    if (!c.assignedOrgId) throw createError("Caso não está vinculado a uma organização", 400);

    const org = await prisma.organization.findUnique({ where: { id: c.assignedOrgId } });
    if (!org) throw createError("Organização não encontrada", 404);

    let isAdmin = requesterId === org.ownerId;
    if (!isAdmin) {
      const membership = await prisma.userOrganization.findFirst({
        where: { userId: requesterId, orgId: c.assignedOrgId },
        select: { role: true },
      });
      isAdmin = membership?.role === "ADMIN";
    }
    if (!isAdmin) {
      const keys = Object.keys(data).filter((k) => (data as any)[k] !== undefined);
      const isAssignee = task.assigneeId === requesterId;
      const onlyStatus = keys.length === 1 && keys[0] === "status";
      if (!(isAssignee && onlyStatus)) {
        throw createError("Sem permissão para atualizar esta tarefa", 403);
      }
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        status: (data.status as any) ?? undefined,
        assigneeId: data.assigneeId ?? undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });
    return updated;
  }

  async delete(id: string, requesterId: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw createError("Tarefa não encontrada", 404);

    const c = await prisma.case.findUnique({ where: { id: task.caseId } });
    if (!c) throw createError("Caso não encontrado", 404);
    if (!c.assignedOrgId) throw createError("Caso não está vinculado a uma organização", 400);

    const org = await prisma.organization.findUnique({ where: { id: c.assignedOrgId } });
    if (!org) throw createError("Organização não encontrada", 404);

    let isAdmin = requesterId === org.ownerId;
    if (!isAdmin) {
      const membership = await prisma.userOrganization.findFirst({
        where: { userId: requesterId, orgId: c.assignedOrgId },
        select: { role: true },
      });
      isAdmin = membership?.role === "ADMIN";
    }
    if (!isAdmin) throw createError("Sem permissão para remover esta tarefa", 403);

    // Remover anexos vinculados à tarefa
    await prisma.attachment.deleteMany({ where: { taskId: id } });
    await prisma.task.delete({ where: { id } });
    return { success: true };
  }
}

export default new TasksService();
