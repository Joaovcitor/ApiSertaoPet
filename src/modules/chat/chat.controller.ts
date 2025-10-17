import { Request, Response } from "express";
import ChatService from "./chat.service";
import { asyncHandler, createError } from "../../core/middleware/errorHandler";
import { successResponse, paginatedResponse } from "../../utils/response";
import type { CreateConversationDto, MessagesQuery } from "./chat.dto";

class ChatController {
  createConversation = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw createError("Usuário não autenticado", 401);
    const body = req.body as CreateConversationDto;
    const conversation = await ChatService.createOrGetConversation(
      body,
      req.user.id
    );
    successResponse(res, conversation, "Conversa pronta");
  });

  listMyConversations = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw createError("Usuário não autenticado", 401);
    const page = (req.query.page as unknown as number) ?? 1;
    const limit = (req.query.limit as unknown as number) ?? 10;
    const { total, conversations } = await ChatService.listMyConversations(
      req.user.id,
      page,
      limit
    );
    paginatedResponse(
      res,
      conversations,
      { page, limit, total },
      "Conversas obtidas"
    );
  });

  getMessages = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw createError("Usuário não autenticado", 401);
    const { id } = req.params;
    const query = req.query as unknown as MessagesQuery;
    const { total, messages } = await ChatService.getMessages(
      id,
      req.user.id,
      query
    );
    paginatedResponse(res, messages, {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      total,
    });
  });

  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw createError("Usuário não autenticado", 401);
    const { id } = req.params;
    const { content } = req.body as { content: string };
    const msg = await ChatService.sendMessage(id, req.user.id, content);
    successResponse(res, msg, "Mensagem enviada");
  });
}

export default new ChatController();
