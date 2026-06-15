import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref">;

/**
 * Animated WebGL field of dots that ripple on two sine waves — a calm,
 * "operational grid" background texture. Renders nothing on the server (the
 * Three.js scene is built in an effect) and is decorative, so it is
 * `pointer-events-none` and `aria-hidden`.
 *
 * Theme + motion aware:
 *  - dot color is tinted from the brand palette per theme (read via the
 *    project's class-based `useTheme`, NOT next-themes);
 *  - honours `prefers-reduced-motion` by rendering a single static frame
 *    instead of running the animation loop.
 *
 * It positions itself `fixed inset-0` by default; pass `className="absolute"`
 * to scope it to a `relative`/`overflow-hidden` section instead.
 */
export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent — the page background shows through

    container.appendChild(renderer.domElement);

    // Brand-tinted dots (normalized 0–1 RGB, used via vertexColors):
    //  - dark theme  → soft mint, reads quietly on the deep-teal background;
    //  - light theme → deep teal, a faint texture on the off-white background.
    const dot: [number, number, number] =
      theme === "dark" ? [0.62, 0.81, 0.71] : [0.05, 0.18, 0.16];

    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, 0, z); // y is animated
        colors.push(dot[0], dot[1], dot[2]);
      }
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId = 0;

    const renderFrame = () => {
      const positionAttribute = geometry.attributes.position;
      const array = positionAttribute.array as Float32Array;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;
          array[index + 1] =
            Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const animate = () => {
      renderFrame();
      count += 0.1;
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (prefersReduced) renderFrame(); // keep the static frame correct on resize
    };

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.addEventListener("resize", handleResize);

    // Respect reduced-motion: a single static ripple snapshot, no rAF loop.
    if (prefersReduced) {
      renderFrame();
    } else {
      animate();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId) cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-[1]", className)}
      {...props}
    />
  );
}
