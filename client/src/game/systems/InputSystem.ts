import { EventEmitter } from '../utils/EventEmitter';

export enum InputEvent {
  MOVE = 'MOVE',
  SHOOT = 'SHOOT',
}

export class InputSystem {
  private keys: { [key: string]: boolean };
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.keys = {};
    this.events = events;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.keys[event.code] = true;
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys[event.code] = false;
  }

  public update(): void {
    // Handle movement
    const moveX = (this.keys['ArrowRight'] ? 1 : 0) - (this.keys['ArrowLeft'] ? 1 : 0);
    const moveY = (this.keys['ArrowUp'] ? 1 : 0) - (this.keys['ArrowDown'] ? 1 : 0);

    if (moveX !== 0 || moveY !== 0) {
      this.events.emit(InputEvent.MOVE, { x: moveX, y: moveY });
    }

    // Handle shooting
    if (this.keys['Space']) {
      this.events.emit(InputEvent.SHOOT);
    }
  }

  public cleanup(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}
