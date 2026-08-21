/**
 * SHADERS.JS
 * GLSL Shaders for Advanced Visual Effects
 * 
 * Custom vertex and fragment shaders for plasma, glow, and distortion effects.
 */

const SHADERS = {
  // Plasma distortion shader for vortex core
  plasmaVertex: `
    varying vec3 vPosition;
    varying float vTime;
    
    void main() {
      vPosition = position;
      vTime = 0.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  plasmaFragment: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec3 vPosition;
    
    void main() {
      float dist = length(vPosition);
      float plasma = sin(dist * 0.1 + uTime) * 0.5 + 0.5;
      plasma *= sin(vPosition.y * 0.1 + uTime * 0.5) * 0.5 + 0.5;
      
      gl_FragColor = vec4(uColor, plasma * 0.8);
    }
  `,
  
  // Glow shader for chamber segments
  glowVertex: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * vec4(vPosition, 1.0);
    }
  `,
  
  glowFragment: `
    uniform float uGlowIntensity;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      float rim = 1.0 - abs(dot(normalize(vNormal), normalize(-vPosition)));
      rim = pow(rim, 2.0);
      
      gl_FragColor = vec4(vec3(0.54, 0.0, 1.0), rim * uGlowIntensity);
    }
  `,
  
  // Distortion shader for aura effect
  auraVertex: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vWave;
    uniform float uTime;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Wave distortion
      vWave = sin(position.y * 0.1 + uTime * 2.0) * 0.5 + 0.5;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  auraFragment: `
    uniform float uTime;
    varying vec3 vNormal;
    varying float vWave;
    
    void main() {
      float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
      fresnel = pow(fresnel, 2.0);
      
      vec3 color = vec3(1.0, 0.4, 0.0) * (fresnel + vWave * 0.5);
      gl_FragColor = vec4(color, fresnel * 0.6);
    }
  `,
};

// Export shaders
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SHADERS;
}