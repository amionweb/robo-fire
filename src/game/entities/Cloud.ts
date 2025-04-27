import { Entity, EntityType, Vector2D, Size } from '../types';
import { generateId } from '../utils/collision';
import { Coin } from './Coin';

export class Cloud implements Entity {
  id: string;
  type: EntityType;
  position: Vector2D;
  velocity: Vector2D;
  size: Size;
  speed: number;
  isActive: boolean;
  color: string;
  level: number;

  constructor(position: Vector2D, size: Size, level: number) {
    this.id = 'cloud-' + generateId();
    this.type = EntityType.CLOUD;
    this.position = position;
    this.velocity = { x: 0, y: 1 };
    this.size = size;
    this.speed = 0.1 + (level * 0.02); // Increase speed with level
    this.isActive = true;
    this.color = '#f1f5f9'; // Light gray
    this.level = level;
  }

  update(deltaTime: number): void {
    // Move cloud downward
    this.position.y += this.velocity.y * this.speed * deltaTime;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Draw cloud
    ctx.fillStyle = this.color;
    
    // Main cloud body
    ctx.beginPath();
    ctx.arc(
      this.position.x + this.size.width * 0.3, 
      this.position.y + this.size.height * 0.5,
      this.size.height * 0.5,
      0,
      Math.PI * 2
    );
    ctx.arc(
      this.position.x + this.size.width * 0.6, 
      this.position.y + this.size.height * 0.4,
      this.size.height * 0.6,
      0,
      Math.PI * 2
    );
    ctx.arc(
      this.position.x + this.size.width * 0.8, 
      this.position.y + this.size.height * 0.6,
      this.size.height * 0.4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Create a coin when the cloud is destroyed
  createCoin(): Coin {
    return new Coin(
      { 
        x: this.position.x + this.size.width / 2 - 15, 
        y: this.position.y + this.size.height / 2 - 15 
      },
      { width: 30, height: 30 }
    );
  }
}