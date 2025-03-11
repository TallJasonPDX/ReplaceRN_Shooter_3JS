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
      this.game.scene.addGameObject(bullet);
    });
    this.events.on("BULLET_OUT_OF_BOUNDS", (bullet: Bullet) => {
      this.game.scene.removeGameObject(bullet);
    });
    this.events.on("NURSE_REACHED_BOTTOM", (nurse: RobotNurse) => {
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
          this.game.scene.removeGameObject(bullet);
          this.game.scene.removeGameObject(nurse);
          this.game.score += 10;
          break;
        }
      }
    }
  }

  private checkCollision(obj1: GameObject, obj2: GameObject): boolean {
    const pos1 = obj1.getTransform().position;
    const pos2 = obj2.getTransform().position;
    const size1 = obj1.getMesh().geometry.parameters;
    const size2 = obj2.getMesh().geometry.parameters;

    return (
      pos1.x < pos2.x + size2.width &&
      pos1.x + size1.width > pos2.x &&
      pos1.y < pos2.y + size2.height &&
      pos1.y + size1.height > pos2.y
    );
  }
}
