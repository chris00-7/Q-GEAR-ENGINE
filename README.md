# Q-GEAR-ENGINE

Q-GEAR-ENGINE is an interactive 3D quantum chamber visualization built with Three.js. It includes a browser-based renderer and a separate Node.js simulation engine.

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

## Prerequisites

- Node.js 18 or later and npm
- A modern browser with WebGL support for the 3D visualization
- An internet connection to load Three.js from its CDN

## Installation

```bash
npm install
```

There are no environment variables to configure.

## Run

To run the interactive browser app:

```bash
npm run dev
```

Open <http://localhost:8080/web/index.html>.

To run the headless Node.js simulation:

```bash
npm start
```

Stop the simulation with Ctrl+C.

## Development and tests

The browser app is static and does not require a build step. Run its JavaScript tests with:

```bash
npm test
```

## Troubleshooting

- **Port 8080 is already in use:** stop the other process using that port, then rerun `npm run dev`.
- **The 3D scene does not load:** confirm your browser supports WebGL and that the Three.js CDN is reachable.
- **`npm` or `node` is not found:** install Node.js 18 or later, then open a new terminal and retry.
- **Dependency installation fails:** check your internet connection and rerun `npm install`.

## Project Layout

- `web/` — browser app entrypoint, Three.js scene, styling, and controls
- `engine/` — simulation modules used by the Node.js runtime
- `test/` — Node.js engine tests
- `package.json` — scripts and dependency configuration
- `IMPLEMENTATION_STATUS.md` — architecture and subsystem details
