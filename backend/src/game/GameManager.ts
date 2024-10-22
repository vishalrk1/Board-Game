import {
  AUTH_SUCCESS,
  AUTHENTICATE,
  CharacterMoveData,
  ERROR,
  FINDING_GAME,
  GAME_STARTED,
  GAME_UPDATE,
  INIT_GAME,
  INVALID_MOVE,
  MOVE,
  MoveResult,
} from "../types";
import { SocketManager } from "./WebsocketManager";
import { Game } from "./Game";
import { v4 as uuidv4 } from "uuid";

export class GameManager {
  private socketManager: SocketManager;
  private activeGames: Map<string, Game>;
  private playerGameMap: Map<string, string>; // userId -> gameId
  private waitingPlayers: string[];

  constructor() {
    this.socketManager = SocketManager.getInstance();
    this.activeGames = new Map();
    this.playerGameMap = new Map();
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
          this.ensureAuthenticate(socketId);
          this.joinQueue(socketId);
          break;
        case MOVE:
          this.handelMovetype(socketId, data as CharacterMoveData);
          break;
        default:
          console.log("Unknown message type:", data?.type);
          break;
      }
    } catch (e) {
      this.handleError(socketId, (e as Error).message);
    }
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
    console.log("==> PLAYERS WAITING", this.waitingPlayers.length);
    while (this.waitingPlayers.length >= 2) {
      const player1Id = this.waitingPlayers.shift()!;
      const player2Id = this.waitingPlayers.shift()!;

      const gameId = uuidv4();
      const game = new Game(gameId, player1Id, player2Id);

      await game.initialize();
      this.activeGames.set(gameId, game);
      this.playerGameMap.set(player1Id, gameId);
      this.playerGameMap.set(player2Id, gameId);

      const gameState = game.getGameState(GAME_STARTED);

      // notify user game has been started
      this.socketManager.sendToUser(player1Id, JSON.stringify(gameState));
      this.socketManager.sendToUser(player2Id, JSON.stringify(gameState));
    }
  }

  private getGameForSocket(socketId: string): Game | undefined {
    const userId = this.socketManager.getSocket(socketId)?.userId;

    if (!userId) return undefined;

    const gameId = this.playerGameMap.get(userId);
    return gameId ? this.activeGames.get(gameId) : undefined;
  }

  private async handelMovetype(socketId: string, data: CharacterMoveData) {
    this.ensureAuthenticate(socketId);
    try {
      const game = this.getGameForSocket(socketId);
      if (!game) {
        throw new Error("Game not found");
      }

      const userId = this.socketManager.getSocket(socketId)?.userId;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const movementData: CharacterMoveData = {
        ...data,
        playerId: userId,
      };

      const moveResult: MoveResult = await game?.handelMove(movementData);
      console.log("Movement Team: ", moveResult);

      game.getPlayerIds().forEach((playerId) => {
        this.socketManager.sendToUser(
          playerId,
          JSON.stringify({
            ...moveResult.gameState,
            message: moveResult.message,
          })
        );
      });
    } catch (error) {
      this.handleError(socketId, (error as Error).message);
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
      this.socketManager.removeSocket(socketId);
      this.handleError(socketId, "Authentication Failed!");
    }
  }

  // sending user a message when error is detected
  private handleError(socketId: string, error: string) {
    console.error("Error in GameManager:", error);
    const socket = this.socketManager.getSocket(socketId);
    if (socket) {
      socket.send(
        JSON.stringify({
          type: ERROR,
          message: error || "An unexpected error occurred",
        })
      );
    }
  }
}
