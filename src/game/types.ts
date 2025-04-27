// Game constants
export const POINTS_PER_COIN = 1;
export const POINTS_TO_LEVEL_UP = 10;
export const MAX_LEVEL = 10;

// Game states
export enum GameState {
  START,
  PLAYING,
  GAME_OVER,
  VICTORY
}

// Entity types
export enum EntityType {
  ROBOT,
  CLOUD,
  BULLET,
  COIN,
  OBSTACLE
}

// Common interfaces
export interface Vector2D {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Entity {
  id: string;
  type: EntityType;
  position: Vector2D;
  velocity: Vector2D;
  size: Size;
  isActive: boolean;
  update: (deltaTime: number) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}

// Event callback interfaces
export interface GameCallbacks {
  onScoreUpdate: (score: number) => void;
  onLevelUpdate: (level: number) => void;
  onGameOver: (finalScore: number) => void;
  onVictory: (finalScore: number) => void;
}