// File: client/src/game/gameobjects/Obstacle.ts
import * as THREE from "three";
import { GameObject } from "../components/GameObject";
import { AssetLoader } from "../utils/AssetLoader";

export class Obstacle extends GameObject {
  constructor(position: THREE.Vector2) {
    super();
    this.transform.position.copy(position);
  }

  protected async createMesh(): Promise<THREE.Mesh> {
    const texture = await AssetLoader.loadTexture("/src/assets/obstacle.png");
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    return new THREE.Mesh(geometry, material);
  }

  public update(deltaTime: number): void {
    super.update(deltaTime);
  }
}
