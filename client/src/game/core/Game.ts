import * as THREE from 'three';
import { Scene } from './Scene';
import { InputSystem } from '../systems/InputSystem';
import { RenderSystem } from '../systems/RenderSystem';
import { PhysicsSystem } from '../systems/PhysicsSystem';
import { EventEmitter } from '../utils/EventEmitter';

export class Game {
  private scene: Scene;
  private inputSystem: InputSystem;
  private renderSystem: RenderSystem;
  private physicsSystem: PhysicsSystem;
  private events: EventEmitter;
  private lastTime: number = 0;
  private isRunning: boolean = false;

  constructor(container: HTMLElement) {
    this.events = new EventEmitter();
    this.scene = new Scene();
    this.inputSystem = new InputSystem(this.events);
    this.renderSystem = new RenderSystem(container, this.scene);
    this.physicsSystem = new PhysicsSystem(this.events);
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  public stop(): void {
    this.isRunning = false;
  }

  private gameLoop(): void {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(() => this.gameLoop());
  }

  private update(deltaTime: number): void {
    this.inputSystem.update();
    this.physicsSystem.update(deltaTime);
    this.scene.update(deltaTime);
  }

  private render(): void {
    this.renderSystem.render();
  }

  public resize(width: number, height: number): void {
    this.renderSystem.resize(width, height);
  }

  public cleanup(): void {
    this.stop();
    this.renderSystem.cleanup();
    this.inputSystem.cleanup();
    this.events.removeAllListeners();
  }
}
