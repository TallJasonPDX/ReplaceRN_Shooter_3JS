import * as THREE from 'three';
import { GameObject } from '../components/GameObject';

export class Scene {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private gameObjects: GameObject[];
  private testObject: THREE.Mesh; // Add a test object to verify rendering

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = this.createOrthographicCamera();
    this.gameObjects = [];

    // Add a test square to verify rendering
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.testObject = new THREE.Mesh(geometry, material);
    this.scene.add(this.testObject);
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
    camera.lookAt(0, 0, 0);
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
    // Rotate test object to make it visibly active
    if (this.testObject) {
      this.testObject.rotation.z += deltaTime;
    }

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