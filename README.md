# RoboNurse Mayhem - Game Development Environment

A 2D shooter game development environment using Three.js with modular architecture.

## Project Structure

```
/client
  /src
    /game
      /components      # Reusable game entities and components
      /core           # Core game engine functionality
      /systems        # Game systems (input, physics, rendering)
      /utils          # Utility functions and helpers
    /pages           # React pages
    /assets          # Game assets (sprites, sounds, etc.)
```

## Architecture

The game is built with a component-based architecture:

- **Game**: Main game loop and system coordination
- **Scene**: Manages the Three.js scene and camera
- **Systems**:
  - InputSystem: Handles keyboard and touch input
  - RenderSystem: Manages Three.js rendering
  - PhysicsSystem: Handles collision detection and physics
- **Components**:
  - GameObject: Base class for game entities
  - Transform: Handles position, rotation, and scale

## Development

### Prerequisites
- Node.js
- NPM

### Running the Project
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open browser to the provided URL

### Adding New Game Entities

1. Create a new class extending GameObject:
```typescript
import { GameObject } from './GameObject';
import * as THREE from 'three';

export class Player extends GameObject {
  protected createMesh(): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    return new THREE.Mesh(geometry, material);
  }

  public update(deltaTime: number): void {
    super.update(deltaTime);
    // Add custom update logic here
  }
}
```

2. Add it to the scene:
```typescript
const player = new Player();
scene.addGameObject(player);
```

### Event System

The game uses an event-driven architecture for communication between components:

```typescript
// Subscribe to events
events.on('COLLISION', (data) => {
  // Handle collision
});

// Emit events
events.emit('PLAYER_SHOOT', { position, direction });
```

## WebView Integration

The game is designed to support WebView messaging for React Native integration:
- Event system is ready for external message handling
- Rendering system uses a responsive canvas
- Input system supports both keyboard and touch events