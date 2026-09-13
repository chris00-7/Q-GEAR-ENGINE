/**
 * MAIN.JS
 * Q-Gear Engine Renderer and Controller (Three.js Version)
 * 
 * Integrates Three.js scene with engine logic and controls.
 */

class QGearRenderer {
  constructor() {
    this.viewport = document.getElementById('viewport');
    this.threeScene = new ThreeJSScene(this.viewport);
    
    // Initialize mock engine state
    this.engineState = {
      pressure: {
        current: 0,
        max: 100,
        level: 0,
        isDangerous: false,
        isCritical: false,
      },
      chamber: {
        rotation: 0,
        radius: 300,
      },
      vortex: {
        rotation: 0,
        radius: 150,
      },
      particles: [],
      effects: [],
    };
    
    // Performance tracking
    this.fps = 0;
    this.frameCount = 0;
    this.lastFrameTime = Date.now();
    this.deltaTime = 0;
    
    this.setupControls();
    this.startAnimation();
  }
  
  /**
   * Setup control buttons and interactions
   */
  setupControls() {
    document.getElementById('btn-stance-1').addEventListener('click', () => {
      console.log('Stance 1 activated');
      this.setPressureLevel(this.engineState.pressure.level + 0.25);
    });
    
    document.getElementById('btn-stance-2').addEventListener('click', () => {
      console.log('Stance 2 activated');
      this.setPressureLevel(this.engineState.pressure.level + 0.5);
    });
    
    document.getElementById('btn-burst').addEventListener('click', () => {
      console.log('Burst activated');
      this.setPressureLevel(0);
    });
    
    document.getElementById('btn-vortex-pulse').addEventListener('click', () => {
      console.log('Vortex pulse triggered');
      this.threeScene.pulseVortex();
    });
  }
  
  /**
   * Update engine simulation
   */
  updateEngine(deltaTime) {
    const frameScale = deltaTime > 0 ? deltaTime * 60 : 1;
    const pressureGain = 0.3 * frameScale;

    // Simulate pressure accumulation
    this.engineState.pressure.current = Math.min(
      this.engineState.pressure.current + pressureGain,
      this.engineState.pressure.max
    );
    this.engineState.pressure.level = this.engineState.pressure.current / this.engineState.pressure.max;
    this.engineState.pressure.isDangerous = this.engineState.pressure.level >= 0.8;
    this.engineState.pressure.isCritical = this.engineState.pressure.level >= 0.95;
  }
  
  /**
   * Update UI panels
   */
  updateUI() {
    const pressurePercent = Math.round(this.engineState.pressure.level * 100);
    
    // Update pressure gauge
    const pressureBar = document.getElementById('pressure-bar');
    pressureBar.style.width = pressurePercent + '%';
    
    // Update stats
    document.getElementById('fps').textContent = this.fps;
    document.getElementById('particle-count').textContent = this.threeScene.getParticleCount();
    document.getElementById('pressure-value').textContent = pressurePercent;
    
    // Color coding for danger levels
    if (this.engineState.pressure.isCritical) {
      pressureBar.style.background = 'linear-gradient(90deg, #FF0000, #FF3300)';
    } else if (this.engineState.pressure.isDangerous) {
      pressureBar.style.background = 'linear-gradient(90deg, #FF6600, #FF3300)';
    } else {
      pressureBar.style.background = 'linear-gradient(90deg, #8B00FF, #00FFFF)';
    }
  }
  
  /**
   * Main update loop
   */
  update(deltaTime) {
    this.updateEngine(deltaTime);
    this.threeScene.update(this.engineState);
  }
  
  /**
   * Main render loop
   */
  render() {
    // Update frame timing
    const now = Date.now();
    this.deltaTime = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;
    
    // Update engine and scene
    this.update(this.deltaTime);
    this.updateUI();
    this.threeScene.render();
    
    // Update FPS counter
    this.frameCount++;
    if (now - this.fpsTime > 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsTime = now;
    }
  }
  
  /**
   * Start animation loop
   */
  startAnimation() {
    this.fpsTime = Date.now();
    const animate = () => {
      this.render();
      requestAnimationFrame(animate);
    };
    animate();
  }

  setPressureLevel(level) {
    const clampedLevel = Math.min(Math.max(level, 0), 1);
    this.engineState.pressure.level = clampedLevel;
    this.engineState.pressure.current = clampedLevel * this.engineState.pressure.max;
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  new QGearRenderer();
});