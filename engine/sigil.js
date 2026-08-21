/**
 * SIGIL.JS
 * Gear-Shadow Silhouette
 * 
 * Manages the gear-based shadow silhouette behind the operator.
 */

class GearSigil {
  constructor(config = {}) {
    this.radius = config.radius || 80;
    this.gearCount = config.gearCount || 8;
    this.rotation = 0;
    this.rotationSpeed = config.rotationSpeed || 0.01;
    this.toothDepth = config.toothDepth || 0.3;
    this.opacity = config.opacity || 0.6;
  }
  
  /**
   * Update gear rotation
   */
  update(deltaTime = 0.016, pressureLevel = 0) {
    this.rotationSpeed = 0.01 + (pressureLevel * 0.05);
    this.rotation = (this.rotation + this.rotationSpeed) % (Math.PI * 2);
    this.opacity = 0.3 + (pressureLevel * 0.4);
  }
  
  /**
   * Generate gear shape points
   */
  generateGearShape() {
    const points = [];
    const angleStep = (Math.PI * 2) / (this.gearCount * 2);
    
    for (let i = 0; i < this.gearCount * 2; i++) {
      const angle = (angleStep * i) + this.rotation;
      const isOuterTooth = i % 2 === 0;
      const radius = isOuterTooth ? this.radius : this.radius * (1 - this.toothDepth);
      
      points.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle: angle,
        isOuter: isOuterTooth,
      });
    }
    
    return points;
  }
  
  /**
   * Get sigil state
   */
  getState() {
    return {
      rotation: this.rotation,
      radius: this.radius,
      gearCount: this.gearCount,
      opacity: this.opacity,
      shape: this.generateGearShape(),
    };
  }
}

module.exports = GearSigil;