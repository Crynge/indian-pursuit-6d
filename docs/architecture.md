# Architecture

## Goal

Build a fast, cinematic, Indian-road-inspired pursuit racer that stays playable in the browser while remaining structured enough to port into Unity later.

## Runtime architecture

### `src/main.js`

- constructs the HUD shell
- mounts the game canvas
- initializes `RacerGame`

### `src/game/core/RacerGame.js`

Owns:

- scene creation
- camera
- renderer
- lights
- lifecycle
- loop timing
- player state
- collision handling
- camera behavior

### `src/game/core/VehicleFactory.js`

Generates:

- player vehicle
- interceptor SUV
- mixed traffic archetypes

The meshes are built from lightweight primitives so the prototype remains responsive.

### `src/game/systems/TrafficSystem.js`

Handles:

- pooled traffic objects
- lane reseeding
- relative motion against player speed
- collision body export

### `src/game/systems/PursuitSystem.js`

Handles:

- police pressure curve
- interceptor target gap
- capture meter
- catch-up dynamics after player slowdown

### `src/game/systems/EnvironmentSystem.js`

Handles:

- endless road segment recycling
- stylized Indian-road signboards
- barrier geometry
- streetlights
- skyline silhouettes and palms

### `src/game/core/HudController.js`

Handles:

- score and speed presentation
- intro/retry overlay
- pursuit and audit text
- boost and heat meters

### `src/game/core/AudioController.js`

Provides lightweight synthesized:

- engine tone
- pursuit siren layer

It avoids asset-heavy audio pipelines while still making the game feel active.

## Performance strategy

- low-poly primitive vehicles instead of dense meshes
- pooled traffic instead of constant allocation
- repeated road segments instead of infinite geometry growth
- one main render pass
- capped pixel ratio
- no physics engine dependency

## Porting strategy to Unity

The Unity blueprint mirrors the browser systems:

- `PlayerCarController`
- `TrafficCoordinator`
- `PursuitDirector`
- `RoadStreamSystem`
- `RaceSessionState`

This keeps the port path clean if the playable web prototype is later elevated into a Unity production branch.

