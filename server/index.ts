import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { signIn, signUp, verifyToken, checkUserStatus } from "./routes/auth";
import { protectedQueryDatabase, testConnection } from "./routes/database";
import signupRoutes from "./routes/signup";
import plansRoutes from "./routes/plans";
import initDbRoutes from "./routes/init-db";
import hashGenRoutes from "./routes/hash-generator";
import adminRoutes from "./routes/admin";
import migrateRoutes from "./routes/migrate";
import exportRoutes from "./routes/export";
import mockRoutes from "./routes/mock";
import planTrackingRoutes from "./routes/plan-tracking";
import featureMatrixRoutes from "./routes/feature-matrix";
import assetsRoutes from "./routes/assets";
import roadInspectionsRoutes from "./routes/road-inspections";
import maintenanceRoutes from "./routes/maintenance";

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

  // Direct auth routes (used by auth context)
  app.post("/api/login", signIn);
  app.post("/api/signup", signUp);
  app.get("/api/me", verifyToken);
  app.post("/api/logout", (req, res) => {
    // Clear any server-side session data
    res.clearCookie('session_token', { httpOnly: true, secure: true });
    res.clearCookie('auth_token', { httpOnly: true, secure: true });
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Debug route (admin only)
  app.get("/api/debug/user-status", checkUserStatus);

  // New signup and auth routes
  app.use("/api", signupRoutes);
  app.use("/api/plans", plansRoutes);
  app.use("/api", initDbRoutes);
  app.use("/api", hashGenRoutes);
  // Always use enhanced admin routes (they include better mock data fallback)
  app.use("/api/admin", adminRoutes);
  app.use("/api/migrate", migrateRoutes);
  app.use("/api/export", exportRoutes);
  app.use("/api/plan-tracking", planTrackingRoutes);
  app.use("/api/feature-matrix", featureMatrixRoutes);
  app.use("/api/assets", assetsRoutes);
  app.use("/api/road-inspections", roadInspectionsRoutes);
  app.use("/api/maintenance", maintenanceRoutes);

  // Always enable mock routes as fallback
  app.use("/api/mock", mockRoutes);

  // Database routes
  app.post("/api/db/query", protectedQueryDatabase);
  app.get("/api/db/test", testConnection);

  return app;
}
