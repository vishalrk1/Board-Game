import { Character } from "./model/Character";

// Enums and Types
export enum CharacterType {
  WARRIOR,
  ARCHER,
  PIKEMAN,
  MAGE,
  SCOUT,
}

export type Position = {
  x: number;
  y: number;
};

export enum TerrainType {
  PLAIN = "PLAIN",
  FOREST = "FOREST",
  WATER = "WATER",
}

export interface Cell {
  terrain: TerrainType;
  character: Character | null;
}

export type GameStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED"
  | "TIME_UP"
  | "PLAYER_EXIT";

// WebSocket message types
export const AUTHENTICATE = "AUTHENTICATE";
export const AUTH_PENDING = "AUTH_PENDING";
export const AUTH_FAILED = "AUTH_FAILED";
export const AUTH_SUCCESS = "AUTH_SUCCESS";

export const INIT_GAME = "INIT_GAME";
export const FINDING_GAME = "FINDING_GAME";
export const GAME_STARTED = "GAME_STARTED";

export const ATTACK = "ATTACK";
export const ACTIVATE_ABILITY = "ACTIVATE_ABILITY";
export const GAME_UPDATE = "GAME_UPDATE";
export const GAME_OVER = "GAME_OVER";

export const MOVE = "MOVE";
export const INVALID_MOVE = "INVALID_MOVE";
export const ERROR = "ERROR";

export interface AttackResult {
  success: boolean;
  message: string;
  damage?: number;
}

export interface GameState {
  type?: string;
  id: string;
  currentTurn: string;
  map: any; // Replace 'any' with a proper Map serialization type
  players: {
    [playerId: string]: PlayerState;
  };
}

export interface MoveResult {
  success: boolean;
  message: string;
  gameState: GameState;
}

export interface MapCharacterMoveResult {
  success: boolean;
  message: string;
  combat?: CombatResult
}

export interface PlayerState {
  characters: (Character & {
    position: [number, number];
  })[];
}

export interface CharacterMoveData {
  type?: string;
  characterId: string;
  newX: number;
  newY: number;
  playerId?: string;
}

export interface CombatResult {
  winner: Character;
  loser: Character;
  damage: number;
  specialEffect?: string;
}