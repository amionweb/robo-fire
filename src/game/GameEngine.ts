import { Entity, EntityType, GameCallbacks, POINTS_PER_COIN, POINTS_TO_LEVEL_UP, MAX_LEVEL } from './types';
import { Robot } from './entities/Robot';
import { Cloud } from './entities/Cloud';
import { Obstacle } from './entities/Obstacle';
import { InputHandler } from './InputHandler';
import { checkCollision } from './utils/collision';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private entities: Map<string, Entity>;
  private robot: Robot | null = null;
  private inputHandler: InputHandler;
  private animationFrameId: number = 0;
  private lastTimestamp: number = 0;
  private score: number = 0;
  private level: number = 1;
  private isRunning: boolean = false;
  private spawnTimers: { clouds: number; obstacles: number } = { clouds: 0, obstacles: 0 };
  private callbacks: GameCallbacks;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.entities = new Map();
    this.inputHandler = new InputHandler();
    this.callbacks = callbacks;

    // Initialize game
    this.init();
  }

  private init(): void {
    // Create player robot
    const robotX = this.canvas.width / 2;
    const robotY = this.canvas.height - 100;
    this.robot = new Robot(
      { x: robotX, y: robotY },
      { width: 50, height: 50 },
      this
    );
    this.entities.set(this.robot.id, this.robot);

    // Reset game state
    this.score = 0;
    this.level = 1;
    this.updateScore(0);
    this.updateLevel(1);
  }

  // Add an entity to the game
  public addEntity(entity: Entity): void {
    this.entities.set(entity.id, entity);
  }

  // Remove an entity from the game
  public removeEntity(id: string): void {
    this.entities.delete(id);
  }

  // Create a bullet from the robot
  public createBullet(x: number, y: number): void {
    this.robot?.shoot();
  }

  // Main game loop
  private gameLoop(timestamp: number): void {
    if (!this.isRunning) return;

    // Calculate delta time
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Process input
    this.handleInput(deltaTime);

    // Spawn entities
    this.handleSpawning(deltaTime);

    // Update all entities
    this.update(deltaTime);

    // Check collisions
    this.checkCollisions();

    // Render all entities
    this.render();

    // Request next frame
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  // Process user input
  private handleInput(deltaTime: number): void {
    if (!this.robot) return;

    const { up, down, left, right, space } = this.inputHandler.getKeys();

    // Movement
    let dx = 0;
    let dy = 0;

    if (up) dy -= this.robot.speed * deltaTime;
    if (down) dy += this.robot.speed * deltaTime;
    if (left) dx -= this.robot.speed * deltaTime;
    if (right) dx += this.robot.speed * deltaTime;

    this.robot.move(dx, dy);

    // Keep robot within canvas bounds
    if (this.robot.position.x < 0) this.robot.position.x = 0;
    if (this.robot.position.x + this.robot.size.width > this.canvas.width) {
      this.robot.position.x = this.canvas.width - this.robot.size.width;
    }
    if (this.robot.position.y < 0) this.robot.position.y = 0;
    if (this.robot.position.y + this.robot.size.height > this.canvas.height) {
      this.robot.position.y = this.canvas.height - this.robot.size.height;
    }

    // Shooting
    if (space && !this.inputHandler.getLastSpaceState()) {
      this.robot.shoot();
    }
    this.inputHandler.setLastSpaceState(space);
  }

  // Spawn clouds and obstacles based on timers
  private handleSpawning(deltaTime: number): void {
    // Spawn clouds
    this.spawnTimers.clouds += deltaTime;
    const cloudSpawnRate = 2000 - (this.level * 100); // Decrease spawn time as level increases
    if (this.spawnTimers.clouds >= cloudSpawnRate) {
      this.spawnCloud();
      this.spawnTimers.clouds = 0;
    }

    // Spawn obstacles
    this.spawnTimers.obstacles += deltaTime;
    const obstacleSpawnRate = 3000 - (this.level * 150); // Decrease spawn time as level increases
    if (this.spawnTimers.obstacles >= obstacleSpawnRate) {
      this.spawnObstacle();
      this.spawnTimers.obstacles = 0;
    }
  }

  // Spawn a cloud entity
  private spawnCloud(): void {
    const x = Math.random() * (this.canvas.width - 60);
    const cloud = new Cloud(
      { x, y: -60 },
      { width: 60, height: 40 },
      this.level
    );
    this.entities.set(cloud.id, cloud);
  }

  // Spawn an obstacle entity
  private spawnObstacle(): void {
    const x = Math.random() * (this.canvas.width - 40);
    const obstacle = new Obstacle(
      { x, y: -40 },
      { width: 30, height: 40 },
      this.level
    );
    this.entities.set(obstacle.id, obstacle);
  }

  // Update all game entities
  private update(deltaTime: number): void {
    // Update all entities
    this.entities.forEach(entity => {
      entity.update(deltaTime);
      
      // Remove entities that are out of bounds
      if (
        entity.position.y > this.canvas.height + 50 || 
        entity.position.y < -100 ||
        !entity.isActive
      ) {
        if (entity.type !== EntityType.ROBOT) {
          this.entities.delete(entity.id);
        }
      }
    });
  }

  // Check for collisions between entities
  private checkCollisions(): void {
    if (!this.robot || !this.robot.isActive) return;
    
    this.entities.forEach(entityA => {
      if (entityA.id === this.robot?.id || !entityA.isActive) return;
      
      // Check robot collision with obstacles and coins
      if (entityA.type === EntityType.OBSTACLE || entityA.type === EntityType.COIN) {
        if (checkCollision(this.robot!, entityA)) {
          if (entityA.type === EntityType.OBSTACLE) {
            // Game over on obstacle collision
            this.gameOver();
          } else if (entityA.type === EntityType.COIN) {
            // Collect coin
            entityA.isActive = false;
            this.updateScore(this.score + POINTS_PER_COIN);
            
            // Level up check
            if (this.score >= this.level * POINTS_TO_LEVEL_UP) {
              this.updateLevel(this.level + 1);
              
              // Victory check
              if (this.level > MAX_LEVEL) {
                this.victory();
              }
            }
          }
        }
      }
      
      // Check bullet collisions with clouds
      if (entityA.type === EntityType.CLOUD) {
        this.entities.forEach(entityB => {
          if (entityB.type === EntityType.BULLET && entityB.isActive && entityA.isActive) {
            if (checkCollision(entityA, entityB)) {
              // Cloud hit by bullet
              entityA.isActive = false;
              entityB.isActive = false;
              
              // Create coin at cloud position
              const coin = (entityA as Cloud).createCoin();
              this.addEntity(coin);
            }
          }
        });
      }
    });
  }

  // Render all entities to the canvas
  private render(): void {
    // Draw background (if needed)
    // this.ctx.fillStyle = '#1e3a8a';
    // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render all entities
    this.entities.forEach(entity => {
      if (entity.isActive) {
        entity.render(this.ctx);
      }
    });
  }

  // Update the score and notify callbacks
  private updateScore(newScore: number): void {
    this.score = newScore;
    this.callbacks.onScoreUpdate(this.score);
  }

  // Update the level and notify callbacks
  private updateLevel(newLevel: number): void {
    this.level = newLevel;
    this.callbacks.onLevelUpdate(this.level);
  }

  // Handle game over state
  private gameOver(): void {
    this.stop();
    this.callbacks.onGameOver(this.score);
  }

  // Handle victory state
  private victory(): void {
    this.stop();
    this.callbacks.onVictory(this.score);
  }

  // Start the game loop
  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  // Stop the game loop
  public stop(): void {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
  }

  // Handle canvas resize
  public resize(width: number, height: number): void {
    if (this.robot) {
      // Adjust robot position on resize to keep it in bounds
      if (this.robot.position.x + this.robot.size.width > width) {
        this.robot.position.x = width - this.robot.size.width;
      }
      if (this.robot.position.y + this.robot.size.height > height) {
        this.robot.position.y = height - this.robot.size.height;
      }
    }
  }
}