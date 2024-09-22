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
    const waterBodies = Math.floor(Math.random() * 4) + 3; // 3-6 water bodies
    for (let i = 0; i < waterBodies; i++) {
      const x = Math.floor(Math.random() * (this.size - 2)) + 1;
      const y = Math.floor(Math.random() * (this.size - 4)) + 2;

      if (this.board[y] && this.board[y][x]) {
        this.board[y][x].terrain = TerrainType.WATER;

        // Increase chance for adjacent water cells
        if (Math.random() > 0.3) {
          // 70% chance for adjacent cells
          const directions = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
          ];
          for (const [dx, dy] of directions) {
            const newX = Math.min(Math.max(x + dx, 0), this.size - 1);
            const newY = Math.min(Math.max(y + dy, 0), this.size - 1);
            if (this.board[newY] && this.board[newY][newX]) {
              this.board[newY][newX].terrain = TerrainType.WATER;
            }
          }
        }
      }
    }
  }

  private generateForests(): void {
    const forestClusters = Math.floor(Math.random() * 5) + 5; // 5-9 forest clusters
    for (let i = 0; i < forestClusters; i++) {
      const centerX = Math.floor(Math.random() * (this.size - 2)) + 1;
      const centerY = Math.floor(Math.random() * (this.size - 4)) + 2;
      this.createForestCluster(centerX, centerY);
    }
  }

  private createForestCluster(centerX: number, centerY: number): void {
    const clusterSize = Math.floor(Math.random() * 4) + 3; // 3-6 trees per cluster
    for (let i = 0; i < clusterSize; i++) {
      const offsetX = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      const offsetY = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      const x = Math.min(Math.max(centerX + offsetX, 0), this.size - 1);
      const y = Math.min(Math.max(centerY + offsetY, 0), this.size - 1);

      if (this.board[y] && this.board[y][x]) {
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
    return {
      size: this.size,
      board: this.board.map((row, y) =>
        row.map((cell, x) => ({
          position: { row: y, col: x },
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
