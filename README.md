# Q-GEAR-ENGINE

Q-GEAR-ENGINE is an interactive 3D quantum chamber visualization built with Three.js.

## Features

- Rotating quantum chamber with pressure-linked speed
- Pulsing vortex core and dynamic lighting
- Operator model with reactive aura
- Particle field with neon blending
- Interactive controls:
  - **STANCE 1**
  - **STANCE 2**
  - **BURST**
  - **VORTEX PULSE**
- Live metrics for FPS, pressure %, and particle count

## Setup

```bash
npm install
npm run dev
```

Open:

`http://localhost:8080/web/index.html`

## Project Layout

- `/web` — browser app entrypoint, Three.js scene, styling, and controls
- `/engine` — simulation modules used by the Node engine runtime
- `package.json` — scripts and dependency configuration
- `IMPLEMENTATION_STATUS.md` — architecture and subsystem details
