import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
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
