import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { signIn, signUp, verifyToken } from "./routes/auth";
import { protectedQueryDatabase, testConnection } from "./routes/database";
import signupRoutes from "./routes/signup";
import plansRoutes from "./routes/plans";
import initDbRoutes from "./routes/init-db";
import hashGenRoutes from "./routes/hash-generator";
import adminRoutes from "./routes/admin";
import migrateRoutes from "./routes/migrate";
import exportRoutes from "./routes/export";
import mockRoutes from "./routes/mock";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/signin", signIn);
  app.post("/api/auth/signup", signUp);
  app.get("/api/auth/verify", verifyToken);

  // New signup and auth routes
  app.use("/api", signupRoutes);
  app.use("/api/plans", plansRoutes);
  app.use("/api", initDbRoutes);
  app.use("/api", hashGenRoutes);
  // Use mock routes if database is disabled, otherwise use real routes
  if (process.env.DISABLE_DB === 'true') {
    app.use("/api/admin", mockRoutes);
  } else {
    app.use("/api/admin", adminRoutes);
  }
  app.use("/api/migrate", migrateRoutes);
  app.use("/api/export", exportRoutes);

  // Database routes
  app.post("/api/db/query", protectedQueryDatabase);
  app.get("/api/db/test", testConnection);

  return app;
}
