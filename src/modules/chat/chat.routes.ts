import { Router } from "express";
import ChatController from "./chat.controller";
import { authenticateToken } from "@/core/middleware/auth";
import { validateSchema, validateParams, validateQuery } from "@/utils/validation";
import {
  CreateConversationSchema,
  ConversationIdParamSchema,
  ConversationsQuerySchema,
  MessagesQuerySchema,
  SendMessageSchema,
} from "./chat.dto";

const chatRoutes = Router();

chatRoutes.post(
  "/conversations",
  authenticateToken,
  validateSchema(CreateConversationSchema),
  ChatController.createConversation
);

chatRoutes.get(
  "/conversations",
  authenticateToken,
  validateQuery(ConversationsQuerySchema),
  ChatController.listMyConversations
);

chatRoutes.get(
  "/conversations/:id/messages",
  authenticateToken,
  validateParams(ConversationIdParamSchema),
  validateQuery(MessagesQuerySchema),
  ChatController.getMessages
);

chatRoutes.post(
  "/conversations/:id/messages",
  authenticateToken,
  validateParams(ConversationIdParamSchema),
  validateSchema(SendMessageSchema),
  ChatController.sendMessage
);

export default chatRoutes;