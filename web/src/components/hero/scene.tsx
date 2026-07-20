"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 * A drifting circuit-node network: glowing green points connected by  *
 * faint traces — the "circuit board" half of the club's leaf logo.    *
 * ------------------------------------------------------------------ */
function CircuitField({ count = 90 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, linePositions } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 5
        )
      );
    }
    const positions = new Float32Array(count * 3);
    pts.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });

    // connect each node to its nearest few neighbours -> circuit traces
    const segs: number[] = [];
    for (let i = 0; i < count; i++) {
      const dists = pts
        .map((p, j) => ({ j, d: pts[i].distanceTo(p) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const { j, d } of dists) {
        if (d < 3.2) {
          segs.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    return { positions, linePositions: new Float32Array(segs) };
  }, [count]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.copy(
        pointsRef.current?.rotation ?? linesRef.current.rotation
      );
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.12 + Math.sin(t) * 0.05;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#39e63a"
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#2ecc40"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

/* Floating logo plane with pointer parallax. */
function FloatingLogo() {
  const texture = useTexture("/logo/cretus-logo-transparent.png");
  const ref = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    const px = (state.pointer.x * viewport.width) / 28;
    const py = (state.pointer.y * viewport.height) / 28;
    ref.current.position.x += (px - ref.current.position.x) * 0.05;
    ref.current.position.y += (py - ref.current.position.y) * 0.05;
  });

  const aspect = 532 / 399;
  const h = 2.6;

  return (
    <group ref={ref}>
      <Float speed={2} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh>
          <planeGeometry args={[h * aspect, h]} />
          <meshBasicMaterial
            map={texture}
            transparent
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      // Explicit 100%/100% matters: R3F measures its container, and an
      // absolutely-positioned parent can measure 0x0 — which silently renders
      // an empty canvas with no error.
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      resize={{ scroll: false }}
      // shown if the browser can't create a WebGL context
      fallback={
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo/cretus-logo-transparent.png"
          alt="Cretus logo"
          style={{ width: "16rem", margin: "0 auto", opacity: 0.9 }}
        />
      }
    >
      <ambientLight intensity={0.6} />
      <Suspense fallback={null}>
        <FloatingLogo />
      </Suspense>
      {/* outside Suspense so the network still shows while the texture loads */}
      <CircuitField />
    </Canvas>
  );
}
