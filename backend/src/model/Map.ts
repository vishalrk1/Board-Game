import { Cell, MovementResult, TerrainType } from "../types";
import { Character } from "./Character";

export class Board {
  private board: Cell[][];
  private size: number = 0;

  constructor(size: number = 8) {
    this.size = size;
    this.board = [];
  }

  public generateBoard(): void {
    // creating a empty board with all plain slides and no character
    this.board = Array(this.size)
      .fill(null)
      .map(() =>
        Array(this.size)
          .fill(null)
          .map(
            () =>
              ({
                terrain: TerrainType.PLAIN,
                character: null,
              } as Cell)
          )
      );
    this.generateForests();
    this.generateWater();
  }

  private generateWater(): void {
    const waterBodies = Math.floor(Math.random() * 3) + 1; // 1-3 water bodies
    for (let i = 0; i < waterBodies; i++) {
      const x = Math.floor(Math.random() * (this.size - 2)) + 1; // Avoid edges
      const y = Math.floor(Math.random() * (this.size - 4)) + 2; // Avoid starting lines

      if (this.board[y] && this.board[y][x]) {
        // Ensure the board cell exists
        this.board[y][x].terrain = TerrainType.WATER;

        if (Math.random() > 0.5) {
          // 50% chance for an adjacent pair
          const direction = Math.random() > 0.5 ? 1 : -1;
          const adjacentX = Math.min(Math.max(x + direction, 0), this.size - 1);

          if (this.board[y][adjacentX]) {
            // Check if adjacent cell exists
            this.board[y][adjacentX].terrain = TerrainType.WATER;
          }
        }
      }
    }
  }

  private generateForests(): void {
    const forestClusters = Math.floor(Math.random() * 3) + 2; // 2-4 forest clusters
    for (let i = 0; i < forestClusters; i++) {
      const centerX = Math.floor(Math.random() * 6) + 1; // Avoid edges
      const centerY = Math.floor(Math.random() * 4) + 2; // Avoid starting lines
      this.createForestCluster(centerX, centerY);
    }
  }

  private createForestCluster(centerX: number, centerY: number): void {
    const clusterSize = Math.floor(Math.random() * 3) + 2; // 2-4 cells per cluster
    for (let i = 0; i < clusterSize; i++) {
      const x = Math.min(
        Math.max(centerX + Math.floor(Math.random() * 3) - 1, 0),
        this.size - 1
      );
      const y = Math.min(
        Math.max(centerY + Math.floor(Math.random() * 3) - 1, 0),
        this.size - 1
      );
      if (y > 0 && y < this.size - 1) {
        // Avoid starting lines
        this.board[y][x].terrain = TerrainType.FOREST;
      }
    }
  }

  public placeCharacter(character: Character, x: number, y: number) {
    // if the cordinates are valid and character is not present character will be placed on (x,y)
    if (!this.board[x][y].character && this.isValidPosition(x, y)) {
      this.board[x][y].character = character;
    }
  }

  public moveCharacter(
    newX: number,
    newY: number,
    character: Character
  ): MovementResult {
    const [oldX, oldY] = this.findCharacterPosition(character);
    if (oldX === -1 || !this.isValidMove(character, oldX, oldY, newX, newY)) {
      return { success: false, message: "Invalid Move!" };
    }
    this.board[oldX][oldY].character = null;
    this.board[newX][newY].character = character;

    return { success: true, message: "Move Sucessfull" };
  }

  private isValidMove(
    character: Character,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ): boolean {
    const distance = Math.abs(fromX - toX) + Math.abs(fromY - toY);

    // if distance to travel is greater than movement allowed to character
    if (distance > character.movement) return false;

    // it it is a water body and character can not move on water body
    if (
      this.board[toY][toX].terrain === TerrainType.WATER &&
      !character.canCrossWater
    ) {
      return false;
    }

    return true;
  }

  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  public findCharacterPosition(character: Character): [number, number] {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x].character === character) {
          return [x, y];
        }
      }
    }
    return [-1, -1];
  }

  public getCharacterAtPosition(x: number, y: number): Character | null {
    return this.board[y][x].character;
  }

  public getTerrainAtPosition(x: number, y: number): TerrainType {
    return this.board[y][x].terrain;
  }

  public removeCharacter(x: number, y: number): void {
    if (this.isValidPosition(x, y)) {
      this.board[y][x].character = null;
    }
  }

  public serialize(): object {
    console.log(this.board);
    return {
      size: this.size,
      board: this.board.map((row) =>
        row.map((cell) => ({
          terrain: cell.terrain,
          character: cell.character
            ? {
                id: cell.character.id,
                // type: cell.character.type,
                health: cell.character.health,
              }
            : null,
        }))
      ),
    };
  }
}
