import { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";
import signature from "cookie-signature"; // dessinar cookie assinado

let io: IOServer | null = null;

type SocketUser = {
  id: string;
  email?: string;
  name?: string;
};

function parseCookie(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((pair) => {
    const [key, ...rest] = pair.trim().split("=");
    cookies[key] = decodeURIComponent(rest.join("="));
  });
  return cookies;
}

const log = (...args: any[]) =>
  console.log("[socket]", new Date().toISOString(), ...args);

async function authenticateSocket(socket: Socket): Promise<SocketUser> {
  const authToken =
    (socket.handshake.auth?.token as string | undefined) || undefined;
  // Bearer no header
  const headerAuth = socket.handshake.headers["authorization"] as string | undefined;
  const headerToken = headerAuth?.startsWith("Bearer ")
    ? headerAuth.split(" ")[1]
    : undefined;

  const cookies = parseCookie(socket.handshake.headers["cookie"] as string | undefined);
  const rawCookieToken = cookies["token"];

  // Dessinar cookie 's:<valor_assinado>' usando COOKIE_SECRET
  let cookieToken: string | undefined;
  if (rawCookieToken?.startsWith("s:")) {
    const unsigned = signature.unsign(
      rawCookieToken.slice(2),
      process.env.COOKIE_SECRET as string
    );
    cookieToken = unsigned || undefined;
  } else {
    cookieToken = rawCookieToken;
  }

  const token = authToken || headerToken || cookieToken;

  log("auth:tokens", {
    hasAuthToken: Boolean(authToken),
    hasHeaderAuth: Boolean(headerToken),
    hasCookieToken: Boolean(rawCookieToken),
    cookieSigned: Boolean(rawCookieToken?.startsWith("s:")),
    cookieUnsignOk: Boolean(cookieToken),
  });

  if (!token) {
    log("auth:error", "Token de acesso requerido");
    throw new Error("Token de acesso requerido");
  }

  log("auth:verifyToken");
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

  log("auth:findUser", { userId: decoded.userId });
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, name: true },
  });
  if (!user) {
    log("auth:error", "Usuário não encontrado");
    throw new Error("Usuário não encontrado");
  }

  log("auth:ok", { userId: user.id });
  return user;
}

async function canJoinConversation(conversationId: string, userId: string) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  return Boolean(participant);
}

export function initSocket(server: HttpServer) {
  const origins =
    process.env.NODE_ENV === "production"
      ? ["https://yourdomain.com"]
      : ["http://localhost:8080", "http://localhost:5173"];

  io = new IOServer(server, {
    cors: {
      origin: origins,
      credentials: true,
    },
  });
  log("initSocket", { origins, credentials: true });

  io.use(async (socket, next) => {
    log("auth:start", {
      socketId: socket.id,
      hasAuthToken: Boolean(socket.handshake.auth?.token),
      hasHeaderAuth: Boolean(socket.handshake.headers["authorization"]),
      hasCookieToken: Boolean(
        (socket.handshake.headers["cookie"] || "").includes("token=")
      ),
    });
    try {
      const user = await authenticateSocket(socket);
      (socket.data as any).user = user;
      log("auth:middleware:ok", { socketId: socket.id, userId: user.id });
      next();
    } catch (err: any) {
      log("auth:middleware:error", {
        socketId: socket.id,
        error: err?.message,
      });
      next(err);
    }
  });

  io.on("connection", (socket) => {
    const user: SocketUser | undefined = (socket.data as any).user;
    if (!user) {
      log("connection:withoutUser", { socketId: socket.id });
      socket.disconnect(true);
      return;
    }

    log("connection", { socketId: socket.id, userId: user.id });

    // Entrar na sala pessoal do usuário
    socket.join(`user:${user.id}`);
    log("room:join", { room: `user:${user.id}` });

    // Handler: entrar numa conversa
    socket.on(
      "conversation:join",
      async (
        payload: { conversationId: string },
        ack?: (ok: boolean, err?: string) => void
      ) => {
        log("conversation:join:try", {
          socketId: socket.id,
          userId: user.id,
          conversationId: payload?.conversationId,
        });
        try {
          const ok = await canJoinConversation(
            payload.conversationId,
            user.id
          );
          if (!ok) {
            log("conversation:join:denied", {
              conversationId: payload.conversationId,
              userId: user.id,
            });
            ack?.(false, "Acesso negado à conversa");
            return;
          }
          socket.join(`conversation:${payload.conversationId}`);
          log("room:join", {
            room: `conversation:${payload.conversationId}`,
          });
          ack?.(true);
        } catch (e: any) {
          log("conversation:join:error", { error: e?.message });
          ack?.(false, e?.message || "Erro ao entrar na conversa");
        }
      }
    );

    // Handler: sair da conversa
    socket.on(
      "conversation:leave",
      (payload: { conversationId: string }, ack?: (ok: boolean) => void) => {
        socket.leave(`conversation:${payload.conversationId}`);
        log("room:leave", { room: `conversation:${payload.conversationId}` });
        ack?.(true);
      }
    );

    // Handler: digitando (eventos efêmeros)
    socket.on(
      "message:typing",
      (payload: { conversationId: string }, ack?: () => void) => {
        log("message:typing", {
          conversationId: payload.conversationId,
          fromUserId: user.id,
        });
        socket
          .to(`conversation:${payload.conversationId}`)
          .emit("message:typing", { userId: user.id });
        ack?.();
      }
    );

    socket.on("disconnect", (reason) => {
      log("disconnect", { socketId: socket.id, reason });
    });
  });

  return io;
}

export function getIO(): IOServer {
  if (!io) {
    throw new Error("Socket.IO não inicializado");
  }
  return io;
}