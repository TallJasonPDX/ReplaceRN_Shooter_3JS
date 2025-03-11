// File: client/src/game/core/Scene.ts
import * as THREE from "three";
import { GameObject } from "../components/GameObject";
import { AssetLoader } from "../utils/AssetLoader";

export class Scene {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private gameObjects: GameObject[];
  private background: THREE.Mesh | null = null; // Initialize as null

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = this.createOrthographicCamera();
    this.gameObjects = [];
  }

  private createOrthographicCamera(): THREE.OrthographicCamera {
    const width = 1320;
    const height = 2868;
    const aspectRatio = width / height;
    const viewSize = height / 200;
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspectRatio,
      viewSize * aspectRatio,
      viewSize,
      -viewSize,
      0.1,
      1000,
    );
    camera.position.z = 10;
    camera.lookAt(0, 0, 0);
    return camera;
  }

  private async createBackground(): Promise<THREE.Mesh> {
    const texture = await AssetLoader.loadTexture("/src/assets/background.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    const geometry = new THREE.PlaneGeometry(1320 / 100, 2868 / 100);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const background = new THREE.Mesh(geometry, material);
    background.position.z = -10; // Set background behind all objects
    return background;
  }

  public async initialize(): Promise<void> {
    this.background = await this.createBackground();
    if (this.background) {
      this.scene.add(this.background);
    }
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.OrthographicCamera {
    return this.camera;
  }

  public async addGameObject(gameObject: GameObject): Promise<void> {
    await gameObject.initialize();
    const mesh = gameObject.getMesh();
    if (mesh) {
      this.gameObjects.push(gameObject);
      this.scene.add(mesh);
    } else {
      console.warn("Failed to add game object: mesh is null", gameObject);
    }
  }

  public removeGameObject(gameObject: GameObject): void {
    const index = this.gameObjects.indexOf(gameObject);
    if (index !== -1) {
      this.gameObjects.splice(index, 1);
      const mesh = gameObject.getMesh();
      if (mesh) {
        this.scene.remove(mesh);
      }
    }
  }

  public getGameObjects(): GameObject[] {
    return this.gameObjects;
  }

  public update(deltaTime: number): void {
    this.gameObjects.forEach((obj) => obj.update(deltaTime));
  }

  public resize(width: number, height: number): void {
    const aspectRatio = width / height;
    const viewSize = 2868 / 200;
    this.camera.left = -viewSize * aspectRatio;
    this.camera.right = viewSize * aspectRatio;
    this.camera.top = viewSize;
    this.camera.bottom = -viewSize;
    this.camera.updateProjectionMatrix();
  }
}
