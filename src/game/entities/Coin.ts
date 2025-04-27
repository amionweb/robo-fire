import { Entity, EntityType, Vector2D, Size } from '../types';
import { generateId } from '../utils/collision';

export class Coin implements Entity {
  id: string;
  type: EntityType;
  position: Vector2D;
  velocity: Vector2D;
  size: Size;
  speed: number;
  isActive: boolean;
  color: string;
  rotation: number;
  rotationSpeed: number;

  constructor(position: Vector2D, size: Size) {
    this.id = 'coin-' + generateId();
    this.type = EntityType.COIN;
    this.position = position;
    this.velocity = { x: 0, y: 1 };
    this.size = size;
    this.speed = 0.2;
    this.isActive = true;
    this.color = '#facc15'; // Yellow
    this.rotation = 0;
    this.rotationSpeed = 0.005;
  }

  update(deltaTime: number): void {
    // Move coin downward
    this.position.y += this.velocity.y * this.speed * deltaTime;
    
    // Rotate coin
    this.rotation += this.rotationSpeed * deltaTime;
    
    // Add slight horizontal movement for a floating effect
    this.position.x += Math.sin(this.rotation * 0.5) * 0.5;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Save context
    ctx.save();
    
    // Move to coin center, rotate, then draw
    ctx.translate(
      this.position.x + this.size.width / 2,
      this.position.y + this.size.height / 2
    );
    
    // Apply rotation based on ellipse ratio
    ctx.rotate(this.rotation);
    
    // Draw coin
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(
      0, 0,
      this.size.width / 2 * Math.abs(Math.cos(this.rotation)) + this.size.height / 2 * Math.abs(Math.sin(this.rotation)),
      this.size.height / 2,
      0, 0, Math.PI * 2
    );
    ctx.fill();
    
    // Draw coin highlight
    ctx.fillStyle = '#fef3c7'; // Lighter yellow
    ctx.beginPath();
    ctx.ellipse(
      -this.size.width / 8,
      -this.size.height / 8,
      this.size.width / 6 * Math.abs(Math.cos(this.rotation)) + this.size.height / 6 * Math.abs(Math.sin(this.rotation)),
      this.size.height / 6,
      0, 0, Math.PI * 2
    );
    ctx.fill();
    
    // Draw coin edge
    ctx.strokeStyle = '#d97706'; // Dark orange
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(
      0, 0,
      this.size.width / 2 * Math.abs(Math.cos(this.rotation)) + this.size.height / 2 * Math.abs(Math.sin(this.rotation)),
      this.size.height / 2,
      0, 0, Math.PI * 2
    );
    ctx.stroke();
    
    // Restore context
    ctx.restore();
  }
}