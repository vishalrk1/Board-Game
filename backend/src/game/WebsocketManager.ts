import User, { IUser } from "../model/User";
import { WebSocket } from "ws";
import { verifyToken } from "../utils/jwtUtils";
import { AUTH_FAILED, AUTH_PENDING, FINDING_GAME } from "../types";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  user?: IUser;
}

export class SocketManager {
  private static instance: SocketManager;
  private connections: Map<string, AuthenticatedWebSocket>; // all sockets: socketId -> socket instance
  private userConnection: Map<string, string>; // userId -> socketId

  private constructor() {
    this.connections = new Map();
    this.userConnection = new Map();
  }

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  addSocket(socketId: string, socket: AuthenticatedWebSocket) {
    console.log("used added to list");
    this.connections.set(socketId, socket);
    socket.send(JSON.stringify({ type: AUTH_PENDING }));
  }

  removeSocket(socketId: string) {
    const socket = this.connections.get(socketId);
    if (socket && socket.userId) {
      this.userConnection.delete(socket.userId);
    }
    this.connections.delete(socketId);
  }

  getSocket(socketId: string): AuthenticatedWebSocket | undefined {
    return this.connections.get(socketId);
  }

  async authenticateSocket(socketID: string, token: string): Promise<IUser> {
    console.log("Authenticating user");
    const socket = this.connections.get(socketID);
    if (!socket) {
      throw new Error("Player Not found!!");
    }
    try {
      const decode = verifyToken(token);
      const user: IUser | null = await User.findById(decode.id);

      if (!user) {
        throw new Error("Usrr Not found!!");
      }

      socket.userId = user?.id.toString();
      socket.user = user;
      this.userConnection.set(user.id.toString(), socketID);
      return user;
    } catch (e) {
      throw new Error("Authentication failed");
    }
  }

  private getSocketByUserId(
    userId: string
  ): AuthenticatedWebSocket | undefined {
    const socketId = this.userConnection.get(userId);
    return socketId ? this.connections.get(socketId) : undefined;
  }

  sendToUser(userId: string, message: string) {
    const socket = this.getSocketByUserId(userId);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  }

  isAuthenticated(socketId: string): boolean {
    const socket = this.connections.get(socketId);
    return !!socket && !!socket.userId;
  }
}
