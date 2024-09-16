import express from "express";
import cors from "cors";
import http from "http";
import { v4 as uuidv4 } from "uuid";

import authRoutes from "./routes/authRoutes";
import { WebSocket } from "ws";
import { AUTHENTICATE, INIT_GAME } from "./types";
import { GameManager } from "./game/GameManager";
import { SocketManager } from "./game/WebsocketManager";

const app = express();
app.use(cors({ credentials: true }));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// start game manager
const gameManager = new GameManager();
// start websocket manager
const socketManager = SocketManager.getInstance();

wss.on("connection", async (ws: WebSocket) => {
  const socketID = uuidv4();
  socketManager.addSocket(socketID, ws);

  ws.on("message", async (message: string) => {
    gameManager.handleWebSocketMessage(socketID, message);
  });

  ws.on("close", () => {
    console.log(`WebSocket connection closed: ${socketID}`);
    socketManager.removeSocket(socketID);
  });
});

app.use("/api/auth", authRoutes);

export default server;
