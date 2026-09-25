"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Grid } from "@react-three/drei";
import * as THREE from "three";

/* ── Types ── */
export interface CityBuilding {
  id: string; name: string; height: number; width: number; depth: number;
  x: number; z: number; color?: string; language?: string; linesOfCode?: number; complexity?: string;
}

/* ── Language → color map ── */
const LANG_COLOR: Record<string, string> = {
  typescript: "#3178c6", javascript: "#f7df1e", python: "#3572a5",
  java: "#b07219", go: "#00add8", rust: "#dea584", cpp: "#f34b7d",
  css: "#563d7c", html: "#e34c26", default: "#8b5cf6",
};
function getBuildingColor(b: CityBuilding) {
  if (b.color) return b.color;
  const lang = (b.language ?? "").toLowerCase();
  return LANG_COLOR[lang] ?? LANG_COLOR.default;
}

/* ── Single building mesh ── */
function Building({ b, onClick, hovered, setHovered }: {
  b: CityBuilding; onClick: (b: CityBuilding) => void;
  hovered: string | null; setHovered: (id: string | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [riseY, setRiseY] = useState(-b.height / 2);
  const isHovered = hovered === b.id;
  const color = getBuildingColor(b);

  // Rise animation
  useFrame(() => {
    const target = b.height / 2;
    if (meshRef.current && riseY < target) {
      setRiseY((prev) => Math.min(prev + 0.15, target));
      meshRef.current.position.y = riseY;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[b.x, riseY, b.z]}
      onClick={() => onClick(b)}
      onPointerOver={() => setHovered(b.id)}
      onPointerOut={() => setHovered(null)}
      castShadow receiveShadow
    >
      <boxGeometry args={[b.width ?? 1, b.height, b.depth ?? 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isHovered ? 0.4 : 0.08}
        roughness={0.4}
        metalness={0.3}
      />
      {isHovered && (
        <Html center style={{ pointerEvents: "none" }}>
          <div style={{
            background: "rgba(5,8,22,0.95)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "6px 10px", fontSize: 11, color: "#fff",
            whiteSpace: "nowrap", backdropFilter: "blur(8px)",
          }}>
            <div style={{ fontWeight: 700, color }}>{b.name}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
              {b.language} · {b.linesOfCode ?? "—"} LOC
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

/* ── Camera animation to target ── */
function CameraAnimator({ target }: { target: [number, number, number] | null }) {
  const { camera } = useThree();
  useFrame(() => {
    if (!target) return;
    camera.position.x += (target[0] + 5 - camera.position.x) * 0.05;
    camera.position.y += (target[1] + 8 - camera.position.y) * 0.05;
    camera.position.z += (target[2] + 10 - camera.position.z) * 0.05;
  });
  return null;
}

/* ── Main scene ── */
export function CityScene({
  buildings, onBuildingClick, cameraTarget,
}: {
  buildings: CityBuilding[];
  onBuildingClick: (b: CityBuilding) => void;
  cameraTarget: [number, number, number] | null;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Canvas
      camera={{ position: [0, 20, 40], fov: 50 }}
      shadows
      style={{ background: "transparent" }}
    >
      {/* Sky */}
      <Stars radius={80} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      <fog attach="fog" args={["#050816", 60, 120]} />

      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[20, 30, 10]} intensity={1.2} castShadow
        shadow-mapSize={[1024, 1024]} color="#ffffff" />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#7c3aed" distance={40} />
      <pointLight position={[20, 5, 20]} intensity={0.2} color="#06b6d4" distance={30} />

      {/* Ground */}
      <Grid
        args={[80, 80]} cellSize={2} cellThickness={0.3}
        cellColor="#1e1b4b" sectionColor="#312e81"
        fadeDistance={60} fadeStrength={1}
        position={[0, 0, 0]}
      />

      {/* Buildings */}
      {buildings.map((b) => (
        <Building key={b.id} b={b} onClick={onBuildingClick} hovered={hovered} setHovered={setHovered} />
      ))}

      {/* Camera animation */}
      <CameraAnimator target={cameraTarget} />

      {/* Controls */}
      <OrbitControls
        makeDefault minDistance={5} maxDistance={80}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping dampingFactor={0.05}
      />
    </Canvas>
  );
}
