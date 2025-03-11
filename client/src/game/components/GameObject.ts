// File: client/src/game/components/GameObject.ts
import * as THREE from "three";
import { Transform } from "./Transform";

export abstract class GameObject {
  protected mesh: THREE.Mesh | null = null; // Initialize as null
  protected transform: Transform;

  constructor() {
    this.transform = new Transform();
  }

  protected abstract createMesh(): Promise<THREE.Mesh>;

  public async initialize(): Promise<void> {
    this.mesh = await this.createMesh();
    this.transform.update(this.mesh); // Initial update after mesh is created
  }

  public update(deltaTime: number): void {
    if (this.mesh) {
      this.transform.update(this.mesh);
    }
  }

  public getMesh(): THREE.Mesh | null {
    return this.mesh;
  }

  public getTransform(): Transform {
    return this.transform;
  }
}
