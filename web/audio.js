/**
 * AUDIO.JS
 * Audio System Integration
 * 
 * Manages sound effects, ambient music, and pressure-based audio modulation.
 */

class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.5;
    this.isInitialized = false;
    this.sounds = {};
    this.ambientOscillator = null;
    this.ambientGain = null;
    this.pressureLevel = 0;
    
    this.initAudioContext();
  }
  
  /**
   * Initialize Web Audio API context
   */
  initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioContext = new AudioContext();
      this.isInitialized = true;
    }
  }
  
  /**
   * Start ambient sound based on pressure
   */
  async startAmbientSound(pressureLevel = 0) {
    if (!this.audioContext) return;
    
    try {
      const ctx = this.audioContext;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      this.stopAmbientSound();
      
      // Create oscillator for ambient tone
      this.ambientOscillator = ctx.createOscillator();
      this.ambientOscillator.type = 'sine';
      
      // Base frequency: 110Hz (A2), modulate with pressure
      this.ambientOscillator.frequency.value = 110 + (pressureLevel * 220);
      
      // Create gain node for volume control
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.value = this.masterVolume * 0.1;
      
      this.ambientOscillator.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);
      this.ambientOscillator.start();
    } catch (e) {
      console.log('Audio unavailable:', e.message);
    }
  }
  
  /**
   * Update ambient sound frequency based on pressure
   */
  updateAmbientFrequency(pressureLevel) {
    if (!this.ambientOscillator || !this.audioContext) return;
    
    this.pressureLevel = pressureLevel;
    const newFrequency = 110 + (pressureLevel * 220);
    this.ambientOscillator.frequency.setTargetAtTime(
      newFrequency,
      this.audioContext.currentTime,
      0.1
    );
  }
  
  /**
   * Play burst sound effect
   */
  playBurstSound(intensity = 1) {
    if (!this.audioContext) return;
    
    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;
      
      // Create burst noise
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(this.masterVolume * intensity, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(now);
    } catch (e) {
      console.log('Burst sound unavailable:', e.message);
    }
  }
  
  /**
   * Play pulse sound effect
   */
  playPulseSound() {
    if (!this.audioContext) return;
    
    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;
      
      // Create pulse tone
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = 220;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.masterVolume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.log('Pulse sound unavailable:', e.message);
    }
  }
  
  /**
   * Stop ambient sound
   */
  stopAmbientSound() {
    if (this.ambientOscillator && this.audioContext) {
      try {
        this.ambientOscillator.stop();
        this.ambientOscillator = null;
      } catch (e) {
        console.log('Could not stop ambient sound:', e.message);
      }
    }
  }
  
  /**
   * Set master volume
   */
  setVolume(level) {
    this.masterVolume = Math.max(0, Math.min(1, level));
    if (this.ambientGain) {
      this.ambientGain.gain.value = this.masterVolume * 0.1;
    }
  }
}

// Export audio system
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioSystem;
}