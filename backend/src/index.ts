import "dotenv/config";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import connectDB from "./config/db";
import { logger } from "./utils/logger";
import { ApiResponse } from "./utils/ApiResponse";
import { StatusCode } from "./utils/enums";
import { GeneralMessages } from "./utils/constants";
import { globalRateLimiter } from "./middlewares/rateLimiter";
import { requestLogger } from "./middlewares/requestLogger";
import authRoutes from "./routes/authRoutes";
import habitRoutes from "./routes/habitRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import profileRoutes from "./routes/profileRoutes";

const app: Application = express();
const PORT = Number(process.env.PORT) || 5000;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(globalRateLimiter);

// ── Parsing & Utilities ───────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression() as express.RequestHandler);
app.use(morgan("dev"));
app.use(requestLogger);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res
    .status(StatusCode.OK)
    .json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res
    .status(StatusCode.NOT_FOUND)
    .json(ApiResponse.error(GeneralMessages.ROUTE_NOT_FOUND));
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// Must have 4 params so Express recognises it as error middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(`[Error] ${err.message}`, { stack: err.stack });
  const statusCode: number =
    typeof err.statusCode === "number"
      ? err.statusCode
      : StatusCode.INTERNAL_SERVER_ERROR;
  const message: string = err.statusCode
    ? err.message
    : GeneralMessages.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json(ApiResponse.error(message));
});

// ── Start Server ──────────────────────────────────────────────────────────────
const start = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(
        `🚀 Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`,
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

start();
