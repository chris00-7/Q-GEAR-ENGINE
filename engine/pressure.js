/**
 * PRESSURE.JS
 * Pressure-Based Energy System
 * 
 * Manages energy accumulation, release, and pressure mechanics.
 * Controls power levels and energy bursts.
 */

class PressureSystem {
  constructor(config = {}) {
    this.maxPressure = config.maxPressure || 100;
    this.currentPressure = config.startPressure || 0;
    this.pressureRate = config.pressureRate || 0.5; // Accumulation per frame
    this.releaseRate = config.releaseRate || 1.5;   // Release per frame
    this.dangerThreshold = config.dangerThreshold || 80;
    this.criticalThreshold = config.criticalThreshold || 95;
    this.isReleasing = false;
  }
  
  /**
   * Accumulate pressure over time
   */
  accumulate(deltaTime = 0.016) {
    this.currentPressure = Math.min(
      this.currentPressure + (this.pressureRate * deltaTime * 60),
      this.maxPressure
    );
  }
  
  /**
   * Release pressure
   */
  release(amount = null) {
    if (amount === null) {
      this.isReleasing = true;
      this.currentPressure = Math.max(0, this.currentPressure - this.releaseRate);
    } else {
      this.currentPressure = Math.max(0, this.currentPressure - amount);
    }
  }
  
  /**
   * Get pressure level (0-1)
   */
  getPressureLevel() {
    return this.currentPressure / this.maxPressure;
  }
  
  /**
   * Check if pressure is in danger zone
   */
  isDangerous() {
    return this.currentPressure >= this.dangerThreshold;
  }
  
  /**
   * Check if pressure is critical
   */
  isCritical() {
    return this.currentPressure >= this.criticalThreshold;
  }
  
  /**
   * Burst release all pressure
   */
  burst() {
    const burstEnergy = this.currentPressure;
    this.currentPressure = 0;
    this.isReleasing = true;
    return burstEnergy;
  }
  
  /**
   * Get pressure state for rendering
   */
  getState() {
    return {
      current: this.currentPressure,
      max: this.maxPressure,
      level: this.getPressureLevel(),
      isDangerous: this.isDangerous(),
      isCritical: this.isCritical(),
      isReleasing: this.isReleasing,
    };
  }
}

module.exports = PressureSystem;