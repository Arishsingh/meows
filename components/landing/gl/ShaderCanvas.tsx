"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

type UniformValue = number | number[];
type UniformMap = Record<string, { value: UniformValue }>;

/**
 * Full-bleed WebGL canvas that runs a single fragment shader. The vertex
 * shader is a fixed full-screen triangle. Caller supplies the fragment
 * source plus optional extra uniforms on top of the provided `uTime` and
 * `uResolution`.
 *
 * The canvas is marked `aria-hidden` — it is decorative and must not be
 * announced to screen readers. When `prefers-reduced-motion` is set the
 * shader renders once at t=0 and the RAF loop never starts, so the
 * surface remains visually complete but static.
 */
export function ShaderCanvas({
  fragment,
  uniforms,
}: {
  fragment: string;
  uniforms?: UniformMap;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      window.innerWidth < 768 ? 1 : 2
    );

    const renderer = new Renderer({ canvas, dpr, alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);
    const vertex = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        ...(uniforms ?? {}),
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      program.uniforms.uTime.value = (performance.now() - start) / 1000;
      renderer.render({ scene: mesh });
      if (!reduce) raf = requestAnimationFrame(tick);
    };

    if (reduce) {
      // Render a single static frame at t=0 so the canvas is never blank.
      program.uniforms.uTime.value = 0;
      renderer.render({ scene: mesh });
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [fragment, uniforms]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
