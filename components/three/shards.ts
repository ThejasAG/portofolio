/**
 * Procedural geometry for the hero scene.
 *
 * Everything here is generated in code — no .glb, no textures, no external
 * downloads. Shapes are derived from a seeded PRNG so the scene is identical
 * on every load and between server and client.
 */
import * as THREE from "three";

/** Mulberry32 — small, fast, deterministic. Same seed, same scene, always. */
export function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Shard = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  /** Per-shard drift speed, so the cluster never moves as one rigid block. */
  speed: number;
};

/**
 * A loose spiral of shards down the scroll axis. Radius widens with depth so
 * the camera flies through a widening corridor rather than a uniform tube.
 */
export function buildShards(count: number, seed = 7): Shard[] {
  const r = rng(seed);
  const out: Shard[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 8 + r() * 0.9;
    // Minimum radius keeps the corridor hollow: shards ring the viewport
    // edges instead of drifting across the hero type in the centre.
    const radius = 5.4 + t * 4.2 + r() * 1.8;
    out.push({
      position: [
        Math.cos(angle) * radius,
        (r() - 0.5) * 9,
        -t * 46 - r() * 2.5,
      ],
      rotation: [r() * Math.PI, r() * Math.PI, r() * Math.PI],
      scale: 0.45 + r() * 1.25,
      speed: 0.12 + r() * 0.35,
    });
  }
  return out;
}

/**
 * An angular ice/glass shard: an icosahedron pushed off-sphere per-vertex and
 * flat-shaded, so it catches light in facets instead of reading as a ball.
 */
export function shardGeometry(seed = 3): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(1, 1);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const r = rng(seed);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    v.multiplyScalar(0.62 + r() * 0.72);
    // Flatten one axis so shards read as slabs rather than lumps.
    v.z *= 0.55;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}
