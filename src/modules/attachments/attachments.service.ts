import prisma from "../../prisma/prisma";
import { createError } from "../../core/middleware/errorHandler";
import {
  AttachmentCreateDto,
  AttachmentsQuery,
} from "./attachments.dto";

class AttachmentsService {
  async createMany(
    data: AttachmentCreateDto,
    files: Express.Multer.File[],
    uploaderId: string
  ) {
    if (!files || files.length === 0) {
      throw createError("Nenhum arquivo enviado", 400);
    }

    const created = await Promise.all(
      files.map((file) =>
        prisma.attachment.create({
          data: {
            url: `/uploads/${file.filename}`,
            mimeType: file.mimetype,
            size: file.size,
            uploaderId,
            postId: data.postId,
            commentId: data.commentId,
            messageId: data.messageId,
            eventId: data.eventId,
            caseId: data.caseId,
            taskId: data.taskId,
          },
        })
      )
    );

    return created;
  }

  async getAll(query: AttachmentsQuery) {
    return prisma.attachment.findMany({
      where: {
        ...(query.uploaderId && { uploaderId: query.uploaderId }),
        ...(query.postId && { postId: query.postId }),
        ...(query.commentId && { commentId: query.commentId }),
        ...(query.messageId && { messageId: query.messageId }),
        ...(query.eventId && { eventId: query.eventId }),
        ...(query.caseId && { caseId: query.caseId }),
        ...(query.taskId && { taskId: query.taskId }),
      },
      include: {
        uploader: true,
      },
      orderBy: {
        createdAt: query.sortOrder,
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
  }

  async remove(id: string, requesterId: string) {
    const attachment = await prisma.attachment.findUnique({
      where: { id },
    });
    if (!attachment) {
      throw createError("Anexo não encontrado", 404);
    }

    if (attachment.uploaderId !== requesterId) {
      throw createError("Você não tem permissão para remover este anexo", 403);
    }

    await prisma.attachment.delete({ where: { id } });
    return { success: true };
  }
}

export default new AttachmentsService();
