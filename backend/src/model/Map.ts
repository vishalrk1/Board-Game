import {
  Cell,
  CombatResult,
  MapCharacterMoveResult,
  MoveResult,
  TerrainType,
} from "../types";
import { Archer, Character, Mage, Pikeman, Scout } from "./Character";

export class Board {
  private board: Cell[][];
  private size: number = 0;

  constructor(size: number = 8) {
    this.size = size;
    this.board = [];
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

  private isValidMove(
    character: Character,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ): boolean {
    // Calculate hex distance (for hex grid movement)
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dx + dy));

    // Check movement range
    if (distance > character.movement) return false;

    // Check terrain restrictions
    const targetTerrain = this.board[toY][toX].terrain;
    if (targetTerrain === TerrainType.WATER && !character.canCrossWater) {
      return false;
    }

    // Additional movement restrictions based on character type
    if (character instanceof Scout) {
      // Scouts can move through forests without penalty
      return true;
    }

    // Forest movement penalty for other characters
    if (targetTerrain === TerrainType.FOREST) {
      // Reduce effective movement range in forests
      if (distance > Math.floor(character.movement / 2)) {
        return false;
      }
    }

    return true;
  }

  public getValidMoves(character: Character): [number, number][] {
    const [currentX, currentY] = this.findCharacterPosition(character);
    if (currentX === -1 || currentY === -1) return [];

    const validMoves: [number, number][] = [];
    const range = character.movement;

    // Check all positions within movement range
    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        const newX = currentX + dx;
        const newY = currentY + dy;

        if (this.isValidPosition(newX, newY) && 
            this.isValidMove(character, currentX, currentY, newX, newY)) {
          validMoves.push([newX, newY]);
        }
      }
    }

    return validMoves;
  }

  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  private handelCombact(
    attacker: Character,
    defender: Character
  ): CombatResult {
    let damage = attacker.attack;
    let specialEffect = "";

    if (attacker instanceof Archer) {
      // archer can have 2x damange at random
      if (Math.random() > 0.5) {
        damage *= 2;
        specialEffect = "Precision Shot activated! Double damage!";
      }
    } else if (attacker instanceof Pikeman && defender instanceof Archer) {
      // Pikeman have 2x damage on Archer
      damage *= 2;
      specialEffect =
        "Brace for Impact activated! Double damage against Archer!";
    } else if (attacker instanceof Mage) {
      // mage will attack current characters and other characters abround it
      specialEffect = "Elemental Burst activated! Area damage dealt!";
    }

    const winner = defender.health - damage > 0 ? defender : attacker;
    const loser = winner === defender ? attacker : defender;

    return { winner, loser, damage, specialEffect };
  }

  public placeCharacter(character: Character, x: number, y: number) {
    // Correct indexing: row first, then column
    if (!this.board[y][x].character && this.isValidPosition(x, y)) {
      this.board[y][x].character = character;
    }
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

  // function to handel all characters movements
  public moveCharacter(
    newX: number,
    newY: number,
    character: Character
  ): MapCharacterMoveResult {
    const [oldX, oldY] = this.findCharacterPosition(character);
    // Check if the character exists on the board
    if (oldX === -1 || oldY === -1) {
      return {
        success: false,
        message: "Character not found on board!",
      };
    }

    // Validate the move
    if (!this.isValidMove(character, oldX, oldY, newX, newY)) {
      return {
        success: false,
        message: "Invalid move! Check movement range and terrain.",
      };
    }

    // check if the new position has a character
    const targetCharacter = this.board[newY][newX].character;
    if (targetCharacter) {
      const combatResult: CombatResult = this.handelCombact(
        character,
        targetCharacter
      );
      this.board[oldY][oldX].character = null;
      this.board[newY][newX].character = combatResult.winner;
      return {
        success: true,
        message: `Combat occurred! ${
          combatResult.specialEffect || ""
        } Damage dealt: ${combatResult.damage}`,
        combat: combatResult,
      };
    }

    // if no character is present manual movement
    this.board[oldY][oldX].character = null; // Fix indexing here
    this.board[newY][newX].character = character;

    return { success: true, message: "Move Successful" };
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
