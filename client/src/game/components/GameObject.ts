import * as THREE from 'three';
import { Transform } from './Transform';

export abstract class GameObject {
  protected mesh: THREE.Mesh;
  protected transform: Transform;

  constructor() {
    this.transform = new Transform();
    this.mesh = this.createMesh();
  }

  protected abstract createMesh(): THREE.Mesh;

  public update(deltaTime: number): void {
    this.transform.update(this.mesh);
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }

  public getTransform(): Transform {
    return this.transform;
  }
}
