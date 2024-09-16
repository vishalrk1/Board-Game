// Enums and Types
export enum CharacterType {
  WARRIOR,
  ARCHER,
  PIKEMAN,
  MAGE,
  SCOUT,
}

export enum TerrainType {
  PLAIN,
  FOREST,
  WATER,
}

export type Position = {
  x: number;
  y: number;
};

export type Character = {
  type: CharacterType;
  health: number;
  attack: number;
  movement: number;
  position: Position;
  specialAbilityActive: boolean;
};

export type Player = {
  id: string;
  characters: Character[];
};

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
export const JOIN_GAME = "JOIN_GAME";

export const MOVE = "MOVE";
export const ATTACK = "ATTACK";
export const ACTIVATE_ABILITY = "ACTIVATE_ABILITY";
export const GAME_UPDATE = "GAME_UPDATE";
export const GAME_OVER = "GAME_OVER";

export const ERROR = "ERROR";
