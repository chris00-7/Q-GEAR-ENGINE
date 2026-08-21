/**
 * MAIN.JS
 * Q-Gear Engine Renderer and Controller
 * 
 * Handles canvas rendering and user input for the engine.
 */

// Import the engine (in a real setup, this would be bundled)
class QGearRenderer {
  constructor() {
    this.canvas = document.getElementById('engine-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Mock engine for browser environment
    this.initMockEngine();
    
    this.fps = 0;
    this.frameCount = 0;
    this.lastFrameTime = Date.now();
    
    this.setupControls();
    this.startAnimation();
  }
  
  /**
   * Initialize mock engine for browser
   */
  initMockEngine() {
    this.engine = {
      pressure: { currentPressure: 0, maxPressure: 100 },
      chamber: { rotation: 0, radius: 300 },
      vortex: { rotation: 0, radius: 150 },
      operator: { x: this.canvas.width / 2, y: this.canvas.height / 2 },
      update: function(dt) {
        this.pressure.currentPressure = Math.min(
          this.pressure.currentPressure + 0.5,
          this.pressure.maxPressure
        );
        this.chamber.rotation += 0.005;
        this.vortex.rotation += 0.02;
      }
    };
  }
  
  /**
   * Setup control buttons
   */
  setupControls() {
    document.getElementById('btn-stance-1').addEventListener('click', () => {
      console.log('Stance 1 activated');
    });
    
    document.getElementById('btn-stance-2').addEventListener('click', () => {
      console.log('Stance 2 activated');
    });
    
    document.getElementById('btn-burst').addEventListener('click', () => {
      this.engine.pressure.currentPressure = 0;
      console.log('Burst activated');
    });
  }
  
  /**
   * Resize canvas to fit window
   */
  resizeCanvas() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }
  
  /**
   * Draw chamber
   */
  drawChamber() {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const radius = this.engine.chamber.radius;
    
    this.ctx.save();
    this.ctx.globalAlpha = 0.6;
    this.ctx.strokeStyle = '#8B00FF';
    this.ctx.lineWidth = 20;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Glow effect
    this.ctx.shadowColor = '#8B00FF';
    this.ctx.shadowBlur = 20;
    this.ctx.strokeStyle = '#AA66FF';
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.restore();
  }
  
  /**
   * Draw vortex
   */
  drawVortex() {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const radius = this.engine.vortex.radius;
    
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(this.engine.vortex.rotation);
    
    // Draw spiral
    this.ctx.strokeStyle = '#8B00FF';
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = 0.7;
    
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const r = radius + (Math.sin(angle * 3) * 30);
        const x = Math.cos(angle + (i * Math.PI * 2 / 3)) * r;
        const y = Math.sin(angle + (i * Math.PI * 2 / 3)) * r;
        if (angle === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  /**
   * Draw operator
   */
  drawOperator() {
    const x = this.engine.operator.x;
    const y = this.engine.operator.y;
    
    this.ctx.save();
    this.ctx.globalAlpha = 0.8;
    
    // Aura
    this.ctx.fillStyle = 'rgba(139, 0, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 60, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Operator body
    this.ctx.fillStyle = '#00FF00';
    this.ctx.fillRect(x - 15, y - 25, 30, 50);
    this.ctx.beginPath();
    this.ctx.arc(x, y - 35, 15, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  /**
   * Draw pressure gauge
   */
  drawPressureGauge() {
    const level = this.engine.pressure.currentPressure / this.engine.pressure.maxPressure;
    const width = this.canvas.width;
    const height = 40;
    const barWidth = width * level;
    
    // Background
    this.ctx.fillStyle = 'rgba(139, 0, 255, 0.2)';
    this.ctx.fillRect(0, this.canvas.height - height, width, height);
    
    // Pressure bar
    const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#8B00FF');
    gradient.addColorStop(1, '#00FFFF');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, this.canvas.height - height, barWidth, height);
    
    // Border
    this.ctx.strokeStyle = '#8B00FF';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, this.canvas.height - height, width, height);
    
    // Text
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = 'bold 14px Courier New';
    this.ctx.fillText(`PRESSURE: ${Math.round(level * 100)}%`, 10, this.canvas.height - 15);
  }
  
  /**
   * Main render loop
   */
  render() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update engine
    this.engine.update(0.016);
    
    // Draw components
    this.drawChamber();
    this.drawVortex();
    this.drawOperator();
    this.drawPressureGauge();
    
    // Update FPS
    this.frameCount++;
    const now = Date.now();
    if (now - this.lastFrameTime > 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFrameTime = now;
      document.getElementById('fps').textContent = this.fps;
    }
  }
  
  /**
   * Start animation loop
   */
  startAnimation() {
    const animate = () => {
      this.render();
      requestAnimationFrame(animate);
    };
    animate();
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  new QGearRenderer();
});