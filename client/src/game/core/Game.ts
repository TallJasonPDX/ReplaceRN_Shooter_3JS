// File: client/src/game/core/Game.ts
import * as THREE from "three";
import { Scene } from "./Scene";
import { InputSystem } from "../systems/InputSystem";
import { RenderSystem } from "../systems/RenderSystem";
import { PhysicsSystem } from "../systems/PhysicsSystem";
import { EventEmitter } from "../utils/EventEmitter";
import { Syringe } from "../gameobjects/Syringe";
import { RobotNurse } from "../gameobjects/RobotNurse";

export class Game {
  private scene: Scene;
  private inputSystem: InputSystem;
  private renderSystem: RenderSystem;
  private physicsSystem: PhysicsSystem;
  private events: EventEmitter;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private player: Syringe;
  private spawnTimer: number = 0;
  private spawnInterval: number = 2;
  public score: number = 0;
  public gameOver: boolean = false;

  constructor(container: HTMLElement) {
    this.events = new EventEmitter();
    this.scene = new Scene();
    this.inputSystem = new InputSystem(this.events);
    this.renderSystem = new RenderSystem(container, this.scene);
    this.physicsSystem = new PhysicsSystem(this.events, this);
    this.player = new Syringe(this.events, this.renderSystem.getCanvas());
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;
    try {
      console.log("Initializing scene...");
      await this.scene.initialize(); // Initialize scene background
      console.log("Scene initialized, adding player...");
      await this.scene.addGameObject(this.player); // Initialize player
      console.log("Player added, starting game loop...");
      this.isRunning = true;
      this.lastTime = performance.now();
      this.gameLoop();
    } catch (error) {
      console.error("Failed to start game:", error);
      throw error; // Re-throw to be caught in GamePage.tsx
    }
  }

  public stop(): void {
    this.isRunning = false;
  }

  public async reset(): Promise<void> {
    this.score = 0;
    this.gameOver = false;
    this.scene.getGameObjects().forEach((obj) => {
      if (obj !== this.player) this.scene.removeGameObject(obj);
    });
    await this.start();
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
    if (this.gameOver) return;

    this.inputSystem.update();
    this.physicsSystem.update(deltaTime);
    this.scene.update(deltaTime);

    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnEnemy();
      this.spawnTimer = 0;
    }
  }

  private async spawnEnemy(): Promise<void> {
    const nurse = new RobotNurse();
    await this.scene.addGameObject(nurse);
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
