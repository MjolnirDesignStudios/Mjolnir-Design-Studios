'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ShaderManager } from './shaders/shader-manager';
import { ShaderLoader } from './shaders/shader-loader';

interface BackgroundStudioProps {
  className?: string;
  defaultShader?: string;
  showControls?: boolean;
  premiumMode?: boolean;
  onShaderChange?: (shaderName: string) => void;
}

export const BackgroundStudio: React.FC<BackgroundStudioProps> = ({
  className = '',
  defaultShader = 'nebula',
  showControls = true,
  premiumMode = true,
  onShaderChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shaderManagerRef = useRef<ShaderManager | null>(null);
  const [currentShader, setCurrentShader] = useState(defaultShader);
  const [availableShaders, setAvailableShaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);

  // Memoize shader categories for better performance
  const shaderCategories = useMemo(() => ({
    presets: ['nebula', 'cyberpunk', 'fractal', 'aurora', 'matrix', 'cosmic'],
    user: availableShaders.filter((s: string) => !['nebula', 'cyberpunk', 'fractal', 'aurora', 'matrix', 'cosmic'].includes(s))
  }), [availableShaders]);

  // Initialize shader system
  useEffect(() => {
    const initShaders = async () => {
      if (!canvasRef.current) return;

      try {
        const shaderLoader = new ShaderLoader();
        const shaders = await shaderLoader.discoverShaders();
        setAvailableShaders(shaders);

        const manager = new ShaderManager(canvasRef.current);
        shaderManagerRef.current = manager;

        // Load default shader
        await loadShader(defaultShader);
      } catch (err) {
        console.error('Failed to initialize shader system:', err);
        setError('Failed to initialize WebGL shader system');
      }
    };

    initShaders();

    return () => {
      if (shaderManagerRef.current) {
        shaderManagerRef.current.dispose();
      }
    };
  }, []);

  const loadShader = useCallback(async (shaderName: string) => {
    if (!shaderManagerRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      await shaderManagerRef.current.loadShader(shaderName);
      setCurrentShader(shaderName);
      if (isPlaying) {
        shaderManagerRef.current.startAnimation();
      }
      onShaderChange?.(shaderName);
    } catch (err) {
      console.error(`Failed to load shader ${shaderName}:`, err);
      setError(`Failed to load shader: ${shaderName}`);
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, onShaderChange]);

  // Handle canvas resize with debouncing
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && shaderManagerRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * (performanceMode ? 0.5 : 1);
        canvas.height = rect.height * (performanceMode ? 0.5 : 1);
        shaderManagerRef.current.render();
      }
    };

    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener('resize', debouncedResize);
    handleResize();

    return () => window.removeEventListener('resize', debouncedResize);
  }, [performanceMode]);

  // Toggle animation
  const toggleAnimation = useCallback(() => {
    if (!shaderManagerRef.current) return;

    if (isPlaying) {
      shaderManagerRef.current.stopAnimation();
    } else {
      shaderManagerRef.current.startAnimation();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Get shader display name
  const getShaderDisplayName = useCallback((shaderName: string) => {
    return shaderName.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }, []);

  return (
    <div className={`relative w-full h-full bg-black overflow-hidden ${className}`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          imageRendering: performanceMode ? 'pixelated' : 'auto',
          filter: performanceMode ? 'none' : 'blur(0.5px)' // Subtle blur for premium look
        }}
      />

      {/* Left Sidebar */}
      {showControls && (
        <div className="absolute left-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur-xl border-r border-white/10 p-4 overflow-y-auto z-10">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-white text-lg font-bold">Mjolnir Shader Studio</h3>
            <p className="text-white/70 text-sm">Premium Background Effects</p>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPerformanceMode(!performanceMode)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  performanceMode
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {performanceMode ? 'Performance' : 'Quality'}
              </button>
              <button
                onClick={toggleAnimation}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-medium transition-colors"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
            </div>

            {/* Shader Selector */}
            <div className="space-y-3">
              {/* Current Shader Display */}
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Current:</span>
                <span className="text-white font-medium">
                  {getShaderDisplayName(currentShader)}
                </span>
              </div>

              {/* Preset Shaders */}
              <div>
                <h4 className="text-white/70 text-sm mb-2">Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  {shaderCategories.presets.map((shader: string) => (
                    <button
                      key={shader}
                      onClick={() => loadShader(shader)}
                      disabled={isLoading}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        currentShader === shader
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {getShaderDisplayName(shader)}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Shaders */}
              {shaderCategories.user.length > 0 && (
                <div>
                  <h4 className="text-white/70 text-sm mb-2">Asgardian Collection</h4>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {shaderCategories.user.map((shader: string) => (
                      <button
                        key={shader}
                        onClick={() => loadShader(shader)}
                        disabled={isLoading}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          currentShader === shader
                            ? 'bg-purple-500 text-white shadow-lg'
                            : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30'
                        }`}
                      >
                        {getShaderDisplayName(shader)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="mt-4 flex items-center justify-between text-xs">
              {isLoading && (
                <span className="text-yellow-400 flex items-center gap-1">
                  <div className="w-3 h-3 border border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading shader...
                </span>
              )}
              {error && (
                <span className="text-red-400">{error}</span>
              )}
              {!isLoading && !error && (
                <span className="text-green-400">✓ Ready</span>
              )}
              <span className="text-white/50">
                {availableShaders.length} shaders available
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Premium Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-black/90 rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="text-white font-medium">Loading Shader</p>
                <p className="text-white/70 text-sm">Initializing WebGL...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WebGL Fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm">
          <div className="text-center text-white bg-black/80 rounded-xl p-6 border border-white/10 max-w-md">
            <div className="text-4xl mb-4">⚡</div>
            <h2 className="text-xl font-bold mb-2">WebGL Not Supported</h2>
            <p className="text-white/70 text-sm mb-4">
              Your browser doesn't support WebGL shaders. Try using Chrome, Firefox, or Edge for the full experience.
            </p>
            <div className="text-xs text-white/50">
              Current shader: {getShaderDisplayName(currentShader)}
            </div>
          </div>
        </div>
      )}

      {/* Premium Badge */}
      {premiumMode && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          PREMIUM
        </div>
      )}
    </div>
  );
};

// Utility function for debouncing
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default BackgroundStudio;