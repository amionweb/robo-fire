import { Entity, EntityType, Vector2D, Size } from '../types';
import { generateId } from '../utils/collision';

export class Bullet implements Entity {
  id: string;
  type: EntityType;
  position: Vector2D;
  velocity: Vector2D;
  size: Size;
  speed: number;
  isActive: boolean;
  color: string;

  constructor(position: Vector2D, size: Size) {
    this.id = 'bullet-' + generateId();
    this.type = EntityType.BULLET;
    this.position = position;
    this.velocity = { x: 0, y: -1 };
    this.size = size;
    this.speed = 0.7;
    this.isActive = true;
    this.color = '#f97316'; // Orange
  }

  update(deltaTime: number): void {
    // Move bullet upward
    this.position.y += this.velocity.y * this.speed * deltaTime;
    
    // Deactivate if out of bounds
    if (this.position.y < -this.size.height) {
      this.isActive = false;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Draw bullet
    ctx.fillStyle = this.color;
    
    // Draw bullet body
    ctx.beginPath();
    ctx.moveTo(this.position.x + this.size.width / 2, this.position.y);
    ctx.lineTo(this.position.x + this.size.width, this.position.y + this.size.height);
    ctx.lineTo(this.position.x, this.position.y + this.size.height);
    ctx.closePath();
    ctx.fill();
    
    // Draw bullet trail/glow
    const gradient = ctx.createLinearGradient(
      this.position.x, 
      this.position.y + this.size.height, 
      this.position.x, 
      this.position.y + this.size.height * 2
    );
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.7)');
    gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y + this.size.height);
    ctx.lineTo(this.position.x + this.size.width, this.position.y + this.size.height);
    ctx.lineTo(this.position.x + this.size.width, this.position.y + this.size.height * 2);
    ctx.lineTo(this.position.x, this.position.y + this.size.height * 2);
    ctx.closePath();
    ctx.fill();
  }
}