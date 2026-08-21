/**
 * AURA.JS
 * Operator Aura System
 * 
 * Manages the visual aura around the operator based on power level.
 */

class AuraSystem {
  constructor(config = {}) {
    this.baseRadius = config.baseRadius || 60;
    this.maxRadius = config.maxRadius || 120;
    this.colors = config.colors || [
      '#FF6600',  // Orange
      '#FF3300',  // Red
      '#FF00FF',  // Magenta
      '#0099FF',  // Cyan
    ];
    this.colorIndex = 0;
    this.pulsePhase = 0;
    this.intensity = 0;
  }
  
  /**
   * Update aura based on power level
   */
  update(powerLevel, deltaTime = 0.016) {
    this.intensity = powerLevel;
    this.colorIndex = Math.floor(powerLevel * this.colors.length) % this.colors.length;
    this.pulsePhase = (this.pulsePhase + 0.05) % (Math.PI * 2);
  }
  
  /**
   * Get current aura radius
   */
  getRadius() {
    const pulseFactor = Math.sin(this.pulsePhase) * 0.2 + 0.8;
    return this.baseRadius + ((this.maxRadius - this.baseRadius) * this.intensity) * pulseFactor;
  }
  
  /**
   * Get current aura color
   */
  getColor() {
    return this.colors[this.colorIndex];
  }
  
  /**
   * Get aura state
   */
  getState() {
    return {
      radius: this.getRadius(),
      color: this.getColor(),
      intensity: this.intensity,
      pulsePhase: this.pulsePhase,
    };
  }
}

module.exports = AuraSystem;