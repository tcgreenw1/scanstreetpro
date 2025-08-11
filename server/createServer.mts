// server/createServer.ts
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
// 👈 again, .js not .ts

export function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/ping", (_req, res) => {
    res.json({ message: "pong" });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
