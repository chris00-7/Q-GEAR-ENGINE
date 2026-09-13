/**
 * ENHANCED-MAIN.JS
 * Enhanced Q-Gear Engine Controller with Audio and Effects
 * 
 * Integrates audio system and advanced visual effects.
 */

class EnhancedQGearRenderer {
  constructor() {
    this.viewport = document.getElementById('viewport');
    if (!this.viewport || typeof ThreeJSScene === 'undefined' || typeof THREE === 'undefined') {
      console.error('Enhanced Q-GEAR initialization failed: missing viewport or Three.js scene dependencies.');
      return;
    }
    this.threeScene = new ThreeJSScene(this.viewport);
    
    // Initialize audio system
    this.audioSystem = typeof AudioSystem !== 'undefined' ? new AudioSystem() : null;
    
    // Initialize advanced effects
    this.advancedEffects = typeof AdvancedEffects !== 'undefined' 
      ? new AdvancedEffects(this.threeScene.scene, this.threeScene.camera, this.threeScene.renderer)
      : null;
    
    // Engine state
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
    
    // Audio state
    this.audioActive = false;
    
    this.setupControls();
    this.startAnimation();
  }
  
  /**
   * Setup control buttons and interactions
   */
  setupControls() {
    document.getElementById('btn-stance-1')?.addEventListener('click', () => {
      console.log('Stance 1 activated');
      this.engineState.pressure.level = Math.min(this.engineState.pressure.level + 0.25, 1);
      if (this.audioSystem && !this.audioActive) {
        this.audioSystem.startAmbientSound(this.engineState.pressure.level);
        this.audioActive = true;
      }
    });
    
    document.getElementById('btn-stance-2')?.addEventListener('click', () => {
      console.log('Stance 2 activated');
      this.engineState.pressure.level = Math.min(this.engineState.pressure.level + 0.5, 1);
      if (this.audioSystem && !this.audioActive) {
        this.audioSystem.startAmbientSound(this.engineState.pressure.level);
        this.audioActive = true;
      }
    });
    
    document.getElementById('btn-burst')?.addEventListener('click', () => {
      console.log('Burst activated');
      this.engineState.pressure.level = 0;
      this.engineState.pressure.current = 0;
      if (this.audioSystem) {
        this.audioSystem.playBurstSound(0.8);
      }
      if (this.advancedEffects) {
        this.advancedEffects.pulseScreen(0.2);
      }
    });
    
    document.getElementById('btn-vortex-pulse')?.addEventListener('click', () => {
      console.log('Vortex pulse triggered');
      this.threeScene.pulseVortex();
      if (this.audioSystem) {
        this.audioSystem.playPulseSound();
      }
    });
  }
  
  /**
   * Update engine simulation
   */
  updateEngine(deltaTime) {
    // Simulate pressure accumulation
    this.engineState.pressure.current = Math.min(
      this.engineState.pressure.current + 0.3,
      this.engineState.pressure.max
    );
    this.engineState.pressure.level = this.engineState.pressure.current / this.engineState.pressure.max;
    this.engineState.pressure.isDangerous = this.engineState.pressure.level >= 0.8;
    this.engineState.pressure.isCritical = this.engineState.pressure.level >= 0.95;
    
    // Update audio based on pressure
    if (this.audioSystem && this.audioActive) {
      this.audioSystem.updateAmbientFrequency(this.engineState.pressure.level);
    }
  }
  
  /**
   * Update UI panels
   */
  updateUI() {
    const pressurePercent = Math.round(this.engineState.pressure.level * 100);
    
    // Update pressure gauge
    const pressureBar = document.getElementById('pressure-bar');
    if (pressureBar) {
      pressureBar.style.width = pressurePercent + '%';
      
      // Color coding for danger levels
      if (this.engineState.pressure.isCritical) {
        pressureBar.style.background = 'linear-gradient(90deg, #FF0000, #FF3300)';
      } else if (this.engineState.pressure.isDangerous) {
        pressureBar.style.background = 'linear-gradient(90deg, #FF6600, #FF3300)';
      } else {
        pressureBar.style.background = 'linear-gradient(90deg, #8B00FF, #00FFFF)';
      }
    }
    
    // Update stats
    const fpsElement = document.getElementById('fps');
    if (fpsElement) fpsElement.textContent = this.fps;
    
    const particleElement = document.getElementById('particle-count');
    if (particleElement) particleElement.textContent = this.engineState.particles.length;
    
    const pressureElement = document.getElementById('pressure-value');
    if (pressureElement) pressureElement.textContent = pressurePercent;
  }
  
  /**
   * Main update loop
   */
  update(deltaTime) {
    this.updateEngine(deltaTime);
    this.threeScene.update(this.engineState);
    if (this.advancedEffects) {
      this.advancedEffects.update(this.engineState);
    }
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
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  // Use enhanced renderer if audio/effects libraries are available
  if (typeof EnhancedQGearRenderer !== 'undefined') {
    new EnhancedQGearRenderer();
  } else if (typeof QGearRenderer !== 'undefined') {
    new QGearRenderer();
  }
});