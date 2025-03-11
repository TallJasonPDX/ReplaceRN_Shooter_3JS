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

  constructor(events: EventEmitter, canvas: HTMLCanvasElement) {
    super();
    this.events = events;
    this.canvas = canvas;
    this.transform.position.y = -13; // Bottom of screen
    this.setupEventListeners();
  }

  protected async createMesh(): Promise<THREE.Mesh> {
    const texture = await AssetLoader.loadTexture("/src/assets/syringe.png");
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    return new THREE.Mesh(geometry, material);
  }

  public async initialize(): Promise<void> {
    await super.initialize();
    this.setupEventListeners(); // Move this here if it depends on mesh
  }

  private setupEventListeners(): void {
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
    window.addEventListener("touchstart", (e) => this.startDrag(e.touches[0]));
    window.addEventListener("touchmove", (e) => this.updateDrag(e.touches[0]));
    window.addEventListener("touchend", () => this.release());
  }

  private startDrag(event: MouseEvent | Touch): void {
    this.isDragging = true;
    this.updateDrag(event);
  }

  private updateDrag(event: MouseEvent | Touch): void {
    if (!this.isDragging || !this.mesh) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 12 - 6;
    const y = ((event.clientY - rect.top) / rect.height) * 28 - 14;
    this.transform.position.x = THREE.MathUtils.clamp(x, -6, 6);
    this.pullBack = THREE.MathUtils.clamp(-13 - y, 0, this.maxPullBack);
  }

  private release(): void {
    if (this.isDragging && this.pullBack > 0 && this.mesh) {
      const bullet = new Bullet(this.transform.position.clone(), this.pullBack);
      this.events.emit("BULLET_FIRED", bullet);
    }
    this.isDragging = false;
    this.pullBack = 0;
  }

  public update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.mesh) {
      this.transform.position.y = -13 + this.pullBack * 0.1; // Visual feedback
    }
  }
}
