import { PrismaClient, ActivityType } from "@prisma/client";
import { ActivityLogCreateDto, ActivityLogResponseDto, UserPointsDto, LeaderboardDto } from "./points.dto";

const prisma = new PrismaClient();

class PointsService {
  /**
   * Adiciona pontos para um usuário baseado em uma ação
   */
  async addPoints(data: ActivityLogCreateDto): Promise<ActivityLogResponseDto> {
    // Criar log de atividade
    const activityLog = await prisma.activityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        points: data.points,
        description: data.description,
        metadata: data.metadata,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Atualizar pontos totais do usuário
    await prisma.user.update({
      where: { id: data.userId },
      data: {
        points: {
          increment: data.points,
        },
      },
    });

    return activityLog;
  }

  /**
   * Obtém pontos totais e atividades recentes de um usuário
   */
  async getUserPoints(userId: string): Promise<UserPointsDto> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        points: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const recentActivities = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      userId: user.id,
      totalPoints: user.points,
      recentActivities,
    };
  }

  /**
   * Obtém o ranking de usuários por pontos
   */
  async getLeaderboard(limit: number = 10): Promise<LeaderboardDto[]> {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        points: {
          gt: 0,
        },
      },
      orderBy: { points: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        points: true,
      },
    });

    return users.map((user, index) => ({
      userId: user.id,
      userName: user.name,
      totalPoints: user.points,
      rank: index + 1,
    }));
  }

  /**
   * Obtém histórico de atividades de um usuário
   */
  async getUserActivityHistory(userId: string, page: number = 1, limit: number = 20): Promise<ActivityLogResponseDto[]> {
    const skip = (page - 1) * limit;

    const activities = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return activities;
  }

  /**
   * Método auxiliar para adicionar pontos automaticamente baseado em ações
   */
  async addPointsForAction(userId: string, action: ActivityType, metadata?: any): Promise<ActivityLogResponseDto> {
    const pointsMap: Record<ActivityType, { points: number; description: string }> = {
      PET_REGISTRATION: { points: 100, description: "Cadastro de pet" },
      ADOPTION: { points: 150, description: "Adoção realizada" },
      DONATION: { points: 50, description: "Doação realizada" },
      REPORT: { points: 25, description: "Denúncia registrada" },
      VOLUNTEER: { points: 75, description: "Atividade de voluntariado" },
      RESCUE: { points: 100, description: "Resgate realizado" },
    };

    const actionData = pointsMap[action];
    if (!actionData) {
      throw new Error(`Ação ${action} não reconhecida`);
    }

    return this.addPoints({
      userId,
      action,
      points: actionData.points,
      description: actionData.description,
      metadata,
    });
  }
}

export default new PointsService();