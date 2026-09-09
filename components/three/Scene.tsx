"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { buildShards, shardGeometry } from "./shards";

/**
 * Scroll progress as a ref, not state: the camera reads it every frame and
 * re-rendering React 60 times a second would defeat the point.
 */
function useScrollRef() {
  const p = useRef(0);
  useFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    // Only the first two viewports drive the flight; after that it settles.
    const target = max > 0 ? Math.min(window.scrollY / (window.innerHeight * 2), 1) : 0;
    // Critically damped follow, so the camera eases instead of snapping.
    p.current += (target - p.current) * 0.08;
  });
  return p;
}

function Shards({ count, quality }: { count: number; quality: "high" | "low" }) {
  const scroll = useScrollRef();
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(() => buildShards(count), [count]);
  const geo = useMemo(() => shardGeometry(), []);

  useFrame((state, delta) => {
    const p = scroll.current;
    // Camera comes from frame state, not useThree(): the React compiler
    // (correctly) refuses mutation of a value captured during render.
    const camera = state.camera;
    // Fly the camera down the corridor the shards spiral through.
    camera.position.z = 6 - p * 34;
    camera.position.x = Math.sin(p * Math.PI * 1.5) * 1.8;
    camera.position.y = Math.cos(p * Math.PI * 1.2) * 0.9;
    camera.lookAt(0, 0, camera.position.z - 8);

    if (!group.current) return;
    // Per-shard drift: independent speeds keep the field alive while still.
    group.current.children.forEach((c, i) => {
      const s = shards[i];
      if (!s) return;
      c.rotation.x += delta * s.speed * 0.28;
      c.rotation.y += delta * s.speed * 0.2;
    });
  });

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh
          key={i}
          geometry={geo}
          position={s.position}
          rotation={s.rotation}
          scale={s.scale}
        >
          {quality === "high" ? (
            // Transmission gives real refraction — the wet-glass read.
            <MeshTransmissionMaterial
              samples={4}
              resolution={256}
              thickness={0.35}
              roughness={0.08}
              anisotropy={0.3}
              chromaticAberration={0.12}
              distortion={0.2}
              distortionScale={0.4}
              temporalDistortion={0.1}
              ior={1.44}
              color="#ffffff"
            />
          ) : (
            // Cheap stand-in: still glassy, no render-target per object.
            <meshPhysicalMaterial
              color="#dfe9f2"
              roughness={0.12}
              metalness={0.1}
              transmission={0.65}
              thickness={0.6}
              ior={1.4}
              transparent
              opacity={0.82}
            />
          )}
        </mesh>
      ))}
    </group>
  );
}

export default function Scene({
  quality = "high",
}: {
  quality?: "high" | "low";
}) {
  // Fewer objects on weak hardware; transmission is the expensive part.
  const count = quality === "high" ? 26 : 14;

  return (
    <Canvas
      // alpha:true so the hero's own background and text remain visible
      // through the scene rather than being painted over.
      gl={{ alpha: true, antialias: quality === "high", powerPreference: "high-performance" }}
      // Cap DPR — retina at 3x with transmission is the usual frame killer.
      dpr={quality === "high" ? [1, 1.7] : [1, 1]}
      camera={{ position: [0, 0, 6], fov: 42, near: 0.1, far: 120 }}
      frameloop="always"
    >
      {/* Fog tint matches the light page ground, so distant shards fade
          into the background instead of silhouetting as black debris. */}
      <fog attach="fog" args={["#f6f5f3", 16, 62]} />

      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 5]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[-5, -2, 2]} intensity={0.8} color="#cfe0ff" />

      {/* Environment built from Lightformers, not a preset: drei's presets
          fetch an HDRI from a GitHub CDN at runtime, which would put a third
          party in the critical path and break offline. Transmission still
          needs something to refract, so we give it real emissive geometry. */}
      <Environment resolution={256}>
        <Lightformer intensity={7} position={[0, 4, -6]} scale={[12, 6, 1]} color="#ffffff" />
        <Lightformer intensity={3} position={[-6, 1, -2]} scale={[6, 8, 1]} color="#bcd4ff" />
        <Lightformer intensity={3} position={[6, -2, -3]} scale={[6, 8, 1]} color="#ffd9c2" />
        <Lightformer intensity={1.8} position={[0, -5, 2]} scale={[12, 4, 1]} color="#7fa8ff" />
      </Environment>

      {/* Transmission refracts whatever is BEHIND the mesh. With an alpha
          buffer and empty space back there, the glass samples nothing and
          resolves to black. This large unlit plane, tinted to the page
          ground, is what the shards actually transmit. */}
      <mesh position={[0, 0, -70]} raycast={() => null}>
        <planeGeometry args={[220, 140]} />
        <meshBasicMaterial color="#f6f5f3" toneMapped={false} />
      </mesh>

      <Shards count={count} quality={quality} />
    </Canvas>
  );
}
