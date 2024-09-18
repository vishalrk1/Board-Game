import { Board } from "../model/Map";
import { GameState, PlayerState } from "../types";

export class Game {
  public id: string;
  public player1Id: string;
  public player2Id: string;
  private map: Board;
  private currentTurn: string;
  private players: Map<string, PlayerState>;

  constructor(id: string, player1Id: string, player2Id: string) {
    this.id = id;
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.map = new Board();
    this.currentTurn = player1Id;
    this.players = new Map();
  }

  public async initialize(): Promise<void> {
    this.map.generateBoard();
  }

  public getGameState(): GameState {
    return {
      id: this.id,
      currentTurn: this.currentTurn,
      map: this.map.serialize(),
      players: {},
      //   players: {
      //     [this.player1Id]: this.player1Id, //this.serializePlayerState(this.player1Id),
      //     [this.player2Id]: this.player2Id, //this.serializePlayerState(this.player2Id),
      //   },
    };
  }

  private serializePlayerState(playerId: string): PlayerState {
    const state = this.players.get(playerId)!;
    return {
      characters: state.characters.map((c) => ({
        ...c,
        position: this.map.findCharacterPosition(c),
      })),
    };
  }
}
