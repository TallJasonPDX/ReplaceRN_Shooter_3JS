import * as THREE from 'three';

export class AssetLoader {
  private static textureLoader = new THREE.TextureLoader();

  public static async loadTexture(url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => resolve(texture),
        undefined,
        (error) => reject(error)
      );
    });
  }
}
