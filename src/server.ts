import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Server as HttpServer } from "http";
import { initSocket } from "./core/socket";

// Importar rotas
import usersRoutes from "./modules/users/users.routes";
import petRoutes from "./modules/pets/pets.routes";
// Importar middleware
import { errorHandler } from "./core/middleware/errorHandler";
import { requestLogger } from "./core/middleware/requestLogger";
import authRoutes from "./modules/auth/auth.routes";
import adoptionRouter from "./modules/adoption/adoption.routes";
import reportsRoutes from "./modules/reports/reports.routes";
import chatRoutes from "./modules/chat/chat.routes";
import postsRouter from "./modules/posts/posts.routes";
import commentRouter from "./modules/comments/comments.routes";
import reactionRouter from "./modules/reaction/reaction.routes";
import attachmentsRouter from "./modules/attachments/attachments.routes";
import organizationsRouter from "./modules/organizations/organizations.routes";
import casesRouter from "./modules/cases/cases.routes";
import tasksRouter from "./modules/cases/tasks.routes";
import pointsRouter from "./modules/points/points.routes";
import badgeRouter from "./modules/badge/badge.routes";

// Carregar variáveis de ambiente
dotenv.config();

export class Server {
  private app: Application;
  private port: number;
  private server?: HttpServer;
  public prisma: PrismaClient;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;
    this.prisma = new PrismaClient();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.setupGracefulShutdown();
  }

  /**
   * Configurar middlewares de segurança
   */
  private configureSecurityMiddlewares(): void {
    // Middleware de segurança
    this.app.use(
      helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })
    );

    // CORS
    this.app.use(
      cors({
        origin:
          process.env.NODE_ENV === "production"
            ? ["https://yourdomain.com"]
            : [
                "http://localhost:8080",
                "http://localhost:5173",
                "http://192.168.1.35:8080",
              ],
        credentials: true, // Permitir cookies
      })
    );
  }

  /**
   * Configurar middlewares de parsing
   */
  private configureParsingMiddlewares(): void {
    // Middleware para parsing JSON e URL encoded
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Middleware para cookies
    this.app.use(cookieParser(process.env.COOKIE_SECRET));

    // Servir arquivos estáticos da pasta uploads
    this.app.use("/uploads", express.static("uploads"));
  }

  /**
   * Configurar middlewares de logging
   */
  private configureLoggingMiddlewares(): void {
    // Middleware de logging
    this.app.use(requestLogger);
  }

  /**
   * Inicializar todos os middlewares
   */
  private initializeMiddlewares(): void {
    this.configureSecurityMiddlewares();
    this.configureParsingMiddlewares();
    this.configureLoggingMiddlewares();
  }

  /**
   * Configurar rota de health check
   */
  private configureHealthCheck(): void {
    this.app.get("/health", (req: Request, res: Response) => {
      res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      });
    });
  }

  /**
   * Configurar rotas da API
   */
  private configureApiRoutes(): void {
    this.app.use("/user", usersRoutes);
    this.app.use("/auth", authRoutes);
    this.app.use("/pets", petRoutes);
    this.app.use("/adoption", adoptionRouter);
    this.app.use("/reports", reportsRoutes);
    this.app.use("/chat", chatRoutes);
    this.app.use("/posts", postsRouter);
    this.app.use("/comments", commentRouter);
    this.app.use("/reactions", reactionRouter);
    this.app.use("/attachments", attachmentsRouter);
    this.app.use("/organizations", organizationsRouter);
    this.app.use("/cases", casesRouter);
    this.app.use("/tasks", tasksRouter);
    this.app.use("/points", pointsRouter);
    this.app.use("/badges", badgeRouter);
  }

  /**
   * Configurar rota 404
   */
  private configure404Route(): void {
    this.app.use("*", (req: Request, res: Response) => {
      res.status(404).json({
        error: "Rota não encontrada",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      });
    });
  }

  /**
   * Inicializar todas as rotas
   */
  private initializeRoutes(): void {
    this.configureHealthCheck();
    this.configureApiRoutes();
    this.configure404Route();
  }

  /**
   * Inicializar tratamento de erros
   */
  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  /**
   * Conectar ao banco de dados
   */
  private async connectDatabase(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log("✅ Conectado ao banco de dados");
    } catch (error) {
      console.error("❌ Erro ao conectar ao banco de dados:", error);
      throw error;
    }
  }

  /**
   * Desconectar do banco de dados
   */
  private async disconnectDatabase(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      console.log("✅ Desconectado do banco de dados");
    } catch (error) {
      console.error("❌ Erro ao desconectar do banco de dados:", error);
    }
  }

  /**
   * Configurar graceful shutdown
   */
  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Recebido sinal ${signal}. Encerrando servidor...`);

      if (this.server) {
        this.server.close(async () => {
          console.log("🔌 Servidor HTTP fechado");
          await this.disconnectDatabase();
          process.exit(0);
        });
      } else {
        await this.disconnectDatabase();
        process.exit(0);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  }

  /**
   * Iniciar o servidor
   */
  public async start(): Promise<void> {
    try {
      // Conectar ao banco de dados
      await this.connectDatabase();

      // Iniciar servidor HTTP
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Servidor rodando na porta ${this.port}`);
        console.log(`📍 Health check: http://localhost:${this.port}/health`);
        console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
      });

      // Inicializar Socket.IO
      if (this.server) {
        initSocket(this.server);
        console.log("🔌 Socket.IO inicializado");
      }
    } catch (error) {
      console.error("❌ Erro ao iniciar servidor:", error);
      process.exit(1);
    }
  }

  /**
   * Obter a instância do Express app
   */
  public getApp(): Application {
    return this.app;
  }

  /**
   * Obter a instância do servidor HTTP
   */
  public getServer(): HttpServer | undefined {
    return this.server;
  }
}

// Criar e iniciar o servidor
const server = new Server();
server.start();

// Exportar instância do Prisma para compatibilidade
export const prisma = server.prisma;

// Exportar app para testes
export default server.getApp();
