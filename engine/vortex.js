/**
 * VORTEX.JS
 * Purple Vortex Engine Core
 * 
 * Manages the rotating quantum chamber's central vortex effect,
 * with color cycling, rotation speed, and spiral patterns.
 */

class VortexCore {
  constructor(config = {}) {
    this.radius = config.radius || 150;
    this.maxRadius = config.maxRadius || 200;
    this.rotationSpeed = config.rotationSpeed || 0.02;
    this.colorPhase = 0;
    this.isActive = true;
    
    // Purple color spectrum
    this.colors = [
      '#8B00FF',  // Deep Purple
      '#9933FF',  // Purple
      '#AA66FF',  // Light Purple
      '#BB88FF',  // Lighter Purple
    ];
    
    this.spiralDepth = config.spiralDepth || 5;
    this.particleCount = config.particleCount || 100;
  }
  
  /**
   * Update vortex rotation and visual properties
   */
  update(deltaTime = 0.016) {
    if (!this.isActive) return;
    
    this.rotationSpeed += 0.0001; // Gradually accelerate
    this.colorPhase = (this.colorPhase + 0.01) % this.colors.length;
    
    return {
      rotation: (this.rotationSpeed * deltaTime * 1000) % (Math.PI * 2),
      colorIndex: Math.floor(this.colorPhase),
      radius: this.radius,
      maxRadius: this.maxRadius,
    };
  }
  
  /**
   * Get current vortex color
   */
  getCurrentColor() {
    return this.colors[Math.floor(this.colorPhase) % this.colors.length];
  }
  
  /**
   * Generate spiral particle positions
   */
  generateSpiralParticles() {
    const particles = [];
    const angleStep = (Math.PI * 2) / this.particleCount;
    
    for (let i = 0; i < this.particleCount; i++) {
      const angle = angleStep * i;
      const distance = this.radius + (Math.sin(angle * this.spiralDepth) * 20);
      
      particles.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        angle: angle,
        distance: distance,
      });
    }
    
    return particles;
  }
  
  /**
   * Activate/deactivate vortex
   */
  setActive(active) {
    this.isActive = active;
  }
  
  /**
   * Pulse the vortex (used for power surges)
   */
  pulse() {
    this.rotationSpeed += 0.05;
    this.radius = Math.min(this.radius + 10, this.maxRadius);
  }
  
  /**
   * Reset vortex to calm state
   */
  reset() {
    this.rotationSpeed = 0.02;
    this.colorPhase = 0;
    this.radius = 150;
  }
}

module.exports = VortexCore;
