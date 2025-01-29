import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { io, server, app } from "./lib/socket.js";
import cors from "cors";
import path from "path";

app.use(express.json({ limit: "10mb" })); // For JSON payloads
app.use(express.urlencoded({ limit: "10mb", extended: true })); // For URL-encoded payloads

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
dotenv.config();
const port = process.env.PORT;
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

server.listen(port, () => {
  console.log(`server running at port ${port}`);
  connectDB();
});
