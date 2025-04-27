import { Entity, EntityType, Vector2D, Size } from '../types';
import { generateId } from '../utils/collision';

export class Obstacle implements Entity {
  id: string;
  type: EntityType;
  position: Vector2D;
  velocity: Vector2D;
  size: Size;
  speed: number;
  isActive: boolean;
  color: string;
  level: number;
  rotationAngle: number;
  obstacleType: 'bolt' | 'asteroid';

  constructor(position: Vector2D, size: Size, level: number) {
    this.id = 'obstacle-' + generateId();
    this.type = EntityType.OBSTACLE;
    this.position = position;
    this.velocity = { x: 0, y: 1 };
    this.size = size;
    this.speed = 0.15 + (level * 0.03); // Increase speed with level
    this.isActive = true;
    this.color = '#ef4444'; // Red
    this.level = level;
    this.rotationAngle = 0;
    this.obstacleType = Math.random() > 0.5 ? 'bolt' : 'asteroid';
  }

  update(deltaTime: number): void {
    // Move obstacle downward
    this.position.y += this.velocity.y * this.speed * deltaTime;
    
    // Rotate the obstacle
    this.rotationAngle += 0.002 * deltaTime;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Save context
    ctx.save();
    
    if (this.obstacleType === 'bolt') {
      // Draw lightning bolt
      ctx.fillStyle = this.color;
      
      // Draw zigzag bolt shape
      ctx.beginPath();
      ctx.moveTo(this.position.x + this.size.width / 2, this.position.y);
      ctx.lineTo(this.position.x + this.size.width * 0.8, this.position.y + this.size.height * 0.4);
      ctx.lineTo(this.position.x + this.size.width * 0.6, this.position.y + this.size.height * 0.4);
      ctx.lineTo(this.position.x + this.size.width * 0.9, this.position.y + this.size.height);
      ctx.lineTo(this.position.x + this.size.width * 0.5, this.position.y + this.size.height * 0.6);
      ctx.lineTo(this.position.x + this.size.width * 0.7, this.position.y + this.size.height * 0.6);
      ctx.lineTo(this.position.x + this.size.width * 0.2, this.position.y);
      ctx.closePath();
      ctx.fill();
      
      // Add glow effect
      const gradient = ctx.createRadialGradient(
        this.position.x + this.size.width / 2, 
        this.position.y + this.size.height / 2,
        0,
        this.position.x + this.size.width / 2, 
        this.position.y + this.size.height / 2,
        this.size.width
      );
      gradient.addColorStop(0, 'rgba(254, 240, 138, 0.7)'); // Yellow glow
      gradient.addColorStop(1, 'rgba(254, 240, 138, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(
        this.position.x + this.size.width / 2,
        this.position.y + this.size.height / 2,
        this.size.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    } else {
      // Draw asteroid
      ctx.translate(
        this.position.x + this.size.width / 2,
        this.position.y + this.size.height / 2
      );
      ctx.rotate(this.rotationAngle);
      
      ctx.fillStyle = '#71717a'; // Gray color for asteroid
      
      // Draw irregular asteroid shape
      ctx.beginPath();
      ctx.moveTo(-this.size.width * 0.5, -this.size.height * 0.2);
      ctx.lineTo(-this.size.width * 0.3, -this.size.height * 0.5);
      ctx.lineTo(this.size.width * 0.1, -this.size.height * 0.4);
      ctx.lineTo(this.size.width * 0.5, -this.size.height * 0.1);
      ctx.lineTo(this.size.width * 0.4, this.size.height * 0.3);
      ctx.lineTo(this.size.width * 0.1, this.size.height * 0.5);
      ctx.lineTo(-this.size.width * 0.3, this.size.height * 0.4);
      ctx.lineTo(-this.size.width * 0.5, this.size.height * 0.1);
      ctx.closePath();
      ctx.fill();
      
      // Add some crater details
      ctx.fillStyle = '#52525b'; // Darker gray for craters
      ctx.beginPath();
      ctx.arc(-this.size.width * 0.15, -this.size.height * 0.1, this.size.width * 0.1, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(this.size.width * 0.2, this.size.height * 0.15, this.size.width * 0.08, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(-this.size.width * 0.1, this.size.height * 0.25, this.size.width * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Restore context
    ctx.restore();
  }
}