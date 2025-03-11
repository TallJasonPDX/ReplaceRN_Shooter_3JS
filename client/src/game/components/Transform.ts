import * as THREE from 'three';

export class Transform {
  public position: THREE.Vector2;
  public rotation: number;
  public scale: THREE.Vector2;

  constructor() {
    this.position = new THREE.Vector2();
    this.rotation = 0;
    this.scale = new THREE.Vector2(1, 1);
  }

  public update(mesh: THREE.Mesh): void {
    mesh.position.set(this.position.x, this.position.y, 0);
    mesh.rotation.z = this.rotation;
    mesh.scale.set(this.scale.x, this.scale.y, 1);
  }
}
