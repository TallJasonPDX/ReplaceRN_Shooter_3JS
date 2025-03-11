// File: client/src/game/systems/PhysicsSystem.ts
import { EventEmitter } from "../utils/EventEmitter";
import { GameObject } from "../components/GameObject";
import { Bullet } from "../gameobjects/Bullet";
import { RobotNurse } from "../gameobjects/RobotNurse";
import { Game } from "../core/Game";

export class PhysicsSystem {
  private events: EventEmitter;
  private game: Game;

  constructor(events: EventEmitter, game: Game) {
    this.events = events;
    this.game = game;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.events.on("BULLET_FIRED", (bullet: Bullet) => {
      console.log("Received BULLET_FIRED event, adding bullet...");
      this.game.scene.addGameObject(bullet);
    });
    this.events.on("BULLET_OUT_OF_BOUNDS", (bullet: Bullet) => {
      console.log("Removing bullet out of bounds...");
      this.game.scene.removeGameObject(bullet);
    });
    this.events.on("NURSE_REACHED_BOTTOM", (nurse: RobotNurse) => {
      console.log("Nurse reached bottom, game over...");
      this.game.scene.removeGameObject(nurse);
      this.game.gameOver = true;
    });
  }

  public update(deltaTime: number): void {
    const objects = this.game.scene.getGameObjects();
    const bullets = objects.filter((obj) => obj instanceof Bullet) as Bullet[];
    const nurses = objects.filter(
      (obj) => obj instanceof RobotNurse,
    ) as RobotNurse[];

    for (const bullet of bullets) {
      for (const nurse of nurses) {
        if (this.checkCollision(bullet, nurse)) {
          console.log("Collision detected between bullet and nurse!");
          this.game.scene.removeGameObject(bullet);
          this.game.scene.removeGameObject(nurse);
          this.game.score += 10; // Update score on collision
          break;
        }
      }
    }
  }

  private checkCollision(obj1: GameObject, obj2: GameObject): boolean {
    const pos1 = obj1.getTransform().position;
    const pos2 = obj2.getTransform().position;
    const mesh1 = obj1.getMesh();
    const mesh2 = obj2.getMesh();

    if (!mesh1 || !mesh2) return false;

    const size1 = {
      width: mesh1.geometry.parameters.width || 0.5,
      height: mesh1.geometry.parameters.height || 0.5,
    };
    const size2 = {
      width: mesh2.geometry.parameters.width || 1,
      height: mesh2.geometry.parameters.height || 1,
    };

    const scale1 = obj1.getTransform().scale;
    const scale2 = obj2.getTransform().scale;

    const scaledSize1 = {
      width: size1.width * scale1.x,
      height: size1.height * scale1.y,
    };
    const scaledSize2 = {
      width: size2.width * scale2.x,
      height: size2.height * scale2.y,
    };

    return (
      pos1.x < pos2.x + scaledSize2.width / 2 &&
      pos1.x + scaledSize1.width / 2 > pos2.x &&
      pos1.y < pos2.y + scaledSize2.height / 2 &&
      pos1.y + scaledSize1.height / 2 > pos2.y
    );
  }

  public cleanup(): void {
    this.events.removeAllListeners();
  }
}
