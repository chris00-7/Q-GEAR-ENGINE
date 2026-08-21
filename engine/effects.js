/**
 * EFFECTS.JS
 * Electric Crackle Hand Effects
 * 
 * Manages hand-based electric effects and crackle animations.
 */

class HandEffect {
  constructor(x, y, duration = 30) {
    this.x = x;
    this.y = y;
    this.duration = duration;
    this.maxDuration = duration;
    this.segments = [];
    this.generateLightning();
  }
  
  /**
   * Generate lightning bolt segments
   */
  generateLightning(branches = 5) {
    this.segments = [];
    const mainSegments = 8;
    
    for (let i = 0; i < mainSegments; i++) {
      const progress = i / mainSegments;
      const angle = (Math.random() - 0.5) * 0.3;
      const distance = 40 + (progress * 80);
      
      this.segments.push({
        x: distance * Math.cos(angle),
        y: distance * Math.sin(angle),
        progress: progress,
        thickness: 2 * (1 - progress),
      });
    }
  }
  
  /**
   * Update effect
   */
  update() {
    this.duration--;
    if (this.duration % 3 === 0) {
      this.generateLightning();
    }
  }
  
  /**
   * Check if effect is still active
   */
  isActive() {
    return this.duration > 0;
  }
  
  /**
   * Get effect state
   */
  getState() {
    return {
      x: this.x,
      y: this.y,
      segments: this.segments,
      opacity: this.duration / this.maxDuration,
      active: this.isActive(),
    };
  }
}

class EffectsSystem {
  constructor() {
    this.handEffects = [];
    this.maxEffects = 50;
  }
  
  /**
   * Trigger hand crackle at position
   */
  triggerHandCrackle(x, y, duration = 30) {
    if (this.handEffects.length < this.maxEffects) {
      this.handEffects.push(new HandEffect(x, y, duration));
    }
  }
  
  /**
   * Update all effects
   */
  update() {
    for (let i = this.handEffects.length - 1; i >= 0; i--) {
      this.handEffects[i].update();
      if (!this.handEffects[i].isActive()) {
        this.handEffects.splice(i, 1);
      }
    }
  }
  
  /**
   * Get all active effects
   */
  getActiveEffects() {
    return this.handEffects.map(e => e.getState());
  }
}

module.exports = { HandEffect, EffectsSystem };