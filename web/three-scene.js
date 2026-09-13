/**
 * THREE-SCENE.JS
 * Three.js Scene Setup and Geometry
 * 
 * Implements 3D vortex core, chamber geometry, and lighting.
 */

class ThreeJSScene {
  constructor(containerElement) {
    this.container = containerElement;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    
    this.vortexMesh = null;
    this.chamberMesh = null;
    this.operatorMesh = null;
    this.particleGeometry = null;
    this.particlePoints = null;
    
    this.lights = [];
    this.updateTime = 0;
    
    this.initRenderer();
    this.initCamera();
    this.initLighting();
    this.createGeometry();
  }
  
  /**
   * Initialize Three.js renderer
   */
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x0a0e27, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
    
    window.addEventListener('resize', () => this.onWindowResize());
  }
  
  /**
   * Initialize camera
   */
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 400, 600);
    this.camera.lookAt(0, 0, 0);
  }
  
  /**
   * Initialize lighting system
   */
  initLighting() {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);
    
    // Main purple vortex light
    const vortexLight = new THREE.PointLight(0x8B00FF, 2, 1000);
    vortexLight.position.set(0, 0, 0);
    vortexLight.castShadow = true;
    this.scene.add(vortexLight);
    this.lights.push(vortexLight);
    
    // Secondary cyan accent light
    const accentLight = new THREE.PointLight(0x00FFFF, 1.5, 800);
    accentLight.position.set(300, 200, 300);
    accentLight.castShadow = true;
    this.scene.add(accentLight);
    this.lights.push(accentLight);
    
    // Directional light for shadows
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(500, 500, 500);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);
    this.lights.push(dirLight);
  }
  
  /**
   * Create vortex core geometry
   */
  createVortexCore() {
    const group = new THREE.Group();
    
    // Main spiral vortex
    const spiralGeometry = new THREE.BufferGeometry();
    const spiralPoints = [];
    const spiralSegments = 500;
    const spiralTurns = 8;
    
    for (let i = 0; i < spiralSegments; i++) {
      const t = i / spiralSegments;
      const angle = t * Math.PI * 2 * spiralTurns;
      const radius = 50 + (t * 150);
      const height = (t - 0.5) * 300;
      
      spiralPoints.push(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
    }
    
    spiralGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(spiralPoints), 3));
    const spiralMaterial = new THREE.LineBasicMaterial({
      color: 0x8B00FF,
      linewidth: 3,
    });
    const spiralLine = new THREE.Line(spiralGeometry, spiralMaterial);
    spiralLine.castShadow = true;
    group.add(spiralLine);
    
    // Rotating rings around vortex
    for (let ring = 0; ring < 3; ring++) {
      const ringGeometry = new THREE.BufferGeometry();
      const ringPoints = [];
      const ringSegments = 128;
      const ringRadius = 80 + (ring * 50);
      const ringHeight = -50 + (ring * 50);
      
      for (let i = 0; i <= ringSegments; i++) {
        const angle = (i / ringSegments) * Math.PI * 2;
        ringPoints.push(
          Math.cos(angle) * ringRadius,
          ringHeight,
          Math.sin(angle) * ringRadius
        );
      }
      
      ringGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ringPoints), 3));
      const ringMaterial = new THREE.LineBasicMaterial({
        color: ring === 1 ? 0x00FFFF : 0xAA66FF,
        linewidth: 2,
      });
      const ringLine = new THREE.Line(ringGeometry, ringMaterial);
      ringLine.castShadow = true;
      group.add(ringLine);
    }
    
    // Central glow orb
    const orbGeometry = new THREE.IcosahedronGeometry(20, 4);
    const orbMaterial = new THREE.MeshPhongMaterial({
      color: 0x8B00FF,
      emissive: 0x8B00FF,
      emissiveIntensity: 0.8,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.castShadow = true;
    group.add(orb);
    
    this.vortexMesh = group;
    this.scene.add(group);
  }
  
  /**
   * Create rotating quantum chamber
   */
  createChamber() {
    const group = new THREE.Group();
    
    // Chamber torus (main body)
    const torusGeometry = new THREE.TorusGeometry(300, 30, 32, 256);
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0x8B00FF,
      emissive: 0x330044,
      shininess: 100,
      wireframe: false,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.castShadow = true;
    torus.receiveShadow = true;
    group.add(torus);
    
    // Chamber segments (gear-like appearance)
    const segmentCount = 24;
    for (let i = 0; i < segmentCount; i++) {
      const angle = (i / segmentCount) * Math.PI * 2;
      const boxGeometry = new THREE.BoxGeometry(40, 80, 15);
      const boxMaterial = new THREE.MeshPhongMaterial({
        color: 0xAA66FF,
        emissive: 0x5500AA,
      });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      
      const x = Math.cos(angle) * 300;
      const z = Math.sin(angle) * 300;
      box.position.set(x, 0, z);
      box.rotation.y = angle;
      box.castShadow = true;
      box.receiveShadow = true;
      group.add(box);
    }
    
    // Inner chamber walls
    const innerTorus = new THREE.Mesh(
      new THREE.TorusGeometry(220, 20, 32, 256),
      new THREE.MeshPhongMaterial({
        color: 0x5500AA,
        emissive: 0x330044,
        wireframe: false,
      })
    );
    innerTorus.position.y = 0;
    innerTorus.castShadow = true;
    group.add(innerTorus);
    
    this.chamberMesh = group;
    this.scene.add(group);
  }
  
  /**
   * Create operator entity
   */
  createOperator() {
    const group = new THREE.Group();
    
    // Operator body (stylized humanoid, compatible with Three r128)
    const bodyGeometry = new THREE.CylinderGeometry(18, 22, 60, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x00FF00,
      emissive: 0x00AA00,
      shininess: 80,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(15, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0x00FF00,
      emissive: 0x00AA00,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 50;
    head.castShadow = true;
    head.receiveShadow = true;
    group.add(head);
    
    // Aura sphere (energy field)
    const auraGeometry = new THREE.IcosahedronGeometry(80, 4);
    const auraMaterial = new THREE.MeshPhongMaterial({
      color: 0xFF6600,
      emissive: 0xFF6600,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    aura.position.y = 0;
    group.add(aura);
    
    // Store aura for pulsing
    group.aura = aura;
    
    group.position.set(0, 0, 0);
    this.operatorMesh = group;
    this.scene.add(group);
  }
  
  /**
   * Create particle system
   */
  createParticleSystem() {
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
      
      colors[i * 3] = Math.random() * 0.5 + 0.5; // R: 0.5-1
      colors[i * 3 + 1] = 0; // G: 0
      colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // B: 0.5-1
      
      sizes[i] = Math.random() * 2;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    this.particlePoints = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particlePoints);
  }
  
  /**
   * Create all geometry
   */
  createGeometry() {
    this.createVortexCore();
    this.createChamber();
    this.createOperator();
    this.createParticleSystem();
  }
  
  /**
   * Update scene based on engine state
   */
  update(engineState) {
    this.updateTime += 0.016;
    
    // Rotate vortex
    if (this.vortexMesh) {
      this.vortexMesh.rotation.z += 0.015;
      this.vortexMesh.rotation.x += 0.003;
    }
    
    // Rotate chamber
    if (this.chamberMesh) {
      this.chamberMesh.rotation.z += 0.005 + (engineState.pressure.level * 0.02);
    }
    
    // Update operator aura
    if (this.operatorMesh && this.operatorMesh.aura) {
      const auraScale = 0.8 + (engineState.pressure.level * 0.3);
      this.operatorMesh.aura.scale.set(auraScale, auraScale, auraScale);
      this.operatorMesh.aura.rotation.x += 0.01;
      this.operatorMesh.aura.rotation.y += 0.015;
    }
    
    // Update lights based on pressure
    if (this.lights.length > 1) {
      const mainLight = this.lights[1];
      mainLight.intensity = 2 + (engineState.pressure.level * 2);
    }
    
    // Animate particles
    if (this.particlePoints) {
      this.particlePoints.rotation.x += 0.0001;
      this.particlePoints.rotation.y += 0.0002;
    }
  }
  
  /**
   * Render scene
   */
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  
  /**
   * Handle window resize
   */
  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  /**
   * Apply pulse effect to vortex
   */
  pulseVortex() {
    if (this.vortexMesh) {
      const originalScale = this.vortexMesh.scale.clone();
      this.vortexMesh.scale.multiplyScalar(1.2);
      
      setTimeout(() => {
        this.vortexMesh.scale.copy(originalScale);
      }, 200);
    }
  }

  /**
   * Get active particle count
   */
  getParticleCount() {
    if (!this.particlePoints || !this.particlePoints.geometry) return 0;
    const position = this.particlePoints.geometry.getAttribute('position');
    return position ? position.count : 0;
  }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThreeJSScene;
}