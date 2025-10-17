import { PrismaClient, ActivityType } from "@prisma/client";
import { UserBadgeCreateDto, UserBadgeResponseDto, BadgeDefinition, UserBadgesDto } from "./badge.dto";

const prisma = new PrismaClient();

class BadgeService {
  // Definições de badges disponíveis
  private badgeDefinitions: BadgeDefinition[] = [
    {
      name: "Primeiro Passo",
      description: "Cadastrou seu primeiro pet",
      icon: "🐾",
      requirement: { type: "actions", value: 1, action: "PET_REGISTRATION" },
    },
    {
      name: "Protetor Iniciante",
      description: "Acumulou 100 pontos",
      icon: "🌟",
      requirement: { type: "points", value: 100 },
    },
    {
      name: "Herói dos Animais",
      description: "Realizou 5 adoções",
      icon: "🏆",
      requirement: { type: "actions", value: 5, action: "ADOPTION" },
    },
    {
      name: "Protetor Veterano",
      description: "Acumulou 500 pontos",
      icon: "⭐",
      requirement: { type: "points", value: 500 },
    },
    {
      name: "Guardião dos Animais",
      description: "Acumulou 1000 pontos",
      icon: "👑",
      requirement: { type: "points", value: 1000 },
    },
    {
      name: "Denunciante Ativo",
      description: "Fez 10 denúncias",
      icon: "🚨",
      requirement: { type: "actions", value: 10, action: "REPORT" },
    },
    {
      name: "Doador Generoso",
      description: "Fez 5 doações",
      icon: "💝",
      requirement: { type: "actions", value: 5, action: "DONATION" },
    },
    {
      name: "Voluntário Dedicado",
      description: "Participou de 10 atividades de voluntariado",
      icon: "🤝",
      requirement: { type: "actions", value: 10, action: "VOLUNTEER" },
    },
    {
      name: "Salvador de Vidas",
      description: "Realizou 3 resgates",
      icon: "🚑",
      requirement: { type: "actions", value: 3, action: "RESCUE" },
    },
    {
      name: "Lenda da Proteção",
      description: "Acumulou 2000 pontos",
      icon: "🏅",
      requirement: { type: "points", value: 2000 },
    },
  ];

  /**
   * Cria um novo badge para um usuário
   */
  async createBadge(data: UserBadgeCreateDto): Promise<UserBadgeResponseDto> {
    // Verificar se o usuário já possui este badge
    const existingBadge = await prisma.userBadge.findFirst({
      where: {
        userId: data.userId,
        badge: data.badge,
      },
    });

    if (existingBadge) {
      throw new Error("Usuário já possui este badge");
    }

    const badge = await prisma.userBadge.create({
      data: {
        userId: data.userId,
        badge: data.badge,
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

    return badge;
  }

  /**
   * Obtém todos os badges de um usuário
   */
  async getUserBadges(userId: string): Promise<UserBadgesDto> {
    const badges = await prisma.userBadge.findMany({
      where: { userId },
      orderBy: { earnedAt: "desc" },
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
      userId,
      badges,
      availableBadges: this.badgeDefinitions,
    };
  }

  /**
   * Verifica e concede badges automaticamente baseado nas ações do usuário
   */
  async checkAndAwardBadges(userId: string): Promise<UserBadgeResponseDto[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userBadges: true,
        activityLogs: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const earnedBadges: string[] = user.userBadges.map((badge) => badge.badge);
    const newBadges: UserBadgeResponseDto[] = [];

    for (const badgeDefinition of this.badgeDefinitions) {
      // Pular se o usuário já possui este badge
      if (earnedBadges.includes(badgeDefinition.name)) {
        continue;
      }

      let shouldAward = false;

      if (badgeDefinition.requirement.type === "points") {
        shouldAward = user.points >= badgeDefinition.requirement.value;
      } else if (badgeDefinition.requirement.type === "actions") {
        const actionCount = user.activityLogs.filter(
          (log) => log.action === badgeDefinition.requirement.action
        ).length;
        shouldAward = actionCount >= badgeDefinition.requirement.value;
      }

      if (shouldAward) {
        try {
          const newBadge = await this.createBadge({
            userId,
            badge: badgeDefinition.name,
          });
          newBadges.push(newBadge);
        } catch (error) {
          // Badge já existe, continuar
          continue;
        }
      }
    }

    return newBadges;
  }

  /**
   * Obtém definições de todos os badges disponíveis
   */
  getBadgeDefinitions(): BadgeDefinition[] {
    return this.badgeDefinitions;
  }

  /**
   * Obtém o progresso do usuário em direção aos badges
   */
  async getUserBadgeProgress(userId: string): Promise<any[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userBadges: true,
        activityLogs: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const earnedBadges = user.userBadges.map((badge) => badge.badge);

    return this.badgeDefinitions.map((badgeDefinition) => {
      const isEarned = earnedBadges.includes(badgeDefinition.name);
      let progress = 0;
      let current = 0;

      if (!isEarned) {
        if (badgeDefinition.requirement.type === "points") {
          current = user.points;
          progress = Math.min((current / badgeDefinition.requirement.value) * 100, 100);
        } else if (badgeDefinition.requirement.type === "actions") {
          current = user.activityLogs.filter(
            (log) => log.action === badgeDefinition.requirement.action
          ).length;
          progress = Math.min((current / badgeDefinition.requirement.value) * 100, 100);
        }
      } else {
        progress = 100;
        current = badgeDefinition.requirement.value;
      }

      return {
        ...badgeDefinition,
        isEarned,
        progress: Math.round(progress),
        current,
        target: badgeDefinition.requirement.value,
      };
    });
  }
}

export default new BadgeService();