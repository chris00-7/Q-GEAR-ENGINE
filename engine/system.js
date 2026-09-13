/**
 * SYSTEM.JS
 * Q-Gear Engine Master System
 * 
 * Integrates all engine modules into a unified control system.
 */

const VortexCore = require('./vortex');
const PressureSystem = require('./pressure');
const { ParticleStream } = require('./particles');
const QuantumChamber = require('./chamber');
const Operator = require('./operator');
const AuraSystem = require('./aura');
const GearSigil = require('./sigil');
const StanceSystem = require('./stance');
const { EffectsSystem } = require('./effects');

class QGearEngine {
  constructor(config = {}) {
    config = config || {};
    // Initialize all subsystems
    this.vortex = new VortexCore(config.vortex);
    this.pressure = new PressureSystem(config.pressure);
    this.particles = new ParticleStream(config.particles);
    this.chamber = new QuantumChamber(config.chamber);
    this.operator = new Operator(config.operator);
    this.aura = new AuraSystem(config.aura);
    this.sigil = new GearSigil(config.sigil);
    this.stance = new StanceSystem(config.stance);
    this.effects = new EffectsSystem();
    
    this.isRunning = false;
    this.frameCount = 0;
  }
  
  /**
   * Initialize and start the engine
   */
  start() {
    this.isRunning = true;
    this.frameCount = 0;
  }
  
  /**
   * Stop the engine
   */
  stop() {
    this.isRunning = false;
  }
  
  /**
   * Main update loop
   */
  update(deltaTime = 0.016) {
    if (!this.isRunning) return;
    
    const pressureLevel = this.pressure.getPressureLevel();
    
    // Update all subsystems
    this.pressure.accumulate(deltaTime);
    this.vortex.update(deltaTime);
    this.chamber.update(deltaTime, pressureLevel);
    this.operator.update(deltaTime);
    this.aura.update(pressureLevel, deltaTime);
    this.sigil.update(deltaTime, pressureLevel);
    this.particles.update();
    this.effects.update();
    
    // Emit particles based on pressure
    if (pressureLevel > 0.1) {
      const emitCount = Math.floor(pressureLevel * 10);
      this.particles.emit(this.operator.x, this.operator.y, emitCount);
    }
    
    this.frameCount++;
  }
  
  /**
   * Get complete engine state for rendering
   */
  getState() {
    return {
      vortex: this.vortex.generateSpiralParticles(),
      pressure: this.pressure.getState(),
      chamber: this.chamber.getState(),
      operator: this.operator.getState(),
      aura: this.aura.getState(),
      sigil: this.sigil.getState(),
      stance: this.stance.getState(),
      particles: this.particles.particles,
      effects: this.effects.getActiveEffects(),
      frameCount: this.frameCount,
    };
  }
  
  /**
   * Trigger energy burst
   */
  burst() {
    const energy = this.pressure.burst();
    const x = this.operator.x;
    const y = this.operator.y;
    
    // Emit burst particles
    this.particles.burst(x, y, 0, 50);
    this.effects.triggerHandCrackle(x, y, 40);
    
    return energy;
  }
  
  /**
   * Switch operator stance
   */
  setStance(stanceName) {
    if (this.stance.switchStance(stanceName)) {
      this.operator.setStance(stanceName);
      return true;
    }
    return false;
  }
  
  /**
   * Move operator
   */
  moveOperator(x, y) {
    this.operator.moveTo(x, y);
  }
}

module.exports = QGearEngine;