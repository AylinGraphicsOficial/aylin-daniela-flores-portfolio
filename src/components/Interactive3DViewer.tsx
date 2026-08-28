import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCw,
  Eye,
  Sparkles,
  Box,
  Compass,
  Layers,
  ShieldCheck,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Loader2,
  Sliders,
} from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { Language } from '../types';
import { translations } from '../data/portfolioData';
import { SpecularButton } from './SpecularButton';
import {
  getStoredLab3D,
  subscribeToPortfolioChanges,
  Lab3DData,
  Lab3DModelItem,
} from '../utils/portfolioStorage';

interface Interactive3DViewerProps {
  lang: Language;
}

export const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({ lang }) => {
  const t = translations[lang];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [labConfig, setLabConfig] = useState<Lab3DData>(getStoredLab3D);
  const [selectedModelId, setSelectedModelId] = useState<string>(() => {
    const stored = getStoredLab3D();
    return stored.defaultModelId || stored.models?.[0]?.id || 'torre-castillo';
  });

  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(() => {
    const stored = getStoredLab3D();
    return stored.autoRotate !== false;
  });
  const [lightingColor, setLightingColor] = useState<string>(() => {
    const stored = getStoredLab3D();
    return stored.lightingColor || '#76FF03';
  });

  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [modelStats, setModelStats] = useState<{ name: string; stats: string; polyCount?: string }>({
    name: 'Torre Castillo 3D',
    stats: 'Geometría GLB • Materiales PBR',
  });

  // Three.js Scene References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group>(new THREE.Group());
  const loadRequestIdRef = useRef<number>(0);

  // Lights References
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const accentPointLightRef = useRef<THREE.PointLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Subscribe to storage updates from Dashboard
  useEffect(() => {
    const handleUpdate = () => {
      const updated = getStoredLab3D();
      setLabConfig(updated);
      if (updated.lightingColor) setLightingColor(updated.lightingColor);
    };
    handleUpdate();
    const unsubscribe = subscribeToPortfolioChanges(handleUpdate);
    return () => unsubscribe();
  }, []);

  // Helper to completely clean up model group
  const clearModelGroup = () => {
    if (!modelGroupRef.current) return;
    while (modelGroupRef.current.children.length > 0) {
      const obj = modelGroupRef.current.children[0];
      modelGroupRef.current.remove(obj);
      obj.traverse((child: any) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m: any) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    }
  };

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Add dedicated model container group
    scene.add(modelGroupRef.current);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4, 2.8, 5.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.8;
    controls.maxDistance = 25;
    controls.minDistance = 1.2;
    controlsRef.current = controls;

    // 1. Ambient Light (Soft base fill)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // 2. Directional Key Light (Warm highlight)
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(6, 8, 6);
    scene.add(dirLight1);
    keyLightRef.current = dirLight1;

    // 3. Directional Fill Light (Opposite soft cool fill)
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight2.position.set(-6, 3, -6);
    scene.add(dirLight2);
    fillLightRef.current = dirLight2;

    // 4. Accent Dynamic PointLight
    const pointLight = new THREE.PointLight(new THREE.Color(lightingColor), 4.5, 30);
    pointLight.position.set(0, 4, 3.5);
    scene.add(pointLight);
    accentPointLightRef.current = pointLight;

    // 5. Rim / Silhouette PointLight
    const rimLight = new THREE.PointLight(0x00e5ff, 2.5, 25);
    rimLight.position.set(-3, -2, -4);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Dark Cyber Grid Ground Plane
    const gridHelper = new THREE.GridHelper(10, 20, new THREE.Color('#38B000'), new THREE.Color('#1A301A'));
    gridHelper.position.y = -1.65;
    scene.add(gridHelper);

    // Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      clearModelGroup();
      renderer.dispose();
    };
  }, []);

  // Update Auto-Rotate speed & toggle
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update Studio Lights & Wireframe colors in real-time when lightingColor changes
  useEffect(() => {
    const col = new THREE.Color(lightingColor);

    if (accentPointLightRef.current) {
      accentPointLightRef.current.color.copy(col);
    }
    if (keyLightRef.current) {
      keyLightRef.current.color.copy(col).lerp(new THREE.Color(0xffffff), 0.45);
    }
    if (ambientLightRef.current) {
      ambientLightRef.current.color.copy(col).lerp(new THREE.Color(0xffffff), 0.7);
    }
    if (rimLightRef.current) {
      const hsl = { h: 0, s: 0, l: 0 };
      col.getHSL(hsl);
      const compCol = new THREE.Color().setHSL((hsl.h + 0.5) % 1, 0.9, 0.6);
      rimLightRef.current.color.copy(compCol);
    }

    // Update models currently rendered
    if (modelGroupRef.current) {
      modelGroupRef.current.traverse((child: any) => {
        if (child.isMesh) {
          if (isWireframe && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m: any) => m.color.copy(col));
            } else {
              child.material.color.copy(col);
            }
          } else if (child.userData.isProcedural && child.material) {
            child.material.color.copy(col);
            if (child.material.emissive) {
              child.material.emissive.copy(col);
            }
          }
        }
      });
    }
  }, [lightingColor, isWireframe]);

  // Toggle Wireframe Mode with proper material preservation and bright neon wireframe
  useEffect(() => {
    if (!modelGroupRef.current) return;
    const col = new THREE.Color(lightingColor);

    modelGroupRef.current.traverse((child: any) => {
      if (child.isMesh) {
        if (isWireframe) {
          // Save original material if not saved
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material;
          }
          // Apply bright neon wireframe
          child.material = new THREE.MeshBasicMaterial({
            color: col,
            wireframe: true,
            transparent: true,
            opacity: 0.95,
          });
        } else {
          // Restore original materials
          if (child.userData.originalMaterial) {
            child.material = child.userData.originalMaterial;
          }
        }
      }
    });
  }, [isWireframe, lightingColor]);

  // Load Selected 3D Model with Cancellation token to prevent superposition
  useEffect(() => {
    if (!modelGroupRef.current) return;
    const currentReqId = ++loadRequestIdRef.current;

    // Immediately clean up previous model
    clearModelGroup();

    const availableModels = labConfig.models || [];
    const targetModel =
      availableModels.find((m) => m.id === selectedModelId) || availableModels[0];

    if (!targetModel) return;

    if (targetModel.type === 'glb' && targetModel.url) {
      setIsLoadingModel(true);
      const loader = new GLTFLoader();

      loader.load(
        targetModel.url,
        (gltf) => {
          // Discard if user clicked another model in the meantime
          if (currentReqId !== loadRequestIdRef.current) return;

          clearModelGroup();
          const modelGroup = gltf.scene;

          // Compute Bounding Box to center & auto-scale
          const box = new THREE.Box3().setFromObject(modelGroup);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          // Center geometry at origin
          modelGroup.position.x += -center.x;
          modelGroup.position.y += -center.y;
          modelGroup.position.z += -center.z;

          // Auto scale so max dimension is perfectly framed (~3.2 units)
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = 3.2 / maxDim;
            modelGroup.scale.set(scale, scale, scale);
          }

          let totalVertices = 0;
          let totalTriangles = 0;
          const col = new THREE.Color(lightingColor);

          modelGroup.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              if (child.geometry) {
                totalVertices += child.geometry.attributes.position?.count || 0;
                if (child.geometry.index) {
                  totalTriangles += child.geometry.index.count / 3;
                } else {
                  totalTriangles += (child.geometry.attributes.position?.count || 0) / 3;
                }
              }

              // Save original material for clean wireframe toggle
              child.userData.originalMaterial = child.material;

              if (isWireframe) {
                child.material = new THREE.MeshBasicMaterial({
                  color: col,
                  wireframe: true,
                  transparent: true,
                  opacity: 0.95,
                });
              }
            }
          });

          modelGroupRef.current.add(modelGroup);
          setIsLoadingModel(false);

          setModelStats({
            name: targetModel.name,
            stats: `${Math.round(totalVertices).toLocaleString()} Vértices • ${Math.round(totalTriangles).toLocaleString()} Caras • Archivo GLB 3D`,
            polyCount: `${Math.round(totalTriangles / 1000)}k Poly`,
          });

          // Reset Camera view
          if (cameraRef.current && controlsRef.current) {
            cameraRef.current.position.set(4, 2.8, 5.2);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
        },
        undefined,
        (err) => {
          if (currentReqId !== loadRequestIdRef.current) return;
          console.warn('Error loading GLB, falling back to procedural:', err);
          setIsLoadingModel(false);
          buildProceduralModel(targetModel.proceduralKey || 'retroCar');
        }
      );
    } else {
      buildProceduralModel(targetModel.proceduralKey || 'retroCar');
    }
  }, [selectedModelId, labConfig.models]);

  // Procedural 3D Mesh Generator with isolated clean group
  const buildProceduralModel = (key: string) => {
    clearModelGroup();
    const group = new THREE.Group();
    const col = new THREE.Color(lightingColor);

    const mat = new THREE.MeshStandardMaterial({
      color: col,
      roughness: 0.25,
      metalness: 0.85,
      emissive: col,
      emissiveIntensity: 0.15,
    });

    if (key === 'retroCar') {
      const bodyGeo = new THREE.BoxGeometry(3.2, 0.9, 1.6);
      const cabinGeo = new THREE.BoxGeometry(1.6, 0.8, 1.4);
      cabinGeo.translate(-0.2, 0.8, 0);

      const bodyMesh = new THREE.Mesh(bodyGeo, mat);
      const cabinMesh = new THREE.Mesh(cabinGeo, mat);
      bodyMesh.userData.isProcedural = true;
      cabinMesh.userData.isProcedural = true;
      bodyMesh.userData.originalMaterial = mat;
      cabinMesh.userData.originalMaterial = mat;
      group.add(bodyMesh, cabinMesh);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 16);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

      [
        [-1.0, -0.4, 0.9],
        [1.0, -0.4, 0.9],
        [-1.0, -0.4, -0.9],
        [1.0, -0.4, -0.9],
      ].forEach(([x, y, z]) => {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.position.set(x, y, z);
        w.userData.originalMaterial = wheelMat;
        group.add(w);
      });

      setModelStats({
        name: 'Retro Mini Chassis',
        stats: '2,400 Vértices • Procedural Three.js Shading',
      });
    } else if (key === 'hyperCube') {
      const geo1 = new THREE.BoxGeometry(2.2, 2.2, 2.2);
      const geo2 = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const m1 = new THREE.Mesh(geo1, mat);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        wireframe: true,
        emissive: 0x00e5ff,
        emissiveIntensity: 0.4,
      });
      const m2 = new THREE.Mesh(geo2, innerMat);
      m1.userData.isProcedural = true;
      m2.userData.isProcedural = true;
      m1.userData.originalMaterial = mat;
      m2.userData.originalMaterial = innerMat;
      group.add(m1, m2);
      setModelStats({
        name: 'Tesseract 4D Matrix',
        stats: '16 Vértices • Geometría Isométrica Dual',
      });
    } else if (key === 'brandPoly') {
      const geo = new THREE.IcosahedronGeometry(1.7, 1);
      const m = new THREE.Mesh(geo, mat);
      m.userData.isProcedural = true;
      m.userData.originalMaterial = mat;
      group.add(m);
      setModelStats({
        name: 'Kinetic Polyhedron',
        stats: '80 Caras • Simetría Icosaédrica PBR',
      });
    } else {
      // Tactile Hand
      const palmGeo = new THREE.BoxGeometry(1.6, 1.8, 0.4);
      const palm = new THREE.Mesh(palmGeo, mat);
      palm.userData.isProcedural = true;
      palm.userData.originalMaterial = mat;
      group.add(palm);

      [-0.6, -0.2, 0.2, 0.6].forEach((x, i) => {
        const fingerGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.2 + i * 0.1, 12);
        fingerGeo.translate(0, 0.6, 0);
        const finger = new THREE.Mesh(fingerGeo, mat);
        finger.position.set(x, 0.9, 0);
        finger.userData.isProcedural = true;
        finger.userData.originalMaterial = mat;
        group.add(finger);
      });

      setModelStats({
        name: 'Cybernetic Tactile Hand',
        stats: '36 Nodos Articulados • Texturizado Cinético',
      });
    }

    if (isWireframe) {
      group.traverse((child: any) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial({
            color: col,
            wireframe: true,
            transparent: true,
            opacity: 0.95,
          });
        }
      });
    }

    modelGroupRef.current.add(group);
  };

  const handleResetCamera = () => {
    playClickSound();
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(4, 2.8, 5.2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoom = (delta: number) => {
    playClickSound();
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(delta);
    }
  };

  const modelList = labConfig.models || [];

  return (
    <section
      id="viewer3d"
      className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
        <div>
          <div className="section-tag-pill mb-3">
            <span className="badge-dot animate-pulse" />
            <span>REAL-TIME THREE.JS / GLB ENGINE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
            {lang === 'es'
              ? labConfig.titleEs || t.viewer3d.title
              : labConfig.titleEn || t.viewer3d.title}
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl">
            {lang === 'es'
              ? labConfig.subtitleEs || t.viewer3d.subtitle
              : labConfig.subtitleEn || t.viewer3d.subtitle}
          </p>
        </div>

        {/* Dynamic Model Switcher Pills */}
        <div className="flex items-center flex-wrap gap-2">
          {modelList.map((item) => {
            const isSelected = selectedModelId === item.id;
            return (
              <SpecularButton
                key={item.id}
                onClick={() => {
                  playClickSound();
                  setSelectedModelId(item.id);
                }}
                variant={isSelected ? 'solid-lime' : 'glass'}
                size="sm"
                radius={10}
                className="text-[11px] font-bold whitespace-nowrap px-3.5 py-1.5 flex items-center space-x-1.5"
              >
                <Box className="w-3.5 h-3.5" />
                <span>{item.name}</span>
                {item.type === 'glb' && (
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-black/40 rounded ml-1 text-white">
                    GLB
                  </span>
                )}
              </SpecularButton>
            );
          })}
        </div>
      </div>

      {/* Main 3D Stage & Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 3D Viewport Stage (8 Cols) */}
        <div
          ref={containerRef}
          className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[520px] rounded-3xl overflow-hidden bg-[#030703] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group select-none"
        >
          {/* Subtle Ambient Vignette glowing with selected lightingColor */}
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-all duration-700"
            style={{
              boxShadow: `inset 0 0 100px rgba(0,0,0,0.95), inset 0 0 45px ${lightingColor}30`,
            }}
          />

          {/* Three.js Canvas */}
          <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

          {/* Loading Overlay */}
          {isLoadingModel && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm space-y-3">
              <Loader2 className="w-8 h-8 text-[#76FF03] animate-spin" />
              <span className="text-xs font-mono font-bold text-white tracking-wider">
                Cargando Modelo 3D GLB en Tiempo Real...
              </span>
            </div>
          )}

          {/* Top Floating Badge */}
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: lightingColor }}
            />
            <span className="text-[11px] font-mono font-bold text-white tracking-wide">
              {modelStats.name}
            </span>
          </div>

          {/* Bottom Interactive Hint */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none">
            <span className="text-[11px] font-mono text-gray-400 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              🖱️ {lang === 'es' ? 'Arrastra para rotar 360° • Click derecho para mover • Scroll para zoom' : 'Drag to rotate 360° • Right click to pan • Scroll to zoom'}
            </span>

            <div className="flex items-center space-x-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => handleZoom(0.85)}
                className="p-2 rounded-xl bg-black/70 hover:bg-black text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Acercar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(1.15)}
                className="p-2 rounded-xl bg-black/70 hover:bg-black text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Alejar"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleResetCamera}
                className="p-2 rounded-xl bg-black/70 hover:bg-black text-gray-300 hover:text-[#76FF03] border border-white/10 transition-colors cursor-pointer"
                title="Centrar Vista"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Tools & Shading Inspector Panel (4 Cols) */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-[#081208] border border-white/15 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#76FF03] uppercase block mb-1">
                INSPECTOR DE TOPOLOGÍA 3D
              </span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                {modelStats.name}
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-1 leading-relaxed">
                {modelStats.stats}
              </p>
            </div>

            {/* Shading & Wireframe Toggle */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-mono font-bold text-gray-300 uppercase block">
                Modo de Renderizado
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setIsWireframe(false);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    !isWireframe
                      ? 'bg-[#76FF03] text-black border-[#76FF03] shadow-[0_0_20px_rgba(118,255,3,0.4)]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Sólido PBR</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setIsWireframe(true);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    isWireframe
                      ? 'bg-[#76FF03] text-black border-[#76FF03] shadow-[0_0_20px_rgba(118,255,3,0.4)]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Wireframe</span>
                </button>
              </div>
            </div>

            {/* Auto-Rotation Toggle */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                  Rotación 360° Turntable
                </label>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setAutoRotate(!autoRotate);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                    autoRotate
                      ? 'bg-[#76FF03]/20 border-[#76FF03] text-[#76FF03]'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  {autoRotate ? 'Activa' : 'Pausada'}
                </button>
              </div>
            </div>

            {/* Lighting Color Selector */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase block">
                  Iluminación de Estudio
                </label>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: lightingColor }}
                />
              </div>
              <div className="flex items-center space-x-2">
                {[
                  { color: '#76FF03', name: 'Electric Lime' },
                  { color: '#00E5FF', name: 'Cyber Cyan' },
                  { color: '#FF007F', name: 'Neon Pink' },
                  { color: '#FFB700', name: 'Amber Gold' },
                  { color: '#FFFFFF', name: 'Pure Studio' },
                ].map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setLightingColor(item.color);
                    }}
                    title={item.name}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                      lightingColor === item.color
                        ? 'scale-125 border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]'
                        : 'border-transparent opacity-80 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Quality Verification Stamp */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#76FF03]/15 text-[#76FF03] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-white block">Motor Three.js WebGL 2.0</span>
              <span className="text-gray-400 font-mono">Renderizado en tiempo real a 60 FPS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Interactive3DViewer;
