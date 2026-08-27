import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, Eye, Sparkles, Box, Compass, Layers, ShieldCheck } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { Language } from '../types';
import { translations } from '../data/portfolioData';
import { SpecularButton } from './SpecularButton';

interface Interactive3DViewerProps {
  lang: Language;
}

type ModelKey = 'retroCar' | 'cyberHand' | 'brandPoly' | 'hyperCube';

interface Vertex3D {
  x: number;
  y: number;
  z: number;
}

interface Edge3D {
  from: number;
  to: number;
}

interface Face3D {
  indices: number[];
  color?: string;
}

export const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({ lang }) => {
  const t = translations[lang];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentModel, setCurrentModel] = useState<ModelKey>('retroCar');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [lightingColor, setLightingColor] = useState<string>('#76FF03'); // lime default
  const [zoom, setZoom] = useState<number>(1.1);

  // Rotation state
  const rotRef = useRef({ x: 0.25, y: 0.5 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Generate 3D procedural geometries for rich inspection
  const getModelData = (key: ModelKey): { vertices: Vertex3D[]; edges: Edge3D[]; faces: Face3D[]; name: string; stats: string } => {
    if (key === 'retroCar') {
      // Stylized 3D Car Wireframe & Shaded Chassis
      const vertices: Vertex3D[] = [
        // Base / Lower body
        { x: -1.6, y: -0.4, z: -0.8 }, // 0 FL
        { x: 1.6, y: -0.4, z: -0.8 },  // 1 FR
        { x: 1.6, y: -0.4, z: 0.8 },   // 2 RR
        { x: -1.6, y: -0.4, z: 0.8 },  // 3 RL
        // Mid beltline
        { x: -1.5, y: 0.1, z: -0.85 }, // 4
        { x: 1.5, y: 0.1, z: -0.85 },  // 5
        { x: 1.5, y: 0.1, z: 0.85 },   // 6
        { x: -1.5, y: 0.1, z: 0.85 },  // 7
        // Hood & Trunk
        { x: -1.4, y: 0.25, z: -0.75 }, // 8
        { x: -0.5, y: 0.35, z: -0.75 }, // 9 Windshield base L
        { x: -0.5, y: 0.35, z: 0.75 },  // 10 Windshield base R
        { x: -1.4, y: 0.25, z: 0.75 },  // 11
        { x: 1.4, y: 0.2, z: -0.75 },   // 12 Trunk L
        { x: 0.7, y: 0.3, z: -0.75 },   // 13 Rear window base L
        { x: 0.7, y: 0.3, z: 0.75 },    // 14 Rear window base R
        { x: 1.4, y: 0.2, z: 0.75 },    // 15 Trunk R
        // Roof
        { x: -0.2, y: 0.85, z: -0.65 }, // 16 Roof FL
        { x: 0.5, y: 0.85, z: -0.65 },  // 17 Roof RL
        { x: 0.5, y: 0.85, z: 0.65 },   // 18 Roof RR
        { x: -0.2, y: 0.85, z: 0.65 },  // 19 Roof FR
        // Wheels
        { x: -1.0, y: -0.6, z: -0.9 }, // 20
        { x: 1.0, y: -0.6, z: -0.9 },  // 21
        { x: -1.0, y: -0.6, z: 0.9 },  // 22
        { x: 1.0, y: -0.6, z: 0.9 },   // 23
      ];

      const edges: Edge3D[] = [
        { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 0 },
        { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 4 },
        { from: 0, to: 4 }, { from: 1, to: 5 }, { from: 2, to: 6 }, { from: 3, to: 7 },
        { from: 8, to: 9 }, { from: 9, to: 10 }, { from: 10, to: 11 }, { from: 11, to: 8 },
        { from: 12, to: 13 }, { from: 13, to: 14 }, { from: 14, to: 15 }, { from: 15, to: 12 },
        { from: 9, to: 16 }, { from: 10, to: 19 }, { from: 13, to: 17 }, { from: 14, to: 18 },
        { from: 16, to: 17 }, { from: 17, to: 18 }, { from: 18, to: 19 }, { from: 19, to: 16 },
      ];

      const faces: Face3D[] = [
        { indices: [16, 17, 18, 19] }, // Roof
        { indices: [9, 16, 19, 10] },  // Windshield
        { indices: [17, 13, 14, 18] }, // Rear glass
        { indices: [8, 9, 10, 11] },   // Hood
        { indices: [13, 12, 15, 14] }, // Trunk
        { indices: [4, 5, 17, 16, 9, 8] }, // Side L
        { indices: [7, 6, 18, 19, 10, 11] }, // Side R
      ];

      return { vertices, edges, faces, name: 'Retro Mini Chassis', stats: '24 Vertices • 28 Structural Edges • 4-Wheel Axle Grid' };
    } else if (key === 'cyberHand') {
      // Articulated cybernetic hand wireframe
      const vertices: Vertex3D[] = [
        // Wrist
        { x: 0, y: -1.3, z: -0.2 }, { x: 0.5, y: -1.3, z: 0 }, { x: 0, y: -1.3, z: 0.2 }, { x: -0.5, y: -1.3, z: 0 },
        // Palm
        { x: -0.6, y: -0.4, z: 0 }, { x: 0.6, y: -0.4, z: 0 }, { x: 0.5, y: 0.3, z: 0.1 }, { x: -0.5, y: 0.3, z: 0.1 },
        // Thumb
        { x: -0.9, y: -0.1, z: 0.2 }, { x: -1.2, y: 0.2, z: 0.3 }, { x: -1.3, y: 0.6, z: 0.4 },
        // Index
        { x: -0.4, y: 0.7, z: 0.1 }, { x: -0.4, y: 1.1, z: 0.1 }, { x: -0.4, y: 1.4, z: 0.1 },
        // Middle
        { x: -0.1, y: 0.75, z: 0.05 }, { x: -0.1, y: 1.25, z: 0.05 }, { x: -0.1, y: 1.6, z: 0.05 },
        // Ring
        { x: 0.2, y: 0.7, z: 0 }, { x: 0.2, y: 1.15, z: 0 }, { x: 0.2, y: 1.45, z: 0 },
        // Pinky
        { x: 0.45, y: 0.6, z: -0.05 }, { x: 0.45, y: 0.95, z: -0.05 }, { x: 0.45, y: 1.25, z: -0.05 },
      ];

      const edges: Edge3D[] = [
        { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 0 },
        { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 4 },
        { from: 0, to: 4 }, { from: 1, to: 5 }, { from: 2, to: 6 }, { from: 3, to: 7 },
        // Thumb
        { from: 4, to: 8 }, { from: 8, to: 9 }, { from: 9, to: 10 },
        // Index
        { from: 7, to: 11 }, { from: 11, to: 12 }, { from: 12, to: 13 },
        // Middle
        { from: 7, to: 14 }, { from: 14, to: 15 }, { from: 15, to: 16 },
        // Ring
        { from: 6, to: 17 }, { from: 17, to: 18 }, { from: 18, to: 19 },
        // Pinky
        { from: 6, to: 20 }, { from: 20, to: 21 }, { from: 21, to: 22 },
      ];

      const faces: Face3D[] = [
        { indices: [4, 5, 6, 7] }, // Palm
        { indices: [0, 1, 5, 4] },
        { indices: [1, 2, 6, 5] },
        { indices: [2, 3, 7, 6] },
      ];

      return { vertices, edges, faces, name: 'Cybernetic Tactile Hand', stats: '23 Kinematic Nodes • 5 Digit Phalanges • Kinetic Articulation' };
    } else if (key === 'brandPoly') {
      // Icosahedron kinetic geometry
      const phi = (1 + Math.sqrt(5)) / 2;
      const s = 0.9;
      const rawVerts = [
        { x: -1, y: phi, z: 0 }, { x: 1, y: phi, z: 0 }, { x: -1, y: -phi, z: 0 }, { x: 1, y: -phi, z: 0 },
        { x: 0, y: -1, z: phi }, { x: 0, y: 1, z: phi }, { x: 0, y: -1, z: -phi }, { x: 0, y: 1, z: -phi },
        { x: phi, y: 0, z: -1 }, { x: phi, y: 0, z: 1 }, { x: -phi, y: 0, z: -1 }, { x: -phi, y: 0, z: 1 }
      ].map(v => ({ x: v.x * s, y: v.y * s, z: v.z * s }));

      const edges: Edge3D[] = [
        { from: 0, to: 11 }, { from: 0, to: 5 }, { from: 0, to: 1 }, { from: 0, to: 7 }, { from: 0, to: 10 },
        { from: 1, to: 5 }, { from: 5, to: 11 }, { from: 11, to: 10 }, { from: 10, to: 7 }, { from: 7, to: 1 },
        { from: 3, to: 9 }, { from: 3, to: 4 }, { from: 3, to: 2 }, { from: 3, to: 6 }, { from: 3, to: 8 },
        { from: 9, to: 4 }, { from: 4, to: 2 }, { from: 2, to: 6 }, { from: 6, to: 8 }, { from: 8, to: 9 },
        { from: 5, to: 9 }, { from: 5, to: 4 }, { from: 11, to: 4 }, { from: 11, to: 2 }, { from: 10, to: 2 },
        { from: 10, to: 6 }, { from: 7, to: 6 }, { from: 7, to: 8 }, { from: 1, to: 8 }, { from: 1, to: 9 }
      ];

      const faces: Face3D[] = [
        { indices: [0, 11, 5] }, { indices: [0, 5, 1] }, { indices: [0, 1, 7] }, { indices: [0, 7, 10] }, { indices: [0, 10, 11] },
        { indices: [1, 5, 9] }, { indices: [5, 11, 4] }, { indices: [11, 10, 2] }, { indices: [10, 7, 6] }, { indices: [7, 1, 8] },
        { indices: [3, 9, 4] }, { indices: [3, 4, 2] }, { indices: [3, 2, 6] }, { indices: [3, 6, 8] }, { indices: [3, 8, 9] },
        { indices: [4, 9, 5] }, { indices: [2, 4, 11] }, { indices: [6, 2, 10] }, { indices: [8, 6, 7] }, { indices: [9, 8, 1] }
      ];

      return { vertices: rawVerts, edges, faces, name: 'Kinetic Brand Icosahedron', stats: '12 Vertices • 30 Edges • 20 Triangular Facets' };
    } else {
      // Hypercube / Tesseract wireframe
      const s1 = 1.0;
      const s2 = 0.55;
      const vertices: Vertex3D[] = [
        // Outer box
        { x: -s1, y: -s1, z: -s1 }, { x: s1, y: -s1, z: -s1 }, { x: s1, y: s1, z: -s1 }, { x: -s1, y: s1, z: -s1 },
        { x: -s1, y: -s1, z: s1 }, { x: s1, y: -s1, z: s1 }, { x: s1, y: s1, z: s1 }, { x: -s1, y: s1, z: s1 },
        // Inner box
        { x: -s2, y: -s2, z: -s2 }, { x: s2, y: -s2, z: -s2 }, { x: s2, y: s2, z: -s2 }, { x: -s2, y: s2, z: -s2 },
        { x: -s2, y: -s2, z: s2 }, { x: s2, y: -s2, z: s2 }, { x: s2, y: s2, z: s2 }, { x: -s2, y: s2, z: s2 },
      ];

      const edges: Edge3D[] = [
        // Outer box
        { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 0 },
        { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 4 },
        { from: 0, to: 4 }, { from: 1, to: 5 }, { from: 2, to: 6 }, { from: 3, to: 7 },
        // Inner box
        { from: 8, to: 9 }, { from: 9, to: 10 }, { from: 10, to: 11 }, { from: 11, to: 8 },
        { from: 12, to: 13 }, { from: 13, to: 14 }, { from: 14, to: 15 }, { from: 15, to: 12 },
        { from: 8, to: 12 }, { from: 9, to: 13 }, { from: 10, to: 14 }, { from: 11, to: 15 },
        // Connecting struts
        { from: 0, to: 8 }, { from: 1, to: 9 }, { from: 2, to: 10 }, { from: 3, to: 11 },
        { from: 4, to: 12 }, { from: 5, to: 13 }, { from: 6, to: 14 }, { from: 7, to: 15 },
      ];

      const faces: Face3D[] = [
        { indices: [0, 1, 2, 3] },
        { indices: [4, 5, 6, 7] },
        { indices: [0, 1, 5, 4] },
        { indices: [2, 3, 7, 6] },
      ];

      return { vertices, edges, faces, name: '4D Tesseract Geometry Matrix', stats: '16 Vertices • 32 Edges • Multi-dimensional Projection' };
    }
  };

  const activeModel = getModelData(currentModel);

  // 3D Rendering Loop on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const project = (v: Vertex3D, width: number, height: number, rx: number, ry: number) => {
      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = v.x * cosY + v.z * sinY;
      const z1 = -v.x * sinY + v.z * cosY;

      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = v.y * cosX - z1 * sinX;
      const z2 = v.y * sinX + z1 * cosX;

      // Perspective projection
      const cameraDist = 4.2;
      const scale = (Math.min(width, height) / 3.4) * zoom;
      const fov = cameraDist / (cameraDist + z2);

      return {
        x: width / 2 + x1 * scale * fov,
        y: height / 2 - y2 * scale * fov,
        z: z2,
        fov
      };
    };

    const render = () => {
      if (autoRotate && !isDraggingRef.current) {
        rotRef.current.y += 0.008;
        rotRef.current.x = 0.2 + Math.sin(Date.now() * 0.001) * 0.1;
      }

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Grid background in canvas for high-tech aesthetic
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const model = getModelData(currentModel);
      const projected = model.vertices.map(v => project(v, width, height, rotRef.current.x, rotRef.current.y));

      // Shaded faces (sorted by average depth Z)
      if (!isWireframe && model.faces.length > 0) {
        const sortedFaces = model.faces.map(face => {
          const avgZ = face.indices.reduce((sum, idx) => sum + (projected[idx]?.z || 0), 0) / face.indices.length;
          return { face, avgZ };
        }).sort((a, b) => b.avgZ - a.avgZ);

        sortedFaces.forEach(({ face }) => {
          if (face.indices.length < 3) return;
          ctx.beginPath();
          const first = projected[face.indices[0]];
          ctx.moveTo(first.x, first.y);
          for (let i = 1; i < face.indices.length; i++) {
            const pt = projected[face.indices[i]];
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.closePath();

          // Normal light shading
          const baseColor = lightingColor;
          ctx.fillStyle = baseColor === '#00E5FF'
            ? 'rgba(0, 229, 255, 0.12)'
            : baseColor === '#0052FF'
            ? 'rgba(0, 82, 255, 0.15)'
            : baseColor === '#5AFF9B'
            ? 'rgba(90, 255, 155, 0.12)'
            : 'rgba(255, 0, 180, 0.12)';
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }

      // Render Edges
      model.edges.forEach(edge => {
        const p1 = projected[edge.from];
        const p2 = projected[edge.to];
        if (!p1 || !p2) return;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        // Glow gradient line
        ctx.strokeStyle = lightingColor;
        ctx.lineWidth = isWireframe ? 1.8 : 1.2;
        ctx.shadowColor = lightingColor;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      });

      // Render Vertices / Nodes
      projected.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3 * pt.fov, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = lightingColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentModel, isWireframe, autoRotate, lightingColor, zoom]);

  // Mouse drag handlers for manual 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMouseRef.current.x;
    const deltaY = e.clientY - lastMouseRef.current.y;

    rotRef.current.y += deltaX * 0.008;
    rotRef.current.x += deltaY * 0.008;

    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.min(Math.max(0.6, prev - e.deltaY * 0.001), 2.2));
  };

  return (
    <section id="viewer3d" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="section-tag-pill mb-3">
            <span className="badge-dot animate-pulse" />
            <span>REAL-TIME WEBGL / TOPOLOGY</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
            {t.viewer3d.title}
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl">
            {t.viewer3d.subtitle}
          </p>
        </div>

        {/* Quick Model Switcher Pills */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: 'retroCar', label: 'Retro Mini 3D', icon: Box },
              { key: 'cyberHand', label: 'Tactile Hand', icon: Compass },
              { key: 'brandPoly', label: 'Polyhedron', icon: Layers },
              { key: 'hyperCube', label: 'Tesseract 4D', icon: Sparkles },
            ] as const
          ).map(item => {
            const Icon = item.icon;
            const isSelected = currentModel === item.key;
            return (
              <SpecularButton
                key={item.key}
                onClick={() => {
                  playClickSound();
                  setCurrentModel(item.key);
                }}
                variant={isSelected ? 'solid-lime' : 'glass'}
                size="sm"
                radius={10}
                className="text-xs font-bold"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </SpecularButton>
            );
          })}
        </div>
      </div>

      {/* Main 3D Canvas Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 glass-panel rounded-2xl p-4 md:p-6 relative overflow-hidden flex flex-col min-h-[420px] md:min-h-[500px]">
          {/* Top Stage Bar */}
          <div className="flex justify-between items-center z-10 mb-2">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 bg-white/10 border border-white/15 rounded text-[11px] font-mono text-[#76FF03]">
                {activeModel.name}
              </span>
              <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                FPS: 60 • Real-time Canvas
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <SpecularButton
                onClick={() => {
                  playClickSound();
                  setAutoRotate(!autoRotate);
                }}
                variant="glass"
                size="sm"
                radius={8}
                className={autoRotate ? 'border-[#76FF03] text-[#76FF03]' : 'text-gray-400 hover:text-white'}
                title="Toggle Auto Rotation"
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin text-[#76FF03]' : ''}`} style={{ animationDuration: '8s' }} />
                <span className="text-[10px] hidden sm:inline">Auto</span>
              </SpecularButton>

              <SpecularButton
                onClick={() => {
                  playClickSound();
                  setIsWireframe(!isWireframe);
                }}
                variant="glass"
                size="sm"
                radius={8}
                className={isWireframe ? 'border-[#76FF03] text-[#76FF03]' : 'text-gray-400 hover:text-white'}
                title="Toggle Wireframe / Shaded"
              >
                <Eye className="w-3.5 h-3.5 text-[#76FF03]" />
                <span className="text-[10px] hidden sm:inline">{isWireframe ? 'Wire' : 'Shade'}</span>
              </SpecularButton>
            </div>
          </div>

          {/* Canvas */}
          <div
            className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <canvas ref={canvasRef} className="w-full h-full block rounded-xl" />

            {/* Hint overlay */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-gray-400 pointer-events-none flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#76FF03]" />
              <span>{t.viewer3d.rotateHint}</span>
            </div>
          </div>
        </div>

        {/* Sidebar Controls & Technical Specs */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#76FF03] uppercase mb-1">
                GEOMETRIC ATTRIBUTES
              </h3>
              <p className="text-sm text-gray-300 font-mono">{activeModel.stats}</p>
            </div>

            {/* Lighting Theme Color Picker */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                {t.viewer3d.lightingTheme}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { color: '#76FF03', name: 'Electric Lime' },
                  { color: '#38B000', name: 'Forest Lime' },
                  { color: '#00E676', name: 'Emerald Neon' },
                  { color: '#FFD700', name: 'Cyber Gold' },
                ].map(item => (
                  <SpecularButton
                    key={item.color}
                    onClick={() => {
                      playClickSound();
                      setLightingColor(item.color);
                    }}
                    variant="glass"
                    size="sm"
                    radius={12}
                    className={`flex flex-col items-center justify-center p-3 ${
                      lightingColor === item.color
                        ? 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                        : 'border-white/10'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full mb-1 shadow-md"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}
                    />
                    <span className="text-[10px] text-gray-300 font-mono">{item.name.split(' ')[0]}</span>
                  </SpecularButton>
                ))}
              </div>
            </div>

            {/* Zoom Slider */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Scale / Magnification</span>
                <span className="font-mono text-[#76FF03]">{(zoom * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="2.0"
                step="0.05"
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#76FF03]"
              />
            </div>

            {/* Quality Metrics */}
            <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-400">
                <span>Production Shaders:</span>
                <span className="text-white font-mono">Octane / Redshift Ready</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Subdivision Level:</span>
                <span className="text-white font-mono">Catmull-Clark Level 2</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Topology Flow:</span>
                <span className="text-[#76FF03] font-mono flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% Quad Clean
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-[#38B000]/20 to-transparent border border-[#76FF03]/30">
            <h4 className="text-sm font-bold text-white mb-1">Need Custom 3D Assets?</h4>
            <p className="text-xs text-gray-300 mb-3">
              From hard-surface vehicles to stylized packaging and interactive web-ready 3D models.
            </p>
            <a
              href="#contact"
              onClick={playClickSound}
              className="inline-flex items-center text-xs font-bold text-[#76FF03] hover:text-white transition-colors"
            >
              Request 3D Modeling Quote &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
