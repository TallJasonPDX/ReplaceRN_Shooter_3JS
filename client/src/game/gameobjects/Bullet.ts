// File: client/src/game/gameobjects/Bullet.ts
import * as THREE from "three";
import { GameObject } from "../components/GameObject";
import { AssetLoader } from "../utils/AssetLoader";

export class Bullet extends GameObject {
  private speed: number;

  constructor(position: THREE.Vector2, pullBack: number) {
    super();
    this.transform.position.copy(position);
    this.speed = 5 + pullBack * 5;
  }

  protected async createMesh(): Promise<THREE.Mesh> {
    const texture = await AssetLoader.loadTexture("/src/assets/bullet.png");
    const geometry = new THREE.PlaneGeometry(0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    return new THREE.Mesh(geometry, material);
  }

  public async initialize(): Promise<void> {
    await super.initialize();
  }

  public update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.mesh) {
      this.transform.position.y += this.speed * deltaTime;

      if (this.transform.position.y > 14) {
        this.events?.emit("BULLET_OUT_OF_BOUNDS", this);
      }
    }
  }
}
