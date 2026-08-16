import React, { useEffect, useRef } from 'react';

interface WebGLFluidShaderProps {
  interactive?: boolean;
}

export const WebGLFluidShader: React.FC<WebGLFluidShaderProps> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    let animationFrameId: number;
    let isVisible = true;

    // Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader with glowing fluid motion & mouse interaction
    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        vec2 mouse = u_mouse / u_resolution;

        // Flowing fluid sine wave motion
        float motion = sin(uv.x * 2.8 + u_time * 0.45) * 0.12;
        motion += cos(uv.y * 2.2 + u_time * 0.65) * 0.12;
        motion += sin((uv.x + uv.y) * 3.5 + u_time * 0.3) * 0.08;

        // Colors for vibrant neon lime theme (Arte 3D Studio)
        vec3 colorNavy = vec3(0.02, 0.045, 0.02); // #050B05
        vec3 colorGreen = vec3(0.12, 0.45, 0.02);  // #1F7305
        vec3 colorLime = vec3(0.46, 1.0, 0.01);   // #76FF03
        vec3 colorDeep = vec3(0.01, 0.025, 0.01);

        // Interactive mouse glow
        float dist = distance(uv, mouse);
        float glow = smoothstep(0.45, 0.0, dist) * 0.4;

        // Wave blend factor
        float mixFactor = smoothstep(0.15, 0.85, uv.y + motion * 1.2);
        vec3 base = mix(colorNavy, colorGreen * 0.4, mixFactor);
        base = mix(base, colorDeep, (1.0 - uv.x) * 0.3);

        // Ambient cyber shimmer
        float shimmer = sin(uv.x * 12.0 + uv.y * 6.0 + u_time * 0.8) * 0.04 + 0.04;
        vec3 finalColor = mix(base, colorLime * 0.5, shimmer);
        finalColor += glow * colorLime;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(type: number, source: string): WebGLShader | null {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(program);

    // Quad geometry buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    const mousePos = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      targetX: canvas.width / 2,
      targetY: canvas.height / 2
    };

    function handleMouseMove(e: MouseEvent) {
      if (!canvas || !interactive) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = 1.0 - (e.clientY - rect.top) / rect.height;
        mousePos.targetX = nx * canvas.width;
        mousePos.targetY = ny * canvas.height;
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(canvas);
    resize();

    // Visibility Observer to pause loop when off-screen
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let startTime = performance.now();

    function render(currentTime: number) {
      if (!gl || !canvas) return;

      if (isVisible) {
        const elapsed = (currentTime - startTime) * 0.001;

        // Smooth mouse damping
        mousePos.x += (mousePos.targetX - mousePos.x) * 0.08;
        mousePos.y += (mousePos.targetY - mousePos.y) * 0.08;

        if (uTime) gl.uniform1f(uTime, elapsed);
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        if (uMouse) gl.uniform2f(uMouse, mousePos.x, mousePos.y);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buffer);
      }
    };
  }, [interactive]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-45 mix-blend-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        id="kinetic-shader-canvas"
        className="w-full h-full block"
      />
    </div>
  );
};
