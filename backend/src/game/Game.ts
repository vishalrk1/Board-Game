import { Player } from "../model/Player";
import { Board } from "../model/Map";
import {
  CharacterMoveData,
  GAME_UPDATE,
  GameState,
  INVALID_MOVE,
  MapCharacterMoveResult,
  MoveResult,
  PlayerState,
} from "../types";
import { Character } from "../model/Character";

export class Game {
  public id: string;
  public player1Id: string;
  public player2Id: string;
  private map: Board;
  private currentTurn: string;
  private players: Map<string, Player>;

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
    this.initializePlayers();
    this.placeCharactersOnMap();
  }

  // this function will create players with characters
  private initializePlayers() {
    this.players.set(this.player1Id, new Player(this.player1Id));
    this.players.set(this.player2Id, new Player(this.player2Id));
  }

  // this function will place characters on map
  private placeCharactersOnMap(): void {
    const placeforPlayer = (playerId: string, x: number) => {
      const player = this.players.get(playerId);
      if (player) {
        for (let i = 1; i < player?.characters.length; i++) {
          this.map.placeCharacter(player.characters[i], x, i);
        }
      }
    };
    placeforPlayer(this.player1Id, 0); // start player 1 characeters on one side of map
    placeforPlayer(this.player2Id, 7); // start player 2 characeters on second sice of map
  }

  private switchTurn() {
    this.currentTurn =
      this.currentTurn === this.player1Id ? this.player2Id : this.player1Id;
  }

  public async handelMove(data: CharacterMoveData): Promise<MoveResult> {
    if (this.currentTurn !== data.playerId) {
      return {
        success: false,
        message: "This is not your Turn",
        gameState: this.getGameState(INVALID_MOVE),
      };
    }

    const character = this.players
      .get(this.currentTurn)
      ?.getCharacterById(data.characterId);

    if (!character) {
      return {
        success: false,
        message: "Character not Found",
        gameState: this.getGameState(INVALID_MOVE),
      };
    }
    
    const moveResult: MapCharacterMoveResult = this.map.moveCharacter(
      data.newX,
      data.newY,
      character
    );
    if (!moveResult.success) {
      return {
        success: false,
        message: "Invalid move",
        gameState: this.getGameState(INVALID_MOVE),
      };
    }

    this.switchTurn();
    return {
      success: true,
      message: "Character moved successfully",
      gameState: this.getGameState(GAME_UPDATE),
    };
  }

  public getGameState(type?: string): GameState {
    return {
      type: type,
      id: this.id,
      currentTurn: this.currentTurn,
      map: this.map.serialize(),
      players: {
        [this.player1Id]: this.serializePlayerState(this.player1Id),
        [this.player2Id]: this.serializePlayerState(this.player2Id),
      },
    };
  }

  private serializePlayerState(playerId: string): PlayerState {
    const player = this.players.get(playerId);

    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    return {
      characters: player.getCharacters().map((c) => {
        const character = player.getCharacterById(c.id);
        const position = this.map.findCharacterPosition(c);

        if (!character) {
          throw new Error(`Character with ID ${c.id} not found`);
        }

        if (!position) {
          throw new Error(`Position for character ${c.id} not found`);
        }

        // Return a Character object combined with position
        return {
          ...character, // All properties from Character
          position: position, // Adding position
        } as Character & { position: [number, number] };
      }),
    };
  }

  public isPlayerTurn(playerId: string): boolean {
    return this.currentTurn === playerId;
  }

  public getPlayerIds(): string[] {
    return [this.player1Id, this.player2Id];
  }
}
