import { Entity, EntityType, Vector2D, Size } from '../types';
import { generateId } from '../utils/collision';
import { Bullet } from './Bullet';
import { GameEngine } from '../GameEngine';

export class Robot implements Entity {
  id: string;
  type: EntityType;
  position: Vector2D;
  velocity: Vector2D;
  size: Size;
  speed: number;
  isActive: boolean;
  color: string;
  lastShootTime: number;
  shootCooldown: number;
  private gameEngine: GameEngine;

  constructor(position: Vector2D, size: Size, gameEngine: GameEngine) {
    this.id = 'robot-' + generateId();
    this.type = EntityType.ROBOT;
    this.position = position;
    this.velocity = { x: 0, y: 0 };
    this.size = size;
    this.speed = 0.3;
    this.isActive = true;
    this.color = '#3b82f6'; // Blue color
    this.lastShootTime = 0;
    this.shootCooldown = 300; // Cooldown in milliseconds
    this.gameEngine = gameEngine;
  }

  update(deltaTime: number): void {
    // Update position based on velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    
    // Reset velocity after update
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Draw robot body (rounded rectangle)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(
      this.position.x, 
      this.position.y, 
      this.size.width, 
      this.size.height,
      8
    );
    ctx.fill();
    
    // Draw robot details
    // Eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(
      this.position.x + this.size.width * 0.3, 
      this.position.y + this.size.height * 0.3,
      this.size.width * 0.1,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(
      this.position.x + this.size.width * 0.7, 
      this.position.y + this.size.height * 0.3,
      this.size.width * 0.1,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.position.x + this.size.width * 0.3, this.position.y + this.size.height * 0.7);
    ctx.lineTo(this.position.x + this.size.width * 0.7, this.position.y + this.size.height * 0.7);
    ctx.stroke();
    
    // Antenna
    ctx.beginPath();
    ctx.moveTo(this.position.x + this.size.width * 0.5, this.position.y);
    ctx.lineTo(this.position.x + this.size.width * 0.5, this.position.y - this.size.height * 0.2);
    ctx.stroke();
    
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(
      this.position.x + this.size.width * 0.5,
      this.position.y - this.size.height * 0.2,
      this.size.width * 0.08,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  move(dx: number, dy: number): void {
    this.velocity.x = dx;
    this.velocity.y = dy;
  }

  shoot(): void {
    const now = Date.now();
    if (now - this.lastShootTime < this.shootCooldown) {
      return; // Still in cooldown
    }
    
    // Create a new bullet
    const bulletX = this.position.x + this.size.width / 2 - 5;
    const bulletY = this.position.y - 15;
    const bullet = new Bullet(
      { x: bulletX, y: bulletY },
      { width: 10, height: 20 }
    );
    
    // Add bullet to game
    this.gameEngine.addEntity(bullet);
    
    // Update last shoot time
    this.lastShootTime = now;
  }
}