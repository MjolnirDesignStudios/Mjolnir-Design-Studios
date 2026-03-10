import { ShaderConfig } from './shader-manager';

// ── Default-export shaders (atmosphere, aurora, globe, etc.) ──────────────────
import atmosphereShader from './user/atmosphere';
import auraWavesShader from './user/aura-waves';
import blackHoleShader from './user/black-hole';
import globeShader from './user/globe';
import hyperspeedShader from './user/hyperspeed';
import laserFlowShader from './user/laser-flow';

// ── Named-export shaders ───────────────────────────────────────────────────────
import { accretion as accretionShader } from './user/accretion';
import { atomic as atomicShader } from './user/atomic';
import { biFrost as bifrostShader } from './user/bifrost';
import { colorHalo as colorHaloShader } from './user/colorhalo';
import { darkVeil as darkVeilShader } from './user/darkveil';
import { gravityLens as gravityLensShader } from './user/gravitylens';
import { lightPillar as lightPillarShader } from './user/light-pillar';
import { lightning as lightningShader } from './user/lightning';
import { lightningEffect as lightningEffectShader } from './user/lightningeffect';
import { liquidRibbons as liquidRibbonsShader } from './user/liquidribbons';
import { matrixRain as matrixRainShader } from './user/matrix-rain';
import { neuralNet as neuralNetShader } from './user/neuralnet';
import { rippleGrid as rippleGridShader } from './user/ripple-grid';
import { silkyLines as silkyLinesShader } from './user/silkylines';
import { singularity as singularityShader } from './user/singularity';
import { starField as starFieldShader } from './user/starfield';
import { swirlingGas as swirlingGasShader } from './user/swirling-gas';

// ── Preset shaders (default exports) ─────────────────────────────────────────
import nebulaShader from './presets/nebula';
import cyberpunkShader from './presets/cyberpunk';

export class ShaderLoader {
  private shaderCache: Map<string, ShaderConfig> = new Map();
  private loadedShaders: Set<string> = new Set();

  // Registry of all available shaders
  private shaderRegistry: Record<string, ShaderConfig> = {
    // User shaders
    accretion: accretionShader,
    atomic: atomicShader,
    atmosphere: atmosphereShader,
    'aura-waves': auraWavesShader,
    bifrost: bifrostShader,
    'black-hole': blackHoleShader,
    colorhalo: colorHaloShader,
    darkveil: darkVeilShader,
    globe: globeShader,
    gravitylens: gravityLensShader,
    hyperspeed: hyperspeedShader,
    'laser-flow': laserFlowShader,
    'light-pillar': lightPillarShader,
    lightning: lightningShader,
    lightningeffect: lightningEffectShader,
    liquidribbons: liquidRibbonsShader,
    'matrix-rain': matrixRainShader,
    neuralnet: neuralNetShader,
    'ripple-grid': rippleGridShader,
    silkylines: silkyLinesShader,
    singularity: singularityShader,
    starfield: starFieldShader,
    'swirling-gas': swirlingGasShader,
    // Preset shaders
    nebula: nebulaShader,
    cyberpunk: cyberpunkShader,
  };

  async loadShader(shaderName: string): Promise<ShaderConfig> {
    // Check cache first
    if (this.shaderCache.has(shaderName)) {
      return this.shaderCache.get(shaderName)!;
    }

    // Check registry
    const shader = this.shaderRegistry[shaderName];
    if (shader) {
      this.shaderCache.set(shaderName, shader);
      this.loadedShaders.add(shaderName);
      return shader;
    }

    throw new Error(`Shader ${shaderName} not found`);
  }

  async discoverShaders(): Promise<string[]> {
    return Object.keys(this.shaderRegistry);
  }

  getAvailableShaders(): string[] {
    return Object.keys(this.shaderRegistry);
  }

  clearCache() {
    this.shaderCache.clear();
    this.loadedShaders.clear();
  }

  validateShaderConfig(config: unknown): config is ShaderConfig {
    return (
      typeof config === 'object' &&
      config !== null &&
      typeof (config as Record<string, unknown>).name === 'string' &&
      typeof (config as Record<string, unknown>).description === 'string' &&
      typeof (config as Record<string, unknown>).vertexShader === 'string' &&
      typeof (config as Record<string, unknown>).fragmentShader === 'string'
    );
  }
}
