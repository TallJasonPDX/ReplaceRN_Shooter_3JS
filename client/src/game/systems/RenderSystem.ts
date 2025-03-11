import * as THREE from 'three';
import { Scene } from '../core/Scene';

export class RenderSystem {
  private renderer: THREE.WebGLRenderer;
  private scene: Scene;

  constructor(container: HTMLElement, scene: Scene) {
    this.scene = scene;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
  }

  public render(): void {
    this.renderer.render(this.scene.getScene(), this.scene.getCamera());
  }

  public resize(width: number, height: number): void {
    this.renderer.setSize(width, height);
    this.scene.resize(width, height);
  }

  public cleanup(): void {
    this.renderer.dispose();
  }
}
