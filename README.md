# NH6 Pursuit: Indian Road Heat

A cinematic road-racing and police-pursuit prototype inspired by Indian expressways, mixed traffic, monsoon dusk lighting, and high-pressure highway weaving.

This repo ships two layers:

- a **playable browser game** built with **JavaScript**, **Three.js**, **CSS**, **Tailwind**, and Vite
- a **Unity/C# blueprint** that maps the same gameplay systems into an engine-ready folder structure

## What it is

`NH6 Pursuit` is a 6D-inspired chase experience focused on:

- dense Indian-road traffic feel
- interceptor pressure from behind
- stylized Indian highway signage and roadside atmosphere
- low-latency rendering and stable browser play
- a modular codebase that can be ported into Unity systems cleanly

## What it is not

- It is **not** a verified Unity build, because Unity is not installed in this environment.
- It is **not** a licensed real-car simulator. The vehicles are original, Indian-road-inspired archetypes such as hatchbacks, sedans, buses, lorries, and an interceptor SUV.
- It is **not** a true hardware “6D motion rig” experience. The repo aims for a 6D-inspired sense of motion through camera sway, boost vignette, pursuit pressure, and environmental speed cues.

## Stack

### Playable build

- Vite
- JavaScript
- Three.js
- Tailwind CSS
- PostCSS
- Vitest

### Blueprint layer

- Unity-oriented foldering
- C# gameplay architecture
- system and data contracts for later Unity integration

## Gameplay

- steer through mixed traffic
- maintain speed so the interceptor does not close the gap
- burn boost strategically
- recover after collisions before police pressure spikes

## Controls

- `A / D` or arrow keys: steer
- `W` or up arrow: accelerate
- `S` or down arrow: brake
- `Shift` or `Space`: boost

## Run locally

```bash
npm install
npm run dev
```

## Audit locally

```bash
npm run build
npm run test
npm run audit
```

## Repo structure

```text
src/
  game/
    core/           renderer, HUD, input, audio, helpers, vehicle factory
    data/           vehicle archetypes
    systems/        environment, traffic, pursuit
tests/              logic smoke tests
docs/               architecture and final audit notes
unity-blueprint/    C# and Unity-oriented system mapping
```

## Key files

- [src/main.js](./src/main.js)
- [src/game/core/RacerGame.js](./src/game/core/RacerGame.js)
- [src/game/systems/TrafficSystem.js](./src/game/systems/TrafficSystem.js)
- [src/game/systems/PursuitSystem.js](./src/game/systems/PursuitSystem.js)
- [docs/architecture.md](./docs/architecture.md)
- [docs/final-audit.md](./docs/final-audit.md)
- [unity-blueprint/README.md](./unity-blueprint/README.md)

## Notes on realism

Within this environment, the strongest truthful deliverable is a high-fidelity pursuit prototype with performance-conscious rendering and a clean architecture. The repo leans into atmosphere, chase tension, and Indian-road identity rather than making false claims about AAA photorealism or a Unity build that was never verified.

