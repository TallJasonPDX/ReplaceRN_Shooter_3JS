// File: client/src/game/gameobjects/RobotNurse.ts
import * as THREE from "three";
import { GameObject } from "../components/GameObject";
import { AssetLoader } from "../utils/AssetLoader";

export class RobotNurse extends GameObject {
  private speed: number = 1;

  constructor() {
    super();
    // Map pixel (520, 1040) to world coordinates
    const startY = 5.7; // -3.85
    this.transform.position.set(THREE.MathUtils.randFloat(-2, 2), startY); // Random x, fixed y start
    // Set initial z position based on y
    this.transform.zPosition = this.calculateZPosition(startY);
  }

  protected async createMesh(): Promise<THREE.Mesh> {
    const texture = await AssetLoader.loadTexture("/src/assets/nurse.png");
    const geometry = new THREE.PlaneGeometry(1, 1); // Base size, scale will adjust
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    return new THREE.Mesh(geometry, material);
  }

  public async initialize(): Promise<void> {
    await super.initialize();
  }

  private calculateZPosition(y: number): number {
    const startY = 5.7; // Top of hallway
    const endY = -10; // Bottom of hallway
    const totalDistance = startY - endY;
    const currentDistance = startY - y;
    const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));
    // Map progress to z: top (0) → -1, bottom (1) → 0
    return THREE.MathUtils.lerp(-1, 0, progress);
  }

  public update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.mesh) {
      const startY = 4; // Mapped from 1040px
      const endY = -10; // Mapped from 2400px
      const totalDistance = endY - startY;
      const currentDistance = this.transform.position.y - startY;
      const progress = Math.max(
        0,
        Math.min(1, currentDistance / totalDistance),
      );

      // Scale from 280px (2.73) to 1200px (11.71)
      const startScale = 4;
      const endScale = 10;
      const scale = THREE.MathUtils.lerp(startScale, endScale, progress);

      this.transform.scale.setScalar(scale);
      this.transform.position.y += this.speed * deltaTime * -1; // Move downward
      // Update z position based on y
      this.transform.zPosition = this.calculateZPosition(
        this.transform.position.y,
      );

      if (this.transform.position.y > endY) {
        this.events?.emit("NURSE_REACHED_BOTTOM", this);
      }
    }
  }
}
