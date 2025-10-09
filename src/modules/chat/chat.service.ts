import prisma from "@/prisma/prisma";
import { getIO } from "@/core/socket";
import { createError } from "@/core/middleware/errorHandler";
import type { CreateConversationDto, MessagesQuery } from "./chat.dto";

class ChatService {
  async createOrGetConversation(
    input: CreateConversationDto,
    currentUserId: string
  ) {
    let tutorId: string | null = null;
    let adopterId: string | null = null;

    if (input.petId) {
      const pet = await prisma.pet.findUnique({
        where: { id: input.petId },
        select: { id: true, userId: true, status: true },
      });
      if (!pet) throw createError("pet não encontrado", 404);
      tutorId = pet.userId;
      adopterId = currentUserId;
    } else if (input.adoptionProcessId) {
      const process = await prisma.adoptionProcess.findUnique({
        where: { id: input.adoptionProcessId },
        select: {
          id: true,
          userId: true,       // adotante
          petId: true,
          pet: { select: { userId: true } }, // tutor
        },
      });
      if (!process) throw createError("processo de adoção não encontrado", 404);
      // Correção: tutor = dono do pet, adotante = user do processo
      tutorId = process.pet?.userId || null;
      adopterId = process.userId;
    } else {
      throw createError("petId ou adoptionProcessId é obrigatório", 400);
    }
    if (!tutorId || !adopterId) {
      throw createError("erro ao determinar tutor ou adotante", 500);
    }
    if (tutorId === adopterId)
      throw createError("tutor e adotante não podem ser o mesmo", 400);

    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: tutorId } } },
          { participants: { some: { userId: adopterId } } },
        ],
      },
      include: {
        participants: { select: { userId: true } },
      },
    });
    if (existing) {
      // Mensagem inicial opcional
      if (input.initialMessage) {
        const msg = await prisma.message.create({
          data: {
            conversationId: existing.id,
            senderId: currentUserId,
            content: input.initialMessage,
          },
        });
        // Atualizar ordem da conversa
        await prisma.conversation.update({ where: { id: existing.id }, data: { updatedAt: new Date() } });
        // Emitir evento de nova mensagem
        try {
          getIO().to(`conversation:${existing.id}`).emit("message:new", msg);
        } catch {}
      }
      return existing;
    }
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId: tutorId }, { userId: adopterId }],
        },
      },
      include: {
        participants: { select: { userId: true } },
      },
    });
    // Notificar ambos participantes sobre a nova conversa
    try {
      getIO().to(`user:${tutorId}`).emit("conversation:new", conversation);
      getIO().to(`user:${adopterId}`).emit("conversation:new", conversation);
    } catch {}

    if (input.initialMessage) {
      const msg = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: currentUserId,
          content: input.initialMessage,
        },
      });
      // Atualizar ordem da conversa
      await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
      // Emitir evento de nova mensagem
      try {
        getIO().to(`conversation:${conversation.id}`).emit("message:new", msg);
      } catch {}
    }
    return conversation;
  }
  async listMyConversations(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [total, conversations] = await Promise.all([
      prisma.conversation.count({
        where: { participants: { some: { userId } } },
      }),
      prisma.conversation.findMany({
        where: { participants: { some: { userId } } },
        include: {
          participants: {
            select: {
              userId: true,
              user: {
                select: { id: true, name: true, email: true, photo: true },
              },
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return { total, conversations };
  }

  async assertParticipant(conversationId: string, userId: string) {
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant) throw createError("Acesso negado à conversa", 403);
  }

  async getMessages(
    conversationId: string,
    userId: string,
    query: MessagesQuery
  ) {
    await this.assertParticipant(conversationId, userId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const order: "asc" | "desc" = query.sortOrder ?? "asc";

    const [total, messages] = await Promise.all([
      prisma.message.count({ where: { conversationId } }),
      prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: order },
        skip,
        take: limit,
      }),
    ]);

    return { total, messages };
  }

  async sendMessage(conversationId: string, userId: string, content: string) {
    await this.assertParticipant(conversationId, userId);

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content,
      },
    });

    // Atualizar ordem da conversa
    await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });

    // Emitir evento de nova mensagem para sala da conversa
    try {
      getIO().to(`conversation:${conversationId}`).emit("message:new", message);
    } catch {}

    return message;
  }
}

export default new ChatService();
