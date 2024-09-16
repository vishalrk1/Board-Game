import {
  AUTH_SUCCESS,
  AUTHENTICATE,
  ERROR,
  FINDING_GAME,
  INIT_GAME,
  JOIN_GAME,
} from "../types";
import { WebSocket } from "ws";
import { SocketManager } from "./WebsocketManager";

export class GameManager {
  private socketManager: SocketManager;
  private activeGames: string[];
  private waitingPlayers: string[];

  constructor() {
    this.socketManager = SocketManager.getInstance();
    this.activeGames = [];
    this.waitingPlayers = [];
  }

  async handleWebSocketMessage(socketId: string, message: string) {
    try {
      const data = JSON.parse(message);
      switch (data?.type) {
        case AUTHENTICATE:
          this.authenticateUser(socketId, data?.token);
          break;
        case INIT_GAME: // joining queue
          this, this.ensureAuthenticate(socketId);
          this.joinQueue(socketId);
      }
    } catch (e) {}
  }

  async joinQueue(socketId: string) {
    const socket = this.socketManager.getSocket(socketId);
    if (!socket || !socket.userId) {
      throw new Error("Socket Not Found");
    }
    // adding user to waiting list
    this.waitingPlayers.push(socket.userId?.toString());
    // if less than 2 users are there notify users regarding same
    if (this.waitingPlayers.length < 2) {
      this.socketManager.sendToUser(
        socket.userId,
        JSON.stringify({
          message: "Waiting for other player to join",
          type: FINDING_GAME,
        })
      );
    }
    this.tryMatchPlayer(); // try to start a game with other player 
  }

  // function to add 2 players in a game
  private async tryMatchPlayer() {
    while (this.waitingPlayers.length >= 2) {
      const player1Id = this.waitingPlayers.shift()!;
      const player2Id = this.waitingPlayers.shift()!;

      // start the game here
      const message = {
        gameId: "1",
        message: "Games Started!!",
        type: JOIN_GAME,
      };
      // notify user game has been started
      this.socketManager.sendToUser(player1Id, JSON.stringify(message));
      this.socketManager.sendToUser(player2Id, JSON.stringify(message));
    }
  }

  private async authenticateUser(socketId: string, token: string) {
    try {
      const user = await this.socketManager.authenticateSocket(socketId, token);
      // when authentication sucess tell user a game is being found
      this.socketManager.sendToUser(
        user.id.toString(),
        JSON.stringify({ type: AUTH_SUCCESS })
      );
    } catch (e) {
      this.handleError(socketId, "Authentication Failed!");
    }
  }

  private async ensureAuthenticate(socketId: string) {
    if (!this.socketManager.isAuthenticated(socketId)) {
      throw new Error("User is Not authenticated");
    }
  }

  // sending user a message when error is detected
  private handleError(socketId: string, error: any) {
    console.error("Error in GameManager:", error);
    const socket = this.socketManager.getSocket(socketId);
    if (socket) {
      socket.send(
        JSON.stringify({
          type: ERROR,
          message: error.message || "An unexpected error occurred",
        })
      );
    }
  }
}
