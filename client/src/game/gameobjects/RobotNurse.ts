// File: client/src/game/gameobjects/RobotNurse.ts
import * as THREE from "three";
import { GameObject } from "../components/GameObject";
import { AssetLoader } from "../utils/AssetLoader";

export class RobotNurse extends GameObject {
  private speed: number = 2;

  constructor() {
    super();
    this.transform.position.set(THREE.MathUtils.randFloat(-6, 6), 13);
  }

  protected async createMesh(): Promise<THREE.Mesh> {
    const texture = await AssetLoader.loadTexture("/src/assets/nurse.png");
    const geometry = new THREE.PlaneGeometry(1, 1);
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
      this.transform.position.y -= this.speed * deltaTime;
      const scale = THREE.MathUtils.lerp(
        0.8,
        1.2,
        (13 - this.transform.position.y) / 26,
      );
      this.transform.scale.setScalar(scale);

      if (this.transform.position.y < -13) {
        this.events?.emit("NURSE_REACHED_BOTTOM", this);
      }
    }
  }
}
