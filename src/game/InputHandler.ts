export class InputHandler {
  private keys: { [key: string]: boolean } = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false
  };
  
  private lastSpaceState: boolean = false;

  constructor() {
    // Set up event listeners
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.keys.up = true;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.keys.down = true;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.keys.left = true;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.keys.right = true;
        break;
      case ' ':
        this.keys.space = true;
        break;
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.keys.up = false;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.keys.down = false;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.keys.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.keys.right = false;
        break;
      case ' ':
        this.keys.space = false;
        break;
    }
  }

  // Get all key states
  public getKeys(): { up: boolean; down: boolean; left: boolean; right: boolean; space: boolean } {
    return this.keys;
  }

  // Get the last state of the space key
  public getLastSpaceState(): boolean {
    return this.lastSpaceState;
  }

  // Set the last state of the space key
  public setLastSpaceState(state: boolean): void {
    this.lastSpaceState = state;
  }

  // Clean up event listeners
  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}