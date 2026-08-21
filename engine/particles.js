/**
 * PARTICLES.JS
 * Particle Stream System
 * 
 * Manages particle generation, physics, and lifecycle.
 * Handles streams, bursts, and ambient particles.
 */

class Particle {
  constructor(x, y, vx, vy, life = 60) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.size = 2;
    this.opacity = 1;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.opacity = this.life / this.maxLife;
    this.size = Math.max(0.5, this.size * 0.98);
  }
  
  isAlive() {
    return this.life > 0;
  }
}

class ParticleStream {
  constructor(config = {}) {
    this.particles = [];
    this.maxParticles = config.maxParticles || 500;
    this.emissionRate = config.emissionRate || 10;
    this.gravity = config.gravity || 0.1;
    this.friction = config.friction || 0.98;
    this.color = config.color || '#8B00FF';
  }
  
  /**
   * Emit particles at position
   */
  emit(x, y, count = 5, velocity = { min: 1, max: 3 }) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      
      const angle = Math.random() * Math.PI * 2;
      const speed = velocity.min + Math.random() * (velocity.max - velocity.min);
      
      const particle = new Particle(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        60
      );
      
      this.particles.push(particle);
    }
  }
  
  /**
   * Emit directional burst
   */
  burst(x, y, direction, count = 20) {
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.5;
      const angle = direction + spread;
      const speed = 2 + Math.random() * 3;
      
      const particle = new Particle(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        40
      );
      
      this.particles.push(particle);
    }
  }
  
  /**
   * Update all particles
   */
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      p.vy += this.gravity;
      p.vx *= this.friction;
      p.vy *= this.friction;
      p.update();
      
      if (!p.isAlive()) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  /**
   * Get particle count
   */
  getCount() {
    return this.particles.length;
  }
  
  /**
   * Clear all particles
   */
  clear() {
    this.particles = [];
  }
}

module.exports = { Particle, ParticleStream };