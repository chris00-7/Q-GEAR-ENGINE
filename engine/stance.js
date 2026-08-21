/**
 * STANCE.JS
 * Operator Stance Logic
 * 
 * Manages different operator stances with unique visual and power characteristics.
 */

class StanceSystem {
  constructor(config = {}) {
    this.currentStance = 'idle';
    this.stanceConfigs = {
      idle: {
        name: 'Idle',
        scale: 1,
        powerBoost: 0,
        auraIntensity: 0.2,
        rotationModifier: 1,
      },
      stance1: {
        name: 'Power Stance',
        scale: 1.1,
        powerBoost: 0.5,
        auraIntensity: 0.6,
        rotationModifier: 1.5,
      },
      stance2: {
        name: 'Surge Stance',
        scale: 1.2,
        powerBoost: 1,
        auraIntensity: 1,
        rotationModifier: 2,
      },
      channeling: {
        name: 'Channeling',
        scale: 0.95,
        powerBoost: 0.7,
        auraIntensity: 0.8,
        rotationModifier: 1.2,
      },
    };
  }
  
  /**
   * Switch to a new stance
   */
  switchStance(stanceName) {
    if (this.stanceConfigs[stanceName]) {
      this.currentStance = stanceName;
      return true;
    }
    return false;
  }
  
  /**
   * Get current stance config
   */
  getCurrentConfig() {
    return this.stanceConfigs[this.currentStance];
  }
  
  /**
   * Get power boost from current stance
   */
  getPowerBoost() {
    return this.getCurrentConfig().powerBoost;
  }
  
  /**
   * Get all available stances
   */
  getAvailableStances() {
    return Object.keys(this.stanceConfigs);
  }
  
  /**
   * Get stance state
   */
  getState() {
    return {
      current: this.currentStance,
      config: this.getCurrentConfig(),
    };
  }
}

module.exports = StanceSystem;