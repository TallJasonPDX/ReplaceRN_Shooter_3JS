// File: client/src/game/gameobjects/Syringe.ts
import * as THREE from "three";
import { GameObject } from "../components/GameObject";
import { AssetLoader } from "../utils/AssetLoader";
import { EventEmitter } from "../utils/EventEmitter";
import { Bullet } from "./Bullet";

export class Syringe extends GameObject {
  private events: EventEmitter;
  private canvas: HTMLCanvasElement;
  private isDragging: boolean = false;
  private pullBack: number = 0;
  private maxPullBack: number = 2;
  private startY: number = 0; // Store initial y position on drag start

  constructor(events: EventEmitter, canvas: HTMLCanvasElement) {
    super();
    this.events = events;
    this.canvas = canvas;
    this.transform.position.y = -10; // Bottom of screen
    this.transform.zPosition = 1; // Ensure syringe is in front of nurses (max z = 0)
  }

  protected async createMesh(): Promise<THREE.Mesh> {
    try {
      const texture = await AssetLoader.loadTexture("/src/assets/syringe.png");
      const geometry = new THREE.PlaneGeometry(2, 4);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      return new THREE.Mesh(geometry, material);
    } catch (error) {
      console.warn("Failed to load syringe texture, using fallback material");
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red syringe
      return new THREE.Mesh(geometry, material);
    }
  }

  public async initialize(): Promise<void> {
    await super.initialize();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    try {
      this.events.on("MOVE", ({ x }) => {
        if (!this.isDragging) {
          this.transform.position.x = THREE.MathUtils.clamp(
            this.transform.position.x + x * 0.1,
            -6,
            6,
          );
        }
      });

      window.addEventListener("mousedown", (e) => this.startDrag(e));
      window.addEventListener("mousemove", (e) => this.updateDrag(e));
      window.addEventListener("mouseup", () => this.release());
      window.addEventListener("touchstart", (e) =>
        this.startDrag(e.touches[0]),
      );
      window.addEventListener("touchmove", (e) =>
        this.updateDrag(e.touches[0]),
      );
      window.addEventListener("touchend", () => this.release());
    } catch (error) {
      console.error("Error setting up event listeners in Syringe:", error);
      throw error;
    }
  }

  private startDrag(event: MouseEvent | Touch): void {
    this.isDragging = true;
    console.log("Drag started at:", event.clientX, event.clientY);
    const rect = this.canvas.getBoundingClientRect();
    const y = ((event.clientY - rect.top) / rect.height) * 28 - 14;
    this.startY = y; // Record initial y position
    this.updateDrag(event);
  }

  private updateDrag(event: MouseEvent | Touch): void {
    if (!this.isDragging || !this.mesh) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 12 - 6; // Normalize to game width (-6 to 6)
    const y = ((event.clientY - rect.top) / rect.height) * 28 - 14; // Normalize to game height (-14 to 14)
    this.transform.position.x = THREE.MathUtils.clamp(x, -6, 6);
    const deltaY = y - this.startY; // Positive when dragging down (y increases downward)
    this.pullBack = THREE.MathUtils.clamp(deltaY, 0, this.maxPullBack); // Pull back increases with downward drag
    console.log(
      "Dragging: x=",
      x,
      "y=",
      y,
      "startY=",
      this.startY,
      "deltaY=",
      deltaY,
      "pullBack=",
      this.pullBack,
    );
  }

  private release(): void {
    console.log("Released with pullBack:", this.pullBack);
    if (this.isDragging && this.pullBack > 0 && this.mesh) {
      const bullet = new Bullet(this.transform.position.clone(), this.pullBack);
      this.events.emit("BULLET_FIRED", bullet);
      console.log(
        "Bullet fired at position:",
        this.transform.position.x,
        this.transform.position.y,
      );
    }
    this.isDragging = false;
    this.pullBack = 0;
    this.startY = 0; // Reset startY
  }

  public update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.mesh) {
      this.transform.position.y = -10 + this.pullBack * 0.1; // Visual feedback
    }
  }
}
