import { Entity } from '../types';

// Simple bounding box collision detection
export function checkCollision(entityA: Entity, entityB: Entity): boolean {
  return (
    entityA.position.x < entityB.position.x + entityB.size.width &&
    entityA.position.x + entityA.size.width > entityB.position.x &&
    entityA.position.y < entityB.position.y + entityB.size.height &&
    entityA.position.y + entityA.size.height > entityB.position.y
  );
}

// Generate unique ID for entities
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}