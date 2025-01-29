import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
/* const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : "https://chat-em.onrender.com"; */
const io = new Server(server, {
  cors: {
    origin: ["https://chat-em.onrender.com"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

const userSocket = {};

io.on("connect", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocket[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocket));

  socket.on("disconnect", () => {
    delete userSocket[userId];
    io.emit("getOnlineUsers", Object.keys(userSocket));
  });
});

export function getSocketId(userId) {
  return userSocket[userId];
}

export { io, server, app };
