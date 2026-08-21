/**
 * OPERATOR.JS
 * Operator Control System
 * 
 * Manages the operator entity, positioning, and state.
 */

class Operator {
  constructor(config = {}) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.scale = config.scale || 1;
    this.isActive = true;
    this.stance = 'idle'; // idle, stance1, stance2, channeling
    this.channelPower = 0;
    this.health = config.health || 100;
    this.maxHealth = config.maxHealth || 100;
  }
  
  /**
   * Update operator state
   */
  update(deltaTime = 0.016) {
    if (this.stance === 'channeling' && this.channelPower < 100) {
      this.channelPower += 2;
    }
  }
  
  /**
   * Set operator stance
   */
  setStance(stanceName) {
    this.stance = stanceName;
    if (stanceName !== 'channeling') {
      this.channelPower = 0;
    }
  }
  
  /**
   * Move operator
   */
  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
  
  /**
   * Release channel power
   */
  releaseChannel() {
    const power = this.channelPower;
    this.channelPower = 0;
    this.stance = 'idle';
    return power;
  }
  
  /**
   * Get operator state for rendering
   */
  getState() {
    return {
      x: this.x,
      y: this.y,
      scale: this.scale,
      stance: this.stance,
      channelPower: this.channelPower,
      health: this.health,
      isActive: this.isActive,
    };
  }
}

module.exports = Operator;