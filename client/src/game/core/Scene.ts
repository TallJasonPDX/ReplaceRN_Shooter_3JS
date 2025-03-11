import * as THREE from 'three';
import { GameObject } from '../components/GameObject';

export class Scene {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private gameObjects: GameObject[];

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = this.createOrthographicCamera();
    this.gameObjects = [];
  }

  private createOrthographicCamera(): THREE.OrthographicCamera {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const viewSize = 10;
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspectRatio,
      viewSize * aspectRatio,
      viewSize,
      -viewSize,
      0.1,
      1000
    );
    camera.position.z = 10;
    return camera;
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.OrthographicCamera {
    return this.camera;
  }

  public addGameObject(gameObject: GameObject): void {
    this.gameObjects.push(gameObject);
    this.scene.add(gameObject.getMesh());
  }

  public removeGameObject(gameObject: GameObject): void {
    const index = this.gameObjects.indexOf(gameObject);
    if (index !== -1) {
      this.gameObjects.splice(index, 1);
      this.scene.remove(gameObject.getMesh());
    }
  }

  public update(deltaTime: number): void {
    this.gameObjects.forEach(obj => obj.update(deltaTime));
  }

  public resize(width: number, height: number): void {
    const aspectRatio = width / height;
    const viewSize = 10;
    
    this.camera.left = -viewSize * aspectRatio;
    this.camera.right = viewSize * aspectRatio;
    this.camera.top = viewSize;
    this.camera.bottom = -viewSize;
    
    this.camera.updateProjectionMatrix();
  }
}
