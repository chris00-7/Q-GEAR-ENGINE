/**
 * CHAMBER.JS
 * Rotating Quantum Chamber
 * 
 * Manages the main chamber structure, rotation, and ambient effects.
 */

class QuantumChamber {
  constructor(config = {}) {
    this.rotation = 0;
    this.rotationSpeed = config.rotationSpeed || 0.005;
    this.maxRotationSpeed = config.maxRotationSpeed || 0.05;
    this.radius = config.radius || 300;
    this.thickness = config.thickness || 20;
    this.opacity = config.opacity || 0.8;
    this.segmentCount = config.segmentCount || 24;
    this.neonIntensity = 0;
  }
  
  /**
   * Update chamber rotation and state
   */
  update(deltaTime = 0.016, pressureLevel = 0) {
    this.rotationSpeed = 0.005 + (pressureLevel * this.maxRotationSpeed);
    this.rotation = (this.rotation + this.rotationSpeed) % (Math.PI * 2);
    this.neonIntensity = 0.5 + (pressureLevel * 0.5);
    
    return {
      rotation: this.rotation,
      neonIntensity: this.neonIntensity,
      opacity: this.opacity,
    };
  }
  
  /**
   * Generate chamber segments for rendering
   */
  generateSegments() {
    const segments = [];
    const angleStep = (Math.PI * 2) / this.segmentCount;
    
    for (let i = 0; i < this.segmentCount; i++) {
      const startAngle = (angleStep * i) + this.rotation;
      const endAngle = (angleStep * (i + 1)) + this.rotation;
      
      segments.push({
        startAngle,
        endAngle,
        radius: this.radius,
        thickness: this.thickness,
        index: i,
      });
    }
    
    return segments;
  }
  
  /**
   * Get chamber state
   */
  getState() {
    return {
      rotation: this.rotation,
      radius: this.radius,
      thickness: this.thickness,
      neonIntensity: this.neonIntensity,
      opacity: this.opacity,
    };
  }
}

module.exports = QuantumChamber;