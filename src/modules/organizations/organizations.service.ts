import prisma from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { createError } from "@/core/middleware/errorHandler";
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  AddMemberDto,
} from "./organizations.dto";

class OrganizationsService {
  async create(data: CreateOrganizationDto, ownerId: string) {
    if (!ownerId) {
      throw createError("Usuário não autenticado", 401);
    }

    // Prevenir duplicidade por nome (case-insensitive básico)
    const existing = await prisma.organization.findFirst({
      where: { name: data.name },
      select: { id: true },
    });

    if (existing) {
      throw createError("Já existe uma organização com este nome", 409);
    }

    // Criar organização e vincular o owner como ADMIN em UserOrganization
    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: "ADMIN",
          },
        },
      },
    });

    return organization;
  }

  async getAll(query: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const search = query.search?.trim();
    const sortOrder = query.sortOrder || "desc";
    const allowedSort = ["createdAt", "updatedAt", "name", "verified"] as const;
    const sortBy = allowedSort.includes(query.sortBy as any)
      ? (query.sortBy as (typeof allowedSort)[number])
      : "createdAt";

    const where: Prisma.OrganizationWhereInput = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      prisma.organization.count({ where }),
      prisma.organization.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { data, page, limit, total };
  }

  async getById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                posts: true,
                pets: true,
                name: true,
                photo: true,
              },
            },
          },
        },
        cases: true,
        events: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateOrganizationDto, requesterId: string) {
    const org = await prisma.organization.findUnique({ where: { id } });
    if (!org) {
      throw createError("Organização não encontrada", 404);
    }

    // Autorizar: owner ou ADMIN na organização
    let isAdmin = false;
    if (requesterId === org.ownerId) {
      isAdmin = true;
    } else {
      const membership = await prisma.userOrganization.findFirst({
        where: { userId: requesterId, orgId: id },
        select: { role: true },
      });
      isAdmin = membership?.role === "ADMIN";
    }

    if (!isAdmin) {
      throw createError(
        "Você não tem permissão para atualizar esta organização",
        403
      );
    }

    // Evitar duplicidade de nomes se nome for alterado
    if (data.name) {
      const duplicate = await prisma.organization.findFirst({
        where: {
          name: data.name,
          NOT: { id },
        },
        select: { id: true },
      });
      if (duplicate) {
        throw createError("Já existe uma organização com este nome", 409);
      }
    }

    const updated = await prisma.organization.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        description: data.description ?? undefined,
      },
    });

    return updated;
  }

  async getMembers(
    orgId: string,
    query: {
      page: number;
      limit: number;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const search = query.search?.trim();
    const sortOrder = query.sortOrder || "desc";
    const allowedSort = ["joinedAt", "role", "userName"] as const;
    const sortBy = allowedSort.includes(query.sortBy as any)
      ? (query.sortBy as (typeof allowedSort)[number])
      : "joinedAt";

    const where: Prisma.UserOrganizationWhereInput = {
      orgId,
      ...(search
        ? {
            user: {
              is: {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: "insensitive" as Prisma.QueryMode,
                    },
                  },
                  {
                    email: {
                      contains: search,
                      mode: "insensitive" as Prisma.QueryMode,
                    },
                  },
                ],
              },
            },
          }
        : {}),
    };

    const orderBy =
      sortBy === "userName"
        ? { user: { name: sortOrder } }
        : { [sortBy]: sortOrder };

    const [total, data] = await Promise.all([
      prisma.userOrganization.count({ where }),
      prisma.userOrganization.findMany({
        where,
        include: { user: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { data, page, limit, total };
  }

  async addMember(orgId: string, requesterId: string, data: AddMemberDto) {
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) {
      throw createError("Organização não encontrada", 404);
    }

    // Autorizar: owner ou ADMIN na organização
    let isAdmin = false;
    if (requesterId === org.ownerId) {
      isAdmin = true;
    } else {
      const membership = await prisma.userOrganization.findFirst({
        where: { userId: requesterId, orgId },
        select: { role: true },
      });
      isAdmin = membership?.role === "ADMIN";
    }

    if (!isAdmin) {
      throw createError("Você não tem permissão para adicionar membros", 403);
    }

    // Validar se usuário existe
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw createError("Usuário não encontrado", 404);
    }

    // Verificar se já é membro
    const existing = await prisma.userOrganization.findUnique({
      where: { userId_orgId: { userId: data.userId, orgId } },
    });
    if (existing) {
      throw createError("Usuário já é membro da organização", 409);
    }

    const created = await prisma.userOrganization.create({
      data: {
        userId: data.userId,
        orgId,
        role: data.role ?? ("MEMBER" as any),
      },
      include: { user: true },
    });

    return created;
  }

  async delete(orgId: string, requesterId: string) {
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) {
      throw createError("Organização não encontrada", 404);
    }

    // Somente o owner pode deletar
    if (requesterId !== org.ownerId) {
      throw createError(
        "Você não tem permissão para deletar esta organização",
        403
      );
    }

    // Limpar relacionamentos que podem bloquear a exclusão
    await prisma.$transaction([
      prisma.userOrganization.deleteMany({ where: { orgId: orgId } }),
      prisma.case.updateMany({
        where: { assignedOrgId: orgId },
        data: { assignedOrgId: null },
      }),
      prisma.event.updateMany({
        where: { organizerOrgId: orgId },
        data: { organizerOrgId: null },
      }),
    ]);

    await prisma.organization.delete({ where: { id: orgId } });

    return { success: true };
  }
}

export default new OrganizationsService();
